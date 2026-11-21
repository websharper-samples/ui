namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation
open WebSharper.UI.SiteCommon

/// A little framework for displaying samples on the site.
[<JavaScript>]
module Samples =

    type SampleKind =
        | App
        | Suite

    type PageTy =
        | [<EndPoint "/home">] Home
        | [<EndPoint "/samples">] Samples of SampleTy

    and SampleTy =
        | Dashboard
        | KanbanBoard
        | ExpenseTracker
        | DataExplorer
        | TodoApp
        | CommunityBoard
        | GameOfLife
        | OnboardingFlow
        | VarPlayground
        | CollectionsSuite
        | InputInspector
        | ChartLab
        | MiniSite of MiniSitePage

    and MiniSitePage =
        | [<EndPoint "/">] MiniHome
        | [<EndPoint "/history">] MiniHistory
        | [<EndPoint "/governance">] MiniGovernance
        | [<EndPoint "/team">] MiniTeam

    let SamplesDefault = Samples Dashboard

    type Visuals<'T> =
        {
            Desc : 'T -> Doc
            Main : 'T -> Doc
        }

    type Model = { Route : PageTy }

    type Sample =
        {
            Page : Var<PageTy> -> list<Sample> -> Doc
            IsThis : SampleTy -> bool
            Meta : Meta
            DefaultPage : SampleTy
            Kind : SampleKind
        }

    type Builder<'T> =
        {
            DefaultPage : 'T
            Wrap : 'T -> SampleTy
            Unwrap : SampleTy -> option<'T>
            Body : Var<'T> -> Doc
            Description : Var<'T> -> Doc
            Meta : Meta
            Kind : SampleKind
        }

    let Sidebar vPage (samples: list<Sample>) =
        let renderItem (sample: Sample) =
            let attrView =
                View.FromVar vPage
            let pred = function Samples smp -> sample.IsThis smp | _ -> false
            let activeAttr = Attr.ClassPred "active" (pred attrView.V)
            Doc.Link sample.Meta.Title
                [cls "list-group-item"; activeAttr]
                (fun () -> Var.Set vPage (Samples sample.DefaultPage))

        let group title kind =
            let items = samples |> List.filter (fun s -> s.Kind = kind)
            if items.IsEmpty then Doc.Empty
            else
                div [] [
                    h4 [] [ text title ]
                    List.map renderItem items |> Doc.Concat
                ]

        div [cls "col-md-3"; cls "samples-nav"] [
            group "Apps" SampleKind.App
            group "Suites" SampleKind.Suite
        ]

    let private kindLabel = function
        | SampleKind.App -> "App"
        | SampleKind.Suite -> "Suite"

    let RenderContent meta kind body description =
        div [cls "samples"; cls "col-md-9"] [
            div [cls "samples-head"] [
                span [cls "pill"] [ text (kindLabel kind) ]
                h1 [] [ text meta.Title ]
                p [cls "lead"] [ description ]
                p [cls "samples-source"] [
                    a
                        [ attr.href ("https://github.com/websharper-samples/ui/blob/main/src/" + meta.FileName) ]
                        [ text "View source" ]
                ]
            ]

            div [] [
                body
            ]
        ]

    let Render vPage meta kind body description samples =
        section [cls "block-small"] [
            div [cls "container"] [
                div [cls "row"] [
                    Sidebar vPage samples
                    RenderContent meta kind body description
                ]
            ]
        ]

    type Builder<'T> with

        member this.Id(id) = { this with Meta = { this.Meta with Title = id } }
        member this.FileName(n) = { this with Meta = { this.Meta with FileName = n } }
        member this.Keywords(k) = { this with Meta = { this.Meta with Keywords = k } }
        member this.Category(k) = { this with Kind = k }
        member this.Render(f) = { this with Body = fun x -> upcast f x }
        member this.RenderDescription(f) = { this with Description = fun x -> upcast f x }

        member this.Create() : Sample =
            {
                DefaultPage = this.Wrap this.DefaultPage
                IsThis = this.Unwrap >> Option.isSome
                Kind = this.Kind
                Page =
                    let mutable rendered = None
                    fun var samples ->
                        match rendered with
                        | Some doc -> doc
                        | None ->
                            let unwrap = function
                                | PageTy.Samples x -> defaultArg (this.Unwrap x) this.DefaultPage
                                | _ -> this.DefaultPage
                            let var' = Var.Lens var unwrap (fun _ x -> Samples (this.Wrap x))
                            let doc =
                                Render var this.Meta this.Kind
                                    (this.Body var') (this.Description var') samples
                            rendered <- Some doc
                            doc
                Meta = this.Meta
            }

    let Routed<'T> (wrap, def, unwrap) : Builder<'T> =
        {
            DefaultPage = def
            Wrap = wrap
            Unwrap = unwrap
            Body = fun _ -> Doc.Empty
            Description = fun _ -> Doc.Empty
            Kind = SampleKind.Suite
            Meta =
                {
                    FileName = "Unknown.fs"
                    Keywords = []
                    Title = "Unknown"
                }
        }

    let Build (page) =
        Routed<unit> ((fun () -> page), (), fun x -> if x = page then Some () else None)
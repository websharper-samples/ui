namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation
open WebSharper.UI.SiteCommon
module Router = WebSharper.Sitelets.Router

/// A little framework for displaying samples on the site.
[<JavaScript>]
module Samples =

    type SampleTy =
        | SimpleTextBox
        | InputTransform
        | InputTransformHtml
        | TodoList
        | PhoneExample
        | EditablePersonList
        | CheckBoxTest
        | Calculator
        | ContactFlow
        | AnimatedContactFlow
        | MessageBoard
        | BobsleighSite
        | RoutedBobsleighSite of BobsleighSitePage
        | AnimatedBobsleighSite
        | ObjectConstancy
        | MouseInfo
        | KeyboardInfo
        | SortableBarChart

    and BobsleighSitePage =
        | [<EndPoint "/">] BobsleighHome
        | [<EndPoint "/history">] BobsleighHistory
        | [<EndPoint "/governance">] BobsleighGovernance
        | [<EndPoint "/team">] BobsleighTeam

    type PageTy =
        | [<EndPoint "/home">] Home
        | [<EndPoint "/about">] About
        | [<EndPoint "/samples">] Samples of SampleTy

    let SamplesDefault = Samples SimpleTextBox

    // First, define the samples type, which specifies metadata and a rendering
    // function for each of the samples.
    // A Sample consists of a file name, identifier, list of keywords,
    // rendering function, and title.

    type Visuals<'T> =
        {
            Desc : 'T -> Doc
            Main : 'T -> Doc
        }

    type Model = { Route : PageTy }

    type Sample =
        {
            Page : Var<PageTy> -> list<Sample> -> Elt
            IsThis : SampleTy -> bool
            Meta : Meta
            DefaultPage : SampleTy
        }

    type Builder<'T> =
        {
            DefaultPage : 'T
            Wrap : 'T -> SampleTy
            Unwrap : SampleTy -> option<'T>
            Body : Var<'T> -> Doc
            Description : Var<'T> -> Doc
            Meta : Meta
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
                :> Doc

        divc "col-md-3" [
            h4 [] [text "Samples"]
            List.map renderItem samples |> Doc.Concat
        ]

    let RenderContent meta body description =
        divc "samples col-md-9" [
            div [] [
                divc "row" [
                    h1 [] [text meta.Title]
                    div [] [
                        p [] [ description ]
                        p [] [
                            a
                                [ attr.href ("https://github.com/intellifactory/websharper.ui.next.samples/blob/master/src/" + meta.FileName) ]
                                [text "View Source"]
                        ]
                    ]
                ]

                divc "row" [
                    p [] [ body ]
                ]
            ]
        ]

    let Render vPage meta body description samples =
        section [cls "block-small"] [
            divc "container" [
                divc "row" [
                    Sidebar vPage samples
                    RenderContent meta body description
                ]
            ]
        ]

    type Builder<'T> with

        member this.Id(id) = { this with Meta = { this.Meta with Title = id } }
        member this.FileName(n) = { this with Meta = { this.Meta with FileName = n } }
        member this.Keywords(k) = { this with Meta = { this.Meta with Keywords = k } }
        member this.Render(f) = { this with Body = fun x -> upcast f x }
        member this.RenderDescription(f) = { this with Description = fun x -> upcast f x }

        member this.Create() : Sample =
            {
                DefaultPage = this.Wrap this.DefaultPage
                IsThis = this.Unwrap >> Option.isSome
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
                            let doc = Render var this.Meta (this.Body var') (this.Description var') samples
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
            Meta =
                {
                    FileName = "Unknown.fs"
                    Keywords = []
                    Title = "Unknown"
                }
        }

    let Build (page) = Routed<unit> ((fun () -> page), (), fun x -> if x = page then Some () else None)

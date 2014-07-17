namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.UI.Next.Notation
open IntelliFactory.WebSharper.Html5

open System

// The Samples site, built using the WebSharper.UI.Next framework.

[<JavaScript>]
module Samples =

    // First, define the samples type, which specifies metadata and a rendering
    // function for each of the samples.
    // A Sample consists of a file name, identifier, list of keywords,
    // rendering function, and title.
    type Sample =
        private {
            FileName : string
            Id : string
            Keywords : list<string>
            Render : Doc
            RenderDescription: Doc
            Title : string
            Router : (string -> Doc option)
        }

    // ++ :: (a opt) -> a -> a
    // Takes two values. If the first is Some, then that's returned.
    // If not, then the second (default) argument is, instead.
    let private ( ++ ) a b =
        match a with
        | Some _ -> a
        | None -> b

    let private req name f =
        match f with
        | None -> failwith ("Required property not set: " + name)
        | Some r -> r

    let private defaultRoute filename render str =
        if filename = str then Some render else None

    type Builder =
        private {
            mutable BFileName : option<string>
            mutable BId : option<string>
            mutable BKeywords : list<string>
            mutable BRender : option<Doc>
            mutable BRenderDescription : option<Doc>
            mutable BTitle : option<string>
            mutable BRouter : option<string -> Doc option>
        }

        member b.Create() =
            let id = req "Id" (b.BId ++ b.BTitle)
            let title = defaultArg (b.BTitle ++ b.BId) "Sample"
            let filename = req "FileName" b.BFileName
            let renderFn = defaultArg b.BRender Doc.Empty
            {
                FileName = filename
                Id = id
                Keywords = b.BKeywords
                Render = renderFn
                RenderDescription = defaultArg b.BRenderDescription Doc.Empty
                Title = title
                Router = defaultArg b.BRouter (defaultRoute filename renderFn)
            }

        member b.FileName(x) = b.BFileName <- Some x; b
        member b.Id(x) = b.BId <- Some x; b
        member b.Keywords(x) = b.BKeywords <- x; b
        member b.Render(x) = b.BRender <- Some x; b
        member b.RenderDescription(x) = b.BRenderDescription <- Some x; b
        member b.Title(x) = b.BTitle <- Some x; b
        member b.Router(x) = b.BRouter <- Some x; b

    let Build () =
        {
            BId = None
            BFileName = None
            BKeywords = []
            BRender = None
            BRenderDescription = None
            BTitle = None
            BRouter = None
        }

    // The model type, consisting of the list of samples and the currently-active
    // sample.
    type SampleModel =
        private {
            ActiveSample : Sample option
            ToRender : Doc
            Samples : Sample list
        }

    let createModel active toRender samples =
        {
            ActiveSample = active
            ToRender = toRender
            Samples = samples
        }

    let getActive rvModel =
        (Var.Get rvModel).ActiveSample

    // Renders a link, based on the model and the link
    let renderLink view sample =
        // Attribute list: add the "active" class if selected
        let isActive m = Option.exists (fun a -> a.Id = sample.Id) m.ActiveSample
        let liAttr = Attr.DynamicClass "active" view isActive

        // Finally, put it all together to render the link
        elA "li" [liAttr] [
            //el "a" attributeList [ txt sample.Title ]
            Doc.Element "a" ["href" ==> ("#" + sample.FileName)] [txt sample.Title]
        ]

    let navBar rvModel =
        let view = View.FromVar rvModel

        elA "ul" [cls "nav"; cls "nav-pills"] [
            List.map (renderLink view) rvModel.Value.Samples |> Doc.Concat
        ]

    let mainContent (rvModel : Var<SampleModel>) =
        View.FromVar rvModel
        |> View.Map (fun model -> model.ToRender)
        |> Doc.EmbedView

    // Sidebar content, displaying a description of the current example
    let sideContent (rvModel : Var<SampleModel>) =
        let url s = "http://github.com/intellifactory/websharper.ui.next/blob/master/src/" + s.FileName
        let view = View.FromVar rvModel
        let btnAttrs sample = [
            cls "btn"
            cls "btn-primary"
            cls "btn-lg"
            "href" ==> url sample
        ]

        el "div" [
            View.Map (fun model ->
                match model.ActiveSample with
                | Some sample ->
                    [
                      el "p" [
                        sample.RenderDescription
                      ]
                      elA "a" (btnAttrs sample) [ txt "Source" ]
                    ] |> Doc.Concat
                | None -> Doc.Empty) view |> Doc.EmbedView
        ]

    // Given the a filename
    let rec initExample filename = function
        | [] -> None
        | (x :: xs) when x.FileName = filename -> Some x
        | (_ :: xs) -> initExample filename xs

    let defaultSample samples =
        if List.isEmpty samples then None else Some (List.head samples)

    let defaultRender = function
    | None -> Doc.Empty
    | Some sample -> sample.Render

   // string -> SampleModel
    let routeFn samples (str : string) =
        // We only want to look at the latest thing in the hash route in this
        // simple case.
        let loc = if str.Length > 0 then str.Substring(1) else ""
        let split = loc.Split([| '/' |])
        let def = defaultSample samples
        let defaultModel = createModel def (defaultRender def) samples
        if split.Length > 0 then
            let seg = split.[split.Length - 1]
            let rec findFirstRoute = function
            | [] -> defaultModel
            | (x :: xs) ->
                match x.Router seg with
                | Some doc -> createModel (Some x) doc samples
                | None -> findFirstRoute xs
            findFirstRoute samples
        else defaultModel

    let Show samples =
        // Create the model variable
        let loc = Window.Self.Location.Hash.Substring(1)
        let rf = routeFn samples
        let rvModel = Router.Install rf

        Doc.RunById "sample-navs" (navBar rvModel)
        Doc.RunById "sample-main" (mainContent rvModel)
        Doc.RunById "sample-side" (sideContent rvModel)
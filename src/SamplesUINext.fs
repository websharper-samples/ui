namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open System
//open IntelliFactory.WebSharper.Html

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

    type Builder =
        private {
            mutable BFileName : option<string>
            mutable BId : option<string>
            mutable BKeywords : list<string>
            mutable BRender : option<Doc>
            mutable BRenderDescription : option<Doc>
            mutable BTitle : option<string>
        }

        member b.Create() =
            let id = req "Id" (b.BId ++ b.BTitle)
            let title = defaultArg (b.BTitle ++ b.BId) "Sample"
            {
                FileName = req "FileName" b.BFileName
                Id = id
                Keywords = b.BKeywords
                Render = req "Render" b.BRender
                RenderDescription = defaultArg b.BRenderDescription Doc.Empty
                Title = title
            }

        member b.FileName(x) = b.BFileName <- Some x; b
        member b.Id(x) = b.BId <- Some x; b
        member b.Keywords(x) = b.BKeywords <- x; b
        member b.Render(x) = b.BRender <- Some x; b
        member b.RenderDescription(x) = b.BRenderDescription <- Some x; b
        member b.Title(x) = b.BTitle <- Some x; b

    let Build () =
        {
            BId = None
            BFileName = None
            BKeywords = []
            BRender = None
            BRenderDescription = None
            BTitle = None
        }

    let private Clear (el: Dom.Element) =
        while el.HasChildNodes() do
            el.RemoveChild(el.FirstChild) |> ignore

    // Essentially, eventually we'll want to sort through a bunch of these by
    // keyword, for example.

    // For now, though, we're just wanting to do something simpler:
    // * A variable containing a list of samples
    // * A component for the top, which contains a list of time-varying elements:
    //     these are time-varying because we'll click them, and then display a different
    //     page. As well as displaying a different page, we'll update the link to show
    //     which page is active at that time.
    // * A component showing the sample. This will likely be as simple as a div.

    type SampleModel =
        private {
            ActiveSample : Sample option
            Samples : Sample list
        }

    let createModelRv (samples : Sample list) =
        let activeSample =
            if List.isEmpty samples then None else List.head samples |> Some
        Var.Create { ActiveSample = activeSample; Samples = samples }

    // Shortening helper functions
    let el = Doc.Element
    let at = Attr.Create
    let txt = Doc.TextNode

    let getActive rvModel =
        (Var.Get rvModel).ActiveSample

    // Renders a link, based on the model and the link
    let renderLink rvModel sample =
        // Handler function: updates the model to show the updated sample
        let handlerFn (evt : Dom.Event) =
            Var.Update rvModel (fun model -> { model with ActiveSample = Some sample } )

        let clickHandler = EventHandler.CreateHandler "click" handlerFn

        // Attribute list: add the "active" class if selected
        let optActive = getActive rvModel
        let isActive =
                Option.exists (fun a -> a.Id = sample.Id) optActive
        let liAttr = if isActive then [Attr.CreateClass "active"] else []

        // Finally, put it all together to render the link
        el "li" liAttr [
            //el "a" attributeList [ txt sample.Title ]
            Doc.ElementWithEvents "a" [at "href" "#"] [clickHandler] [txt sample.Title]
        ]

    let navBar (rvModel : Var<SampleModel>) =
        View.Map (fun model ->
            el "ul" [Attr.CreateClass "nav" ; Attr.CreateClass "nav-pills"] [
                Doc.Concat (List.map (renderLink rvModel) model.Samples)
            ]
        ) (View.FromVar rvModel) |> Doc.EmbedView

    let mainContent (rvModel : Var<SampleModel>) =
        let view = View.FromVar rvModel
        View.Map (fun model ->
            match model.ActiveSample with
            | Some sample -> sample.Render
            | None -> Doc.Empty) view |> Doc.EmbedView

    let sideContent (rvModel : Var<SampleModel>) =
        let url s = "http://github.com/intellifactory/websharper.ui.next/blob/master/src/" + s.FileName
        let view = View.FromVar rvModel
        let btnAttrs sample = [
            Attr.CreateClass "btn"
            Attr.CreateClass "btn-primary"
            Attr.CreateClass "btn-lg"
            Attr.Create "href" (url sample)
        ]

        el "div" [] [
            View.Map (fun model ->
                match model.ActiveSample with
                | Some sample ->
                    [
                      el "p" [] [
                        sample.RenderDescription
                      ]
                      el "a" (btnAttrs sample) [ txt "Source" ]
                    ] |> Doc.Concat
                | None -> Doc.Empty) view |> Doc.EmbedView
        ]

    let Show samples =
        // Create the model variable
        let rvModel = createModelRv samples
        // Create the view
        Doc.RunById "sample-navs" (navBar rvModel)
        Doc.RunById "sample-main" (mainContent rvModel)
        Doc.RunById "sample-side" (sideContent rvModel)
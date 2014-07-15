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

    // The model type, consisting of the list of samples and the currently-active
    // sample.
    type SampleModel =
        private {
            ActiveSample : Sample option
            Samples : Sample list
        }

    // Creates a model RVar, given a list of samples, and an optional initial sample.
    // If initExample is None, then the first example in the list is used, if the
    // list is non-empty.
    let createModelRv samples initExample =
        let activeSample =
            initExample ++ if List.isEmpty samples then None else List.head samples |> Some
        Var.Create { ActiveSample = activeSample; Samples = samples }

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
        let liAttr = if isActive then [cls "active"] else []

        // Finally, put it all together to render the link
        elA "li" liAttr [
            //el "a" attributeList [ txt sample.Title ]
            Doc.ElementWithEvents "a" [Attr.Create "href" "#"] [clickHandler] [txt sample.Title]
        ]

    let navBar (rvModel : Var<SampleModel>) =
        View.Map (fun model ->
            elA "ul" [Attr.CreateClass "nav" ; Attr.CreateClass "nav-pills"] [
                List.map (renderLink rvModel) model.Samples |> Doc.Concat
            ]
        ) !* rvModel
        |> Doc.EmbedView

    let mainContent (rvModel : Var<SampleModel>) =
        let view = View.FromVar rvModel
        View.Map (fun model ->
            match model.ActiveSample with
            | Some sample -> sample.Render
            | None -> Doc.Empty) view |> Doc.EmbedView

    // Sidebar content, displaying a description of the current example
    let sideContent (rvModel : Var<SampleModel>) =
        let url s = "http://github.com/intellifactory/websharper.ui.next/blob/master/src/" + s.FileName
        let view = View.FromVar rvModel
        let btnAttrs sample = [
            Attr.CreateClass "btn"
            Attr.CreateClass "btn-primary"
            Attr.CreateClass "btn-lg"
            Attr.Create "href" (url sample)
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

    let Show samples =
        // Create the model variable
        let loc = Window.Self.Location.Hash.Substring(1)
        let initialExample =
            if loc <> "" then initExample loc samples else None
        let rvModel = createModelRv samples (initExample loc samples)

        // Create the view
        Doc.RunById "sample-navs" (navBar rvModel)
        Doc.RunById "sample-main" (mainContent rvModel)
        Doc.RunById "sample-side" (sideContent rvModel)
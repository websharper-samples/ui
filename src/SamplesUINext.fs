namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.UI.Next.Notation

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

    let private defaultSample = function
    | [] -> failwith "Samples list can't be empty."
    | (x :: _) -> x

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
            let filename = req "FileName" b.BFileName
            let renderFn = defaultArg b.BRender Doc.Empty
            {
                FileName = filename
                Id = id
                Keywords = b.BKeywords
                Render = renderFn
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

    let navBar rvModel samples =
        let view = View.FromVar rvModel
        // Renders a link, based on the model and the link
        let renderLink view sample =
            let isActive x = x.Id = sample.Id
            // Attribute list: add the "active" class if selected
            let liAttr = Attr.DynamicClass "active" view isActive

            // Finally, put it all together to render the link
            elA "li" [liAttr] [
                link sample.Title [] (fun () -> Var.Set rvModel sample)
            ]

        elA "ul" [cls "nav"; cls "nav-pills"] [
            List.map (renderLink view) samples |> Doc.Concat
        ]

    let mainContent (rvModel : Var<Sample>) =
        View.FromVar rvModel
        |> View.Map (fun model -> model.Render)
        |> Doc.EmbedView

            // Sidebar content, displaying a description of the current example
    let sideContent (rvModel : Var<Sample>) =
        let url s = "http://github.com/intellifactory/websharper.ui.next/blob/master/src/" + s.FileName
        let view = View.FromVar rvModel
        let btnAttrs sample = [
            cls "btn"
            cls "btn-primary"
            cls "btn-lg"
            "href" ==> url sample
        ]

        el "div" [
            View.Map (fun sample ->
                [
                  el "p" [
                    sample.RenderDescription
                  ]
                  elA "a" (btnAttrs sample) [ txt "Source" ]
                ] |> Doc.Concat) !* rvModel |> Doc.EmbedView
        ]

    // Serialisation's simple: just take the filename
    let ser samp = samp.FileName

    let deser sampleMap def (str : string) =
        let key = str.Split([| '/' |]).[0]
        match Map.tryFind key sampleMap with
        | Some samp -> samp
        | None -> def

    let Show samples =
        let samplesMap =
            List.map (fun s -> (s.FileName, s)) samples
            |> Map.ofList
        let rvModel = Router.Install ser (deser samplesMap (defaultSample samples))

        Doc.RunById "sample-navs" (navBar rvModel samples)
        Doc.RunById "sample-main" (mainContent rvModel)
        Doc.RunById "sample-side" (sideContent rvModel)

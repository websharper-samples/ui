// $begin{copyright}
//
// This file is confidential and proprietary.
//
// Copyright (c) IntelliFactory, 2004-2014.
//
// All rights reserved.  Reproduction or use in whole or in part is
// prohibited without the written consent of the copyright holder.
//-----------------------------------------------------------------
// $end{copyright}

namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.UI.Next
open IntelliFactory.WebSharper.UI.Next.Html
open IntelliFactory.WebSharper.UI.Next.Notation

/// A little framework for displaying samples on the site.
[<JavaScript>]
module Samples =

    type Meta =
        {
            FileName : string
            Keywords : list<string>
            Title : string
            Uri : string
        }

    // First, define the samples type, which specifies metadata and a rendering
    // function for each of the samples.
    // A Sample consists of a file name, identifier, list of keywords,
    // rendering function, and title.
    type Sample =
        private {
            mutable Body : Doc
            mutable Description : Doc
            Meta : Meta
            mutable Router : Router<Sample>
            mutable RouteId : RouteId
        }

    type Visuals<'T> =
        {
            Desc : 'T -> Doc
            Main : 'T -> Doc
        }

    let CreateRouted router init vis meta =
        let sample =
            {
                Body = Doc.Empty
                Description = Doc.Empty
                Meta = meta
                Router = Unchecked.defaultof<_>
                RouteId = Unchecked.defaultof<_>
            }
        let r =
             Router.Route router init (fun id cur ->
                sample.RouteId <- id
                sample.Body <- vis.Main cur
                sample.Description <- vis.Desc cur
                sample)
             |> Router.Prefix meta.Uri
        sample.Router <- r
        sample

    let CreateSimple vis meta =
        let unitRouter = RouteMap.Create (fun () -> []) (fun _ -> ())
        let sample =
            {
                Body = vis.Main ()
                Description = vis.Desc ()
                Meta = meta
                Router = Unchecked.defaultof<_>
                RouteId = Unchecked.defaultof<_>
            }
        sample.Router <-
            Router.Route unitRouter () (fun id cur ->
                sample.RouteId <- id
                sample)
            |> Router.Prefix meta.Uri
        sample

    [<Sealed>]
    type Builder<'T>(create: Visuals<'T> -> Meta -> Sample) =

        let mutable meta =
            {
                FileName = "Unknown.fs"
                Keywords = []
                Title = "Unknown"
                Uri = "unknown"
            }

        let mutable vis =
            {
                Desc = fun _ -> Doc.Empty
                Main = fun _ -> Doc.Empty
            }

        member b.Create () =
            create vis meta

        member b.FileName x =
            meta <- { meta with FileName = x }; b

        member b.Id x =
            meta <- { meta with Title = x; Uri = x }; b

        member b.Keywords x =
            meta <- { meta with Keywords = x }; b

        member b.Render f =
            vis <- { vis with Main = f }; b

        member b.RenderDescription x =
            vis <- { vis with Desc = x }; b

        member b.Title x =
            meta <- { meta with Title = x }; b

        member b.Uri x =
            meta <- { meta with Uri = x }; b

    let Build () =
        Builder CreateSimple

    let Routed (router, init) =
        Builder (CreateRouted router init)

    let nav = Html.Elements.Nav

    let Sidebar vSample samples =
        let renderItem sample =
            let attrView = View.FromVar vSample
            let pred s = sample.Meta.FileName = s.Meta.FileName
            let activeAttr = Attr.DynamicClass "active" attrView pred
            Doc.Link sample.Meta.Title
                [cls "list-group-item"; activeAttr]
                (fun () -> Var.Set vSample sample)

        Div [cls "row"] [
            Div [cls "col-3"] [
                H40 [txt "Samples"]
                List.map renderItem samples |> Doc.Concat
            ]
        ]

    let RenderContent sampleView =
        Div [cls "col-9"] [
            sampleView
            |> View.Map (fun x ->
                Div0 [
                    Div [cls "row"] [
                        H10 [txt x.Meta.Title]
                        Div0 [
                            x.Description
                        ]
                    ]

                    Div [cls "row"] [
                        x.Body
                    ]
                ]

            ) |> Doc.EmbedView
        ]

    let Render vSample samples =
        Div [cls "container" ; cls "block-small"] [
            Sidebar vSample samples
            RenderContent (View.FromVar vSample)
        ]

    let Main () =
        let samplesRouter = Router.Merge [ for s in samples -> s.Router ]
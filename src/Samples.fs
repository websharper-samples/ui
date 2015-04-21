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

namespace WebSharper.UI.Next

open WebSharper
open WebSharper.UI.Next
open WebSharper.UI.Next.Html
open WebSharper.UI.Next.Notation
open WebSharper.UI.Next.SiteCommon

/// A little framework for displaying samples on the site.
[<JavaScript>]
module Samples =

    // First, define the samples type, which specifies metadata and a rendering
    // function for each of the samples.
    // A Sample consists of a file name, identifier, list of keywords,
    // rendering function, and title.

    type Visuals<'T> =
        {
            Desc : 'T -> Doc
            Main : 'T -> Doc
        }

    let Sidebar vPage samples =
        let renderItem sample =
            let attrView =
                View.FromVar vPage
                |> View.Map (fun pg -> pg.PageSample)
            let pred s = Option.exists (fun smp -> sample.Meta.FileName = smp.Meta.FileName) s
            let activeAttr = Attr.DynamicClass "active" attrView pred
            Doc.Link sample.Meta.Title
                [cls "list-group-item"; activeAttr]
                (fun () -> Var.Set vPage sample.SamplePage)

        Div [cls "col-md-3"] [
            H40 [txt "Samples"]
            List.map renderItem samples |> Doc.Concat
        ]

    let RenderContent sample =
        Div [cls "samples"; cls "col-md-9"] [
            Div0 [
                Div [cls "row"] [
                    H10 [txt sample.Meta.Title]
                    Div0 [
                        P0 [ sample.Description ]
                        P0 [
                            A
                                [ "href" ==> "https://github.com/intellifactory/websharper.ui.next.samples/blob/master/src/" + sample.Meta.Uri + ".fs" ]
                                [txt "View Source"]
                        ]
                    ]
                ]

                Div [cls "row"] [
                    P0 [ sample.Body ]
                ]
            ]
        ]

    let Render vPage pg samples =
        let sample =
            match pg.PageSample with
            | Some s -> s
            | None -> failwith "Attempted to render non-sample on samples page"

        Section [cls "block-small"] [
            Div [cls "container"] [
                Div [cls "row"] [
                    Sidebar vPage samples
                    RenderContent sample
                ]
            ]
        ]

    let CreateRouted router init vis meta =
        let sample =
            {
                Body = Doc.Empty
                Description = Doc.Empty
                Meta = meta
                Router = Unchecked.defaultof<_>
                RouteId = Unchecked.defaultof<_>
                SamplePage = Unchecked.defaultof<_>
            }
        let r =
             Router.Route router init (fun id cur ->
                sample.RouteId <- id
                sample.Body <- vis.Main cur
                sample.Description <- vis.Desc cur
                let page = mkPage sample.Meta.Title id Samples
                page.PageSample <- Some sample
                page.PageRouteId <- id
                sample.SamplePage <- page
                page
             )
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
                SamplePage = Unchecked.defaultof<_>
            }

        sample.Router <-
            // mkPage name routeId ty
            Router.Route unitRouter () (fun id cur ->
                let page = mkPage sample.Meta.Title id Samples
                sample.RouteId <- id
                page.PageSample <- Some sample
                page.PageRouteId <- id
                sample.SamplePage <- page
                page)
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

    let nav = Nav

    let InitialSamplePage samples =
        (List.head samples).SamplePage

    let SamplesRouter samples =
        Router.Merge [ for s in samples -> s.Router ]
        |> Router.Prefix "samples"
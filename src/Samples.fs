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
            mutable Site : Site<Sample>
            mutable SiteId : SiteId
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
                Site = Unchecked.defaultof<_>
                SiteId = Unchecked.defaultof<_>
            }
        let site =
            Site.Define router init (fun id cur ->
                sample.SiteId <- id
                sample.Body <- vis.Main cur
                sample.Description <- vis.Desc cur
                sample)
            |> Site.Prefix meta.Uri
        sample.Site <- site
        sample

    let CreateSimple vis meta =
        let unitRouter = Router.Create (fun () -> Route.Create []) (fun _ -> ())
        let sample =
            {
                Body = vis.Main ()
                Description = vis.Desc ()
                Meta = meta
                Site = Unchecked.defaultof<_>
                SiteId = Unchecked.defaultof<_>
            }
        sample.Site <-
            Site.Define unitRouter () (fun id cur ->
                sample.SiteId <- id
                sample)
            |> Site.Prefix meta.Uri
        sample

    let Show samples =
        let mainSite = Site.Merge [ for sample in samples -> sample.Site ]
        let current = Site.Install (fun samp -> samp.SiteId) mainSite
        let main =
            current.View
            |> View.Map (fun info -> info.Body)
            |> Doc.EmbedView
        let navs =
            // Renders a link, based on the model and the link
            let renderLink samp =
                let isActive x = x.SiteId = samp.SiteId
                // Attribute list: add the "active" class if selected
                let liAttr = Attr.DynamicClass "active" current.View isActive
                // Finally, put it all together to render the link
                LI [liAttr] [
                    link samp.Meta.Title [] (fun () -> current.Value <- samp)
                ]
            UL [cls "nav"; cls "nav-pills"] [
                for s in samples -> renderLink s
            ]
        let url s =
            "http://github.com/intellifactory/websharper.ui.next\
                /blob/master/src/" + s.FileName
        /// Sidesbar content, displaying a description of the current example
        let side =
            let btnAttrs sample =
                [
                    cls "btn"
                    cls "btn-primary"
                    cls "btn-lg"
                    "href" ==> url sample
                ]
            Div [] [
                current.View
                |> View.Map (fun s ->
                    Doc.Concat [
                        P [] [ s.Description ]
                        A (btnAttrs s.Meta) [ txt "Source" ]
                    ])
                |> Doc.EmbedView
            ]
        Doc.RunById "sample-navs" navs
        Doc.RunById "sample-main" main
        Doc.RunById "sample-side" side

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

    let Routed (router: Router<'T>, init: 'T)=
        Builder (CreateRouted router init)
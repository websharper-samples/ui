namespace WebSharper.UI.Next

open WebSharper
open WebSharper.UI.Next
open WebSharper.UI.Next.Client
open WebSharper.UI.Next.Html
open WebSharper.UI.Next.Notation
open WebSharper.UI.Next.SiteCommon

[<JavaScript>]
module Site =

    type AboutEntry =
        {
            Name : string
            ImgURL : string
            Description : string
            URLs : Doc list
        }

    let mkEntry name desc img urls =
        {
            Name = name
            Description = desc
            ImgURL = img
            URLs = urls
        }

    let Entries =
        [
            mkEntry
                "Documentation"
                "Official documentation on WebSharper UI.Next, including the \
                 API reference and some discussion about the design decisions \
                 we made"
                "files/gear.png"
                [
                    href "Tutorial" "https://github.com/intellifactory/websharper.ui.next/blob/master/docs/Tutorial.md"
                    href "API Reference" "https://github.com/intellifactory/websharper.ui.next/blob/master/docs/API.md"
                    href "Full Documentation" "https://github.com/intellifactory/websharper.ui.next/blob/master/README.md"
                ] ;
            mkEntry
                "Articles"
                "Articles written about UI.Next, which provide more detailed \
                 discussions about various aspects of the library."
                "files/uinext-screen.png"
                [
                    href "WebSharper UI.Next: An Introduction" "http://www.websharper.com/blog-entry/3954"
                    href "WebSharper UI.Next: Declarative Animation" "http://www.websharper.com/blog-entry/3964"
                    href "Structuring Applications with WebSharper UI.Next" "http://www.websharper.com/blog-entry/3965"
                ] ;
             mkEntry
                "Presentations"
                "Presentations about UI.Next, providing an overview of the library \
                 and deeper insights into the thinking behind it."
                "files/anton-pres.png"
                [
                    href
                        "Presentation: Tackle UI with Reactive DOM in F# and WebSharper"
                        "https://www.youtube.com/watch?v=wEkS09s3KBc"
                ]
         ]

    let NavExternalLinks =
        [
            ("GitHub", "http://www.github.com/IntelliFactory/websharper.ui.next")
            ("API Reference", "https://github.com/intellifactory/websharper.ui.next/blob/master/docs/API.md")
        ]

    let showPgTy = function
        | Home -> "Home"
        | About -> "About"
        | Samples -> "Samples"

    let homePage =
        mkPage (showPgTy Home) Unchecked.defaultof<_> Home

    let aboutPage =
         mkPage (showPgTy About) Unchecked.defaultof<_> About

    let pageFor pty samples =
        match pty with
        | Home -> homePage
        | About -> aboutPage
        | Samples -> Samples.InitialSamplePage samples

    let NavPages = [Home ; About; Samples]

    let linkBtn caption href =
        aAttr [cls "btn" ; cls "btn-default" ; attr.href href]
            [ text caption ]

    let HomePage go =
        divc "container" [
            sectionAttr
                [
                    cls "block-huge"
                    cls "teaser-home"
                    sty "height" "700px"
                    sty "padding-top" "40px"
                    sty "padding-bottom" "30px"
                    sty "margin-bottom" "40px"
                ]
                [
                    divc "container" [
                        divc "row" [
                            divc "col-12" [
                                br []
                                h1 [
                                    text "WebSharper UI.Next: "
                                    spanAttr [cls "text-muted"] [
                                        text "A new generation of reactive web applications."
                                    ]
                                ]
                                h3 [
                                    text "Write powerful, data-backed applications"
                                    br []
                                    text " using F# and WebSharper."
                                ]

                                pAttr [cls "lead"] [
                                    text "Get it free on NuGet today!"
                                ]
                            ]
                        ]
                    ]
                ]
            ]

    let AboutPage go =

        let renderBody entry =
            Doc.Concat [
                h1 [ text entry.Name ]
                pAttr [cls "lead"] [
                    text entry.Description
                ]
                p [
                    ulAttr [cls "list-unstyled"] (
                        entry.URLs
                        |> List.map (fun lnk -> li [lnk] :> Doc)
                    )
                ]
            ]

        let oddEntry entry =
            sectionAttr [cls "block-large" ] [
                divc "container" [
                    divc "row" [
                        divc "col-lg-3" [
                            imgAttr [attr.src entry.ImgURL ; sty "width" "100%"] []
                        ]
                        divc "col-lg-1" []
                        divc "col-lg-8" [
                            renderBody entry
                        ]
                    ]
                ]
            ]

        let evenEntry entry =
            sectionAttr [cls "block-large" ; cls "bg-alt" ] [
                divc "container" [
                    divc "row" [
                        divc "col-lg-8" [
                            renderBody entry
                        ]
                        divc "col-lg-1" []
                        divc "col-lg-3" [
                            imgAttr [attr.src entry.ImgURL; sty "width" "100%"] []
                        ]
                    ]
                ]
            ]

        let ico name =
        // font-size:400%;color:#aaa;
            spanAttr [cls "fa" ; cls name; cls "fa-3x" ; sty "font-size" "400%" ; sty "color" "#aaa"] []

        divc "extensions" [
            divc "container" [
                sectionAttr [cls "block-huge"] [
                    h1 [
                        text "WebSharper UI.Next: "
                        spanAttr [cls "text-muted"] [
                            text "Everything you need to know."
                        ]
                    ]

                    pAttr [cls "lead"] [
                        text "A selection of resources about UI.Next."
                    ]
                ]
            ]

            divc "block-large bg-alt" [
                divc "container" [
                    divc "row text-center" [
                        divc "col-lg-4" [
                            ico "fa-graduation-cap"
                            h3 [text "Get Started"]
                            p [text "Take the tutorial, and you'll be writing reactive applications in no time!"]
                            linkBtn "Tutorial" "https://github.com/intellifactory/websharper.ui.next/blob/master/docs/Tutorial.md"
                            // Tutorial
                        ]

                        divc "col-lg-4" [
     //                       Elements.I [cls "fa" ; cls "fa-graduation-cap" ; cls "fa-3x" ] []
                            ico "fa-book"
                            h3 [text "Dive Right In"]
                            p [text "Comprehensive documentation on the UI.Next API."]
                            linkBtn "API Reference" "https://github.com/intellifactory/websharper.ui.next/blob/master/docs/API.md"
                            // Dive right in
                            // API Reference
                        ]

                        divc "col-lg-4" [
                            ico "fa-send"
                            h3 [text "See it in Action"]
                            p [text "A variety of samples using UI.Next, and their associated source code!"]
                            Doc.Button "Samples" [cls "btn" ; cls "btn-default" ] (fun () -> go Samples)
                            // See it in action
                            // Samples link
                        ]
                    ]
                ]

            ]
            List.mapi (fun i entry ->
                let renderFn = if i % 2 = 0 then oddEntry else evenEntry
                renderFn entry :> Doc
            ) Entries |> Doc.Concat
        ]

    let NavBar (v: Var<Page>) samples =
        let renderLink pg =
            View.FromVar v
            |> View.Map (fun page ->
                let active = if page.PageType = pg then cls "active" else Attr.Empty
                liAttr [cls "nav-item"; active] [
                    Doc.Link (showPgTy pg) [] (fun () -> Var.Set v (pageFor pg samples))
                ]
            )
            |> Doc.EmbedView

        let renderExternal (title, lnk) =
            liAttr [cls "nav-item"] [
                href title lnk
            ] :> Doc

        navAttr [cls "container"] [
            divAttr [sty "float" "left"] [
                aAttr [
                    attr.href "http://www.websharper.com/home"
                    sty "text-decoration" "none"
                    cls "first"
                ] [
                    imgAttr [
                        attr.src "files/logo-websharper-icon.png"
                        attr.alt "[logo]"
                        sty "margin-top" "0"
                        sty "border-right" "1px"
                        sty "solid" "#eee"
                    ] []
                    imgAttr [
                        attr.src "files/logo-websharper-text-dark.png"
                        attr.alt "WebSharper"
                        sty "height" "32px"
                    ] []
                  ]
            ]

            navAttr [
                cls "nav"
                cls "nav-collapsible"
                cls "right"
                sty "float" "right"
            ] [
                ulAttr [cls "nav-list"] [
                    List.map renderLink NavPages |> Doc.Concat
                    List.map renderExternal NavExternalLinks |> Doc.Concat
                ]
            ]
        ]

    let unitRouteMap =
        RouteMap.Create (fun () -> []) (fun _ -> ())

    let homeRouter samples =
        Router.Route unitRouteMap () (fun id v ->
            let homePg = pageFor Home samples
            homePg.PageRouteId <- id
            homePg
        )

    let aboutRouter samples =
        Router.Route unitRouteMap () (fun id v ->
            let aboutPg = pageFor About samples
            aboutPg.PageRouteId <- id
            aboutPg
        )

    let SiteRouter samples =
        Router.Merge [
            Router.Prefix "home" (homeRouter samples)
            Router.Prefix "about" (aboutRouter samples)
            Router.Prefix "samples" (Samples.SamplesRouter samples)
        ]
    let fadeTime = 300.0

    let Fade =
        Anim.Simple Interpolation.Double Easing.CubicInOut fadeTime

    let FadeTransition =
        Trans.Create Fade
        |> Trans.Enter (fun i -> Fade 0.0 1.0)
        |> Trans.Exit (fun i -> Fade 1.0 0.0)

    let MakePage pg =
        divAttr [Attr.AnimatedStyle "opacity" FadeTransition (View.Const 1.0) string] [
            pg
        ]

    let Main samples =
        let router = Router.Install (fun pg -> pg.PageRouteId) (SiteRouter samples)
        let renderMain v =
            View.FromVar v
            |> View.Map (fun (pg: Page) ->
                match pg.PageType with
                | Home -> HomePage (fun ty -> Var.Set v (pageFor ty samples))
                | About -> AboutPage (fun ty -> Var.Set v (pageFor ty samples))
                | Samples -> Samples.Render v pg samples
        //        |> MakePage
                )
            |> Doc.EmbedView

        Doc.RunById "main" (renderMain router)
        Doc.RunById "navigation" (NavBar router samples)
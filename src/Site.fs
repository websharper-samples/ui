namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.UI.Next
open IntelliFactory.WebSharper.UI.Next.Html
open IntelliFactory.WebSharper.UI.Next.Notation
open IntelliFactory.WebSharper.UI.Next.SiteCommon

[<JavaScript>]
module Site =

    type AboutEntry =
        {
            Name : string
            URL : string
            ImgURL : string
            Description : string
        }

    let mkEntry name blog img desc =
        {
            Name = name
            URL = blog
            ImgURL = img
            Description = desc
        }

    let Entries =
        [
            mkEntry
                "WebSharper UI.Next: An Introduction"
                "http://www.websharper.com/blog-entry/3954"
                "files/uinext-screen.png"
                "WebSharper UI.Next is a new library for constructing reactive \
                 interfaces, backed by data. This post introduces the basics, \
                 and shows how to construct some simple examples."
            mkEntry
                "The WebSharper UI.Next Tutorial"
                "https://github.com/intellifactory/websharper.ui.next/blob/master/docs/Tutorial.md"
                "files/TodoApp.png"
                "A tutorial to take you through the basics of UI.Next,\
                 by developing some simple applications."
            mkEntry
                "API Reference"
                "http://www.websharper.com/blog-entry/3964"
                "files/gear.png"
                "The definitive UI.Next API Reference."
            mkEntry
                "Presentation: Tackle UI with Reactive DOM in F# and WebSharper"
                "https://www.youtube.com/watch?v=wEkS09s3KBc"
                "files/anton-pres.png"
                "In this recorded Community for FSharp event, Anton Tayanovskyy presents the \
                 basics of the library and the motivations for the dataflow design."
            mkEntry
                "WebSharper UI.Next: Declarative Animation"
                "http://www.websharper.com/blog-entry/3964"
                "files/home-banner.jpg"
                "Inspired by the success of libraries such as D3, this post \
                 shows how the animation features of UI.Next may be used to \
                 construct data-driven animations in a declarative style."
            mkEntry
                "Structuring Applications with WebSharper UI.Next"
                "http://www.websharper.com/blog-entry/3965"
                "files/blog2-screen.png"
                "One of the big advantages of using F# is that we can take \
                 advantage of its static type system to help us structure applications. \
                 This post explains some of the abstractions available to structure \
                 single-page applications."
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

    let HomePage go =
        Div [cls "container"] [
            Elements.Section
                [
                    cls "block-huge"
                    cls "teaser-home"
                    sty "height" "700px"
                    sty "padding-top" "40px"
                    sty "padding-bottom" "30px"
                    sty "margin-bottom" "40px"
                ]
                [
                    Div [cls "container"] [
                        Div [cls "row"] [
                            Div [cls "col-12"] [
                                Elements.Br [] []
                                H10 [
                                    txt "WebSharper UI.Next: "
                                    Span [cls "text-muted"] [
                                        txt "A new generation of reactive web applications."
                                    ]
                                ]
                                H30 [
                                    txt "Write powerful, data-backed applications"
                                    Elements.Br [] []
                                    txt " using F# and WebSharper."
                                ]

                                P [cls "lead"] [
                                    txt "Get it free on NuGet today!"
                                ]
                            ]
                        ]
                    ]
                ]
            ]

    let AboutPage go =
        let oddEntry lnk desc img =
            Elements.Section [cls "block-large" ] [
                Div [cls "container"] [
                    Div [cls "row"] [
                        Div [cls "col-lg-3"] [
                            Elements.Img ["src" ==> img ; sty "width" "100%"] []
                        ]
                        Div [cls "col-lg-1"] []
                        Div [cls "col-lg-8"] [
                            H10 [
                                lnk
                            ]
                            P [cls "lead"] [
                                txt desc
                            ]
                        ]
                    ]
                ]
            ]

        let evenEntry lnk desc img =
            Elements.Section [cls "block-large" ; cls "bg-alt" ] [
                Div [cls "container"] [
                    Div [cls "row"] [
                        Div [cls "col-lg-8"] [
                            H10 [
                                lnk
                            ]
                            P [cls "lead"] [
                                txt desc
                            ]
                        ]
                        Div [cls "col-lg-1"] []
                        Div [cls "col-lg-3"] [
                            Elements.Img ["src" ==> img ; sty "width" "100%"] []
                        ]
                    ]
                ]
            ]

        Div [cls "extensions"] [
            Div [cls "container"] [
                Elements.Section [cls "block-huge"] [
                    H10 [
                        txt "WebSharper UI.Next: "
                        Span [cls "text-muted"] [
                            txt "Everything you need to know."
                        ]
                    ]

                    P [cls "lead"] [
                        txt "A selection of resources about UI.Next."
                    ]
                ]
            ]

            List.mapi (fun i entry ->
                let renderFn = if i % 2 = 1 then oddEntry else evenEntry
                renderFn (href entry.Name entry.URL) entry.Description entry.ImgURL
            ) Entries |> Doc.Concat
        ]

    let NavBar (v: Var<Page>) samples =
        let renderLink pg =
            View.FromVar v
            |> View.Map (fun page ->
                let liAttr = if page.PageType = pg then Attr.Class "active" else Attr.Empty
                LI [cls "nav-item"; liAttr] [
                    link (showPgTy pg) [] (fun () -> Var.Set v (pageFor pg samples))
                ]
            )
            |> Doc.EmbedView

        let renderExternal (title, lnk) =
            LI [cls "nav-item"] [
                href title lnk
            ]

        Elements.Nav [cls "container"] [
            Div [sty "float" "left"] [
                A ["href" ==> "http://www.websharper.com/home"
                   sty "text-decoration" "none"
                   cls "first"
                  ] [
                    Elements.Img [
                        "src" ==> "files/logo-websharper-icon.png"
                        "alt" ==> "[logo]"
                        sty "margin-top" "0"
                        sty "border-right" "1px"
                        sty "solid" "#eee"
                    ] []
                    Elements.Img [
                        "src" ==> "files/logo-websharper-text-dark.png"
                        "alt" ==> "WebSharper"
                        sty "height" "32px"
                    ] []
                  ]
            ]

            Elements.Nav [
                cls "nav"
                cls "nav-collapsible"
                cls "right"
                sty "float" "right"
            ] [
                UL [cls "nav-list"] [
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

    let Main samples =
        let router = Router.Install (fun pg -> pg.PageRouteId) (SiteRouter samples)
        let renderMain v =
            View.FromVar v
            |> View.Map (fun (pg: Page) ->
                JavaScript.Log "view fn triggered"
                match pg.PageType with
                | Home -> HomePage (fun ty -> Var.Set v (pageFor ty samples))
                | About -> AboutPage (fun ty -> Var.Set v (pageFor ty samples))
                | Samples -> Samples.Render v pg samples
                )
            |> Doc.EmbedView

        Doc.RunById "main" (renderMain router)
        Doc.RunById "navigation" (NavBar router samples)

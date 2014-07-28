namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.UI.Next
open IntelliFactory.WebSharper.UI.Next.Html
open IntelliFactory.WebSharper.UI.Next.Notation

[<JavaScript>]
module Site =

    type PageTy = | Home | About | Samples

    type Page =
        {
            PageName : string
            PageRender : Doc
            PageType : PageTy
        }

    let mkPage name routeId render ty =
        {
            PageName = name
            PageRender = render
            PageType = ty
        }

    type AboutEntry =
        {
            Name : string
            URL : string
            ImgURL : string
            Description : string
        }

    let mkEntry name blog desc img =
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
                ""
                "WebSharper UI.Next is a new library for constructing reactive \
                 interfaces, backed by data. This post introduces the basics, \
                 and shows how to construct some simple examples."
            mkEntry
                "WebSharper UI.Next: Declarative Animation"
                "http://www.websharper.com/blog-entry/3964"
                ""
                "Inspired by the success of libraries such as D3, this post \
                 shows how the animation features of UI.Next may be used to \
                 construct data-driven animations in a declarative style."
            mkEntry
                "Structuring Applications with WebSharper UI.Next"
                "http://www.websharper.com/blog-entry/3965"
                ""
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

    let pageToURL = function
        | Home -> []
        | About -> ["about"]
        | Samples -> ["samples"]

    let urlToPage url =
        let list = (List.fold (fun s x -> s + ", " + x) "[" url) + "]"
        let res =
            match url with
            | ["about"] -> About
            | _ -> Home
        JavaScript.Log <| "list: " + list + ", list length:" + string(url.Length) + ", res: " + (showPgTy res)
        res

    let NavPages = [Home ; About]
    let HomePage go =
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
                            link "Installation"
                                [cls "btn" ; cls "btn-large" ; cls "btn-default"]
                                (fun () -> ())

                            link "Learn more"
                                [cls "btn" ; cls "btn-large" ; cls "btn-default"]
                                (fun () -> go About)
                        ]
                    ]
                ]
            ]

    let AboutPage go =
        //JavaScript.Alert "hi from about page"
        let oddEntry lnk desc img =
            Elements.Section [cls "block-large" ; sty "padding-top" "80px"] [
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
                        ]
                        P [cls "lead"] [
                            txt desc
                        ]
                    ]
                ]
            ]

        let evenEntry lnk desc img =
            Elements.Section [cls "block-large" ; cls "bg-alt" ; sty "padding-top" "80px"] [
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

        List.mapi (fun i entry ->
            let renderFn = if i % 2 = 0 then oddEntry else evenEntry
            renderFn (href entry.Name entry.URL) entry.Description entry.ImgURL
        ) Entries |> Doc.Concat

    let NavBar v =

        let renderLink pg =
            View.FromVar v
            |> View.Map (fun page ->
                // Attribute list: add the "active" class if selected
             //   JavaScript.Log <| "Nav pty: " + (showPgTy page.PageType)
               // JavaScript.Log <| "Pg: " + (showPgTy pg)
                let liAttr = if page = pg then Attr.Class "active" else Attr.Empty
                LI [cls "nav-item"] [
                    link (showPgTy pg) [liAttr] (fun () -> Var.Set v pg)
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

      //  | ["samples"] -> Samples
    let MainRouteMap =
        RouteMap.Create pageToURL urlToPage

    let SiteRouter =
        let page = mkPage
        Router.Route MainRouteMap Home (fun routeId v ->
            let go = Var.Set v
            let pg = Var.Get v
            //JavaScript.Alert <| "PG: " + (showPgTy pg)
            match pg with
            | Home -> mkPage "Home" routeId (HomePage go) Home
            | About -> mkPage "About" routeId (AboutPage go) About
            | Samples -> mkPage "Home" routeId (HomePage go) Samples
        )
        //Router.Install (fun pg -> )

    // Current page, set route id. still requires mutability i guess...
    let Main () =
        let (pageVar, outerRouter) = SiteRouter
        let router = Router.Install (fun pg -> pg.PageRouteId) outerRouter
        let renderMain v =
            View.FromVar v
            |> View.Map (fun v ->
                JavaScript.Log "view fn triggered"
                v.PageRender)
            |> Doc.EmbedView

        Doc.RunById "main" (renderMain router)
        Doc.RunById "navigation" (NavBar pageVar)
        //Doc.RunById "navigation" (Nav)
        // Router.Install : ('T -> RouteId) -> Router<'T> -> Var<'T>
        //Router.
        //Router.Install (fun pg -> pg.RouteId) SiteRouter
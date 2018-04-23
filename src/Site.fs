namespace WebSharper.UI

open WebSharper
open WebSharper.Sitelets.InferRouter
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation
open WebSharper.UI.SiteCommon

[<JavaScript>]
module Site =

    type PageTy = Samples.PageTy

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
        | PageTy.Home -> "Home"
        | PageTy.About -> "About"
        | PageTy.Samples _ -> "Samples"

    let NavPages = [PageTy.Home ; PageTy.About; Samples.SamplesDefault]

    let linkBtn caption href =
        a [cls "btn" ; cls "btn-default" ; attr.href href]
            [ text caption ]

    let HomePage go =
        divc "container" [
            section
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
                                br [] []
                                h1 [] [
                                    text "WebSharper UI.Next: "
                                    span [cls "text-muted"] [
                                        text "A new generation of reactive web applications."
                                    ]
                                ]
                                h3 [] [
                                    text "Write powerful, data-backed applications"
                                    br [] []
                                    text " using F# and WebSharper."
                                ]

                                p [cls "lead"] [
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
                h1 [] [ text entry.Name ]
                p [cls "lead"] [
                    text entry.Description
                ]
                p [] [
                    ul [cls "list-unstyled"] (
                        entry.URLs
                        |> List.map (fun lnk -> li [] [lnk] :> Doc)
                    )
                ]
            ]

        let oddEntry entry =
            section [cls "block-large" ] [
                divc "container" [
                    divc "row" [
                        divc "col-lg-3" [
                            img [attr.src entry.ImgURL ; sty "width" "100%"] []
                        ]
                        divc "col-lg-1" []
                        divc "col-lg-8" [
                            renderBody entry
                        ]
                    ]
                ]
            ]

        let evenEntry entry =
            section [cls "block-large" ; cls "bg-alt" ] [
                divc "container" [
                    divc "row" [
                        divc "col-lg-8" [
                            renderBody entry
                        ]
                        divc "col-lg-1" []
                        divc "col-lg-3" [
                            img [attr.src entry.ImgURL; sty "width" "100%"] []
                        ]
                    ]
                ]
            ]

        let ico name =
        // font-size:400%;color:#aaa;
            span [cls "fa" ; cls name; cls "fa-3x" ; sty "font-size" "400%" ; sty "color" "#aaa"] []

        divc "extensions" [
            divc "container" [
                section [cls "block-huge"] [
                    h1 [] [
                        text "WebSharper UI.Next: "
                        span [cls "text-muted"] [
                            text "Everything you need to know."
                        ]
                    ]

                    p [cls "lead"] [
                        text "A selection of resources about UI.Next."
                    ]
                ]
            ]

            divc "block-large bg-alt" [
                divc "container" [
                    divc "row text-center" [
                        divc "col-lg-4" [
                            ico "fa-graduation-cap"
                            h3 [] [text "Get Started"]
                            p [] [text "Take the tutorial, and you'll be writing reactive applications in no time!"]
                            linkBtn "Tutorial" "https://github.com/intellifactory/websharper.ui.next/blob/master/docs/Tutorial.md"
                            // Tutorial
                        ]

                        divc "col-lg-4" [
     //                       Elements.I [cls "fa" ; cls "fa-graduation-cap" ; cls "fa-3x" ] []
                            ico "fa-book"
                            h3 [] [text "Dive Right In"]
                            p [] [text "Comprehensive documentation on the UI.Next API."]
                            linkBtn "API Reference" "https://github.com/intellifactory/websharper.ui.next/blob/master/docs/API.md"
                            // Dive right in
                            // API Reference
                        ]

                        divc "col-lg-4" [
                            ico "fa-send"
                            h3 [] [text "See it in Action"]
                            p [] [text "A variety of samples using UI.Next, and their associated source code!"]
                            Doc.Button "Samples" [cls "btn" ; cls "btn-default" ] (fun () -> go Samples.SamplesDefault)
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

    let NavBar (v: Var<PageTy>) =
        let renderLink pg =
            View.FromVar v
            |> View.Map (fun page ->
                let active = if page = pg then cls "active" else Attr.Empty
                li [cls "nav-item"; active] [
                    Doc.Link (showPgTy pg) [] (fun () -> Var.Set v pg)
                ]
            )
            |> Doc.EmbedView

        let renderExternal (title, lnk) =
            li [cls "nav-item"] [
                href title lnk
            ] :> Doc

        nav [cls "container"] [
            div [sty "float" "left"] [
                a [
                    attr.href "http://www.websharper.com/home"
                    sty "text-decoration" "none"
                    cls "first"
                ] [
                    img [
                        attr.src "files/logo-websharper-icon.png"
                        attr.alt "[logo]"
                        sty "margin-top" "0"
                        sty "border-right" "1px"
                        sty "solid" "#eee"
                    ] []
                    img [
                        attr.src "files/logo-websharper-text-dark.png"
                        attr.alt "WebSharper"
                        sty "height" "32px"
                    ] []
                  ]
            ]

            nav [
                cls "nav"
                cls "nav-collapsible"
                cls "right"
                sty "float" "right"
            ] [
                ul [cls "nav-list"] [
                    List.map renderLink NavPages |> Doc.Concat
                    List.map renderExternal NavExternalLinks |> Doc.Concat
                ]
            ]
        ]

    let fadeTime = 300.0

    let Fade =
        Anim.Simple Interpolation.Double Easing.CubicInOut fadeTime

    let FadeTransition =
        Trans.Create Fade
        |> Trans.Enter (fun i -> Fade 0.0 1.0)
        |> Trans.Exit (fun i -> Fade 1.0 0.0)

    let MakePage pg =
        div [Attr.AnimatedStyle "opacity" FadeTransition (View.Const 1.0) string] [
            pg
        ]

    let RenderSample =
        function
        | Samples.SimpleTextBox -> SimpleTextBox.Sample.Page
        | Samples.InputTransform -> InputTransform.Sample.Page
        | Samples.InputTransformHtml -> InputTransformHtml.Sample.Page
        | Samples.TodoList -> TodoList.Sample.Page
        | Samples.PhoneExample -> PhoneExample.Sample.Page
        | Samples.EditablePersonList -> EditablePersonList.Sample.Page
        | Samples.CheckBoxTest -> CheckBoxTest.Sample.Page
        | Samples.Calculator -> Calculator.Sample.Page
        | Samples.ContactFlow -> ContactFlow.Sample.Page
        | Samples.AnimatedContactFlow -> AnimatedContactFlow.Sample.Page
        | Samples.MessageBoard -> MessageBoard.Sample.Page
        | Samples.BobsleighSite -> BobsleighSite.Sample.Page
        | Samples.RoutedBobsleighSite _ -> RoutedBobsleighSite.Sample.Page
        | Samples.AnimatedBobsleighSite -> AnimatedBobsleighSite.Sample.Page
        | Samples.ObjectConstancy -> ObjectConstancy.Sample.Page
        | Samples.MouseInfo -> MouseInfo.Sample.Page
        | Samples.KeyboardInfo -> KeyboardInfo.Sample.Page
        | Samples.SortableBarChart -> SortableBarChart.Sample.Page

    let Main (samples: list<Samples.Sample>) =
        let router = Router.Infer<PageTy>()
        let var = Router.InstallHash PageTy.Home router
        let go ty = Var.Set var ty
        var.View.Doc(function
            | PageTy.Home -> HomePage go
            | PageTy.About -> AboutPage go
            | PageTy.Samples pg -> RenderSample pg var samples
        )
        |> Doc.RunById "main"
        Doc.RunById "navigation" (NavBar var)

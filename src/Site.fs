namespace WebSharper.UI

open WebSharper
open WebSharper.Sitelets.InferRouter
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation
open WebSharper.UI.SiteCommon
open WebSharper.UI.Templating

[<JavaScript>]
module Site =

    type PageTy = Samples.PageTy

    type ShellTemplate = Templating.Template<"wwwroot/index.html", ClientLoad.FromDocument>

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
                "The official documentation for WebSharper.UI: the API reference, \
                 tutorials, and notes on the design decisions behind the library."
                "files/gear.png"
                [
                    href "Tutorial" "https://websharper.com/docs/ui"
                    href "API Reference" "https://websharper.com/docs/ui/api"
                    href "Library source" "https://github.com/dotnet-websharper/ui"
                ] ;
            mkEntry
                "Articles"
                "Written introductions to reactive UI programming with WebSharper, \
                 from first principles to structuring larger applications."
                "files/uinext-screen.png"
                [
                    href "WebSharper UI: An Introduction" "https://websharper.com/blog-entry/3954"
                    href "WebSharper UI: Declarative Animation" "https://websharper.com/blog-entry/3964"
                    href "Structuring Applications with WebSharper UI" "https://websharper.com/blog-entry/3965"
                ] ;
             mkEntry
                "Presentations"
                "Talks about WebSharper.UI that give an overview of the library and a \
                 deeper look at the thinking behind its reactive model."
                "files/anton-pres.png"
                [
                    href
                        "Tackle UI with Reactive DOM in F# and WebSharper"
                        "https://www.youtube.com/watch?v=wEkS09s3KBc"
                ]
         ]

    let NavExternalLinks =
        [
            ("GitHub", "https://github.com/websharper-samples/ui")
            ("Documentation", "https://websharper.com/docs/ui")
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
        Doc.Concat [
            div [cls "hero"] [
                div [cls "container"] [
                    p [cls "eyebrow"] [ text "WebSharper.UI samples" ]
                    h1 [] [
                        text "Reactive web apps, built in "
                        span [cls "accent"] [ text "F#" ]
                    ]
                    p [cls "lead"] [
                        text "A living gallery of composable, time-varying user interfaces. \
                              Everything here is compiled from F# to JavaScript with \
                              WebSharper, and the whole site is itself a WebSharper.UI \
                              single-page application."
                    ]
                    div [cls "hero-actions"] [
                        Doc.Button "Explore the samples" [cls "btn" ; cls "btn-primary"]
                            (fun () -> go Samples.SamplesDefault)
                        a [cls "btn" ; cls "btn-default" ; attr.href "https://websharper.com"]
                            [ text "Get WebSharper" ]
                    ]
                    ul [cls "hero-stats"] [
                        li [] [ strong [] [ text "18" ] ; span [] [ text "interactive samples" ] ]
                        li [] [ strong [] [ text "F#" ] ; span [] [ text "compiled to JavaScript" ] ]
                        li [] [ strong [] [ text "0" ] ; span [] [ text "servers required" ] ]
                    ]
                ]
            ]

            section [cls "block-large"] [
                div [cls "container"] [
                    div [cls "feature-grid"] [
                        div [cls "feature-card"] [
                            span [cls "feature-icon"] [ text "λ" ]
                            h3 [] [ text "Reactive by design" ]
                            p [] [
                                text "Vars are data sources and Views are time-varying values. \
                                      Build the UI once; it updates itself when the data changes."
                            ]
                        ]
                        div [cls "feature-card"] [
                            span [cls "feature-icon"] [ text "⧉" ]
                            h3 [] [ text "Composable documents" ]
                            p [] [
                                text "Doc is a monoid. Embed views, concatenate fragments, and \
                                      animate nodes in and out without touching the DOM by hand."
                            ]
                        ]
                        div [cls "feature-card"] [
                            span [cls "feature-icon"] [ text "⌘" ]
                            h3 [] [ text "Templates and routing" ]
                            p [] [
                                text "Whole-page HTML templates with typed holes, plus hash-based \
                                      client-side routing for real single-page applications."
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
                p [cls "lead"] [ text entry.Description ]
                ul [] (
                    entry.URLs
                    |> List.map (fun lnk -> li [] [lnk])
                )
            ]

        let oddEntry entry =
            section [cls "block-large" ; cls "about-entry"] [
                div [cls "container"] [
                    div [cls "row"] [
                        div [cls "col-lg-3"] [
                            img [attr.src entry.ImgURL ; attr.alt entry.Name] []
                        ]
                        div [cls "col-lg-1"] []
                        div [cls "col-lg-8"] [
                            renderBody entry
                        ]
                    ]
                ]
            ]

        let evenEntry entry =
            section [cls "block-large" ; cls "bg-alt" ; cls "about-entry"] [
                div [cls "container"] [
                    div [cls "row"] [
                        div [cls "col-lg-8"] [
                            renderBody entry
                        ]
                        div [cls "col-lg-1"] []
                        div [cls "col-lg-3"] [
                            img [attr.src entry.ImgURL ; attr.alt entry.Name] []
                        ]
                    ]
                ]
            ]

        div [cls "extensions"] [
            section [cls "block-huge"] [
                div [cls "container"] [
                    p [cls "eyebrow" ; cls "text-muted"] [ text "About" ]
                    h1 [] [
                        text "WebSharper.UI: "
                        span [cls "text-muted"] [ text "everything you need to know." ]
                    ]
                    p [cls "lead"] [
                        text "A selection of resources for learning the library."
                    ]
                ]
            ]

            div [cls "block-large" ; cls "bg-alt"] [
                div [cls "container"] [
                    div [cls "feature-grid"] [
                        div [cls "feature-card"] [
                            span [cls "feature-icon"] [ text "01" ]
                            h3 [] [ text "Get started" ]
                            p [] [ text "Take the tutorial and you will be writing reactive applications in no time." ]
                            linkBtn "Tutorial" "https://websharper.com/docs/ui"
                        ]
                        div [cls "feature-card"] [
                            span [cls "feature-icon"] [ text "02" ]
                            h3 [] [ text "Dive right in" ]
                            p [] [ text "Comprehensive reference documentation for the UI API." ]
                            linkBtn "API Reference" "https://websharper.com/docs/ui/api"
                        ]
                        div [cls "feature-card"] [
                            span [cls "feature-icon"] [ text "03" ]
                            h3 [] [ text "See it in action" ]
                            p [] [ text "A variety of samples using UI, with their source code." ]
                            Doc.Button "Samples" [cls "btn" ; cls "btn-default"]
                                (fun () -> go Samples.SamplesDefault)
                        ]
                    ]
                ]
            ]

            List.mapi (fun i entry ->
                let renderFn = if i % 2 = 0 then oddEntry else evenEntry
                renderFn entry
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
            ]

        ul [cls "nav-list"] [
            List.map renderLink NavPages |> Doc.Concat
            List.map renderExternal NavExternalLinks |> Doc.Concat
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
        let main =
            var.View.Doc(function
                | PageTy.Home -> HomePage go
                | PageTy.About -> AboutPage go
                | PageTy.Samples pg -> RenderSample pg var samples
            )
        ShellTemplate()
            .Nav(NavBar var)
            .Main(main)
            .Bind()
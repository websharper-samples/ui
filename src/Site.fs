namespace WebSharper.UI

open WebSharper
open WebSharper.Sitelets.InferRouter
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation
open WebSharper.UI.Templating

[<JavaScript>]
module Site =

    type PageTy = Samples.PageTy

    type ShellTemplate = Templating.Template<"wwwroot/index.html", ClientLoad.FromDocument>

    let NavExternalLinks =
        [
            ("GitHub", "https://github.com/websharper-samples/ui")
            ("Documentation", "https://docs.websharper.com/ui/reactive")
        ]

    let NavPages =
        [
            ("Home", PageTy.Home, (fun (p: PageTy) -> p = PageTy.Home))
            ("Samples", Samples.SamplesDefault, (function PageTy.Samples _ -> true | _ -> false))
        ]

    let private appCard title blurb glyph link =
        a [cls "app-card"; attr.href link] [
            span [cls "app-icon"] [ text glyph ]
            div [cls "app-card-body"] [
                h3 [] [ text title ]
                p [] [ text blurb ]
            ]
            span [cls "app-arrow"] [ text "→" ]
        ]

    let private suiteCard title blurb link =
        a [cls "suite-card"; attr.href link] [
            h4 [] [ text title ]
            p [] [ text blurb ]
        ]

    let HomePage (_go: PageTy -> unit) =
        Doc.Concat [
            div [cls "hero"] [
                div [cls "container"] [
                    p [cls "eyebrow"] [ text "WebSharper.UI samples" ]
                    h1 [] [
                        text "A gallery of real "
                        span [cls "accent"] [ text "F#" ]
                        text " apps"
                    ]
                    p [cls "lead"] [
                        text "Reactive dashboards, boards, explorers and multi-step \
                              flows — all built with WebSharper.UI and compiled from F# \
                              to JavaScript. No framework, no server, no page reloads."
                    ]
                    div [cls "hero-actions"] [
                        a [cls "btn" ; cls "btn-primary" ; attr.href "#/samples/Dashboard"]
                            [ text "Open the dashboard" ]
                        a [cls "btn" ; cls "btn-default" ; attr.href "https://websharper.com"]
                            [ text "Get WebSharper" ]
                    ]
                    ul [cls "hero-stats"] [
                        li [] [ strong [] [ text "8" ] ; span [] [ text "complete apps" ] ]
                        li [] [ strong [] [ text "5" ] ; span [] [ text "guided suites" ] ]
                        li [] [ strong [] [ text "100%" ] ; span [] [ text "F# to JavaScript" ] ]
                    ]
                ]
            ]

            section [cls "block-large"] [
                div [cls "container"] [
                    div [cls "section-head"] [
                        h2 [] [ text "Featured apps" ]
                        p [cls "lead"] [ text "Substantive, self-contained single-page applications." ]
                    ]
                    div [cls "app-grid"] [
                        appCard "Dashboard" "Live KPIs, an animated trend chart and range controls driven by a timer." "◫" "#/samples/Dashboard"
                        appCard "Kanban board" "Drag-and-drop columns, priorities and live search over a reactive list model." "▤" "#/samples/KanbanBoard"
                        appCard "Expense tracker" "Record spending, filter by category and watch budget bars recalculate." "◎" "#/samples/ExpenseTracker"
                        appCard "Data explorer" "Async CSV loading with sorting, filtering, paging and row details." "⌗" "#/samples/DataExplorer"
                        appCard "Community board" "Login, threads and posts backed by a simulated async service." "✉" "#/samples/CommunityBoard"
                        appCard "Game of Life" "A cellular automaton with play/pause, speed control and generations." "◉" "#/samples/GameOfLife"
                        appCard "Onboarding flow" "A validated, animated multi-step flow with progress and review." "➜" "#/samples/OnboardingFlow"
                        appCard "Todos" "Priorities, filters, progress and bulk actions over a ListModel." "✓" "#/samples/TodoApp"
                    ]
                ]
            ]

            section [cls "block-large" ; cls "bg-alt"] [
                div [cls "container"] [
                    div [cls "section-head"] [
                        h2 [] [ text "Guided suites" ]
                        p [cls "lead"] [ text "Focused tours of one part of the library, several demos at a time." ]
                    ]
                    div [cls "suite-grid"] [
                        suiteCard "Reactive basics" "Vars, views, templates and a calculator." "#/samples/VarPlayground"
                        suiteCard "Collections & selection" "Filterable lists, editable records, check boxes and radios." "#/samples/CollectionsSuite"
                        suiteCard "Pointer & keyboard" "Live mouse and keyboard state with a visual keyboard." "#/samples/InputInspector"
                        suiteCard "Chart lab" "Animated CSV-driven bar charts and sortable SVG charts." "#/samples/ChartLab"
                        suiteCard "Mini-site" "A routed, animated multi-page site inside the gallery." "#/samples/MiniSite"
                    ]
                ]
            ]
        ]

    let NavBar (v: Var<PageTy>) =
        let renderLink (label, target, isActive) =
            View.FromVar v
            |> View.Map (fun page ->
                let active = if isActive page then cls "active" else Attr.Empty
                li [cls "nav-item"; active] [
                    Doc.Link label [] (fun () -> Var.Set v target)
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

    let RenderSample =
        function
        | Samples.Dashboard -> Dashboard.Sample.Page
        | Samples.KanbanBoard -> KanbanBoard.Sample.Page
        | Samples.ExpenseTracker -> ExpenseTracker.Sample.Page
        | Samples.DataExplorer -> DataExplorer.Sample.Page
        | Samples.TodoApp -> TodoApp.Sample.Page
        | Samples.CommunityBoard -> CommunityBoard.Sample.Page
        | Samples.GameOfLife -> GameOfLife.Sample.Page
        | Samples.OnboardingFlow -> OnboardingFlow.Sample.Page
        | Samples.VarPlayground -> VarPlayground.Sample.Page
        | Samples.CollectionsSuite -> CollectionsSuite.Sample.Page
        | Samples.InputInspector -> InputInspector.Sample.Page
        | Samples.ChartLab -> ChartLab.Sample.Page
        | Samples.MiniSite _ -> MiniSite.Sample.Page

    let Main (samples: list<Samples.Sample>) =
        let router = Router.Infer<PageTy>()
        let var = Router.InstallHash PageTy.Home router
        let go ty = Var.Set var ty
        let main =
            var.View.Doc(function
                | PageTy.Home -> HomePage go
                | PageTy.Samples pg -> RenderSample pg var samples
            )
        ShellTemplate()
            .Nav(NavBar var)
            .Main(main)
            .Bind()
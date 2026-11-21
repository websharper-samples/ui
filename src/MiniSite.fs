namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation

/// Suite: a routed, animated mini-site embedded in the gallery.
[<JavaScript>]
module MiniSite =

    type Page = Samples.MiniSitePage

    let showPage = function
        | Page.MiniHome -> "Home"
        | Page.MiniHistory -> "History"
        | Page.MiniGovernance -> "Governance"
        | Page.MiniTeam -> "The team"

    let pages =
        [ Page.MiniHome ; Page.MiniHistory ; Page.MiniGovernance ; Page.MiniTeam ]

    type Context = { Go : Page -> unit }

    let fadeTime = 300.0
    let fade =
        Anim.Simple Interpolation.Double Easing.CubicInOut fadeTime

    let fadeTransition =
        Trans.Create fade
        |> Trans.Enter (fun i -> fade 0.0 1.0)
        |> Trans.Exit (fun i -> fade 1.0 0.0)

    let navBar var =
        View.FromVar var
        |> View.Map (fun active ->
            let link page =
                li [
                    cls "nav-item"
                    Attr.DynamicClassPred "active" (View.Map ((=) page) var.View)
                ] [
                    Doc.Link (showPage page) [] (fun () -> Var.Set var page)
                ]
            nav [cls "navbar"] [
                ul [cls "nav"] (List.map link pages)
            ])
        |> Doc.EmbedView

    let pageCard title body =
        div [cls "card"] [
            div [cls "card-head"] [ h2 [] [ text title ] ]
            div [cls "card-body"] [ body ]
        ]

    let homePage (ctx: Context) =
        pageCard "Welcome!" (
            Doc.Concat [
                p [] [
                    text "Welcome to the IntelliFactory Bobsleigh Mini-Site — a \
                          small routed application embedded in this gallery."
                ]
                p [] [
                    text "Read about "
                    Doc.Link "the history" [] (fun () -> ctx.Go Page.MiniHistory)
                    text " of bobsleigh, the "
                    Doc.Link "governing body" [] (fun () -> ctx.Go Page.MiniGovernance)
                    text ", and the world-famous "
                    Doc.Link "IntelliFactory team" [] (fun () -> ctx.Go Page.MiniTeam)
                    text "."
                ]
            ]
        )

    let historyPage (_: Context) =
        pageCard "History" (
            Doc.Concat [
                p [] [
                    text "According to "
                    href "Wikipedia" "https://en.wikipedia.org/wiki/Bobsleigh"
                    text ", bobsleigh began when a St Moritz hotelier, frustrated by \
                          whole seasons without guests, organised the first races on \
                          the town's snow tracks."
                ]
                p [] [
                    text "Bobsleigh has been part of every Winter Olympics since the \
                          first games in 1924."
                ]
            ]
        )

    let governancePage (_: Context) =
        pageCard "Governance" (
            Doc.Concat [
                p [] [
                    text "The sport is overseen by the "
                    href "International Bobsleigh and Skeleton Federation" "https://www.ibsf.org/"
                    text ", founded in 1923. The federation regulates international \
                          competition, athlete conduct, and funding for training and \
                          education."
                ]
            ]
        )

    let teamPage (_: Context) =
        let members =
            [
                ("Adam", "granicz")
                ("András", "AndrasJanko")
                ("Anton (honorary member for life)", "t0yv0")
                ("István", "inchester23")
                ("Loic", "tarmil_")
                ("Sándor", "sandorrakonczai")
                ("Simon", "Simon_JF")
            ]
        pageCard "The IntelliFactory Bobsleigh Team" (
            Doc.Concat [
                p [] [
                    text "The world-famous IntelliFactory Bobsleigh Team was founded in \
                          2004 and currently consists of:"
                ]
                ul [cls "chip-list"] [
                    members
                    |> List.map (fun (name, handle) ->
                        li [] [ a [cls "chip"; attr.href ("https://www.twitter.com/" + handle)] [ text name ] ])
                    |> Doc.Concat
                ]
            ]
        )

    let content ctx pg =
        match pg with
        | Page.MiniHome -> homePage ctx
        | Page.MiniHistory -> historyPage ctx
        | Page.MiniGovernance -> governancePage ctx
        | Page.MiniTeam -> teamPage ctx

    let Main (current: Var<Samples.MiniSitePage>) =
        let ctx = { Go = Var.Set current }
        Doc.Concat [
            p [cls "sample-blurb"] [
                text "A multi-page site with its own URL routes, navigation and page \
                 transitions — nested inside the gallery router."
            ]
            navBar current
            div [
                cls "page-transition"
                Attr.AnimatedStyle "opacity" fadeTransition (View.Const 1.0) string
            ] [
                View.FromVar current
                |> View.Map (content ctx)
                |> Doc.EmbedView
            ]
        ]

    let Description _ =
        div [] [
            text "A routed multi-page mini-site with animated page transitions."
        ]

    let Sample =
        Samples.Routed(Samples.MiniSite, Samples.MiniHome, function
                | Samples.MiniSite x -> Some x
                | _ -> None)
            .Id("Mini-site")
            .FileName(__SOURCE_FILE__)
            .Keywords(["routing"; "site"])
            .Category(Samples.Suite)
            .Render(Main)
            .RenderDescription(Description)
            .Create()
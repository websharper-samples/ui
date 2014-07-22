namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper

module S = BobsleighSite

[<JavaScript>]
module RoutedBobsleighSite =

    let TheRouter =
        Router.Create
            (function
                | S.BobsleighHome -> Route.Create []
                | S.BobsleighHistory -> Route.Create [RouteFrag.Create "history"]
                | S.BobsleighGovernance -> Route.Create [RouteFrag.Create "governance"]
                | S.BobsleighTeam -> Route.Create [RouteFrag.Create "team"])
            (fun route ->
                match Route.ToStringList route with
                | [] -> S.BobsleighHome
                | ["history"] -> S.BobsleighHistory
                | ["governance"] -> S.BobsleighGovernance
                | ["team"] -> S.BobsleighTeam
                | xs -> S.BobsleighHome)

    let Main (current: Var<S.Page>) =

       // withNavbar adds a navigation bar at the top of the page.
        let withNavbar =
            Doc.Append (S.NavBar current)

        // Here, we create the sitelet. We supply the Create function
        // with the variable we created, and we get a continuation function,
        // go, which we can use to change the page.
       // MiniSitelet.Create m (fun go ->
        let ctx = {S.Go = Var.Set current}
        View.FromVar current
        |> View.Map (fun pg ->
            match pg with
            | S.BobsleighHome -> S.HomePage ctx |> withNavbar
            | S.BobsleighHistory -> S.History ctx |> withNavbar
            | S.BobsleighGovernance -> S.Governance ctx |> withNavbar
            | S.BobsleighTeam -> S.Team ctx |> withNavbar)
        |> Doc.EmbedView

    let description v =
        div [
            txt
                "A small website about bobsleighs, demonstrating how UI.Next \
                 may be used to structure single-page applications. Routed using \
                 the URL."
        ]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Routed(TheRouter, S.BobsleighHome)
            .Id("RoutedBobsleighMiniSite")
            .FileName(__SOURCE_FILE__)
            .Keywords(["text"])
            .Render(Main)
            .RenderDescription(description)
            .Create()
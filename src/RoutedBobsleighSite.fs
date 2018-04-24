namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
module Router = WebSharper.Sitelets.Router
module S = BobsleighSite

[<JavaScript>]
module RoutedBobsleighSite =

    let Main (current: Var<Samples.BobsleighSitePage>) =

       // withNavbar adds a navigation bar at the top of the page.
        let withNavbar =
            Doc.Append (S.NavBar current)

        // Here, we create the sitelet. We supply the Create function
        // with the variable we created, and we get a continuation function,
        // go, which we can use to change the page.
        let ctx = {S.Go = Var.Set current}
        View.FromVar current
        |> View.Map (fun pg ->
            match pg with
            | Samples.BobsleighHome -> S.HomePage ctx |> withNavbar
            | Samples.BobsleighHistory -> S.History ctx |> withNavbar
            | Samples.BobsleighGovernance -> S.Governance ctx |> withNavbar
            | Samples.BobsleighTeam -> S.Team ctx |> withNavbar)
        |> Doc.EmbedView

    let description v =
        div [] [
            text
                "A small website about bobsleighs, demonstrating how UI \
                 may be used to structure single-page applications. Routed using \
                 the URL."
        ]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Routed(Samples.RoutedBobsleighSite, Samples.BobsleighHome, function
                | Samples.RoutedBobsleighSite x -> Some x
                | _ -> None)
            .Id("RoutedBobsleighSite")
            .FileName(__SOURCE_FILE__)
            .Keywords(["text"])
            .Render(Main)
            .RenderDescription(description)
            .Create()

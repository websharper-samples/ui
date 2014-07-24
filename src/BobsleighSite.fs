namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.UI.Next.Html
open IntelliFactory.WebSharper.UI.Next.Notation

// A small example of a single-page mini-sitelet.
// See this live at http://intellifactory.github.io/websharper.ui.next/#MiniSiteletTest.fs !

[<JavaScript>]
module BobsleighSite =

    // Page is a record that we use to represent the current page we're on.
    // Notice that this doesn't specify anything about the rendering of the
    // page. That comes later.
    type Page =
        | BobsleighHome
        | BobsleighHistory
        | BobsleighGovernance
        | BobsleighTeam

    // Sets the variable to a given action, changing the page. This can be
    // called from anywhere.
    let GlobalGo var (act : Page) =
        Var.Set var act

    // Gives a textual representation of a Page type. We use this in the Navabr.
    let showAct = function
        | BobsleighHome -> "Home"
        | BobsleighHistory -> "History"
        | BobsleighGovernance -> "Governance"
        | BobsleighTeam -> "The IntelliFactory Bobsleigh Team"

    // A list of pages in the site
    let pages = [ BobsleighHome ; BobsleighHistory ; BobsleighGovernance ; BobsleighTeam ]

    // A record containing a continuation function we can use within pages.
    type Context = {
        Go : Page -> unit
    }

    // Creates a navigation bar using the variable containing the current page.
    let NavBar var =
        View.FromVar var
        |> View.Map (fun active ->

            let renderLink action =
                let attr = if action = active then cls "active" else Attr.Empty

                LI [attr] [
                    link (showAct action) [] (fun _ -> GlobalGo var action)
                ]

            Nav [cls "navbar" ; cls "navbar-default" ; Attr.Create "role" "navigation"] [
                UL [cls "nav" ; cls "navbar-nav"] [
                    List.map renderLink pages |> Doc.Concat
                ]
            ])
        |> Doc.EmbedView

    // Each page takes the context record we created earlier. We could also just have it
    // taking the continuation function.
    // To change the page, we call this function with the action we want to perform.
    let HomePage ctx =
        Doc.Concat [
            Div [] [
                H1 [] [txt "Welcome!"]
                P [] [
                    txt "Welcome to the IntelliFactory Bobsleigh MiniSite!"
                ]
                P [] [
                    txt "Here you can find out about the "
                    link "history" [] (fun () -> ctx.Go BobsleighHistory)
                    txt " of bobsleighs, the "
                    link "International Bobsleigh and Skeleton Federation" [] (fun () -> ctx.Go BobsleighGovernance)
                    txt ", which serve as the governing body for the sport, and finally the world-famous "
                    link "IntelliFactory Bobsleigh Team." [] (fun () -> ctx.Go BobsleighTeam)
                ]
            ]
        ]

    let History ctx =
        Doc.Concat [
            Div [] [
                H1 [] [txt "History"]
                P [] [
                    txt "According to "
                    href "Wikipedia" "http://en.wikipedia.org/wiki/Bobsleigh"
                    txt ", the beginnings of bobsleigh came about due to a hotelier \
                         becoming increasingly frustrated about having entire seasons \
                         where he could not rent out his properties. In response, he got \
                         a few people interested, and the Swiss town of St Moritz became \
                         the home of the first bobsleigh races."
                ]
                P [] [
                    txt "Bobsleigh races have been a regular event at the Winter Olympics \
                         since the very first competition in 1924."
                ]
            ]
        ]

    let Governance ctx =
        Doc.Concat [
            Div [] [
                H1 [] [txt "Governance"]
                P [] [
                    txt "The sport is overseen by the "
                    href "International Bobsleigh and Skeleton Federation" "http://www.fibt.com/"
                    txt ", an organisation founded in 1923. \
                         The organisation governs all international competitions, \
                         acting as a body to regulate athletes' conduct, as well as \
                         providing funding for training and education."
                ]
            ]
        ]

    let Team ctx =
        let teamMembers =
            [("Adam", "granicz") ; ("András", "AndrasJanko") ; ("Anton", "t0yv0") ;
             ("István", "inchester23") ; ("Loic", "tarmil_") ; ("Sándor", "sandorrakonczai")
             ("Simon", "Simon_JF")]

        Doc.Concat [
            Div [] [
                H1 [] [txt "The IntelliFactory Bobsleigh Team"]
                P [] [
                    txt "The world-famous IntelliFactory Bobsleigh Team was founded \
                         in 2004, and currently consists of:"
                ]
                P [] [
                    UL [] [
                        teamMembers
                        |> List.map (fun (name, handle) ->
                            LI [] [href name ("http://www.twitter.com/" + handle)])
                        |> Doc.Concat
                    ]
                ]
            ]
        ]

    // Here we define the sitelet.
    let Main () =
        // We first create a variable to hold our current page.
        let m = Var.Create BobsleighHome

        // withNavbar adds a navigation bar at the top of the page.
        let withNavbar =
            Doc.Append (NavBar m)

        // Here, we create the sitelet. We supply the Create function
        // with the variable we created, and we get a continuation function,
        // go, which we can use to change the page.
       // MiniSitelet.Create m (fun go ->
        let ctx = {Go = Var.Set m}
        View.FromVar m
        |> View.Map (fun pg ->
            match pg with
            | BobsleighHome -> HomePage ctx |> withNavbar
            | BobsleighHistory -> History ctx |> withNavbar
            | BobsleighGovernance -> Governance ctx |> withNavbar
            | BobsleighTeam -> Team ctx |> withNavbar)
        |> Doc.EmbedView

    let description () =
        div [
            txt "A small website about bobsleighs, demonstrating how UI.Next \
                 may be used to structure single-page applications."
        ]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build()
            .Id("BobsleighMiniSite")
            .FileName(__SOURCE_FILE__)
            .Keywords(["text"])
            .Render(Main)
            .RenderDescription(description)
            .Create()
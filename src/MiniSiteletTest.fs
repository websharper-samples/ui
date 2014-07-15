namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.UI.Next.Notation
open IntelliFactory.WebSharper.UI.Next.MiniSitelet

// A small example of a single-page mini-sitelet.
// See this live at http://intellifactory.github.io/websharper.ui.next/#MiniSiteletTest.fs !

[<JavaScript>]
module MiniSiteletTest =

    // Page is a record that we use to represent the current page we're on.
    // Notice that this doesn't specify anything about the rendering of the
    // page. That comes later.
    type Page =
        | P1
        | P2 of int
        | P3

    // Sets the variable to a given action, changing the page. This can be
    // called from anywhere.
    let GlobalGo var (act : Page) =
        Var.Set var act

    // Gives a textual representation of a Page type. We use this in the Navabr.
    let showAct = function
        | P1 -> "Page 1"
        | P2 i -> "Page 2 (" + string(i) + ")"
        | P3 -> "Page 3"

    // A list of pages in the site
    let pages = [P1 ; P2 0 ; P2 1 ; P3]

    // A record containing a continuation function we can use within pages.
    type Context = {
        Go : Page -> unit
    }

    // Creates a navigation bar using the variable containing the current page.
    let NavBar var =
        View.FromVar var
        |> View.Map (fun active ->

            let evtLink act =
                Doc.ElementWithEvents "a" ["href" ==> "#"]
                    [EventHandler.CreateHandler "click" (fun _ -> GlobalGo var act)]

            let renderLink action =
                let attr = if action = active then cls "active" else Attr.Empty

                elA "li" [attr] [
                    evtLink action [
                        showAct action |> txt
                    ]
                ]

            elA "nav" [cls "navbar" ; cls "navbar-default" ; Attr.Create "role" "navigation"] [
                elA "ul" [cls "nav" ; cls "navbar-nav"] [
                    List.map renderLink pages |> Doc.Concat
                ]
            ])
        |> Doc.EmbedView

    // Each page takes the context record we created earlier. We could also just have it
    // taking the continuation function.
    // To change the page, we call this function with the action we want to perform.
    let Page1 ctx =
        Doc.Concat [
            el "div" [
                el "h1" [Doc.TextNode "Page 1"]
                el "p" [Doc.TextNode "Some exciting content from page 1!"]
                Doc.Button "Go to P2/0" [cls "btn" ; cls "btn-default"] (fun () -> ctx.Go (P2 0))
                Doc.Button "Go to P2/1" [cls "btn" ; cls "btn-default"] (fun () -> ctx.Go (P2 1))
            ]
        ]

    let Page2 ctx (v: int) =
        Doc.Concat [
            el "div" [
                el "h1" [Doc.TextNode "Page 2"]
                el "p" [Doc.TextNode <| "Some exciting content from page 2 (" + string(v) + ") !"]
                Doc.Button "Go to P1" [cls "btn" ; cls "btn-default"] (fun () -> ctx.Go P1)
                Doc.Button "Go to P3" [cls "btn" ; cls "btn-default"] (fun () -> ctx.Go P3)
            ]
        ]

    let Page3 ctx =
        Doc.Concat [
            el "div" [
                el "h1" [Doc.TextNode "Page 3"]
                el "p" [Doc.TextNode "Some exciting content from page 3!"]
                Doc.Button "Go to P1" [cls "btn" ; cls "btn-default"] (fun () -> ctx.Go P1)
            ]
        ]

    // Here we define the sitelet.
    let Main () =
        // We first create a variable to hold our current page
        let m = Var.Create P1

        // withNavbar adds a navigation bar at the top of the page.
        let withNavbar =
            Doc.Append (NavBar m)

        // Here, we create the sitelet. We supply the Create function
        // with the variable we created, and we get a continuation function,
        // go, which we can use to change the page.
        MiniSitelet.Create m (fun go ->
            // Here, we wrap the continuation function in a context record.
            // We could just as easily pass the continuation into a function,
            // however.
            let ctx = { Go = go }
            let controller = function
                | P1 -> Page1 ctx |> withNavbar
                | P2 d -> Page2 ctx d |> withNavbar
                | P3 -> Page3 ctx |> withNavbar
            controller)

    let description =
        div [
            Doc.TextNode "A small sitelet example"
        ]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build()
            .Id("MiniSitelet Example")
            .FileName(__SOURCE_FILE__)
            .Keywords(["text"])
            .Render(Main ())
            .RenderDescription(description)
            .Create()
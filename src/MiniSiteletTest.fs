namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.UI.Next.Notation

// A small example of a single-page mini-sitelet.
// See this live at http://intellifactory.github.io/websharper.ui.next/#MiniSiteletTest.fs !

[<JavaScript>]
module MiniSiteletTest =
    type Action =
        | A1
        | A2 of int
        | A3

    type Context =
        {
            Go : Action -> unit
        }

    let GlobalGo var (act : Action) =
        Var.Set var act

    let showAct = function
        | A1 -> "Page 1"
        | A2 i -> "Page 2 (" + string(i) + ")"
        | A3 -> "Page 3"

    let pages = [A1 ; A2 0 ; A2 1 ; A3]

    let NavBar var =
        View.FromVar var
        |> View.Map (fun active ->

            let evtLink act =
                Doc.ElementWithEvents "a" [Attr.Create "href" "#"]
                    [EventHandler.CreateHandler "click" (fun _ -> GlobalGo var act)]

            let renderLink action =
                let attr =
                    if action = active then
                        cls "active"
                    else Attr.Empty
                elA "li" [attr] [
                    evtLink action [
                        Doc.TextNode <| showAct action
                    ]
                ]

            elA "nav" [cls "navbar" ; cls "navbar-default" ; Attr.Create "role" "navigation"] [
                elA "ul" [cls "nav" ; cls "navbar-nav"] [
                    List.map renderLink pages |> Doc.Concat
                ]
            ])
        |> Doc.EmbedView

    let Page1 ctx =
        Doc.Concat [
            el "div" [
                el "h1" [Doc.TextNode "Page 1"]
                el "p" [Doc.TextNode "Some exciting content from page 1!"]
                Doc.Button "Go to P2/0" [cls "btn" ; cls "btn-default"] (fun () -> ctx.Go (A2 0))
                Doc.Button "Go to P2/1" [cls "btn" ; cls "btn-default"] (fun () -> ctx.Go (A2 1))
            ]
        ]

    let Page2 ctx (v: int) =
        Doc.Concat [
            el "div" [
                el "h1" [Doc.TextNode "Page 2"]
                el "p" [Doc.TextNode <| "Some exciting content from page 2 (" + string(v) + ") !"]
                Doc.Button "Go to P1" [cls "btn" ; cls "btn-default"] (fun () -> ctx.Go A1)
                Doc.Button "Go to P3" [cls "btn" ; cls "btn-default"] (fun () -> ctx.Go A3)
            ]
        ]

    let Page3 ctx =
        Doc.Concat [
            el "div" [
                el "h1" [Doc.TextNode "Page 3"]
                el "p" [Doc.TextNode "Some exciting content from page 3!"]
                Doc.Button "Go to P1" [cls "btn" ; cls "btn-default"] (fun () -> ctx.Go A1)
            ]
        ]

    // Var<Action> is the model for the page we're currently displaying to
    // the user.
    // We should be able to do local / global actions: local actions are
    // specific to each individual page, whereas global ones can happen on
    // any page.
    // Essentially Pack allows the composition of the var and the pages.
    // "Outside forces" should be able to set `model', and the page should
    // update accordingly. Similarly, the Pack function should allow the
    // local changes to also set the variable.
    let Pack (model: Var<'T>) (main: ('T -> unit) -> ('T -> Doc)) : Doc =
        View.FromVar model
        |> View.Map (main (Var.Set model))
        |> Doc.EmbedView

    let Main () =
        let m = Var.Create A1
        Pack m (fun go ->
            let ctx = { Go = go }
            let controller = function
                | A1 -> Doc.Append (NavBar m) (Page1 ctx)
                | A2 d -> Doc.Append (NavBar m) (Page2 ctx d)
                | A3 -> Doc.Append (NavBar m) (Page3 ctx)
            controller)

    let description =
        Doc.Element "div" [] [
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
namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper

[<JavaScript>]
module Messy =

    type Action =
        | HOME
        | A
        | B
        | NF

    let TheRouter =
        Router.Create
            (function
                | HOME -> Route.Create []
                | A -> Route.Create [RouteFrag.Create "a"]
                | B -> Route.Create [RouteFrag.Create "b"]
                | NF -> Route.Create [RouteFrag.Create "not-found"])
            (fun route ->
                match List.map RouteFrag.Text (Seq.toList (Route.Frags route)) with
                | [] -> HOME
                | ["a"] -> A
                | ["b"] -> B
                | xs -> NF)

    let Desc (current: Var<Action>) =
        Doc.TextNode "S2/DESC"

    let Main (current: Var<Action>) =
        Doc.Concat [
            current.View
            |> View.Map (function
                | HOME -> "HOME"
                | A -> "A"
                | B -> "B"
                | NF -> "NF")
            |> Doc.TextView
            Doc.Button "A2" [] (fun () -> current.Value <- A)
            Doc.Button "B2" [] (fun () -> current.Value <- B)
            Doc.Button "H2" [] (fun () -> current.Value <- HOME)
        ]

    let Sample =
        Samples.Routed(TheRouter, HOME)
            .Id("Sub-Routing")
            .FileName(__SOURCE_FILE__)
            .Render(Main)
            .RenderDescription(Desc)
            .Create()
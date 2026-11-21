namespace WebSharper.UI

open WebSharper
open WebSharper.JavaScript
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation

/// App: Conway's Game of Life on a reactive grid.
[<JavaScript>]
module GameOfLife =

    let width = 34
    let height = 22

    type Grid = bool []

    let index x y = y * width + x

    let emptyGrid () = Array.init (width * height) (fun _ -> false)

    let glider () =
        let g = emptyGrid ()
        let place x y = g.[index x y] <- true
        place 2 2
        place 3 3
        place 4 1
        place 4 2
        place 4 3
        g

    let randomize () =
        let g = emptyGrid ()
        for i in 0 .. g.Length - 1 do
            g.[i] <- Math.Random() < 0.28
        g

    let neighbours (g: Grid) x y =
        let mutable count = 0
        for dy in -1 .. 1 do
            for dx in -1 .. 1 do
                if dx <> 0 || dy <> 0 then
                    let nx = (x + dx + width) % width
                    let ny = (y + dy + height) % height
                    if g.[index nx ny] then count <- count + 1
        count

    let step (g: Grid) =
        let next = emptyGrid ()
        for y in 0 .. height - 1 do
            for x in 0 .. width - 1 do
                let alive = g.[index x y]
                let n = neighbours g x y
                next.[index x y] <- (alive && (n = 2 || n = 3)) || (not alive && n = 3)
        next

    let population (g: Grid) =
        g |> Array.filter id |> Array.length

    let Main _ =
        let grid = Var.Create (glider ())
        let running = Var.Create false
        let speed = Var.Create 1
        let generation = Var.Create 0

        let tick () =
            if running.Value then
                for _ in 1 .. speed.Value do
                    grid.Value <- step grid.Value
                generation.Value <- generation.Value + 1

        JS.SetInterval tick 420 |> ignore

        let renderCell i alive =
            div [
                cls "life-cell"
                cls (if alive then "alive" else "dead")
                on.click (fun _ _ ->
                    let g = Array.copy grid.Value
                    g.[i] <- not g.[i]
                    grid.Value <- g)
            ] []

        let board =
            grid.View
            |> View.Map (fun (g: Grid) ->
                div [cls "life-grid"; Attr.Style "grid-template-columns" (sprintf "repeat(%d, 1fr)" width)] (
                    g
                    |> Array.mapi renderCell
                    |> Array.toList))
            |> Doc.EmbedView

        let controls =
            div [cls "toolbar"] [
                button [
                    cls "btn"
                    cls "btn-primary"
                    on.click (fun _ _ -> running.Value <- not running.Value)
                ] [
                    running.View
                    |> View.Map (fun r -> if r then "Pause" else "Play")
                    |> textView
                ]
                Doc.Button "Step" [cls "btn"; cls "btn-ghost"]
                    (fun () ->
                        grid.Value <- step grid.Value
                        generation.Value <- generation.Value + 1)
                Doc.Button "Glider" [cls "btn"; cls "btn-ghost"]
                    (fun () ->
                        grid.Value <- glider ()
                        generation.Value <- 0)
                Doc.Button "Random" [cls "btn"; cls "btn-ghost"]
                    (fun () ->
                        grid.Value <- randomize ()
                        generation.Value <- 0)
                Doc.Button "Clear" [cls "btn"; cls "btn-ghost"]
                    (fun () ->
                        grid.Value <- emptyGrid ()
                        generation.Value <- 0)
                div [cls "toolbar-right"] [
                    label [cls "inline-label"] [ text "Steps / tick" ]
                    Doc.InputType.Select
                        [cls "form-control"; cls "select-compact"]
                        string
                        [1 ; 2 ; 4]
                        speed
                ]
            ]

        Doc.Concat [
            p [cls "sample-blurb"] [
                text "A cellular automaton rendered as a reactive grid. Click cells to \
                 draw, then run the simulation."
            ]
            div [] [
                controls
                div [cls "life-metrics"] [
                    generation.View
                    |> View.Map (fun gen ->
                        statTile "Generation" (string gen) "ticks so far")
                    |> Doc.EmbedView
                    grid.View
                    |> View.Map (fun g ->
                        statTile "Alive" (string (population g)) "cells")
                    |> Doc.EmbedView
                    statTile "Rules" "B3/S23" "Conway's classic"
                ]
                card "Board" board
            ]
        ]

    let Description _ =
        div [] [
            text "Conway's Game of Life on a reactive grid with timers and controls."
        ]

    let Sample =
        Samples.Build(Samples.GameOfLife)
            .Id("Game of Life")
            .FileName(__SOURCE_FILE__)
            .Keywords(["app"; "timer"; "grid"])
            .Category(Samples.App)
            .Render(Main)
            .RenderDescription(Description)
            .Create()
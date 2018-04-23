namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Input
open WebSharper.UI.Html

// An example of a div chasing the mouse, displaying mouse co-ordinates.
// See this live at http://intellifactory.github.io/websharper.ui.next/#MouseChase.fs !

[<JavaScript>]
module MouseInfo =

    let Main _ =
        // Mouse.Position is a View<int * int>, which is a tuple of (X, Y) co-ords.
        let xView = View.Map fst Mouse.Position
        let yView = View.Map snd Mouse.Position
        let lastHeldPos = View.UpdateWhile (0,0) Mouse.LeftPressed Mouse.Position
        let lastClickPos = View.SnapshotOn (0,0) Mouse.LeftPressed Mouse.Position

        let mouseDiv =
            div [] [
                p [] [
                    View.Map (fun x -> "X: " + string(x)) xView |> textView
                    View.Map (fun y -> "Y: " + string(y)) yView |> textView]
                // Mouse.[Left/Middle/Right] are View<bool>s, specifying whether the
                // button has been pressed.
                p [] [View.Map (fun l -> "Left button pressed: " + string(l))
                        Mouse.LeftPressed |> textView]
                p [] [View.Map (fun m -> "Middle button pressed: " + string(m))
                        Mouse.MiddlePressed |> textView]
                p [] [View.Map (fun r -> "Right button pressed: " + string(r))
                        Mouse.RightPressed |> textView]
                p [] [View.Map (fun (x, y) -> "Position on last left click: (" + (string x) + "," + (string y) + ")")
                        lastClickPos |> textView]
                p [] [View.Map (fun (x, y) -> "Position of mouse while left button held: (" + (string x) + "," + (string y) + ")")
                        lastHeldPos |> textView]
            ]

        mouseDiv

    let Description _ =
        div [] [
            text "Shows information about the mouse"
        ]

    let Sample =
        Samples.Build(Samples.MouseInfo)
            .Id("MouseInfo")
            .FileName(__SOURCE_FILE__)
            .Keywords(["mouse"])
            .Render(Main)
            .RenderDescription(Description)
            .Create()

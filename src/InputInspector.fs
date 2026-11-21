namespace WebSharper.UI

open WebSharper
open WebSharper.JavaScript
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation
open WebSharper.UI.Input

/// Suite: pointer and keyboard state exposed as reactive views.
[<JavaScript>]
module InputInspector =

    [<Direct "String.fromCharCode($k)">]
    let keyChar (k: Key) = ""

    [<Direct "$s.charCodeAt(0)">]
    let keyCode (s: string) = 0

    let private keyName (k: Key) =
        let c = keyChar k
        if c = "" then sprintf "#%d" k else c.ToUpper()

    // ---------------------------------------------------------------- pointer

    let PointerDemo () =
        let xView = View.Map fst Mouse.Position
        let yView = View.Map snd Mouse.Position
        let lastClick = View.SnapshotOn (0, 0) Mouse.LeftPressed Mouse.Position
        let held = View.UpdateWhile (0, 0) Mouse.LeftPressed Mouse.Position

        let padPoint = Var.Create (0, 0)

        let dot =
            span [
                cls "mouse-dot"
                Attr.DynamicStyle "left" (View.Map (fun (x, _) -> string x + "px") padPoint.View)
                Attr.DynamicStyle "top" (View.Map (fun (_, y) -> string y + "px") padPoint.View)
            ] []

        let stateRow label (v: View<string>) =
            div [cls "state-row"] [
                span [cls "state-label"] [ text label ]
                span [cls "state-value"] [ textView v ]
            ]

        div [cls "grid-2"] [
            div [] [
                stateRow "Pointer" (View.Map2 (fun x y -> sprintf "%d, %d" x y) xView yView)
                stateRow "Left button" (View.Map (fun b -> if b then "pressed" else "up") Mouse.LeftPressed)
                stateRow "Middle button" (View.Map (fun b -> if b then "pressed" else "up") Mouse.MiddlePressed)
                stateRow "Right button" (View.Map (fun b -> if b then "pressed" else "up") Mouse.RightPressed)
                stateRow "Last left click"
                    (View.Map (fun (x, y) -> sprintf "%d, %d" x y) lastClick)
                stateRow "Held at"
                    (View.Map (fun (x, y) -> sprintf "%d, %d" x y) held)
            ]
            div [] [
                h4 [] [ text "Click pad" ]
                div [
                    cls "mouse-pad"
                    on.click (fun _ (e: Dom.MouseEvent) ->
                        padPoint.Value <- (int e.OffsetX, int e.OffsetY))
                ] [ dot ]
                p [cls "muted"] [
                    text "Click inside the pad to place the marker at "
                    textView (View.Map (fun (x, y) -> sprintf "%d × %d" x y) padPoint.View)
                    text "."
                ]
            ]
        ]

    // --------------------------------------------------------------- keyboard

    let KeyboardDemo () =
        let rows =
            [
                [ "Q" ; "W" ; "E" ; "R" ; "T" ; "Y" ; "U" ; "I" ; "O" ; "P" ]
                [ "A" ; "S" ; "D" ; "F" ; "G" ; "H" ; "J" ; "K" ; "L" ]
                [ "Z" ; "X" ; "C" ; "V" ; "B" ; "N" ; "M" ]
            ]

        let key label =
            span [
                cls "key"
                Attr.DynamicClassPred "active" (Keyboard.IsPressed (keyCode label))
            ] [ text label ]

        let pressedNames =
            Keyboard.KeysPressed
            |> View.Map (fun keys ->
                if List.isEmpty keys then "—"
                else keys |> List.map keyName |> String.concat " ")

        div [cls "grid-2"] [
            div [] [
                div [cls "keyboard"] (
                    rows |> List.map (fun row -> div [cls "keyboard-row"] (List.map key row))
                )
                p [cls "muted"] [ text "Press keys on your keyboard to light them up." ]
            ]
            div [] [
                div [cls "state-row"] [
                    span [cls "state-label"] [ text "Pressed keys" ]
                    span [cls "state-value"] [ textView pressedNames ]
                ]
                div [cls "state-row"] [
                    span [cls "state-label"] [ text "Last key" ]
                    span [cls "state-value"] [ textView (View.Map keyName Keyboard.LastPressed) ]
                ]
                div [cls "state-row"] [
                    span [cls "state-label"] [ text "Is “A” pressed?" ]
                    span [cls "state-value"] [
                        textView (
                            Keyboard.IsPressed (keyCode "A")
                            |> View.Map (fun p -> if p then "yes" else "no"))
                    ]
                ]
                p [cls "muted"] [
                    text "The highlighted keys and values are just views over the \
                          browser's keyboard state."
                ]
            ]
        ]

    // ------------------------------------------------------------------ page

    let Main _ =
        Doc.Concat [
            p [cls "sample-blurb"] [
                text "Mouse and keyboard input exposed as first-class time-varying values."
            ]
            cardWithHint "Pointer inspector"
                "Live coordinates, button state, click history and a clickable pad."
                (PointerDemo ())
            cardWithHint "Keyboard inspector"
                "Pressed-key highlighting and last-key tracking."
                (KeyboardDemo ())
        ]

    let Description _ =
        div [] [
            text "Live pointer and keyboard state, rendered with ordinary views."
        ]

    let Sample =
        Samples.Build(Samples.InputInspector)
            .Id("Pointer & keyboard")
            .FileName(__SOURCE_FILE__)
            .Keywords(["mouse"; "keyboard"; "input"])
            .Category(Samples.Suite)
            .Render(Main)
            .RenderDescription(Description)
            .Create()
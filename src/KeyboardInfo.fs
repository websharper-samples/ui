namespace WebSharper.UI.Next

open WebSharper
open WebSharper.UI.Next.Html
open WebSharper.UI.Next.Client
open WebSharper.UI.Next.Input

open System

[<JavaScript>]
module KeyboardInfo =

    // Some utility things
    [<Direct "String.fromCharCode($c)">]
    let ToChar (c: Key) = ""

    [<Direct "$c.charCodeAt(0)">]
    let ToKey (c: string) = 0

    let commaList xs =
        let rec addCommas = function
            | [] -> ""
            | x :: [] -> string(x)
            | x :: xs -> string(x) + ", " + addCommas xs

        "[" + addCommas xs + "]"

    // "keys" is a View<Key list> of all keys currently pressed.
    let keys = Keyboard.KeysPressed

    let Main () =
        div [
            p [
                text "Keys pressed (key codes): "
                textView (View.Map
                    (fun xs -> List.map string xs |> commaList) keys)
            ]

            p [
                text "Keys pressed: "
                textView (View.Map (fun xs ->
                    List.map ToChar xs
                    |> commaList) keys)
            ]

            p [
                text "Last pressed key: "
                // Input.Keyboard.LastPressed is a View<Key>
                textView <| View.Map string Keyboard.LastPressed
            ]

            p [
                text "Is 'A' pressed? "
                textView <| View.Map (fun x -> if x then "Yes" else "No")
                    (Keyboard.IsPressed (ToKey "A"))
            ]

        ]

    let Description () =
        div [
            text "Information about the current keyboard state"
        ]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build()
            .Id("KeyboardInfo")
            .FileName(__SOURCE_FILE__)
            .Keywords(["text"])
            .Render(Main)
            .RenderDescription(Description)
            .Create()
namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.UI.Next.Html
open IntelliFactory.WebSharper.UI.Next.Input

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
    let keys = Input.Keyboard.KeysPressed

    let Main () =
        Div0 [
            P0 [
                Doc.TextNode "Keys pressed (key codes): "
                Doc.TextView (View.Map
                    (fun xs -> List.map string xs |> commaList) keys)
            ]

            P0 [
                Doc.TextNode "Keys pressed: "
                Doc.TextView (View.Map (fun xs ->
                    List.map ToChar xs
                    |> commaList) keys)
            ]

            P0 [
                Doc.TextNode "Last pressed key: "
                // Input.Keyboard.LastPressed is a View<Key>
                Doc.TextView <| View.Map string Input.Keyboard.LastPressed
            ]

            P0 [
                Doc.TextNode "Is 'A' pressed? "
                Doc.TextView <| View.Map (fun x -> if x then "Yes" else "No")
                    (Input.Keyboard.IsPressed (ToKey "A"))
            ]

        ]

    let Description () =
        Div0 [
            Doc.TextNode "Information about the current keyboard state"
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
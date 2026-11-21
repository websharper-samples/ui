namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation

/// Suite: the fundamental reactive building blocks — vars, views, templates
/// and a small model-driven calculator.
[<JavaScript>]
module VarPlayground =

    type ViewTemplate = Templating.Template<"InputTransformTemplate.html">

    // ------------------------------------------------------------------ text

    let TextDemo () =
        let rvText = Var.Create ""
        let view = View.FromVar rvText

        let caps = view |> View.Map (fun s -> s.ToUpper ())
        let reversed = view |> View.Map (fun s -> new string (Array.rev (s.ToCharArray ())))
        let wordCount =
            view
            |> View.Map (fun s ->
                s.Split([| ' ' |])
                |> Array.filter (fun w -> w <> "")
                |> Array.length)
        let oddEven =
            view
            |> View.Map (fun s ->
                let n =
                    s.Split([| ' ' |])
                    |> Array.filter (fun w -> w <> "")
                    |> Array.length
                if n % 2 = 0 then "Even" else "Odd")
        let palindrome =
            view
            |> View.Map (fun s ->
                let clean =
                    s.ToLower ()
                    |> Seq.filter (fun c -> c >= 'a' && c <= 'z')
                    |> Seq.toArray
                clean = Array.rev clean && clean.Length > 0)

        let row label (v: View<string>) =
            tr [] [ td [] [ text label ] ; td [] [ textView v ] ]

        div [] [
            div [cls "field"] [
                label [] [ text "Write something" ]
                Doc.InputType.Text
                    [ cls "form-control" ; attr.placeholder "Try a phrase or a palindrome…" ]
                    rvText
            ]
            table [cls "table"] [
                tbody [] [
                    row "Entered text" view
                    row "Capitalised" caps
                    row "Reversed" reversed
                    row "Word count" (View.Map string wordCount)
                    row "Odd or even" oddEven
                    row "Is a palindrome?" (View.Map (fun b -> if b then "Yes" else "No") palindrome)
                ]
            ]
        ]

    // -------------------------------------------------------------- template

    let TemplateDemo () =
        let rvText = Var.Create ""
        let view = View.FromVar rvText

        let caps = view |> View.Map (fun s -> s.ToUpper ())
        let reversed = view |> View.Map (fun s -> new string (Array.rev (s.ToCharArray ())))
        let wordCount =
            view
            |> View.Map (fun s ->
                s.Split([| ' ' |])
                |> Array.filter (fun w -> w <> "")
                |> Array.length)
        let oddEven =
            view
            |> View.Map (fun s ->
                let n =
                    s.Split([| ' ' |])
                    |> Array.filter (fun w -> w <> "")
                    |> Array.length
                if n % 2 = 0 then "Even" else "Odd")

        let views =
            [
                ("Entered text", view)
                ("Capitalised", caps)
                ("Reversed", reversed)
                ("Word count", View.Map string wordCount)
                ("Odd or even", oddEven)
            ]

        ViewTemplate()
            .inputText(rvText)
            .tableBody(
                views
                |> List.map (fun (lbl, v) ->
                    ViewTemplate.tableRow().lbl(lbl).view(v).Doc())
            )
            .Doc()

    // ------------------------------------------------------------ calculator

    type Op = Add | Sub | Mul | Div

    type Calculator =
        { Memory : int ; Operand : int ; Operation : Op }

    let initCalc = { Memory = 0 ; Operand = 0 ; Operation = Add }

    let pushInt x rvCalc =
        Var.Update rvCalc (fun c -> { c with Operand = c.Operand * 10 + x })

    let shiftToMem op rvCalc =
        Var.Update rvCalc (fun c ->
            { c with Memory = c.Operand ; Operand = 0 ; Operation = op })

    let opFn op =
        match op with
        | Add -> (+)
        | Sub -> (-)
        | Mul -> (*)
        | Div -> (/)

    let showOp op =
        match op with
        | Add -> "+"
        | Sub -> "−"
        | Mul -> "×"
        | Div -> "÷"

    let calculate rvCalc =
        Var.Update rvCalc (fun c ->
            let ans = (opFn c.Operation) c.Memory c.Operand
            { c with Memory = 0 ; Operand = ans ; Operation = Add })

    let CalculatorDemo () =
        let rvCalc = Var.Create initCalc
        let button txt extra f = Doc.Button txt (cls "calc-key" :: extra) f
        let digit i = button (string i) [] (fun _ -> pushInt i rvCalc)
        let op o = button (showOp o) [cls "calc-key-op"] (fun _ -> shiftToMem o rvCalc)
        let display =
            View.FromVar rvCalc
            |> View.Map (fun c -> string c.Operand)
            |> textView

        div [cls "calculator"] [
            div [cls "calc-display"] [ display ]
            div [cls "calc-grid"] [
                digit 7 ; digit 8 ; digit 9 ; op Mul
                digit 4 ; digit 5 ; digit 6 ; op Sub
                digit 1 ; digit 2 ; digit 3 ; op Add
                button "C" [cls "calc-key-alt"] (fun _ -> Var.Set rvCalc initCalc)
                digit 0
                button "=" [cls "calc-key-eq"] (fun _ -> calculate rvCalc)
                op Div
            ]
        ]

    // ------------------------------------------------------------------ page

    let Main _ =
        Doc.Concat [
            p [cls "sample-blurb"] [
                text "A Var is a data source and a View is a time-varying value. Everything \
                 below is derived from inputs as you type — no manual DOM updates."
            ]
            div [cls "grid-2"] [
                cardWithHint "Live text transformations"
                    "One input, six independent views."
                    (TextDemo ())
                cardWithHint "HTML templates"
                    "Typed holes and a row sub-template, filled from the same views."
                    (TemplateDemo ())
            ]
            cardWithHint "Model-driven calculator"
                "A small model, a Var, and a grid of buttons."
                (CalculatorDemo ())
        ]

    let Description _ =
        div [] [
            text "Vars, views, derived values, HTML templates and a small \
                  model-driven calculator."
        ]

    let Sample =
        Samples.Build(Samples.VarPlayground)
            .Id("Reactive basics")
            .FileName(__SOURCE_FILE__)
            .Keywords(["var"; "view"; "template"])
            .Category(Samples.Suite)
            .Render(Main)
            .RenderDescription(Description)
            .Create()
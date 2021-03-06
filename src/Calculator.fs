﻿namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation

// A calculator application, showing model-view separation.
// See this live at http://intellifactory.github.io/websharper.ui.next/#Calculator.fs !

[<JavaScript>]
module Calculator =

    // ============== MODEL ============== //

    type Op = Add | Sub | Mul | Div

    // Model of our calculator
    type Calculator =
        { Memory : int ; Operand : int ; Operation : Op }

    let initCalc = { Memory = 0 ; Operand = 0 ; Operation = Add }

    // "Pushes" an int into the number we have already.
    // Mem * 10 + x
    let pushInt x rvCalc =
        Var.Update rvCalc (fun c ->
            { c with Operand = c.Operand * 10 + x})

    // Sets the current operation, shifts the current operand to memory,
    // and resets the current operand
    let shiftToMem op rvCalc =
        Var.Update rvCalc (fun c ->
            { c with Memory = c.Operand ; Operand = 0 ; Operation = op })

    // Translation functions
    let opFn op =
        match op with
        | Add -> (+)
        | Sub -> (-)
        | Mul -> (*)
        | Div -> (/)

    let showOp op =
        match op with
        | Add -> "+"
        | Sub -> "-"
        | Mul -> "*"
        | Div -> "/"

    // Calculates the answer using the selected operation, and writes the new
    // answer to the operand section. Sets memory to 0.
    let calculate rvCalc =
        Var.Update rvCalc (fun c ->
            let ans = (opFn c.Operation) c.Memory c.Operand
            { c with Memory = 0 ; Operand = ans ; Operation = Add } )

    // ============== VIEW ============== //

    // Displays the number on the calculator's screen
    let displayCalc rvCalc =
        let rviCalc = View.FromVar rvCalc
        View.Map (fun c -> string c.Operand) rviCalc

    // Button creation functions, and their associated (very simple) callbacks
    let button txt f = Doc.Button txt [sty "width" "25px"] f
    let calcBtn i rvCalc = button (string i) (fun _ -> pushInt i rvCalc)
    let opBtn o rvCalc = button (showOp o) (fun _ -> shiftToMem o rvCalc)
    let cBtn rvCalc = button "C" (fun _ -> Var.Set rvCalc initCalc)
    let eqBtn rvCalc = button "=" (fun _ -> calculate rvCalc)

    let calcView rvCalc =
        let rviCalc = View.FromVar rvCalc
        let btn i = calcBtn i rvCalc
        let obtn o = opBtn o rvCalc
        let cbtn = cBtn rvCalc
        let eqbtn = eqBtn rvCalc
        // We want something like this...
        //          [   1337]
        //           1 2 3 +
        //           4 5 6 -
        //           7 8 9 *
        //           0 C = /
        div [] [
            div [
                sty "border" "solid 1px #aaa"
                sty "width" "100px"
                sty "text-align" "right"
                sty "padding" "0 5px"
            ] [textView (displayCalc rvCalc)]
            div [] [btn 1 ; btn 2 ; btn 3 ; obtn Add]
            div [] [btn 4 ; btn 5 ; btn 6 ; obtn Sub]
            div [] [btn 7 ; btn 8 ; btn 9 ; obtn Mul]
            div [] [btn 0 ; cbtn  ; eqbtn ; obtn Div]
        ]

    // Run it!
    let Main _ =
        // Create a reactive variable and view.
        Var.Create initCalc |> calcView

    let Description _ =
        div [] [
            Doc.TextNode "A calculator application"
        ]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build(Samples.Calculator)
            .Id("Calculator")
            .FileName(__SOURCE_FILE__)
            .Keywords(["calculator"])
            .Render(Main)
            .RenderDescription(Description)
            .Create()

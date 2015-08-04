// $begin{copyright}
//
// This file is confidential and proprietary.
//
// Copyright (c) IntelliFactory, 2004-2014.
//
// All rights reserved.  Reproduction or use in whole or in part is
// prohibited without the written consent of the copyright holder.
//-----------------------------------------------------------------
// $end{copyright}

namespace WebSharper.UI.Next

open WebSharper
open WebSharper.UI.Next
open WebSharper.UI.Next.Client
open WebSharper.UI.Next.Html

// An example which takes some input from a text box, and outputs
// it with different functions applied to it, making use of View.Map.
// See this live at http://intellifactory.github.io/websharper.ui.next/#InputTransform.fs !

[<JavaScript>]
module InputTransform =

    let Main () =

        // Create a reactive variable and view.
        // Reactive *variables* are data *sources*.
        let rvText = Var.Create ""
        // Create the components backed by the variable: in this case, an input
        // field and a label to display the contents of such a field.

        // The inputField is created using RD.Input, which takes an RVar as its
        // parameter. Whenever the input field is updated, the new value is
        // automatically placed into the variable.
        let inputField =
            divAttr [cls "panel" ; cls "panel-default"] [
                divAttr [cls "panel-heading"] [
                    h3Attr [cls "panel-title"] [
                        text "Input"
                    ]
                ]

                divAttr [cls "panel-body"] [
                    formAttr [cls "form-horizontal" ; Attr.Create "role" "form"] [
                        divAttr [cls "form-group"] [
                            labelAttr [cls "col-sm-2" ; cls "control-label" ; attr.``for`` "inputBox"] [
                                Doc.TextNode "Write something: "
                            ]

                            divAttr [cls "col-sm-10"] [
                                Doc.Input [attr.``class`` "form-control" ; attr.id "inputBox"] rvText
                            ]
                        ]
                    ]
                ]
            ]

        // Now, we make views of the text, which we mutate using Map.
        let view = View.FromVar rvText

        let viewCaps =
            view |> View.Map (fun s -> s.ToUpper () )

        let viewReverse =
            view |> View.Map (fun s -> new string ((s.ToCharArray ()) |> Array.rev))

        let viewWordCount =
            view |> View.Map (fun s -> s.Split([| ' ' |]).Length)

        let viewWordCountStr =
            View.Map string viewWordCount

        let viewWordOddEven =
            View.Map (fun i -> if i % 2 = 0 then "Even" else "Odd") viewWordCount

        let views =
            [
                ("Entered Text", view)
                ("Capitalised", viewCaps)
                ("Reversed", viewReverse)
                ("Word Count", viewWordCountStr)
                ("Is the word count odd or even?", viewWordOddEven)
            ]

        let tableRow (lbl, view) =
            tr [
                td [
                    text lbl
                ]
                tdAttr [sty "width" "70%"] [
                    textView view
                ]
            ] :> Doc

        let tbl =
            divc "panel panel-default" [
                divc "panel-heading" [
                    h3Attr [cls "panel-title"] [
                        text "Output"
                    ]
                ]

                divc "panel-body" [
                    tableAttr [cls "table"] [
                        tbody [
                            // We map the tableRow function onto the different
                            // views of the source, and concatenate the resulting
                            // documents.
                            List.map tableRow views |> Doc.Concat
                        ]
                    ]
                ]
            ]

        div [
            inputField
            tbl
        ]

    let Description () =
        div [
            Doc.TextNode "Transforming the data provided by a single data source."
        ]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build()
            .Id("InputTransform")
            .FileName(__SOURCE_FILE__)
            .Keywords(["text"])
            .Render(Main)
            .RenderDescription(Description)
            .Create()
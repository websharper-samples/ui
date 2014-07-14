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

namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.UI.Next

[<JavaScript>]
module InputTransform =

    [<AutoOpen>]
    module private Util =
        let el name xs = Doc.Element name [] xs
        let elA = Doc.Element
        let ( => ) k v = Attr.Create k v
        let cls = Attr.CreateClass

    let Main =

        // Create a reactive variable and view.
        // Reactive *variables* are data *sources*.
        let rvText = Var.Create ""

        // Create the components backed by the variable: in this case, an input
        // field and a label to display the contents of such a field.

        // The inputField is created using RD.Input, which takes an RVar as its
        // parameter. Whenever the input field is updated, the new value is
        // automatically placed into the variable.
        let inputField =
            elA "div" [cls "panel" ; cls "panel-default"] [
                elA "div" [cls "panel-heading"] [
                    elA "h3" [cls "panel-title"] [
                        Doc.TextNode "Input"
                    ]
                ]

                elA "div" [cls "panel-body"] [
                    elA "form-horizontal" ["role" => "form"] [
                        elA "div" [cls "form-group"] [
                            elA "label" [cls "col-sm-2" ; cls "control-label" ; "for" => "inputBox"] [
                                Doc.TextNode "Write something: "
                            ]

                            elA "div" [cls "col-sm-10"] [
                                Doc.Input ["class" => "form-control" ; "id" => "inputBox"] rvText
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
            el "tr" [
                el "td" [
                    Doc.TextNode lbl
                ]
                el "td" [
                    Doc.TextView view
                ]
            ]

        let tbl =
            elA "div" [cls "panel" ; cls "panel-default"] [
                elA "div" [cls "panel-heading"] [
                    elA "h3" [cls "panel-title"] [
                        Doc.TextNode "Output"
                    ]
                ]

                elA "div" [cls "panel-body"] [
                    elA "table" [cls "table"] [
                        el "tbody" [
                            // We map the tableRow function onto the different
                            // views of the source, and concatenate the resulting
                            // documents.
                            List.map tableRow views |> Doc.Concat
                        ]
                    ]
                ]
            ]

        el "div" [
            inputField
            tbl
        ]

    let description =
        el "div" [
            Doc.TextNode "Transforming the data provided by a single data source."
        ]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build()
            .Id("Input Transformation")
            .FileName(__SOURCE_FILE__)
            .Keywords(["text"])
            .Render(Main)
            .RenderDescription(description)
            .Create()
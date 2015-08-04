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

// A simple example consisting of a label which mirrors the content of a text
// box.
// See this live at http://intellifactory.github.io/websharper.ui.next/#SimpleTextBox.fs !

[<JavaScript>]
module SimpleTextBox =

    let Main () =

        // Create a reactive variable and view.
        // Reactive *variables* are data *sources*.
        let rvText = Var.Create ""

        // Create the components backed by the variable: in this case, an input
        // field and a label to display the contents of such a field.

        // The inputField is created using RD.Input, which takes an RVar as its
        // parameter. Whenever the input field is updated, the new value is
        // automatically placed into the variable.
        let inputField = Doc.Input [Attr.Create "class" "form-control"] rvText

        // A TextView is a component, backed by a reactive view, that updates
        // its contents automatically whenever the variable changes.
        let label = textView rvText.View

        // Put together our RDOM structures; some bootstrap stuff
        divc "panel-default" [
            divc "panel-body" [
                // Note how components are composable, meaning we can
                // embed multiple different components here without issue.
                div [inputField]
                div [label]
            ]
        ]

    let Description () =
        div [
            text "A label which copies the contents of a text box."
        ]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build()
            .Id("SimpleTextBox")
            .FileName(__SOURCE_FILE__)
            .Keywords(["text"])
            .Render(Main)
            .RenderDescription(Description)
            .Create()
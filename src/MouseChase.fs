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

// An example of a div chasing the mouse, displaying mouse co-ordinates.
// See this live at http://intellifactory.github.io/websharper.ui.next/#MouseChase.fs !

[<JavaScript>]
module MouseChase =

    let Main =

        // RVars / views for X and Y co-ords of mouse
        let rvX = Var.Create 0
        let rvY = Var.Create 0

        // Set up the mouse movement hook on the document
        let SetupMouseHook () =
            let doc = Dom.Document.Current
            let onMouseMove (evt: Dom.Event) =
                // Update the RVars for the X and Y positions, from the information
                // contained within the event.
                let px = evt?pageX
                let py = evt?pageY
                Var.Set rvX px
                Var.Set rvY py
            doc.AddEventListener("mousemove", onMouseMove, false)

        SetupMouseHook ()

        let widthAttr = Attr.Create "width" "200"
        let heightAttr = Attr.Create "height" "100"
        // Create reactive style attributes for the CSS properties we wish to modify.
        // Notice we're using ViewStyle here and not View, as we're modifying CSS instead
        // of node attributes.
        let xView = Attr.DynamicStyle "left" (View.Map (fun x -> string(x) + "px") rvX.View)
        let yView = Attr.DynamicStyle "top" (View.Map (fun y -> string(y) + "px") rvY.View)
        // We also add static attributes for positioning and colour.
        let bgAttr = Attr.Style "background-color" "#b0c4de"
        let posAttr = Attr.Style "position" "absolute"

        // Finally wire everything up and set it in motion!
        let mouseDiv =
            Doc.Element "div" [xView ; yView; bgAttr; posAttr] [
                View.Map (fun x -> "X: " + string(x)) rvX.View |> Doc.TextView |> fun x -> div [x]
                View.Map (fun y -> "Y: " + string(y)) rvY.View |> Doc.TextView |> fun x -> div [x]
            ]

        mouseDiv

    let description =
        el "div" [
            Doc.TextNode "A box which follows the mouse, containing the co-ordinates."
        ]

    let Sample =
        Samples.Build()
            .Id("MouseChase")
            .FileName(__SOURCE_FILE__)
            .Keywords(["todo"])
            .Render(Main)
            .RenderDescription(description)
            .Create()

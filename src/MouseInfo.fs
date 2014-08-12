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
open IntelliFactory.WebSharper.UI.Next.Input
open IntelliFactory.WebSharper.UI.Next.Html

// An example of a div chasing the mouse, displaying mouse co-ordinates.
// See this live at http://intellifactory.github.io/websharper.ui.next/#MouseChase.fs !

[<JavaScript>]
module MouseInfo =

    let Main () =

        // Mouse.Position is a View<int * int>, which is a tuple of (X, Y) co-ords.
        let xView = View.Map fst Mouse.Position
        let yView = View.Map snd Mouse.Position

        let mouseDiv =
            Div0 [
                P0 [View.Map (fun x -> "X: " + string(x)) xView |> Doc.TextView
                    View.Map (fun y -> "Y: " + string(y)) yView |> Doc.TextView]
                // Mouse.[Left/Middle/Right] are View<bool>s, specifying whether the
                // button has been pressed.
                P0 [View.Map (fun l -> "Left button pressed: " + string(l))
                        Mouse.LeftPressed |> Doc.TextView]
                P0 [View.Map (fun m -> "Middle button pressed: " + string(m))
                        Mouse.MiddlePressed |> Doc.TextView]
                P0 [View.Map (fun r -> "Right button pressed: " + string(r))
                        Mouse.RightPressed |> Doc.TextView]
            ]

        mouseDiv

    let Description () =
        Div0 [
            Doc.TextNode "Shows information about the mouse"
        ]

    let Sample =
        Samples.Build()
            .Id("MouseInfo")
            .FileName(__SOURCE_FILE__)
            .Keywords(["mouse"])
            .Render(Main)
            .RenderDescription(Description)
            .Create()
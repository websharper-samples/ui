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
open IntelliFactory.WebSharper.UI.Next.Html

// A to-do list application, showcasing time-varying collections of tim-varying
// elements.
// See this live at http://intellifactory.github.io/websharper.ui.next/#TodoList.fs !

[<JavaScript>]
module TodoList =

    [<AutoOpen>]
    module private Util =
        let input x = Doc.Input ["class" ==> "form-control"] x
        let button name handler = Doc.Button name ["class" ==> "btn btn-default"] handler

        let fresh =
            let c = ref 0
            fun () ->
                incr c
                !c

    // Our Todo items consist of a textual description,
    // and a bool flag showing if it has been done or not.
    type TodoItem =
        {
            Done : Var<bool>
            TodoKey : int
            TodoText : string
        }

        static member Create s =
            { TodoKey = fresh (); TodoText = s; Done = Var.Create false }

    let Key item =
        item.TodoKey

    /// Renders a TodoItem
    let RenderItem m todo =
        TR [] [
            TD [] [
                // Here is a tree fragment that depends on the Done status of the item.
                View.FromVar todo.Done
                // Let us render the item differently depending on whether it's done.
                |> View.Map (fun isDone ->
                    if isDone
                        then Del [] [ txt todo.TodoText ]
                        else txt todo.TodoText)
                // Finally, we embed this possibly-changing fragment into the tree.
                // Whenever the input changes, the parts of the tree change automatically.
                |> Doc.EmbedView
            ]

            TD [] [
                // Here's a button which specifies that the item has been done,
                // flipping the "Done" flag to true using a callback.
                button "Done" (fun () -> Var.Set todo.Done true)
            ]

            TD [] [
                // This button removes the item from the collection. By removing the item,
                // the collection will automatically be updated.
                button "Remove" (fun _ -> ReactiveCollection.Remove m todo)
            ]
        ]

    // A form component to add new TODO items.
    let TodoForm m =
        // We make a variable to contain the new to-do item.
        let rvInput = Var.Create ""
        Form [] [
            divc "form-group" [
                Label [] [txt "New entry: "]
                // Here, we make the Input box, backing it by the reactive variable.
                input rvInput
            ]
            // Once the user clicks the submit button...
            button "Submit" (fun _ ->
                // We construct a new ToDo item
                let todo = TodoItem.Create (Var.Get rvInput)
                // This is then added to the collection, which automatically
                // updates the presentation.
                ReactiveCollection.Add m todo)
        ]

    // Embed a time-varying collection of items.
    let TodoList m =
        Doc.EmbedBagBy Key (RenderItem m) (ReactiveCollection.View m) // m.Items.View

    // Finally, we put it all together...
    let TodoExample () =
        let m = ReactiveCollection.Create (fun i1 i2 -> i1.TodoKey = i2.TodoKey)
        Table ["class" ==> "table table-hover"] [
            TBody [] [
                TodoList m
                TodoForm m
            ]
        ]

    // ...and run it.
    let Main () =
        TodoExample ()

    let Description () =
        Div [] [
            Doc.TextNode "A to-do list application."
        ]

    let Sample =
        Samples.Build()
            .Id("TodoList")
            .FileName(__SOURCE_FILE__)
            .Keywords(["todo"])
            .Render(Main)
            .RenderDescription(Description)
            .Create()
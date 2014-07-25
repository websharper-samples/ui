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
open IntelliFactory.WebSharper.UI.Next.Notation

// A to-do list application, showcasing time-varying collections of elements.
// See this live at http://intellifactory.github.io/websharper.ui.next/#TodoList.fs !

[<JavaScript>]
module TodoList =

    [<AutoOpen>]
    module private Util =
        let input x = Doc.Input ["class" ==> "form-control"] x
        let button name handler = Doc.Button name ["class" ==> "btn btn-default"] handler

    // Our Todo items consist of a textual description,
    // and a bool flag showing if it has been done or not.
    type TodoItem =
        {
            Done : Var<bool>
            Key : Key
            TodoText : string
        }

        static member Create s =
            { Key = Key.Fresh (); TodoText = s; Done = Var.Create false }

    type Model =
        {
            Items : ListModel<Key,TodoItem>
        }

    let CreateModel () =
        { Items = ListModel.Create (fun item -> item.Key) [] }

    /// Renders a TodoItem
    let RenderItem m todo =
        TR0 [
            TD0 [
                // Here is a tree fragment that depends on the Done status of the item.
                View.FromVar todo.Done
                // Let us render the item differently depending on whether it's done.
                |> View.Map (fun isDone ->
                    if isDone
                        then Del0 [ txt todo.TodoText ]
                        else txt todo.TodoText)
                // Finally, we embed this possibly-changing fragment into the tree.
                // Whenever the input changes, the parts of the tree change automatically.
                |> Doc.EmbedView
            ]

            TD0 [
                // Here's a button which specifies that the item has been done,
                // flipping the "Done" flag to true using a callback.
                button "Done" (fun () -> Var.Set todo.Done true)
            ]

            TD0 [
                // This button removes the item from the collection. By removing the item,
                // the collection will automatically be updated.
                button "Remove" (fun _ -> m.Items.Remove todo)
            ]
        ]

    // A form component to add new TODO items.
    let TodoForm m =
        // We make a variable to contain the new to-do item.
        let rvInput = Var.Create ""
        Form0 [
            divc "form-group" [
                Label0 [txt "New entry: "]
                // Here, we make the Input box, backing it by the reactive variable.
                input rvInput
            ]
            // Once the user clicks the submit button...
            button "Submit" (fun _ ->
                // We construct a new ToDo item
                let todo = TodoItem.Create (Var.Get rvInput)
                // This is then added to the collection, which automatically
                // updates the presentation.
                m.Items.Add todo)
        ]

    // Embed a time-varying collection of items.
    let TodoList m =
        ListModel.View m.Items
        |> Doc.ConvertBy (fun m -> m.Key) (RenderItem m)

    // Finally, we put it all together...
    let TodoExample () =
        let m = CreateModel ()
        Table ["class" ==> "table table-hover"] [
            TBody0 [
                TodoList m
                TodoForm m
            ]
        ]

    // ...and run it.
    let Main () =
        TodoExample ()

    let Description () =
        Div0 [
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

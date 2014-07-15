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

    type ViewModel =
        {
            Items : Model<seq<TodoItem>,ResizeArray<TodoItem>>
        }

    let Create () =
        let items =
            ResizeArray()
            |> Model.Create (fun arr -> arr.ToArray() :> seq<_>)
        { Items = items }

    /// Adds an item to the collection.
    let Add m item =
        m.Items
        |> Model.Update (fun all -> all.Add(item))

    /// Removes an item from the collection.
    let Remove m (item: TodoItem) =
        m.Items
        |> Model.Update (fun all ->
            seq { 0 .. all.Count - 1 }
            |> Seq.filter (fun i -> all.[i].TodoKey = item.TodoKey)
            |> Seq.toArray
            |> Array.iter (fun i -> all.RemoveAt(i)))

    /// Renders a collection of items.
    let RenderItem m todo =
        el "tr" [
            el "td" [
                // Here is a tree fragment that depends on the Done status of the item.
                View.FromVar todo.Done
                // Let us render the item differently depending on whether it's done.
                |> View.Map (fun isDone ->
                    if isDone
                        then el "del" [ txt todo.TodoText ]
                        else txt todo.TodoText)
                // Finally, we embed this possibly-changing fragment into the tree.
                // Whenever the input changes, the parts of the tree change automatically.
                |> Doc.EmbedView
            ]

            el "td" [
                // Here's a button which specifies that the item has been done,
                // flipping the "Done" flag to true using a callback.
                button "Done" (fun () -> Var.Set todo.Done true)
            ]

            el "td" [
                // This button removes the item from the collection. By removing the item,
                // the collection will automatically be updated.
                button "Remove" (fun _ -> Remove m todo)
            ]
        ]

    // A form component to add new TODO items.
    let TodoForm m =
        // We make a variable to contain the new to-do item.
        let rvInput = Var.Create ""
        // ...and a view to inspect it.
        let rviInput = View.FromVar rvInput
        el "form" [
            divc "form-group" [
                el "label" [txt "New entry: "]
                // Here, we make the Input box, backing it by the reactive variable.
                input rvInput
            ]
            // Once the user clicks the submit button...
            button "Submit" (fun _ ->
                // We construct a new ToDo item
                let todo = TodoItem.Create (Var.Get rvInput)
                // This is then added to the collection, which automatically
                // updates the presentation.
                Add m todo)
        ]

    // Embed a time-varying collection of items.
    let TodoList m =
        Doc.EmbedBagBy Key (RenderItem m) m.Items.View

    // Finally, we put it all together...
    let TodoExample () =
        let m = Create ()
        elA "table" ["class" ==> "table table-hover"] [
            el "tbody" [
                TodoList m
                TodoForm m
            ]
        ]

    // ...and run it.
    let Main =
        TodoExample ()

    let description =
        el "div" [
            Doc.TextNode "A to-do list application."
        ]

    let Sample =
        Samples.Build()
            .Id("To-do List")
            .FileName(__SOURCE_FILE__)
            .Keywords(["todo"])
            .Render(Main)
            .RenderDescription(description)
            .Create()
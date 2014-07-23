Introduction
============

In this tutorial, we'll have a look at the basics of WebSharper.UI.Next, taking you through all of the basics and some of the ways of using the library. This will be done entirely by example: you should get introduced to everything you need along the way.

Text Box
========

Probably the very simplest application we could create is one with an input box and a label, where the label mirrors the text from the input box. You can find all examples live [here](http://intellifactory.github.io/websharper.ui.next/) with the source for this example [here](https://github.com/intellifactory/websharper.ui.next/blob/master/src/SimpleTextBox.fs).

What we need to do firstly is specify a reactive variable, which holds the string specified by the input box.

```
let rvText = Var.Create ""
```

A reactive variable is the basic 'building block' of an application in UI.Next. You can think of this a bit like an F# reference cell, but with one important difference: we can define *views* on this, which allow us to observe it as it changes. We'll get to that in a second.

The next thing to do is to make an input box, tying it to the variable we've just created. This means that the input box synchronises with the variable: whenever a user changes the text in the box, `rvText` gets updated. Conversely, if anything else modifies `rvText`, then the value of the box will be updated to reflect this.

```
let inputField = Doc.Input [] rvText
``` 

...and the label which displays the input. Notice that we can get a view of the variable using the `.View` member, and could similarly create one using `View.Create`. Either way, it's the same thing: we now have a `View<string>` of `rvText`.

```
let label = Doc.TextView rvText.View
```

Now, `label` is of type Doc, yet still refers to a time-changing variable. This means that once it's part of the bigger tree, whenever `rvText` changes, so will this node. Finally, we wrap it all up in a couple of Divs, and then run it in a `div` called `main`. Note that `divc` is a function to create a div with the given class name, and `el` is a shortcut function for `Doc.Element` without any attributes.

```
let copyTheInput =
 divc "panel-default" [
            divc "panel-body" [
                // Note how components are composable, meaning we can
                // embed multiple different components here without issue.
                el "div" [inputField]
                el "div" [label]
            ]
        ]


let Main () =
    Document.RunById "main" copyTheInput
```

...and we're done!

Transform-the-Input
===================
The label in the previous example copied the input text as-is. What about if we wanted to display this input text in different ways, such as capitalised? Or even the number of different words that were typed?

Luckily, `View`s provide different combinators we can use to do just this. We start by making a `Var` and an input box as before:

```
let rvText = Var.Create ""
Doc.Input [] rvText
```

The difference here comes with the different ways we're viewing the input text. To do this, we create a view, and then we use `Map` to alter the view. You'll notice in one part we create a `View<int>` for the number of words: we can then use this for further views to determine whether or not the number of words is odd or even, for example:

```
let view = View.FromVar rvText
let viewCaps = View.Map (fun (s : string) -> s.ToUpper ()) view
let viewReverse = View.Map (fun (s : string) -> new string ((s.ToCharArray ()) |> Array.rev)) view
let viewWordCount = View.Map (fun (s : string) -> s.Split([| ' ' |]).Length) view
let viewWordCountStr = View.Map string viewWordCount
let viewWordOddEven = View.Map (fun i -> if i % 2 = 0 then "Even" else "Odd") viewWordCount
```

Finally, we embed these into table rows and hook everything up. This is done exactly as before -- we use the views we've created when creating the `TextView`s. You can find the source (here)[https://github.com/intellifactory/websharper.ui.next/blob/master/src/InputTransform.fs].


Making a To-Do List Application
===============================

Now we know the basics, we can have a look at a slightly bigger application: the de-facto "Hello World" of reactive frameworks, a to-do list!

Specification and Analysis
--------------------------

Firstly, let's lay out exactly what we want:

* A list of to-do items
* A form to create new to-do items, and add them to the list
* We should be able to mark a to-do item as done, and additionally remove it from the list
* If a to-do item is marked as done, it should be displayed differently


Now, in UI.Next terms, let's think of how this will fit into our model. Since we are able to mark a to-do item as done, this means that a *to-do item can vary with time*, and therefore some parts of the model of the item will have to be a `Var`. Secondly, since we can add and remove items from the to-do list, the *list itself will vary with time*. To encode this, we'll use a ReactiveCollection, which provides some helper functions for just this purpose.

Creating the Model
------------------

Now we've laid out and thought about exactly what we want, it's time to create our model. To start off with, we want a to-do item, consisting of three things: the content, a `Var<bool>` signifying whether the task has been done, and some unique key.

```fsharp
type TodoItem =
    {
        Done : Var<bool>
        TodoKey : int
        TodoText : string
    }
```

Next, we want to make a function to create a to-do item. To do this, we'll need a function to create unique identifiers, which is simple using a `ref` cell.

```fsharp
// Get a unique ID 
let fresh =
    let c = ref 0
    fun () ->
        incr c
        !c

// Create a new TodoItem
static member Create s =
    { TodoKey = fresh (); TodoText = s; Done = Var.Create false }
```

The last thing we need to do before doing some application logic is to create a reactive collection. In order to compare two items, for example when removing from a list, we also need to specify an equality function here. In our case, we can simply compare the unique IDs.

```fsharp
let coll = ReactiveCollection.Create (fun i1 i2 -> i1.TodoKey = i2.TodoKey)
```

Rendering the Model
-------------------
So far, we have a model of each to-do item, a way of creating them, and a time-varying collection which compares items by their unique `TodoKey`. The next thing to do is create the components which manipulate and display the list of items. 

### Displaying the items
As in our specification, each item should be displayed differently if it has been marked as completed -- in this case, we'll display the item text with a strikethrough if it has been done. Additionally, we'll display each item as a row in a table, and have buttons to either mark the item as being done, or to remove it from the list completely.

In order to specify a view, we'll make use of the `Doc` module. As we discussed earlier, this module provides multiple helpers to create reactive DOM elements. In particular, we'll use `Doc.Element` to create an element, and `Doc.Button` to create a button. 

Since these API calls are quite flexible and we often don't need all of the parameters, and also because typing the names can be a tad repetitive, it's often useful to create some convenience functions.

```
/// Element without attributes
let el name c = Doc.Element name [] c

/// Text node
let txt t = Doc.TextNode t

/// Input box backed by a variable x
let input x = Doc.Input ["class" ==> "form-control"] x

/// Button with a given caption and handler
let button name handler = Doc.Button name ["class" ==> "btn btn-default"] handler
```
#### Rendering an Item
Here's an outline of our `RenderItem` function, which takes a `TodoItem` and produces a `Doc`:
```fsharp
    /// Renders an item.
    let RenderItem coll todo =
        el "tr" [
            el "td" [
                // TODO: Render the text of the TodoItem here. If it's already
                // been marked as done, there should be a strikethrough.
            ]

            el "td" [
                // TODO: A button which marks the item as done.
            ]

            el "td" [
                // TODO: A button which deletes the item from the collection
            ]
        ]

```

Let's start with rendering the TodoItem text. Whenever we render an item, we want to have a strikethrough if the `Done` Var is set to true. In order to do this, we can use the `View.Map` function to create a `View<Doc>`, and then flatten this out to a `Doc` using `EmbedView`. Here's what we need to do:

```fsharp
View.FromVar todo.Done
|> View.Map (fun isDone ->
    if isDone
        then el "del" [ txt todo.TodoText ]
        else txt todo.TodoText)
|> Doc.EmbedView
```
To start off with, we create a `View` of the 'Done' Var. This allows us to look at the value of this whenever it changes. Now that we have a view, we can use the `View.Map` combinator to look at the value, and create an appropriate rendering. In this function, `isDone` is of type `bool`, and if this is true, then we create a strikethrough effect using the `del` element. If not, then the text is just displayed without alteration.

The result of the `View.Map` is therefore a `View<Doc>` -- which we can flatten out using `Doc.EmbedView`.

The next stage is to add the buttons which mark a to-do item as done, or remove it from the list. We've done the hard part: these functions are really easy!

Marking a to-do item as done:
```fsharp
button "Done" (fun () -> Var.Set todo.Done true)
```

All we do here is set the 'Done' `Var` to true in the callback. We don't need to do anything else: the view we created and embedded earlier means that any DOM updates will happen automatically.

Removing a to-do item from the list:
```fsharp
button "Remove" (fun _ -> ReactiveCollection.Remove coll todo)
```

This is just as easy: we just call `ReactiveCollection.Remove` with the collection and the item to remove as its arguments. Everything else updates automatically.

So now our rendering function looks like this:

```fsharp
/// Renders a TodoItem
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
            button "Remove" (fun _ -> ReactiveCollection.Remove m todo)
        ]
    ]
```

#### Rendering the Collection
Now we have a function to render each item, we need to embed the collection itself. This means that whenever either an item in the collection changes, or the collection itself changes, the changes should be reflected in the DOM. This is simply done using the `EmbedBagBy` function:

```fsharp
EmbedBagBy<'T,'K when 'K : equality> : ('T -> 'K) -> ('T -> Doc) -> View<seq<'T>> -> Doc
```

This takes a key function (in our case, just `(fun x -> x.TodoKey)`), a rendering function, and a view of a collection. Now, tying this together is done as follows:

```fsharp
// Embed a time-varying collection of items.
let TodoList m =
    Doc.EmbedBagBy Key (RenderItem m) (ReactiveCollection.View m)
```

This gives us a `Doc`, which we can embed as normal. That's it -- we've now got the code in place to show the reactive collection. 

### Creating the Add Item form
Creating a form to add an item is pretty straightforward. What we'll need here is a variable to contain the current value of the input box containing the new item to add, and a button to use this to create a new item and add it to the collection. This boils down to this function:

```fsharp
    let TodoForm m =
        // We make a variable to contain the new to-do item.
        let rvInput = Var.Create ""
        el "form" [
            div [
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
                ReactiveCollection.Add m todo)
        ]
```

So, to start off with, we create a new variable `rvInput`, which is the variable we associate with the input box. Whenever the user types anything into the input box, the variable is updated accordingly. Finally, we make a submit button using the `button` function, which constructs a new ToDo item from the value of the `rvInput` variable, and then adds it to the collection using `ReactiveCollection.Add`.

That's the form sorted!

Putting it all together
=======================

Finally, we need a rendering function which ties all of these components together. Remember that all of the different components are of type `Doc`, so they'll compose very easily due to their monoidal structure. This means composing everything is done as so:

```fsharp
    let TodoExample () =
        elA "table" ["class" ==> "table table-hover"] [
            el "tbody" [
                TodoList coll
                TodoForm coll
            ]
        ]
```

And that's that! To embed the example in a webpage, we can then just use `Doc.RunById : string -> Doc -> unit` to replace the contents of an element with a given ID with the application we've just created. You can see this live [here](http://intellifactory.github.io/websharper.ui.next/#TodoList) and find the source [here](http://github.com/intellifactory/websharper.ui.next/blob/master/src/TodoList.fs).

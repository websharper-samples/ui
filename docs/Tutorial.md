Introduction
============

WebSharper.UI.Next is a new experimental library for developing Single-Page Applications using a Reactive DOM representation. The main idea behind the library is that you should be able to specify a model, views of this model, and components which automatically change whenever the model changes.

Briefly, WebSharper.UI.Next consists of two layers: a dataflow layer, made up of variables and views, and a reactive DOM layer making use of this, allowing time-varying elements to be embedded in the DOM. In the simplest case, it's possible to create a reactive variable (which can be thought of as a *data source*), a view of this, bind this to a DOM element, and have the DOM element update automatically whenever the data changes. This removes the need to write separate DOM handling code for whenever the data changes: you just specify the view once, and the updates happen automatically. 

The Dataflow Layer: Vars and Views
==================================

The dataflow layer can be thought of as the 'model' part of the system. There are two main primitives here: [`Var`s](https://github.com/intellifactory/websharper.ui.next/blob/master/docs/Var.md), which can be thought of as a value which varies with time, and [`View`s](https://github.com/intellifactory/websharper.ui.next/blob/master/docs/View.md), which can be used to observe a `Var` as it changes. By way of example, think of the mouse position: we can have two variables which represent the position, and views on these variables which allow something to be updated whenever the position changes. 

You can read more about the dataflow system and some of the technical design decisions [here](https://github.com/intellifactory/websharper.ui.next/blob/master/docs/Dataflow.md).


The DOM Layer
=============

After laying the groundwork with the dataflow layer, we can begin to think about how this relates to the DOM. In particular, UI.Next works by effectively "embedding" possibly changing DOM fragments into a virtual DOM representation. In particular, to represent a DOM fragment, we use the [`Doc` type](https://github.com/intellifactory/websharper.ui.next/blob/master/docs/Doc.md): this is defined using a [monoidal interface](https://github.com/intellifactory/websharper.ui.next/blob/master/docs/Monoids.md), meaning that it's easy to compose different parts of the tree. 

Once we have a `Doc`, it's easy to use this with a WebSharper application, using the `Doc.Run` and `Doc.RunById` functions, which associate the `Doc` with a given element. We'll get to that a bit later.

The key to this layer is the combinator:

```fsharp
EmbedView : View<Doc> -> Doc
```

This combinator takes a view of a `Doc`, that is a DOM fragment as it changes with time, and flattens it out to a `Doc`, such that it may be composed as if it were static. This is incredibly useful, as we'll see later.

Making a To-Do List Application
===============================

With the basics discussed, let's create a small example. It seems that nowadays the de-facto "Hello World" of reactive frameworks is a To-Do List application, so this is what we'll make in this tutorial. 

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

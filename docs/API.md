## API

Let us introduce the basics. A `Var` is an observable ref-cell.  Just
like for the simple ref cell, you have:

```fsharp
Var.Create : unit -> Var<'T>
Var.Get : Var<'T> -> 'T
Var.Set : Var<'T> -> 'T -> unit
```

A `View<'T>` is a time-varying value computed from one or more vars:

```fsharp
View.Const : 'T -> View<'T>
View.FromVar : Var<'T> -> View<'T> // shorthand: var.View
View.Map : ('A -> 'B) -> View<'A> -> View<'B>
View.Map2 : ('A -> 'B -> 'C) -> View<'A> -> View<'B> -> View<'C>
View.Join : View<View<'T>> -> View<'T>
```

These combinators can define dynamic graphs of Views.  You can observe
a View imperatively by providing a function that will be called with
the most current computed value of the View when it changes; this will
be called at least once (for a constant View):

```fsharp
View.Sink : ('T -> unit) -> View<'T> -> unit
```

`Doc` is a special case of a time-varying value: it is a time-varying
list of items representing HTML elements and text nodes. Similarly,
`Attr` describes DOM attributes.  There are combinators for creating
elements, text nodes and attributes.  In addition, lists and
time-varying fragments are conveniently embedded in a single type:

```fsharp
Doc.Concat : seq<Doc> -> Doc
Doc.EmbedView : View<Doc> -> Doc
```

# View
> [Documentation](../README.md) ▸ [API Reference](API.md) ▸ **View**

`View<'T>` represents a node in the [Dataflow](Dataflow.md) layer.
Intuitively, it is a time-varying value computed from your model.
At any point in time the view has a certain `'T`.

Below, `[[x]]` notation is used to denote value of `x` view at every
point in time, so that `[[x]] = [[y]]` means that the two views are
observationally equivalent.


```fsharp
namespace IntelliFactory.WebSharper.UI.Next

type View<'T>

type ViewBuilder =
    member Bind : View<'A> * ('A -> View<'B>) -> View<'B>
    member Return : 'T -> View<'T>

type View =

    static member Const : 'T -> View<'T>
    static member FromVar: Var<'T> -> View<'T>

    static member Sink : ('T -> unit) -> View<'T> -> unit
    
    static member Map : ('A -> 'B) -> View<'A> -> View<'B>
    static member Map2 : ('A -> 'B -> 'C) -> View<'A> -> View<'B> -> View<'C>
    static member Apply : View<'A -> 'B> -> View<'A> -> View<'B>
    static member MapAsync : ('A -> Async<'B>) -> View<'A> -> View<'B>
    static member Join : View<View<'T>> -> View<'T>
    static member Bind : ('A -> View<'B>) -> View<'A> -> View<'B>

    static member ConvertSeqBy<'A,'B,'K when 'K : equality> :
        key: ('A -> 'K) ->
        conv: (View<'A> -> 'B) ->
        view: (View<seq<'A>>) ->
        View<seq<'B>>

    static member Do : ViewBuilder
```

<a name="View" href="#View">#</a> **View** `type View<'T>`

A time-varying read-only value of a given type.

## Constructing

<a name="Const" href="#Const">#</a> View.**Const** `'T -> View<'T>`

Lifts a constant value to a View.  Constants are a boring
special case of time-varying values:

```fsharp
[[View.Const x]] = x
```

<a name="FromVar" href="#FromVar">#</a> View.**FromVar** `Var<'T> -> View<'T>`

Reactive variables of type [Var](Var.md) can be seen as Views by considering
their current value at any point in time.  The same functionality is available as
a `var.View` shorthand.

## Using

<a name="Sink" href="#Sink">#</a> View.**Sink** `('T -> unit) -> View<'T> -> unit`

Starts a process that calls the given function repeatedly with the latest View value.
This method is rarely needed, the most common way to use views is by constructing
reactive documents of type [Doc](Doc.md), and embedding them using Doc.EmbedView.
Sink use requires a little care, the typical usage is to run it once per application.
This is because the process created by `Sink` repeatedly blocks while waiting for
the view to update. A memory leak can happen if the application repeatedly spawns `Sink`
processes that never get collected because they await a Var that is never going to change
(see [Leaks](Leaks.md) for more information).

## Combining

<a name="Map" href="#Map">#</a> View.**Map** `('A -> 'B) -> View<'A> -> View<'B>`

Lifts a function to the View layer, such that the value `[[]]` relation holds:

```fsharp
[[View.Map f x]] = f [[x]]
```

This is the simplest and perhaps the most useful combinator.

<a name="Map2" href="#Map2">#</a> View.**Map2** `('A -> 'B -> 'C) -> View<'A> -> View<'B> -> View<'C>`

Pairing combinator generalizing `View.Map` to allow constructing views that depend on more than one view:

```fsharp
[[View.Map2 f x y]] = f [[x]] [[y]]
```

<a name="Apply" href="#Apply">#</a> View.**Apply** `View<'A -> 'B> -> View<'A> -> View<'B>`

Another pairing combinator derived from `View.Map2`. Defining equation is:

```fsharp
View.Apply f x = View.Map2 (fun f x -> f x) f x
```

Together with `View.Const`, this permits a code pattern for lifting functions of arbitrary arity:

```fsharp
let ( <*> ) f x = View.Apply f x

View.Const (fun x y z -> (x, y, z)) <*> x <*> y <*> z
```


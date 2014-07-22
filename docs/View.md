# Var
> [Documentation](../README.md) ▸ [API Reference](API.md) ▸ **View**

`View<'T>` represents a node in the [Dataflow](Dataflow.md) layer.
Intuitively, it a time-varying value computed from your model.
At any point in time the view has a certain `'T`.


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

    static member Apply : View<'A -> 'B> -> View<'A> -> View<'B>
    static member Map : ('A -> 'B) -> View<'A> -> View<'B>
    static member Map2 : ('A -> 'B -> 'C) -> View<'A> -> View<'B> -> View<'C>
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

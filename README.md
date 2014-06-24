# WebSharper.UI.Next

These notes present the WebSharper.UI.Next project.  The project aims
to:

1. provide improved typed F#/WebSharper combinators for constructing
   time-varying interfaces based on JavaScript DOM API (`Doc` and
   `Attr` types)

2. experiment with new types and functions for expressing time-varying
   values in general (`Var` and `View` types)

You can think of it as a light-weight JavaScript MVC framework
presented with types in F#.  Before reading on, have a look at the API
and some examples.

## API 

Let us introduce the basics. A `Var` is an observable ref-cell.  Just
like for the simple ref cell, you have:

    Var.Create : unit -> Var<'T>
    Var.Get : Var<'T> -> 'T
    Var.Set : Var<'T> -> 'T -> unit

A `View<'T>` is a time-varying value computed from one or more vars:

    View.Const : 'T -> View<'T>
    View.FromVar : Var<'T> -> View<'T> // shorthand: var.View
    View.Map : ('A -> 'B) -> View<'A> -> View<'B>
    View.Map2 : ('A -> 'B -> 'C) -> View<'A> -> View<'B> -> View<'C>
    View.Join : View<View<'T>> -> View<'T>

These combinators can define dynamic graphs of Views.  You can observe
a View imperatively by providing a function that will be called with
the most current computed value of the View when it changes; this will
be called at least once (for a constant View):

    View.Sink : ('T -> unit) -> View<'T> -> unit

`Doc` is a special case of a time-varying value: it is a time-varying
list of items representing HTML elements and text nodes. Similarly,
`Attr` describes DOM attributes.  There are combinators for creating
elements, text nodes and attributes.  In addition, lists and
time-varying fragments are conveniently embedded in a single type:

    Doc.Concat : seq<Doc> -> Doc
    Doc.EmbedView : View<Doc> -> Doc

## Design Choices

### Sharing

We opt for explicit ML-style sharing (handling of identity).  F#
programmers would know the difference between these two code
fragments:

    let r = ref ()
    fun () -> f r

    fun () ->
        let r = ref ()
        f r

Similarly to ref cells, `Var`, `Doc` and `View` values have identity
that matters.  For DOM nodes this is used to encapsulate widget state.
`Var` are observable ref cells, so this approach is natural for them.
For the `View` layer, ML-style sharing allows constructing efficient
dataflow graphs.

### Dataflow

UI.Next View and Var types support expressing time-varying values
organized into a data-flow graph.  It is important to remember that
with this abstraction only the latest value matters.  View is
deliberately not suitable for modeling event streams.  Let us
elaborate a bit.

Consider these pairs of time-series:

1. your income last year and your net worth

2. daily rainfall and cumulative rainfall since Jan 1

3. button clicks and current mouse position

4. spreadsheet update cycles and values in spreadsheet cells

The critical difference is what you are interested in.  In case of
button clicks, there are occurences at discrete times, and every
occurence matters; in case of mouse position, there is a value at
every point in time, but what often matters most is the latest value.

View is appropriate to model mouse position, but not button clicks.
Note that this specification admits efficient implementations that
skip update steps, when possible, to align with the latest value.

Typically this is solved directly by callbacks.  While callbacks are
adequate for describing discrete events, using them for synchronizing
time-varying values is sub-optimal.  It is both unreadable and
inefficient, as it over-specifies the update process.

### Monoids

It is a deliberate choice to model `Doc` and `Attr` as monoids.
Having a single often implicit `Concat` operation lets users write
code as the following, without worrying if `x`, `y`, and `z` are nodes
or node-lists.

    ul [x; y; z]

This has grown out of frustration with previous HTML combinators in
WebSharper, which made a distinction between nodes and node-lists in
types, and often required annoying `yield` and `yield!` annotations in
code.

### No Functional Reactive Programming

Functional Reactive Programming (FRP) typically calls click-like
things "events" and mouse position-like things "behaviors."  It then
provides combinators to work and combine both, including combinators
to work with explicit time.

Designing a good FRP library is non-trivial since you have to define
semantics for time (especially important for event simultaneity), and
avoid space and time leaks, which gets especially tricky if
combinators allow dynamism.  Successful approaches include:

* Disallowing first-class events and/or behaviors, and focusing on
  transformers instead (Arrowised FRP)

* Designing a custom type system that rules out
  complicated-to-implement cases of dynamism (Elm)

* Using dynamic dataflow graphs to embed FRP in an imperative world
  (OCaml React, Flapjax) and assuming certain care on the part of the
  user to avoid leaks

The last approach is perhaps the most helpful in our context, where we
want to integrate easily with existing libraries such as DOM API and
miscellaneous JavaScript widgets libraries.  However, for this
iteration of UI.Next, we opted on focusing on a simpler subset of
functinality.  Thus, no FRP.

## No Events

We do not provide event-stream combinators.  The default in F# UIs is
to use callbacks that mutate objects to describe change.  This is what
UI.Next currently recommends, with observable `Var` cells taking the
place of mutable objects.  We feel that this default suffices for most
applications.

What we might provide in the future is Concurrent ML or Hopac
combinators.  Concurrent process paradigm is a clean fit to the UI
domain, and is powerful enough to easily express and reason about
commonly used special cases such as:

1. mutable objects changed by callbacks (special case of processes
   synchronizing on events)

2. various stream transformers (again, special case of processes with
   input and output channels)

F# also has first-class imperative events, the IObservable interface
and the associated library of event stream combinators (Rx).  We did
not go with combinators such as Rx.  Just like FRP, these are tricky,
especially in the dynamic case, as it is easy to introduce a memory
leak by accidentally retaining the entire event stream history.  It
also should be possible to use these libraries with F#/WebSharper
already.

## UI Components

What are the design considerations for structuring user interfaces?
As with all design, we want to compose an application from components
that can be individually described, understood, implemented and
tested.

Vars and Views provide a simple way to split UI into components.  A
component defines a model as a combination of Vars, state transitions
as functions that mutate the model, and several Views computed from
the Vars, including a `Doc` value defining how to render the
component.

Just like CML channels and first-class composable events, View<'T> is
thus an excellent type for describing component boundaries and then
gluing components together.

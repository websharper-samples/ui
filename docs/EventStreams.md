### Event Streams

We do not currently provide first-class event streams or even
first-class event stream transformers, as found in [FRP](FRP.md) and
other libraries.

The default in F# UIs is to use callbacks that mutate objects to
describe change.  This is what UI.Next currently recommends, with
observable `Var` cells taking the place of mutable objects.

Rationale: callbacks and mutation, when combined with abstract types
and encapsulation, are not a bad tool for working with event streams.
A good way to reason about systems with callbacks is to pieces of
mutable state with associated operations as a communicating process in
a process caluculus, and callback parameters as communication
channels.

Situations where callbacks feel too low-level are:

* when used to perform sync of related time-varying values - this is
  what our dataflow combinators address, using a higher-level approach
  describes the relationships without describing how to perform the
  sync

* when ordering of effects becomes important and thus advanced
  synchronization is needed - we feel in context of ML languages with
  simple type systems this is best addressed by [Concurrent
  ML](CML.md)

F# also has first-class imperative events, the `IObservable` interface
and the associated library of event stream combinators (Rx).  We did
not go with combinators such as Rx.  Just like FRP, these are tricky,
especially in the dynamic case.  It is easy to miss occurences or else
introduce a memory leak by accidentally retaining the entire event
stream history.  It also should be possible to use these libraries
with F#/WebSharper already.


# FRP

Functional Reactive Programming (FRP) typically provides an Event type
for event streams and a Behavior type for time-varying values,
together with useful combinators on those.

Designing a good FRP library is possible but non-trivial since you
have to define semantics for time (especially important for event
simultaneity), and avoid space and time leaks, which gets especially
tricky if combinators allow dynamism (non-static dependency graphs).

Successful simplifications include:

* Disallowing first-class events and/or behaviors, and focusing on
  transformers instead (Arrowised FRP)

* Designing a custom type system that rules out
  complicated-to-implement cases of dynamism (Elm.js)

* Using dynamic dataflow graphs to embed FRP in an imperative world
  (OCaml React, Flapjax) and assuming certain care on the part of the
  user to avoid leaks, since the type system is too weak to help

The last approach is perhaps the most helpful in our context, where we
want to integrate easily with existing libraries such as DOM API, be
compatible with a simple ML type system, avoid relying on weak
pointers.

However, for now we decided to avoid implementing FRP.  Instead, we
focus on a subset of functionality closely related to the FRP concept
of Behavior.  [Event streams](EventStreams.md) are left for the user
to tackle using callbacks or third-party libraries.

We hope to provide [Concurrent ML](CML.md) combinators in the future
to better support composition of [Components](Components.md).


# Components

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

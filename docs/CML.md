# Concurrent ML

What we might provide in the future is Concurrent ML or Hopac
combinators.  Concurrent process paradigm is a clean fit to the UI
domain, and is powerful enough to easily express and reason about
commonly used special cases such as:

1. mutable objects changed by callbacks (special case of processes
   synchronizing on events)

2. various stream transformers (again, special case of processes with
   input and output channels)

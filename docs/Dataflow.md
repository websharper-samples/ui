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

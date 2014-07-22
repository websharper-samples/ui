# Var

```fsharp
type Var<'T>
```

A time-varying variable that behaves like a ref cell that
can also be observed for changes by independent processes.

Creates a fresh variable with the given initial value.

```fsharp
Var.Create : 'T -> Var<'T>
```

<a name="Var.Get" href="#">#</a> Var.**Get** `Var<'T> -> 'T`

Obtains the current value.

```fsharp
Var.Get : Var<'T> -> 'T
var.Value : 'T
```

<a name="Var.Set" href="#">#</a> Var.**Set** `Var<'T> -> 'T -> unit`

Sets the current value.

```fsharp
Var.Set : Var<'T> -> 'T -> unit
var.Value : 'T with set
```

<a name="Var.SetFinal" href="#">#</a> Var.**SetFinal** `Var<'T> -> 'T -> unit`

Sets the final value (after this, Set/Update are invalid).
This is rarely needed, but can help solve memory leaks when
mutliple views are scheduled to wait on a variable that is never
going to change again.

```fsharp
Var.SetFinal : Var<'T> -> 'T -> unit
```

<a name="Var.Update" href="#">#</a> Var.**Update** `Var<'T> -> ('T -> 'T) -> unit`

Updates the current value.

```fsharp
Var.Update : Var<'T> -> ('T -> 'T) -> unit
```

<a name="var.View" href="#">#</a> var.**View** `View<'T>`

```fsharp
var.View : View<'T>
```

The corresponding view.

Note: at this point there are no exception semantics, so
please provide only pure (non-throwing) functions to this API.

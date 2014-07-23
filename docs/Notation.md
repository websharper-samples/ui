# Notation
> [Documentation](../README.md) ▸ [API Reference](API.md) ▸ **Notation**

The Notation module provides infix operators to make UI.Next code more concise.
To use, you need to `open IntelliFactory.WebSharper.UI.Next.Notation`.

```fsharp
namespace IntelliFactory.WebSharper.UI.Next

module Notation =
    val inline ( ! ) : ^x -> ^a
        when ^x: (member Value: ^a with get)

    val inline ( := ) : ^x -> ^a -> unit
        when ^x: (member Value: ^a with set)

    val inline ( <~ ) : ^x -> (^a -> ^a) -> unit
        when ^x: (member Value: ^a with get) and ^x: (member Value: ^a with set)
    
    val inline ( += ) : ^x -> ^b -> unit
        when ^x: (member Value: ^a with get) and ^x: (member Value: ^a with set) and (^a or ^b): (static member ( + ): ^a * ^b -> ^a)

    val inline ( -= ) : ^x -> ^b -> unit
        when ^x: (member Value: ^a with get) and ^x: (member Value: ^a with set) and (^a or ^b): (static member ( - ): ^a * ^b -> ^a)

    val inline ( *= ) : ^x -> ^b -> unit
        when ^x: (member Value: ^a with get) and ^x: (member Value: ^a with set) and (^a or ^b): (static member ( * ): ^a * ^b -> ^a)

    val inline ( /= ) : ^x -> ^b -> unit
        when ^x: (member Value: ^a with get) and ^x: (member Value: ^a with set) and (^a or ^b): (static member ( / ): ^a * ^b -> ^a)

    val inline ( %= ) : ^x -> ^b -> unit
        when ^x: (member Value: ^a with get) and ^x: (member Value: ^a with set) and (^a or ^b): (static member ( % ): ^a * ^b -> ^a)

    val inline incr : cell: ^a -> unit
        when ^a: (member Value: int with get) and ^a: (member Value: int with set)

    val inline decr : cell: ^a -> unit
        when ^a: (member Value: int with get) and ^a: (member Value: int with set)

    val inline (|>>) : View<'A> -> ('A -> 'B) -> View<'B>

    val inline (>>=) : View<'A> -> ('A -> View<'B>) -> View<'B>

    val inline (<*>) : View<'A -> 'B> -> View<'A> -> View<'B> 

    val inline (!*) : Var<'T> -> View<'T>

```

## Access and Mutation

<a name="Get" href="#Get">#</a> Doc.**!** `^x -> ^a`

Gets the value of a `Var`. For example, `!v` is equivalent to `Var.Get v`.

<a name="Set" href="#Set">#</a> Doc.**:=** `^x -> ^a -> unit`

Sets the value of a `Var`. For example, `v := "hello"` is equivalent to `Var.Set v "hello"`.

<a name="Update" href="#Update">#</a> Doc.**<~** `^x -> (^a -> ^a) -> unit`

Updates the value of a `Var` based on its current value. For example, `x <~ (fun x -> x.ToUpper())` is equivalent to `Var.Update x (fun y -> y.ToUpper())`


## Arithmetic

<a name="Plus" href="#Plus">#</a> Doc.**+=** `^x -> ^b -> unit`

Adds a value to the value of a `Var`. For example, `x += 5` is equal to `Var.Update x (fun y -> y + 5)`.

<a name="Minus" href="#Minus">#</a> Doc.**-=** `^x -> ^b -> unit`

Subtracts a value from the value of a `Var`. For example, `x -= 5` is equal to `Var.Update x (fun y -> y - 5)`.

<a name="Divides" href="#Divides">#</a> Doc.**/=** `^x -> ^b -> unit`

Divides a value by the value of a `Var`. For example, `x /= 5` is equal to `Var.Update x (fun y -> y / 5)`.

<a name="Mult" href="#Mult">#</a> Doc.***=** `^x -> ^b -> unit`

Multiplies a value by the value of a `Var`. For example, `x *= 5` is equal to `Var.Update x (fun y -> y * 5)`.

<a name="Mod" href="#Mod">#</a> Doc.**%=** `^x -> ^b -> unit`

Calculates the value of the value of a `Var` modulo a given value. For example, `x %= 5` is equal to `Var.Update x (fun y -> y % 5)`.

<a name="Incr" href="#Incr">#</a> Doc.**incr** `^x -> unit`

Adds 1 to the value of a `Var`. For example, `incr x` is equivalent to `Var.Update x (fun y -> y + 1)`

<a name="Decr" href="#Decr">#</a> Doc.**decr** `^x -> unit`

Subtracts 1 from the value of a `Var`. For example, `decr x` is equivalent to `Var.Update x (fun y -> y - 1)`

## Functional Combinators


<a name="Map" href="#Map">#</a> Doc.**|>>** `View<'A> -> ('A -> 'B) -> View<'B>`

Infix notation for mapping a function over a view. For example, `v1 |>> (fun x -> x.ToUpper())` is equivalent to `View.Map (fun x -> x.ToUpper()) v1`.

<a name="Bind" href="#Bind">#</a> Doc.**>>=** `View<'A> -> ('A -> View<'B>) -> View<'B>`

Infix notation for monadic view composition. `v1 >>= (fun x -> View.Const(x + 5))` is equivalent to `View.Bind v1 (fun x -> View.Const(x + 5))`.

<a name="Bind" href="#Bind">#</a> Doc.**<*>** `View<'A -> 'B> -> View<'A> -> View<'B>`

Infix notation for applicative composition. For example, `vf <*> v` is equivalent to `View.Apply vf v`.

<a name="FromVar" href="#FromVar">#</a> Doc.**!*** `Var<'T> -> View<'T>`

Shorthand for creating a `View` from a `Var`. For example, `View.Map (fun x -> x.ToUpper()) !* v` is equivalent to `View.Map (fun x -> x.ToUpper()) (View.FromVar v)`.

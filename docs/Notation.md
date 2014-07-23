# Notation
> [Documentation](../README.md) ▸ [API Reference](API.md) ▸ **Notation**

The Notation module provides infix operators to make UI.Next code more concise.
To use, you need to:

`open IntelliFactory.WebSharper.UI.Next.Notation`.

Note that `!` and `:=` still work for `ref` as usual, even when overloaded.

Symbol        | Meaning
------------- | ------------------
`!x`          | [Var.Get](Var.md#Get) - `Var.Get x` 
`x := y`      | [Var.Set](Var.md#Set) - `Var.Set x y`
`x <~ f`      | [Var.Update](Var.md#Update) - `Var.Update x f`
`x |>> f`     | [View.Map](View.md#Map) - `View.Map f x`
`x >>= f`     | [View.Bind](View.md#Bind) - `View.Bind f x`
`f <*> x`     | [View.Apply](View.md#Apply) - `View.Apply f x`

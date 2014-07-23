# Router
> [Documentation](../README.md) ▸ [API Reference](API.md) ▸ **Router**

Routers facilitate organizing sub-sites into an implicit Trie, taking care of
propagating changes between current browser hash-route (URL part) and the logical
"place" in a site.

```fsharp
namespace IntelliFactory.WebSharper.UI.Next

type RouteId
type Router<'T>

type Router =

    static member Dir : prefix: string -> seq<Router<'T>> -> Router<'T>
    static member Merge : seq<Router<'T>> -> Router<'T>
    static member Prefix : prefix: string -> Router<'T> -> Router<'T>
    static member Route : RouteMap<'A> -> 'A -> (RouteId -> Var<'A> -> 'T) -> Router<'T>

    static member Install : ('T -> RouteId) -> Router<'T> -> Var<'T>
```

## Types

<a href="#Router" name="Router">#</a> **Router** `type Router<'T>`

<a href="#RouteId" name="RouteId">#</a> **RouteId** `type RouteId`

## Constructing

<a href="#Route" name="Route">#</a> Router.**Route** `RouteMap<'A> -> 'A -> (RouteId -> Var<'A> -> 'T) -> Router<'T>`

## Using

<a href="#Install" name="Install">#</a> Router.**Install** `('T -> RouteId) -> Router<'T> -> Var<'T>`

## Combining

<a href="#Dir" name="Dir">#</a> Router.**Dir** `string -> seq<Router<'T>> -> Router<'T>`

<a href="#Merge" name="Merge">#</a> Router.**Merge** `seq<Router<'T>> -> Router<'T>`

<a href="#Prefix" name="Prefix">#</a> Router.**Prefix** `string -> Router<'T> -> Router<'T>`


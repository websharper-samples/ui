# Attr
> [Documentation](../README.md) ▸ [API Reference](API.md) ▸ **Attr**

Combinators for constructing time-varying and animated DOM attributes.
The concept of attributes is understood generally to include style properties,
event handlers and other things that can decorate a DOM node.

```fsharp
namespace IntelliFactory.WebSharper.UI.Next

type Attr =
    static member Create : name: string -> value: string -> Attr
    static member Dynamic : name: string -> value: View<string> -> Attr
    static member internal DynamicCustom : set: (Element -> 'T -> unit) -> value: View<'T> -> Attr
    static member Animated : name: string -> Trans<'T> -> view: View<'T> -> value: ('T -> string) -> Attr
    static member Style : name: string -> value: string -> Attr
    static member DynamicStyle : name: string -> value: View<string> -> Attr
    static member AnimatedStyle : name: string -> Trans<'T> -> view: View<'T> -> value: ('T -> string) -> Attr
    static member Handler : name: string -> callback: (DomEvent -> unit) -> Attr
    static member Class : name: string -> Attr
    static member DynamicClass : name: string -> view: View<'T> -> apply: ('T -> bool) -> Attr

    static member Append : Attr -> Attr -> Attr
    static member Concat : seq<Attr> -> Attr
    static member Empty : Attr
```



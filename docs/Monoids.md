# Monoids

It is a deliberate choice to model `Doc` and `Attr` as monoids.
Specifically:

```fsharp
val Doc.Concat : seq<Doc> -> Doc
val Attr.Concat : seq<Attr> -> Doc
```

And also `Doc.Empty`, `Doc.Append`, `Attr.Empty`, `Attr.Append`.

Having a single `Concat` operation lets users write code naturally,
without worrying components such as `x`, `y`, and `z` are nodes or
node-lists, attributes or attribute lists:

```fsharp
ul [x; y; z]
```

This decision has grown out of frustration with previous HTML
combinators in WebSharper, which made a distinction between nodes and
node-lists in types, and often required `yield` and `yield!`
annotations in code.

Type-level distinctions are only helpful for pattern-matching or
destructuring, which our combinators do not allow.  For purely
generative APIs, a single type with monoid operations is perfect.

For another example, consider how having a unified type also works
well with dynamic fragments.  Here is a dynamic fragment that is
either a node-list or empty:

```fsharp
let model = Var.Create true
let view =
  model.View
  |> View.Map (fun x ->
    if x then
      Doc.Concat [
        hr []
        text "ok"
      ]
    else
      Doc.Empty)
  |> Doc.EmbedView
div [ view ]
```

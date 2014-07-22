# Doc
> [Documentation](../README.md) ▸ [API Reference](API.md) ▸ **Doc**

The `Doc` type represents a time-varying collection of DOM nodes,
with [Attr](Attr.md) describing reactive attributes.  Making no distinction
between a node and a node list makes it easy to construct dynamic interfaces
which add, remove and replace nodes, without explicitly scheduling the
actual steps.

Identity  matters with documents (see [Sharing](Sharing.md)). It is assumed that
the any document is only used at once place in the parent document.

```fsharp
namespace IntelliFactory.WebSharper.UI.Next

type Doc =
    static member Element : name: string -> seq<Attr> -> seq<Doc> -> Doc
    static member EmbedView : View<Doc> -> Doc
    static member Static : Element -> Doc
    static member TextView : View<string> -> Doc
    static member TextNode : string -> Doc

    static member Append : Doc -> Doc -> Doc
    static member Concat : seq<Doc> -> Doc
    static member Empty : Doc

    static member Run : Element -> Doc -> unit
    static member RunById : id: string -> Doc -> unit

    static member Input : seq<Attr> -> Var<string> -> Doc
    static member InputArea : seq<Attr> -> Var<string> -> Doc
    static member PasswordBox : seq<Attr> -> Var<string> -> Doc
    static member Button : caption: string -> seq<Attr> -> (unit -> unit) -> Doc
    static member Link : caption: string -> seq<Attr> -> (unit -> unit) -> Doc
    static member CheckBox<'T when 'T : equality> : ('T -> string) -> list<'T> -> Var<list<'T>> -> Doc
    static member Select<'T when 'T : equality> : seq<Attr> -> ('T -> string) -> list<'T> -> Var<'T> -> Doc
```

## Constructing

<a name="Doc" href="#Doc">#</a> **Doc** `type Doc`

Represents a time-varying collection of nodes.

<a name="Element" href="#Element">#</a> Doc.**Element** `string -> seq<Attr> -> seq<Doc> -> Doc`

Constructs an element node with a given name, attributes and children.

<a name="Static" href="#Static">#</a> Doc.**Static** `Element -> Doc`

Embeds an already consturcted DOM element into the `Doc` type.

<a name="TextView" href="#TextView">#</a> Doc.**TextView** `View<string> -> Doc`

Constructs a time-varying text node.

<a name="TextNode" href="#TextNode">#</a> Doc.**TextNode** `string -> Doc`

Constructs a simple text node. An optimization of `Doc.TextView (View.Const x)`.

## Combining

<a name="Append" href="#Append">#</a> Doc.**Append** `Doc -> Doc -> Doc`

Appends two node sequences into one sequence. 

<a name="Concat" href="#Concat">#</a> Doc.**Concat** `seq<Doc> -> Doc`

Concatenates multiple sequences into one.

<a name="Empty" href="#Empty">#</a> Doc.**Empty** `Doc`

The empty document sequence.

## Running

<a name="Run" href="#Run">#</a> Doc.**Run** `Element -> Doc -> unit`

Starts a process that synchronizes the children of a given element with
the given time-varying document.  This should only be used as one of the
application entry points.  The provided Element is typically a placeholder
element in an HTML template.

<a name="RunById" href="#RunById">#</a> Doc.**RunById** `string -> Doc -> unit`

Similar to <a href="#Run">Doc.Run</a>, but takes an element identifier
to locate the parent placeholder element with `document.getElementById`.

## Forms

TODO..









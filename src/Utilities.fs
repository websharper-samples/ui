namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Html
open WebSharper.UI.Client

/// Some shortcut functions for working with the RDOM library.
[<AutoOpen>]
[<JavaScript>]
module internal Utilities =

    /// Class attribute
    let cls n = Attr.Class n

    /// Style attribute
    let sty n v = Attr.Style n v

    /// Div with single class
    let divc c docs = div [cls c] docs

    /// Link with click callback
    let href txt url = a [attr.href url] [text txt]

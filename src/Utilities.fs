namespace WebSharper.UI.Next

open WebSharper
open WebSharper.UI.Next.Html
open WebSharper.UI.Next.Client

/// Some shortcut functions for working with the RDOM library.
[<AutoOpen>]
[<JavaScript>]
module internal Utilities =

    /// Class attribute
    let cls n = Attr.Class n

    /// Style attribute
    let sty n v = Attr.Style n v

    /// Div with single class
    let divc c docs = Doc.Element "div" [cls c] docs

    /// Link with click callback
    let href txt url = Doc.Element "a" [attr.href url] [text txt]
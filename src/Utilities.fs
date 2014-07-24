namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper

/// Some shortcut functions for working with the RDOM library.
[<AutoOpen>]
[<JavaScript>]
module internal Utilities =

    /// Element without attributes
    //let el name c = Doc.Element name [] c

    /// Element with attributes
    //let elA n a c = Doc.Element n a c

    /// Class attribute
    let cls n = Attr.Class n

    /// Style attribute
    let sty n v = Attr.Style n v

    /// Static attribute
    let ( ==> ) k v = Attr.Create k v

    /// Div without attributes
    let div docs = Doc.Element "div" [] docs

    /// Div with single class
    let divc c docs = Doc.Element "div" [cls c] docs

    /// Text node
    let txt t = Doc.TextNode t

    /// Button with Bootstrap attributes
    let btn caption act = Doc.Button caption [cls "btn"; cls "btn-default"] act

    /// Link with click callback
    let link cap attr act = Doc.Link cap attr act

    /// Link with click callback
    let href text url = Doc.Element "a" ["href" ==> url] [txt text]
namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper

// Some shortcut functions for working with the RDOM library.

[<JavaScript; AutoOpen>]
module Utilities =
        // Element without attributes
        let el name = Doc.Element name []
        // Element with attributes
        let elA = Doc.Element
        // Class attribute
        let cls = Attr.CreateClass
        // Style attribute
        let sty = Attr.CreateStyle
        // Static attribute
        let ( ==> ) k v = Attr.Create k v
        // Div without attributes
        let (div : seq<Doc> -> Doc) = Doc.Element "div" []
        // Div with single class
        let divc c = Doc.Element "div" [cls c]
        // Text node
        let txt = Doc.TextNode
        // Button with Bootstrap attributes
        let btn caption = Doc.Button caption [cls "btn" ; cls "btn-default"]
        // Link with click callback
        let link = Doc.Link
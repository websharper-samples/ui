# Html
> [Documentation](../README.md) ▸ [API Reference](API.md) ▸ **Html**

The `Html` module contains functions for constructing HTML elements. All of these functions are simply a convenience wrapper around `Doc.Element`: so for example

```fsharp
Div [] [
    Doc.TextNode "Hello!"
]
```

would be equivalent to

```fsharp
Doc.Element "Div" [] [
    Doc.TextNode "Hello!"
]
```

Here is the full list of supported HTML element types:

## Supported HTML Element Types

* A
* Abbr
* Address
* Area
* Article
* Aside
* Audio
* B
* Base
* Bdi
* Bdo
* Blockquote
* Body
* BR
* Button
* Canvas
* Caption
* Cite
* Code
* Col
* Colgroup
* Data
* Datalist
* DD
* Del
* Details
* Dfn
* Div
* DL
* DT
* EM
* Embed
* Fieldset
* Figcaption
* Figure
* Footer
* Form
* H1
* H2
* H3
* H4
* H5
* H6
* Head
* Header
* HR
* Html
* I
* Iframe
* Img
* Input
* Ins
* Kbd
* Keygen
* Label
* Legend
* LI
* Link
* Main
* MAP
* Mark
* Menu
* Menuitem
* Meta
* Meter
* Nav
* Noscript
* Object
* OL
* Optgroup
* Option
* Output
* P
* Param
* Picture
* Pre
* Progress
* Q
* RP
* RT
* Ruby
* S
* Samp
* Script
* Section
* Select
* Small
* Source
* Span
* Strong
* Style
* Sub
* Summary
* Sup
* Table
* Tbody
* TD
* Textarea
* Tfoot
* TH
* Thead
* Time
* Title
* TR
* Track
* U
* UL
* VAR
* Video
* Wbr

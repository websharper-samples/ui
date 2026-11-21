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

    /// A white content card with an optional heading.
    let card title body =
        div [cls "card"] [
            div [cls "card-head"] [
                h3 [] [ text title ]
            ]
            div [cls "card-body"] [ body ]
        ]

    /// A content card with a heading and a short explanatory line.
    let cardWithHint title hint body =
        div [cls "card"] [
            div [cls "card-head"] [
                h3 [] [ text title ]
                p [cls "card-hint"] [ text hint ]
            ]
            div [cls "card-body"] [ body ]
        ]

    /// A small rounded label.
    let pill label = span [cls "pill"] [ text label ]

    /// A KPI tile.
    let statTile label value hint =
        div [cls "stat"] [
            span [cls "stat-label"] [ text label ]
            strong [cls "stat-value"] [ text value ]
            span [cls "stat-hint"] [ text hint ]
        ]

    /// A two-line section header inside a sample.
    let sectionIntro title subtitle =
        div [cls "section-intro"] [
            h2 [] [ text title ]
            p [cls "lead"] [ text subtitle ]
        ]

    /// A neutral empty-state placeholder.
    let emptyState message =
        div [cls "empty-state"] [ text message ]

    /// Format a float as a currency-like number with two decimals.
    let fmtMoney (v: float) =
        sprintf "%.2f" v

    /// Format a float with no decimals.
    let fmtInt (v: float) =
        sprintf "%.0f" v

    /// Format a percentage with one decimal.
    let fmtPct (v: float) =
        sprintf "%.1f%%" v

    /// Format an integer with thousands separators.
    let fmtThousands (n: int) =
        let rec chunks (s: string) =
            if s.Length <= 3 then [ s ]
            else chunks (s.Substring(0, s.Length - 3)) @ [ s.Substring(s.Length - 3) ]
        let digits = string (abs n)
        let joined = chunks digits |> String.concat ","
        if n < 0 then "-" + joined else joined
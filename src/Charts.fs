namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Html

/// Small dependency-free SVG chart components used by the dashboard and
/// data-oriented samples.
[<JavaScript>]
module Charts =

    module S = Html.SvgElements
    module SA = Html.SvgAttributes

    let private chartSvg height body =
        S.svg [
            SA.viewBox (sprintf "0 0 640 %.0f" height)
            SA.preserveAspectRatio "none"
            SA.``class`` "chart"
        ] [ body ]

    /// A responsive bar chart with value labels underneath.
    let barChart (data: (string * float) list) =
        let maxV = data |> List.map snd |> List.fold max 0.0001
        let n = max 1 data.Length
        let slot = 640.0 / float n
        let barW = slot * 0.62
        let height = 230.0
        let scale = 185.0 / maxV
        let bars =
            data
            |> List.mapi (fun i (label, value) ->
                let h = value * scale
                let x = slot * float i + (slot - barW) / 2.0
                let y = 195.0 - h
                S.g [] [
                    S.rect [
                        SA.x (sprintf "%.2f" x)
                        SA.y (sprintf "%.2f" y)
                        SA.width (sprintf "%.2f" barW)
                        SA.height (sprintf "%.2f" h)
                        SA.rx "4"
                        SA.``class`` "chart-bar"
                    ] []
                    S.text [
                        SA.x (sprintf "%.2f" (x + barW / 2.0))
                        SA.y "215"
                        SA.textAnchor "middle"
                        SA.``class`` "chart-label"
                    ] [ text label ]
                ])
        chartSvg height (S.g [] bars)

    /// A line chart with a soft area fill.
    let lineChart (values: float list) =
        let w = 640.0
        let h = 210.0
        let maxV = values |> List.fold max 0.0001
        let n = max 1 values.Length
        let pts =
            values
            |> List.mapi (fun i v ->
                let x = if n = 1 then 0.0 else w * float i / float (n - 1)
                let y = 185.0 - (v / maxV) * 165.0
                sprintf "%.2f,%.2f" x y)
            |> String.concat " "
        let area =
            if values.IsEmpty then ""
            else sprintf "M 0,190 L %s L %.2f,190 Z" pts w
        chartSvg h (S.g [] [
            S.path [ SA.d area ; SA.``class`` "chart-area" ] []
            S.polyline [ SA.points pts ; SA.``class`` "chart-line" ] []
        ])

    /// A horizontal labelled breakdown bar.
    let breakdownBar label value total =
        let pct = if total <= 0.0 then 0.0 else (value / total) * 100.0
        div [cls "breakdown-row"] [
            span [cls "breakdown-label"] [ text label ]
            div [cls "breakdown-track"] [
                div [cls "breakdown-fill"; sty "width" (sprintf "%.1f%%" pct)] []
            ]
            span [cls "breakdown-value"] [ text (fmtMoney value) ]
        ]

    /// A simple progress bar.
    let progress pct =
        div [cls "progress"] [
            div [cls "progress-fill"; sty "width" (sprintf "%.1f%%" (max 0.0 (min 100.0 pct)))] []
        ]
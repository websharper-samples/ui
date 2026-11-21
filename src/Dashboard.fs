namespace WebSharper.UI

open WebSharper
open WebSharper.JavaScript
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation

/// App: a live operations dashboard with derived KPIs and animated charts.
[<JavaScript>]
module Dashboard =

    type Point = { Label : string ; Value : float }

    type Kpis =
        {
            Total : float
            Average : float
            Peak : float
            Change : float
        }

    let initial =
        [ 42.0 ; 48.0 ; 45.0 ; 61.0 ; 58.0 ; 66.0 ; 72.0 ; 69.0 ; 78.0 ; 84.0
          81.0 ; 88.0 ; 95.0 ; 91.0 ; 103.0 ; 99.0 ; 112.0 ; 108.0 ; 121.0 ; 128.0
          124.0 ; 136.0 ; 141.0 ; 138.0 ; 149.0 ; 156.0 ; 152.0 ; 164.0 ; 171.0 ; 180.0 ]

    let private kpisOf (xs: float list) =
        if List.isEmpty xs then { Total = 0. ; Average = 0. ; Peak = 0. ; Change = 0. }
        else
            let total = List.sum xs
            let avg = total / float xs.Length
            let peak = List.max xs
            let change =
                let first = List.head xs
                let last = List.last xs
                if first = 0.0 then 0.0 else (last - first) / first * 100.0
            { Total = total ; Average = avg ; Peak = peak ; Change = change }

    let Main _ =
        let series = Var.Create initial
        let range = Var.Create 30
        let live = Var.Create false
        let lastUpdated = Var.Create 0

        let window =
            View.Map2 (fun (xs: float list) n ->
                let take = min n xs.Length
                xs |> List.skip (xs.Length - take))
                (View.FromVar series)
                (View.FromVar range)

        let kpis = window |> View.Map kpisOf

        let tick () =
            if live.Value then
                let xs = series.Value
                let last = List.last xs
                let drift = (Math.Random () - 0.48) * 14.0
                let next = max 10.0 (last + drift)
                series.Value <- (if xs.Length >= 60 then List.tail xs else xs) @ [ next ]
                lastUpdated.Value <- lastUpdated.Value + 1

        JS.SetInterval tick 1400 |> ignore

        let kpiTiles =
            kpis
            |> View.Map (fun k ->
                div [cls "stat-grid"] [
                    statTile "Revenue in range" ("€" + fmtInt k.Total) "sum of the visible window"
                    statTile "Average / tick" ("€" + fmtInt k.Average) "mean value"
                    statTile "Peak" ("€" + fmtInt k.Peak) "best tick in range"
                    statTile "Change"
                        (sprintf "%s%.1f%%" (if k.Change >= 0.0 then "+" else "") k.Change)
                        "first tick vs. last tick"
                ])
            |> Doc.EmbedView

        let rangeButton n label =
            Doc.Button label
                [ cls "tab" ; Attr.DynamicClassPred "active" (View.Map ((=) n) range.View) ]
                (fun () -> range.Value <- n)

        let liveButton =
            Doc.Button "Live"
                [ cls "btn" ; cls "btn-small" ; Attr.DynamicClassPred "btn-live" (View.FromVar live) ]
                (fun () -> live.Value <- not live.Value)

        let trend =
            window
            |> View.Map (fun xs ->
                let values = xs |> List.map (fun v -> v) 
                Charts.lineChart values)
            |> Doc.EmbedView

        let channels =
            [
                ("Web", 42.0)
                ("Mobile", 28.0)
                ("Partner", 17.0)
                ("Direct", 13.0)
            ]

        let activity =
            [
                ("New subscription", "Web · 2 minutes ago")
                ("Payment recovered", "Mobile · 9 minutes ago")
                ("Trial converted", "Partner · 21 minutes ago")
                ("Refund issued", "Direct · 43 minutes ago")
                ("Plan upgraded", "Web · 1 hour ago")
            ]

        Doc.Concat [
            p [cls "sample-blurb"] [
                text "A live operations view: a timer feeds a series Var, while totals, \
                 averages, change and charts are all derived views over it."
            ]
            div [cls "toolbar dashboard-toolbar"] [
                div [cls "segmented"] [
                    rangeButton 7 "7 ticks"
                    rangeButton 14 "14 ticks"
                    rangeButton 30 "30 ticks"
                ]
                div [cls "toolbar-right"] [
                    View.FromVar live
                    |> View.Map (fun on ->
                        span [cls "live-indicator"] [
                            span [cls "live-dot"; Attr.DynamicClassPred "on" (View.FromVar live)] []
                            text (if on then "live" else "paused")
                        ])
                    |> Doc.EmbedView
                    liveButton
                    Doc.Button "Simulate spike"
                        [cls "btn"; cls "btn-ghost"; cls "btn-small"]
                        (fun () -> series.Value <- series.Value @ [ (List.last series.Value) * 1.35 ])
                ]
            ]
            kpiTiles
            div [cls "grid-2"] [
                cardWithHint "Revenue trend"
                    "Rendered as an SVG polyline from the visible window."
                    trend
                cardWithHint "Traffic by channel"
                    "Static breakdown rendered with the same chart helpers."
                    (Charts.barChart channels)
            ]
            cardWithHint "Recent activity"
                "A plain list, included to show the layout composing with charts."
                (ul [cls "feed"] (
                    activity
                    |> List.map (fun (title, meta) ->
                        li [] [
                            span [cls "feed-dot"] []
                            div [] [
                                strong [] [ text title ]
                                span [cls "muted"] [ text meta ]
                            ]
                        ])
                ))
        ]

    let Description _ =
        div [] [
            text "A live dashboard with derived KPIs, range controls and animated charts."
        ]

    let Sample =
        Samples.Build(Samples.Dashboard)
            .Id("Dashboard")
            .FileName(__SOURCE_FILE__)
            .Keywords(["app"; "dashboard"; "charts"])
            .Category(Samples.App)
            .Render(Main)
            .RenderDescription(Description)
            .Create()
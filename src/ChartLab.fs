namespace WebSharper.UI

open WebSharper
open WebSharper.JavaScript
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation

/// Suite: animated SVG charts driven by CSV data and reactive views.
[<JavaScript>]
module ChartLab =

    module S = Html.SvgElements
    module SA = Html.SvgAttributes

    // ------------------------------------------------------------ population

    module Population =

        type AgeBracket = AgeBracket of string
        type State = State of string

        type DataSet =
            {
                Brackets : AgeBracket []
                Population : AgeBracket -> State -> int
                States : State []
            }

            static member Ratio ds br st =
                let total = AgeBracket "Total"
                double (ds.Population br st) / double (ds.Population total st)

            static member TopStatesByRatio ds bracket =
                ds.States
                |> Array.map (fun st -> (st, DataSet.Ratio ds bracket st))
                |> Array.sortBy (fun (_, r) -> -r)
                |> fun sorted -> sorted.[0 .. min 9 (sorted.Length - 1)]

            static member ParseCSV (data: string) =
                let all =
                    data.Split [| '\r' ; '\n' |]
                    |> Array.filter (fun s -> s <> "")
                let brackets =
                    let header = all.[0].Split ','
                    Array.map AgeBracket header.[1..]
                let rows =
                    Array.sub all 1 (all.Length - 1)
                    |> Array.map (fun s -> s.Split ',')
                let states = rows |> Array.map (fun r -> State r.[0])
                let stateIndex s = rows |> Array.findIndex (fun r -> r.[0] = s)
                let bracketIndex b = Array.findIndex ((=) b) brackets
                let population bracket (State st) =
                    int rows.[stateIndex st].[1 + bracketIndex bracket]
                {
                    Brackets = brackets
                    Population = population
                    States = states
                }

            static member LoadFromCSV (url: string) =
                Async.FromContinuations (fun (ok, _, _) ->
                    JS.Fetch(url).Then(fun (resp: Response) ->
                        resp.Text().Then(fun text ->
                            ok (DataSet.ParseCSV text))
                        |> ignore)
                    |> ignore)

        type StateView =
            {
                MaxValue : double
                Position : int
                State : string
                Total : int
                Value : double
            }

        let width = 960.0
        let height = 250.0

        let setupDataModel () =
            let dataSet =
                View.Const ()
                |> View.MapAsync (fun () -> DataSet.LoadFromCSV "ObjectConstancy.csv")
            let bracket = Var.Create (AgeBracket "Under 5 Years")
            let shownData =
                View.Map2 DataSet.TopStatesByRatio dataSet bracket.View
                |> View.Map (fun xs ->
                    let n = xs.Length
                    let m = Array.map snd xs |> Array.max
                    xs
                    |> Array.mapi (fun i (State st, d) ->
                        {
                            MaxValue = m ; Position = i ; Total = n
                            State = st ; Value = d
                        })
                    |> Array.toSeq)
            (dataSet, bracket, shownData)

        let simpleAnimation x y =
            Anim.Simple Interpolation.Double Easing.CubicInOut 300. x y

        let simpleTransition = Trans.Create simpleAnimation

        let inOutTransition =
            simpleTransition
            |> Trans.Enter (fun x -> simpleAnimation height x)
            |> Trans.Exit (fun x -> simpleAnimation x height)

        let percent (x: double) =
            string (floor (100. * x)) + "." + string (int (floor (1000. * x)) % 10) + "%"

        let render _ (state: View<StateView>) =
            let anim name kind (proj: StateView -> double) =
                Attr.Animated name kind (View.Map proj state) string
            let x st = width * st.Value / st.MaxValue
            let y st = height * double st.Position / double st.Total
            let h st = height / double st.Total - 2.
            let txt f attrs =
                S.text attrs [ state |> View.Map f |> Doc.TextView ]
            Doc.Concat [
                S.g [Attr.Style "fill" "var(--brand)"] [
                    S.rect [
                        SA.x "0"
                        anim "y" inOutTransition y
                        anim "width" simpleTransition x
                        anim "height" simpleTransition h
                    ] []
                ]
                txt (fun s -> percent s.Value) [
                    Attr.Create "text-anchor" "end"
                    anim "x" simpleTransition x
                    anim "y" inOutTransition y
                    SA.dx "-2"
                    SA.dy "14"
                    SA.``class`` "chart-inside-label"
                ]
                txt (fun s -> s.State) [
                    SA.x "0"
                    anim "y" inOutTransition y
                    SA.dx "2"
                    SA.dy "16"
                    SA.``class`` "chart-inside-label"
                ]
            ]

        let demo () =
            let (dataSet, bracket, shownData) = setupDataModel ()
            div [] [
                div [cls "toolbar"] [
                    div [cls "field"; cls "grow"] [
                        label [] [ text "Age bracket" ]
                        dataSet
                        |> View.Map (fun ds ->
                            Doc.InputType.Select
                                [ cls "form-control" ]
                                (fun (AgeBracket b) -> b)
                                (ds.Brackets.[1..] |> List.ofArray)
                                bracket)
                        |> Doc.EmbedView
                    ]
                ]
                div [cls "chart-frame"] [
                    S.svg [
                        SA.viewBox (sprintf "0 0 %.0f %.0f" width height)
                        SA.``class`` "chart chart-animated"
                    ] [
                        shownData
                        |> View.MapSeqCachedViewBy (fun s -> s.State) render
                        |> View.Map Doc.Concat
                        |> Doc.EmbedView
                    ]
                ]
                p [cls "muted"] [
                    text "Top states by share of population, from the 2008 US Census. \
                          Change the age bracket to see the bars animate to their new positions."
                ]
            ]

    // ------------------------------------------------------------ frequency

    module Frequency =

        type DataEntry = { DataLabel : string ; DataValue : double }

        type DataView =
            {
                Label : string
                Value : double
                Rank : int
                MaxValue : double
                NumData : int
            }

        type Ordering = ByLetter | ByFrequency

        let showOrdering = function
            | ByLetter -> "By letter"
            | ByFrequency -> "By frequency"

        let width = 720.0
        let height = 420.0
        let spacing = 2.0

        let parseCSV (data: string) =
            let all =
                data.Split [| '\r' ; '\n' |]
                |> Array.filter (fun s -> s <> "")
            all.[1..]
            |> Array.map (fun (row: string) ->
                let cells = row.Split ','
                { DataLabel = cells.[0] ; DataValue = System.Double.Parse(cells.[1]) })
            |> Seq.ofArray

        let loadFromCSV (url: string) =
            Async.FromContinuations (fun (ok, _, _) ->
                JS.Fetch(url).Then(fun (resp: Response) ->
                    resp.Text().Then(fun text ->
                        ok (parseCSV text))
                    |> ignore)
                |> ignore)

        let viewData (xs: DataEntry list) ordering =
            let numData = List.length xs
            let maxVal = List.fold (fun acc x -> max acc x.DataValue) 0.0 xs
            let sorted =
                match ordering with
                | ByLetter -> List.sortBy (fun x -> x.DataLabel) xs
                | ByFrequency -> List.sortByDescending (fun x -> x.DataValue) xs
            sorted
            |> List.mapi (fun i x ->
                {
                    Label = x.DataLabel
                    Value = x.DataValue
                    MaxValue = maxVal
                    NumData = numData
                    Rank = i
                })
            |> Seq.ofList

        let simpleAnimation x y =
            Anim.Delayed Interpolation.Double Easing.CubicInOut 300. 0. x y

        let simpleTransition = Trans.Create simpleAnimation

        let barTransition =
            simpleTransition
            |> Trans.Enter (fun x -> simpleAnimation 0. x)

        let render _ (dView: View<DataView>) =
            let anim name kind (proj: DataView -> double) =
                Attr.Animated name kind (View.Map proj dView) string
            let dyn name (proj: DataView -> double) =
                Attr.Dynamic name (View.Map (proj >> string) dView)
            let barWidth d = width / float d.NumData - spacing
            let barHeight d = d.Value / d.MaxValue * height
            let x d = (barWidth d + spacing) * float d.Rank
            let y d = height - barHeight d
            S.g [Attr.Style "fill" "var(--accent)"] [
                S.rect [
                    dyn "width" barWidth
                    dyn "height" barHeight
                    anim "x" barTransition x
                    dyn "y" y
                ] []
                S.text [
                    dyn "x" (fun d -> x d + barWidth d / 2.0)
                    dyn "y" (fun d -> y d - 6.0)
                    SA.textAnchor "middle"
                    SA.``class`` "chart-label"
                ] [ dView |> View.Map (fun d -> d.Label) |> Doc.TextView ]
            ]

        let displayGraph (data: View<seq<DataView>>) =
            S.svg [
                SA.viewBox (sprintf "0 0 %.0f %.0f" width height)
                SA.``class`` "chart chart-animated"
            ] [
                View.MapSeqCachedViewBy (fun d -> d.Label) render data
                |> View.Map Doc.Concat
                |> Doc.EmbedView
            ]

        let demo () =
            let order = Var.Create ByLetter
            let data =
                View.Const ()
                |> View.MapAsync (fun () -> loadFromCSV "AlphaFrequency.csv")
                |> View.Map List.ofSeq
            let dataView = View.Map2 viewData data order.View
            div [] [
                div [cls "toolbar"] [
                    div [cls "field"; cls "grow"] [
                        label [] [ text "Sort bars" ]
                        Doc.InputType.Select [cls "form-control"] showOrdering [ByLetter ; ByFrequency] order
                    ]
                ]
                div [cls "chart-frame"] [ displayGraph dataView ]
                p [cls "muted"] [
                    text "English letter frequency. Switch the ordering and each bar \
                          animates to its new position."
                ]
            ]

    // ------------------------------------------------------------------ page

    let Main _ =
        let tab = Var.Create 0
        let tabButton index label =
            Doc.Button label
                [ cls "tab" ; Attr.DynamicClassPred "active" (View.Map ((=) index) tab.View) ]
                (fun () -> tab.Value <- index)

        Doc.Concat [
            p [cls "sample-blurb"] [
                text "Declarative SVG animation over CSV data — interpolated bars that \
                 transition on every data or ordering change."
            ]
            div [cls "tabs"] [
                tabButton 0 "Population by age"
                tabButton 1 "Letter frequency"
            ]
            tab.View.Doc(fun i ->
                if i = 0 then Population.demo ()
                else Frequency.demo ())
        ]

    let Description _ =
        div [] [
            text "Animated SVG charts built from the same reactive primitives as \
                  the rest of the library."
        ]

    let Sample =
        Samples.Build(Samples.ChartLab)
            .Id("Chart lab")
            .FileName(__SOURCE_FILE__)
            .Keywords(["chart"; "animation"; "svg"])
            .Category(Samples.Suite)
            .Render(Main)
            .RenderDescription(Description)
            .Create()
namespace WebSharper.UI

open WebSharper
open WebSharper.JavaScript
open WebSharper.JQuery
open WebSharper.UI.Html
open WebSharper.UI.Client
open WebSharper.UI.Notation

open System

module SVG = Html.SvgElements
module SVGA = Html.SvgAttributes

[<JavaScript>]
module SortableBarChart =

    type DataEntry =
        {
            DataLabel : string
            DataValue : double
        }

    type DataView =
        {
            Label : string
            Value : double
            Rank : int
            MaxValue : double
            NumData : int
        }

    let mkEntry (row: string[]) =
        let label = row.[0]
        let value = Double.Parse(row.[1])
        {
            DataLabel = label
            DataValue = value
        }

    type Ordering = | ByLetter | ByFrequency
    let ShowOrdering = function
        | ByLetter -> "By Letter"
        | ByFrequency -> "By Frequency"

    let Width = 720.0
    let Height = 500.0
    let Spacing = 2.0 // Temp: would be good to calc this based on num of entries

    let ViewData xs ordering =
        let numData = List.length xs
        let maxVal = List.fold (fun max x -> if x.DataValue > max then x.DataValue else max) 0. xs
        let mkView i x =
            {
                Label = x.DataLabel
                Value = x.DataValue
                MaxValue = maxVal
                NumData = numData
                Rank = i
            }
        let sortFn =
            match ordering with
            | ByLetter -> fun x y -> String.Compare (x.DataLabel, y.DataLabel)
            | ByFrequency -> fun x y ->
                if y.DataValue < x.DataValue then -1 else if x.DataValue = y.DataValue then 0 else 1
        List.ofSeq xs
        |> List.sortWith sortFn
        |> List.mapi mkView
        |> Seq.ofList

    // Parses a data CSV file into the data model
    let ParseCSV (data: string) =
        let all =
            data.Split [|'\r'; '\n'|]
            |> Array.filter (fun s -> s <> "")
        Array.map (fun (str: string) -> str.Split ',' |> mkEntry ) all.[1..]
        |> Seq.ofArray
        //ListModel.Create (fun x -> x.DataLabel) xs

    // Asynchronous loading operation from a given URL
    let LoadFromCSV (url: string) =
        Async.FromContinuations (fun (ok, no, _) ->
            JQuery.Get(url, obj (), fun (data, _, _) ->
                ok (ParseCSV (As<string> data)))
            |> ignore)

    let DelayedAnimation delay x y =
        Anim.Delayed Interpolation.Double Easing.CubicInOut
            300.
            delay
            x y

    // Define a simple declarative animation and transition
    let SimpleAnimation x y = DelayedAnimation 0. x y

    let SimpleTransition =
        Trans.Create SimpleAnimation

    let BarTransition =
        //SimpleTransition
        SimpleTransition
        |> Trans.Enter (fun x -> SimpleAnimation 0. x)

    let Render _ (dView: View<DataView>) =
            let anim name kind (proj: DataView -> double) =
                Attr.Animated name kind (View.Map proj dView) string

            let dyn name (proj: DataView -> double) =
                Attr.Dynamic name (View.Map (proj >> string) dView)
            let width d = (Width / (double d.NumData)) - Spacing
            let height d = (d.Value / d.MaxValue) * Height
            let x d = (width d + Spacing) * (double d.Rank )
            let y d = (Height - height d)

            SVG.g [Attr.Style "fill" "steelblue"] [
                SVG.rect [
                    dyn "width" width
                    dyn "height" height
                    //"x" ==> (string x)
                    anim "x" BarTransition x
                    dyn "y" y
                ] []
            ]
//        |> Doc.EmbedView

    let DisplayGraph (data: View<seq<DataView>>) =
        div [] [
            SVG.svg [SVGA.width (string Width); SVGA.height (string Height)] [
                View.MapSeqCachedViewBy (fun d -> d.Label) Render data
                |> View.Map Doc.Concat
                |> Doc.EmbedView
            ]
        ]

    let LoadData =
        View.MapAsync (fun () -> LoadFromCSV "AlphaFrequency.csv") (View.Const ())

    let Main _ =
        let vOrder = Var.Create ByLetter
        let data = View.Map List.ofSeq LoadData
        let dataView = View.Map2 ViewData data vOrder.View
        div [] [
            Doc.Select [] ShowOrdering [ByLetter ; ByFrequency] vOrder
            DisplayGraph dataView
        ]

    let Description _ =
        div [] [text "This sample show-cases animation and data display."]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build(Samples.SortableBarChart)
            .Id("SortableBarChart")
            .FileName(__SOURCE_FILE__)
            .Keywords(["animation"])
            .Render(Main)
            .RenderDescription(Description)
            .Create()

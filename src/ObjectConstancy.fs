// $begin{copyright}
//
// This file is confidential and proprietary.
//
// Copyright (c) IntelliFactory, 2004-2014.
//
// All rights reserved.  Reproduction or use in whole or in part is
// prohibited without the written consent of the copyright holder.
//-----------------------------------------------------------------
// $end{copyright}

namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.JQuery
open IntelliFactory.WebSharper.UI.Next

/// Attempt to reconstruct this D3 example in UI.Next:
/// http://bost.ocks.org/mike/constancy/

[<JavaScript>]
module ObjectConstancy =

    type AgeBracket = | AgeBracket of string
    type State = | State of string

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
            let sorted =
                ds.States
                |> Array.map (fun st -> (st, DataSet.Ratio ds bracket st))
                |> Array.sortBy (fun (_, r) -> - r)
            sorted.[0..9]

        static member ParseCSV (data: string) =
            let all =
                data.Split [|'\r'; '\n'|]
                |> Array.filter (fun s -> s <> "")
            let brackets =
                let all = all.[0].Split ','
                Array.map AgeBracket all.[1..]
            let data =
                Array.sub all 1 (all.Length - 1)
                |> Array.map (fun s -> s.Split ',')
            let states = data |> Array.map (fun d -> State d.[0])
            let stIx st = data |> Array.findIndex (fun d -> d.[0] = st)
            let brIx bracket = Array.findIndex ((=) bracket) brackets
            let pop bracket (State st) = int data.[stIx st].[1 + brIx bracket]
            {
                Brackets = brackets
                Population = pop
                States = states
            }

        static member LoadFromCSV (url: string) =
            Async.FromContinuations (fun (ok, no, _) ->
                JQuery.Get(url, obj (), fun (data, _, _) ->
                    ok (DataSet.ParseCSV (As<string> data)))
                |> ignore)

    type StateView =
        {
            MaxValue : double
            Position : int
            State : string
            Total : int
            Value : double
        }

    let SetupDataModel () =
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
                        MaxValue = m; Position = i; Total = n
                        State = st; Value = d
                    })
                |> Array.toSeq)
        (dataSet, bracket, shownData)

    let Width = 960.
    let Height = 250.

    let SimpleAnimation x y =
        Anim.Simple Interpolation.Double Easing.CubicInOut
            300. // duration, ms
            x y

    let SimpleTransition =
        Trans.Create SimpleAnimation

    let InOutTransition =
        SimpleTransition
        |> Trans.Enter (fun x -> SimpleAnimation Height x)
        |> Trans.Exit (fun x -> SimpleAnimation x Height)

    let Percent (x: double) =
        string (floor (100. * x)) + "." + string (int (floor (1000. * x)) % 10) + "%"

    let Render (state: View<StateView>) =
        let anim name kind (proj: StateView -> double) =
            Attr.Animated name kind (View.Map proj state) string
        let x st = Width * st.Value / st.MaxValue
        let y st = Height * double st.Position / double st.Total
        let h st = Height / double st.Total - 2.
        let txt f attr = elA "text" attr [state |> View.Map f |> Doc.TextView]
        Doc.Concat [
            elA "g" [Attr.Style "fill" "steelblue"] [
                elA "rect" [
                    "x" ==> "0"
                    anim "y" InOutTransition y
                    anim "width" SimpleTransition x
                    anim "height" SimpleTransition h
                ] []
            ]
            txt (fun s -> Percent s.Value) [
                "text-anchor" ==> "end"
                anim "x" SimpleTransition x; anim "y" InOutTransition y
                "dx" ==> "-2"; "dy" ==> "14"
                sty "fill" "white"
                sty "font" "12px sans-serif"
            ]
            txt (fun s -> s.State) [
                "x" ==> "0"; anim "y" InOutTransition y
                "dx" ==> "2"; "dy" ==> "16"
                sty "fill" "white"
                sty "font" "14px sans-serif"
                sty "font-weight" "bold"
            ]
        ]

    let Main () =
        let (dataSet, bracket, shownData) = SetupDataModel ()
        let link text href = elA "a" ["href" ==> href] [txt text]
        el "div" [
            el "h2" [txt "Top States by Age Bracket, 2008"]
            dataSet
            |> View.Map (fun dS ->
                Doc.Select [cls "form-control"] (fun (AgeBracket b) -> b)
                    (List.ofArray dS.Brackets.[1..]) bracket)
            |> Doc.EmbedView
            elA "div" [cls "skip"] []
            elA "svg" ["width" ==> string Width; "height" ==> string Height] [
                shownData
                |> View.ConvertSeqBy (fun s -> s.State) Render
                |> View.Map Doc.Concat
                |> Doc.EmbedView
            ]
            el "p" [
                txt "Source: "
                link "Census Bureau" "http://www.census.gov/popest/data\
                    /historical/2000s/vintage_2008/"
            ]
            el "p" [
                txt "Original Sample by Mike Bostock: "
                link "Object Constancy" "http://bost.ocks.org/mike/constancy/"
            ]
        ]

    let Description () =
        div [txt "This sample show-cases declarative animation and interpolation (tweening)"]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build()
            .Id("ObjectConstancy")
            .FileName(__SOURCE_FILE__)
            .Keywords(["animation"])
            .Render(Main)
            .RenderDescription(Description)
            .Create()


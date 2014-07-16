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

/// Attempt to reconstruct this D3 example in UI.Next:
/// http://bost.ocks.org/mike/constancy/

[<JavaScript>]
module ObjectConstancy =

    /// Utilities for generating SVG.
    module Svg =

        type Transform =
            | Tr of array<string>

        /// Applies a transform.
        let Apply (Tr tr) docs =
            Doc.Element "g" ["transform" ==> String.concat " " tr] docs

        /// Combines two transforms.
        let Combine (Tr a) (Tr b) = Tr (Array.append a b)

        /// Translate transform.
        let Translate (x: double) (y: double) =
            Tr [| "translate(" + string x + "," + string y + ")" |]

        /// Scale transform.
        let Scale (x: double) (y: double) =
            Tr [| "scale(" + string x + "," + string y + ")" |]

        /// Sets fill (background) color in SVG.
        let Fill (color: string) docs =
            Doc.Element "g" [Attr.Style "fill" color] docs

        /// Vertical layout of multiple elements in SVG.
        let Vertical docs =
            let docs = Seq.toArray docs
            match docs.Length with
            | 0 -> Doc.Empty
            | 1 -> docs.[0]
            | n ->
                let frac = 1. / double n
                Doc.Concat [|
                    for i in 0 .. n - 1 ->
                        let tr = Combine (Translate 0. (double i * frac)) (Scale 1. frac)
                        Apply tr [docs.[i]]
                |]

    type AgeBracket =
        | AgeAny
        | AgeUnder5
        | Age5To13
        | Age14to17
        | Age18to24
        | Age16AndOver
        | Age18AndOver
        | Age15to44
        | Age45to64
        | Age65AndOver
        | Age85AndOver

        static member All =
            [
                AgeAny
                AgeUnder5
                Age5To13
                Age14to17
                Age18to24
                Age16AndOver
                Age18AndOver
                Age15to44
                Age45to64
                Age65AndOver
                Age85AndOver
            ]

        static member Describe bracket =
            match bracket with
            | AgeAny -> "Any Age"
            | AgeUnder5 -> "Under 5 Years"
            | Age5To13 -> "5 to 13 Years"
            | Age14to17-> "14 to 17 Years"
            | Age18to24 -> "18 to 24 Years"
            | Age16AndOver -> "16 Years and Over"
            | Age18AndOver -> "18 Years and Over"
            | Age15to44 -> "15 to 44 Years"
            | Age45to64 -> "45 to 64 Years"
            | Age65AndOver -> "65 Years and Over"
            | Age85AndOver -> "85 Years and Over"

    type State =
        | State of string

    type DataSet =
        {
            Population : AgeBracket -> State -> int
            States : State []
        }

        static member Ratio ds br st =
            double (ds.Population br st) / double (ds.Population AgeAny st)

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
            let data =
                Array.sub all 1 (all.Length - 1)
                |> Array.map (fun s -> s.Split ',')
            let states =
                data
                |> Array.map (fun d -> State d.[0])
            let stateIndex st =
                data
                |> Array.findIndex (fun d -> d.[0] = st)
            let bracketIndex bracket =
                match bracket with
                | AgeAny -> 1
                | AgeUnder5 -> 2
                | Age5To13 -> 3
                | Age14to17 -> 4
                | Age18to24 -> 5
                | Age16AndOver -> 6
                | Age18AndOver -> 7
                | Age15to44 -> 8
                | Age45to64 -> 9
                | Age65AndOver -> 10
                | Age85AndOver -> 11
            let pop bracket (State st) =
                int data.[stateIndex st].[bracketIndex bracket]
            {
                Population = pop
                States = states
            }

        static member LoadFromCSV (url: string) =
            Async.FromContinuations (fun (ok, no, _) ->
                JQuery.Get(url, obj (), fun (data, _, _) ->
                    ok (DataSet.ParseCSV (As<string> data)))
                |> ignore)

    let SetupDataModel () =
        let dataSet =
            View.Const ()
            |> View.MapAsync (fun () ->
                DataSet.LoadFromCSV "ObjectConstancy.csv")
        let bracket = Var.Create AgeBracket.AgeUnder5
        let shownData =
            (dataSet, bracket.View)
            ||> View.Map2 DataSet.TopStatesByRatio
        (bracket, shownData)

    type StateView =
        {
            Position : int
            State : string
            Total : int
            Value : double
        }

    let AnimateDouble x y k =
        async {
            for i in 0 .. 25 do
                let f = double i / 25.
                let v = x + (y - x) * f
                do! Async.Sleep 5
                do k v
        }
        |> Anim.Custom

    [<Sealed>]
    type SimpleTransition() =
        interface ITransition<double> with
            member tr.AnimateEnter x k = AnimateDouble 1.0 x k
            member tr.AnimateExit x k = AnimateDouble x 1.0 k
            member tr.AnimateChange x y k = AnimateDouble x y k
            member tr.CanAnimateEnter = true
            member tr.CanAnimateExit = true

    let Main () =
        let smooth : ITransition<double> = SimpleTransition () :> _
        let (bracket, shownData) = SetupDataModel ()
        let shownData =
            shownData
            |> View.Map (fun xs ->
                let n = xs.Length
                xs
                |> Array.mapi (fun i (State st, d) ->
                    {
                        Position = i
                        Total = n
                        State = st
                        Value = d
                    })
                |> Array.toSeq)
        let render (state: View<StateView>) =
            let ( => ) k (f: StateView -> double) =
                let v = View.Map f state
                Attr.Animated k smooth v string
            Svg.Fill "steelblue" [
                elA "rect" [
                    "x" ==> "0"
                    "width" => fun st -> st.Value
                    "height" => fun st -> 1. / double st.Total - 0.02
                    "y" => fun st -> double st.Position / double st.Total
                ] []
            ]
        let displayForm =
            shownData
            |> View.ConvertSeqBy (fun s -> s.State) render
            |> View.Map Doc.Concat
            |> Doc.EmbedView
        let textForm =
            shownData
            |> View.Map (Seq.map (fun st -> div [Doc.TextNode (st.State + ": " + string (round (1000. * st.Value)))]))
            |> View.Map Doc.Concat
            |> Doc.EmbedView
        el "div" [
            elA "svg" ["width" ==> "960"; "height" ==> "250"] [
                elA "g" ["transform" ==> "scale(960,250)"] [
                    displayForm
                ]
            ]
            textForm
            Doc.Select [] AgeBracket.Describe AgeBracket.All bracket
        ]

    let Description () =
        div [txt "TODO.."]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build()
            .Id("ObjectConstancy")
            .FileName(__SOURCE_FILE__)
            .Keywords(["animation"])
            .Render(Main ())
            .RenderDescription(Description ())
            .Create()

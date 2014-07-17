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
            |> View.MapAsync (fun () ->
                DataSet.LoadFromCSV "ObjectConstancy.csv")
        let bracket = Var.Create AgeBracket.AgeUnder5
        let shownData =
            (dataSet, bracket.View)
            ||> View.Map2 DataSet.TopStatesByRatio
        let shownData =
            shownData
            |> View.Map (fun xs ->
                let n = xs.Length
                let m =
                    xs
                    |> Array.map snd
                    |> Array.max
                xs
                |> Array.mapi (fun i (State st, d) ->
                    {
                        MaxValue = m
                        Position = i
                        Total = n
                        State = st
                        Value = d
                    })
                |> Array.toSeq)
        (bracket, shownData)

    let AnimateDouble x y k =
        async {
            let N = 25
            for i in 0 .. N do
                let f = double i / double N
                let v = x + (y - x) * f
                do k v
                do! Async.Sleep (50 / N)
        }
        |> Anim.Custom

    [<Sealed>]
    type InOutTransition(off: double) =
        interface ITransition<double> with
            member tr.AnimateEnter x k = AnimateDouble off x k
            member tr.AnimateExit x k = AnimateDouble x off k
            member tr.AnimateChange x y k = AnimateDouble x y k
            member tr.CanAnimateEnter = true
            member tr.CanAnimateExit = true

    [<Sealed>]
    type SimpleTransition() =
        interface ITransition<double> with
            member tr.AnimateEnter x k = Anim.Empty
            member tr.AnimateExit x k = Anim.Empty
            member tr.AnimateChange x y k = AnimateDouble x y k
            member tr.CanAnimateEnter = false
            member tr.CanAnimateExit = false

    let Width = 960.
    let Height = 250.

    let InOut = InOutTransition Height
    let Simple = SimpleTransition ()

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
                    anim "y" InOut y
                    anim "width" Simple x
                    anim "height" Simple h
                ] []
            ]
            txt (fun s -> Percent s.Value) [
                "text-anchor" ==> "end"
                anim "x" Simple x; anim "y" InOut y
                "dx" ==> "-2"; "dy" ==> "14"
                sty "fill" "white"
                sty "font" "12px sans-serif"
            ]
            txt (fun s -> s.State) [
                "x" ==> "0"; anim "y" InOut y
                "dx" ==> "2"; "dy" ==> "16"
                sty "fill" "white"
                sty "font" "14px sans-serif"
                sty "font-weight" "bold"
            ]
        ]

    let Main () =
        let (bracket, shownData) = SetupDataModel ()
        let displayForm =
            shownData
            |> View.ConvertSeqBy (fun s -> s.State) Render
            |> View.Map Doc.Concat
            |> Doc.EmbedView
        el "div" [
            el "h2" [txt "Top States by Age Bracket, 2008"]
            Doc.Select [cls "form-control"] AgeBracket.Describe AgeBracket.All bracket
            elA "div" [cls "skip"] []
            elA "svg" ["width" ==> string Width; "height" ==> string Height] [
                displayForm
            ]
            el "p" [
                txt "Source: "
                elA "a" ["href" ==> "http://www.census.gov/popest/data/historical/2000s/vintage_2008/"] [txt "Census Bureau"]
            ]
            el "p" [
                txt "Original Sample by Mike Bostock: "
                elA "a" ["href" ==> "http://bost.ocks.org/mike/constancy/"] [txt "Object Constancy"]
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
            .Render(Main ())
            .RenderDescription(Description ())
            .Create()

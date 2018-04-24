namespace WebSharper.UI

open WebSharper
open WebSharper.JavaScript
open WebSharper.JQuery
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
module S = WebSharper.UI.Html.SvgElements
module SA = WebSharper.UI.Html.SvgAttributes

/// Attempt to reconstruct this D3 example in UI:
/// http://bost.ocks.org/mike/constancy/

[<JavaScript>]
module ObjectConstancy =

    // Data model: Age bracket and state are what they say on the tin
    type AgeBracket = | AgeBracket of string
    type State = | State of string

    // Representation of a data set, including a list of age bracker,
    // list of states, and a population function
    type DataSet =
        {
            Brackets : AgeBracket []
            Population : AgeBracket -> State -> int
            States : State []
        }

        // Calculates the percentatge of people in the given age bracket
        static member Ratio ds br st =
            let total = AgeBracket "Total"
            double (ds.Population br st) / double (ds.Population total st)

        // Returns a sorted array of the top 10 states by ratio of people in
        // the given age bracket.
        static member TopStatesByRatio ds bracket =
            let sorted =
                ds.States
                |> Array.map (fun st -> (st, DataSet.Ratio ds bracket st))
                |> Array.sortBy (fun (_, r) -> - r)
            sorted.[0..9]

        // Parses a data CSV file into the data model
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

        // Asynchronous loading operation from a given URL
        static member LoadFromCSV (url: string) =
            Async.FromContinuations (fun (ok, no, _) ->
                JQuery.Get(url, obj (), fun (data, _, _) ->
                    ok (DataSet.ParseCSV (As<string> data)))
                |> ignore)

    // Information required to display a state in the chart
    type StateView =
        {
            // Maximum ratio in the display set
            MaxValue : double
            // Position / rank in the display set
            Position : int
            // Name of the state
            State : string
            // The total number of states in the display set
            Total : int
            // The value of the item
            Value : double
        }

    let SetupDataModel () =
        // Load the data set from an external source
        let dataSet =
            View.Const ()
            |> View.MapAsync (fun () -> DataSet.LoadFromCSV "ObjectConstancy.csv")
        // Set up the initial age bracked
        let bracket = Var.Create (AgeBracket "Under 5 Years")
        // A view of the data to be shown. Of type View<StateView>.
        let shownData =
            // Given the current data set and the currently-selected age
            // bracket, calculate the top states by population ratio
            View.Map2 DataSet.TopStatesByRatio dataSet bracket.View
            // Next, create a view which turns this into a list of
            // StateViews.
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

    // Define a simple declarative animation and transition
    let SimpleAnimation x y =
        Anim.Simple Interpolation.Double Easing.CubicInOut
            300. // duration, ms
            x y

    let SimpleTransition =
        Trans.Create SimpleAnimation

    // For the "in" and "out" transitions, for example when a new bar gets added
    // or an existing one gets removed, animate the y co-ordinate from the origin
    // position to the final position if it is an enter transition, or the current
    // transition to the origin position otherwise.
    // Note that the origin position here is "Height" as we're measuring Y from the
    // bottom of the SVG box, as opposed to the top as we would otherwise do.
    let InOutTransition =
        SimpleTransition
        |> Trans.Enter (fun x -> SimpleAnimation Height x)
        |> Trans.Exit (fun x -> SimpleAnimation x Height)

    // Decimal as a percentage
    let Percent (x: double) =
        string (floor (100. * x)) + "." + string (int (floor (1000. * x)) % 10) + "%"

    // The main rendering function
    let Render _ (state: View<StateView>) =
        // Function to create an animated attribute, based on a member of
        // a StateView record.
        let anim name kind (proj: StateView -> double) =
            Attr.Animated name kind (View.Map proj state) string
        // Projection functions
        let x st = Width * st.Value / st.MaxValue
        let y st = Height * double st.Position / double st.Total
        let h st = Height / double st.Total - 2.
        // Shorthand for a reactive text node in SVG
        let txt f attr = S.text attr [state |> View.Map f |> Doc.TextView]
        Doc.Concat [
            S.g [Attr.Style "fill" "steelblue"] [
                S.rect [
                    // X is always 0 for each of the bars
                    SA.x "0"
                    // Y is specified as an in-out transition.
                    anim "y" InOutTransition y
                    // Width and height are simple transitions the the X and Y vals
                    anim "width" SimpleTransition x
                    anim "height" SimpleTransition h
                ] []
            ]
            // Text labels
            txt (fun s -> Percent s.Value) [
                Attr.Create "text-anchor" "end"
                anim "x" SimpleTransition x; anim "y" InOutTransition y
                SA.dx "-2"; SA.dy "14"
                sty "fill" "white"
                sty "font" "12px sans-serif"
            ]
            txt (fun s -> s.State) [
                SA.x "0"; anim "y" InOutTransition y
                SA.dx "2"; SA.dy "16"
                sty "fill" "white"
                sty "font" "14px sans-serif"
                sty "font-weight" "bold"
            ]
        ]

    let Main _ =
        // Firstly, set up the data model
        let (dataSet, bracket, shownData) = SetupDataModel ()
        div [] [
            h2 [] [text "Top States by Age Bracket, 2008"]
            dataSet
            |> View.Map (fun dS ->
                // Select box control
                Doc.Select [cls "form-control"] (fun (AgeBracket b) -> b)
                    (List.ofArray dS.Brackets.[1..]) bracket)
            |> Doc.EmbedView
            divc "skip" []
            // Create the SVG image.
            S.svg [SA.width (string Width); SA.height (string Height)] [
                shownData
                // Render the data that needs to be shown.
                // ConvertSeqBy takes an equality key, a function to apply to a
                // reactive view of a record, and a view of
                |> View.MapSeqCachedViewBy (fun s -> s.State) Render
                |> View.Map Doc.Concat
                |> Doc.EmbedView
            ]
            p [] [
                text "Source: "
                href "Census Bureau" "http://www.census.gov/popest/data\
                    /historical/2000s/vintage_2008/"
            ]
            p [] [
                text "Original Sample by Mike Bostock: "
                href "Object Constancy" "http://bost.ocks.org/mike/constancy/"
            ]
        ]

    let Description _ =
        div [] [text "This sample show-cases declarative animation and interpolation (tweening)"]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build(Samples.ObjectConstancy)
            .Id("ObjectConstancy")
            .FileName(__SOURCE_FILE__)
            .Keywords(["animation"])
            .Render(Main)
            .RenderDescription(Description)
            .Create()

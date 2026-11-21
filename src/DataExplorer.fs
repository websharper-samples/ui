namespace WebSharper.UI

open WebSharper
open WebSharper.JavaScript
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation

/// App: an async CSV data explorer with search, sorting, paging and details.
[<JavaScript>]
module DataExplorer =

    type Row =
        {
            City : string
            Country : string
            Region : string
            Population : int
            Area : float
        }

        member this.Density = float this.Population / this.Area

    type TableState =
        {
            Column : string
            Descending : bool
            Page : int
        }

    let pageSize = 8

    let regions = [ "Africa" ; "Americas" ; "Asia" ; "Europe" ; "Oceania" ]

    let parse (text: string) =
        text.Split [| '\r' ; '\n' |]
        |> Array.filter (fun line -> line.Trim() <> "")
        |> fun lines -> Array.skip 1 lines
        |> Array.map (fun line ->
            let cells = line.Split ','
            {
                City = cells.[0]
                Country = cells.[1]
                Region = cells.[2]
                Population = int cells.[3]
                Area = System.Double.Parse cells.[4]
            })
        |> List.ofArray

    let sortRows column descending (rows: Row list) =
        let compare =
            match column with
            | "City" -> fun (a: Row) b -> compare a.City b.City
            | "Country" -> fun (a: Row) b -> compare a.Country b.Country
            | "Region" -> fun (a: Row) b -> compare a.Region b.Region
            | "Population" -> fun (a: Row) b -> compare a.Population b.Population
            | "Area" -> fun (a: Row) b -> compare a.Area b.Area
            | _ -> fun (a: Row) b -> compare a.Density b.Density
        rows
        |> List.sortWith compare
        |> fun sorted -> if descending then List.rev sorted else sorted

    let Main _ =
        let rows = Var.Create ([] : Row list)
        let loading = Var.Create true
        let error = Var.Create ""
        let search = Var.Create ""
        let region = Var.Create "All"
        let state = Var.Create { Column = "Population" ; Descending = true ; Page = 0 }
        let selected = Var.Create (None : Row option)

        async {
            try
                let! response =
                    Async.FromContinuations (fun (ok, _, _) ->
                        JS.Fetch("DataExplorer.csv").Then(fun (r: Response) ->
                            r.Text().Then(fun t -> ok t)
                            |> ignore)
                        |> ignore)
                rows.Value <- parse response
            with _ ->
                error.Value <- "Could not load the dataset."
            loading.Value <- false
        } |> Async.Start

        let filtered =
            View.Map3 (fun (all: Row list) q reg ->
                all
                |> List.filter (fun r ->
                    (q = "" || r.City.ToLower().Contains(q.ToLower()) || r.Country.ToLower().Contains(q.ToLower()))
                    && (reg = "All" || r.Region = reg)))
                rows.View
                (View.FromVar search)
                (View.FromVar region)

        let pageData =
            View.Map2 (fun (all: Row list) st ->
                let sorted = sortRows st.Column st.Descending all
                let pages = max 1 ((List.length sorted + pageSize - 1) / pageSize)
                let page = min st.Page (pages - 1)
                let visible = sorted |> List.skip (page * pageSize) |> List.truncate pageSize
                (visible, page, pages, List.length sorted))
                filtered
                (View.FromVar state)

        let setSort column =
            state.Value <-
                { state.Value with
                    Column = column
                    Descending = if state.Value.Column = column then not state.Value.Descending else true
                    Page = 0 }

        let header column label =
            th [
                cls "sortable"
                on.click (fun _ _ -> setSort column)
                Attr.DynamicClassPred "sorted" (View.Map (fun (s: TableState) -> s.Column = column) state.View)
            ] [ text label ]

        let rowView (r: Row) =
            tr [
                cls "row-click"
                Attr.DynamicClassPred "selected" (View.Map (fun (s: Row option) -> s |> Option.exists (fun x -> x.City = r.City)) selected.View)
                on.click (fun _ _ -> selected.Value <- Some r)
            ] [
                td [] [ strong [] [ text r.City ] ]
                td [] [ text r.Country ]
                td [] [ span [cls "pill"] [ text r.Region ] ]
                td [cls "num"] [ text (fmtThousands r.Population) ]
                td [cls "num"] [ text (fmtThousands (int r.Area)) ]
                td [cls "num"] [ text (fmtThousands (int r.Density)) ]
            ]

        let details =
            selected.View
            |> View.Map (function
                | None -> Doc.Empty
                | Some r ->
                    div [cls "detail-card"] [
                        div [] [
                            h3 [] [ text r.City ]
                            p [cls "muted"] [ text (r.Country + " · " + r.Region) ]
                        ]
                        div [cls "detail-stats"] [
                            statTile "Population" (fmtThousands r.Population) "people"
                            statTile "Area" (fmtThousands (int r.Area) + " km²") "metropolitan area"
                            statTile "Density" (fmtThousands (int r.Density) + " /km²") "people per km²"
                        ]
                        Doc.Button "Close" [cls "btn"; cls "btn-ghost"; cls "btn-small"]
                            (fun () -> selected.Value <- None)
                    ])
            |> Doc.EmbedView

        let table =
            View.Map2 (fun isLoading (visible, page, pages, total) ->
                if isLoading then
                    div [cls "skeleton-table"] [ text "Loading dataset…" ]
                else
                    div [] [
                        table [cls "table data-table"] [
                            thead [] [
                                tr [] [
                                    header "City" "City"
                                    header "Country" "Country"
                                    header "Region" "Region"
                                    header "Population" "Population"
                                    header "Area" "Area (km²)"
                                    header "Density" "Density"
                                ]
                            ]
                            tbody [] (List.map rowView visible)
                        ]
                        div [cls "pager"] [
                            span [cls "muted"] [
                                text (sprintf "%d rows · page %d of %d" total (page + 1) pages)
                            ]
                            div [cls "pager-buttons"] [
                                Doc.Button "Previous" [cls "btn"; cls "btn-ghost"; cls "btn-small"]
                                    (fun () -> state.Value <- { state.Value with Page = max 0 (page - 1) })
                                Doc.Button "Next" [cls "btn"; cls "btn-ghost"; cls "btn-small"]
                                    (fun () -> state.Value <- { state.Value with Page = min (pages - 1) (page + 1) })
                            ]
                        ]
                    ])
                loading.View
                pageData
            |> Doc.EmbedView

        Doc.Concat [
            p [cls "sample-blurb"] [
                text "The dataset is fetched asynchronously, then searched, filtered, \
                 sorted and paged entirely in derived views."
            ]
            div [cls "toolbar"] [
                div [cls "field"; cls "grow"] [
                    label [] [ text "Search" ]
                    Doc.InputType.Text
                        [ cls "form-control" ; attr.placeholder "City or country…" ]
                        search
                ]
                div [cls "field"] [
                    label [] [ text "Region" ]
                    Doc.InputType.Select [cls "form-control"] id ("All" :: regions) region
                ]
                Doc.Button "Clear filters"
                    [cls "btn"; cls "btn-ghost"; cls "btn-small"]
                    (fun () ->
                        search.Value <- ""
                        region.Value <- "All")
            ]
            error.View
            |> View.Map (fun msg ->
                if msg = "" then Doc.Empty
                else div [cls "bg-danger"] [ text msg ])
            |> Doc.EmbedView
            cardWithHint "Cities"
                "Click a header to sort; click a row for details."
                table
            details
        ]

    let Description _ =
        div [] [
            text "An asynchronous CSV explorer with search, sort, paging and details."
        ]

    let Sample =
        Samples.Build(Samples.DataExplorer)
            .Id("Data explorer")
            .FileName(__SOURCE_FILE__)
            .Keywords(["app"; "csv"; "table"])
            .Category(Samples.App)
            .Render(Main)
            .RenderDescription(Description)
            .Create()
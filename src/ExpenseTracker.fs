namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation

/// App: an expense tracker with categories, a budget and a live breakdown.
[<JavaScript>]
module ExpenseTracker =

    type Category =
        | Food
        | Transport
        | Housing
        | Fun
        | Other

    type Expense =
        {
            Key : Key
            Description : string
            Amount : float
            Category : Category
            Date : string
        }

    let showCategory = function
        | Food -> "Food"
        | Transport -> "Transport"
        | Housing -> "Housing"
        | Fun -> "Fun"
        | Other -> "Other"

    let categoryClass = function
        | Food -> "cat-food"
        | Transport -> "cat-transport"
        | Housing -> "cat-housing"
        | Fun -> "cat-fun"
        | Other -> "cat-other"

    let categories = [ Food ; Transport ; Housing ; Fun ; Other ]

    let budget = 1500.0
    let today = "2026-11-21"

    let seed =
        [
            { Key = Key.Fresh () ; Description = "Weekly groceries" ; Amount = 82.40 ; Category = Food ; Date = "2026-11-18" }
            { Key = Key.Fresh () ; Description = "Train pass" ; Amount = 64.00 ; Category = Transport ; Date = "2026-11-17" }
            { Key = Key.Fresh () ; Description = "Concert tickets" ; Amount = 120.00 ; Category = Fun ; Date = "2026-11-16" }
            { Key = Key.Fresh () ; Description = "Coffee with the team" ; Amount = 18.50 ; Category = Food ; Date = "2026-11-15" }
            { Key = Key.Fresh () ; Description = "Electricity" ; Amount = 96.20 ; Category = Housing ; Date = "2026-11-12" }
            { Key = Key.Fresh () ; Description = "Books" ; Amount = 47.90 ; Category = Fun ; Date = "2026-11-10" }
        ]

    let Main _ =
        let items = ListModel.Create (fun e -> e.Key) seed
        let description = Var.Create ""
        let amount = Var.Create ""
        let category = Var.Create Food
        let filter = Var.Create "All"
        let error = Var.Create ""

        let spent =
            items.View
            |> View.Map (fun xs -> xs |> Seq.sumBy (fun e -> e.Amount))

        let byCategory =
            items.View
            |> View.Map (fun xs ->
                categories
                |> List.map (fun c ->
                    let total = xs |> Seq.filter (fun e -> e.Category = c) |> Seq.sumBy (fun e -> e.Amount)
                    (c, total))
                |> List.filter (fun (_, total) -> total > 0.0)
                |> List.sortByDescending snd)

        let shown =
            View.Map2 (fun (xs: seq<Expense>) f ->
                xs
                |> Seq.filter (fun e -> f = "All" || showCategory e.Category = f))
                items.View
                (View.FromVar filter)

        let addExpense () =
            match System.Double.TryParse(amount.Value) with
            | true, value when value > 0.0 && description.Value.Trim() <> "" ->
                items.Add
                    {
                        Key = Key.Fresh ()
                        Description = description.Value.Trim()
                        Amount = value
                        Category = category.Value
                        Date = today
                    }
                description.Value <- ""
                amount.Value <- ""
                error.Value <- ""
            | _ ->
                error.Value <- "Enter a description and a positive amount."

        let addForm =
            form [
                cls "expense-form"
                on.submit (fun _ (e: WebSharper.JavaScript.Dom.Event) ->
                    e.PreventDefault ()
                    addExpense ())
            ] [
                div [cls "field"; cls "grow"] [
                    label [] [ text "Description" ]
                    Doc.InputType.Text [cls "form-control"; attr.placeholder "What did you spend on?"] description
                ]
                div [cls "field"] [
                    label [] [ text "Amount" ]
                    Doc.InputType.Text [cls "form-control"; attr.placeholder "0.00"] amount
                ]
                div [cls "field"] [
                    label [] [ text "Category" ]
                    Doc.InputType.Select [cls "form-control"] showCategory categories category
                ]
                button [cls "btn"; cls "btn-primary"; attr.``type`` "submit"] [ text "Add" ]
            ]

        let expenseRow (e: Expense) =
            tr [] [
                td [] [ text e.Date ]
                td [] [
                    strong [] [ text e.Description ]
                    span [cls "pill"; cls (categoryClass e.Category)] [ text (showCategory e.Category) ]
                ]
                td [cls "num"] [ text ("€" + fmtMoney e.Amount) ]
                td [cls "num"] [
                    Doc.Button "×" [cls "btn"; cls "btn-ghost"; cls "btn-icon"]
                        (fun () -> items.Remove e)
                ]
            ]

        let summary =
            spent
            |> View.Map (fun total ->
                let remaining = budget - total
                let pct = total / budget * 100.0
                div [] [
                    div [cls "stat-grid"] [
                        statTile "Spent" ("€" + fmtMoney total) "in the current period"
                        statTile "Budget" ("€" + fmtMoney budget) "monthly limit"
                        statTile "Remaining"
                            ("€" + fmtMoney (max 0.0 remaining))
                            (if remaining < 0.0 then "over budget" else "left to spend")
                    ]
                    Charts.progress pct
                ])
            |> Doc.EmbedView

        let breakdown =
            byCategory
            |> View.Map (fun rows ->
                let total = rows |> List.sumBy snd
                if List.isEmpty rows then emptyState "No expenses yet."
                else
                    div [cls "breakdown"] (
                        rows
                        |> List.map (fun (c, value) ->
                            Charts.breakdownBar (showCategory c) value total)))
            |> Doc.EmbedView

        Doc.Concat [
            p [cls "sample-blurb"] [
                text "Record spending, filter by category and watch the budget, totals \
                 and category breakdown recompute from the list."
            ]
            summary
            cardWithHint "Add an expense"
                "Amounts are parsed from text; the category is a typed select."
                (Doc.Concat [
                    addForm
                    error.View
                    |> View.Map (fun msg ->
                        if msg = "" then Doc.Empty
                        else div [cls "bg-danger"] [ text msg ])
                    |> Doc.EmbedView
                ])
            div [cls "grid-2"] [
                cardWithHint "Expenses"
                    "Filter the table by category."
                    (div [] [
                        div [cls "toolbar"] [
                            Doc.InputType.Select
                                [cls "form-control"; cls "select-compact"]
                                id
                                ("All" :: (categories |> List.map showCategory))
                                filter
                        ]
                        shown
                        |> View.Map (fun xs ->
                            let rows = List.ofSeq xs
                            if List.isEmpty rows then emptyState "No expenses in this category."
                            else
                                table [cls "table"] [
                                    thead [] [
                                        tr [] [
                                            th [] [ text "Date" ]
                                            th [] [ text "Description" ]
                                            th [cls "num"] [ text "Amount" ]
                                            th [cls "num"] [ text "" ]
                                        ]
                                    ]
                                    tbody [] (List.map expenseRow rows)
                                ])
                        |> Doc.EmbedView
                    ])
                cardWithHint "By category"
                    "A horizontal breakdown of the same data."
                    breakdown
            ]
        ]

    let Description _ =
        div [] [
            text "An expense tracker with categories, a budget and a live breakdown."
        ]

    let Sample =
        Samples.Build(Samples.ExpenseTracker)
            .Id("Expense tracker")
            .FileName(__SOURCE_FILE__)
            .Keywords(["app"; "forms"; "charts"])
            .Category(Samples.App)
            .Render(Main)
            .RenderDescription(Description)
            .Create()
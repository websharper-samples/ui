namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation

/// App: a focused task list with priorities, filters, progress and bulk actions.
[<JavaScript>]
module TodoApp =

    type Priority =
        | Low
        | Normal
        | High

    type Filter =
        | All
        | Active
        | Done

    type Todo =
        {
            Key : Key
            Title : string
            Done : bool
            Priority : Priority
        }

    let showPriority = function
        | Low -> "Low"
        | Normal -> "Normal"
        | High -> "High"

    let priorityClass = function
        | Low -> "priority-low"
        | Normal -> "priority-normal"
        | High -> "priority-high"

    let showFilter = function
        | All -> "All"
        | Active -> "Active"
        | Done -> "Completed"

    let seed =
        [
            { Key = Key.Fresh () ; Title = "Read the WebSharper.UI docs" ; Done = true ; Priority = Normal }
            { Key = Key.Fresh () ; Title = "Build a reactive dashboard" ; Done = false ; Priority = High }
            { Key = Key.Fresh () ; Title = "Try the Flow API" ; Done = false ; Priority = Normal }
            { Key = Key.Fresh () ; Title = "Refactor the todo sample" ; Done = false ; Priority = Low }
            { Key = Key.Fresh () ; Title = "Ship the gallery" ; Done = false ; Priority = High }
        ]

    let Main _ =
        let items = ListModel.Create (fun t -> t.Key) seed
        let filter = Var.Create All
        let search = Var.Create ""
        let title = Var.Create ""
        let priority = Var.Create Normal

        let matches q (t: Todo) =
            q = "" || t.Title.ToLower().Contains(q.ToLower())

        let visible =
            View.Map3
                (fun (all: seq<Todo>) f q ->
                    all
                    |> Seq.filter (matches q)
                    |> Seq.filter (fun t ->
                        match f with
                        | All -> true
                        | Active -> not t.Done
                        | Done -> t.Done))
                items.View
                (View.FromVar filter)
                (View.FromVar search)

        let counts =
            items.View
            |> View.Map (fun all ->
                let total = Seq.length all
                let doneCount = all |> Seq.filter (fun t -> t.Done) |> Seq.length
                (total, doneCount))

        let doneVar (t: Todo) =
            items.LensInto (fun x -> x.Done) (fun x v -> { x with Done = v }) t.Key

        let renderItem (t: Todo) =
            let isDone = doneVar t
            li [
                cls "todo-item"
                Attr.DynamicClassPred "is-done" isDone.View
            ] [
                label [cls "todo-main"] [
                    Doc.InputType.CheckBox [cls "todo-check"] isDone
                    span [cls "todo-title"] [ text t.Title ]
                ]
                span [cls "pill"; cls (priorityClass t.Priority)] [ text (showPriority t.Priority) ]
                Doc.Button "Remove" [cls "btn"; cls "btn-ghost"; cls "btn-small"]
                    (fun () -> items.Remove t)
            ]

        let addTodo () =
            let t = title.Value.Trim()
            if t <> "" then
                items.Add
                    {
                        Key = Key.Fresh ()
                        Title = t
                        Done = false
                        Priority = priority.Value
                    }
                title.Value <- ""

        let addForm =
            form [
                cls "todo-add"
                on.submit (fun _ (e: WebSharper.JavaScript.Dom.Event) ->
                    e.PreventDefault ()
                    addTodo ())
            ] [
                Doc.InputType.Text
                    [ cls "form-control" ; attr.placeholder "What needs doing?" ]
                    title
                Doc.InputType.Select [cls "form-control"; cls "select-compact"] showPriority [Low ; Normal ; High] priority
                button [cls "btn"; cls "btn-primary"; attr.``type`` "submit"] [ text "Add" ]
            ]

        Doc.Concat [
            p [cls "sample-blurb"] [
                text "A complete task list: priorities, live filtering, progress and \
                 bulk actions, built over a ListModel."
            ]
            div [cls "card"] [
                div [cls "card-body"] [
                    counts
                    |> View.Map (fun (total, doneCount) ->
                        let pct = if total = 0 then 0.0 else float doneCount / float total * 100.0
                        div [cls "todo-progress"] [
                            div [cls "todo-progress-text"] [
                                strong [] [ text (sprintf "%d / %d done" doneCount total) ]
                                span [cls "muted"] [ text (fmtPct pct) ]
                            ]
                            Charts.progress pct
                        ])
                    |> Doc.EmbedView

                    addForm

                    div [cls "todo-toolbar"] [
                        div [cls "segmented"] (
                            [ All ; Active ; Done ]
                            |> List.map (fun f ->
                                Doc.Button (showFilter f)
                                    [ cls "tab" ; Attr.DynamicClassPred "active" (View.Map ((=) f) filter.View) ]
                                    (fun () -> filter.Value <- f))
                        )
                        Doc.InputType.Text
                            [ cls "form-control" ; cls "search-compact" ; attr.placeholder "Search tasks…" ]
                            search
                        Doc.Button "Clear completed"
                            [cls "btn"; cls "btn-ghost"; cls "btn-small"]
                            (fun () -> items.RemoveBy (fun t -> t.Done))
                    ]

                    visible
                    |> View.Map (fun xs ->
                        let list = List.ofSeq xs
                        if List.isEmpty list then
                            emptyState "Nothing here — add a task or change the filter."
                        else
                            ul [cls "todo-list"] (List.map renderItem list))
                    |> Doc.EmbedView
                ]
            ]
        ]

    let Description _ =
        div [] [
            text "A task list with priorities, filters, progress and bulk actions."
        ]

    let Sample =
        Samples.Build(Samples.TodoApp)
            .Id("Todos")
            .FileName(__SOURCE_FILE__)
            .Keywords(["todo"; "listmodel"])
            .Category(Samples.App)
            .Render(Main)
            .RenderDescription(Description)
            .Create()
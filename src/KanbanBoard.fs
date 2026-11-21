namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation

/// App: a drag-and-drop kanban board with search, priorities and counts.
[<JavaScript>]
module KanbanBoard =

    type Status =
        | Backlog
        | Active
        | Done

    type Priority =
        | Low
        | Medium
        | High

    type Card =
        {
            Key : Key
            Title : string
            Status : Status
            Priority : Priority
            Tag : string
        }

    let showStatus = function
        | Backlog -> "Backlog"
        | Active -> "In progress"
        | Done -> "Done"

    let statusClass = function
        | Backlog -> "status-backlog"
        | Active -> "status-active"
        | Done -> "status-done"

    let showPriority = function
        | Low -> "Low"
        | Medium -> "Medium"
        | High -> "High"

    let priorityClass = function
        | Low -> "priority-low"
        | Medium -> "priority-normal"
        | High -> "priority-high"

    let seed =
        [
            { Key = Key.Fresh () ; Title = "Design the empty states" ; Status = Backlog ; Priority = Low ; Tag = "design" }
            { Key = Key.Fresh () ; Title = "Wire up the dashboard timer" ; Status = Active ; Priority = High ; Tag = "engine" }
            { Key = Key.Fresh () ; Title = "Write the CSV loader" ; Status = Done ; Priority = Medium ; Tag = "data" }
            { Key = Key.Fresh () ; Title = "Add keyboard navigation" ; Status = Backlog ; Priority = Medium ; Tag = "a11y" }
            { Key = Key.Fresh () ; Title = "Polish the login form" ; Status = Active ; Priority = Low ; Tag = "design" }
            { Key = Key.Fresh () ; Title = "Ship the gallery" ; Status = Done ; Priority = High ; Tag = "release" }
        ]

    let Main _ =
        let items = ListModel.Create (fun c -> c.Key) seed
        let search = Var.Create ""
        let title = Var.Create ""
        let priority = Var.Create Medium
        let tag = Var.Create "design"
        let dragging : Key option ref = ref None

        let matches q (c: Card) =
            q = ""
            || c.Title.ToLower().Contains(q.ToLower())
            || c.Tag.ToLower().Contains(q.ToLower())

        let visible =
            View.Map2 (fun (all: seq<Card>) q ->
                all |> Seq.filter (matches q))
                items.View
                (View.FromVar search)

        let move key status =
            items.UpdateBy (fun c -> Some { c with Status = status }) key

        let shift (c: Card) =
            match c.Status with
            | Backlog -> move c.Key Active
            | Active -> move c.Key Done
            | Done -> ()

        let back (c: Card) =
            match c.Status with
            | Done -> move c.Key Active
            | Active -> move c.Key Backlog
            | Backlog -> ()

        let cardView (c: Card) =
            div [
                cls "kanban-card"
                Attr.Create "draggable" "true"
                on.dragStart (fun _ _ -> dragging := Some c.Key)
                on.dragEnd (fun _ _ -> dragging := None)
            ] [
                div [cls "kanban-card-top"] [
                    span [cls "pill"; cls (priorityClass c.Priority)] [ text (showPriority c.Priority) ]
                    span [cls "tag"] [ text ("#" + c.Tag) ]
                ]
                h4 [] [ text c.Title ]
                div [cls "kanban-actions"] [
                    Doc.Button "←" [cls "btn"; cls "btn-ghost"; cls "btn-icon"]
                        (fun () -> back c)
                    Doc.Button "→" [cls "btn"; cls "btn-ghost"; cls "btn-icon"]
                        (fun () -> shift c)
                    Doc.Button "Delete" [cls "btn"; cls "btn-ghost"; cls "btn-small"]
                        (fun () -> items.Remove c)
                ]
            ]

        let column status (cards: Card list) =
            let count = List.length cards
            div [cls "kanban-column"] [
                div [cls "kanban-column-head"] [
                    h3 [] [ text (showStatus status) ]
                    span [cls "count"] [ text (string count) ]
                ]
                div [
                    cls "kanban-drop"
                    cls (statusClass status)
                    on.dragOver (fun _ (e: WebSharper.JavaScript.Dom.Event) ->
                        e.PreventDefault ())
                    on.drop (fun _ (e: WebSharper.JavaScript.Dom.Event) ->
                        e.PreventDefault ()
                        match dragging.Value with
                        | Some key -> move key status
                        | None -> ())
                ] [
                    if List.isEmpty cards then
                        div [cls "drop-hint"] [ text "Drop cards here" ]
                    else
                        List.map cardView cards |> Doc.Concat
                ]
            ]

        let board =
            visible
            |> View.Map (fun cards ->
                let all = List.ofSeq cards
                let columns =
                    [ Backlog ; Active ; Done ]
                    |> List.map (fun status ->
                        column status (all |> List.filter (fun c -> c.Status = status)))
                div [cls "kanban-board"] columns)
            |> Doc.EmbedView

        let addCard () =
            let t = title.Value.Trim()
            if t <> "" then
                items.Add
                    {
                        Key = Key.Fresh ()
                        Title = t
                        Status = Backlog
                        Priority = priority.Value
                        Tag = tag.Value
                    }
                title.Value <- ""

        let addForm =
            form [
                cls "kanban-add"
                on.submit (fun _ (e: WebSharper.JavaScript.Dom.Event) ->
                    e.PreventDefault ()
                    addCard ())
            ] [
                Doc.InputType.Text
                    [ cls "form-control" ; attr.placeholder "New card title…" ]
                    title
                Doc.InputType.Select [cls "form-control"; cls "select-compact"] showPriority [Low ; Medium ; High] priority
                Doc.InputType.Select [cls "form-control"; cls "select-compact"] id ["design"; "engine"; "data"; "a11y"; "release"] tag
                button [cls "btn"; cls "btn-primary"; attr.``type`` "submit"] [ text "Add card" ]
            ]

        Doc.Concat [
            p [cls "sample-blurb"] [
                text "Use the arrows or drag cards between columns. Everything is a \
                 ListModel update; counts, search and columns follow automatically."
            ]
            div [cls "toolbar"] [
                div [cls "field"; cls "grow"] [
                    label [] [ text "Search cards" ]
                    Doc.InputType.Text
                        [ cls "form-control" ; attr.placeholder "Title or tag…" ]
                        search
                ]
                Doc.Button "Reset board"
                    [cls "btn"; cls "btn-ghost"; cls "btn-small"]
                    (fun () -> items.Set seed)
            ]
            addForm
            board
        ]

    let Description _ =
        div [] [
            text "A drag-and-drop kanban board with reactive columns and search."
        ]

    let Sample =
        Samples.Build(Samples.KanbanBoard)
            .Id("Kanban board")
            .FileName(__SOURCE_FILE__)
            .Keywords(["app"; "listmodel"; "drag"])
            .Category(Samples.App)
            .Render(Main)
            .RenderDescription(Description)
            .Create()
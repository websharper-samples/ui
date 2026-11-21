namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation

/// App: a small community board with login, threads, search and replies.
[<JavaScript>]
module CommunityBoard =

    type User = { Name : string }

    type Post =
        {
            Id : int
            Author : string
            Content : string
            At : string
        }

    type Thread =
        {
            Id : int
            Title : string
            Author : string
            At : string
            Posts : Var<Post list>
        }

    type Screen =
        | ThreadList
        | NewThread
        | ThreadView of Thread

    // A tiny in-memory "server" with async signatures, standing in for RPC.
    module Store =
        let mutable private nextId = 1

        let private freshId () =
            let id = nextId
            nextId <- nextId + 1
            id

        let threads = Var.Create []

        let private post author content at =
            { Id = freshId () ; Author = author ; Content = content ; At = at }

        let private thread author title at posts =
            {
                Id = freshId ()
                Title = title
                Author = author
                At = at
                Posts = Var.Create posts
            }

        let seed () =
            if List.isEmpty threads.Value then
                let t1 =
                    thread "Ada" "Welcome to the board" "09:12"
                        [
                            post "Ada" "This board is backed by WebSharper.UI vars and simulated async calls." "09:12"
                            post "Grace" "It is nice to have a real thread to reply to." "09:20"
                        ]
                let t2 =
                    thread "Grace" "What are you building?" "08:45"
                        [ post "Grace" "Share what you are building with WebSharper this week." "08:45" ]
                let t3 =
                    thread "Alan" "Reactive forms, tips?" "Yesterday"
                        [
                            post "Alan" "How do you structure validation in a multi-step form?" "Yesterday"
                            post "Ada" "The Flow API is a good fit — each step returns the next one." "Yesterday"
                        ]
                threads.Value <- [ t1 ; t2 ; t3 ]

        let getThreads () =
            async {
                do! Async.Sleep 120
                return threads.Value
            }

        let addThread author title firstPost =
            async {
                do! Async.Sleep 120
                let t = thread author title "now" [ post author firstPost "now" ]
                threads.Value <- threads.Value @ [ t ]
                return t
            }

        let addPost (t: Thread) author content =
            async {
                do! Async.Sleep 120
                t.Posts.Value <- t.Posts.Value @ [ post author content "now" ]
            }

    // ---------------------------------------------------------------- auth

    let auth : Var<User option> = Var.Create None

    let loginCard () =
        let user = Var.Create ""
        let pass = Var.Create ""
        let error = Var.Create ""

        let attempt () =
            if user.Value = "demo" && pass.Value = "websharper" then
                auth.Value <- Some { Name = "demo" }
                error.Value <- ""
            else
                error.Value <- "Use demo / websharper to sign in."

        form [
            cls "login-card"
            on.submit (fun _ (e: WebSharper.JavaScript.Dom.Event) ->
                e.PreventDefault ()
                attempt ())
        ] [
            div [cls "login-copy"] [
                h3 [] [ text "Sign in" ]
                p [cls "muted"] [ text "Demo account: demo / websharper" ]
            ]
            div [cls "login-fields"] [
                Doc.InputType.Text [cls "form-control" ; attr.placeholder "Username"] user
                Doc.InputType.Password [cls "form-control" ; attr.placeholder "Password"] pass
                button [cls "btn"; cls "btn-primary"; attr.``type`` "submit"] [ text "Sign in" ]
            ]
            error.View
            |> View.Map (fun msg ->
                if msg = "" then Doc.Empty
                else div [cls "bg-danger"] [ text msg ])
            |> Doc.EmbedView
        ]

    let statusBar () =
        auth.View
        |> View.Map (function
            | Some user ->
                div [cls "session"] [
                    span [cls "avatar"] [ text (user.Name.Substring(0, 1).ToUpper()) ]
                    span [] [ text ("Signed in as " + user.Name) ]
                    Doc.Button "Sign out" [cls "btn"; cls "btn-ghost"; cls "btn-small"]
                        (fun () -> auth.Value <- None)
                ]
            | None -> Doc.Empty)
        |> Doc.EmbedView

    // -------------------------------------------------------------- screens

    let threadSummary (screen: Var<Screen>) (t: Thread) =
        let count =
            t.Posts.View
            |> View.Map (fun posts -> List.length posts)

        li [
            cls "thread-item"
            on.click (fun _ _ -> screen.Value <- ThreadView t)
        ] [
            div [cls "thread-main"] [
                h4 [] [ text t.Title ]
                p [cls "muted"] [
                    text ("by " + t.Author + " · " + t.At + " · ")
                    textView (View.Map (fun n -> sprintf "%d replies" n) count)
                ]
            ]
            span [cls "app-arrow"] [ text "→" ]
        ]

    let threadListPage (screen: Var<Screen>) =
        let search = Var.Create ""
        let shown =
            View.Map2 (fun (xs: Thread list) q ->
                xs
                |> List.filter (fun t ->
                    q = ""
                    || t.Title.ToLower().Contains(q.ToLower())
                    || t.Author.ToLower().Contains(q.ToLower())))
                Store.threads.View
                (View.FromVar search)

        async {
            let! xs = Store.getThreads ()
            Store.threads.Value <- xs
        } |> Async.Start

        div [] [
            div [cls "toolbar"] [
                div [cls "field"; cls "grow"] [
                    label [] [ text "Search threads" ]
                    Doc.InputType.Text
                        [ cls "form-control" ; attr.placeholder "Title or author…" ]
                        search
                ]
                Doc.Button "New thread" [cls "btn"; cls "btn-primary"]
                    (fun () -> screen.Value <- NewThread)
            ]
            shown
            |> View.Map (fun xs ->
                if List.isEmpty xs then emptyState "No threads match that search."
                else ul [cls "thread-list"] (List.map (threadSummary screen) xs))
            |> Doc.EmbedView
        ]

    let newThreadPage (screen: Var<Screen>) =
        auth.View
        |> View.Map (function
            | None ->
                div [cls "card-body"] [
                    p [] [ text "Sign in to start a thread." ]
                ]
            | Some user ->
                let title = Var.Create ""
                let content = Var.Create ""

                let submit () =
                    if title.Value.Trim() <> "" && content.Value.Trim() <> "" then
                        async {
                            let! t = Store.addThread user.Name title.Value content.Value
                            title.Value <- ""
                            content.Value <- ""
                            screen.Value <- ThreadView t
                        } |> Async.Start

                form [
                    cls "card-body"
                    on.submit (fun _ (e: WebSharper.JavaScript.Dom.Event) ->
                        e.PreventDefault ()
                        submit ())
                ] [
                    div [cls "field"] [
                        label [] [ text "Title" ]
                        Doc.InputType.Text [cls "form-control"; attr.placeholder "A clear title"] title
                    ]
                    div [cls "field"] [
                        label [] [ text "First post" ]
                        Doc.InputType.TextArea [cls "form-control"; attr.rows "5"; attr.placeholder "Say something…"] content
                    ]
                    button [cls "btn"; cls "btn-primary"; attr.``type`` "submit"] [ text "Create thread" ]
                ])
        |> Doc.EmbedView

    let threadViewPage (screen: Var<Screen>) (t: Thread) =
        let postCard (post: Post) =
            li [cls "post"] [
                span [cls "avatar"] [ text (post.Author.Substring(0, 1).ToUpper()) ]
                div [cls "post-body"] [
                    div [cls "post-meta"] [
                        strong [] [ text post.Author ]
                        span [cls "muted"] [ text (" · " + post.At) ]
                    ]
                    p [] [ text post.Content ]
                ]
            ]

        let composer =
            auth.View
            |> View.Map (function
                | None ->
                    div [cls "card-body"] [
                        p [cls "muted"] [ text "Sign in to reply to this thread." ]
                    ]
                | Some user ->
                    let reply = Var.Create ""
                    let send () =
                        if reply.Value.Trim() <> "" then
                            async {
                                do! Store.addPost t user.Name reply.Value
                                reply.Value <- ""
                            } |> Async.Start
                    form [
                        cls "composer"
                        on.submit (fun _ (e: WebSharper.JavaScript.Dom.Event) ->
                            e.PreventDefault ()
                            send ())
                    ] [
                        span [cls "avatar"] [ text (user.Name.Substring(0, 1).ToUpper()) ]
                        Doc.InputType.TextArea
                            [ cls "form-control" ; attr.rows "3" ; attr.placeholder "Write a reply…" ]
                            reply
                        button [cls "btn"; cls "btn-primary"; attr.``type`` "submit"] [ text "Reply" ]
                    ])
            |> Doc.EmbedView

        div [] [
            div [cls "thread-head"] [
                Doc.Button "← Back" [cls "btn"; cls "btn-ghost"; cls "btn-small"]
                    (fun () -> screen.Value <- ThreadList)
                div [] [
                    h2 [] [ text t.Title ]
                    p [cls "muted"] [ text ("Started by " + t.Author + " · " + t.At) ]
                ]
            ]
            t.Posts.View
            |> View.Map (fun posts ->
                ul [cls "post-list"] (List.map postCard posts))
            |> Doc.EmbedView
            composer
        ]

    // ------------------------------------------------------------------ page

    let Main _ =
        Store.seed ()
        let screen = Var.Create ThreadList

        let body =
            screen.View.Doc(function
                | ThreadList -> threadListPage screen
                | NewThread -> newThreadPage screen
                | ThreadView t -> threadViewPage screen t)

        Doc.Concat [
            p [cls "sample-blurb"] [
                text "A login-gated board with async thread loading, live reply counts, \
                 search and posting — all running in the browser."
            ]
            statusBar ()
            auth.View
            |> View.Map (function
                | None -> loginCard ()
                | Some _ -> Doc.Empty)
            |> Doc.EmbedView
            div [cls "card"] [
                div [cls "card-body"] [ body ]
            ]
        ]

    let Description _ =
        div [] [
            text "A community board with sign-in, threads, replies and search."
        ]

    let Sample =
        Samples.Build(Samples.CommunityBoard)
            .Id("Community board")
            .FileName(__SOURCE_FILE__)
            .Keywords(["app"; "auth"])
            .Category(Samples.App)
            .Render(Main)
            .RenderDescription(Description)
            .Create()
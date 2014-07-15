namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.UI.Next.MiniSitelet

[<JavaScript>]
module MessageBoard =

    // Some helpers
    let freshTid =
        let tid = ref 0
        fun () ->
            incr tid
            !tid

    let freshPid =
        let pid = ref 0
        fun () ->
            incr pid
            !pid

    // --------- Model ---------- //
    type ViewModel<'T> =
        {
            Projection : 'T -> int
            Items : Model<seq<'T>,ResizeArray<'T>>
        }

    type User =
        {
            Name : string
            Password : string
        }

    // A post within a thread
    type Post =
        {
            PostId : int
            PostAuthorName : string
            Content : string
        }

    // A thread, containing 0 or more posts
    type Thread =
        {
            ThreadId : int
            Title : string
            ThreadAuthorName : string
            Posts : ViewModel<Post>
        }

    // Threads are time-varying objects. For example, they might get
    // deleted, their posts might change, and so on.
    // For this reason, we need a thread model.
    type Action =
        | Login
        | ThreadList
        | ShowThread of Thread
        | NewThread
        | LogOut

    let showAction = function
        | Login -> "Log In (credentials: TestUser / TestPass)"
        | ThreadList -> "Show All Threads"
        | ShowThread t -> "Thread " + t.Title
        | NewThread -> "Create New Thread"
        | LogOut -> "Log Out"

    type LoginResult =
        | Success of User
        | NoSuchUser
        | InvalidPassword

    type State =
        {
            LoggedIn : Var<User option>
            Threads : ViewModel<Thread>
            Go : Action -> unit
        }

    let Create proj =
        let items =
            ResizeArray()
            |> Model.Create (fun arr -> arr.ToArray() :> seq<_>)
        { Items = items ; Projection = proj }

    /// Adds an item to the collection.
    let Add m item =
        m.Items
        |> Model.Update (fun all -> all.Add(item))

    /// Removes an item from the collection.
    let Remove m item =
        m.Items
        |> Model.Update (fun all ->
            seq { 0 .. all.Count - 1 }
            |> Seq.filter (fun i -> m.Projection all.[i]= m.Projection item)
            |> Seq.toArray
            |> Array.iter (fun i -> all.RemoveAt(i)))

    let createThread author title =
        {
            ThreadId = freshTid ()
            ThreadAuthorName = author
            Title = title
            Posts = Create (fun p -> p.PostId)
        }

    let initialThreads =
        let thread = createThread "SimonJF" "Hello, World! This is a topic."
        let threadModel = Create (fun t -> t.ThreadId)
        Add threadModel thread
        threadModel

    let createPost user content =
        {
            PostId = freshPid ()
            PostAuthorName = user.Name
            Content = content
        }

    // FIXME: This is a hack, and IMO a weakness of the current abstraction.
    // It'd be better to find some way of making this nicer...
    let getUser st =
        let usrVar = Var.Get st
        match usrVar with
        | Some user -> user
        | None -> failwith "Not logged in"

    // Navbar : State -> Doc
    let loggedInLabel st =
        let usrOpt = Var.Get st.LoggedIn
        match usrOpt with
        | Some usr -> "Welcome, " + usr.Name + "!"
        | None -> "You are not logged in."
        |> txt

    let GlobalGo = Var.Set

    let loggedIn st = Option.isSome (Var.Get st.LoggedIn)

    // Navigation bar, different for logged in / not logged in
    let NavBar var st =
        View.FromVar var
        |> View.Map (fun active ->

            let loggedInActions = [ThreadList ; NewThread ; LogOut]
            let notLoggedInActions = [Login]
            let actions =
                if loggedIn st then loggedInActions else notLoggedInActions
            let evtLink act =
                Doc.ElementWithEvents "a" ["href" ==> "#"]
                    [EventHandler.CreateHandler "click" (fun _ -> GlobalGo var act)]

            let renderLink action =
                let attr = if showAction action = showAction active then cls "active" else Attr.Empty

                elA "li" [attr] [
                    evtLink action [
                        showAction action |> txt
                    ]
                ]

            elA "nav" [cls "navbar" ; cls "navbar-default" ; Attr.Create "role" "navigation"] [
                elA "div" [] [
                    elA "ul" [cls "nav" ; cls "navbar-nav" ; cls "navbar-right"] [
                        el "li" [loggedInLabel st]
                    ]

                    elA "ul" [cls "nav" ; cls "navbar-nav"] [
                        List.map renderLink actions |> Doc.Concat

                    ]

                ]
            ])
        |> Doc.EmbedView

    let LoginPage st =
        let rvUser = Var.Create ""
        let rvPass = Var.Create ""
        let rvMsg = Var.Create ""

        // TODO: Something more async'y, to emulate a server
        let checkLogin name pass =
            match (name, pass) with
            | ("TestUser", "TestPass") -> Success { Name = name ; Password = pass }
            | ("TestUser", _) -> InvalidPassword
            | (_, _) -> NoSuchUser

        // Row of the login form
        let inputRow rv id lblText isPass =
            let control = if isPass then Doc.PasswordBox else Doc.Input
            elA "div" [cls "form-group"] [
                elA "label"
                    [
                        "for" ==> id
                        cls "col-sm-2"
                        cls "control-label"
                    ] [Doc.TextNode lblText]

                elA "div" [cls "col-sm-2"] [
                    control
                        [
                            cls "form-control"
                            "id" ==> id
                            "placeholder" ==> lblText
                        ] rv
                ]
            ]

        // Main login page markup
        el "div" [
            // Message -- was the login successful?
            el "div" [
                elA "p" [cls "bg-danger"] [
                    Doc.TextView (View.FromVar rvMsg)
                ]
            ]

            // Login form
            elA "form" [cls "form-horizontal" ; "role" ==> "form"] [

                inputRow rvUser "user" "Username" false
                inputRow rvPass "pass" "Password" true
                elA "div" [cls "form-group"] [
                    elA "div" [cls "col-sm-offset-2" ; cls "col-sm-10"] [
                        Doc.Button "Log In" [cls "btn" ; cls "btn-primary"] (fun () ->
                            let loginRes = checkLogin (Var.Get rvUser) (Var.Get rvPass)
                            match loginRes with
                            | Success user ->
                                // On success, reset cvar, set the thing in the state,
                                // then continue to the thread list
                                Var.Set rvMsg ""
                                Var.Set st.LoggedIn (Some user)
                                st.Go ThreadList
                            | NoSuchUser -> Var.Set rvMsg "No such user."
                            | InvalidPassword -> Var.Set rvMsg "Invalid password."
                        )
                    ]
                ]
            ]
        ]

    // Page to allow users to create a new thread
    let NewThreadPage st =
        let user = getUser st.LoggedIn
        // Vars for title and post content
        let rvTitle = Var.Create ""
        let rvPost = Var.Create ""

        elA "div" [cls "panel" ; cls "panel-default"] [
            elA "div" [cls "panel-heading"] [
                elA "h3" [cls "panel-title"] [
                    Doc.TextNode "New Thread"
                ]
            ]

            elA "div" [cls "panel-body"] [
                elA "form" [cls "form-horizontal"; "role" ==> "form"] [
                    elA "div" [cls "form-group"] [
                        elA "label" ["for" ==> "threadTitle"; cls "col-sm-2 control-label"] [
                            Doc.TextNode "Title"
                        ]
                        elA "div" [cls "col-sm-10"] [
                            Doc.Input ["id" ==> "threadTitle"] rvTitle
                        ]
                    ]

                    elA "div" [cls "form-group"] [
                        elA "label" ["for" ==> "postContent"; cls "col-sm-2 control-label"] [
                            Doc.TextNode "Content"
                        ]
                        elA "div" [cls "col-sm-10"] [
                            Doc.InputArea ["id" ==> "postContent" ; "rows" ==> "5"] rvPost
                        ]
                    ]

                    elA "div" [cls "form-group"] [
                        elA "div" [cls "col-sm-offset-2" ; cls "col-sm-10"] [
                            Doc.Button "Submit" [cls "btn" ; cls "btn-primary"] ( fun () ->
                                let newThread = createThread user.Name (Var.Get rvTitle)
                                let post = createPost user (Var.Get rvPost)
                                Add newThread.Posts post
                                Add st.Threads newThread
                                ShowThread newThread |> st.Go
                            )
                        ]
                    ]
                ]
            ]
        ]

    let ThreadListPage st =
        let renderThread (m : ViewModel<Thread>) thread =
            el "tr" [
                el "td" [Doc.TextNode thread.ThreadAuthorName]
                el "td" [
                    Doc.ElementWithEvents
                        "a" [Attr.Create "href" "#"]
                        [EventHandler.CreateHandler "click"
                            (fun _ -> ShowThread thread |> st.Go)]
                        [Doc.TextNode thread.Title]
                ]
            ]

        let threads = st.Threads
        elA "table" [cls "table" ; cls "table-hover"] [
            Doc.EmbedBagBy threads.Projection (renderThread threads) threads.Items.View
        ]

    let ShowThreadPage st thread =
        let user = getUser st.LoggedIn

        let renderPost (model : ViewModel<Post>) (post : Post) =
            el "tr" [
                el "td" [Doc.TextNode post.PostAuthorName]
                el "td" [Doc.TextNode post.Content]
            ]

        // List of posts
        let postList m =
            elA "div" [cls "panel" ; cls "panel-default"] [
                elA "div" [cls "panel-heading"] [
                    elA "h3" [cls "panel-title"] [
                        Doc.TextNode <| "Posts in thread \"" + thread.Title + "\""
                    ]
                ]

                elA "div" [cls "panel-body"] [
                    elA "table" [cls "table" ; cls "table-hover" ] [
                        Doc.EmbedBagBy m.Projection (renderPost m) m.Items.View
                    ]
                ]
            ]

        // New post form
        let newPostForm =
            // Var for post content
            let rvPost = Var.Create ""

            elA "div" [cls "panel" ; cls "panel-default"] [
                elA "div" [cls "panel-heading"] [
                    elA "h3" [cls "panel-title"] [
                        Doc.TextNode "New Post"
                    ]
                ]

                elA "div" [cls "panel-body"] [
                    elA "form" [cls "form-horizontal"; "role" ==> "form"] [
                        elA "div" [cls "form-group"] [
                            elA "label" ["for" ==> "postContent"; cls "col-sm-2 control-label"] [
                                Doc.TextNode "Content"
                            ]
                            elA "div" [cls "col-sm-10"] [
                                Doc.InputArea ["id" ==> "postContent" ; "rows" ==> "5"] rvPost
                            ]
                        ]

                        elA "div" [cls "form-group"] [
                            elA "div" [cls "col-sm-offset-2" ; cls "col-sm-10"] [
                                Doc.Button "Submit" [cls "btn" ; cls "btn-primary"] ( fun () ->
                                    createPost user rvPost.Value
                                    |> Add thread.Posts
                                )
                            ]
                        ]
                    ]
                ]
            ]

        // Main page render
        el "div" [
            postList thread.Posts
            newPostForm
        ]

    let DoLogOut st =
        Var.Set st.LoggedIn None

    let Main () =
        let actVar = Var.Create Login
        let loggedInVar = Var.Create None

        let threadModel = initialThreads
        MiniSitelet.Create actVar (fun go ->
            let st = { Go = go ; LoggedIn = loggedInVar ; Threads = threadModel}

            // withNavbar adds a navigation bar at the top of the page.
            let withNavbar =
                Doc.Append <| NavBar actVar st

            let routeFn = function
                | Login -> LoginPage st |> withNavbar
                | NewThread -> NewThreadPage st |> withNavbar
                | ThreadList -> ThreadListPage st |> withNavbar
                | LogOut ->
                    DoLogOut st
                    LoginPage st |> withNavbar
                | ShowThread t -> ShowThreadPage st t |> withNavbar
            routeFn
        )

    let description =
        el "div" [ Doc.TextNode "A message board application built using MiniSitelets."]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build()
            .Id("Message Board")
            .FileName(__SOURCE_FILE__)
            .Keywords(["text"])
            .Render(Main())
            .RenderDescription(description)
            .Create()
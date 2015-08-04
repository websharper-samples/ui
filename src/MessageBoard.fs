namespace WebSharper.UI.Next

open System
open WebSharper
open WebSharper.UI.Next.Client
open WebSharper.UI.Next.Html
open WebSharper.UI.Next.Notation
// Common types, used by both the client and server
[<JavaScript ; AutoOpen>]
module Common =
    // Helpers ----------------------------------------------------------------
    module Fresh =
        let mutable i = 0
        let Int =
            fun () ->
                i <- i + 1
                i

    type User =
        {
            Name : string
            Password : string
        }

    /// A post within a thread.
    type Post =
        {
            PostId : int
            PostAuthorName : string
            Content : string
        }

    /// A thread, containing 0 or more posts.
    type Thread =
        {
            ThreadId : int
            Title : string
            ThreadAuthorName : string
            Posts : Var<Post list>
        }

    let CreateThread author title =
        {
            ThreadId = Fresh.Int ()
            ThreadAuthorName = author
            Title = title
            Posts = Var.Create []
        }

    let CreatePost user content =
        {
            PostId =  Fresh.Int ()
            PostAuthorName = user.Name
            Content = content
        }

// A "server" component. Since this is a static site as opposed to a 'real'
// sitelet, we're faking this a bit. The interface is identical to something
// we'd find if we deployed this and had this instead as a [<Rpc>] section, though.
[<JavaScript>]
module Server =
    let DELAY = 200
    // CheckLogin: Async<LoginResult>
    let private CheckCredentials name pass =
        match (name, pass) with
        | ("TestUser", "TestPass") -> Some { Name = name; Password = pass }
        | _ -> None

    let CheckLogin user pass =
        async {
            do! Async.Sleep(DELAY) // Add some delay in
            return CheckCredentials user pass
        }

    let mutable threads = []

    let mutable (posts: Map<int, Post list>) = Map.empty

    let GetThreads () =
        async {
            do! Async.Sleep(DELAY)
            return threads
        }

    let GetPosts thread =
        async {
            match Map.tryFind thread.ThreadId posts with
            | Some threadPosts -> return threadPosts
            | None -> return []
        }

    let AddThread thread =
        async {
            threads <- threads @ [thread]
            posts <- Map.add thread.ThreadId [] posts
            return ()
        }

    let AddPost thread post =
        async {
            match Map.tryFind thread.ThreadId posts with
            | Some threadPosts ->
                posts <- Map.add thread.ThreadId (threadPosts @ [post]) posts
                return ()
            | None ->
                posts <- Map.add thread.ThreadId [post] posts
                return ()
        }

[<JavaScript>]
module MessageBoard =

    // Auth -------------------------------------------------------------------

    module Auth =

        type Component =
            {
                LoggedIn : View<option<User>>
                LoginForm : Doc
                StatusWidget : Doc
                HideForm : unit -> unit
                ShowForm : unit -> unit
            }

        let private LoginForm onLogin =
            let rvUser = Var.Create ""
            let rvPass = Var.Create ""
            let rvMsg = Var.Create ""
            let message =
                div [
                    pAttr [cls "bg-danger"] [
                        textView rvMsg.View
                    ]
                ]
            // Row of the login form
            let inputRow rv id lblText isPass =
                let control = if isPass then Doc.PasswordBox else Doc.Input
                divc "form-group" [
                    labelAttr [
                        attr.``for`` id
                        cls "col-sm-2 control-label"
                    ] [text lblText]
                    divc "col-sm-2" [
                        control
                            [
                                cls "form-control"
                                attr.id id
                                attr.placeholder lblText
                            ] rv
                    ]
                ]
            // Main login page markup
            div [
                div [ text "Hint: TestUser/TestPass" ]
                message
                // Login form
                formAttr [cls "form-horizontal"; Attr.Create "role" "form"] [
                    inputRow rvUser "user" "Username" false
                    inputRow rvPass "pass" "Password" true
                    divc "form-group" [
                        divc "col-sm-offset-2 col-sm-10" [
                            Doc.Button "Log In" [cls "btn btn-primary"] (fun () ->
                                async {
                                    let! loginResult = Server.CheckLogin rvUser.Value rvPass.Value
                                    match loginResult with
                                    | Some user ->
                                        Var.Set rvUser ""
                                        Var.Set rvPass ""
                                        onLogin user
                                    | None -> Var.Set rvMsg "Invalid credentials."
                                } |> Async.Start
                            )
                        ]
                    ]
                ]
            ]

        let private StatusWidget (login: unit -> unit) (logout: unit -> unit) (view: View<option<User>>) =
            view
            |> View.Map (function
                | Some usr ->
                    let t = "Welcome, " + usr.Name + "!"
                    Doc.Concat [
                        li [Doc.Link t [] ignore]
                        li [Doc.Link "Logout" [] logout]
                    ]
                | None ->
                    Doc.Concat [
                        li [Doc.Link "You are not logged in." [] ignore]
                        li [Doc.Link "Login" [] login]
                    ])
            |> Doc.EmbedView

        let Create () =
            let loggedIn = Var.Create None
            let hidden = Var.Create true
            let hide () = hidden.Value <- true
            let show () = hidden.Value <- false
            let display =
                hidden.View
                |> View.Map (fun yes -> if yes then "none" else "block")
            let loginForm =
                divAttr [Attr.DynamicStyle "display" display] [
                    LoginForm (fun user ->
                        loggedIn.Value <- Some user
                        hide ())
                ]
            let login () =
                show ()
            let logout () =
                loggedIn.Value <- None
                hide ()
            {
                LoggedIn = loggedIn.View
                LoginForm = loginForm
                HideForm = hide
                ShowForm = show
                StatusWidget = StatusWidget login logout loggedIn.View
            }

    // Model ------------------------------------------------------------------

    /// Various "places" in the application.
    type Action =
        | NewThread
        | ShowThread of Thread
        | ThreadList

    let ShowAction act =
        match act with
        | NewThread -> "Create New Thread"
        | ShowThread t -> "Thread " + t.Title
        | ThreadList -> "Show All Threads"

    type State =
        {
            Auth : Auth.Component
            Threads : Var<Thread list>
            Go : Action -> unit
        }

    /// Navigation bar, different for logged in / not logged in
    let NavBar (auth: Auth.Component) var st =
        let actions = [ThreadList; NewThread]
        let evtLink text act = Doc.Link text [] (fun _ -> st.Go act)
        let renderLink action =
            View.FromVar var
            |> View.Map (fun active ->
                let attr = if ShowAction action = ShowAction active then cls "active" else Attr.Empty
                liAttr [attr] [ evtLink (ShowAction action) action ])
            |> Doc.EmbedView
        navAttr [cls "navbar navbar-default"; Attr.Create "role" "navigation"] [
            divc "container-fluid" [
                ulAttr [cls "nav navbar-nav"] [
                    List.map renderLink actions |> Doc.Concat
                ]
                ulAttr [cls "nav navbar-nav navbar-right"] [
                    //li [ auth.StatusWidget ]
                    auth.StatusWidget
                ]
            ]
        ]

    /// Page to allow users to create a new thread.
    let NewThreadPage st =
        let doc user =
            let rvTitle = Var.Create ""
            let rvPost = Var.Create ""
            let add () =
                let newThread = CreateThread user.Name (Var.Get rvTitle)
                let post = CreatePost user (Var.Get rvPost)
                async {
                    do! Server.AddThread newThread
                    do! Server.AddPost newThread post
                } |> Async.Start

                ShowThread newThread |> st.Go
            divc "panel panel-default" [
                divc "panel-heading" [
                    h3Attr [cls "panel-title"] [
                        text "New Thread"
                    ]
                ]
                divc "panel-body" [
                    formAttr [cls "form-horizontal"; Attr.Create "role" "form"] [
                        divc "form-group" [
                            labelAttr [attr.``for`` "threadTitle"; cls "col-sm-2 control-label"] [
                                text "Title"
                            ]
                            divc "col-sm-10" [
                                Doc.Input [attr.id "threadTitle" ; sty "width" "100%" ; cls "form-control"] rvTitle
                            ]
                        ]
                        divc "form-group" [
                            labelAttr [attr.``for`` "postContent"; cls "col-sm-2 control-label"] [
                                text "Content"
                            ]
                            divc "col-sm-10" [
                                Doc.InputArea [attr.id "postContent"; attr.rows "5" ; cls "form-control" ; sty "width" "100%"] rvPost
                            ]
                        ]
                        divc "form-group" [
                            divc "col-sm-offset-2 col-sm-10" [
                                Doc.Button "Submit" [cls "btn btn-primary"] add
                            ]
                        ]
                    ]
                ]
            ] :> Doc
        st.Auth.LoggedIn
        |> View.Map (function
            | Some user -> doc user
            | None -> st.Auth.ShowForm (); Doc.Empty)
        |> Doc.EmbedView

    let ThreadListPage st =
        let renderThread thread =
            tr [
                td [text thread.ThreadAuthorName]
                td [
                    Doc.Link thread.Title [] (fun _ -> ShowThread thread |> st.Go)
                ]
            ] :> Doc
        let threads = st.Threads

        async {
            let! threadList = Server.GetThreads ()
            Var.Set threads threadList
        } |> Async.Start

        tableAttr [cls "table table-hover"] [
            tbody [
                View.Map (fun threads ->
                    List.map renderThread threads |> Doc.Concat
                ) (View.FromVar st.Threads) |> Doc.EmbedView
            ]
        ] :> Doc

    let ShowThreadPage st thread =
        let rvPosts = Var.Create []

        let getPosts () =
            async {
                let! postList = Server.GetPosts thread
                Var.Set rvPosts postList
            } |> Async.Start

        let renderPost (post : Post) =
            tr [
                td [text post.PostAuthorName]
                td [text post.Content]
            ] :> Doc

        // List of posts
        let postList =
            divc "panel panel-default" [
                divc "panel-heading" [
                    h3Attr [cls "panel-title"] [
                        text <| "Posts in thread \"" + thread.Title + "\""
                    ]
                ]
                divc "panel-body" [
                    tableAttr [cls "table table-hover" ] [
                        tbody [
                            View.Map (fun posts ->
                                List.map renderPost posts |> Doc.Concat
                            ) (View.FromVar rvPosts) |> Doc.EmbedView
                        ]
                    ]
                ]
            ]
        // New post form
        let newPostForm (user: User) =
            // Var for post content
            let rvPost = Var.Create ""
            let add () =
                let post = CreatePost user rvPost.Value
                async {
                    do! Server.AddPost thread post
                    getPosts ()
                } |> Async.Start
            divc "panel panel-default" [
                divc "panel-heading" [
                    h3Attr [cls "panel-title"] [
                        text "New Post"
                    ]
                ]
                divc "panel-body" [
                    formAttr [cls "form-horizontal"; Attr.Create "role" "form"] [
                        divc "form-group" [
                            labelAttr [attr.``for`` "postContent"; cls "col-sm-2 control-label"] [
                                text "Content"
                            ]
                            divc "col-sm-10" [
                                Doc.InputArea [attr.id "postContent" ; attr.rows "5" ; cls "form-control" ; sty "width" "100%"] rvPost
                            ]
                        ]
                        divc "form-group" [
                            divc "col-sm-offset-2 col-sm-10" [
                                Doc.Button "Submit" [cls "btn btn-primary"] add
                            ]
                        ]
                    ]
                ]
            ]

        getPosts ()
        div [
            postList
            st.Auth.LoggedIn
            |> View.Map (function
                | None -> Doc.Empty
                | Some user -> newPostForm user :> _)
            |> Doc.EmbedView
        ] :> Doc

    let Initialise () =
        let thread = CreateThread "SimonJF" "Hello, World! This is a topic."
        let post = CreatePost { Name = "SimonJF" ; Password = "" } "Hello, world! This is a post."
        async {
            do! Server.AddThread thread
            do! Server.AddPost thread post
        } |> Async.Start

    let Main () =
        Initialise ()
        let actVar = Var.Create ThreadList
        let auth = Auth.Create ()
        let st = {Go = Var.Set actVar; Auth = auth ; Threads = Var.Create []}
        let navbar = NavBar auth actVar st
        let layout x =
            Doc.Concat [
                navbar
                auth.LoginForm
                x
            ]

        View.FromVar actVar
        |> View.Map (fun act ->
            auth.HideForm ()
            match act with
            | NewThread -> NewThreadPage st
            | ThreadList -> ThreadListPage st
            | ShowThread t -> ShowThreadPage st t
            |> layout) |> Doc.EmbedView

    let Description () =
        div [ text "A message board application built using MiniSitelets."]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build()
            .Id("MessageBoard")
            .FileName(__SOURCE_FILE__)
            .Keywords(["text"])
            .Render(Main)
            .RenderDescription(Description)
            .Create()

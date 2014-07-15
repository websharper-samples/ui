namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.UI.Next.MiniSitelet

[<JavaScript>]
module MessageBoard =

    // Helpers ----------------------------------------------------------------

    module Fresh =

        let Int =
            let tid = ref 0
            fun () ->
                incr tid
                !tid

    type ViewModel<'T> =
        {
            Projection : 'T -> int
            Items : Model<seq<'T>,ResizeArray<'T>>
        }

    module ViewModel =

        /// Adds an item to the collection.
        let Add m item =
            m.Items
            |> Model.Update (fun all -> all.Add(item))

        let Create proj =
            let items =
                ResizeArray()
                |> Model.Create (fun arr -> arr.ToArray() :> seq<_>)
            { Items = items ; Projection = proj }

        /// Removes an item from the collection.
        let Remove m item =
            m.Items
            |> Model.Update (fun all ->
                seq { 0 .. all.Count - 1 }
                |> Seq.filter (fun i -> m.Projection all.[i] = m.Projection item)
                |> Seq.toArray
                |> Array.iter (fun i -> all.RemoveAt(i)))

    // Auth -------------------------------------------------------------------

    type User =
        {
            Name : string
            Password : string
        }

    module Auth =

        type Component =
            {
                LoggedIn : View<option<User>>
                LoginForm : Doc
                StatusWidget : Doc
                HideForm : unit -> unit
                ShowForm : unit -> unit
            }

        type private LoginResult =
            | Success of User
            | NoSuchUser
            | InvalidPassword

        /// TODO: Something more async'y, to emulate a server
        let private CheckLogin name pass =
            match (name, pass) with
            | ("TestUser", "TestPass") -> Some { Name = name; Password = pass }
            | _ -> None

        let private LoginForm onLogin =
            let rvUser = Var.Create ""
            let rvPass = Var.Create ""
            let message =
                el "div" [
                    elA "p" [cls "bg-danger"] [
                        (rvUser.View, rvPass.View)
                        ||> View.Map2 (fun u p ->
                            match u, p with
                            | "", "" -> Doc.Empty
                            | u, p ->
                                match CheckLogin u p with
                                | None -> Doc.TextNode "Invalid credentials"
                                | _ -> Doc.Empty)
                        |> Doc.EmbedView
                    ]
                ]
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
                message
                // Login form
                elA "form" [cls "form-horizontal"; "role" ==> "form"] [
                    inputRow rvUser "user" "Username" false
                    inputRow rvPass "pass" "Password" true
                    elA "div" [cls "form-group"] [
                        elA "div" [cls "col-sm-offset-2" ; cls "col-sm-10"] [
                            Doc.Button "Log In" [cls "btn" ; cls "btn-primary"] (fun () ->
                                match CheckLogin rvUser.Value rvPass.Value with
                                | Some user ->
                                    Var.Set rvUser ""
                                    Var.Set rvPass ""
                                    onLogin user
                                | None -> ())
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
                        Doc.TextNode t
                        Doc.Button "Logout" [] logout
                    ]
                | None ->
                    Doc.Concat [
                        Doc.TextNode "You are not logged in."
                        Doc.Button "Login" [] login
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
                elA "div" [Attr.ViewStyle "display" display] [
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
            Posts : ViewModel<Post>
        }

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
            // Threads are time-varying objects. For example, they might get
            // deleted, their posts might change, and so on.
            // For this reason, we need a thread model.
            Threads : ViewModel<Thread>
            Go : Action -> unit
        }

    let CreateThread author title =
        {
            ThreadId = Fresh.Int ()
            ThreadAuthorName = author
            Title = title
            Posts = ViewModel.Create (fun p -> p.PostId)
        }

    let InitialThreads () =
        let thread = CreateThread "SimonJF" "Hello, World! This is a topic."
        let threadModel = ViewModel.Create (fun t -> t.ThreadId)
        ViewModel.Add threadModel thread
        threadModel

    let CreatePost user content =
        {
            PostId = Fresh.Int ()
            PostAuthorName = user.Name
            Content = content
        }

    /// Navigation bar, different for logged in / not logged in
    let NavBar (auth: Auth.Component) var st =
        let actions = [ThreadList; NewThread]
        let evtLink act =
            Doc.ElementWithEvents "a" ["href" ==> "#"]
                [EventHandler.CreateHandler "click" (fun _ -> st.Go act)]
        let renderLink action =
            View.FromVar var
            |> View.Map (fun active ->
                let attr = if ShowAction action = ShowAction active then cls "active" else Attr.Empty
                elA "li" [attr] [ evtLink action [ ShowAction action |> txt ] ])
            |> Doc.EmbedView
        elA "nav" [cls "navbar"; cls "navbar-default"; Attr.Create "role" "navigation"] [
            elA "div" [] [
                elA "ul" [cls "nav" ; cls "navbar-nav" ; cls "navbar-right"] [
                    el "li" [ auth.StatusWidget ]
                ]
                elA "ul" [cls "nav" ; cls "navbar-nav"] [
                    List.map renderLink actions |> Doc.Concat
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
                ViewModel.Add newThread.Posts post
                ViewModel.Add st.Threads newThread
                ShowThread newThread |> st.Go
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
                                Doc.InputArea ["id" ==> "postContent"; "rows" ==> "5"] rvPost
                            ]
                        ]
                        elA "div" [cls "form-group"] [
                            elA "div" [cls "col-sm-offset-2" ; cls "col-sm-10"] [
                                Doc.Button "Submit" [cls "btn"; cls "btn-primary"] add
                            ]
                        ]
                    ]
                ]
            ]
        st.Auth.LoggedIn
        |> View.Map (function
            | Some user -> doc user
            | None -> st.Auth.ShowForm (); Doc.Empty)
        |> Doc.EmbedView

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
        // let user = getUser st.LoggedIn
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
        let newPostForm (user: User) =
            // Var for post content
            let rvPost = Var.Create ""
            let add () =
                CreatePost user rvPost.Value
                |> ViewModel.Add thread.Posts
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
                                Doc.Button "Submit" [cls "btn" ; cls "btn-primary"] add
                            ]
                        ]
                    ]
                ]
            ]
        el "div" [
            postList thread.Posts
            st.Auth.LoggedIn
            |> View.Map (function
                | None -> Doc.Empty
                | Some user -> newPostForm user)
            |> Doc.EmbedView
        ]

    let Main () =
        let actVar = Var.Create ThreadList
        let auth = Auth.Create ()
        let threadModel = InitialThreads ()
        MiniSitelet.Create actVar (fun go ->
            let st = { Go = go; Auth = auth; Threads = threadModel }
            let navbar = NavBar auth actVar st
            let layout x =
                Doc.Concat [
                    navbar
                    auth.LoginForm
                    x
                ]
            let routeFn act =
                auth.HideForm ()
                match act with
                | NewThread -> NewThreadPage st
                | ThreadList -> ThreadListPage st
                | ShowThread t -> ShowThreadPage st t
            routeFn >> layout)

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

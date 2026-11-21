namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation

/// Suite: working with collections — filtering, sorting, editable records,
/// and check-box / radio selection.
[<JavaScript>]
module CollectionsSuite =

    // -------------------------------------------------------------- phones

    type Phone = { Name : string ; Snippet : string ; Age : int }
    type Order = Alphabetical | Newest

    let showOrder = function
        | Alphabetical -> "Alphabetical"
        | Newest -> "Newest"

    let phones =
        [
            { Name = "Nexus S" ; Snippet = "Fast just got faster with Nexus S." ; Age = 1 }
            { Name = "Motorola XOOM" ; Snippet = "The next, next generation tablet." ; Age = 2 }
            { Name = "Motorola XOOM with Wi-Fi" ; Snippet = "The next, next generation tablet, now with Wi-Fi." ; Age = 3 }
            { Name = "Samsung Galaxy" ; Snippet = "The ultimate phone." ; Age = 4 }
            { Name = "Droid Incredible" ; Snippet = "A phone that keeps up with you." ; Age = 5 }
        ]

    let PhonesDemo () =
        let query = Var.Create ""
        let order = Var.Create Newest

        let matches (q: string) ph =
            q = ""
            || ph.Name.ToLower().Contains(q.ToLower())
            || ph.Snippet.ToLower().Contains(q.ToLower())

        let shown =
            View.Map2 (fun q o ->
                phones
                |> List.filter (matches q)
                |> List.sortBy (fun ph ->
                    match o with
                    | Alphabetical -> ph.Name
                    | Newest -> sprintf "%02d" (99 - ph.Age)))
                (View.FromVar query)
                (View.FromVar order)

        let phoneCard ph =
            li [cls "result-item"] [
                div [cls "result-main"] [
                    strong [] [ text ph.Name ]
                    p [] [ text ph.Snippet ]
                ]
                span [cls "pill"] [ text (sprintf "Age %d" ph.Age) ]
            ]

        div [] [
            div [cls "toolbar"] [
                div [cls "field"; cls "grow"] [
                    label [] [ text "Search" ]
                    Doc.InputType.Text
                        [ cls "form-control" ; attr.placeholder "Filter by name or description…" ]
                        query
                ]
                div [cls "field"] [
                    label [] [ text "Sort by" ]
                    Doc.InputType.Select [cls "form-control"] showOrder [Newest ; Alphabetical] order
                ]
            ]
            shown
            |> View.Map (fun xs ->
                if List.isEmpty xs then emptyState "No phones match that search."
                else ul [cls "result-list"] (List.map phoneCard xs))
            |> Doc.EmbedView
        ]

    // ------------------------------------------------------- editable people

    type Person =
        { FirstName : Var<string>
          LastName : Var<string>
          Role : Var<string> }

    let people =
        [
            { FirstName = Var.Create "Alonzo" ; LastName = Var.Create "Church" ; Role = Var.Create "Mathematician" }
            { FirstName = Var.Create "Alan" ; LastName = Var.Create "Turing" ; Role = Var.Create "Computer scientist" }
            { FirstName = Var.Create "Bertrand" ; LastName = Var.Create "Russell" ; Role = Var.Create "Philosopher" }
            { FirstName = Var.Create "Noam" ; LastName = Var.Create "Chomsky" ; Role = Var.Create "Linguist" }
        ]

    let PeopleDemo () =
        let personView p =
            View.Map2 (fun f l -> f + " " + l)
                (View.FromVar p.FirstName)
                (View.FromVar p.LastName)

        let display =
            div [cls "chip-list"] (
                people
                |> List.map (fun p ->
                    personView p
                    |> View.Map (fun name -> span [cls "chip"] [ text name ])
                    |> Doc.EmbedView)
            )

        let editor p =
            div [cls "person-card"] [
                div [cls "person-fields"] [
                    div [cls "field"] [
                        label [] [ text "First name" ]
                        Doc.InputType.Text [cls "form-control"] p.FirstName
                    ]
                    div [cls "field"] [
                        label [] [ text "Last name" ]
                        Doc.InputType.Text [cls "form-control"] p.LastName
                    ]
                ]
                div [cls "field"] [
                    label [] [ text "Role" ]
                    Doc.InputType.Text [cls "form-control"] p.Role
                ]
            ]

        div [] [
            display
            div [cls "person-grid"] (List.map editor people)
        ]

    // ------------------------------------------------------------ selection

    type Diner = { Name : string ; Age : int }
    type Restaurant = Jelen | Suszterinas | Csiga | Stex

    let diners =
        [
            { Name = "Simon" ; Age = 22 }
            { Name = "Peter" ; Age = 18 }
            { Name = "Clare" ; Age = 50 }
            { Name = "Andy" ; Age = 51 }
        ]

    let showRestaurant = function
        | Jelen -> "Jelen"
        | Suszterinas -> "Suszterinas"
        | Csiga -> "Csiga"
        | Stex -> "Stex"

    let SelectionDemo () =
        let selected = Var.Create []
        let restaurant = Var.Create Jelen

        let checkRow person =
            label [cls "check-row"] [
                Doc.InputType.CheckBoxGroup [] person selected
                span [] [ text person.Name ]
                span [cls "muted"] [ text (sprintf "age %d" person.Age) ]
            ]

        let radioRow r =
            label [cls "check-row"] [
                Doc.InputType.Radio [] r restaurant
                span [] [ text (showRestaurant r) ]
            ]

        let summary =
            View.FromVar selected
            |> View.Map (fun xs ->
                if List.isEmpty xs then "Nobody selected yet."
                else
                    xs
                    |> List.map (fun p -> p.Name)
                    |> String.concat ", ")

        div [cls "grid-2"] [
            div [] [
                h4 [] [ text "Who is coming to dinner?" ]
                div [cls "check-list"] (List.map checkRow diners)
                p [cls "summary-line"] [
                    text "Selected: "
                    textView summary
                ]
            ]
            div [] [
                h4 [] [ text "Pick a restaurant" ]
                div [cls "check-list"] (List.map radioRow [Csiga ; Suszterinas ; Jelen ; Stex])
                p [cls "summary-line"] [
                    text "Booking at: "
                    textView (View.Map showRestaurant (View.FromVar restaurant))
                ]
            ]
        ]

    // ------------------------------------------------------------------ page

    let Main _ =
        Doc.Concat [
            p [cls "sample-blurb"] [
                text "Lists that filter and sort themselves, records whose fields are \
                 editable in place, and typed selection controls."
            ]
            div [cls "grid-2"] [
                cardWithHint "Filterable phone list"
                    "A search box and a sort selector combined with View.Map2."
                    (PhonesDemo ())
                cardWithHint "Editable people"
                    "Every field is a Var; the name chips update as you type."
                    (PeopleDemo ())
            ]
            cardWithHint "Selection controls"
                "Check-box groups and radio buttons over typed values."
                (SelectionDemo ())
        ]

    let Description _ =
        div [] [
            text "Filtering, sorting, editable records and typed selection \
                  controls over reactive collections."
        ]

    let Sample =
        Samples.Build(Samples.CollectionsSuite)
            .Id("Collections & selection")
            .FileName(__SOURCE_FILE__)
            .Keywords(["collections"; "selection"])
            .Category(Samples.Suite)
            .Render(Main)
            .RenderDescription(Description)
            .Create()
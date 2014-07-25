namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.UI.Next
open IntelliFactory.WebSharper.UI.Next.Html

[<JavaScript>]
module EditablePersonList =

    // Firstly, we create a model. Each person has a variable first name and
    // surname, so we have each field refer to a reactive variable.
    type Person =
        {
            FirstName : Var<string>
            LastName : Var<string>
        }

    // We then make a function to create a Person
    let createPerson first last =
        { FirstName = Var.Create first ; LastName = Var.Create last }

    // ...use this to make a list of people
    let peopleList =
        [
            createPerson "Alonzo" "Church"
            createPerson "Alan" "Turing"
            createPerson "Bertrand" "Russell"
            createPerson "Noam" "Chomsky"
        ]

    // Now, the member list is a list of people, based on the editable controls.
    let memberList =
        // This renders each entry in the list.
        let renderItem person =
            LI0 [
                // Map2 takes 2 views, which allow us to look at a value as
                // it changes. Here, we want to look at first and last names.
                View.Map2 (fun f l ->
                    f + " " + l |> txt
                ) (View.FromVar person.FirstName) (View.FromVar person.LastName)
                // Map2 in this case will make a View<Doc>. The EmbedView
                // combinator allows us to embed this into the rest of the
                // document: EmbedView : View<Doc> -> Doc.
                |> Doc.EmbedView
            ]

        Div0 [
            UL0 [
                // This maps over our list of people, creating a list of Docs.
                // Since a Doc has a monoidal interface, we can then just use
                // Doc.Concat to flatten this out to a single Doc.
                List.map renderItem peopleList |> Doc.Concat
            ]
        ]

    // Here, we create the input components which can manipulate the Person
    // records.
    let peopleBoxes =
        // RenderPersonInput takes a Person, and returns a Doc with two
        // input components which will manipulate the first and last name
        // fields.
        let renderPersonInput person =
            LI0 [
                Doc.Input [] person.FirstName
                Doc.Input [] person.LastName
            ]

        // We use the same trick as before: create a list of Docs from a list
        // of Person records, and flatten it using Doc.Concat
        Div0 [
            UL0 [
                List.map renderPersonInput peopleList |> Doc.Concat
            ]
        ]

    // Finally, we put it all together.
    let Main () =
        Div0 [
            Div0 [
                H10 [txt "Member List"]
                memberList
            ]
            Div0 [
                H10 [txt "Change Member Details"]
                peopleBoxes
            ]
        ]

    let Description () =
        Div0 [
            txt "An example inspired by a "
            href "SAP OpenUI sample" "http://jsbin.com/openui5-HTML-templates/1/edit"
            txt "."
        ]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build()
            .Id("EditablePersonList")
            .FileName(__SOURCE_FILE__)
            .Keywords(["text"])
            .Render(Main)
            .RenderDescription(Description)
            .Create()
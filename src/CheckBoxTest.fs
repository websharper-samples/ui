namespace WebSharper.UI.Next

open WebSharper
open WebSharper.UI.Next
open WebSharper.UI.Next.Client
open WebSharper.UI.Next.Html

// An example making use of the checkbox controls within RDOM.
// See this live at http://intellifactory.github.io/websharper.ui.next/#CheckBoxTest.fs !

[<JavaScript>]
module CheckBoxTest =

    // First, make some nice records:
    type Person =
        { Name: string; Age: int }

        static member Create n a =
            { Name = n; Age = a }

    type Restaurant = | Jelen | Suszterinas | Csiga | Stex
    let showRestaurant = function
        | Jelen -> "Jelen" | Suszterinas -> "Suszterinas"
        | Csiga -> "Csiga" | Stex -> "Stex"

    // And some data:
    let People =
        [
            Person.Create "Simon" 22
            Person.Create "Peter" 18
            Person.Create "Clare" 50
            Person.Create "Andy" 51
        ]

    let Main () =

        // We make a variable containing the initial list of selected people.
        let selPeople = Var.Create []

        // We now need to make check box components for each of the people.
        let mkCheckBox person =
            div [
                Doc.CheckBoxGroup [] person selPeople
                Doc.TextNode person.Name
            ] :> Doc

        let checkBoxes =
            div (List.map mkCheckBox People)

        // Shows names of a list of people.
        let showNames xs = List.fold (fun acc p -> acc + p.Name + ", ") "" xs

        // Create a label that dynamially shows the names of selected people.
        let label =
            View.FromVar selPeople
            |> View.Map showNames
            |> Doc.TextView

        // Create a document fragment for check boxes
        let checkBoxSection = div [checkBoxes; label]

        // Now let's do something with radio buttons
        let radioBoxVar = Var.Create Jelen
        let restaurants = [Csiga; Suszterinas ; Jelen ; Stex]
        let mkRadioButton restaurant =
            div [
                Doc.Radio [] restaurant radioBoxVar
                showRestaurant restaurant |> Doc.TextNode
            ] :> Doc

        let restaurantsSection =
            div [
                List.map mkRadioButton restaurants |> Doc.Concat
                Doc.TextView (View.Map showRestaurant radioBoxVar.View)
            ]

        div [
            checkBoxSection
            restaurantsSection
        ]

    let Description () =
        div [
            Doc.TextNode "An application which shows the selected values."
        ]

    // Boilerplate for the sample viewer...
    let Sample =
        Samples.Build()
            .Id("CheckBoxTest")
            .FileName(__SOURCE_FILE__)
            .Keywords(["todo"])
            .Render(Main)
            .RenderDescription(Description)
            .Create()
namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper

// An example of a flowlet for getting contact details from a user.
// See this live at http://intellifactory.github.io/websharper.ui.next/#ContactFlow.fs !

[<JavaScript>]
module ContactFlow =

    // The idea behind this example is that we first get some common details
    // from a user: in this case a name and address.
    // We then ask which type of contact details they wish to supply, so in
    // this case, either a phone number or e-mail address.
    // Finally, we get them to specify this, and display the results.

    // Firstly, we define the types we need to use.
    type ContactType = | EmailTy | PhoneTy

    type ContactDetails =
        | Email of string
        | PhoneNumber of string

    type Person =
        {
            Name : string
            Address : string
        }

    // Helper function to display an input field within a form prettily.
    let inputRow rv id lblText =
        elA "div" [cls "form-group"] [
            elA "label"
                ["for" ==> id
                 cls "col-sm-2"
                 cls "control-label"
                ] [Doc.TextNode lblText]

            elA "div" [cls "col-sm-10"] [
                Doc.Input
                    ["type" ==> "text"
                     cls "form-control"
                     "id" ==> id
                     "placeholder" ==> lblText
                    ] rv
            ]
        ]

    // The initial "page" of the flowlet, which gets name and address detiails
    let personFlowlet =
        Flow.Define (fun cont ->
            let rvName = Var.Create ""
            let rvAddress = Var.Create ""

            elA "form" [cls "form-horizontal" ; "role" ==> "form"] [
                // Name
                inputRow rvName "lblName" "Name"
                // Address
                inputRow rvAddress "lblAddr" "Address"
                elA "div" [cls "form-group"] [
                    elA "div" [cls "col-sm-offset-2" ; cls "col-sm-10"] [
                        Doc.Button "Next" [cls "btn" ; cls "btn-default"] (fun () ->
                            let name = Var.Get rvName
                            let addr = Var.Get rvAddress
                            // We use the continuation function to return the
                            // data we retrieved from the form.
                            cont ({Name = name ; Address = addr})
                        )
                    ]
                ]
            ]

        )

    // The second page of the flowlet, which asks whether the user wants
    // to specify an e-mail address or phone number.
    let contactTypeFlowlet =
        Flow.Define (fun cont ->
            elA "form" [cls "form-horizontal" ; "role" ==> "form"] [
                elA "div" [cls "form-group"] [
                    el "div" [
                        Doc.Button "E-Mail Address" [cls "btn" ; cls "btn-default"]
                            (fun () -> cont EmailTy)
                    ]

                    el "div" [
                        Doc.Button "Phone Number" [cls "btn" ; cls "btn-default"]
                            (fun () -> cont PhoneTy)
                    ]
               ]
            ]
        )

    // Using this, we either get an e-mail address or phone number from the user.
    let contactFlowlet contactTy =
        // Determine the label and constructor to use.
        let (label, constr) =
            match contactTy with
            | EmailTy -> ("E-Mail Address", Email)
            | PhoneTy -> ("Phone Number", PhoneNumber)

        Flow.Define ( fun cont ->
            let rvContact = Var.Create ""
            elA "form" [cls "form-horizontal" ; "role" ==> "form"] [
                inputRow rvContact "contact" label
                elA "div" [cls "form-group"] [
                    elA "div" [cls "col-sm-offset-2" ; cls "col-sm-10"] [
                        Doc.Button "Finish" [cls "btn" ; cls "btn-default"]
                            // Call the continuation with the contact details
                            // and the constructor to use.
                            ( fun () ->
                                Var.Get rvContact
                                |> constr
                                |> cont )
                    ]
                ]
            ]
        )

    // Should be Flow<unit>
    // Some kind of Doc -> Flow<unit> would be nice
    let finalPage person details =
        let detailsStr =
            match details with
            | Email s -> "the e-mail address " + s
            | PhoneNumber s -> "the phone number " + s

        el "div" [
            Doc.TextNode <| "You said your name was " + person.Name + ", your address was " + person.Address + ", "
            Doc.TextNode <| " and you provided " + detailsStr + "."
        ]

    // Put it all together! This flow is like a roadmap of the application.
    // We firstly get the person details, then the contact type, then the
    // contact details (using the contact type we got in the previous step).
    // Finally, we display a static end page.
    let ExampleFlow () =
        Flow.Do {
            let! person = personFlowlet
            let! ct = contactTypeFlowlet
            let! contactDetails = contactFlowlet ct
            return! Flow.Static (finalPage person contactDetails)
        }
        |> Flow.Embed

    let Description () =
        el "div" [
            Doc.TextNode "A WS.UI.Next flowlet implementation."
        ]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build()
            .Id("ContactFlow")
            .FileName(__SOURCE_FILE__)
            .Keywords(["flowlet"])
            .Render(ExampleFlow)
            .RenderDescription(Description)
            .Create()

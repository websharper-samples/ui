namespace WebSharper.UI

open WebSharper
open WebSharper.UI.Client
open WebSharper.UI.Html

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
    let inputRow rv id lblText isArea =
        let control = if isArea then Doc.InputArea else Doc.Input
        divc "row" [
            divc "form-group" [
                label [
                    cls "col-sm-2 control-label"
                    attr.``for`` id
                ] [text lblText]

                divc "col-sm-6" [
                    control
                        [attr.``type`` "text"
                         cls "form-control"
                         attr.id id
                         attr.placeholder lblText
                        ] rv

                ]
                divc "col-sm-4" []
            ]
        ]

    // The initial "page" of the flowlet, which gets name and address detiails
    let personFlowlet =
        Flow.Define (fun cont ->
            let rvName = Var.Create ""
            let rvAddress = Var.Create ""

            form [cls "form-horizontal" ; Attr.Create "role" "form"] [
                // Name
                inputRow rvName "lblName" "Name" false
                // Address
                inputRow rvAddress "lblAddr" "Address" true
                divc "row" [
                    divc "col-sm-2" []
                    divc "col-sm-6" [
                        divc "form-group" [
                            Doc.Button "Next" [cls "btn btn-default"] (fun () ->
                                let name = Var.Get rvName
                                let addr = Var.Get rvAddress
                                // We use the continuation function to return the
                                // data we retrieved from the form.
                                cont ({Name = name ; Address = addr})
                            )
                        ]
                    ]
                    divc "col-sm-4" []
                ]
            ]
        )

    // The second page of the flowlet, which asks whether the user wants
    // to specify an e-mail address or phone number.
    let contactTypeFlowlet =
        Flow.Define (fun cont ->
            form [cls "form-horizontal" ; Attr.Create "role" "form"] [
                form [cls "form-group"] [
                    div [] [
                        Doc.Button "E-Mail Address" [cls "btn btn-default"]
                            (fun () -> cont EmailTy)
                    ]

                    div [] [
                        Doc.Button "Phone Number" [cls "btn btn-default"]
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
            form [cls "form-horizontal" ; Attr.Create "role" "form"] [
                inputRow rvContact "contact" label false
                divc "form-group" [
                    divc "col-sm-offset-2 col-sm-10" [
                        Doc.Button "Finish" [cls "btn btn-default"]
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

        div [] [
            text <| "You said your name was " + person.Name + ", your address was " + person.Address + ", "
            text <| " and you provided " + detailsStr + "."
        ]

    // Put it all together! This flow is like a roadmap of the application.
    // We firstly get the person details, then the contact type, then the
    // contact details (using the contact type we got in the previous step).
    // Finally, we display a static end page.
    let ExampleFlow _ =
        Flow.Do {
            let! person = personFlowlet
            let! ct = contactTypeFlowlet
            let! contactDetails = contactFlowlet ct
            return! Flow.Static (finalPage person contactDetails)
        }
        |> Flow.Embed

    let Description _ =
        div [] [
            text "A WebSharper.UI flowlet implementation."
        ]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build(Samples.ContactFlow)
            .Id("ContactFlow")
            .FileName(__SOURCE_FILE__)
            .Keywords(["flowlet"])
            .Render(ExampleFlow)
            .RenderDescription(Description)
            .Create()

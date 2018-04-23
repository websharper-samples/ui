namespace WebSharper.UI

open WebSharper
open WebSharper.UI.Client
open WebSharper.UI.Html

// An example of a flowlet for getting contact details from a user.
// See this live at http://intellifactory.github.io/websharper.ui.next/#ContactFlow.fs !

[<JavaScript>]
module AnimatedContactFlow =

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
        divc "form-group" [
            label [
                attr.``for`` id
                cls "col-sm-2 control-label"
            ] [text lblText]

            divc "col-sm-10" [
                Doc.Input
                    [attr.``type`` "text"
                     cls "form-control"
                     attr.id id
                     attr.placeholder lblText
                    ] rv
            ]
        ]

    // Animations!

    // Fade:
    // We want the fade to last 300ms. We're working with Doubles, so we can use
    // Interpolation.Double to handle interpolation for use.
    // We can also just use the inbuild cubic in / out easing.
    let fadeTime = 300.0
    let Fade =
        Anim.Simple Interpolation.Double Easing.CubicInOut fadeTime

    // Transitions are triggered when an element is added or removed.
    // Here, we describe a transition for fading -- opacity is a value
    // between 0.0 (invisible) and 1.0 (fully visible).
    // The "i" variable allows us to make transitions depend upon a variable,
    // for example a state -- but we don't need it in this case.
    let FadeTransition =
        Trans.Create Fade
        |> Trans.Enter (fun i -> Fade 0.0 1.0)
        |> Trans.Exit (fun i -> Fade 1.0 0.0)

    // It's a similar story for swipes -- we're wanting to swipe 400px left.
    let swipeTime = 300.0
    let Swipe =
        Anim.Simple Interpolation.Double Easing.CubicInOut swipeTime

    // We're only swiping out -- so we only specify an exit transition here
    let SwipeTransition =
        Trans.Create Swipe
        |> Trans.Exit (fun i -> Swipe 0.0 400.0)

    let AnimateFlow (pg: #Doc) =
        div [
                Attr.Style "position" "relative"
                // The best way to do animations is to have them as attributes.
                // The properties we're modifying in this case are opacity for fade,
                // and "left" for swipe.
                // The arguments are the property, the transition, a view of a value to
                // use within the animation (although we don't need that in this case),
                // and a function to change the property to a string.
                Attr.AnimatedStyle "opacity" FadeTransition (View.Const 1.0) string
                Attr.AnimatedStyle "left" SwipeTransition (View.Const 0.0) (fun x -> (string x) + "px")
        ] [
            pg
        ]

    // The initial "page" of the flowlet, which gets name and address detiails
    let personFlowlet =
        Flow.Define (fun cont ->
            let rvName = Var.Create ""
            let rvAddress = Var.Create ""

            form [cls "form-horizontal" ; Attr.Create "role" "form"] [
                // Name
                inputRow rvName "lblName" "Name"
                // Address
                inputRow rvAddress "lblAddr" "Address"
                divc "form-group" [
                    divc "col-sm-offset-2 col-sm-10" [
                        Doc.Button "Next" [cls "btn btn-default"] (fun () ->
                            let name = Var.Get rvName
                            let addr = Var.Get rvAddress
                            // We use the continuation function to return the
                            // data we retrieved from the form.
                            cont ({Name = name ; Address = addr})
                        )
                    ]
                ]
            ]
            |> AnimateFlow
            :> Doc
        )

    // The second page of the flowlet, which asks whether the user wants
    // to specify an e-mail address or phone number.
    let contactTypeFlowlet =
        Flow.Define (fun cont ->
            form [cls "form-horizontal" ; Attr.Create "role" "form"] [
                divc "form-group" [
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
            |> AnimateFlow
            :> Doc
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
                inputRow rvContact "contact" label
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
            |> AnimateFlow
            :> Doc
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
        |> AnimateFlow

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
            text "A WS.UI.Next flowlet implementation."
        ]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build(Samples.AnimatedContactFlow)
            .Id("AnimatedContactFlow")
            .FileName(__SOURCE_FILE__)
            .Keywords(["flowlet"])
            .Render(ExampleFlow)
            .RenderDescription(Description)
            .Create()

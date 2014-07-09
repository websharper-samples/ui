namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.UI.Next.Flow

[<JavaScript>]
module ContactFlow =

    type ContactType = EmailTy | PhoneTy

    type ContactDetails =
    | Email of string
    | PhoneNumber of string

    type Person = {
        Name : string
        Address : string
    }

    let el name = Doc.Element name []
    let elA = Doc.Element
    let cls = Attr.CreateClass
    let at = Attr.Create

    let inputRow rv id lblText =
        elA "div" [cls "form-group"] [
            elA "label"
                [at "for" id
                 cls "col-sm-2"
                 cls "control-label"
                ] [Doc.TextNode lblText]

            elA "div" [cls "col-sm-10"] [
                Doc.Input
                    [at "type" "text"
                     cls "form-control"
                     at "id" id
                     at "placeholder" lblText
                    ] rv
            ]
        ]

    let personFlowlet =
        Define (fun cont ->
            let rvName = Var.Create ""
            let rvAddress = Var.Create ""
            let nameView = View.FromVar rvName
            let addrView = View.FromVar rvAddress

            elA "form" [cls "form-horizontal" ; at "role" "form"] [
                // Name
                inputRow rvName "lblName" "Name"
                // Address
                inputRow rvAddress "lblAddr" "Address"
                elA "div" [cls "form-group"] [
                    elA "div" [cls "col-sm-offset-2" ; cls "col-sm-10"] [
                        Doc.Button "Next" [cls "btn" ; cls "btn-default"] (fun () ->
                            let name = Var.Get rvName
                            let addr = Var.Get rvAddress
                            cont ({Name = name ; Address = addr})
                        )
                    ]
                ]
            ]
        )

    let contactTypeFlowlet =
        Define (fun cont ->
            elA "form" [cls "form-horizontal" ; at "role" "form"] [
                elA "div" [cls "form-group"] [
                //    el "div" [
                        Doc.Button "E-Mail Address" [cls "btn" ; cls "btn-default"]
                            (fun () -> cont EmailTy)
                  //  ]

                    //el "div" [
                        Doc.Button "Phone Number" [cls "btn" ; cls "btn-default"]
                            (fun () -> cont PhoneTy)
                    //]
                ]
            ]
        )

    let contactFlowlet contactTy =
        let (label, constr) =
            match contactTy with
            | EmailTy -> ("E-Mail Address", Email)
            | PhoneTy -> ("Phone Number", PhoneNumber)

        Define ( fun cont ->
            let rvContact = Var.Create ""
            elA "form" [cls "form-horizontal" ; at "role" "form"] [
//                el "div" [ Doc.TextNode label ]
//                el "div" [ Doc.Input [] rvContact ]
                inputRow rvContact "contact" label
                elA "div" [cls "form-group"] [
                    elA "div" [cls "col-sm-offset-2" ; cls "col-sm-10"] [
                        Doc.Button "Finish" [cls "btn" ; cls "btn-default"]
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

    let exampleFlow =
        Flow.Do {
            let! person = personFlowlet
            let! ct = contactTypeFlowlet
            let! contactDetails = contactFlowlet ct
            return! Flow.Static (finalPage person contactDetails)
        } |> Embed

    let description =
        el "div" [
            Doc.TextNode "A WS.UI.Next flowlet implementation."
        ]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build()
            .Id("Flowlet")
            .FileName(__SOURCE_FILE__)
            .Keywords(["flowlet"])
            .Render(exampleFlow)
            .RenderDescription(description)
            .Create()
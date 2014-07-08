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

    let personFlowlet =
        Define (fun cont ->
            let rvName = Var.Create ""
            let rvAddress = Var.Create ""
            let nameView = View.FromVar rvName
            let addrView = View.FromVar rvAddress

            el "div" [
                el "div" [
                    Doc.TextNode "Name:"
                    Doc.Input [] rvName
                ]
                el "div" [
                    Doc.TextNode "Address:"
                    Doc.Input [] rvAddress
                ]

                el "div" [
                    Doc.Button "Next" [] (fun () ->
                        let name = Var.Get rvName
                        let addr = Var.Get rvAddress
                        cont ({Name = name ; Address = addr})
                    )
                ]
            ]
        )

    let contactTypeFlowlet =
        Define (fun cont ->
            el "div" [
                el "div" [
                    Doc.Button "E-Mail Address" [] (fun () -> cont EmailTy)
                ]

                el "div" [
                    Doc.Button "Phone Number" [] (fun () -> cont PhoneTy)
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
            el "div" [
                el "div" [ Doc.TextNode label ]
                el "div" [ Doc.Input [] rvContact ]
                el "div" [ Doc.Button "Finish" []
                    ( fun () ->
                        Var.Get rvContact
                        |> constr
                        |> cont )
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
        flow {
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
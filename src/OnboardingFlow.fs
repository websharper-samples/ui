namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html
open WebSharper.UI.Notation

/// App: a validated, animated multi-step onboarding flow.
[<JavaScript>]
module OnboardingFlow =

    type Plan =
        | Starter
        | Team
        | Enterprise

    type Profile = { Name : string ; Email : string }
    type Signup = { Profile : Profile ; Plan : Plan }

    let showPlan = function
        | Starter -> "Starter"
        | Team -> "Team"
        | Enterprise -> "Enterprise"

    let planPrice = function
        | Starter -> "Free"
        | Team -> "€19 / month"
        | Enterprise -> "Let's talk"

    let fadeTime = 300.0
    let fade =
        Anim.Simple Interpolation.Double Easing.CubicInOut fadeTime

    let fadeTransition =
        Trans.Create fade
        |> Trans.Enter (fun _ -> fade 0.0 1.0)
        |> Trans.Exit (fun _ -> fade 1.0 0.0)

    let stepPage step (body: Doc) =
        div [
            cls "flow-page"
            Attr.AnimatedStyle "opacity" fadeTransition (View.Const 1.0) string
        ] [
            div [cls "flow-head"] [
                div [cls "flow-progress"] (
                    [ 1 .. 4 ]
                    |> List.map (fun n ->
                        span [
                            cls "flow-dot"
                            cls (if n <= step then "done" else "")
                        ] []))
                span [cls "muted"] [ text (sprintf "Step %d of 4" step) ]
            ]
            body
        ]

    let field labelText (var: Var<string>) placeholder =
        div [cls "field"] [
            label [] [ text labelText ]
            Doc.InputType.Text [cls "form-control"; attr.placeholder placeholder] var
        ]

    let errorLine (message: string) =
        div [cls "bg-danger"] [ text message ]

    // ------------------------------------------------------------------ flow

    let profileStep () =
        Flow.Define (fun cont ->
            let name = Var.Create ""
            let email = Var.Create ""
            let error = Var.Create ""

            let next () =
                let n = name.Value.Trim()
                let e = email.Value.Trim()
                if n = "" then error.Value <- "Please enter your name."
                elif not (e.Contains "@") then error.Value <- "Please enter a valid email address."
                else cont.Next { Name = n ; Email = e }

            stepPage 1 (
                form [
                    cls "flow-form"
                    on.submit (fun _ (e: WebSharper.JavaScript.Dom.Event) ->
                        e.PreventDefault ()
                        next ())
                ] [
                    h2 [] [ text "Tell us about you" ]
                    p [cls "muted"] [ text "We will use this to personalise your workspace." ]
                    field "Full name" name "Ada Lovelace"
                    field "Email" email "ada@example.com"
                    error.View
                    |> View.Map (fun msg ->
                        if msg = "" then Doc.Empty else errorLine msg)
                    |> Doc.EmbedView
                    button [cls "btn"; cls "btn-primary"; attr.``type`` "submit"] [ text "Continue" ]
                ]))

    let planStep (_profile: Profile) =
        Flow.Define (fun cont ->
            let plan = Var.Create Team

            let card value =
                label [
                    cls "plan-card"
                    Attr.DynamicClassPred "selected" (View.Map ((=) value) plan.View)
                ] [
                    Doc.InputType.Radio [] value plan
                    div [] [
                        h3 [] [ text (showPlan value) ]
                        p [cls "muted"] [ text (planPrice value) ]
                    ]
                ]

            stepPage 2 (
                form [
                    cls "flow-form"
                    on.submit (fun _ (e: WebSharper.JavaScript.Dom.Event) ->
                        e.PreventDefault ()
                        cont.Next plan.Value)
                ] [
                    h2 [] [ text "Choose a plan" ]
                    p [cls "muted"] [ text "You can change this at any time." ]
                    div [cls "plan-grid"] [ card Starter ; card Team ; card Enterprise ]
                    button [cls "btn"; cls "btn-primary"; attr.``type`` "submit"] [ text "Continue" ]
                ]))

    let private docButtons docs = div [cls "button-row"] docs

    let reviewStep (signup: Signup) =
        Flow.Define (fun cont ->
            stepPage 3 (
                form [
                    cls "flow-form"
                    on.submit (fun _ (e: WebSharper.JavaScript.Dom.Event) ->
                        e.PreventDefault ()
                        cont.Next ())
                ] [
                    h2 [] [ text "Review" ]
                    p [cls "muted"] [ text "One last look before we create your workspace." ]
                    div [cls "review-grid"] [
                        div [] [
                            span [cls "stat-label"] [ text "Name" ]
                            strong [] [ text signup.Profile.Name ]
                        ]
                        div [] [
                            span [cls "stat-label"] [ text "Email" ]
                            strong [] [ text signup.Profile.Email ]
                        ]
                        div [] [
                            span [cls "stat-label"] [ text "Plan" ]
                            strong [] [ text (showPlan signup.Plan) ]
                        ]
                        div [] [
                            span [cls "stat-label"] [ text "Price" ]
                            strong [] [ text (planPrice signup.Plan) ]
                        ]
                    ]
                    docButtons [
                        Doc.Button "Back" [cls "btn"; cls "btn-ghost"; attr.``type`` "button"] cont.Back
                        button [cls "btn"; cls "btn-primary"; attr.``type`` "submit"] [ text "Create workspace" ]
                    ]
                ]))

    let donePage (restart: unit -> unit) (signup: Signup) =
        stepPage 4 (
            div [cls "flow-form"] [
                h2 [] [ text "You're all set!" ]
                p [cls "lead"] [
                    text ("Welcome, " + signup.Profile.Name + ". Your ")
                    text (showPlan signup.Plan)
                    text " workspace is ready."
                ]
                p [cls "muted"] [
                    text "Use the button below to restart the flow."
                ]
                Doc.Button "Start over" [cls "btn"; cls "btn-primary"] restart
            ])

    let Main _ =
        Doc.Concat [
            p [cls "sample-blurb"] [
                text "A four-step flow: validated profile details, plan selection, review \
                 and a restartable completion page."
            ]
            div [cls "card"] [
                div [cls "card-body"] [
                    flow {
                        let! profile = profileStep ()
                        let! plan = planStep profile
                        let signup = { Profile = profile ; Plan = plan }
                        do! reviewStep signup
                        return! Flow.EndRestartable (fun actions -> donePage actions.Restart signup)
                    }
                    |> Flow.Embed
                ]
            ]
        ]

    let Description _ =
        div [] [
            text "A validated, animated multi-step onboarding flow with restart."
        ]

    let Sample =
        Samples.Build(Samples.OnboardingFlow)
            .Id("Onboarding flow")
            .FileName(__SOURCE_FILE__)
            .Keywords(["app"; "flow"; "forms"])
            .Category(Samples.App)
            .Render(Main)
            .RenderDescription(Description)
            .Create()
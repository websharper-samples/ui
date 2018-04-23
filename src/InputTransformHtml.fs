namespace WebSharper.UI

open WebSharper
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Html

// An example similar to InputTransform, but using a html file and the Template type provider 
// to generate the view.
// See this live at http://intellifactory.github.io/websharper.ui.next/#InputTransformHtml.fs !

[<JavaScript>]
module InputTransformHtml =
    type ViewTemplate = Templating.Template<"InputTransformTemplate.html">
    let Main _ =

        // Create a reactive variable and view.
        // Reactive *variables* are data *sources*.
        let rvText = Var.Create ""

        // Now, we make views of the text, which we mutate using Map.
        let view = View.FromVar rvText

        let viewCaps =
            view |> View.Map (fun s -> s.ToUpper () )

        let viewReverse =
            view |> View.Map (fun s -> new string ((s.ToCharArray ()) |> Array.rev))

        let viewWordCount =
            view |> View.Map (fun s -> s.Split([| ' ' |]).Length)

        let viewWordCountStr =
            View.Map string viewWordCount

        let viewWordOddEven =
            View.Map (fun i -> if i % 2 = 0 then "Even" else "Odd") viewWordCount

        let views = [
            ("Entered Text", view)
            ("Capitalised", viewCaps)
            ("Reversed", viewReverse)
            ("Word Count", viewWordCountStr)
            ("Is the word count odd or even?", viewWordOddEven)
        ]

        ViewTemplate()
            .inputText(rvText)
            .tableBody(
                views |> List.map (fun (lbl, view) ->
                    ViewTemplate.tableRow().lbl(lbl).view(view).Doc() )
            )
            .Elt()

    let Description _ =
        div [] [
            Doc.TextNode "Similar to InputTransform, but using a html file and the Template type provider."
        ]

    // You can ignore the bits here -- it just links the example into the site.
    let Sample =
        Samples.Build(Samples.InputTransformHtml)
            .Id("InputTransformHtml")
            .FileName(__SOURCE_FILE__)
            .Keywords(["text"])
            .Render(Main)
            .RenderDescription(Description)
            .Create()

namespace WebSharper.UI.Next

open WebSharper

[<JavaScript>]
module Client =

    let Main =
        Site.Main [
            SimpleTextBox.Sample
            InputTransform.Sample
            InputTransformHtml.Sample
            TodoList.Sample
            PhoneExample.Sample
            EditablePersonList.Sample
            CheckBoxTest.Sample
            Calculator.Sample
            ContactFlow.Sample
            AnimatedContactFlow.Sample
            MessageBoard.Sample
            BobsleighSite.Sample
            RoutedBobsleighSite.Sample
            AnimatedBobsleighSite.Sample
            ObjectConstancy.Sample
            MouseInfo.Sample
            KeyboardInfo.Sample
      //      SortableBarChart.Sample
        ]
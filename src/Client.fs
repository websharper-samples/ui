namespace WebSharper.UI

open WebSharper

[<JavaScript>]
module Client =
    [<SPAEntryPoint>]
    let Main() =
        Site.Main [
            Dashboard.Sample
            KanbanBoard.Sample
            ExpenseTracker.Sample
            DataExplorer.Sample
            TodoApp.Sample
            CommunityBoard.Sample
            GameOfLife.Sample
            OnboardingFlow.Sample
            VarPlayground.Sample
            CollectionsSuite.Sample
            InputInspector.Sample
            ChartLab.Sample
            MiniSite.Sample
        ]
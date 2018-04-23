namespace WebSharper.UI

open WebSharper
open WebSharper.Sitelets
open WebSharper.UI
open WebSharper.UI.Html

[<AutoOpen>]
[<JavaScript>]
module SiteCommon =

    type Meta =
        {
            FileName : string
            Keywords : list<string>
            Title : string
        }

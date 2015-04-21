namespace WebSharper.UI.Next

open WebSharper
open WebSharper.UI.Next
open WebSharper.UI.Next.Html

[<AutoOpen>]
[<JavaScript>]
module SiteCommon =
    type PageTy = | Home | About | Samples

    type Meta =
        {
            FileName : string
            Keywords : list<string>
            Title : string
            Uri : string
        }

    type Sample =
        {
            mutable Body : Doc
            mutable Description : Doc
            Meta : Meta
            mutable Router : Router<Page>
            mutable RouteId : RouteId
            mutable SamplePage : Page
        }
    and Page =
        {
            mutable PageName : string
            mutable PageRouteId : RouteId
            //mutable PageRender : Doc
            mutable PageType : PageTy
            mutable PageSample : Sample option
            //mutable PageRenderVar : Var<PageTy>
        }

    let mkPage name routeId ty = //render ty rv =
        {
            PageName = name
            PageRouteId = routeId
           // PageRender = render
            PageType = ty
            PageSample = None
            //PageRenderVar = rv
        }
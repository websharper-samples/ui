# WebSharper.UI.Next [![Build status](https://ci.appveyor.com/api/projects/status/scmqf68re8otea8h)](https://ci.appveyor.com/project/Jand42/websharper-ui-next)

WebSharper.UI.Next is an experimental dataflow layer for expressing
time-varying values, integrated with DOM and useful for greatly
simplifying constructing UI components in the browser.

* [Examples](http://intellifactory.github.io/websharper.ui.next/)
* [API Overview](docs/API.md)
* [Dataflow API](api/Reactive.fsi)
* [DOM API](api/Doc.fsi)

If successful, the combinators will be released as part of
[WebSharper](http://websharper.com) 3.0, and become the recommended
way to construct UI in WebSharper.

## Documentation

These articles cover various design choices and aspects of the system:

* [Explicit sharing](docs/Sharing.md)

* [DOM monoids](docs/Monoids.md)

* [Dataflow design](docs/Dataflow.md)

* [Lack of event streams combinators](docs/EventStreams.md)

* [Comparison with FRP](docs/FRP.md)

* [Component design](docs/Components.md)

* [A case for Concurrent ML](docs/CML.md)

## Talks

* [Video: Tackle UI with Reactive DOM in F# and WebSharper](https://www.youtube.com/watch?v=wEkS09s3KBc) - in this Community for FSharp event, t0yv0 presents the basics of the library and the motivations for the dataflow design 

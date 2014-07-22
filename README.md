# WebSharper.UI.Next [![Build status](https://ci.appveyor.com/api/projects/status/scmqf68re8otea8h)](https://ci.appveyor.com/project/Jand42/websharper-ui-next)

WebSharper.UI.Next is a UI library featuring a dataflow layer for expressing
time-varying values. It integrates with DOM and makes it
simple to construct animated UI in the browser.

* [Examples](http://intellifactory.github.io/websharper.ui.next/)
* [API Reference](docs/API.md)

## Availability

We plan to make a public NuGet release shortly.

This library will also likely be released as part of
[WebSharper](http://websharper.com) 3.0, to become the recommended
way to construct UI in WebSharper.  We also have plans for releasing the library
as standalone JavaScript with TypeScript bindings.

## Documentation

These articles cover various design choices and aspects of the system:

* [Dataflow](docs/Dataflow.md)

* [Explicit sharing](docs/Sharing.md)

* [DOM monoids](docs/Monoids.md)

* [Lack of event streams combinators](docs/EventStreams.md)

* [Comparison with FRP](docs/FRP.md)

* [Component design](docs/Components.md)

* [A case for Concurrent ML](docs/CML.md)

## Talks

* [Video: Tackle UI with Reactive DOM in F# and WebSharper](https://www.youtube.com/watch?v=wEkS09s3KBc) - in this Community for FSharp event, t0yv0 presents the basics of the library and the motivations for the dataflow design 

## Acknowledgements

This design is a result of vibrant discussion and experimentation.  The list of people who have contributed
time, ideas and code includes:

* Simon Fowler
* Anton Tayanovskyy
* Andras Janko
* Loic Denuziere
* Adam Granicz
* Vesa Karvonen

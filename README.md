# WebSharper.UI samples

A gallery of **18 interactive samples** for
[WebSharper.UI](https://websharper.com/docs/ui) — the reactive,
composable user-interface library for F#. Every sample is compiled from F# to
JavaScript, and the gallery page itself is a WebSharper.UI single-page
application.

[![WebSharper.UI samples](docs/screenshot.png)](https://websharper-samples.github.io/ui/)

**[Try it live](https://websharper-samples.github.io/ui/)** ·
[WebSharper](https://websharper.com) ·
[Library source](https://github.com/dotnet-websharper/ui)

## What is in the gallery

| Sample | What it shows |
|---|---|
| [SimpleTextBox](https://websharper-samples.github.io/ui/#/samples/SimpleTextBox) | A label mirroring a text box |
| [InputTransform](https://websharper-samples.github.io/ui/#/samples/InputTransform) | Deriving several views from one reactive source |
| [InputTransformHtml](https://websharper-samples.github.io/ui/#/samples/InputTransformHtml) | The same sample built with an HTML template |
| [TodoList](https://websharper-samples.github.io/ui/#/samples/TodoList) | A reactive `ListModel` of to-do items |
| [PhoneExample](https://websharper-samples.github.io/ui/#/samples/PhoneExample) | Filtering and sorting a list |
| [EditablePersonList](https://websharper-samples.github.io/ui/#/samples/EditablePersonList) | Inputs bound to `Var`s in a record |
| [CheckBoxTest](https://websharper-samples.github.io/ui/#/samples/CheckBoxTest) | Check-box groups and radio buttons |
| [Calculator](https://websharper-samples.github.io/ui/#/samples/Calculator) | Model–view separation |
| [ContactFlow](https://websharper-samples.github.io/ui/#/samples/ContactFlow) | A multi-step form with `Flow` |
| [AnimatedContactFlow](https://websharper-samples.github.io/ui/#/samples/AnimatedContactFlow) | Flow transitions and animation |
| [MessageBoard](https://websharper-samples.github.io/ui/#/samples/MessageBoard) | A small app with auth and state |
| [BobsleighSite](https://websharper-samples.github.io/ui/#/samples/BobsleighSite) | A mini-site with local state |
| [RoutedBobsleighSite](https://websharper-samples.github.io/ui/#/samples/RoutedBobsleighSite) | The same mini-site, routed by URL |
| [AnimatedBobsleighSite](https://websharper-samples.github.io/ui/#/samples/AnimatedBobsleighSite) | The mini-site with page transitions |
| [ObjectConstancy](https://websharper-samples.github.io/ui/#/samples/ObjectConstancy) | Animated SVG bar charts from CSV data |
| [MouseInfo](https://websharper-samples.github.io/ui/#/samples/MouseInfo) | Live mouse state as `View`s |
| [KeyboardInfo](https://websharper-samples.github.io/ui/#/samples/KeyboardInfo) | Live keyboard state as `View`s |
| [SortableBarChart](https://websharper-samples.github.io/ui/#/samples/SortableBarChart) | Data-driven animated SVG |

## How it works

- `src/Sample*.fs` — each sample is a small F# module that builds a `Doc`
  (and its description) and registers itself with the sample framework.
- `src/Samples.fs` — the sample catalogue, sidebar and content layout, and the
  `PageTy` router type.
- `src/Site.fs` — the shell: home page, about page, navigation and routing.
- `src/wwwroot/index.html` — the **whole-page template**. Its two typed holes,
  `ws-hole="Nav"` and `ws-hole="Main"`, are filled by `Site.Main`:

  ```fsharp
  ShellTemplate()
      .Nav(NavBar var)
      .Main(main)
      .Bind()
  ```

- Routing is hash-based (`#/samples/TodoList`), so the static build works on
  GitHub Pages without any server-side rewrites.

## Project structure

```
ui/
  src/
    *.fs                   # the samples and the site shell
    InputTransformTemplate.html
    wwwroot/
      index.html           # whole-page template for the gallery
      style.css            # the self-contained design system
      files/               # images used by the About page
      ObjectConstancy.csv  # data for the ObjectConstancy sample
      AlphaFrequency.csv   # data for the SortableBarChart sample
    wsconfig.json          # WebSharper SPA settings
    package.json           # esbuild
    esbuild.config.mjs     # bundles the Release output into dist/
  docs/screenshot.png
  .github/workflows/deploy.yml
  README.md
```

## Running locally

The site is fully static: build it in Release, then serve `dist/`.

```bash
dotnet build src/WebSharper.UI.Samples.fsproj -c Release
python3 -m http.server 5290 --bind 127.0.0.1 --directory dist
```

Then open <http://127.0.0.1:5290/>.

## Building

```bash
dotnet build src/WebSharper.UI.Samples.fsproj -c Release
```

WebSharper compiles the F# sources to `src/build/`, and
[esbuild](https://esbuild.github.io/) bundles the entry point to
`dist/Scripts/WebSharper.UI.Samples.min.js` while copying the static assets to
`dist/`.

## Deployment

Every push to `master` (or `main`) triggers
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds in
Release and publishes `dist/` to the `gh-pages` branch with GitHub Pages.

---

Built with [WebSharper](https://websharper.com). WebSharper is open source;
see the [library repository](https://github.com/dotnet-websharper/ui).
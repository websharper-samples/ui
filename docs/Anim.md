# Animation
> [Documentation](../README.md) ▸ [API Reference](API.md) ▸ [Animation](Animation.md) ▸ **Anim**

`Anim<'T>` type describes time-dependent values for animation, and `Anim` combines them
into animation collections that can be played together.

```fsharp
type Anim<'T> =
    {
        Compute : NormalizedTime -> 'T
        Duration : Time
    }

type Anim =
    static member Simple : Interpolation<'T> -> Easing -> Time -> 'T -> 'T -> Anim<'T>
    static member Map : ('A -> 'B) -> Anim<'A> -> Anim<'B>
    static member Play : Anim -> Async<unit>
    static member Pack : Anim<unit> -> Anim
    static member WhenDone : (unit -> unit) -> Anim -> Anim
    static member Append : Anim -> Anim -> Anim
    static member Concat : seq<Anim> -> Anim
    static member Empty : Anim
```

## Typed Animations

<a name="Anim" href="Anim">#</a> **Anim** `type Anim<'T>`

Represents an animation of a given value, defined by duration and a time-function `Compute`
and an explicit `Duration`.

<a name="Map" href="#Map">#</a> Anim.**Map** `('A -> 'B) -> Anim<'A> -> Anim<'B>`

Lifts a function to change the type of an animation.

<a name="Simple" href="#Simple">#</a> Anim.**Simple**

```fsharp
Anim.Simple :
  Interpolation<'T> ->
  Easing ->
  duration: Time ->
  startValue: 'T ->
  endValue: 'T ->
  Anim<'T>
```

Uses an interpolation, easing, duration, start and end values to construct an animation.





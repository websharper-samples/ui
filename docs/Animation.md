# Animation
> [Documentation](../README.md) ▸ [API Reference](API.md) ▸ **Animation**

## Time

<a name="Time" href="#Time">#</a> Time

Time is a measure of a time interval in milliseconds.

```fsharp
type Time = double
```

<a name="NormalizedTime" href="#NormalizedTime">#</a> NormalizedTime

Normalized time typically ranges from 0.0 to 1.0, though can
temporarily take values outside of this range.  It is used heavily
in animation:

```fsharp
type NormalizedTime = double
```

## Easing

```fsharp
type Easing =
    {
        TransformTime : NormalizedTime -> NormalizedTime
    }
    static member CubicInOut : Easing
    static member Custom : (NormalizedTime -> NormalizedTime) -> Easing
```

<a name="Easing" href="#Easing">#</a> **Easing** `type Easing`

Represents an easing function, a transform on NormalizedTime.

<a name="TransformTime" href="#TransformTime">#</a> easing.**TransformTime** `NormalizedTime -> NormalizedTime`

Applies the time transformation.

<a name="Easing.CubicInOut" href="#Easing.CubicInOut">#</a> Easing.**CubicInOut** `Easing`

The most commonly used easing, corresponds to:

```fsharp
let f t = 3. * (t ** 2.) - 2. * t ** 3.
```

<a name="Easing.Create" href="#Easing.Create">#</a> Easing.**Create** `(NormalizedTime -> NormalizedTime) -> Easing`

Creates a custom easing.

## Interpolation

Interpolation allows computing intermediate values for a given type.
This is essential for automatic smooth in-between animation.

```fsharp
type Interpolation<'T> =
    abstract Interpolate : NormalizedTime -> 'T -> 'T -> 'T

type Interpolation =
    static member Double : Interpolation<double>
```

<a name="Interpolation" href="#Interpolation">#</a> **Interpolation** `type Interpolation<'T>`

Represents a way to interpolate between two values of a given type.

<a name="Interpolate" href="#Interpolate">#</a> interpolation.**Interpolate** `NormalizedTime -> 'T -> 'T -> 'T`

Computes an in-between value based on normalized time, starting and ending values.

<a name="Interpolation.Double" href="#Interpolation.Double">#</a> Interpolation.**Double** `Interpolation<double>`

Linear interpolation on doubles.

## Animation

`Anim` types allow to declaretively describe time-dependent values, and combine them
into animation collectoins that can be played together.

```fsharp
type Anim<'T> =
    {
        Compute : NormalizedTime -> 'T
        Duration : Time
    }

type Anim =
    static member Simple : Interpolation<'T> -> Easing -> dur: Time -> startValue: 'T -> endValue: 'T -> Anim<'T>
    static member Map : ('A -> 'B) -> Anim<'A> -> Anim<'B>
    static member Play : Anim -> Async<unit>
    static member Pack : Anim<unit> -> Anim
    static member WhenDone : (unit -> unit) -> Anim -> Anim
    static member Append : Anim -> Anim -> Anim
    static member Concat : seq<Anim> -> Anim
    static member Empty : Anim
```

<a name="AnimT" href="AnimT">#</a> **Anim** `type Anim<'T>`

Represents an animation of a given value, defined by duration and a time-function `Compute`
and an explicit `Duration`:

```fsharp
type Anim<'T> =
    {
        Compute : NormalizedTime -> 'T
        Duration : Time
    }
```







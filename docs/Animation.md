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

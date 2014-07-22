# Animation
> [Documentation](../README.md) ▸ [API Reference](API.md) ▸ **Animation**


## Easing <a id="Easing"></a>


```fsharp
type Easing =
    {
        TransformTime : NormalizedTime -> NormalizedTime
    }

    /// Most commonly used easing.
    /// let f t = 3. * (t ** 2.) - 2. * t ** 3.
    static member CubicInOut : Easing

    /// Creates a custom easing.
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

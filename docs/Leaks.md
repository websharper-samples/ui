## Leaks
> [Documentation](../README.md) ▸ **Leaks**

The [Dataflow](Dataflow.md) layer avoids most common cases of space leaks,
as well as time leaks, by using a clever coordination protocol.

The protocol is GC-friendly, which is great news for the programmer.
You can generally create consumers without having to "unsubscribe" or otherwise
imperatively mark their irrelevance.  So, for instance:

    let y = View.Map f x
    
This creates `y` as a consumer (dependent) of `x`.  If your program drops `y`,
it gets collected without any effect on `x`.

The protocol makes one important assumption:

**VARIABLES KEEP CHANGING**


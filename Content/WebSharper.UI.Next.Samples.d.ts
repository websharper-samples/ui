/// NOTE: temporary solution for #203:
/// https://bitbucket.org/IntelliFactory/websharper/issue/203/dom-identification-in-websharper
declare module IntelliFactory.WebSharper {

    export module DomUtil {
        interface _Attr extends Attr { }
        interface _Element extends Element { }
        interface _Node extends Node { }
        interface _Text extends Text { }
    }

    export module Dom {
        import U = DomUtil;
        interface Attr extends U._Attr { }
        interface Element extends U._Element { }
        interface Node extends U._Node { }
        interface Text extends U._Text { }
    }
}

declare module IntelliFactory {
    module WebSharper {
        module Html {
            module Client {
                module Activator {
                    var Activate : {
                        (): void;
                    };
                }
                module HtmlContentExtensions {
                    var IControlBody_SingleNode_Static : {
                        (node: __ABBREV.__Dom.Node): __ABBREV.__Client.IControlBody;
                    };
                }
                interface IControlBody {
                    ReplaceInDom(x0: __ABBREV.__Dom.Node): void;
                }
                interface IControl {
                    get_Body(): __ABBREV.__Client.IControlBody;
                    get_Id(): string;
                }
            }
        }
        module Arrays {
            var reverse : {
                (array: __ABBREV.__WebSharper.ArrayProxy, offset: number, length: number): void;
            };
            var checkRange : {
                <_M1>(arr: _M1[], start: number, size: number): void;
            };
            var checkLength : {
                <_M1, _M2>(arr1: _M1[], arr2: _M2[]): void;
            };
            var average : {
                <_M1>(arr: _M1[]): _M1;
            };
            var averageBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, arr: _M1[]): _M2;
            };
            var blit : {
                <_M1>(arr1: _M1[], start1: number, arr2: _M1[], start2: number, length: number): void;
            };
            var choose : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, arr: _M1[]): _M2[];
            };
            var collect : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2[];
                }, x: _M1[]): _M2[];
            };
            var concat : {
                <_M1>(xs: __ABBREV.__WebSharper.seq<_M1[]>): _M1[];
            };
            var create : {
                <_M1>(size: number, value: _M1): _M1[];
            };
            var exists2 : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): boolean;
                    };
                }, arr1: _M1[], arr2: _M2[]): boolean;
            };
            var fill : {
                <_M1>(arr: _M1[], start: number, length: number, value: _M1): void;
            };
            var filter : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, arr: _M1[]): _M1[];
            };
            var Find : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, arr: _M1[]): _M1;
            };
            var FindIndex : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, arr: _M1[]): number;
            };
            var fold : {
                <_M1, _M2>(f: {
                    (x: _M2): {
                        (x: _M1): _M2;
                    };
                }, zero: _M2, arr: _M1[]): _M2;
            };
            var fold2 : {
                <_M1, _M2, _M3>(f: {
                    (x: _M3): {
                        (x: _M1): {
                            (x: _M2): _M3;
                        };
                    };
                }, zero: _M3, arr1: _M1[], arr2: _M2[]): _M3;
            };
            var foldBack : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): _M2;
                    };
                }, arr: _M1[], zero: _M2): _M2;
            };
            var foldBack2 : {
                <_M1, _M2, _M3>(f: {
                    (x: _M1): {
                        (x: _M2): {
                            (x: _M3): _M3;
                        };
                    };
                }, arr1: _M1[], arr2: _M2[], zero: _M3): _M3;
            };
            var forall2 : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): boolean;
                    };
                }, arr1: _M1[], arr2: _M2[]): boolean;
            };
            var init : {
                <_M1>(size: number, f: {
                    (x: number): _M1;
                }): _M1[];
            };
            var iter : {
                <_M1>(f: {
                    (x: _M1): void;
                }, arr: _M1[]): void;
            };
            var iter2 : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): void;
                    };
                }, arr1: _M1[], arr2: _M2[]): void;
            };
            var iteri : {
                <_M1>(f: {
                    (x: number): {
                        (x: _M1): void;
                    };
                }, arr: _M1[]): void;
            };
            var iteri2 : {
                <_M1, _M2>(f: {
                    (x: number): {
                        (x: _M1): {
                            (x: _M2): void;
                        };
                    };
                }, arr1: _M1[], arr2: _M2[]): void;
            };
            var map : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, arr: _M1[]): _M2[];
            };
            var map2 : {
                <_M1, _M2, _M3>(f: {
                    (x: _M1): {
                        (x: _M2): _M3;
                    };
                }, arr1: _M1[], arr2: _M2[]): _M3[];
            };
            var mapi : {
                <_M1, _M2>(f: {
                    (x: number): {
                        (x: _M1): _M2;
                    };
                }, arr: _M1[]): _M2[];
            };
            var mapi2 : {
                <_M1, _M2, _M3>(f: {
                    (x: number): {
                        (x: _M1): {
                            (x: _M2): _M3;
                        };
                    };
                }, arr1: _M1[], arr2: _M2[]): _M3[];
            };
            var max : {
                <_M1>(x: _M1[]): _M1;
            };
            var maxBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, arr: _M1[]): _M1;
            };
            var min : {
                <_M1>(x: _M1[]): _M1;
            };
            var minBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, arr: _M1[]): _M1;
            };
            var ofSeq : {
                <_M1>(xs: __ABBREV.__WebSharper.seq<_M1>): _M1[];
            };
            var partition : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, arr: _M1[]): any;
            };
            var permute : {
                <_M1>(f: {
                    (x: number): number;
                }, arr: _M1[]): _M1[];
            };
            var Pick : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, arr: _M1[]): _M2;
            };
            var nonEmpty : {
                <_M1>(arr: _M1[]): void;
            };
            var reduce : {
                <_M1>(f: {
                    (x: _M1): {
                        (x: _M1): _M1;
                    };
                }, arr: _M1[]): _M1;
            };
            var reduceBack : {
                <_M1>(f: {
                    (x: _M1): {
                        (x: _M1): _M1;
                    };
                }, arr: _M1[]): _M1;
            };
            var scan : {
                <_M1, _M2>(f: {
                    (x: _M2): {
                        (x: _M1): _M2;
                    };
                }, zero: _M2, arr: _M1[]): _M2[];
            };
            var scanBack : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): _M2;
                    };
                }, arr: _M1[], zero: _M2): _M2[];
            };
            var sort : {
                <_M1>(arr: _M1[]): _M1[];
            };
            var sortBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, arr: _M1[]): _M1[];
            };
            var sortInPlace : {
                <_M1>(arr: _M1[]): void;
            };
            var sortInPlaceBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, arr: _M1[]): void;
            };
            var sortInPlaceWith : {
                <_M1>(comparer: {
                    (x: _M1): {
                        (x: _M1): number;
                    };
                }, arr: _M1[]): void;
            };
            var sortWith : {
                <_M1>(comparer: {
                    (x: _M1): {
                        (x: _M1): number;
                    };
                }, arr: _M1[]): _M1[];
            };
            var sub : {
                <_M1>(arr: _M1[], start: number, length: number): _M1[];
            };
            var tryFind : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, arr: _M1[]): __ABBREV.__WebSharper.OptionProxy<_M1>;
            };
            var tryFindIndex : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, arr: _M1[]): __ABBREV.__WebSharper.OptionProxy<number>;
            };
            var tryPick : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, arr: _M1[]): __ABBREV.__WebSharper.OptionProxy<_M2>;
            };
            var unzip : {
                <_M1, _M2>(arr: any[]): any;
            };
            var unzip3 : {
                <_M1, _M2, _M3>(arr: any[]): any;
            };
            var zip : {
                <_M1, _M2>(arr1: _M1[], arr2: _M2[]): any[];
            };
            var zip3 : {
                <_M1, _M2, _M3>(arr1: _M1[], arr2: _M2[], arr3: _M3[]): any[];
            };
        }
        module AsyncProxy {
            var get_DefaultCancellationToken : {
                (): __ABBREV.__WebSharper.CancellationTokenProxy;
            };
            var get_CancellationToken : {
                (): any;
            };
        }
        module CancellationTokenSource {
            var CreateLinkedTokenSource1 : {
                (tokens: __ABBREV.__WebSharper.CancellationTokenProxy[]): void;
            };
            var CreateLinkedTokenSource : {
                (t1: __ABBREV.__WebSharper.CancellationTokenProxy, t2: __ABBREV.__WebSharper.CancellationTokenProxy): void;
            };
        }
        module Char {
            var GetNumericValue : {
                (c: number): number;
            };
            var IsControl : {
                (c: number): boolean;
            };
            var IsDigit : {
                (c: number): boolean;
            };
            var IsLetter : {
                (c: number): boolean;
            };
            var IsLetterOrDigit : {
                (c: number): boolean;
            };
            var IsLower : {
                (c: number): boolean;
            };
            var IsUpper : {
                (c: number): boolean;
            };
            var Parse : {
                (s: string): number;
            };
        }
        module List {
            module T {
                var Construct : {
                    (head: any, tail: __ABBREV.__List.T<any>): __ABBREV.__List.T<any>;
                };
                var get_Nil : {
                    (): __ABBREV.__List.T<any>;
                };
            }
            interface T<_T1> {
                GetEnumerator(): __ABBREV.__WebSharper.IEnumeratorProxy<_T1>;
                get_Length(): number;
                get_Item(x: number): _T1;
            }
            var append : {
                <_M1>(x: __ABBREV.__List.T<_M1>, y: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M1>;
            };
            var choose : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M2>;
            };
            var collect : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__List.T<_M2>;
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M2>;
            };
            var concat : {
                <_M1>(s: __ABBREV.__WebSharper.seq<__ABBREV.__List.T<_M1>>): __ABBREV.__List.T<_M1>;
            };
            var exists2 : {
                <_M1, _M2>(p: {
                    (x: _M1): {
                        (x: _M2): boolean;
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): boolean;
            };
            var filter : {
                <_M1>(p: {
                    (x: _M1): boolean;
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M1>;
            };
            var fold2 : {
                <_M1, _M2, _M3>(f: {
                    (x: _M3): {
                        (x: _M1): {
                            (x: _M2): _M3;
                        };
                    };
                }, s: _M3, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): _M3;
            };
            var foldBack : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): _M2;
                    };
                }, l: __ABBREV.__List.T<_M1>, s: _M2): _M2;
            };
            var foldBack2 : {
                <_M1, _M2, _M3>(f: {
                    (x: _M1): {
                        (x: _M2): {
                            (x: _M3): _M3;
                        };
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>, s: _M3): _M3;
            };
            var forall2 : {
                <_M1, _M2>(p: {
                    (x: _M1): {
                        (x: _M2): boolean;
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): boolean;
            };
            var head : {
                <_M1>(l: __ABBREV.__List.T<_M1>): _M1;
            };
            var init : {
                <_M1>(s: number, f: {
                    (x: number): _M1;
                }): __ABBREV.__List.T<_M1>;
            };
            var iter2 : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): void;
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): void;
            };
            var iteri2 : {
                <_M1, _M2>(f: {
                    (x: number): {
                        (x: _M1): {
                            (x: _M2): void;
                        };
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): void;
            };
            var map : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M2>;
            };
            var map2 : {
                <_M1, _M2, _M3>(f: {
                    (x: _M1): {
                        (x: _M2): _M3;
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): __ABBREV.__List.T<_M3>;
            };
            var map3 : {
                <_M1, _M2, _M3, _M4>(f: {
                    (x: _M1): {
                        (x: _M2): {
                            (x: _M3): _M4;
                        };
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>, l3: __ABBREV.__List.T<_M3>): __ABBREV.__List.T<_M4>;
            };
            var mapi : {
                <_M1, _M2>(f: {
                    (x: number): {
                        (x: _M1): _M2;
                    };
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M2>;
            };
            var mapi2 : {
                <_M1, _M2, _M3>(f: {
                    (x: number): {
                        (x: _M1): {
                            (x: _M2): _M3;
                        };
                    };
                }, l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): __ABBREV.__List.T<_M3>;
            };
            var max : {
                <_M1>(l: __ABBREV.__List.T<_M1>): _M1;
            };
            var maxBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, l: __ABBREV.__List.T<_M1>): _M1;
            };
            var min : {
                <_M1>(l: __ABBREV.__List.T<_M1>): _M1;
            };
            var minBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, l: __ABBREV.__List.T<_M1>): _M1;
            };
            var ofArray : {
                <_M1>(arr: _M1[]): __ABBREV.__List.T<_M1>;
            };
            var ofSeq : {
                <_M1, _M2>(s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__List.T<_M2>;
            };
            var partition : {
                <_M1>(p: {
                    (x: _M1): boolean;
                }, l: __ABBREV.__List.T<_M1>): any;
            };
            var permute : {
                <_M1>(f: {
                    (x: number): number;
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M1>;
            };
            var reduceBack : {
                <_M1>(f: {
                    (x: _M1): {
                        (x: _M1): _M1;
                    };
                }, l: __ABBREV.__List.T<_M1>): _M1;
            };
            var replicate : {
                <_M1>(size: number, value: _M1): __ABBREV.__List.T<_M1>;
            };
            var rev : {
                <_M1>(l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M1>;
            };
            var scan : {
                <_M1, _M2>(f: {
                    (x: _M2): {
                        (x: _M1): _M2;
                    };
                }, s: _M2, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M2>;
            };
            var scanBack : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): _M2;
                    };
                }, l: __ABBREV.__List.T<_M1>, s: _M2): __ABBREV.__List.T<_M2>;
            };
            var sort : {
                <_M1>(l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M1>;
            };
            var sortBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M1>;
            };
            var sortWith : {
                <_M1>(f: {
                    (x: _M1): {
                        (x: _M1): number;
                    };
                }, l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M1>;
            };
            var tail : {
                <_M1>(l: __ABBREV.__List.T<_M1>): __ABBREV.__List.T<_M1>;
            };
            var unzip : {
                <_M1, _M2>(l: __ABBREV.__List.T<any>): any;
            };
            var unzip3 : {
                <_M1, _M2, _M3>(l: __ABBREV.__List.T<any>): any;
            };
            var zip : {
                <_M1, _M2>(l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>): __ABBREV.__List.T<any>;
            };
            var zip3 : {
                <_M1, _M2, _M3>(l1: __ABBREV.__List.T<_M1>, l2: __ABBREV.__List.T<_M2>, l3: __ABBREV.__List.T<_M3>): __ABBREV.__List.T<any>;
            };
        }
        module Unchecked {
            var compareArrays : {
                (a: __ABBREV.__WebSharper.ObjectProxy[], b: __ABBREV.__WebSharper.ObjectProxy[]): number;
            };
            var compareDates : {
                (a: __ABBREV.__WebSharper.ObjectProxy, b: __ABBREV.__WebSharper.ObjectProxy): number;
            };
            var Compare : {
                <_M1>(a: _M1, b: _M1): number;
            };
            var arrayEquals : {
                (a: __ABBREV.__WebSharper.ObjectProxy[], b: __ABBREV.__WebSharper.ObjectProxy[]): boolean;
            };
            var dateEquals : {
                <_M1, _M2>(a: _M1, b: _M2): boolean;
            };
            var Equals : {
                <_M1>(a: _M1, b: _M1): boolean;
            };
            var hashMix : {
                (x: number, y: number): number;
            };
            var hashArray : {
                (o: __ABBREV.__WebSharper.ObjectProxy[]): number;
            };
            var hashString : {
                (s: string): number;
            };
            var hashObject : {
                (o: __ABBREV.__WebSharper.ObjectProxy): number;
            };
            var Hash : {
                <_M1>(o: _M1): number;
            };
        }
        module Strings {
            interface StringProxy {
            }
            var Compare : {
                (x: string, y: string): number;
            };
            var CopyTo : {
                (s: string, o: number, d: number[], off: number, ct: number): void;
            };
            var PadLeft : {
                (s: string, n: number): string;
            };
            var PadRight : {
                (s: string, n: number): string;
            };
            var Replace : {
                (subject: string, search: string, replace: string): string;
            };
            var ReplaceChar : {
                (s: string, oldC: number, newC: number): string;
            };
            var ToCharArray : {
                (s: string): number[];
            };
            var ToCharArrayRange : {
                (s: string, startIndex: number, length: number): number[];
            };
            var Split : {
                (s: string, pat: __ABBREV.__WebSharper.ObjectProxy, opts: any): string[];
            };
            var SplitChars : {
                (s: string, sep: number[], opts: any): string[];
            };
            var SplitStrings : {
                (s: string, sep: string[], opts: any): string[];
            };
            var protect : {
                (s: string): string;
            };
            var collect : {
                (f: {
                    (x: number): string;
                }, s: string): string;
            };
            var concat : {
                (separator: string, strings: __ABBREV.__WebSharper.seq<string>): string;
            };
            var exists : {
                (f: {
                    (x: number): boolean;
                }, s: string): boolean;
            };
            var forall : {
                (f: {
                    (x: number): boolean;
                }, s: string): boolean;
            };
            var init : {
                (count: number, f: {
                    (x: number): string;
                }): string;
            };
            var iter : {
                (f: {
                    (x: number): void;
                }, s: string): void;
            };
            var iteri : {
                (f: {
                    (x: number): {
                        (x: number): void;
                    };
                }, s: string): void;
            };
            var length : {
                (s: string): number;
            };
            var map : {
                (f: {
                    (x: number): number;
                }, s: string): string;
            };
            var mapi : {
                (f: {
                    (x: number): {
                        (x: number): number;
                    };
                }, s: string): string;
            };
            var replicate : {
                (count: number, s: string): string;
            };
        }
        module Stack {
            interface StackProxy<_T1> {
            }
        }
        module Seq {
            var insufficient : {
                <_M1>(): _M1;
            };
            var append : {
                <_M1>(s1: __ABBREV.__WebSharper.seq<_M1>, s2: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var average : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var averageBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): _M2;
            };
            var cache : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var choose : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M2>;
            };
            var collect : {
                <_M1, _M2, _M3>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M3>;
            };
            var compareWith : {
                <_M1>(f: {
                    (x: _M1): {
                        (x: _M1): number;
                    };
                }, s1: __ABBREV.__WebSharper.seq<_M1>, s2: __ABBREV.__WebSharper.seq<_M1>): number;
            };
            var concat : {
                <_M1, _M2>(ss: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M2>;
            };
            var countBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<any>;
            };
            var delay : {
                <_M1>(f: {
                    (): __ABBREV.__WebSharper.seq<_M1>;
                }): __ABBREV.__WebSharper.seq<_M1>;
            };
            var distinct : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var distinctBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var empty : {
                <_M1>(): __ABBREV.__WebSharper.seq<_M1>;
            };
            var exists : {
                <_M1, _M2>(p: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M2>): boolean;
            };
            var exists2 : {
                <_M1, _M2, _M3, _M4>(p: {
                    (x: _M1): {
                        (x: _M2): boolean;
                    };
                }, s1: __ABBREV.__WebSharper.seq<_M3>, s2: __ABBREV.__WebSharper.seq<_M4>): boolean;
            };
            var filter : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var find : {
                <_M1>(p: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var findIndex : {
                <_M1>(p: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M1>): number;
            };
            var fold : {
                <_M1, _M2>(f: {
                    (x: _M2): {
                        (x: _M1): _M2;
                    };
                }, x: _M2, s: __ABBREV.__WebSharper.seq<_M1>): _M2;
            };
            var forall : {
                <_M1>(p: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M1>): boolean;
            };
            var forall2 : {
                <_M1, _M2>(p: {
                    (x: _M1): {
                        (x: _M2): boolean;
                    };
                }, s1: __ABBREV.__WebSharper.seq<_M1>, s2: __ABBREV.__WebSharper.seq<_M2>): boolean;
            };
            var groupBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<any>;
            };
            var head : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var init : {
                <_M1>(n: number, f: {
                    (x: number): _M1;
                }): __ABBREV.__WebSharper.seq<_M1>;
            };
            var initInfinite : {
                <_M1>(f: {
                    (x: number): _M1;
                }): __ABBREV.__WebSharper.seq<_M1>;
            };
            var isEmpty : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): boolean;
            };
            var iter : {
                <_M1>(p: {
                    (x: _M1): void;
                }, s: __ABBREV.__WebSharper.seq<_M1>): void;
            };
            var iter2 : {
                <_M1, _M2, _M3, _M4>(p: {
                    (x: _M1): {
                        (x: _M2): void;
                    };
                }, s1: __ABBREV.__WebSharper.seq<_M3>, s2: __ABBREV.__WebSharper.seq<_M4>): void;
            };
            var iteri : {
                <_M1, _M2>(p: {
                    (x: number): {
                        (x: _M1): void;
                    };
                }, s: __ABBREV.__WebSharper.seq<_M2>): void;
            };
            var length : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): number;
            };
            var map : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M2>;
            };
            var mapi : {
                <_M1, _M2>(f: {
                    (x: number): {
                        (x: _M1): _M2;
                    };
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M2>;
            };
            var mapi2 : {
                <_M1, _M2, _M3>(f: {
                    (x: _M1): {
                        (x: _M2): _M3;
                    };
                }, s1: __ABBREV.__WebSharper.seq<_M1>, s2: __ABBREV.__WebSharper.seq<_M2>): __ABBREV.__WebSharper.seq<_M3>;
            };
            var maxBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var minBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var max : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var min : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var nth : {
                <_M1, _M2>(index: number, s: __ABBREV.__WebSharper.seq<_M1>): _M2;
            };
            var pairwise : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<any>;
            };
            var pick : {
                <_M1, _M2>(p: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, s: __ABBREV.__WebSharper.seq<_M1>): _M2;
            };
            var readOnly : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var reduce : {
                <_M1>(f: {
                    (x: _M1): {
                        (x: _M1): _M1;
                    };
                }, source: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var scan : {
                <_M1, _M2>(f: {
                    (x: _M2): {
                        (x: _M1): _M2;
                    };
                }, x: _M2, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M2>;
            };
            var skip : {
                <_M1>(n: number, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var skipWhile : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var sort : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var sortBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var sum : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): _M1;
            };
            var sumBy : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, s: __ABBREV.__WebSharper.seq<_M1>): _M2;
            };
            var take : {
                <_M1>(n: number, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var takeWhile : {
                <_M1>(f: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var toArray : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): _M1[];
            };
            var toList : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__List.T<_M1>;
            };
            var truncate : {
                <_M1>(n: number, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
            var tryFind : {
                <_M1, _M2>(ok: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M2>): __ABBREV.__WebSharper.OptionProxy<_M1>;
            };
            var tryFindIndex : {
                <_M1, _M2>(ok: {
                    (x: _M1): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M2>): __ABBREV.__WebSharper.OptionProxy<number>;
            };
            var tryPick : {
                <_M1, _M2, _M3>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, s: __ABBREV.__WebSharper.seq<_M3>): __ABBREV.__WebSharper.OptionProxy<_M2>;
            };
            var unfold : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<any>;
                }, s: _M1): __ABBREV.__WebSharper.seq<_M2>;
            };
            var windowed : {
                <_M1>(windowSize: number, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1[]>;
            };
            var zip : {
                <_M1, _M2>(s1: __ABBREV.__WebSharper.seq<_M1>, s2: __ABBREV.__WebSharper.seq<_M2>): __ABBREV.__WebSharper.seq<any>;
            };
            var zip3 : {
                <_M1, _M2, _M3>(s1: __ABBREV.__WebSharper.seq<_M1>, s2: __ABBREV.__WebSharper.seq<_M2>, s3: __ABBREV.__WebSharper.seq<_M3>): __ABBREV.__WebSharper.seq<any>;
            };
            var enumFinally : {
                <_M1>(s: __ABBREV.__WebSharper.seq<_M1>, f: {
                    (): void;
                }): __ABBREV.__WebSharper.seq<_M1>;
            };
            var enumUsing : {
                <_M1, _M2, _M3>(x: _M1, f: {
                    (x: _M1): _M2;
                }): __ABBREV.__WebSharper.seq<_M3>;
            };
            var enumWhile : {
                <_M1>(f: {
                    (): boolean;
                }, s: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__WebSharper.seq<_M1>;
            };
        }
        module Control {
            var createEvent : {
                <_M1, _M2>(add: {
                    (x: _M2): void;
                }, remove: {
                    (x: _M2): void;
                }, create: {
                    (x: {
                        (x: __ABBREV.__WebSharper.ObjectProxy): {
                            (x: _M1): void;
                        };
                    }): _M2;
                }): any;
            };
        }
        module Queue {
            interface QueueProxy<_T1> {
            }
        }
        module Option {
            var bind : {
                <_M1, _M2>(f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }, x: __ABBREV.__WebSharper.OptionProxy<_M1>): __ABBREV.__WebSharper.OptionProxy<_M2>;
            };
            var exists : {
                <_M1>(p: {
                    (x: _M1): boolean;
                }, x: __ABBREV.__WebSharper.OptionProxy<_M1>): boolean;
            };
            var fold : {
                <_M1, _M2>(f: {
                    (x: _M2): {
                        (x: _M1): _M2;
                    };
                }, s: _M2, x: __ABBREV.__WebSharper.OptionProxy<_M1>): _M2;
            };
            var foldBack : {
                <_M1, _M2>(f: {
                    (x: _M1): {
                        (x: _M2): _M2;
                    };
                }, x: __ABBREV.__WebSharper.OptionProxy<_M1>, s: _M2): _M2;
            };
            var forall : {
                <_M1>(p: {
                    (x: _M1): boolean;
                }, x: __ABBREV.__WebSharper.OptionProxy<_M1>): boolean;
            };
            var iter : {
                <_M1>(p: {
                    (x: _M1): void;
                }, x: __ABBREV.__WebSharper.OptionProxy<_M1>): void;
            };
            var map : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, x: __ABBREV.__WebSharper.OptionProxy<_M1>): __ABBREV.__WebSharper.OptionProxy<_M2>;
            };
            var toArray : {
                <_M1>(x: __ABBREV.__WebSharper.OptionProxy<_M1>): _M1[];
            };
            var toList : {
                <_M1>(x: __ABBREV.__WebSharper.OptionProxy<_M1>): __ABBREV.__List.T<_M1>;
            };
        }
        module OperatorIntrinsics {
            var GetStringSlice : {
                (source: string, start: __ABBREV.__WebSharper.OptionProxy<number>, finish: __ABBREV.__WebSharper.OptionProxy<number>): string;
            };
            var GetArraySlice : {
                <_M1>(source: _M1[], start: __ABBREV.__WebSharper.OptionProxy<number>, finish: __ABBREV.__WebSharper.OptionProxy<number>): _M1[];
            };
            var SetArraySlice : {
                <_M1>(dst: _M1[], start: __ABBREV.__WebSharper.OptionProxy<number>, finish: __ABBREV.__WebSharper.OptionProxy<number>, src: _M1[]): void;
            };
            var GetArraySlice2D : {
                <_M1>(arr: any, start1: __ABBREV.__WebSharper.OptionProxy<number>, finish1: __ABBREV.__WebSharper.OptionProxy<number>, start2: __ABBREV.__WebSharper.OptionProxy<number>, finish2: __ABBREV.__WebSharper.OptionProxy<number>): any;
            };
            var GetArraySlice2DFixed1 : {
                <_M1>(arr: any, fixed1: number, start2: __ABBREV.__WebSharper.OptionProxy<number>, finish2: __ABBREV.__WebSharper.OptionProxy<number>): _M1[];
            };
            var GetArraySlice2DFixed2 : {
                <_M1>(arr: any, start1: __ABBREV.__WebSharper.OptionProxy<number>, finish1: __ABBREV.__WebSharper.OptionProxy<number>, fixed2: number): _M1[];
            };
            var SetArraySlice2DFixed1 : {
                <_M1>(dst: any, fixed1: number, start2: __ABBREV.__WebSharper.OptionProxy<number>, finish2: __ABBREV.__WebSharper.OptionProxy<number>, src: _M1[]): void;
            };
            var SetArraySlice2DFixed2 : {
                <_M1>(dst: any, start1: __ABBREV.__WebSharper.OptionProxy<number>, finish1: __ABBREV.__WebSharper.OptionProxy<number>, fixed2: number, src: _M1[]): void;
            };
            var SetArraySlice2D : {
                <_M1>(dst: any, start1: __ABBREV.__WebSharper.OptionProxy<number>, finish1: __ABBREV.__WebSharper.OptionProxy<number>, start2: __ABBREV.__WebSharper.OptionProxy<number>, finish2: __ABBREV.__WebSharper.OptionProxy<number>, src: any): void;
            };
        }
        module Operators {
            var range : {
                <_M1>(min: _M1, max: _M1): __ABBREV.__WebSharper.seq<_M1>;
            };
            var step : {
                <_M1, _M2>(min: _M1, step: _M2, max: _M1): __ABBREV.__WebSharper.seq<_M1>;
            };
            var Compare : {
                <_M1>(a: _M1, b: _M1): number;
            };
            var Decrement : {
                (x: __ABBREV.__WebSharper.ref<number>): void;
            };
            var DefaultArg : {
                <_M1>(x: __ABBREV.__WebSharper.OptionProxy<_M1>, d: _M1): _M1;
            };
            var FailWith : {
                <_M1>(msg: string): _M1;
            };
            var Increment : {
                (x: __ABBREV.__WebSharper.ref<number>): void;
            };
            var Max : {
                <_M1>(a: _M1, b: _M1): _M1;
            };
            var Min : {
                <_M1>(a: _M1, b: _M1): _M1;
            };
            var Pown : {
                <_M1>(a: _M1, n: number): number;
            };
            var Sign : {
                <_M1>(x: _M1): number;
            };
            var Truncate : {
                <_M1>(x: _M1): _M1;
            };
            var Using : {
                <_M1, _M2>(t: _M1, f: {
                    (x: _M1): _M2;
                }): _M2;
            };
            var KeyValue : {
                <_M1, _M2>(kvp: __ABBREV.__WebSharper.KeyValuePairProxy<_M1, _M2>): any;
            };
        }
        module Lazy {
            var Create : {
                <_M1>(f: {
                    (): _M1;
                }): __ABBREV.__WebSharper.LazyProxy<_M1>;
            };
            var CreateFromValue : {
                <_M1>(v: _M1): __ABBREV.__WebSharper.LazyProxy<_M1>;
            };
            var Force : {
                <_M1>(x: __ABBREV.__WebSharper.LazyProxy<_M1>): _M1;
            };
        }
        module ExtraTopLevelOperatorsProxy {
            var array2D : {
                <_M1, _M2>(rows: __ABBREV.__WebSharper.seq<_M1>): any;
            };
        }
        module Util {
            var observer : {
                <_M1>(h: {
                    (x: _M1): void;
                }): any;
            };
            var addListener : {
                <_M1>(event: any, h: {
                    (x: _M1): void;
                }): void;
            };
            var subscribeTo : {
                <_M1>(event: any, h: {
                    (x: _M1): void;
                }): __ABBREV.__WebSharper.IDisposableProxy;
            };
        }
        module Arrays2D {
            var zeroCreate : {
                <_M1>(n: number, m: number): any;
            };
            var init : {
                <_M1>(n: number, m: number, f: {
                    (x: number): {
                        (x: number): _M1;
                    };
                }): any;
            };
            var iter : {
                <_M1>(f: {
                    (x: _M1): void;
                }, array: any): void;
            };
            var iteri : {
                <_M1>(f: {
                    (x: number): {
                        (x: number): {
                            (x: _M1): void;
                        };
                    };
                }, array: any): void;
            };
            var map : {
                <_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, array: any): any;
            };
            var mapi : {
                <_M1, _M2>(f: {
                    (x: number): {
                        (x: number): {
                            (x: _M1): _M2;
                        };
                    };
                }, array: any): any;
            };
            var copy : {
                <_M1>(array: any): any;
            };
        }
        module IntrinsicFunctionProxy {
            var BoundsCheck : {
                <_M1>(arr: _M1[], n: number): void;
            };
            var BoundsCheck2D : {
                <_M1>(arr: any, n1: number, n2: number): void;
            };
            var SetArray : {
                <_M1>(arr: _M1[], n: number, x: _M1): void;
            };
            var GetArray : {
                <_M1>(arr: _M1[], n: number): _M1;
            };
            var GetArraySub : {
                <_M1>(arr: _M1[], start: number, len: number): _M1[];
            };
            var SetArraySub : {
                <_M1>(arr: _M1[], start: number, len: number, src: _M1[]): void;
            };
            var GetArray2D : {
                <_M1>(arr: any, n1: number, n2: number): _M1;
            };
            var SetArray2D : {
                <_M1>(arr: any, n1: number, n2: number, x: _M1): void;
            };
            var Array2DZeroCreate : {
                <_M1>(n: number, m: number): any;
            };
            var GetArray2DSub : {
                <_M1>(src: any, src1: number, src2: number, len1: number, len2: number): any;
            };
            var SetArray2DSub : {
                <_M1>(dst: any, src1: number, src2: number, len1: number, len2: number, src: any): void;
            };
            var GetLength : {
                <_M1>(arr: __ABBREV.__WebSharper.ArrayProxy): number;
            };
        }
        module JavaScript {
            module Pervasives {
                var NewFromList : {
                    <_M1>(fields: __ABBREV.__WebSharper.seq<any>): _M1;
                };
            }
            module JS {
                interface Kind {
                }
            }
        }
        module Remoting {
            interface IAjaxProvider {
                Async(x0: string, x1: __ABBREV.__WebSharper.ObjectProxy, x2: string, x3: {
                    (x: string): void;
                }, x4: {
                    (x: __ABBREV.__WebSharper.ExceptionProxy): void;
                }): void;
                Sync(x0: string, x1: __ABBREV.__WebSharper.ObjectProxy, x2: string): string;
            }
            var makeHeaders : {
                (m: string): __ABBREV.__WebSharper.ObjectProxy;
            };
            var makePayload : {
                (data: __ABBREV.__WebSharper.ObjectProxy[]): string;
            };
            var Call : {
                (m: string, data: __ABBREV.__WebSharper.ObjectProxy[]): __ABBREV.__WebSharper.ObjectProxy;
            };
            var Async : {
                (m: string, data: __ABBREV.__WebSharper.ObjectProxy[]): any;
            };
            var Send : {
                (m: string, data: __ABBREV.__WebSharper.ObjectProxy[]): void;
            };
            var EndPoint : {
                (): string;
            };
            var AjaxProvider : {
                (): __ABBREV.__Remoting.IAjaxProvider;
            };
        }
        module Json {
            interface Resource {
            }
            var lookup : {
                <_M1>(x: string[]): __ABBREV.__WebSharper.ObjectProxy;
            };
            var restore : {
                (ty: __ABBREV.__WebSharper.ObjectProxy, obj: __ABBREV.__WebSharper.ObjectProxy): __ABBREV.__WebSharper.ObjectProxy;
            };
            var shallowMap : {
                (f: {
                    (x: __ABBREV.__WebSharper.ObjectProxy): __ABBREV.__WebSharper.ObjectProxy;
                }, x: __ABBREV.__WebSharper.ObjectProxy): __ABBREV.__WebSharper.ObjectProxy;
            };
            var Activate : {
                <_M1>(json: __ABBREV.__WebSharper.ObjectProxy): _M1;
            };
        }
        interface ArrayProxy {
        }
        interface AsyncProxy {
        }
        interface CancellationTokenProxy {
        }
        interface ActionProxy {
        }
        interface CancellationTokenRegistrationProxy {
            Dispose(): void;
        }
        interface CancellationTokenSource {
            Cancel(): void;
            Cancel1(throwOnFirstException: boolean): void;
            CancelAfter(delay: number): void;
            get_IsCancellationRequested(): boolean;
        }
        interface AsyncBuilderProxy {
        }
        interface Char {
        }
        interface ChoiceProxy3<_T1, _T2> {
        }
        interface ChoiceProxy11<_T1, _T2, _T3> {
        }
        interface ChoiceProxy2<_T1, _T2, _T3, _T4> {
        }
        interface ChoiceProxy4<_T1, _T2, _T3, _T4, _T5> {
        }
        interface ChoiceProxy1<_T1, _T2, _T3, _T4, _T5, _T6> {
        }
        interface ChoiceProxy<_T1, _T2, _T3, _T4, _T5, _T6, _T7> {
        }
        interface DateTimeProxy {
        }
        interface DoubleProxy {
        }
        interface EnumProxy {
        }
        interface ExceptionProxy {
        }
        interface MatchFailureExceptionProxy {
        }
        interface IndexOutOfRangeExceptionProxy {
        }
        interface OperationCanceledExceptionProxy {
        }
        interface ArgumentExceptionProxy {
        }
        interface InvalidOperationExceptionProxy {
        }
        interface AggregateException {
        }
        interface IDisposableProxy {
            Dispose(): void;
        }
        interface seq<_T1> {
        }
        interface IEnumeratorProxy1 {
            MoveNext(): boolean;
            Reset(): void;
            get_Current(): __ABBREV.__WebSharper.ObjectProxy;
        }
        interface ObjectProxy {
        }
        interface IEnumeratorProxy<_T1> {
            get_Current(): _T1;
        }
        interface Int32Proxy {
        }
        interface KeyValuePairProxy<_T1, _T2> {
        }
        interface LazyProxy<_T1> {
        }
        interface Math {
        }
        interface OptionProxy<_T1> {
        }
        interface PrintfFormat {
        }
        interface TimeSpanProxy {
        }
        interface ref<_T1> {
        }
    }
}
declare module __ABBREV {
    
    export import __Dom = IntelliFactory.WebSharper.JavaScript.Dom;
    export import __Client = IntelliFactory.WebSharper.Html.Client;
    export import __WebSharper = IntelliFactory.WebSharper;
    export import __List = IntelliFactory.WebSharper.List;
    export import __Remoting = IntelliFactory.WebSharper.Remoting;
}

declare module IntelliFactory {
    module WebSharper {
        module Html {
            module Client {
                module Element {
                    var New : {
                        (html: __ABBREV.__Interfaces.IHtmlProvider, name: string): __ABBREV.__Client.Element;
                    };
                }
                module Interfaces {
                    interface IHtmlProvider {
                        CreateTextNode(x0: string): __ABBREV.__Dom.Text;
                        CreateElement(x0: string): __ABBREV.__Dom.Element;
                        SetAttribute(x0: __ABBREV.__Dom.Node, x1: string, x2: string): void;
                        AppendAttribute(x0: __ABBREV.__Dom.Node, x1: __ABBREV.__Dom.Attr): void;
                        RemoveAttribute(x0: __ABBREV.__Dom.Node, x1: string): void;
                        GetAttribute(x0: __ABBREV.__Dom.Node, x1: string): string;
                        HasAttribute(x0: __ABBREV.__Dom.Node, x1: string): boolean;
                        CreateAttribute(x0: string): __ABBREV.__Dom.Attr;
                        GetProperty<_M1>(x0: __ABBREV.__Dom.Node, x1: string): _M1;
                        SetProperty<_M1>(x0: __ABBREV.__Dom.Node, x1: string, x2: _M1): void;
                        AppendNode(x0: __ABBREV.__Dom.Node, x1: __ABBREV.__Dom.Node): void;
                        Clear(x0: __ABBREV.__Dom.Node): void;
                        Remove(x0: __ABBREV.__Dom.Node): void;
                        SetText(x0: __ABBREV.__Dom.Node, x1: string): void;
                        GetText(x0: __ABBREV.__Dom.Node): string;
                        SetHtml(x0: __ABBREV.__Dom.Node, x1: string): void;
                        GetHtml(x0: __ABBREV.__Dom.Node): string;
                        SetValue(x0: __ABBREV.__Dom.Node, x1: string): void;
                        GetValue(x0: __ABBREV.__Dom.Node): string;
                        SetStyle(x0: __ABBREV.__Dom.Node, x1: string): void;
                        SetCss(x0: __ABBREV.__Dom.Node, x1: string, x2: string): void;
                        AddClass(x0: __ABBREV.__Dom.Node, x1: string): void;
                        RemoveClass(x0: __ABBREV.__Dom.Node, x1: string): void;
                        OnLoad(x0: __ABBREV.__Dom.Node, x1: {
                            (): void;
                        }): void;
                        OnDocumentReady(x0: {
                            (): void;
                        }): void;
                    }
                }
                module EventsPervasives {
                    var Events : {
                        (): __ABBREV.__Events.IEventSupport;
                    };
                }
                module Events {
                    interface IEventSupport {
                        OnClick<_M1>(x0: {
                            (x: _M1): {
                                (x: any): void;
                            };
                        }, x1: _M1): void;
                        OnDoubleClick<_M1>(x0: {
                            (x: _M1): {
                                (x: any): void;
                            };
                        }, x1: _M1): void;
                        OnMouseDown<_M1>(x0: {
                            (x: _M1): {
                                (x: any): void;
                            };
                        }, x1: _M1): void;
                        OnMouseEnter<_M1>(x0: {
                            (x: _M1): {
                                (x: any): void;
                            };
                        }, x1: _M1): void;
                        OnMouseLeave<_M1>(x0: {
                            (x: _M1): {
                                (x: any): void;
                            };
                        }, x1: _M1): void;
                        OnMouseMove<_M1>(x0: {
                            (x: _M1): {
                                (x: any): void;
                            };
                        }, x1: _M1): void;
                        OnMouseOut<_M1>(x0: {
                            (x: _M1): {
                                (x: any): void;
                            };
                        }, x1: _M1): void;
                        OnMouseUp<_M1>(x0: {
                            (x: _M1): {
                                (x: any): void;
                            };
                        }, x1: _M1): void;
                        OnKeyDown<_M1>(x0: {
                            (x: _M1): {
                                (x: any): void;
                            };
                        }, x1: _M1): void;
                        OnKeyPress<_M1>(x0: {
                            (x: _M1): {
                                (x: any): void;
                            };
                        }, x1: _M1): void;
                        OnKeyUp<_M1>(x0: {
                            (x: _M1): {
                                (x: any): void;
                            };
                        }, x1: _M1): void;
                        OnBlur<_M1>(x0: {
                            (x: _M1): void;
                        }, x1: _M1): void;
                        OnChange<_M1>(x0: {
                            (x: _M1): void;
                        }, x1: _M1): void;
                        OnFocus<_M1>(x0: {
                            (x: _M1): void;
                        }, x1: _M1): void;
                        OnError<_M1>(x0: {
                            (x: _M1): void;
                        }, x1: _M1): void;
                        OnLoad<_M1>(x0: {
                            (x: _M1): void;
                        }, x1: _M1): void;
                        OnUnLoad<_M1>(x0: {
                            (x: _M1): void;
                        }, x1: _M1): void;
                        OnResize<_M1>(x0: {
                            (x: _M1): void;
                        }, x1: _M1): void;
                        OnScroll<_M1>(x0: {
                            (x: _M1): void;
                        }, x1: _M1): void;
                        OnSelect<_M1>(x0: {
                            (x: _M1): void;
                        }, x1: _M1): void;
                        OnSubmit<_M1>(x0: {
                            (x: _M1): void;
                        }, x1: _M1): void;
                    }
                    interface MouseEvent {
                        X: number;
                        Y: number;
                    }
                    interface CharacterCode {
                        CharacterCode: number;
                    }
                    interface KeyCode {
                        KeyCode: number;
                    }
                }
                module Default {
                    var OnLoad : {
                        (init: {
                            (): void;
                        }): void;
                    };
                    var Text : {
                        (x: string): __ABBREV.__Client.Pagelet;
                    };
                    var A : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var B : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Body : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Br : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Button : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Code : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Div : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Em : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Form : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var H1 : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var H2 : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var H3 : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var H4 : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Head : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Hr : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var I : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var IFrame : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Img : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Input : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var LI : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var OL : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var P : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Pre : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Script : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Select : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Span : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var Table : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var TBody : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var TD : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var TextArea : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var TFoot : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var TH : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var THead : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var TR : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var UL : {
                        <_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var NewAttr : {
                        (x: string): {
                            (x: string): __ABBREV.__Client.Pagelet;
                        };
                    };
                    var Action : {
                        (x: string): __ABBREV.__Client.Pagelet;
                    };
                    var Align : {
                        (x: string): __ABBREV.__Client.Pagelet;
                    };
                    var Alt : {
                        (x: string): __ABBREV.__Client.Pagelet;
                    };
                    var HRef : {
                        (x: string): __ABBREV.__Client.Pagelet;
                    };
                    var Height : {
                        (x: string): __ABBREV.__Client.Pagelet;
                    };
                    var Id : {
                        (x: string): __ABBREV.__Client.Pagelet;
                    };
                    var Name : {
                        (x: string): __ABBREV.__Client.Pagelet;
                    };
                    var RowSpan : {
                        (x: string): __ABBREV.__Client.Pagelet;
                    };
                    var Selected : {
                        (x: string): __ABBREV.__Client.Pagelet;
                    };
                    var Src : {
                        (x: string): __ABBREV.__Client.Pagelet;
                    };
                    var VAlign : {
                        (x: string): __ABBREV.__Client.Pagelet;
                    };
                    var Width : {
                        (x: string): __ABBREV.__Client.Pagelet;
                    };
                    var Tags : {
                        (): __ABBREV.__Client.TagBuilder;
                    };
                    var Deprecated : {
                        (): __ABBREV.__Client.DeprecatedTagBuilder;
                    };
                    var Attr : {
                        (): __ABBREV.__Client.AttributeBuilder;
                    };
                }
                module Operators {
                    var add : {
                        <_M1>(el: __ABBREV.__Client.Element, inner: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    };
                    var OnAfterRender : {
                        <_M1>(f: {
                            (x: _M1): void;
                        }, w: _M1): void;
                    };
                    var OnBeforeRender : {
                        <_M1>(f: {
                            (x: _M1): void;
                        }, w: _M1): void;
                    };
                }
                interface Pagelet {
                    Render(): void;
                    AppendTo(targetId: string): void;
                    ReplaceInDom(node: __ABBREV.__Dom.Node): void;
                }
                interface Element {
                    Render(): void;
                    OnLoad(f: {
                        (): void;
                    }): void;
                    AppendI(pl: __ABBREV.__Client.Pagelet): void;
                    AppendN(node: __ABBREV.__Dom.Node): void;
                    get_Body(): __ABBREV.__Dom.Node;
                    get_Text(): string;
                    set_Text(x: string): void;
                    get_Html(): string;
                    set_Html(x: string): void;
                    get_Value(): string;
                    set_Value(x: string): void;
                    get_Id(): string;
                    get_HtmlProvider(): __ABBREV.__Interfaces.IHtmlProvider;
                    get_Item(name: string): string;
                    set_Item(name: string, value: string): void;
                }
                interface DeprecatedTagBuilder {
                    NewTag<_M1>(name: string, children: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                }
                interface TagBuilder {
                    NewTag<_M1>(name: string, children: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                    text(data: string): __ABBREV.__Client.Pagelet;
                    Div<_M1>(x: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Client.Element;
                }
                interface DeprecatedAttributeBuilder {
                    NewAttr(name: string, value: string): __ABBREV.__Client.Pagelet;
                }
                interface AttributeBuilder {
                    NewAttr(name: string, value: string): __ABBREV.__Client.Pagelet;
                    Class(x: string): __ABBREV.__Client.Pagelet;
                }
            }
        }
    }
}
declare module __ABBREV {
    
    export import __Interfaces = IntelliFactory.WebSharper.Html.Client.Interfaces;
    export import __Client = IntelliFactory.WebSharper.Html.Client;
    export import __Dom = IntelliFactory.WebSharper.JavaScript.Dom;
    export import __Events = IntelliFactory.WebSharper.Html.Client.Events;
    export import __WebSharper = IntelliFactory.WebSharper;
}

declare module IntelliFactory {
    module WebSharper {
        module Collections {
            module HashSet {
                interface HashSet<_T1> {
                    Add(item: _T1): boolean;
                    Clear(): void;
                    Contains(item: _T1): boolean;
                    CopyTo(arr: _T1[]): void;
                    ExceptWith(xs: __ABBREV.__WebSharper.seq<_T1>): void;
                    GetEnumerator(): __ABBREV.__WebSharper.IEnumeratorProxy<_T1>;
                    IntersectWith(xs: __ABBREV.__WebSharper.seq<_T1>): void;
                    IsProperSubsetOf(xs: __ABBREV.__WebSharper.seq<_T1>): boolean;
                    IsProperSupersetOf(xs: __ABBREV.__WebSharper.seq<_T1>): boolean;
                    IsSubsetOf(xs: __ABBREV.__WebSharper.seq<_T1>): boolean;
                    IsSupersetOf(xs: __ABBREV.__WebSharper.seq<_T1>): boolean;
                    Overlaps(xs: __ABBREV.__WebSharper.seq<_T1>): boolean;
                    Remove(item: _T1): boolean;
                    RemoveWhere(cond: {
                        (x: _T1): boolean;
                    }): void;
                    SetEquals(xs: __ABBREV.__WebSharper.seq<_T1>): boolean;
                    SymmetricExceptWith(xs: __ABBREV.__WebSharper.seq<_T1>): void;
                    UnionWith(xs: __ABBREV.__WebSharper.seq<_T1>): void;
                    arrContains(item: _T1, arr: __ABBREV.__JavaScript.Array<_T1>): boolean;
                    arrRemove(item: _T1, arr: __ABBREV.__JavaScript.Array<_T1>): boolean;
                    add(item: _T1): boolean;
                    get_Count(): number;
                }
            }
            module LinkedList {
                interface NodeProxy<_T1> {
                }
                interface EnumeratorProxy<_T1> {
                    MoveNext(): boolean;
                    Dispose(): void;
                    get_Current(): _T1;
                }
                interface ListProxy<_T1> {
                    AddAfter(after: __ABBREV.__LinkedList.NodeProxy<_T1>, value: _T1): __ABBREV.__LinkedList.NodeProxy<_T1>;
                    AddBefore(before: __ABBREV.__LinkedList.NodeProxy<_T1>, value: _T1): __ABBREV.__LinkedList.NodeProxy<_T1>;
                    AddFirst(value: _T1): __ABBREV.__LinkedList.NodeProxy<_T1>;
                    AddLast(value: _T1): __ABBREV.__LinkedList.NodeProxy<_T1>;
                    Clear(): void;
                    Contains(value: _T1): boolean;
                    Find(value: _T1): __ABBREV.__LinkedList.NodeProxy<_T1>;
                    FindLast(value: _T1): __ABBREV.__LinkedList.NodeProxy<_T1>;
                    GetEnumerator(): __ABBREV.__LinkedList.EnumeratorProxy<_T1>;
                    Remove(node: __ABBREV.__LinkedList.NodeProxy<_T1>): void;
                    Remove1(value: _T1): boolean;
                    RemoveFirst(): void;
                    RemoveLast(): void;
                    get_Count(): number;
                    get_First(): __ABBREV.__LinkedList.NodeProxy<_T1>;
                    get_Last(): __ABBREV.__LinkedList.NodeProxy<_T1>;
                }
            }
            module ResizeArray {
                interface ResizeArrayProxy<_T1> {
                    GetEnumerator(): __ABBREV.__WebSharper.IEnumeratorProxy<__ABBREV.__WebSharper.ObjectProxy>;
                    Add(x: _T1): void;
                    AddRange(x: __ABBREV.__WebSharper.seq<_T1>): void;
                    Clear(): void;
                    CopyTo(arr: _T1[]): void;
                    CopyTo1(arr: _T1[], offset: number): void;
                    CopyTo2(index: number, target: _T1[], offset: number, count: number): void;
                    GetRange(index: number, count: number): __ABBREV.__ResizeArray.ResizeArrayProxy<_T1>;
                    Insert(index: number, items: _T1): void;
                    InsertRange(index: number, items: __ABBREV.__WebSharper.seq<_T1>): void;
                    RemoveAt(x: number): void;
                    RemoveRange(index: number, count: number): void;
                    Reverse(): void;
                    Reverse1(index: number, count: number): void;
                    ToArray(): _T1[];
                    get_Count(): number;
                    get_Item(x: number): _T1;
                    set_Item(x: number, v: _T1): void;
                }
            }
            module SetModule {
                var Filter : {
                    <_M1>(f: {
                        (x: _M1): boolean;
                    }, s: __ABBREV.__Collections.FSharpSet<_M1>): __ABBREV.__Collections.FSharpSet<_M1>;
                };
                var FoldBack : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): _M2;
                        };
                    }, a: __ABBREV.__Collections.FSharpSet<_M1>, s: _M2): _M2;
                };
                var Partition : {
                    <_M1>(f: {
                        (x: _M1): boolean;
                    }, a: __ABBREV.__Collections.FSharpSet<_M1>): any;
                };
            }
            module MapModule {
                var Exists : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): boolean;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): boolean;
                };
                var Filter : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): boolean;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): __ABBREV.__Collections.FSharpMap<_M1, _M2>;
                };
                var FindKey : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): boolean;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): _M1;
                };
                var Fold : {
                    <_M1, _M2, _M3>(f: {
                        (x: _M3): {
                            (x: _M1): {
                                (x: _M2): _M3;
                            };
                        };
                    }, s: _M3, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): _M3;
                };
                var FoldBack : {
                    <_M1, _M2, _M3>(f: {
                        (x: _M1): {
                            (x: _M2): {
                                (x: _M3): _M3;
                            };
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>, s: _M3): _M3;
                };
                var ForAll : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): boolean;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): boolean;
                };
                var Iterate : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): void;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): void;
                };
                var OfArray : {
                    <_M1, _M2>(a: any[]): __ABBREV.__Collections.FSharpMap<_M1, _M2>;
                };
                var Partition : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): boolean;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): any;
                };
                var Pick : {
                    <_M1, _M2, _M3>(f: {
                        (x: _M1): {
                            (x: _M2): __ABBREV.__WebSharper.OptionProxy<_M3>;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): _M3;
                };
                var ToSeq : {
                    <_M1, _M2>(m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): __ABBREV.__WebSharper.seq<any>;
                };
                var TryFind : {
                    <_M1, _M2>(k: _M1, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): __ABBREV.__WebSharper.OptionProxy<_M2>;
                };
                var TryFindKey : {
                    <_M1, _M2>(f: {
                        (x: _M1): {
                            (x: _M2): boolean;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): __ABBREV.__WebSharper.OptionProxy<_M1>;
                };
                var TryPick : {
                    <_M1, _M2, _M3>(f: {
                        (x: _M1): {
                            (x: _M2): __ABBREV.__WebSharper.OptionProxy<_M3>;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): __ABBREV.__WebSharper.OptionProxy<_M3>;
                };
                var Map : {
                    <_M1, _M2, _M3>(f: {
                        (x: _M1): {
                            (x: _M2): _M3;
                        };
                    }, m: __ABBREV.__Collections.FSharpMap<_M1, _M2>): __ABBREV.__Collections.FSharpMap<_M1, _M3>;
                };
            }
            interface Dictionary<_T1, _T2> {
                Add(k: _T1, v: _T2): void;
                Clear(): void;
                ContainsKey(k: _T1): boolean;
                GetEnumerator(): __ABBREV.__WebSharper.IEnumeratorProxy<__ABBREV.__WebSharper.ObjectProxy>;
                Remove(k: _T1): boolean;
                get_Item(k: _T1): _T2;
                set_Item(k: _T1, v: _T2): void;
            }
            interface FSharpMap<_T1, _T2> {
                Add(k: _T1, v: _T2): __ABBREV.__Collections.FSharpMap<_T1, _T2>;
                ContainsKey(k: _T1): boolean;
                Remove(k: _T1): __ABBREV.__Collections.FSharpMap<_T1, _T2>;
                TryFind(k: _T1): __ABBREV.__WebSharper.OptionProxy<_T2>;
                GetEnumerator(): __ABBREV.__WebSharper.IEnumeratorProxy<__ABBREV.__WebSharper.KeyValuePairProxy<_T1, _T2>>;
                GetHashCode(): number;
                Equals(other: __ABBREV.__WebSharper.ObjectProxy): boolean;
                CompareTo(other: __ABBREV.__WebSharper.ObjectProxy): number;
                get_Tree(): any;
                get_Count(): number;
                get_IsEmpty(): boolean;
                get_Item(k: _T1): _T2;
            }
            interface FSharpSet<_T1> {
                add(x: __ABBREV.__Collections.FSharpSet<_T1>): __ABBREV.__Collections.FSharpSet<_T1>;
                sub(x: __ABBREV.__Collections.FSharpSet<_T1>): __ABBREV.__Collections.FSharpSet<_T1>;
                Add(x: _T1): __ABBREV.__Collections.FSharpSet<_T1>;
                Contains(v: _T1): boolean;
                IsProperSubsetOf(s: __ABBREV.__Collections.FSharpSet<_T1>): boolean;
                IsProperSupersetOf(s: __ABBREV.__Collections.FSharpSet<_T1>): boolean;
                IsSubsetOf(s: __ABBREV.__Collections.FSharpSet<_T1>): boolean;
                IsSupersetOf(s: __ABBREV.__Collections.FSharpSet<_T1>): boolean;
                Remove(v: _T1): __ABBREV.__Collections.FSharpSet<_T1>;
                GetEnumerator(): __ABBREV.__WebSharper.IEnumeratorProxy<_T1>;
                GetHashCode(): number;
                Equals(other: __ABBREV.__WebSharper.ObjectProxy): boolean;
                CompareTo(other: __ABBREV.__WebSharper.ObjectProxy): number;
                get_Count(): number;
                get_IsEmpty(): boolean;
                get_Tree(): any;
                get_MaximumElement(): _T1;
                get_MinimumElement(): _T1;
            }
        }
    }
}
declare module __ABBREV {
    
    export import __WebSharper = IntelliFactory.WebSharper;
    export import __JavaScript = IntelliFactory.WebSharper.JavaScript;
    export import __LinkedList = IntelliFactory.WebSharper.Collections.LinkedList;
    export import __ResizeArray = IntelliFactory.WebSharper.Collections.ResizeArray;
    export import __Collections = IntelliFactory.WebSharper.Collections;
}

declare module IntelliFactory {
    module WebSharper {
        module UI {
            module Next {
                module Var1 {
                    var Create : {
                        <_M1>(v: _M1): __ABBREV.__Next.Var1<_M1>;
                    };
                    var Get : {
                        <_M1>(_var: __ABBREV.__Next.Var1<_M1>): _M1;
                    };
                    var Set : {
                        <_M1>(_var: __ABBREV.__Next.Var1<_M1>, value: _M1): void;
                    };
                }
                module Var {
                    var SetFinal : {
                        <_M1>(_var: __ABBREV.__Next.Var1<_M1>, value: _M1): void;
                    };
                    var Update : {
                        <_M1>(_var: __ABBREV.__Next.Var1<_M1>, fn: {
                            (x: _M1): _M1;
                        }): void;
                    };
                    var GetId : {
                        <_M1>(_var: __ABBREV.__Next.Var1<_M1>): number;
                    };
                    var Observe : {
                        <_M1>(_var: __ABBREV.__Next.Var1<_M1>): any;
                    };
                }
                module View1 {
                    var FromVar : {
                        <_M1>(_var: __ABBREV.__Next.Var1<_M1>): __ABBREV.__Next.View1<_M1>;
                    };
                    var CreateLazy : {
                        <_M1>(observe: {
                            (): any;
                        }): __ABBREV.__Next.View1<_M1>;
                    };
                    var Map : {
                        <_M1, _M2>(fn: {
                            (x: _M1): _M2;
                        }, _arg1: __ABBREV.__Next.View1<_M1>): __ABBREV.__Next.View1<_M2>;
                    };
                    var CreateLazy2 : {
                        <_M1, _M2, _M3>(snapFn: {
                            (x: any): {
                                (x: any): any;
                            };
                        }, _arg3: __ABBREV.__Next.View1<_M1>, _arg2: __ABBREV.__Next.View1<_M2>): __ABBREV.__Next.View1<_M3>;
                    };
                    var Map2 : {
                        <_M1, _M2, _M3>(fn: {
                            (x: _M1): {
                                (x: _M2): _M3;
                            };
                        }, v1: __ABBREV.__Next.View1<_M1>, v2: __ABBREV.__Next.View1<_M2>): __ABBREV.__Next.View1<_M3>;
                    };
                    var MapAsync : {
                        <_M1, _M2>(fn: {
                            (x: _M1): any;
                        }, _arg4: __ABBREV.__Next.View1<_M1>): __ABBREV.__Next.View1<_M2>;
                    };
                    var SnapshotOn : {
                        <_M1, _M2>(def: _M1, _arg6: __ABBREV.__Next.View1<_M2>, _arg5: __ABBREV.__Next.View1<_M1>): __ABBREV.__Next.View1<_M1>;
                    };
                    var UpdateWhile : {
                        <_M1>(def: _M1, v1: __ABBREV.__Next.View1<boolean>, v2: __ABBREV.__Next.View1<_M1>): __ABBREV.__Next.View1<_M1>;
                    };
                    var ConvertBy : {
                        <_M1, _M2, _M3>(key: {
                            (x: _M1): _M3;
                        }, conv: {
                            (x: _M1): _M2;
                        }, view: __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<_M1>>): __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<_M2>>;
                    };
                    var Convert : {
                        <_M1, _M2>(conv: {
                            (x: _M1): _M2;
                        }, view: __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<_M1>>): __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<_M2>>;
                    };
                    var ConvertSeqNode : {
                        <_M1, _M2>(conv: {
                            (x: __ABBREV.__Next.View1<_M1>): _M2;
                        }, value: _M1): any;
                    };
                    var ConvertSeqBy : {
                        <_M1, _M2, _M3>(key: {
                            (x: _M1): _M3;
                        }, conv: {
                            (x: __ABBREV.__Next.View1<_M1>): _M2;
                        }, view: __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<_M1>>): __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<_M2>>;
                    };
                    var get_Do : {
                        (): __ABBREV.__Next.ViewBuilder;
                    };
                }
                module View {
                    var ConvertSeq : {
                        <_M1, _M2>(conv: {
                            (x: __ABBREV.__Next.View1<_M1>): _M2;
                        }, view: __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<_M1>>): __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<_M2>>;
                    };
                    var Join : {
                        <_M1>(_arg7: __ABBREV.__Next.View1<__ABBREV.__Next.View1<_M1>>): __ABBREV.__Next.View1<_M1>;
                    };
                    var Bind : {
                        <_M1, _M2>(fn: {
                            (x: _M1): __ABBREV.__Next.View1<_M2>;
                        }, view: __ABBREV.__Next.View1<_M1>): __ABBREV.__Next.View1<_M2>;
                    };
                    var Const : {
                        <_M1>(x: _M1): __ABBREV.__Next.View1<_M1>;
                    };
                    var Sink : {
                        <_M1>(act: {
                            (x: _M1): void;
                        }, _arg8: __ABBREV.__Next.View1<_M1>): void;
                    };
                    var Apply : {
                        <_M1, _M2>(fn: __ABBREV.__Next.View1<{
                            (x: _M1): _M2;
                        }>, view: __ABBREV.__Next.View1<_M1>): __ABBREV.__Next.View1<_M2>;
                    };
                }
                module Key {
                    var Fresh : {
                        (): __ABBREV.__Next.Key;
                    };
                }
                module Model1 {
                    var Create : {
                        <_M1, _M2>(proj: {
                            (x: _M1): _M2;
                        }, init: _M1): __ABBREV.__Next.Model1<_M2, _M1>;
                    };
                    var Update : {
                        <_M1, _M2>(update: {
                            (x: _M1): void;
                        }, _arg1: __ABBREV.__Next.Model1<_M2, _M1>): void;
                    };
                    var View : {
                        <_M1, _M2>(_arg2: __ABBREV.__Next.Model1<_M1, _M2>): __ABBREV.__Next.View1<_M1>;
                    };
                }
                module ListModel1 {
                    var Create : {
                        <_M1, _M2>(key: {
                            (x: _M2): _M1;
                        }, init: __ABBREV.__WebSharper.seq<_M2>): __ABBREV.__Next.ListModel1<_M1, _M2>;
                    };
                    var FromSeq : {
                        <_M1>(xs: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Next.ListModel1<_M1, _M1>;
                    };
                }
                module ListModel {
                    var View : {
                        <_M1, _M2>(m: __ABBREV.__Next.ListModel1<_M1, _M2>): __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<_M2>>;
                    };
                }
                module Interpolation {
                    var get_Double : {
                        (): __ABBREV.__Next.Interpolation1<number>;
                    };
                }
                module Easing {
                    var Custom : {
                        (f: {
                            (x: number): number;
                        }): __ABBREV.__Next.Easing;
                    };
                    var get_CubicInOut : {
                        (): __ABBREV.__Next.Easing;
                    };
                }
                module An {
                    var Append : {
                        (_arg2: __ABBREV.__Next.An, _arg1: __ABBREV.__Next.An): __ABBREV.__Next.An;
                    };
                    var Concat : {
                        (xs: __ABBREV.__WebSharper.seq<__ABBREV.__Next.An>): __ABBREV.__Next.An;
                    };
                    var Const : {
                        <_M1>(v: _M1): any;
                    };
                    var Simple : {
                        <_M1>(inter: __ABBREV.__Next.Interpolation1<_M1>, easing: __ABBREV.__Next.Easing, dur: number, startValue: _M1, endValue: _M1): any;
                    };
                    var Delayed : {
                        <_M1>(inter: __ABBREV.__Next.Interpolation1<_M1>, easing: __ABBREV.__Next.Easing, dur: number, delay: number, startValue: _M1, endValue: _M1): any;
                    };
                    var Map : {
                        <_M1, _M2>(f: {
                            (x: _M1): _M2;
                        }, anim: any): any;
                    };
                    var Pack : {
                        (anim: any): __ABBREV.__Next.An;
                    };
                    var Play : {
                        (anim: __ABBREV.__Next.An): any;
                    };
                    var Run : {
                        (k: {
                            (): void;
                        }, anim: any): any;
                    };
                    var WhenDone : {
                        (f: {
                            (): void;
                        }, main: __ABBREV.__Next.An): __ABBREV.__Next.An;
                    };
                    var get_Empty : {
                        (): __ABBREV.__Next.An;
                    };
                }
                module Trans1 {
                    var AnimateChange : {
                        <_M1>(tr: any, x: _M1, y: _M1): any;
                    };
                    var AnimateEnter : {
                        <_M1>(tr: any, x: _M1): any;
                    };
                    var AnimateExit : {
                        <_M1>(tr: any, x: _M1): any;
                    };
                    var CanAnimateChange : {
                        <_M1>(tr: any): boolean;
                    };
                    var CanAnimateEnter : {
                        <_M1>(tr: any): boolean;
                    };
                    var CanAnimateExit : {
                        <_M1>(tr: any): boolean;
                    };
                    var Trivial : {
                        <_M1>(): any;
                    };
                    var Create : {
                        <_M1>(ch: {
                            (x: _M1): {
                                (x: _M1): any;
                            };
                        }): any;
                    };
                    var Change : {
                        <_M1>(ch: {
                            (x: _M1): {
                                (x: _M1): any;
                            };
                        }, tr: any): any;
                    };
                    var Enter : {
                        <_M1>(f: {
                            (x: _M1): any;
                        }, tr: any): any;
                    };
                    var Exit : {
                        <_M1>(f: {
                            (x: _M1): any;
                        }, tr: any): any;
                    };
                }
                module Attr {
                    var Animated : {
                        <_M1>(name: string, tr: any, view: __ABBREV.__Next.View1<_M1>, value: {
                            (x: _M1): string;
                        }): __ABBREV.__Next.Attr;
                    };
                    var AnimatedStyle : {
                        <_M1>(name: string, tr: any, view: __ABBREV.__Next.View1<_M1>, value: {
                            (x: _M1): string;
                        }): __ABBREV.__Next.Attr;
                    };
                    var Dynamic : {
                        (name: string, value: __ABBREV.__Next.View1<string>): __ABBREV.__Next.Attr;
                    };
                    var DynamicCustom : {
                        <_M1>(set: {
                            (x: __ABBREV.__Dom.Element): {
                                (x: _M1): void;
                            };
                        }, value: __ABBREV.__Next.View1<_M1>): __ABBREV.__Next.Attr;
                    };
                    var DynamicStyle : {
                        (name: string, value: __ABBREV.__Next.View1<string>): __ABBREV.__Next.Attr;
                    };
                    var Create : {
                        (name: string, value: string): __ABBREV.__Next.Attr;
                    };
                    var Style : {
                        (name: string, value: string): __ABBREV.__Next.Attr;
                    };
                    var Handler : {
                        (name: string, callback: {
                            (x: __ABBREV.__Dom.Event): void;
                        }): __ABBREV.__Next.Attr;
                    };
                    var Class : {
                        (name: string): __ABBREV.__Next.Attr;
                    };
                    var DynamicClass : {
                        <_M1>(name: string, view: __ABBREV.__Next.View1<_M1>, apply: {
                            (x: _M1): boolean;
                        }): __ABBREV.__Next.Attr;
                    };
                    var DynamicPred : {
                        (name: string, predView: __ABBREV.__Next.View1<boolean>, valView: __ABBREV.__Next.View1<string>): __ABBREV.__Next.Attr;
                    };
                    var Append : {
                        (a: __ABBREV.__Next.Attr, b: __ABBREV.__Next.Attr): __ABBREV.__Next.Attr;
                    };
                    var Concat : {
                        (xs: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>): __ABBREV.__Next.Attr;
                    };
                    var get_Empty : {
                        (): __ABBREV.__Next.Attr;
                    };
                }
                module Doc {
                    var Append : {
                        (a: __ABBREV.__Next.Doc, b: __ABBREV.__Next.Doc): __ABBREV.__Next.Doc;
                    };
                    var Concat : {
                        (xs: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Elem : {
                        (name: __ABBREV.__Dom.Element, attr: __ABBREV.__Next.Attr, children: __ABBREV.__Next.Doc): __ABBREV.__Next.Doc;
                    };
                    var Element : {
                        (name: string, attr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, children: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var SvgElement : {
                        (name: string, attr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, children: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Static : {
                        (el: __ABBREV.__Dom.Element): __ABBREV.__Next.Doc;
                    };
                    var EmbedView : {
                        (view: __ABBREV.__Next.View1<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var TextNode : {
                        (v: string): __ABBREV.__Next.Doc;
                    };
                    var TextView : {
                        (txt: __ABBREV.__Next.View1<string>): __ABBREV.__Next.Doc;
                    };
                    var Run : {
                        (parent: __ABBREV.__Dom.Element, doc: __ABBREV.__Next.Doc): void;
                    };
                    var RunById : {
                        (id: string, tr: __ABBREV.__Next.Doc): void;
                    };
                    var AsPagelet : {
                        (doc: __ABBREV.__Next.Doc): __ABBREV.__Client.Pagelet;
                    };
                    var Flatten : {
                        <_M1>(view: __ABBREV.__Next.View1<_M1>): __ABBREV.__Next.Doc;
                    };
                    var Convert : {
                        <_M1>(render: {
                            (x: _M1): __ABBREV.__Next.Doc;
                        }, view: __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<_M1>>): __ABBREV.__Next.Doc;
                    };
                    var ConvertBy : {
                        <_M1, _M2>(key: {
                            (x: _M1): _M2;
                        }, render: {
                            (x: _M1): __ABBREV.__Next.Doc;
                        }, view: __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<_M1>>): __ABBREV.__Next.Doc;
                    };
                    var ConvertSeq : {
                        <_M1>(render: {
                            (x: __ABBREV.__Next.View1<_M1>): __ABBREV.__Next.Doc;
                        }, view: __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<_M1>>): __ABBREV.__Next.Doc;
                    };
                    var ConvertSeqBy : {
                        <_M1, _M2>(key: {
                            (x: _M1): _M2;
                        }, render: {
                            (x: __ABBREV.__Next.View1<_M1>): __ABBREV.__Next.Doc;
                        }, view: __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<_M1>>): __ABBREV.__Next.Doc;
                    };
                    var InputInternal : {
                        (attr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, _var: __ABBREV.__Next.Var1<string>, inputTy: __ABBREV.__Next.InputControlType): __ABBREV.__Next.Doc;
                    };
                    var Input : {
                        (attr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, _var: __ABBREV.__Next.Var1<string>): __ABBREV.__Next.Doc;
                    };
                    var PasswordBox : {
                        (attr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, _var: __ABBREV.__Next.Var1<string>): __ABBREV.__Next.Doc;
                    };
                    var InputArea : {
                        (attr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, _var: __ABBREV.__Next.Var1<string>): __ABBREV.__Next.Doc;
                    };
                    var Select : {
                        <_M1>(attrs: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, show: {
                            (x: _M1): string;
                        }, options: __ABBREV.__List.T<_M1>, current: __ABBREV.__Next.Var1<_M1>): __ABBREV.__Next.Doc;
                    };
                    var CheckBox : {
                        <_M1>(attrs: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, item: _M1, chk: __ABBREV.__Next.Var1<__ABBREV.__List.T<_M1>>): __ABBREV.__Next.Doc;
                    };
                    var Clickable : {
                        (elem: string, action: {
                            (): void;
                        }): __ABBREV.__Dom.Element;
                    };
                    var Button : {
                        (caption: string, attrs: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, action: {
                            (): void;
                        }): __ABBREV.__Next.Doc;
                    };
                    var Link : {
                        (caption: string, attrs: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, action: {
                            (): void;
                        }): __ABBREV.__Next.Doc;
                    };
                    var Radio : {
                        <_M1>(attrs: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, value: _M1, _var: __ABBREV.__Next.Var1<_M1>): __ABBREV.__Next.Doc;
                    };
                    var get_Empty : {
                        (): __ABBREV.__Next.Doc;
                    };
                }
                module Flow {
                    var Map : {
                        <_M1, _M2>(f: {
                            (x: _M1): _M2;
                        }, x: any): any;
                    };
                    var Bind : {
                        <_M1, _M2>(m: any, k: {
                            (x: _M1): any;
                        }): any;
                    };
                    var Return : {
                        <_M1>(x: _M1): any;
                    };
                    var Embed : {
                        <_M1>(fl: any): __ABBREV.__Next.Doc;
                    };
                    var Define : {
                        <_M1>(f: {
                            (x: {
                                (x: _M1): void;
                            }): __ABBREV.__Next.Doc;
                        }): any;
                    };
                    var Static : {
                        (doc: __ABBREV.__Next.Doc): any;
                    };
                }
                module Flow1 {
                    var get_Do : {
                        (): __ABBREV.__Next.FlowBuilder;
                    };
                }
                module RouteMap {
                    var Create : {
                        <_M1>(ser: {
                            (x: _M1): __ABBREV.__List.T<string>;
                        }, des: {
                            (x: __ABBREV.__List.T<string>): _M1;
                        }): any;
                    };
                    var Install : {
                        <_M1>(map: any): __ABBREV.__Next.Var1<_M1>;
                    };
                }
                module Router1 {
                    var Dir : {
                        <_M1>(prefix: string, sites: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Router1<_M1>>): __ABBREV.__Next.Router1<_M1>;
                    };
                    var Install : {
                        <_M1>(key: {
                            (x: _M1): __ABBREV.__Next.RouteId;
                        }, site: __ABBREV.__Next.Router1<_M1>): __ABBREV.__Next.Var1<_M1>;
                    };
                    var Merge : {
                        <_M1>(sites: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Router1<_M1>>): __ABBREV.__Next.Router1<_M1>;
                    };
                }
                module Router {
                    var Prefix : {
                        <_M1>(prefix: string, _arg1: __ABBREV.__Next.Router1<_M1>): __ABBREV.__Next.Router1<_M1>;
                    };
                    var Route : {
                        <_M1, _M2>(r: any, init: _M1, render: {
                            (x: __ABBREV.__Next.RouteId): {
                                (x: __ABBREV.__Next.Var1<_M1>): _M2;
                            };
                        }): __ABBREV.__Next.Router1<_M2>;
                    };
                }
                module Input {
                    module Mouse {
                        var get_Position : {
                            (): __ABBREV.__Next.View1<any>;
                        };
                        var get_LeftPressed : {
                            (): __ABBREV.__Next.View1<boolean>;
                        };
                        var get_MiddlePressed : {
                            (): __ABBREV.__Next.View1<boolean>;
                        };
                        var get_RightPressed : {
                            (): __ABBREV.__Next.View1<boolean>;
                        };
                        var get_MousePressed : {
                            (): __ABBREV.__Next.View1<boolean>;
                        };
                    }
                    module Keyboard {
                        var IsPressed : {
                            (key: number): __ABBREV.__Next.View1<boolean>;
                        };
                        var get_KeysPressed : {
                            (): __ABBREV.__Next.View1<__ABBREV.__List.T<number>>;
                        };
                        var get_LastPressed : {
                            (): __ABBREV.__Next.View1<number>;
                        };
                    }
                    interface Mouse {
                    }
                    interface Keyboard {
                    }
                    var MousePosSt : {
                        (): any;
                    };
                    var MouseBtnSt : {
                        (): any;
                    };
                    var ActivateButtonListener : {
                        (): void;
                    };
                    var KeyListenerState : {
                        (): any;
                    };
                    var ActivateKeyListener : {
                        (): void;
                    };
                }
                module Html {
                    module SvgAttributes {
                        var AccentHeight : {
                            (): string;
                        };
                        var Accumulate : {
                            (): string;
                        };
                        var Additive : {
                            (): string;
                        };
                        var AlignmentBaseline : {
                            (): string;
                        };
                        var Ascent : {
                            (): string;
                        };
                        var AttributeName : {
                            (): string;
                        };
                        var AttributeType : {
                            (): string;
                        };
                        var Azimuth : {
                            (): string;
                        };
                        var BaseFrequency : {
                            (): string;
                        };
                        var BaselineShift : {
                            (): string;
                        };
                        var Begin : {
                            (): string;
                        };
                        var Bias : {
                            (): string;
                        };
                        var CalcMode : {
                            (): string;
                        };
                        var Class : {
                            (): string;
                        };
                        var Clip : {
                            (): string;
                        };
                        var ClipPathUnits : {
                            (): string;
                        };
                        var ClipPath : {
                            (): string;
                        };
                        var ClipRule : {
                            (): string;
                        };
                        var Color : {
                            (): string;
                        };
                        var ColorInterpolation : {
                            (): string;
                        };
                        var ColorInterpolationFilters : {
                            (): string;
                        };
                        var ColorProfile : {
                            (): string;
                        };
                        var ColorRendering : {
                            (): string;
                        };
                        var ContentScriptType : {
                            (): string;
                        };
                        var ContentStyleType : {
                            (): string;
                        };
                        var Cursor : {
                            (): string;
                        };
                        var CX : {
                            (): string;
                        };
                        var CY : {
                            (): string;
                        };
                        var D : {
                            (): string;
                        };
                        var DiffuseConstant : {
                            (): string;
                        };
                        var Direction : {
                            (): string;
                        };
                        var Display : {
                            (): string;
                        };
                        var Divisor : {
                            (): string;
                        };
                        var DominantBaseline : {
                            (): string;
                        };
                        var Dur : {
                            (): string;
                        };
                        var DX : {
                            (): string;
                        };
                        var DY : {
                            (): string;
                        };
                        var EdgeMode : {
                            (): string;
                        };
                        var Elevation : {
                            (): string;
                        };
                        var End : {
                            (): string;
                        };
                        var ExternalResourcesRequired : {
                            (): string;
                        };
                        var Fill : {
                            (): string;
                        };
                        var FillOpacity : {
                            (): string;
                        };
                        var FillRule : {
                            (): string;
                        };
                        var Filter : {
                            (): string;
                        };
                        var FilterRes : {
                            (): string;
                        };
                        var FilterUnits : {
                            (): string;
                        };
                        var FloodColor : {
                            (): string;
                        };
                        var FloodOpacity : {
                            (): string;
                        };
                        var FontFamily : {
                            (): string;
                        };
                        var FontSize : {
                            (): string;
                        };
                        var FontSizeAdjust : {
                            (): string;
                        };
                        var FontStretch : {
                            (): string;
                        };
                        var FontStyle : {
                            (): string;
                        };
                        var FontVariant : {
                            (): string;
                        };
                        var FontWeight : {
                            (): string;
                        };
                        var From : {
                            (): string;
                        };
                        var GradientTransform : {
                            (): string;
                        };
                        var GradientUnits : {
                            (): string;
                        };
                        var Height : {
                            (): string;
                        };
                        var ImageRendering : {
                            (): string;
                        };
                        var IN : {
                            (): string;
                        };
                        var In2 : {
                            (): string;
                        };
                        var K1 : {
                            (): string;
                        };
                        var K2 : {
                            (): string;
                        };
                        var K3 : {
                            (): string;
                        };
                        var K4 : {
                            (): string;
                        };
                        var KernelMatrix : {
                            (): string;
                        };
                        var KernelUnitLength : {
                            (): string;
                        };
                        var Kerning : {
                            (): string;
                        };
                        var KeySplines : {
                            (): string;
                        };
                        var KeyTimes : {
                            (): string;
                        };
                        var LetterSpacing : {
                            (): string;
                        };
                        var LightingColor : {
                            (): string;
                        };
                        var LimitingConeAngle : {
                            (): string;
                        };
                        var Local : {
                            (): string;
                        };
                        var MarkerEnd : {
                            (): string;
                        };
                        var MarkerMid : {
                            (): string;
                        };
                        var MarkerStart : {
                            (): string;
                        };
                        var MarkerHeight : {
                            (): string;
                        };
                        var MarkerUnits : {
                            (): string;
                        };
                        var MarkerWidth : {
                            (): string;
                        };
                        var Mask : {
                            (): string;
                        };
                        var MaskContentUnits : {
                            (): string;
                        };
                        var MaskUnits : {
                            (): string;
                        };
                        var Max : {
                            (): string;
                        };
                        var Min : {
                            (): string;
                        };
                        var Mode : {
                            (): string;
                        };
                        var NumOctaves : {
                            (): string;
                        };
                        var Opacity : {
                            (): string;
                        };
                        var Operator : {
                            (): string;
                        };
                        var Order : {
                            (): string;
                        };
                        var Overflow : {
                            (): string;
                        };
                        var PaintOrder : {
                            (): string;
                        };
                        var PathLength : {
                            (): string;
                        };
                        var PatternContentUnits : {
                            (): string;
                        };
                        var PatternTransform : {
                            (): string;
                        };
                        var PatternUnits : {
                            (): string;
                        };
                        var PointerEvents : {
                            (): string;
                        };
                        var Points : {
                            (): string;
                        };
                        var PointsAtX : {
                            (): string;
                        };
                        var PointsAtY : {
                            (): string;
                        };
                        var PointsAtZ : {
                            (): string;
                        };
                        var PreserveAlpha : {
                            (): string;
                        };
                        var PreserveAspectRatio : {
                            (): string;
                        };
                        var PrimitiveUnits : {
                            (): string;
                        };
                        var R : {
                            (): string;
                        };
                        var Radius : {
                            (): string;
                        };
                        var RepeatCount : {
                            (): string;
                        };
                        var RepeatDur : {
                            (): string;
                        };
                        var RequiredFeatures : {
                            (): string;
                        };
                        var Restart : {
                            (): string;
                        };
                        var Result : {
                            (): string;
                        };
                        var RX : {
                            (): string;
                        };
                        var RY : {
                            (): string;
                        };
                        var Scale : {
                            (): string;
                        };
                        var Seed : {
                            (): string;
                        };
                        var ShapeRendering : {
                            (): string;
                        };
                        var SpecularConstant : {
                            (): string;
                        };
                        var SpecularExponent : {
                            (): string;
                        };
                        var StdDeviation : {
                            (): string;
                        };
                        var StitchTiles : {
                            (): string;
                        };
                        var StopColor : {
                            (): string;
                        };
                        var StopOpacity : {
                            (): string;
                        };
                        var Stroke : {
                            (): string;
                        };
                        var StrokeDashArray : {
                            (): string;
                        };
                        var StrokeDashOffset : {
                            (): string;
                        };
                        var StrokeLineCap : {
                            (): string;
                        };
                        var StrokeLineJoin : {
                            (): string;
                        };
                        var StrokeMiterLimit : {
                            (): string;
                        };
                        var StrokeOpacity : {
                            (): string;
                        };
                        var StrokeWidth : {
                            (): string;
                        };
                        var Style : {
                            (): string;
                        };
                        var SurfaceScale : {
                            (): string;
                        };
                        var TargetX : {
                            (): string;
                        };
                        var TargetY : {
                            (): string;
                        };
                        var TextAnchor : {
                            (): string;
                        };
                        var TextDecoration : {
                            (): string;
                        };
                        var TextRendering : {
                            (): string;
                        };
                        var To : {
                            (): string;
                        };
                        var Transform : {
                            (): string;
                        };
                        var Type : {
                            (): string;
                        };
                        var Values : {
                            (): string;
                        };
                        var ViewBox : {
                            (): string;
                        };
                        var Visibility : {
                            (): string;
                        };
                        var Width : {
                            (): string;
                        };
                        var WordSpacing : {
                            (): string;
                        };
                        var WritingMode : {
                            (): string;
                        };
                        var X : {
                            (): string;
                        };
                        var X1 : {
                            (): string;
                        };
                        var X2 : {
                            (): string;
                        };
                        var XChannelSelector : {
                            (): string;
                        };
                        var Y : {
                            (): string;
                        };
                        var Y1 : {
                            (): string;
                        };
                        var Y2 : {
                            (): string;
                        };
                        var YChannelSelector : {
                            (): string;
                        };
                        var Z : {
                            (): string;
                        };
                    }
                    module SvgElements {
                        var A : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var AltGlyph : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var AltGlyphDef : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var AltGlyphItem : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Animate : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var AnimateColor : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var AnimateMotion : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var AnimateTransform : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Circle : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var ClipPath : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var ColorProfile : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Cursor : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Defs : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Desc : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Ellipse : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeBlend : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeColorMatrix : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeComponentTransfer : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeComposite : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeConvolveMatrix : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeDiffuseLighting : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeDisplacementMap : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeDistantLight : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeFlood : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeFuncA : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeFuncB : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeFuncG : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeFuncR : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeGaussianBlur : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeImage : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeMerge : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeMergeNode : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeMorphology : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeOffset : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FePointLight : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeSpecularLighting : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeSpotLight : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeTile : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FeTurbulence : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Filter : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Font : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FontFace : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FontFaceFormat : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FontFaceName : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FontFaceSrc : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FontFaceUri : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var ForeignObject : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var G : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Glyph : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var GlyphRef : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var HKern : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Image : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Line : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var LinearGradient : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Marker : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Mask : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Metadata : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var MissingGlyph : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var MPath : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Path : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Pattern : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Polygon : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Polyline : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var RadialGradient : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Rect : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Script : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Set : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Stop : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Style : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Svg : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Switch : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Symbol : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Text : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var TextPath : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Title : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var TRef : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var TSpan : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Use : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var View : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var VKern : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                    }
                    module Attributes {
                        var Accept : {
                            (): string;
                        };
                        var AcceptCharset : {
                            (): string;
                        };
                        var Accesskey : {
                            (): string;
                        };
                        var Action : {
                            (): string;
                        };
                        var Align : {
                            (): string;
                        };
                        var Alt : {
                            (): string;
                        };
                        var Async : {
                            (): string;
                        };
                        var AutoComplete : {
                            (): string;
                        };
                        var AutoFocus : {
                            (): string;
                        };
                        var AutoPlay : {
                            (): string;
                        };
                        var AutoSave : {
                            (): string;
                        };
                        var BgColor : {
                            (): string;
                        };
                        var Border : {
                            (): string;
                        };
                        var Buffered : {
                            (): string;
                        };
                        var Challenge : {
                            (): string;
                        };
                        var Charset : {
                            (): string;
                        };
                        var Checked : {
                            (): string;
                        };
                        var Cite : {
                            (): string;
                        };
                        var Class : {
                            (): string;
                        };
                        var Code : {
                            (): string;
                        };
                        var Codebase : {
                            (): string;
                        };
                        var Color : {
                            (): string;
                        };
                        var Cols : {
                            (): string;
                        };
                        var ColSpan : {
                            (): string;
                        };
                        var Content : {
                            (): string;
                        };
                        var ContentEditable : {
                            (): string;
                        };
                        var ContextMenu : {
                            (): string;
                        };
                        var Controls : {
                            (): string;
                        };
                        var Coords : {
                            (): string;
                        };
                        var Datetime : {
                            (): string;
                        };
                        var Default : {
                            (): string;
                        };
                        var Defer : {
                            (): string;
                        };
                        var Dir : {
                            (): string;
                        };
                        var DirName : {
                            (): string;
                        };
                        var Disabled : {
                            (): string;
                        };
                        var Download : {
                            (): string;
                        };
                        var Draggable : {
                            (): string;
                        };
                        var Dropzone : {
                            (): string;
                        };
                        var EncType : {
                            (): string;
                        };
                        var For : {
                            (): string;
                        };
                        var Form : {
                            (): string;
                        };
                        var FormAction : {
                            (): string;
                        };
                        var Headers : {
                            (): string;
                        };
                        var Height : {
                            (): string;
                        };
                        var Hidden : {
                            (): string;
                        };
                        var High : {
                            (): string;
                        };
                        var Href : {
                            (): string;
                        };
                        var HrefLang : {
                            (): string;
                        };
                        var HttpEquiv : {
                            (): string;
                        };
                        var Icon : {
                            (): string;
                        };
                        var ID : {
                            (): string;
                        };
                        var IsMap : {
                            (): string;
                        };
                        var ItemProp : {
                            (): string;
                        };
                        var KeyType : {
                            (): string;
                        };
                        var Kind : {
                            (): string;
                        };
                        var Label : {
                            (): string;
                        };
                        var Lang : {
                            (): string;
                        };
                        var Language : {
                            (): string;
                        };
                        var List : {
                            (): string;
                        };
                        var Loop : {
                            (): string;
                        };
                        var Low : {
                            (): string;
                        };
                        var Manifest : {
                            (): string;
                        };
                        var Max : {
                            (): string;
                        };
                        var MaxLength : {
                            (): string;
                        };
                        var Media : {
                            (): string;
                        };
                        var Method : {
                            (): string;
                        };
                        var Min : {
                            (): string;
                        };
                        var Multiple : {
                            (): string;
                        };
                        var Name : {
                            (): string;
                        };
                        var NoValidate : {
                            (): string;
                        };
                        var Open : {
                            (): string;
                        };
                        var Optimum : {
                            (): string;
                        };
                        var Pattern : {
                            (): string;
                        };
                        var Ping : {
                            (): string;
                        };
                        var Placeholder : {
                            (): string;
                        };
                        var Poster : {
                            (): string;
                        };
                        var Preload : {
                            (): string;
                        };
                        var PubDate : {
                            (): string;
                        };
                        var RadioGroup : {
                            (): string;
                        };
                        var Readonly : {
                            (): string;
                        };
                        var Rel : {
                            (): string;
                        };
                        var Required : {
                            (): string;
                        };
                        var Reversed : {
                            (): string;
                        };
                        var Rows : {
                            (): string;
                        };
                        var RowSpan : {
                            (): string;
                        };
                        var Sandbox : {
                            (): string;
                        };
                        var Spellcheck : {
                            (): string;
                        };
                        var Scope : {
                            (): string;
                        };
                        var Scoped : {
                            (): string;
                        };
                        var Seamless : {
                            (): string;
                        };
                        var Selected : {
                            (): string;
                        };
                        var Shape : {
                            (): string;
                        };
                        var Size : {
                            (): string;
                        };
                        var Sizes : {
                            (): string;
                        };
                        var Span : {
                            (): string;
                        };
                        var Src : {
                            (): string;
                        };
                        var Srcdoc : {
                            (): string;
                        };
                        var SrcLang : {
                            (): string;
                        };
                        var Start : {
                            (): string;
                        };
                        var Step : {
                            (): string;
                        };
                        var Style : {
                            (): string;
                        };
                        var Summary : {
                            (): string;
                        };
                        var TabIndex : {
                            (): string;
                        };
                        var Target : {
                            (): string;
                        };
                        var Title : {
                            (): string;
                        };
                        var Type : {
                            (): string;
                        };
                        var Usemap : {
                            (): string;
                        };
                        var Value : {
                            (): string;
                        };
                        var Width : {
                            (): string;
                        };
                        var Wrap : {
                            (): string;
                        };
                    }
                    module Elements {
                        var A : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Abbr : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Address : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Area : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Article : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Aside : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Audio : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var B : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Base : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var BDI : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var BDO : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var BlockQuote : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Body : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Br : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Button : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Canvas : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Caption : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Cite : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Code : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Col : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var ColGroup : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Data : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var DataList : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var DD : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Del : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Details : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var DFN : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Div : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var DL : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var DT : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Em : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Embed : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FieldSet : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var FigCaption : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Figure : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Footer : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Form : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var H1 : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var H2 : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var H3 : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var H4 : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var H5 : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var H6 : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Head : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Header : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var HR : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Html : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var I : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var IFrame : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Img : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Input : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Ins : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Kbd : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Keygen : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Label : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Legend : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var LI : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Link : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Main : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Map : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Mark : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Menu : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var MenuItem : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Meta : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Meter : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Nav : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var NoScript : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Object : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var OL : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var OptGroup : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Option : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Output : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var P : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Param : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Picture : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Pre : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Progress : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Q : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var RP : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var RT : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Ruby : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var S : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Samp : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Script : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Section : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Select : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Small : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Source : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Span : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Strong : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Style : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Sub : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Summary : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Sup : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Table : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var TBody : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var TD : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var TextArea : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var TFoot : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var TH : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var THead : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Time : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Title : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var TR : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Track : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var U : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var UL : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Var : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var Video : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                        var WBR : {
                            (ats: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                        };
                    }
                    var A : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var A0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Del : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Del0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Div : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Div0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Form : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Form0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var H1 : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var H10 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var H2 : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var H20 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var H3 : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var H30 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var H4 : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var H40 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var H5 : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var H50 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var H6 : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var H60 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var LI : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var LI0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Label : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Label0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Nav : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Nav0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var P : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var P0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Span : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Span0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Table : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var Table0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var TBody : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var TBody0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var THead : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var THead0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var TR : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var TR0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var TD : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var TD0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var UL : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var UL0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var OL : {
                        (atr: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>, ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                    var OL0 : {
                        (ch: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                    };
                }
                interface Var1<_T1> {
                    get_View(): __ABBREV.__Next.View1<_T1>;
                    get_Value(): _T1;
                    set_Value(value: _T1): void;
                    Const: boolean;
                    Current: _T1;
                    Snap: any;
                    Id: number;
                }
                interface View1<_T1> {
                }
                interface Var {
                }
                interface View {
                }
                interface ViewBuilder {
                    Bind<_M1, _M2>(x: __ABBREV.__Next.View1<_M1>, f: {
                        (x: _M1): __ABBREV.__Next.View1<_M2>;
                    }): __ABBREV.__Next.View1<_M2>;
                    Return<_M1>(x: _M1): __ABBREV.__Next.View1<_M1>;
                }
                interface Key {
                }
                interface Model1<_T1, _T2> {
                    get_View(): __ABBREV.__Next.View1<_T1>;
                }
                interface Model {
                }
                interface ListModel1<_T1, _T2> {
                    Add(item: _T2): void;
                    Remove(item: _T2): void;
                    RemoveByKey(key: _T1): void;
                    Iter(fn: {
                        (x: _T2): void;
                    }): void;
                    Set(lst: __ABBREV.__WebSharper.seq<_T2>): void;
                    ContainsKey(key: _T1): boolean;
                    FindByKey(key: _T1): _T2;
                    UpdateBy(fn: {
                        (x: _T2): __ABBREV.__WebSharper.OptionProxy<_T2>;
                    }, key: _T1): void;
                    Clear(): void;
                    Key: {
                        (x: _T2): _T1;
                    };
                    Var: __ABBREV.__Next.Var1<_T2[]>;
                    View: __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<_T2>>;
                }
                interface ListModel {
                }
                interface Interpolation1<_T1> {
                    Interpolate(x0: number, x1: _T1, x2: _T1): _T1;
                }
                interface Interpolation {
                }
                interface Easing {
                    TransformTime: {
                        (x: number): number;
                    };
                }
                interface Anim<_T1> {
                    Compute: {
                        (x: number): _T1;
                    };
                    Duration: number;
                }
                interface An {
                }
                interface Trans1<_T1> {
                    TChange: {
                        (x: _T1): {
                            (x: _T1): any;
                        };
                    };
                    TEnter: {
                        (x: _T1): any;
                    };
                    TExit: {
                        (x: _T1): any;
                    };
                    TFlags: any;
                }
                interface Trans {
                }
                interface Attr {
                    Flags: any;
                    Tree: __ABBREV.__Next.AttrTree;
                }
                interface Doc {
                    DocNode: __ABBREV.__Next.DocNode;
                    Updates: __ABBREV.__Next.View1<void>;
                }
                interface Flow1<_T1> {
                    Render: {
                        (x: __ABBREV.__Next.Var1<__ABBREV.__Next.Doc>): {
                            (x: {
                                (x: _T1): void;
                            }): void;
                        };
                    };
                }
                interface Flow {
                }
                interface FlowBuilder {
                    Bind<_M1, _M2>(comp: any, func: {
                        (x: _M1): any;
                    }): any;
                    Return<_M1>(value: _M1): any;
                    ReturnFrom<_M1>(inner: any): any;
                }
                interface RouteMap1<_T1> {
                    Des: {
                        (x: __ABBREV.__List.T<string>): _T1;
                    };
                    Ser: {
                        (x: _T1): __ABBREV.__List.T<string>;
                    };
                }
                interface RouteId {
                }
                interface Router1<_T1> {
                }
                interface RouteMap {
                }
                interface Router {
                }
            }
        }
    }
}
declare module __ABBREV {
    
    export import __Next = IntelliFactory.WebSharper.UI.Next;
    export import __WebSharper = IntelliFactory.WebSharper;
    export import __Dom = IntelliFactory.WebSharper.JavaScript.Dom;
    export import __Client = IntelliFactory.WebSharper.Html.Client;
    export import __List = IntelliFactory.WebSharper.List;
}

declare module IntelliFactory {
    module WebSharper {
        module Testing {
            module Assert {
                var Raises : {
                    (f: {
                        (): void;
                    }): void;
                };
                var For : {
                    <_M1>(times: number, gen: any, attempt: {
                        (x: _M1): void;
                    }): void;
                };
            }
            module Random {
                interface Generator<_T1> {
                    Base: _T1[];
                    Next: {
                        (): _T1;
                    };
                }
                var Map : {
                    <_M1, _M2>(f: {
                        (x: _M1): _M2;
                    }, gen: any): any;
                };
                var Implies : {
                    (a: boolean, b: boolean): boolean;
                };
                var Imply : {
                    (a: boolean, b: boolean): boolean;
                };
                var Exponential : {
                    (lambda: number): any;
                };
                var Within : {
                    (low: number, hi: number): any;
                };
                var FloatWithin : {
                    (low: number, hi: number): any;
                };
                var ArrayOf : {
                    <_M1>(generator: any): any;
                };
                var ListOf : {
                    <_M1>(generator: any): any;
                };
                var Tuple2Of : {
                    <_M1, _M2>(a: any, b: any): any;
                };
                var Tuple3Of : {
                    <_M1, _M2, _M3>(a: any, b: any, c: any): any;
                };
                var OneOf : {
                    <_M1>(seeds: _M1[]): any;
                };
                var Mix : {
                    <_M1>(a: any, b: any): any;
                };
                var Const : {
                    <_M1>(x: _M1): any;
                };
                var OptionOf : {
                    <_M1>(generator: any): any;
                };
                var StandardUniform : {
                    (): any;
                };
                var Boolean : {
                    (): any;
                };
                var Float : {
                    (): any;
                };
                var FloatExhaustive : {
                    (): any;
                };
                var Int : {
                    (): any;
                };
                var Natural : {
                    (): any;
                };
                var String : {
                    (): any;
                };
                var StringExhaustive : {
                    (): any;
                };
            }
            module Pervasives {
                interface TestBuilder {
                    Delay(f: {
                        (): void;
                    }): void;
                    Zero(): void;
                }
                var Test : {
                    (name: string): __ABBREV.__Pervasives.TestBuilder;
                };
                var Is : {
                    <_M1>(a: _M1, b: _M1): void;
                };
                var Isnt : {
                    <_M1>(a: _M1, b: _M1): void;
                };
            }
        }
    }
}
declare module __ABBREV {
    
    export import __Pervasives = IntelliFactory.WebSharper.Testing.Pervasives;
}

declare module IntelliFactory {
    module WebSharper {
        module Control {
            module MailboxProcessor {
                var Start : {
                    (initial: {
                        (x: __ABBREV.__Control.MailboxProcessor<any>): any;
                    }, token: __ABBREV.__WebSharper.OptionProxy<__ABBREV.__WebSharper.CancellationTokenProxy>): __ABBREV.__Control.MailboxProcessor<any>;
                };
            }
            module EventModule {
                var Choose : {
                    <_M1, _M2, _M3>(c: {
                        (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                    }, e: any): any;
                };
                var Filter : {
                    <_M1, _M2>(ok: {
                        (x: _M1): boolean;
                    }, e: any): any;
                };
                var Map : {
                    <_M1, _M2, _M3>(f: {
                        (x: _M1): _M2;
                    }, e: any): any;
                };
                var Merge : {
                    <_M1, _M2, _M3>(e1: any, e2: any): any;
                };
                var Pairwise : {
                    <_M1, _M2>(e: any): any;
                };
                var Partition : {
                    <_M1, _M2>(f: {
                        (x: _M1): boolean;
                    }, e: any): any;
                };
                var Scan : {
                    <_M1, _M2, _M3>(fold: {
                        (x: _M1): {
                            (x: _M2): _M1;
                        };
                    }, seed: _M1, e: any): any;
                };
                var Split : {
                    <_M1, _M2, _M3, _M4>(f: {
                        (x: _M1): __ABBREV.__WebSharper.ChoiceProxy3<_M2, _M3>;
                    }, e: any): any;
                };
            }
            module ObservableModule {
                var Pairwise : {
                    <_M1>(e: __ABBREV.__Control.IObservableProxy<_M1>): __ABBREV.__Control.IObservableProxy<any>;
                };
                var Partition : {
                    <_M1>(f: {
                        (x: _M1): boolean;
                    }, e: __ABBREV.__Control.IObservableProxy<_M1>): any;
                };
                var Scan : {
                    <_M1, _M2>(fold: {
                        (x: _M1): {
                            (x: _M2): _M1;
                        };
                    }, seed: _M1, e: __ABBREV.__Control.IObservableProxy<_M2>): __ABBREV.__Control.IObservableProxy<_M1>;
                };
                var Split : {
                    <_M1, _M2, _M3>(f: {
                        (x: _M1): __ABBREV.__WebSharper.ChoiceProxy3<_M2, _M3>;
                    }, e: __ABBREV.__Control.IObservableProxy<_M1>): any;
                };
            }
            interface IObserverProxy<_T1> {
                OnCompleted(): void;
                OnError(x0: __ABBREV.__WebSharper.ExceptionProxy): void;
                OnNext(x0: _T1): void;
            }
            interface IObservableProxy<_T1> {
                Subscribe(x0: __ABBREV.__Control.IObserverProxy<_T1>): __ABBREV.__WebSharper.IDisposableProxy;
            }
            interface FSharpEvent<_T1> {
            }
            interface IDelegateEventProxy<_T1> {
                AddHandler(x0: _T1): void;
                RemoveHandler(x0: _T1): void;
            }
            interface ChannelProxy<_T1> {
            }
            interface TimeoutExceptionProxy {
            }
            interface MailboxProcessor<_T1> {
                Start(): void;
                TryReceive(timeout: __ABBREV.__WebSharper.OptionProxy<number>): any;
                Receive(timeout: __ABBREV.__WebSharper.OptionProxy<number>): any;
                PostAndTryAsyncReply<_M1>(msgf: {
                    (x: __ABBREV.__Control.ChannelProxy<_M1>): _T1;
                }, timeout: __ABBREV.__WebSharper.OptionProxy<number>): any;
                PostAndAsyncReply<_M1>(msgf: {
                    (x: __ABBREV.__Control.ChannelProxy<_M1>): _T1;
                }, timeout: __ABBREV.__WebSharper.OptionProxy<number>): any;
                TryScan<_M1>(scanner: {
                    (x: _T1): __ABBREV.__WebSharper.OptionProxy<any>;
                }, timeout: __ABBREV.__WebSharper.OptionProxy<number>): any;
                Scan<_M1>(scanner: {
                    (x: _T1): __ABBREV.__WebSharper.OptionProxy<any>;
                }, timeout: __ABBREV.__WebSharper.OptionProxy<number>): any;
                startAsync(a: any): void;
                resume(): void;
                dequeue(): _T1;
                get_Error(): any;
                get_DefaultTimeout(): number;
                set_DefaultTimeout(v: number): void;
                get_CurrentQueueLength(): number;
            }
        }
    }
}
declare module __ABBREV {
    
    export import __Control = IntelliFactory.WebSharper.Control;
    export import __WebSharper = IntelliFactory.WebSharper;
}

declare module IntelliFactory {
    module Reactive {
        module HotStream {
            var New1 : {
                (): __ABBREV.__Reactive.HotStream<any>;
            };
            var New : {
                <_M1>(x: any): __ABBREV.__Reactive.HotStream<any>;
            };
        }
        module Reactive {
            var Return : {
                <_M1>(x: _M1): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Never : {
                <_M1>(): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Select : {
                <_M1, _M2>(io: __ABBREV.__Control.IObservableProxy<_M1>, f: {
                    (x: _M1): _M2;
                }): __ABBREV.__Control.IObservableProxy<_M2>;
            };
            var Where : {
                <_M1>(io: __ABBREV.__Control.IObservableProxy<_M1>, f: {
                    (x: _M1): boolean;
                }): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Choose : {
                <_M1, _M2>(io: __ABBREV.__Control.IObservableProxy<_M1>, f: {
                    (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
                }): __ABBREV.__Control.IObservableProxy<_M2>;
            };
            var Drop : {
                <_M1>(io: __ABBREV.__Control.IObservableProxy<_M1>, count: number): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Merge : {
                <_M1>(io1: __ABBREV.__Control.IObservableProxy<_M1>, io2: __ABBREV.__Control.IObservableProxy<_M1>): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Concat : {
                <_M1>(io1: __ABBREV.__Control.IObservableProxy<_M1>, io2: __ABBREV.__Control.IObservableProxy<_M1>): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Range : {
                (start: number, count: number): __ABBREV.__Control.IObservableProxy<number>;
            };
            var CombineLatest : {
                <_M1, _M2, _M3>(io1: __ABBREV.__Control.IObservableProxy<_M1>, io2: __ABBREV.__Control.IObservableProxy<_M2>, f: {
                    (x: _M1): {
                        (x: _M2): _M3;
                    };
                }): __ABBREV.__Control.IObservableProxy<_M3>;
            };
            var Switch : {
                <_M1>(io: __ABBREV.__Control.IObservableProxy<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var SelectMany : {
                <_M1>(io: __ABBREV.__Control.IObservableProxy<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Aggregate : {
                <_M1, _M2>(io: __ABBREV.__Control.IObservableProxy<_M1>, seed: _M2, acc: {
                    (x: _M2): {
                        (x: _M1): _M2;
                    };
                }): __ABBREV.__Control.IObservableProxy<_M2>;
            };
            var CollectLatest : {
                <_M1>(outer: __ABBREV.__Control.IObservableProxy<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<__ABBREV.__WebSharper.seq<_M1>>;
            };
            var Sequence : {
                <_M1>(ios: __ABBREV.__WebSharper.seq<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<__ABBREV.__WebSharper.seq<_M1>>;
            };
            var Heat : {
                <_M1>(io: __ABBREV.__Control.IObservableProxy<_M1>): __ABBREV.__Control.IObservableProxy<_M1>;
            };
            var Default : {
                (): __ABBREV.__Reactive.IReactive;
            };
        }
        interface IReactive {
            Return<_M1>(x0: _M1): __ABBREV.__Control.IObservableProxy<_M1>;
            Never<_M1>(): __ABBREV.__Control.IObservableProxy<_M1>;
            Select<_M1, _M2>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: {
                (x: _M1): _M2;
            }): __ABBREV.__Control.IObservableProxy<_M2>;
            Concat<_M1>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: __ABBREV.__Control.IObservableProxy<_M1>): __ABBREV.__Control.IObservableProxy<_M1>;
            Merge<_M1>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: __ABBREV.__Control.IObservableProxy<_M1>): __ABBREV.__Control.IObservableProxy<_M1>;
            Switch<_M1>(x0: __ABBREV.__Control.IObservableProxy<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<_M1>;
            SelectMany<_M1>(x0: __ABBREV.__Control.IObservableProxy<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<_M1>;
            CollectLatest<_M1>(x0: __ABBREV.__Control.IObservableProxy<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<__ABBREV.__WebSharper.seq<_M1>>;
            CombineLatest<_M1, _M2, _M3>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: __ABBREV.__Control.IObservableProxy<_M2>, x2: {
                (x: _M1): {
                    (x: _M2): _M3;
                };
            }): __ABBREV.__Control.IObservableProxy<_M3>;
            Heat<_M1>(x0: __ABBREV.__Control.IObservableProxy<_M1>): __ABBREV.__Control.IObservableProxy<_M1>;
            Aggregate<_M1, _M2>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: _M2, x2: {
                (x: _M2): {
                    (x: _M1): _M2;
                };
            }): __ABBREV.__Control.IObservableProxy<_M2>;
            Choose<_M1, _M2>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: {
                (x: _M1): __ABBREV.__WebSharper.OptionProxy<_M2>;
            }): __ABBREV.__Control.IObservableProxy<_M2>;
            Where<_M1>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: {
                (x: _M1): boolean;
            }): __ABBREV.__Control.IObservableProxy<_M1>;
            Drop<_M1>(x0: __ABBREV.__Control.IObservableProxy<_M1>, x1: number): __ABBREV.__Control.IObservableProxy<_M1>;
            Sequence<_M1>(x0: __ABBREV.__WebSharper.seq<__ABBREV.__Control.IObservableProxy<_M1>>): __ABBREV.__Control.IObservableProxy<__ABBREV.__WebSharper.seq<_M1>>;
        }
        interface HotStream<_T1> {
            Trigger(v: _T1): void;
            Subscribe(o: __ABBREV.__Control.IObserverProxy<_T1>): __ABBREV.__WebSharper.IDisposableProxy;
            Latest: __ABBREV.__WebSharper.ref<__ABBREV.__WebSharper.OptionProxy<_T1>>;
            Event: __ABBREV.__Control.FSharpEvent<_T1>;
        }
    }
}
declare module __ABBREV {
    
    export import __Reactive = IntelliFactory.Reactive;
    export import __Control = IntelliFactory.WebSharper.Control;
    export import __WebSharper = IntelliFactory.WebSharper;
}

declare module IntelliFactory {
    module Formlets {
        module Base {
            module Tree {
                interface Edit<_T1> {
                    GetEnumerator(): __ABBREV.__WebSharper.IEnumeratorProxy1;
                    GetEnumerator1(): __ABBREV.__WebSharper.IEnumeratorProxy<_T1>;
                    get_Sequence(): __ABBREV.__WebSharper.seq<_T1>;
                }
                interface Tree<_T1> {
                    Map<_M1>(f: {
                        (x: _T1): _M1;
                    }): __ABBREV.__Tree.Tree<_M1>;
                    GetEnumerator(): __ABBREV.__WebSharper.IEnumeratorProxy1;
                    GetEnumerator1(): __ABBREV.__WebSharper.IEnumeratorProxy<_T1>;
                    get_Sequence(): __ABBREV.__WebSharper.seq<_T1>;
                }
                var ShowEdit : {
                    <_M1>(edit: __ABBREV.__Tree.Edit<_M1>): string;
                };
                var Count : {
                    <_M1>(t: __ABBREV.__Tree.Tree<_M1>): number;
                };
                var Range : {
                    <_M1>(edit: __ABBREV.__Tree.Edit<_M1>, input: __ABBREV.__Tree.Tree<_M1>): any;
                };
                var FromSequence : {
                    <_M1>(vs: __ABBREV.__WebSharper.seq<_M1>): __ABBREV.__Tree.Tree<_M1>;
                };
                var ReplacedTree : {
                    <_M1>(edit: __ABBREV.__Tree.Edit<_M1>, input: __ABBREV.__Tree.Tree<_M1>): __ABBREV.__Tree.Tree<_M1>;
                };
                var Apply : {
                    <_M1>(edit: __ABBREV.__Tree.Edit<_M1>, input: __ABBREV.__Tree.Tree<_M1>): __ABBREV.__Tree.Tree<_M1>;
                };
                var Set : {
                    <_M1>(value: _M1): __ABBREV.__Tree.Edit<_M1>;
                };
                var Transform : {
                    <_M1, _M2>(f: {
                        (x: __ABBREV.__Tree.Tree<_M1>): __ABBREV.__Tree.Tree<_M2>;
                    }, edit: __ABBREV.__Tree.Edit<_M1>): __ABBREV.__Tree.Edit<_M2>;
                };
                var Delete : {
                    <_M1>(): __ABBREV.__Tree.Edit<_M1>;
                };
                var FlipEdit : {
                    <_M1>(edit: __ABBREV.__Tree.Edit<_M1>): __ABBREV.__Tree.Edit<_M1>;
                };
                var DeepFlipEdit : {
                    <_M1>(edit: __ABBREV.__Tree.Edit<_M1>): __ABBREV.__Tree.Edit<_M1>;
                };
            }
            module Result {
                var Join : {
                    (res: __ABBREV.__Base.Result<__ABBREV.__Base.Result<any>>): __ABBREV.__Base.Result<any>;
                };
                var Apply : {
                    <_M1>(f: __ABBREV.__Base.Result<{
                        (x: any): _M1;
                    }>, r: __ABBREV.__Base.Result<any>): __ABBREV.__Base.Result<_M1>;
                };
                var OfOption : {
                    (o: __ABBREV.__WebSharper.OptionProxy<any>): __ABBREV.__Base.Result<any>;
                };
                var Map : {
                    <_M1>(f: {
                        (x: any): _M1;
                    }, res: __ABBREV.__Base.Result<any>): __ABBREV.__Base.Result<_M1>;
                };
                var Sequence : {
                    (rs: __ABBREV.__WebSharper.seq<__ABBREV.__Base.Result<any>>): __ABBREV.__Base.Result<__ABBREV.__List.T<any>>;
                };
            }
            interface Layout<_T1> {
                Apply: {
                    (x: any): __ABBREV.__WebSharper.OptionProxy<any>;
                };
            }
            interface Container<_T1> {
                Body: _T1;
                SyncRoot: __ABBREV.__WebSharper.ObjectProxy;
                Insert: {
                    (x: number): {
                        (x: _T1): void;
                    };
                };
                Remove: {
                    (x: __ABBREV.__WebSharper.seq<_T1>): void;
                };
            }
            interface Reactive {
                Reactive: __ABBREV.__Reactive.IReactive;
            }
            interface LayoutUtils {
                Default<_M1>(): any;
                Delay<_M1>(f: {
                    (): any;
                }): any;
                New<_M1>(container: {
                    (): any;
                }): any;
            }
            interface Result<_T1> {
            }
            interface Form<_T1, _T2> {
                Dispose(): void;
                Body: any;
                Dispose1: {
                    (): void;
                };
                Notify: {
                    (x: __ABBREV.__WebSharper.ObjectProxy): void;
                };
                State: any;
            }
            interface IFormlet<_T1, _T2> {
                Build(): __ABBREV.__Base.Form<_T1, _T2>;
                MapResult<_M1>(x0: {
                    (x: __ABBREV.__Base.Result<_T2>): __ABBREV.__Base.Result<_M1>;
                }): __ABBREV.__Base.IFormlet<_T1, _T2>;
                get_Layout(): any;
            }
            interface Utils<_T1> {
                Reactive: __ABBREV.__Reactive.IReactive;
                DefaultLayout: any;
            }
            interface FormletProvider<_T1> {
                BuildForm<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.Form<_T1, _M1>;
                New<_M1>(build: {
                    (): __ABBREV.__Base.Form<_T1, _M1>;
                }): __ABBREV.__Base.IFormlet<_T1, _M1>;
                FromState<_M1>(state: any): __ABBREV.__Base.IFormlet<_T1, _M1>;
                WithLayout<_M1>(layout: any, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                InitWith<_M1>(value: _M1, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                ReplaceFirstWithFailure<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                InitWithFailure<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                ApplyLayout<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                AppendLayout<_M1>(layout: any, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                MapBody<_M1>(f: {
                    (x: _T1): _T1;
                }, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                WithLayoutOrDefault<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                MapResult<_M1, _M2>(f: {
                    (x: __ABBREV.__Base.Result<_M1>): __ABBREV.__Base.Result<_M2>;
                }, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M2>;
                Map<_M1, _M2>(f: {
                    (x: _M1): _M2;
                }, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M2>;
                Apply<_M1, _M2>(f: __ABBREV.__Base.IFormlet<_T1, {
                    (x: _M1): _M2;
                }>, x: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M2>;
                Return<_M1>(x: _M1): __ABBREV.__Base.IFormlet<_T1, _M1>;
                Fail<_M1>(fs: __ABBREV.__List.T<string>): __ABBREV.__Base.Form<_T1, _M1>;
                FailWith<_M1>(fs: __ABBREV.__List.T<string>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                ReturnEmpty<_M1>(x: _M1): __ABBREV.__Base.IFormlet<_T1, _M1>;
                Never<_M1>(): __ABBREV.__Base.IFormlet<_T1, _M1>;
                Empty<_M1>(): __ABBREV.__Base.IFormlet<_T1, _M1>;
                EmptyForm<_M1>(): __ABBREV.__Base.Form<_T1, _M1>;
                Join<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, __ABBREV.__Base.IFormlet<_T1, _M1>>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                Switch<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, __ABBREV.__Base.IFormlet<_T1, _M1>>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                FlipBody<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                SelectMany<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, __ABBREV.__Base.IFormlet<_T1, _M1>>): __ABBREV.__Base.IFormlet<_T1, __ABBREV.__List.T<_M1>>;
                WithNotificationChannel<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, any>;
                Replace<_M1, _M2>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>, f: {
                    (x: _M1): __ABBREV.__Base.IFormlet<_T1, _M2>;
                }): __ABBREV.__Base.IFormlet<_T1, _M2>;
                Deletable<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, __ABBREV.__WebSharper.OptionProxy<_M1>>): __ABBREV.__Base.IFormlet<_T1, __ABBREV.__WebSharper.OptionProxy<_M1>>;
                WithCancelation<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>, cancelFormlet: __ABBREV.__Base.IFormlet<_T1, void>): __ABBREV.__Base.IFormlet<_T1, __ABBREV.__WebSharper.OptionProxy<_M1>>;
                Bind<_M1, _M2>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>, f: {
                    (x: _M1): __ABBREV.__Base.IFormlet<_T1, _M2>;
                }): __ABBREV.__Base.IFormlet<_T1, _M2>;
                Delay<_M1>(f: {
                    (): __ABBREV.__Base.IFormlet<_T1, _M1>;
                }): __ABBREV.__Base.IFormlet<_T1, _M1>;
                Sequence<_M1, _M2>(fs: __ABBREV.__WebSharper.seq<__ABBREV.__Base.IFormlet<_T1, _M2>>): __ABBREV.__Base.IFormlet<_T1, __ABBREV.__List.T<_M2>>;
                LiftResult<_M1>(formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, __ABBREV.__Base.Result<_M1>>;
                WithNotification<_M1>(notify: {
                    (x: __ABBREV.__WebSharper.ObjectProxy): void;
                }, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>): __ABBREV.__Base.IFormlet<_T1, _M1>;
                BindWith<_M1, _M2>(hF: {
                    (x: _T1): {
                        (x: _T1): _T1;
                    };
                }, formlet: __ABBREV.__Base.IFormlet<_T1, _M1>, f: {
                    (x: _M1): __ABBREV.__Base.IFormlet<_T1, _M2>;
                }): __ABBREV.__Base.IFormlet<_T1, _M2>;
            }
            interface FormletBuilder<_T1> {
                Return<_M1>(x: _M1): __ABBREV.__Base.IFormlet<_T1, _M1>;
                Bind<_M1, _M2>(x: __ABBREV.__Base.IFormlet<_T1, _M1>, f: {
                    (x: _M1): __ABBREV.__Base.IFormlet<_T1, _M2>;
                }): __ABBREV.__Base.IFormlet<_T1, _M2>;
                Delay<_M1>(f: {
                    (): __ABBREV.__Base.IFormlet<_T1, _M1>;
                }): __ABBREV.__Base.IFormlet<_T1, _M1>;
                ReturnFrom<_M1>(f: _M1): _M1;
            }
            interface IValidatorProvider {
                Matches(x0: string, x1: string): boolean;
            }
            interface Validator {
                Validate<_M1, _M2, _M3>(f: {
                    (x: _M2): boolean;
                }, msg: string, flet: _M3): _M3;
                Is<_M1, _M2, _M3>(f: {
                    (x: _M1): boolean;
                }, m: string, flet: _M2): _M2;
                IsNotEmpty<_M1, _M2>(msg: string, flet: _M2): _M2;
                IsRegexMatch<_M1, _M2>(regex: string, msg: string, flet: _M1): _M1;
                IsEmail<_M1, _M2>(msg: string): {
                    (x: _M1): _M1;
                };
                IsInt<_M1, _M2>(msg: string): {
                    (x: _M1): _M1;
                };
                IsFloat<_M1, _M2>(msg: string): {
                    (x: _M1): _M1;
                };
                IsTrue<_M1, _M2>(msg: string, flet: _M1): _M1;
                IsGreaterThan<_M1, _M2, _M3>(min: _M1, msg: string, flet: _M2): _M2;
                IsLessThan<_M1, _M2, _M3>(max: _M1, msg: string, flet: _M2): _M2;
                IsEqual<_M1, _M2, _M3>(value: _M1, msg: string, flet: _M2): _M2;
                IsNotEqual<_M1, _M2, _M3>(value: _M1, msg: string, flet: _M2): _M2;
            }
        }
    }
}
declare module __ABBREV {
    
    export import __WebSharper = IntelliFactory.WebSharper;
    export import __Tree = IntelliFactory.Formlets.Base.Tree;
    export import __Base = IntelliFactory.Formlets.Base;
    export import __List = IntelliFactory.WebSharper.List;
    export import __Reactive = IntelliFactory.Reactive;
}

declare module IntelliFactory {
    module WebSharper {
        module Formlets {
            module Body {
                var New : {
                    (el: __ABBREV.__Client.Element, l: __ABBREV.__WebSharper.OptionProxy<{
                        (): __ABBREV.__Client.Element;
                    }>): __ABBREV.__Formlets.Body;
                };
            }
            module Layout {
                module Padding {
                    var get_Default : {
                        (): __ABBREV.__Layout.Padding;
                    };
                }
                module LabelConfiguration {
                    var get_Default : {
                        (): __ABBREV.__Layout.LabelConfiguration;
                    };
                }
                module FormRowConfiguration {
                    var get_Default : {
                        (): __ABBREV.__Layout.FormRowConfiguration;
                    };
                }
                interface Align {
                }
                interface VerticalAlign {
                }
                interface FormRowConfiguration {
                    Padding: __ABBREV.__WebSharper.OptionProxy<__ABBREV.__Layout.Padding>;
                    Color: __ABBREV.__WebSharper.OptionProxy<{
                        (x: number): string;
                    }>;
                    Class: __ABBREV.__WebSharper.OptionProxy<{
                        (x: number): string;
                    }>;
                    Style: __ABBREV.__WebSharper.OptionProxy<{
                        (x: number): string;
                    }>;
                    LabelConfiguration: __ABBREV.__WebSharper.OptionProxy<__ABBREV.__Layout.LabelConfiguration>;
                }
                interface LabelConfiguration {
                    Align: __ABBREV.__Layout.Align;
                    VerticalAlign: __ABBREV.__Layout.VerticalAlign;
                    Placement: __ABBREV.__Layout.Placement;
                }
                interface Padding {
                    Left: __ABBREV.__WebSharper.OptionProxy<number>;
                    Right: __ABBREV.__WebSharper.OptionProxy<number>;
                    Top: __ABBREV.__WebSharper.OptionProxy<number>;
                    Bottom: __ABBREV.__WebSharper.OptionProxy<number>;
                }
                interface Placement {
                }
            }
            module Data {
                interface Formlet<_T1> {
                    Run(f: {
                        (x: _T1): void;
                    }): __ABBREV.__Client.Pagelet;
                    Render(): void;
                    Build(): __ABBREV.__Base.Form<__ABBREV.__Formlets.Body, _T1>;
                    get_Layout(): any;
                    MapResult<_M1>(f: {
                        (x: __ABBREV.__Base.Result<_T1>): __ABBREV.__Base.Result<_M1>;
                    }): __ABBREV.__Base.IFormlet<__ABBREV.__Formlets.Body, _T1>;
                    get_ElementInternal(): __ABBREV.__WebSharper.OptionProxy<__ABBREV.__Client.Element>;
                    set_ElementInternal(v: __ABBREV.__WebSharper.OptionProxy<__ABBREV.__Client.Element>): void;
                    get_Body(): __ABBREV.__Dom.Node;
                }
                var NewBody : {
                    (arg00: __ABBREV.__Client.Element, arg10: __ABBREV.__WebSharper.OptionProxy<{
                        (): __ABBREV.__Client.Element;
                    }>): __ABBREV.__Formlets.Body;
                };
                var UtilsProvider : {
                    (): any;
                };
                var BaseFormlet : {
                    (): __ABBREV.__Base.FormletProvider<__ABBREV.__Formlets.Body>;
                };
                var PropagateRenderFrom : {
                    <_M1, _M2, _M3>(f1: __ABBREV.__Base.IFormlet<_M1, _M2>, f2: _M3): _M3;
                };
                var OfIFormlet : {
                    <_M1>(formlet: __ABBREV.__Base.IFormlet<__ABBREV.__Formlets.Body, _M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var MkFormlet : {
                    <_M1, _M2, _M3>(f: {
                        (): any;
                    }): __ABBREV.__Data.Formlet<_M3>;
                };
                var $ : {
                    <_M1, _M2>(f: __ABBREV.__Data.Formlet<{
                        (x: _M1): _M2;
                    }>, x: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M2>;
                };
                var RX : {
                    (): __ABBREV.__Reactive.IReactive;
                };
                var Layout : {
                    (): __ABBREV.__Formlets.LayoutProvider;
                };
                var DefaultLayout : {
                    (): any;
                };
                var Validator : {
                    (): __ABBREV.__Base.Validator;
                };
            }
            module Enhance {
                module FormButtonConfiguration {
                    var get_Default : {
                        (): __ABBREV.__Enhance.FormButtonConfiguration;
                    };
                }
                module ValidationIconConfiguration {
                    var get_Default : {
                        (): __ABBREV.__Enhance.ValidationIconConfiguration;
                    };
                }
                module ValidationFrameConfiguration {
                    var get_Default : {
                        (): __ABBREV.__Enhance.ValidationFrameConfiguration;
                    };
                }
                module Padding {
                    var get_Default : {
                        (): __ABBREV.__Enhance.Padding;
                    };
                }
                module FormContainerConfiguration {
                    var get_Default : {
                        (): __ABBREV.__Enhance.FormContainerConfiguration;
                    };
                }
                module ManyConfiguration {
                    var get_Default : {
                        (): __ABBREV.__Enhance.ManyConfiguration;
                    };
                }
                interface FormButtonConfiguration {
                    Label: __ABBREV.__WebSharper.OptionProxy<string>;
                    Style: __ABBREV.__WebSharper.OptionProxy<string>;
                    Class: __ABBREV.__WebSharper.OptionProxy<string>;
                }
                interface ValidationIconConfiguration {
                    ValidIconClass: string;
                    ErrorIconClass: string;
                }
                interface ValidationFrameConfiguration {
                    ValidClass: __ABBREV.__WebSharper.OptionProxy<string>;
                    ValidStyle: __ABBREV.__WebSharper.OptionProxy<string>;
                    ErrorClass: __ABBREV.__WebSharper.OptionProxy<string>;
                    ErrorStyle: __ABBREV.__WebSharper.OptionProxy<string>;
                }
                interface Padding {
                    Left: __ABBREV.__WebSharper.OptionProxy<number>;
                    Right: __ABBREV.__WebSharper.OptionProxy<number>;
                    Top: __ABBREV.__WebSharper.OptionProxy<number>;
                    Bottom: __ABBREV.__WebSharper.OptionProxy<number>;
                }
                interface FormPart {
                }
                interface FormContainerConfiguration {
                    Header: __ABBREV.__WebSharper.OptionProxy<__ABBREV.__Enhance.FormPart>;
                    Padding: __ABBREV.__Enhance.Padding;
                    Description: __ABBREV.__WebSharper.OptionProxy<__ABBREV.__Enhance.FormPart>;
                    BackgroundColor: __ABBREV.__WebSharper.OptionProxy<string>;
                    BorderColor: __ABBREV.__WebSharper.OptionProxy<string>;
                    CssClass: __ABBREV.__WebSharper.OptionProxy<string>;
                    Style: __ABBREV.__WebSharper.OptionProxy<string>;
                }
                interface ManyConfiguration {
                    AddIconClass: string;
                    RemoveIconClass: string;
                }
                interface JsonPostConfiguration {
                    PostUrl: __ABBREV.__WebSharper.OptionProxy<string>;
                    ParameterName: string;
                    EncodingType: __ABBREV.__WebSharper.OptionProxy<string>;
                }
                var WithResetFormlet : {
                    <_M1, _M2>(formlet: __ABBREV.__Data.Formlet<_M1>, reset: __ABBREV.__Data.Formlet<_M2>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithResetAction : {
                    <_M1>(f: {
                        (): boolean;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithSubmitFormlet : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>, submit: {
                        (x: __ABBREV.__Base.Result<_M1>): __ABBREV.__Data.Formlet<void>;
                    }): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithSubmitAndReset : {
                    <_M1, _M2>(formlet: __ABBREV.__Data.Formlet<_M1>, submReset: {
                        (x: {
                            (): void;
                        }): {
                            (x: __ABBREV.__Base.Result<_M1>): __ABBREV.__Data.Formlet<_M2>;
                        };
                    }): __ABBREV.__Data.Formlet<_M2>;
                };
                var InputButton : {
                    (conf: __ABBREV.__Enhance.FormButtonConfiguration, enabled: boolean): __ABBREV.__Data.Formlet<number>;
                };
                var WithCustomSubmitAndResetButtons : {
                    <_M1>(submitConf: __ABBREV.__Enhance.FormButtonConfiguration, resetConf: __ABBREV.__Enhance.FormButtonConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithSubmitAndResetButtons : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithCustomValidationIcon : {
                    <_M1>(vic: __ABBREV.__Enhance.ValidationIconConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithValidationIcon : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WrapFormlet : {
                    <_M1>(wrapper: {
                        (x: __ABBREV.__Control.IObservableProxy<__ABBREV.__Base.Result<_M1>>): {
                            (x: __ABBREV.__Formlets.Body): __ABBREV.__Client.Element;
                        };
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithCustomValidationFrame : {
                    <_M1>(vc: __ABBREV.__Enhance.ValidationFrameConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithCustomResetButton : {
                    <_M1>(buttonConf: __ABBREV.__Enhance.FormButtonConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithResetButton : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithCustomSubmitButton : {
                    <_M1>(buttonConf: __ABBREV.__Enhance.FormButtonConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithSubmitButton : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithErrorSummary : {
                    <_M1>(label: string, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithValidationFrame : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithErrorFormlet : {
                    <_M1, _M2>(f: {
                        (x: __ABBREV.__List.T<string>): __ABBREV.__Data.Formlet<_M1>;
                    }, formlet: __ABBREV.__Data.Formlet<_M2>): __ABBREV.__Data.Formlet<_M2>;
                };
                var WithLabel : {
                    <_M1>(labelGen: {
                        (): __ABBREV.__Client.Element;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithLabelConfiguration : {
                    <_M1>(lc: __ABBREV.__Layout.LabelConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithLabelAndInfo : {
                    <_M1>(label: string, info: string, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithTextLabel : {
                    <_M1>(label: string, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithLabelAbove : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithLabelLeft : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithCustomFormContainer : {
                    <_M1>(fc: __ABBREV.__Enhance.FormContainerConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithFormContainer : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithCssClass : {
                    <_M1>(css: string, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithLegend : {
                    <_M1>(label: string, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithRowConfiguration : {
                    <_M1>(rc: __ABBREV.__Layout.FormRowConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Cancel : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>, isCancel: {
                        (x: _M1): boolean;
                    }): __ABBREV.__Data.Formlet<_M1>;
                };
                var Replace : {
                    <_M1, _M2>(formlet: __ABBREV.__Data.Formlet<_M1>, f: {
                        (x: _M1): __ABBREV.__Data.Formlet<_M2>;
                    }): __ABBREV.__Data.Formlet<_M2>;
                };
                var Deletable : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<__ABBREV.__WebSharper.OptionProxy<_M1>>): __ABBREV.__Data.Formlet<__ABBREV.__WebSharper.OptionProxy<_M1>>;
                };
                var Many_ : {
                    <_M1, _M2>(add: __ABBREV.__Data.Formlet<_M1>, f: {
                        (x: _M1): __ABBREV.__Data.Formlet<__ABBREV.__WebSharper.OptionProxy<_M2>>;
                    }): __ABBREV.__Data.Formlet<__ABBREV.__WebSharper.seq<_M2>>;
                };
                var CustomMany : {
                    <_M1>(config: __ABBREV.__Enhance.ManyConfiguration, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<__ABBREV.__List.T<_M1>>;
                };
                var Many : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<__ABBREV.__List.T<_M1>>;
                };
                var WithJsonPost : {
                    <_M1>(conf: any, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Client.Element;
                };
            }
            module Controls {
                var SelectControl : {
                    <_M1>(readOnly: boolean, def: number, vls: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Select : {
                    <_M1>(def: number, vls: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<_M1>;
                };
                var ReadOnlySelect : {
                    <_M1>(def: number, vls: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<_M1>;
                };
                var InputControl : {
                    (value: string, f: {
                        (x: __ABBREV.__Reactive.HotStream<__ABBREV.__Base.Result<string>>): __ABBREV.__Client.Element;
                    }): __ABBREV.__Data.Formlet<string>;
                };
                var OnTextChange : {
                    (f: {
                        (): void;
                    }, control: __ABBREV.__Client.Element): void;
                };
                var TextAreaControl : {
                    (readOnly: boolean, value: string): __ABBREV.__Data.Formlet<string>;
                };
                var TextArea : {
                    (value: string): __ABBREV.__Data.Formlet<string>;
                };
                var ReadOnlyTextArea : {
                    (value: string): __ABBREV.__Data.Formlet<string>;
                };
                var InputField : {
                    (readOnly: boolean, typ: string, cls: string, value: string): __ABBREV.__Data.Formlet<string>;
                };
                var CheckboxControl : {
                    (readOnly: boolean, def: boolean): __ABBREV.__Data.Formlet<boolean>;
                };
                var Checkbox : {
                    (def: boolean): __ABBREV.__Data.Formlet<boolean>;
                };
                var ReadOnlyCheckbox : {
                    (def: boolean): __ABBREV.__Data.Formlet<boolean>;
                };
                var CheckboxGroupControl : {
                    <_M1>(readOnly: boolean, values: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<__ABBREV.__List.T<_M1>>;
                };
                var CheckboxGroup : {
                    <_M1>(values: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<__ABBREV.__List.T<_M1>>;
                };
                var RadioButtonGroupControl : {
                    <_M1>(readOnly: boolean, def: __ABBREV.__WebSharper.OptionProxy<number>, values: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<_M1>;
                };
                var RadioButtonGroup : {
                    <_M1>(def: __ABBREV.__WebSharper.OptionProxy<number>, values: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<_M1>;
                };
                var ReadOnlyRadioButtonGroup : {
                    <_M1>(def: __ABBREV.__WebSharper.OptionProxy<number>, values: __ABBREV.__List.T<any>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Password : {
                    (value: string): __ABBREV.__Data.Formlet<string>;
                };
                var Input : {
                    (value: string): __ABBREV.__Data.Formlet<string>;
                };
                var ReadOnlyInput : {
                    (value: string): __ABBREV.__Data.Formlet<string>;
                };
                var ElementButton : {
                    (genElem: {
                        (): __ABBREV.__Client.Element;
                    }): __ABBREV.__Data.Formlet<number>;
                };
                var Button : {
                    (label: string): __ABBREV.__Data.Formlet<number>;
                };
            }
            module Formlet {
                var BuildFormlet : {
                    <_M1, _M2, _M3>(f: {
                        (): any;
                    }): __ABBREV.__Data.Formlet<_M3>;
                };
                var New : {
                    <_M1>(f: {
                        (): __ABBREV.__Base.Form<__ABBREV.__Formlets.Body, _M1>;
                    }): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithLayoutOrDefault : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Return : {
                    <_M1>(x: _M1): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithCancelation : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>, c: __ABBREV.__Data.Formlet<void>): __ABBREV.__Data.Formlet<__ABBREV.__WebSharper.OptionProxy<_M1>>;
                };
                var InitWith : {
                    <_M1>(value: _M1, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var InitWithFailure : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Horizontal : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Vertical : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Flowlet : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var ReplaceFirstWithFailure : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Never : {
                    <_M1>(): __ABBREV.__Data.Formlet<_M1>;
                };
                var Empty : {
                    <_M1>(): __ABBREV.__Data.Formlet<_M1>;
                };
                var ReturnEmpty : {
                    <_M1>(x: _M1): __ABBREV.__Data.Formlet<_M1>;
                };
                var BuildForm : {
                    <_M1>(f: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Base.Form<__ABBREV.__Formlets.Body, _M1>;
                };
                var Deletable : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<__ABBREV.__WebSharper.OptionProxy<_M1>>): __ABBREV.__Data.Formlet<__ABBREV.__WebSharper.OptionProxy<_M1>>;
                };
                var FailWith : {
                    <_M1>(fs: __ABBREV.__List.T<string>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Map : {
                    <_M1, _M2>(f: {
                        (x: _M1): _M2;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M2>;
                };
                var MapBody : {
                    <_M1>(f: {
                        (x: __ABBREV.__Formlets.Body): __ABBREV.__Formlets.Body;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var MapResult : {
                    <_M1, _M2>(f: {
                        (x: __ABBREV.__Base.Result<_M1>): __ABBREV.__Base.Result<_M2>;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M2>;
                };
                var Delay : {
                    <_M1>(f: {
                        (): __ABBREV.__Data.Formlet<_M1>;
                    }): __ABBREV.__Data.Formlet<_M1>;
                };
                var Bind : {
                    <_M1, _M2>(fl: __ABBREV.__Data.Formlet<_M1>, f: {
                        (x: _M1): __ABBREV.__Data.Formlet<_M2>;
                    }): __ABBREV.__Data.Formlet<_M2>;
                };
                var Replace : {
                    <_M1, _M2>(formlet: __ABBREV.__Data.Formlet<_M1>, f: {
                        (x: _M1): __ABBREV.__Data.Formlet<_M2>;
                    }): __ABBREV.__Data.Formlet<_M2>;
                };
                var Join : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<__ABBREV.__Data.Formlet<_M1>>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Switch : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<__ABBREV.__Data.Formlet<_M1>>): __ABBREV.__Data.Formlet<_M1>;
                };
                var FlipBody : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var SelectMany : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<__ABBREV.__Data.Formlet<_M1>>): __ABBREV.__Data.Formlet<__ABBREV.__List.T<_M1>>;
                };
                var LiftResult : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<__ABBREV.__Base.Result<_M1>>;
                };
                var Sequence : {
                    <_M1>(fs: __ABBREV.__WebSharper.seq<__ABBREV.__Data.Formlet<_M1>>): __ABBREV.__Data.Formlet<__ABBREV.__List.T<_M1>>;
                };
                var WithLayout : {
                    <_M1>(l: any, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithNotification : {
                    <_M1>(c: {
                        (x: __ABBREV.__WebSharper.ObjectProxy): void;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var WithNotificationChannel : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<any>;
                };
                var ApplyLayout : {
                    <_M1>(formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var MapElement : {
                    <_M1>(f: {
                        (x: __ABBREV.__Client.Element): __ABBREV.__Client.Element;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var OfElement : {
                    (genElem: {
                        (): __ABBREV.__Client.Element;
                    }): __ABBREV.__Data.Formlet<void>;
                };
                var WithLabel : {
                    <_M1>(label: __ABBREV.__WebSharper.OptionProxy<{
                        (): __ABBREV.__Client.Element;
                    }>, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Run : {
                    <_M1>(f: {
                        (x: _M1): void;
                    }, formlet: __ABBREV.__Data.Formlet<_M1>): __ABBREV.__Client.Pagelet;
                };
                var BindWith : {
                    <_M1, _M2>(compose: {
                        (x: __ABBREV.__Formlets.Body): {
                            (x: __ABBREV.__Formlets.Body): __ABBREV.__Formlets.Body;
                        };
                    }, formlet: __ABBREV.__Data.Formlet<_M1>, f: {
                        (x: _M1): __ABBREV.__Data.Formlet<_M2>;
                    }): __ABBREV.__Data.Formlet<_M2>;
                };
                var Render : {
                    (formlet: __ABBREV.__Data.Formlet<void>): __ABBREV.__Client.Pagelet;
                };
                var Choose : {
                    <_M1>(fs: __ABBREV.__WebSharper.seq<__ABBREV.__Data.Formlet<_M1>>): __ABBREV.__Data.Formlet<_M1>;
                };
                var Do : {
                    (): __ABBREV.__Formlets.FormletBuilder;
                };
            }
            module CssConstants {
                var InputTextClass : {
                    (): string;
                };
            }
            interface Body {
                Element: __ABBREV.__Client.Element;
                Label: __ABBREV.__WebSharper.OptionProxy<{
                    (): __ABBREV.__Client.Element;
                }>;
            }
            interface LayoutProvider {
                HorizontalAlignElem(align: __ABBREV.__Layout.Align, el: __ABBREV.__Client.Element): __ABBREV.__Client.Element;
                VerticalAlignedTD(valign: __ABBREV.__Layout.VerticalAlign, elem: __ABBREV.__Client.Element): __ABBREV.__Client.Element;
                MakeRow(rowConfig: __ABBREV.__Layout.FormRowConfiguration, rowIndex: number, body: __ABBREV.__Formlets.Body): __ABBREV.__Client.Element;
                MakeLayout(lm: {
                    (): any;
                }): any;
                RowLayout(rowConfig: __ABBREV.__Layout.FormRowConfiguration): any;
                ColumnLayout(rowConfig: __ABBREV.__Layout.FormRowConfiguration): any;
                LabelLayout(lc: __ABBREV.__Layout.LabelConfiguration): any;
                get_Flowlet(): any;
                get_Vertical(): any;
                get_Horizontal(): any;
            }
            interface FormletBuilder {
                Return<_M1>(x: _M1): __ABBREV.__Data.Formlet<_M1>;
                Bind<_M1, _M2>(formlet: __ABBREV.__Data.Formlet<_M1>, f: {
                    (x: _M1): __ABBREV.__Data.Formlet<_M2>;
                }): __ABBREV.__Data.Formlet<_M2>;
                Delay<_M1>(f: {
                    (): __ABBREV.__Data.Formlet<_M1>;
                }): __ABBREV.__Data.Formlet<_M1>;
                ReturnFrom<_M1>(f: __ABBREV.__Base.IFormlet<__ABBREV.__Formlets.Body, _M1>): __ABBREV.__Data.Formlet<_M1>;
            }
        }
    }
}
declare module __ABBREV {
    
    export import __Client = IntelliFactory.WebSharper.Html.Client;
    export import __WebSharper = IntelliFactory.WebSharper;
    export import __Formlets = IntelliFactory.WebSharper.Formlets;
    export import __Layout = IntelliFactory.WebSharper.Formlets.Layout;
    export import __Base = IntelliFactory.Formlets.Base;
    export import __Dom = IntelliFactory.WebSharper.JavaScript.Dom;
    export import __Data = IntelliFactory.WebSharper.Formlets.Data;
    export import __Reactive = IntelliFactory.Reactive;
    export import __Enhance = IntelliFactory.WebSharper.Formlets.Enhance;
    export import __Control = IntelliFactory.WebSharper.Control;
    export import __List = IntelliFactory.WebSharper.List;
}

declare module IntelliFactory {
    module WebSharper {
        module UI {
            module Next {
                module Client {
                    var Main : {
                        (): void;
                    };
                }
                module SortableBarChart {
                    interface DataEntry {
                        DataLabel: string;
                        DataValue: number;
                    }
                    interface DataView {
                        Label: string;
                        Value: number;
                        Rank: number;
                        MaxValue: number;
                        NumData: number;
                    }
                    interface Ordering {
                    }
                    var mkEntry : {
                        (row: string[]): any;
                    };
                    var ShowOrdering : {
                        (_arg1: __ABBREV.__SortableBarChart.Ordering): string;
                    };
                    var ViewData : {
                        (xs: __ABBREV.__List.T<any>, ordering: __ABBREV.__SortableBarChart.Ordering): __ABBREV.__WebSharper.seq<any>;
                    };
                    var ParseCSV : {
                        (data: string): __ABBREV.__WebSharper.seq<any>;
                    };
                    var LoadFromCSV : {
                        (url: string): any;
                    };
                    var DelayedAnimation : {
                        (delay: number, x: number, y: number): any;
                    };
                    var SimpleAnimation : {
                        (x: number, y: number): any;
                    };
                    var Render : {
                        (dView: __ABBREV.__Next.View1<any>): __ABBREV.__Next.Doc;
                    };
                    var DisplayGraph : {
                        (data: __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<any>>): __ABBREV.__Next.Doc;
                    };
                    var Main : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Width : {
                        (): number;
                    };
                    var Height : {
                        (): number;
                    };
                    var Spacing : {
                        (): number;
                    };
                    var SimpleTransition : {
                        (): any;
                    };
                    var BarTransition : {
                        (): any;
                    };
                    var LoadData : {
                        (): __ABBREV.__Next.View1<__ABBREV.__WebSharper.seq<any>>;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module KeyboardInfo {
                    var commaList : {
                        (xs: __ABBREV.__List.T<string>): string;
                    };
                    var Main : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var keys : {
                        (): __ABBREV.__Next.View1<__ABBREV.__List.T<number>>;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module EditablePersonList {
                    interface Person {
                        FirstName: __ABBREV.__Next.Var1<string>;
                        LastName: __ABBREV.__Next.Var1<string>;
                    }
                    var createPerson : {
                        (first: string, last: string): any;
                    };
                    var Main : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var peopleList : {
                        (): __ABBREV.__List.T<any>;
                    };
                    var memberList : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var peopleBoxes : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module RoutedBobsleighSite {
                    var Main : {
                        (current: __ABBREV.__Next.Var1<__ABBREV.__BobsleighSite.Page>): __ABBREV.__Next.Doc;
                    };
                    var description : {
                        <_M1>(v: _M1): __ABBREV.__Next.Doc;
                    };
                    var TheRouteMap : {
                        (): any;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module BobsleighSite {
                    interface Page {
                    }
                    interface Context {
                        Go: {
                            (x: __ABBREV.__BobsleighSite.Page): void;
                        };
                    }
                    var GlobalGo : {
                        (_var: __ABBREV.__Next.Var1<__ABBREV.__BobsleighSite.Page>, act: __ABBREV.__BobsleighSite.Page): void;
                    };
                    var showAct : {
                        (_arg1: __ABBREV.__BobsleighSite.Page): string;
                    };
                    var NavBar : {
                        (_var: __ABBREV.__Next.Var1<__ABBREV.__BobsleighSite.Page>): __ABBREV.__Next.Doc;
                    };
                    var HomePage : {
                        (ctx: any): __ABBREV.__Next.Doc;
                    };
                    var History : {
                        <_M1>(ctx: _M1): __ABBREV.__Next.Doc;
                    };
                    var Governance : {
                        <_M1>(ctx: _M1): __ABBREV.__Next.Doc;
                    };
                    var Team : {
                        <_M1>(ctx: _M1): __ABBREV.__Next.Doc;
                    };
                    var Main : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var pages : {
                        (): __ABBREV.__List.T<__ABBREV.__BobsleighSite.Page>;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module AnimatedBobsleighSite {
                    interface Page {
                    }
                    interface Context {
                        Go: {
                            (x: __ABBREV.__AnimatedBobsleighSite.Page): void;
                        };
                    }
                    var GlobalGo : {
                        (_var: __ABBREV.__Next.Var1<__ABBREV.__AnimatedBobsleighSite.Page>, act: __ABBREV.__AnimatedBobsleighSite.Page): void;
                    };
                    var showAct : {
                        (_arg1: __ABBREV.__AnimatedBobsleighSite.Page): string;
                    };
                    var NavBar : {
                        (_var: __ABBREV.__Next.Var1<__ABBREV.__AnimatedBobsleighSite.Page>): __ABBREV.__Next.Doc;
                    };
                    var MakePage : {
                        (_var: __ABBREV.__Next.Var1<__ABBREV.__AnimatedBobsleighSite.Page>, pg: __ABBREV.__Next.Doc): __ABBREV.__Next.Doc;
                    };
                    var HomePage : {
                        (ctx: any): __ABBREV.__Next.Doc;
                    };
                    var History : {
                        <_M1>(ctx: _M1): __ABBREV.__Next.Doc;
                    };
                    var Governance : {
                        <_M1>(ctx: _M1): __ABBREV.__Next.Doc;
                    };
                    var Team : {
                        <_M1>(ctx: _M1): __ABBREV.__Next.Doc;
                    };
                    var Main : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var pages : {
                        (): __ABBREV.__List.T<__ABBREV.__AnimatedBobsleighSite.Page>;
                    };
                    var fadeTime : {
                        (): number;
                    };
                    var Fade : {
                        (): {
                            (x: number): {
                                (x: number): any;
                            };
                        };
                    };
                    var FadeTransition : {
                        (): any;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module ObjectConstancy {
                    module DataSet {
                        var Ratio : {
                            (ds: __ABBREV.__ObjectConstancy.DataSet, br: __ABBREV.__ObjectConstancy.AgeBracket, st: __ABBREV.__ObjectConstancy.State): number;
                        };
                        var TopStatesByRatio : {
                            (ds: __ABBREV.__ObjectConstancy.DataSet, bracket: __ABBREV.__ObjectConstancy.AgeBracket): any[];
                        };
                        var ParseCSV : {
                            (data: string): __ABBREV.__ObjectConstancy.DataSet;
                        };
                        var LoadFromCSV : {
                            (url: string): any;
                        };
                    }
                    interface AgeBracket {
                    }
                    interface State {
                    }
                    interface DataSet {
                        Brackets: __ABBREV.__ObjectConstancy.AgeBracket[];
                        Population: {
                            (x: __ABBREV.__ObjectConstancy.AgeBracket): {
                                (x: __ABBREV.__ObjectConstancy.State): number;
                            };
                        };
                        States: __ABBREV.__ObjectConstancy.State[];
                    }
                    interface StateView {
                        MaxValue: number;
                        Position: number;
                        State: string;
                        Total: number;
                        Value: number;
                    }
                    var SetupDataModel : {
                        (): any;
                    };
                    var SimpleAnimation : {
                        (x: number, y: number): any;
                    };
                    var Percent : {
                        (x: number): string;
                    };
                    var Render : {
                        (state: __ABBREV.__Next.View1<any>): __ABBREV.__Next.Doc;
                    };
                    var Main : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Width : {
                        (): number;
                    };
                    var Height : {
                        (): number;
                    };
                    var SimpleTransition : {
                        (): any;
                    };
                    var InOutTransition : {
                        (): any;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module MessageBoard {
                    module Auth {
                        interface Component {
                            LoggedIn: __ABBREV.__Next.View1<__ABBREV.__WebSharper.OptionProxy<any>>;
                            LoginForm: __ABBREV.__Next.Doc;
                            StatusWidget: __ABBREV.__Next.Doc;
                            HideForm: {
                                (): void;
                            };
                            ShowForm: {
                                (): void;
                            };
                        }
                        var LoginForm : {
                            (onLogin: {
                                (x: any): void;
                            }): __ABBREV.__Next.Doc;
                        };
                        var StatusWidget : {
                            (login: {
                                (): void;
                            }, logout: {
                                (): void;
                            }, view: __ABBREV.__Next.View1<__ABBREV.__WebSharper.OptionProxy<any>>): __ABBREV.__Next.Doc;
                        };
                        var Create : {
                            (): any;
                        };
                    }
                    interface Action {
                    }
                    interface State {
                        Auth: any;
                        Threads: __ABBREV.__Next.Var1<__ABBREV.__List.T<any>>;
                        Go: {
                            (x: __ABBREV.__MessageBoard.Action): void;
                        };
                    }
                    var ShowAction : {
                        (act: __ABBREV.__MessageBoard.Action): string;
                    };
                    var NavBar : {
                        (auth: any, _var: __ABBREV.__Next.Var1<__ABBREV.__MessageBoard.Action>, st: any): __ABBREV.__Next.Doc;
                    };
                    var NewThreadPage : {
                        (st: any): __ABBREV.__Next.Doc;
                    };
                    var ThreadListPage : {
                        (st: any): __ABBREV.__Next.Doc;
                    };
                    var ShowThreadPage : {
                        (st: any, thread: any): __ABBREV.__Next.Doc;
                    };
                    var Initialise : {
                        (): void;
                    };
                    var Main : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module Server {
                    var CheckCredentials : {
                        (name: string, pass: string): __ABBREV.__WebSharper.OptionProxy<any>;
                    };
                    var CheckLogin : {
                        (user: string, pass: string): any;
                    };
                    var GetThreads : {
                        (): any;
                    };
                    var GetPosts : {
                        (thread: any): any;
                    };
                    var AddThread : {
                        (thread: any): any;
                    };
                    var AddPost : {
                        (thread: any, post: any): any;
                    };
                    var DELAY : {
                        (): number;
                    };
                    var threads : {
                        (): __ABBREV.__List.T<any>;
                    };
                    var posts : {
                        (): __ABBREV.__Collections.FSharpMap<number, __ABBREV.__List.T<any>>;
                    };
                }
                module Common {
                    module Fresh {
                        var Int : {
                            (): number;
                        };
                        var i : {
                            (): number;
                        };
                    }
                    interface User {
                        Name: string;
                        Password: string;
                    }
                    interface Post {
                        PostId: number;
                        PostAuthorName: string;
                        Content: string;
                    }
                    interface Thread {
                        ThreadId: number;
                        Title: string;
                        ThreadAuthorName: string;
                        Posts: __ABBREV.__Next.Var1<__ABBREV.__List.T<any>>;
                    }
                    var CreateThread : {
                        (author: string, title: string): any;
                    };
                    var CreatePost : {
                        (user: any, content: string): any;
                    };
                }
                module SimpleTextBox {
                    var Main : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module AnimatedContactFlow {
                    interface ContactType {
                    }
                    interface ContactDetails {
                    }
                    interface Person {
                        Name: string;
                        Address: string;
                    }
                    var inputRow : {
                        (rv: __ABBREV.__Next.Var1<string>, id: string, lblText: string): __ABBREV.__Next.Doc;
                    };
                    var AnimateFlow : {
                        (pg: __ABBREV.__Next.Doc): __ABBREV.__Next.Doc;
                    };
                    var contactFlowlet : {
                        (contactTy: __ABBREV.__AnimatedContactFlow.ContactType): any;
                    };
                    var finalPage : {
                        (person: any, details: __ABBREV.__AnimatedContactFlow.ContactDetails): __ABBREV.__Next.Doc;
                    };
                    var ExampleFlow : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var fadeTime : {
                        (): number;
                    };
                    var Fade : {
                        (): {
                            (x: number): {
                                (x: number): any;
                            };
                        };
                    };
                    var FadeTransition : {
                        (): any;
                    };
                    var swipeTime : {
                        (): number;
                    };
                    var Swipe : {
                        (): {
                            (x: number): {
                                (x: number): any;
                            };
                        };
                    };
                    var SwipeTransition : {
                        (): any;
                    };
                    var personFlowlet : {
                        (): any;
                    };
                    var contactTypeFlowlet : {
                        (): any;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module ContactFlow {
                    interface ContactType {
                    }
                    interface ContactDetails {
                    }
                    interface Person {
                        Name: string;
                        Address: string;
                    }
                    var inputRow : {
                        (rv: __ABBREV.__Next.Var1<string>, id: string, lblText: string, isArea: boolean): __ABBREV.__Next.Doc;
                    };
                    var contactFlowlet : {
                        (contactTy: __ABBREV.__ContactFlow.ContactType): any;
                    };
                    var finalPage : {
                        (person: any, details: __ABBREV.__ContactFlow.ContactDetails): __ABBREV.__Next.Doc;
                    };
                    var ExampleFlow : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var personFlowlet : {
                        (): any;
                    };
                    var contactTypeFlowlet : {
                        (): any;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module InputTransform {
                    var Main : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module Calculator {
                    interface Op {
                    }
                    interface Calculator {
                        Memory: number;
                        Operand: number;
                        Operation: __ABBREV.__Calculator.Op;
                    }
                    var pushInt : {
                        (x: number, rvCalc: __ABBREV.__Next.Var1<any>): void;
                    };
                    var shiftToMem : {
                        (op: __ABBREV.__Calculator.Op, rvCalc: __ABBREV.__Next.Var1<any>): void;
                    };
                    var opFn : {
                        (op: __ABBREV.__Calculator.Op): {
                            (x: number): {
                                (x: number): number;
                            };
                        };
                    };
                    var showOp : {
                        (op: __ABBREV.__Calculator.Op): string;
                    };
                    var calculate : {
                        (rvCalc: __ABBREV.__Next.Var1<any>): void;
                    };
                    var displayCalc : {
                        (rvCalc: __ABBREV.__Next.Var1<any>): __ABBREV.__Next.View1<string>;
                    };
                    var calcBtn : {
                        (i: number, rvCalc: __ABBREV.__Next.Var1<any>): __ABBREV.__Next.Doc;
                    };
                    var opBtn : {
                        (o: __ABBREV.__Calculator.Op, rvCalc: __ABBREV.__Next.Var1<any>): __ABBREV.__Next.Doc;
                    };
                    var cBtn : {
                        (rvCalc: __ABBREV.__Next.Var1<any>): __ABBREV.__Next.Doc;
                    };
                    var eqBtn : {
                        (rvCalc: __ABBREV.__Next.Var1<any>): __ABBREV.__Next.Doc;
                    };
                    var calcView : {
                        (rvCalc: __ABBREV.__Next.Var1<any>): __ABBREV.__Next.Doc;
                    };
                    var Main : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var initCalc : {
                        (): any;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module MouseInfo {
                    var Main : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module TodoList {
                    module TodoItem {
                        var Create : {
                            (s: string): __ABBREV.__TodoList.TodoItem;
                        };
                    }
                    interface TodoItem {
                        Done: __ABBREV.__Next.Var1<boolean>;
                        Key: __ABBREV.__Next.Key;
                        TodoText: string;
                    }
                    interface Model {
                        Items: __ABBREV.__Next.ListModel1<__ABBREV.__Next.Key, __ABBREV.__TodoList.TodoItem>;
                    }
                    var CreateModel : {
                        (): any;
                    };
                    var RenderItem : {
                        (m: any, todo: __ABBREV.__TodoList.TodoItem): __ABBREV.__Next.Doc;
                    };
                    var TodoForm : {
                        (m: any): __ABBREV.__Next.Doc;
                    };
                    var TodoList : {
                        (m: any): __ABBREV.__Next.Doc;
                    };
                    var TodoExample : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Main : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module PhoneExample {
                    module Phone {
                        var Compare : {
                            (order: __ABBREV.__PhoneExample.Order, p1: __ABBREV.__PhoneExample.Phone, p2: __ABBREV.__PhoneExample.Phone): number;
                        };
                        var MatchesQuery : {
                            (q: string, ph: __ABBREV.__PhoneExample.Phone): boolean;
                        };
                    }
                    module Order {
                        var Show : {
                            (order: __ABBREV.__PhoneExample.Order): string;
                        };
                    }
                    interface Phone {
                        Name: string;
                        Snippet: string;
                        Age: number;
                    }
                    interface Order {
                    }
                    var PhonesWidget : {
                        (phones: __ABBREV.__List.T<__ABBREV.__PhoneExample.Phone>): __ABBREV.__Next.Doc;
                    };
                    var Main : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module CheckBoxTest {
                    module Person {
                        var Create : {
                            (n: string, a: number): __ABBREV.__CheckBoxTest.Person;
                        };
                    }
                    interface Person {
                        Name: string;
                        Age: number;
                    }
                    interface Restaurant {
                    }
                    var showRestaurant : {
                        (_arg1: __ABBREV.__CheckBoxTest.Restaurant): string;
                    };
                    var Main : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var Description : {
                        (): __ABBREV.__Next.Doc;
                    };
                    var People : {
                        (): __ABBREV.__List.T<__ABBREV.__CheckBoxTest.Person>;
                    };
                    var Sample : {
                        (): any;
                    };
                }
                module Site {
                    interface AboutEntry {
                        Name: string;
                        ImgURL: string;
                        Description: string;
                        URLs: __ABBREV.__List.T<__ABBREV.__Next.Doc>;
                    }
                    var mkEntry : {
                        (name: string, desc: string, img: string, urls: __ABBREV.__List.T<__ABBREV.__Next.Doc>): any;
                    };
                    var showPgTy : {
                        (_arg1: __ABBREV.__SiteCommon.PageTy): string;
                    };
                    var pageFor : {
                        (pty: __ABBREV.__SiteCommon.PageTy, samples: __ABBREV.__List.T<any>): any;
                    };
                    var linkBtn : {
                        (caption: string, href: string): __ABBREV.__Next.Doc;
                    };
                    var HomePage : {
                        <_M1>(go: _M1): __ABBREV.__Next.Doc;
                    };
                    var AboutPage : {
                        (go: {
                            (x: __ABBREV.__SiteCommon.PageTy): void;
                        }): __ABBREV.__Next.Doc;
                    };
                    var NavBar : {
                        (v: __ABBREV.__Next.Var1<any>, samples: __ABBREV.__List.T<any>): __ABBREV.__Next.Doc;
                    };
                    var homeRouter : {
                        (samples: __ABBREV.__List.T<any>): __ABBREV.__Next.Router1<any>;
                    };
                    var aboutRouter : {
                        (samples: __ABBREV.__List.T<any>): __ABBREV.__Next.Router1<any>;
                    };
                    var SiteRouter : {
                        (samples: __ABBREV.__List.T<any>): __ABBREV.__Next.Router1<any>;
                    };
                    var MakePage : {
                        (pg: __ABBREV.__Next.Doc): __ABBREV.__Next.Doc;
                    };
                    var Main : {
                        (samples: __ABBREV.__List.T<any>): void;
                    };
                    var Entries : {
                        (): __ABBREV.__List.T<any>;
                    };
                    var NavExternalLinks : {
                        (): __ABBREV.__List.T<any>;
                    };
                    var homePage : {
                        (): any;
                    };
                    var aboutPage : {
                        (): any;
                    };
                    var NavPages : {
                        (): __ABBREV.__List.T<__ABBREV.__SiteCommon.PageTy>;
                    };
                    var unitRouteMap : {
                        (): any;
                    };
                    var fadeTime : {
                        (): number;
                    };
                    var Fade : {
                        (): {
                            (x: number): {
                                (x: number): any;
                            };
                        };
                    };
                    var FadeTransition : {
                        (): any;
                    };
                }
                module SiteCommon {
                    interface PageTy {
                    }
                    interface Meta {
                        FileName: string;
                        Keywords: __ABBREV.__List.T<string>;
                        Title: string;
                        Uri: string;
                    }
                    interface Sample {
                        Body: __ABBREV.__Next.Doc;
                        Description: __ABBREV.__Next.Doc;
                        Meta: any;
                        Router: __ABBREV.__Next.Router1<any>;
                        RouteId: __ABBREV.__Next.RouteId;
                        SamplePage: any;
                    }
                    interface Page {
                        PageName: string;
                        PageRouteId: __ABBREV.__Next.RouteId;
                        PageType: __ABBREV.__SiteCommon.PageTy;
                        PageSample: __ABBREV.__WebSharper.OptionProxy<any>;
                    }
                    var mkPage : {
                        (name: string, routeId: __ABBREV.__Next.RouteId, ty: __ABBREV.__SiteCommon.PageTy): any;
                    };
                }
                module Samples {
                    interface Visuals<_T1> {
                        Desc: {
                            (x: _T1): __ABBREV.__Next.Doc;
                        };
                        Main: {
                            (x: _T1): __ABBREV.__Next.Doc;
                        };
                    }
                    interface Builder<_T1> {
                        Create(): any;
                        FileName(x: string): __ABBREV.__Samples.Builder<_T1>;
                        Id(x: string): __ABBREV.__Samples.Builder<_T1>;
                        Keywords(x: __ABBREV.__List.T<string>): __ABBREV.__Samples.Builder<_T1>;
                        Render(f: {
                            (x: _T1): __ABBREV.__Next.Doc;
                        }): __ABBREV.__Samples.Builder<_T1>;
                        RenderDescription(x: {
                            (x: _T1): __ABBREV.__Next.Doc;
                        }): __ABBREV.__Samples.Builder<_T1>;
                        Title(x: string): __ABBREV.__Samples.Builder<_T1>;
                        Uri(x: string): __ABBREV.__Samples.Builder<_T1>;
                    }
                    var Sidebar : {
                        (vPage: __ABBREV.__Next.Var1<any>, samples: __ABBREV.__List.T<any>): __ABBREV.__Next.Doc;
                    };
                    var RenderContent : {
                        (sample: any): __ABBREV.__Next.Doc;
                    };
                    var Render : {
                        (vPage: __ABBREV.__Next.Var1<any>, pg: any, samples: __ABBREV.__List.T<any>): __ABBREV.__Next.Doc;
                    };
                    var CreateRouted : {
                        <_M1>(router: any, init: _M1, vis: any, meta: any): any;
                    };
                    var CreateSimple : {
                        (vis: any, meta: any): any;
                    };
                    var Build : {
                        (): __ABBREV.__Samples.Builder<void>;
                    };
                    var Routed : {
                        <_M1>(router: any, init: _M1): __ABBREV.__Samples.Builder<__ABBREV.__Next.Var1<_M1>>;
                    };
                    var InitialSamplePage : {
                        (samples: __ABBREV.__List.T<any>): any;
                    };
                    var SamplesRouter : {
                        (samples: __ABBREV.__WebSharper.seq<any>): __ABBREV.__Next.Router1<any>;
                    };
                    var nav : {
                        (): {
                            (x: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Attr>): {
                                (x: __ABBREV.__WebSharper.seq<__ABBREV.__Next.Doc>): __ABBREV.__Next.Doc;
                            };
                        };
                    };
                }
            }
        }
    }
}
declare module __ABBREV {
    
    export import __SortableBarChart = IntelliFactory.WebSharper.UI.Next.SortableBarChart;
    export import __List = IntelliFactory.WebSharper.List;
    export import __WebSharper = IntelliFactory.WebSharper;
    export import __Next = IntelliFactory.WebSharper.UI.Next;
    export import __BobsleighSite = IntelliFactory.WebSharper.UI.Next.BobsleighSite;
    export import __AnimatedBobsleighSite = IntelliFactory.WebSharper.UI.Next.AnimatedBobsleighSite;
    export import __ObjectConstancy = IntelliFactory.WebSharper.UI.Next.ObjectConstancy;
    export import __MessageBoard = IntelliFactory.WebSharper.UI.Next.MessageBoard;
    export import __Collections = IntelliFactory.WebSharper.Collections;
    export import __AnimatedContactFlow = IntelliFactory.WebSharper.UI.Next.AnimatedContactFlow;
    export import __ContactFlow = IntelliFactory.WebSharper.UI.Next.ContactFlow;
    export import __Calculator = IntelliFactory.WebSharper.UI.Next.Calculator;
    export import __TodoList = IntelliFactory.WebSharper.UI.Next.TodoList;
    export import __PhoneExample = IntelliFactory.WebSharper.UI.Next.PhoneExample;
    export import __CheckBoxTest = IntelliFactory.WebSharper.UI.Next.CheckBoxTest;
    export import __SiteCommon = IntelliFactory.WebSharper.UI.Next.SiteCommon;
    export import __Samples = IntelliFactory.WebSharper.UI.Next.Samples;
}


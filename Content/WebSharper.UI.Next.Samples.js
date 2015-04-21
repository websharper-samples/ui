// $begin{copyright}
//
// This file is part of WebSharper
//
// Copyright (c) 2008-2014 IntelliFactory
//
// Licensed under the Apache License, Version 2.0 (the "License"); you
// may not use this file except in compliance with the License.  You may
// obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied.  See the License for the specific language governing
// permissions and limitations under the License.
//
// $end{copyright}

try {
    Object.defineProperty(Error.prototype, 'message', { enumerable: true });
} catch (e) { }

var IntelliFactory =
{
    Runtime:
    {
        Class:
            function (p, s) {
                function r() { }
                r.prototype = p;
                for (var f in s) { r[f] = s[f]; }
                return r;
            },

        Define:
            function (a, b) {
                var overwrite = !!this.overwrite;
                function define(a, b) {
                    for (var k in b) {
                        var t1 = typeof a[k];
                        var t2 = typeof b[k];
                        if (t1 == "object" && t2 == "object") {
                            define(a[k], b[k]);
                        } else if (t1 == "undefined" || overwrite) {
                            a[k] = b[k];
                        } else {
                            throw new Error("Name conflict: " + k);
                        }
                    }
                }
                define(a, b);
            },

        DeleteEmptyFields:
            function (obj, fields) {
                for (var i = 0; i < fields.length; i++) {
                    var f = fields[i];
                    if (obj[f] === undefined) { delete obj[f]; }
                }
                return obj;
            },

        Field:
            function (f) {
                var value, ready = false;
                return function () {
                    if (!ready) { ready = true; value = f(); }
                    return value;
                }
            },

        GetOptional:
            function (value) {
                return (value === undefined) ? { $: 0 } : { $: 1, $0: value };
            },

        New:		
            function (ctor, fields) {
                var r = new ctor();
                for (var f in fields) {
                    if (!(f in r)) {
                        r[f] = fields[f];
                    }
                }
                return r
            },

        NewObject:
            function (kv) {
                var o = {};
                for (var i = 0; i < kv.length; i++) {
                    o[kv[i][0]] = kv[i][1];
                }
                return o;
            },

        OnInit:
            function (f) {
                if (!("init" in this)) {
                    this.init = [];
                }
                this.init.push(f);
            },

        OnLoad:
            function (f) {
                if (!("load" in this)) {
                    this.load = [];
                }
                this.load.push(f);
            },

        Inherit:
            function (a, b) {
                var p = a.prototype;
                a.prototype = new b();
                for (var f in p) {
                    a.prototype[f] = p[f];
                }
            },

        Safe:
            function (x) {
                if (x === undefined) return {};
                return x;
            },

        SetOptional:
            function (obj, field, value) {
                if (value.$ == 0) {
                    delete obj[field];
                } else {
                    obj[field] = value.$0;
                }
            },

        Start:
            function () {
                function run(c) {
                    for (var i = 0; i < c.length; i++) {
                        c[i]();
                    }
                }
                if ("init" in this) {
                    run(this.init);
                    this.init = [];
                }
                if ("load" in this) {
                    run(this.load);
                    this.load = [];
                }
            },

        Bind:
            function (f, obj) {
                return function () { return f.apply(this, arguments) }
            },

        CreateFuncWithArgs:
            function (f) {
                return function () { return f(Array.prototype.slice.call(arguments)); }
            },

        CreateFuncWithOnlyThis:
            function (f) {
                return function () { return f(this); }
            },

        CreateFuncWithThis:
            function (f) {
                return function () { return f(this).apply(null, arguments); }
            },

        CreateFuncWithThisArgs:
            function (f) {
                return function () { return f(this)(Array.prototype.slice.call(arguments)); }
            },

        CreateFuncWithRest:
            function (length, f) {
                return function () { return f(Array.prototype.slice.call(arguments, 0, length).concat([Array.prototype.slice.call(arguments, length)])); }
            },

        CreateFuncWithArgsRest:
            function (length, f) {
                return function () { return f([Array.prototype.slice.call(arguments, 0, length), Array.prototype.slice.call(arguments, length)]); }
            },

        UnionByType:
            function (types, value, optional) {
                var vt = typeof value;
                for (var i = 0; i < types.length; i++) {
                    var t = types[i];
                    if (typeof t == "number") {
                        if (Array.isArray(value) && (t == 0 || value.length == t)) {
                            return { $: i, $0: value };
                        }
                    } else {
                        if (t == vt) {
                            return { $: i, $0: value };
                        }
                    }
                }
                if (!optional) {
                    throw new Error("Type not expected for creating Choice value.");
                }
            }
    }
};

// Polyfill

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
;
var JSON;JSON||(JSON={}),function(){"use strict";function i(n){return n<10?"0"+n:n}function f(n){return o.lastIndex=0,o.test(n)?'"'+n.replace(o,function(n){var t=s[n];return typeof t=="string"?t:"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+n+'"'}function r(i,e){var s,l,h,a,v=n,c,o=e[i];o&&typeof o=="object"&&typeof o.toJSON=="function"&&(o=o.toJSON(i)),typeof t=="function"&&(o=t.call(e,i,o));switch(typeof o){case"string":return f(o);case"number":return isFinite(o)?String(o):"null";case"boolean":case"null":return String(o);case"object":if(!o)return"null";if(n+=u,c=[],Object.prototype.toString.apply(o)==="[object Array]"){for(a=o.length,s=0;s<a;s+=1)c[s]=r(s,o)||"null";return h=c.length===0?"[]":n?"[\n"+n+c.join(",\n"+n)+"\n"+v+"]":"["+c.join(",")+"]",n=v,h}if(t&&typeof t=="object")for(a=t.length,s=0;s<a;s+=1)typeof t[s]=="string"&&(l=t[s],h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));else for(l in o)Object.prototype.hasOwnProperty.call(o,l)&&(h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));return h=c.length===0?"{}":n?"{\n"+n+c.join(",\n"+n)+"\n"+v+"}":"{"+c.join(",")+"}",n=v,h}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+i(this.getUTCMonth()+1)+"-"+i(this.getUTCDate())+"T"+i(this.getUTCHours())+":"+i(this.getUTCMinutes())+":"+i(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var e=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,o=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,n,u,s={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},t;typeof JSON.stringify!="function"&&(JSON.stringify=function(i,f,e){var o;if(n="",u="",typeof e=="number")for(o=0;o<e;o+=1)u+=" ";else typeof e=="string"&&(u=e);if(t=f,f&&typeof f!="function"&&(typeof f!="object"||typeof f.length!="number"))throw new Error("JSON.stringify");return r("",{"":i})}),typeof JSON.parse!="function"&&(JSON.parse=function(n,t){function r(n,i){var f,e,u=n[i];if(u&&typeof u=="object")for(f in u)Object.prototype.hasOwnProperty.call(u,f)&&(e=r(u,f),e!==undefined?u[f]=e:delete u[f]);return t.call(n,i,u)}var i;if(n=String(n),e.lastIndex=0,e.test(n)&&(n=n.replace(e,function(n){return"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(n.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return i=eval("("+n+")"),typeof t=="function"?r({"":i},""):i;throw new SyntaxError("JSON.parse");})}();;
(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,AggregateException,Exception,ArgumentException,Number,Arrays,Operators,IndexOutOfRangeException,Array,Seq,Unchecked,Enumerator,Arrays2D,Concurrency,Option,clearTimeout,setTimeout,CancellationTokenSource,Char,Util,Lazy,OperationCanceledException,Date,console,Scheduler,T,Html,Client,Activator,document,jQuery,Json,JSON,JavaScript,JSModule,HtmlContentExtensions,SingleNode,InvalidOperationException,List,T1,MatchFailureException,Math,Strings,PrintfHelpers,Remoting,XhrProvider,AsyncProxy,AjaxRemotingProvider,window,Enumerable,Ref,String,RegExp;
 Runtime.Define(Global,{
  WebSharper:{
   AggregateException:Runtime.Class({},{
    New:function(innerExceptions)
    {
     return Runtime.New(this,AggregateException.New1("One or more errors occurred.",innerExceptions));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   ArgumentException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,ArgumentException.New1("Value does not fall within the expected range."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   Arrays:{
    average:function(arr)
    {
     return Number(Arrays.sum(arr))/Number(arr.length);
    },
    averageBy:function(f,arr)
    {
     return Number(Arrays.sumBy(f,arr))/Number(arr.length);
    },
    blit:function(arr1,start1,arr2,start2,length)
    {
     var i;
     Arrays.checkRange(arr1,start1,length);
     Arrays.checkRange(arr2,start2,length);
     for(i=0;i<=length-1;i++){
      Arrays.set(arr2,start2+i,Arrays.get(arr1,start1+i));
     }
     return;
    },
    checkBounds:function(arr,n)
    {
     return(n<0?true:n>=arr.length)?Operators.FailWith("Index was outside the bounds of the array."):null;
    },
    checkBounds2D:function(arr,n1,n2)
    {
     return(((n1<0?true:n2<0)?true:n1>=arr.length)?true:n2>=(arr.length?arr[0].length:0))?Operators.Raise(IndexOutOfRangeException.New()):null;
    },
    checkLength:function(arr1,arr2)
    {
     return arr1.length!==arr2.length?Operators.FailWith("Arrays differ in length."):null;
    },
    checkRange:function(arr,start,size)
    {
     return((size<0?true:start<0)?true:arr.length<start+size)?Operators.FailWith("Index was outside the bounds of the array."):null;
    },
    choose:function(f,arr)
    {
     var q,i,matchValue,_,x;
     q=[];
     for(i=0;i<=arr.length-1;i++){
      matchValue=f(Arrays.get(arr,i));
      if(matchValue.$==0)
       {
        _=null;
       }
      else
       {
        x=matchValue.$0;
        _=q.push(x);
       }
     }
     return q;
    },
    collect:function(f,x)
    {
     return Array.prototype.concat.apply([],Arrays.map(f,x));
    },
    concat:function(xs)
    {
     return Array.prototype.concat.apply([],Arrays.ofSeq(xs));
    },
    create:function(size,value)
    {
     var r,i;
     r=Array(size);
     for(i=0;i<=size-1;i++){
      Arrays.set(r,i,value);
     }
     return r;
    },
    create2D:function(rows)
    {
     var mapping,source1,x;
     mapping=function(source)
     {
      return Arrays.ofSeq(source);
     };
     source1=Seq.map(mapping,rows);
     x=Arrays.ofSeq(source1);
     x.dims=2;
     return x;
    },
    exists2:function(f,arr1,arr2)
    {
     Arrays.checkLength(arr1,arr2);
     return Seq.exists2(f,arr1,arr2);
    },
    fill:function(arr,start,length,value)
    {
     var i;
     Arrays.checkRange(arr,start,length);
     for(i=start;i<=start+length-1;i++){
      Arrays.set(arr,i,value);
     }
     return;
    },
    filter:function(f,arr)
    {
     var r,i;
     r=[];
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i))?r.push(Arrays.get(arr,i)):null;
     }
     return r;
    },
    find:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryFind(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findINdex:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryFindIndex(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold:function(f,zero,arr)
    {
     var acc,i;
     acc=zero;
     for(i=0;i<=arr.length-1;i++){
      acc=(f(acc))(Arrays.get(arr,i));
     }
     return acc;
    },
    fold2:function(f,zero,arr1,arr2)
    {
     var accum,i;
     Arrays.checkLength(arr1,arr2);
     accum=zero;
     for(i=0;i<=arr1.length-1;i++){
      accum=((f(accum))(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return accum;
    },
    foldBack:function(f,arr,zero)
    {
     var acc,len,i;
     acc=zero;
     len=arr.length;
     for(i=1;i<=len;i++){
      acc=(f(Arrays.get(arr,len-i)))(acc);
     }
     return acc;
    },
    foldBack2:function(f,arr1,arr2,zero)
    {
     var len,accum,i;
     Arrays.checkLength(arr1,arr2);
     len=arr1.length;
     accum=zero;
     for(i=1;i<=len;i++){
      accum=((f(Arrays.get(arr1,len-i)))(Arrays.get(arr2,len-i)))(accum);
     }
     return accum;
    },
    forall2:function(f,arr1,arr2)
    {
     Arrays.checkLength(arr1,arr2);
     return Seq.forall2(f,arr1,arr2);
    },
    get:function(arr,n)
    {
     Arrays.checkBounds(arr,n);
     return arr[n];
    },
    get2D:function(arr,n1,n2)
    {
     Arrays.checkBounds2D(arr,n1,n2);
     return arr[n1][n2];
    },
    init:function(size,f)
    {
     var r,i;
     size<0?Operators.FailWith("Negative size given."):null;
     r=Array(size);
     for(i=0;i<=size-1;i++){
      Arrays.set(r,i,f(i));
     }
     return r;
    },
    iter:function(f,arr)
    {
     var i;
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i));
     }
     return;
    },
    iter2:function(f,arr1,arr2)
    {
     var i;
     Arrays.checkLength(arr1,arr2);
     for(i=0;i<=arr1.length-1;i++){
      (f(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return;
    },
    iteri:function(f,arr)
    {
     var i;
     for(i=0;i<=arr.length-1;i++){
      (f(i))(Arrays.get(arr,i));
     }
     return;
    },
    iteri2:function(f,arr1,arr2)
    {
     var i;
     Arrays.checkLength(arr1,arr2);
     for(i=0;i<=arr1.length-1;i++){
      ((f(i))(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return;
    },
    length:function(arr)
    {
     var matchValue;
     matchValue=arr.dims;
     return matchValue===2?arr.length*arr.length:arr.length;
    },
    map:function(f,arr)
    {
     var r,i;
     r=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(r,i,f(Arrays.get(arr,i)));
     }
     return r;
    },
    map2:function(f,arr1,arr2)
    {
     var r,i;
     Arrays.checkLength(arr1,arr2);
     r=Array(arr2.length);
     for(i=0;i<=arr2.length-1;i++){
      Arrays.set(r,i,(f(Arrays.get(arr1,i)))(Arrays.get(arr2,i)));
     }
     return r;
    },
    mapi:function(f,arr)
    {
     var y,i;
     y=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(y,i,(f(i))(Arrays.get(arr,i)));
     }
     return y;
    },
    mapi2:function(f,arr1,arr2)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,((f(i))(Arrays.get(arr1,i)))(Arrays.get(arr2,i)));
     }
     return res;
    },
    max:function(x)
    {
     return Arrays.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Max(e1,e2);
      };
     },x);
    },
    maxBy:function(f,arr)
    {
     return Arrays.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===1?x:y;
      };
     },arr);
    },
    min:function(x)
    {
     return Arrays.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Min(e1,e2);
      };
     },x);
    },
    minBy:function(f,arr)
    {
     return Arrays.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===-1?x:y;
      };
     },arr);
    },
    nonEmpty:function(arr)
    {
     return arr.length===0?Operators.FailWith("The input array was empty."):null;
    },
    ofSeq:function(xs)
    {
     var q,_enum;
     q=[];
     _enum=Enumerator.Get(xs);
     while(_enum.MoveNext())
      {
       q.push(_enum.get_Current());
      }
     return q;
    },
    partition:function(f,arr)
    {
     var ret1,ret2,i;
     ret1=[];
     ret2=[];
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i))?ret1.push(Arrays.get(arr,i)):ret2.push(Arrays.get(arr,i));
     }
     return[ret1,ret2];
    },
    permute:function(f,arr)
    {
     var ret,i;
     ret=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(ret,f(i),Arrays.get(arr,i));
     }
     return ret;
    },
    pick:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryPick(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    reduce:function(f,arr)
    {
     var acc,i;
     Arrays.nonEmpty(arr);
     acc=Arrays.get(arr,0);
     for(i=1;i<=arr.length-1;i++){
      acc=(f(acc))(Arrays.get(arr,i));
     }
     return acc;
    },
    reduceBack:function(f,arr)
    {
     var len,acc,i;
     Arrays.nonEmpty(arr);
     len=arr.length;
     acc=Arrays.get(arr,len-1);
     for(i=2;i<=len;i++){
      acc=(f(Arrays.get(arr,len-i)))(acc);
     }
     return acc;
    },
    reverse:function(array,offset,length)
    {
     var a;
     a=Arrays.sub(array,offset,length).slice().reverse();
     return Arrays.blit(a,0,array,offset,Arrays.length(a));
    },
    scan:function(f,zero,arr)
    {
     var ret,i;
     ret=Array(1+arr.length);
     Arrays.set(ret,0,zero);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(ret,i+1,(f(Arrays.get(ret,i)))(Arrays.get(arr,i)));
     }
     return ret;
    },
    scanBack:function(f,arr,zero)
    {
     var len,ret,i;
     len=arr.length;
     ret=Array(1+len);
     Arrays.set(ret,len,zero);
     for(i=0;i<=len-1;i++){
      Arrays.set(ret,len-i-1,(f(Arrays.get(arr,len-i-1)))(Arrays.get(ret,len-i)));
     }
     return ret;
    },
    set:function(arr,n,x)
    {
     Arrays.checkBounds(arr,n);
     arr[n]=x;
     return;
    },
    set2D:function(arr,n1,n2,x)
    {
     Arrays.checkBounds2D(arr,n1,n2);
     arr[n1][n2]=x;
     return;
    },
    setSub:function(arr,start,len,src)
    {
     var i;
     for(i=0;i<=len-1;i++){
      Arrays.set(arr,start+i,Arrays.get(src,i));
     }
     return;
    },
    setSub2D:function(dst,src1,src2,len1,len2,src)
    {
     var i,j;
     for(i=0;i<=len1-1;i++){
      for(j=0;j<=len2-1;j++){
       Arrays.set2D(dst,src1+i,src2+j,Arrays.get2D(src,i,j));
      }
     }
     return;
    },
    sort:function(arr)
    {
     return Arrays.sortBy(function(x)
     {
      return x;
     },arr);
    },
    sortBy:function(f,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return Operators.Compare(f(x),f(y));
     });
    },
    sortInPlace:function(arr)
    {
     return Arrays.sortInPlaceBy(function(x)
     {
      return x;
     },arr);
    },
    sortInPlaceBy:function(f,arr)
    {
     return arr.sort(function(x,y)
     {
      return Operators.Compare(f(x),f(y));
     });
    },
    sortInPlaceWith:function(comparer,arr)
    {
     return arr.sort(function(x,y)
     {
      return(comparer(x))(y);
     });
    },
    sortWith:function(comparer,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return(comparer(x))(y);
     });
    },
    sub:function(arr,start,length)
    {
     Arrays.checkRange(arr,start,length);
     return arr.slice(start,start+length);
    },
    sub2D:function(src,src1,src2,len1,len2)
    {
     var len11,len21,dst,i,j;
     len11=len1<0?0:len1;
     len21=len2<0?0:len2;
     dst=Arrays.zeroCreate2D(len11,len21);
     for(i=0;i<=len11-1;i++){
      for(j=0;j<=len21-1;j++){
       Arrays.set2D(dst,i,j,Arrays.get2D(src,src1+i,src2+j));
      }
     }
     return dst;
    },
    sum:function($arr)
    {
     var $0=this,$this=this;
     var sum=0;
     for(var i=0;i<$arr.length;i++)sum+=$arr[i];
     return sum;
    },
    sumBy:function($f,$arr)
    {
     var $0=this,$this=this;
     var sum=0;
     for(var i=0;i<$arr.length;i++)sum+=$f($arr[i]);
     return sum;
    },
    tryFind:function(f,arr)
    {
     var res,i;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       f(Arrays.get(arr,i))?res={
        $:1,
        $0:Arrays.get(arr,i)
       }:null;
       i=i+1;
      }
     return res;
    },
    tryFindIndex:function(f,arr)
    {
     var res,i;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       f(Arrays.get(arr,i))?res={
        $:1,
        $0:i
       }:null;
       i=i+1;
      }
     return res;
    },
    tryPick:function(f,arr)
    {
     var res,i,matchValue;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       matchValue=f(Arrays.get(arr,i));
       matchValue.$==1?res=matchValue:null;
       i=i+1;
      }
     return res;
    },
    unzip:function(arr)
    {
     var x,y,i,patternInput,b,a;
     x=[];
     y=[];
     for(i=0;i<=arr.length-1;i++){
      patternInput=Arrays.get(arr,i);
      b=patternInput[1];
      a=patternInput[0];
      x.push(a);
      y.push(b);
     }
     return[x,y];
    },
    unzip3:function(arr)
    {
     var x,y,z,i,matchValue,c,b,a;
     x=[];
     y=[];
     z=[];
     for(i=0;i<=arr.length-1;i++){
      matchValue=Arrays.get(arr,i);
      c=matchValue[2];
      b=matchValue[1];
      a=matchValue[0];
      x.push(a);
      y.push(b);
      z.push(c);
     }
     return[x,y,z];
    },
    zeroCreate2D:function(n,m)
    {
     var arr;
     arr=Arrays.init(n,function()
     {
      return Array(m);
     });
     arr.dims=2;
     return arr;
    },
    zip:function(arr1,arr2)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,[Arrays.get(arr1,i),Arrays.get(arr2,i)]);
     }
     return res;
    },
    zip3:function(arr1,arr2,arr3)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     Arrays.checkLength(arr2,arr3);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,[Arrays.get(arr1,i),Arrays.get(arr2,i),Arrays.get(arr3,i)]);
     }
     return res;
    }
   },
   Arrays2D:{
    copy:function(array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return Arrays.get2D(array,i,j);
      };
     });
    },
    init:function(n,m,f)
    {
     var array,i,j;
     array=Arrays.zeroCreate2D(n,m);
     for(i=0;i<=n-1;i++){
      for(j=0;j<=m-1;j++){
       Arrays.set2D(array,i,j,(f(i))(j));
      }
     }
     return array;
    },
    iter:function(f,array)
    {
     var count1,count2,i,j;
     count1=array.length;
     count2=array.length?array[0].length:0;
     for(i=0;i<=count1-1;i++){
      for(j=0;j<=count2-1;j++){
       f(Arrays.get2D(array,i,j));
      }
     }
     return;
    },
    iteri:function(f,array)
    {
     var count1,count2,i,j;
     count1=array.length;
     count2=array.length?array[0].length:0;
     for(i=0;i<=count1-1;i++){
      for(j=0;j<=count2-1;j++){
       ((f(i))(j))(Arrays.get2D(array,i,j));
      }
     }
     return;
    },
    map:function(f,array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return f(Arrays.get2D(array,i,j));
      };
     });
    },
    mapi:function(f,array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return((f(i))(j))(Arrays.get2D(array,i,j));
      };
     });
    }
   },
   AsyncProxy:Runtime.Class({},{
    get_CancellationToken:function()
    {
     return Concurrency.GetCT();
    },
    get_DefaultCancellationToken:function()
    {
     return(Concurrency.defCTS())[0];
    }
   }),
   CancellationTokenSource:Runtime.Class({
    Cancel:function()
    {
     var _,chooser,array,errors;
     if(!this.c)
      {
       this.c=true;
       chooser=function(a)
       {
        var _1,e;
        try
        {
         a(null);
         _1={
          $:0
         };
        }
        catch(e)
        {
         _1={
          $:1,
          $0:e
         };
        }
        return _1;
       };
       array=this.r;
       errors=Arrays.choose(chooser,array);
       _=Arrays.length(errors)>0?Operators.Raise(AggregateException.New(errors)):null;
      }
     else
      {
       _=null;
      }
     return _;
    },
    Cancel1:function(throwOnFirstException)
    {
     var _,_1,action,array;
     if(!throwOnFirstException)
      {
       _=this.Cancel();
      }
     else
      {
       if(!this.c)
        {
         this.c=true;
         action=function(a)
         {
          return a(null);
         };
         array=this.r;
         _1=Arrays.iter(action,array);
        }
       else
        {
         _1=null;
        }
       _=_1;
      }
     return _;
    },
    CancelAfter:function(delay)
    {
     var _,option,arg0,_this=this;
     if(!this.c)
      {
       option=this.pending;
       Option.iter(function(handle)
       {
        return clearTimeout(handle);
       },option);
       arg0=setTimeout(function()
       {
        return _this.Cancel();
       },delay);
       _=void(this.pending={
        $:1,
        $0:arg0
       });
      }
     else
      {
       _=null;
      }
     return _;
    },
    get_IsCancellationRequested:function()
    {
     return this.c;
    }
   },{
    CreateLinkedTokenSource:function(t1,t2)
    {
     return CancellationTokenSource.CreateLinkedTokenSource1([t1,t2]);
    },
    CreateLinkedTokenSource1:function(tokens)
    {
     var cts,action;
     cts=CancellationTokenSource.New();
     action=function(t)
     {
      var value;
      value=Concurrency.Register(t,function()
      {
       return function()
       {
        return cts.Cancel();
       }();
      });
      return;
     };
     return Arrays.iter(action,tokens);
    },
    New:function()
    {
     var r;
     r=Runtime.New(this,{});
     r.c=false;
     r.pending={
      $:0
     };
     r.r=[];
     return r;
    }
   }),
   Char:Runtime.Class({},{
    GetNumericValue:function(c)
    {
     return(c>=48?c<=57:false)?Number(c)-Number(48):-1;
    },
    IsControl:function(c)
    {
     return(c>=0?c<=31:false)?true:c>=128?c<=159:false;
    },
    IsDigit:function(c)
    {
     return c>=48?c<=57:false;
    },
    IsLetter:function(c)
    {
     return(c>=65?c<=90:false)?true:c>=97?c<=122:false;
    },
    IsLetterOrDigit:function(c)
    {
     return Char.IsLetter(c)?true:Char.IsDigit(c);
    },
    IsLower:function(c)
    {
     return c>=97?c<=122:false;
    },
    IsUpper:function(c)
    {
     return c>=65?c<=90:false;
    },
    IsWhiteSpace:function($c)
    {
     var $0=this,$this=this;
     return Global.String.fromCharCode($c).match(/\s/)!==null;
    },
    Parse:function(s)
    {
     return s.length===1?s.charCodeAt(0):Operators.FailWith("String must be exactly one character long.");
    }
   }),
   Concurrency:{
    AwaitEvent:function(e)
    {
     var r;
     r=function(c)
     {
      var sub,sub1,creg,creg1,sub2,creg2;
      sub=function()
      {
       return Util.subscribeTo(e,function(x)
       {
        var action;
        Lazy.Force(sub1).Dispose();
        Lazy.Force(creg1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:0,
          $0:x
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      sub1=Lazy.Create(sub);
      creg=function()
      {
       return Concurrency.Register(c.ct,function()
       {
        var action;
        Lazy.Force(sub1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:2,
          $0:OperationCanceledException.New()
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      creg1=Lazy.Create(creg);
      sub2=Lazy.Force(sub1);
      creg2=Lazy.Force(creg1);
      return null;
     };
     return Concurrency.checkCancel(r);
    },
    Bind:function(r,f)
    {
     var r1;
     r1=function(c)
     {
      return r({
       k:function(_arg1)
       {
        var _,x,action,action1;
        if(_arg1.$==0)
         {
          x=_arg1.$0;
          action=function()
          {
           var _1,e;
           try
           {
            _1=(f(x))(c);
           }
           catch(e)
           {
            _1=c.k.call(null,{
             $:1,
             $0:e
            });
           }
           return _1;
          };
          _=Concurrency.scheduler().Fork(action);
         }
        else
         {
          action1=function()
          {
           return c.k.call(null,_arg1);
          };
          _=Concurrency.scheduler().Fork(action1);
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r1);
    },
    Catch:function(r)
    {
     var r1;
     r1=function(c)
     {
      var _,e1;
      try
      {
       _=r({
        k:function(_arg1)
        {
         var _1,x,e;
         if(_arg1.$==0)
          {
           x=_arg1.$0;
           _1=c.k.call(null,{
            $:0,
            $0:{
             $:0,
             $0:x
            }
           });
          }
         else
          {
           if(_arg1.$==1)
            {
             e=_arg1.$0;
             _1=c.k.call(null,{
              $:0,
              $0:{
               $:1,
               $0:e
              }
             });
            }
           else
            {
             _1=c.k.call(null,_arg1);
            }
          }
         return _1;
        },
        ct:c.ct
       });
      }
      catch(e1)
      {
       _=c.k.call(null,{
        $:0,
        $0:{
         $:1,
         $0:e1
        }
       });
      }
      return _;
     };
     return Concurrency.checkCancel(r1);
    },
    Combine:function(a,b)
    {
     return Concurrency.Bind(a,function()
     {
      return b;
     });
    },
    Delay:function(mk)
    {
     var r;
     r=function(c)
     {
      var _,e;
      try
      {
       _=(mk(null))(c);
      }
      catch(e)
      {
       _=c.k.call(null,{
        $:1,
        $0:e
       });
      }
      return _;
     };
     return Concurrency.checkCancel(r);
    },
    For:function(s,b)
    {
     var ie;
     ie=Enumerator.Get(s);
     return Concurrency.While(function()
     {
      return ie.MoveNext();
     },Concurrency.Delay(function()
     {
      return b(ie.get_Current());
     }));
    },
    FromContinuations:function(subscribe)
    {
     var r;
     r=function(c)
     {
      var continued,once;
      continued=[false];
      once=function(cont)
      {
       var _;
       if(continued[0])
        {
         _=Operators.FailWith("A continuation provided by Async.FromContinuations was invoked multiple times");
        }
       else
        {
         continued[0]=true;
         _=Concurrency.scheduler().Fork(cont);
        }
       return _;
      };
      return subscribe([function(a)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:0,
         $0:a
        });
       });
      },function(e)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:1,
         $0:e
        });
       });
      },function(e)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:2,
         $0:e
        });
       });
      }]);
     };
     return Concurrency.checkCancel(r);
    },
    GetCT:Runtime.Field(function()
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    }),
    Ignore:function(r)
    {
     return Concurrency.Bind(r,function()
     {
      return Concurrency.Return(null);
     });
    },
    OnCancel:function(action)
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:Concurrency.Register(c.ct,action)
      });
     };
     return Concurrency.checkCancel(r);
    },
    Parallel:function(cs)
    {
     var cs1,_,r;
     cs1=Arrays.ofSeq(cs);
     if(Arrays.length(cs1)===0)
      {
       _=Concurrency.Return([]);
      }
     else
      {
       r=function(c)
       {
        var n,o,a,accept;
        n=cs1.length;
        o=[n];
        a=Arrays.create(n,undefined);
        accept=function(i)
        {
         return function(x)
         {
          var matchValue,_1,_2,x1,res,_3,x2,n1,res1;
          matchValue=[o[0],x];
          if(matchValue[0]===0)
           {
            _1=null;
           }
          else
           {
            if(matchValue[0]===1)
             {
              if(matchValue[1].$==0)
               {
                x1=matchValue[1].$0;
                Arrays.set(a,i,x1);
                o[0]=0;
                _2=c.k.call(null,{
                 $:0,
                 $0:a
                });
               }
              else
               {
                matchValue[0];
                res=matchValue[1];
                o[0]=0;
                _2=c.k.call(null,res);
               }
              _1=_2;
             }
            else
             {
              if(matchValue[1].$==0)
               {
                x2=matchValue[1].$0;
                n1=matchValue[0];
                Arrays.set(a,i,x2);
                _3=void(o[0]=n1-1);
               }
              else
               {
                matchValue[0];
                res1=matchValue[1];
                o[0]=0;
                _3=c.k.call(null,res1);
               }
              _1=_3;
             }
           }
          return _1;
         };
        };
        return Arrays.iteri(function(i)
        {
         return function(run)
         {
          var action;
          action=function()
          {
           return run({
            k:accept(i),
            ct:c.ct
           });
          };
          return Concurrency.scheduler().Fork(action);
         };
        },cs1);
       };
       _=Concurrency.checkCancel(r);
      }
     return _;
    },
    Register:function(ct,callback)
    {
     var i;
     i=ct.r.push(callback)-1;
     return{
      Dispose:function()
      {
       return Arrays.set(ct.r,i,function()
       {
       });
      }
     };
    },
    Return:function(x)
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:x
      });
     };
     return Concurrency.checkCancel(r);
    },
    Scheduler:Runtime.Class({
     Fork:function(action)
     {
      var _,value,_this=this;
      this.robin.push(action);
      if(this.idle)
       {
        this.idle=false;
        value=setTimeout(function()
        {
         return _this.tick();
        },0);
        _=void value;
       }
      else
       {
        _=null;
       }
      return _;
     },
     tick:function()
     {
      var t,loop,matchValue,_,_1,value,_this=this;
      t=Date.now();
      loop=true;
      while(loop)
       {
        matchValue=this.robin.length;
        if(matchValue===0)
         {
          this.idle=true;
          _=loop=false;
         }
        else
         {
          (this.robin.shift())(null);
          if(Date.now()-t>40)
           {
            value=setTimeout(function()
            {
             return _this.tick();
            },0);
            _1=loop=false;
           }
          else
           {
            _1=null;
           }
          _=_1;
         }
       }
      return;
     }
    },{
     New:function()
     {
      var r;
      r=Runtime.New(this,{});
      r.idle=true;
      r.robin=[];
      return r;
     }
    }),
    Sleep:function(ms)
    {
     var r;
     r=function(c)
     {
      var pending,pending1,creg,creg1,pending2,creg2;
      pending=function()
      {
       return setTimeout(function()
       {
        var action;
        Lazy.Force(creg1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:0,
          $0:null
         });
        };
        return Concurrency.scheduler().Fork(action);
       },ms);
      };
      pending1=Lazy.Create(pending);
      creg=function()
      {
       return Concurrency.Register(c.ct,function()
       {
        var action;
        clearTimeout(Lazy.Force(pending1));
        action=function()
        {
         return c.k.call(null,{
          $:2,
          $0:OperationCanceledException.New()
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      creg1=Lazy.Create(creg);
      pending2=Lazy.Force(pending1);
      creg2=Lazy.Force(creg1);
      return null;
     };
     return Concurrency.checkCancel(r);
    },
    Start:function(c,ctOpt)
    {
     return Concurrency.StartWithContinuations(c,function()
     {
     },function(exn)
     {
      var ps;
      ps=[exn];
      return console?console.log.apply(console,["WebSharper: Uncaught asynchronous exception"].concat(ps)):undefined;
     },function()
     {
     },ctOpt);
    },
    StartChild:function(r)
    {
     var r1;
     r1=function(c)
     {
      var cached,queue,action,r2,r21;
      cached=[{
       $:0
      }];
      queue=[];
      action=function()
      {
       return r({
        k:function(res)
        {
         cached[0]={
          $:1,
          $0:res
         };
         while(queue.length>0)
          {
           (queue.shift())(res);
          }
         return;
        },
        ct:c.ct
       });
      };
      Concurrency.scheduler().Fork(action);
      r2=function(c2)
      {
       var matchValue,_,x;
       matchValue=cached[0];
       if(matchValue.$==0)
        {
         _=queue.push(c2.k);
        }
       else
        {
         x=matchValue.$0;
         _=c2.k.call(null,x);
        }
       return _;
      };
      r21=Concurrency.checkCancel(r2);
      return c.k.call(null,{
       $:0,
       $0:r21
      });
     };
     return Concurrency.checkCancel(r1);
    },
    StartWithContinuations:function(c,s,f,cc,ctOpt)
    {
     var ct,action;
     ct=Operators.DefaultArg(ctOpt,(Concurrency.defCTS())[0]);
     action=function()
     {
      return c({
       k:function(_arg1)
       {
        var _,e,e1,x;
        if(_arg1.$==1)
         {
          e=_arg1.$0;
          _=f(e);
         }
        else
         {
          if(_arg1.$==2)
           {
            e1=_arg1.$0;
            _=cc(e1);
           }
          else
           {
            x=_arg1.$0;
            _=s(x);
           }
         }
        return _;
       },
       ct:ct
      });
     };
     return Concurrency.scheduler().Fork(action);
    },
    TryCancelled:function(run,comp)
    {
     var r;
     r=function(c)
     {
      return run({
       k:function(_arg1)
       {
        var _,e;
        if(_arg1.$==2)
         {
          e=_arg1.$0;
          comp(e);
          _=c.k.call(null,_arg1);
         }
        else
         {
          _=c.k.call(null,_arg1);
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    },
    TryFinally:function(run,f)
    {
     var r;
     r=function(c)
     {
      return run({
       k:function(r1)
       {
        var _,e;
        try
        {
         f(null);
         _=c.k.call(null,r1);
        }
        catch(e)
        {
         _=c.k.call(null,{
          $:1,
          $0:e
         });
        }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    },
    TryWith:function(r,f)
    {
     var r1;
     r1=function(c)
     {
      return r({
       k:function(_arg1)
       {
        var _,x,e,_1,e1;
        if(_arg1.$==0)
         {
          x=_arg1.$0;
          _=c.k.call(null,{
           $:0,
           $0:x
          });
         }
        else
         {
          if(_arg1.$==1)
           {
            e=_arg1.$0;
            try
            {
             _1=(f(e))(c);
            }
            catch(e1)
            {
             _1=c.k.call(null,_arg1);
            }
            _=_1;
           }
          else
           {
            _=c.k.call(null,_arg1);
           }
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r1);
    },
    Using:function(x,f)
    {
     return Concurrency.TryFinally(f(x),function()
     {
      return x.Dispose();
     });
    },
    While:function(g,c)
    {
     return g(null)?Concurrency.Bind(c,function()
     {
      return Concurrency.While(g,c);
     }):Concurrency.Return(null);
    },
    checkCancel:function(r)
    {
     return function(c)
     {
      return c.ct.c?c.k.call(null,{
       $:2,
       $0:OperationCanceledException.New()
      }):r(c);
     };
    },
    defCTS:Runtime.Field(function()
    {
     return[CancellationTokenSource.New()];
    }),
    scheduler:Runtime.Field(function()
    {
     return Scheduler.New();
    })
   },
   Control:{
    createEvent:function(add,remove,create)
    {
     return{
      AddHandler:add,
      RemoveHandler:remove,
      Subscribe:function(r)
      {
       var h;
       h=create(function()
       {
        return function(args)
        {
         return r.OnNext.call(null,args);
        };
       });
       add(h);
       return{
        Dispose:function()
        {
         return remove(h);
        }
       };
      }
     };
    }
   },
   DateTimeHelpers:{
    AddMonths:function(d,months)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear(),e.getMonth()+months,e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
    },
    AddYears:function(d,years)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear()+years,e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
    },
    DatePortion:function(d)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear(),e.getMonth(),e.getDate())).getTime();
    },
    TimePortion:function(d)
    {
     var e;
     e=new Date(d);
     return(((24*0+e.getHours())*60+e.getMinutes())*60+e.getSeconds())*1000+e.getMilliseconds();
    }
   },
   Enumerable:{
    Of:function(getEnumerator)
    {
     return{
      GetEnumerator:getEnumerator
     };
    }
   },
   Enumerator:{
    Get:function(x)
    {
     return x instanceof Global.Array?T.New(0,null,function(e)
     {
      var i,_;
      i=e.s;
      if(i<Arrays.length(x))
       {
        e.c=Arrays.get(x,i);
        e.s=i+1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     }):Unchecked.Equals(typeof x,"string")?T.New(0,null,function(e)
     {
      var i,_;
      i=e.s;
      if(i<x.length)
       {
        e.c=x.charCodeAt(i);
        e.s=i+1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     }):x.GetEnumerator();
    },
    T:Runtime.Class({
     MoveNext:function()
     {
      return this.n.call(null,this);
     },
     get_Current:function()
     {
      return this.c;
     }
    },{
     New:function(s,c,n)
     {
      var r;
      r=Runtime.New(this,{});
      r.s=s;
      r.c=c;
      r.n=n;
      return r;
     }
    })
   },
   Exception:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,Exception.New1("Exception of type 'System.Exception' was thrown."));
    },
    New1:function($message)
    {
     var $0=this,$this=this;
     return new Global.Error($message);
    }
   }),
   Guid:Runtime.Class({},{
    NewGuid:function()
    {
     var $0=this,$this=this;
     return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c)
     {
      var r=Global.Math.random()*16|0,v=c=="x"?r:r&0x3|0x8;
      return v.toString(16);
     });
    }
   }),
   Html:{
    Client:{
     Activator:{
      Activate:Runtime.Field(function()
      {
       var _,meta;
       if(Activator.hasDocument())
        {
         meta=document.getElementById("websharper-data");
         _=meta?jQuery(document).ready(function()
         {
          var text,obj,action,array;
          text=meta.getAttribute("content");
          obj=Json.Activate(JSON.parse(text));
          action=function(tupledArg)
          {
           var k,v,p,old;
           k=tupledArg[0];
           v=tupledArg[1];
           p=v.get_Body();
           old=document.getElementById(k);
           return p.ReplaceInDom(old);
          };
          array=JSModule.GetFields(obj);
          return Arrays.iter(action,array);
         }):null;
        }
       else
        {
         _=null;
        }
       return _;
      }),
      hasDocument:function()
      {
       var $0=this,$this=this;
       return typeof Global.document!=="undefined";
      }
     },
     HtmlContentExtensions:{
      "IControlBody.SingleNode.Static":function(node)
      {
       return SingleNode.New(node);
      },
      SingleNode:Runtime.Class({
       ReplaceInDom:function(old)
       {
        var value;
        value=this.node.parentNode.replaceChild(this.node,old);
        return;
       }
      },{
       New:function(node)
       {
        var r;
        r=Runtime.New(this,{});
        r.node=node;
        return r;
       }
      })
     }
    }
   },
   IndexOutOfRangeException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,IndexOutOfRangeException.New1("Index was outside the bounds of the array."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   InvalidOperationException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,InvalidOperationException.New1("Operation is not valid due to the current state of the object."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   JavaScript:{
    JSModule:{
     Delete:function($x,$field)
     {
      var $0=this,$this=this;
      return delete $x[$field];
     },
     ForEach:function($x,$iter)
     {
      var $0=this,$this=this;
      for(var k in $x){
       if($iter(k))
        break;
      }
     },
     GetFieldNames:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push(k);
      return r;
     },
     GetFieldValues:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push($o[k]);
      return r;
     },
     GetFields:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push([k,$o[k]]);
      return r;
     },
     Log:function($x)
     {
      var $0=this,$this=this;
      if(Global.console)
       Global.console.log($x);
     },
     LogMore:function($args)
     {
      var $0=this,$this=this;
      if(Global.console)
       Global.console.log.apply(Global.console,$args);
     }
    },
    Pervasives:{
     NewFromList:function(fields)
     {
      var r,enumerator,forLoopVar,v,k;
      r={};
      enumerator=Enumerator.Get(fields);
      while(enumerator.MoveNext())
       {
        forLoopVar=enumerator.get_Current();
        v=forLoopVar[1];
        k=forLoopVar[0];
        r[k]=v;
       }
      return r;
     }
    }
   },
   Json:{
    Activate:function(json)
    {
     var types,i,decode;
     types=json.$TYPES;
     for(i=0;i<=Arrays.length(types)-1;i++){
      Arrays.set(types,i,Json.lookup(Arrays.get(types,i)));
     }
     decode=function(x)
     {
      var _,matchValue,_1,_2,o,ti,_3,r;
      if(Unchecked.Equals(x,null))
       {
        _=x;
       }
      else
       {
        matchValue=typeof x;
        if(matchValue==="object")
         {
          if(x instanceof Global.Array)
           {
            _2=Json.shallowMap(decode,x);
           }
          else
           {
            o=Json.shallowMap(decode,x.$V);
            ti=x.$T;
            if(Unchecked.Equals(typeof ti,"undefined"))
             {
              _3=o;
             }
            else
             {
              r=new(Arrays.get(types,ti))();
              JSModule.ForEach(o,function(k)
              {
               r[k]=o[k];
               return false;
              });
              _3=r;
             }
            _2=_3;
           }
          _1=_2;
         }
        else
         {
          _1=x;
         }
        _=_1;
       }
      return _;
     };
     return decode(json.$DATA);
    },
    lookup:function(x)
    {
     var k,r,i,n,rn,_;
     k=Arrays.length(x);
     r=Global;
     i=0;
     while(i<k)
      {
       n=Arrays.get(x,i);
       rn=r[n];
       if(!Unchecked.Equals(typeof rn,undefined))
        {
         r=rn;
         _=i=i+1;
        }
       else
        {
         _=Operators.FailWith("Invalid server reply. Failed to find type: "+n);
        }
      }
     return r;
    },
    shallowMap:function(f,x)
    {
     var _,matchValue,_1,r;
     if(x instanceof Global.Array)
      {
       _=Arrays.map(f,x);
      }
     else
      {
       matchValue=typeof x;
       if(matchValue==="object")
        {
         r={};
         JSModule.ForEach(x,function(y)
         {
          r[y]=f(x[y]);
          return false;
         });
         _1=r;
        }
       else
        {
         _1=x;
        }
       _=_1;
      }
     return _;
    }
   },
   Lazy:{
    Create:function(f)
    {
     var x,get;
     x={
      value:undefined,
      created:false,
      eval:f
     };
     get=function()
     {
      var _;
      if(x.created)
       {
        _=x.value;
       }
      else
       {
        x.created=true;
        x.value=f(null);
        _=x.value;
       }
      return _;
     };
     x.eval=get;
     return x;
    },
    CreateFromValue:function(v)
    {
     return{
      value:v,
      created:true,
      eval:function()
      {
       return v;
      },
      eval:function()
      {
       return v;
      }
     };
    },
    Force:function(x)
    {
     return x.eval.call(null,null);
    }
   },
   List:{
    T:Runtime.Class({
     GetEnumerator:function()
     {
      return T.New(this,null,function(e)
      {
       var matchValue,_,xs,x;
       matchValue=e.s;
       if(matchValue.$==0)
        {
         _=false;
        }
       else
        {
         xs=matchValue.$1;
         x=matchValue.$0;
         e.c=x;
         e.s=xs;
         _=true;
        }
       return _;
      });
     },
     get_Item:function(x)
     {
      return Seq.nth(x,this);
     },
     get_Length:function()
     {
      return Seq.length(this);
     }
    },{
     Construct:function(head,tail)
     {
      return Runtime.New(T1,{
       $:1,
       $0:head,
       $1:tail
      });
     },
     get_Nil:function()
     {
      return Runtime.New(T1,{
       $:0
      });
     }
    }),
    append:function(x,y)
    {
     return List.ofSeq(Seq.append(x,y));
    },
    choose:function(f,l)
    {
     return List.ofSeq(Seq.choose(f,l));
    },
    collect:function(f,l)
    {
     return List.ofSeq(Seq.collect(f,l));
    },
    concat:function(s)
    {
     return List.ofSeq(Seq.concat(s));
    },
    exists2:function(p,l1,l2)
    {
     return Arrays.exists2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    filter:function(p,l)
    {
     return List.ofSeq(Seq.filter(p,l));
    },
    fold2:function(f,s,l1,l2)
    {
     return Arrays.fold2(f,s,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    foldBack:function(f,l,s)
    {
     return Arrays.foldBack(f,Arrays.ofSeq(l),s);
    },
    foldBack2:function(f,l1,l2,s)
    {
     return Arrays.foldBack2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2),s);
    },
    forall2:function(p,l1,l2)
    {
     return Arrays.forall2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    head:function(l)
    {
     var _,h;
     if(l.$==1)
      {
       h=l.$0;
       _=h;
      }
     else
      {
       _=Operators.FailWith("The input list was empty.");
      }
     return _;
    },
    init:function(s,f)
    {
     return List.ofArray(Arrays.init(s,f));
    },
    iter2:function(f,l1,l2)
    {
     return Arrays.iter2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    iteri2:function(f,l1,l2)
    {
     return Arrays.iteri2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    map:function(f,l)
    {
     return List.ofSeq(Seq.map(f,l));
    },
    map2:function(f,l1,l2)
    {
     return List.ofArray(Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    map3:function(f,l1,l2,l3)
    {
     var array;
     array=Arrays.map2(function(func)
     {
      return function(arg1)
      {
       return func(arg1);
      };
     },Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)),Arrays.ofSeq(l3));
     return List.ofArray(array);
    },
    mapi:function(f,l)
    {
     return List.ofSeq(Seq.mapi(f,l));
    },
    mapi2:function(f,l1,l2)
    {
     return List.ofArray(Arrays.mapi2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    max:function(l)
    {
     return Seq.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Max(e1,e2);
      };
     },l);
    },
    maxBy:function(f,l)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===1?x:y;
      };
     },l);
    },
    min:function(l)
    {
     return Seq.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Min(e1,e2);
      };
     },l);
    },
    minBy:function(f,l)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===-1?x:y;
      };
     },l);
    },
    ofArray:function(arr)
    {
     var r,i;
     r=Runtime.New(T1,{
      $:0
     });
     for(i=0;i<=Arrays.length(arr)-1;i++){
      r=Runtime.New(T1,{
       $:1,
       $0:Arrays.get(arr,Arrays.length(arr)-i-1),
       $1:r
      });
     }
     return r;
    },
    ofSeq:function(s)
    {
     var r,e,x;
     r=[];
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       r.unshift(e.get_Current());
      }
     x=r.slice(0);
     x.reverse();
     return List.ofArray(x);
    },
    partition:function(p,l)
    {
     var patternInput,b,a;
     patternInput=Arrays.partition(p,Arrays.ofSeq(l));
     b=patternInput[1];
     a=patternInput[0];
     return[List.ofArray(a),List.ofArray(b)];
    },
    permute:function(f,l)
    {
     return List.ofArray(Arrays.permute(f,Arrays.ofSeq(l)));
    },
    reduceBack:function(f,l)
    {
     return Arrays.reduceBack(f,Arrays.ofSeq(l));
    },
    replicate:function(size,value)
    {
     return List.ofArray(Arrays.create(size,value));
    },
    rev:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     a.reverse();
     return List.ofArray(a);
    },
    scan:function(f,s,l)
    {
     return List.ofSeq(Seq.scan(f,s,l));
    },
    scanBack:function(f,l,s)
    {
     return List.ofArray(Arrays.scanBack(f,Arrays.ofSeq(l),s));
    },
    sort:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays.sortInPlace(a);
     return List.ofArray(a);
    },
    sortBy:function(f,l)
    {
     return List.sortWith(function(x)
     {
      return function(y)
      {
       return Operators.Compare(f(x),f(y));
      };
     },l);
    },
    sortWith:function(f,l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays.sortInPlaceWith(f,a);
     return List.ofArray(a);
    },
    tail:function(l)
    {
     var _,t;
     if(l.$==1)
      {
       t=l.$1;
       _=t;
      }
     else
      {
       _=Operators.FailWith("The input list was empty.");
      }
     return _;
    },
    unzip:function(l)
    {
     var x,y,enumerator,forLoopVar,b,a;
     x=[];
     y=[];
     enumerator=Enumerator.Get(l);
     while(enumerator.MoveNext())
      {
       forLoopVar=enumerator.get_Current();
       b=forLoopVar[1];
       a=forLoopVar[0];
       x.push(a);
       y.push(b);
      }
     return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0))];
    },
    unzip3:function(l)
    {
     var x,y,z,enumerator,forLoopVar,c,b,a;
     x=[];
     y=[];
     z=[];
     enumerator=Enumerator.Get(l);
     while(enumerator.MoveNext())
      {
       forLoopVar=enumerator.get_Current();
       c=forLoopVar[2];
       b=forLoopVar[1];
       a=forLoopVar[0];
       x.push(a);
       y.push(b);
       z.push(c);
      }
     return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0)),List.ofArray(z.slice(0))];
    },
    zip:function(l1,l2)
    {
     return List.ofArray(Arrays.zip(Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    zip3:function(l1,l2,l3)
    {
     return List.ofArray(Arrays.zip3(Arrays.ofSeq(l1),Arrays.ofSeq(l2),Arrays.ofSeq(l3)));
    }
   },
   MatchFailureException:Runtime.Class({},{
    New:function(message,line,column)
    {
     return Runtime.New(this,Exception.New1(message+" at "+Global.String(line)+":"+Global.String(column)));
    }
   }),
   OperationCanceledException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,OperationCanceledException.New1("The operation was canceled."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   Operators:{
    Compare:function(a,b)
    {
     return Unchecked.Compare(a,b);
    },
    DefaultArg:function(x,d)
    {
     var _,x1;
     if(x.$==0)
      {
       _=d;
      }
     else
      {
       x1=x.$0;
       _=x1;
      }
     return _;
    },
    FailWith:function(msg)
    {
     return Operators.Raise(Exception.New1(msg));
    },
    KeyValue:function(kvp)
    {
     return[kvp.K,kvp.V];
    },
    Max:function(a,b)
    {
     return Unchecked.Compare(a,b)===1?a:b;
    },
    Min:function(a,b)
    {
     return Unchecked.Compare(a,b)===-1?a:b;
    },
    Pown:function(a,n)
    {
     var p;
     p=function(n1)
     {
      var _,_1,b;
      if(n1===1)
       {
        _=a;
       }
      else
       {
        if(n1%2===0)
         {
          b=p(n1/2>>0);
          _1=b*b;
         }
        else
         {
          _1=a*p(n1-1);
         }
        _=_1;
       }
      return _;
     };
     return p(n);
    },
    Raise:function($e)
    {
     var $0=this,$this=this;
     throw $e;
    },
    Sign:function(x)
    {
     return x===0?0:x<0?-1:1;
    },
    Truncate:function(x)
    {
     return x<0?Math.ceil(x):Math.floor(x);
    },
    Using:function(t,f)
    {
     var _;
     try
     {
      _=f(t);
     }
     finally
     {
      t.Dispose();
     }
     return _;
    },
    range:function(min,max)
    {
     return Seq.init(1+max-min,function(x)
     {
      return x+min;
     });
    },
    step:function(min,step,max)
    {
     var s,predicate,source,x;
     s=Operators.Sign(step);
     predicate=function(k)
     {
      return s*(max-k)>=0;
     };
     source=Seq.initInfinite(function(k)
     {
      return min+k*step;
     });
     x=Seq.takeWhile(predicate,source);
     return x;
    }
   },
   Option:{
    bind:function(f,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       x1=x.$0;
       _=f(x1);
      }
     return _;
    },
    exists:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=false;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    fold:function(f,s,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=s;
      }
     else
      {
       x1=x.$0;
       _=(f(s))(x1);
      }
     return _;
    },
    foldBack:function(f,x,s)
    {
     var _,x1;
     if(x.$==0)
      {
       _=s;
      }
     else
      {
       x1=x.$0;
       _=(f(x1))(s);
      }
     return _;
    },
    forall:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=true;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    iter:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=null;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    map:function(f,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       x1=x.$0;
       _={
        $:1,
        $0:f(x1)
       };
      }
     return _;
    },
    toArray:function(x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=[];
      }
     else
      {
       x1=x.$0;
       _=[x1];
      }
     return _;
    },
    toList:function(x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=Runtime.New(T1,{
        $:0
       });
      }
     else
      {
       x1=x.$0;
       _=List.ofArray([x1]);
      }
     return _;
    }
   },
   PrintfHelpers:{
    padNumLeft:function(s,l)
    {
     var f;
     f=Arrays.get(s,0);
     return((f===" "?true:f==="+")?true:f==="-")?f+Strings.PadLeftWith(s.substr(1),l-1,48):Strings.PadLeftWith(s,l,48);
    },
    plusForPos:function(n,s)
    {
     return 0<=n?"+"+s:s;
    },
    prettyPrint:function(o)
    {
     var printObject,t,_1,_2,_3,mapping1,strings1;
     printObject=function(o1)
     {
      var s,_,mapping,array,strings;
      s=Global.String(o1);
      if(s==="[object Object]")
       {
        mapping=function(tupledArg)
        {
         var k,v;
         k=tupledArg[0];
         v=tupledArg[1];
         return k+" = "+PrintfHelpers.prettyPrint(v);
        };
        array=JSModule.GetFields(o1);
        strings=Arrays.map(mapping,array);
        _="{"+Strings.concat("; ",strings)+"}";
       }
      else
       {
        _=s;
       }
      return _;
     };
     t=typeof o;
     if(t=="string")
      {
       _1="\""+o+"\"";
      }
     else
      {
       if(t=="object")
        {
         if(o instanceof Global.Array)
          {
           mapping1=function(o1)
           {
            return PrintfHelpers.prettyPrint(o1);
           };
           strings1=Arrays.map(mapping1,o);
           _3="[|"+Strings.concat("; ",strings1)+"|]";
          }
         else
          {
           _3=printObject(o);
          }
         _2=_3;
        }
       else
        {
         _2=Global.String(o);
        }
       _1=_2;
      }
     return _1;
    },
    printArray:function(p,o)
    {
     var strings;
     strings=Arrays.map(p,o);
     return"[|"+Strings.concat("; ",strings)+"|]";
    },
    printArray2D:function(p,o)
    {
     var strings;
     strings=Seq.delay(function()
     {
      var l2;
      l2=o.length?o[0].length:0;
      return Seq.map(function(i)
      {
       var strings1;
       strings1=Seq.delay(function()
       {
        return Seq.map(function(j)
        {
         return p(Arrays.get2D(o,i,j));
        },Operators.range(0,l2-1));
       });
       return Strings.concat("; ",strings1);
      },Operators.range(0,o.length-1));
     });
     return"[["+Strings.concat("][",strings)+"]]";
    },
    printList:function(p,o)
    {
     var strings;
     strings=Seq.map(p,o);
     return"["+Strings.concat("; ",strings)+"]";
    },
    spaceForPos:function(n,s)
    {
     return 0<=n?" "+s:s;
    },
    toSafe:function(s)
    {
     return s==null?"":s;
    }
   },
   Queue:{
    Clear:function(a)
    {
     return a.splice(0,Arrays.length(a));
    },
    Contains:function(a,el)
    {
     return Seq.exists(function(y)
     {
      return Unchecked.Equals(el,y);
     },a);
    },
    CopyTo:function(a,array,index)
    {
     return Arrays.blit(a,0,array,index,Arrays.length(a));
    }
   },
   Random:Runtime.Class({
    Next:function()
    {
     return Math.floor(Math.random()*2147483648);
    },
    Next1:function(maxValue)
    {
     return maxValue<0?Operators.FailWith("'maxValue' must be greater than zero."):Math.floor(Math.random()*maxValue);
    },
    Next2:function(minValue,maxValue)
    {
     var _,maxValue1;
     if(minValue>maxValue)
      {
       _=Operators.FailWith("'minValue' cannot be greater than maxValue.");
      }
     else
      {
       maxValue1=maxValue-minValue;
       _=minValue+Math.floor(Math.random()*maxValue1);
      }
     return _;
    },
    NextBytes:function(buffer)
    {
     var i;
     for(i=0;i<=Arrays.length(buffer)-1;i++){
      Arrays.set(buffer,i,Math.floor(Math.random()*256));
     }
     return;
    }
   },{
    New:function()
    {
     return Runtime.New(this,{});
    }
   }),
   Ref:{
    decr:function($x)
    {
     var $0=this,$this=this;
     return void($x[0]--);
    },
    incr:function($x)
    {
     var $0=this,$this=this;
     return void($x[0]++);
    }
   },
   Remoting:{
    AjaxProvider:Runtime.Field(function()
    {
     return XhrProvider.New();
    }),
    AjaxRemotingProvider:Runtime.Class({},{
     Async:function(m,data)
     {
      var headers,payload;
      headers=Remoting.makeHeaders(m);
      payload=Remoting.makePayload(data);
      return Concurrency.Delay(function()
      {
       var x;
       x=AsyncProxy.get_CancellationToken();
       return Concurrency.Bind(x,function(_arg1)
       {
        return Concurrency.FromContinuations(function(tupledArg)
        {
         var ok,err,cc,waiting,reg,ok1,err1,arg00;
         ok=tupledArg[0];
         err=tupledArg[1];
         cc=tupledArg[2];
         waiting=[true];
         reg=Concurrency.Register(_arg1,function()
         {
          return function()
          {
           var _;
           if(waiting[0])
            {
             waiting[0]=false;
             _=cc(OperationCanceledException.New());
            }
           else
            {
             _=null;
            }
           return _;
          }();
         });
         ok1=function(x1)
         {
          var _;
          if(waiting[0])
           {
            waiting[0]=false;
            reg.Dispose();
            _=ok(Json.Activate(JSON.parse(x1)));
           }
          else
           {
            _=null;
           }
          return _;
         };
         err1=function(e)
         {
          var _;
          if(waiting[0])
           {
            waiting[0]=false;
            reg.Dispose();
            _=err(e);
           }
          else
           {
            _=null;
           }
          return _;
         };
         arg00=Remoting.EndPoint();
         return Remoting.AjaxProvider().Async(arg00,headers,payload,ok1,err1);
        });
       });
      });
     },
     Send:function(m,data)
     {
      return Concurrency.Start(Concurrency.Ignore(AjaxRemotingProvider.Async(m,data)),{
       $:0
      });
     },
     Sync:function(m,data)
     {
      var arg00,arg10,arg20,data1;
      arg00=Remoting.EndPoint();
      arg10=Remoting.makeHeaders(m);
      arg20=Remoting.makePayload(data);
      data1=Remoting.AjaxProvider().Sync(arg00,arg10,arg20);
      return Json.Activate(JSON.parse(data1));
     }
    }),
    EndPoint:Runtime.Field(function()
    {
     return"?";
    }),
    UseHttps:function()
    {
     var _,_1,_2,matchValue;
     try
     {
      if(!Strings.StartsWith(window.location.href,"https://"))
       {
        _2=Strings.Replace(window.location.href,"http://","https://");
        Remoting.EndPoint=function()
        {
         return _2;
        };
        _1=true;
       }
      else
       {
        _1=false;
       }
      _=_1;
     }
     catch(matchValue)
     {
      _=false;
     }
     return _;
    },
    XhrProvider:Runtime.Class({
     Async:function(url,headers,data,ok,err)
     {
      return Remoting.ajax(true,url,headers,data,ok,err);
     },
     Sync:function(url,headers,data)
     {
      var res;
      res=[undefined];
      Remoting.ajax(false,url,headers,data,function(x)
      {
       res[0]=x;
      },function(e)
      {
       return Operators.Raise(e);
      });
      return res[0];
     }
    },{
     New:function()
     {
      return Runtime.New(this,{});
     }
    }),
    ajax:function($async,$url,$headers,$data,$ok,$err)
    {
     var $0=this,$this=this;
     var xhr=new Global.XMLHttpRequest();
     xhr.open("POST",$url,$async);
     if($async==true)
      {
       xhr.withCredentials=true;
      }
     for(var h in $headers){
      xhr.setRequestHeader(h,$headers[h]);
     }
     function k()
     {
      if(xhr.status==200)
       {
        $ok(xhr.responseText);
       }
      else
       {
        var msg="Response status is not 200: ";
        $err(new Global.Error(msg+xhr.status));
       }
     }
     if("onload"in xhr)
      {
       xhr.onload=xhr.onerror=xhr.onabort=k;
      }
     else
      {
       xhr.onreadystatechange=function()
       {
        if(xhr.readyState==4)
         {
          k();
         }
       };
      }
     xhr.send($data);
    },
    makeHeaders:function(m)
    {
     var headers;
     headers={};
     headers["content-type"]="application/json";
     headers["x-websharper-rpc"]=m;
     return headers;
    },
    makePayload:function(data)
    {
     return JSON.stringify(data);
    }
   },
   Seq:{
    append:function(s1,s2)
    {
     return Enumerable.Of(function()
     {
      var e1;
      e1=Enumerator.Get(s1);
      return T.New(e1,null,function(x)
      {
       var _,_1,e2,_2;
       if(x.s.MoveNext())
        {
         x.c=x.s.get_Current();
         _=true;
        }
       else
        {
         if(x.s===e1)
          {
           e2=Enumerator.Get(s2);
           x.s=e2;
           if(e2.MoveNext())
            {
             x.c=e2.get_Current();
             _2=true;
            }
           else
            {
             _2=false;
            }
           _1=_2;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       return _;
      });
     });
    },
    average:function(s)
    {
     var patternInput,sum,count;
     patternInput=Seq.fold(function(tupledArg)
     {
      var n,s1;
      n=tupledArg[0];
      s1=tupledArg[1];
      return function(x)
      {
       return[n+1,s1+x];
      };
     },[0,0],s);
     sum=patternInput[1];
     count=patternInput[0];
     return sum/count;
    },
    averageBy:function(f,s)
    {
     var patternInput,sum,count;
     patternInput=Seq.fold(function(tupledArg)
     {
      var n,s1;
      n=tupledArg[0];
      s1=tupledArg[1];
      return function(x)
      {
       return[n+1,s1+f(x)];
      };
     },[0,0],s);
     sum=patternInput[1];
     count=patternInput[0];
     return sum/count;
    },
    cache:function(s)
    {
     var cache,_enum,getEnumerator;
     cache=[];
     _enum=Enumerator.Get(s);
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       var _,_1;
       if(e.s+1<cache.length)
        {
         e.s=e.s+1;
         e.c=cache[e.s];
         _=true;
        }
       else
        {
         if(_enum.MoveNext())
          {
           e.s=e.s+1;
           e.c=_enum.get_Current();
           cache.push(e.get_Current());
           _1=true;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       return _;
      };
      return T.New(0,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    choose:function(f,s)
    {
     var mapping;
     mapping=function(x)
     {
      var matchValue,_,v;
      matchValue=f(x);
      if(matchValue.$==0)
       {
        _=Runtime.New(T1,{
         $:0
        });
       }
      else
       {
        v=matchValue.$0;
        _=List.ofArray([v]);
       }
      return _;
     };
     return Seq.collect(mapping,s);
    },
    collect:function(f,s)
    {
     return Seq.concat(Seq.map(f,s));
    },
    compareWith:function(f,s1,s2)
    {
     var e1,e2,r,loop,matchValue;
     e1=Enumerator.Get(s1);
     e2=Enumerator.Get(s2);
     r=0;
     loop=true;
     while(loop?r===0:false)
      {
       matchValue=[e1.MoveNext(),e2.MoveNext()];
       matchValue[0]?matchValue[1]?r=(f(e1.get_Current()))(e2.get_Current()):r=1:matchValue[1]?r=-1:loop=false;
      }
     return r;
    },
    concat:function(ss)
    {
     return Enumerable.Of(function()
     {
      var outerE,next;
      outerE=Enumerator.Get(ss);
      next=function(st)
      {
       var matchValue,_,_1,_2;
       matchValue=st.s;
       if(Unchecked.Equals(matchValue,null))
        {
         if(outerE.MoveNext())
          {
           st.s=Enumerator.Get(outerE.get_Current());
           _1=next(st);
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       else
        {
         if(matchValue.MoveNext())
          {
           st.c=matchValue.get_Current();
           _2=true;
          }
         else
          {
           st.s=null;
           _2=next(st);
          }
         _=_2;
        }
       return _;
      };
      return T.New(null,null,next);
     });
    },
    countBy:function(f,s)
    {
     var generator;
     generator=function()
     {
      var d,e,keys,k,h,_,mapping,array,x;
      d={};
      e=Enumerator.Get(s);
      keys=[];
      while(e.MoveNext())
       {
        k=f(e.get_Current());
        h=Unchecked.Hash(k);
        if(d.hasOwnProperty(h))
         {
          _=void(d[h]=d[h]+1);
         }
        else
         {
          keys.push(k);
          _=void(d[h]=1);
         }
       }
      mapping=function(k1)
      {
       return[k1,d[Unchecked.Hash(k1)]];
      };
      array=keys.slice(0);
      x=Arrays.map(mapping,array);
      return x;
     };
     return Seq.delay(generator);
    },
    delay:function(f)
    {
     return Enumerable.Of(function()
     {
      return Enumerator.Get(f(null));
     });
    },
    distinct:function(s)
    {
     return Seq.distinctBy(function(x)
     {
      return x;
     },s);
    },
    distinctBy:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,seen,next;
      _enum=Enumerator.Get(s);
      seen={};
      next=function(e)
      {
       var _,cur,h,check,has,_1;
       if(_enum.MoveNext())
        {
         cur=_enum.get_Current();
         h=function(c)
         {
          return Unchecked.Hash(f(c));
         };
         check=function(c)
         {
          return seen.hasOwnProperty(h(c));
         };
         has=check(cur);
         while(has?_enum.MoveNext():false)
          {
           cur=_enum.get_Current();
           has=check(cur);
          }
         if(has)
          {
           _1=false;
          }
         else
          {
           seen[h(cur)]=null;
           e.c=cur;
           _1=true;
          }
         _=_1;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    empty:function()
    {
     return[];
    },
    enumFinally:function(s,f)
    {
     return Enumerable.Of(function()
     {
      var e,_,e1;
      try
      {
       _=Enumerator.Get(s);
      }
      catch(e1)
      {
       f(null);
       _=Operators.Raise(e1);
      }
      e=_;
      return T.New(null,null,function(x)
      {
       var _1,_2,e2;
       try
       {
        if(e.MoveNext())
         {
          x.c=e.get_Current();
          _2=true;
         }
        else
         {
          f(null);
          _2=false;
         }
        _1=_2;
       }
       catch(e2)
       {
        f(null);
        _1=Operators.Raise(e2);
       }
       return _1;
      });
     });
    },
    enumUsing:function(x,f)
    {
     return f(x);
    },
    enumWhile:function(f,s)
    {
     return Enumerable.Of(function()
     {
      var next;
      next=function(en)
      {
       var matchValue,_,e,_1,_2;
       matchValue=en.s;
       if(matchValue.$==1)
        {
         e=matchValue.$0;
         if(e.MoveNext())
          {
           en.c=e.get_Current();
           _1=true;
          }
         else
          {
           en.s={
            $:0
           };
           _1=next(en);
          }
         _=_1;
        }
       else
        {
         if(f(null))
          {
           en.s={
            $:1,
            $0:Enumerator.Get(s)
           };
           _2=next(en);
          }
         else
          {
           _2=false;
          }
         _=_2;
        }
       return _;
      };
      return T.New({
       $:0
      },null,next);
     });
    },
    exists:function(p,s)
    {
     var e,r;
     e=Enumerator.Get(s);
     r=false;
     while(!r?e.MoveNext():false)
      {
       r=p(e.get_Current());
      }
     return r;
    },
    exists2:function(p,s1,s2)
    {
     var e1,e2,r;
     e1=Enumerator.Get(s1);
     e2=Enumerator.Get(s2);
     r=false;
     while((!r?e1.MoveNext():false)?e2.MoveNext():false)
      {
       r=(p(e1.get_Current()))(e2.get_Current());
      }
     return r;
    },
    filter:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,next;
      _enum=Enumerator.Get(s);
      next=function(e)
      {
       var loop,c,res,_;
       loop=_enum.MoveNext();
       c=_enum.get_Current();
       res=false;
       while(loop)
        {
         if(f(c))
          {
           e.c=c;
           res=true;
           _=loop=false;
          }
         else
          {
           _=_enum.MoveNext()?c=_enum.get_Current():loop=false;
          }
        }
       return res;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    find:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryFind(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndex:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryFindIndex(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold:function(f,x,s)
    {
     var r,e;
     r=x;
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       r=(f(r))(e.get_Current());
      }
     return r;
    },
    forall:function(p,s)
    {
     return!Seq.exists(function(x)
     {
      return!p(x);
     },s);
    },
    forall2:function(p,s1,s2)
    {
     return!Seq.exists2(function(x)
     {
      return function(y)
      {
       return!(p(x))(y);
      };
     },s1,s2);
    },
    groupBy:function(f,s)
    {
     return Seq.delay(function()
     {
      var d,d1,keys,e,c,k,h;
      d={};
      d1={};
      keys=[];
      e=Enumerator.Get(s);
      while(e.MoveNext())
       {
        c=e.get_Current();
        k=f(c);
        h=Unchecked.Hash(k);
        !d.hasOwnProperty(h)?keys.push(k):null;
        d1[h]=k;
        d.hasOwnProperty(h)?d[h].push(c):void(d[h]=[c]);
       }
      return Arrays.map(function(k1)
      {
       return[k1,d[Unchecked.Hash(k1)]];
      },keys);
     });
    },
    head:function(s)
    {
     var e;
     e=Enumerator.Get(s);
     return e.MoveNext()?e.get_Current():Seq.insufficient();
    },
    init:function(n,f)
    {
     return Seq.take(n,Seq.initInfinite(f));
    },
    initInfinite:function(f)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       e.c=f(e.s);
       e.s=e.s+1;
       return true;
      };
      return T.New(0,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    insufficient:function()
    {
     return Operators.FailWith("The input sequence has an insufficient number of elements.");
    },
    isEmpty:function(s)
    {
     var e;
     e=Enumerator.Get(s);
     return!e.MoveNext();
    },
    iter:function(p,s)
    {
     return Seq.iteri(function()
     {
      return function(x)
      {
       return p(x);
      };
     },s);
    },
    iter2:function(p,s1,s2)
    {
     var e1,e2;
     e1=Enumerator.Get(s1);
     e2=Enumerator.Get(s2);
     while(e1.MoveNext()?e2.MoveNext():false)
      {
       (p(e1.get_Current()))(e2.get_Current());
      }
     return;
    },
    iteri:function(p,s)
    {
     var i,e;
     i=0;
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       (p(i))(e.get_Current());
       i=i+1;
      }
     return;
    },
    length:function(s)
    {
     var i,e;
     i=0;
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       i=i+1;
      }
     return i;
    },
    map:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var en,next;
      en=Enumerator.Get(s);
      next=function(e)
      {
       var _;
       if(en.MoveNext())
        {
         e.c=f(en.get_Current());
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    mapi:function(f,s)
    {
     return Seq.mapi2(f,Seq.initInfinite(function(x)
     {
      return x;
     }),s);
    },
    mapi2:function(f,s1,s2)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var e1,e2,next;
      e1=Enumerator.Get(s1);
      e2=Enumerator.Get(s2);
      next=function(e)
      {
       var _;
       if(e1.MoveNext()?e2.MoveNext():false)
        {
         e.c=(f(e1.get_Current()))(e2.get_Current());
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    max:function(s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(x,y)>=0?x:y;
      };
     },s);
    },
    maxBy:function(f,s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))>=0?x:y;
      };
     },s);
    },
    min:function(s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(x,y)<=0?x:y;
      };
     },s);
    },
    minBy:function(f,s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))<=0?x:y;
      };
     },s);
    },
    nth:function(index,s)
    {
     var pos,e;
     index<0?Operators.FailWith("negative index requested"):null;
     pos=-1;
     e=Enumerator.Get(s);
     while(pos<index)
      {
       !e.MoveNext()?Seq.insufficient():null;
       pos=pos+1;
      }
     return e.get_Current();
    },
    pairwise:function(s)
    {
     var mapping,source;
     mapping=function(x)
     {
      return[Arrays.get(x,0),Arrays.get(x,1)];
     };
     source=Seq.windowed(2,s);
     return Seq.map(mapping,source);
    },
    pick:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryPick(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    readOnly:function(s)
    {
     return Enumerable.Of(function()
     {
      return Enumerator.Get(s);
     });
    },
    reduce:function(f,source)
    {
     var e,r;
     e=Enumerator.Get(source);
     !e.MoveNext()?Operators.FailWith("The input sequence was empty"):null;
     r=e.get_Current();
     while(e.MoveNext())
      {
       r=(f(r))(e.get_Current());
      }
     return r;
    },
    scan:function(f,x,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var en,next;
      en=Enumerator.Get(s);
      next=function(e)
      {
       var _,_1;
       if(e.s)
        {
         if(en.MoveNext())
          {
           e.c=(f(e.get_Current()))(en.get_Current());
           _1=true;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       else
        {
         e.c=x;
         e.s=true;
         _=true;
        }
       return _;
      };
      return T.New(false,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    skip:function(n,s)
    {
     return Enumerable.Of(function()
     {
      var e,i;
      e=Enumerator.Get(s);
      for(i=1;i<=n;i++){
       !e.MoveNext()?Seq.insufficient():null;
      }
      return e;
     });
    },
    skipWhile:function(f,s)
    {
     return Enumerable.Of(function()
     {
      var e,empty;
      e=Enumerator.Get(s);
      empty=true;
      while(e.MoveNext()?f(e.get_Current()):false)
       {
        empty=false;
       }
      return empty?Enumerator.Get(Seq.empty()):T.New(true,null,function(x)
      {
       var _,r;
       if(x.s)
        {
         x.s=false;
         x.c=e.get_Current();
         _=true;
        }
       else
        {
         r=e.MoveNext();
         x.c=e.get_Current();
         _=r;
        }
       return _;
      });
     });
    },
    sort:function(s)
    {
     return Seq.sortBy(function(x)
     {
      return x;
     },s);
    },
    sortBy:function(f,s)
    {
     return Seq.delay(function()
     {
      var array;
      array=Arrays.ofSeq(s);
      Arrays.sortInPlaceBy(f,array);
      return array;
     });
    },
    sum:function(s)
    {
     return Seq.fold(function(s1)
     {
      return function(x)
      {
       return s1+x;
      };
     },0,s);
    },
    sumBy:function(f,s)
    {
     return Seq.fold(function(s1)
     {
      return function(x)
      {
       return s1+f(x);
      };
     },0,s);
    },
    take:function(n,s)
    {
     return Enumerable.Of(function()
     {
      var e;
      e=Enumerator.Get(s);
      return T.New(0,null,function(_enum)
      {
       var _,_1;
       if(_enum.s>=n)
        {
         _=false;
        }
       else
        {
         if(e.MoveNext())
          {
           _enum.s=_enum.s+1;
           _enum.c=e.get_Current();
           _1=true;
          }
         else
          {
           e.Dispose();
           _enum.s=n;
           _1=false;
          }
         _=_1;
        }
       return _;
      });
     });
    },
    takeWhile:function(f,s)
    {
     return Seq.delay(function()
     {
      return Seq.enumUsing(Enumerator.Get(s),function(e)
      {
       return Seq.enumWhile(function()
       {
        return e.MoveNext()?f(e.get_Current()):false;
       },Seq.delay(function()
       {
        return[e.get_Current()];
       }));
      });
     });
    },
    toArray:function(s)
    {
     var q,enumerator,e;
     q=[];
     enumerator=Enumerator.Get(s);
     while(enumerator.MoveNext())
      {
       e=enumerator.get_Current();
       q.push(e);
      }
     return q.slice(0);
    },
    toList:function(s)
    {
     return List.ofSeq(s);
    },
    truncate:function(n,s)
    {
     return Seq.delay(function()
     {
      return Seq.enumUsing(Enumerator.Get(s),function(e)
      {
       var i;
       i=[0];
       return Seq.enumWhile(function()
       {
        return e.MoveNext()?i[0]<n:false;
       },Seq.delay(function()
       {
        Ref.incr(i);
        return[e.get_Current()];
       }));
      });
     });
    },
    tryFind:function(ok,s)
    {
     var e,r,x;
     e=Enumerator.Get(s);
     r={
      $:0
     };
     while(r.$==0?e.MoveNext():false)
      {
       x=e.get_Current();
       ok(x)?r={
        $:1,
        $0:x
       }:null;
      }
     return r;
    },
    tryFindIndex:function(ok,s)
    {
     var e,loop,i,x;
     e=Enumerator.Get(s);
     loop=true;
     i=0;
     while(loop?e.MoveNext():false)
      {
       x=e.get_Current();
       ok(x)?loop=false:i=i+1;
      }
     return loop?{
      $:0
     }:{
      $:1,
      $0:i
     };
    },
    tryPick:function(f,s)
    {
     var e,r;
     e=Enumerator.Get(s);
     r={
      $:0
     };
     while(Unchecked.Equals(r,{
      $:0
     })?e.MoveNext():false)
      {
       r=f(e.get_Current());
      }
     return r;
    },
    unfold:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       var matchValue,_,t,s1;
       matchValue=f(e.s);
       if(matchValue.$==0)
        {
         _=false;
        }
       else
        {
         t=matchValue.$0[0];
         s1=matchValue.$0[1];
         e.c=t;
         e.s=s1;
         _=true;
        }
       return _;
      };
      return T.New(s,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    windowed:function(windowSize,s)
    {
     windowSize<=0?Operators.FailWith("The input must be non-negative."):null;
     return Seq.delay(function()
     {
      return Seq.enumUsing(Enumerator.Get(s),function(e)
      {
       var q;
       q=[];
       return Seq.append(Seq.enumWhile(function()
       {
        return q.length<windowSize?e.MoveNext():false;
       },Seq.delay(function()
       {
        q.push(e.get_Current());
        return Seq.empty();
       })),Seq.delay(function()
       {
        return q.length===windowSize?Seq.append([q.slice(0)],Seq.delay(function()
        {
         return Seq.enumWhile(function()
         {
          return e.MoveNext();
         },Seq.delay(function()
         {
          q.shift();
          q.push(e.get_Current());
          return[q.slice(0)];
         }));
        })):Seq.empty();
       }));
      });
     });
    },
    zip:function(s1,s2)
    {
     return Seq.mapi2(function(x)
     {
      return function(y)
      {
       return[x,y];
      };
     },s1,s2);
    },
    zip3:function(s1,s2,s3)
    {
     return Seq.mapi2(function(x)
     {
      return function(tupledArg)
      {
       var y,z;
       y=tupledArg[0];
       z=tupledArg[1];
       return[x,y,z];
      };
     },s1,Seq.zip(s2,s3));
    }
   },
   Slice:{
    array:function(source,start,finish)
    {
     var matchValue,_,_1,f,_2,s,f1,s1;
     matchValue=[start,finish];
     if(matchValue[0].$==0)
      {
       if(matchValue[1].$==1)
        {
         f=matchValue[1].$0;
         _1=source.slice(0,f+1);
        }
       else
        {
         _1=[];
        }
       _=_1;
      }
     else
      {
       if(matchValue[1].$==0)
        {
         s=matchValue[0].$0;
         _2=source.slice(s);
        }
       else
        {
         f1=matchValue[1].$0;
         s1=matchValue[0].$0;
         _2=source.slice(s1,f1+1);
        }
       _=_2;
      }
     return _;
    },
    array2D:function(arr,start1,finish1,start2,finish2)
    {
     var start11,_,n,start21,_1,n1,finish11,_2,n2,finish21,_3,n3,len1,len2;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(start2.$==1)
      {
       n1=start2.$0;
       _1=n1;
      }
     else
      {
       _1=0;
      }
     start21=_1;
     if(finish1.$==1)
      {
       n2=finish1.$0;
       _2=n2;
      }
     else
      {
       _2=arr.length-1;
      }
     finish11=_2;
     if(finish2.$==1)
      {
       n3=finish2.$0;
       _3=n3;
      }
     else
      {
       _3=(arr.length?arr[0].length:0)-1;
      }
     finish21=_3;
     len1=finish11-start11+1;
     len2=finish21-start21+1;
     return Arrays.sub2D(arr,start11,start21,len1,len2);
    },
    array2Dfix1:function(arr,fixed1,start2,finish2)
    {
     var start21,_,n,finish21,_1,n1,len2,dst,j;
     if(start2.$==1)
      {
       n=start2.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start21=_;
     if(finish2.$==1)
      {
       n1=finish2.$0;
       _1=n1;
      }
     else
      {
       _1=(arr.length?arr[0].length:0)-1;
      }
     finish21=_1;
     len2=finish21-start21+1;
     dst=Array(len2);
     for(j=0;j<=len2-1;j++){
      Arrays.set(dst,j,Arrays.get2D(arr,fixed1,start21+j));
     }
     return dst;
    },
    array2Dfix2:function(arr,start1,finish1,fixed2)
    {
     var start11,_,n,finish11,_1,n1,len1,dst,i;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(finish1.$==1)
      {
       n1=finish1.$0;
       _1=n1;
      }
     else
      {
       _1=arr.length-1;
      }
     finish11=_1;
     len1=finish11-start11+1;
     dst=Array(len1);
     for(i=0;i<=len1-1;i++){
      Arrays.set(dst,i,Arrays.get2D(arr,start11+i,fixed2));
     }
     return dst;
    },
    setArray:function(dst,start,finish,src)
    {
     var start1,_,n,finish1,_1,n1;
     if(start.$==1)
      {
       n=start.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start1=_;
     if(finish.$==1)
      {
       n1=finish.$0;
       _1=n1;
      }
     else
      {
       _1=dst.length-1;
      }
     finish1=_1;
     return Arrays.setSub(dst,start1,finish1-start1+1,src);
    },
    setArray2D:function(dst,start1,finish1,start2,finish2,src)
    {
     var start11,_,n,start21,_1,n1,finish11,_2,n2,finish21,_3,n3;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(start2.$==1)
      {
       n1=start2.$0;
       _1=n1;
      }
     else
      {
       _1=0;
      }
     start21=_1;
     if(finish1.$==1)
      {
       n2=finish1.$0;
       _2=n2;
      }
     else
      {
       _2=dst.length-1;
      }
     finish11=_2;
     if(finish2.$==1)
      {
       n3=finish2.$0;
       _3=n3;
      }
     else
      {
       _3=(dst.length?dst[0].length:0)-1;
      }
     finish21=_3;
     return Arrays.setSub2D(dst,start11,start21,finish11-start11+1,finish21-start21+1,src);
    },
    setArray2Dfix1:function(dst,fixed1,start2,finish2,src)
    {
     var start21,_,n,finish21,_1,n1,len2,j;
     if(start2.$==1)
      {
       n=start2.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start21=_;
     if(finish2.$==1)
      {
       n1=finish2.$0;
       _1=n1;
      }
     else
      {
       _1=(dst.length?dst[0].length:0)-1;
      }
     finish21=_1;
     len2=finish21-start21+1;
     for(j=0;j<=len2-1;j++){
      Arrays.set2D(dst,fixed1,start21+j,Arrays.get(src,j));
     }
     return;
    },
    setArray2Dfix2:function(dst,start1,finish1,fixed2,src)
    {
     var start11,_,n,finish11,_1,n1,len1,i;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(finish1.$==1)
      {
       n1=finish1.$0;
       _1=n1;
      }
     else
      {
       _1=dst.length-1;
      }
     finish11=_1;
     len1=finish11-start11+1;
     for(i=0;i<=len1-1;i++){
      Arrays.set2D(dst,start11+i,fixed2,Arrays.get(src,i));
     }
     return;
    },
    string:function(source,start,finish)
    {
     var matchValue,_,_1,f,_2,s,f1,s1;
     matchValue=[start,finish];
     if(matchValue[0].$==0)
      {
       if(matchValue[1].$==1)
        {
         f=matchValue[1].$0;
         _1=source.slice(0,f+1);
        }
       else
        {
         _1="";
        }
       _=_1;
      }
     else
      {
       if(matchValue[1].$==0)
        {
         s=matchValue[0].$0;
         _2=source.slice(s);
        }
       else
        {
         f1=matchValue[1].$0;
         s1=matchValue[0].$0;
         _2=source.slice(s1,f1+1);
        }
       _=_2;
      }
     return _;
    }
   },
   Stack:{
    Clear:function(stack)
    {
     return stack.splice(0,Arrays.length(stack));
    },
    Contains:function(stack,el)
    {
     return Seq.exists(function(y)
     {
      return Unchecked.Equals(el,y);
     },stack);
    },
    CopyTo:function(stack,array,index)
    {
     return Arrays.blit(array,0,array,index,Arrays.length(stack));
    }
   },
   Strings:{
    Compare:function(x,y)
    {
     return Operators.Compare(x,y);
    },
    CopyTo:function(s,o,d,off,ct)
    {
     return Arrays.blit(Strings.ToCharArray(s),o,d,off,ct);
    },
    EndsWith:function($x,$s)
    {
     var $0=this,$this=this;
     return $x.substring($x.length-$s.length)==$s;
    },
    IndexOf:function($s,$c,$i)
    {
     var $0=this,$this=this;
     return $s.indexOf(Global.String.fromCharCode($c),$i);
    },
    Insert:function($x,$index,$s)
    {
     var $0=this,$this=this;
     return $x.substring(0,$index-1)+$s+$x.substring($index);
    },
    IsNullOrEmpty:function($x)
    {
     var $0=this,$this=this;
     return $x==null||$x=="";
    },
    Join:function($sep,$values)
    {
     var $0=this,$this=this;
     return $values.join($sep);
    },
    LastIndexOf:function($s,$c,$i)
    {
     var $0=this,$this=this;
     return $s.lastIndexOf(Global.String.fromCharCode($c),$i);
    },
    PadLeft:function(s,n)
    {
     return Strings.PadLeftWith(s,n,32);
    },
    PadLeftWith:function($s,$n,$c)
    {
     var $0=this,$this=this;
     return Global.Array($n-$s.length+1).join(Global.String.fromCharCode($c))+$s;
    },
    PadRight:function(s,n)
    {
     return Strings.PadRightWith(s,n,32);
    },
    PadRightWith:function($s,$n,$c)
    {
     var $0=this,$this=this;
     return $s+Global.Array($n-$s.length+1).join(Global.String.fromCharCode($c));
    },
    RegexEscape:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");
    },
    Remove:function($x,$ix,$ct)
    {
     var $0=this,$this=this;
     return $x.substring(0,$ix)+$x.substring($ix+$ct);
    },
    Replace:function(subject,search,replace)
    {
     var replaceLoop;
     replaceLoop=function(subj)
     {
      var index,_,replaced,nextStartIndex;
      index=subj.indexOf(search);
      if(index!==-1)
       {
        replaced=Strings.ReplaceOnce(subj,search,replace);
        nextStartIndex=index+replace.length;
        _=Strings.Substring(replaced,0,index+replace.length)+replaceLoop(replaced.substring(nextStartIndex));
       }
      else
       {
        _=subj;
       }
      return _;
     };
     return replaceLoop(subject);
    },
    ReplaceChar:function(s,oldC,newC)
    {
     return Strings.Replace(s,String.fromCharCode(oldC),String.fromCharCode(newC));
    },
    ReplaceOnce:function($string,$search,$replace)
    {
     var $0=this,$this=this;
     return $string.replace($search,$replace);
    },
    Split:function(s,pat,opts)
    {
     var res;
     res=Strings.SplitWith(s,pat);
     return opts===1?Arrays.filter(function(x)
     {
      return x!=="";
     },res):res;
    },
    SplitChars:function(s,sep,opts)
    {
     var re;
     re="["+Strings.RegexEscape(String.fromCharCode.apply(undefined,sep))+"]";
     return Strings.Split(s,new RegExp(re),opts);
    },
    SplitStrings:function(s,sep,opts)
    {
     var re;
     re=Strings.concat("|",Arrays.map(function(s1)
     {
      return Strings.RegexEscape(s1);
     },sep));
     return Strings.Split(s,new RegExp(re),opts);
    },
    SplitWith:function($str,$pat)
    {
     var $0=this,$this=this;
     return $str.split($pat);
    },
    StartsWith:function($t,$s)
    {
     var $0=this,$this=this;
     return $t.substring(0,$s.length)==$s;
    },
    Substring:function($s,$ix,$ct)
    {
     var $0=this,$this=this;
     return $s.substr($ix,$ct);
    },
    ToCharArray:function(s)
    {
     return Arrays.init(s.length,function(x)
     {
      return s.charCodeAt(x);
     });
    },
    ToCharArrayRange:function(s,startIndex,length)
    {
     return Arrays.init(length,function(i)
     {
      return s.charCodeAt(startIndex+i);
     });
    },
    Trim:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/^\s+/,"").replace(/\s+$/,"");
    },
    TrimEnd:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/\s+$/,"");
    },
    TrimStart:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/^\s+/,"");
    },
    collect:function(f,s)
    {
     return Arrays.init(s.length,function(i)
     {
      return f(s.charCodeAt(i));
     }).join("");
    },
    concat:function(separator,strings)
    {
     return Seq.toArray(strings).join(separator);
    },
    exists:function(f,s)
    {
     return Seq.exists(f,Strings.protect(s));
    },
    forall:function(f,s)
    {
     return Seq.forall(f,Strings.protect(s));
    },
    init:function(count,f)
    {
     return Arrays.init(count,f).join("");
    },
    iter:function(f,s)
    {
     return Seq.iter(f,Strings.protect(s));
    },
    iteri:function(f,s)
    {
     return Seq.iteri(f,Strings.protect(s));
    },
    length:function(s)
    {
     return Strings.protect(s).length;
    },
    map:function(f,s)
    {
     return Strings.collect(function(x)
     {
      return String.fromCharCode(f(x));
     },Strings.protect(s));
    },
    mapi:function(f,s)
    {
     return Seq.toArray(Seq.mapi(function(i)
     {
      return function(x)
      {
       return String.fromCharCode((f(i))(x));
      };
     },s)).join("");
    },
    protect:function(s)
    {
     return s===null?"":s;
    },
    replicate:function(count,s)
    {
     return Strings.init(count,function()
     {
      return s;
     });
    }
   },
   Unchecked:{
    Compare:function(a,b)
    {
     var _,matchValue,_1,matchValue1;
     if(a===b)
      {
       _=0;
      }
     else
      {
       matchValue=typeof a;
       if(matchValue==="undefined")
        {
         matchValue1=typeof b;
         _1=matchValue1==="undefined"?0:-1;
        }
       else
        {
         _1=matchValue==="function"?Operators.FailWith("Cannot compare function values."):matchValue==="boolean"?a<b?-1:1:matchValue==="number"?a<b?-1:1:matchValue==="string"?a<b?-1:1:a===null?-1:b===null?1:"CompareTo"in a?a.CompareTo(b):(a instanceof Array?b instanceof Array:false)?Unchecked.compareArrays(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.compareDates(a,b):Unchecked.compareArrays(JSModule.GetFields(a),JSModule.GetFields(b));
        }
       _=_1;
      }
     return _;
    },
    Equals:function(a,b)
    {
     var _,matchValue;
     if(a===b)
      {
       _=true;
      }
     else
      {
       matchValue=typeof a;
       _=matchValue==="object"?a===null?false:b===null?false:"Equals"in a?a.Equals(b):(a instanceof Array?b instanceof Array:false)?Unchecked.arrayEquals(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.dateEquals(a,b):Unchecked.arrayEquals(JSModule.GetFields(a),JSModule.GetFields(b)):false;
      }
     return _;
    },
    Hash:function(o)
    {
     var matchValue;
     matchValue=typeof o;
     return matchValue==="function"?0:matchValue==="boolean"?o?1:0:matchValue==="number"?o:matchValue==="string"?Unchecked.hashString(o):matchValue==="object"?o==null?0:o instanceof Array?Unchecked.hashArray(o):Unchecked.hashObject(o):0;
    },
    arrayEquals:function(a,b)
    {
     var _,eq,i;
     if(Arrays.length(a)===Arrays.length(b))
      {
       eq=true;
       i=0;
       while(eq?i<Arrays.length(a):false)
        {
         !Unchecked.Equals(Arrays.get(a,i),Arrays.get(b,i))?eq=false:null;
         i=i+1;
        }
       _=eq;
      }
     else
      {
       _=false;
      }
     return _;
    },
    compareArrays:function(a,b)
    {
     var _,_1,cmp,i;
     if(Arrays.length(a)<Arrays.length(b))
      {
       _=-1;
      }
     else
      {
       if(Arrays.length(a)>Arrays.length(b))
        {
         _1=1;
        }
       else
        {
         cmp=0;
         i=0;
         while(cmp===0?i<Arrays.length(a):false)
          {
           cmp=Unchecked.Compare(Arrays.get(a,i),Arrays.get(b,i));
           i=i+1;
          }
         _1=cmp;
        }
       _=_1;
      }
     return _;
    },
    compareDates:function(a,b)
    {
     return Operators.Compare(a.getTime(),b.getTime());
    },
    dateEquals:function(a,b)
    {
     return a.getTime()===b.getTime();
    },
    hashArray:function(o)
    {
     var h,i;
     h=-34948909;
     for(i=0;i<=Arrays.length(o)-1;i++){
      h=Unchecked.hashMix(h,Unchecked.Hash(Arrays.get(o,i)));
     }
     return h;
    },
    hashMix:function(x,y)
    {
     return(x<<5)+x+y;
    },
    hashObject:function(o)
    {
     var _,op_PlusPlus,h;
     if("GetHashCode"in o)
      {
       _=o.GetHashCode();
      }
     else
      {
       op_PlusPlus=function(x,y)
       {
        return Unchecked.hashMix(x,y);
       };
       h=[0];
       JSModule.ForEach(o,function(key)
       {
        h[0]=op_PlusPlus(op_PlusPlus(h[0],Unchecked.hashString(key)),Unchecked.Hash(o[key]));
        return false;
       });
       _=h[0];
      }
     return _;
    },
    hashString:function(s)
    {
     var _,hash,i;
     if(s===null)
      {
       _=0;
      }
     else
      {
       hash=5381;
       for(i=0;i<=s.length-1;i++){
        hash=Unchecked.hashMix(hash,s.charCodeAt(i)<<0);
       }
       _=hash;
      }
     return _;
    }
   },
   Util:{
    addListener:function(event,h)
    {
     event.Subscribe(Util.observer(h));
    },
    observer:function(h)
    {
     return{
      OnCompleted:function()
      {
      },
      OnError:function()
      {
      },
      OnNext:h
     };
    },
    subscribeTo:function(event,h)
    {
     return event.Subscribe(Util.observer(h));
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  AggregateException=Runtime.Safe(Global.WebSharper.AggregateException);
  Exception=Runtime.Safe(Global.WebSharper.Exception);
  ArgumentException=Runtime.Safe(Global.WebSharper.ArgumentException);
  Number=Runtime.Safe(Global.Number);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  IndexOutOfRangeException=Runtime.Safe(Global.WebSharper.IndexOutOfRangeException);
  Array=Runtime.Safe(Global.Array);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  Arrays2D=Runtime.Safe(Global.WebSharper.Arrays2D);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Option=Runtime.Safe(Global.WebSharper.Option);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  setTimeout=Runtime.Safe(Global.setTimeout);
  CancellationTokenSource=Runtime.Safe(Global.WebSharper.CancellationTokenSource);
  Char=Runtime.Safe(Global.WebSharper.Char);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Lazy=Runtime.Safe(Global.WebSharper.Lazy);
  OperationCanceledException=Runtime.Safe(Global.WebSharper.OperationCanceledException);
  Date=Runtime.Safe(Global.Date);
  console=Runtime.Safe(Global.console);
  Scheduler=Runtime.Safe(Concurrency.Scheduler);
  T=Runtime.Safe(Enumerator.T);
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Activator=Runtime.Safe(Client.Activator);
  document=Runtime.Safe(Global.document);
  jQuery=Runtime.Safe(Global.jQuery);
  Json=Runtime.Safe(Global.WebSharper.Json);
  JSON=Runtime.Safe(Global.JSON);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  HtmlContentExtensions=Runtime.Safe(Client.HtmlContentExtensions);
  SingleNode=Runtime.Safe(HtmlContentExtensions.SingleNode);
  InvalidOperationException=Runtime.Safe(Global.WebSharper.InvalidOperationException);
  List=Runtime.Safe(Global.WebSharper.List);
  T1=Runtime.Safe(List.T);
  MatchFailureException=Runtime.Safe(Global.WebSharper.MatchFailureException);
  Math=Runtime.Safe(Global.Math);
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  PrintfHelpers=Runtime.Safe(Global.WebSharper.PrintfHelpers);
  Remoting=Runtime.Safe(Global.WebSharper.Remoting);
  XhrProvider=Runtime.Safe(Remoting.XhrProvider);
  AsyncProxy=Runtime.Safe(Global.WebSharper.AsyncProxy);
  AjaxRemotingProvider=Runtime.Safe(Remoting.AjaxRemotingProvider);
  window=Runtime.Safe(Global.window);
  Enumerable=Runtime.Safe(Global.WebSharper.Enumerable);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  String=Runtime.Safe(Global.String);
  return RegExp=Runtime.Safe(Global.RegExp);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(AggregateException,Exception);
  Runtime.Inherit(ArgumentException,Exception);
  Runtime.Inherit(IndexOutOfRangeException,Exception);
  Runtime.Inherit(InvalidOperationException,Exception);
  Runtime.Inherit(MatchFailureException,Exception);
  Runtime.Inherit(OperationCanceledException,Exception);
  Remoting.EndPoint();
  Remoting.AjaxProvider();
  Activator.Activate();
  Concurrency.scheduler();
  Concurrency.defCTS();
  Concurrency.GetCT();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Html,Client,Implementation,Attribute,Pagelet,Element,Enumerator,Math,document,jQuery,Events,JQueryEventSupport,AttributeBuilder,DeprecatedTagBuilder,JQueryHtmlProvider,TagBuilder,Text,Attr,EventsPervasives,Tags;
 Runtime.Define(Global,{
  WebSharper:{
   Html:{
    Client:{
     Attr:{
      Attr:Runtime.Field(function()
      {
       return Implementation.Attr();
      })
     },
     Attribute:Runtime.Class({
      get_Body:function()
      {
       var attr;
       attr=this.HtmlProvider.CreateAttribute(this.Name);
       attr.value=this.Value;
       return attr;
      }
     },{
      New:function(htmlProvider,name,value)
      {
       var a;
       a=Attribute.New1(htmlProvider);
       a.Name=name;
       a.Value=value;
       return a;
      },
      New1:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     AttributeBuilder:Runtime.Class({
      NewAttr:function(name,value)
      {
       var a;
       a=Attribute.New(this.HtmlProvider,name,value);
       return a;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Default:{
      OnLoad:function(init)
      {
       return Implementation.HtmlProvider().OnDocumentReady(init);
      }
     },
     DeprecatedAttributeBuilder:Runtime.Class({
      NewAttr:function(name,value)
      {
       var a;
       a=Attribute.New(this.HtmlProvider,name,value);
       return a;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     DeprecatedTagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator,pl;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Element:Runtime.Class({
      AppendI:function(pl)
      {
       var body,_,objectArg,arg00,objectArg1,arg001,arg10,_1,r;
       body=pl.get_Body();
       if(body.nodeType===2)
        {
         objectArg=this["HtmlProvider@33"];
         arg00=this.get_Body();
         _=objectArg.AppendAttribute(arg00,body);
        }
       else
        {
         objectArg1=this["HtmlProvider@33"];
         arg001=this.get_Body();
         arg10=pl.get_Body();
         _=objectArg1.AppendNode(arg001,arg10);
        }
       if(this.IsRendered)
        {
         _1=pl.Render();
        }
       else
        {
         r=this.RenderInternal;
         _1=void(this.RenderInternal=function()
         {
          r(null);
          return pl.Render();
         });
        }
       return _1;
      },
      AppendN:function(node)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.AppendNode(arg00,node);
      },
      OnLoad:function(f)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.OnLoad(arg00,f);
      },
      Render:function()
      {
       var _;
       if(!this.IsRendered)
        {
         this.RenderInternal.call(null,null);
         _=void(this.IsRendered=true);
        }
       else
        {
         _=null;
        }
       return _;
      },
      get_Body:function()
      {
       return this.Dom;
      },
      get_Html:function()
      {
       return this["HtmlProvider@33"].GetHtml(this.get_Body());
      },
      get_HtmlProvider:function()
      {
       return this["HtmlProvider@33"];
      },
      get_Id:function()
      {
       var objectArg,arg00,id,_,newId,objectArg1,arg001;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       id=objectArg.GetProperty(arg00,"id");
       if(id===undefined?true:id==="")
        {
         newId="id"+Math.round(Math.random()*100000000);
         objectArg1=this["HtmlProvider@33"];
         arg001=this.get_Body();
         objectArg1.SetProperty(arg001,"id",newId);
         _=newId;
        }
       else
        {
         _=id;
        }
       return _;
      },
      get_Item:function(name)
      {
       var objectArg,arg00,objectArg1,arg001;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       objectArg.GetAttribute(arg00,name);
       objectArg1=this["HtmlProvider@33"];
       arg001=this.get_Body();
       return objectArg1.GetAttribute(arg001,name);
      },
      get_Text:function()
      {
       return this["HtmlProvider@33"].GetText(this.get_Body());
      },
      get_Value:function()
      {
       return this["HtmlProvider@33"].GetValue(this.get_Body());
      },
      set_Html:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetHtml(arg00,x);
      },
      set_Item:function(name,value)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetAttribute(arg00,name,value);
      },
      set_Text:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetText(arg00,x);
      },
      set_Value:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetValue(arg00,x);
      }
     },{
      New:function(html,name)
      {
       var el,dom;
       el=Element.New1(html);
       dom=document.createElement(name);
       el.RenderInternal=function()
       {
       };
       el.Dom=dom;
       el.IsRendered=false;
       return el;
      },
      New1:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r["HtmlProvider@33"]=HtmlProvider;
       return r;
      }
     }),
     Events:{
      JQueryEventSupport:Runtime.Class({
       OnBlur:function(f,el)
       {
        return jQuery(el.get_Body()).bind("blur",function()
        {
         return f(el);
        });
       },
       OnChange:function(f,el)
       {
        return jQuery(el.get_Body()).bind("change",function()
        {
         return f(el);
        });
       },
       OnClick:function(f,el)
       {
        return this.OnMouse("click",f,el);
       },
       OnDoubleClick:function(f,el)
       {
        return this.OnMouse("dblclick",f,el);
       },
       OnError:function(f,el)
       {
        return jQuery(el.get_Body()).bind("error",function()
        {
         return f(el);
        });
       },
       OnEvent:function(ev,f,el)
       {
        return jQuery(el.get_Body()).bind(ev,function(ev1)
        {
         return(f(el))(ev1);
        });
       },
       OnFocus:function(f,el)
       {
        return jQuery(el.get_Body()).bind("focus",function()
        {
         return f(el);
        });
       },
       OnKeyDown:function(f,el)
       {
        return jQuery(el.get_Body()).bind("keydown",function(ev)
        {
         return(f(el))({
          KeyCode:ev.keyCode,
          Event:ev
         });
        });
       },
       OnKeyPress:function(f,el)
       {
        return jQuery(el.get_Body()).keypress(function(ev)
        {
         return(f(el))({
          CharacterCode:ev.which,
          Event:ev
         });
        });
       },
       OnKeyUp:function(f,el)
       {
        return jQuery(el.get_Body()).bind("keyup",function(ev)
        {
         return(f(el))({
          KeyCode:ev.keyCode,
          Event:ev
         });
        });
       },
       OnLoad:function(f,el)
       {
        return jQuery(el.get_Body()).bind("load",function()
        {
         return f(el);
        });
       },
       OnMouse:function(name,f,el)
       {
        return jQuery(el.get_Body()).bind(name,function(ev)
        {
         return(f(el))({
          X:ev.pageX,
          Y:ev.pageY,
          Event:ev
         });
        });
       },
       OnMouseDown:function(f,el)
       {
        return this.OnMouse("mousedown",f,el);
       },
       OnMouseEnter:function(f,el)
       {
        return this.OnMouse("mouseenter",f,el);
       },
       OnMouseLeave:function(f,el)
       {
        return this.OnMouse("mouseleave",f,el);
       },
       OnMouseMove:function(f,el)
       {
        return this.OnMouse("mousemove",f,el);
       },
       OnMouseOut:function(f,el)
       {
        return this.OnMouse("mouseout",f,el);
       },
       OnMouseUp:function(f,el)
       {
        return this.OnMouse("mouseup",f,el);
       },
       OnResize:function(f,el)
       {
        return jQuery(el.get_Body()).bind("resize",function()
        {
         return f(el);
        });
       },
       OnScroll:function(f,el)
       {
        return jQuery(el.get_Body()).bind("scroll",function()
        {
         return f(el);
        });
       },
       OnSelect:function(f,el)
       {
        return jQuery(el.get_Body()).bind("select",function()
        {
         return f(el);
        });
       },
       OnSubmit:function(f,el)
       {
        return jQuery(el.get_Body()).bind("submit",function()
        {
         return f(el);
        });
       },
       OnUnLoad:function(f,el)
       {
        return jQuery(el.get_Body()).bind("unload",function()
        {
         return f(el);
        });
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
       }
      })
     },
     EventsPervasives:{
      Events:Runtime.Field(function()
      {
       return JQueryEventSupport.New();
      })
     },
     Implementation:{
      Attr:Runtime.Field(function()
      {
       return AttributeBuilder.New(Implementation.HtmlProvider());
      }),
      DeprecatedHtml:Runtime.Field(function()
      {
       return DeprecatedTagBuilder.New(Implementation.HtmlProvider());
      }),
      HtmlProvider:Runtime.Field(function()
      {
       return JQueryHtmlProvider.New();
      }),
      JQueryHtmlProvider:Runtime.Class({
       AddClass:function(node,cls)
       {
        return jQuery(node).addClass(cls);
       },
       AppendAttribute:function(node,attr)
       {
        var arg10,arg20;
        arg10=attr.nodeName;
        arg20=attr.value;
        return this.SetAttribute(node,arg10,arg20);
       },
       AppendNode:function(node,el)
       {
        return jQuery(node).append(jQuery(el));
       },
       Clear:function(node)
       {
        return jQuery(node).contents().detach();
       },
       CreateAttribute:function(str)
       {
        return document.createAttribute(str);
       },
       CreateElement:function(name)
       {
        return document.createElement(name);
       },
       CreateTextNode:function(str)
       {
        return document.createTextNode(str);
       },
       GetAttribute:function(node,name)
       {
        return jQuery(node).attr(name);
       },
       GetHtml:function(node)
       {
        return jQuery(node).html();
       },
       GetProperty:function(node,name)
       {
        var x;
        x=jQuery(node).prop(name);
        return x;
       },
       GetText:function(node)
       {
        return node.textContent;
       },
       GetValue:function(node)
       {
        var x;
        x=jQuery(node).val();
        return x;
       },
       HasAttribute:function(node,name)
       {
        return jQuery(node).attr(name)!=null;
       },
       OnDocumentReady:function(f)
       {
        return jQuery(document).ready(f);
       },
       OnLoad:function(node,f)
       {
        return jQuery(node).ready(f);
       },
       Remove:function(node)
       {
        return jQuery(node).remove();
       },
       RemoveAttribute:function(node,name)
       {
        return jQuery(node).removeAttr(name);
       },
       RemoveClass:function(node,cls)
       {
        return jQuery(node).removeClass(cls);
       },
       SetAttribute:function(node,name,value)
       {
        return jQuery(node).attr(name,value);
       },
       SetCss:function(node,name,prop)
       {
        return jQuery(node).css(name,prop);
       },
       SetHtml:function(node,text)
       {
        return jQuery(node).html(text);
       },
       SetProperty:function(node,name,value)
       {
        var x;
        x=jQuery(node).prop(name,value);
        return x;
       },
       SetStyle:function(node,style)
       {
        return jQuery(node).attr("style",style);
       },
       SetText:function(node,text)
       {
        node.textContent=text;
       },
       SetValue:function(node,value)
       {
        return jQuery(node).val(value);
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
       }
      }),
      Tags:Runtime.Field(function()
      {
       return TagBuilder.New(Implementation.HtmlProvider());
      })
     },
     Operators:{
      OnAfterRender:function(f,w)
      {
       var r;
       r=w.Render;
       w.Render=function()
       {
        r.apply(w);
        return f(w);
       };
       return;
      },
      OnBeforeRender:function(f,w)
      {
       var r;
       r=w.Render;
       w.Render=function()
       {
        f(w);
        return r.apply(w);
       };
       return;
      },
      add:function(el,inner)
      {
       var enumerator,pl;
       enumerator=Enumerator.Get(inner);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      }
     },
     Pagelet:Runtime.Class({
      AppendTo:function(targetId)
      {
       var target,value;
       target=document.getElementById(targetId);
       value=target.appendChild(this.get_Body());
       return this.Render();
      },
      Render:function()
      {
       return null;
      },
      ReplaceInDom:function(node)
      {
       var value;
       value=node.parentNode.replaceChild(this.get_Body(),node);
       return this.Render();
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     TagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator,pl;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      },
      text:function(data)
      {
       return Text.New(data);
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Tags:{
      Deprecated:Runtime.Field(function()
      {
       return Implementation.DeprecatedHtml();
      }),
      Tags:Runtime.Field(function()
      {
       return Implementation.Tags();
      })
     },
     Text:Runtime.Class({
      get_Body:function()
      {
       return document.createTextNode(this.text);
      }
     },{
      New:function(text)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r.text=text;
       return r;
      }
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Implementation=Runtime.Safe(Client.Implementation);
  Attribute=Runtime.Safe(Client.Attribute);
  Pagelet=Runtime.Safe(Client.Pagelet);
  Element=Runtime.Safe(Client.Element);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  Math=Runtime.Safe(Global.Math);
  document=Runtime.Safe(Global.document);
  jQuery=Runtime.Safe(Global.jQuery);
  Events=Runtime.Safe(Client.Events);
  JQueryEventSupport=Runtime.Safe(Events.JQueryEventSupport);
  AttributeBuilder=Runtime.Safe(Client.AttributeBuilder);
  DeprecatedTagBuilder=Runtime.Safe(Client.DeprecatedTagBuilder);
  JQueryHtmlProvider=Runtime.Safe(Implementation.JQueryHtmlProvider);
  TagBuilder=Runtime.Safe(Client.TagBuilder);
  Text=Runtime.Safe(Client.Text);
  Attr=Runtime.Safe(Client.Attr);
  EventsPervasives=Runtime.Safe(Client.EventsPervasives);
  return Tags=Runtime.Safe(Client.Tags);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(Attribute,Pagelet);
  Runtime.Inherit(Element,Pagelet);
  Runtime.Inherit(Text,Pagelet);
  Tags.Tags();
  Tags.Deprecated();
  Implementation.Tags();
  Implementation.HtmlProvider();
  Implementation.DeprecatedHtml();
  Implementation.Attr();
  EventsPervasives.Events();
  Attr.Attr();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Collections,BalancedTree,Operators,Arrays,Seq,List,T,JavaScript,JSModule,Enumerator,DictionaryUtil,Dictionary,Unchecked,FSharpMap,Pair,Option,MapUtil,FSharpSet,SetModule,SetUtil,Array,HashSetUtil,HashSetProxy,LinkedList,E,T1,ResizeArray,ResizeArrayProxy;
 Runtime.Define(Global,{
  WebSharper:{
   Collections:{
    BalancedTree:{
     Add:function(x,t)
     {
      return BalancedTree.Put(function()
      {
       return function(x1)
       {
        return x1;
       };
      },x,t);
     },
     Branch:function(node,left,right)
     {
      return{
       Node:node,
       Left:left,
       Right:right,
       Height:1+Operators.Max(left==null?0:left.Height,right==null?0:right.Height),
       Count:1+(left==null?0:left.Count)+(right==null?0:right.Count)
      };
     },
     Build:function(data,min,max)
     {
      var sz,_,center,left,right;
      sz=max-min+1;
      if(sz<=0)
       {
        _=null;
       }
      else
       {
        center=(min+max)/2>>0;
        left=BalancedTree.Build(data,min,center-1);
        right=BalancedTree.Build(data,center+1,max);
        _=BalancedTree.Branch(Arrays.get(data,center),left,right);
       }
      return _;
     },
     Contains:function(v,t)
     {
      return!((BalancedTree.Lookup(v,t))[0]==null);
     },
     Enumerate:function(flip,t)
     {
      var gen;
      gen=function(tupledArg)
      {
       var t1,spine,_,_1,t2,spine1,other;
       t1=tupledArg[0];
       spine=tupledArg[1];
       if(t1==null)
        {
         if(spine.$==1)
          {
           t2=spine.$0[0];
           spine1=spine.$1;
           other=spine.$0[1];
           _1={
            $:1,
            $0:[t2,[other,spine1]]
           };
          }
         else
          {
           _1={
            $:0
           };
          }
         _=_1;
        }
       else
        {
         _=flip?gen([t1.Right,Runtime.New(T,{
          $:1,
          $0:[t1.Node,t1.Left],
          $1:spine
         })]):gen([t1.Left,Runtime.New(T,{
          $:1,
          $0:[t1.Node,t1.Right],
          $1:spine
         })]);
        }
       return _;
      };
      return Seq.unfold(gen,[t,Runtime.New(T,{
       $:0
      })]);
     },
     Lookup:function(k,t)
     {
      var spine,t1,loop,_,matchValue,_1;
      spine=[];
      t1=t;
      loop=true;
      while(loop)
       {
        if(t1==null)
         {
          _=loop=false;
         }
        else
         {
          matchValue=Operators.Compare(k,t1.Node);
          if(matchValue===0)
           {
            _1=loop=false;
           }
          else
           {
            if(matchValue===1)
             {
              spine.unshift([true,t1.Node,t1.Left]);
              _1=t1=t1.Right;
             }
            else
             {
              spine.unshift([false,t1.Node,t1.Right]);
              _1=t1=t1.Left;
             }
           }
          _=_1;
         }
       }
      return[t1,spine];
     },
     OfSeq:function(data)
     {
      var data1;
      data1=Arrays.sort(Seq.toArray(Seq.distinct(data)));
      return BalancedTree.Build(data1,0,data1.length-1);
     },
     Put:function(combine,k,t)
     {
      var patternInput,t1,spine;
      patternInput=BalancedTree.Lookup(k,t);
      t1=patternInput[0];
      spine=patternInput[1];
      return t1==null?BalancedTree.Rebuild(spine,BalancedTree.Branch(k,null,null)):BalancedTree.Rebuild(spine,BalancedTree.Branch((combine(t1.Node))(k),t1.Left,t1.Right));
     },
     Rebuild:function(spine,t)
     {
      var h,t1,i,matchValue,_,x1,l,_1,_2,m,x2,r,_3,_4,m1;
      h=function(x)
      {
       return x==null?0:x.Height;
      };
      t1=t;
      for(i=0;i<=Arrays.length(spine)-1;i++){
       matchValue=Arrays.get(spine,i);
       if(matchValue[0])
        {
         x1=matchValue[1];
         l=matchValue[2];
         if(h(t1)>h(l)+1)
          {
           if(h(t1.Left)===h(t1.Right)+1)
            {
             m=t1.Left;
             _2=BalancedTree.Branch(m.Node,BalancedTree.Branch(x1,l,m.Left),BalancedTree.Branch(t1.Node,m.Right,t1.Right));
            }
           else
            {
             _2=BalancedTree.Branch(t1.Node,BalancedTree.Branch(x1,l,t1.Left),t1.Right);
            }
           _1=_2;
          }
         else
          {
           _1=BalancedTree.Branch(x1,l,t1);
          }
         _=_1;
        }
       else
        {
         x2=matchValue[1];
         r=matchValue[2];
         if(h(t1)>h(r)+1)
          {
           if(h(t1.Right)===h(t1.Left)+1)
            {
             m1=t1.Right;
             _4=BalancedTree.Branch(m1.Node,BalancedTree.Branch(t1.Node,t1.Left,m1.Left),BalancedTree.Branch(x2,m1.Right,r));
            }
           else
            {
             _4=BalancedTree.Branch(t1.Node,t1.Left,BalancedTree.Branch(x2,t1.Right,r));
            }
           _3=_4;
          }
         else
          {
           _3=BalancedTree.Branch(x2,t1,r);
          }
         _=_3;
        }
       t1=_;
      }
      return t1;
     },
     Remove:function(k,src)
     {
      var patternInput,t,spine,_,_1,_2,source,data,t1;
      patternInput=BalancedTree.Lookup(k,src);
      t=patternInput[0];
      spine=patternInput[1];
      if(t==null)
       {
        _=src;
       }
      else
       {
        if(t.Right==null)
         {
          _1=BalancedTree.Rebuild(spine,t.Left);
         }
        else
         {
          if(t.Left==null)
           {
            _2=BalancedTree.Rebuild(spine,t.Right);
           }
          else
           {
            source=Seq.append(BalancedTree.Enumerate(false,t.Left),BalancedTree.Enumerate(false,t.Right));
            data=Seq.toArray(source);
            t1=BalancedTree.Build(data,0,data.length-1);
            _2=BalancedTree.Rebuild(spine,t1);
           }
          _1=_2;
         }
        _=_1;
       }
      return _;
     },
     TryFind:function(v,t)
     {
      var x;
      x=(BalancedTree.Lookup(v,t))[0];
      return x==null?{
       $:0
      }:{
       $:1,
       $0:x.Node
      };
     }
    },
    Dictionary:Runtime.Class({
     Add:function(k,v)
     {
      var h,_;
      h=this.hash.call(null,k);
      if(this.data.hasOwnProperty(h))
       {
        _=Operators.FailWith("An item with the same key has already been added.");
       }
      else
       {
        this.data[h]={
         K:k,
         V:v
        };
        _=void(this.count=this.count+1);
       }
      return _;
     },
     Clear:function()
     {
      this.data={};
      this.count=0;
      return;
     },
     ContainsKey:function(k)
     {
      return this.data.hasOwnProperty(this.hash.call(null,k));
     },
     GetEnumerator:function()
     {
      var s;
      s=JSModule.GetFieldValues(this.data);
      return Enumerator.Get(s);
     },
     Remove:function(k)
     {
      var h,_;
      h=this.hash.call(null,k);
      if(this.data.hasOwnProperty(h))
       {
        JSModule.Delete(this.data,h);
        this.count=this.count-1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     },
     get_Item:function(k)
     {
      var k1,_,x;
      k1=this.hash.call(null,k);
      if(this.data.hasOwnProperty(k1))
       {
        x=this.data[k1];
        _=x.V;
       }
      else
       {
        _=DictionaryUtil.notPresent();
       }
      return _;
     },
     set_Item:function(k,v)
     {
      var h;
      h=this.hash.call(null,k);
      !this.data.hasOwnProperty(h)?void(this.count=this.count+1):null;
      this.data[h]={
       K:k,
       V:v
      };
      return;
     }
    },{
     New:function(dictionary)
     {
      return Runtime.New(this,Dictionary.New4(dictionary,function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New1:function(dictionary,comparer)
     {
      return Runtime.New(this,Dictionary.New4(dictionary,function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New11:function(capacity,comparer)
     {
      return Runtime.New(this,Dictionary.New3(comparer));
     },
     New12:function()
     {
      return Runtime.New(this,Dictionary.New4([],function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New2:function()
     {
      return Runtime.New(this,Dictionary.New12());
     },
     New3:function(comparer)
     {
      return Runtime.New(this,Dictionary.New4([],function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New4:function(init,equals,hash)
     {
      var r,enumerator,x,x1;
      r=Runtime.New(this,{});
      r.hash=hash;
      r.count=0;
      r.data={};
      enumerator=Enumerator.Get(init);
      while(enumerator.MoveNext())
       {
        x=enumerator.get_Current();
        x1=x.K;
        r.data[r.hash.call(null,x1)]=x.V;
       }
      return r;
     }
    }),
    DictionaryUtil:{
     notPresent:function()
     {
      return Operators.FailWith("The given key was not present in the dictionary.");
     }
    },
    FSharpMap:Runtime.Class({
     Add:function(k,v)
     {
      var x,x1;
      x=this.tree;
      x1=Runtime.New(Pair,{
       Key:k,
       Value:v
      });
      return FSharpMap.New(BalancedTree.Add(x1,x));
     },
     CompareTo:function(other)
     {
      return Seq.compareWith(function(x)
      {
       return function(y)
       {
        return Operators.Compare(x,y);
       };
      },this,other);
     },
     ContainsKey:function(k)
     {
      var x,v;
      x=this.tree;
      v=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      return BalancedTree.Contains(v,x);
     },
     Equals:function(other)
     {
      return this.get_Count()===other.get_Count()?Seq.forall2(function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },this,other):false;
     },
     GetEnumerator:function()
     {
      var mapping,source,s;
      mapping=function(kv)
      {
       return{
        K:kv.Key,
        V:kv.Value
       };
      };
      source=BalancedTree.Enumerate(false,this.tree);
      s=Seq.map(mapping,source);
      return Enumerator.Get(s);
     },
     GetHashCode:function()
     {
      return Unchecked.Hash(Seq.toArray(this));
     },
     Remove:function(k)
     {
      var x,k1;
      x=this.tree;
      k1=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      return FSharpMap.New(BalancedTree.Remove(k1,x));
     },
     TryFind:function(k)
     {
      var x,v,mapping,option;
      x=this.tree;
      v=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      mapping=function(kv)
      {
       return kv.Value;
      };
      option=BalancedTree.TryFind(v,x);
      return Option.map(mapping,option);
     },
     get_Count:function()
     {
      var tree;
      tree=this.tree;
      return tree==null?0:tree.Count;
     },
     get_IsEmpty:function()
     {
      return this.tree==null;
     },
     get_Item:function(k)
     {
      var matchValue,_,v;
      matchValue=this.TryFind(k);
      if(matchValue.$==0)
       {
        _=Operators.FailWith("The given key was not present in the dictionary.");
       }
      else
       {
        v=matchValue.$0;
        _=v;
       }
      return _;
     },
     get_Tree:function()
     {
      return this.tree;
     }
    },{
     New:function(tree)
     {
      var r;
      r=Runtime.New(this,{});
      r.tree=tree;
      return r;
     },
     New1:function(s)
     {
      return Runtime.New(this,FSharpMap.New(MapUtil.fromSeq(s)));
     }
    }),
    FSharpSet:Runtime.Class({
     Add:function(x)
     {
      return FSharpSet.New1(BalancedTree.Add(x,this.tree));
     },
     CompareTo:function(other)
     {
      return Seq.compareWith(function(e1)
      {
       return function(e2)
       {
        return Operators.Compare(e1,e2);
       };
      },this,other);
     },
     Contains:function(v)
     {
      return BalancedTree.Contains(v,this.tree);
     },
     Equals:function(other)
     {
      return this.get_Count()===other.get_Count()?Seq.forall2(function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },this,other):false;
     },
     GetEnumerator:function()
     {
      return Enumerator.Get(BalancedTree.Enumerate(false,this.tree));
     },
     GetHashCode:function()
     {
      return-1741749453+Unchecked.Hash(Seq.toArray(this));
     },
     IsProperSubsetOf:function(s)
     {
      return this.IsSubsetOf(s)?this.get_Count()<s.get_Count():false;
     },
     IsProperSupersetOf:function(s)
     {
      return this.IsSupersetOf(s)?this.get_Count()>s.get_Count():false;
     },
     IsSubsetOf:function(s)
     {
      return Seq.forall(function(arg00)
      {
       return s.Contains(arg00);
      },this);
     },
     IsSupersetOf:function(s)
     {
      var _this=this;
      return Seq.forall(function(arg00)
      {
       return _this.Contains(arg00);
      },s);
     },
     Remove:function(v)
     {
      return FSharpSet.New1(BalancedTree.Remove(v,this.tree));
     },
     add:function(x)
     {
      return FSharpSet.New1(BalancedTree.OfSeq(Seq.append(this,x)));
     },
     get_Count:function()
     {
      var tree;
      tree=this.tree;
      return tree==null?0:tree.Count;
     },
     get_IsEmpty:function()
     {
      return this.tree==null;
     },
     get_MaximumElement:function()
     {
      return Seq.head(BalancedTree.Enumerate(true,this.tree));
     },
     get_MinimumElement:function()
     {
      return Seq.head(BalancedTree.Enumerate(false,this.tree));
     },
     get_Tree:function()
     {
      return this.tree;
     },
     sub:function(x)
     {
      return SetModule.Filter(function(x1)
      {
       return!x.Contains(x1);
      },this);
     }
    },{
     New:function(s)
     {
      return Runtime.New(this,FSharpSet.New1(SetUtil.ofSeq(s)));
     },
     New1:function(tree)
     {
      var r;
      r=Runtime.New(this,{});
      r.tree=tree;
      return r;
     }
    }),
    HashSetProxy:Runtime.Class({
     Add:function(item)
     {
      return this.add(item);
     },
     Clear:function()
     {
      this.data=Array.prototype.constructor.apply(Array,[]);
      this.count=0;
      return;
     },
     Contains:function(item)
     {
      var arr;
      arr=this.data[this.hash.call(null,item)];
      return arr==null?false:this.arrContains(item,arr);
     },
     CopyTo:function(arr)
     {
      var i,all,i1;
      i=0;
      all=HashSetUtil.concat(this.data);
      for(i1=0;i1<=all.length-1;i1++){
       Arrays.set(arr,i1,all[i1]);
      }
      return;
     },
     ExceptWith:function(xs)
     {
      var enumerator,item,value;
      enumerator=Enumerator.Get(xs);
      while(enumerator.MoveNext())
       {
        item=enumerator.get_Current();
        value=this.Remove(item);
       }
      return;
     },
     GetEnumerator:function()
     {
      return Enumerator.Get(HashSetUtil.concat(this.data));
     },
     IntersectWith:function(xs)
     {
      var other,all,i,item,value,_,value1;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      all=HashSetUtil.concat(this.data);
      for(i=0;i<=all.length-1;i++){
       item=all[i];
       value=other.Contains(item);
       if(!value)
        {
         value1=this.Remove(item);
         _=void value1;
        }
       else
        {
         _=null;
        }
      }
      return;
     },
     IsProperSubsetOf:function(xs)
     {
      var other;
      other=Arrays.ofSeq(xs);
      return this.count<Arrays.length(other)?this.IsSubsetOf(other):false;
     },
     IsProperSupersetOf:function(xs)
     {
      var other;
      other=Arrays.ofSeq(xs);
      return this.count>Arrays.length(other)?this.IsSupersetOf(other):false;
     },
     IsSubsetOf:function(xs)
     {
      var other,predicate,array;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      predicate=function(arg00)
      {
       return other.Contains(arg00);
      };
      array=HashSetUtil.concat(this.data);
      return Seq.forall(predicate,array);
     },
     IsSupersetOf:function(xs)
     {
      var predicate,x=this;
      predicate=function(arg00)
      {
       return x.Contains(arg00);
      };
      return Seq.forall(predicate,xs);
     },
     Overlaps:function(xs)
     {
      var predicate,x=this;
      predicate=function(arg00)
      {
       return x.Contains(arg00);
      };
      return Seq.exists(predicate,xs);
     },
     Remove:function(item)
     {
      var h,arr,_,_1;
      h=this.hash.call(null,item);
      arr=this.data[h];
      if(arr==null)
       {
        _=false;
       }
      else
       {
        if(this.arrRemove(item,arr))
         {
          this.count=this.count-1;
          _1=true;
         }
        else
         {
          _1=false;
         }
        _=_1;
       }
      return _;
     },
     RemoveWhere:function(cond)
     {
      var all,i,item,_,value;
      all=HashSetUtil.concat(this.data);
      for(i=0;i<=all.length-1;i++){
       item=all[i];
       if(cond(item))
        {
         value=this.Remove(item);
         _=void value;
        }
       else
        {
         _=null;
        }
      }
      return;
     },
     SetEquals:function(xs)
     {
      var other;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      return this.get_Count()===other.get_Count()?this.IsSupersetOf(other):false;
     },
     SymmetricExceptWith:function(xs)
     {
      var enumerator,item,_,value,value1;
      enumerator=Enumerator.Get(xs);
      while(enumerator.MoveNext())
       {
        item=enumerator.get_Current();
        if(this.Contains(item))
         {
          value=this.Remove(item);
          _=void value;
         }
        else
         {
          value1=this.Add(item);
          _=void value1;
         }
       }
      return;
     },
     UnionWith:function(xs)
     {
      var enumerator,item,value;
      enumerator=Enumerator.Get(xs);
      while(enumerator.MoveNext())
       {
        item=enumerator.get_Current();
        value=this.Add(item);
       }
      return;
     },
     add:function(item)
     {
      var h,arr,_,_1,value;
      h=this.hash.call(null,item);
      arr=this.data[h];
      if(arr==null)
       {
        this.data[h]=[item];
        this.count=this.count+1;
        _=true;
       }
      else
       {
        if(this.arrContains(item,arr))
         {
          _1=false;
         }
        else
         {
          value=arr.push(item);
          this.count=this.count+1;
          _1=true;
         }
        _=_1;
       }
      return _;
     },
     arrContains:function(item,arr)
     {
      var c,i,l;
      c=true;
      i=0;
      l=arr.length;
      while(c?i<l:false)
       {
        (this.equals.call(null,arr[i]))(item)?c=false:i=i+1;
       }
      return!c;
     },
     arrRemove:function(item,arr)
     {
      var c,i,l,_,start,ps,value;
      c=true;
      i=0;
      l=arr.length;
      while(c?i<l:false)
       {
        if((this.equals.call(null,arr[i]))(item))
         {
          start=i;
          ps=[];
          value=arr.splice.apply(arr,[start,1].concat(ps));
          _=c=false;
         }
        else
         {
          _=i=i+1;
         }
       }
      return!c;
     },
     get_Count:function()
     {
      return this.count;
     }
    },{
     New:function(init)
     {
      return Runtime.New(this,HashSetProxy.New3(init,function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New1:function(comparer)
     {
      return Runtime.New(this,HashSetProxy.New3(Seq.empty(),function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New11:function()
     {
      return Runtime.New(this,HashSetProxy.New3(Seq.empty(),function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New2:function(init,comparer)
     {
      return Runtime.New(this,HashSetProxy.New3(init,function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New3:function(init,equals,hash)
     {
      var r,enumerator,x,value;
      r=Runtime.New(this,{});
      r.equals=equals;
      r.hash=hash;
      r.data=Array.prototype.constructor.apply(Array,[]);
      r.count=0;
      enumerator=Enumerator.Get(init);
      while(enumerator.MoveNext())
       {
        x=enumerator.get_Current();
        value=r.add(x);
       }
      return r;
     }
    }),
    HashSetUtil:{
     concat:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o){
       r.push.apply(r,$o[k]);
      }
      ;
      return r;
     }
    },
    LinkedList:{
     E:Runtime.Class({
      Dispose:function()
      {
       return null;
      },
      MoveNext:function()
      {
       this.c=this.c.n;
       return!Unchecked.Equals(this.c,null);
      },
      get_Current:function()
      {
       return this.c.v;
      }
     },{
      New:function(l)
      {
       var r;
       r=Runtime.New(this,{});
       r.c=l;
       return r;
      }
     }),
     T:Runtime.Class({
      AddAfter:function(after,value)
      {
       var before,node,_;
       before=after.n;
       node={
        p:after,
        n:before,
        v:value
       };
       Unchecked.Equals(after.n,null)?void(this.p=node):null;
       after.n=node;
       if(!Unchecked.Equals(before,null))
        {
         before.p=node;
         _=node;
        }
       else
        {
         _=null;
        }
       this.c=this.c+1;
       return node;
      },
      AddBefore:function(before,value)
      {
       var after,node,_;
       after=before.p;
       node={
        p:after,
        n:before,
        v:value
       };
       Unchecked.Equals(before.p,null)?void(this.n=node):null;
       before.p=node;
       if(!Unchecked.Equals(after,null))
        {
         after.n=node;
         _=node;
        }
       else
        {
         _=null;
        }
       this.c=this.c+1;
       return node;
      },
      AddFirst:function(value)
      {
       var _,node;
       if(this.c===0)
        {
         node={
          p:null,
          n:null,
          v:value
         };
         this.n=node;
         this.p=this.n;
         this.c=1;
         _=node;
        }
       else
        {
         _=this.AddBefore(this.n,value);
        }
       return _;
      },
      AddLast:function(value)
      {
       var _,node;
       if(this.c===0)
        {
         node={
          p:null,
          n:null,
          v:value
         };
         this.n=node;
         this.p=this.n;
         this.c=1;
         _=node;
        }
       else
        {
         _=this.AddAfter(this.p,value);
        }
       return _;
      },
      Clear:function()
      {
       this.c=0;
       this.n=null;
       this.p=null;
       return;
      },
      Contains:function(value)
      {
       var found,node;
       found=false;
       node=this.n;
       while(!Unchecked.Equals(node,null)?!found:false)
        {
         node.v==value?found=true:node=node.n;
        }
       return found;
      },
      Find:function(value)
      {
       var node,notFound;
       node=this.n;
       notFound=true;
       while(notFound?!Unchecked.Equals(node,null):false)
        {
         node.v==value?notFound=false:node=node.n;
        }
       return notFound?null:node;
      },
      FindLast:function(value)
      {
       var node,notFound;
       node=this.p;
       notFound=true;
       while(notFound?!Unchecked.Equals(node,null):false)
        {
         node.v==value?notFound=false:node=node.p;
        }
       return notFound?null:node;
      },
      GetEnumerator:function()
      {
       return E.New(this);
      },
      Remove:function(node)
      {
       var before,after,_,_1;
       before=node.p;
       after=node.n;
       if(Unchecked.Equals(before,null))
        {
         _=void(this.n=after);
        }
       else
        {
         before.n=after;
         _=after;
        }
       if(Unchecked.Equals(after,null))
        {
         _1=void(this.p=before);
        }
       else
        {
         after.p=before;
         _1=before;
        }
       this.c=this.c-1;
       return;
      },
      Remove1:function(value)
      {
       var node,_;
       node=this.Find(value);
       if(Unchecked.Equals(node,null))
        {
         _=false;
        }
       else
        {
         this.Remove(node);
         _=true;
        }
       return _;
      },
      RemoveFirst:function()
      {
       return this.Remove(this.n);
      },
      RemoveLast:function()
      {
       return this.Remove(this.p);
      },
      get_Count:function()
      {
       return this.c;
      },
      get_First:function()
      {
       return this.n;
      },
      get_Last:function()
      {
       return this.p;
      }
     },{
      New:function()
      {
       return Runtime.New(this,T1.New1(Seq.empty()));
      },
      New1:function(coll)
      {
       var r,ie,_,node;
       r=Runtime.New(this,{});
       r.c=0;
       r.n=null;
       r.p=null;
       ie=Enumerator.Get(coll);
       if(ie.MoveNext())
        {
         r.n={
          p:null,
          n:null,
          v:ie.get_Current()
         };
         r.p=r.n;
         _=void(r.c=1);
        }
       else
        {
         _=null;
        }
       while(ie.MoveNext())
        {
         node={
          p:r.p,
          n:null,
          v:ie.get_Current()
         };
         r.p.n=node;
         r.p=node;
         r.c=r.c+1;
        }
       return r;
      }
     })
    },
    MapModule:{
     Exists:function(f,m)
     {
      var predicate;
      predicate=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.exists(predicate,m);
     },
     Filter:function(f,m)
     {
      var predicate,source,source1,data,t;
      predicate=function(kv)
      {
       return(f(kv.Key))(kv.Value);
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      source1=Seq.filter(predicate,source);
      data=Seq.toArray(source1);
      t=BalancedTree.Build(data,0,data.length-1);
      return FSharpMap.New(t);
     },
     FindKey:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V)?{
        $:1,
        $0:kv.K
       }:{
        $:0
       };
      };
      return Seq.pick(chooser,m);
     },
     Fold:function(f,s,m)
     {
      var folder,source;
      folder=function(s1)
      {
       return function(kv)
       {
        return((f(s1))(kv.Key))(kv.Value);
       };
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      return Seq.fold(folder,s,source);
     },
     FoldBack:function(f,m,s)
     {
      var folder,source;
      folder=function(s1)
      {
       return function(kv)
       {
        return((f(kv.Key))(kv.Value))(s1);
       };
      };
      source=BalancedTree.Enumerate(true,m.get_Tree());
      return Seq.fold(folder,s,source);
     },
     ForAll:function(f,m)
     {
      var predicate;
      predicate=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.forall(predicate,m);
     },
     Iterate:function(f,m)
     {
      var action;
      action=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.iter(action,m);
     },
     Map:function(f,m)
     {
      var mapping,source,data,t;
      mapping=function(kv)
      {
       return Runtime.New(Pair,{
        Key:kv.Key,
        Value:(f(kv.Key))(kv.Value)
       });
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      data=Seq.map(mapping,source);
      t=BalancedTree.OfSeq(data);
      return FSharpMap.New(t);
     },
     OfArray:function(a)
     {
      var mapping,data,t;
      mapping=function(tupledArg)
      {
       var k,v;
       k=tupledArg[0];
       v=tupledArg[1];
       return Runtime.New(Pair,{
        Key:k,
        Value:v
       });
      };
      data=Seq.map(mapping,a);
      t=BalancedTree.OfSeq(data);
      return FSharpMap.New(t);
     },
     Partition:function(f,m)
     {
      var predicate,array,patternInput,y,x;
      predicate=function(kv)
      {
       return(f(kv.Key))(kv.Value);
      };
      array=Seq.toArray(BalancedTree.Enumerate(false,m.get_Tree()));
      patternInput=Arrays.partition(predicate,array);
      y=patternInput[1];
      x=patternInput[0];
      return[FSharpMap.New(BalancedTree.Build(x,0,x.length-1)),FSharpMap.New(BalancedTree.Build(y,0,y.length-1))];
     },
     Pick:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.pick(chooser,m);
     },
     ToSeq:function(m)
     {
      var mapping,source;
      mapping=function(kv)
      {
       return[kv.Key,kv.Value];
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      return Seq.map(mapping,source);
     },
     TryFind:function(k,m)
     {
      return m.TryFind(k);
     },
     TryFindKey:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V)?{
        $:1,
        $0:kv.K
       }:{
        $:0
       };
      };
      return Seq.tryPick(chooser,m);
     },
     TryPick:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.tryPick(chooser,m);
     }
    },
    MapUtil:{
     fromSeq:function(s)
     {
      var a;
      a=Seq.toArray(Seq.delay(function()
      {
       return Seq.collect(function(matchValue)
       {
        var v,k;
        v=matchValue[1];
        k=matchValue[0];
        return[Runtime.New(Pair,{
         Key:k,
         Value:v
        })];
       },Seq.distinctBy(function(tuple)
       {
        return tuple[0];
       },s));
      }));
      Arrays.sortInPlace(a);
      return BalancedTree.Build(a,0,a.length-1);
     }
    },
    Pair:Runtime.Class({
     CompareTo:function(other)
     {
      return Operators.Compare(this.Key,other.Key);
     },
     Equals:function(other)
     {
      return Unchecked.Equals(this.Key,other.Key);
     },
     GetHashCode:function()
     {
      return Unchecked.Hash(this.Key);
     }
    }),
    ResizeArray:{
     ResizeArrayProxy:Runtime.Class({
      Add:function(x)
      {
       return this.arr.push(x);
      },
      AddRange:function(x)
      {
       var _this=this;
       return Seq.iter(function(arg00)
       {
        return _this.Add(arg00);
       },x);
      },
      Clear:function()
      {
       var value;
       value=ResizeArray.splice(this.arr,0,Arrays.length(this.arr),[]);
       return;
      },
      CopyTo:function(arr)
      {
       return this.CopyTo1(arr,0);
      },
      CopyTo1:function(arr,offset)
      {
       return this.CopyTo2(0,arr,offset,this.get_Count());
      },
      CopyTo2:function(index,target,offset,count)
      {
       return Arrays.blit(this.arr,index,target,offset,count);
      },
      GetEnumerator:function()
      {
       return Enumerator.Get(this.arr);
      },
      GetRange:function(index,count)
      {
       return ResizeArrayProxy.New11(Arrays.sub(this.arr,index,count));
      },
      Insert:function(index,items)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,0,[items]);
       return;
      },
      InsertRange:function(index,items)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,0,Seq.toArray(items));
       return;
      },
      RemoveAt:function(x)
      {
       var value;
       value=ResizeArray.splice(this.arr,x,1,[]);
       return;
      },
      RemoveRange:function(index,count)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,count,[]);
       return;
      },
      Reverse:function()
      {
       return this.arr.reverse();
      },
      Reverse1:function(index,count)
      {
       return Arrays.reverse(this.arr,index,count);
      },
      ToArray:function()
      {
       return this.arr.slice();
      },
      get_Count:function()
      {
       return Arrays.length(this.arr);
      },
      get_Item:function(x)
      {
       return Arrays.get(this.arr,x);
      },
      set_Item:function(x,v)
      {
       return Arrays.set(this.arr,x,v);
      }
     },{
      New:function(el)
      {
       return Runtime.New(this,ResizeArrayProxy.New11(Seq.toArray(el)));
      },
      New1:function()
      {
       return Runtime.New(this,ResizeArrayProxy.New11([]));
      },
      New11:function(arr)
      {
       var r;
       r=Runtime.New(this,{});
       r.arr=arr;
       return r;
      },
      New2:function()
      {
       return Runtime.New(this,ResizeArrayProxy.New11([]));
      }
     }),
     splice:function($arr,$index,$howMany,$items)
     {
      var $0=this,$this=this;
      return Global.Array.prototype.splice.apply($arr,[$index,$howMany].concat($items));
     }
    },
    SetModule:{
     Filter:function(f,s)
     {
      var data;
      data=Seq.toArray(Seq.filter(f,s));
      return FSharpSet.New1(BalancedTree.Build(data,0,data.length-1));
     },
     FoldBack:function(f,a,s)
     {
      return Seq.fold(function(s1)
      {
       return function(x)
       {
        return(f(x))(s1);
       };
      },s,BalancedTree.Enumerate(true,a.get_Tree()));
     },
     Partition:function(f,a)
     {
      var patternInput,y,x;
      patternInput=Arrays.partition(f,Seq.toArray(a));
      y=patternInput[1];
      x=patternInput[0];
      return[FSharpSet.New1(BalancedTree.OfSeq(x)),FSharpSet.New1(BalancedTree.OfSeq(y))];
     }
    },
    SetUtil:{
     ofSeq:function(s)
     {
      var a;
      a=Seq.toArray(s);
      Arrays.sortInPlace(a);
      return BalancedTree.Build(a,0,a.length-1);
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  BalancedTree=Runtime.Safe(Collections.BalancedTree);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  List=Runtime.Safe(Global.WebSharper.List);
  T=Runtime.Safe(List.T);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  DictionaryUtil=Runtime.Safe(Collections.DictionaryUtil);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  Pair=Runtime.Safe(Collections.Pair);
  Option=Runtime.Safe(Global.WebSharper.Option);
  MapUtil=Runtime.Safe(Collections.MapUtil);
  FSharpSet=Runtime.Safe(Collections.FSharpSet);
  SetModule=Runtime.Safe(Collections.SetModule);
  SetUtil=Runtime.Safe(Collections.SetUtil);
  Array=Runtime.Safe(Global.Array);
  HashSetUtil=Runtime.Safe(Collections.HashSetUtil);
  HashSetProxy=Runtime.Safe(Collections.HashSetProxy);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  E=Runtime.Safe(LinkedList.E);
  T1=Runtime.Safe(LinkedList.T);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  return ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Arrays,Concurrency,Array,Seq,UI,Next,Abbrev,Fresh,Collections,HashSetProxy,HashSet,JQueue,Unchecked,Slot,An,AppendList1,Anims,window,Trans,Option,View,Lazy,Array1,Attrs,DomUtility,Attr,Var,List,AnimatedAttrNode,DynamicAttrNode,document,Doc,UINextPagelet,Var1,Docs,View1,Mailbox,Operators,NodeSet,DocElemNode,DomNodes,jQuery,Easing,Easings,FlowBuilder,Flow,T,Input,DoubleInterpolation,Key,ListModels,ListModel,Model1,Model,Strings,encodeURIComponent,decodeURIComponent,Route,Routing,Router,Trie1,Dictionary,Snap1,Async,Enumerator,ResizeArray,ResizeArrayProxy,MapModule,FSharpMap,Html,Client,Pagelet,Attr1,Tags,ViewBuilder,Html1,Attributes,SvgAttributes;
 Runtime.Define(Global,{
  WebSharper:{
   UI:{
    Next:{
     Abbrev:{
      Array:{
       MapReduce:function(f,z,re,a)
       {
        var loop;
        loop=function(off,len)
        {
         var l2,a1,b,l21,a2,b1;
         if(len<=0)
          {
           return z;
          }
         else
          {
           if(len===1)
            {
             if(off>=0?off<Arrays.length(a):false)
              {
               return f(Arrays.get(a,off));
              }
             else
              {
               l2=len/2>>0;
               a1=loop(off,l2);
               b=loop(off+l2,len-l2);
               return(re(a1))(b);
              }
            }
           else
            {
             l21=len/2>>0;
             a2=loop(off,l21);
             b1=loop(off+l21,len-l21);
             return(re(a2))(b1);
            }
          }
        };
        return loop(0,Arrays.length(a));
       }
      },
      Async:{
       Schedule:function(f)
       {
        return Concurrency.Start(Concurrency.Delay(function()
        {
         return Concurrency.Return(f(null));
        }),{
         $:0
        });
       },
       StartTo:function(comp,k)
       {
        return Concurrency.StartWithContinuations(comp,k,function()
        {
        },function()
        {
        },{
         $:0
        });
       }
      },
      Dict:{
       ToKeyArray:function(d)
       {
        var arr;
        arr=Array(d.count);
        Seq.iteri(function(i)
        {
         return function(kv)
         {
          return Arrays.set(arr,i,kv.K);
         };
        },d);
        return arr;
       },
       ToValueArray:function(d)
       {
        var arr;
        arr=Array(d.count);
        Seq.iteri(function(i)
        {
         return function(kv)
         {
          return Arrays.set(arr,i,kv.V);
         };
        },d);
        return arr;
       }
      },
      Fresh:{
       Id:function()
       {
        var _;
        _=Fresh.counter()+1;
        Fresh.counter=function()
        {
         return _;
        };
        return"uid"+Global.String(Fresh.counter());
       },
       Int:function()
       {
        var _;
        _=Fresh.counter()+1;
        Fresh.counter=function()
        {
         return _;
        };
        return Fresh.counter();
       },
       counter:Runtime.Field(function()
       {
        return 0;
       })
      },
      HashSet:{
       Except:function(excluded,included)
       {
        var set;
        set=HashSetProxy.New(HashSet.ToArray(included));
        set.ExceptWith(HashSet.ToArray(excluded));
        return set;
       },
       Filter:function(ok,set)
       {
        return HashSetProxy.New(Arrays.filter(ok,HashSet.ToArray(set)));
       },
       Intersect:function(a,b)
       {
        var set;
        set=HashSetProxy.New(HashSet.ToArray(a));
        set.IntersectWith(HashSet.ToArray(b));
        return set;
       },
       ToArray:function(set)
       {
        var arr;
        arr=Array(set.get_Count());
        set.CopyTo(arr);
        return arr;
       }
      },
      JQueue:{
       Add:function($x,$q)
       {
        var $0=this,$this=this;
        return $q.push($x);
       },
       Count:function(q)
       {
        return q.length;
       },
       Dequeue:function($q)
       {
        var $0=this,$this=this;
        return $q.shift();
       },
       Iter:function(f,q)
       {
        return Arrays.iter(f,JQueue.ToArray(q));
       },
       ToArray:function(q)
       {
        return q.slice();
       }
      },
      Mailbox:{
       StartProcessor:function(proc)
       {
        var mail,isActive,work;
        mail=[];
        isActive=[false];
        work=Concurrency.Delay(function()
        {
         return Concurrency.Combine(Concurrency.While(function()
         {
          return JQueue.Count(mail)>0;
         },Concurrency.Delay(function()
         {
          return Concurrency.Bind(proc(JQueue.Dequeue(mail)),function()
          {
           return Concurrency.Return(null);
          });
         })),Concurrency.Delay(function()
         {
          return Concurrency.Return(void(isActive[0]=false));
         }));
        });
        return function(msg)
        {
         JQueue.Add(msg,mail);
         if(!isActive[0])
          {
           isActive[0]=true;
           return Concurrency.Start(work,{
            $:0
           });
          }
         else
          {
           return null;
          }
        };
       }
      },
      Slot:Runtime.Class({},{
       New:function(key,value)
       {
        var r;
        r=Runtime.New(this,{});
        r.key=key;
        r.value=value;
        return r;
       }
      }),
      Slot1:Runtime.Class({
       Equals:function(o)
       {
        return Unchecked.Equals(this.key.call(null,this.value),this.key.call(null,o.get_Value()));
       },
       GetHashCode:function()
       {
        return Unchecked.Hash(this.key.call(null,this.value));
       },
       get_Value:function()
       {
        return this.value;
       }
      },{
       Create:function(key,value)
       {
        return Slot.New(key,value);
       }
      }),
      U:function()
      {
       return;
      }
     },
     An:Runtime.Class({},{
      Append:function(_arg2,_arg1)
      {
       return Runtime.New(An,{
        $:0,
        $0:AppendList1.Append(_arg2.$0,_arg1.$0)
       });
      },
      Concat:function(xs)
      {
       return Runtime.New(An,{
        $:0,
        $0:AppendList1.Concat(Seq.map(function(_arg00_)
        {
         return Anims.List(_arg00_);
        },xs))
       });
      },
      Const:function(v)
      {
       return Anims.Const(v);
      },
      Delayed:function(inter,easing,dur,delay,x,y)
      {
       return{
        Compute:function(t)
        {
         return t<=delay?x:inter.Interpolate(easing.TransformTime.call(null,(t-delay)/dur),x,y);
        },
        Duration:dur+delay
       };
      },
      Map:function(f,anim)
      {
       var f1;
       f1=anim.Compute;
       return Anims.Def(anim.Duration,function(x)
       {
        return f(f1(x));
       });
      },
      Pack:function(anim)
      {
       return Runtime.New(An,{
        $:0,
        $0:AppendList1.Single({
         $:1,
         $0:anim
        })
       });
      },
      Play:function(anim)
      {
       return Concurrency.Delay(function()
       {
        return Concurrency.Bind(An.Run(function()
        {
        },Anims.Actions(anim)),function()
        {
         return Concurrency.Return(Anims.Finalize(anim));
        });
       });
      },
      Run:function(k,anim)
      {
       var dur;
       dur=anim.Duration;
       return Concurrency.FromContinuations(function(tupledArg)
       {
        var ok,start,loop;
        ok=tupledArg[0];
        start=function()
        {
         window.requestAnimationFrame(function(t)
         {
          return loop(t,t);
         });
        };
        loop=function(start1,now)
        {
         var t;
         t=now-start1;
         k(anim.Compute.call(null,t));
         return t<=dur?void window.requestAnimationFrame(function(t1)
         {
          return loop(start1,t1);
         }):ok(null);
        };
        return start(null);
       });
      },
      Simple:function(inter,easing,dur,x,y)
      {
       return{
        Compute:function(t)
        {
         return inter.Interpolate(easing.TransformTime.call(null,t/dur),x,y);
        },
        Duration:dur
       };
      },
      WhenDone:function(f,main)
      {
       return An.Append(Runtime.New(An,{
        $:0,
        $0:AppendList1.Single({
         $:0,
         $0:f
        })
       }),main);
      },
      get_Empty:function()
      {
       return Runtime.New(An,{
        $:0,
        $0:AppendList1.Empty()
       });
      }
     }),
     AnimatedAttrNode:Runtime.Class({
      GetChangeAnim:function(parent)
      {
       var matchValue,a=this;
       matchValue=[this.visible,this.logical];
       return An.WhenDone(function()
       {
        return a.sync(parent);
       },matchValue[0].$==1?matchValue[1].$==1?a.dirty?An.Pack(An.Map(function(v)
       {
        return a.pushVisible(parent,v);
       },Trans.AnimateChange(a.tr,matchValue[0].$0,matchValue[1].$0))):An.get_Empty():An.get_Empty():An.get_Empty());
      },
      GetEnterAnim:function(parent)
      {
       var matchValue,a=this;
       matchValue=[this.visible,this.logical];
       return An.WhenDone(function()
       {
        return a.sync(parent);
       },matchValue[0].$==1?matchValue[1].$==1?a.dirty?An.Pack(An.Map(function(v)
       {
        return a.pushVisible(parent,v);
       },Trans.AnimateChange(a.tr,matchValue[0].$0,matchValue[1].$0))):matchValue[0].$==0?matchValue[1].$==1?An.Pack(An.Map(function(v)
       {
        return a.pushVisible(parent,v);
       },Trans.AnimateEnter(a.tr,matchValue[1].$0))):An.get_Empty():An.get_Empty():matchValue[0].$==0?matchValue[1].$==1?An.Pack(An.Map(function(v)
       {
        return a.pushVisible(parent,v);
       },Trans.AnimateEnter(a.tr,matchValue[1].$0))):An.get_Empty():An.get_Empty():matchValue[0].$==0?matchValue[1].$==1?An.Pack(An.Map(function(v)
       {
        return a.pushVisible(parent,v);
       },Trans.AnimateEnter(a.tr,matchValue[1].$0))):An.get_Empty():An.get_Empty());
      },
      GetExitAnim:function(parent)
      {
       var matchValue,a=this;
       matchValue=this.visible;
       return An.WhenDone(function()
       {
        a.dirty=true;
        a.visible={
         $:0
        };
        return;
       },matchValue.$==1?An.Pack(An.Map(function(v)
       {
        return a.pushVisible(parent,v);
       },Trans.AnimateExit(a.tr,matchValue.$0))):An.get_Empty());
      },
      Sync:function()
      {
       return null;
      },
      get_Changed:function()
      {
       return this.updates;
      },
      pushVisible:function(el,v)
      {
       this.visible={
        $:1,
        $0:v
       };
       this.dirty=true;
       return(this.push.call(null,el))(v);
      },
      sync:function(p)
      {
       if(this.dirty)
        {
         Option.iter(this.push.call(null,p),this.logical);
         this.visible=this.logical;
         this.dirty=false;
         return;
        }
       else
        {
         return null;
        }
      }
     },{
      New:function(tr,view,push)
      {
       var r;
       r=Runtime.New(this,{});
       r.tr=tr;
       r.push=push;
       r.logical={
        $:0
       };
       r.visible={
        $:0
       };
       r.dirty=true;
       r.updates=View.Map(function(x)
       {
        r.logical={
         $:1,
         $0:x
        };
        r.dirty=true;
        return;
       },view);
       return r;
      }
     }),
     Anims:{
      Actions:function(_arg1)
      {
       return Anims.ConcatActions(Arrays.choose(function(_arg2)
       {
        return _arg2.$==1?{
         $:1,
         $0:_arg2.$0
        }:{
         $:0
        };
       },AppendList1.ToArray(_arg1.$0)));
      },
      ConcatActions:function(xs)
      {
       var xs1,matchValue,dur,xs2;
       xs1=Seq.toArray(xs);
       matchValue=Arrays.length(xs1);
       if(matchValue===0)
        {
         return Anims.Const(null);
        }
       else
        {
         if(matchValue===1)
          {
           return Arrays.get(xs1,0);
          }
         else
          {
           dur=Seq.max(Seq.map(function(anim)
           {
            return anim.Duration;
           },xs1));
           xs2=Arrays.map(function(anim)
           {
            return Anims.Prolong(dur,anim);
           },xs1);
           return Anims.Def(dur,function(t)
           {
            return Arrays.iter(function(anim)
            {
             return anim.Compute.call(null,t);
            },xs2);
           });
          }
        }
      },
      Const:function(v)
      {
       return Anims.Def(0,function()
       {
        return v;
       });
      },
      Def:function(d,f)
      {
       return{
        Compute:f,
        Duration:d
       };
      },
      Finalize:function(_arg1)
      {
       return Arrays.iter(function(_arg2)
       {
        return _arg2.$==0?_arg2.$0.call(null,null):null;
       },AppendList1.ToArray(_arg1.$0));
      },
      List:function(_arg1)
      {
       return _arg1.$0;
      },
      Prolong:function(nextDuration,anim)
      {
       var comp,dur,last;
       comp=anim.Compute;
       dur=anim.Duration;
       last=Lazy.Create(function()
       {
        return anim.Compute.call(null,anim.Duration);
       });
       return{
        Compute:function(t)
        {
         return t>=dur?last.eval():comp(t);
        },
        Duration:nextDuration
       };
      }
     },
     AppendList1:{
      Append:function(x,y)
      {
       var matchValue;
       matchValue=[x,y];
       return matchValue[0].$==0?matchValue[1]:matchValue[1].$==0?matchValue[0]:{
        $:2,
        $0:x,
        $1:y
       };
      },
      Concat:function(xs)
      {
       var a;
       a=Seq.toArray(xs);
       return Array1.MapReduce(function(x)
       {
        return x;
       },AppendList1.Empty(),function(_arg00_)
       {
        return function(_arg10_)
        {
         return AppendList1.Append(_arg00_,_arg10_);
        };
       },a);
      },
      Empty:function()
      {
       return{
        $:0
       };
      },
      FromArray:function(xs)
      {
       var matchValue;
       matchValue=xs.length;
       return matchValue===0?{
        $:0
       }:matchValue===1?{
        $:1,
        $0:Arrays.get(xs,0)
       }:{
        $:3,
        $0:xs.slice()
       };
      },
      Single:function(x)
      {
       return{
        $:1,
        $0:x
       };
      },
      ToArray:function(xs)
      {
       var out,loop;
       out=[];
       loop=function(xs1)
       {
        var y;
        if(xs1.$==1)
         {
          return JQueue.Add(xs1.$0,out);
         }
        else
         {
          if(xs1.$==2)
           {
            y=xs1.$1;
            loop(xs1.$0);
            return loop(y);
           }
          else
           {
            return xs1.$==3?Arrays.iter(function(v)
            {
             return JQueue.Add(v,out);
            },xs1.$0):null;
           }
         }
       };
       loop(xs);
       return JQueue.ToArray(out);
      }
     },
     Attr:Runtime.Class({},{
      Animated:function(name,tr,view,attr)
      {
       return Attrs.Animated(tr,view,function(el)
       {
        return function(v)
        {
         return DomUtility.SetAttr(el,name,attr(v));
        };
       });
      },
      AnimatedStyle:function(name,tr,view,attr)
      {
       return Attrs.Animated(tr,view,function(el)
       {
        return function(v)
        {
         return DomUtility.SetStyle(el,name,attr(v));
        };
       });
      },
      Append:function(a,b)
      {
       return Attrs.Mk(a.Flags|b.Flags,Attrs.AppendTree(a.Tree,b.Tree));
      },
      Class:function(name)
      {
       return Attrs.Static(function(el)
       {
        return DomUtility.AddClass(el,name);
       });
      },
      Concat:function(xs)
      {
       var f,re,a;
       f=function(x)
       {
        return x;
       };
       re=function(arg00)
       {
        return function(arg10)
        {
         return Attr.Append(arg00,arg10);
        };
       };
       a=Seq.toArray(xs);
       return Array1.MapReduce(f,Attrs.EmptyAttr(),re,a);
      },
      Create:function(name,value)
      {
       return Attrs.Static(function(el)
       {
        return DomUtility.SetAttr(el,name,value);
       });
      },
      Dynamic:function(name,view)
      {
       return Attrs.Dynamic(view,function(el)
       {
        return function(v)
        {
         return DomUtility.SetAttr(el,name,v);
        };
       });
      },
      DynamicClass:function(name,view,ok)
      {
       return Attrs.Dynamic(view,function(el)
       {
        return function(v)
        {
         return ok(v)?DomUtility.AddClass(el,name):DomUtility.RemoveClass(el,name);
        };
       });
      },
      DynamicCustom:function(set,view)
      {
       return Attrs.Dynamic(view,set);
      },
      DynamicPred:function(name,predView,valView)
      {
       var viewFn;
       viewFn=function(el)
       {
        return function(tupledArg)
        {
         var v;
         v=tupledArg[1];
         return tupledArg[0]?DomUtility.SetAttr(el,name,v):DomUtility.RemoveAttr(el,name);
        };
       };
       return Attrs.Dynamic(View.Map2(function(pred)
       {
        return function(value)
        {
         return[pred,value];
        };
       },predView,valView),viewFn);
      },
      DynamicStyle:function(name,view)
      {
       return Attrs.Dynamic(view,function(el)
       {
        return function(v)
        {
         return DomUtility.SetStyle(el,name,v);
        };
       });
      },
      Handler:function(name,callback)
      {
       return Attrs.Static(function(el)
       {
        return el.addEventListener(name,callback,false);
       });
      },
      Style:function(name,value)
      {
       return Attrs.Static(function(el)
       {
        return DomUtility.SetStyle(el,name,value);
       });
      },
      Value:function(_var)
      {
       var onChange;
       onChange=function(e)
       {
        return e.currentTarget.value!==_var.get_Value()?Var.Set(_var,e.currentTarget.value):null;
       };
       return Attr.Concat(List.ofArray([Attr.Handler("change",onChange),Attr.Handler("input",onChange),Attrs.Dynamic(_var.get_View(),function(e)
       {
        return function(v)
        {
         return v!==e.value?void(e.value=v):null;
        };
       })]));
      },
      get_Empty:function()
      {
       return Attrs.EmptyAttr();
      }
     }),
     Attrs:{
      Animated:function(tr,view,set)
      {
       var node,flags;
       node=AnimatedAttrNode.New(tr,view,set);
       flags=4;
       if(Trans.CanAnimateEnter(tr))
        {
         flags=flags|1;
        }
       if(Trans.CanAnimateExit(tr))
        {
         flags=flags|2;
        }
       return Attrs.Mk(flags,{
        $:1,
        $0:node
       });
      },
      AppendTree:function(a,b)
      {
       var matchValue;
       matchValue=[a,b];
       return matchValue[0].$==0?matchValue[1]:matchValue[1].$==0?matchValue[0]:{
        $:2,
        $0:a,
        $1:b
       };
      },
      Dynamic:function(view,set)
      {
       return Attrs.Mk(0,{
        $:1,
        $0:DynamicAttrNode.New(view,set)
       });
      },
      EmptyAttr:Runtime.Field(function()
      {
       return Attrs.Mk(0,{
        $:0
       });
      }),
      GetAnim:function(dyn,f)
      {
       return An.Concat(Arrays.map(function(n)
       {
        return(f(n))(dyn.DynElem);
       },dyn.DynNodes));
      },
      GetChangeAnim:function(dyn)
      {
       return Attrs.GetAnim(dyn,function(n)
       {
        return function(arg00)
        {
         return n.GetChangeAnim(arg00);
        };
       });
      },
      GetEnterAnim:function(dyn)
      {
       return Attrs.GetAnim(dyn,function(n)
       {
        return function(arg00)
        {
         return n.GetEnterAnim(arg00);
        };
       });
      },
      GetExitAnim:function(dyn)
      {
       return Attrs.GetAnim(dyn,function(n)
       {
        return function(arg00)
        {
         return n.GetExitAnim(arg00);
        };
       });
      },
      HasChangeAnim:function(attr)
      {
       return(attr.DynFlags&4)!==0;
      },
      HasEnterAnim:function(attr)
      {
       return(attr.DynFlags&1)!==0;
      },
      HasExitAnim:function(attr)
      {
       return(attr.DynFlags&2)!==0;
      },
      Insert:function(elem,tree)
      {
       var nodes,loop;
       nodes=[];
       loop=function(node)
       {
        var b;
        if(node.$==1)
         {
          return JQueue.Add(node.$0,nodes);
         }
        else
         {
          if(node.$==2)
           {
            b=node.$1;
            loop(node.$0);
            return loop(b);
           }
          else
           {
            return node.$==3?node.$0.call(null,elem):null;
           }
         }
       };
       loop(tree.Tree);
       return{
        DynElem:elem,
        DynFlags:tree.Flags,
        DynNodes:JQueue.ToArray(nodes)
       };
      },
      Mk:function(flags,tree)
      {
       return Runtime.New(Attr,{
        Flags:flags,
        Tree:tree
       });
      },
      Static:function(attr)
      {
       return Attrs.Mk(0,{
        $:3,
        $0:attr
       });
      },
      Sync:function(elem,dyn)
      {
       return Arrays.iter(function(d)
       {
        return d.Sync(elem);
       },dyn.DynNodes);
      },
      Updates:function(dyn)
      {
       var p,a;
       p=function(x)
       {
        return function(y)
        {
         return View.Map2(function()
         {
          return function()
          {
           return null;
          };
         },x,y);
        };
       };
       a=dyn.DynNodes;
       return Array1.MapReduce(function(x)
       {
        return x.get_Changed();
       },View.Const(null),p,a);
      }
     },
     Doc:Runtime.Class({
      ReplaceInDom:function(elt)
      {
       var ldelim,rdelim,parent;
       ldelim=document.createTextNode("");
       rdelim=document.createTextNode("");
       parent=elt.parentNode;
       parent.replaceChild(rdelim,elt);
       parent.insertBefore(ldelim,rdelim);
       return Doc.RunBetween(ldelim,rdelim,this);
      }
     },{
      Append:function(a,b)
      {
       var x;
       x=View.Map2(function()
       {
        return function()
        {
         return null;
        };
       },a.Updates,b.Updates);
       return Doc.Mk({
        $:0,
        $0:a.DocNode,
        $1:b.DocNode
       },x);
      },
      AsPagelet:function(doc)
      {
       return UINextPagelet.New(doc);
      },
      Button:function(caption,attrs,action)
      {
       var attrs1;
       attrs1=Attr.Concat(attrs);
       return Doc.Elem(Doc.Clickable("button",action),attrs1,Doc.TextNode(caption));
      },
      CheckBox:function(attrs,chk)
      {
       var el;
       el=DomUtility.CreateElement("input");
       el.addEventListener("click",function()
       {
        return Var.Set(chk,el.checked);
       },false);
       return Doc.Elem(el,Attr.Concat(Seq.toList(Seq.delay(function()
       {
        return Seq.append(attrs,Seq.delay(function()
        {
         return[Attr.DynamicPred("checked",chk.get_View(),View.Const("checked"))];
        }));
       }))),Doc.get_Empty());
      },
      CheckBoxGroup:function(attrs,item,chk)
      {
       var rvi,predicate,checkedView,arg20,checkedAttr,attrs1,el;
       rvi=View.FromVar(chk);
       predicate=function(x)
       {
        return Unchecked.Equals(x,item);
       };
       checkedView=View.Map(function(list)
       {
        return Seq.exists(predicate,list);
       },rvi);
       arg20=View.Const("checked");
       checkedAttr=Attr.DynamicPred("checked",checkedView,arg20);
       attrs1=Attr.Concat(List.append(List.ofArray([Attr.Create("type","checkbox"),Attr.Create("name",Global.String(Var1.GetId(chk))),Attr.Create("value",Fresh.Id()),checkedAttr]),List.ofSeq(attrs)));
       el=DomUtility.CreateElement("input");
       el.addEventListener("click",function()
       {
        var chkd;
        chkd=el.checked;
        return Var1.Update(chk,function(obs)
        {
         return Seq.toList(Seq.distinct(chkd?List.append(obs,List.ofArray([item])):List.filter(function(x1)
         {
          return!Unchecked.Equals(x1,item);
         },obs)));
        });
       },false);
       return Doc.Elem(el,attrs1,Doc.get_Empty());
      },
      Clickable:function(elem,action)
      {
       var el;
       el=DomUtility.CreateElement(elem);
       el.addEventListener("click",function(ev)
       {
        ev.preventDefault();
        return action(null);
       },false);
       return el;
      },
      Concat:function(xs)
      {
       var a;
       a=Seq.toArray(xs);
       return Array1.MapReduce(function(x)
       {
        return x;
       },Doc.get_Empty(),function(arg00)
       {
        return function(arg10)
        {
         return Doc.Append(arg00,arg10);
        };
       },a);
      },
      Convert:function(render,view)
      {
       return Doc.Flatten(View.Convert(render,view));
      },
      ConvertBy:function(key,render,view)
      {
       return Doc.Flatten(View.ConvertBy(key,render,view));
      },
      ConvertSeq:function(render,view)
      {
       return Doc.Flatten(View.ConvertSeq(render,view));
      },
      ConvertSeqBy:function(key,render,view)
      {
       return Doc.Flatten(View.ConvertSeqBy(key,render,view));
      },
      Elem:function(name,attr,children)
      {
       var node,arg20,arg10;
       node=Docs.CreateElemNode(name,attr,children.DocNode);
       arg20=children.Updates;
       arg10=View.Map2(function()
       {
        return function()
        {
         return null;
        };
       },Attrs.Updates(node.Attr),arg20);
       return Doc.Mk({
        $:1,
        $0:node
       },arg10);
      },
      Element:function(name,attr,children)
      {
       var attr1,arg20;
       attr1=Attr.Concat(attr);
       arg20=Doc.Concat(children);
       return Doc.Elem(DomUtility.CreateElement(name),attr1,arg20);
      },
      EmbedView:function(view)
      {
       var node,x;
       node=Docs.CreateEmbedNode();
       x=View.Map(function()
       {
       },View.Bind(function(doc)
       {
        Docs.UpdateEmbedNode(node,doc.DocNode);
        return doc.Updates;
       },view));
       return Doc.Mk({
        $:2,
        $0:node
       },x);
      },
      Flatten:function(view)
      {
       return Doc.EmbedView(View.Map(function(arg00)
       {
        return Doc.Concat(arg00);
       },view));
      },
      Input:function(attr,_var)
      {
       return Doc.InputInternal(attr,_var,{
        $:0
       });
      },
      InputArea:function(attr,_var)
      {
       return Doc.InputInternal(attr,_var,{
        $:2
       });
      },
      InputInternal:function(attr,_var,inputTy)
      {
       var patternInput,attrN;
       patternInput=inputTy.$==1?[Attr.Append(Attr.Create("type","password"),Attr.Concat(attr)),"input"]:inputTy.$==2?[Attr.Concat(attr),"textarea"]:[Attr.Concat(attr),"input"];
       attrN=patternInput[0];
       return Doc.Elem(DomUtility.CreateElement(patternInput[1]),Attr.Append(attrN,Attr.Value(_var)),Doc.get_Empty());
      },
      Link:function(caption,attrs,action)
      {
       var arg10,attrs1;
       arg10=Attr.Concat(attrs);
       attrs1=Attr.Append(Attr.Create("href","#"),arg10);
       return Doc.Elem(Doc.Clickable("a",action),attrs1,Doc.TextNode(caption));
      },
      Mk:function(node,updates)
      {
       return Runtime.New(Doc,{
        DocNode:node,
        Updates:updates
       });
      },
      PasswordBox:function(attr,_var)
      {
       return Doc.InputInternal(attr,_var,{
        $:1
       });
      },
      Radio:function(attrs,value,_var)
      {
       var el,valAttr,op_EqualsEqualsGreater;
       el=DomUtility.CreateElement("input");
       el.addEventListener("click",function()
       {
        return Var.Set(_var,value);
       },false);
       valAttr=Attr.DynamicPred("checked",View.Map(function(x)
       {
        return Unchecked.Equals(x,value);
       },_var.get_View()),View.Const("checked"));
       op_EqualsEqualsGreater=function(k,v)
       {
        return Attr.Create(k,v);
       };
       return Doc.Elem(el,Attr.Concat(List.append(List.ofArray([op_EqualsEqualsGreater("type","radio"),op_EqualsEqualsGreater("name",Global.String(Var1.GetId(_var))),valAttr]),List.ofSeq(attrs))),Doc.get_Empty());
      },
      Run:function(parent,doc)
      {
       var d,st,arg10;
       d=doc.DocNode;
       Docs.LinkElement(parent,d);
       st=Docs.CreateRunState(parent,d);
       arg10=doc.Updates;
       return View1.Sink(Mailbox.StartProcessor(function()
       {
        return Docs.PerformAnimatedUpdate(st,d);
       }),arg10);
      },
      RunBetween:function(ldelim,rdelim,doc)
      {
       var d,st,arg10;
       d=doc.DocNode;
       Docs.LinkPrevElement(rdelim,d);
       st=Docs.CreateDelimitedRunState(ldelim,rdelim,d);
       arg10=doc.Updates;
       return View1.Sink(Mailbox.StartProcessor(function()
       {
        return Docs.PerformAnimatedUpdate(st,d);
       }),arg10);
      },
      RunById:function(id,tr)
      {
       var matchValue;
       matchValue=DomUtility.Doc().getElementById(id);
       return Unchecked.Equals(matchValue,null)?Operators.FailWith("invalid id: "+id):Doc.Run(matchValue,tr);
      },
      Select:function(attrs,show,options,current)
      {
       var setSelectedItem,el1,x,selectedItemAttr,optionElements;
       setSelectedItem=function(el)
       {
        return function(item)
        {
         el.selectedIndex=Seq.findIndex(function(y)
         {
          return Unchecked.Equals(item,y);
         },options);
        };
       };
       el1=DomUtility.CreateElement("select");
       x=View.FromVar(current);
       selectedItemAttr=Attr.DynamicCustom(setSelectedItem,x);
       el1.addEventListener("change",function()
       {
        return Var.Set(current,options.get_Item(el1.selectedIndex));
       },false);
       optionElements=Doc.Concat(List.mapi(function(i)
       {
        return function(o)
        {
         var t;
         t=Doc.TextNode(show(o));
         return Doc.Element("option",List.ofArray([Attr.Create("value",Global.String(i))]),List.ofArray([t]));
        };
       },options));
       return Doc.Elem(el1,Attr.Append(selectedItemAttr,Attr.Concat(attrs)),optionElements);
      },
      Static:function(el)
      {
       return Doc.Elem(el,Attr.get_Empty(),Doc.get_Empty());
      },
      SvgElement:function(name,attr,children)
      {
       var attr1,arg20;
       attr1=Attr.Concat(attr);
       arg20=Doc.Concat(children);
       return Doc.Elem(DomUtility.CreateSvgElement(name),attr1,arg20);
      },
      TextNode:function(v)
      {
       return Doc.TextView(View.Const(v));
      },
      TextView:function(txt)
      {
       var node,x;
       node=Docs.CreateTextNode();
       x=View.Map(function(t)
       {
        return Docs.UpdateTextNode(node,t);
       },txt);
       return Doc.Mk({
        $:4,
        $0:node
       },x);
      },
      get_Empty:function()
      {
       return Doc.Mk({
        $:3
       },View.Const(null));
      }
     }),
     DocElemNode:Runtime.Class({
      Equals:function(o)
      {
       return this.ElKey===o.ElKey;
      },
      GetHashCode:function()
      {
       return this.ElKey;
      }
     }),
     Docs:{
      ComputeChangeAnim:function(st,cur)
      {
       var arg00,relevant;
       arg00=function(n)
       {
        return Attrs.HasChangeAnim(n.Attr);
       };
       relevant=function(arg10)
       {
        return NodeSet.Filter(arg00,arg10);
       };
       return An.Concat(Arrays.map(function(n)
       {
        return Attrs.GetChangeAnim(n.Attr);
       },NodeSet.ToArray(NodeSet.Intersect(relevant(st.PreviousNodes),relevant(cur)))));
      },
      ComputeEnterAnim:function(st,cur)
      {
       return An.Concat(Arrays.map(function(n)
       {
        return Attrs.GetEnterAnim(n.Attr);
       },NodeSet.ToArray(NodeSet.Except(st.PreviousNodes,NodeSet.Filter(function(n)
       {
        return Attrs.HasEnterAnim(n.Attr);
       },cur)))));
      },
      ComputeExitAnim:function(st,cur)
      {
       return An.Concat(Arrays.map(function(n)
       {
        return Attrs.GetExitAnim(n.Attr);
       },NodeSet.ToArray(NodeSet.Except(cur,NodeSet.Filter(function(n)
       {
        return Attrs.HasExitAnim(n.Attr);
       },st.PreviousNodes)))));
      },
      CreateDelimitedElemNode:function(ldelim,rdelim,attr,children)
      {
       var el;
       el=ldelim.parentNode;
       Docs.LinkPrevElement(rdelim,children);
       return Runtime.New(DocElemNode,{
        Attr:Attrs.Insert(el,attr),
        Children:children,
        Delimiters:[ldelim,rdelim],
        El:el,
        ElKey:Fresh.Int()
       });
      },
      CreateDelimitedRunState:function(ldelim,rdelim,doc)
      {
       return{
        PreviousNodes:NodeSet.get_Empty(),
        Top:Docs.CreateDelimitedElemNode(ldelim,rdelim,Attr.get_Empty(),doc)
       };
      },
      CreateElemNode:function(el,attr,children)
      {
       Docs.LinkElement(el,children);
       return Runtime.New(DocElemNode,{
        Attr:Attrs.Insert(el,attr),
        Children:children,
        El:el,
        ElKey:Fresh.Int()
       });
      },
      CreateEmbedNode:function()
      {
       return{
        Current:{
         $:3
        },
        Dirty:false
       };
      },
      CreateRunState:function(parent,doc)
      {
       return{
        PreviousNodes:NodeSet.get_Empty(),
        Top:Docs.CreateElemNode(parent,Attr.get_Empty(),doc)
       };
      },
      CreateTextNode:function()
      {
       return{
        Text:DomUtility.CreateText(""),
        Dirty:false,
        Value:""
       };
      },
      DoSyncElement:function(el)
      {
       var parent,ins,parent1,matchValue;
       parent=el.El;
       ins=function(doc,pos)
       {
        var d;
        if(doc.$==1)
         {
          return{
           $:1,
           $0:doc.$0.El
          };
         }
        else
         {
          if(doc.$==2)
           {
            d=doc.$0;
            if(d.Dirty)
             {
              d.Dirty=false;
              return Docs.InsertDoc(parent,d.Current,pos);
             }
            else
             {
              return ins(d.Current,pos);
             }
           }
          else
           {
            return doc.$==3?pos:doc.$==4?{
             $:1,
             $0:doc.$0.Text
            }:ins(doc.$0,ins(doc.$1,pos));
           }
         }
       };
       parent1=el.El;
       DomNodes.Iter(function(el1)
       {
        return DomUtility.RemoveNode(parent1,el1);
       },DomNodes.Except(DomNodes.DocChildren(el),DomNodes.Children(el.El,Runtime.GetOptional(el.Delimiters))));
       matchValue=Runtime.GetOptional(el.Delimiters);
       ins(el.Children,matchValue.$==1?{
        $:1,
        $0:matchValue.$0[1]
       }:{
        $:0
       });
       return;
      },
      DomNodes:Runtime.Class({},{
       Children:function(elem,delims)
       {
        var rdelim,ldelim,a,n,objectArg;
        if(delims.$==1)
         {
          rdelim=delims.$0[1];
          ldelim=delims.$0[0];
          a=Array.prototype.constructor.apply(Array,[]);
          n=ldelim.nextSibling;
          while(n!==rdelim)
           {
            a.push(n);
            n=n.nextSibling;
           }
          return Runtime.New(DomNodes,{
           $:0,
           $0:a
          });
         }
        else
         {
          objectArg=elem.childNodes;
          return Runtime.New(DomNodes,{
           $:0,
           $0:Arrays.init(elem.childNodes.length,function(arg00)
           {
            return objectArg[arg00];
           })
          });
         }
       },
       DocChildren:function(node)
       {
        var q,loop;
        q=[];
        loop=function(doc)
        {
         var b;
         if(doc.$==2)
          {
           return loop(doc.$0.Current);
          }
         else
          {
           if(doc.$==1)
            {
             return JQueue.Add(doc.$0.El,q);
            }
           else
            {
             if(doc.$==3)
              {
               return null;
              }
             else
              {
               if(doc.$==4)
                {
                 return JQueue.Add(doc.$0.Text,q);
                }
               else
                {
                 b=doc.$1;
                 loop(doc.$0);
                 return loop(b);
                }
              }
            }
          }
        };
        loop(node.Children);
        return Runtime.New(DomNodes,{
         $:0,
         $0:JQueue.ToArray(q)
        });
       },
       Except:function(_arg2,_arg1)
       {
        var excluded;
        excluded=_arg2.$0;
        return Runtime.New(DomNodes,{
         $:0,
         $0:Arrays.filter(function(n)
         {
          return Seq.forall(function(k)
          {
           return!(n===k);
          },excluded);
         },_arg1.$0)
        });
       },
       FoldBack:function(f,_arg4,z)
       {
        return Arrays.foldBack(f,_arg4.$0,z);
       },
       Iter:function(f,_arg3)
       {
        return Arrays.iter(f,_arg3.$0);
       }
      }),
      InsertDoc:function(parent,doc,pos)
      {
       var d;
       if(doc.$==1)
        {
         return Docs.InsertNode(parent,doc.$0.El,pos);
        }
       else
        {
         if(doc.$==2)
          {
           d=doc.$0;
           d.Dirty=false;
           return Docs.InsertDoc(parent,d.Current,pos);
          }
         else
          {
           return doc.$==3?pos:doc.$==4?Docs.InsertNode(parent,doc.$0.Text,pos):Docs.InsertDoc(parent,doc.$0,Docs.InsertDoc(parent,doc.$1,pos));
          }
        }
      },
      InsertNode:function(parent,node,pos)
      {
       DomUtility.InsertAt(parent,pos,node);
       return{
        $:1,
        $0:node
       };
      },
      LinkElement:function(el,children)
      {
       Docs.InsertDoc(el,children,{
        $:0
       });
      },
      LinkPrevElement:function(el,children)
      {
       Docs.InsertDoc(el.parentNode,children,{
        $:1,
        $0:el
       });
      },
      NodeSet:Runtime.Class({},{
       Except:function(_arg3,_arg2)
       {
        return Runtime.New(NodeSet,{
         $:0,
         $0:HashSet.Except(_arg3.$0,_arg2.$0)
        });
       },
       Filter:function(f,_arg1)
       {
        return Runtime.New(NodeSet,{
         $:0,
         $0:HashSet.Filter(f,_arg1.$0)
        });
       },
       FindAll:function(doc)
       {
        var q,loop;
        q=[];
        loop=function(node)
        {
         var b,el;
         if(node.$==0)
          {
           b=node.$1;
           loop(node.$0);
           return loop(b);
          }
         else
          {
           if(node.$==1)
            {
             el=node.$0;
             JQueue.Add(el,q);
             return loop(el.Children);
            }
           else
            {
             return node.$==2?loop(node.$0.Current):null;
            }
          }
        };
        loop(doc);
        return Runtime.New(NodeSet,{
         $:0,
         $0:HashSetProxy.New(JQueue.ToArray(q))
        });
       },
       Intersect:function(_arg5,_arg4)
       {
        return Runtime.New(NodeSet,{
         $:0,
         $0:HashSet.Intersect(_arg5.$0,_arg4.$0)
        });
       },
       IsEmpty:function(_arg6)
       {
        return _arg6.$0.get_Count()===0;
       },
       ToArray:function(_arg7)
       {
        return HashSet.ToArray(_arg7.$0);
       },
       get_Empty:function()
       {
        return Runtime.New(NodeSet,{
         $:0,
         $0:HashSetProxy.New11()
        });
       }
      }),
      PerformAnimatedUpdate:function(st,doc)
      {
       return Concurrency.Delay(function()
       {
        var cur,change,enter;
        cur=NodeSet.FindAll(doc);
        change=Docs.ComputeChangeAnim(st,cur);
        enter=Docs.ComputeEnterAnim(st,cur);
        return Concurrency.Bind(An.Play(An.Append(change,Docs.ComputeExitAnim(st,cur))),function()
        {
         Docs.SyncElemNode(st.Top);
         return Concurrency.Bind(An.Play(enter),function()
         {
          return Concurrency.Return(void(st.PreviousNodes=cur));
         });
        });
       });
      },
      Sync:function(doc)
      {
       var sync;
       sync=function(doc1)
       {
        var el,d,b;
        if(doc1.$==1)
         {
          el=doc1.$0;
          Docs.SyncElement(el);
          return sync(el.Children);
         }
        else
         {
          if(doc1.$==2)
           {
            return sync(doc1.$0.Current);
           }
          else
           {
            if(doc1.$==3)
             {
              return null;
             }
            else
             {
              if(doc1.$==4)
               {
                d=doc1.$0;
                if(d.Dirty)
                 {
                  d.Text.nodeValue=d.Value;
                  d.Dirty=false;
                  return;
                 }
                else
                 {
                  return null;
                 }
               }
              else
               {
                b=doc1.$1;
                sync(doc1.$0);
                return sync(b);
               }
             }
           }
         }
       };
       return sync(doc);
      },
      SyncElemNode:function(el)
      {
       Docs.SyncElement(el);
       return Docs.Sync(el.Children);
      },
      SyncElement:function(el)
      {
       var dirty;
       Attrs.Sync(el.El,el.Attr);
       dirty=function(doc)
       {
        var b,d;
        if(doc.$==0)
         {
          b=doc.$1;
          return dirty(doc.$0)?true:dirty(b);
         }
        else
         {
          if(doc.$==2)
           {
            d=doc.$0;
            return d.Dirty?true:dirty(d.Current);
           }
          else
           {
            return false;
           }
         }
       };
       return dirty(el.Children)?Docs.DoSyncElement(el):null;
      },
      UpdateEmbedNode:function(node,upd)
      {
       node.Current=upd;
       node.Dirty=true;
       return;
      },
      UpdateTextNode:function(n,t)
      {
       n.Value=t;
       n.Dirty=true;
       return;
      }
     },
     DomUtility:{
      AddClass:function(element,cl)
      {
       jQuery(element).addClass(cl);
      },
      AppendTo:function(ctx,node)
      {
       ctx.appendChild(node);
      },
      Clear:function(ctx)
      {
       while(ctx.hasChildNodes())
        {
         ctx.removeChild(ctx.firstChild);
        }
       return;
      },
      ClearAttrs:function(ctx)
      {
       while(ctx.hasAttributes())
        {
         ctx.removeAttributeNode(ctx.attributes.item(0));
        }
       return;
      },
      CreateAttr:function(name,value)
      {
       var a;
       a=DomUtility.Doc().createAttribute(name);
       a.value=value;
       return a;
      },
      CreateElement:function(name)
      {
       return DomUtility.Doc().createElement(name);
      },
      CreateSvgElement:function(name)
      {
       return DomUtility.Doc().createElementNS("http://www.w3.org/2000/svg",name);
      },
      CreateText:function(s)
      {
       return DomUtility.Doc().createTextNode(s);
      },
      Doc:Runtime.Field(function()
      {
       return document;
      }),
      InsertAt:function(parent,pos,node)
      {
       var _,matchValue,matchValue1;
       if(node.parentNode===parent)
        {
         matchValue=node.nextSibling;
         matchValue1=[pos,Unchecked.Equals(matchValue,null)?{
          $:0
         }:{
          $:1,
          $0:matchValue
         }];
         _=matchValue1[0].$==1?matchValue1[1].$==1?matchValue1[0].$0===matchValue1[1].$0:false:matchValue1[1].$==0?true:false;
        }
       else
        {
         _=false;
        }
       return!_?pos.$==1?void parent.insertBefore(node,pos.$0):void parent.appendChild(node):null;
      },
      RemoveAttr:function(el,attrName)
      {
       return el.removeAttribute(attrName);
      },
      RemoveClass:function(element,cl)
      {
       jQuery(element).removeClass(cl);
      },
      RemoveNode:function(parent,el)
      {
       return el.parentNode===parent?void parent.removeChild(el):null;
      },
      SetAttr:function(el,name,value)
      {
       return el.setAttribute(name,value);
      },
      SetProperty:function($target,$name,$value)
      {
       var $0=this,$this=this;
       return $target.setProperty($name,$value);
      },
      SetStyle:function(el,name,value)
      {
       return DomUtility.SetProperty(el.style,name,value);
      }
     },
     DoubleInterpolation:Runtime.Class({
      Interpolate:function(t,x,y)
      {
       return x+t*(y-x);
      }
     }),
     DynamicAttrNode:Runtime.Class({
      GetChangeAnim:function()
      {
       return An.get_Empty();
      },
      GetEnterAnim:function()
      {
       return An.get_Empty();
      },
      GetExitAnim:function()
      {
       return An.get_Empty();
      },
      Sync:function(parent)
      {
       if(this.dirty)
        {
         (this.push.call(null,parent))(this.value);
         this.dirty=false;
         return;
        }
       else
        {
         return null;
        }
      },
      get_Changed:function()
      {
       return this.updates;
      }
     },{
      New:function(view,push)
      {
       var r;
       r=Runtime.New(this,{});
       r.push=push;
       r.value=Abbrev.U();
       r.dirty=true;
       r.updates=View.Map(function(x)
       {
        r.value=x;
        r.dirty=true;
        return;
       },view);
       return r;
      }
     }),
     Easing:Runtime.Class({},{
      Custom:function(f)
      {
       return Runtime.New(Easing,{
        TransformTime:f
       });
      },
      get_CubicInOut:function()
      {
       return Easings.CubicInOut();
      }
     }),
     Easings:{
      CubicInOut:Runtime.Field(function()
      {
       return Runtime.New(Easing,{
        TransformTime:function(t)
        {
         var t2;
         t2=t*t;
         return 3*t2-2*(t2*t);
        }
       });
      })
     },
     Flow:Runtime.Class({},{
      Bind:function(m,k)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          return(m.Render.call(null,_var))(function(r)
          {
           return(k(r).Render.call(null,_var))(cont);
          });
         };
        }
       };
      },
      Define:function(f)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          return Var.Set(_var,f(cont));
         };
        }
       };
      },
      Embed:function(fl)
      {
       var _var;
       _var=Var.Create(Doc.get_Empty());
       (fl.Render.call(null,_var))(function()
       {
       });
       return Doc.EmbedView(_var.get_View());
      },
      Map:function(f,x)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          return(x.Render.call(null,_var))(function(r)
          {
           return cont(f(r));
          });
         };
        }
       };
      },
      Return:function(x)
      {
       return{
        Render:function()
        {
         return function(cont)
         {
          return cont(x);
         };
        }
       };
      },
      get_Do:function()
      {
       return FlowBuilder.New();
      }
     }),
     Flow1:Runtime.Class({},{
      Static:function(doc)
      {
       return{
        Render:function(_var)
        {
         return function(cont)
         {
          Var.Set(_var,doc);
          return cont(null);
         };
        }
       };
      }
     }),
     FlowBuilder:Runtime.Class({
      Bind:function(comp,func)
      {
       return Flow.Bind(comp,func);
      },
      Return:function(value)
      {
       return Flow.Return(value);
      },
      ReturnFrom:function(inner)
      {
       return inner;
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     Html:{
      A:function(ats,ch)
      {
       return Doc.Element("a",ats,ch);
      },
      A0:function(ch)
      {
       return Doc.Element("a",Runtime.New(T,{
        $:0
       }),ch);
      },
      Abbr:function(ats,ch)
      {
       return Doc.Element("abbr",ats,ch);
      },
      Abbr0:function(ch)
      {
       return Doc.Element("abbr",Runtime.New(T,{
        $:0
       }),ch);
      },
      Accept:Runtime.Field(function()
      {
       return"accept";
      }),
      AcceptCharSet:Runtime.Field(function()
      {
       return"accept-charset";
      }),
      AccessKey:Runtime.Field(function()
      {
       return"accesskey";
      }),
      Address:function(ats,ch)
      {
       return Doc.Element("address",ats,ch);
      },
      Address0:function(ch)
      {
       return Doc.Element("address",Runtime.New(T,{
        $:0
       }),ch);
      },
      Align:Runtime.Field(function()
      {
       return"align";
      }),
      Alt:Runtime.Field(function()
      {
       return"alt";
      }),
      AltCode:Runtime.Field(function()
      {
       return"altcode";
      }),
      Archive:Runtime.Field(function()
      {
       return"archive";
      }),
      Area:function(ats,ch)
      {
       return Doc.Element("area",ats,ch);
      },
      Area0:function(ch)
      {
       return Doc.Element("area",Runtime.New(T,{
        $:0
       }),ch);
      },
      Article:function(ats,ch)
      {
       return Doc.Element("article",ats,ch);
      },
      Article0:function(ch)
      {
       return Doc.Element("article",Runtime.New(T,{
        $:0
       }),ch);
      },
      Aside:function(ats,ch)
      {
       return Doc.Element("aside",ats,ch);
      },
      Aside0:function(ch)
      {
       return Doc.Element("aside",Runtime.New(T,{
        $:0
       }),ch);
      },
      Attributes:{
       Action:Runtime.Field(function()
       {
        return"action";
       }),
       Alink:Runtime.Field(function()
       {
        return"alink";
       }),
       Async:Runtime.Field(function()
       {
        return"async";
       }),
       Background:Runtime.Field(function()
       {
        return"background";
       }),
       BgColor:Runtime.Field(function()
       {
        return"bgcolor";
       }),
       Cite:Runtime.Field(function()
       {
        return"cite";
       }),
       Clear:Runtime.Field(function()
       {
        return"clear";
       }),
       Code:Runtime.Field(function()
       {
        return"code";
       }),
       Color:Runtime.Field(function()
       {
        return"color";
       }),
       Compact:Runtime.Field(function()
       {
        return"compact";
       }),
       Content:Runtime.Field(function()
       {
        return"content";
       }),
       Controls:Runtime.Field(function()
       {
        return"controls";
       }),
       Data:Runtime.Field(function()
       {
        return"data";
       }),
       DateTime:Runtime.Field(function()
       {
        return"datetime";
       }),
       Dir:Runtime.Field(function()
       {
        return"dir";
       }),
       Face:Runtime.Field(function()
       {
        return"face";
       }),
       Form:Runtime.Field(function()
       {
        return"form";
       }),
       Frame:Runtime.Field(function()
       {
        return"frame";
       }),
       HSpace:Runtime.Field(function()
       {
        return"hspace";
       }),
       KeyType:Runtime.Field(function()
       {
        return"keytype";
       }),
       Kind:Runtime.Field(function()
       {
        return"kind";
       }),
       Label:Runtime.Field(function()
       {
        return"label";
       }),
       Language:Runtime.Field(function()
       {
        return"language";
       }),
       Link:Runtime.Field(function()
       {
        return"link";
       }),
       List:Runtime.Field(function()
       {
        return"list";
       }),
       Max:Runtime.Field(function()
       {
        return"max";
       }),
       Min:Runtime.Field(function()
       {
        return"min";
       }),
       NoShade:Runtime.Field(function()
       {
        return"noshade";
       }),
       NoWrap:Runtime.Field(function()
       {
        return"nowrap";
       }),
       Object:Runtime.Field(function()
       {
        return"object";
       }),
       Open:Runtime.Field(function()
       {
        return"open";
       }),
       Optimum:Runtime.Field(function()
       {
        return"optimum";
       }),
       Prompt:Runtime.Field(function()
       {
        return"prompt";
       }),
       Span:Runtime.Field(function()
       {
        return"span";
       }),
       Start:Runtime.Field(function()
       {
        return"start";
       }),
       Summary:Runtime.Field(function()
       {
        return"summary";
       }),
       Text:Runtime.Field(function()
       {
        return"text";
       }),
       VLink:Runtime.Field(function()
       {
        return"vlink";
       }),
       VSpace:Runtime.Field(function()
       {
        return"vspace";
       }),
       Version:Runtime.Field(function()
       {
        return"version";
       })
      },
      Audio:function(ats,ch)
      {
       return Doc.Element("audio",ats,ch);
      },
      Audio0:function(ch)
      {
       return Doc.Element("audio",Runtime.New(T,{
        $:0
       }),ch);
      },
      AutoComplete:Runtime.Field(function()
      {
       return"autocomplete";
      }),
      AutoFocus:Runtime.Field(function()
      {
       return"autofocus";
      }),
      AutoPlay:Runtime.Field(function()
      {
       return"autoplay";
      }),
      AutoSave:Runtime.Field(function()
      {
       return"autosave";
      }),
      Axis:Runtime.Field(function()
      {
       return"axis";
      }),
      B:function(ats,ch)
      {
       return Doc.Element("b",ats,ch);
      },
      B0:function(ch)
      {
       return Doc.Element("b",Runtime.New(T,{
        $:0
       }),ch);
      },
      BDI:function(ats,ch)
      {
       return Doc.Element("bdi",ats,ch);
      },
      BDI0:function(ch)
      {
       return Doc.Element("bdi",Runtime.New(T,{
        $:0
       }),ch);
      },
      BDO:function(ats,ch)
      {
       return Doc.Element("bdo",ats,ch);
      },
      BDO0:function(ch)
      {
       return Doc.Element("bdo",Runtime.New(T,{
        $:0
       }),ch);
      },
      Base:function(ats,ch)
      {
       return Doc.Element("base",ats,ch);
      },
      Base0:function(ch)
      {
       return Doc.Element("base",Runtime.New(T,{
        $:0
       }),ch);
      },
      BlockQuote:function(ats,ch)
      {
       return Doc.Element("blockquote",ats,ch);
      },
      BlockQuote0:function(ch)
      {
       return Doc.Element("blockquote",Runtime.New(T,{
        $:0
       }),ch);
      },
      Body:function(ats,ch)
      {
       return Doc.Element("body",ats,ch);
      },
      Body0:function(ch)
      {
       return Doc.Element("body",Runtime.New(T,{
        $:0
       }),ch);
      },
      Border:Runtime.Field(function()
      {
       return"border";
      }),
      BorderColor:Runtime.Field(function()
      {
       return"bordercolor";
      }),
      Br:function(ats,ch)
      {
       return Doc.Element("br",ats,ch);
      },
      Br0:function(ch)
      {
       return Doc.Element("br",Runtime.New(T,{
        $:0
       }),ch);
      },
      Buffered:Runtime.Field(function()
      {
       return"buffered";
      }),
      Button:function(ats,ch)
      {
       return Doc.Element("button",ats,ch);
      },
      Button0:function(ch)
      {
       return Doc.Element("button",Runtime.New(T,{
        $:0
       }),ch);
      },
      Canvas:function(ats,ch)
      {
       return Doc.Element("canvas",ats,ch);
      },
      Canvas0:function(ch)
      {
       return Doc.Element("canvas",Runtime.New(T,{
        $:0
       }),ch);
      },
      Caption:function(ats,ch)
      {
       return Doc.Element("caption",ats,ch);
      },
      Caption0:function(ch)
      {
       return Doc.Element("caption",Runtime.New(T,{
        $:0
       }),ch);
      },
      CellPadding:Runtime.Field(function()
      {
       return"cellpadding";
      }),
      CellSpacing:Runtime.Field(function()
      {
       return"cellspacing";
      }),
      Challenge:Runtime.Field(function()
      {
       return"challenge";
      }),
      Char:Runtime.Field(function()
      {
       return"char";
      }),
      CharOff:Runtime.Field(function()
      {
       return"charoff";
      }),
      CharSet:Runtime.Field(function()
      {
       return"charset";
      }),
      Checked:Runtime.Field(function()
      {
       return"checked";
      }),
      Cite:function(ats,ch)
      {
       return Doc.Element("cite",ats,ch);
      },
      Cite0:function(ch)
      {
       return Doc.Element("cite",Runtime.New(T,{
        $:0
       }),ch);
      },
      Class:Runtime.Field(function()
      {
       return"class";
      }),
      ClassId:Runtime.Field(function()
      {
       return"classid";
      }),
      Code:function(ats,ch)
      {
       return Doc.Element("code",ats,ch);
      },
      Code0:function(ch)
      {
       return Doc.Element("code",Runtime.New(T,{
        $:0
       }),ch);
      },
      CodeBase:Runtime.Field(function()
      {
       return"codebase";
      }),
      CodeType:Runtime.Field(function()
      {
       return"codetype";
      }),
      Col:function(ats,ch)
      {
       return Doc.Element("col",ats,ch);
      },
      Col0:function(ch)
      {
       return Doc.Element("col",Runtime.New(T,{
        $:0
       }),ch);
      },
      ColGroup:function(ats,ch)
      {
       return Doc.Element("colgroup",ats,ch);
      },
      ColGroup0:function(ch)
      {
       return Doc.Element("colgroup",Runtime.New(T,{
        $:0
       }),ch);
      },
      ColSpan:Runtime.Field(function()
      {
       return"colspan";
      }),
      Cols:Runtime.Field(function()
      {
       return"cols";
      }),
      Command:function(ats,ch)
      {
       return Doc.Element("command",ats,ch);
      },
      Command0:function(ch)
      {
       return Doc.Element("command",Runtime.New(T,{
        $:0
       }),ch);
      },
      ContentEditable:Runtime.Field(function()
      {
       return"contenteditable";
      }),
      ContextMenu:Runtime.Field(function()
      {
       return"contextmenu";
      }),
      Coords:Runtime.Field(function()
      {
       return"coords";
      }),
      DD:function(ats,ch)
      {
       return Doc.Element("dd",ats,ch);
      },
      DD0:function(ch)
      {
       return Doc.Element("dd",Runtime.New(T,{
        $:0
       }),ch);
      },
      DL:function(ats,ch)
      {
       return Doc.Element("dl",ats,ch);
      },
      DL0:function(ch)
      {
       return Doc.Element("dl",Runtime.New(T,{
        $:0
       }),ch);
      },
      DT:function(ats,ch)
      {
       return Doc.Element("dt",ats,ch);
      },
      DT0:function(ch)
      {
       return Doc.Element("dt",Runtime.New(T,{
        $:0
       }),ch);
      },
      DataList:function(ats,ch)
      {
       return Doc.Element("datalist",ats,ch);
      },
      DataList0:function(ch)
      {
       return Doc.Element("datalist",Runtime.New(T,{
        $:0
       }),ch);
      },
      Declare:Runtime.Field(function()
      {
       return"declare";
      }),
      Default:Runtime.Field(function()
      {
       return"default";
      }),
      Defer:Runtime.Field(function()
      {
       return"defer";
      }),
      Del:function(ats,ch)
      {
       return Doc.Element("del",ats,ch);
      },
      Del0:function(ch)
      {
       return Doc.Element("del",Runtime.New(T,{
        $:0
       }),ch);
      },
      Details:function(ats,ch)
      {
       return Doc.Element("details",ats,ch);
      },
      Details0:function(ch)
      {
       return Doc.Element("details",Runtime.New(T,{
        $:0
       }),ch);
      },
      Dfn:function(ats,ch)
      {
       return Doc.Element("dfn",ats,ch);
      },
      Dfn0:function(ch)
      {
       return Doc.Element("dfn",Runtime.New(T,{
        $:0
       }),ch);
      },
      Disabled:Runtime.Field(function()
      {
       return"disabled";
      }),
      Div:function(ats,ch)
      {
       return Doc.Element("div",ats,ch);
      },
      Div0:function(ch)
      {
       return Doc.Element("div",Runtime.New(T,{
        $:0
       }),ch);
      },
      Download:Runtime.Field(function()
      {
       return"download";
      }),
      Draggable:Runtime.Field(function()
      {
       return"draggable";
      }),
      DropZone:Runtime.Field(function()
      {
       return"dropzone";
      }),
      Em:function(ats,ch)
      {
       return Doc.Element("em",ats,ch);
      },
      Em0:function(ch)
      {
       return Doc.Element("em",Runtime.New(T,{
        $:0
       }),ch);
      },
      Embed:function(ats,ch)
      {
       return Doc.Element("embed",ats,ch);
      },
      Embed0:function(ch)
      {
       return Doc.Element("embed",Runtime.New(T,{
        $:0
       }),ch);
      },
      EncType:Runtime.Field(function()
      {
       return"enctype";
      }),
      FieldSet:function(ats,ch)
      {
       return Doc.Element("fieldset",ats,ch);
      },
      FieldSet0:function(ch)
      {
       return Doc.Element("fieldset",Runtime.New(T,{
        $:0
       }),ch);
      },
      FigCaption:function(ats,ch)
      {
       return Doc.Element("figcaption",ats,ch);
      },
      FigCaption0:function(ch)
      {
       return Doc.Element("figcaption",Runtime.New(T,{
        $:0
       }),ch);
      },
      Figure:function(ats,ch)
      {
       return Doc.Element("figure",ats,ch);
      },
      Figure0:function(ch)
      {
       return Doc.Element("figure",Runtime.New(T,{
        $:0
       }),ch);
      },
      Footer:function(ats,ch)
      {
       return Doc.Element("footer",ats,ch);
      },
      Footer0:function(ch)
      {
       return Doc.Element("footer",Runtime.New(T,{
        $:0
       }),ch);
      },
      For:Runtime.Field(function()
      {
       return"for";
      }),
      Form:function(ats,ch)
      {
       return Doc.Element("form",ats,ch);
      },
      Form0:function(ch)
      {
       return Doc.Element("form",Runtime.New(T,{
        $:0
       }),ch);
      },
      FormAction:Runtime.Field(function()
      {
       return"formaction";
      }),
      FormEncType:Runtime.Field(function()
      {
       return"formenctype";
      }),
      FormMethod:Runtime.Field(function()
      {
       return"formmethod";
      }),
      FormNoValidate:Runtime.Field(function()
      {
       return"formnovalidate";
      }),
      FormTarget:Runtime.Field(function()
      {
       return"formtarget";
      }),
      FrameBorder:Runtime.Field(function()
      {
       return"frameborder";
      }),
      H1:function(ats,ch)
      {
       return Doc.Element("h1",ats,ch);
      },
      H10:function(ch)
      {
       return Doc.Element("h1",Runtime.New(T,{
        $:0
       }),ch);
      },
      H2:function(ats,ch)
      {
       return Doc.Element("h2",ats,ch);
      },
      H20:function(ch)
      {
       return Doc.Element("h2",Runtime.New(T,{
        $:0
       }),ch);
      },
      H3:function(ats,ch)
      {
       return Doc.Element("h3",ats,ch);
      },
      H30:function(ch)
      {
       return Doc.Element("h3",Runtime.New(T,{
        $:0
       }),ch);
      },
      H4:function(ats,ch)
      {
       return Doc.Element("h4",ats,ch);
      },
      H40:function(ch)
      {
       return Doc.Element("h4",Runtime.New(T,{
        $:0
       }),ch);
      },
      H5:function(ats,ch)
      {
       return Doc.Element("h5",ats,ch);
      },
      H50:function(ch)
      {
       return Doc.Element("h5",Runtime.New(T,{
        $:0
       }),ch);
      },
      H6:function(ats,ch)
      {
       return Doc.Element("h6",ats,ch);
      },
      H60:function(ch)
      {
       return Doc.Element("h6",Runtime.New(T,{
        $:0
       }),ch);
      },
      HGroup:function(ats,ch)
      {
       return Doc.Element("hgroup",ats,ch);
      },
      HGroup0:function(ch)
      {
       return Doc.Element("hgroup",Runtime.New(T,{
        $:0
       }),ch);
      },
      HR:function(ats,ch)
      {
       return Doc.Element("hr",ats,ch);
      },
      HR0:function(ch)
      {
       return Doc.Element("hr",Runtime.New(T,{
        $:0
       }),ch);
      },
      HRef:Runtime.Field(function()
      {
       return"href";
      }),
      HRefLang:Runtime.Field(function()
      {
       return"hreflang";
      }),
      HTML:function(ats,ch)
      {
       return Doc.Element("html",ats,ch);
      },
      HTML0:function(ch)
      {
       return Doc.Element("html",Runtime.New(T,{
        $:0
       }),ch);
      },
      Head:function(ats,ch)
      {
       return Doc.Element("head",ats,ch);
      },
      Head0:function(ch)
      {
       return Doc.Element("head",Runtime.New(T,{
        $:0
       }),ch);
      },
      Header:function(ats,ch)
      {
       return Doc.Element("header",ats,ch);
      },
      Header0:function(ch)
      {
       return Doc.Element("header",Runtime.New(T,{
        $:0
       }),ch);
      },
      Headers:Runtime.Field(function()
      {
       return"headers";
      }),
      Height:Runtime.Field(function()
      {
       return"height";
      }),
      Hidden:Runtime.Field(function()
      {
       return"hidden";
      }),
      High:Runtime.Field(function()
      {
       return"high";
      }),
      HttpEquiv:Runtime.Field(function()
      {
       return"http";
      }),
      I:function(ats,ch)
      {
       return Doc.Element("i",ats,ch);
      },
      I0:function(ch)
      {
       return Doc.Element("i",Runtime.New(T,{
        $:0
       }),ch);
      },
      IFrame:function(ats,ch)
      {
       return Doc.Element("iframe",ats,ch);
      },
      IFrame0:function(ch)
      {
       return Doc.Element("iframe",Runtime.New(T,{
        $:0
       }),ch);
      },
      Icon:Runtime.Field(function()
      {
       return"icon";
      }),
      Id:Runtime.Field(function()
      {
       return"id";
      }),
      Img:function(ats,ch)
      {
       return Doc.Element("img",ats,ch);
      },
      Img0:function(ch)
      {
       return Doc.Element("img",Runtime.New(T,{
        $:0
       }),ch);
      },
      Input:function(ats,ch)
      {
       return Doc.Element("input",ats,ch);
      },
      Input0:function(ch)
      {
       return Doc.Element("input",Runtime.New(T,{
        $:0
       }),ch);
      },
      Ins:function(ats,ch)
      {
       return Doc.Element("ins",ats,ch);
      },
      Ins0:function(ch)
      {
       return Doc.Element("ins",Runtime.New(T,{
        $:0
       }),ch);
      },
      IsMap:Runtime.Field(function()
      {
       return"ismap";
      }),
      ItemProp:Runtime.Field(function()
      {
       return"itemprop";
      }),
      Kbd:function(ats,ch)
      {
       return Doc.Element("kbd",ats,ch);
      },
      Kbd0:function(ch)
      {
       return Doc.Element("kbd",Runtime.New(T,{
        $:0
       }),ch);
      },
      KeyGen:function(ats,ch)
      {
       return Doc.Element("keygen",ats,ch);
      },
      KeyGen0:function(ch)
      {
       return Doc.Element("keygen",Runtime.New(T,{
        $:0
       }),ch);
      },
      LI:function(ats,ch)
      {
       return Doc.Element("li",ats,ch);
      },
      LI0:function(ch)
      {
       return Doc.Element("li",Runtime.New(T,{
        $:0
       }),ch);
      },
      Label:function(ats,ch)
      {
       return Doc.Element("label",ats,ch);
      },
      Label0:function(ch)
      {
       return Doc.Element("label",Runtime.New(T,{
        $:0
       }),ch);
      },
      Lang:Runtime.Field(function()
      {
       return"lang";
      }),
      Legend:function(ats,ch)
      {
       return Doc.Element("legend",ats,ch);
      },
      Legend0:function(ch)
      {
       return Doc.Element("legend",Runtime.New(T,{
        $:0
       }),ch);
      },
      Link:function(ats,ch)
      {
       return Doc.Element("link",ats,ch);
      },
      Link0:function(ch)
      {
       return Doc.Element("link",Runtime.New(T,{
        $:0
       }),ch);
      },
      LongDesc:Runtime.Field(function()
      {
       return"longdesc";
      }),
      Loop:Runtime.Field(function()
      {
       return"loop";
      }),
      Low:Runtime.Field(function()
      {
       return"low";
      }),
      Manifest:Runtime.Field(function()
      {
       return"manifest";
      }),
      MarginHeight:Runtime.Field(function()
      {
       return"marginheight";
      }),
      MarginWidth:Runtime.Field(function()
      {
       return"marginwidth";
      }),
      Mark:function(ats,ch)
      {
       return Doc.Element("mark",ats,ch);
      },
      Mark0:function(ch)
      {
       return Doc.Element("mark",Runtime.New(T,{
        $:0
       }),ch);
      },
      MaxLength:Runtime.Field(function()
      {
       return"maxlength";
      }),
      Media:Runtime.Field(function()
      {
       return"media";
      }),
      Meta:function(ats,ch)
      {
       return Doc.Element("meta",ats,ch);
      },
      Meta0:function(ch)
      {
       return Doc.Element("meta",Runtime.New(T,{
        $:0
       }),ch);
      },
      Meter:function(ats,ch)
      {
       return Doc.Element("meter",ats,ch);
      },
      Meter0:function(ch)
      {
       return Doc.Element("meter",Runtime.New(T,{
        $:0
       }),ch);
      },
      Method:Runtime.Field(function()
      {
       return"method";
      }),
      Multiple:Runtime.Field(function()
      {
       return"multiple";
      }),
      Name:Runtime.Field(function()
      {
       return"name";
      }),
      Nav:function(ats,ch)
      {
       return Doc.Element("nav",ats,ch);
      },
      Nav0:function(ch)
      {
       return Doc.Element("nav",Runtime.New(T,{
        $:0
       }),ch);
      },
      NoFrames:function(ats,ch)
      {
       return Doc.Element("noframes",ats,ch);
      },
      NoFrames0:function(ch)
      {
       return Doc.Element("noframes",Runtime.New(T,{
        $:0
       }),ch);
      },
      NoHRef:Runtime.Field(function()
      {
       return"nohref";
      }),
      NoResize:Runtime.Field(function()
      {
       return"noresize";
      }),
      NoScript:function(ats,ch)
      {
       return Doc.Element("noscript",ats,ch);
      },
      NoScript0:function(ch)
      {
       return Doc.Element("noscript",Runtime.New(T,{
        $:0
       }),ch);
      },
      NoValidate:Runtime.Field(function()
      {
       return"novalidate";
      }),
      OL:function(ats,ch)
      {
       return Doc.Element("ol",ats,ch);
      },
      OL0:function(ch)
      {
       return Doc.Element("ol",Runtime.New(T,{
        $:0
       }),ch);
      },
      OptGroup:function(ats,ch)
      {
       return Doc.Element("optgroup",ats,ch);
      },
      OptGroup0:function(ch)
      {
       return Doc.Element("optgroup",Runtime.New(T,{
        $:0
       }),ch);
      },
      Output:function(ats,ch)
      {
       return Doc.Element("output",ats,ch);
      },
      Output0:function(ch)
      {
       return Doc.Element("output",Runtime.New(T,{
        $:0
       }),ch);
      },
      P:function(ats,ch)
      {
       return Doc.Element("p",ats,ch);
      },
      P0:function(ch)
      {
       return Doc.Element("p",Runtime.New(T,{
        $:0
       }),ch);
      },
      Param:function(ats,ch)
      {
       return Doc.Element("param",ats,ch);
      },
      Param0:function(ch)
      {
       return Doc.Element("param",Runtime.New(T,{
        $:0
       }),ch);
      },
      Pattern:Runtime.Field(function()
      {
       return"pattern";
      }),
      Picture:function(ats,ch)
      {
       return Doc.Element("picture",ats,ch);
      },
      Picture0:function(ch)
      {
       return Doc.Element("picture",Runtime.New(T,{
        $:0
       }),ch);
      },
      Ping:Runtime.Field(function()
      {
       return"ping";
      }),
      PlaceHolder:Runtime.Field(function()
      {
       return"placeholder";
      }),
      Poster:Runtime.Field(function()
      {
       return"poster";
      }),
      Pre:function(ats,ch)
      {
       return Doc.Element("pre",ats,ch);
      },
      Pre0:function(ch)
      {
       return Doc.Element("pre",Runtime.New(T,{
        $:0
       }),ch);
      },
      Preload:Runtime.Field(function()
      {
       return"preload";
      }),
      Profile:Runtime.Field(function()
      {
       return"profile";
      }),
      Progress:function(ats,ch)
      {
       return Doc.Element("progress",ats,ch);
      },
      Progress0:function(ch)
      {
       return Doc.Element("progress",Runtime.New(T,{
        $:0
       }),ch);
      },
      PubDate:Runtime.Field(function()
      {
       return"pubdate";
      }),
      Q:function(ats,ch)
      {
       return Doc.Element("q",ats,ch);
      },
      Q0:function(ch)
      {
       return Doc.Element("q",Runtime.New(T,{
        $:0
       }),ch);
      },
      RP:function(ats,ch)
      {
       return Doc.Element("rp",ats,ch);
      },
      RP0:function(ch)
      {
       return Doc.Element("rp",Runtime.New(T,{
        $:0
       }),ch);
      },
      RT:function(ats,ch)
      {
       return Doc.Element("rt",ats,ch);
      },
      RT0:function(ch)
      {
       return Doc.Element("rt",Runtime.New(T,{
        $:0
       }),ch);
      },
      RTC:function(ats,ch)
      {
       return Doc.Element("rtc",ats,ch);
      },
      RTC0:function(ch)
      {
       return Doc.Element("rtc",Runtime.New(T,{
        $:0
       }),ch);
      },
      RadioGroup:Runtime.Field(function()
      {
       return"radiogroup";
      }),
      ReadOnly:Runtime.Field(function()
      {
       return"readonly";
      }),
      Rel:Runtime.Field(function()
      {
       return"rel";
      }),
      Required:Runtime.Field(function()
      {
       return"required";
      }),
      Rev:Runtime.Field(function()
      {
       return"rev";
      }),
      Reversed:Runtime.Field(function()
      {
       return"reversed";
      }),
      RowSpan:Runtime.Field(function()
      {
       return"rowspan";
      }),
      Rows:Runtime.Field(function()
      {
       return"rows";
      }),
      Ruby:function(ats,ch)
      {
       return Doc.Element("ruby",ats,ch);
      },
      Ruby0:function(ch)
      {
       return Doc.Element("ruby",Runtime.New(T,{
        $:0
       }),ch);
      },
      Rules:Runtime.Field(function()
      {
       return"rules";
      }),
      Samp:function(ats,ch)
      {
       return Doc.Element("samp",ats,ch);
      },
      Samp0:function(ch)
      {
       return Doc.Element("samp",Runtime.New(T,{
        $:0
       }),ch);
      },
      Sandbox:Runtime.Field(function()
      {
       return"sandbox";
      }),
      Scheme:Runtime.Field(function()
      {
       return"scheme";
      }),
      Scope:Runtime.Field(function()
      {
       return"scope";
      }),
      Scoped:Runtime.Field(function()
      {
       return"scoped";
      }),
      Script:function(ats,ch)
      {
       return Doc.Element("script",ats,ch);
      },
      Script0:function(ch)
      {
       return Doc.Element("script",Runtime.New(T,{
        $:0
       }),ch);
      },
      Scrolling:Runtime.Field(function()
      {
       return"scrolling";
      }),
      Seamless:Runtime.Field(function()
      {
       return"seamless";
      }),
      Section:function(ats,ch)
      {
       return Doc.Element("section",ats,ch);
      },
      Section0:function(ch)
      {
       return Doc.Element("section",Runtime.New(T,{
        $:0
       }),ch);
      },
      Select:function(ats,ch)
      {
       return Doc.Element("select",ats,ch);
      },
      Select0:function(ch)
      {
       return Doc.Element("select",Runtime.New(T,{
        $:0
       }),ch);
      },
      Selected:Runtime.Field(function()
      {
       return"selected";
      }),
      Shadow:function(ats,ch)
      {
       return Doc.Element("shadow",ats,ch);
      },
      Shadow0:function(ch)
      {
       return Doc.Element("shadow",Runtime.New(T,{
        $:0
       }),ch);
      },
      Shape:Runtime.Field(function()
      {
       return"shape";
      }),
      Size:Runtime.Field(function()
      {
       return"size";
      }),
      Sizes:Runtime.Field(function()
      {
       return"sizes";
      }),
      Small:function(ats,ch)
      {
       return Doc.Element("small",ats,ch);
      },
      Small0:function(ch)
      {
       return Doc.Element("small",Runtime.New(T,{
        $:0
       }),ch);
      },
      Source:function(ats,ch)
      {
       return Doc.Element("source",ats,ch);
      },
      Source0:function(ch)
      {
       return Doc.Element("source",Runtime.New(T,{
        $:0
       }),ch);
      },
      Span:function(ats,ch)
      {
       return Doc.Element("span",ats,ch);
      },
      Span0:function(ch)
      {
       return Doc.Element("span",Runtime.New(T,{
        $:0
       }),ch);
      },
      SpellCheck:Runtime.Field(function()
      {
       return"spellcheck";
      }),
      Src:Runtime.Field(function()
      {
       return"src";
      }),
      SrcDoc:Runtime.Field(function()
      {
       return"srcdoc";
      }),
      SrcLang:Runtime.Field(function()
      {
       return"srclang";
      }),
      StandBy:Runtime.Field(function()
      {
       return"standby";
      }),
      Step:Runtime.Field(function()
      {
       return"step";
      }),
      Strong:function(ats,ch)
      {
       return Doc.Element("strong",ats,ch);
      },
      Strong0:function(ch)
      {
       return Doc.Element("strong",Runtime.New(T,{
        $:0
       }),ch);
      },
      Style:Runtime.Field(function()
      {
       return"style";
      }),
      Sub:function(ats,ch)
      {
       return Doc.Element("sub",ats,ch);
      },
      Sub0:function(ch)
      {
       return Doc.Element("sub",Runtime.New(T,{
        $:0
       }),ch);
      },
      Subject:Runtime.Field(function()
      {
       return"subject";
      }),
      Summary:function(ats,ch)
      {
       return Doc.Element("summary",ats,ch);
      },
      Summary0:function(ch)
      {
       return Doc.Element("summary",Runtime.New(T,{
        $:0
       }),ch);
      },
      Sup:function(ats,ch)
      {
       return Doc.Element("sup",ats,ch);
      },
      Sup0:function(ch)
      {
       return Doc.Element("sup",Runtime.New(T,{
        $:0
       }),ch);
      },
      SvgAttributes:{
       AccentHeight:Runtime.Field(function()
       {
        return"accent-height";
       }),
       Accumulate:Runtime.Field(function()
       {
        return"accumulate";
       }),
       Additive:Runtime.Field(function()
       {
        return"additive";
       }),
       AlignmentBaseline:Runtime.Field(function()
       {
        return"alignment-baseline";
       }),
       Ascent:Runtime.Field(function()
       {
        return"ascent";
       }),
       AttributeName:Runtime.Field(function()
       {
        return"attributeName";
       }),
       AttributeType:Runtime.Field(function()
       {
        return"attributeType";
       }),
       Azimuth:Runtime.Field(function()
       {
        return"azimuth";
       }),
       BaseFrequency:Runtime.Field(function()
       {
        return"baseFrequency";
       }),
       BaselineShift:Runtime.Field(function()
       {
        return"baseline-shift";
       }),
       Begin:Runtime.Field(function()
       {
        return"begin";
       }),
       Bias:Runtime.Field(function()
       {
        return"bias";
       }),
       CX:Runtime.Field(function()
       {
        return"cx";
       }),
       CY:Runtime.Field(function()
       {
        return"cy";
       }),
       CalcMode:Runtime.Field(function()
       {
        return"calcMode";
       }),
       Class:Runtime.Field(function()
       {
        return"class";
       }),
       Clip:Runtime.Field(function()
       {
        return"clip";
       }),
       ClipPath:Runtime.Field(function()
       {
        return"clip-path";
       }),
       ClipPathUnits:Runtime.Field(function()
       {
        return"clipPathUnits";
       }),
       ClipRule:Runtime.Field(function()
       {
        return"clip-rule";
       }),
       Color:Runtime.Field(function()
       {
        return"color";
       }),
       ColorInterpolation:Runtime.Field(function()
       {
        return"color-interpolation";
       }),
       ColorInterpolationFilters:Runtime.Field(function()
       {
        return"color-interpolation-filters";
       }),
       ColorProfile:Runtime.Field(function()
       {
        return"color-profile";
       }),
       ColorRendering:Runtime.Field(function()
       {
        return"color-rendering";
       }),
       ContentScriptType:Runtime.Field(function()
       {
        return"contentScriptType";
       }),
       ContentStyleType:Runtime.Field(function()
       {
        return"contentStyleType";
       }),
       Cursor:Runtime.Field(function()
       {
        return"cursor";
       }),
       D:Runtime.Field(function()
       {
        return"d";
       }),
       DX:Runtime.Field(function()
       {
        return"dx";
       }),
       DY:Runtime.Field(function()
       {
        return"dy";
       }),
       DiffuseConstant:Runtime.Field(function()
       {
        return"diffuseConstant";
       }),
       Direction:Runtime.Field(function()
       {
        return"direction";
       }),
       Display:Runtime.Field(function()
       {
        return"display";
       }),
       Divisor:Runtime.Field(function()
       {
        return"divisor";
       }),
       DominantBaseline:Runtime.Field(function()
       {
        return"dominant-baseline";
       }),
       Dur:Runtime.Field(function()
       {
        return"dur";
       }),
       EdgeMode:Runtime.Field(function()
       {
        return"edgeMode";
       }),
       Elevation:Runtime.Field(function()
       {
        return"elevation";
       }),
       End:Runtime.Field(function()
       {
        return"end";
       }),
       ExternalResourcesRequired:Runtime.Field(function()
       {
        return"externalResourcesRequired";
       }),
       Fill:Runtime.Field(function()
       {
        return"fill";
       }),
       FillOpacity:Runtime.Field(function()
       {
        return"fill-opacity";
       }),
       FillRule:Runtime.Field(function()
       {
        return"fill-rule";
       }),
       Filter:Runtime.Field(function()
       {
        return"filter";
       }),
       FilterRes:Runtime.Field(function()
       {
        return"filterRes";
       }),
       FilterUnits:Runtime.Field(function()
       {
        return"filterUnits";
       }),
       FloodColor:Runtime.Field(function()
       {
        return"flood-color";
       }),
       FloodOpacity:Runtime.Field(function()
       {
        return"flood-opacity";
       }),
       FontFamily:Runtime.Field(function()
       {
        return"font-family";
       }),
       FontSize:Runtime.Field(function()
       {
        return"font-size";
       }),
       FontSizeAdjust:Runtime.Field(function()
       {
        return"font-size-adjust";
       }),
       FontStretch:Runtime.Field(function()
       {
        return"font-stretch";
       }),
       FontStyle:Runtime.Field(function()
       {
        return"font-style";
       }),
       FontVariant:Runtime.Field(function()
       {
        return"font-variant";
       }),
       FontWeight:Runtime.Field(function()
       {
        return"font-weight";
       }),
       From:Runtime.Field(function()
       {
        return"from";
       }),
       GradientTransform:Runtime.Field(function()
       {
        return"gradientTransform";
       }),
       GradientUnits:Runtime.Field(function()
       {
        return"gradientUnits";
       }),
       Height:Runtime.Field(function()
       {
        return"height";
       }),
       IN:Runtime.Field(function()
       {
        return"in";
       }),
       ImageRendering:Runtime.Field(function()
       {
        return"image-rendering";
       }),
       In2:Runtime.Field(function()
       {
        return"in2";
       }),
       K1:Runtime.Field(function()
       {
        return"k1";
       }),
       K2:Runtime.Field(function()
       {
        return"k2";
       }),
       K3:Runtime.Field(function()
       {
        return"k3";
       }),
       K4:Runtime.Field(function()
       {
        return"k4";
       }),
       KernelMatrix:Runtime.Field(function()
       {
        return"kernelMatrix";
       }),
       KernelUnitLength:Runtime.Field(function()
       {
        return"kernelUnitLength";
       }),
       Kerning:Runtime.Field(function()
       {
        return"kerning";
       }),
       KeySplines:Runtime.Field(function()
       {
        return"keySplines";
       }),
       KeyTimes:Runtime.Field(function()
       {
        return"keyTimes";
       }),
       LetterSpacing:Runtime.Field(function()
       {
        return"letter-spacing";
       }),
       LightingColor:Runtime.Field(function()
       {
        return"lighting-color";
       }),
       LimitingConeAngle:Runtime.Field(function()
       {
        return"limitingConeAngle";
       }),
       Local:Runtime.Field(function()
       {
        return"local";
       }),
       MarkerEnd:Runtime.Field(function()
       {
        return"marker-end";
       }),
       MarkerHeight:Runtime.Field(function()
       {
        return"markerHeight";
       }),
       MarkerMid:Runtime.Field(function()
       {
        return"marker-mid";
       }),
       MarkerStart:Runtime.Field(function()
       {
        return"marker-start";
       }),
       MarkerUnits:Runtime.Field(function()
       {
        return"markerUnits";
       }),
       MarkerWidth:Runtime.Field(function()
       {
        return"markerWidth";
       }),
       Mask:Runtime.Field(function()
       {
        return"mask";
       }),
       MaskContentUnits:Runtime.Field(function()
       {
        return"maskContentUnits";
       }),
       MaskUnits:Runtime.Field(function()
       {
        return"maskUnits";
       }),
       Max:Runtime.Field(function()
       {
        return"max";
       }),
       Min:Runtime.Field(function()
       {
        return"min";
       }),
       Mode:Runtime.Field(function()
       {
        return"mode";
       }),
       NumOctaves:Runtime.Field(function()
       {
        return"numOctaves";
       }),
       Opacity:Runtime.Field(function()
       {
        return"opacity";
       }),
       Operator:Runtime.Field(function()
       {
        return"operator";
       }),
       Order:Runtime.Field(function()
       {
        return"order";
       }),
       Overflow:Runtime.Field(function()
       {
        return"overflow";
       }),
       PaintOrder:Runtime.Field(function()
       {
        return"paint-order";
       }),
       PathLength:Runtime.Field(function()
       {
        return"pathLength";
       }),
       PatternContentUnits:Runtime.Field(function()
       {
        return"patternContentUnits";
       }),
       PatternTransform:Runtime.Field(function()
       {
        return"patternTransform";
       }),
       PatternUnits:Runtime.Field(function()
       {
        return"patternUnits";
       }),
       PointerEvents:Runtime.Field(function()
       {
        return"pointer-events";
       }),
       Points:Runtime.Field(function()
       {
        return"points";
       }),
       PointsAtX:Runtime.Field(function()
       {
        return"pointsAtX";
       }),
       PointsAtY:Runtime.Field(function()
       {
        return"pointsAtY";
       }),
       PointsAtZ:Runtime.Field(function()
       {
        return"pointsAtZ";
       }),
       PreserveAlpha:Runtime.Field(function()
       {
        return"preserveAlpha";
       }),
       PreserveAspectRatio:Runtime.Field(function()
       {
        return"preserveAspectRatio";
       }),
       PrimitiveUnits:Runtime.Field(function()
       {
        return"primitiveUnits";
       }),
       R:Runtime.Field(function()
       {
        return"r";
       }),
       RX:Runtime.Field(function()
       {
        return"rx";
       }),
       RY:Runtime.Field(function()
       {
        return"ry";
       }),
       Radius:Runtime.Field(function()
       {
        return"radius";
       }),
       RepeatCount:Runtime.Field(function()
       {
        return"repeatCount";
       }),
       RepeatDur:Runtime.Field(function()
       {
        return"repeatDur";
       }),
       RequiredFeatures:Runtime.Field(function()
       {
        return"requiredFeatures";
       }),
       Restart:Runtime.Field(function()
       {
        return"restart";
       }),
       Result:Runtime.Field(function()
       {
        return"result";
       }),
       Scale:Runtime.Field(function()
       {
        return"scale";
       }),
       Seed:Runtime.Field(function()
       {
        return"seed";
       }),
       ShapeRendering:Runtime.Field(function()
       {
        return"shape-rendering";
       }),
       SpecularConstant:Runtime.Field(function()
       {
        return"specularConstant";
       }),
       SpecularExponent:Runtime.Field(function()
       {
        return"specularExponent";
       }),
       StdDeviation:Runtime.Field(function()
       {
        return"stdDeviation";
       }),
       StitchTiles:Runtime.Field(function()
       {
        return"stitchTiles";
       }),
       StopColor:Runtime.Field(function()
       {
        return"stop-color";
       }),
       StopOpacity:Runtime.Field(function()
       {
        return"stop-opacity";
       }),
       Stroke:Runtime.Field(function()
       {
        return"stroke";
       }),
       StrokeDashArray:Runtime.Field(function()
       {
        return"stroke-dasharray";
       }),
       StrokeDashOffset:Runtime.Field(function()
       {
        return"stroke-dashoffset";
       }),
       StrokeLineCap:Runtime.Field(function()
       {
        return"stroke-linecap";
       }),
       StrokeLineJoin:Runtime.Field(function()
       {
        return"stroke-linejoin";
       }),
       StrokeMiterLimit:Runtime.Field(function()
       {
        return"stroke-miterlimit";
       }),
       StrokeOpacity:Runtime.Field(function()
       {
        return"stroke-opacity";
       }),
       StrokeWidth:Runtime.Field(function()
       {
        return"stroke-width";
       }),
       Style:Runtime.Field(function()
       {
        return"style";
       }),
       SurfaceScale:Runtime.Field(function()
       {
        return"surfaceScale";
       }),
       TargetX:Runtime.Field(function()
       {
        return"targetX";
       }),
       TargetY:Runtime.Field(function()
       {
        return"targetY";
       }),
       TextAnchor:Runtime.Field(function()
       {
        return"text-anchor";
       }),
       TextDecoration:Runtime.Field(function()
       {
        return"text-decoration";
       }),
       TextRendering:Runtime.Field(function()
       {
        return"text-rendering";
       }),
       To:Runtime.Field(function()
       {
        return"to";
       }),
       Transform:Runtime.Field(function()
       {
        return"transform";
       }),
       Type:Runtime.Field(function()
       {
        return"type";
       }),
       Values:Runtime.Field(function()
       {
        return"values";
       }),
       ViewBox:Runtime.Field(function()
       {
        return"viewBox";
       }),
       Visibility:Runtime.Field(function()
       {
        return"visibility";
       }),
       Width:Runtime.Field(function()
       {
        return"width";
       }),
       WordSpacing:Runtime.Field(function()
       {
        return"word-spacing";
       }),
       WritingMode:Runtime.Field(function()
       {
        return"writing-mode";
       }),
       X:Runtime.Field(function()
       {
        return"x";
       }),
       X1:Runtime.Field(function()
       {
        return"x1";
       }),
       X2:Runtime.Field(function()
       {
        return"x2";
       }),
       XChannelSelector:Runtime.Field(function()
       {
        return"xChannelSelector";
       }),
       Y:Runtime.Field(function()
       {
        return"y";
       }),
       Y1:Runtime.Field(function()
       {
        return"y1";
       }),
       Y2:Runtime.Field(function()
       {
        return"y2";
       }),
       YChannelSelector:Runtime.Field(function()
       {
        return"yChannelSelector";
       }),
       Z:Runtime.Field(function()
       {
        return"z";
       })
      },
      SvgElements:{
       A:function(ats,ch)
       {
        return Doc.SvgElement("a",ats,ch);
       },
       AltGlyph:function(ats,ch)
       {
        return Doc.SvgElement("altglyph",ats,ch);
       },
       AltGlyphDef:function(ats,ch)
       {
        return Doc.SvgElement("altglyphdef",ats,ch);
       },
       AltGlyphItem:function(ats,ch)
       {
        return Doc.SvgElement("altglyphitem",ats,ch);
       },
       Animate:function(ats,ch)
       {
        return Doc.SvgElement("animate",ats,ch);
       },
       AnimateColor:function(ats,ch)
       {
        return Doc.SvgElement("animatecolor",ats,ch);
       },
       AnimateMotion:function(ats,ch)
       {
        return Doc.SvgElement("animatemotion",ats,ch);
       },
       AnimateTransform:function(ats,ch)
       {
        return Doc.SvgElement("animatetransform",ats,ch);
       },
       Circle:function(ats,ch)
       {
        return Doc.SvgElement("circle",ats,ch);
       },
       ClipPath:function(ats,ch)
       {
        return Doc.SvgElement("clippath",ats,ch);
       },
       ColorProfile:function(ats,ch)
       {
        return Doc.SvgElement("color",ats,ch);
       },
       Cursor:function(ats,ch)
       {
        return Doc.SvgElement("cursor",ats,ch);
       },
       Defs:function(ats,ch)
       {
        return Doc.SvgElement("defs",ats,ch);
       },
       Desc:function(ats,ch)
       {
        return Doc.SvgElement("desc",ats,ch);
       },
       Ellipse:function(ats,ch)
       {
        return Doc.SvgElement("ellipse",ats,ch);
       },
       FeBlend:function(ats,ch)
       {
        return Doc.SvgElement("feblend",ats,ch);
       },
       FeColorMatrix:function(ats,ch)
       {
        return Doc.SvgElement("fecolormatrix",ats,ch);
       },
       FeComponentTransfer:function(ats,ch)
       {
        return Doc.SvgElement("fecomponenttransfer",ats,ch);
       },
       FeComposite:function(ats,ch)
       {
        return Doc.SvgElement("fecomposite",ats,ch);
       },
       FeConvolveMatrix:function(ats,ch)
       {
        return Doc.SvgElement("feconvolvematrix",ats,ch);
       },
       FeDiffuseLighting:function(ats,ch)
       {
        return Doc.SvgElement("fediffuselighting",ats,ch);
       },
       FeDisplacementMap:function(ats,ch)
       {
        return Doc.SvgElement("fedisplacementmap",ats,ch);
       },
       FeDistantLight:function(ats,ch)
       {
        return Doc.SvgElement("fedistantlight",ats,ch);
       },
       FeFlood:function(ats,ch)
       {
        return Doc.SvgElement("feflood",ats,ch);
       },
       FeFuncA:function(ats,ch)
       {
        return Doc.SvgElement("fefunca",ats,ch);
       },
       FeFuncB:function(ats,ch)
       {
        return Doc.SvgElement("fefuncb",ats,ch);
       },
       FeFuncG:function(ats,ch)
       {
        return Doc.SvgElement("fefuncg",ats,ch);
       },
       FeFuncR:function(ats,ch)
       {
        return Doc.SvgElement("fefuncr",ats,ch);
       },
       FeGaussianBlur:function(ats,ch)
       {
        return Doc.SvgElement("fegaussianblur",ats,ch);
       },
       FeImage:function(ats,ch)
       {
        return Doc.SvgElement("feimage",ats,ch);
       },
       FeMerge:function(ats,ch)
       {
        return Doc.SvgElement("femerge",ats,ch);
       },
       FeMergeNode:function(ats,ch)
       {
        return Doc.SvgElement("femergenode",ats,ch);
       },
       FeMorphology:function(ats,ch)
       {
        return Doc.SvgElement("femorphology",ats,ch);
       },
       FeOffset:function(ats,ch)
       {
        return Doc.SvgElement("feoffset",ats,ch);
       },
       FePointLight:function(ats,ch)
       {
        return Doc.SvgElement("fepointlight",ats,ch);
       },
       FeSpecularLighting:function(ats,ch)
       {
        return Doc.SvgElement("fespecularlighting",ats,ch);
       },
       FeSpotLight:function(ats,ch)
       {
        return Doc.SvgElement("fespotlight",ats,ch);
       },
       FeTile:function(ats,ch)
       {
        return Doc.SvgElement("fetile",ats,ch);
       },
       FeTurbulence:function(ats,ch)
       {
        return Doc.SvgElement("feturbulence",ats,ch);
       },
       Filter:function(ats,ch)
       {
        return Doc.SvgElement("filter",ats,ch);
       },
       Font:function(ats,ch)
       {
        return Doc.SvgElement("font",ats,ch);
       },
       FontFace:function(ats,ch)
       {
        return Doc.SvgElement("font",ats,ch);
       },
       FontFaceFormat:function(ats,ch)
       {
        return Doc.SvgElement("font",ats,ch);
       },
       FontFaceName:function(ats,ch)
       {
        return Doc.SvgElement("font",ats,ch);
       },
       FontFaceSrc:function(ats,ch)
       {
        return Doc.SvgElement("font",ats,ch);
       },
       FontFaceUri:function(ats,ch)
       {
        return Doc.SvgElement("font",ats,ch);
       },
       ForeignObject:function(ats,ch)
       {
        return Doc.SvgElement("foreignobject",ats,ch);
       },
       G:function(ats,ch)
       {
        return Doc.SvgElement("g",ats,ch);
       },
       Glyph:function(ats,ch)
       {
        return Doc.SvgElement("glyph",ats,ch);
       },
       GlyphRef:function(ats,ch)
       {
        return Doc.SvgElement("glyphref",ats,ch);
       },
       HKern:function(ats,ch)
       {
        return Doc.SvgElement("hkern",ats,ch);
       },
       Image:function(ats,ch)
       {
        return Doc.SvgElement("image",ats,ch);
       },
       Line:function(ats,ch)
       {
        return Doc.SvgElement("line",ats,ch);
       },
       LinearGradient:function(ats,ch)
       {
        return Doc.SvgElement("lineargradient",ats,ch);
       },
       MPath:function(ats,ch)
       {
        return Doc.SvgElement("mpath",ats,ch);
       },
       Marker:function(ats,ch)
       {
        return Doc.SvgElement("marker",ats,ch);
       },
       Mask:function(ats,ch)
       {
        return Doc.SvgElement("mask",ats,ch);
       },
       Metadata:function(ats,ch)
       {
        return Doc.SvgElement("metadata",ats,ch);
       },
       MissingGlyph:function(ats,ch)
       {
        return Doc.SvgElement("missing",ats,ch);
       },
       Path:function(ats,ch)
       {
        return Doc.SvgElement("path",ats,ch);
       },
       Pattern:function(ats,ch)
       {
        return Doc.SvgElement("pattern",ats,ch);
       },
       Polygon:function(ats,ch)
       {
        return Doc.SvgElement("polygon",ats,ch);
       },
       Polyline:function(ats,ch)
       {
        return Doc.SvgElement("polyline",ats,ch);
       },
       RadialGradient:function(ats,ch)
       {
        return Doc.SvgElement("radialgradient",ats,ch);
       },
       Rect:function(ats,ch)
       {
        return Doc.SvgElement("rect",ats,ch);
       },
       Script:function(ats,ch)
       {
        return Doc.SvgElement("script",ats,ch);
       },
       Set:function(ats,ch)
       {
        return Doc.SvgElement("set",ats,ch);
       },
       Stop:function(ats,ch)
       {
        return Doc.SvgElement("stop",ats,ch);
       },
       Style:function(ats,ch)
       {
        return Doc.SvgElement("style",ats,ch);
       },
       Svg:function(ats,ch)
       {
        return Doc.SvgElement("svg",ats,ch);
       },
       Switch:function(ats,ch)
       {
        return Doc.SvgElement("switch",ats,ch);
       },
       Symbol:function(ats,ch)
       {
        return Doc.SvgElement("symbol",ats,ch);
       },
       TRef:function(ats,ch)
       {
        return Doc.SvgElement("tref",ats,ch);
       },
       TSpan:function(ats,ch)
       {
        return Doc.SvgElement("tspan",ats,ch);
       },
       Text:function(ats,ch)
       {
        return Doc.SvgElement("text",ats,ch);
       },
       TextPath:function(ats,ch)
       {
        return Doc.SvgElement("textpath",ats,ch);
       },
       Title:function(ats,ch)
       {
        return Doc.SvgElement("title",ats,ch);
       },
       Use:function(ats,ch)
       {
        return Doc.SvgElement("use",ats,ch);
       },
       VKern:function(ats,ch)
       {
        return Doc.SvgElement("vkern",ats,ch);
       },
       View:function(ats,ch)
       {
        return Doc.SvgElement("view",ats,ch);
       }
      },
      TBody:function(ats,ch)
      {
       return Doc.Element("tbody",ats,ch);
      },
      TBody0:function(ch)
      {
       return Doc.Element("tbody",Runtime.New(T,{
        $:0
       }),ch);
      },
      TD:function(ats,ch)
      {
       return Doc.Element("td",ats,ch);
      },
      TD0:function(ch)
      {
       return Doc.Element("td",Runtime.New(T,{
        $:0
       }),ch);
      },
      TFoot:function(ats,ch)
      {
       return Doc.Element("tfoot",ats,ch);
      },
      TFoot0:function(ch)
      {
       return Doc.Element("tfoot",Runtime.New(T,{
        $:0
       }),ch);
      },
      TH:function(ats,ch)
      {
       return Doc.Element("th",ats,ch);
      },
      TH0:function(ch)
      {
       return Doc.Element("th",Runtime.New(T,{
        $:0
       }),ch);
      },
      THead:function(ats,ch)
      {
       return Doc.Element("thead",ats,ch);
      },
      THead0:function(ch)
      {
       return Doc.Element("thead",Runtime.New(T,{
        $:0
       }),ch);
      },
      TR:function(ats,ch)
      {
       return Doc.Element("tr",ats,ch);
      },
      TR0:function(ch)
      {
       return Doc.Element("tr",Runtime.New(T,{
        $:0
       }),ch);
      },
      TabIndex:Runtime.Field(function()
      {
       return"tabindex";
      }),
      Table:function(ats,ch)
      {
       return Doc.Element("table",ats,ch);
      },
      Table0:function(ch)
      {
       return Doc.Element("table",Runtime.New(T,{
        $:0
       }),ch);
      },
      Tags:{
       Acronym:function(ats,ch)
       {
        return Doc.Element("acronym",ats,ch);
       },
       Acronym0:function(ch)
       {
        return Doc.Element("acronym",Runtime.New(T,{
         $:0
        }),ch);
       },
       Applet:function(ats,ch)
       {
        return Doc.Element("applet",ats,ch);
       },
       Applet0:function(ch)
       {
        return Doc.Element("applet",Runtime.New(T,{
         $:0
        }),ch);
       },
       BaseFont:function(ats,ch)
       {
        return Doc.Element("basefont",ats,ch);
       },
       BaseFont0:function(ch)
       {
        return Doc.Element("basefont",Runtime.New(T,{
         $:0
        }),ch);
       },
       Big:function(ats,ch)
       {
        return Doc.Element("big",ats,ch);
       },
       Big0:function(ch)
       {
        return Doc.Element("big",Runtime.New(T,{
         $:0
        }),ch);
       },
       Center:function(ats,ch)
       {
        return Doc.Element("center",ats,ch);
       },
       Center0:function(ch)
       {
        return Doc.Element("center",Runtime.New(T,{
         $:0
        }),ch);
       },
       Content:function(ats,ch)
       {
        return Doc.Element("content",ats,ch);
       },
       Content0:function(ch)
       {
        return Doc.Element("content",Runtime.New(T,{
         $:0
        }),ch);
       },
       Data:function(ats,ch)
       {
        return Doc.Element("data",ats,ch);
       },
       Data0:function(ch)
       {
        return Doc.Element("data",Runtime.New(T,{
         $:0
        }),ch);
       },
       Dir:function(ats,ch)
       {
        return Doc.Element("dir",ats,ch);
       },
       Dir0:function(ch)
       {
        return Doc.Element("dir",Runtime.New(T,{
         $:0
        }),ch);
       },
       Font:function(ats,ch)
       {
        return Doc.Element("font",ats,ch);
       },
       Font0:function(ch)
       {
        return Doc.Element("font",Runtime.New(T,{
         $:0
        }),ch);
       },
       Frame:function(ats,ch)
       {
        return Doc.Element("frame",ats,ch);
       },
       Frame0:function(ch)
       {
        return Doc.Element("frame",Runtime.New(T,{
         $:0
        }),ch);
       },
       FrameSet:function(ats,ch)
       {
        return Doc.Element("frameset",ats,ch);
       },
       FrameSet0:function(ch)
       {
        return Doc.Element("frameset",Runtime.New(T,{
         $:0
        }),ch);
       },
       IsIndex:function(ats,ch)
       {
        return Doc.Element("isindex",ats,ch);
       },
       IsIndex0:function(ch)
       {
        return Doc.Element("isindex",Runtime.New(T,{
         $:0
        }),ch);
       },
       Main:function(ats,ch)
       {
        return Doc.Element("main",ats,ch);
       },
       Main0:function(ch)
       {
        return Doc.Element("main",Runtime.New(T,{
         $:0
        }),ch);
       },
       Map:function(ats,ch)
       {
        return Doc.Element("map",ats,ch);
       },
       Map0:function(ch)
       {
        return Doc.Element("map",Runtime.New(T,{
         $:0
        }),ch);
       },
       Menu:function(ats,ch)
       {
        return Doc.Element("menu",ats,ch);
       },
       Menu0:function(ch)
       {
        return Doc.Element("menu",Runtime.New(T,{
         $:0
        }),ch);
       },
       MenuItem:function(ats,ch)
       {
        return Doc.Element("menuitem",ats,ch);
       },
       MenuItem0:function(ch)
       {
        return Doc.Element("menuitem",Runtime.New(T,{
         $:0
        }),ch);
       },
       Object:function(ats,ch)
       {
        return Doc.Element("object",ats,ch);
       },
       Object0:function(ch)
       {
        return Doc.Element("object",Runtime.New(T,{
         $:0
        }),ch);
       },
       Option:function(ats,ch)
       {
        return Doc.Element("option",ats,ch);
       },
       Option0:function(ch)
       {
        return Doc.Element("option",Runtime.New(T,{
         $:0
        }),ch);
       },
       S:function(ats,ch)
       {
        return Doc.Element("s",ats,ch);
       },
       S0:function(ch)
       {
        return Doc.Element("s",Runtime.New(T,{
         $:0
        }),ch);
       },
       Strike:function(ats,ch)
       {
        return Doc.Element("strike",ats,ch);
       },
       Strike0:function(ch)
       {
        return Doc.Element("strike",Runtime.New(T,{
         $:0
        }),ch);
       },
       Style:function(ats,ch)
       {
        return Doc.Element("style",ats,ch);
       },
       Style0:function(ch)
       {
        return Doc.Element("style",Runtime.New(T,{
         $:0
        }),ch);
       },
       TT:function(ats,ch)
       {
        return Doc.Element("tt",ats,ch);
       },
       TT0:function(ch)
       {
        return Doc.Element("tt",Runtime.New(T,{
         $:0
        }),ch);
       },
       Template:function(ats,ch)
       {
        return Doc.Element("template",ats,ch);
       },
       Template0:function(ch)
       {
        return Doc.Element("template",Runtime.New(T,{
         $:0
        }),ch);
       },
       Title:function(ats,ch)
       {
        return Doc.Element("title",ats,ch);
       },
       Title0:function(ch)
       {
        return Doc.Element("title",Runtime.New(T,{
         $:0
        }),ch);
       },
       U:function(ats,ch)
       {
        return Doc.Element("u",ats,ch);
       },
       U0:function(ch)
       {
        return Doc.Element("u",Runtime.New(T,{
         $:0
        }),ch);
       },
       Var:function(ats,ch)
       {
        return Doc.Element("var",ats,ch);
       },
       Var0:function(ch)
       {
        return Doc.Element("var",Runtime.New(T,{
         $:0
        }),ch);
       }
      },
      Target:Runtime.Field(function()
      {
       return"target";
      }),
      TextArea:function(ats,ch)
      {
       return Doc.Element("textarea",ats,ch);
      },
      TextArea0:function(ch)
      {
       return Doc.Element("textarea",Runtime.New(T,{
        $:0
       }),ch);
      },
      Time:function(ats,ch)
      {
       return Doc.Element("time",ats,ch);
      },
      Time0:function(ch)
      {
       return Doc.Element("time",Runtime.New(T,{
        $:0
       }),ch);
      },
      Title:Runtime.Field(function()
      {
       return"title";
      }),
      Track:function(ats,ch)
      {
       return Doc.Element("track",ats,ch);
      },
      Track0:function(ch)
      {
       return Doc.Element("track",Runtime.New(T,{
        $:0
       }),ch);
      },
      Type:Runtime.Field(function()
      {
       return"type";
      }),
      UL:function(ats,ch)
      {
       return Doc.Element("ul",ats,ch);
      },
      UL0:function(ch)
      {
       return Doc.Element("ul",Runtime.New(T,{
        $:0
       }),ch);
      },
      UseMap:Runtime.Field(function()
      {
       return"usemap";
      }),
      VAlign:Runtime.Field(function()
      {
       return"valign";
      }),
      Value:Runtime.Field(function()
      {
       return"value";
      }),
      ValueType:Runtime.Field(function()
      {
       return"valuetype";
      }),
      Video:function(ats,ch)
      {
       return Doc.Element("video",ats,ch);
      },
      Video0:function(ch)
      {
       return Doc.Element("video",Runtime.New(T,{
        $:0
       }),ch);
      },
      WBR:function(ats,ch)
      {
       return Doc.Element("wbr",ats,ch);
      },
      WBR0:function(ch)
      {
       return Doc.Element("wbr",Runtime.New(T,{
        $:0
       }),ch);
      },
      Width:Runtime.Field(function()
      {
       return"width";
      }),
      Wrap:Runtime.Field(function()
      {
       return"wrap";
      })
     },
     Input:{
      ActivateButtonListener:Runtime.Field(function()
      {
       var _buttonListener_39_1,_;
       _buttonListener_39_1=function(evt,down)
       {
        var matchValue;
        matchValue=evt.button;
        return matchValue===0?Var.Set(Input.MouseBtnSt1().Left,down):matchValue===1?Var.Set(Input.MouseBtnSt1().Middle,down):matchValue===2?Var.Set(Input.MouseBtnSt1().Right,down):null;
       };
       if(!Input.MouseBtnSt1().Active)
        {
         Input.MouseBtnSt1().Active=true;
         document.addEventListener("mousedown",function(evt)
         {
          return _buttonListener_39_1(evt,true);
         },false);
         _=document.addEventListener("mouseup",function(evt)
         {
          return _buttonListener_39_1(evt,false);
         },false);
        }
       else
        {
         _=null;
        }
       return _;
      }),
      ActivateKeyListener:Runtime.Field(function()
      {
       var _;
       if(!Input.KeyListenerState().KeyListenerActive)
        {
         jQuery(document).keydown(function(evt)
         {
          var keyCode,xs;
          keyCode=evt.which;
          Var.Set(Input.KeyListenerState().LastPressed,keyCode);
          xs=Var.Get(Input.KeyListenerState().KeysPressed);
          return!Seq.exists(function(x)
          {
           return x===keyCode;
          },xs)?Input.KeyListenerState().KeysPressed.set_Value(List.append(xs,List.ofArray([keyCode]))):null;
         });
         _=void jQuery(document).keyup(function(evt)
         {
          var keyCode,predicate,arg10;
          keyCode=evt.which;
          predicate=function(x)
          {
           return x!==keyCode;
          };
          arg10=function(list)
          {
           return List.filter(predicate,list);
          };
          return Var1.Update(Input.KeyListenerState().KeysPressed,arg10);
         });
        }
       else
        {
         _=null;
        }
       return _;
      }),
      KeyListenerState:Runtime.Field(function()
      {
       return{
        KeysPressed:Var.Create(Runtime.New(T,{
         $:0
        })),
        KeyListenerActive:false,
        LastPressed:Var.Create(-1)
       };
      }),
      Keyboard:Runtime.Class({},{
       IsPressed:function(key)
       {
        var predicate;
        Input.ActivateKeyListener();
        predicate=function(x)
        {
         return x===key;
        };
        return View.Map(function(list)
        {
         return Seq.exists(predicate,list);
        },Input.KeyListenerState().KeysPressed.get_View());
       },
       get_KeysPressed:function()
       {
        Input.ActivateKeyListener();
        return Input.KeyListenerState().KeysPressed.get_View();
       },
       get_LastPressed:function()
       {
        Input.ActivateKeyListener();
        return Input.KeyListenerState().LastPressed.get_View();
       }
      }),
      Mouse:Runtime.Class({},{
       get_LeftPressed:function()
       {
        Input.ActivateButtonListener();
        return Input.MouseBtnSt1().Left.get_View();
       },
       get_MiddlePressed:function()
       {
        Input.ActivateButtonListener();
        return Input.MouseBtnSt1().Middle.get_View();
       },
       get_MousePressed:function()
       {
        Input.ActivateButtonListener();
        return View1.Apply(View1.Apply(View1.Apply(View.Const(function(l)
        {
         return function(m)
         {
          return function(r)
          {
           return(l?true:m)?true:r;
          };
         };
        }),Input.MouseBtnSt1().Left.get_View()),Input.MouseBtnSt1().Middle.get_View()),Input.MouseBtnSt1().Right.get_View());
       },
       get_Position:function()
       {
        var onMouseMove;
        onMouseMove=function(evt)
        {
         return Var.Set(Input.MousePosSt1().PosV,[evt.clientX,evt.clientY]);
        };
        if(!Input.MousePosSt1().Active)
         {
          document.addEventListener("mousemove",onMouseMove,false);
          Input.MousePosSt1().Active=true;
         }
        return View.FromVar(Input.MousePosSt1().PosV);
       },
       get_RightPressed:function()
       {
        Input.ActivateButtonListener();
        return Input.MouseBtnSt1().Right.get_View();
       }
      }),
      MouseBtnSt1:Runtime.Field(function()
      {
       return{
        Active:false,
        Left:Var.Create(false),
        Middle:Var.Create(false),
        Right:Var.Create(false)
       };
      }),
      MousePosSt1:Runtime.Field(function()
      {
       return{
        Active:false,
        PosV:Var.Create([0,0])
       };
      })
     },
     Interpolation1:Runtime.Class({},{
      get_Double:function()
      {
       return Runtime.New(DoubleInterpolation,{
        $:0
       });
      }
     }),
     Key:Runtime.Class({},{
      Fresh:function()
      {
       return Runtime.New(Key,{
        $:0,
        $0:Fresh.Int()
       });
      }
     }),
     ListModel:Runtime.Class({
      Add:function(item)
      {
       var v,m=this;
       v=this.Var.get_Value();
       if(!ListModels.Contains(this.Key,item,v))
        {
         v.push(item);
         return this.Var.set_Value(v);
        }
       else
        {
         Arrays.set(v,Arrays.findINdex(function(it)
         {
          return Unchecked.Equals(m.Key.call(null,it),m.Key.call(null,item));
         },v),item);
         return m.Var.set_Value(v);
        }
      },
      Clear:function()
      {
       return this.Var.set_Value([]);
      },
      ContainsKey:function(key)
      {
       var m=this;
       return Seq.exists(function(it)
       {
        return Unchecked.Equals(m.Key.call(null,it),key);
       },m.Var.get_Value());
      },
      ContainsKeyAsView:function(key)
      {
       var predicate,m=this;
       predicate=function(it)
       {
        return Unchecked.Equals(m.Key.call(null,it),key);
       };
       return View.Map(function(array)
       {
        return Seq.exists(predicate,array);
       },m.Var.get_View());
      },
      Find:function(pred)
      {
       return Arrays.find(pred,this.Var.get_Value());
      },
      FindAsView:function(pred)
      {
       return View.Map(function(array)
       {
        return Arrays.find(pred,array);
       },this.Var.get_View());
      },
      FindByKey:function(key)
      {
       var m=this;
       return Arrays.find(function(it)
       {
        return Unchecked.Equals(m.Key.call(null,it),key);
       },m.Var.get_Value());
      },
      FindByKeyAsView:function(key)
      {
       var predicate,m=this;
       predicate=function(it)
       {
        return Unchecked.Equals(m.Key.call(null,it),key);
       };
       return View.Map(function(array)
       {
        return Arrays.find(predicate,array);
       },m.Var.get_View());
      },
      Iter:function(fn)
      {
       return Arrays.iter(fn,this.Var.get_Value());
      },
      Remove:function(item)
      {
       var v,keyFn,k;
       v=this.Var.get_Value();
       if(ListModels.Contains(this.Key,item,v))
        {
         keyFn=this.Key;
         k=keyFn(item);
         return this.Var.set_Value(Arrays.filter(function(i)
         {
          return!Unchecked.Equals(keyFn(i),k);
         },v));
        }
       else
        {
         return null;
        }
      },
      RemoveBy:function(f)
      {
       return this.Var.set_Value(Arrays.filter(function(x)
       {
        return!f(x);
       },this.Var.get_Value()));
      },
      RemoveByKey:function(key)
      {
       var m=this;
       return this.Var.set_Value(Arrays.filter(function(i)
       {
        return!Unchecked.Equals(m.Key.call(null,i),key);
       },m.Var.get_Value()));
      },
      Set:function(lst)
      {
       return this.Var.set_Value(Arrays.ofSeq(lst));
      },
      TryFind:function(pred)
      {
       return Arrays.tryFind(pred,this.Var.get_Value());
      },
      TryFindAsView:function(pred)
      {
       return View.Map(function(array)
       {
        return Arrays.tryFind(pred,array);
       },this.Var.get_View());
      },
      TryFindByKey:function(key)
      {
       var m=this;
       return Arrays.tryFind(function(it)
       {
        return Unchecked.Equals(m.Key.call(null,it),key);
       },m.Var.get_Value());
      },
      TryFindByKeyAsView:function(key)
      {
       var predicate,m=this;
       predicate=function(it)
       {
        return Unchecked.Equals(m.Key.call(null,it),key);
       };
       return View.Map(function(array)
       {
        return Arrays.tryFind(predicate,array);
       },m.Var.get_View());
      },
      UpdateBy:function(fn,key)
      {
       var v,index,m=this,matchValue;
       v=this.Var.get_Value();
       if(this.ContainsKey(key))
        {
         index=Arrays.findINdex(function(it)
         {
          return Unchecked.Equals(m.Key.call(null,it),key);
         },v);
         matchValue=fn(Arrays.get(v,index));
         if(matchValue.$==1)
          {
           Arrays.set(v,index,matchValue.$0);
           return m.Var.set_Value(v);
          }
         else
          {
           return m.RemoveByKey(key);
          }
        }
       else
        {
         return null;
        }
      },
      get_Length:function()
      {
       return Arrays.length(this.Var.get_Value());
      },
      get_LengthAsView:function()
      {
       return View.Map(function(arr)
       {
        return Arrays.length(arr);
       },this.Var.get_View());
      }
     },{
      Create:function(key,init)
      {
       var _var;
       _var=Var.Create(Seq.toArray(Seq.distinctBy(key,init)));
       return Runtime.New(ListModel,{
        Key:key,
        Var:_var,
        View:View.Map(function(x)
        {
         return x.slice();
        },_var.get_View())
       });
      }
     }),
     ListModel1:Runtime.Class({},{
      FromSeq:function(xs)
      {
       return ListModel.Create(function(x)
       {
        return x;
       },xs);
      },
      View:function(m)
      {
       return m.View;
      }
     }),
     ListModels:{
      Contains:function(keyFn,item,xs)
      {
       var t;
       t=keyFn(item);
       return Seq.exists(function(it)
       {
        return Unchecked.Equals(keyFn(it),t);
       },xs);
      }
     },
     Model:Runtime.Class({
      get_View:function()
      {
       return Model1.View(this);
      }
     },{
      Create:function(proj,init)
      {
       var _var;
       _var=Var.Create(init);
       return Runtime.New(Model,{
        $:0,
        $0:_var,
        $1:View.Map(proj,_var.get_View())
       });
      },
      Update:function(update,_arg1)
      {
       return Var1.Update(_arg1.$0,function(x)
       {
        update(x);
        return x;
       });
      }
     }),
     Model1:Runtime.Class({},{
      View:function(_arg2)
      {
       return _arg2.$1;
      }
     }),
     Route:{
      Append:function(_arg2,_arg1)
      {
       return{
        $:0,
        $0:AppendList1.Append(_arg2.$0,_arg1.$0)
       };
      },
      FromList:function(xs)
      {
       return{
        $:0,
        $0:AppendList1.FromArray(Arrays.ofSeq(xs))
       };
      },
      MakeHash:function(_arg1)
      {
       return Strings.concat("/",Arrays.map(function(x)
       {
        return encodeURIComponent(x);
       },AppendList1.ToArray(_arg1.$0)));
      },
      NoHash:function(s)
      {
       return Strings.StartsWith(s,"#")?s.substring(1):s;
      },
      ParseHash:function(hash)
      {
       return{
        $:0,
        $0:AppendList1.FromArray(Arrays.map(function(x)
        {
         return decodeURIComponent(x);
        },Strings.SplitChars(Route.NoHash(hash),[47],1)))
       };
      },
      SameHash:function(a,b)
      {
       return Route.NoHash(a)===Route.NoHash(b);
      },
      ToList:function(_arg1)
      {
       return List.ofArray(AppendList1.ToArray(_arg1.$0));
      }
     },
     RouteMap1:Runtime.Class({},{
      Create:function(ser,des)
      {
       return{
        Des:des,
        Ser:ser
       };
      },
      Install:function(map)
      {
       return Routing.InstallMap(map);
      }
     }),
     Router:Runtime.Class({},{
      Dir:function(prefix,sites)
      {
       return Router.Prefix(prefix,Router.Merge(sites));
      },
      Install:function(key,site)
      {
       return Routing.Install(key,site);
      },
      Merge:function(sites)
      {
       return Routing.MergeRouters(sites);
      },
      Prefix:function(prefix,_arg1)
      {
       return{
        $:0,
        $0:_arg1.$0,
        $1:Trie1.Prefix(prefix,_arg1.$1)
       };
      }
     }),
     Router1:Runtime.Class({},{
      Route:function(r,init,render)
      {
       return Routing.DefineRoute(r,init,render);
      }
     }),
     Routing:{
      ComputeBodies:function(trie)
      {
       var d;
       d=Dictionary.New12();
       Arrays.iter(function(body)
       {
        return d.set_Item(body.RouteId,body);
       },Trie1.ToArray(trie));
       return d;
      },
      DefineRoute:function(r,init,render)
      {
       var state,id,site,t;
       state=Var.Create(init);
       id=Fresh.Int();
       site=(render({
        $:0,
        $0:id
       }))(state);
       t=Trie1.Leaf({
        $:0,
        $0:id,
        $1:function(ctx)
        {
         View1.Sink(function(va)
         {
          return ctx.UpdateRoute.call(null,Routing.DoLink(r,va));
         },state.get_View());
         return{
          OnRouteChanged:function(route)
          {
           return state.set_Value(Routing.DoRoute(r,route));
          },
          OnSelect:function()
          {
           return ctx.UpdateRoute.call(null,Routing.DoLink(r,state.get_Value()));
          },
          RouteId:id,
          RouteValue:site
         };
        }
       });
       return{
        $:0,
        $0:{
         $:1,
         $0:site
        },
        $1:t
       };
      },
      DoLink:function(map,va)
      {
       return Route.FromList(map.Ser.call(null,va));
      },
      DoRoute:function(map,route)
      {
       return map.Des.call(null,Route.ToList(route));
      },
      Install:function(key,_arg1)
      {
       var va,site,currentRoute,state,siteTrie,parseRoute,matchValue,glob,site1,updateRoute;
       va=_arg1.$0;
       site=_arg1.$1;
       currentRoute=Routing.InstallMap({
        Des:function(xs)
        {
         return Route.FromList(xs);
        },
        Ser:function(_arg00_)
        {
         return Route.ToList(_arg00_);
        }
       });
       state={
        Bodies:Abbrev.U(),
        CurrentRoute:currentRoute,
        CurrentSite:0,
        Selection:Abbrev.U()
       };
       siteTrie=Trie1.Map(function(prefix)
       {
        return function(_arg11)
        {
         var id;
         id=_arg11.$0;
         return _arg11.$1.call(null,{
          UpdateRoute:function(rest)
          {
           return Routing.OnInternalSiteUpdate(state,id,prefix,rest);
          }
         });
        };
       },site);
       state.Bodies=Routing.ComputeBodies(siteTrie);
       parseRoute=function(route)
       {
        return Trie1.Lookup(siteTrie,Route.ToList(route));
       };
       matchValue=parseRoute(currentRoute.get_Value());
       if(matchValue.$==0)
        {
         site1=matchValue.$0;
         state.CurrentSite=site1.RouteId;
         glob=Var.Create(site1.RouteValue);
        }
       else
        {
         glob=Var.Create(va.$==1?va.$0:Operators.FailWith("Site.Install fails on empty site"));
        }
       state.Selection=glob;
       View1.Sink(function(site2)
       {
        return Routing.OnSelectSite(state,key(site2));
       },glob.get_View());
       updateRoute=function(route)
       {
        var matchValue1;
        matchValue1=parseRoute(route);
        return matchValue1.$==1?null:Routing.OnGlobalRouteChange(state,matchValue1.$0,Route.FromList(matchValue1.$1));
       };
       updateRoute(currentRoute.get_Value());
       View1.Sink(updateRoute,currentRoute.get_View());
       return glob;
      },
      InstallMap:function(rt)
      {
       var cur,_var,onUpdate;
       cur=function()
       {
        return rt.Des.call(null,Route.ToList(Route.ParseHash(window.location.hash)));
       };
       _var=Var.Create(cur(null));
       onUpdate=function()
       {
        var value;
        value=cur(null);
        return!Unchecked.Equals(rt.Ser.call(null,_var.get_Value()),rt.Ser.call(null,value))?_var.set_Value(value):null;
       };
       window.onpopstate=onUpdate;
       window.onhashchange=onUpdate;
       View1.Sink(function(loc)
       {
        var ha;
        ha=Route.MakeHash(Route.FromList(rt.Ser.call(null,loc)));
        return!Route.SameHash(window.location.hash,ha)?void(window.location.hash=ha):null;
       },_var.get_View());
       return _var;
      },
      MergeRouters:function(sites)
      {
       var sites1,merged,value;
       sites1=Seq.toArray(sites);
       merged=Trie1.Merge(Seq.map(function(_arg1)
       {
        return _arg1.$1;
       },sites1));
       value=Seq.tryPick(function(_arg2)
       {
        return _arg2.$0;
       },sites1);
       return merged.$==1?{
        $:0,
        $0:value,
        $1:merged.$0
       }:Operators.FailWith("Invalid Site.Merge: need more prefix disambiguation");
      },
      OnGlobalRouteChange:function(state,site,rest)
      {
       if(state.CurrentSite!==site.RouteId)
        {
         state.CurrentSite=site.RouteId;
         state.Selection.set_Value(site.RouteValue);
        }
       return site.OnRouteChanged.call(null,rest);
      },
      OnInternalSiteUpdate:function(state,ix,prefix,rest)
      {
       return state.CurrentSite===ix?Routing.SetCurrentRoute(state,Route.Append(Route.FromList(prefix),rest)):null;
      },
      OnSelectSite:function(state,_arg1)
      {
       var id;
       id=_arg1.$0;
       if(state.CurrentSite!==id)
        {
         state.CurrentSite=id;
         return state.Bodies.get_Item(id).OnSelect.call(null,null);
        }
       else
        {
         return null;
        }
      },
      SetCurrentRoute:function(state,route)
      {
       return!Unchecked.Equals(state.CurrentRoute.get_Value(),route)?state.CurrentRoute.set_Value(route):null;
      }
     },
     Snap1:{
      Bind:function(f,snap)
      {
       var res,onObs;
       res=Snap1.Create();
       onObs=function()
       {
        return Snap1.MarkObsolete(res);
       };
       Snap1.When(snap,function(x)
       {
        var y;
        y=f(x);
        return Snap1.When(y,function(v)
        {
         return(Snap1.IsForever(y)?Snap1.IsForever(snap):false)?Snap1.MarkForever(res,v):Snap1.MarkReady(res,v);
        },onObs);
       },onObs);
       return res;
      },
      Create:function()
      {
       return Snap1.Make({
        $:3,
        $0:[],
        $1:[]
       });
      },
      CreateForever:function(v)
      {
       return Snap1.Make({
        $:0,
        $0:v
       });
      },
      CreateWithValue:function(v)
      {
       return Snap1.Make({
        $:2,
        $0:v,
        $1:[]
       });
      },
      IsForever:function(snap)
      {
       return snap.State.$==0?true:false;
      },
      IsObsolete:function(snap)
      {
       return snap.State.$==1?true:false;
      },
      Make:function(st)
      {
       return{
        State:st
       };
      },
      Map:function(fn,sn)
      {
       var matchValue,res;
       matchValue=sn.State;
       if(matchValue.$==0)
        {
         return Snap1.CreateForever(fn(matchValue.$0));
        }
       else
        {
         res=Snap1.Create();
         Snap1.When(sn,function(x)
         {
          return Snap1.MarkDone(res,sn,fn(x));
         },function()
         {
          return Snap1.MarkObsolete(res);
         });
         return res;
        }
      },
      Map2:function(fn,sn1,sn2)
      {
       var matchValue,y,y1,res,v1,v2,obs,cont;
       matchValue=[sn1.State,sn2.State];
       if(matchValue[0].$==0)
        {
         if(matchValue[1].$==0)
          {
           y=matchValue[1].$0;
           return Snap1.CreateForever((fn(matchValue[0].$0))(y));
          }
         else
          {
           return Snap1.Map(fn(matchValue[0].$0),sn2);
          }
        }
       else
        {
         if(matchValue[1].$==0)
          {
           y1=matchValue[1].$0;
           return Snap1.Map(function(x)
           {
            return(fn(x))(y1);
           },sn1);
          }
         else
          {
           res=Snap1.Create();
           v1=[{
            $:0
           }];
           v2=[{
            $:0
           }];
           obs=function()
           {
            v1[0]={
             $:0
            };
            v2[0]={
             $:0
            };
            return Snap1.MarkObsolete(res);
           };
           cont=function()
           {
            var matchValue1,x,y2;
            matchValue1=[v1[0],v2[0]];
            if(matchValue1[0].$==1)
             {
              if(matchValue1[1].$==1)
               {
                x=matchValue1[0].$0;
                y2=matchValue1[1].$0;
                return(Snap1.IsForever(sn1)?Snap1.IsForever(sn2):false)?Snap1.MarkForever(res,(fn(x))(y2)):Snap1.MarkReady(res,(fn(x))(y2));
               }
              else
               {
                return null;
               }
             }
            else
             {
              return null;
             }
           };
           Snap1.When(sn1,function(x)
           {
            v1[0]={
             $:1,
             $0:x
            };
            return cont(null);
           },obs);
           Snap1.When(sn2,function(y2)
           {
            v2[0]={
             $:1,
             $0:y2
            };
            return cont(null);
           },obs);
           return res;
          }
        }
      },
      MapAsync:function(fn,snap)
      {
       var res;
       res=Snap1.Create();
       Snap1.When(snap,function(v)
       {
        return Async.StartTo(fn(v),function(v1)
        {
         return Snap1.MarkDone(res,snap,v1);
        });
       },function()
       {
        return Snap1.MarkObsolete(res);
       });
       return res;
      },
      MarkDone:function(res,sn,v)
      {
       return Snap1.IsForever(sn)?Snap1.MarkForever(res,v):Snap1.MarkReady(res,v);
      },
      MarkForever:function(sn,v)
      {
       var matchValue,q;
       matchValue=sn.State;
       if(matchValue.$==3)
        {
         q=matchValue.$0;
         sn.State={
          $:0,
          $0:v
         };
         return JQueue.Iter(function(k)
         {
          return k(v);
         },q);
        }
       else
        {
         return null;
        }
      },
      MarkObsolete:function(sn)
      {
       var matchValue,ks,ks1;
       matchValue=sn.State;
       if(matchValue.$==1)
        {
         return null;
        }
       else
        {
         if(matchValue.$==2)
          {
           ks=matchValue.$1;
           sn.State={
            $:1
           };
           return JQueue.Iter(function(k)
           {
            return k(null);
           },ks);
          }
         else
          {
           if(matchValue.$==3)
            {
             ks1=matchValue.$1;
             sn.State={
              $:1
             };
             return JQueue.Iter(function(k)
             {
              return k(null);
             },ks1);
            }
           else
            {
             return null;
            }
          }
        }
      },
      MarkReady:function(sn,v)
      {
       var matchValue,q1;
       matchValue=sn.State;
       if(matchValue.$==3)
        {
         q1=matchValue.$0;
         sn.State={
          $:2,
          $0:v,
          $1:matchValue.$1
         };
         return JQueue.Iter(function(k)
         {
          return k(v);
         },q1);
        }
       else
        {
         return null;
        }
      },
      SnapshotOn:function(sn1,sn2)
      {
       var matchValue,res,v,triggered,cont;
       matchValue=[sn1.State,sn2.State];
       if(matchValue[1].$==0)
        {
         return Snap1.CreateForever(matchValue[1].$0);
        }
       else
        {
         res=Snap1.Create();
         v=[{
          $:0
         }];
         triggered=[false];
         cont=function()
         {
          var matchValue1;
          if(triggered[0])
           {
            matchValue1=v[0];
            return matchValue1.$==1?Snap1.IsForever(sn2)?Snap1.MarkForever(res,matchValue1.$0):matchValue1.$==1?Snap1.MarkReady(res,matchValue1.$0):null:matchValue1.$==1?Snap1.MarkReady(res,matchValue1.$0):null;
           }
          else
           {
            return null;
           }
         };
         Snap1.When(sn1,function()
         {
          triggered[0]=true;
          return cont(null);
         },function()
         {
          v[0]={
           $:0
          };
          return Snap1.MarkObsolete(res);
         });
         Snap1.When(sn2,function(y)
         {
          v[0]={
           $:1,
           $0:y
          };
          return cont(null);
         },function()
         {
         });
         return res;
        }
      },
      When:function(snap,avail,obsolete)
      {
       var matchValue,v,q2;
       matchValue=snap.State;
       if(matchValue.$==1)
        {
         return obsolete(null);
        }
       else
        {
         if(matchValue.$==2)
          {
           v=matchValue.$0;
           JQueue.Add(obsolete,matchValue.$1);
           return avail(v);
          }
         else
          {
           if(matchValue.$==3)
            {
             q2=matchValue.$1;
             JQueue.Add(avail,matchValue.$0);
             return JQueue.Add(obsolete,q2);
            }
           else
            {
             return avail(matchValue.$0);
            }
          }
        }
      }
     },
     Trans:Runtime.Class({},{
      AnimateChange:function(tr,x,y)
      {
       return(tr.TChange.call(null,x))(y);
      },
      AnimateEnter:function(tr,x)
      {
       return tr.TEnter.call(null,x);
      },
      AnimateExit:function(tr,x)
      {
       return tr.TExit.call(null,x);
      },
      CanAnimateChange:function(tr)
      {
       return(tr.TFlags&1)!==0;
      },
      CanAnimateEnter:function(tr)
      {
       return(tr.TFlags&2)!==0;
      },
      CanAnimateExit:function(tr)
      {
       return(tr.TFlags&4)!==0;
      },
      Change:function(ch,tr)
      {
       return{
        TChange:ch,
        TEnter:tr.TEnter,
        TExit:tr.TExit,
        TFlags:tr.TFlags|1
       };
      },
      Create:function(ch)
      {
       return{
        TChange:ch,
        TEnter:function(t)
        {
         return An.Const(t);
        },
        TExit:function(t)
        {
         return An.Const(t);
        },
        TFlags:1
       };
      },
      Trivial:function()
      {
       return{
        TChange:function()
        {
         return function(y)
         {
          return An.Const(y);
         };
        },
        TEnter:function(t)
        {
         return An.Const(t);
        },
        TExit:function(t)
        {
         return An.Const(t);
        },
        TFlags:0
       };
      }
     }),
     Trans1:Runtime.Class({},{
      Enter:function(f,tr)
      {
       return{
        TChange:tr.TChange,
        TEnter:f,
        TExit:tr.TExit,
        TFlags:tr.TFlags|2
       };
      },
      Exit:function(f,tr)
      {
       return{
        TChange:tr.TChange,
        TEnter:tr.TEnter,
        TExit:f,
        TFlags:tr.TFlags|4
       };
      }
     }),
     Trie1:{
      AllSome:function(xs)
      {
       var e,r,ok,matchValue;
       e=Enumerator.Get(xs);
       r=ResizeArrayProxy.New2();
       ok=true;
       while(ok?e.MoveNext():false)
        {
         matchValue=e.get_Current();
         if(matchValue.$==1)
          {
           r.Add(matchValue.$0);
          }
         else
          {
           ok=false;
          }
        }
       return ok?{
        $:1,
        $0:r.ToArray()
       }:{
        $:0
       };
      },
      Empty:function()
      {
       return{
        $:1
       };
      },
      IsLeaf:function(t)
      {
       return t.$==2?true:false;
      },
      Leaf:function(v)
      {
       return{
        $:2,
        $0:v
       };
      },
      Look:function(key,trie)
      {
       var matchValue,ks,matchValue1;
       matchValue=[trie,key];
       if(matchValue[0].$==2)
        {
         return{
          $:0,
          $0:matchValue[0].$0,
          $1:key
         };
        }
       else
        {
         if(matchValue[0].$==0)
          {
           if(matchValue[1].$==1)
            {
             ks=matchValue[1].$1;
             matchValue1=MapModule.TryFind(matchValue[1].$0,matchValue[0].$0);
             return matchValue1.$==0?{
              $:1
             }:Trie1.Look(ks,matchValue1.$0);
            }
           else
            {
             return{
              $:1
             };
            }
          }
         else
          {
           return{
            $:1
           };
          }
        }
      },
      Lookup:function(trie,key)
      {
       return Trie1.Look(Seq.toList(key),trie);
      },
      Map:function(f,trie)
      {
       return Trie1.MapLoop(Runtime.New(T,{
        $:0
       }),f,trie);
      },
      MapLoop:function(loc,f,trie)
      {
       var x;
       if(trie.$==1)
        {
         return{
          $:1
         };
        }
       else
        {
         if(trie.$==2)
          {
           x=trie.$0;
           return{
            $:2,
            $0:(f(loc))(x)
           };
          }
         else
          {
           return Trie1.TrieBranch(MapModule.Map(function(k)
           {
            return function(v)
            {
             return Trie1.MapLoop(List.append(loc,List.ofArray([k])),f,v);
            };
           },trie.$0));
          }
        }
      },
      Mapi:function(f,trie)
      {
       var counter;
       counter=[0];
       return Trie1.Map(function(x)
       {
        var c;
        c=counter[0];
        counter[0]=c+1;
        return(f(c))(x);
       },trie);
      },
      Merge:function(ts)
      {
       var ts1,matchValue;
       ts1=Seq.toArray(ts);
       matchValue=Arrays.length(ts1);
       return matchValue===0?{
        $:1,
        $0:{
         $:1
        }
       }:matchValue===1?{
        $:1,
        $0:Arrays.get(ts1,0)
       }:Seq.exists(function(t)
       {
        return Trie1.IsLeaf(t);
       },ts1)?{
        $:0
       }:Option.map(function(xs)
       {
        return Trie1.TrieBranch(xs);
       },Trie1.MergeMaps(function(_arg00_)
       {
        return Trie1.Merge(_arg00_);
       },Seq.choose(function(_arg1)
       {
        return _arg1.$==0?{
         $:1,
         $0:_arg1.$0
        }:{
         $:0
        };
       },ts1)));
      },
      MergeMaps:function(merge,maps)
      {
       var x;
       x=Seq.collect(function(table)
       {
        return MapModule.ToSeq(table);
       },maps);
       return Option.map(function(elements)
       {
        return MapModule.OfArray(Seq.toArray(elements));
       },Trie1.AllSome(Seq.map(function(tupledArg)
       {
        var k;
        k=tupledArg[0];
        return Option.map(function(v)
        {
         return[k,v];
        },merge(tupledArg[1]));
       },MapModule.ToSeq(Seq.fold(function(s)
       {
        return function(tupledArg)
        {
         return Trie1.MultiAdd(tupledArg[0],tupledArg[1],s);
        };
       },FSharpMap.New1([]),x)))));
      },
      MultiAdd:function(key,value,map)
      {
       return map.Add(key,Runtime.New(T,{
        $:1,
        $0:value,
        $1:Trie1.MultiFind(key,map)
       }));
      },
      MultiFind:function(key,map)
      {
       return Operators.DefaultArg(MapModule.TryFind(key,map),Runtime.New(T,{
        $:0
       }));
      },
      Prefix:function(key,trie)
      {
       return Trie1.TrieBranch(FSharpMap.New1(List.ofArray([[key,trie]])));
      },
      ToArray:function(trie)
      {
       var all;
       all=[];
       Trie1.Map(function()
       {
        return function(v)
        {
         return JQueue.Add(v,all);
        };
       },trie);
       return JQueue.ToArray(all);
      },
      TrieBranch:function(xs)
      {
       return xs.get_IsEmpty()?{
        $:1
       }:{
        $:0,
        $0:xs
       };
      }
     },
     UINextPagelet:Runtime.Class({
      Render:function()
      {
       return Doc.RunById(this.divId,this.doc);
      },
      get_Body:function()
      {
       return this.body;
      }
     },{
      New:function(doc)
      {
       var r,arg10,arg101;
       r=Runtime.New(this,Pagelet.New());
       r.doc=doc;
       r.divId=Fresh.Id();
       arg101=r.divId;
       arg10=List.ofArray([Attr1.Attr().NewAttr("id",arg101)]);
       r.body=Tags.Tags().NewTag("div",arg10).get_Body();
       return r;
      }
     }),
     Var:Runtime.Class({
      get_Value:function()
      {
       return Var.Get(this);
      },
      get_View:function()
      {
       return View.FromVar(this);
      },
      set_Value:function(value)
      {
       return Var.Set(this,value);
      }
     },{
      Create:function(v)
      {
       return Runtime.New(Var,{
        Const:false,
        Current:v,
        Snap:Snap1.CreateWithValue(v),
        Id:Fresh.Int()
       });
      },
      Get:function(_var)
      {
       return _var.Current;
      },
      Set:function(_var,value)
      {
       if(_var.Const)
        {
         return null;
        }
       else
        {
         Snap1.MarkObsolete(_var.Snap);
         _var.Current=value;
         _var.Snap=Snap1.CreateWithValue(value);
         return;
        }
      },
      SetFinal:function(_var,value)
      {
       if(_var.Const)
        {
         return null;
        }
       else
        {
         _var.Const=true;
         _var.Current=value;
         _var.Snap=Snap1.CreateForever(value);
         return;
        }
      }
     }),
     Var1:Runtime.Class({},{
      GetId:function(_var)
      {
       return _var.Id;
      },
      Observe:function(_var)
      {
       return _var.Snap;
      },
      Update:function(_var,fn)
      {
       return Var.Set(_var,fn(Var.Get(_var)));
      }
     }),
     View:Runtime.Class({},{
      Bind:function(fn,view)
      {
       return View.Join(View.Map(fn,view));
      },
      Const:function(x)
      {
       var o;
       o=Snap1.CreateForever(x);
       return{
        $:0,
        $0:function()
        {
         return o;
        }
       };
      },
      Convert:function(conv,view)
      {
       return View.ConvertBy(function(x)
       {
        return x;
       },conv,view);
      },
      ConvertBy:function(key,conv,view)
      {
       var state;
       state=[Dictionary.New12()];
       return View.Map(function(xs)
       {
        var prevState,newState,result;
        prevState=state[0];
        newState=Dictionary.New12();
        result=Arrays.map(function(x)
        {
         var k,res;
         k=key(x);
         res=prevState.ContainsKey(k)?prevState.get_Item(k):conv(x);
         newState.set_Item(k,res);
         return res;
        },Seq.toArray(xs));
        state[0]=newState;
        return result;
       },view);
      },
      ConvertSeq:function(conv,view)
      {
       return View.ConvertSeqBy(function(x)
       {
        return x;
       },conv,view);
      },
      ConvertSeqBy:function(key,conv,view)
      {
       var state;
       state=[Dictionary.New12()];
       return View.Map(function(xs)
       {
        var prevState,newState,result;
        prevState=state[0];
        newState=Dictionary.New12();
        result=Arrays.map(function(x)
        {
         var k,node,n;
         k=key(x);
         if(prevState.ContainsKey(k))
          {
           n=prevState.get_Item(k);
           Var.Set(n.NVar,x);
           node=n;
          }
         else
          {
           node=View.ConvertSeqNode(conv,x);
          }
         newState.set_Item(k,node);
         return node.NValue;
        },Seq.toArray(xs));
        state[0]=newState;
        return result;
       },view);
      },
      ConvertSeqNode:function(conv,value)
      {
       var _var,view;
       _var=Var.Create(value);
       view=View.FromVar(_var);
       return{
        NValue:conv(view),
        NVar:_var,
        NView:view
       };
      },
      CreateLazy:function(observe)
      {
       var cur;
       cur=[{
        $:0
       }];
       return{
        $:0,
        $0:function()
        {
         var matchValue,sn,sn1;
         matchValue=cur[0];
         if(matchValue.$==1)
          {
           if(!Snap1.IsObsolete(matchValue.$0))
            {
             return matchValue.$0;
            }
           else
            {
             sn=observe(null);
             cur[0]={
              $:1,
              $0:sn
             };
             return sn;
            }
          }
         else
          {
           sn1=observe(null);
           cur[0]={
            $:1,
            $0:sn1
           };
           return sn1;
          }
        }
       };
      },
      CreateLazy2:function(snapFn,_arg3,_arg2)
      {
       var o1,o2;
       o1=_arg3.$0;
       o2=_arg2.$0;
       return View.CreateLazy(function()
       {
        var s1,s2;
        s1=o1(null);
        s2=o2(null);
        return(snapFn(s1))(s2);
       });
      },
      FromVar:function(_var)
      {
       return{
        $:0,
        $0:function()
        {
         return Var1.Observe(_var);
        }
       };
      },
      Join:function(_arg7)
      {
       var observe;
       observe=_arg7.$0;
       return View.CreateLazy(function()
       {
        return Snap1.Bind(function(_arg1)
        {
         return _arg1.$0.call(null,null);
        },observe(null));
       });
      },
      Map:function(fn,_arg1)
      {
       var observe;
       observe=_arg1.$0;
       return View.CreateLazy(function()
       {
        return Snap1.Map(fn,observe(null));
       });
      },
      Map2:function(fn,v1,v2)
      {
       return View.CreateLazy2(function(_arg10_)
       {
        return function(_arg20_)
        {
         return Snap1.Map2(fn,_arg10_,_arg20_);
        };
       },v1,v2);
      },
      MapAsync:function(fn,_arg4)
      {
       var observe;
       observe=_arg4.$0;
       return View.CreateLazy(function()
       {
        return Snap1.MapAsync(fn,observe(null));
       });
      },
      SnapshotOn:function(def,_arg6,_arg5)
      {
       var o1,o2,res,init;
       o1=_arg6.$0;
       o2=_arg5.$0;
       res=Snap1.CreateWithValue(def);
       init=[false];
       return View.CreateLazy(function()
       {
        var s1,s2;
        s1=o1(null);
        s2=o2(null);
        if(init[0])
         {
          return Snap1.SnapshotOn(s1,s2);
         }
        else
         {
          Snap1.When(Snap1.SnapshotOn(s1,s2),function()
          {
           return null;
          },function()
          {
           if(!init[0])
            {
             init[0]=true;
             return Snap1.MarkObsolete(res);
            }
           else
            {
             return null;
            }
          });
          return res;
         }
       });
      },
      UpdateWhile:function(def,v1,v2)
      {
       var value;
       value=[def];
       return View.Map2(function(pred)
       {
        return function(v)
        {
         if(pred)
          {
           value[0]=v;
          }
         return value[0];
        };
       },v1,v2);
      },
      get_Do:function()
      {
       return Runtime.New(ViewBuilder,{
        $:0
       });
      }
     }),
     View1:Runtime.Class({},{
      Apply:function(fn,view)
      {
       return View.Map2(function(f)
       {
        return function(x)
        {
         return f(x);
        };
       },fn,view);
      },
      Sink:function(act,_arg8)
      {
       var observe,loop;
       observe=_arg8.$0;
       loop=function()
       {
        return Snap1.When(observe(null),act,function()
        {
         return Async.Schedule(loop);
        });
       };
       return Async.Schedule(loop);
      }
     }),
     ViewBuilder:Runtime.Class({
      Bind:function(x,f)
      {
       return View.Bind(f,x);
      },
      Return:function(x)
      {
       return View.Const(x);
      }
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Array=Runtime.Safe(Global.Array);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Abbrev=Runtime.Safe(Next.Abbrev);
  Fresh=Runtime.Safe(Abbrev.Fresh);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  HashSetProxy=Runtime.Safe(Collections.HashSetProxy);
  HashSet=Runtime.Safe(Abbrev.HashSet);
  JQueue=Runtime.Safe(Abbrev.JQueue);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Slot=Runtime.Safe(Abbrev.Slot);
  An=Runtime.Safe(Next.An);
  AppendList1=Runtime.Safe(Next.AppendList1);
  Anims=Runtime.Safe(Next.Anims);
  window=Runtime.Safe(Global.window);
  Trans=Runtime.Safe(Next.Trans);
  Option=Runtime.Safe(Global.WebSharper.Option);
  View=Runtime.Safe(Next.View);
  Lazy=Runtime.Safe(Global.WebSharper.Lazy);
  Array1=Runtime.Safe(Abbrev.Array);
  Attrs=Runtime.Safe(Next.Attrs);
  DomUtility=Runtime.Safe(Next.DomUtility);
  Attr=Runtime.Safe(Next.Attr);
  Var=Runtime.Safe(Next.Var);
  List=Runtime.Safe(Global.WebSharper.List);
  AnimatedAttrNode=Runtime.Safe(Next.AnimatedAttrNode);
  DynamicAttrNode=Runtime.Safe(Next.DynamicAttrNode);
  document=Runtime.Safe(Global.document);
  Doc=Runtime.Safe(Next.Doc);
  UINextPagelet=Runtime.Safe(Next.UINextPagelet);
  Var1=Runtime.Safe(Next.Var1);
  Docs=Runtime.Safe(Next.Docs);
  View1=Runtime.Safe(Next.View1);
  Mailbox=Runtime.Safe(Abbrev.Mailbox);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  NodeSet=Runtime.Safe(Docs.NodeSet);
  DocElemNode=Runtime.Safe(Next.DocElemNode);
  DomNodes=Runtime.Safe(Docs.DomNodes);
  jQuery=Runtime.Safe(Global.jQuery);
  Easing=Runtime.Safe(Next.Easing);
  Easings=Runtime.Safe(Next.Easings);
  FlowBuilder=Runtime.Safe(Next.FlowBuilder);
  Flow=Runtime.Safe(Next.Flow);
  T=Runtime.Safe(List.T);
  Input=Runtime.Safe(Next.Input);
  DoubleInterpolation=Runtime.Safe(Next.DoubleInterpolation);
  Key=Runtime.Safe(Next.Key);
  ListModels=Runtime.Safe(Next.ListModels);
  ListModel=Runtime.Safe(Next.ListModel);
  Model1=Runtime.Safe(Next.Model1);
  Model=Runtime.Safe(Next.Model);
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  encodeURIComponent=Runtime.Safe(Global.encodeURIComponent);
  decodeURIComponent=Runtime.Safe(Global.decodeURIComponent);
  Route=Runtime.Safe(Next.Route);
  Routing=Runtime.Safe(Next.Routing);
  Router=Runtime.Safe(Next.Router);
  Trie1=Runtime.Safe(Next.Trie1);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Snap1=Runtime.Safe(Next.Snap1);
  Async=Runtime.Safe(Abbrev.Async);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  MapModule=Runtime.Safe(Collections.MapModule);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Pagelet=Runtime.Safe(Client.Pagelet);
  Attr1=Runtime.Safe(Client.Attr);
  Tags=Runtime.Safe(Client.Tags);
  ViewBuilder=Runtime.Safe(Next.ViewBuilder);
  Html1=Runtime.Safe(Next.Html);
  Attributes=Runtime.Safe(Html1.Attributes);
  return SvgAttributes=Runtime.Safe(Html1.SvgAttributes);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(UINextPagelet,Pagelet);
  Input.MousePosSt1();
  Input.MouseBtnSt1();
  Input.KeyListenerState();
  Input.ActivateKeyListener();
  Input.ActivateButtonListener();
  Html1.Wrap();
  Html1.Width();
  Html1.ValueType();
  Html1.Value();
  Html1.VAlign();
  Html1.UseMap();
  Html1.Type();
  Html1.Title();
  Html1.Target();
  Html1.TabIndex();
  SvgAttributes.Z();
  SvgAttributes.YChannelSelector();
  SvgAttributes.Y2();
  SvgAttributes.Y1();
  SvgAttributes.Y();
  SvgAttributes.XChannelSelector();
  SvgAttributes.X2();
  SvgAttributes.X1();
  SvgAttributes.X();
  SvgAttributes.WritingMode();
  SvgAttributes.WordSpacing();
  SvgAttributes.Width();
  SvgAttributes.Visibility();
  SvgAttributes.ViewBox();
  SvgAttributes.Values();
  SvgAttributes.Type();
  SvgAttributes.Transform();
  SvgAttributes.To();
  SvgAttributes.TextRendering();
  SvgAttributes.TextDecoration();
  SvgAttributes.TextAnchor();
  SvgAttributes.TargetY();
  SvgAttributes.TargetX();
  SvgAttributes.SurfaceScale();
  SvgAttributes.Style();
  SvgAttributes.StrokeWidth();
  SvgAttributes.StrokeOpacity();
  SvgAttributes.StrokeMiterLimit();
  SvgAttributes.StrokeLineJoin();
  SvgAttributes.StrokeLineCap();
  SvgAttributes.StrokeDashOffset();
  SvgAttributes.StrokeDashArray();
  SvgAttributes.Stroke();
  SvgAttributes.StopOpacity();
  SvgAttributes.StopColor();
  SvgAttributes.StitchTiles();
  SvgAttributes.StdDeviation();
  SvgAttributes.SpecularExponent();
  SvgAttributes.SpecularConstant();
  SvgAttributes.ShapeRendering();
  SvgAttributes.Seed();
  SvgAttributes.Scale();
  SvgAttributes.Result();
  SvgAttributes.Restart();
  SvgAttributes.RequiredFeatures();
  SvgAttributes.RepeatDur();
  SvgAttributes.RepeatCount();
  SvgAttributes.Radius();
  SvgAttributes.RY();
  SvgAttributes.RX();
  SvgAttributes.R();
  SvgAttributes.PrimitiveUnits();
  SvgAttributes.PreserveAspectRatio();
  SvgAttributes.PreserveAlpha();
  SvgAttributes.PointsAtZ();
  SvgAttributes.PointsAtY();
  SvgAttributes.PointsAtX();
  SvgAttributes.Points();
  SvgAttributes.PointerEvents();
  SvgAttributes.PatternUnits();
  SvgAttributes.PatternTransform();
  SvgAttributes.PatternContentUnits();
  SvgAttributes.PathLength();
  SvgAttributes.PaintOrder();
  SvgAttributes.Overflow();
  SvgAttributes.Order();
  SvgAttributes.Operator();
  SvgAttributes.Opacity();
  SvgAttributes.NumOctaves();
  SvgAttributes.Mode();
  SvgAttributes.Min();
  SvgAttributes.Max();
  SvgAttributes.MaskUnits();
  SvgAttributes.MaskContentUnits();
  SvgAttributes.Mask();
  SvgAttributes.MarkerWidth();
  SvgAttributes.MarkerUnits();
  SvgAttributes.MarkerStart();
  SvgAttributes.MarkerMid();
  SvgAttributes.MarkerHeight();
  SvgAttributes.MarkerEnd();
  SvgAttributes.Local();
  SvgAttributes.LimitingConeAngle();
  SvgAttributes.LightingColor();
  SvgAttributes.LetterSpacing();
  SvgAttributes.KeyTimes();
  SvgAttributes.KeySplines();
  SvgAttributes.Kerning();
  SvgAttributes.KernelUnitLength();
  SvgAttributes.KernelMatrix();
  SvgAttributes.K4();
  SvgAttributes.K3();
  SvgAttributes.K2();
  SvgAttributes.K1();
  SvgAttributes.In2();
  SvgAttributes.ImageRendering();
  SvgAttributes.IN();
  SvgAttributes.Height();
  SvgAttributes.GradientUnits();
  SvgAttributes.GradientTransform();
  SvgAttributes.From();
  SvgAttributes.FontWeight();
  SvgAttributes.FontVariant();
  SvgAttributes.FontStyle();
  SvgAttributes.FontStretch();
  SvgAttributes.FontSizeAdjust();
  SvgAttributes.FontSize();
  SvgAttributes.FontFamily();
  SvgAttributes.FloodOpacity();
  SvgAttributes.FloodColor();
  SvgAttributes.FilterUnits();
  SvgAttributes.FilterRes();
  SvgAttributes.Filter();
  SvgAttributes.FillRule();
  SvgAttributes.FillOpacity();
  SvgAttributes.Fill();
  SvgAttributes.ExternalResourcesRequired();
  SvgAttributes.End();
  SvgAttributes.Elevation();
  SvgAttributes.EdgeMode();
  SvgAttributes.Dur();
  SvgAttributes.DominantBaseline();
  SvgAttributes.Divisor();
  SvgAttributes.Display();
  SvgAttributes.Direction();
  SvgAttributes.DiffuseConstant();
  SvgAttributes.DY();
  SvgAttributes.DX();
  SvgAttributes.D();
  SvgAttributes.Cursor();
  SvgAttributes.ContentStyleType();
  SvgAttributes.ContentScriptType();
  SvgAttributes.ColorRendering();
  SvgAttributes.ColorProfile();
  SvgAttributes.ColorInterpolationFilters();
  SvgAttributes.ColorInterpolation();
  SvgAttributes.Color();
  SvgAttributes.ClipRule();
  SvgAttributes.ClipPathUnits();
  SvgAttributes.ClipPath();
  SvgAttributes.Clip();
  SvgAttributes.Class();
  SvgAttributes.CalcMode();
  SvgAttributes.CY();
  SvgAttributes.CX();
  SvgAttributes.Bias();
  SvgAttributes.Begin();
  SvgAttributes.BaselineShift();
  SvgAttributes.BaseFrequency();
  SvgAttributes.Azimuth();
  SvgAttributes.AttributeType();
  SvgAttributes.AttributeName();
  SvgAttributes.Ascent();
  SvgAttributes.AlignmentBaseline();
  SvgAttributes.Additive();
  SvgAttributes.Accumulate();
  SvgAttributes.AccentHeight();
  Html1.Subject();
  Html1.Style();
  Html1.Step();
  Html1.StandBy();
  Html1.SrcLang();
  Html1.SrcDoc();
  Html1.Src();
  Html1.SpellCheck();
  Html1.Sizes();
  Html1.Size();
  Html1.Shape();
  Html1.Selected();
  Html1.Seamless();
  Html1.Scrolling();
  Html1.Scoped();
  Html1.Scope();
  Html1.Scheme();
  Html1.Sandbox();
  Html1.Rules();
  Html1.Rows();
  Html1.RowSpan();
  Html1.Reversed();
  Html1.Rev();
  Html1.Required();
  Html1.Rel();
  Html1.ReadOnly();
  Html1.RadioGroup();
  Html1.PubDate();
  Html1.Profile();
  Html1.Preload();
  Html1.Poster();
  Html1.PlaceHolder();
  Html1.Ping();
  Html1.Pattern();
  Html1.NoValidate();
  Html1.NoResize();
  Html1.NoHRef();
  Html1.Name();
  Html1.Multiple();
  Html1.Method();
  Html1.Media();
  Html1.MaxLength();
  Html1.MarginWidth();
  Html1.MarginHeight();
  Html1.Manifest();
  Html1.Low();
  Html1.Loop();
  Html1.LongDesc();
  Html1.Lang();
  Html1.ItemProp();
  Html1.IsMap();
  Html1.Id();
  Html1.Icon();
  Html1.HttpEquiv();
  Html1.High();
  Html1.Hidden();
  Html1.Height();
  Html1.Headers();
  Html1.HRefLang();
  Html1.HRef();
  Html1.FrameBorder();
  Html1.FormTarget();
  Html1.FormNoValidate();
  Html1.FormMethod();
  Html1.FormEncType();
  Html1.FormAction();
  Html1.For();
  Html1.EncType();
  Html1.DropZone();
  Html1.Draggable();
  Html1.Download();
  Html1.Disabled();
  Html1.Defer();
  Html1.Default();
  Html1.Declare();
  Html1.Coords();
  Html1.ContextMenu();
  Html1.ContentEditable();
  Html1.Cols();
  Html1.ColSpan();
  Html1.CodeType();
  Html1.CodeBase();
  Html1.ClassId();
  Html1.Class();
  Html1.Checked();
  Html1.CharSet();
  Html1.CharOff();
  Html1.Char();
  Html1.Challenge();
  Html1.CellSpacing();
  Html1.CellPadding();
  Html1.Buffered();
  Html1.BorderColor();
  Html1.Border();
  Html1.Axis();
  Html1.AutoSave();
  Html1.AutoPlay();
  Html1.AutoFocus();
  Html1.AutoComplete();
  Attributes.Version();
  Attributes.VSpace();
  Attributes.VLink();
  Attributes.Text();
  Attributes.Summary();
  Attributes.Start();
  Attributes.Span();
  Attributes.Prompt();
  Attributes.Optimum();
  Attributes.Open();
  Attributes.Object();
  Attributes.NoWrap();
  Attributes.NoShade();
  Attributes.Min();
  Attributes.Max();
  Attributes.List();
  Attributes.Link();
  Attributes.Language();
  Attributes.Label();
  Attributes.Kind();
  Attributes.KeyType();
  Attributes.HSpace();
  Attributes.Frame();
  Attributes.Form();
  Attributes.Face();
  Attributes.Dir();
  Attributes.DateTime();
  Attributes.Data();
  Attributes.Controls();
  Attributes.Content();
  Attributes.Compact();
  Attributes.Color();
  Attributes.Code();
  Attributes.Clear();
  Attributes.Cite();
  Attributes.BgColor();
  Attributes.Background();
  Attributes.Async();
  Attributes.Alink();
  Attributes.Action();
  Html1.Archive();
  Html1.AltCode();
  Html1.Alt();
  Html1.Align();
  Html1.AccessKey();
  Html1.AcceptCharSet();
  Html1.Accept();
  Easings.CubicInOut();
  DomUtility.Doc();
  Attrs.EmptyAttr();
  Fresh.counter();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Arrays,ok,Unchecked,console,Testing,Pervasives,TestBuilder,test,Random,Math,NaN1,Infinity1,List,String,Seq;
 Runtime.Define(Global,{
  WebSharper:{
   Testing:{
    Assert:{
     For:function(times,gen,attempt)
     {
      var i,i1;
      for(i=0;i<=Arrays.length(gen.Base)-1;i++){
       attempt(Arrays.get(gen.Base,i));
      }
      for(i1=1;i1<=times;i1++){
       attempt(gen.Next.call(null,null));
      }
      return;
     },
     Raises:function(f)
     {
      var _,matchValue;
      try
      {
       f(null);
       _=ok(false,"Assert raises exception test failed.");
      }
      catch(matchValue)
      {
       _=ok(true,"Pass.");
      }
      return _;
     }
    },
    Pervasives:{
     Is:function(a,b)
     {
      var _,ps;
      if(!Unchecked.Equals(a,b))
       {
        ps=[a,b];
        if(console)
         {
          console.log.apply(console,["Equality test failed."].concat(ps));
         }
        _=ok(false,"Equality test failed.");
       }
      else
       {
        _=ok(true,"Pass.");
       }
      return _;
     },
     Isnt:function(a,b)
     {
      var _,ps;
      if(Unchecked.Equals(a,b))
       {
        ps=[a,b];
        if(console)
         {
          console.log.apply(console,["Inequality test failed."].concat(ps));
         }
        _=ok(false,"Inequality test failed.");
       }
      else
       {
        _=ok(true,"Pass.");
       }
      return _;
     },
     Test:function(name)
     {
      return TestBuilder.New(name);
     },
     TestBuilder:Runtime.Class({
      Delay:function(f)
      {
       return test(this.name,f);
      },
      Zero:function()
      {
       return null;
      }
     },{
      New:function(name)
      {
       var r;
       r=Runtime.New(this,{});
       r.name=name;
       return r;
      }
     })
    },
    Random:{
     ArrayOf:function(generator)
     {
      return{
       Base:[[]],
       Next:function()
       {
        var len;
        len=Random.Natural().Next.call(null,null)%100;
        return Arrays.init(len,function()
        {
         return generator.Next.call(null,null);
        });
       }
      };
     },
     Boolean:Runtime.Field(function()
     {
      return{
       Base:[true,false],
       Next:function()
       {
        return Random.StandardUniform().Next.call(null,null)>0.5;
       }
      };
     }),
     Const:function(x)
     {
      return{
       Base:[x],
       Next:function()
       {
        return x;
       }
      };
     },
     Exponential:function(lambda)
     {
      return{
       Base:[],
       Next:function()
       {
        var p;
        p=Random.StandardUniform().Next.call(null,null);
        return-Math.log(1-p)/lambda;
       }
      };
     },
     Float:Runtime.Field(function()
     {
      return{
       Base:[0],
       Next:function()
       {
        var sign;
        sign=Random.Boolean().Next.call(null,null)?1:-1;
        return sign*Random.Exponential(0.1).Next.call(null,null);
       }
      };
     }),
     FloatExhaustive:Runtime.Field(function()
     {
      return{
       Base:[0,NaN1,Infinity1,-Infinity1],
       Next:function()
       {
        return Random.Float().Next.call(null,null);
       }
      };
     }),
     FloatWithin:function(low,hi)
     {
      return{
       Base:[low,hi],
       Next:function()
       {
        return low+(hi-low)*Math.random();
       }
      };
     },
     Implies:function(a,b)
     {
      return!a?true:b;
     },
     Imply:function(a,b)
     {
      return Random.Implies(a,b);
     },
     Int:Runtime.Field(function()
     {
      return{
       Base:[0,1,-1],
       Next:function()
       {
        return Math.round(Random.Float().Next.call(null,null));
       }
      };
     }),
     ListOf:function(generator)
     {
      var f,gen;
      f=function(array)
      {
       return List.ofArray(array);
      };
      gen=Random.ArrayOf(generator);
      return Random.Map(f,gen);
     },
     Map:function(f,gen)
     {
      var f1;
      f1=gen.Next;
      return{
       Base:Arrays.map(f,gen.Base),
       Next:function(x)
       {
        return f(f1(x));
       }
      };
     },
     Mix:function(a,b)
     {
      var left;
      left=[false];
      return{
       Base:a.Base.concat(b.Base),
       Next:function()
       {
        left[0]=!left[0];
        return left[0]?a.Next.call(null,null):b.Next.call(null,null);
       }
      };
     },
     Natural:Runtime.Field(function()
     {
      var g;
      g=Random.Int().Next;
      return{
       Base:[0,1],
       Next:function(x)
       {
        var value;
        value=g(x);
        return Math.abs(value);
       }
      };
     }),
     OneOf:function(seeds)
     {
      var index;
      index=Random.Within(1,Arrays.length(seeds));
      return{
       Base:seeds,
       Next:function()
       {
        return Arrays.get(seeds,index.Next.call(null,null)-1);
       }
      };
     },
     OptionOf:function(generator)
     {
      return Random.Mix(Random.Const({
       $:0
      }),Random.Map(function(arg0)
      {
       return{
        $:1,
        $0:arg0
       };
      },generator));
     },
     StandardUniform:Runtime.Field(function()
     {
      return{
       Base:[],
       Next:function()
       {
        return Math.random();
       }
      };
     }),
     String:Runtime.Field(function()
     {
      return{
       Base:[""],
       Next:function()
       {
        var len,cs;
        len=Random.Natural().Next.call(null,null)%100;
        cs=Arrays.init(len,function()
        {
         return Random.Int().Next.call(null,null)%256;
        });
        return String.fromCharCode.apply(undefined,cs);
       }
      };
     }),
     StringExhaustive:Runtime.Field(function()
     {
      return{
       Base:[null,""],
       Next:Random.String().Next
      };
     }),
     Tuple2Of:function(a,b)
     {
      return{
       Base:Seq.toArray(Seq.delay(function()
       {
        return Seq.collect(function(x)
        {
         return Seq.map(function(y)
         {
          return[x,y];
         },b.Base);
        },a.Base);
       })),
       Next:function()
       {
        return[a.Next.call(null,null),b.Next.call(null,null)];
       }
      };
     },
     Tuple3Of:function(a,b,c)
     {
      return{
       Base:Seq.toArray(Seq.delay(function()
       {
        return Seq.collect(function(x)
        {
         return Seq.collect(function(y)
         {
          return Seq.map(function(z)
          {
           return[x,y,z];
          },c.Base);
         },b.Base);
        },a.Base);
       })),
       Next:function()
       {
        return[a.Next.call(null,null),b.Next.call(null,null),c.Next.call(null,null)];
       }
      };
     },
     Within:function(low,hi)
     {
      return{
       Base:[low,hi],
       Next:function()
       {
        return Random.Natural().Next.call(null,null)%(hi-low)+low;
       }
      };
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  ok=Runtime.Safe(Global.ok);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  console=Runtime.Safe(Global.console);
  Testing=Runtime.Safe(Global.WebSharper.Testing);
  Pervasives=Runtime.Safe(Testing.Pervasives);
  TestBuilder=Runtime.Safe(Pervasives.TestBuilder);
  test=Runtime.Safe(Global.test);
  Random=Runtime.Safe(Testing.Random);
  Math=Runtime.Safe(Global.Math);
  NaN1=Runtime.Safe(Global.NaN);
  Infinity1=Runtime.Safe(Global.Infinity);
  List=Runtime.Safe(Global.WebSharper.List);
  String=Runtime.Safe(Global.String);
  return Seq=Runtime.Safe(Global.WebSharper.Seq);
 });
 Runtime.OnLoad(function()
 {
  Random.StringExhaustive();
  Random.String();
  Random.StandardUniform();
  Random.Natural();
  Random.Int();
  Random.FloatExhaustive();
  Random.Float();
  Random.Boolean();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Unchecked,Seq,Option,Control,Disposable,Arrays,FSharpEvent,Util,Event,Event1,Collections,ResizeArray,ResizeArrayProxy,EventModule,HotStream,HotStream1,Concurrency,Operators,Error,setTimeout,clearTimeout,LinkedList,T,MailboxProcessor,Observable,Observer,Ref,Observable1,List,T1,Observer1;
 Runtime.Define(Global,{
  WebSharper:{
   Control:{
    Disposable:{
     Of:function(dispose)
     {
      return{
       Dispose:dispose
      };
     }
    },
    Event:{
     Event:Runtime.Class({
      AddHandler:function(h)
      {
       return this.Handlers.Add(h);
      },
      RemoveHandler:function(h)
      {
       var predicate,objectArg,action,source,option;
       predicate=function(y)
       {
        return Unchecked.Equals(h,y);
       };
       objectArg=this.Handlers;
       action=function(arg00)
       {
        return objectArg.RemoveAt(arg00);
       };
       source=this.Handlers;
       option=Seq.tryFindIndex(predicate,source);
       return Option.iter(action,option);
      },
      Subscribe:function(observer)
      {
       var h,_this=this;
       h=function(x)
       {
        return observer.OnNext(x);
       };
       this.AddHandler(h);
       return Disposable.Of(function()
       {
        return _this.RemoveHandler(h);
       });
      },
      Trigger:function(x)
      {
       var arr,idx,h;
       arr=this.Handlers.ToArray();
       for(idx=0;idx<=arr.length-1;idx++){
        h=Arrays.get(arr,idx);
        h(x);
       }
       return;
      }
     })
    },
    EventModule:{
     Choose:function(c,e)
     {
      var r;
      r=FSharpEvent.New();
      Util.addListener(e,function(x)
      {
       var matchValue,_,y;
       matchValue=c(x);
       if(matchValue.$==0)
        {
         _=null;
        }
       else
        {
         y=matchValue.$0;
         _=r.event.Trigger(y);
        }
       return _;
      });
      return r.event;
     },
     Filter:function(ok,e)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       return ok(x)?r.Trigger(x):null;
      });
      return r;
     },
     Map:function(f,e)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       return r.Trigger(f(x));
      });
      return r;
     },
     Merge:function(e1,e2)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e1,function(arg00)
      {
       return r.Trigger(arg00);
      });
      Util.addListener(e2,function(arg00)
      {
       return r.Trigger(arg00);
      });
      return r;
     },
     Pairwise:function(e)
     {
      var buf,ev;
      buf=[{
       $:0
      }];
      ev=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       var matchValue,_,old;
       matchValue=buf[0];
       if(matchValue.$==1)
        {
         old=matchValue.$0;
         buf[0]={
          $:1,
          $0:x
         };
         _=ev.Trigger([old,x]);
        }
       else
        {
         _=void(buf[0]={
          $:1,
          $0:x
         });
        }
       return _;
      });
      return ev;
     },
     Partition:function(f,e)
     {
      return[EventModule.Filter(f,e),EventModule.Filter(function(x)
      {
       var value;
       value=f(x);
       return!value;
      },e)];
     },
     Scan:function(fold,seed,e)
     {
      var state,f;
      state=[seed];
      f=function(value)
      {
       state[0]=(fold(state[0]))(value);
       return state[0];
      };
      return EventModule.Map(f,e);
     },
     Split:function(f,e)
     {
      var chooser,chooser1;
      chooser=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==0)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      chooser1=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==1)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      return[EventModule.Choose(chooser,e),EventModule.Choose(chooser1,e)];
     }
    },
    FSharpEvent:Runtime.Class({},{
     New:function()
     {
      var r;
      r=Runtime.New(this,{});
      r.event=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      return r;
     }
    }),
    HotStream:{
     HotStream:Runtime.Class({
      Subscribe:function(o)
      {
       var disp;
       this.Latest[0].$==1?o.OnNext(this.Latest[0].$0):null;
       disp=Util.subscribeTo(this.Event.event,function(v)
       {
        return o.OnNext(v);
       });
       return disp;
      },
      Trigger:function(v)
      {
       this.Latest[0]={
        $:1,
        $0:v
       };
       return this.Event.event.Trigger(v);
      }
     },{
      New:function()
      {
       return Runtime.New(HotStream1,{
        Latest:[{
         $:0
        }],
        Event:FSharpEvent.New()
       });
      }
     })
    },
    MailboxProcessor:Runtime.Class({
     PostAndAsyncReply:function(msgf,timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.PostAndTryAsyncReply(msgf,timeout),function(_arg4)
       {
        var _,x;
        if(_arg4.$==1)
         {
          x=_arg4.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(new Error("TimeoutException"));
         }
        return Concurrency.Return(_);
       });
      });
     },
     PostAndTryAsyncReply:function(msgf,timeout)
     {
      var timeout1,arg00,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      arg00=function(tupledArg)
      {
       var ok,_arg3,_arg4,_,arg001,waiting,arg002,value;
       ok=tupledArg[0];
       _arg3=tupledArg[1];
       _arg4=tupledArg[2];
       if(timeout1<0)
        {
         arg001=msgf(function(x)
         {
          return ok({
           $:1,
           $0:x
          });
         });
         _this.mailbox.AddLast(arg001);
         _=_this.resume();
        }
       else
        {
         waiting=[true];
         arg002=msgf(function(res)
         {
          var _1;
          if(waiting[0])
           {
            waiting[0]=false;
            _1=ok({
             $:1,
             $0:res
            });
           }
          else
           {
            _1=null;
           }
          return _1;
         });
         _this.mailbox.AddLast(arg002);
         _this.resume();
         value=setTimeout(function()
         {
          var _1;
          if(waiting[0])
           {
            waiting[0]=false;
            _1=ok({
             $:0
            });
           }
          else
           {
            _1=null;
           }
          return _1;
         },timeout1);
         _=void value;
        }
       return _;
      };
      return Concurrency.FromContinuations(arg00);
     },
     Receive:function(timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.TryReceive(timeout),function(_arg3)
       {
        var _,x;
        if(_arg3.$==1)
         {
          x=_arg3.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(new Error("TimeoutException"));
         }
        return Concurrency.Return(_);
       });
      });
     },
     Scan:function(scanner,timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.TryScan(scanner,timeout),function(_arg8)
       {
        var _,x;
        if(_arg8.$==1)
         {
          x=_arg8.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(new Error("TimeoutException"));
         }
        return Concurrency.Return(_);
       });
      });
     },
     Start:function()
     {
      var _,a,_this=this;
      if(this.started)
       {
        _=Operators.FailWith("The MailboxProcessor has already been started.");
       }
      else
       {
        this.started=true;
        a=Concurrency.Delay(function()
        {
         return Concurrency.TryWith(Concurrency.Delay(function()
         {
          return Concurrency.Bind(_this.initial.call(null,_this),function()
          {
           return Concurrency.Return(null);
          });
         }),function(_arg2)
         {
          _this.errorEvent.event.Trigger(_arg2);
          return Concurrency.Return(null);
         });
        });
        _=_this.startAsync(a);
       }
      return _;
     },
     TryReceive:function(timeout)
     {
      var timeout1,arg00,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      arg00=function(tupledArg)
      {
       var ok,_arg1,_arg2,_,_1,arg0,waiting,pending,arg02,arg03;
       ok=tupledArg[0];
       _arg1=tupledArg[1];
       _arg2=tupledArg[2];
       if(Unchecked.Equals(_this.mailbox.get_First(),null))
        {
         if(timeout1<0)
          {
           arg0=Concurrency.Delay(function()
           {
            var arg01;
            arg01=_this.dequeue();
            ok({
             $:1,
             $0:arg01
            });
            return Concurrency.Return(null);
           });
           _1=void(_this.savedCont={
            $:1,
            $0:arg0
           });
          }
         else
          {
           waiting=[true];
           pending=setTimeout(function()
           {
            var _2;
            if(waiting[0])
             {
              waiting[0]=false;
              _this.savedCont={
               $:0
              };
              _2=ok({
               $:0
              });
             }
            else
             {
              _2=null;
             }
            return _2;
           },timeout1);
           arg02=Concurrency.Delay(function()
           {
            var _2,arg01;
            if(waiting[0])
             {
              waiting[0]=false;
              clearTimeout(pending);
              arg01=_this.dequeue();
              ok({
               $:1,
               $0:arg01
              });
              _2=Concurrency.Return(null);
             }
            else
             {
              _2=Concurrency.Return(null);
             }
            return _2;
           });
           _1=void(_this.savedCont={
            $:1,
            $0:arg02
           });
          }
         _=_1;
        }
       else
        {
         arg03=_this.dequeue();
         _=ok({
          $:1,
          $0:arg03
         });
        }
       return _;
      };
      return Concurrency.FromContinuations(arg00);
     },
     TryScan:function(scanner,timeout)
     {
      var timeout1,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      return Concurrency.Delay(function()
      {
       var scanInbox,matchValue1,_1,found1,arg00;
       scanInbox=function()
       {
        var m,found,matchValue,_;
        m=_this.mailbox.get_First();
        found={
         $:0
        };
        while(!Unchecked.Equals(m,null))
         {
          matchValue=scanner(m.v);
          if(matchValue.$==0)
           {
            _=m=m.n;
           }
          else
           {
            _this.mailbox.Remove(m);
            m=null;
            _=found=matchValue;
           }
         }
        return found;
       };
       matchValue1=scanInbox(null);
       if(matchValue1.$==1)
        {
         found1=matchValue1.$0;
         _1=Concurrency.Bind(found1,function(_arg5)
         {
          return Concurrency.Return({
           $:1,
           $0:_arg5
          });
         });
        }
       else
        {
         arg00=function(tupledArg)
         {
          var ok,_arg5,_arg6,_,scanNext,waiting,pending,scanNext1;
          ok=tupledArg[0];
          _arg5=tupledArg[1];
          _arg6=tupledArg[2];
          if(timeout1<0)
           {
            scanNext=function()
            {
             var arg0;
             arg0=Concurrency.Delay(function()
             {
              var matchValue,_2,c;
              matchValue=scanner(_this.mailbox.get_First().v);
              if(matchValue.$==1)
               {
                c=matchValue.$0;
                _this.mailbox.RemoveFirst();
                _2=Concurrency.Bind(c,function(_arg61)
                {
                 ok({
                  $:1,
                  $0:_arg61
                 });
                 return Concurrency.Return(null);
                });
               }
              else
               {
                scanNext(null);
                _2=Concurrency.Return(null);
               }
              return _2;
             });
             _this.savedCont={
              $:1,
              $0:arg0
             };
             return;
            };
            _=scanNext(null);
           }
          else
           {
            waiting=[true];
            pending=setTimeout(function()
            {
             var _2;
             if(waiting[0])
              {
               waiting[0]=false;
               _this.savedCont={
                $:0
               };
               _2=ok({
                $:0
               });
              }
             else
              {
               _2=null;
              }
             return _2;
            },timeout1);
            scanNext1=function()
            {
             var arg0;
             arg0=Concurrency.Delay(function()
             {
              var matchValue,_2,c;
              matchValue=scanner(_this.mailbox.get_First().v);
              if(matchValue.$==1)
               {
                c=matchValue.$0;
                _this.mailbox.RemoveFirst();
                _2=Concurrency.Bind(c,function(_arg7)
                {
                 var _3;
                 if(waiting[0])
                  {
                   waiting[0]=false;
                   clearTimeout(pending);
                   ok({
                    $:1,
                    $0:_arg7
                   });
                   _3=Concurrency.Return(null);
                  }
                 else
                  {
                   _3=Concurrency.Return(null);
                  }
                 return _3;
                });
               }
              else
               {
                scanNext1(null);
                _2=Concurrency.Return(null);
               }
              return _2;
             });
             _this.savedCont={
              $:1,
              $0:arg0
             };
             return;
            };
            _=scanNext1(null);
           }
          return _;
         };
         _1=Concurrency.FromContinuations(arg00);
        }
       return _1;
      });
     },
     dequeue:function()
     {
      var f;
      f=this.mailbox.get_First().v;
      this.mailbox.RemoveFirst();
      return f;
     },
     get_CurrentQueueLength:function()
     {
      return this.mailbox.get_Count();
     },
     get_DefaultTimeout:function()
     {
      return this["DefaultTimeout@"];
     },
     get_Error:function()
     {
      return this.errorEvent.event;
     },
     resume:function()
     {
      var matchValue,_,c;
      matchValue=this.savedCont;
      if(matchValue.$==1)
       {
        c=matchValue.$0;
        this.savedCont={
         $:0
        };
        _=this.startAsync(c);
       }
      else
       {
        _=null;
       }
      return _;
     },
     set_DefaultTimeout:function(v)
     {
      this["DefaultTimeout@"]=v;
      return;
     },
     startAsync:function(a)
     {
      return Concurrency.Start(a,this.token);
     }
    },{
     New:function(initial,token)
     {
      var r,matchValue,_,ct,value;
      r=Runtime.New(this,{});
      r.initial=initial;
      r.token=token;
      r.started=false;
      r.errorEvent=FSharpEvent.New();
      r.mailbox=T.New();
      r.savedCont={
       $:0
      };
      matchValue=r.token;
      if(matchValue.$==0)
       {
        _=null;
       }
      else
       {
        ct=matchValue.$0;
        value=Concurrency.Register(ct,function()
        {
         return function()
         {
          return r.resume();
         }();
        });
        _=void value;
       }
      r["DefaultTimeout@"]=-1;
      return r;
     },
     Start:function(initial,token)
     {
      var mb;
      mb=MailboxProcessor.New(initial,token);
      mb.Start();
      return mb;
     }
    }),
    Observable:{
     Aggregate:function(io,seed,fold)
     {
      var f;
      f=function(o1)
      {
       var state,on,arg001;
       state=[seed];
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return(fold(state[0]))(v);
        },function(s)
        {
         state[0]=s;
         return o1.OnNext(s);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f);
     },
     Choose:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        var action;
        action=function(arg00)
        {
         return o1.OnNext(arg00);
        };
        return Observable.Protect(function()
        {
         return f(v);
        },function(option)
        {
         return Option.iter(action,option);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     CombineLatest:function(io1,io2,f)
     {
      var f1;
      f1=function(o)
      {
       var lv1,lv2,update,onNext,o1,onNext1,o2,d1,d2;
       lv1=[{
        $:0
       }];
       lv2=[{
        $:0
       }];
       update=function()
       {
        var matchValue,_,_1,v1,v2;
        matchValue=[lv1[0],lv2[0]];
        if(matchValue[0].$==1)
         {
          if(matchValue[1].$==1)
           {
            v1=matchValue[0].$0;
            v2=matchValue[1].$0;
            _1=Observable.Protect(function()
            {
             return(f(v1))(v2);
            },function(arg00)
            {
             return o.OnNext(arg00);
            },function(arg00)
            {
             return o.OnError(arg00);
            });
           }
          else
           {
            _1=null;
           }
          _=_1;
         }
        else
         {
          _=null;
         }
        return _;
       };
       onNext=function(x)
       {
        lv1[0]={
         $:1,
         $0:x
        };
        return update(null);
       };
       o1=Observer.New(onNext,function()
       {
       },function()
       {
       });
       onNext1=function(y)
       {
        lv2[0]={
         $:1,
         $0:y
        };
        return update(null);
       };
       o2=Observer.New(onNext1,function()
       {
       },function()
       {
       });
       d1=io1.Subscribe(o1);
       d2=io2.Subscribe(o2);
       return Disposable.Of(function()
       {
        d1.Dispose();
        return d2.Dispose();
       });
      };
      return Observable.New(f1);
     },
     Concat:function(io1,io2)
     {
      var f;
      f=function(o)
      {
       var innerDisp,outerDisp,dispose;
       innerDisp=[{
        $:0
       }];
       outerDisp=io1.Subscribe(Observer.New(function(arg00)
       {
        return o.OnNext(arg00);
       },function()
       {
       },function()
       {
        var arg0;
        arg0=io2.Subscribe(o);
        innerDisp[0]={
         $:1,
         $0:arg0
        };
       }));
       dispose=function()
       {
        innerDisp[0].$==1?innerDisp[0].$0.Dispose():null;
        return outerDisp.Dispose();
       };
       return Disposable.Of(dispose);
      };
      return Observable.New(f);
     },
     Drop:function(count,io)
     {
      var f;
      f=function(o1)
      {
       var index,on,arg00;
       index=[0];
       on=function(v)
       {
        Ref.incr(index);
        return index[0]>count?o1.OnNext(v):null;
       };
       arg00=Observer.New(on,function(arg001)
       {
        return o1.OnError(arg001);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg00);
      };
      return Observable.New(f);
     },
     Filter:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        var action;
        action=function(arg00)
        {
         return o1.OnNext(arg00);
        };
        return Observable.Protect(function()
        {
         return f(v)?{
          $:1,
          $0:v
         }:{
          $:0
         };
        },function(option)
        {
         return Option.iter(action,option);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     Map:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return f(v);
        },function(arg00)
        {
         return o1.OnNext(arg00);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     Merge:function(io1,io2)
     {
      var f;
      f=function(o)
      {
       var completed1,completed2,arg00,disp1,arg002,disp2;
       completed1=[false];
       completed2=[false];
       arg00=Observer.New(function(arg001)
       {
        return o.OnNext(arg001);
       },function()
       {
       },function()
       {
        completed1[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       });
       disp1=io1.Subscribe(arg00);
       arg002=Observer.New(function(arg001)
       {
        return o.OnNext(arg001);
       },function()
       {
       },function()
       {
        completed2[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       });
       disp2=io2.Subscribe(arg002);
       return Disposable.Of(function()
       {
        disp1.Dispose();
        return disp2.Dispose();
       });
      };
      return Observable.New(f);
     },
     Never:function()
     {
      return Observable.New(function()
      {
       return Disposable.Of(function()
       {
       });
      });
     },
     New:function(f)
     {
      return Runtime.New(Observable1,{
       Subscribe1:f
      });
     },
     Observable:Runtime.Class({
      Subscribe:function(observer)
      {
       return this.Subscribe1.call(null,observer);
      }
     }),
     Of:function(f)
     {
      return Observable.New(function(o)
      {
       return Disposable.Of(f(function(x)
       {
        return o.OnNext(x);
       }));
      });
     },
     Protect:function(f,succeed,fail)
     {
      var matchValue,_,e,_1,e1,x;
      try
      {
       _={
        $:0,
        $0:f(null)
       };
      }
      catch(e)
      {
       _={
        $:1,
        $0:e
       };
      }
      matchValue=_;
      if(matchValue.$==1)
       {
        e1=matchValue.$0;
        _1=fail(e1);
       }
      else
       {
        x=matchValue.$0;
        _1=succeed(x);
       }
      return _1;
     },
     Range:function(start,count)
     {
      var f;
      f=function(o)
      {
       var i;
       for(i=start;i<=start+count;i++){
        o.OnNext(i);
       }
       return Disposable.Of(function()
       {
       });
      };
      return Observable.New(f);
     },
     Return:function(x)
     {
      var f;
      f=function(o)
      {
       o.OnNext(x);
       o.OnCompleted();
       return Disposable.Of(function()
       {
       });
      };
      return Observable.New(f);
     },
     SelectMany:function(io)
     {
      return Observable.New(function(o)
      {
       var disp,d;
       disp=[function()
       {
       }];
       d=Util.subscribeTo(io,function(o1)
       {
        var d1;
        d1=Util.subscribeTo(o1,function(v)
        {
         return o.OnNext(v);
        });
        disp[0]=function()
        {
         disp[0].call(null,null);
         return d1.Dispose();
        };
        return;
       });
       return Disposable.Of(function()
       {
        disp[0].call(null,null);
        return d.Dispose();
       });
      });
     },
     Sequence:function(ios)
     {
      var sequence;
      sequence=function(ios1)
      {
       var _,xs,x,rest;
       if(ios1.$==1)
        {
         xs=ios1.$1;
         x=ios1.$0;
         rest=sequence(xs);
         _=Observable.CombineLatest(x,rest,function(x1)
         {
          return function(y)
          {
           return Runtime.New(T1,{
            $:1,
            $0:x1,
            $1:y
           });
          };
         });
        }
       else
        {
         _=Observable.Return(Runtime.New(T1,{
          $:0
         }));
        }
       return _;
      };
      return sequence(List.ofSeq(ios));
     },
     Switch:function(io)
     {
      return Observable.New(function(o)
      {
       var index,disp,disp1;
       index=[0];
       disp=[{
        $:0
       }];
       disp1=Util.subscribeTo(io,function(o1)
       {
        var currentIndex,arg0,d;
        Ref.incr(index);
        disp[0].$==1?disp[0].$0.Dispose():null;
        currentIndex=index[0];
        arg0=Util.subscribeTo(o1,function(v)
        {
         return currentIndex===index[0]?o.OnNext(v):null;
        });
        d={
         $:1,
         $0:arg0
        };
        disp[0]=d;
        return;
       });
       return disp1;
      });
     }
    },
    ObservableModule:{
     Pairwise:function(e)
     {
      var f;
      f=function(o1)
      {
       var last,on,arg00;
       last=[{
        $:0
       }];
       on=function(v)
       {
        var matchValue,_,l;
        matchValue=last[0];
        if(matchValue.$==1)
         {
          l=matchValue.$0;
          _=o1.OnNext([l,v]);
         }
        else
         {
          _=null;
         }
        last[0]={
         $:1,
         $0:v
        };
        return;
       };
       arg00=Observer.New(on,function(arg001)
       {
        return o1.OnError(arg001);
       },function()
       {
        return o1.OnCompleted();
       });
       return e.Subscribe(arg00);
      };
      return Observable.New(f);
     },
     Partition:function(f,e)
     {
      return[Observable.Filter(f,e),Observable.Filter(function(x)
      {
       var value;
       value=f(x);
       return!value;
      },e)];
     },
     Scan:function(fold,seed,e)
     {
      var f;
      f=function(o1)
      {
       var state,on,arg001;
       state=[seed];
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return(fold(state[0]))(v);
        },function(s)
        {
         state[0]=s;
         return o1.OnNext(s);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return e.Subscribe(arg001);
      };
      return Observable.New(f);
     },
     Split:function(f,e)
     {
      var chooser,left,chooser1,right;
      chooser=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==0)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      left=Observable.Choose(chooser,e);
      chooser1=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==1)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      right=Observable.Choose(chooser1,e);
      return[left,right];
     }
    },
    Observer:{
     New:function(f,e,c)
     {
      return Runtime.New(Observer1,{
       onNext:f,
       onError:e,
       onCompleted:c
      });
     },
     Observer:Runtime.Class({
      OnCompleted:function()
      {
       return this.onCompleted.call(null,null);
      },
      OnError:function(e)
      {
       return this.onError.call(null,e);
      },
      OnNext:function(x)
      {
       return this.onNext.call(null,x);
      }
     }),
     Of:function(f)
     {
      return Runtime.New(Observer1,{
       onNext:function(x)
       {
        return f(x);
       },
       onError:function(x)
       {
        return Operators.Raise(x);
       },
       onCompleted:function()
       {
        return null;
       }
      });
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Option=Runtime.Safe(Global.WebSharper.Option);
  Control=Runtime.Safe(Global.WebSharper.Control);
  Disposable=Runtime.Safe(Control.Disposable);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Event=Runtime.Safe(Control.Event);
  Event1=Runtime.Safe(Event.Event);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  EventModule=Runtime.Safe(Control.EventModule);
  HotStream=Runtime.Safe(Control.HotStream);
  HotStream1=Runtime.Safe(HotStream.HotStream);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Error=Runtime.Safe(Global.Error);
  setTimeout=Runtime.Safe(Global.setTimeout);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  T=Runtime.Safe(LinkedList.T);
  MailboxProcessor=Runtime.Safe(Control.MailboxProcessor);
  Observable=Runtime.Safe(Control.Observable);
  Observer=Runtime.Safe(Control.Observer);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  Observable1=Runtime.Safe(Observable.Observable);
  List=Runtime.Safe(Global.WebSharper.List);
  T1=Runtime.Safe(List.T);
  return Observer1=Runtime.Safe(Observer.Observer);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,UI,Next,Interpolation1,Easing,AnimatedBobsleighSite,An,Trans1,Trans,Var,Doc,List,Html,Utilities,T,View,Attr,Unchecked,Samples,AnimatedContactFlow,Flow,Flow1,BobsleighSite,Calculator,Var1,CheckBoxTest,Seq,Person,Site,SimpleTextBox,InputTransform,TodoList,PhoneExample,EditablePersonList,ContactFlow,MessageBoard,RoutedBobsleighSite,ObjectConstancy,MouseInfo,KeyboardInfo,Common,Fresh,String,Strings,Arrays,Input,Keyboard,Auth,Concurrency,Server,Mouse,jQuery,DataSet,Slice,SvgElements,Math,Phone,Operators,Order,RouteMap1,Builder,Router,Router1,SiteCommon,Option,Collections,MapModule,FSharpMap,SortableBarChart,parseFloat,ListModel,Util,TodoItem,Key,ListModel1,Client;
 Runtime.Define(Global,{
  WebSharper:{
   UI:{
    Next:{
     AnimatedBobsleighSite:{
      Fade:Runtime.Field(function()
      {
       var _arg00_45_6,_arg10_45_6,arg20;
       _arg00_45_6=Interpolation1.get_Double();
       _arg10_45_6=Easing.get_CubicInOut();
       arg20=AnimatedBobsleighSite.fadeTime();
       return function(arg30)
       {
        return function(arg40)
        {
         return An.Simple(_arg00_45_6,_arg10_45_6,arg20,arg30,arg40);
        };
       };
      }),
      FadeTransition:Runtime.Field(function()
      {
       return Trans1.Exit(function()
       {
        return((AnimatedBobsleighSite.Fade())(1))(0);
       },Trans1.Enter(function()
       {
        return((AnimatedBobsleighSite.Fade())(0))(1);
       },Trans.Create(AnimatedBobsleighSite.Fade())));
      }),
      GlobalGo:function(_var,act)
      {
       return Var.Set(_var,act);
      },
      Governance:function()
      {
       return Doc.Concat(List.ofArray([Html.Div0(List.ofArray([Html.H10(List.ofArray([Utilities.txt("Governance")])),Html.P0(List.ofArray([Utilities.txt("The sport is overseen by the "),Utilities.href("International Bobsleigh and Skeleton Federation","http://www.fibt.com/"),Utilities.txt(", an organisation founded in 1923. The organisation governs all international competitions, acting as a body to regulate athletes' conduct, as well as providing funding for training and education.")]))]))]));
      },
      History:function()
      {
       return Doc.Concat(List.ofArray([Html.Div0(List.ofArray([Html.H10(List.ofArray([Utilities.txt("History")])),Html.P0(List.ofArray([Utilities.txt("According to "),Utilities.href("Wikipedia","http://en.wikipedia.org/wiki/Bobsleigh"),Utilities.txt(", the beginnings of bobsleigh came about due to a hotelier becoming increasingly frustrated about having entire seasons where he could not rent out his properties. In response, he got a few people interested, and the Swiss town of St Moritz became the home of the first bobsleigh races.")])),Html.P0(List.ofArray([Utilities.txt("Bobsleigh races have been a regular event at the Winter Olympics since the very first competition in 1924.")]))]))]));
      },
      HomePage:function(ctx)
      {
       return Doc.Concat(List.ofArray([Html.Div0(List.ofArray([Html.H10(List.ofArray([Utilities.txt("Welcome!")])),Html.P0(List.ofArray([Utilities.txt("Welcome to the IntelliFactory Bobsleigh MiniSite!")])),Html.P0(List.ofArray([Utilities.txt("Here you can find out about the "),Utilities.link("history",Runtime.New(T,{
        $:0
       }),function()
       {
        return ctx.Go.call(null,{
         $:1
        });
       }),Utilities.txt(" of bobsleighs, the "),Utilities.link("International Bobsleigh and Skeleton Federation",Runtime.New(T,{
        $:0
       }),function()
       {
        return ctx.Go.call(null,{
         $:2
        });
       }),Utilities.txt(", which serve as the governing body for the sport, and finally the world-famous "),Utilities.link("IntelliFactory Bobsleigh Team.",Runtime.New(T,{
        $:0
       }),function()
       {
        return ctx.Go.call(null,{
         $:3
        });
       })]))]))]));
      },
      Main:function()
      {
       var m,ctx;
       m=Var.Create({
        $:0
       });
       ctx={
        Go:function(arg10)
        {
         return Var.Set(m,arg10);
        }
       };
       return Doc.EmbedView(View.Map(function(pg)
       {
        return AnimatedBobsleighSite.MakePage(m,pg.$==1?AnimatedBobsleighSite.History(ctx):pg.$==2?AnimatedBobsleighSite.Governance(ctx):pg.$==3?AnimatedBobsleighSite.Team(ctx):AnimatedBobsleighSite.HomePage(ctx));
       },View.FromVar(m)));
      },
      MakePage:function(_var,pg)
      {
       var arg30;
       arg30=function(value)
       {
        return Global.String(value);
       };
       return Doc.Concat(List.ofArray([AnimatedBobsleighSite.NavBar(_var),Html.Div(List.ofArray([Attr.AnimatedStyle("opacity",AnimatedBobsleighSite.FadeTransition(),View.Const(1),arg30)]),List.ofArray([pg]))]));
      },
      NavBar:function(_var)
      {
       var x;
       x=View.FromVar(_var);
       return Doc.EmbedView(View.Map(function(active)
       {
        var renderLink;
        renderLink=function(action)
        {
         return Html.LI(List.ofArray([Unchecked.Equals(action,active)?Utilities.cls("active"):Attr.get_Empty()]),List.ofArray([Utilities.link(AnimatedBobsleighSite.showAct(action),Runtime.New(T,{
          $:0
         }),function()
         {
          return AnimatedBobsleighSite.GlobalGo(_var,action);
         })]));
        };
        return Html.Nav(List.ofArray([Utilities.cls("navbar"),Utilities.cls("navbar-default"),Attr.Create("role","navigation")]),List.ofArray([Html.UL(List.ofArray([Utilities.cls("nav"),Utilities.cls("navbar-nav")]),List.ofArray([Doc.Concat(List.map(renderLink,AnimatedBobsleighSite.pages()))]))]));
       },x));
      },
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("AnimatedBobsleighSite").FileName("AnimatedBobsleighSite.fs").Keywords(List.ofArray(["text"])).Render(function()
       {
        return AnimatedBobsleighSite.Main();
       }).RenderDescription(function()
       {
        return AnimatedBobsleighSite.description();
       }).Create();
      }),
      Team:function()
      {
       var teamMembers;
       teamMembers=List.ofArray([["Adam","granicz"],["András","AndrasJanko"],["Anton (honourary member for life)","t0yv0"],["István","inchester23"],["Loic","tarmil_"],["Sándor","sandorrakonczai"],["Simon","Simon_JF"]]);
       return Doc.Concat(List.ofArray([Html.Div0(List.ofArray([Html.H10(List.ofArray([Utilities.txt("The IntelliFactory Bobsleigh Team")])),Html.P0(List.ofArray([Utilities.txt("The world-famous IntelliFactory Bobsleigh Team was founded in 2004, and currently consists of:")])),Html.UL0(List.ofArray([Doc.Concat(List.map(function(tupledArg)
       {
        return Html.LI0(List.ofArray([Utilities.href(tupledArg[0],"http://www.twitter.com/"+tupledArg[1])]));
       },teamMembers))]))]))]));
      },
      description:function()
      {
       return Html.Div0(List.ofArray([Utilities.txt("A small website about bobsleighs, demonstrating how UI.Next may be used to structure single-page applications.")]));
      },
      fadeTime:Runtime.Field(function()
      {
       return 300;
      }),
      pages:Runtime.Field(function()
      {
       return List.ofArray([{
        $:0
       },{
        $:1
       },{
        $:2
       },{
        $:3
       }]);
      }),
      showAct:function(_arg1)
      {
       return _arg1.$==1?"History":_arg1.$==2?"Governance":_arg1.$==3?"The IntelliFactory Bobsleigh Team":"Home";
      }
     },
     AnimatedContactFlow:{
      AnimateFlow:function(pg)
      {
       var arg30,arg301;
       arg30=function(value)
       {
        return Global.String(value);
       };
       arg301=function(x)
       {
        return Global.String(x)+"px";
       };
       return Html.Div(List.ofArray([Attr.Style("position","relative"),Attr.AnimatedStyle("opacity",AnimatedContactFlow.FadeTransition(),View.Const(1),arg30),Attr.AnimatedStyle("left",AnimatedContactFlow.SwipeTransition(),View.Const(0),arg301)]),List.ofArray([pg]));
      },
      Description:function()
      {
       return Html.Div0(List.ofArray([Doc.TextNode("A WS.UI.Next flowlet implementation.")]));
      },
      ExampleFlow:function()
      {
       var _builder_;
       _builder_=Flow.get_Do();
       return Flow.Embed(_builder_.Bind(AnimatedContactFlow.personFlowlet(),function(_arg1)
       {
        return _builder_.Bind(AnimatedContactFlow.contactTypeFlowlet(),function(_arg2)
        {
         return _builder_.Bind(AnimatedContactFlow.contactFlowlet(_arg2),function(_arg3)
         {
          return _builder_.ReturnFrom(Flow1.Static(AnimatedContactFlow.finalPage(_arg1,_arg3)));
         });
        });
       }));
      },
      Fade:Runtime.Field(function()
      {
       var _arg00_58_11,_arg10_58_11,arg20;
       _arg00_58_11=Interpolation1.get_Double();
       _arg10_58_11=Easing.get_CubicInOut();
       arg20=AnimatedContactFlow.fadeTime();
       return function(arg30)
       {
        return function(arg40)
        {
         return An.Simple(_arg00_58_11,_arg10_58_11,arg20,arg30,arg40);
        };
       };
      }),
      FadeTransition:Runtime.Field(function()
      {
       return Trans1.Exit(function()
       {
        return((AnimatedContactFlow.Fade())(1))(0);
       },Trans1.Enter(function()
       {
        return((AnimatedContactFlow.Fade())(0))(1);
       },Trans.Create(AnimatedContactFlow.Fade())));
      }),
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("AnimatedContactFlow").FileName("AnimatedContactFlow.fs").Keywords(List.ofArray(["flowlet"])).Render(function()
       {
        return AnimatedContactFlow.ExampleFlow();
       }).RenderDescription(function()
       {
        return AnimatedContactFlow.Description();
       }).Create();
      }),
      Swipe:Runtime.Field(function()
      {
       var _arg00_73_9,_arg10_73_9,arg20;
       _arg00_73_9=Interpolation1.get_Double();
       _arg10_73_9=Easing.get_CubicInOut();
       arg20=AnimatedContactFlow.swipeTime();
       return function(arg30)
       {
        return function(arg40)
        {
         return An.Simple(_arg00_73_9,_arg10_73_9,arg20,arg30,arg40);
        };
       };
      }),
      SwipeTransition:Runtime.Field(function()
      {
       return Trans1.Exit(function()
       {
        return((AnimatedContactFlow.Swipe())(0))(400);
       },Trans.Create(AnimatedContactFlow.Swipe()));
      }),
      contactFlowlet:function(contactTy)
      {
       var patternInput,label,constr;
       patternInput=contactTy.$==1?["Phone Number",function(arg0)
       {
        return{
         $:1,
         $0:arg0
        };
       }]:["E-Mail Address",function(arg0)
       {
        return{
         $:0,
         $0:arg0
        };
       }];
       label=patternInput[0];
       constr=patternInput[1];
       return Flow.Define(function(cont)
       {
        var rvContact,arg20;
        rvContact=Var.Create("");
        arg20=function()
        {
         return cont(constr(Var.Get(rvContact)));
        };
        return AnimatedContactFlow.AnimateFlow(Html.Form(List.ofArray([Utilities.cls("form-horizontal"),Utilities.op_EqualsEqualsGreater("role","form")]),List.ofArray([AnimatedContactFlow.inputRow(rvContact,"contact",label),Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-sm-offset-2"),Utilities.cls("col-sm-10")]),List.ofArray([Doc.Button("Finish",List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-default")]),arg20)]))]))])));
       });
      },
      contactTypeFlowlet:Runtime.Field(function()
      {
       return Flow.Define(function(cont)
       {
        var arg20,arg201;
        arg20=function()
        {
         return cont({
          $:0
         });
        };
        arg201=function()
        {
         return cont({
          $:1
         });
        };
        return AnimatedContactFlow.AnimateFlow(Html.Form(List.ofArray([Utilities.cls("form-horizontal"),Utilities.op_EqualsEqualsGreater("role","form")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Div0(List.ofArray([Doc.Button("E-Mail Address",List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-default")]),arg20)])),Html.Div0(List.ofArray([Doc.Button("Phone Number",List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-default")]),arg201)]))]))])));
       });
      }),
      fadeTime:Runtime.Field(function()
      {
       return 300;
      }),
      finalPage:function(person,details)
      {
       var detailsStr;
       detailsStr=details.$==1?"the phone number "+details.$0:"the e-mail address "+details.$0;
       return AnimatedContactFlow.AnimateFlow(Html.Div0(List.ofArray([Doc.TextNode("You said your name was "+person.Name+", your address was "+person.Address+", "),Doc.TextNode(" and you provided "+detailsStr+".")])));
      },
      inputRow:function(rv,id,lblText)
      {
       return Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Label(List.ofArray([Utilities.op_EqualsEqualsGreater("for",id),Utilities.cls("col-sm-2"),Utilities.cls("control-label")]),List.ofArray([Doc.TextNode(lblText)])),Html.Div(List.ofArray([Utilities.cls("col-sm-10")]),List.ofArray([Doc.Input(List.ofArray([Utilities.op_EqualsEqualsGreater("type","text"),Utilities.cls("form-control"),Utilities.op_EqualsEqualsGreater("id",id),Utilities.op_EqualsEqualsGreater("placeholder",lblText)]),rv)]))]));
      },
      personFlowlet:Runtime.Field(function()
      {
       return Flow.Define(function(cont)
       {
        var rvName,rvAddress,arg20;
        rvName=Var.Create("");
        rvAddress=Var.Create("");
        arg20=function()
        {
         return cont({
          Name:Var.Get(rvName),
          Address:Var.Get(rvAddress)
         });
        };
        return AnimatedContactFlow.AnimateFlow(Html.Form(List.ofArray([Utilities.cls("form-horizontal"),Utilities.op_EqualsEqualsGreater("role","form")]),List.ofArray([AnimatedContactFlow.inputRow(rvName,"lblName","Name"),AnimatedContactFlow.inputRow(rvAddress,"lblAddr","Address"),Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-sm-offset-2"),Utilities.cls("col-sm-10")]),List.ofArray([Doc.Button("Next",List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-default")]),arg20)]))]))])));
       });
      }),
      swipeTime:Runtime.Field(function()
      {
       return 300;
      })
     },
     BobsleighSite:{
      GlobalGo:function(_var,act)
      {
       return Var.Set(_var,act);
      },
      Governance:function()
      {
       return Doc.Concat(List.ofArray([Html.Div0(List.ofArray([Html.H10(List.ofArray([Utilities.txt("Governance")])),Html.P0(List.ofArray([Utilities.txt("The sport is overseen by the "),Utilities.href("International Bobsleigh and Skeleton Federation","http://www.fibt.com/"),Utilities.txt(", an organisation founded in 1923. The organisation governs all international competitions, acting as a body to regulate athletes' conduct, as well as providing funding for training and education.")]))]))]));
      },
      History:function()
      {
       return Doc.Concat(List.ofArray([Html.Div0(List.ofArray([Html.H10(List.ofArray([Utilities.txt("History")])),Html.P0(List.ofArray([Utilities.txt("According to "),Utilities.href("Wikipedia","http://en.wikipedia.org/wiki/Bobsleigh"),Utilities.txt(", the beginnings of bobsleigh came about due to a hotelier becoming increasingly frustrated about having entire seasons where he could not rent out his properties. In response, he got a few people interested, and the Swiss town of St Moritz became the home of the first bobsleigh races.")])),Html.P0(List.ofArray([Utilities.txt("Bobsleigh races have been a regular event at the Winter Olympics since the very first competition in 1924.")]))]))]));
      },
      HomePage:function(ctx)
      {
       return Doc.Concat(List.ofArray([Html.Div0(List.ofArray([Html.H10(List.ofArray([Utilities.txt("Welcome!")])),Html.P0(List.ofArray([Utilities.txt("Welcome to the IntelliFactory Bobsleigh MiniSite!")])),Html.P0(List.ofArray([Utilities.txt("Here you can find out about the "),Utilities.link("history",Runtime.New(T,{
        $:0
       }),function()
       {
        return ctx.Go.call(null,{
         $:1
        });
       }),Utilities.txt(" of bobsleighs, the "),Utilities.link("International Bobsleigh and Skeleton Federation",Runtime.New(T,{
        $:0
       }),function()
       {
        return ctx.Go.call(null,{
         $:2
        });
       }),Utilities.txt(", which serve as the governing body for the sport, and finally the world-famous "),Utilities.link("IntelliFactory Bobsleigh Team.",Runtime.New(T,{
        $:0
       }),function()
       {
        return ctx.Go.call(null,{
         $:3
        });
       })]))]))]));
      },
      Main:function()
      {
       var m,arg00,withNavbar,ctx;
       m=Var.Create({
        $:0
       });
       arg00=BobsleighSite.NavBar(m);
       withNavbar=function(arg10)
       {
        return Doc.Append(arg00,arg10);
       };
       ctx={
        Go:function(arg10)
        {
         return Var.Set(m,arg10);
        }
       };
       return Doc.EmbedView(View.Map(function(pg)
       {
        return pg.$==1?withNavbar(BobsleighSite.History(ctx)):pg.$==2?withNavbar(BobsleighSite.Governance(ctx)):pg.$==3?withNavbar(BobsleighSite.Team(ctx)):withNavbar(BobsleighSite.HomePage(ctx));
       },View.FromVar(m)));
      },
      NavBar:function(_var)
      {
       var x;
       x=View.FromVar(_var);
       return Doc.EmbedView(View.Map(function(active)
       {
        var renderLink;
        renderLink=function(action)
        {
         return Html.LI(List.ofArray([Unchecked.Equals(action,active)?Utilities.cls("active"):Attr.get_Empty()]),List.ofArray([Utilities.link(BobsleighSite.showAct(action),Runtime.New(T,{
          $:0
         }),function()
         {
          return BobsleighSite.GlobalGo(_var,action);
         })]));
        };
        return Html.Nav(List.ofArray([Utilities.cls("navbar"),Utilities.cls("navbar-default"),Attr.Create("role","navigation")]),List.ofArray([Html.UL(List.ofArray([Utilities.cls("nav"),Utilities.cls("navbar-nav")]),List.ofArray([Doc.Concat(List.map(renderLink,BobsleighSite.pages()))]))]));
       },x));
      },
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("BobsleighSite").FileName("BobsleighSite.fs").Keywords(List.ofArray(["text"])).Render(function()
       {
        return BobsleighSite.Main();
       }).RenderDescription(function()
       {
        return BobsleighSite.description();
       }).Create();
      }),
      Team:function()
      {
       var teamMembers;
       teamMembers=List.ofArray([["Adam","granicz"],["András","AndrasJanko"],["Anton (honourary member for life)","t0yv0"],["István","inchester23"],["Loic","tarmil_"],["Sándor","sandorrakonczai"],["Simon","Simon_JF"]]);
       return Doc.Concat(List.ofArray([Html.Div0(List.ofArray([Html.H10(List.ofArray([Utilities.txt("The IntelliFactory Bobsleigh Team")])),Html.P0(List.ofArray([Utilities.txt("The world-famous IntelliFactory Bobsleigh Team was founded in 2004, and currently consists of:")])),Html.UL0(List.ofArray([Doc.Concat(List.map(function(tupledArg)
       {
        return Html.LI0(List.ofArray([Utilities.href(tupledArg[0],"http://www.twitter.com/"+tupledArg[1])]));
       },teamMembers))]))]))]));
      },
      description:function()
      {
       return Html.Div0(List.ofArray([Utilities.txt("A small website about bobsleighs, demonstrating how UI.Next may be used to structure single-page applications.")]));
      },
      pages:Runtime.Field(function()
      {
       return List.ofArray([{
        $:0
       },{
        $:1
       },{
        $:2
       },{
        $:3
       }]);
      }),
      showAct:function(_arg1)
      {
       return _arg1.$==1?"History":_arg1.$==2?"Governance":_arg1.$==3?"The IntelliFactory Bobsleigh Team":"Home";
      }
     },
     Calculator:{
      Description:function()
      {
       return Html.Div0(List.ofArray([Doc.TextNode("A calculator application")]));
      },
      Main:function()
      {
       return Calculator.calcView(Var.Create(Calculator.initCalc()));
      },
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("Calculator").FileName("Calculator.fs").Keywords(List.ofArray(["calculator"])).Render(function()
       {
        return Calculator.Main();
       }).RenderDescription(function()
       {
        return Calculator.Description();
       }).Create();
      }),
      cBtn:function(rvCalc)
      {
       var arg20;
       arg20=function()
       {
        return Var.Set(rvCalc,Calculator.initCalc());
       };
       return Doc.Button("C",Runtime.New(T,{
        $:0
       }),arg20);
      },
      calcBtn:function(i,rvCalc)
      {
       var arg20;
       arg20=function()
       {
        return Calculator.pushInt(i,rvCalc);
       };
       return Doc.Button(Global.String(i),Runtime.New(T,{
        $:0
       }),arg20);
      },
      calcView:function(rvCalc)
      {
       var rviCalc,btn,obtn,cbtn,eqbtn;
       rviCalc=View.FromVar(rvCalc);
       btn=function(i)
       {
        return Calculator.calcBtn(i,rvCalc);
       };
       obtn=function(o)
       {
        return Calculator.opBtn(o,rvCalc);
       };
       cbtn=Calculator.cBtn(rvCalc);
       eqbtn=Calculator.eqBtn(rvCalc);
       return Html.Div0(List.ofArray([Doc.TextView(Calculator.displayCalc(rvCalc)),Html.Div0(List.ofArray([btn(1),btn(2),btn(3),obtn({
        $:0
       })])),Html.Div0(List.ofArray([btn(4),btn(5),btn(6),obtn({
        $:1
       })])),Html.Div0(List.ofArray([btn(7),btn(8),btn(9),obtn({
        $:2
       })])),Html.Div0(List.ofArray([btn(0),cbtn,eqbtn,obtn({
        $:3
       })]))]));
      },
      calculate:function(rvCalc)
      {
       return Var1.Update(rvCalc,function(c)
       {
        return{
         Memory:0,
         Operand:((Calculator.opFn(c.Operation))(c.Memory))(c.Operand),
         Operation:{
          $:0
         }
        };
       });
      },
      displayCalc:function(rvCalc)
      {
       return View.Map(function(c)
       {
        return Global.String(c.Operand);
       },View.FromVar(rvCalc));
      },
      eqBtn:function(rvCalc)
      {
       var arg20;
       arg20=function()
       {
        return Calculator.calculate(rvCalc);
       };
       return Doc.Button("=",Runtime.New(T,{
        $:0
       }),arg20);
      },
      initCalc:Runtime.Field(function()
      {
       return{
        Memory:0,
        Operand:0,
        Operation:{
         $:0
        }
       };
      }),
      opBtn:function(o,rvCalc)
      {
       var arg20;
       arg20=function()
       {
        return Calculator.shiftToMem(o,rvCalc);
       };
       return Doc.Button(Calculator.showOp(o),Runtime.New(T,{
        $:0
       }),arg20);
      },
      opFn:function(op)
      {
       return op.$==1?function(x)
       {
        return function(y)
        {
         return x-y;
        };
       }:op.$==2?function(x)
       {
        return function(y)
        {
         return x*y;
        };
       }:op.$==3?function(x)
       {
        return function(y)
        {
         return x/y>>0;
        };
       }:function(x)
       {
        return function(y)
        {
         return x+y;
        };
       };
      },
      pushInt:function(x,rvCalc)
      {
       return Var1.Update(rvCalc,function(c)
       {
        return{
         Memory:c.Memory,
         Operand:c.Operand*10+x,
         Operation:c.Operation
        };
       });
      },
      shiftToMem:function(op,rvCalc)
      {
       return Var1.Update(rvCalc,function(c)
       {
        return{
         Memory:c.Operand,
         Operand:0,
         Operation:op
        };
       });
      },
      showOp:function(op)
      {
       return op.$==1?"-":op.$==2?"*":op.$==3?"/":"+";
      }
     },
     CheckBoxTest:{
      Description:function()
      {
       return Html.Div0(List.ofArray([Doc.TextNode("An application which shows the selected values.")]));
      },
      Main:function()
      {
       var selPeople,checkBoxes,showNames,arg10,x,label,checkBoxSection,radioBoxVar;
       selPeople=Var.Create(Runtime.New(T,{
        $:0
       }));
       checkBoxes=Html.Div0(List.ofArray([Doc.Concat(List.map(function(person)
       {
        return Html.Div0(List.ofArray([Doc.CheckBoxGroup(Runtime.New(T,{
         $:0
        }),person,selPeople),Doc.TextNode(person.Name)]));
       },CheckBoxTest.People()))]));
       showNames=function(xs)
       {
        return Seq.fold(function(acc)
        {
         return function(p)
         {
          return acc+p.Name+", ";
         };
        },"",xs);
       };
       arg10=View.FromVar(selPeople);
       x=View.Map(showNames,arg10);
       label=Doc.TextView(x);
       checkBoxSection=Html.Div0(List.ofArray([checkBoxes,label]));
       radioBoxVar=Var.Create({
        $:0
       });
       return Html.Div0(List.ofArray([checkBoxSection,Html.Div0(List.ofArray([Doc.Concat(List.map(function(restaurant)
       {
        return Html.Div0(List.ofArray([Doc.Radio(Runtime.New(T,{
         $:0
        }),restaurant,radioBoxVar),Doc.TextNode(CheckBoxTest.showRestaurant(restaurant))]));
       },List.ofArray([{
        $:2
       },{
        $:1
       },{
        $:0
       },{
        $:3
       }]))),Doc.TextView(View.Map(function(_arg1)
       {
        return CheckBoxTest.showRestaurant(_arg1);
       },radioBoxVar.get_View()))]))]));
      },
      People:Runtime.Field(function()
      {
       return List.ofArray([Person.Create("Simon",22),Person.Create("Peter",18),Person.Create("Clare",50),Person.Create("Andy",51)]);
      }),
      Person:Runtime.Class({},{
       Create:function(n,a)
       {
        return Runtime.New(Person,{
         Name:n,
         Age:a
        });
       }
      }),
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("CheckBoxTest").FileName("CheckBoxTest.fs").Keywords(List.ofArray(["todo"])).Render(function()
       {
        return CheckBoxTest.Main();
       }).RenderDescription(function()
       {
        return CheckBoxTest.Description();
       }).Create();
      }),
      showRestaurant:function(_arg1)
      {
       return _arg1.$==1?"Suszterinas":_arg1.$==2?"Csiga":_arg1.$==3?"Stex":"Jelen";
      }
     },
     Client:{
      Main:Runtime.Field(function()
      {
       return Site.Main(List.ofArray([SimpleTextBox.Sample(),InputTransform.Sample(),TodoList.Sample(),PhoneExample.Sample(),EditablePersonList.Sample(),CheckBoxTest.Sample(),Calculator.Sample(),ContactFlow.Sample(),AnimatedContactFlow.Sample(),MessageBoard.Sample(),BobsleighSite.Sample(),RoutedBobsleighSite.Sample(),AnimatedBobsleighSite.Sample(),ObjectConstancy.Sample(),MouseInfo.Sample(),KeyboardInfo.Sample()]));
      })
     },
     Common:{
      CreatePost:function(user,content)
      {
       return{
        PostId:Fresh.Int(),
        PostAuthorName:user.Name,
        Content:content
       };
      },
      CreateThread:function(author,title)
      {
       return{
        ThreadId:Fresh.Int(),
        Title:title,
        ThreadAuthorName:author,
        Posts:Var.Create(Runtime.New(T,{
         $:0
        }))
       };
      },
      Fresh:{
       Int:function()
       {
        var _;
        _=Fresh.i()+1;
        Fresh.i=function()
        {
         return _;
        };
        return Fresh.i();
       },
       i:Runtime.Field(function()
       {
        return 0;
       })
      }
     },
     ContactFlow:{
      Description:function()
      {
       return Html.Div0(List.ofArray([Doc.TextNode("A WS.UI.Next flowlet implementation.")]));
      },
      ExampleFlow:function()
      {
       var _builder_;
       _builder_=Flow.get_Do();
       return Flow.Embed(_builder_.Bind(ContactFlow.personFlowlet(),function(_arg1)
       {
        return _builder_.Bind(ContactFlow.contactTypeFlowlet(),function(_arg2)
        {
         return _builder_.Bind(ContactFlow.contactFlowlet(_arg2),function(_arg3)
         {
          return _builder_.ReturnFrom(Flow1.Static(ContactFlow.finalPage(_arg1,_arg3)));
         });
        });
       }));
      },
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("ContactFlow").FileName("ContactFlow.fs").Keywords(List.ofArray(["flowlet"])).Render(function()
       {
        return ContactFlow.ExampleFlow();
       }).RenderDescription(function()
       {
        return ContactFlow.Description();
       }).Create();
      }),
      contactFlowlet:function(contactTy)
      {
       var patternInput,label,constr;
       patternInput=contactTy.$==1?["Phone Number",function(arg0)
       {
        return{
         $:1,
         $0:arg0
        };
       }]:["E-Mail Address",function(arg0)
       {
        return{
         $:0,
         $0:arg0
        };
       }];
       label=patternInput[0];
       constr=patternInput[1];
       return Flow.Define(function(cont)
       {
        var rvContact,arg20;
        rvContact=Var.Create("");
        arg20=function()
        {
         return cont(constr(Var.Get(rvContact)));
        };
        return Html.Form(List.ofArray([Utilities.cls("form-horizontal"),Utilities.op_EqualsEqualsGreater("role","form")]),List.ofArray([ContactFlow.inputRow(rvContact,"contact",label,false),Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-sm-offset-2"),Utilities.cls("col-sm-10")]),List.ofArray([Doc.Button("Finish",List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-default")]),arg20)]))]))]));
       });
      },
      contactTypeFlowlet:Runtime.Field(function()
      {
       return Flow.Define(function(cont)
       {
        var arg20,arg201;
        arg20=function()
        {
         return cont({
          $:0
         });
        };
        arg201=function()
        {
         return cont({
          $:1
         });
        };
        return Html.Form(List.ofArray([Utilities.cls("form-horizontal"),Utilities.op_EqualsEqualsGreater("role","form")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Div0(List.ofArray([Doc.Button("E-Mail Address",List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-default")]),arg20)])),Html.Div0(List.ofArray([Doc.Button("Phone Number",List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-default")]),arg201)]))]))]));
       });
      }),
      finalPage:function(person,details)
      {
       var detailsStr;
       detailsStr=details.$==1?"the phone number "+details.$0:"the e-mail address "+details.$0;
       return Html.Div0(List.ofArray([Doc.TextNode("You said your name was "+person.Name+", your address was "+person.Address+", "),Doc.TextNode(" and you provided "+detailsStr+".")]));
      },
      inputRow:function(rv,id,lblText,isArea)
      {
       var control;
       control=isArea?function(arg00)
       {
        return function(arg10)
        {
         return Doc.InputArea(arg00,arg10);
        };
       }:function(arg00)
       {
        return function(arg10)
        {
         return Doc.Input(arg00,arg10);
        };
       };
       return Html.Div(List.ofArray([Utilities.cls("row")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Label(List.ofArray([Utilities.cls("col-sm-2"),Utilities.op_EqualsEqualsGreater("for",id),Utilities.cls("control-label")]),List.ofArray([Doc.TextNode(lblText)])),Html.Div(List.ofArray([Utilities.cls("col-sm-6")]),List.ofArray([(control(List.ofArray([Utilities.op_EqualsEqualsGreater("type","text"),Utilities.cls("form-control"),Utilities.op_EqualsEqualsGreater("id",id),Utilities.op_EqualsEqualsGreater("placeholder",lblText)])))(rv)])),Html.Div(List.ofArray([Utilities.cls("col-sm-4")]),Runtime.New(T,{
        $:0
       }))]))]));
      },
      personFlowlet:Runtime.Field(function()
      {
       return Flow.Define(function(cont)
       {
        var rvName,rvAddress,arg20;
        rvName=Var.Create("");
        rvAddress=Var.Create("");
        arg20=function()
        {
         return cont({
          Name:Var.Get(rvName),
          Address:Var.Get(rvAddress)
         });
        };
        return Html.Form(List.ofArray([Utilities.cls("form-horizontal"),Utilities.op_EqualsEqualsGreater("role","form")]),List.ofArray([ContactFlow.inputRow(rvName,"lblName","Name",false),ContactFlow.inputRow(rvAddress,"lblAddr","Address",true),Html.Div(List.ofArray([Utilities.cls("row")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-sm-2")]),Runtime.New(T,{
         $:0
        })),Html.Div(List.ofArray([Utilities.cls("col-sm-6")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Doc.Button("Next",List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-default")]),arg20)]))])),Html.Div(List.ofArray([Utilities.cls("col-sm-4")]),Runtime.New(T,{
         $:0
        }))]))]));
       });
      })
     },
     EditablePersonList:{
      Description:function()
      {
       return Html.Div0(List.ofArray([Utilities.txt("An example inspired by a "),Utilities.href("SAP OpenUI sample","http://jsbin.com/openui5-HTML-templates/1/edit"),Utilities.txt(".")]));
      },
      Main:function()
      {
       return Html.Div0(List.ofArray([Html.Div0(List.ofArray([Html.H10(List.ofArray([Utilities.txt("Member List")])),EditablePersonList.memberList()])),Html.Div0(List.ofArray([Html.H10(List.ofArray([Utilities.txt("Change Member Details")])),EditablePersonList.peopleBoxes()]))]));
      },
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("EditablePersonList").FileName("EditablePersonList.fs").Keywords(List.ofArray(["text"])).Render(function()
       {
        return EditablePersonList.Main();
       }).RenderDescription(function()
       {
        return EditablePersonList.Description();
       }).Create();
      }),
      createPerson:function(first,last)
      {
       return{
        FirstName:Var.Create(first),
        LastName:Var.Create(last)
       };
      },
      memberList:Runtime.Field(function()
      {
       return Html.Div0(List.ofArray([Html.UL0(List.ofArray([Doc.Concat(List.map(function(person)
       {
        return Html.LI0(List.ofArray([Doc.EmbedView(View.Map2(function(f)
        {
         return function(l)
         {
          return Utilities.txt(f+" "+l);
         };
        },View.FromVar(person.FirstName),View.FromVar(person.LastName)))]));
       },EditablePersonList.peopleList()))]))]));
      }),
      peopleBoxes:Runtime.Field(function()
      {
       return Html.Div0(List.ofArray([Html.UL0(List.ofArray([Doc.Concat(List.map(function(person)
       {
        var arg10,arg101;
        arg10=person.FirstName;
        arg101=person.LastName;
        return Html.LI0(List.ofArray([Doc.Input(Runtime.New(T,{
         $:0
        }),arg10),Doc.Input(Runtime.New(T,{
         $:0
        }),arg101)]));
       },EditablePersonList.peopleList()))]))]));
      }),
      peopleList:Runtime.Field(function()
      {
       return List.ofArray([EditablePersonList.createPerson("Alonzo","Church"),EditablePersonList.createPerson("Alan","Turing"),EditablePersonList.createPerson("Bertrand","Russell"),EditablePersonList.createPerson("Noam","Chomsky")]);
      })
     },
     InputTransform:{
      Description:function()
      {
       return Html.Div0(List.ofArray([Doc.TextNode("Transforming the data provided by a single data source.")]));
      },
      Main:function()
      {
       var rvText,inputField,view,viewCaps,viewReverse,viewWordCount,viewWordCountStr,viewWordOddEven,views,tableRow;
       rvText=Var.Create("");
       inputField=Html.Div(List.ofArray([Utilities.cls("panel"),Utilities.cls("panel-default")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("panel-heading")]),List.ofArray([Html.H3(List.ofArray([Utilities.cls("panel-title")]),List.ofArray([Doc.TextNode("Input")]))])),Html.Div(List.ofArray([Utilities.cls("panel-body")]),List.ofArray([Html.Form(List.ofArray([Utilities.cls("form-horizontal"),Utilities.op_EqualsEqualsGreater("role","form")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Label(List.ofArray([Utilities.cls("col-sm-2"),Utilities.cls("control-label"),Utilities.op_EqualsEqualsGreater("for","inputBox")]),List.ofArray([Doc.TextNode("Write something: ")])),Html.Div(List.ofArray([Utilities.cls("col-sm-10")]),List.ofArray([Doc.Input(List.ofArray([Utilities.op_EqualsEqualsGreater("class","form-control"),Utilities.op_EqualsEqualsGreater("id","inputBox")]),rvText)]))]))]))]))]));
       view=View.FromVar(rvText);
       viewCaps=View.Map(function(s)
       {
        return s.toUpperCase();
       },view);
       viewReverse=View.Map(function(s)
       {
        return String.fromCharCode.apply(undefined,Strings.ToCharArray(s).slice().reverse());
       },view);
       viewWordCount=View.Map(function(s)
       {
        return Arrays.length(Strings.SplitChars(s,[32],1));
       },view);
       viewWordCountStr=View.Map(function(value)
       {
        return Global.String(value);
       },viewWordCount);
       viewWordOddEven=View.Map(function(i)
       {
        return i%2===0?"Even":"Odd";
       },viewWordCount);
       views=List.ofArray([["Entered Text",view],["Capitalised",viewCaps],["Reversed",viewReverse],["Word Count",viewWordCountStr],["Is the word count odd or even?",viewWordOddEven]]);
       tableRow=function(tupledArg)
       {
        var view1;
        view1=tupledArg[1];
        return Html.TR0(List.ofArray([Html.TD0(List.ofArray([Doc.TextNode(tupledArg[0])])),Html.TD(List.ofArray([Utilities.sty("width","70%")]),List.ofArray([Doc.TextView(view1)]))]));
       };
       return Html.Div0(List.ofArray([inputField,Html.Div(List.ofArray([Utilities.cls("panel"),Utilities.cls("panel-default")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("panel-heading")]),List.ofArray([Html.H3(List.ofArray([Utilities.cls("panel-title")]),List.ofArray([Doc.TextNode("Output")]))])),Html.Div(List.ofArray([Utilities.cls("panel-body")]),List.ofArray([Html.Table(List.ofArray([Utilities.cls("table")]),List.ofArray([Html.TBody0(List.ofArray([Doc.Concat(List.map(tableRow,views))]))]))]))]))]));
      },
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("InputTransform").FileName("InputTransform.fs").Keywords(List.ofArray(["text"])).Render(function()
       {
        return InputTransform.Main();
       }).RenderDescription(function()
       {
        return InputTransform.Description();
       }).Create();
      })
     },
     KeyboardInfo:{
      Description:function()
      {
       return Html.Div0(List.ofArray([Doc.TextNode("Information about the current keyboard state")]));
      },
      Main:function()
      {
       return Html.Div0(List.ofArray([Html.P0(List.ofArray([Doc.TextNode("Keys pressed (key codes): "),Doc.TextView(View.Map(function(xs)
       {
        return KeyboardInfo.commaList(List.map(function(value)
        {
         return Global.String(value);
        },xs));
       },KeyboardInfo.keys()))])),Html.P0(List.ofArray([Doc.TextNode("Keys pressed: "),Doc.TextView(View.Map(function(xs)
       {
        return KeyboardInfo.commaList(List.map(function(c)
        {
         return KeyboardInfo.ToChar(c);
        },xs));
       },KeyboardInfo.keys()))])),Html.P0(List.ofArray([Doc.TextNode("Last pressed key: "),Doc.TextView(View.Map(function(value)
       {
        return Global.String(value);
       },Keyboard.get_LastPressed()))])),Html.P0(List.ofArray([Doc.TextNode("Is 'A' pressed? "),Doc.TextView(View.Map(function(x)
       {
        return x?"Yes":"No";
       },Keyboard.IsPressed(KeyboardInfo.ToKey("A"))))]))]));
      },
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("KeyboardInfo").FileName("KeyboardInfo.fs").Keywords(List.ofArray(["text"])).Render(function()
       {
        return KeyboardInfo.Main();
       }).RenderDescription(function()
       {
        return KeyboardInfo.Description();
       }).Create();
      }),
      ToChar:function($c)
      {
       var $0=this,$this=this;
       return Global.String.fromCharCode($c);
      },
      ToKey:function($c)
      {
       var $0=this,$this=this;
       return $c.charCodeAt(0);
      },
      commaList:function(xs)
      {
       var addCommas;
       addCommas=function(_arg1)
       {
        var xs1;
        if(_arg1.$==1)
         {
          if(_arg1.$1.$==0)
           {
            return Global.String(_arg1.$0);
           }
          else
           {
            xs1=_arg1.$1;
            return Global.String(_arg1.$0)+", "+addCommas(xs1);
           }
         }
        else
         {
          return"";
         }
       };
       return"["+addCommas(xs)+"]";
      },
      keys:Runtime.Field(function()
      {
       return Keyboard.get_KeysPressed();
      })
     },
     MessageBoard:{
      Auth:{
       Create:function()
       {
        var loggedIn,hidden,hide,show,x,loginForm,login,logout;
        loggedIn=Var.Create({
         $:0
        });
        hidden=Var.Create(true);
        hide=function()
        {
         return hidden.set_Value(true);
        };
        show=function()
        {
         return hidden.set_Value(false);
        };
        x=hidden.get_View();
        loginForm=Html.Div(List.ofArray([Attr.DynamicStyle("display",View.Map(function(yes)
        {
         return yes?"none":"block";
        },x))]),List.ofArray([Auth.LoginForm(function(user)
        {
         loggedIn.set_Value({
          $:1,
          $0:user
         });
         return hide(null);
        })]));
        login=function()
        {
         return show(null);
        };
        logout=function()
        {
         loggedIn.set_Value({
          $:0
         });
         return hide(null);
        };
        return{
         LoggedIn:loggedIn.get_View(),
         LoginForm:loginForm,
         StatusWidget:Auth.StatusWidget(login,logout,loggedIn.get_View()),
         HideForm:hide,
         ShowForm:show
        };
       },
       LoginForm:function(onLogin)
       {
        var rvUser,rvPass,rvMsg,message,inputRow,arg101;
        rvUser=Var.Create("");
        rvPass=Var.Create("");
        rvMsg=Var.Create("");
        message=Html.Div0(List.ofArray([Html.P(List.ofArray([Utilities.cls("bg-danger")]),List.ofArray([Doc.TextView(rvMsg.get_View())]))]));
        inputRow=function(rv,id,lblText,isPass)
        {
         var control;
         control=isPass?function(arg00)
         {
          return function(arg10)
          {
           return Doc.PasswordBox(arg00,arg10);
          };
         }:function(arg00)
         {
          return function(arg10)
          {
           return Doc.Input(arg00,arg10);
          };
         };
         return Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Label(List.ofArray([Utilities.op_EqualsEqualsGreater("for",id),Utilities.cls("col-sm-2"),Utilities.cls("control-label")]),List.ofArray([Doc.TextNode(lblText)])),Html.Div(List.ofArray([Utilities.cls("col-sm-2")]),List.ofArray([(control(List.ofArray([Utilities.cls("form-control"),Utilities.op_EqualsEqualsGreater("id",id),Utilities.op_EqualsEqualsGreater("placeholder",lblText)])))(rv)]))]));
        };
        arg101=List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-primary")]);
        return Html.Div0(List.ofArray([Html.Div0(List.ofArray([Utilities.txt("Hint: TestUser/TestPass")])),message,Html.Form(List.ofArray([Utilities.cls("form-horizontal"),Utilities.op_EqualsEqualsGreater("role","form")]),List.ofArray([inputRow(rvUser,"user","Username",false),inputRow(rvPass,"pass","Password",true),Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-sm-offset-2"),Utilities.cls("col-sm-10")]),List.ofArray([Doc.Button("Log In",arg101,function()
        {
         return Concurrency.Start(Concurrency.Delay(function()
         {
          return Concurrency.Bind(Server.CheckLogin(rvUser.get_Value(),rvPass.get_Value()),function(_arg1)
          {
           var user;
           if(_arg1.$==0)
            {
             Var.Set(rvMsg,"Invalid credentials.");
             return Concurrency.Return(null);
            }
           else
            {
             user=_arg1.$0;
             Var.Set(rvUser,"");
             Var.Set(rvPass,"");
             onLogin(user);
             return Concurrency.Return(null);
            }
          });
         }),{
          $:0
         });
        })]))]))]))]));
       },
       StatusWidget:function(login,logout,view)
       {
        return Doc.EmbedView(View.Map(function(_arg1)
        {
         return _arg1.$==0?Doc.Concat(List.ofArray([Html.LI0(List.ofArray([Utilities.link("You are not logged in.",Runtime.New(T,{
          $:0
         }),function()
         {
         })])),Html.LI0(List.ofArray([Utilities.link("Login",Runtime.New(T,{
          $:0
         }),login)]))])):Doc.Concat(List.ofArray([Html.LI0(List.ofArray([Utilities.link("Welcome, "+_arg1.$0.Name+"!",Runtime.New(T,{
          $:0
         }),function()
         {
         })])),Html.LI0(List.ofArray([Utilities.link("Logout",Runtime.New(T,{
          $:0
         }),logout)]))]));
        },view));
       }
      },
      Description:function()
      {
       return Html.Div0(List.ofArray([Doc.TextNode("A message board application built using MiniSitelets.")]));
      },
      Initialise:function()
      {
       var thread,post;
       thread=Common.CreateThread("SimonJF","Hello, World! This is a topic.");
       post=Common.CreatePost({
        Name:"SimonJF",
        Password:""
       },"Hello, world! This is a post.");
       return Concurrency.Start(Concurrency.Delay(function()
       {
        return Concurrency.Bind(Server.AddThread(thread),function()
        {
         return Concurrency.Bind(Server.AddPost(thread,post),function()
         {
          return Concurrency.Return(null);
         });
        });
       }),{
        $:0
       });
      },
      Main:function()
      {
       var actVar,auth,Go,st,navbar;
       MessageBoard.Initialise();
       actVar=Var.Create({
        $:2
       });
       auth=Auth.Create();
       Go=function(arg10)
       {
        return Var.Set(actVar,arg10);
       };
       st={
        Auth:auth,
        Threads:Var.Create(Runtime.New(T,{
         $:0
        })),
        Go:Go
       };
       navbar=MessageBoard.NavBar(auth,actVar,st);
       return Doc.EmbedView(View.Map(function(act)
       {
        auth.HideForm.call(null,null);
        return Doc.Concat(List.ofArray([navbar,auth.LoginForm,act.$==2?MessageBoard.ThreadListPage(st):act.$==1?MessageBoard.ShowThreadPage(st,act.$0):MessageBoard.NewThreadPage(st)]));
       },View.FromVar(actVar)));
      },
      NavBar:function(auth,_var,st)
      {
       var actions,renderLink;
       actions=List.ofArray([{
        $:2
       },{
        $:0
       }]);
       renderLink=function(action)
       {
        return Doc.EmbedView(View.Map(function(active)
        {
         return Html.LI(List.ofArray([MessageBoard.ShowAction(action)===MessageBoard.ShowAction(active)?Utilities.cls("active"):Attr.get_Empty()]),List.ofArray([Utilities.link(MessageBoard.ShowAction(action),Runtime.New(T,{
          $:0
         }),function()
         {
          return st.Go.call(null,action);
         })]));
        },View.FromVar(_var)));
       };
       return Html.Nav(List.ofArray([Utilities.cls("navbar"),Utilities.cls("navbar-default"),Attr.Create("role","navigation")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("container-fluid")]),List.ofArray([Html.UL(List.ofArray([Utilities.cls("nav"),Utilities.cls("navbar-nav")]),List.ofArray([Doc.Concat(List.map(renderLink,actions))])),Html.UL(List.ofArray([Utilities.cls("nav"),Utilities.cls("navbar-nav"),Utilities.cls("navbar-right")]),List.ofArray([auth.StatusWidget]))]))]));
      },
      NewThreadPage:function(st)
      {
       var x;
       x=st.Auth.LoggedIn;
       return Doc.EmbedView(View.Map(function(_arg3)
       {
        var user,rvTitle,rvPost,add;
        if(_arg3.$==0)
         {
          st.Auth.ShowForm.call(null,null);
          return Doc.get_Empty();
         }
        else
         {
          user=_arg3.$0;
          rvTitle=Var.Create("");
          rvPost=Var.Create("");
          add=function()
          {
           var newThread,post;
           newThread=Common.CreateThread(user.Name,Var.Get(rvTitle));
           post=Common.CreatePost(user,Var.Get(rvPost));
           Concurrency.Start(Concurrency.Delay(function()
           {
            return Concurrency.Bind(Server.AddThread(newThread),function()
            {
             return Concurrency.Bind(Server.AddPost(newThread,post),function()
             {
              return Concurrency.Return(null);
             });
            });
           }),{
            $:0
           });
           return st.Go.call(null,{
            $:1,
            $0:newThread
           });
          };
          return Html.Div(List.ofArray([Utilities.cls("panel"),Utilities.cls("panel-default")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("panel-heading")]),List.ofArray([Html.H3(List.ofArray([Utilities.cls("panel-title")]),List.ofArray([Doc.TextNode("New Thread")]))])),Html.Div(List.ofArray([Utilities.cls("panel-body")]),List.ofArray([Html.Form(List.ofArray([Utilities.cls("form-horizontal"),Utilities.op_EqualsEqualsGreater("role","form")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Label(List.ofArray([Utilities.op_EqualsEqualsGreater("for","threadTitle"),Utilities.cls("col-sm-2 control-label")]),List.ofArray([Doc.TextNode("Title")])),Html.Div(List.ofArray([Utilities.cls("col-sm-10")]),List.ofArray([Doc.Input(List.ofArray([Utilities.op_EqualsEqualsGreater("id","threadTitle"),Utilities.sty("width","100%"),Utilities.cls("form-control")]),rvTitle)]))])),Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Label(List.ofArray([Utilities.op_EqualsEqualsGreater("for","postContent"),Utilities.cls("col-sm-2 control-label")]),List.ofArray([Doc.TextNode("Content")])),Html.Div(List.ofArray([Utilities.cls("col-sm-10")]),List.ofArray([Doc.InputArea(List.ofArray([Utilities.op_EqualsEqualsGreater("id","postContent"),Utilities.op_EqualsEqualsGreater("rows","5"),Utilities.cls("form-control"),Utilities.sty("width","100%")]),rvPost)]))])),Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-sm-offset-2"),Utilities.cls("col-sm-10")]),List.ofArray([Doc.Button("Submit",List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-primary")]),add)]))]))]))]))]));
         }
       },x));
      },
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("MessageBoard").FileName("MessageBoard.fs").Keywords(List.ofArray(["text"])).Render(function()
       {
        return MessageBoard.Main();
       }).RenderDescription(function()
       {
        return MessageBoard.Description();
       }).Create();
      }),
      ShowAction:function(act)
      {
       return act.$==1?"Thread "+act.$0.Title:act.$==2?"Show All Threads":"Create New Thread";
      },
      ShowThreadPage:function(st,thread)
      {
       var rvPosts,getPosts,renderPost,postList,x;
       rvPosts=Var.Create(Runtime.New(T,{
        $:0
       }));
       getPosts=function()
       {
        return Concurrency.Start(Concurrency.Delay(function()
        {
         return Concurrency.Bind(Server.GetPosts(thread),function(_arg1)
         {
          Var.Set(rvPosts,_arg1);
          return Concurrency.Return(null);
         });
        }),{
         $:0
        });
       };
       renderPost=function(post)
       {
        return Html.TR0(List.ofArray([Html.TD0(List.ofArray([Doc.TextNode(post.PostAuthorName)])),Html.TD0(List.ofArray([Doc.TextNode(post.Content)]))]));
       };
       postList=Html.Div(List.ofArray([Utilities.cls("panel"),Utilities.cls("panel-default")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("panel-heading")]),List.ofArray([Html.H3(List.ofArray([Utilities.cls("panel-title")]),List.ofArray([Doc.TextNode("Posts in thread \""+thread.Title+"\"")]))])),Html.Div(List.ofArray([Utilities.cls("panel-body")]),List.ofArray([Html.Table(List.ofArray([Utilities.cls("table"),Utilities.cls("table-hover")]),List.ofArray([Html.TBody0(List.ofArray([Doc.EmbedView(View.Map(function(posts)
       {
        return Doc.Concat(List.map(renderPost,posts));
       },View.FromVar(rvPosts)))]))]))]))]));
       getPosts(null);
       x=st.Auth.LoggedIn;
       return Html.Div0(List.ofArray([postList,Doc.EmbedView(View.Map(function(_arg3)
       {
        var user,rvPost,add;
        if(_arg3.$==1)
         {
          user=_arg3.$0;
          rvPost=Var.Create("");
          add=function()
          {
           var post;
           post=Common.CreatePost(user,rvPost.get_Value());
           return Concurrency.Start(Concurrency.Delay(function()
           {
            return Concurrency.Bind(Server.AddPost(thread,post),function()
            {
             getPosts(null);
             return Concurrency.Return(null);
            });
           }),{
            $:0
           });
          };
          return Html.Div(List.ofArray([Utilities.cls("panel"),Utilities.cls("panel-default")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("panel-heading")]),List.ofArray([Html.H3(List.ofArray([Utilities.cls("panel-title")]),List.ofArray([Doc.TextNode("New Post")]))])),Html.Div(List.ofArray([Utilities.cls("panel-body")]),List.ofArray([Html.Form(List.ofArray([Utilities.cls("form-horizontal"),Utilities.op_EqualsEqualsGreater("role","form")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Label(List.ofArray([Utilities.op_EqualsEqualsGreater("for","postContent"),Utilities.cls("col-sm-2 control-label")]),List.ofArray([Doc.TextNode("Content")])),Html.Div(List.ofArray([Utilities.cls("col-sm-10")]),List.ofArray([Doc.InputArea(List.ofArray([Utilities.op_EqualsEqualsGreater("id","postContent"),Utilities.op_EqualsEqualsGreater("rows","5"),Utilities.cls("form-control"),Utilities.sty("width","100%")]),rvPost)]))])),Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-sm-offset-2"),Utilities.cls("col-sm-10")]),List.ofArray([Doc.Button("Submit",List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-primary")]),add)]))]))]))]))]));
         }
        else
         {
          return Doc.get_Empty();
         }
       },x))]));
      },
      ThreadListPage:function(st)
      {
       var renderThread,threads;
       renderThread=function(thread)
       {
        return Html.TR0(List.ofArray([Html.TD0(List.ofArray([Doc.TextNode(thread.ThreadAuthorName)])),Html.TD0(List.ofArray([Utilities.link(thread.Title,Runtime.New(T,{
         $:0
        }),function()
        {
         return st.Go.call(null,{
          $:1,
          $0:thread
         });
        })]))]));
       };
       threads=st.Threads;
       Concurrency.Start(Concurrency.Delay(function()
       {
        return Concurrency.Bind(Server.GetThreads(),function(_arg1)
        {
         Var.Set(threads,_arg1);
         return Concurrency.Return(null);
        });
       }),{
        $:0
       });
       return Html.Table(List.ofArray([Utilities.cls("table"),Utilities.cls("table-hover")]),List.ofArray([Html.TBody0(List.ofArray([Doc.EmbedView(View.Map(function(threads1)
       {
        return Doc.Concat(List.map(renderThread,threads1));
       },View.FromVar(st.Threads)))]))]));
      }
     },
     MouseInfo:{
      Description:function()
      {
       return Html.Div0(List.ofArray([Doc.TextNode("Shows information about the mouse")]));
      },
      Main:function()
      {
       var arg00,arg10,xView,arg001,arg101,yView,arg002,arg102,arg20,lastHeldPos,arg003,arg103,arg201,lastClickPos;
       arg00=function(tuple)
       {
        return tuple[0];
       };
       arg10=Mouse.get_Position();
       xView=View.Map(arg00,arg10);
       arg001=function(tuple)
       {
        return tuple[1];
       };
       arg101=Mouse.get_Position();
       yView=View.Map(arg001,arg101);
       arg002=[0,0];
       arg102=Mouse.get_LeftPressed();
       arg20=Mouse.get_Position();
       lastHeldPos=View.UpdateWhile(arg002,arg102,arg20);
       arg003=[0,0];
       arg103=Mouse.get_LeftPressed();
       arg201=Mouse.get_Position();
       lastClickPos=View.SnapshotOn(arg003,arg103,arg201);
       return Html.Div0(List.ofArray([Html.P0(List.ofArray([Doc.TextView(View.Map(function(x)
       {
        return"X: "+Global.String(x);
       },xView)),Doc.TextView(View.Map(function(y)
       {
        return"Y: "+Global.String(y);
       },yView))])),Html.P0(List.ofArray([Doc.TextView(View.Map(function(l)
       {
        return"Left button pressed: "+Global.String(l);
       },Mouse.get_LeftPressed()))])),Html.P0(List.ofArray([Doc.TextView(View.Map(function(m)
       {
        return"Middle button pressed: "+Global.String(m);
       },Mouse.get_MiddlePressed()))])),Html.P0(List.ofArray([Doc.TextView(View.Map(function(r)
       {
        return"Right button pressed: "+Global.String(r);
       },Mouse.get_RightPressed()))])),Html.P0(List.ofArray([Doc.TextView(View.Map(function(tupledArg)
       {
        var y;
        y=tupledArg[1];
        return"Position on last left click: ("+Global.String(tupledArg[0])+","+Global.String(y)+")";
       },lastClickPos))])),Html.P0(List.ofArray([Doc.TextView(View.Map(function(tupledArg)
       {
        var y;
        y=tupledArg[1];
        return"Position of mouse while left button held: ("+Global.String(tupledArg[0])+","+Global.String(y)+")";
       },lastHeldPos))]))]));
      },
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("MouseInfo").FileName("MouseInfo.fs").Keywords(List.ofArray(["mouse"])).Render(function()
       {
        return MouseInfo.Main();
       }).RenderDescription(function()
       {
        return MouseInfo.Description();
       }).Create();
      })
     },
     ObjectConstancy:{
      DataSet:Runtime.Class({},{
       LoadFromCSV:function(url)
       {
        return Concurrency.FromContinuations(function(tupledArg)
        {
         var ok;
         ok=tupledArg[0];
         jQuery.get(url,{},function(data)
         {
          return ok(DataSet.ParseCSV(data));
         });
         return;
        });
       },
       ParseCSV:function(data)
       {
        var x,all,brackets,x1,data1;
        x=Strings.SplitChars(data,[13,10],1);
        all=Arrays.filter(function(s)
        {
         return s!=="";
        },x);
        brackets=Arrays.map(function(arg0)
        {
         return{
          $:0,
          $0:arg0
         };
        },Slice.array(Strings.SplitChars(Arrays.get(all,0),[44],1),{
         $:1,
         $0:1
        },{
         $:0
        }));
        x1=Arrays.sub(all,1,Arrays.length(all)-1);
        data1=Arrays.map(function(s)
        {
         return Strings.SplitChars(s,[44],1);
        },x1);
        return Runtime.New(DataSet,{
         Brackets:brackets,
         Population:function(bracket)
         {
          return function(_arg1)
          {
           var st;
           st=_arg1.$0;
           return Arrays.get(Arrays.get(data1,Arrays.findINdex(function(d)
           {
            return Arrays.get(d,0)===st;
           },data1)),1+Arrays.findINdex(function(y)
           {
            return Unchecked.Equals(bracket,y);
           },brackets))<<0;
          };
         },
         States:Arrays.map(function(d)
         {
          return{
           $:0,
           $0:Arrays.get(d,0)
          };
         },data1)
        });
       },
       Ratio:function(ds,br,st)
       {
        var total;
        total={
         $:0,
         $0:"Total"
        };
        return+(ds.Population.call(null,br))(st)/+(ds.Population.call(null,total))(st);
       },
       TopStatesByRatio:function(ds,bracket)
       {
        return Slice.array(Arrays.sortBy(function(tupledArg)
        {
         return-tupledArg[1];
        },Arrays.map(function(st)
        {
         return[st,DataSet.Ratio(ds,bracket,st)];
        },ds.States)),{
         $:1,
         $0:0
        },{
         $:1,
         $0:9
        });
       }
      }),
      Description:function()
      {
       return Html.Div0(List.ofArray([Utilities.txt("This sample show-cases declarative animation and interpolation (tweening)")]));
      },
      Height:Runtime.Field(function()
      {
       return 250;
      }),
      InOutTransition:Runtime.Field(function()
      {
       return Trans1.Exit(function(x)
       {
        return ObjectConstancy.SimpleAnimation(x,ObjectConstancy.Height());
       },Trans1.Enter(function(x)
       {
        return ObjectConstancy.SimpleAnimation(ObjectConstancy.Height(),x);
       },ObjectConstancy.SimpleTransition()));
      }),
      Main:function()
      {
       var patternInput,shownData,dataSet,bracket;
       patternInput=ObjectConstancy.SetupDataModel();
       shownData=patternInput[2];
       dataSet=patternInput[0];
       bracket=patternInput[1];
       return Html.Div0(List.ofArray([Html.H20(List.ofArray([Utilities.txt("Top States by Age Bracket, 2008")])),Doc.EmbedView(View.Map(function(dS)
       {
        return Doc.Select(List.ofArray([Utilities.cls("form-control")]),function(_arg1)
        {
         return _arg1.$0;
        },List.ofArray(Slice.array(dS.Brackets,{
         $:1,
         $0:1
        },{
         $:0
        })),bracket);
       },dataSet)),Html.Div(List.ofArray([Utilities.cls("skip")]),Runtime.New(T,{
        $:0
       })),SvgElements.Svg(List.ofArray([Utilities.op_EqualsEqualsGreater("width",Global.String(ObjectConstancy.Width())),Utilities.op_EqualsEqualsGreater("height",Global.String(ObjectConstancy.Height()))]),List.ofArray([Doc.EmbedView(View.Map(function(arg00)
       {
        return Doc.Concat(arg00);
       },View.ConvertSeqBy(function(s)
       {
        return s.State;
       },function(state)
       {
        return ObjectConstancy.Render(state);
       },shownData)))])),Html.P0(List.ofArray([Utilities.txt("Source: "),Utilities.href("Census Bureau","http://www.census.gov/popest/data/historical/2000s/vintage_2008/")])),Html.P0(List.ofArray([Utilities.txt("Original Sample by Mike Bostock: "),Utilities.href("Object Constancy","http://bost.ocks.org/mike/constancy/")]))]));
      },
      Percent:function(x)
      {
       return Global.String(Math.floor(100*x))+"."+Global.String((Math.floor(1000*x)<<0)%10)+"%";
      },
      Render:function(state)
      {
       var anim,x,y,h,txt;
       anim=function(name,kind,proj)
       {
        var arg30;
        arg30=function(value)
        {
         return Global.String(value);
        };
        return Attr.Animated(name,kind,View.Map(proj,state),arg30);
       };
       x=function(st)
       {
        return ObjectConstancy.Width()*st.Value/st.MaxValue;
       };
       y=function(st)
       {
        return ObjectConstancy.Height()*+st.Position/+st.Total;
       };
       h=function(st)
       {
        return ObjectConstancy.Height()/+st.Total-2;
       };
       txt=function(f)
       {
        return function(attr)
        {
         return SvgElements.Text(attr,List.ofArray([Doc.TextView(View.Map(f,state))]));
        };
       };
       return Doc.Concat(List.ofArray([SvgElements.G(List.ofArray([Attr.Style("fill","steelblue")]),List.ofArray([SvgElements.Rect(List.ofArray([Utilities.op_EqualsEqualsGreater("x","0"),anim("y",ObjectConstancy.InOutTransition(),y),anim("width",ObjectConstancy.SimpleTransition(),x),anim("height",ObjectConstancy.SimpleTransition(),h)]),Runtime.New(T,{
        $:0
       }))])),(txt(function(s)
       {
        return ObjectConstancy.Percent(s.Value);
       }))(List.ofArray([Utilities.op_EqualsEqualsGreater("text-anchor","end"),anim("x",ObjectConstancy.SimpleTransition(),x),anim("y",ObjectConstancy.InOutTransition(),y),Utilities.op_EqualsEqualsGreater("dx","-2"),Utilities.op_EqualsEqualsGreater("dy","14"),Utilities.sty("fill","white"),Utilities.sty("font","12px sans-serif")])),(txt(function(s)
       {
        return s.State;
       }))(List.ofArray([Utilities.op_EqualsEqualsGreater("x","0"),anim("y",ObjectConstancy.InOutTransition(),y),Utilities.op_EqualsEqualsGreater("dx","2"),Utilities.op_EqualsEqualsGreater("dy","16"),Utilities.sty("fill","white"),Utilities.sty("font","14px sans-serif"),Utilities.sty("font-weight","bold")]))]));
      },
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("ObjectConstancy").FileName("ObjectConstancy.fs").Keywords(List.ofArray(["animation"])).Render(function()
       {
        return ObjectConstancy.Main();
       }).RenderDescription(function()
       {
        return ObjectConstancy.Description();
       }).Create();
      }),
      SetupDataModel:function()
      {
       var x,dataSet,bracket;
       x=View.Const(null);
       dataSet=View.MapAsync(function()
       {
        return DataSet.LoadFromCSV("ObjectConstancy.csv");
       },x);
       bracket=Var.Create({
        $:0,
        $0:"Under 5 Years"
       });
       return[dataSet,bracket,View.Map(function(xs)
       {
        var n,m;
        n=Arrays.length(xs);
        m=Arrays.max(Arrays.map(function(tuple)
        {
         return tuple[1];
        },xs));
        return Arrays.mapi(function(i)
        {
         return function(tupledArg)
         {
          return{
           MaxValue:m,
           Position:i,
           State:tupledArg[0].$0,
           Total:n,
           Value:tupledArg[1]
          };
         };
        },xs);
       },View.Map2(function(arg00)
       {
        return function(arg10)
        {
         return DataSet.TopStatesByRatio(arg00,arg10);
        };
       },dataSet,bracket.get_View()))];
      },
      SimpleAnimation:function(x,y)
      {
       return An.Simple(Interpolation1.get_Double(),Easing.get_CubicInOut(),300,x,y);
      },
      SimpleTransition:Runtime.Field(function()
      {
       return Trans.Create(function(x)
       {
        return function(y)
        {
         return ObjectConstancy.SimpleAnimation(x,y);
        };
       });
      }),
      Width:Runtime.Field(function()
      {
       return 960;
      })
     },
     PhoneExample:{
      Description:function()
      {
       return Html.Div0(List.ofArray([Doc.TextNode("Taken from the "),Utilities.href("AngularJS Tutorial","https://docs.angularjs.org/tutorial/"),Doc.TextNode(", a list filtering and sorting application for phones.")]));
      },
      Main:function()
      {
       var defPhone;
       defPhone=function(name,snip,age)
       {
        return Runtime.New(Phone,{
         Name:name,
         Snippet:snip,
         Age:age
        });
       };
       return PhoneExample.PhonesWidget(List.ofArray([defPhone("Nexus S","Fast just got faster with Nexus S.",1),defPhone("Motorola XOOM","The Next, Next generation tablet",2),defPhone("Motorola XOOM with Wi-Fi","The Next, Next generation tablet",3),defPhone("Samsung Galaxy","The Ultimate Phone",4)]));
      },
      Order:Runtime.Class({},{
       Show:function(order)
       {
        return order.$==1?"Newest":"Alphabetical";
       }
      }),
      Phone:Runtime.Class({},{
       Compare:function(order,p1,p2)
       {
        return order.$==1?Operators.Compare(p1.Age,p2.Age):Operators.Compare(p1.Name,p2.Name);
       },
       MatchesQuery:function(q,ph)
       {
        return ph.Name.indexOf(q)!=-1?true:ph.Snippet.indexOf(q)!=-1;
       }
      }),
      PhonesWidget:function(phones)
      {
       var allPhones,query,order,arg00,arg101,arg201,visiblePhones,showPhone,showPhones;
       allPhones=Var.Create(phones);
       query=Var.Create("");
       order=Var.Create(Runtime.New(Order,{
        $:1
       }));
       arg00=function(query1)
       {
        return function(order1)
        {
         return List.sortWith(function(arg10)
         {
          return function(arg20)
          {
           return Phone.Compare(order1,arg10,arg20);
          };
         },List.filter(function(arg10)
         {
          return Phone.MatchesQuery(query1,arg10);
         },phones));
        };
       };
       arg101=View.FromVar(query);
       arg201=View.FromVar(order);
       visiblePhones=View.Map2(arg00,arg101,arg201);
       showPhone=function(ph)
       {
        return Html.LI0(List.ofArray([Html.Span0(List.ofArray([Utilities.txt(ph.Name)])),Html.P0(List.ofArray([Utilities.txt(ph.Snippet)]))]));
       };
       showPhones=function(phones1)
       {
        return Doc.Concat(List.map(showPhone,phones1));
       };
       return Html.Div(List.ofArray([Utilities.cls("row")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-sm-6")]),List.ofArray([Utilities.txt("Search: "),Doc.Input(List.ofArray([Attr.Create("class","form-control")]),query),Utilities.txt("Sort by: "),Doc.Select(List.ofArray([Attr.Create("class","form-control")]),function(arg001)
       {
        return Order.Show(arg001);
       },List.ofArray([Runtime.New(Order,{
        $:1
       }),Runtime.New(Order,{
        $:0
       })]),order)])),Html.Div(List.ofArray([Utilities.cls("col-sm-6")]),List.ofArray([Html.UL0(List.ofArray([Doc.EmbedView(View.Map(showPhones,visiblePhones))]))]))]));
      },
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("PhoneExample").FileName("PhoneExample.fs").Keywords(List.ofArray(["todo"])).Render(function()
       {
        return PhoneExample.Main();
       }).RenderDescription(function()
       {
        return PhoneExample.Description();
       }).Create();
      })
     },
     RoutedBobsleighSite:{
      Main:function(current)
      {
       var arg00,withNavbar,ctx;
       arg00=BobsleighSite.NavBar(current);
       withNavbar=function(arg10)
       {
        return Doc.Append(arg00,arg10);
       };
       ctx={
        Go:function(arg10)
        {
         return Var.Set(current,arg10);
        }
       };
       return Doc.EmbedView(View.Map(function(pg)
       {
        return pg.$==1?withNavbar(BobsleighSite.History(ctx)):pg.$==2?withNavbar(BobsleighSite.Governance(ctx)):pg.$==3?withNavbar(BobsleighSite.Team(ctx)):withNavbar(BobsleighSite.HomePage(ctx));
       },View.FromVar(current)));
      },
      Sample:Runtime.Field(function()
      {
       return Samples.Routed(RoutedBobsleighSite.TheRouteMap(),{
        $:0
       }).Id("RoutedBobsleighSite").FileName("RoutedBobsleighSite.fs").Keywords(List.ofArray(["text"])).Render(function(current)
       {
        return RoutedBobsleighSite.Main(current);
       }).RenderDescription(function(v)
       {
        return RoutedBobsleighSite.description(v);
       }).Create();
      }),
      TheRouteMap:Runtime.Field(function()
      {
       return RouteMap1.Create(function(_arg1)
       {
        return _arg1.$==1?List.ofArray(["history"]):_arg1.$==2?List.ofArray(["governance"]):_arg1.$==3?List.ofArray(["team"]):Runtime.New(T,{
         $:0
        });
       },function(_arg2)
       {
        return _arg2.$==1?_arg2.$0==="history"?_arg2.$1.$==0?{
         $:1
        }:{
         $:0
        }:_arg2.$0==="governance"?_arg2.$1.$==0?{
         $:2
        }:{
         $:0
        }:_arg2.$0==="team"?_arg2.$1.$==0?{
         $:3
        }:{
         $:0
        }:{
         $:0
        }:{
         $:0
        };
       });
      }),
      description:function()
      {
       return Html.Div0(List.ofArray([Utilities.txt("A small website about bobsleighs, demonstrating how UI.Next may be used to structure single-page applications. Routed using the URL.")]));
      }
     },
     Samples:{
      Build:function()
      {
       return Builder.New(function(vis)
       {
        return function(meta)
        {
         return Samples.CreateSimple(vis,meta);
        };
       });
      },
      Builder:Runtime.Class({
       Create:function()
       {
        return(this.create.call(null,this.vis))(this.meta);
       },
       FileName:function(x)
       {
        var inputRecord;
        inputRecord=this.meta;
        this.meta={
         FileName:x,
         Keywords:inputRecord.Keywords,
         Title:inputRecord.Title,
         Uri:inputRecord.Uri
        };
        return this;
       },
       Id:function(x)
       {
        var inputRecord;
        inputRecord=this.meta;
        this.meta={
         FileName:inputRecord.FileName,
         Keywords:inputRecord.Keywords,
         Title:x,
         Uri:x
        };
        return this;
       },
       Keywords:function(x)
       {
        var inputRecord;
        inputRecord=this.meta;
        this.meta={
         FileName:inputRecord.FileName,
         Keywords:x,
         Title:inputRecord.Title,
         Uri:inputRecord.Uri
        };
        return this;
       },
       Render:function(f)
       {
        this.vis={
         Desc:this.vis.Desc,
         Main:f
        };
        return this;
       },
       RenderDescription:function(x)
       {
        this.vis={
         Desc:x,
         Main:this.vis.Main
        };
        return this;
       },
       Title:function(x)
       {
        var inputRecord;
        inputRecord=this.meta;
        this.meta={
         FileName:inputRecord.FileName,
         Keywords:inputRecord.Keywords,
         Title:x,
         Uri:inputRecord.Uri
        };
        return this;
       },
       Uri:function(x)
       {
        var inputRecord;
        inputRecord=this.meta;
        this.meta={
         FileName:inputRecord.FileName,
         Keywords:inputRecord.Keywords,
         Title:inputRecord.Title,
         Uri:x
        };
        return this;
       }
      },{
       New:function(create)
       {
        var r;
        r=Runtime.New(this,{});
        r.create=create;
        r.meta={
         FileName:"Unknown.fs",
         Keywords:Runtime.New(T,{
          $:0
         }),
         Title:"Unknown",
         Uri:"unknown"
        };
        r.vis={
         Desc:function()
         {
          return Doc.get_Empty();
         },
         Main:function()
         {
          return Doc.get_Empty();
         }
        };
        return r;
       }
      }),
      CreateRouted:function(router,init,vis,meta)
      {
       var sample;
       sample={
        Body:Doc.get_Empty(),
        Description:Doc.get_Empty(),
        Meta:meta,
        Router:undefined,
        RouteId:undefined,
        SamplePage:undefined
       };
       sample.Router=Router.Prefix(meta.Uri,Router1.Route(router,init,function(id)
       {
        return function(cur)
        {
         var page;
         sample.RouteId=id;
         sample.Body=vis.Main.call(null,cur);
         sample.Description=vis.Desc.call(null,cur);
         page=SiteCommon.mkPage(sample.Meta.Title,id,{
          $:2
         });
         page.PageSample={
          $:1,
          $0:sample
         };
         page.PageRouteId=id;
         sample.SamplePage=page;
         return page;
        };
       }));
       return sample;
      },
      CreateSimple:function(vis,meta)
      {
       var unitRouter,sample;
       unitRouter=RouteMap1.Create(function()
       {
        return Runtime.New(T,{
         $:0
        });
       },function()
       {
        return null;
       });
       sample={
        Body:vis.Main.call(null,null),
        Description:vis.Desc.call(null,null),
        Meta:meta,
        Router:undefined,
        RouteId:undefined,
        SamplePage:undefined
       };
       sample.Router=Router.Prefix(meta.Uri,Router1.Route(unitRouter,null,function(id)
       {
        return function()
        {
         var page;
         page=SiteCommon.mkPage(sample.Meta.Title,id,{
          $:2
         });
         sample.RouteId=id;
         page.PageSample={
          $:1,
          $0:sample
         };
         page.PageRouteId=id;
         sample.SamplePage=page;
         return page;
        };
       }));
       return sample;
      },
      InitialSamplePage:function(samples)
      {
       return List.head(samples).SamplePage;
      },
      Render:function(vPage,pg,samples)
      {
       var matchValue,sample;
       matchValue=pg.PageSample;
       sample=matchValue.$==0?Operators.FailWith("Attempted to render non-sample on samples page"):matchValue.$0;
       return Html.Section(List.ofArray([Utilities.cls("block-small")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("container")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("row")]),List.ofArray([Samples.Sidebar(vPage,samples),Samples.RenderContent(sample)]))]))]));
      },
      RenderContent:function(sample)
      {
       return Html.Div(List.ofArray([Utilities.cls("samples"),Utilities.cls("col-md-9")]),List.ofArray([Html.Div0(List.ofArray([Html.Div(List.ofArray([Utilities.cls("row")]),List.ofArray([Html.H10(List.ofArray([Utilities.txt(sample.Meta.Title)])),Html.Div0(List.ofArray([Html.P0(List.ofArray([sample.Description])),Html.P0(List.ofArray([Html.A(List.ofArray([Utilities.op_EqualsEqualsGreater("href","https://github.com/intellifactory/websharper.ui.next.samples/blob/master/src/"+sample.Meta.Uri+".fs")]),List.ofArray([Utilities.txt("View Source")]))]))]))])),Html.Div(List.ofArray([Utilities.cls("row")]),List.ofArray([Html.P0(List.ofArray([sample.Body]))]))]))]));
      },
      Routed:function(router,init)
      {
       return Builder.New(function(vis)
       {
        return function(meta)
        {
         return Samples.CreateRouted(router,init,vis,meta);
        };
       });
      },
      SamplesRouter:function(samples)
      {
       return Router.Prefix("samples",Router.Merge(Seq.toList(Seq.delay(function()
       {
        return Seq.map(function(s)
        {
         return s.Router;
        },samples);
       }))));
      },
      Sidebar:function(vPage,samples)
      {
       var renderItem;
       renderItem=function(sample)
       {
        var arg20,activeAttr,arg201;
        arg20=function(s)
        {
         return Option.exists(function(smp)
         {
          return sample.Meta.FileName===smp.Meta.FileName;
         },s);
        };
        activeAttr=Attr.DynamicClass("active",View.Map(function(pg)
        {
         return pg.PageSample;
        },View.FromVar(vPage)),arg20);
        arg201=function()
        {
         return Var.Set(vPage,sample.SamplePage);
        };
        return Doc.Link(sample.Meta.Title,List.ofArray([Utilities.cls("list-group-item"),activeAttr]),arg201);
       };
       return Html.Div(List.ofArray([Utilities.cls("col-md-3")]),List.ofArray([Html.H40(List.ofArray([Utilities.txt("Samples")])),Doc.Concat(List.map(renderItem,samples))]));
      },
      nav:Runtime.Field(function()
      {
       return function(ats)
       {
        return function(ch)
        {
         return Html.Nav(ats,ch);
        };
       };
      })
     },
     Server:{
      AddPost:function(thread,post)
      {
       return Concurrency.Delay(function()
       {
        var matchValue,k,v,_,k1,v1,_1;
        matchValue=MapModule.TryFind(thread.ThreadId,Server.posts());
        if(matchValue.$==0)
         {
          k=thread.ThreadId;
          v=List.ofArray([post]);
          _=Server.posts().Add(k,v);
          Server.posts=function()
          {
           return _;
          };
          return Concurrency.Return(null);
         }
        else
         {
          k1=thread.ThreadId;
          v1=List.append(matchValue.$0,List.ofArray([post]));
          _1=Server.posts().Add(k1,v1);
          Server.posts=function()
          {
           return _1;
          };
          return Concurrency.Return(null);
         }
       });
      },
      AddThread:function(thread)
      {
       return Concurrency.Delay(function()
       {
        var _,k,v,_1;
        _=List.append(Server.threads(),List.ofArray([thread]));
        Server.threads=function()
        {
         return _;
        };
        k=thread.ThreadId;
        v=Runtime.New(T,{
         $:0
        });
        _1=Server.posts().Add(k,v);
        Server.posts=function()
        {
         return _1;
        };
        return Concurrency.Return(null);
       });
      },
      CheckCredentials:function(name,pass)
      {
       var matchValue;
       matchValue=[name,pass];
       return matchValue[0]==="TestUser"?matchValue[1]==="TestPass"?{
        $:1,
        $0:{
         Name:name,
         Password:pass
        }
       }:{
        $:0
       }:{
        $:0
       };
      },
      CheckLogin:function(user,pass)
      {
       return Concurrency.Delay(function()
       {
        return Concurrency.Bind(Concurrency.Sleep(Server.DELAY()),function()
        {
         return Concurrency.Return(Server.CheckCredentials(user,pass));
        });
       });
      },
      DELAY:Runtime.Field(function()
      {
       return 200;
      }),
      GetPosts:function(thread)
      {
       return Concurrency.Delay(function()
       {
        var matchValue;
        matchValue=MapModule.TryFind(thread.ThreadId,Server.posts());
        return matchValue.$==0?Concurrency.Return(Runtime.New(T,{
         $:0
        })):Concurrency.Return(matchValue.$0);
       });
      },
      GetThreads:function()
      {
       return Concurrency.Delay(function()
       {
        return Concurrency.Bind(Concurrency.Sleep(Server.DELAY()),function()
        {
         return Concurrency.Return(Server.threads());
        });
       });
      },
      posts:Runtime.Field(function()
      {
       return FSharpMap.New1([]);
      }),
      threads:Runtime.Field(function()
      {
       return Runtime.New(T,{
        $:0
       });
      })
     },
     SimpleTextBox:{
      Description:function()
      {
       return Html.Div0(List.ofArray([Doc.TextNode("A label which copies the contents of a text box.")]));
      },
      Main:function()
      {
       var rvText,inputField,label;
       rvText=Var.Create("");
       inputField=Doc.Input(List.ofArray([Attr.Create("class","form-control")]),rvText);
       label=Doc.TextView(rvText.get_View());
       return Utilities.divc("panel-default",List.ofArray([Utilities.divc("panel-body",List.ofArray([Html.Div0(List.ofArray([inputField])),Html.Div0(List.ofArray([label]))]))]));
      },
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("SimpleTextBox").FileName("SimpleTextBox.fs").Keywords(List.ofArray(["text"])).Render(function()
       {
        return SimpleTextBox.Main();
       }).RenderDescription(function()
       {
        return SimpleTextBox.Description();
       }).Create();
      })
     },
     Site:{
      AboutPage:function(go)
      {
       var renderBody,oddEntry,evenEntry,ico,arg20;
       renderBody=function(entry)
       {
        return Doc.Concat(List.ofArray([Html.H10(List.ofArray([Utilities.txt(entry.Name)])),Html.P(List.ofArray([Utilities.cls("lead")]),List.ofArray([Utilities.txt(entry.Description)])),Html.P0(List.ofArray([Html.UL(List.ofArray([Utilities.cls("list-unstyled")]),List.ofArray([Doc.Concat(List.map(function(lnk)
        {
         return Html.LI0(List.ofArray([lnk]));
        },entry.URLs))]))]))]));
       };
       oddEntry=function(entry)
       {
        return Html.Section(List.ofArray([Utilities.cls("block-large")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("container")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("row")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-lg-3")]),List.ofArray([Html.Img(List.ofArray([Utilities.op_EqualsEqualsGreater("src",entry.ImgURL),Utilities.sty("width","100%")]),Runtime.New(T,{
         $:0
        }))])),Html.Div(List.ofArray([Utilities.cls("col-lg-1")]),Runtime.New(T,{
         $:0
        })),Html.Div(List.ofArray([Utilities.cls("col-lg-8")]),List.ofArray([renderBody(entry)]))]))]))]));
       };
       evenEntry=function(entry)
       {
        return Html.Section(List.ofArray([Utilities.cls("block-large"),Utilities.cls("bg-alt")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("container")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("row")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-lg-8")]),List.ofArray([renderBody(entry)])),Html.Div(List.ofArray([Utilities.cls("col-lg-1")]),Runtime.New(T,{
         $:0
        })),Html.Div(List.ofArray([Utilities.cls("col-lg-3")]),List.ofArray([Html.Img(List.ofArray([Utilities.op_EqualsEqualsGreater("src",entry.ImgURL),Utilities.sty("width","100%")]),Runtime.New(T,{
         $:0
        }))]))]))]))]));
       };
       ico=function(name)
       {
        return Html.Span(List.ofArray([Utilities.cls("fa"),Utilities.cls(name),Utilities.cls("fa-3x"),Utilities.sty("font-size","400%"),Utilities.sty("color","#aaa")]),Runtime.New(T,{
         $:0
        }));
       };
       arg20=function()
       {
        return go({
         $:2
        });
       };
       return Html.Div(List.ofArray([Utilities.cls("extensions")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("container")]),List.ofArray([Html.Section(List.ofArray([Utilities.cls("block-huge")]),List.ofArray([Html.H10(List.ofArray([Utilities.txt("WebSharper UI.Next: "),Html.Span(List.ofArray([Utilities.cls("text-muted")]),List.ofArray([Utilities.txt("Everything you need to know.")]))])),Html.P(List.ofArray([Utilities.cls("lead")]),List.ofArray([Utilities.txt("A selection of resources about UI.Next.")]))]))])),Html.Div(List.ofArray([Utilities.cls("block-large"),Utilities.cls("bg-alt")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("container")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("row"),Utilities.cls("text-center")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-lg-4")]),List.ofArray([ico("fa-graduation-cap"),Html.H30(List.ofArray([Utilities.txt("Get Started")])),Html.P0(List.ofArray([Utilities.txt("Take the tutorial, and you'll be writing reactive applications in no time!")])),Site.linkBtn("Tutorial","https://github.com/intellifactory/websharper.ui.next/blob/master/docs/Tutorial.md")])),Html.Div(List.ofArray([Utilities.cls("col-lg-4")]),List.ofArray([ico("fa-book"),Html.H30(List.ofArray([Utilities.txt("Dive Right In")])),Html.P0(List.ofArray([Utilities.txt("Comprehensive documentation on the UI.Next API.")])),Site.linkBtn("API Reference","https://github.com/intellifactory/websharper.ui.next/blob/master/docs/API.md")])),Html.Div(List.ofArray([Utilities.cls("col-lg-4")]),List.ofArray([ico("fa-send"),Html.H30(List.ofArray([Utilities.txt("See it in Action")])),Html.P0(List.ofArray([Utilities.txt("A variety of samples using UI.Next, and their associated source code!")])),Doc.Button("Samples",List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-default")]),arg20)]))]))]))])),Doc.Concat(List.mapi(function(i)
       {
        return function(entry)
        {
         return(i%2===0?oddEntry:evenEntry)(entry);
        };
       },Site.Entries()))]));
      },
      Entries:Runtime.Field(function()
      {
       return List.ofArray([Site.mkEntry("Documentation","Official documentation on WebSharper UI.Next, including the API reference and some discussion about the design decisions we made","files/gear.png",List.ofArray([Utilities.href("Tutorial","https://github.com/intellifactory/websharper.ui.next/blob/master/docs/Tutorial.md"),Utilities.href("API Reference","https://github.com/intellifactory/websharper.ui.next/blob/master/docs/API.md"),Utilities.href("Full Documentation","https://github.com/intellifactory/websharper.ui.next/blob/master/README.md")])),Site.mkEntry("Articles","Articles written about UI.Next, which provide more detailed discussions about various aspects of the library.","files/uinext-screen.png",List.ofArray([Utilities.href("WebSharper UI.Next: An Introduction","http://www.websharper.com/blog-entry/3954"),Utilities.href("WebSharper UI.Next: Declarative Animation","http://www.websharper.com/blog-entry/3964"),Utilities.href("Structuring Applications with WebSharper UI.Next","http://www.websharper.com/blog-entry/3965")])),Site.mkEntry("Presentations","Presentations about UI.Next, providing an overview of the library and deeper insights into the thinking behind it.","files/anton-pres.png",List.ofArray([Utilities.href("Presentation: Tackle UI with Reactive DOM in F# and WebSharper","https://www.youtube.com/watch?v=wEkS09s3KBc")]))]);
      }),
      Fade:Runtime.Field(function()
      {
       var _arg00_312_13,_arg10_312_13,arg20;
       _arg00_312_13=Interpolation1.get_Double();
       _arg10_312_13=Easing.get_CubicInOut();
       arg20=Site.fadeTime();
       return function(arg30)
       {
        return function(arg40)
        {
         return An.Simple(_arg00_312_13,_arg10_312_13,arg20,arg30,arg40);
        };
       };
      }),
      FadeTransition:Runtime.Field(function()
      {
       return Trans1.Exit(function()
       {
        return((Site.Fade())(1))(0);
       },Trans1.Enter(function()
       {
        return((Site.Fade())(0))(1);
       },Trans.Create(Site.Fade())));
      }),
      HomePage:function()
      {
       return Html.Div(List.ofArray([Utilities.cls("container")]),List.ofArray([Html.Section(List.ofArray([Utilities.cls("block-huge"),Utilities.cls("teaser-home"),Utilities.sty("height","700px"),Utilities.sty("padding-top","40px"),Utilities.sty("padding-bottom","30px"),Utilities.sty("margin-bottom","40px")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("container")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("row")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-12")]),List.ofArray([Html.Br(Runtime.New(T,{
        $:0
       }),Runtime.New(T,{
        $:0
       })),Html.H10(List.ofArray([Utilities.txt("WebSharper UI.Next: "),Html.Span(List.ofArray([Utilities.cls("text-muted")]),List.ofArray([Utilities.txt("A new generation of reactive web applications.")]))])),Html.H30(List.ofArray([Utilities.txt("Write powerful, data-backed applications"),Html.Br(Runtime.New(T,{
        $:0
       }),Runtime.New(T,{
        $:0
       })),Utilities.txt(" using F# and WebSharper.")])),Html.P(List.ofArray([Utilities.cls("lead")]),List.ofArray([Utilities.txt("Get it free on NuGet today!")]))]))]))]))]))]));
      },
      Main:function(samples)
      {
       var arg00,arg10,router;
       arg00=function(pg)
       {
        return pg.PageRouteId;
       };
       arg10=Site.SiteRouter(samples);
       router=Router.Install(arg00,arg10);
       Doc.RunById("main",Doc.EmbedView(View.Map(function(pg)
       {
        var matchValue;
        matchValue=pg.PageType;
        return matchValue.$==1?Site.AboutPage(function(ty)
        {
         return Var.Set(router,Site.pageFor(ty,samples));
        }):matchValue.$==2?Samples.Render(router,pg,samples):Site.HomePage(function(ty)
        {
         return Var.Set(router,Site.pageFor(ty,samples));
        });
       },View.FromVar(router))));
       return Doc.RunById("navigation",Site.NavBar(router,samples));
      },
      MakePage:function(pg)
      {
       var arg30;
       arg30=function(value)
       {
        return Global.String(value);
       };
       return Html.Div(List.ofArray([Attr.AnimatedStyle("opacity",Site.FadeTransition(),View.Const(1),arg30)]),List.ofArray([pg]));
      },
      NavBar:function(v,samples)
      {
       var renderLink,renderExternal;
       renderLink=function(pg)
       {
        return Doc.EmbedView(View.Map(function(page)
        {
         var liAttr;
         liAttr=Unchecked.Equals(page.PageType,pg)?Attr.Class("active"):Attr.get_Empty();
         return Html.LI(List.ofArray([Utilities.cls("nav-item"),liAttr]),List.ofArray([Utilities.link(Site.showPgTy(pg),Runtime.New(T,{
          $:0
         }),function()
         {
          return Var.Set(v,Site.pageFor(pg,samples));
         })]));
        },View.FromVar(v)));
       };
       renderExternal=function(tupledArg)
       {
        var title,lnk;
        title=tupledArg[0];
        lnk=tupledArg[1];
        return Html.LI(List.ofArray([Utilities.cls("nav-item")]),List.ofArray([Utilities.href(title,lnk)]));
       };
       return Html.Nav(List.ofArray([Utilities.cls("container")]),List.ofArray([Html.Div(List.ofArray([Utilities.sty("float","left")]),List.ofArray([Html.A(List.ofArray([Utilities.op_EqualsEqualsGreater("href","http://www.websharper.com/home"),Utilities.sty("text-decoration","none"),Utilities.cls("first")]),List.ofArray([Html.Img(List.ofArray([Utilities.op_EqualsEqualsGreater("src","files/logo-websharper-icon.png"),Utilities.op_EqualsEqualsGreater("alt","[logo]"),Utilities.sty("margin-top","0"),Utilities.sty("border-right","1px"),Utilities.sty("solid","#eee")]),Runtime.New(T,{
        $:0
       })),Html.Img(List.ofArray([Utilities.op_EqualsEqualsGreater("src","files/logo-websharper-text-dark.png"),Utilities.op_EqualsEqualsGreater("alt","WebSharper"),Utilities.sty("height","32px")]),Runtime.New(T,{
        $:0
       }))]))])),Html.Nav(List.ofArray([Utilities.cls("nav"),Utilities.cls("nav-collapsible"),Utilities.cls("right"),Utilities.sty("float","right")]),List.ofArray([Html.UL(List.ofArray([Utilities.cls("nav-list")]),List.ofArray([Doc.Concat(List.map(renderLink,Site.NavPages())),Doc.Concat(List.map(renderExternal,Site.NavExternalLinks()))]))]))]));
      },
      NavExternalLinks:Runtime.Field(function()
      {
       return List.ofArray([["GitHub","http://www.github.com/IntelliFactory/websharper.ui.next"],["API Reference","https://github.com/intellifactory/websharper.ui.next/blob/master/docs/API.md"]]);
      }),
      NavPages:Runtime.Field(function()
      {
       return List.ofArray([{
        $:0
       },{
        $:1
       },{
        $:2
       }]);
      }),
      SiteRouter:function(samples)
      {
       return Router.Merge(List.ofArray([Router.Prefix("home",Site.homeRouter(samples)),Router.Prefix("about",Site.aboutRouter(samples)),Router.Prefix("samples",Samples.SamplesRouter(samples))]));
      },
      aboutPage:Runtime.Field(function()
      {
       return SiteCommon.mkPage(Site.showPgTy({
        $:1
       }),undefined,{
        $:1
       });
      }),
      aboutRouter:function(samples)
      {
       var arg20;
       arg20=function(id)
       {
        return function()
        {
         var aboutPg;
         aboutPg=Site.pageFor({
          $:1
         },samples);
         aboutPg.PageRouteId=id;
         return aboutPg;
        };
       };
       return Router1.Route(Site.unitRouteMap(),null,arg20);
      },
      fadeTime:Runtime.Field(function()
      {
       return 300;
      }),
      homePage:Runtime.Field(function()
      {
       return SiteCommon.mkPage(Site.showPgTy({
        $:0
       }),undefined,{
        $:0
       });
      }),
      homeRouter:function(samples)
      {
       var arg20;
       arg20=function(id)
       {
        return function()
        {
         var homePg;
         homePg=Site.pageFor({
          $:0
         },samples);
         homePg.PageRouteId=id;
         return homePg;
        };
       };
       return Router1.Route(Site.unitRouteMap(),null,arg20);
      },
      linkBtn:function(caption,href)
      {
       return Html.A(List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-default"),Utilities.op_EqualsEqualsGreater("href",href)]),List.ofArray([Utilities.txt(caption)]));
      },
      mkEntry:function(name,desc,img,urls)
      {
       return{
        Name:name,
        ImgURL:img,
        Description:desc,
        URLs:urls
       };
      },
      pageFor:function(pty,samples)
      {
       return pty.$==1?Site.aboutPage():pty.$==2?Samples.InitialSamplePage(samples):Site.homePage();
      },
      showPgTy:function(_arg1)
      {
       return _arg1.$==1?"About":_arg1.$==2?"Samples":"Home";
      },
      unitRouteMap:Runtime.Field(function()
      {
       return RouteMap1.Create(function()
       {
        return Runtime.New(T,{
         $:0
        });
       },function()
       {
        return null;
       });
      })
     },
     SiteCommon:{
      mkPage:function(name,routeId,ty)
      {
       return{
        PageName:name,
        PageRouteId:routeId,
        PageType:ty,
        PageSample:{
         $:0
        }
       };
      }
     },
     SortableBarChart:{
      BarTransition:Runtime.Field(function()
      {
       return Trans1.Enter(function(x)
       {
        return SortableBarChart.SimpleAnimation(0,x);
       },SortableBarChart.SimpleTransition());
      }),
      DelayedAnimation:function(delay,x,y)
      {
       return An.Delayed(Interpolation1.get_Double(),Easing.get_CubicInOut(),300,delay,x,y);
      },
      Description:function()
      {
       return Html.Div0(List.ofArray([Utilities.txt("This sample show-cases animation and data display.")]));
      },
      DisplayGraph:function(data)
      {
       return Html.Div0(List.ofArray([SvgElements.Svg(List.ofArray([Utilities.op_EqualsEqualsGreater("width",Global.String(SortableBarChart.Width())),Utilities.op_EqualsEqualsGreater("height",Global.String(SortableBarChart.Height()))]),List.ofArray([Doc.EmbedView(View.Map(function(arg00)
       {
        return Doc.Concat(arg00);
       },View.ConvertSeqBy(function(d)
       {
        return d.Label;
       },function(dView)
       {
        return SortableBarChart.Render(dView);
       },data)))]))]));
      },
      Height:Runtime.Field(function()
      {
       return 500;
      }),
      LoadData:Runtime.Field(function()
      {
       return View.MapAsync(function()
       {
        return SortableBarChart.LoadFromCSV("AlphaFrequency.csv");
       },View.Const(null));
      }),
      LoadFromCSV:function(url)
      {
       return Concurrency.FromContinuations(function(tupledArg)
       {
        var ok;
        ok=tupledArg[0];
        jQuery.get(url,{},function(data)
        {
         return ok(SortableBarChart.ParseCSV(data));
        });
        return;
       });
      },
      Main:function()
      {
       var vOrder,dataView;
       vOrder=Var.Create({
        $:0
       });
       dataView=View.Map2(function(xs)
       {
        return function(ordering)
        {
         return SortableBarChart.ViewData(xs,ordering);
        };
       },View.Map(function(source)
       {
        return List.ofSeq(source);
       },SortableBarChart.LoadData()),vOrder.get_View());
       return Html.Div0(List.ofArray([Doc.Select(Runtime.New(T,{
        $:0
       }),function(_arg1)
       {
        return SortableBarChart.ShowOrdering(_arg1);
       },List.ofArray([{
        $:0
       },{
        $:1
       }]),vOrder),SortableBarChart.DisplayGraph(dataView)]));
      },
      ParseCSV:function(data)
      {
       return Arrays.map(function(str)
       {
        return SortableBarChart.mkEntry(Strings.SplitChars(str,[44],1));
       },Slice.array(Arrays.filter(function(s)
       {
        return s!=="";
       },Strings.SplitChars(data,[13,10],1)),{
        $:1,
        $0:1
       },{
        $:0
       }));
      },
      Render:function(dView)
      {
       var dyn,width,height,x1,y,arg30;
       dyn=function(name,proj)
       {
        return Attr.Dynamic(name,View.Map(function(x)
        {
         return Global.String(proj(x));
        },dView));
       };
       width=function(d)
       {
        return SortableBarChart.Width()/+d.NumData-SortableBarChart.Spacing();
       };
       height=function(d)
       {
        return d.Value/d.MaxValue*SortableBarChart.Height();
       };
       x1=function(d)
       {
        return(width(d)+SortableBarChart.Spacing())*+d.Rank;
       };
       y=function(d)
       {
        return SortableBarChart.Height()-height(d);
       };
       arg30=function(value)
       {
        return Global.String(value);
       };
       return SvgElements.G(List.ofArray([Attr.Style("fill","steelblue")]),List.ofArray([SvgElements.Rect(List.ofArray([dyn("width",width),dyn("height",height),Attr.Animated("x",SortableBarChart.BarTransition(),View.Map(x1,dView),arg30),dyn("y",y)]),Runtime.New(T,{
        $:0
       }))]));
      },
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("SortableBarChart").FileName("SortableBarChart.fs").Keywords(List.ofArray(["animation"])).Render(function()
       {
        return SortableBarChart.Main();
       }).RenderDescription(function()
       {
        return SortableBarChart.Description();
       }).Create();
      }),
      ShowOrdering:function(_arg1)
      {
       return _arg1.$==1?"By Frequency":"By Letter";
      },
      SimpleAnimation:function(x,y)
      {
       return SortableBarChart.DelayedAnimation(0,x,y);
      },
      SimpleTransition:Runtime.Field(function()
      {
       return Trans.Create(function(x)
       {
        return function(y)
        {
         return SortableBarChart.SimpleAnimation(x,y);
        };
       });
      }),
      Spacing:Runtime.Field(function()
      {
       return 2;
      }),
      ViewData:function(xs,ordering)
      {
       var numData,maxVal;
       numData=Seq.length(xs);
       maxVal=Seq.fold(function(max)
       {
        return function(x)
        {
         return x.DataValue>max?x.DataValue:max;
        };
       },0,xs);
       return List.mapi(function(i)
       {
        return function(x)
        {
         return{
          Label:x.DataLabel,
          Value:x.DataValue,
          Rank:i,
          MaxValue:maxVal,
          NumData:numData
         };
        };
       },List.sortWith(ordering.$==1?function(x)
       {
        return function(y)
        {
         return y.DataValue<x.DataValue?-1:x.DataValue===y.DataValue?0:1;
        };
       }:function(x)
       {
        return function(y)
        {
         return Unchecked.Compare(x.DataLabel,y.DataLabel);
        };
       },List.ofSeq(xs)));
      },
      Width:Runtime.Field(function()
      {
       return 720;
      }),
      mkEntry:function(row)
      {
       return{
        DataLabel:Arrays.get(row,0),
        DataValue:parseFloat(Arrays.get(row,1))
       };
      }
     },
     TodoList:{
      CreateModel:function()
      {
       return{
        Items:ListModel.Create(function(item)
        {
         return item.Key;
        },Runtime.New(T,{
         $:0
        }))
       };
      },
      Description:function()
      {
       return Html.Div0(List.ofArray([Doc.TextNode("A to-do list application.")]));
      },
      Main:function()
      {
       return TodoList.TodoExample();
      },
      RenderItem:function(m,todo)
      {
       return Html.TR0(List.ofArray([Html.TD0(List.ofArray([Doc.EmbedView(View.Map(function(isDone)
       {
        return isDone?Html.Del0(List.ofArray([Utilities.txt(todo.TodoText)])):Utilities.txt(todo.TodoText);
       },View.FromVar(todo.Done)))])),Html.TD0(List.ofArray([Util.button("Done",function()
       {
        return Var.Set(todo.Done,true);
       })])),Html.TD0(List.ofArray([Util.button("Remove",function()
       {
        return m.Items.Remove(todo);
       })]))]));
      },
      Sample:Runtime.Field(function()
      {
       return Samples.Build().Id("TodoList").FileName("TodoList.fs").Keywords(List.ofArray(["todo"])).Render(function()
       {
        return TodoList.Main();
       }).RenderDescription(function()
       {
        return TodoList.Description();
       }).Create();
      }),
      TodoExample:function()
      {
       var m;
       m=TodoList.CreateModel();
       return Html.Table(List.ofArray([Utilities.op_EqualsEqualsGreater("class","table table-hover")]),List.ofArray([Html.TBody0(List.ofArray([TodoList.TodoList(m),TodoList.TodoForm(m)]))]));
      },
      TodoForm:function(m)
      {
       var rvInput;
       rvInput=Var.Create("");
       return Html.Form0(List.ofArray([Utilities.divc("form-group",List.ofArray([Html.Label0(List.ofArray([Utilities.txt("New entry: ")])),Util.input(rvInput)])),Util.button("Submit",function()
       {
        return m.Items.Add(TodoItem.Create(Var.Get(rvInput)));
       })]));
      },
      TodoItem:Runtime.Class({},{
       Create:function(s)
       {
        var Key1;
        Key1=Key.Fresh();
        return Runtime.New(TodoItem,{
         Done:Var.Create(false),
         Key:Key1,
         TodoText:s
        });
       }
      }),
      TodoList:function(m)
      {
       return Doc.ConvertBy(function(m1)
       {
        return m1.Key;
       },function(todo)
       {
        return TodoList.RenderItem(m,todo);
       },ListModel1.View(m.Items));
      },
      Util:{
       button:function(name,handler)
       {
        return Doc.Button(name,List.ofArray([Utilities.op_EqualsEqualsGreater("class","btn btn-default")]),handler);
       },
       input:function(x)
       {
        return Doc.Input(List.ofArray([Utilities.op_EqualsEqualsGreater("class","form-control")]),x);
       }
      }
     },
     Utilities:{
      btn:function(caption,act)
      {
       return Doc.Button(caption,List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-default")]),act);
      },
      cls:function(n)
      {
       return Attr.Class(n);
      },
      divc:function(c,docs)
      {
       return Doc.Element("div",List.ofArray([Utilities.cls(c)]),docs);
      },
      href:function(text,url)
      {
       return Doc.Element("a",List.ofArray([Utilities.op_EqualsEqualsGreater("href",url)]),List.ofArray([Utilities.txt(text)]));
      },
      link:function(cap,attr,act)
      {
       return Doc.Link(cap,attr,act);
      },
      op_EqualsEqualsGreater:function(k,v)
      {
       return Attr.Create(k,v);
      },
      sty:function(n,v)
      {
       return Attr.Style(n,v);
      },
      txt:function(t)
      {
       return Doc.TextNode(t);
      }
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  UI=Runtime.Safe(Global.WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Interpolation1=Runtime.Safe(Next.Interpolation1);
  Easing=Runtime.Safe(Next.Easing);
  AnimatedBobsleighSite=Runtime.Safe(Next.AnimatedBobsleighSite);
  An=Runtime.Safe(Next.An);
  Trans1=Runtime.Safe(Next.Trans1);
  Trans=Runtime.Safe(Next.Trans);
  Var=Runtime.Safe(Next.Var);
  Doc=Runtime.Safe(Next.Doc);
  List=Runtime.Safe(Global.WebSharper.List);
  Html=Runtime.Safe(Next.Html);
  Utilities=Runtime.Safe(Next.Utilities);
  T=Runtime.Safe(List.T);
  View=Runtime.Safe(Next.View);
  Attr=Runtime.Safe(Next.Attr);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Samples=Runtime.Safe(Next.Samples);
  AnimatedContactFlow=Runtime.Safe(Next.AnimatedContactFlow);
  Flow=Runtime.Safe(Next.Flow);
  Flow1=Runtime.Safe(Next.Flow1);
  BobsleighSite=Runtime.Safe(Next.BobsleighSite);
  Calculator=Runtime.Safe(Next.Calculator);
  Var1=Runtime.Safe(Next.Var1);
  CheckBoxTest=Runtime.Safe(Next.CheckBoxTest);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Person=Runtime.Safe(CheckBoxTest.Person);
  Site=Runtime.Safe(Next.Site);
  SimpleTextBox=Runtime.Safe(Next.SimpleTextBox);
  InputTransform=Runtime.Safe(Next.InputTransform);
  TodoList=Runtime.Safe(Next.TodoList);
  PhoneExample=Runtime.Safe(Next.PhoneExample);
  EditablePersonList=Runtime.Safe(Next.EditablePersonList);
  ContactFlow=Runtime.Safe(Next.ContactFlow);
  MessageBoard=Runtime.Safe(Next.MessageBoard);
  RoutedBobsleighSite=Runtime.Safe(Next.RoutedBobsleighSite);
  ObjectConstancy=Runtime.Safe(Next.ObjectConstancy);
  MouseInfo=Runtime.Safe(Next.MouseInfo);
  KeyboardInfo=Runtime.Safe(Next.KeyboardInfo);
  Common=Runtime.Safe(Next.Common);
  Fresh=Runtime.Safe(Common.Fresh);
  String=Runtime.Safe(Global.String);
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Input=Runtime.Safe(Next.Input);
  Keyboard=Runtime.Safe(Input.Keyboard);
  Auth=Runtime.Safe(MessageBoard.Auth);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Server=Runtime.Safe(Next.Server);
  Mouse=Runtime.Safe(Input.Mouse);
  jQuery=Runtime.Safe(Global.jQuery);
  DataSet=Runtime.Safe(ObjectConstancy.DataSet);
  Slice=Runtime.Safe(Global.WebSharper.Slice);
  SvgElements=Runtime.Safe(Html.SvgElements);
  Math=Runtime.Safe(Global.Math);
  Phone=Runtime.Safe(PhoneExample.Phone);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Order=Runtime.Safe(PhoneExample.Order);
  RouteMap1=Runtime.Safe(Next.RouteMap1);
  Builder=Runtime.Safe(Samples.Builder);
  Router=Runtime.Safe(Next.Router);
  Router1=Runtime.Safe(Next.Router1);
  SiteCommon=Runtime.Safe(Next.SiteCommon);
  Option=Runtime.Safe(Global.WebSharper.Option);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  MapModule=Runtime.Safe(Collections.MapModule);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  SortableBarChart=Runtime.Safe(Next.SortableBarChart);
  parseFloat=Runtime.Safe(Global.parseFloat);
  ListModel=Runtime.Safe(Next.ListModel);
  Util=Runtime.Safe(TodoList.Util);
  TodoItem=Runtime.Safe(TodoList.TodoItem);
  Key=Runtime.Safe(Next.Key);
  ListModel1=Runtime.Safe(Next.ListModel1);
  return Client=Runtime.Safe(Next.Client);
 });
 Runtime.OnLoad(function()
 {
  TodoList.Sample();
  SortableBarChart.Width();
  SortableBarChart.Spacing();
  SortableBarChart.SimpleTransition();
  SortableBarChart.Sample();
  SortableBarChart.LoadData();
  SortableBarChart.Height();
  SortableBarChart.BarTransition();
  Site.unitRouteMap();
  Site.homePage();
  Site.fadeTime();
  Site.aboutPage();
  Site.NavPages();
  Site.NavExternalLinks();
  Site.FadeTransition();
  Site.Fade();
  Site.Entries();
  SimpleTextBox.Sample();
  Server.threads();
  Server.posts();
  Server.DELAY();
  Samples.nav();
  RoutedBobsleighSite.TheRouteMap();
  RoutedBobsleighSite.Sample();
  PhoneExample.Sample();
  ObjectConstancy.Width();
  ObjectConstancy.SimpleTransition();
  ObjectConstancy.Sample();
  ObjectConstancy.InOutTransition();
  ObjectConstancy.Height();
  MouseInfo.Sample();
  MessageBoard.Sample();
  KeyboardInfo.keys();
  KeyboardInfo.Sample();
  InputTransform.Sample();
  EditablePersonList.peopleList();
  EditablePersonList.peopleBoxes();
  EditablePersonList.memberList();
  EditablePersonList.Sample();
  ContactFlow.personFlowlet();
  ContactFlow.contactTypeFlowlet();
  ContactFlow.Sample();
  Fresh.i();
  Client.Main();
  CheckBoxTest.Sample();
  CheckBoxTest.People();
  Calculator.initCalc();
  Calculator.Sample();
  BobsleighSite.pages();
  BobsleighSite.Sample();
  AnimatedContactFlow.swipeTime();
  AnimatedContactFlow.personFlowlet();
  AnimatedContactFlow.fadeTime();
  AnimatedContactFlow.contactTypeFlowlet();
  AnimatedContactFlow.SwipeTransition();
  AnimatedContactFlow.Swipe();
  AnimatedContactFlow.Sample();
  AnimatedContactFlow.FadeTransition();
  AnimatedContactFlow.Fade();
  AnimatedBobsleighSite.pages();
  AnimatedBobsleighSite.fadeTime();
  AnimatedBobsleighSite.Sample();
  AnimatedBobsleighSite.FadeTransition();
  AnimatedBobsleighSite.Fade();
  return;
 });
}());


if (typeof IntelliFactory !=='undefined')
  IntelliFactory.Runtime.Start();

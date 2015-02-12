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

        Field:
            function (f) {
                var value, ready = false;
                return function () {
                    if (!ready) { ready = true; value = f(); }
                    return value;
                }
            },

        For:
            function (lowerBound, upperBound, body) {
                for (var i = lowerBound; i <= upperBound; i++) {
                    body(i);
                }
            },

        ForEach:
            function (obj, body) {
                for (var f in obj) {
                    body(f);
                }
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

        Throw:
            function (e) {
                throw e;
            },

        Tupled:
            function (f) {
                return function (x) {
                    if (arguments.length > 1) {
                        return f(arguments);
                    } else {
                        return f(x);
                    }
                }
            },

        Try:
            function (block, handler) {
                try {
                    return block();
                } catch (e) {
                    return handler(e);
                }
            },

        TryFinally:
            function (block, handler) {
                try {
                    return block();
                } finally {
                    handler();
                }
            },

        While:
            function (guard, body) {
                while (guard()) {
                    body();
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
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,Arrays,Operators,Number,IntrinsicFunctionProxy,Array,Seq,Unchecked,Enumerator,Arrays2D,Concurrency,AggregateException,Option,clearTimeout,setTimeout,CancellationTokenSource,Char,Util,Lazy,Error,Date,console,Scheduler,T,Html,Client,Activator,document,jQuery,Json,JSON,JavaScript,JS,HtmlContentExtensions,SingleNode,List,T1,Math,Strings,PrintfHelpers,Remoting,XhrProvider,AsyncProxy,Enumerable,String,RegExp;
 Runtime.Define(Global,{
  IntelliFactory:{
   WebSharper:{
    AggregateException:Runtime.Class({},{
     New:function($innerExceptions)
     {
      var $0=this,$this=this;
      return Global.e=new Global.Error("AggregateException"),Global.e.InnerExceptions=$innerExceptions,Global.e;
     }
    }),
    Arrays:{
     Find:function(f,arr)
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
     FindIndex:function(f,arr)
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
     Pick:function(f,arr)
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
     average:function(arr)
     {
      return Number(Arrays.sum(arr))/Number(IntrinsicFunctionProxy.GetLength(arr));
     },
     averageBy:function(f,arr)
     {
      return Number(Arrays.sumBy(f,arr))/Number(IntrinsicFunctionProxy.GetLength(arr));
     },
     blit:function(arr1,start1,arr2,start2,length)
     {
      var i;
      Arrays.checkRange(arr1,start1,length);
      Arrays.checkRange(arr2,start2,length);
      for(i=0;i<=length-1;i++){
       IntrinsicFunctionProxy.SetArray(arr2,start2+i,IntrinsicFunctionProxy.GetArray(arr1,start1+i));
      }
      return;
     },
     checkLength:function(arr1,arr2)
     {
      return IntrinsicFunctionProxy.GetLength(arr1)!==IntrinsicFunctionProxy.GetLength(arr2)?Operators.FailWith("Arrays differ in length."):null;
     },
     checkRange:function(arr,start,size)
     {
      return((size<0?true:start<0)?true:IntrinsicFunctionProxy.GetLength(arr)<start+size)?Operators.FailWith("Index was outside the bounds of the array."):null;
     },
     choose:function(f,arr)
     {
      var q,i,matchValue,_,x;
      q=[];
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr)-1;i++){
       matchValue=f(IntrinsicFunctionProxy.GetArray(arr,i));
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
       IntrinsicFunctionProxy.SetArray(r,i,value);
      }
      return r;
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
       IntrinsicFunctionProxy.SetArray(arr,i,value);
      }
      return;
     },
     filter:function(f,arr)
     {
      var r,i;
      r=[];
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr)-1;i++){
       f(IntrinsicFunctionProxy.GetArray(arr,i))?r.push(IntrinsicFunctionProxy.GetArray(arr,i)):null;
      }
      return r;
     },
     fold:function(f,zero,arr)
     {
      var acc,i;
      acc=zero;
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr)-1;i++){
       acc=(f(acc))(IntrinsicFunctionProxy.GetArray(arr,i));
      }
      return acc;
     },
     fold2:function(f,zero,arr1,arr2)
     {
      var accum,i;
      Arrays.checkLength(arr1,arr2);
      accum=zero;
      for(i=0;i<=arr1.length-1;i++){
       accum=((f(accum))(IntrinsicFunctionProxy.GetArray(arr1,i)))(IntrinsicFunctionProxy.GetArray(arr2,i));
      }
      return accum;
     },
     foldBack:function(f,arr,zero)
     {
      var acc,len,i;
      acc=zero;
      len=IntrinsicFunctionProxy.GetLength(arr);
      for(i=1;i<=len;i++){
       acc=(f(IntrinsicFunctionProxy.GetArray(arr,len-i)))(acc);
      }
      return acc;
     },
     foldBack2:function(f,arr1,arr2,zero)
     {
      var len,accum,i;
      Arrays.checkLength(arr1,arr2);
      len=IntrinsicFunctionProxy.GetLength(arr1);
      accum=zero;
      for(i=1;i<=len;i++){
       accum=((f(IntrinsicFunctionProxy.GetArray(arr1,len-i)))(IntrinsicFunctionProxy.GetArray(arr2,len-i)))(accum);
      }
      return accum;
     },
     forall2:function(f,arr1,arr2)
     {
      Arrays.checkLength(arr1,arr2);
      return Seq.forall2(f,arr1,arr2);
     },
     init:function(size,f)
     {
      var r,i;
      size<0?Operators.FailWith("Negative size given."):null;
      r=Array(size);
      for(i=0;i<=size-1;i++){
       IntrinsicFunctionProxy.SetArray(r,i,f(i));
      }
      return r;
     },
     iter:function(f,arr)
     {
      var i;
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr)-1;i++){
       f(IntrinsicFunctionProxy.GetArray(arr,i));
      }
      return;
     },
     iter2:function(f,arr1,arr2)
     {
      var i;
      Arrays.checkLength(arr1,arr2);
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr1)-1;i++){
       (f(IntrinsicFunctionProxy.GetArray(arr1,i)))(IntrinsicFunctionProxy.GetArray(arr2,i));
      }
      return;
     },
     iteri:function(f,arr)
     {
      var i;
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr)-1;i++){
       (f(i))(IntrinsicFunctionProxy.GetArray(arr,i));
      }
      return;
     },
     iteri2:function(f,arr1,arr2)
     {
      var i;
      Arrays.checkLength(arr1,arr2);
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr1)-1;i++){
       ((f(i))(IntrinsicFunctionProxy.GetArray(arr1,i)))(IntrinsicFunctionProxy.GetArray(arr2,i));
      }
      return;
     },
     map:function(f,arr)
     {
      var r,i;
      r=Array(IntrinsicFunctionProxy.GetLength(arr));
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr)-1;i++){
       IntrinsicFunctionProxy.SetArray(r,i,f(IntrinsicFunctionProxy.GetArray(arr,i)));
      }
      return r;
     },
     map2:function(f,arr1,arr2)
     {
      var r,i;
      Arrays.checkLength(arr1,arr2);
      r=Array(IntrinsicFunctionProxy.GetLength(arr2));
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr2)-1;i++){
       IntrinsicFunctionProxy.SetArray(r,i,(f(IntrinsicFunctionProxy.GetArray(arr1,i)))(IntrinsicFunctionProxy.GetArray(arr2,i)));
      }
      return r;
     },
     mapi:function(f,arr)
     {
      var y,i;
      y=Array(IntrinsicFunctionProxy.GetLength(arr));
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr)-1;i++){
       IntrinsicFunctionProxy.SetArray(y,i,(f(i))(IntrinsicFunctionProxy.GetArray(arr,i)));
      }
      return y;
     },
     mapi2:function(f,arr1,arr2)
     {
      var res,i;
      Arrays.checkLength(arr1,arr2);
      res=Array(IntrinsicFunctionProxy.GetLength(arr1));
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr1)-1;i++){
       IntrinsicFunctionProxy.SetArray(res,i,((f(i))(IntrinsicFunctionProxy.GetArray(arr1,i)))(IntrinsicFunctionProxy.GetArray(arr2,i)));
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
      return IntrinsicFunctionProxy.GetLength(arr)===0?Operators.FailWith("The input array was empty."):null;
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
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr)-1;i++){
       f(IntrinsicFunctionProxy.GetArray(arr,i))?ret1.push(IntrinsicFunctionProxy.GetArray(arr,i)):ret2.push(IntrinsicFunctionProxy.GetArray(arr,i));
      }
      return[ret1,ret2];
     },
     permute:function(f,arr)
     {
      var ret,i;
      ret=Array(IntrinsicFunctionProxy.GetLength(arr));
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr)-1;i++){
       IntrinsicFunctionProxy.SetArray(ret,f(i),IntrinsicFunctionProxy.GetArray(arr,i));
      }
      return ret;
     },
     reduce:function(f,arr)
     {
      var acc,i;
      Arrays.nonEmpty(arr);
      acc=IntrinsicFunctionProxy.GetArray(arr,0);
      for(i=1;i<=IntrinsicFunctionProxy.GetLength(arr)-1;i++){
       acc=(f(acc))(IntrinsicFunctionProxy.GetArray(arr,i));
      }
      return acc;
     },
     reduceBack:function(f,arr)
     {
      var len,acc,i;
      Arrays.nonEmpty(arr);
      len=IntrinsicFunctionProxy.GetLength(arr);
      acc=IntrinsicFunctionProxy.GetArray(arr,len-1);
      for(i=2;i<=len;i++){
       acc=(f(IntrinsicFunctionProxy.GetArray(arr,len-i)))(acc);
      }
      return acc;
     },
     reverse:function(array,offset,length)
     {
      var a;
      a=Arrays.sub(array,offset,length).slice().reverse();
      return Arrays.blit(a,0,array,offset,IntrinsicFunctionProxy.GetLength(a));
     },
     scan:function(f,zero,arr)
     {
      var ret,i;
      ret=Array(1+IntrinsicFunctionProxy.GetLength(arr));
      IntrinsicFunctionProxy.SetArray(ret,0,zero);
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr)-1;i++){
       IntrinsicFunctionProxy.SetArray(ret,i+1,(f(IntrinsicFunctionProxy.GetArray(ret,i)))(IntrinsicFunctionProxy.GetArray(arr,i)));
      }
      return ret;
     },
     scanBack:function(f,arr,zero)
     {
      var len,ret,i;
      len=IntrinsicFunctionProxy.GetLength(arr);
      ret=Array(1+len);
      IntrinsicFunctionProxy.SetArray(ret,len,zero);
      for(i=0;i<=len-1;i++){
       IntrinsicFunctionProxy.SetArray(ret,len-i-1,(f(IntrinsicFunctionProxy.GetArray(arr,len-i-1)))(IntrinsicFunctionProxy.GetArray(ret,len-i)));
      }
      return ret;
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
      var f1;
      f1=Runtime.Tupled(function(tupledArg)
      {
       var x,y;
       x=tupledArg[0];
       y=tupledArg[1];
       return Operators.Compare(f(x),f(y));
      });
      return arr.slice().sort(f1);
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
      var f1;
      f1=Runtime.Tupled(function(tupledArg)
      {
       var x,y;
       x=tupledArg[0];
       y=tupledArg[1];
       return Operators.Compare(f(x),f(y));
      });
      return arr.sort(f1);
     },
     sortInPlaceWith:function(comparer,arr)
     {
      var f;
      f=Runtime.Tupled(function(tupledArg)
      {
       var x,y;
       x=tupledArg[0];
       y=tupledArg[1];
       return(comparer(x))(y);
      });
      return arr.sort(f);
     },
     sortWith:function(comparer,arr)
     {
      var f;
      f=Runtime.Tupled(function(tupledArg)
      {
       var x,y;
       x=tupledArg[0];
       y=tupledArg[1];
       return(comparer(x))(y);
      });
      return arr.slice().sort(f);
     },
     sub:function(arr,start,length)
     {
      Arrays.checkRange(arr,start,length);
      return arr.slice(start,start+length);
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
      while(i<IntrinsicFunctionProxy.GetLength(arr)?res.$==0:false)
       {
        f(IntrinsicFunctionProxy.GetArray(arr,i))?res={
         $:1,
         $0:IntrinsicFunctionProxy.GetArray(arr,i)
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
      while(i<IntrinsicFunctionProxy.GetLength(arr)?res.$==0:false)
       {
        f(IntrinsicFunctionProxy.GetArray(arr,i))?res={
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
      while(i<IntrinsicFunctionProxy.GetLength(arr)?res.$==0:false)
       {
        matchValue=f(IntrinsicFunctionProxy.GetArray(arr,i));
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
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr)-1;i++){
       patternInput=IntrinsicFunctionProxy.GetArray(arr,i);
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
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr)-1;i++){
       matchValue=IntrinsicFunctionProxy.GetArray(arr,i);
       c=matchValue[2];
       b=matchValue[1];
       a=matchValue[0];
       x.push(a);
       y.push(b);
       z.push(c);
      }
      return[x,y,z];
     },
     zip:function(arr1,arr2)
     {
      var res,i;
      Arrays.checkLength(arr1,arr2);
      res=Array(arr1.length);
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr1)-1;i++){
       IntrinsicFunctionProxy.SetArray(res,i,[IntrinsicFunctionProxy.GetArray(arr1,i),IntrinsicFunctionProxy.GetArray(arr2,i)]);
      }
      return res;
     },
     zip3:function(arr1,arr2,arr3)
     {
      var res,i;
      Arrays.checkLength(arr1,arr2);
      Arrays.checkLength(arr2,arr3);
      res=Array(arr1.length);
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr1)-1;i++){
       IntrinsicFunctionProxy.SetArray(res,i,[IntrinsicFunctionProxy.GetArray(arr1,i),IntrinsicFunctionProxy.GetArray(arr2,i),IntrinsicFunctionProxy.GetArray(arr3,i)]);
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
        return IntrinsicFunctionProxy.GetArray2D(array,i,j);
       };
      });
     },
     init:function(n,m,f)
     {
      var array,i,j;
      array=Arrays2D.zeroCreate(n,m);
      for(i=0;i<=n-1;i++){
       for(j=0;j<=m-1;j++){
        IntrinsicFunctionProxy.SetArray2D(array,i,j,(f(i))(j));
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
        f(IntrinsicFunctionProxy.GetArray2D(array,i,j));
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
        ((f(i))(j))(IntrinsicFunctionProxy.GetArray2D(array,i,j));
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
        return f(IntrinsicFunctionProxy.GetArray2D(array,i,j));
       };
      });
     },
     mapi:function(f,array)
     {
      return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
      {
       return function(j)
       {
        return((f(i))(j))(IntrinsicFunctionProxy.GetArray2D(array,i,j));
       };
      });
     },
     zeroCreate:function(n,m)
     {
      return IntrinsicFunctionProxy.Array2DZeroCreate(n,m);
     }
    },
    AsyncProxy:Runtime.Class({},{
     get_CancellationToken:function()
     {
      return Concurrency.GetCT();
     },
     get_DefaultCancellationToken:function()
     {
      return Concurrency.defCTS().contents;
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
        _=IntrinsicFunctionProxy.GetLength(errors)>0?Operators.Raise(AggregateException.New(errors)):null;
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
       var callback,value;
       callback=function()
       {
        return cts.Cancel();
       };
       value=Concurrency.Register(t,function()
       {
        return callback();
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
           $0:new Error("OperationCanceledException")
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
       continued={
        contents:false
       };
       once=function(cont)
       {
        var _;
        if(continued.contents)
         {
          _=Operators.FailWith("A continuation provided by Async.FromContinuations was invoked multiple times");
         }
        else
         {
          continued.contents=true;
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
      if(IntrinsicFunctionProxy.GetLength(cs1)===0)
       {
        _=Concurrency.Return([]);
       }
      else
       {
        r=function(c)
        {
         var n,o,a,accept;
         n=cs1.length;
         o={
          contents:n
         };
         a=Arrays.create(n,undefined);
         accept=function(i)
         {
          return function(x)
          {
           var matchValue,_1,_2,x1,res,_3,x2,n1,res1;
           matchValue=[o.contents,x];
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
                 IntrinsicFunctionProxy.SetArray(a,i,x1);
                 o.contents=0;
                 _2=c.k.call(null,{
                  $:0,
                  $0:a
                 });
                }
               else
                {
                 matchValue[0];
                 res=matchValue[1];
                 o.contents=0;
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
                 IntrinsicFunctionProxy.SetArray(a,i,x2);
                 _3=void(o.contents=n1-1);
                }
               else
                {
                 matchValue[0];
                 res1=matchValue[1];
                 o.contents=0;
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
        return IntrinsicFunctionProxy.SetArray(ct.r,i,function()
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
           $0:new Error("OperationCanceledException")
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
       ps=["WebSharper: Uncaught asynchronous exception",exn];
       return console?console.log.apply(console,ps):undefined;
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
       cached={
        contents:{
         $:0
        }
       };
       queue=[];
       action=function()
       {
        return r({
         k:function(res)
         {
          cached.contents={
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
        matchValue=cached.contents;
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
      ct=Operators.DefaultArg(ctOpt,Concurrency.defCTS().contents);
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
        $0:new Error("OperationCanceledException")
       }):r(c);
      };
     },
     defCTS:Runtime.Field(function()
     {
      return{
       contents:CancellationTokenSource.New()
      };
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
      var _,next,_2,next1;
      if(x instanceof Global.Array)
       {
        next=function(e)
        {
         var i,_1,v,v1;
         i=e.s;
         if(i<IntrinsicFunctionProxy.GetLength(x))
          {
           v=IntrinsicFunctionProxy.GetArray(x,i);
           e.c=v;
           v1=i+1;
           e.s=v1;
           _1=true;
          }
         else
          {
           _1=false;
          }
         return _1;
        };
        _=T.New(0,null,next);
       }
      else
       {
        if(Unchecked.Equals(typeof x,"string"))
         {
          next1=function(e)
          {
           var i,_1,v,v1;
           i=e.s;
           if(i<x.length)
            {
             v=x.charCodeAt(i);
             e.c=v;
             v1=i+1;
             e.s=v1;
             _1=true;
            }
           else
            {
             _1=false;
            }
           return _1;
          };
          _2=T.New(0,null,next1);
         }
        else
         {
          _2=x.GetEnumerator();
         }
        _=_2;
       }
      return _;
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
    ExtraTopLevelOperatorsProxy:{
     array2D:function(rows)
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
     }
    },
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
           var text,obj,x,action;
           text=meta.getAttribute("content");
           obj=Json.Activate(JSON.parse(text));
           x=JS.GetFields(obj);
           action=Runtime.Tupled(function(tupledArg)
           {
            var k,v,p,old;
            k=tupledArg[0];
            v=tupledArg[1];
            p=v.get_Body();
            old=document.getElementById(k);
            return p.ReplaceInDom(old);
           });
           return Arrays.iter(action,x);
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
    IntrinsicFunctionProxy:{
     Array2DZeroCreate:function(n,m)
     {
      var arr;
      arr=Arrays.init(n,function()
      {
       return Array(m);
      });
      arr.dims=2;
      return arr;
     },
     BoundsCheck:function(arr,n)
     {
      return(n<0?true:n>=IntrinsicFunctionProxy.GetLength(arr))?Operators.Raise(new Error("IndexOutOfRangeException")):null;
     },
     BoundsCheck2D:function(arr,n1,n2)
     {
      return(((n1<0?true:n2<0)?true:n1>=arr.length)?true:n2>=(arr.length?arr[0].length:0))?Operators.Raise(new Error("IndexOutOfRangeException")):null;
     },
     GetArray:function(arr,n)
     {
      IntrinsicFunctionProxy.BoundsCheck(arr,n);
      return arr[n];
     },
     GetArray2D:function(arr,n1,n2)
     {
      IntrinsicFunctionProxy.BoundsCheck2D(arr,n1,n2);
      return arr[n1][n2];
     },
     GetArray2DSub:function(src,src1,src2,len1,len2)
     {
      var len11,len21,dst,i,j;
      len11=len1<0?0:len1;
      len21=len2<0?0:len2;
      dst=IntrinsicFunctionProxy.Array2DZeroCreate(len11,len21);
      for(i=0;i<=len11-1;i++){
       for(j=0;j<=len21-1;j++){
        IntrinsicFunctionProxy.SetArray2D(dst,i,j,IntrinsicFunctionProxy.GetArray2D(src,src1+i,src2+j));
       }
      }
      return dst;
     },
     GetArraySub:function(arr,start,len)
     {
      var dst,i;
      dst=Array(len);
      for(i=0;i<=len-1;i++){
       IntrinsicFunctionProxy.SetArray(dst,i,IntrinsicFunctionProxy.GetArray(arr,start+1));
      }
      return dst;
     },
     GetLength:function(arr)
     {
      var matchValue;
      matchValue=arr.dims;
      return matchValue===2?arr.length*arr.length:arr.length;
     },
     SetArray:function(arr,n,x)
     {
      IntrinsicFunctionProxy.BoundsCheck(arr,n);
      arr[n]=x;
      return;
     },
     SetArray2D:function(arr,n1,n2,x)
     {
      IntrinsicFunctionProxy.BoundsCheck2D(arr,n1,n2);
      arr[n1][n2]=x;
      return;
     },
     SetArray2DSub:function(dst,src1,src2,len1,len2,src)
     {
      var i,j;
      for(i=0;i<=len1-1;i++){
       for(j=0;j<=len2-1;j++){
        IntrinsicFunctionProxy.SetArray2D(dst,src1+i,src2+j,IntrinsicFunctionProxy.GetArray2D(src,i,j));
       }
      }
      return;
     },
     SetArraySub:function(arr,start,len,src)
     {
      var i;
      for(i=0;i<=len-1;i++){
       IntrinsicFunctionProxy.SetArray(arr,start+i,IntrinsicFunctionProxy.GetArray(src,i));
      }
      return;
     }
    },
    JavaScript:{
     JS:{
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
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(types)-1;i++){
       IntrinsicFunctionProxy.SetArray(types,i,Json.lookup(IntrinsicFunctionProxy.GetArray(types,i)));
      }
      decode=function(x)
      {
       var _,matchValue,_1,_2,o,ti;
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
             _2=Unchecked.Equals(typeof ti,"undefined")?o:Json.restore(IntrinsicFunctionProxy.GetArray(types,ti),o);
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
      k=IntrinsicFunctionProxy.GetLength(x);
      r=Global;
      i=0;
      while(i<k)
       {
        n=IntrinsicFunctionProxy.GetArray(x,i);
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
     restore:function(ty,obj)
     {
      var r;
      r=new ty();
      JS.ForEach(obj,function(k)
      {
       r[k]=obj[k];
       return false;
      });
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
          JS.ForEach(x,function(y)
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
       var next;
       next=function(e)
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
       };
       return T.New(this,null,next);
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
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(arr)-1;i++){
       r=Runtime.New(T1,{
        $:1,
        $0:IntrinsicFunctionProxy.GetArray(arr,IntrinsicFunctionProxy.GetLength(arr)-i-1),
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
    OperatorIntrinsics:{
     GetArraySlice:function(source,start,finish)
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
     GetArraySlice2D:function(arr,start1,finish1,start2,finish2)
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
      return IntrinsicFunctionProxy.GetArray2DSub(arr,start11,start21,len1,len2);
     },
     GetArraySlice2DFixed1:function(arr,fixed1,start2,finish2)
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
       IntrinsicFunctionProxy.SetArray(dst,j,IntrinsicFunctionProxy.GetArray2D(arr,fixed1,start21+j));
      }
      return dst;
     },
     GetArraySlice2DFixed2:function(arr,start1,finish1,fixed2)
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
       IntrinsicFunctionProxy.SetArray(dst,i,IntrinsicFunctionProxy.GetArray2D(arr,start11+i,fixed2));
      }
      return dst;
     },
     GetStringSlice:function(source,start,finish)
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
     },
     SetArraySlice:function(dst,start,finish,src)
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
        _1=IntrinsicFunctionProxy.GetLength(dst)-1;
       }
      finish1=_1;
      return IntrinsicFunctionProxy.SetArraySub(dst,start1,finish1-start1+1,src);
     },
     SetArraySlice2D:function(dst,start1,finish1,start2,finish2,src)
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
      return IntrinsicFunctionProxy.SetArray2DSub(dst,start11,start21,finish11-start11+1,finish21-start21+1,src);
     },
     SetArraySlice2DFixed1:function(dst,fixed1,start2,finish2,src)
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
       IntrinsicFunctionProxy.SetArray2D(dst,fixed1,start21+j,IntrinsicFunctionProxy.GetArray(src,j));
      }
      return;
     },
     SetArraySlice2DFixed2:function(dst,start1,finish1,fixed2,src)
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
       IntrinsicFunctionProxy.SetArray2D(dst,start11+i,fixed2,IntrinsicFunctionProxy.GetArray(src,i));
      }
      return;
     }
    },
    Operators:{
     Compare:function(a,b)
     {
      return Unchecked.Compare(a,b);
     },
     Decrement:function(x)
     {
      x.contents=x.contents-1;
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
      return Operators.Raise(new Error(msg));
     },
     Increment:function(x)
     {
      x.contents=x.contents+1;
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
      var f,_,_this,i;
      f=IntrinsicFunctionProxy.GetArray(s,0);
      if((f===" "?true:f==="+")?true:f==="-")
       {
        _this=s.substr(1);
        i=l-1;
        _=f+Strings.PadLeftWith(_this,i,48);
       }
      else
       {
        _=Strings.PadLeftWith(s,l,48);
       }
      return _;
     },
     plusForPos:function(n,s)
     {
      return 0<=n?"+"+s:s;
     },
     plusForPos0:function(n,s)
     {
      return 0<=n?"+"+s:s;
     },
     prettyPrint:function(o)
     {
      var printObject,t,_1,_2,_3,mapping1,strings1;
      printObject=function(o1)
      {
       var s,_,x,mapping,strings;
       s=Global.String(o1);
       if(s==="[object Object]")
        {
         x=JS.GetFields(o1);
         mapping=Runtime.Tupled(function(tupledArg)
         {
          var k,v;
          k=tupledArg[0];
          v=tupledArg[1];
          return k+" = "+PrintfHelpers.prettyPrint(v);
         });
         strings=Arrays.map(mapping,x);
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
          return p(IntrinsicFunctionProxy.GetArray2D(o,i,j));
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
      return a.splice(0,IntrinsicFunctionProxy.GetLength(a));
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
      return Arrays.blit(a,0,array,index,IntrinsicFunctionProxy.GetLength(a));
     }
    },
    Remoting:{
     AjaxProvider:Runtime.Field(function()
     {
      return XhrProvider.New();
     }),
     Async:function(m,data)
     {
      var headers,payload,f;
      headers=Remoting.makeHeaders(m);
      payload=Remoting.makePayload(data);
      f=function()
      {
       var x,f1;
       x=AsyncProxy.get_CancellationToken();
       f1=function(_arg1)
       {
        var callback,x2;
        callback=Runtime.Tupled(function(tupledArg)
        {
         var ok,err,cc,waiting,callback1,reg,ok1,err1,arg00;
         ok=tupledArg[0];
         err=tupledArg[1];
         cc=tupledArg[2];
         waiting={
          contents:true
         };
         callback1=function()
         {
          var _;
          if(waiting.contents)
           {
            waiting.contents=false;
            _=cc(new Error("OperationCanceledException"));
           }
          else
           {
            _=null;
           }
          return _;
         };
         reg=Concurrency.Register(_arg1,function()
         {
          return callback1();
         });
         ok1=function(x1)
         {
          var _;
          if(waiting.contents)
           {
            waiting.contents=false;
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
          if(waiting.contents)
           {
            waiting.contents=false;
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
        x2=Concurrency.FromContinuations(callback);
        return x2;
       };
       return Concurrency.Bind(x,f1);
      };
      return Concurrency.Delay(f);
     },
     Call:function(m,data)
     {
      var arg00,arg10,arg20,data1;
      arg00=Remoting.EndPoint();
      arg10=Remoting.makeHeaders(m);
      arg20=Remoting.makePayload(data);
      data1=Remoting.AjaxProvider().Sync(arg00,arg10,arg20);
      return Json.Activate(JSON.parse(data1));
     },
     EndPoint:Runtime.Field(function()
     {
      return"?";
     }),
     Send:function(m,data)
     {
      var computation,computation1,t;
      computation=Remoting.Async(m,data);
      computation1=Concurrency.Ignore(computation);
      t={
       $:0
      };
      return Concurrency.Start(computation1,t);
     },
     XhrProvider:Runtime.Class({
      Async:function(url,headers,data,ok,err)
      {
       return Remoting.ajax(true,url,headers,data,ok,err);
      },
      Sync:function(url,headers,data)
      {
       var res;
       res={
        contents:undefined
       };
       Remoting.ajax(false,url,headers,data,function(x)
       {
        res.contents=x;
       },function(e)
       {
        return Operators.Raise(e);
       });
       return res.contents;
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
       var e1,next;
       e1=Enumerator.Get(s1);
       next=function(x)
       {
        var _,v,_1,e2,_2,v1;
        if(x.s.MoveNext())
         {
          v=x.s.get_Current();
          x.c=v;
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
              v1=e2.get_Current();
              x.c=v1;
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
       };
       return T.New(e1,null,next);
      });
     },
     average:function(s)
     {
      var patternInput,sum,count;
      patternInput=Seq.fold(Runtime.Tupled(function(tupledArg)
      {
       var n,s1;
       n=tupledArg[0];
       s1=tupledArg[1];
       return function(x)
       {
        return[n+1,s1+x];
       };
      }),[0,0],s);
      sum=patternInput[1];
      count=patternInput[0];
      return sum/count;
     },
     averageBy:function(f,s)
     {
      var patternInput,sum,count;
      patternInput=Seq.fold(Runtime.Tupled(function(tupledArg)
      {
       var n,s1;
       n=tupledArg[0];
       s1=tupledArg[1];
       return function(x)
       {
        return[n+1,s1+f(x)];
       };
      }),[0,0],s);
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
        var _,v,v1,_1,v2,v3;
        if(e.s+1<cache.length)
         {
          v=e.s+1;
          e.s=v;
          v1=cache[e.s];
          e.c=v1;
          _=true;
         }
        else
         {
          if(_enum.MoveNext())
           {
            v2=e.s+1;
            e.s=v2;
            v3=_enum.get_Current();
            e.c=v3;
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
        var matchValue,_,_1,v,_2,v1;
        matchValue=st.s;
        if(Unchecked.Equals(matchValue,null))
         {
          if(outerE.MoveNext())
           {
            v=Enumerator.Get(outerE.get_Current());
            st.s=v;
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
            v1=matchValue.get_Current();
            st.c=v1;
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
        var _,cur,h,check,has,_1,v;
        if(_enum.MoveNext())
         {
          cur=_enum.get_Current();
          h=function(c)
          {
           var x;
           x=f(c);
           return Unchecked.Hash(x);
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
            v=cur;
            e.c=v;
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
       var e,_,e1,next;
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
       next=function(x)
       {
        var _1,_2,v,e2;
        try
        {
         if(e.MoveNext())
          {
           v=e.get_Current();
           x.c=v;
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
       };
       return T.New(null,null,next);
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
       var next,state;
       next=function(en)
       {
        var matchValue,_,e,_1,v,v1,_2,v2;
        matchValue=en.s;
        if(matchValue.$==1)
         {
          e=matchValue.$0;
          if(e.MoveNext())
           {
            v=e.get_Current();
            en.c=v;
            _1=true;
           }
          else
           {
            v1={
             $:0
            };
            en.s=v1;
            _1=next(en);
           }
          _=_1;
         }
        else
         {
          if(f(null))
           {
            v2={
             $:1,
             $0:Enumerator.Get(s)
            };
            en.s=v2;
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
       state={
        $:0
       };
       return T.New(state,null,next);
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
        var loop,c,res,_,v;
        loop=_enum.MoveNext();
        c=_enum.get_Current();
        res=false;
        while(loop)
         {
          if(f(c))
           {
            v=c;
            e.c=v;
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
        var v,v1;
        v=f(e.s);
        e.c=v;
        v1=e.s+1;
        e.s=v1;
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
        var _,v;
        if(en.MoveNext())
         {
          v=f(en.get_Current());
          e.c=v;
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
        var _,v;
        if(e1.MoveNext()?e2.MoveNext():false)
         {
          v=(f(e1.get_Current()))(e2.get_Current());
          e.c=v;
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
       return[IntrinsicFunctionProxy.GetArray(x,0),IntrinsicFunctionProxy.GetArray(x,1)];
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
        var _,_1,v;
        if(e.s)
         {
          if(en.MoveNext())
           {
            v=(f(e.get_Current()))(en.get_Current());
            e.c=v;
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
       var e,empty,_,_this,next;
       e=Enumerator.Get(s);
       empty=true;
       while(e.MoveNext()?f(e.get_Current()):false)
        {
         empty=false;
        }
       if(empty)
        {
         _this=Seq.empty();
         _=Enumerator.Get(_this);
        }
       else
        {
         next=function(x)
         {
          var _1,v,r,v1;
          if(x.s)
           {
            x.s=false;
            v=e.get_Current();
            x.c=v;
            _1=true;
           }
          else
           {
            r=e.MoveNext();
            v1=e.get_Current();
            x.c=v1;
            _1=r;
           }
          return _1;
         };
         _=T.New(true,null,next);
        }
       return _;
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
       var e,next;
       e=Enumerator.Get(s);
       next=function(_enum)
       {
        var _,_1,v,v1;
        if(_enum.s>=n)
         {
          _=false;
         }
        else
         {
          if(e.MoveNext())
           {
            v=_enum.s+1;
            _enum.s=v;
            v1=e.get_Current();
            _enum.c=v1;
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
       };
       return T.New(0,null,next);
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
        i={
         contents:0
        };
        return Seq.enumWhile(function()
        {
         return e.MoveNext()?i.contents<n:false;
        },Seq.delay(function()
        {
         Operators.Increment(i);
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
       return Runtime.Tupled(function(tupledArg)
       {
        var y,z;
        y=tupledArg[0];
        z=tupledArg[1];
        return[x,y,z];
       });
      },s1,Seq.zip(s2,s3));
     }
    },
    Stack:{
     Clear:function(stack)
     {
      return stack.splice(0,IntrinsicFunctionProxy.GetLength(stack));
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
      return Arrays.blit(array,0,array,index,IntrinsicFunctionProxy.GetLength(stack));
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
       var index,_,replaced,nextStartIndex,ct;
       index=subj.indexOf(search);
       if(index!==-1)
        {
         replaced=Strings.ReplaceOnce(subj,search,replace);
         nextStartIndex=index+replace.length;
         ct=index+replace.length;
         _=Strings.Substring(replaced,0,ct)+replaceLoop(replaced.substring(nextStartIndex));
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
          _1=matchValue==="function"?Operators.FailWith("Cannot compare function values."):matchValue==="boolean"?a<b?-1:1:matchValue==="number"?a<b?-1:1:matchValue==="string"?a<b?-1:1:a===null?-1:b===null?1:"CompareTo"in a?a.CompareTo(b):(a instanceof Array?b instanceof Array:false)?Unchecked.compareArrays(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.compareDates(a,b):Unchecked.compareArrays(JS.GetFields(a),JS.GetFields(b));
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
        _=matchValue==="object"?a===null?false:b===null?false:"Equals"in a?a.Equals(b):(a instanceof Array?b instanceof Array:false)?Unchecked.arrayEquals(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.dateEquals(a,b):Unchecked.arrayEquals(JS.GetFields(a),JS.GetFields(b)):false;
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
      if(IntrinsicFunctionProxy.GetLength(a)===IntrinsicFunctionProxy.GetLength(b))
       {
        eq=true;
        i=0;
        while(eq?i<IntrinsicFunctionProxy.GetLength(a):false)
         {
          !Unchecked.Equals(IntrinsicFunctionProxy.GetArray(a,i),IntrinsicFunctionProxy.GetArray(b,i))?eq=false:null;
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
      if(IntrinsicFunctionProxy.GetLength(a)<IntrinsicFunctionProxy.GetLength(b))
       {
        _=-1;
       }
      else
       {
        if(IntrinsicFunctionProxy.GetLength(a)>IntrinsicFunctionProxy.GetLength(b))
         {
          _1=1;
         }
        else
         {
          cmp=0;
          i=0;
          while(cmp===0?i<IntrinsicFunctionProxy.GetLength(a):false)
           {
            cmp=Unchecked.Compare(IntrinsicFunctionProxy.GetArray(a,i),IntrinsicFunctionProxy.GetArray(b,i));
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
      for(i=0;i<=IntrinsicFunctionProxy.GetLength(o)-1;i++){
       h=Unchecked.hashMix(h,Unchecked.Hash(IntrinsicFunctionProxy.GetArray(o,i)));
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
        h={
         contents:0
        };
        JS.ForEach(o,function(key)
        {
         h.contents=op_PlusPlus(op_PlusPlus(h.contents,Unchecked.hashString(key)),Unchecked.Hash(o[key]));
         return false;
        });
        _=h.contents;
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
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  Operators=Runtime.Safe(WebSharper.Operators);
  Number=Runtime.Safe(Global.Number);
  IntrinsicFunctionProxy=Runtime.Safe(WebSharper.IntrinsicFunctionProxy);
  Array=Runtime.Safe(Global.Array);
  Seq=Runtime.Safe(WebSharper.Seq);
  Unchecked=Runtime.Safe(WebSharper.Unchecked);
  Enumerator=Runtime.Safe(WebSharper.Enumerator);
  Arrays2D=Runtime.Safe(WebSharper.Arrays2D);
  Concurrency=Runtime.Safe(WebSharper.Concurrency);
  AggregateException=Runtime.Safe(WebSharper.AggregateException);
  Option=Runtime.Safe(WebSharper.Option);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  setTimeout=Runtime.Safe(Global.setTimeout);
  CancellationTokenSource=Runtime.Safe(WebSharper.CancellationTokenSource);
  Char=Runtime.Safe(WebSharper.Char);
  Util=Runtime.Safe(WebSharper.Util);
  Lazy=Runtime.Safe(WebSharper.Lazy);
  Error=Runtime.Safe(Global.Error);
  Date=Runtime.Safe(Global.Date);
  console=Runtime.Safe(Global.console);
  Scheduler=Runtime.Safe(Concurrency.Scheduler);
  T=Runtime.Safe(Enumerator.T);
  Html=Runtime.Safe(WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Activator=Runtime.Safe(Client.Activator);
  document=Runtime.Safe(Global.document);
  jQuery=Runtime.Safe(Global.jQuery);
  Json=Runtime.Safe(WebSharper.Json);
  JSON=Runtime.Safe(Global.JSON);
  JavaScript=Runtime.Safe(WebSharper.JavaScript);
  JS=Runtime.Safe(JavaScript.JS);
  HtmlContentExtensions=Runtime.Safe(Client.HtmlContentExtensions);
  SingleNode=Runtime.Safe(HtmlContentExtensions.SingleNode);
  List=Runtime.Safe(WebSharper.List);
  T1=Runtime.Safe(List.T);
  Math=Runtime.Safe(Global.Math);
  Strings=Runtime.Safe(WebSharper.Strings);
  PrintfHelpers=Runtime.Safe(WebSharper.PrintfHelpers);
  Remoting=Runtime.Safe(WebSharper.Remoting);
  XhrProvider=Runtime.Safe(Remoting.XhrProvider);
  AsyncProxy=Runtime.Safe(WebSharper.AsyncProxy);
  Enumerable=Runtime.Safe(WebSharper.Enumerable);
  String=Runtime.Safe(Global.String);
  return RegExp=Runtime.Safe(Global.RegExp);
 });
 Runtime.OnLoad(function()
 {
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
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,Html,Client,Attribute,Pagelet,Default,Implementation,Element,Enumerator,Math,document,jQuery,Events,JQueryEventSupport,AttributeBuilder,DeprecatedTagBuilder,JQueryHtmlProvider,TagBuilder,Text,EventsPervasives;
 Runtime.Define(Global,{
  IntelliFactory:{
   WebSharper:{
    Html:{
     Client:{
      Attribute:Runtime.Class({
       get_Body:function()
       {
        var attr;
        attr=this.HtmlProvider.CreateAttribute(this.Name);
        attr.value=this.Value;
        return attr;
       }
      },{
       New:function(HtmlProvider)
       {
        var r;
        r=Runtime.New(this,Pagelet.New());
        r.HtmlProvider=HtmlProvider;
        return r;
       },
       New1:function(htmlProvider,name,value)
       {
        var a;
        a=Attribute.New(htmlProvider);
        a.Name=name;
        a.Value=value;
        return a;
       }
      }),
      AttributeBuilder:Runtime.Class({
       Class:function(x)
       {
        return this.NewAttr("class",x);
       },
       NewAttr:function(name,value)
       {
        var a;
        a=Attribute.New1(this.HtmlProvider,name,value);
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
       A:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("a",x);
       },
       Action:function(x)
       {
        var _this;
        _this=Default.Attr();
        return _this.NewAttr("action",x);
       },
       Align:function(x)
       {
        var _this;
        _this=Default.Attr();
        return _this.NewAttr("align",x);
       },
       Alt:function(x)
       {
        var _this;
        _this=Default.Attr();
        return _this.NewAttr("alt",x);
       },
       Attr:Runtime.Field(function()
       {
        return Implementation.Attr();
       }),
       B:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("b",x);
       },
       Body:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("body",x);
       },
       Br:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("br",x);
       },
       Button:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("button",x);
       },
       Code:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("code",x);
       },
       Deprecated:Runtime.Field(function()
       {
        return Implementation.DeprecatedHtml();
       }),
       Div:function(x)
       {
        return Default.Tags().Div(x);
       },
       Em:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("em",x);
       },
       Form:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("form",x);
       },
       H1:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("h1",x);
       },
       H2:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("h2",x);
       },
       H3:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("h3",x);
       },
       H4:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("h4",x);
       },
       HRef:function(x)
       {
        var _this;
        _this=Default.Attr();
        return _this.NewAttr("href",x);
       },
       Head:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("head",x);
       },
       Height:function(x)
       {
        var _this;
        _this=Default.Attr();
        return _this.NewAttr("height",x);
       },
       Hr:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("hr",x);
       },
       I:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("i",x);
       },
       IFrame:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("iframe",x);
       },
       Id:function(x)
       {
        var _this;
        _this=Default.Attr();
        return _this.NewAttr("id",x);
       },
       Img:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("img",x);
       },
       Input:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("input",x);
       },
       LI:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("li",x);
       },
       Name:function(x)
       {
        var _this;
        _this=Default.Attr();
        return _this.NewAttr("name",x);
       },
       NewAttr:function(x)
       {
        return function(arg10)
        {
         return Default.Attr().NewAttr(x,arg10);
        };
       },
       OL:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("ol",x);
       },
       OnLoad:function(init)
       {
        return Implementation.HtmlProvider().OnDocumentReady(init);
       },
       P:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("p",x);
       },
       Pre:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("pre",x);
       },
       RowSpan:function(x)
       {
        var _this;
        _this=Default.Attr();
        return _this.NewAttr("rowspan",x);
       },
       Script:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("script",x);
       },
       Select:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("select",x);
       },
       Selected:function(x)
       {
        var _this;
        _this=Default.Attr();
        return _this.NewAttr("selected",x);
       },
       Span:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("span",x);
       },
       Src:function(x)
       {
        var _this;
        _this=Default.Attr();
        return _this.NewAttr("src",x);
       },
       TBody:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("tbody",x);
       },
       TD:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("td",x);
       },
       TFoot:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("tfoot",x);
       },
       TH:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("th",x);
       },
       THead:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("thead",x);
       },
       TR:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("tr",x);
       },
       Table:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("table",x);
       },
       Tags:Runtime.Field(function()
       {
        return Implementation.Tags();
       }),
       Text:function(x)
       {
        return Default.Tags().text(x);
       },
       TextArea:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("textarea",x);
       },
       UL:function(x)
       {
        var _this;
        _this=Default.Tags();
        return _this.NewTag("ul",x);
       },
       VAlign:function(x)
       {
        var _this;
        _this=Default.Attr();
        return _this.NewAttr("valign",x);
       },
       Width:function(x)
       {
        var _this;
        _this=Default.Attr();
        return _this.NewAttr("width",x);
       }
      },
      DeprecatedAttributeBuilder:Runtime.Class({
       NewAttr:function(name,value)
       {
        var a;
        a=Attribute.New1(this.HtmlProvider,name,value);
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
        OnFocus:function(f,el)
        {
         return jQuery(el.get_Body()).bind("focus",function()
         {
          return f(el);
         });
        },
        OnKeyDown:function(f,el)
        {
         var h;
         h=function(ev)
         {
          return(f(el))({
           KeyCode:ev.keyCode
          });
         };
         return jQuery(el.get_Body()).bind("keydown",h);
        },
        OnKeyPress:function(f,el)
        {
         return jQuery(el.get_Body()).keypress(function(arg)
         {
          return(f(el))({
           CharacterCode:arg.which
          });
         });
        },
        OnKeyUp:function(f,el)
        {
         var h;
         h=function(ev)
         {
          return(f(el))({
           KeyCode:ev.keyCode
          });
         };
         return jQuery(el.get_Body()).bind("keyup",h);
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
         var h;
         h=function(ev)
         {
          return(f(el))({
           X:ev.pageX,
           Y:ev.pageY
          });
         };
         return jQuery(el.get_Body()).bind(name,h);
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
         x=jQuery(node).attr(name);
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
       Div:function(x)
       {
        return this.NewTag("div",x);
       },
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
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Html=Runtime.Safe(WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Attribute=Runtime.Safe(Client.Attribute);
  Pagelet=Runtime.Safe(Client.Pagelet);
  Default=Runtime.Safe(Client.Default);
  Implementation=Runtime.Safe(Client.Implementation);
  Element=Runtime.Safe(Client.Element);
  Enumerator=Runtime.Safe(WebSharper.Enumerator);
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
  return EventsPervasives=Runtime.Safe(Client.EventsPervasives);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(Attribute,Pagelet);
  Runtime.Inherit(Element,Pagelet);
  Runtime.Inherit(Text,Pagelet);
  Implementation.Tags();
  Implementation.HtmlProvider();
  Implementation.DeprecatedHtml();
  Implementation.Attr();
  EventsPervasives.Events();
  Default.Tags();
  Default.Deprecated();
  Default.Attr();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,Collections,BalancedTree,Operators,IntrinsicFunctionProxy,Seq,List,T,Arrays,JavaScript,JS,Enumerator,DictionaryUtil,Dictionary,Unchecked,FSharpMap,Pair,Option,MapUtil,FSharpSet,SetModule,SetUtil,Array,HashSet,HashSetUtil,HashSet1,LinkedList,EnumeratorProxy,ListProxy,ResizeArray,ResizeArrayProxy;
 Runtime.Define(Global,{
  IntelliFactory:{
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
         _=BalancedTree.Branch(IntrinsicFunctionProxy.GetArray(data,center),left,right);
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
       gen=Runtime.Tupled(function(tupledArg)
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
       });
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
       for(i=0;i<=IntrinsicFunctionProxy.GetLength(spine)-1;i++){
        matchValue=IntrinsicFunctionProxy.GetArray(spine,i);
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
       var patternInput,t,spine,_,_1,_2,source,t1,t2,data,t3;
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
             t1=t.Left;
             t2=t.Right;
             source=Seq.append(BalancedTree.Enumerate(false,t1),BalancedTree.Enumerate(false,t2));
             data=Seq.toArray(source);
             t3=BalancedTree.Build(data,0,data.length-1);
             _2=BalancedTree.Rebuild(spine,t3);
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
       s=JS.GetFieldValues(this.data);
       return Enumerator.Get(s);
      },
      Remove:function(k)
      {
       var h,_;
       h=this.hash.call(null,k);
       if(this.data.hasOwnProperty(h))
        {
         JS.Delete(this.data,h);
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
      New:function(dictionary,comparer)
      {
       return Runtime.New(this,Dictionary.New11(dictionary,function(x)
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
      New1:function(dictionary)
      {
       return Runtime.New(this,Dictionary.New11(dictionary,function(x)
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
      New11:function(init,equals,hash)
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
      },
      New12:function(comparer)
      {
       return Runtime.New(this,Dictionary.New11([],function(x)
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
      New2:function()
      {
       return Runtime.New(this,Dictionary.New11([],function(x)
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
      New3:function()
      {
       return Runtime.New(this,Dictionary.New2());
      },
      New4:function(capacity,comparer)
      {
       return Runtime.New(this,Dictionary.New12(comparer));
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
       return FSharpMap.New1(BalancedTree.Add(x1,x));
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
       var t,mapping,source,s;
       t=this.tree;
       mapping=function(kv)
       {
        return{
         K:kv.Key,
         V:kv.Value
        };
       };
       source=BalancedTree.Enumerate(false,t);
       s=Seq.map(mapping,source);
       return Enumerator.Get(s);
      },
      GetHashCode:function()
      {
       var x;
       x=Seq.toArray(this);
       return Unchecked.Hash(x);
      },
      Remove:function(k)
      {
       var x,k1;
       x=this.tree;
       k1=Runtime.New(Pair,{
        Key:k,
        Value:undefined
       });
       return FSharpMap.New1(BalancedTree.Remove(k1,x));
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
      New:function(s)
      {
       return Runtime.New(this,FSharpMap.New1(MapUtil.fromSeq(s)));
      },
      New1:function(tree)
      {
       var r;
       r=Runtime.New(this,{});
       r.tree=tree;
       return r;
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
       var t,_this;
       t=this.tree;
       _this=BalancedTree.Enumerate(false,t);
       return Enumerator.Get(_this);
      },
      GetHashCode:function()
      {
       var _this;
       _this=Seq.toArray(this);
       return-1741749453+Unchecked.Hash(_this);
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
       var a,t;
       a=Seq.append(this,x);
       t=BalancedTree.OfSeq(a);
       return FSharpSet.New1(t);
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
       var t;
       t=this.tree;
       return Seq.head(BalancedTree.Enumerate(true,t));
      },
      get_MinimumElement:function()
      {
       var t;
       t=this.tree;
       return Seq.head(BalancedTree.Enumerate(false,t));
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
     HashSet:{
      HashSet:Runtime.Class({
       Add:function(item)
       {
        return this.add(item);
       },
       Clear:function()
       {
        this.data=Array.prototype.constructor.apply(undefined,[].concat([]));
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
         IntrinsicFunctionProxy.SetArray(arr,i1,all[i1]);
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
        var _this;
        _this=HashSetUtil.concat(this.data);
        return Enumerator.Get(_this);
       },
       IntersectWith:function(xs)
       {
        var other,all,i,item,value,_,value1;
        other=HashSet1.New3(xs,this.equals,this.hash);
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
        return this.count<IntrinsicFunctionProxy.GetLength(other)?this.IsSubsetOf(other):false;
       },
       IsProperSupersetOf:function(xs)
       {
        var other;
        other=Arrays.ofSeq(xs);
        return this.count>IntrinsicFunctionProxy.GetLength(other)?this.IsSupersetOf(other):false;
       },
       IsSubsetOf:function(xs)
       {
        var other,predicate,array;
        other=HashSet1.New3(xs,this.equals,this.hash);
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
        other=HashSet1.New3(xs,this.equals,this.hash);
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
        var h,arr,_,_1,ps,value;
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
            ps=[item];
            value=arr.push.apply(arr,[].concat(ps));
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
       New:function(comparer)
       {
        return Runtime.New(this,HashSet1.New3(Seq.empty(),function(x)
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
       New1:function(init,comparer)
       {
        return Runtime.New(this,HashSet1.New3(init,function(x)
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
       New11:function(init)
       {
        return Runtime.New(this,HashSet1.New3(init,function(x)
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
        return Runtime.New(this,HashSet1.New3(Seq.empty(),function(x)
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
       New3:function(init,equals,hash)
       {
        var r,enumerator,x,value;
        r=Runtime.New(this,{});
        r.equals=equals;
        r.hash=hash;
        r.data=Array.prototype.constructor.apply(undefined,[].concat([]));
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
      }
     },
     LinkedList:{
      EnumeratorProxy:Runtime.Class({
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
      ListProxy:Runtime.Class({
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
        return EnumeratorProxy.New(this);
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
        return Runtime.New(this,ListProxy.New1(Seq.empty()));
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
       var t,predicate,source,source1,x,x1;
       t=m.get_Tree();
       predicate=function(kv)
       {
        return(f(kv.Key))(kv.Value);
       };
       source=BalancedTree.Enumerate(false,t);
       source1=Seq.filter(predicate,source);
       x=Seq.toArray(source1);
       x1=BalancedTree.Build(x,0,x.length-1);
       return FSharpMap.New1(x1);
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
       var t,folder,source;
       t=m.get_Tree();
       folder=function(s1)
       {
        return function(kv)
        {
         return((f(s1))(kv.Key))(kv.Value);
        };
       };
       source=BalancedTree.Enumerate(false,t);
       return Seq.fold(folder,s,source);
      },
      FoldBack:function(f,m,s)
      {
       var t,folder,source;
       t=m.get_Tree();
       folder=function(s1)
       {
        return function(kv)
        {
         return((f(kv.Key))(kv.Value))(s1);
        };
       };
       source=BalancedTree.Enumerate(true,t);
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
       var t,mapping,source,data,x;
       t=m.get_Tree();
       mapping=function(kv)
       {
        return Runtime.New(Pair,{
         Key:kv.Key,
         Value:(f(kv.Key))(kv.Value)
        });
       };
       source=BalancedTree.Enumerate(false,t);
       data=Seq.map(mapping,source);
       x=BalancedTree.OfSeq(data);
       return FSharpMap.New1(x);
      },
      OfArray:function(a)
      {
       var mapping,data,t;
       mapping=Runtime.Tupled(function(tupledArg)
       {
        var k,v;
        k=tupledArg[0];
        v=tupledArg[1];
        return Runtime.New(Pair,{
         Key:k,
         Value:v
        });
       });
       data=Seq.map(mapping,a);
       t=BalancedTree.OfSeq(data);
       return FSharpMap.New1(t);
      },
      Partition:function(f,m)
      {
       var predicate,array,t,patternInput,y,x,t1,t2;
       predicate=function(kv)
       {
        return(f(kv.Key))(kv.Value);
       };
       t=m.get_Tree();
       array=Seq.toArray(BalancedTree.Enumerate(false,t));
       patternInput=Arrays.partition(predicate,array);
       y=patternInput[1];
       x=patternInput[0];
       t1=BalancedTree.Build(x,0,x.length-1);
       t2=BalancedTree.Build(y,0,y.length-1);
       return[FSharpMap.New1(t1),FSharpMap.New1(t2)];
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
       var t,mapping,source;
       t=m.get_Tree();
       mapping=function(kv)
       {
        return[kv.Key,kv.Value];
       };
       source=BalancedTree.Enumerate(false,t);
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
        return Seq.collect(Runtime.Tupled(function(matchValue)
        {
         var v,k;
         v=matchValue[1];
         k=matchValue[0];
         return[Runtime.New(Pair,{
          Key:k,
          Value:v
         })];
        }),Seq.distinctBy(Runtime.Tupled(function(tuple)
        {
         return tuple[0];
        }),s));
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
       var x;
       x=this.Key;
       return Unchecked.Hash(x);
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
        var value,_this;
        _this=this.arr;
        value=ResizeArray.splice(this.arr,0,IntrinsicFunctionProxy.GetLength(_this),[]);
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
        var _this;
        _this=this.arr;
        return Enumerator.Get(_this);
       },
       GetRange:function(index,count)
       {
        return ResizeArrayProxy.New(Arrays.sub(this.arr,index,count));
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
        var _this;
        _this=this.arr;
        return IntrinsicFunctionProxy.GetLength(_this);
       },
       get_Item:function(x)
       {
        return IntrinsicFunctionProxy.GetArray(this.arr,x);
       },
       set_Item:function(x,v)
       {
        return IntrinsicFunctionProxy.SetArray(this.arr,x,v);
       }
      },{
       New:function(arr)
       {
        var r;
        r=Runtime.New(this,{});
        r.arr=arr;
        return r;
       },
       New1:function()
       {
        return Runtime.New(this,ResizeArrayProxy.New([]));
       },
       New11:function(el)
       {
        return Runtime.New(this,ResizeArrayProxy.New(Seq.toArray(el)));
       },
       New2:function()
       {
        return Runtime.New(this,ResizeArrayProxy.New([]));
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
       var data,t;
       data=Seq.toArray(Seq.filter(f,s));
       t=BalancedTree.Build(data,0,data.length-1);
       return FSharpSet.New1(t);
      },
      FoldBack:function(f,a,s)
      {
       var t;
       t=a.get_Tree();
       return Seq.fold(function(s1)
       {
        return function(x)
        {
         return(f(x))(s1);
        };
       },s,BalancedTree.Enumerate(true,t));
      },
      Partition:function(f,a)
      {
       var patternInput,y,x,t,t1;
       patternInput=Arrays.partition(f,Seq.toArray(a));
       y=patternInput[1];
       x=patternInput[0];
       t=BalancedTree.OfSeq(x);
       t1=BalancedTree.OfSeq(y);
       return[FSharpSet.New1(t),FSharpSet.New1(t1)];
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
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Collections=Runtime.Safe(WebSharper.Collections);
  BalancedTree=Runtime.Safe(Collections.BalancedTree);
  Operators=Runtime.Safe(WebSharper.Operators);
  IntrinsicFunctionProxy=Runtime.Safe(WebSharper.IntrinsicFunctionProxy);
  Seq=Runtime.Safe(WebSharper.Seq);
  List=Runtime.Safe(WebSharper.List);
  T=Runtime.Safe(List.T);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  JavaScript=Runtime.Safe(WebSharper.JavaScript);
  JS=Runtime.Safe(JavaScript.JS);
  Enumerator=Runtime.Safe(WebSharper.Enumerator);
  DictionaryUtil=Runtime.Safe(Collections.DictionaryUtil);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Unchecked=Runtime.Safe(WebSharper.Unchecked);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  Pair=Runtime.Safe(Collections.Pair);
  Option=Runtime.Safe(WebSharper.Option);
  MapUtil=Runtime.Safe(Collections.MapUtil);
  FSharpSet=Runtime.Safe(Collections.FSharpSet);
  SetModule=Runtime.Safe(Collections.SetModule);
  SetUtil=Runtime.Safe(Collections.SetUtil);
  Array=Runtime.Safe(Global.Array);
  HashSet=Runtime.Safe(Collections.HashSet);
  HashSetUtil=Runtime.Safe(HashSet.HashSetUtil);
  HashSet1=Runtime.Safe(HashSet.HashSet);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  EnumeratorProxy=Runtime.Safe(LinkedList.EnumeratorProxy);
  ListProxy=Runtime.Safe(LinkedList.ListProxy);
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
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,IntrinsicFunctionProxy,Concurrency,Array,Seq,UI,Next,Abbrev,Fresh,Collections,HashSet,HashSet1,HashSet2,Arrays,JQueue,Unchecked,Slot,An,AppendList,Anims,window,Trans1,Option,View1,Lazy,Array1,Attrs,DomUtility,Attr,AnimatedAttrNode,DynamicAttrNode,View,Docs,UINextPagelet,Doc,List,Var,Var1,Mailbox,Operators,NodeSet,DocElemNode,DomNodes,jQuery,document,Easing,Easings,FlowBuilder,Flow,Html,Elements,T,Input,DoubleInterpolation,Key,ListModels,ListModel1,Model1,Strings,encodeURIComponent,Route,decodeURIComponent,Routing,Trie,Router,Router1,Dictionary,Snap,Async,Enumerator,ResizeArray,ResizeArrayProxy,MapModule,FSharpMap,Html1,Client,Pagelet,Default,ViewBuilder,Attributes,SvgAttributes;
 Runtime.Define(Global,{
  IntelliFactory:{
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
              if(off>=0?off<IntrinsicFunctionProxy.GetLength(a):false)
               {
                return f(IntrinsicFunctionProxy.GetArray(a,off));
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
         return loop(0,IntrinsicFunctionProxy.GetLength(a));
        }
       },
       Async:{
        Schedule:function(f)
        {
         var f1,arg00,t;
         f1=function()
         {
          var x;
          x=f(null);
          return Concurrency.Return(x);
         };
         arg00=Concurrency.Delay(f1);
         t={
          $:0
         };
         return Concurrency.Start(arg00,t);
        },
        StartTo:function(comp,k)
        {
         var c2,c3,t;
         c2=function()
         {
         };
         c3=function()
         {
         };
         t={
          $:0
         };
         return Concurrency.StartWithContinuations(comp,k,c2,c3,t);
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
           return IntrinsicFunctionProxy.SetArray(arr,i,kv.K);
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
           return IntrinsicFunctionProxy.SetArray(arr,i,kv.V);
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
         set=HashSet1.New11(HashSet2.ToArray(included));
         set.ExceptWith(HashSet2.ToArray(excluded));
         return set;
        },
        Filter:function(ok,set)
        {
         return HashSet1.New11(Arrays.filter(ok,HashSet2.ToArray(set)));
        },
        Intersect:function(a,b)
        {
         var set;
         set=HashSet1.New11(HashSet2.ToArray(a));
         set.IntersectWith(HashSet2.ToArray(b));
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
         var mail,isActive,f,work;
         mail=[];
         isActive={
          contents:false
         };
         f=function()
         {
          var g,f1,b,a,f3,b1;
          g=function()
          {
           return JQueue.Count(mail)>0;
          };
          f1=function()
          {
           var x,f2;
           x=proc(JQueue.Dequeue(mail));
           f2=function()
           {
            return Concurrency.Return(null);
           };
           return Concurrency.Bind(x,f2);
          };
          b=Concurrency.Delay(f1);
          a=Concurrency.While(g,b);
          f3=function()
          {
           var x;
           x=void(isActive.contents=false);
           return Concurrency.Return(x);
          };
          b1=Concurrency.Delay(f3);
          return Concurrency.Combine(a,b1);
         };
         work=Concurrency.Delay(f);
         return function(msg)
         {
          var t;
          JQueue.Add(msg,mail);
          if(!isActive.contents)
           {
            isActive.contents=true;
            t={
             $:0
            };
            return Concurrency.Start(work,t);
           }
          else
           {
            return null;
           }
         };
        }
       },
       Slot:Runtime.Class({
        Equals:function(o)
        {
         return Unchecked.Equals(this.key.call(null,this.value),this.key.call(null,o.get_Value()));
        },
        GetHashCode:function()
        {
         var x;
         x=this.key.call(null,this.value);
         return Unchecked.Hash(x);
        },
        get_Value:function()
        {
         return this.value;
        }
       },{
        New:function(key,value)
        {
         var r;
         r=Runtime.New(this,{});
         r.key=key;
         r.value=value;
         return r;
        }
       }),
       Slot1:Runtime.Class({},{
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
         $0:AppendList.Append(_arg2.$0,_arg1.$0)
        });
       },
       Concat:function(xs)
       {
        return Runtime.New(An,{
         $:0,
         $0:AppendList.Concat(Seq.map(function(_arg00_)
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
         $0:AppendList.Single({
          $:1,
          $0:anim
         })
        });
       },
       Play:function(anim)
       {
        var f;
        f=function()
        {
         var x,f1;
         x=An.Run(function()
         {
         },Anims.Actions(anim));
         f1=function()
         {
          var x1;
          x1=Anims.Finalize(anim);
          return Concurrency.Return(x1);
         };
         return Concurrency.Bind(x,f1);
        };
        return Concurrency.Delay(f);
       },
       Run:function(k,anim)
       {
        var dur,arg00;
        dur=anim.Duration;
        arg00=Runtime.Tupled(function(tupledArg)
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
        return Concurrency.FromContinuations(arg00);
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
         $0:AppendList.Single({
          $:0,
          $0:f
         })
        }),main);
       },
       get_Empty:function()
       {
        return Runtime.New(An,{
         $:0,
         $0:AppendList.Empty()
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
        },Trans1.AnimateChange(a.tr,matchValue[0].$0,matchValue[1].$0))):An.get_Empty():An.get_Empty():An.get_Empty());
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
        },Trans1.AnimateChange(a.tr,matchValue[0].$0,matchValue[1].$0))):matchValue[0].$==0?matchValue[1].$==1?An.Pack(An.Map(function(v)
        {
         return a.pushVisible(parent,v);
        },Trans1.AnimateEnter(a.tr,matchValue[1].$0))):An.get_Empty():An.get_Empty():matchValue[0].$==0?matchValue[1].$==1?An.Pack(An.Map(function(v)
        {
         return a.pushVisible(parent,v);
        },Trans1.AnimateEnter(a.tr,matchValue[1].$0))):An.get_Empty():An.get_Empty():matchValue[0].$==0?matchValue[1].$==1?An.Pack(An.Map(function(v)
        {
         return a.pushVisible(parent,v);
        },Trans1.AnimateEnter(a.tr,matchValue[1].$0))):An.get_Empty():An.get_Empty());
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
        },Trans1.AnimateExit(a.tr,matchValue.$0))):An.get_Empty());
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
        r.updates=View1.Map(function(x)
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
        },AppendList.ToArray(_arg1.$0)));
       },
       ConcatActions:function(xs)
       {
        var xs1,matchValue,dur,xs2;
        xs1=Seq.toArray(xs);
        matchValue=IntrinsicFunctionProxy.GetLength(xs1);
        if(matchValue===0)
         {
          return Anims.Const(null);
         }
        else
         {
          if(matchValue===1)
           {
            return IntrinsicFunctionProxy.GetArray(xs1,0);
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
        },AppendList.ToArray(_arg1.$0));
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
      AppendList:{
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
        },AppendList.Empty(),function(_arg00_)
        {
         return function(_arg10_)
         {
          return AppendList.Append(_arg00_,_arg10_);
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
         $0:IntrinsicFunctionProxy.GetArray(xs,0)
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
         return Runtime.Tupled(function(tupledArg)
         {
          var v;
          v=tupledArg[1];
          return tupledArg[0]?DomUtility.SetAttr(el,name,v):DomUtility.RemoveAttr(el,name);
         });
        };
        return Attrs.Dynamic(View1.Map2(function(pred)
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
        if(Trans1.CanAnimateEnter(tr))
         {
          flags=flags|1;
         }
        if(Trans1.CanAnimateExit(tr))
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
          return View1.Map2(function()
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
      Doc:Runtime.Class({},{
       Append:function(a,b)
       {
        var x;
        x=View1.Map2(function()
        {
         return function()
         {
          return null;
         };
        },a.Updates,b.Updates);
        return Docs.Mk({
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
       CheckBox:function(attrs,item,chk)
       {
        var rvi,predicate,checkedView,arg20,checkedAttr,a,b,x1,attrs1,el;
        rvi=View1.FromVar(chk);
        predicate=function(x)
        {
         return Unchecked.Equals(x,item);
        };
        checkedView=View1.Map(function(list)
        {
         return Seq.exists(predicate,list);
        },rvi);
        arg20=View.Const("checked");
        checkedAttr=Attr.DynamicPred("checked",checkedView,arg20);
        a=List.ofArray([Attr.Create("type","checkbox"),Attr.Create("name",Global.String(Var.GetId(chk))),Attr.Create("value",Fresh.Id()),checkedAttr]);
        b=List.ofSeq(attrs);
        x1=List.append(a,b);
        attrs1=Attr.Concat(x1);
        el=DomUtility.CreateElement("input");
        el.addEventListener("click",function()
        {
         var chkd;
         chkd=el.checked;
         return Var.Update(chk,function(obs)
         {
          var _,b1;
          if(chkd)
           {
            b1=List.ofArray([item]);
            _=List.append(obs,b1);
           }
          else
           {
            _=List.filter(function(x2)
            {
             return!Unchecked.Equals(x2,item);
            },obs);
           }
          return Seq.toList(Seq.distinct(_));
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
        return Doc.Flatten(View1.Convert(render,view));
       },
       ConvertBy:function(key,render,view)
       {
        return Doc.Flatten(View1.ConvertBy(key,render,view));
       },
       ConvertSeq:function(render,view)
       {
        return Doc.Flatten(View.ConvertSeq(render,view));
       },
       ConvertSeqBy:function(key,render,view)
       {
        return Doc.Flatten(View1.ConvertSeqBy(key,render,view));
       },
       Elem:function(name,attr,children)
       {
        var node,arg20,updates;
        node=Docs.CreateElemNode(name,attr,children.DocNode);
        arg20=children.Updates;
        updates=View1.Map2(function()
        {
         return function()
         {
          return null;
         };
        },Attrs.Updates(node.Attr),arg20);
        return Docs.Mk({
         $:1,
         $0:node
        },updates);
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
        x=View1.Map(function()
        {
        },View.Bind(function(doc)
        {
         Docs.UpdateEmbedNode(node,doc.DocNode);
         return doc.Updates;
        },view));
        return Docs.Mk({
         $:2,
         $0:node
        },x);
       },
       Flatten:function(view)
       {
        return Doc.EmbedView(View1.Map(function(arg00)
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
        var patternInput,attrN,el,valAttr;
        patternInput=inputTy.$==1?[Attr.Append(Attr.Create("type","password"),Attr.Concat(attr)),"input"]:inputTy.$==2?[Attr.Concat(attr),"textarea"]:[Attr.Concat(attr),"input"];
        attrN=patternInput[0];
        el=DomUtility.CreateElement(patternInput[1]);
        valAttr=Attr.DynamicCustom(function(el1)
        {
         return function(v)
         {
          el1.value=v;
         };
        },View1.FromVar(_var));
        el.addEventListener("input",function()
        {
         return Var1.Set(_var,el.value);
        },false);
        return Doc.Elem(el,Attr.Append(attrN,valAttr),Doc.get_Empty());
       },
       Link:function(caption,attrs,action)
       {
        var arg10,attrs1;
        arg10=Attr.Concat(attrs);
        attrs1=Attr.Append(Attr.Create("href","#"),arg10);
        return Doc.Elem(Doc.Clickable("a",action),attrs1,Doc.TextNode(caption));
       },
       PasswordBox:function(attr,_var)
       {
        return Doc.InputInternal(attr,_var,{
         $:1
        });
       },
       Radio:function(attrs,value,_var)
       {
        var el,valAttr,op_EqualsEqualsGreater,a,b;
        el=DomUtility.CreateElement("input");
        el.addEventListener("click",function()
        {
         return Var1.Set(_var,value);
        },false);
        valAttr=Attr.DynamicPred("checked",View1.Map(function(x)
        {
         return Unchecked.Equals(x,value);
        },_var.get_View()),View.Const("checked"));
        op_EqualsEqualsGreater=function(k,v)
        {
         return Attr.Create(k,v);
        };
        a=List.ofArray([op_EqualsEqualsGreater("type","radio"),op_EqualsEqualsGreater("name",Global.String(Var.GetId(_var))),valAttr]);
        b=List.ofSeq(attrs);
        return Doc.Elem(el,Attr.Concat(List.append(a,b)),Doc.get_Empty());
       },
       Run:function(parent,doc)
       {
        var d,st,arg10;
        d=doc.DocNode;
        Docs.LinkElement(parent,d);
        st=Docs.CreateRunState(parent,d);
        arg10=doc.Updates;
        return View.Sink(Mailbox.StartProcessor(function()
        {
         return Docs.PerformAnimatedUpdate(st,parent,d);
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
          var p;
          p=function(y)
          {
           return Unchecked.Equals(item,y);
          };
          el.selectedIndex=Seq.findIndex(p,options);
          return;
         };
        };
        el1=DomUtility.CreateElement("select");
        x=View1.FromVar(current);
        selectedItemAttr=Attr.DynamicCustom(setSelectedItem,x);
        el1.addEventListener("change",function()
        {
         return Var1.Set(current,options.get_Item(el1.selectedIndex));
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
        x=View1.Map(function(t)
        {
         return Docs.UpdateTextNode(node,t);
        },txt);
        return Docs.Mk({
         $:4,
         $0:node
        },x);
       },
       get_Empty:function()
       {
        return Docs.Mk({
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
        var parent,ins,parent1;
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
        },DomNodes.Except(DomNodes.DocChildren(el),DomNodes.Children(el.El)));
        ins(el.Children,{
         $:0
        });
        return;
       },
       DomNodes:Runtime.Class({},{
        Children:function(elem)
        {
         var objectArg;
         objectArg=elem.childNodes;
         return Runtime.New(DomNodes,{
          $:0,
          $0:Arrays.init(elem.childNodes.length,function(arg00)
          {
           return objectArg[arg00];
          })
         });
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
           var predicate;
           predicate=function(k)
           {
            return!(n===k);
           };
           return Seq.forall(predicate,excluded);
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
       Mk:function(node,updates)
       {
        return Runtime.New(Doc,{
         DocNode:node,
         Updates:updates
        });
       },
       NodeSet:Runtime.Class({},{
        Except:function(_arg3,_arg2)
        {
         return Runtime.New(NodeSet,{
          $:0,
          $0:HashSet2.Except(_arg3.$0,_arg2.$0)
         });
        },
        Filter:function(f,_arg1)
        {
         return Runtime.New(NodeSet,{
          $:0,
          $0:HashSet2.Filter(f,_arg1.$0)
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
          $0:HashSet1.New11(JQueue.ToArray(q))
         });
        },
        Intersect:function(_arg5,_arg4)
        {
         return Runtime.New(NodeSet,{
          $:0,
          $0:HashSet2.Intersect(_arg5.$0,_arg4.$0)
         });
        },
        IsEmpty:function(_arg6)
        {
         return _arg6.$0.get_Count()===0;
        },
        ToArray:function(_arg7)
        {
         return HashSet2.ToArray(_arg7.$0);
        },
        get_Empty:function()
        {
         return Runtime.New(NodeSet,{
          $:0,
          $0:HashSet1.New2()
         });
        }
       }),
       PerformAnimatedUpdate:function(st,parent,doc)
       {
        var f;
        f=function()
        {
         var cur,change,enter,x,f1;
         cur=NodeSet.FindAll(doc);
         change=Docs.ComputeChangeAnim(st,cur);
         enter=Docs.ComputeEnterAnim(st,cur);
         x=An.Play(An.Append(change,Docs.ComputeExitAnim(st,cur)));
         f1=function()
         {
          var x1,f2;
          Docs.SyncElemNode(st.Top);
          x1=An.Play(enter);
          f2=function()
          {
           var x2;
           x2=void(st.PreviousNodes=cur);
           return Concurrency.Return(x2);
          };
          return Concurrency.Bind(x1,f2);
         };
         return Concurrency.Bind(x,f1);
        };
        return Concurrency.Delay(f);
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
        r.updates=View1.Map(function(x)
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
           return Var1.Set(_var,f(cont));
          };
         }
        };
       },
       Embed:function(fl)
       {
        var _var;
        _var=Var1.Create(Doc.get_Empty());
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
       Static:function(doc)
       {
        return{
         Render:function(_var)
         {
          return function(cont)
          {
           Var1.Set(_var,doc);
           return cont(null);
          };
         }
        };
       }
      }),
      Flow1:Runtime.Class({},{
       get_Do:function()
       {
        return FlowBuilder.New();
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
       A:function(atr,ch)
       {
        return Elements.A(atr,ch);
       },
       A0:function(ch)
       {
        return Elements.A(Runtime.New(T,{
         $:0
        }),ch);
       },
       Attributes:{
        Accept:Runtime.Field(function()
        {
         return"accept";
        }),
        AcceptCharset:Runtime.Field(function()
        {
         return"accept-charset";
        }),
        Accesskey:Runtime.Field(function()
        {
         return"accesskey";
        }),
        Action:Runtime.Field(function()
        {
         return"action";
        }),
        Align:Runtime.Field(function()
        {
         return"align";
        }),
        Alt:Runtime.Field(function()
        {
         return"alt";
        }),
        Async:Runtime.Field(function()
        {
         return"async";
        }),
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
        BgColor:Runtime.Field(function()
        {
         return"bgcolor";
        }),
        Border:Runtime.Field(function()
        {
         return"border";
        }),
        Buffered:Runtime.Field(function()
        {
         return"buffered";
        }),
        Challenge:Runtime.Field(function()
        {
         return"challenge";
        }),
        Charset:Runtime.Field(function()
        {
         return"charset";
        }),
        Checked:Runtime.Field(function()
        {
         return"checked";
        }),
        Cite:Runtime.Field(function()
        {
         return"cite";
        }),
        Class:Runtime.Field(function()
        {
         return"class";
        }),
        Code:Runtime.Field(function()
        {
         return"code";
        }),
        Codebase:Runtime.Field(function()
        {
         return"codebase";
        }),
        ColSpan:Runtime.Field(function()
        {
         return"colspan";
        }),
        Color:Runtime.Field(function()
        {
         return"color";
        }),
        Cols:Runtime.Field(function()
        {
         return"cols";
        }),
        Content:Runtime.Field(function()
        {
         return"content";
        }),
        ContentEditable:Runtime.Field(function()
        {
         return"contenteditable";
        }),
        ContextMenu:Runtime.Field(function()
        {
         return"contextmenu";
        }),
        Controls:Runtime.Field(function()
        {
         return"controls";
        }),
        Coords:Runtime.Field(function()
        {
         return"coords";
        }),
        Datetime:Runtime.Field(function()
        {
         return"datetime";
        }),
        Default:Runtime.Field(function()
        {
         return"default";
        }),
        Defer:Runtime.Field(function()
        {
         return"defer";
        }),
        Dir:Runtime.Field(function()
        {
         return"dir";
        }),
        DirName:Runtime.Field(function()
        {
         return"dirname";
        }),
        Disabled:Runtime.Field(function()
        {
         return"disabled";
        }),
        Download:Runtime.Field(function()
        {
         return"download";
        }),
        Draggable:Runtime.Field(function()
        {
         return"draggable";
        }),
        Dropzone:Runtime.Field(function()
        {
         return"dropzone";
        }),
        EncType:Runtime.Field(function()
        {
         return"enctype";
        }),
        For:Runtime.Field(function()
        {
         return"for";
        }),
        Form:Runtime.Field(function()
        {
         return"form";
        }),
        FormAction:Runtime.Field(function()
        {
         return"formaction";
        }),
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
        Href:Runtime.Field(function()
        {
         return"href";
        }),
        HrefLang:Runtime.Field(function()
        {
         return"hreflang";
        }),
        HttpEquiv:Runtime.Field(function()
        {
         return"http-equiv";
        }),
        ID:Runtime.Field(function()
        {
         return"id";
        }),
        Icon:Runtime.Field(function()
        {
         return"icon";
        }),
        IsMap:Runtime.Field(function()
        {
         return"ismap";
        }),
        ItemProp:Runtime.Field(function()
        {
         return"itemprop";
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
        Lang:Runtime.Field(function()
        {
         return"lang";
        }),
        Language:Runtime.Field(function()
        {
         return"language";
        }),
        List:Runtime.Field(function()
        {
         return"list";
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
        Max:Runtime.Field(function()
        {
         return"max";
        }),
        MaxLength:Runtime.Field(function()
        {
         return"maxlength";
        }),
        Media:Runtime.Field(function()
        {
         return"media";
        }),
        Method:Runtime.Field(function()
        {
         return"method";
        }),
        Min:Runtime.Field(function()
        {
         return"min";
        }),
        Multiple:Runtime.Field(function()
        {
         return"multiple";
        }),
        Name:Runtime.Field(function()
        {
         return"name";
        }),
        NoValidate:Runtime.Field(function()
        {
         return"novalidate";
        }),
        Open:Runtime.Field(function()
        {
         return"open";
        }),
        Optimum:Runtime.Field(function()
        {
         return"optimum";
        }),
        Pattern:Runtime.Field(function()
        {
         return"pattern";
        }),
        Ping:Runtime.Field(function()
        {
         return"ping";
        }),
        Placeholder:Runtime.Field(function()
        {
         return"placeholder";
        }),
        Poster:Runtime.Field(function()
        {
         return"poster";
        }),
        Preload:Runtime.Field(function()
        {
         return"preload";
        }),
        PubDate:Runtime.Field(function()
        {
         return"pubdate";
        }),
        RadioGroup:Runtime.Field(function()
        {
         return"radiogroup";
        }),
        Readonly:Runtime.Field(function()
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
        Sandbox:Runtime.Field(function()
        {
         return"sandbox";
        }),
        Scope:Runtime.Field(function()
        {
         return"scope";
        }),
        Scoped:Runtime.Field(function()
        {
         return"scoped";
        }),
        Seamless:Runtime.Field(function()
        {
         return"seamless";
        }),
        Selected:Runtime.Field(function()
        {
         return"selected";
        }),
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
        Span:Runtime.Field(function()
        {
         return"span";
        }),
        Spellcheck:Runtime.Field(function()
        {
         return"spellcheck";
        }),
        Src:Runtime.Field(function()
        {
         return"src";
        }),
        SrcLang:Runtime.Field(function()
        {
         return"srclang";
        }),
        Srcdoc:Runtime.Field(function()
        {
         return"srcdoc";
        }),
        Start:Runtime.Field(function()
        {
         return"start";
        }),
        Step:Runtime.Field(function()
        {
         return"step";
        }),
        Style:Runtime.Field(function()
        {
         return"style";
        }),
        Summary:Runtime.Field(function()
        {
         return"summary";
        }),
        TabIndex:Runtime.Field(function()
        {
         return"tabindex";
        }),
        Target:Runtime.Field(function()
        {
         return"target";
        }),
        Title:Runtime.Field(function()
        {
         return"title";
        }),
        Type:Runtime.Field(function()
        {
         return"type";
        }),
        Usemap:Runtime.Field(function()
        {
         return"usemap";
        }),
        Value:Runtime.Field(function()
        {
         return"value";
        }),
        Width:Runtime.Field(function()
        {
         return"width";
        }),
        Wrap:Runtime.Field(function()
        {
         return"wrap";
        })
       },
       Del:function(atr,ch)
       {
        return Elements.Del(atr,ch);
       },
       Del0:function(ch)
       {
        return Elements.Del(Runtime.New(T,{
         $:0
        }),ch);
       },
       Div:function(atr,ch)
       {
        return Elements.Div(atr,ch);
       },
       Div0:function(ch)
       {
        return Elements.Div(Runtime.New(T,{
         $:0
        }),ch);
       },
       Elements:{
        A:function(ats,ch)
        {
         return Doc.Element("a",ats,ch);
        },
        Abbr:function(ats,ch)
        {
         return Doc.Element("abbr",ats,ch);
        },
        Address:function(ats,ch)
        {
         return Doc.Element("address",ats,ch);
        },
        Area:function(ats,ch)
        {
         return Doc.Element("area",ats,ch);
        },
        Article:function(ats,ch)
        {
         return Doc.Element("article",ats,ch);
        },
        Aside:function(ats,ch)
        {
         return Doc.Element("aside",ats,ch);
        },
        Audio:function(ats,ch)
        {
         return Doc.Element("audio",ats,ch);
        },
        B:function(ats,ch)
        {
         return Doc.Element("b",ats,ch);
        },
        BDI:function(ats,ch)
        {
         return Doc.Element("bdi",ats,ch);
        },
        BDO:function(ats,ch)
        {
         return Doc.Element("bdo",ats,ch);
        },
        Base:function(ats,ch)
        {
         return Doc.Element("base",ats,ch);
        },
        BlockQuote:function(ats,ch)
        {
         return Doc.Element("blockquote",ats,ch);
        },
        Body:function(ats,ch)
        {
         return Doc.Element("body",ats,ch);
        },
        Br:function(ats,ch)
        {
         return Doc.Element("br",ats,ch);
        },
        Button:function(ats,ch)
        {
         return Doc.Element("button",ats,ch);
        },
        Canvas:function(ats,ch)
        {
         return Doc.Element("canvas",ats,ch);
        },
        Caption:function(ats,ch)
        {
         return Doc.Element("caption",ats,ch);
        },
        Cite:function(ats,ch)
        {
         return Doc.Element("cite",ats,ch);
        },
        Code:function(ats,ch)
        {
         return Doc.Element("code",ats,ch);
        },
        Col:function(ats,ch)
        {
         return Doc.Element("col",ats,ch);
        },
        ColGroup:function(ats,ch)
        {
         return Doc.Element("colgroup",ats,ch);
        },
        DD:function(ats,ch)
        {
         return Doc.Element("dd",ats,ch);
        },
        DFN:function(ats,ch)
        {
         return Doc.Element("dfn",ats,ch);
        },
        DL:function(ats,ch)
        {
         return Doc.Element("dl",ats,ch);
        },
        DT:function(ats,ch)
        {
         return Doc.Element("dt",ats,ch);
        },
        Data:function(ats,ch)
        {
         return Doc.Element("data",ats,ch);
        },
        DataList:function(ats,ch)
        {
         return Doc.Element("datalist",ats,ch);
        },
        Del:function(ats,ch)
        {
         return Doc.Element("del",ats,ch);
        },
        Details:function(ats,ch)
        {
         return Doc.Element("details",ats,ch);
        },
        Div:function(ats,ch)
        {
         return Doc.Element("div",ats,ch);
        },
        Em:function(ats,ch)
        {
         return Doc.Element("em",ats,ch);
        },
        Embed:function(ats,ch)
        {
         return Doc.Element("embed",ats,ch);
        },
        FieldSet:function(ats,ch)
        {
         return Doc.Element("fieldset",ats,ch);
        },
        FigCaption:function(ats,ch)
        {
         return Doc.Element("figcaption",ats,ch);
        },
        Figure:function(ats,ch)
        {
         return Doc.Element("figure",ats,ch);
        },
        Footer:function(ats,ch)
        {
         return Doc.Element("footer",ats,ch);
        },
        Form:function(ats,ch)
        {
         return Doc.Element("form",ats,ch);
        },
        H1:function(ats,ch)
        {
         return Doc.Element("h1",ats,ch);
        },
        H2:function(ats,ch)
        {
         return Doc.Element("h2",ats,ch);
        },
        H3:function(ats,ch)
        {
         return Doc.Element("h3",ats,ch);
        },
        H4:function(ats,ch)
        {
         return Doc.Element("h4",ats,ch);
        },
        H5:function(ats,ch)
        {
         return Doc.Element("h5",ats,ch);
        },
        H6:function(ats,ch)
        {
         return Doc.Element("h6",ats,ch);
        },
        HR:function(ats,ch)
        {
         return Doc.Element("hr",ats,ch);
        },
        Head:function(ats,ch)
        {
         return Doc.Element("head",ats,ch);
        },
        Header:function(ats,ch)
        {
         return Doc.Element("header",ats,ch);
        },
        Html:function(ats,ch)
        {
         return Doc.Element("html",ats,ch);
        },
        I:function(ats,ch)
        {
         return Doc.Element("i",ats,ch);
        },
        IFrame:function(ats,ch)
        {
         return Doc.Element("iframe",ats,ch);
        },
        Img:function(ats,ch)
        {
         return Doc.Element("img",ats,ch);
        },
        Input:function(ats,ch)
        {
         return Doc.Element("input",ats,ch);
        },
        Ins:function(ats,ch)
        {
         return Doc.Element("ins",ats,ch);
        },
        Kbd:function(ats,ch)
        {
         return Doc.Element("kbd",ats,ch);
        },
        Keygen:function(ats,ch)
        {
         return Doc.Element("keygen",ats,ch);
        },
        LI:function(ats,ch)
        {
         return Doc.Element("li",ats,ch);
        },
        Label:function(ats,ch)
        {
         return Doc.Element("label",ats,ch);
        },
        Legend:function(ats,ch)
        {
         return Doc.Element("legend",ats,ch);
        },
        Link:function(ats,ch)
        {
         return Doc.Element("link",ats,ch);
        },
        Main:function(ats,ch)
        {
         return Doc.Element("main",ats,ch);
        },
        Map:function(ats,ch)
        {
         return Doc.Element("map",ats,ch);
        },
        Mark:function(ats,ch)
        {
         return Doc.Element("mark",ats,ch);
        },
        Menu:function(ats,ch)
        {
         return Doc.Element("menu",ats,ch);
        },
        MenuItem:function(ats,ch)
        {
         return Doc.Element("menuitem",ats,ch);
        },
        Meta:function(ats,ch)
        {
         return Doc.Element("meta",ats,ch);
        },
        Meter:function(ats,ch)
        {
         return Doc.Element("meter",ats,ch);
        },
        Nav:function(ats,ch)
        {
         return Doc.Element("nav",ats,ch);
        },
        NoScript:function(ats,ch)
        {
         return Doc.Element("noscript",ats,ch);
        },
        OL:function(ats,ch)
        {
         return Doc.Element("ol",ats,ch);
        },
        Object:function(ats,ch)
        {
         return Doc.Element("object",ats,ch);
        },
        OptGroup:function(ats,ch)
        {
         return Doc.Element("optgroup",ats,ch);
        },
        Option:function(ats,ch)
        {
         return Doc.Element("option",ats,ch);
        },
        Output:function(ats,ch)
        {
         return Doc.Element("output",ats,ch);
        },
        P:function(ats,ch)
        {
         return Doc.Element("p",ats,ch);
        },
        Param:function(ats,ch)
        {
         return Doc.Element("param",ats,ch);
        },
        Picture:function(ats,ch)
        {
         return Doc.Element("picture",ats,ch);
        },
        Pre:function(ats,ch)
        {
         return Doc.Element("pre",ats,ch);
        },
        Progress:function(ats,ch)
        {
         return Doc.Element("progress",ats,ch);
        },
        Q:function(ats,ch)
        {
         return Doc.Element("q",ats,ch);
        },
        RP:function(ats,ch)
        {
         return Doc.Element("rp",ats,ch);
        },
        RT:function(ats,ch)
        {
         return Doc.Element("rt",ats,ch);
        },
        Ruby:function(ats,ch)
        {
         return Doc.Element("ruby",ats,ch);
        },
        S:function(ats,ch)
        {
         return Doc.Element("s",ats,ch);
        },
        Samp:function(ats,ch)
        {
         return Doc.Element("samp",ats,ch);
        },
        Script:function(ats,ch)
        {
         return Doc.Element("script",ats,ch);
        },
        Section:function(ats,ch)
        {
         return Doc.Element("section",ats,ch);
        },
        Select:function(ats,ch)
        {
         return Doc.Element("select",ats,ch);
        },
        Small:function(ats,ch)
        {
         return Doc.Element("small",ats,ch);
        },
        Source:function(ats,ch)
        {
         return Doc.Element("source",ats,ch);
        },
        Span:function(ats,ch)
        {
         return Doc.Element("span",ats,ch);
        },
        Strong:function(ats,ch)
        {
         return Doc.Element("strong",ats,ch);
        },
        Style:function(ats,ch)
        {
         return Doc.Element("style",ats,ch);
        },
        Sub:function(ats,ch)
        {
         return Doc.Element("sub",ats,ch);
        },
        Summary:function(ats,ch)
        {
         return Doc.Element("summary",ats,ch);
        },
        Sup:function(ats,ch)
        {
         return Doc.Element("sup",ats,ch);
        },
        TBody:function(ats,ch)
        {
         return Doc.Element("tbody",ats,ch);
        },
        TD:function(ats,ch)
        {
         return Doc.Element("td",ats,ch);
        },
        TFoot:function(ats,ch)
        {
         return Doc.Element("tfoot",ats,ch);
        },
        TH:function(ats,ch)
        {
         return Doc.Element("th",ats,ch);
        },
        THead:function(ats,ch)
        {
         return Doc.Element("thead",ats,ch);
        },
        TR:function(ats,ch)
        {
         return Doc.Element("tr",ats,ch);
        },
        Table:function(ats,ch)
        {
         return Doc.Element("table",ats,ch);
        },
        TextArea:function(ats,ch)
        {
         return Doc.Element("textarea",ats,ch);
        },
        Time:function(ats,ch)
        {
         return Doc.Element("time",ats,ch);
        },
        Title:function(ats,ch)
        {
         return Doc.Element("title",ats,ch);
        },
        Track:function(ats,ch)
        {
         return Doc.Element("track",ats,ch);
        },
        U:function(ats,ch)
        {
         return Doc.Element("u",ats,ch);
        },
        UL:function(ats,ch)
        {
         return Doc.Element("ul",ats,ch);
        },
        Var:function(ats,ch)
        {
         return Doc.Element("var",ats,ch);
        },
        Video:function(ats,ch)
        {
         return Doc.Element("video",ats,ch);
        },
        WBR:function(ats,ch)
        {
         return Doc.Element("wbr",ats,ch);
        }
       },
       Form:function(atr,ch)
       {
        return Elements.Form(atr,ch);
       },
       Form0:function(ch)
       {
        return Elements.Form(Runtime.New(T,{
         $:0
        }),ch);
       },
       H1:function(atr,ch)
       {
        return Elements.H1(atr,ch);
       },
       H10:function(ch)
       {
        return Elements.H1(Runtime.New(T,{
         $:0
        }),ch);
       },
       H2:function(atr,ch)
       {
        return Elements.H2(atr,ch);
       },
       H20:function(ch)
       {
        return Elements.H2(Runtime.New(T,{
         $:0
        }),ch);
       },
       H3:function(atr,ch)
       {
        return Elements.H3(atr,ch);
       },
       H30:function(ch)
       {
        return Elements.H3(Runtime.New(T,{
         $:0
        }),ch);
       },
       H4:function(atr,ch)
       {
        return Elements.H4(atr,ch);
       },
       H40:function(ch)
       {
        return Elements.H4(Runtime.New(T,{
         $:0
        }),ch);
       },
       H5:function(atr,ch)
       {
        return Elements.H5(atr,ch);
       },
       H50:function(ch)
       {
        return Elements.H5(Runtime.New(T,{
         $:0
        }),ch);
       },
       H6:function(atr,ch)
       {
        return Elements.H6(atr,ch);
       },
       H60:function(ch)
       {
        return Elements.H6(Runtime.New(T,{
         $:0
        }),ch);
       },
       LI:function(atr,ch)
       {
        return Elements.LI(atr,ch);
       },
       LI0:function(ch)
       {
        return Elements.LI(Runtime.New(T,{
         $:0
        }),ch);
       },
       Label:function(atr,ch)
       {
        return Elements.Label(atr,ch);
       },
       Label0:function(ch)
       {
        return Elements.Label(Runtime.New(T,{
         $:0
        }),ch);
       },
       Nav:function(atr,ch)
       {
        return Elements.Nav(atr,ch);
       },
       Nav0:function(ch)
       {
        return Elements.Nav(Runtime.New(T,{
         $:0
        }),ch);
       },
       OL:function(atr,ch)
       {
        return Elements.OL(atr,ch);
       },
       OL0:function(ch)
       {
        return Elements.OL(Runtime.New(T,{
         $:0
        }),ch);
       },
       P:function(atr,ch)
       {
        return Elements.P(atr,ch);
       },
       P0:function(ch)
       {
        return Elements.P(Runtime.New(T,{
         $:0
        }),ch);
       },
       Span:function(atr,ch)
       {
        return Elements.Span(atr,ch);
       },
       Span0:function(ch)
       {
        return Elements.Span(Runtime.New(T,{
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
         return Doc.SvgElement("color-profile",ats,ch);
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
         return Doc.SvgElement("font-face",ats,ch);
        },
        FontFaceFormat:function(ats,ch)
        {
         return Doc.SvgElement("font-face-format",ats,ch);
        },
        FontFaceName:function(ats,ch)
        {
         return Doc.SvgElement("font-face-name",ats,ch);
        },
        FontFaceSrc:function(ats,ch)
        {
         return Doc.SvgElement("font-face-src",ats,ch);
        },
        FontFaceUri:function(ats,ch)
        {
         return Doc.SvgElement("font-face-uri",ats,ch);
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
         return Doc.SvgElement("missing-glyph",ats,ch);
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
       TBody:function(atr,ch)
       {
        return Elements.TBody(atr,ch);
       },
       TBody0:function(ch)
       {
        return Elements.TBody(Runtime.New(T,{
         $:0
        }),ch);
       },
       TD:function(atr,ch)
       {
        return Elements.TD(atr,ch);
       },
       TD0:function(ch)
       {
        return Elements.TD(Runtime.New(T,{
         $:0
        }),ch);
       },
       THead:function(atr,ch)
       {
        return Elements.THead(atr,ch);
       },
       THead0:function(ch)
       {
        return Elements.THead(Runtime.New(T,{
         $:0
        }),ch);
       },
       TR:function(atr,ch)
       {
        return Elements.TR(atr,ch);
       },
       TR0:function(ch)
       {
        return Elements.TR(Runtime.New(T,{
         $:0
        }),ch);
       },
       Table:function(atr,ch)
       {
        return Elements.Table(atr,ch);
       },
       Table0:function(ch)
       {
        return Elements.Table(Runtime.New(T,{
         $:0
        }),ch);
       },
       UL:function(atr,ch)
       {
        return Elements.UL(atr,ch);
       },
       UL0:function(ch)
       {
        return Elements.UL(Runtime.New(T,{
         $:0
        }),ch);
       }
      },
      Input:{
       ActivateButtonListener:Runtime.Field(function()
       {
        var _buttonListener_39_1,_;
        _buttonListener_39_1=function(evt,down)
        {
         var matchValue;
         matchValue=evt.button;
         return matchValue===0?Var1.Set(Input.MouseBtnSt().Left,down):matchValue===1?Var1.Set(Input.MouseBtnSt().Middle,down):matchValue===2?Var1.Set(Input.MouseBtnSt().Right,down):null;
        };
        if(!Input.MouseBtnSt().Active)
         {
          Input.MouseBtnSt().Active=true;
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
           var keyCode,xs,p,b;
           keyCode=evt.which;
           Var1.Set(Input.KeyListenerState().LastPressed,keyCode);
           xs=Var1.Get(Input.KeyListenerState().KeysPressed);
           p=function(x)
           {
            return x===keyCode;
           };
           if(!Seq.exists(p,xs))
            {
             b=List.ofArray([keyCode]);
             return Input.KeyListenerState().KeysPressed.set_Value(List.append(xs,b));
            }
           else
            {
             return null;
            }
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
           return Var.Update(Input.KeyListenerState().KeysPressed,arg10);
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
         KeysPressed:Var1.Create(Runtime.New(T,{
          $:0
         })),
         KeyListenerActive:false,
         LastPressed:Var1.Create(-1)
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
         return View1.Map(function(list)
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
         return Input.MouseBtnSt().Left.get_View();
        },
        get_MiddlePressed:function()
        {
         Input.ActivateButtonListener();
         return Input.MouseBtnSt().Middle.get_View();
        },
        get_MousePressed:function()
        {
         Input.ActivateButtonListener();
         return View.Apply(View.Apply(View.Apply(View.Const(function(l)
         {
          return function(m)
          {
           return function(r)
           {
            return(l?true:m)?true:r;
           };
          };
         }),Input.MouseBtnSt().Left.get_View()),Input.MouseBtnSt().Middle.get_View()),Input.MouseBtnSt().Right.get_View());
        },
        get_Position:function()
        {
         var onMouseMove;
         onMouseMove=function(evt)
         {
          var arg00;
          arg00=Input.MousePosSt().PosV;
          return(Runtime.Tupled(function(arg10)
          {
           return Var1.Set(arg00,arg10);
          }))([evt.clientX,evt.clientY]);
         };
         if(!Input.MousePosSt().Active)
          {
           document.addEventListener("mousemove",onMouseMove,false);
           Input.MousePosSt().Active=true;
          }
         return View1.FromVar(Input.MousePosSt().PosV);
        },
        get_RightPressed:function()
        {
         Input.ActivateButtonListener();
         return Input.MouseBtnSt().Right.get_View();
        }
       }),
       MouseBtnSt:Runtime.Field(function()
       {
        return{
         Active:false,
         Left:Var1.Create(false),
         Middle:Var1.Create(false),
         Right:Var1.Create(false)
        };
       }),
       MousePosSt:Runtime.Field(function()
       {
        return{
         Active:false,
         PosV:Var1.Create([0,0])
        };
       })
      },
      Interpolation:Runtime.Class({},{
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
      ListModel:Runtime.Class({},{
       View:function(m)
       {
        return m.View;
       }
      }),
      ListModel1:Runtime.Class({
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
          IntrinsicFunctionProxy.SetArray(v,Arrays.FindIndex(function(it)
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
        var f,m=this,arr;
        f=function(it)
        {
         return Unchecked.Equals(m.Key.call(null,it),key);
        };
        arr=m.Var.get_Value();
        return Seq.exists(f,arr);
       },
       FindByKey:function(key)
       {
        var m=this;
        return Arrays.Find(function(it)
        {
         return Unchecked.Equals(m.Key.call(null,it),key);
        },m.Var.get_Value());
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
       UpdateBy:function(fn,key)
       {
        var v,index,m=this,matchValue;
        v=this.Var.get_Value();
        if(this.ContainsKey(key))
         {
          index=Arrays.FindIndex(function(it)
          {
           return Unchecked.Equals(m.Key.call(null,it),key);
          },v);
          matchValue=fn(IntrinsicFunctionProxy.GetArray(v,index));
          if(matchValue.$==1)
           {
            IntrinsicFunctionProxy.SetArray(v,index,matchValue.$0);
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
       }
      },{
       Create:function(key,init)
       {
        var _var;
        _var=Var1.Create(Seq.toArray(Seq.distinctBy(key,init)));
        return Runtime.New(ListModel1,{
         Key:key,
         Var:_var,
         View:View1.Map(function(x)
         {
          return x.slice();
         },_var.get_View())
        });
       },
       FromSeq:function(xs)
       {
        return ListModel1.Create(function(x)
        {
         return x;
        },xs);
       }
      }),
      ListModels:{
       Contains:function(keyFn,item,xs)
       {
        var t,f;
        t=keyFn(item);
        f=function(it)
        {
         return Unchecked.Equals(keyFn(it),t);
        };
        return Seq.exists(f,xs);
       }
      },
      Model1:Runtime.Class({
       get_View:function()
       {
        return Model1.View(this);
       }
      },{
       Create:function(proj,init)
       {
        var _var;
        _var=Var1.Create(init);
        return Runtime.New(Model1,{
         $:0,
         $0:_var,
         $1:View1.Map(proj,_var.get_View())
        });
       },
       Update:function(update,_arg1)
       {
        return Var.Update(_arg1.$0,function(x)
        {
         update(x);
         return x;
        });
       },
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
         $0:AppendList.Append(_arg2.$0,_arg1.$0)
        };
       },
       FromList:function(xs)
       {
        return{
         $:0,
         $0:AppendList.FromArray(Arrays.ofSeq(xs))
        };
       },
       MakeHash:function(_arg1)
       {
        return Strings.concat("/",Arrays.map(function(x)
        {
         return encodeURIComponent(x);
        },AppendList.ToArray(_arg1.$0)));
       },
       NoHash:function(s)
       {
        return Strings.StartsWith(s,"#")?s.substring(1):s;
       },
       ParseHash:function(hash)
       {
        var _this,sep;
        _this=Route.NoHash(hash);
        sep=[47];
        return{
         $:0,
         $0:AppendList.FromArray(Arrays.map(function(x)
         {
          return decodeURIComponent(x);
         },Strings.SplitChars(_this,sep,1)))
        };
       },
       SameHash:function(a,b)
       {
        return Route.NoHash(a)===Route.NoHash(b);
       },
       ToList:function(_arg1)
       {
        var array;
        array=AppendList.ToArray(_arg1.$0);
        return List.ofArray(array);
       }
      },
      RouteMap:Runtime.Class({},{
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
       Prefix:function(prefix,_arg1)
       {
        return{
         $:0,
         $0:_arg1.$0,
         $1:Trie.Prefix(prefix,_arg1.$1)
        };
       },
       Route:function(r,init,render)
       {
        return Routing.DefineRoute(r,init,render);
       }
      }),
      Router1:Runtime.Class({},{
       Dir:function(prefix,sites)
       {
        return Router.Prefix(prefix,Router1.Merge(sites));
       },
       Install:function(key,site)
       {
        return Routing.Install(key,site);
       },
       Merge:function(sites)
       {
        return Routing.MergeRouters(sites);
       }
      }),
      Routing:{
       ComputeBodies:function(trie)
       {
        var d;
        d=Dictionary.New2();
        Arrays.iter(function(body)
        {
         return d.set_Item(body.RouteId,body);
        },Trie.ToArray(trie));
        return d;
       },
       DefineRoute:function(r,init,render)
       {
        var state,id,site,t;
        state=Var1.Create(init);
        id=Fresh.Int();
        site=(render({
         $:0,
         $0:id
        }))(state);
        t=Trie.Leaf({
         $:0,
         $0:id,
         $1:function(ctx)
         {
          View.Sink(function(va)
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
        siteTrie=Trie.Map(function(prefix)
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
         return Trie.Lookup(siteTrie,Route.ToList(route));
        };
        matchValue=parseRoute(currentRoute.get_Value());
        if(matchValue.$==0)
         {
          site1=matchValue.$0;
          state.CurrentSite=site1.RouteId;
          glob=Var1.Create(site1.RouteValue);
         }
        else
         {
          glob=Var1.Create(va.$==1?va.$0:Operators.FailWith("Site.Install fails on empty site"));
         }
        state.Selection=glob;
        View.Sink(function(site2)
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
        View.Sink(updateRoute,currentRoute.get_View());
        return glob;
       },
       InstallMap:function(rt)
       {
        var cur,_var,onUpdate;
        cur=function()
        {
         return rt.Des.call(null,Route.ToList(Route.ParseHash(window.location.hash)));
        };
        _var=Var1.Create(cur(null));
        onUpdate=function()
        {
         var value;
         value=cur(null);
         return!Unchecked.Equals(rt.Ser.call(null,_var.get_Value()),rt.Ser.call(null,value))?_var.set_Value(value):null;
        };
        window.onpopstate=onUpdate;
        window.onhashchange=onUpdate;
        View.Sink(function(loc)
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
        merged=Trie.Merge(Seq.map(function(_arg1)
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
      Snap:{
       Bind:function(f,snap)
       {
        var res,onObs;
        res=Snap.Create();
        onObs=function()
        {
         return Snap.MarkObsolete(res);
        };
        Snap.When(snap,function(x)
        {
         var y;
         y=f(x);
         return Snap.When(y,function(v)
         {
          return(Snap.IsForever(y)?Snap.IsForever(snap):false)?Snap.MarkForever(res,v):Snap.MarkReady(res,v);
         },onObs);
        },onObs);
        return res;
       },
       Create:function()
       {
        return Snap.Make({
         $:3,
         $0:[],
         $1:[]
        });
       },
       CreateForever:function(v)
       {
        return Snap.Make({
         $:0,
         $0:v
        });
       },
       CreateWithValue:function(v)
       {
        return Snap.Make({
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
          return Snap.CreateForever(fn(matchValue.$0));
         }
        else
         {
          res=Snap.Create();
          Snap.When(sn,function(x)
          {
           return Snap.MarkDone(res,sn,fn(x));
          },function()
          {
           return Snap.MarkObsolete(res);
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
            return Snap.CreateForever((fn(matchValue[0].$0))(y));
           }
          else
           {
            return Snap.Map(fn(matchValue[0].$0),sn2);
           }
         }
        else
         {
          if(matchValue[1].$==0)
           {
            y1=matchValue[1].$0;
            return Snap.Map(function(x)
            {
             return(fn(x))(y1);
            },sn1);
           }
          else
           {
            res=Snap.Create();
            v1={
             contents:{
              $:0
             }
            };
            v2={
             contents:{
              $:0
             }
            };
            obs=function()
            {
             v1.contents={
              $:0
             };
             v2.contents={
              $:0
             };
             return Snap.MarkObsolete(res);
            };
            cont=function()
            {
             var matchValue1,x,y2;
             matchValue1=[v1.contents,v2.contents];
             if(matchValue1[0].$==1)
              {
               if(matchValue1[1].$==1)
                {
                 x=matchValue1[0].$0;
                 y2=matchValue1[1].$0;
                 return(Snap.IsForever(sn1)?Snap.IsForever(sn2):false)?Snap.MarkForever(res,(fn(x))(y2)):Snap.MarkReady(res,(fn(x))(y2));
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
            Snap.When(sn1,function(x)
            {
             v1.contents={
              $:1,
              $0:x
             };
             return cont(null);
            },obs);
            Snap.When(sn2,function(y2)
            {
             v2.contents={
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
        res=Snap.Create();
        Snap.When(snap,function(v)
        {
         return Async.StartTo(fn(v),function(v1)
         {
          return Snap.MarkDone(res,snap,v1);
         });
        },function()
        {
         return Snap.MarkObsolete(res);
        });
        return res;
       },
       MarkDone:function(res,sn,v)
       {
        return Snap.IsForever(sn)?Snap.MarkForever(res,v):Snap.MarkReady(res,v);
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
          return Snap.CreateForever(matchValue[1].$0);
         }
        else
         {
          res=Snap.Create();
          v={
           contents:{
            $:0
           }
          };
          triggered={
           contents:false
          };
          cont=function()
          {
           var matchValue1;
           if(triggered.contents)
            {
             matchValue1=v.contents;
             return matchValue1.$==1?Snap.IsForever(sn2)?Snap.MarkForever(res,matchValue1.$0):matchValue1.$==1?Snap.MarkReady(res,matchValue1.$0):null:matchValue1.$==1?Snap.MarkReady(res,matchValue1.$0):null;
            }
           else
            {
             return null;
            }
          };
          Snap.When(sn1,function()
          {
           triggered.contents=true;
           return cont(null);
          },function()
          {
           v.contents={
            $:0
           };
           return Snap.MarkObsolete(res);
          });
          Snap.When(sn2,function(y)
          {
           v.contents={
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
      Trans1:Runtime.Class({},{
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
      Trie:{
       AllSome:function(xs)
       {
        var e,r,ok,matchValue;
        e=Enumerator.Get(xs);
        r=ResizeArrayProxy.New1();
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
              }:Trie.Look(ks,matchValue1.$0);
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
        return Trie.Look(Seq.toList(key),trie);
       },
       Map:function(f,trie)
       {
        return Trie.MapLoop(Runtime.New(T,{
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
            return Trie.TrieBranch(MapModule.Map(function(k)
            {
             return function(v)
             {
              var b;
              b=List.ofArray([k]);
              return Trie.MapLoop(List.append(loc,b),f,v);
             };
            },trie.$0));
           }
         }
       },
       Mapi:function(f,trie)
       {
        var counter;
        counter={
         contents:0
        };
        return Trie.Map(function(x)
        {
         var c;
         c=counter.contents;
         counter.contents=c+1;
         return(f(c))(x);
        },trie);
       },
       Merge:function(ts)
       {
        var ts1,matchValue;
        ts1=Seq.toArray(ts);
        matchValue=IntrinsicFunctionProxy.GetLength(ts1);
        return matchValue===0?{
         $:1,
         $0:{
          $:1
         }
        }:matchValue===1?{
         $:1,
         $0:IntrinsicFunctionProxy.GetArray(ts1,0)
        }:Seq.exists(function(t)
        {
         return Trie.IsLeaf(t);
        },ts1)?{
         $:0
        }:Option.map(function(xs)
        {
         return Trie.TrieBranch(xs);
        },Trie.MergeMaps(function(_arg00_)
        {
         return Trie.Merge(_arg00_);
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
        var x,x1;
        x=Seq.collect(function(table)
        {
         return MapModule.ToSeq(table);
        },maps);
        x1=MapModule.ToSeq(Seq.fold(function(s)
        {
         return Runtime.Tupled(function(tupledArg)
         {
          return Trie.MultiAdd(tupledArg[0],tupledArg[1],s);
         });
        },FSharpMap.New([]),x));
        return Option.map(function(elements)
        {
         return MapModule.OfArray(Seq.toArray(elements));
        },Trie.AllSome(Seq.map(Runtime.Tupled(function(tupledArg)
        {
         var k;
         k=tupledArg[0];
         return Option.map(function(v)
         {
          return[k,v];
         },merge(tupledArg[1]));
        }),x1)));
       },
       MultiAdd:function(key,value,map)
       {
        var v;
        v=Runtime.New(T,{
         $:1,
         $0:value,
         $1:Trie.MultiFind(key,map)
        });
        return map.Add(key,v);
       },
       MultiFind:function(key,map)
       {
        return Operators.DefaultArg(MapModule.TryFind(key,map),Runtime.New(T,{
         $:0
        }));
       },
       Prefix:function(key,trie)
       {
        return Trie.TrieBranch(FSharpMap.New(List.ofArray([[key,trie]])));
       },
       ToArray:function(trie)
       {
        var all;
        all=[];
        Trie.Map(function()
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
        var r;
        r=Runtime.New(this,Pagelet.New());
        r.doc=doc;
        r.divId=Fresh.Id();
        r.body=Default.Div(List.ofArray([Default.Id(r.divId)])).get_Body();
        return r;
       }
      }),
      Var:Runtime.Class({},{
       GetId:function(_var)
       {
        return _var.Id;
       },
       Observe:function(_var)
       {
        return _var.Snap;
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
          _var.Snap=Snap.CreateForever(value);
          return;
         }
       },
       Update:function(_var,fn)
       {
        return Var1.Set(_var,fn(Var1.Get(_var)));
       }
      }),
      Var1:Runtime.Class({
       get_Value:function()
       {
        return Var1.Get(this);
       },
       get_View:function()
       {
        return View1.FromVar(this);
       },
       set_Value:function(value)
       {
        return Var1.Set(this,value);
       }
      },{
       Create:function(v)
       {
        return Runtime.New(Var1,{
         Const:false,
         Current:v,
         Snap:Snap.CreateWithValue(v),
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
          Snap.MarkObsolete(_var.Snap);
          _var.Current=value;
          _var.Snap=Snap.CreateWithValue(value);
          return;
         }
       }
      }),
      View:Runtime.Class({},{
       Apply:function(fn,view)
       {
        return View1.Map2(function(f)
        {
         return function(x)
         {
          return f(x);
         };
        },fn,view);
       },
       Bind:function(fn,view)
       {
        return View.Join(View1.Map(fn,view));
       },
       Const:function(x)
       {
        var o;
        o=Snap.CreateForever(x);
        return{
         $:0,
         $0:function()
         {
          return o;
         }
        };
       },
       ConvertSeq:function(conv,view)
       {
        return View1.ConvertSeqBy(function(x)
        {
         return x;
        },conv,view);
       },
       Join:function(_arg7)
       {
        var observe;
        observe=_arg7.$0;
        return View1.CreateLazy(function()
        {
         return Snap.Bind(function(_arg1)
         {
          return _arg1.$0.call(null,null);
         },observe(null));
        });
       },
       Sink:function(act,_arg8)
       {
        var observe,loop;
        observe=_arg8.$0;
        loop=function()
        {
         return Snap.When(observe(null),act,function()
         {
          return Async.Schedule(loop);
         });
        };
        return Async.Schedule(loop);
       }
      }),
      View1:Runtime.Class({},{
       Convert:function(conv,view)
       {
        return View1.ConvertBy(function(x)
        {
         return x;
        },conv,view);
       },
       ConvertBy:function(key,conv,view)
       {
        var state;
        state={
         contents:Dictionary.New2()
        };
        return View1.Map(function(xs)
        {
         var prevState,newState,result;
         prevState=state.contents;
         newState=Dictionary.New2();
         result=Arrays.map(function(x)
         {
          var k,res;
          k=key(x);
          res=prevState.ContainsKey(k)?prevState.get_Item(k):conv(x);
          newState.set_Item(k,res);
          return res;
         },Seq.toArray(xs));
         state.contents=newState;
         return result;
        },view);
       },
       ConvertSeqBy:function(key,conv,view)
       {
        var state;
        state={
         contents:Dictionary.New2()
        };
        return View1.Map(function(xs)
        {
         var prevState,newState,result;
         prevState=state.contents;
         newState=Dictionary.New2();
         result=Arrays.map(function(x)
         {
          var k,node,n;
          k=key(x);
          if(prevState.ContainsKey(k))
           {
            n=prevState.get_Item(k);
            Var1.Set(n.NVar,x);
            node=n;
           }
          else
           {
            node=View1.ConvertSeqNode(conv,x);
           }
          newState.set_Item(k,node);
          return node.NValue;
         },Seq.toArray(xs));
         state.contents=newState;
         return result;
        },view);
       },
       ConvertSeqNode:function(conv,value)
       {
        var _var,view;
        _var=Var1.Create(value);
        view=View1.FromVar(_var);
        return{
         NValue:conv(view),
         NVar:_var,
         NView:view
        };
       },
       CreateLazy:function(observe)
       {
        var cur;
        cur={
         contents:{
          $:0
         }
        };
        return{
         $:0,
         $0:function()
         {
          var matchValue,sn,sn1;
          matchValue=cur.contents;
          if(matchValue.$==1)
           {
            if(!Snap.IsObsolete(matchValue.$0))
             {
              return matchValue.$0;
             }
            else
             {
              sn=observe(null);
              cur.contents={
               $:1,
               $0:sn
              };
              return sn;
             }
           }
          else
           {
            sn1=observe(null);
            cur.contents={
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
        return View1.CreateLazy(function()
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
          return Var.Observe(_var);
         }
        };
       },
       Map:function(fn,_arg1)
       {
        var observe;
        observe=_arg1.$0;
        return View1.CreateLazy(function()
        {
         return Snap.Map(fn,observe(null));
        });
       },
       Map2:function(fn,v1,v2)
       {
        return View1.CreateLazy2(function(_arg10_)
        {
         return function(_arg20_)
         {
          return Snap.Map2(fn,_arg10_,_arg20_);
         };
        },v1,v2);
       },
       MapAsync:function(fn,_arg4)
       {
        var observe;
        observe=_arg4.$0;
        return View1.CreateLazy(function()
        {
         return Snap.MapAsync(fn,observe(null));
        });
       },
       SnapshotOn:function(def,_arg6,_arg5)
       {
        var o1,o2,res,init;
        o1=_arg6.$0;
        o2=_arg5.$0;
        res=Snap.CreateWithValue(def);
        init={
         contents:false
        };
        return View1.CreateLazy(function()
        {
         var s1,s2;
         s1=o1(null);
         s2=o2(null);
         if(init.contents)
          {
           return Snap.SnapshotOn(s1,s2);
          }
         else
          {
           Snap.When(Snap.SnapshotOn(s1,s2),function()
           {
            return null;
           },function()
           {
            if(!init.contents)
             {
              init.contents=true;
              return Snap.MarkObsolete(res);
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
        value={
         contents:def
        };
        return View1.Map2(function(pred)
        {
         return function(v)
         {
          if(pred)
           {
            value.contents=v;
           }
          return value.contents;
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
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  IntrinsicFunctionProxy=Runtime.Safe(WebSharper.IntrinsicFunctionProxy);
  Concurrency=Runtime.Safe(WebSharper.Concurrency);
  Array=Runtime.Safe(Global.Array);
  Seq=Runtime.Safe(WebSharper.Seq);
  UI=Runtime.Safe(WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Abbrev=Runtime.Safe(Next.Abbrev);
  Fresh=Runtime.Safe(Abbrev.Fresh);
  Collections=Runtime.Safe(WebSharper.Collections);
  HashSet=Runtime.Safe(Collections.HashSet);
  HashSet1=Runtime.Safe(HashSet.HashSet);
  HashSet2=Runtime.Safe(Abbrev.HashSet);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  JQueue=Runtime.Safe(Abbrev.JQueue);
  Unchecked=Runtime.Safe(WebSharper.Unchecked);
  Slot=Runtime.Safe(Abbrev.Slot);
  An=Runtime.Safe(Next.An);
  AppendList=Runtime.Safe(Next.AppendList);
  Anims=Runtime.Safe(Next.Anims);
  window=Runtime.Safe(Global.window);
  Trans1=Runtime.Safe(Next.Trans1);
  Option=Runtime.Safe(WebSharper.Option);
  View1=Runtime.Safe(Next.View1);
  Lazy=Runtime.Safe(WebSharper.Lazy);
  Array1=Runtime.Safe(Abbrev.Array);
  Attrs=Runtime.Safe(Next.Attrs);
  DomUtility=Runtime.Safe(Next.DomUtility);
  Attr=Runtime.Safe(Next.Attr);
  AnimatedAttrNode=Runtime.Safe(Next.AnimatedAttrNode);
  DynamicAttrNode=Runtime.Safe(Next.DynamicAttrNode);
  View=Runtime.Safe(Next.View);
  Docs=Runtime.Safe(Next.Docs);
  UINextPagelet=Runtime.Safe(Next.UINextPagelet);
  Doc=Runtime.Safe(Next.Doc);
  List=Runtime.Safe(WebSharper.List);
  Var=Runtime.Safe(Next.Var);
  Var1=Runtime.Safe(Next.Var1);
  Mailbox=Runtime.Safe(Abbrev.Mailbox);
  Operators=Runtime.Safe(WebSharper.Operators);
  NodeSet=Runtime.Safe(Docs.NodeSet);
  DocElemNode=Runtime.Safe(Next.DocElemNode);
  DomNodes=Runtime.Safe(Docs.DomNodes);
  jQuery=Runtime.Safe(Global.jQuery);
  document=Runtime.Safe(Global.document);
  Easing=Runtime.Safe(Next.Easing);
  Easings=Runtime.Safe(Next.Easings);
  FlowBuilder=Runtime.Safe(Next.FlowBuilder);
  Flow=Runtime.Safe(Next.Flow);
  Html=Runtime.Safe(Next.Html);
  Elements=Runtime.Safe(Html.Elements);
  T=Runtime.Safe(List.T);
  Input=Runtime.Safe(Next.Input);
  DoubleInterpolation=Runtime.Safe(Next.DoubleInterpolation);
  Key=Runtime.Safe(Next.Key);
  ListModels=Runtime.Safe(Next.ListModels);
  ListModel1=Runtime.Safe(Next.ListModel1);
  Model1=Runtime.Safe(Next.Model1);
  Strings=Runtime.Safe(WebSharper.Strings);
  encodeURIComponent=Runtime.Safe(Global.encodeURIComponent);
  Route=Runtime.Safe(Next.Route);
  decodeURIComponent=Runtime.Safe(Global.decodeURIComponent);
  Routing=Runtime.Safe(Next.Routing);
  Trie=Runtime.Safe(Next.Trie);
  Router=Runtime.Safe(Next.Router);
  Router1=Runtime.Safe(Next.Router1);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Snap=Runtime.Safe(Next.Snap);
  Async=Runtime.Safe(Abbrev.Async);
  Enumerator=Runtime.Safe(WebSharper.Enumerator);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  MapModule=Runtime.Safe(Collections.MapModule);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  Html1=Runtime.Safe(WebSharper.Html);
  Client=Runtime.Safe(Html1.Client);
  Pagelet=Runtime.Safe(Client.Pagelet);
  Default=Runtime.Safe(Client.Default);
  ViewBuilder=Runtime.Safe(Next.ViewBuilder);
  Attributes=Runtime.Safe(Html.Attributes);
  return SvgAttributes=Runtime.Safe(Html.SvgAttributes);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(UINextPagelet,Pagelet);
  Input.MousePosSt();
  Input.MouseBtnSt();
  Input.KeyListenerState();
  Input.ActivateKeyListener();
  Input.ActivateButtonListener();
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
  Attributes.Wrap();
  Attributes.Width();
  Attributes.Value();
  Attributes.Usemap();
  Attributes.Type();
  Attributes.Title();
  Attributes.Target();
  Attributes.TabIndex();
  Attributes.Summary();
  Attributes.Style();
  Attributes.Step();
  Attributes.Start();
  Attributes.Srcdoc();
  Attributes.SrcLang();
  Attributes.Src();
  Attributes.Spellcheck();
  Attributes.Span();
  Attributes.Sizes();
  Attributes.Size();
  Attributes.Shape();
  Attributes.Selected();
  Attributes.Seamless();
  Attributes.Scoped();
  Attributes.Scope();
  Attributes.Sandbox();
  Attributes.Rows();
  Attributes.RowSpan();
  Attributes.Reversed();
  Attributes.Required();
  Attributes.Rel();
  Attributes.Readonly();
  Attributes.RadioGroup();
  Attributes.PubDate();
  Attributes.Preload();
  Attributes.Poster();
  Attributes.Placeholder();
  Attributes.Ping();
  Attributes.Pattern();
  Attributes.Optimum();
  Attributes.Open();
  Attributes.NoValidate();
  Attributes.Name();
  Attributes.Multiple();
  Attributes.Min();
  Attributes.Method();
  Attributes.Media();
  Attributes.MaxLength();
  Attributes.Max();
  Attributes.Manifest();
  Attributes.Low();
  Attributes.Loop();
  Attributes.List();
  Attributes.Language();
  Attributes.Lang();
  Attributes.Label();
  Attributes.Kind();
  Attributes.KeyType();
  Attributes.ItemProp();
  Attributes.IsMap();
  Attributes.Icon();
  Attributes.ID();
  Attributes.HttpEquiv();
  Attributes.HrefLang();
  Attributes.Href();
  Attributes.High();
  Attributes.Hidden();
  Attributes.Height();
  Attributes.Headers();
  Attributes.FormAction();
  Attributes.Form();
  Attributes.For();
  Attributes.EncType();
  Attributes.Dropzone();
  Attributes.Draggable();
  Attributes.Download();
  Attributes.Disabled();
  Attributes.DirName();
  Attributes.Dir();
  Attributes.Defer();
  Attributes.Default();
  Attributes.Datetime();
  Attributes.Coords();
  Attributes.Controls();
  Attributes.ContextMenu();
  Attributes.ContentEditable();
  Attributes.Content();
  Attributes.Cols();
  Attributes.Color();
  Attributes.ColSpan();
  Attributes.Codebase();
  Attributes.Code();
  Attributes.Class();
  Attributes.Cite();
  Attributes.Checked();
  Attributes.Charset();
  Attributes.Challenge();
  Attributes.Buffered();
  Attributes.Border();
  Attributes.BgColor();
  Attributes.AutoSave();
  Attributes.AutoPlay();
  Attributes.AutoFocus();
  Attributes.AutoComplete();
  Attributes.Async();
  Attributes.Alt();
  Attributes.Align();
  Attributes.Action();
  Attributes.Accesskey();
  Attributes.AcceptCharset();
  Attributes.Accept();
  Easings.CubicInOut();
  DomUtility.Doc();
  Attrs.EmptyAttr();
  Fresh.counter();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,IntrinsicFunctionProxy,ok,Unchecked,console,Testing,Pervasives,TestBuilder,test,Random,Arrays,Math,NaN1,Infinity1,List,String,Seq;
 Runtime.Define(Global,{
  IntelliFactory:{
   WebSharper:{
    Testing:{
     Assert:{
      For:function(times,gen,attempt)
      {
       var _this,i,i1;
       _this=gen.Base;
       for(i=0;i<=IntrinsicFunctionProxy.GetLength(_this)-1;i++){
        attempt(IntrinsicFunctionProxy.GetArray(gen.Base,i));
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
         ps=["Equality test failed.",a,b];
         console?console.log.apply(console,ps):undefined;
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
         ps=["Inequality test failed.",a,b];
         console?console.log.apply(console,ps):undefined;
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
       left={
        contents:false
       };
       return{
        Base:a.Base.concat(b.Base),
        Next:function()
        {
         left.contents=!left.contents;
         return left.contents?a.Next.call(null,null):b.Next.call(null,null);
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
       index=Random.Within(1,IntrinsicFunctionProxy.GetLength(seeds));
       return{
        Base:seeds,
        Next:function()
        {
         return IntrinsicFunctionProxy.GetArray(seeds,index.Next.call(null,null)-1);
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
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  IntrinsicFunctionProxy=Runtime.Safe(WebSharper.IntrinsicFunctionProxy);
  ok=Runtime.Safe(Global.ok);
  Unchecked=Runtime.Safe(WebSharper.Unchecked);
  console=Runtime.Safe(Global.console);
  Testing=Runtime.Safe(WebSharper.Testing);
  Pervasives=Runtime.Safe(Testing.Pervasives);
  TestBuilder=Runtime.Safe(Pervasives.TestBuilder);
  test=Runtime.Safe(Global.test);
  Random=Runtime.Safe(Testing.Random);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  Math=Runtime.Safe(Global.Math);
  NaN1=Runtime.Safe(Global.NaN);
  Infinity1=Runtime.Safe(Global.Infinity);
  List=Runtime.Safe(WebSharper.List);
  String=Runtime.Safe(Global.String);
  return Seq=Runtime.Safe(WebSharper.Seq);
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
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,Unchecked,Seq,Option,Control,Disposable,IntrinsicFunctionProxy,FSharpEvent,Util,Event,Event1,Collections,ResizeArray,ResizeArrayProxy,EventModule,HotStream,HotStream1,Operators,Error,Concurrency,setTimeout,clearTimeout,LinkedList,ListProxy,MailboxProcessor,Observable,Observer,Observable1,List,T,Observer1;
 Runtime.Define(Global,{
  IntelliFactory:{
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
         h=IntrinsicFunctionProxy.GetArray(arr,idx);
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
        Handlers:ResizeArrayProxy.New1()
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
        Handlers:ResizeArrayProxy.New1()
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
        Handlers:ResizeArrayProxy.New1()
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
       buf={
        contents:{
         $:0
        }
       };
       ev=Runtime.New(Event1,{
        Handlers:ResizeArrayProxy.New1()
       });
       Util.addListener(e,function(x)
       {
        var matchValue,_,old;
        matchValue=buf.contents;
        if(matchValue.$==1)
         {
          old=matchValue.$0;
          buf.contents={
           $:1,
           $0:x
          };
          _=ev.Trigger([old,x]);
         }
        else
         {
          _=void(buf.contents={
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
       state={
        contents:seed
       };
       f=function(value)
       {
        state.contents=(fold(state.contents))(value);
        return state.contents;
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
        Handlers:ResizeArrayProxy.New1()
       });
       return r;
      }
     }),
     HotStream:{
      HotStream:Runtime.Class({
       Subscribe:function(o)
       {
        var disp,_this;
        this.Latest.contents.$==1?o.OnNext(this.Latest.contents.$0):null;
        _this=this.Event;
        disp=Util.subscribeTo(_this.event,function(v)
        {
         return o.OnNext(v);
        });
        return disp;
       },
       Trigger:function(v)
       {
        var _this;
        this.Latest.contents={
         $:1,
         $0:v
        };
        _this=this.Event;
        return _this.event.Trigger(v);
       }
      },{
       New:function()
       {
        return Runtime.New(HotStream1,{
         Latest:{
          contents:{
           $:0
          }
         },
         Event:FSharpEvent.New()
        });
       }
      })
     },
     MailboxProcessor:Runtime.Class({
      PostAndAsyncReply:function(msgf,timeout)
      {
       var f,_this=this;
       f=function()
       {
        var x,f1;
        x=_this.PostAndTryAsyncReply(msgf,timeout);
        f1=function(_arg4)
        {
         var x1,_,x2;
         if(_arg4.$==1)
          {
           x2=_arg4.$0;
           _=x2;
          }
         else
          {
           _=Operators.Raise(new Error("TimeoutException"));
          }
         x1=_;
         return Concurrency.Return(x1);
        };
        return Concurrency.Bind(x,f1);
       };
       return Concurrency.Delay(f);
      },
      PostAndTryAsyncReply:function(msgf,timeout)
      {
       var timeout1,arg00,_this=this;
       timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
       arg00=Runtime.Tupled(function(tupledArg)
       {
        var ok,_arg3,_arg4,_,arg001,value,waiting,arg002,value1,value2;
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
          value=_this.mailbox.AddLast(arg001);
          _=_this.resume();
         }
        else
         {
          waiting={
           contents:true
          };
          arg002=msgf(function(res)
          {
           var _1;
           if(waiting.contents)
            {
             waiting.contents=false;
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
          value1=_this.mailbox.AddLast(arg002);
          _this.resume();
          value2=setTimeout(function()
          {
           var _1;
           if(waiting.contents)
            {
             waiting.contents=false;
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
          _=void value2;
         }
        return _;
       });
       return Concurrency.FromContinuations(arg00);
      },
      Receive:function(timeout)
      {
       var f,_this=this;
       f=function()
       {
        var x,f1;
        x=_this.TryReceive(timeout);
        f1=function(_arg3)
        {
         var x1,_,x2;
         if(_arg3.$==1)
          {
           x2=_arg3.$0;
           _=x2;
          }
         else
          {
           _=Operators.Raise(new Error("TimeoutException"));
          }
         x1=_;
         return Concurrency.Return(x1);
        };
        return Concurrency.Bind(x,f1);
       };
       return Concurrency.Delay(f);
      },
      Scan:function(scanner,timeout)
      {
       var f,_this=this;
       f=function()
       {
        var x,f1;
        x=_this.TryScan(scanner,timeout);
        f1=function(_arg8)
        {
         var x1,_,x2;
         if(_arg8.$==1)
          {
           x2=_arg8.$0;
           _=x2;
          }
         else
          {
           _=Operators.Raise(new Error("TimeoutException"));
          }
         x1=_;
         return Concurrency.Return(x1);
        };
        return Concurrency.Bind(x,f1);
       };
       return Concurrency.Delay(f);
      },
      Start:function()
      {
       var _,f,_this=this,a1;
       if(this.started)
        {
         _=Operators.FailWith("The MailboxProcessor has already been started.");
        }
       else
        {
         this.started=true;
         f=function()
         {
          var f1,a,f3;
          f1=function()
          {
           var x,f2;
           x=_this.initial.call(null,_this);
           f2=function()
           {
            return Concurrency.Return(null);
           };
           return Concurrency.Bind(x,f2);
          };
          a=Concurrency.Delay(f1);
          f3=function(_arg2)
          {
           var _this1;
           _this1=_this.errorEvent;
           _this1.event.Trigger(_arg2);
           return Concurrency.Return(null);
          };
          return Concurrency.TryWith(a,f3);
         };
         a1=Concurrency.Delay(f);
         _=_this.startAsync(a1);
        }
       return _;
      },
      TryReceive:function(timeout)
      {
       var timeout1,arg00,_this=this;
       timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
       arg00=Runtime.Tupled(function(tupledArg)
       {
        var ok,_arg1,_arg2,_,_1,f,arg01,waiting,pending,f1,arg02,arg03;
        ok=tupledArg[0];
        _arg1=tupledArg[1];
        _arg2=tupledArg[2];
        if(Unchecked.Equals(_this.mailbox.get_First(),null))
         {
          if(timeout1<0)
           {
            f=function()
            {
             var arg0;
             arg0=_this.dequeue();
             ok({
              $:1,
              $0:arg0
             });
             return Concurrency.Return(null);
            };
            arg01=Concurrency.Delay(f);
            _1=void(_this.savedCont={
             $:1,
             $0:arg01
            });
           }
          else
           {
            waiting={
             contents:true
            };
            pending=setTimeout(function()
            {
             var _2;
             if(waiting.contents)
              {
               waiting.contents=false;
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
            f1=function()
            {
             var _2,arg0;
             if(waiting.contents)
              {
               waiting.contents=false;
               clearTimeout(pending);
               arg0=_this.dequeue();
               ok({
                $:1,
                $0:arg0
               });
               _2=Concurrency.Return(null);
              }
             else
              {
               _2=Concurrency.Return(null);
              }
             return _2;
            };
            arg02=Concurrency.Delay(f1);
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
       });
       return Concurrency.FromContinuations(arg00);
      },
      TryScan:function(scanner,timeout)
      {
       var timeout1,f,_this=this;
       timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
       f=function()
       {
        var scanInbox,matchValue1,_1,found1,f1,arg00,x1;
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
          f1=function(_arg5)
          {
           var x;
           x={
            $:1,
            $0:_arg5
           };
           return Concurrency.Return(x);
          };
          _1=Concurrency.Bind(found1,f1);
         }
        else
         {
          arg00=Runtime.Tupled(function(tupledArg)
          {
           var ok,_arg5,_arg6,_,scanNext,waiting,pending,scanNext1;
           ok=tupledArg[0];
           _arg5=tupledArg[1];
           _arg6=tupledArg[2];
           if(timeout1<0)
            {
             scanNext=function()
             {
              var f2,arg0;
              f2=function()
              {
               var matchValue,_2,c,f3;
               matchValue=scanner(_this.mailbox.get_First().v);
               if(matchValue.$==1)
                {
                 c=matchValue.$0;
                 _this.mailbox.RemoveFirst();
                 f3=function(_arg61)
                 {
                  ok({
                   $:1,
                   $0:_arg61
                  });
                  return Concurrency.Return(null);
                 };
                 _2=Concurrency.Bind(c,f3);
                }
               else
                {
                 scanNext(null);
                 _2=Concurrency.Return(null);
                }
               return _2;
              };
              arg0=Concurrency.Delay(f2);
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
             waiting={
              contents:true
             };
             pending=setTimeout(function()
             {
              var _2;
              if(waiting.contents)
               {
                waiting.contents=false;
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
              var f2,arg0;
              f2=function()
              {
               var matchValue,_2,c,f3;
               matchValue=scanner(_this.mailbox.get_First().v);
               if(matchValue.$==1)
                {
                 c=matchValue.$0;
                 _this.mailbox.RemoveFirst();
                 f3=function(_arg7)
                 {
                  var _3;
                  if(waiting.contents)
                   {
                    waiting.contents=false;
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
                 };
                 _2=Concurrency.Bind(c,f3);
                }
               else
                {
                 scanNext1(null);
                 _2=Concurrency.Return(null);
                }
               return _2;
              };
              arg0=Concurrency.Delay(f2);
              _this.savedCont={
               $:1,
               $0:arg0
              };
              return;
             };
             _=scanNext1(null);
            }
           return _;
          });
          x1=Concurrency.FromContinuations(arg00);
          _1=x1;
         }
        return _1;
       };
       return Concurrency.Delay(f);
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
       var _this;
       _this=this.errorEvent;
       return _this.event;
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
       var t;
       t=this.token;
       return Concurrency.Start(a,t);
      }
     },{
      New:function(initial,token)
      {
       var r,matchValue,_,ct,callback,value;
       r=Runtime.New(this,{});
       r.initial=initial;
       r.token=token;
       r.started=false;
       r.errorEvent=FSharpEvent.New();
       r.mailbox=ListProxy.New();
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
         callback=function()
         {
          return r.resume();
         };
         value=Concurrency.Register(ct,function()
         {
          return callback();
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
        state={
         contents:seed
        };
        on=function(v)
        {
         return Observable.Protect(function()
         {
          return(fold(state.contents))(v);
         },function(s)
         {
          state.contents=s;
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
        lv1={
         contents:{
          $:0
         }
        };
        lv2={
         contents:{
          $:0
         }
        };
        update=function()
        {
         var matchValue,_,_1,v1,v2;
         matchValue=[lv1.contents,lv2.contents];
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
         lv1.contents={
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
         lv2.contents={
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
        innerDisp={
         contents:{
          $:0
         }
        };
        outerDisp=io1.Subscribe(Observer.New(function(arg00)
        {
         return o.OnNext(arg00);
        },function()
        {
        },function()
        {
         var arg0;
         arg0=io2.Subscribe(o);
         innerDisp.contents={
          $:1,
          $0:arg0
         };
        }));
        dispose=function()
        {
         innerDisp.contents.$==1?innerDisp.contents.$0.Dispose():null;
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
        index={
         contents:0
        };
        on=function(v)
        {
         Operators.Increment(index);
         return index.contents>count?o1.OnNext(v):null;
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
        completed1={
         contents:false
        };
        completed2={
         contents:false
        };
        arg00=Observer.New(function(arg001)
        {
         return o.OnNext(arg001);
        },function()
        {
        },function()
        {
         completed1.contents=true;
         return(completed1.contents?completed2.contents:false)?o.OnCompleted():null;
        });
        disp1=io1.Subscribe(arg00);
        arg002=Observer.New(function(arg001)
        {
         return o.OnNext(arg001);
        },function()
        {
        },function()
        {
         completed2.contents=true;
         return(completed1.contents?completed2.contents:false)?o.OnCompleted():null;
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
        disp={
         contents:function()
         {
         }
        };
        d=Util.subscribeTo(io,function(o1)
        {
         var d1;
         d1=Util.subscribeTo(o1,function(v)
         {
          return o.OnNext(v);
         });
         disp.contents=function()
         {
          disp.contents.call(null,null);
          return d1.Dispose();
         };
         return;
        });
        return Disposable.Of(function()
        {
         disp.contents.call(null,null);
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
            return Runtime.New(T,{
             $:1,
             $0:x1,
             $1:y
            });
           };
          });
         }
        else
         {
          _=Observable.Return(Runtime.New(T,{
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
        index={
         contents:0
        };
        disp={
         contents:{
          $:0
         }
        };
        disp1=Util.subscribeTo(io,function(o1)
        {
         var currentIndex,arg0,d;
         Operators.Increment(index);
         disp.contents.$==1?disp.contents.$0.Dispose():null;
         currentIndex=index.contents;
         arg0=Util.subscribeTo(o1,function(v)
         {
          return currentIndex===index.contents?o.OnNext(v):null;
         });
         d={
          $:1,
          $0:arg0
         };
         disp.contents=d;
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
        last={
         contents:{
          $:0
         }
        };
        on=function(v)
        {
         var matchValue,_,l;
         matchValue=last.contents;
         if(matchValue.$==1)
          {
           l=matchValue.$0;
           _=o1.OnNext([l,v]);
          }
         else
          {
           _=null;
          }
         last.contents={
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
       var ok;
       ok=function(x)
       {
        var value;
        value=f(x);
        return!value;
       };
       return[Observable.Filter(f,e),Observable.Filter(ok,e)];
      },
      Scan:function(fold,seed,e)
      {
       var f;
       f=function(o1)
       {
        var state,on,arg001;
        state={
         contents:seed
        };
        on=function(v)
        {
         return Observable.Protect(function()
         {
          return(fold(state.contents))(v);
         },function(s)
         {
          state.contents=s;
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
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Unchecked=Runtime.Safe(WebSharper.Unchecked);
  Seq=Runtime.Safe(WebSharper.Seq);
  Option=Runtime.Safe(WebSharper.Option);
  Control=Runtime.Safe(WebSharper.Control);
  Disposable=Runtime.Safe(Control.Disposable);
  IntrinsicFunctionProxy=Runtime.Safe(WebSharper.IntrinsicFunctionProxy);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  Util=Runtime.Safe(WebSharper.Util);
  Event=Runtime.Safe(Control.Event);
  Event1=Runtime.Safe(Event.Event);
  Collections=Runtime.Safe(WebSharper.Collections);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  EventModule=Runtime.Safe(Control.EventModule);
  HotStream=Runtime.Safe(Control.HotStream);
  HotStream1=Runtime.Safe(HotStream.HotStream);
  Operators=Runtime.Safe(WebSharper.Operators);
  Error=Runtime.Safe(Global.Error);
  Concurrency=Runtime.Safe(WebSharper.Concurrency);
  setTimeout=Runtime.Safe(Global.setTimeout);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  ListProxy=Runtime.Safe(LinkedList.ListProxy);
  MailboxProcessor=Runtime.Safe(Control.MailboxProcessor);
  Observable=Runtime.Safe(Control.Observable);
  Observer=Runtime.Safe(Control.Observer);
  Observable1=Runtime.Safe(Observable.Observable);
  List=Runtime.Safe(WebSharper.List);
  T=Runtime.Safe(List.T);
  return Observer1=Runtime.Safe(Observer.Observer);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Reactive,Disposable,HotStream,WebSharper,Control,FSharpEvent,Observer,Observable,Util,Collections,Dictionary,Operators,Seq,Reactive1,Reactive2,List,T;
 Runtime.Define(Global,{
  IntelliFactory:{
   Reactive:{
    Disposable:Runtime.Class({
     Dispose:function()
     {
      return this.Dispose1.call(null,null);
     }
    },{
     New:function(d)
     {
      return Runtime.New(Disposable,{
       Dispose1:d
      });
     }
    }),
    HotStream:Runtime.Class({
     Subscribe:function(o)
     {
      var _this;
      this.Latest.contents.$==1?o.OnNext(this.Latest.contents.$0):null;
      _this=this.Event;
      return _this.event.Subscribe(o);
     },
     Trigger:function(v)
     {
      var _this;
      this.Latest.contents={
       $:1,
       $0:v
      };
      _this=this.Event;
      return _this.event.Trigger(v);
     }
    },{
     New:function(x)
     {
      var value;
      value={
       $:1,
       $0:x
      };
      return Runtime.New(HotStream,{
       Latest:{
        contents:value
       },
       Event:FSharpEvent.New()
      });
     },
     New1:function()
     {
      return Runtime.New(HotStream,{
       Latest:{
        contents:{
         $:0
        }
       },
       Event:FSharpEvent.New()
      });
     }
    }),
    Observable:Runtime.Class({
     Subscribe:function(o)
     {
      return this.OnSubscribe.call(null,o);
     },
     SubscribeWith:function(onNext,onComplete)
     {
      return this.OnSubscribe.call(null,Observer.New(onNext,onComplete));
     }
    },{
     New:function(f)
     {
      return Runtime.New(Observable,{
       OnSubscribe:f
      });
     }
    }),
    Observer:Runtime.Class({
     OnCompleted:function()
     {
      return this.OnCompleted1.call(null,null);
     },
     OnError:function()
     {
      return null;
     },
     OnNext:function(t)
     {
      return this.OnNext1.call(null,t);
     }
    },{
     New:function(onNext,onComplete)
     {
      return Runtime.New(Observer,{
       OnNext1:onNext,
       OnCompleted1:onComplete
      });
     }
    }),
    Reactive:{
     Aggregate:function(io,seed,acc)
     {
      return Observable.New(function(o)
      {
       var state;
       state={
        contents:seed
       };
       return Util.subscribeTo(io,function(value)
       {
        state.contents=(acc(state.contents))(value);
        return o.OnNext(state.contents);
       });
      });
     },
     Choose:function(io,f)
     {
      var arg00;
      arg00=function(o1)
      {
       return Util.subscribeTo(io,function(v)
       {
        var matchValue,_,v1;
        matchValue=f(v);
        if(matchValue.$==0)
         {
          _=null;
         }
        else
         {
          v1=matchValue.$0;
          _=o1.OnNext(v1);
         }
        return _;
       });
      };
      return Observable.New(arg00);
     },
     CollectLatest:function(outer)
     {
      return Observable.New(function(o)
      {
       var dict,index;
       dict=Dictionary.New2();
       index={
        contents:0
       };
       return Util.subscribeTo(outer,function(inner)
       {
        var currentIndex,value;
        Operators.Increment(index);
        currentIndex=index.contents;
        value=Util.subscribeTo(inner,function(value1)
        {
         var arg00;
         dict.set_Item(currentIndex,value1);
         arg00=Seq.delay(function()
         {
          return Seq.map(function(pair)
          {
           return pair.V;
          },dict);
         });
         return o.OnNext(arg00);
        });
        return;
       });
      });
     },
     CombineLatest:function(io1,io2,f)
     {
      var arg00;
      arg00=function(o)
      {
       var lv1,lv2,update,onNext,arg10,o1,onNext1,arg101,o2,d1,d2;
       lv1={
        contents:{
         $:0
        }
       };
       lv2={
        contents:{
         $:0
        }
       };
       update=function()
       {
        var matchValue,_,_1,v1,v2;
        matchValue=[lv1.contents,lv2.contents];
        if(matchValue[0].$==1)
         {
          if(matchValue[1].$==1)
           {
            v1=matchValue[0].$0;
            v2=matchValue[1].$0;
            _1=o.OnNext((f(v1))(v2));
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
        lv1.contents={
         $:1,
         $0:x
        };
        return update(null);
       };
       arg10=function()
       {
       };
       o1=Observer.New(onNext,arg10);
       onNext1=function(y)
       {
        lv2.contents={
         $:1,
         $0:y
        };
        return update(null);
       };
       arg101=function()
       {
       };
       o2=Observer.New(onNext1,arg101);
       d1=io1.Subscribe(o1);
       d2=io2.Subscribe(o2);
       return Disposable.New(function()
       {
        d1.Dispose();
        return d2.Dispose();
       });
      };
      return Observable.New(arg00);
     },
     Concat:function(io1,io2)
     {
      var arg00;
      arg00=function(o)
      {
       var innerDisp,arg001,arg10,arg003,outerDisp;
       innerDisp={
        contents:{
         $:0
        }
       };
       arg001=function(arg002)
       {
        return o.OnNext(arg002);
       };
       arg10=function()
       {
        innerDisp.contents={
         $:1,
         $0:io2.Subscribe(o)
        };
       };
       arg003=Observer.New(arg001,arg10);
       outerDisp=io1.Subscribe(arg003);
       return Disposable.New(function()
       {
        innerDisp.contents.$==1?innerDisp.contents.$0.Dispose():null;
        return outerDisp.Dispose();
       });
      };
      return Observable.New(arg00);
     },
     Default:Runtime.Field(function()
     {
      return Reactive2.New();
     }),
     Drop:function(io,count)
     {
      var arg00;
      arg00=function(o1)
      {
       var index;
       index={
        contents:0
       };
       return Util.subscribeTo(io,function(v)
       {
        Operators.Increment(index);
        return index.contents>count?o1.OnNext(v):null;
       });
      };
      return Observable.New(arg00);
     },
     Heat:function(io)
     {
      var s;
      s=HotStream.New1();
      Util.subscribeTo(io,function(arg00)
      {
       return s.Trigger(arg00);
      });
      return s;
     },
     Merge:function(io1,io2)
     {
      var arg00;
      arg00=function(o)
      {
       var completed1,completed2,arg001,arg10,arg003,disp1,arg004,arg101,arg005,disp2;
       completed1={
        contents:false
       };
       completed2={
        contents:false
       };
       arg001=function(arg002)
       {
        return o.OnNext(arg002);
       };
       arg10=function()
       {
        completed1.contents=true;
        return(completed1.contents?completed2.contents:false)?o.OnCompleted():null;
       };
       arg003=Observer.New(arg001,arg10);
       disp1=io1.Subscribe(arg003);
       arg004=function(arg002)
       {
        return o.OnNext(arg002);
       };
       arg101=function()
       {
        completed2.contents=true;
        return(completed1.contents?completed2.contents:false)?o.OnCompleted():null;
       };
       arg005=Observer.New(arg004,arg101);
       disp2=io2.Subscribe(arg005);
       return Disposable.New(function()
       {
        disp1.Dispose();
        return disp2.Dispose();
       });
      };
      return Observable.New(arg00);
     },
     Never:function()
     {
      return Observable.New(function()
      {
       return Disposable.New(function()
       {
       });
      });
     },
     Range:function(start,count)
     {
      var arg00;
      arg00=function(o)
      {
       var i;
       for(i=start;i<=start+count;i++){
        o.OnNext(i);
       }
       return Disposable.New(function()
       {
       });
      };
      return Observable.New(arg00);
     },
     Reactive:Runtime.Class({
      Aggregate:function(io,s,a)
      {
       return Reactive1.Aggregate(io,s,a);
      },
      Choose:function(io,f)
      {
       return Reactive1.Choose(io,f);
      },
      CollectLatest:function(io)
      {
       return Reactive1.CollectLatest(io);
      },
      CombineLatest:function(io1,io2,f)
      {
       return Reactive1.CombineLatest(io1,io2,f);
      },
      Concat:function(io1,io2)
      {
       return Reactive1.Concat(io1,io2);
      },
      Drop:function(io,count)
      {
       return Reactive1.Drop(io,count);
      },
      Heat:function(io)
      {
       return Reactive1.Heat(io);
      },
      Merge:function(io1,io2)
      {
       return Reactive1.Merge(io1,io2);
      },
      Never:function()
      {
       return Reactive1.Never();
      },
      Return:function(x)
      {
       return Reactive1.Return(x);
      },
      Select:function(io,f)
      {
       return Reactive1.Select(io,f);
      },
      SelectMany:function(io)
      {
       return Reactive1.SelectMany(io);
      },
      Sequence:function(ios)
      {
       return Reactive1.Sequence(ios);
      },
      Switch:function(io)
      {
       return Reactive1.Switch(io);
      },
      Where:function(io,f)
      {
       return Reactive1.Where(io,f);
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     Return:function(x)
     {
      var f;
      f=function(o)
      {
       o.OnNext(x);
       o.OnCompleted();
       return Disposable.New(function()
       {
       });
      };
      return Observable.New(f);
     },
     Select:function(io,f)
     {
      return Observable.New(function(o1)
      {
       return Util.subscribeTo(io,function(v)
       {
        return o1.OnNext(f(v));
       });
      });
     },
     SelectMany:function(io)
     {
      return Observable.New(function(o)
      {
       var disp,d;
       disp={
        contents:function()
        {
        }
       };
       d=Util.subscribeTo(io,function(o1)
       {
        var d1;
        d1=Util.subscribeTo(o1,function(arg00)
        {
         return o.OnNext(arg00);
        });
        disp.contents=function()
        {
         disp.contents.call(null,null);
         return d1.Dispose();
        };
        return;
       });
       return Disposable.New(function()
       {
        disp.contents.call(null,null);
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
         _=Reactive1.CombineLatest(x,rest,function(x1)
         {
          return function(y)
          {
           return Runtime.New(T,{
            $:1,
            $0:x1,
            $1:y
           });
          };
         });
        }
       else
        {
         _=Reactive1.Return(Runtime.New(T,{
          $:0
         }));
        }
       return _;
      };
      return Reactive1.Select(sequence(List.ofSeq(ios)),function(source)
      {
       return source;
      });
     },
     Switch:function(io)
     {
      return Observable.New(function(o)
      {
       var index,disp,disp1;
       index={
        contents:0
       };
       disp={
        contents:{
         $:0
        }
       };
       disp1=Util.subscribeTo(io,function(o1)
       {
        var currentIndex,arg0,d;
        Operators.Increment(index);
        disp.contents.$==1?disp.contents.$0.Dispose():null;
        currentIndex=index.contents;
        arg0=Util.subscribeTo(o1,function(v)
        {
         return currentIndex===index.contents?o.OnNext(v):null;
        });
        d={
         $:1,
         $0:arg0
        };
        disp.contents=d;
        return;
       });
       return disp1;
      });
     },
     Where:function(io,f)
     {
      var arg00;
      arg00=function(o1)
      {
       return Util.subscribeTo(io,function(v)
       {
        return f(v)?o1.OnNext(v):null;
       });
      };
      return Observable.New(arg00);
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Reactive=Runtime.Safe(Global.IntelliFactory.Reactive);
  Disposable=Runtime.Safe(Reactive.Disposable);
  HotStream=Runtime.Safe(Reactive.HotStream);
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Control=Runtime.Safe(WebSharper.Control);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  Observer=Runtime.Safe(Reactive.Observer);
  Observable=Runtime.Safe(Reactive.Observable);
  Util=Runtime.Safe(WebSharper.Util);
  Collections=Runtime.Safe(WebSharper.Collections);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Operators=Runtime.Safe(WebSharper.Operators);
  Seq=Runtime.Safe(WebSharper.Seq);
  Reactive1=Runtime.Safe(Reactive.Reactive);
  Reactive2=Runtime.Safe(Reactive1.Reactive);
  List=Runtime.Safe(WebSharper.List);
  return T=Runtime.Safe(List.T);
 });
 Runtime.OnLoad(function()
 {
  Reactive1.Default();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Formlets,Base,Formlet,Form,Tree,Edit,Result,WebSharper,List,T,LayoutUtils,Tree1,Util,Seq,Enumerator,Unchecked;
 Runtime.Define(Global,{
  IntelliFactory:{
   Formlets:{
    Base:{
     D:Runtime.Class({
      Dispose:function()
      {
       return null;
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     Form:Runtime.Class({
      Dispose:function()
      {
       return this.Dispose1.call(null,null);
      }
     }),
     Formlet:Runtime.Class({
      Build:function()
      {
       return this.Build1.call(null,null);
      },
      MapResult:function(f)
      {
       var _this=this;
       return Runtime.New(Formlet,{
        Layout:this.Layout,
        Build1:function()
        {
         var form,objectArg,arg00,arg10,state;
         form=_this.Build1.call(null,null);
         objectArg=_this.Utils.Reactive;
         arg00=form.State;
         arg10=function(x)
         {
          return f(x);
         };
         objectArg.Select(arg00,arg10);
         state=form.State;
         return Runtime.New(Form,{
          Body:form.Body,
          Dispose1:form.Dispose1,
          Notify:form.Notify,
          State:state
         });
        },
        Utils:_this.Utils
       });
      },
      get_Layout:function()
      {
       return this.Layout;
      }
     }),
     FormletBuilder:Runtime.Class({
      Bind:function(x,f)
      {
       var objectArg;
       objectArg=this.F;
       return objectArg.Bind(x,f);
      },
      Delay:function(f)
      {
       return this.F.Delay(f);
      },
      Return:function(x)
      {
       return this.F.Return(x);
      },
      ReturnFrom:function(f)
      {
       return f;
      }
     },{
      New:function(F)
      {
       var r;
       r=Runtime.New(this,{});
       r.F=F;
       return r;
      }
     }),
     FormletProvider:Runtime.Class({
      AppendLayout:function(layout,formlet)
      {
       var arg10;
       arg10=this.ApplyLayout(formlet);
       return this.WithLayout(layout,arg10);
      },
      Apply:function(f,x)
      {
       var arg00,_this=this;
       arg00=function()
       {
        var f1,x1,objectArg,arg001,arg10,left,objectArg1,arg002,arg101,right,objectArg2,body,objectArg3,arg003,arg102,arg20,state;
        f1=_this.BuildForm(f);
        x1=_this.BuildForm(x);
        objectArg=_this.U.Reactive;
        arg001=f1.Body;
        arg10=function(arg0)
        {
         return Runtime.New(Edit,{
          $:1,
          $0:arg0
         });
        };
        left=objectArg.Select(arg001,arg10);
        objectArg1=_this.U.Reactive;
        arg002=x1.Body;
        arg101=function(arg0)
        {
         return Runtime.New(Edit,{
          $:2,
          $0:arg0
         });
        };
        right=objectArg1.Select(arg002,arg101);
        objectArg2=_this.U.Reactive;
        body=objectArg2.Merge(left,right);
        objectArg3=_this.U.Reactive;
        arg003=x1.State;
        arg102=f1.State;
        arg20=function(r)
        {
         return function(f2)
         {
          return Result.Apply(f2,r);
         };
        };
        state=objectArg3.CombineLatest(arg003,arg102,arg20);
        return Runtime.New(Form,{
         Body:body,
         Dispose1:function()
         {
          x1.Dispose1.call(null,null);
          return f1.Dispose1.call(null,null);
         },
         Notify:function(o)
         {
          x1.Notify.call(null,o);
          return f1.Notify.call(null,o);
         },
         State:state
        });
       };
       return _this.New(arg00);
      },
      ApplyLayout:function(formlet)
      {
       var arg00,_this=this;
       arg00=function()
       {
        var form,matchValue,body,_,body1;
        form=formlet.Build();
        matchValue=formlet.get_Layout().Apply.call(null,form.Body);
        if(matchValue.$==0)
         {
          _=form.Body;
         }
        else
         {
          matchValue.$0[1];
          body1=matchValue.$0[0];
          _=_this.U.Reactive.Return(Tree.Set(body1));
         }
        body=_;
        return Runtime.New(Form,{
         Body:body,
         Dispose1:form.Dispose1,
         Notify:form.Notify,
         State:form.State
        });
       };
       return _this.New(arg00);
      },
      Bind:function(formlet,f)
      {
       var arg00;
       arg00=this.Map(f,formlet);
       return this.Join(arg00);
      },
      BindWith:function(hF,formlet,f)
      {
       var arg00,_this=this;
       arg00=function()
       {
        var formlet1,form,objectArg,arg001,arg10,left,objectArg1,arg002,arg101,right,matchValue,combB,_,_1,bLeft,bRight,objectArg2,value,arg003;
        formlet1=_this.Bind(formlet,f);
        form=formlet1.Build();
        objectArg=_this.U.Reactive;
        arg001=form.Body;
        arg10=function(edit)
        {
         return edit.$==1?true:false;
        };
        left=_this.U.DefaultLayout.Apply.call(null,objectArg.Where(arg001,arg10));
        objectArg1=_this.U.Reactive;
        arg002=form.Body;
        arg101=function(edit)
        {
         return edit.$==2?true:false;
        };
        right=_this.U.DefaultLayout.Apply.call(null,objectArg1.Where(arg002,arg101));
        matchValue=[left,right];
        if(matchValue[0].$==1)
         {
          if(matchValue[1].$==1)
           {
            bLeft=matchValue[0].$0[0];
            bRight=matchValue[1].$0[0];
            objectArg2=_this.U.Reactive;
            value=(hF(bLeft))(bRight);
            arg003=Tree.Set(value);
            _1=objectArg2.Return(arg003);
           }
          else
           {
            _1=_this.U.Reactive.Never();
           }
          _=_1;
         }
        else
         {
          _=_this.U.Reactive.Never();
         }
        combB=_;
        return Runtime.New(Form,{
         Body:combB,
         Dispose1:form.Dispose1,
         Notify:form.Notify,
         State:form.State
        });
       };
       return _this.New(arg00);
      },
      BuildForm:function(formlet)
      {
       var form,matchValue,_,d,body;
       form=formlet.Build();
       matchValue=formlet.get_Layout().Apply.call(null,form.Body);
       if(matchValue.$==1)
        {
         d=matchValue.$0[1];
         body=matchValue.$0[0];
         _=Runtime.New(Form,{
          Body:this.U.Reactive.Return(Tree.Set(body)),
          Dispose1:function()
          {
           form.Dispose1.call(null,null);
           return d.Dispose();
          },
          Notify:form.Notify,
          State:form.State
         });
        }
       else
        {
         _=form;
        }
       return _;
      },
      Delay:function(f)
      {
       var Build,_this=this;
       Build=function()
       {
        return _this.BuildForm(f(null));
       };
       return Runtime.New(Formlet,{
        Layout:_this.L.Delay(function()
        {
         return f(null).get_Layout();
        }),
        Build1:Build,
        Utils:_this.U
       });
      },
      Deletable:function(formlet)
      {
       var arg10,_this=this;
       arg10=function(value)
       {
        var _,value1;
        if(value.$==1)
         {
          value1=value.$0;
          _=_this.Return({
           $:1,
           $0:value1
          });
         }
        else
         {
          _=_this.ReturnEmpty({
           $:0
          });
         }
        return _;
       };
       return _this.Replace(formlet,arg10);
      },
      Empty:function()
      {
       var arg00,_this=this;
       arg00=function()
       {
        return Runtime.New(Form,{
         Body:_this.U.Reactive.Return(Tree.Delete()),
         Dispose1:function()
         {
         },
         Notify:function()
         {
         },
         State:_this.U.Reactive.Never()
        });
       };
       return _this.New(arg00);
      },
      EmptyForm:function()
      {
       return Runtime.New(Form,{
        Body:this.U.Reactive.Never(),
        Dispose1:function()
        {
        },
        Notify:function()
        {
        },
        State:this.U.Reactive.Never()
       });
      },
      Fail:function(fs)
      {
       return Runtime.New(Form,{
        Body:this.U.Reactive.Never(),
        Dispose1:function(x)
        {
         return x;
        },
        Notify:function()
        {
        },
        State:this.U.Reactive.Return(Runtime.New(Result,{
         $:1,
         $0:fs
        }))
       });
      },
      FailWith:function(fs)
      {
       var arg00,_this=this;
       arg00=function()
       {
        return _this.Fail(fs);
       };
       return _this.New(arg00);
      },
      FlipBody:function(formlet)
      {
       var arg00,_this=this,x,arg002;
       arg00=function()
       {
        var form,objectArg,arg001,arg10,body;
        form=formlet.Build();
        objectArg=_this.U.Reactive;
        arg001=form.Body;
        arg10=function(edit)
        {
         return Tree.FlipEdit(edit);
        };
        body=objectArg.Select(arg001,arg10);
        return Runtime.New(Form,{
         Body:body,
         Dispose1:form.Dispose1,
         Notify:form.Notify,
         State:form.State
        });
       };
       x=_this.New(arg00);
       arg002=formlet.get_Layout();
       return _this.WithLayout(arg002,x);
      },
      FromState:function(state)
      {
       var arg00,_this=this;
       arg00=function()
       {
        return Runtime.New(Form,{
         Body:_this.U.Reactive.Never(),
         Dispose1:function()
         {
         },
         Notify:function()
         {
         },
         State:state
        });
       };
       return _this.New(arg00);
      },
      InitWith:function(value,formlet)
      {
       var arg00,_this=this,x,arg002;
       arg00=function()
       {
        var form,objectArg,arg001,arg10,state;
        form=formlet.Build();
        objectArg=_this.U.Reactive;
        arg001=_this.U.Reactive.Return(Runtime.New(Result,{
         $:0,
         $0:value
        }));
        arg10=form.State;
        state=objectArg.Concat(arg001,arg10);
        return Runtime.New(Form,{
         Body:form.Body,
         Dispose1:form.Dispose1,
         Notify:form.Notify,
         State:state
        });
       };
       x=_this.New(arg00);
       arg002=formlet.get_Layout();
       return _this.WithLayout(arg002,x);
      },
      InitWithFailure:function(formlet)
      {
       var arg00,_this=this,x,arg002;
       arg00=function()
       {
        var form,objectArg,arg001,arg10,state;
        form=formlet.Build();
        objectArg=_this.U.Reactive;
        arg001=_this.U.Reactive.Return(Runtime.New(Result,{
         $:1,
         $0:Runtime.New(T,{
          $:0
         })
        }));
        arg10=form.State;
        state=objectArg.Concat(arg001,arg10);
        return Runtime.New(Form,{
         Body:form.Body,
         Dispose1:form.Dispose1,
         Notify:form.Notify,
         State:state
        });
       };
       x=_this.New(arg00);
       arg002=formlet.get_Layout();
       return _this.WithLayout(arg002,x);
      },
      Join:function(formlet)
      {
       var arg00,_this=this;
       arg00=function()
       {
        var form1,objectArg,arg001,arg10,objectArg1,arg002,formStream,objectArg2,arg101,value,objectArg4,arg003,arg103,right,objectArg5,objectArg6,arg004,arg104,arg005,body,state,objectArg7,arg105,notify,dispose;
        form1=_this.BuildForm(formlet);
        objectArg=_this.U.Reactive;
        arg001=form1.State;
        arg10=function(res)
        {
         var _,fs,innerF;
         if(res.$==1)
          {
           fs=res.$0;
           _=_this.Fail(fs);
          }
         else
          {
           innerF=res.$0;
           _=_this.BuildForm(innerF);
          }
         return _;
        };
        objectArg1=_this.U.Reactive;
        arg002=objectArg.Select(arg001,arg10);
        formStream=objectArg1.Heat(arg002);
        objectArg2=_this.U.Reactive;
        arg101=function(f)
        {
         var _delete,objectArg3,arg102;
         _delete=_this.U.Reactive.Return(Tree.Delete());
         objectArg3=_this.U.Reactive;
         arg102=f.Body;
         return objectArg3.Concat(_delete,arg102);
        };
        value=objectArg2.Select(formStream,arg101);
        objectArg4=_this.U.Reactive;
        arg003=_this.U.Reactive.Switch(value);
        arg103=function(arg0)
        {
         return Runtime.New(Edit,{
          $:2,
          $0:arg0
         });
        };
        right=objectArg4.Select(arg003,arg103);
        objectArg5=_this.U.Reactive;
        objectArg6=_this.U.Reactive;
        arg004=form1.Body;
        arg104=function(arg0)
        {
         return Runtime.New(Edit,{
          $:1,
          $0:arg0
         });
        };
        arg005=objectArg6.Select(arg004,arg104);
        body=objectArg5.Merge(arg005,right);
        objectArg7=_this.U.Reactive;
        arg105=function(f)
        {
         return f.State;
        };
        state=_this.U.Reactive.Switch(objectArg7.Select(formStream,arg105));
        notify=function(o)
        {
         return form1.Notify.call(null,o);
        };
        dispose=function()
        {
         return form1.Dispose1.call(null,null);
        };
        return Runtime.New(Form,{
         Body:body,
         Dispose1:dispose,
         Notify:notify,
         State:state
        });
       };
       return _this.New(arg00);
      },
      LiftResult:function(formlet)
      {
       var arg00;
       arg00=function(arg0)
       {
        return Runtime.New(Result,{
         $:0,
         $0:arg0
        });
       };
       return this.MapResult(arg00,formlet);
      },
      Map:function(f,formlet)
      {
       var arg00;
       arg00=function(arg10)
       {
        return Result.Map(f,arg10);
       };
       return this.MapResult(arg00,formlet);
      },
      MapBody:function(f,formlet)
      {
       var layout,_this=this;
       layout={
        Apply:function(o)
        {
         var matchValue,_,matchValue1,_1,d,body,d1,body1;
         matchValue=formlet.get_Layout().Apply.call(null,o);
         if(matchValue.$==0)
          {
           matchValue1=_this.U.DefaultLayout.Apply.call(null,o);
           if(matchValue1.$==0)
            {
             _1={
              $:0
             };
            }
           else
            {
             d=matchValue1.$0[1];
             body=matchValue1.$0[0];
             _1={
              $:1,
              $0:[f(body),d]
             };
            }
           _=_1;
          }
         else
          {
           d1=matchValue.$0[1];
           body1=matchValue.$0[0];
           _={
            $:1,
            $0:[f(body1),d1]
           };
          }
         return _;
        }
       };
       return _this.WithLayout(layout,formlet);
      },
      MapResult:function(f,formlet)
      {
       var Build,_this=this;
       Build=function()
       {
        var form,objectArg,arg00,arg10,state;
        form=formlet.Build();
        objectArg=_this.U.Reactive;
        arg00=form.State;
        arg10=function(x)
        {
         return f(x);
        };
        state=objectArg.Select(arg00,arg10);
        return Runtime.New(Form,{
         Body:form.Body,
         Dispose1:form.Dispose1,
         Notify:form.Notify,
         State:state
        });
       };
       return Runtime.New(Formlet,{
        Layout:formlet.get_Layout(),
        Build1:Build,
        Utils:_this.U
       });
      },
      Never:function()
      {
       var arg00,_this=this;
       arg00=function()
       {
        return Runtime.New(Form,{
         Body:_this.U.Reactive.Never(),
         Dispose1:function()
         {
         },
         Notify:function()
         {
         },
         State:_this.U.Reactive.Never()
        });
       };
       return _this.New(arg00);
      },
      New:function(build)
      {
       return Runtime.New(Formlet,{
        Layout:this.L.Default(),
        Build1:build,
        Utils:this.U
       });
      },
      Replace:function(formlet,f)
      {
       var arg00,arg001;
       arg00=function(value)
       {
        return f(value);
       };
       arg001=this.Map(arg00,formlet);
       return this.Switch(arg001);
      },
      ReplaceFirstWithFailure:function(formlet)
      {
       var arg00,_this=this,x,arg003;
       arg00=function()
       {
        var form,objectArg,arg001,state,objectArg1,arg002,state1;
        form=formlet.Build();
        objectArg=_this.U.Reactive;
        arg001=form.State;
        state=objectArg.Drop(arg001,1);
        objectArg1=_this.U.Reactive;
        arg002=_this.U.Reactive.Return(Runtime.New(Result,{
         $:1,
         $0:Runtime.New(T,{
          $:0
         })
        }));
        state1=objectArg1.Concat(arg002,state);
        return Runtime.New(Form,{
         Body:form.Body,
         Dispose1:form.Dispose1,
         Notify:form.Notify,
         State:state1
        });
       };
       x=_this.New(arg00);
       arg003=formlet.get_Layout();
       return _this.WithLayout(arg003,x);
      },
      Return:function(x)
      {
       var arg00,_this=this;
       arg00=function()
       {
        return Runtime.New(Form,{
         Body:_this.U.Reactive.Never(),
         Dispose1:function(x1)
         {
          return x1;
         },
         Notify:function()
         {
         },
         State:_this.U.Reactive.Return(Runtime.New(Result,{
          $:0,
          $0:x
         }))
        });
       };
       return _this.New(arg00);
      },
      ReturnEmpty:function(x)
      {
       var arg00,_this=this;
       arg00=function()
       {
        return Runtime.New(Form,{
         Body:_this.U.Reactive.Return(Tree.Delete()),
         Dispose1:function(x1)
         {
          return x1;
         },
         Notify:function()
         {
         },
         State:_this.U.Reactive.Return(Runtime.New(Result,{
          $:0,
          $0:x
         }))
        });
       };
       return _this.New(arg00);
      },
      SelectMany:function(formlet)
      {
       var arg00,_this=this;
       arg00=function()
       {
        var form1,objectArg,arg001,arg10,objectArg1,arg002,formStream,objectArg2,arg003,arg101,left,tag,incrTag,objectArg3,arg102,allBodies,right,objectArg5,body,objectArg6,arg103,stateStream,objectArg7,arg005,arg104,state,notify,dispose;
        form1=_this.BuildForm(formlet);
        objectArg=_this.U.Reactive;
        arg001=form1.State;
        arg10=function(res)
        {
         var _,innerF,arg0;
         if(res.$==1)
          {
           res.$0;
           _={
            $:0
           };
          }
         else
          {
           innerF=res.$0;
           arg0=_this.BuildForm(innerF);
           _={
            $:1,
            $0:arg0
           };
          }
         return _;
        };
        objectArg1=_this.U.Reactive;
        arg002=objectArg.Choose(arg001,arg10);
        formStream=objectArg1.Heat(arg002);
        objectArg2=_this.U.Reactive;
        arg003=form1.Body;
        arg101=function(arg0)
        {
         return Runtime.New(Edit,{
          $:1,
          $0:arg0
         });
        };
        left=objectArg2.Select(arg003,arg101);
        tag={
         contents:function(arg0)
         {
          return Runtime.New(Edit,{
           $:1,
           $0:arg0
          });
         }
        };
        incrTag=function()
        {
         var f;
         f=tag.contents;
         tag.contents=function(x)
         {
          var arg0;
          arg0=f(x);
          return Runtime.New(Edit,{
           $:2,
           $0:arg0
          });
         };
         return;
        };
        objectArg3=_this.U.Reactive;
        arg102=function(f)
        {
         var tagLocal,objectArg4,arg004;
         incrTag(null);
         tagLocal=tag.contents;
         objectArg4=_this.U.Reactive;
         arg004=f.Body;
         return objectArg4.Select(arg004,tagLocal);
        };
        allBodies=objectArg3.Select(formStream,arg102);
        right=_this.U.Reactive.SelectMany(allBodies);
        objectArg5=_this.U.Reactive;
        body=objectArg5.Merge(left,right);
        objectArg6=_this.U.Reactive;
        arg103=function(f)
        {
         return f.State;
        };
        stateStream=objectArg6.Select(formStream,arg103);
        objectArg7=_this.U.Reactive;
        arg005=_this.U.Reactive.CollectLatest(stateStream);
        arg104=function(arg004)
        {
         return Result.Sequence(arg004);
        };
        state=objectArg7.Select(arg005,arg104);
        notify=function(o)
        {
         return form1.Notify.call(null,o);
        };
        dispose=function()
        {
         return form1.Dispose1.call(null,null);
        };
        return Runtime.New(Form,{
         Body:body,
         Dispose1:dispose,
         Notify:notify,
         State:state
        });
       };
       return _this.New(arg00);
      },
      Sequence:function(fs)
      {
       var fs1,_,fs2,f,fComp,fRest,arg00;
       fs1=List.ofSeq(fs);
       if(fs1.$==1)
        {
         fs2=fs1.$1;
         f=fs1.$0;
         fComp=this.Return(function(v)
         {
          return function(vs)
          {
           return Runtime.New(T,{
            $:1,
            $0:v,
            $1:vs
           });
          };
         });
         fRest=this.Sequence(fs2);
         arg00=this.Apply(fComp,f);
         _=this.Apply(arg00,fRest);
        }
       else
        {
         _=this.Return(Runtime.New(T,{
          $:0
         }));
        }
       return _;
      },
      Switch:function(formlet)
      {
       var arg00,_this=this;
       arg00=function()
       {
        var arg001,formlet1,form1,objectArg,arg002,arg10,objectArg1,arg003,formStream,objectArg2,arg004,arg101,objectArg3,arg102,body,state,objectArg4,arg103,notify,dispose;
        arg001=_this.WithLayoutOrDefault(formlet);
        formlet1=_this.ApplyLayout(arg001);
        form1=_this.BuildForm(formlet1);
        objectArg=_this.U.Reactive;
        arg002=form1.State;
        arg10=function(res)
        {
         var _,innerF,arg0;
         if(res.$==1)
          {
           res.$0;
           _={
            $:0
           };
          }
         else
          {
           innerF=res.$0;
           arg0=_this.BuildForm(innerF);
           _={
            $:1,
            $0:arg0
           };
          }
         return _;
        };
        objectArg1=_this.U.Reactive;
        arg003=objectArg.Choose(arg002,arg10);
        formStream=objectArg1.Heat(arg003);
        objectArg2=_this.U.Reactive;
        arg004=form1.Body;
        objectArg3=_this.U.Reactive;
        arg102=function(f)
        {
         return f.Body;
        };
        arg101=_this.U.Reactive.Switch(objectArg3.Select(formStream,arg102));
        body=objectArg2.Concat(arg004,arg101);
        objectArg4=_this.U.Reactive;
        arg103=function(f)
        {
         return f.State;
        };
        state=_this.U.Reactive.Switch(objectArg4.Select(formStream,arg103));
        notify=function(o)
        {
         return form1.Notify.call(null,o);
        };
        dispose=function()
        {
         return form1.Dispose1.call(null,null);
        };
        return Runtime.New(Form,{
         Body:body,
         Dispose1:dispose,
         Notify:notify,
         State:state
        });
       };
       return _this.New(arg00);
      },
      WithCancelation:function(formlet,cancelFormlet)
      {
       var compose,f1,f2,f3,f,arg00,arg10;
       compose=function(r1)
       {
        return function(r2)
        {
         var matchValue,_,_1,fs,s;
         matchValue=[r1,r2];
         if(matchValue[1].$==0)
          {
           _=Runtime.New(Result,{
            $:0,
            $0:{
             $:0
            }
           });
          }
         else
          {
           if(matchValue[0].$==1)
            {
             fs=matchValue[0].$0;
             _1=Runtime.New(Result,{
              $:1,
              $0:fs
             });
            }
           else
            {
             s=matchValue[0].$0;
             _1=Runtime.New(Result,{
              $:0,
              $0:{
               $:1,
               $0:s
              }
             });
            }
           _=_1;
          }
         return _;
        };
       };
       f1=this.Return(compose);
       f2=this.LiftResult(formlet);
       f3=this.LiftResult(cancelFormlet);
       f=this.Apply(f1,f2);
       arg00=function(arg001)
       {
        return Result.Join(arg001);
       };
       arg10=this.Apply(f,f3);
       return this.MapResult(arg00,arg10);
      },
      WithLayout:function(layout,formlet)
      {
       return Runtime.New(Formlet,{
        Layout:layout,
        Build1:function()
        {
         return formlet.Build();
        },
        Utils:this.U
       });
      },
      WithLayoutOrDefault:function(formlet)
      {
       var arg00;
       arg00=function(x)
       {
        return x;
       };
       return this.MapBody(arg00,formlet);
      },
      WithNotification:function(notify,formlet)
      {
       var arg00,_this=this,x,arg001;
       arg00=function()
       {
        var form,Notify;
        form=_this.BuildForm(formlet);
        Notify=function(obj)
        {
         form.Notify.call(null,obj);
         return notify(obj);
        };
        return Runtime.New(Form,{
         Body:form.Body,
         Dispose1:form.Dispose1,
         Notify:Notify,
         State:form.State
        });
       };
       x=_this.New(arg00);
       arg001=formlet.get_Layout();
       return _this.WithLayout(arg001,x);
      },
      WithNotificationChannel:function(formlet)
      {
       var arg00,_this=this,x,arg003;
       arg00=function()
       {
        var form,objectArg,arg001,arg002,arg10,state,Notify;
        form=formlet.Build();
        objectArg=_this.U.Reactive;
        arg001=form.State;
        arg002=function(v)
        {
         return[v,form.Notify];
        };
        arg10=function(arg101)
        {
         return Result.Map(arg002,arg101);
        };
        state=objectArg.Select(arg001,arg10);
        Notify=form.Notify;
        return Runtime.New(Form,{
         Body:form.Body,
         Dispose1:form.Dispose1,
         Notify:Notify,
         State:state
        });
       };
       x=_this.New(arg00);
       arg003=formlet.get_Layout();
       return _this.WithLayout(arg003,x);
      }
     },{
      New:function(U)
      {
       var r;
       r=Runtime.New(this,{});
       r.U=U;
       r.L=LayoutUtils.New({
        Reactive:r.U.Reactive
       });
       return r;
      }
     }),
     LayoutUtils:Runtime.Class({
      Default:function()
      {
       return{
        Apply:function()
        {
         return{
          $:0
         };
        }
       };
      },
      Delay:function(f)
      {
       return{
        Apply:function(x)
        {
         return f(null).Apply.call(null,x);
        }
       };
      },
      New:function(container)
      {
       return{
        Apply:function(event)
        {
         var panel,tree,disp;
         panel=container(null);
         tree={
          contents:Runtime.New(Tree1,{
           $:0
          })
         };
         disp=Util.subscribeTo(event,function(edit)
         {
          var deletedTree,patternInput,off,action;
          deletedTree=Tree.ReplacedTree(edit,tree.contents);
          tree.contents=Tree.Apply(edit,tree.contents);
          patternInput=Tree.Range(edit,tree.contents);
          off=patternInput[0];
          panel.Remove.call(null,deletedTree.get_Sequence());
          action=function(i)
          {
           return function(e)
           {
            return(panel.Insert.call(null,off+i))(e);
           };
          };
          return Seq.iteri(action,edit);
         });
         return{
          $:1,
          $0:[panel.Body,disp]
         };
        }
       };
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     Result:Runtime.Class({},{
      Apply:function(f,r)
      {
       var matchValue,_,_1,fs1,fs2,fs,_2,fs3,f1,v;
       matchValue=[f,r];
       if(matchValue[0].$==1)
        {
         if(matchValue[1].$==1)
          {
           fs1=matchValue[0].$0;
           fs2=matchValue[1].$0;
           _1=Runtime.New(Result,{
            $:1,
            $0:List.append(fs1,fs2)
           });
          }
         else
          {
           fs=matchValue[0].$0;
           _1=Runtime.New(Result,{
            $:1,
            $0:fs
           });
          }
         _=_1;
        }
       else
        {
         if(matchValue[1].$==1)
          {
           matchValue[0].$0;
           fs3=matchValue[1].$0;
           _2=Runtime.New(Result,{
            $:1,
            $0:fs3
           });
          }
         else
          {
           f1=matchValue[0].$0;
           v=matchValue[1].$0;
           _2=Runtime.New(Result,{
            $:0,
            $0:f1(v)
           });
          }
         _=_2;
        }
       return _;
      },
      Join:function(res)
      {
       var _,fs,s;
       if(res.$==1)
        {
         fs=res.$0;
         _=Runtime.New(Result,{
          $:1,
          $0:fs
         });
        }
       else
        {
         s=res.$0;
         _=s;
        }
       return _;
      },
      Map:function(f,res)
      {
       var _,fs,v;
       if(res.$==1)
        {
         fs=res.$0;
         _=Runtime.New(Result,{
          $:1,
          $0:fs
         });
        }
       else
        {
         v=res.$0;
         _=Runtime.New(Result,{
          $:0,
          $0:f(v)
         });
        }
       return _;
      },
      OfOption:function(o)
      {
       var _,v;
       if(o.$==0)
        {
         _=Runtime.New(Result,{
          $:1,
          $0:Runtime.New(T,{
           $:0
          })
         });
        }
       else
        {
         v=o.$0;
         _=Runtime.New(Result,{
          $:0,
          $0:v
         });
        }
       return _;
      },
      Sequence:function(rs)
      {
       var merge;
       merge=function(rs1)
       {
        return function(r)
        {
         var _,fs1,_1,fs2,vs,_2,fs,v,b;
         if(rs1.$==1)
          {
           fs1=rs1.$0;
           if(r.$==1)
            {
             fs2=r.$0;
             _1=Runtime.New(Result,{
              $:1,
              $0:List.append(fs1,fs2)
             });
            }
           else
            {
             r.$0;
             _1=Runtime.New(Result,{
              $:1,
              $0:fs1
             });
            }
           _=_1;
          }
         else
          {
           vs=rs1.$0;
           if(r.$==1)
            {
             fs=r.$0;
             _2=Runtime.New(Result,{
              $:1,
              $0:fs
             });
            }
           else
            {
             v=r.$0;
             b=List.ofArray([v]);
             _2=Runtime.New(Result,{
              $:0,
              $0:List.append(vs,b)
             });
            }
           _=_2;
          }
         return _;
        };
       };
       return Seq.fold(merge,Runtime.New(Result,{
        $:0,
        $0:Runtime.New(T,{
         $:0
        })
       }),rs);
      }
     }),
     Tree:{
      Apply:function(edit,input)
      {
       var apply;
       apply=function(edit1,input1)
       {
        var _,edit2,_1,r,l,edit3,_2,r1,l1,output;
        if(edit1.$==1)
         {
          edit2=edit1.$0;
          if(input1.$==2)
           {
            r=input1.$1;
            l=input1.$0;
            _1=Runtime.New(Tree1,{
             $:2,
             $0:apply(edit2,l),
             $1:r
            });
           }
          else
           {
            _1=apply(Runtime.New(Edit,{
             $:1,
             $0:edit2
            }),Runtime.New(Tree1,{
             $:2,
             $0:Runtime.New(Tree1,{
              $:0
             }),
             $1:input1
            }));
           }
          _=_1;
         }
        else
         {
          if(edit1.$==2)
           {
            edit3=edit1.$0;
            if(input1.$==2)
             {
              r1=input1.$1;
              l1=input1.$0;
              _2=Runtime.New(Tree1,{
               $:2,
               $0:l1,
               $1:apply(edit3,r1)
              });
             }
            else
             {
              _2=apply(Runtime.New(Edit,{
               $:2,
               $0:edit3
              }),Runtime.New(Tree1,{
               $:2,
               $0:input1,
               $1:Runtime.New(Tree1,{
                $:0
               })
              }));
             }
            _=_2;
           }
          else
           {
            output=edit1.$0;
            _=output;
           }
         }
        return _;
       };
       return apply(edit,input);
      },
      Count:function(t)
      {
       var loop,_,_1,b,a,_2,_3,tree,k,_4,ts,t1,_5;
       loop=[];
       _=Runtime.New(T,{
        $:0
       });
       loop[3]=t;
       loop[2]=_;
       loop[1]=0;
       loop[0]=1;
       while(loop[0])
        {
         if(loop[3].$==2)
          {
           b=loop[3].$1;
           a=loop[3].$0;
           _2=Runtime.New(T,{
            $:1,
            $0:b,
            $1:loop[2]
           });
           _3=loop[1];
           loop[3]=a;
           loop[2]=_2;
           loop[1]=_3;
           _1=void(loop[0]=1);
          }
         else
          {
           tree=loop[3];
           k=tree.$==0?0:1;
           if(loop[2].$==1)
            {
             ts=loop[2].$1;
             t1=loop[2].$0;
             _5=loop[1]+k;
             loop[3]=t1;
             loop[2]=ts;
             loop[1]=_5;
             _4=void(loop[0]=1);
            }
           else
            {
             loop[0]=0;
             _4=void(loop[1]=loop[1]+k);
            }
           _1=_4;
          }
        }
       return loop[1];
      },
      DeepFlipEdit:function(edit)
      {
       var _,e,e1,t;
       if(edit.$==1)
        {
         e=edit.$0;
         _=Runtime.New(Edit,{
          $:2,
          $0:Tree.DeepFlipEdit(e)
         });
        }
       else
        {
         if(edit.$==2)
          {
           e1=edit.$0;
           _=Runtime.New(Edit,{
            $:1,
            $0:Tree.DeepFlipEdit(e1)
           });
          }
         else
          {
           t=edit.$0;
           _=Runtime.New(Edit,{
            $:0,
            $0:t
           });
          }
        }
       return _;
      },
      Delete:function()
      {
       return Runtime.New(Edit,{
        $:0,
        $0:Runtime.New(Tree1,{
         $:0
        })
       });
      },
      Edit:Runtime.Class({
       GetEnumerator:function()
       {
        var _this;
        _this=this.get_Sequence();
        return Enumerator.Get(_this);
       },
       GetEnumerator1:function()
       {
        var _this;
        _this=this.get_Sequence();
        return Enumerator.Get(_this);
       },
       get_Sequence:function()
       {
        var _,edit,edit1,tree;
        if(this.$==1)
         {
          edit=this.$0;
          _=edit.get_Sequence();
         }
        else
         {
          if(this.$==2)
           {
            edit1=this.$0;
            _=edit1.get_Sequence();
           }
          else
           {
            tree=this.$0;
            _=tree.get_Sequence();
           }
         }
        return _;
       }
      }),
      FlipEdit:function(edit)
      {
       var _,e,e1,t;
       if(edit.$==1)
        {
         e=edit.$0;
         _=Runtime.New(Edit,{
          $:2,
          $0:e
         });
        }
       else
        {
         if(edit.$==2)
          {
           e1=edit.$0;
           _=Runtime.New(Edit,{
            $:1,
            $0:e1
           });
          }
         else
          {
           t=edit.$0;
           _=Runtime.New(Edit,{
            $:0,
            $0:t
           });
          }
        }
       return _;
      },
      FromSequence:function(vs)
      {
       var folder,state1;
       folder=function(state)
       {
        return function(v)
        {
         return Runtime.New(Tree1,{
          $:2,
          $0:state,
          $1:Runtime.New(Tree1,{
           $:1,
           $0:v
          })
         });
        };
       };
       state1=Runtime.New(Tree1,{
        $:0
       });
       return Seq.fold(folder,state1,vs);
      },
      Range:function(edit,input)
      {
       var loop,_,edit1,_1,l,_2,_3,edit2,_4,r,l1,tree,_5,_6;
       loop=[];
       loop[3]=0;
       loop[2]=input;
       loop[1]=edit;
       loop[0]=1;
       while(loop[0])
        {
         if(loop[1].$==1)
          {
           edit1=loop[1].$0;
           if(loop[2].$==2)
            {
             loop[2].$1;
             l=loop[2].$0;
             loop[3]=loop[3];
             loop[2]=l;
             loop[1]=edit1;
             _1=void(loop[0]=1);
            }
           else
            {
             _2=loop[3];
             _3=Runtime.New(Tree1,{
              $:0
             });
             loop[3]=_2;
             loop[2]=_3;
             loop[1]=edit1;
             _1=void(loop[0]=1);
            }
           _=_1;
          }
         else
          {
           if(loop[1].$==2)
            {
             edit2=loop[1].$0;
             if(loop[2].$==2)
              {
               r=loop[2].$1;
               l1=loop[2].$0;
               loop[3]=loop[3]+Tree.Count(l1);
               loop[2]=r;
               loop[1]=edit2;
               _4=void(loop[0]=1);
              }
             else
              {
               tree=loop[2];
               _5=loop[3]+Tree.Count(tree);
               _6=Runtime.New(Tree1,{
                $:0
               });
               loop[3]=_5;
               loop[2]=_6;
               loop[1]=edit2;
               _4=void(loop[0]=1);
              }
             _=_4;
            }
           else
            {
             loop[1].$0;
             loop[0]=0;
             _=void(loop[1]=[loop[3],Tree.Count(loop[2])]);
            }
          }
        }
       return loop[1];
      },
      ReplacedTree:function(edit,input)
      {
       var _,edit1,_1,l,edit2,_2,r;
       if(edit.$==1)
        {
         edit1=edit.$0;
         if(input.$==2)
          {
           input.$1;
           l=input.$0;
           _1=Tree.ReplacedTree(edit1,l);
          }
         else
          {
           _1=Tree.ReplacedTree(Runtime.New(Edit,{
            $:1,
            $0:edit1
           }),Runtime.New(Tree1,{
            $:2,
            $0:Runtime.New(Tree1,{
             $:0
            }),
            $1:input
           }));
          }
         _=_1;
        }
       else
        {
         if(edit.$==2)
          {
           edit2=edit.$0;
           if(input.$==2)
            {
             r=input.$1;
             input.$0;
             _2=Tree.ReplacedTree(edit2,r);
            }
           else
            {
             _2=Tree.ReplacedTree(Runtime.New(Edit,{
              $:2,
              $0:edit2
             }),Runtime.New(Tree1,{
              $:2,
              $0:input,
              $1:Runtime.New(Tree1,{
               $:0
              })
             }));
            }
           _=_2;
          }
         else
          {
           edit.$0;
           _=input;
          }
        }
       return _;
      },
      Set:function(value)
      {
       return Runtime.New(Edit,{
        $:0,
        $0:Runtime.New(Tree1,{
         $:1,
         $0:value
        })
       });
      },
      ShowEdit:function(edit)
      {
       var showE;
       showE=function(edit1)
       {
        var _,l,r;
        if(edit1.$==1)
         {
          l=edit1.$0;
          _="Left > "+showE(l);
         }
        else
         {
          if(edit1.$==2)
           {
            r=edit1.$0;
            _="Right > "+showE(r);
           }
          else
           {
            _="Replace";
           }
         }
        return _;
       };
       return showE(edit);
      },
      Transform:function(f,edit)
      {
       var _,e,arg0,e1,arg01,t;
       if(edit.$==1)
        {
         e=edit.$0;
         arg0=Tree.Transform(f,e);
         _=Runtime.New(Edit,{
          $:1,
          $0:arg0
         });
        }
       else
        {
         if(edit.$==2)
          {
           e1=edit.$0;
           arg01=Tree.Transform(f,e1);
           _=Runtime.New(Edit,{
            $:2,
            $0:arg01
           });
          }
         else
          {
           t=edit.$0;
           _=Runtime.New(Edit,{
            $:0,
            $0:f(t)
           });
          }
        }
       return _;
      },
      Tree:Runtime.Class({
       GetEnumerator:function()
       {
        var _this;
        _this=this.get_Sequence();
        return Enumerator.Get(_this);
       },
       GetEnumerator1:function()
       {
        var _this;
        _this=this.get_Sequence();
        return Enumerator.Get(_this);
       },
       Map:function(f)
       {
        var _,t,right,left;
        if(this.$==1)
         {
          t=this.$0;
          _=Runtime.New(Tree1,{
           $:1,
           $0:f(t)
          });
         }
        else
         {
          if(this.$==2)
           {
            right=this.$1;
            left=this.$0;
            _=Runtime.New(Tree1,{
             $:2,
             $0:left.Map(f),
             $1:right.Map(f)
            });
           }
          else
           {
            _=Runtime.New(Tree1,{
             $:0
            });
           }
         }
        return _;
       },
       get_Sequence:function()
       {
        var _,x,y,x1;
        if(this.$==1)
         {
          x=this.$0;
          _=[x];
         }
        else
         {
          if(this.$==2)
           {
            y=this.$1;
            x1=this.$0;
            _=Seq.append(x1.get_Sequence(),y.get_Sequence());
           }
          else
           {
            _=Seq.empty();
           }
         }
        return _;
       }
      })
     },
     Validator:Runtime.Class({
      Is:function(f,m,flet)
      {
       return this.Validate(f,m,flet);
      },
      IsEmail:function(msg)
      {
       var _this=this;
       return function(arg20)
       {
        return _this.IsRegexMatch("^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$",msg,arg20);
       };
      },
      IsEqual:function(value,msg,flet)
      {
       var arg00;
       arg00=function(i)
       {
        return Unchecked.Equals(i,value);
       };
       return this.Validate(arg00,msg,flet);
      },
      IsFloat:function(msg)
      {
       var _this=this;
       return function(arg20)
       {
        return _this.IsRegexMatch("^\\s*(\\+|-)?((\\d+(\\.\\d+)?)|(\\.\\d+))\\s*$",msg,arg20);
       };
      },
      IsGreaterThan:function(min,msg,flet)
      {
       var arg00;
       arg00=function(i)
       {
        return Unchecked.Compare(i,min)===1;
       };
       return this.Validate(arg00,msg,flet);
      },
      IsInt:function(msg)
      {
       var _this=this;
       return function(arg20)
       {
        return _this.IsRegexMatch("^-?\\d+$",msg,arg20);
       };
      },
      IsLessThan:function(max,msg,flet)
      {
       var arg00;
       arg00=function(i)
       {
        return Unchecked.Compare(i,max)===-1;
       };
       return this.Validate(arg00,msg,flet);
      },
      IsNotEmpty:function(msg,flet)
      {
       var arg00;
       arg00=function(s)
       {
        return s!=="";
       };
       return this.Validate(arg00,msg,flet);
      },
      IsNotEqual:function(value,msg,flet)
      {
       var arg00;
       arg00=function(i)
       {
        return!Unchecked.Equals(i,value);
       };
       return this.Validate(arg00,msg,flet);
      },
      IsRegexMatch:function(regex,msg,flet)
      {
       var arg00,_this=this;
       arg00=function(x)
       {
        var objectArg;
        objectArg=_this.VP;
        return objectArg.Matches(regex,x);
       };
       return _this.Validate(arg00,msg,flet);
      },
      IsTrue:function(msg,flet)
      {
       var arg00;
       arg00=function(x)
       {
        return x;
       };
       return this.Validate(arg00,msg,flet);
      },
      Validate:function(f,msg,flet)
      {
       var value;
       value=flet.MapResult(function(res)
       {
        var _,fs,v;
        if(res.$==1)
         {
          fs=res.$0;
          _=Runtime.New(Result,{
           $:1,
           $0:fs
          });
         }
        else
         {
          v=res.$0;
          _=f(v)?Runtime.New(Result,{
           $:0,
           $0:v
          }):Runtime.New(Result,{
           $:1,
           $0:List.ofArray([msg])
          });
         }
        return _;
       });
       return value;
      }
     },{
      New:function(VP)
      {
       var r;
       r=Runtime.New(this,{});
       r.VP=VP;
       return r;
      }
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Formlets=Runtime.Safe(Global.IntelliFactory.Formlets);
  Base=Runtime.Safe(Formlets.Base);
  Formlet=Runtime.Safe(Base.Formlet);
  Form=Runtime.Safe(Base.Form);
  Tree=Runtime.Safe(Base.Tree);
  Edit=Runtime.Safe(Tree.Edit);
  Result=Runtime.Safe(Base.Result);
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  List=Runtime.Safe(WebSharper.List);
  T=Runtime.Safe(List.T);
  LayoutUtils=Runtime.Safe(Base.LayoutUtils);
  Tree1=Runtime.Safe(Tree.Tree);
  Util=Runtime.Safe(WebSharper.Util);
  Seq=Runtime.Safe(WebSharper.Seq);
  Enumerator=Runtime.Safe(WebSharper.Enumerator);
  return Unchecked=Runtime.Safe(WebSharper.Unchecked);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,Formlets,Body,Html,Client,Default,List,Controls,Reactive,HotStream,Formlets1,Base,Result,T,Operators,jQuery,EventsPervasives,Data,Formlet,Operators1,CssConstants,Math,Seq,Utils,Tree,Edit,Form,Arrays,IntrinsicFunctionProxy,FormletProvider,Formlet1,Pagelet,Util,LayoutProvider,LayoutUtils,Reactive1,Validator,ValidatorProvidor,RegExp,Collections,Dictionary,ElementStore,Enhance,FormButtonConfiguration,FormContainerConfiguration,Padding,ManyConfiguration,ValidationFrameConfiguration,ValidationIconConfiguration,JSON,FormletBuilder,Layout,FormRowConfiguration,LabelConfiguration,Padding1,Enumerator;
 Runtime.Define(Global,{
  IntelliFactory:{
   WebSharper:{
    Formlets:{
     Body:Runtime.Class({},{
      New:function(el,l)
      {
       return Runtime.New(Body,{
        Element:el,
        Label:l
       });
      }
     }),
     Controls:{
      Button:function(label)
      {
       var genElem;
       genElem=function()
       {
        return Default.Button(List.ofArray([Default.Text(label)]));
       };
       return Controls.ElementButton(genElem);
      },
      Checkbox:function(def)
      {
       return Controls.CheckboxControl(false,def);
      },
      CheckboxControl:function(readOnly,def)
      {
       var f;
       f=function()
       {
        var state,readOnlyAtts,_,_this,x,_this1,arg00,body,_2,objectArg,arg002,objectArg1,arg003,reset;
        state=HotStream.New(Runtime.New(Result,{
         $:0,
         $0:def
        }));
        if(readOnly)
         {
          _this=Default.Attr();
          _=List.ofArray([_this.NewAttr("disabled","disabled")]);
         }
        else
         {
          _=Runtime.New(T,{
           $:0
          });
         }
        readOnlyAtts=_;
        _this1=Default.Attr();
        x=Operators.add(Default.Input(List.ofArray([_this1.NewAttr("type","checkbox"),Default.Attr().Class("inputCheckbox")])),readOnlyAtts);
        arg00=function(cb)
        {
         return function()
         {
          var _1,arg0,arg001;
          if(!readOnly)
           {
            arg0=jQuery(cb.get_Body()).prop("checked");
            arg001=Runtime.New(Result,{
             $:0,
             $0:arg0
            });
            _1=state.Trigger(arg001);
           }
          else
           {
            _1=null;
           }
          return _1;
         };
        };
        EventsPervasives.Events().OnClick(arg00,x);
        body=x;
        if(def)
         {
          objectArg=body["HtmlProvider@33"];
          arg002=body.get_Body();
          _2=objectArg.SetAttribute(arg002,"defaultChecked","true");
         }
        else
         {
          objectArg1=body["HtmlProvider@33"];
          arg003=body.get_Body();
          _2=objectArg1.RemoveAttribute(arg003,"checked");
         }
        reset=function()
        {
         var _1,objectArg2,arg001,objectArg3,arg004,objectArg4,arg005;
         if(def)
          {
           objectArg2=body["HtmlProvider@33"];
           arg001=body.get_Body();
           _1=objectArg2.SetProperty(arg001,"checked",true);
          }
         else
          {
           objectArg3=body["HtmlProvider@33"];
           arg004=body.get_Body();
           objectArg3.RemoveAttribute(arg004,"checked");
           objectArg4=body["HtmlProvider@33"];
           arg005=body.get_Body();
           _1=objectArg4.SetProperty(arg005,"checked",false);
          }
         return state.Trigger(Runtime.New(Result,{
          $:0,
          $0:def
         }));
        };
        reset(null);
        return[body,reset,state];
       };
       return Data.MkFormlet(f);
      },
      CheckboxGroup:function(values)
      {
       return Controls.CheckboxGroupControl(false,values);
      },
      CheckboxGroupControl:function(readOnly,values)
      {
       var mapping,fs,x2,chooser,f1;
       mapping=Runtime.Tupled(function(tupledArg)
       {
        var l,v,b,x,arg0,label,f,formlet;
        l=tupledArg[0];
        v=tupledArg[1];
        b=tupledArg[2];
        x=Controls.CheckboxControl(readOnly,b);
        arg0=function()
        {
         var x1,_this;
         x1=List.ofArray([Default.Text(l)]);
         _this=Default.Tags();
         return _this.NewTag("label",x1);
        };
        label={
         $:1,
         $0:arg0
        };
        f=function(b1)
        {
         return[b1,v];
        };
        formlet=Formlet.WithLabel(label,x);
        return Formlet.Map(f,formlet);
       });
       fs=List.map(mapping,values);
       x2=Formlet.Sequence(fs);
       chooser=Runtime.Tupled(function(tupledArg)
       {
        var b,v;
        b=tupledArg[0];
        v=tupledArg[1];
        return b?{
         $:1,
         $0:v
        }:{
         $:0
        };
       });
       f1=function(list)
       {
        return List.choose(chooser,list);
       };
       return Formlet.Map(f1,x2);
      },
      ElementButton:function(genElem)
      {
       var f;
       f=function()
       {
        var state,count,x,arg00,body,reset;
        state=HotStream.New(Runtime.New(Result,{
         $:1,
         $0:Runtime.New(T,{
          $:0
         })
        }));
        count={
         contents:0
        };
        x=genElem(null);
        arg00=function()
        {
         return function()
         {
          state.Trigger(Runtime.New(Result,{
           $:0,
           $0:count.contents
          }));
          return Operators1.Increment(count);
         };
        };
        EventsPervasives.Events().OnClick(arg00,x);
        body=x;
        reset=function()
        {
         count.contents=0;
         return state.Trigger(Runtime.New(Result,{
          $:1,
          $0:Runtime.New(T,{
           $:0
          })
         }));
        };
        return[body,reset,state];
       };
       return Data.MkFormlet(f);
      },
      Input:function(value)
      {
       return Controls.InputField(false,"text",CssConstants.InputTextClass(),value);
      },
      InputControl:function(value,f)
      {
       var f1;
       f1=function()
       {
        var state,body,reset;
        state=HotStream.New(Runtime.New(Result,{
         $:0,
         $0:value
        }));
        body=f(state);
        body.set_Value(value);
        reset=function()
        {
         body.set_Value(value);
         return state.Trigger(Runtime.New(Result,{
          $:0,
          $0:value
         }));
        };
        return[body,reset,state];
       };
       return Data.MkFormlet(f1);
      },
      InputField:function(readOnly,typ,cls,value)
      {
       return Controls.InputControl(value,function(state)
       {
        var ro,_,_this,a,_this1,x,input,f;
        if(readOnly)
         {
          _this=Default.Attr();
          _=List.ofArray([_this.NewAttr("readonly","readonly")]);
         }
        else
         {
          _=Runtime.New(T,{
           $:0
          });
         }
        ro=_;
        _this1=Default.Attr();
        a=List.ofArray([_this1.NewAttr("type",typ),Default.Attr().Class(cls)]);
        x=List.append(a,ro);
        input=Default.Input(x);
        f=function()
        {
         return!readOnly?state.Trigger(Runtime.New(Result,{
          $:0,
          $0:input.get_Value()
         })):null;
        };
        Controls.OnTextChange(f,input);
        return input;
       });
      },
      OnTextChange:function(f,control)
      {
       var value,up,arg00,arg001;
       value={
        contents:control.get_Value()
       };
       up=function()
       {
        var _;
        if(control.get_Value()!==value.contents)
         {
          value.contents=control.get_Value();
          _=f(null);
         }
        else
         {
          _=null;
         }
        return _;
       };
       arg00=function()
       {
        return up(null);
       };
       EventsPervasives.Events().OnChange(arg00,control);
       arg001=function()
       {
        return function()
        {
         return up(null);
        };
       };
       EventsPervasives.Events().OnKeyUp(arg001,control);
       control.Dom.oninput=up;
       return;
      },
      Password:function(value)
      {
       return Controls.InputField(false,"password","inputPassword",value);
      },
      RadioButtonGroup:function(def,values)
      {
       return Controls.RadioButtonGroupControl(false,def,values);
      },
      RadioButtonGroupControl:function(readOnly,def,values)
      {
       var f;
       f=function()
       {
        var groupId,x,_,defIx,mapping,x1,chooser,d,f1,state,mapping1,rbLbVls,resetRB,reset,mapping2,vs,arg0,arg003,body;
        groupId="id"+Math.round(Math.random()*100000000);
        if(def.$==0)
         {
          _={
           $:0
          };
         }
        else
         {
          defIx=def.$0;
          mapping=function(ix)
          {
           return Runtime.Tupled(function(tupledArg)
           {
            var value;
            tupledArg[0];
            value=tupledArg[1];
            return[ix,value];
           });
          };
          x1=List.mapi(mapping,values);
          chooser=Runtime.Tupled(function(tupledArg)
          {
           var ix,value,_1,defIx1;
           ix=tupledArg[0];
           value=tupledArg[1];
           if(def.$==0)
            {
             _1={
              $:0
             };
            }
           else
            {
             defIx1=def.$0;
             _1=defIx1===ix?{
              $:1,
              $0:Runtime.New(Result,{
               $:0,
               $0:value
              })
             }:{
              $:0
             };
            }
           return _1;
          });
          _=Seq.tryPick(chooser,x1);
         }
        x=_;
        d=HotStream.New(Runtime.New(Result,{
         $:1,
         $0:Runtime.New(T,{
          $:0
         })
        }));
        f1=function(arg00)
        {
         return HotStream.New(arg00);
        };
        state=Utils.Maybe(d,f1,x);
        mapping1=Runtime.Tupled(function(tupledArg)
        {
         var label,value,inp,_this,_this1,_1,_this2;
         label=tupledArg[0];
         value=tupledArg[1];
         _this=Default.Attr();
         _this1=Default.Attr();
         if(readOnly)
          {
           _this2=Default.Attr();
           _1=List.ofArray([_this2.NewAttr("disabled","disabled")]);
          }
         else
          {
           _1=Runtime.New(T,{
            $:0
           });
          }
         inp=Operators.add(Default.Input(List.ofArray([Default.Attr().Class("inputRadio"),_this.NewAttr("type","radio"),_this1.NewAttr("name",groupId)])),_1);
         return[inp,label,value];
        });
        rbLbVls=List.map(mapping1,values);
        resetRB=function(rb,value,ix)
        {
         var _1,objectArg,arg00,defIx1,_2,objectArg1,arg001,objectArg2,arg002;
         if(def.$==0)
          {
           objectArg=rb["HtmlProvider@33"];
           arg00=rb.get_Body();
           objectArg.RemoveAttribute(arg00,"checked");
           _1=state.Trigger(Runtime.New(Result,{
            $:1,
            $0:Runtime.New(T,{
             $:0
            })
           }));
          }
         else
          {
           defIx1=def.$0;
           if(defIx1===ix)
            {
             objectArg1=rb["HtmlProvider@33"];
             arg001=rb.get_Body();
             objectArg1.SetProperty(arg001,"checked",true);
             _2=state.Trigger(Runtime.New(Result,{
              $:0,
              $0:value
             }));
            }
           else
            {
             objectArg2=rb["HtmlProvider@33"];
             arg002=rb.get_Body();
             _2=objectArg2.SetProperty(arg002,"checked",false);
            }
           _1=_2;
          }
         return _1;
        };
        reset=function()
        {
         var action;
         action=function(ix)
         {
          return Runtime.Tupled(function(tupledArg)
          {
           var rb,value;
           rb=tupledArg[0];
           tupledArg[1];
           value=tupledArg[2];
           return resetRB(rb,value,ix);
          });
         };
         return Seq.iteri(action,rbLbVls);
        };
        mapping2=function(ix)
        {
         return Runtime.Tupled(function(tupledArg)
         {
          var rb,label,value,arg00,Label;
          rb=tupledArg[0];
          label=tupledArg[1];
          value=tupledArg[2];
          resetRB(rb,value,ix);
          arg00=function()
          {
           return function()
           {
            return!readOnly?state.Trigger(Runtime.New(Result,{
             $:0,
             $0:value
            })):null;
           };
          };
          EventsPervasives.Events().OnClick(arg00,rb);
          Label={
           $:1,
           $0:function()
           {
            var x2,_this;
            x2=List.ofArray([Default.Text(label)]);
            _this=Default.Tags();
            return _this.NewTag("label",x2);
           }
          };
          return Runtime.New(Body,{
           Element:rb,
           Label:Label
          });
         });
        };
        vs=List.mapi(mapping2,rbLbVls);
        arg0=Tree.FromSequence(vs);
        arg003=Runtime.New(Edit,{
         $:0,
         $0:arg0
        });
        body=Data.RX().Return(arg003);
        return Runtime.New(Form,{
         Body:body,
         Dispose1:function()
         {
         },
         Notify:function()
         {
          return reset(null);
         },
         State:state
        });
       };
       return Formlet.New(f);
      },
      ReadOnlyCheckbox:function(def)
      {
       return Controls.CheckboxControl(true,def);
      },
      ReadOnlyInput:function(value)
      {
       return Controls.InputField(true,"text",CssConstants.InputTextClass(),value);
      },
      ReadOnlyRadioButtonGroup:function(def,values)
      {
       return Controls.RadioButtonGroupControl(true,def,values);
      },
      ReadOnlySelect:function(def,vls)
      {
       return Controls.SelectControl(true,def,vls);
      },
      ReadOnlyTextArea:function(value)
      {
       return Controls.TextAreaControl(true,value);
      },
      Select:function(def,vls)
      {
       return Controls.SelectControl(false,def,vls);
      },
      SelectControl:function(readOnly,def,vls)
      {
       var f;
       f=function()
       {
        var mapping,list,aVls,sIx,mapping1,x2,select,body,_,_this2,sValue,state,reset,arg001;
        mapping=Runtime.Tupled(function(tuple)
        {
         return tuple[1];
        });
        list=List.map(mapping,vls);
        aVls=Arrays.ofSeq(list);
        sIx=(def>=0?def<vls.get_Length():false)?def:0;
        mapping1=function(i)
        {
         return Runtime.Tupled(function(tupledArg)
         {
          var nm,_this,x,_this1,x1;
          nm=tupledArg[0];
          tupledArg[1];
          _this=Default.Tags();
          _this1=Default.Attr();
          x1=Global.String(i);
          x=List.ofArray([Default.Text(nm),_this1.NewAttr("value",x1)]);
          return _this.NewTag("option",x);
         });
        };
        x2=List.mapi(mapping1,vls);
        select=Default.Select(x2);
        if(readOnly)
         {
          _this2=Default.Attr();
          _=Operators.add(select,List.ofArray([_this2.NewAttr("disabled","disabled")]));
         }
        else
         {
          _=select;
         }
        body=_;
        sValue=Runtime.New(Result,{
         $:0,
         $0:IntrinsicFunctionProxy.GetArray(aVls,sIx)
        });
        state=HotStream.New(sValue);
        reset=function()
        {
         var value,objectArg,arg00;
         value=Global.String(sIx);
         objectArg=body["HtmlProvider@33"];
         arg00=body.get_Body();
         objectArg.SetProperty(arg00,"value",value);
         return state.Trigger(sValue);
        };
        reset(null);
        arg001=function()
        {
         var _1,value,arg0,arg00;
         if(!readOnly)
          {
           value=body.get_Value();
           arg0=IntrinsicFunctionProxy.GetArray(aVls,value<<0);
           arg00=Runtime.New(Result,{
            $:0,
            $0:arg0
           });
           _1=state.Trigger(arg00);
          }
         else
          {
           _1=null;
          }
         return _1;
        };
        EventsPervasives.Events().OnChange(arg001,body);
        reset(null);
        return[body,reset,state];
       };
       return Data.MkFormlet(f);
      },
      TextArea:function(value)
      {
       return Controls.TextAreaControl(false,value);
      },
      TextAreaControl:function(readOnly,value)
      {
       return Controls.InputControl(value,function(state)
       {
        var x,_,_this,input,f;
        if(readOnly)
         {
          _this=Default.Attr();
          _=List.ofArray([_this.NewAttr("readonly","readonly")]);
         }
        else
         {
          _=Runtime.New(T,{
           $:0
          });
         }
        x=_;
        input=Default.TextArea(x);
        f=function()
        {
         return!readOnly?state.Trigger(Runtime.New(Result,{
          $:0,
          $0:input.get_Value()
         })):null;
        };
        Controls.OnTextChange(f,input);
        return input;
       });
      }
     },
     CssConstants:{
      InputTextClass:Runtime.Field(function()
      {
       return"inputText";
      })
     },
     Data:{
      $:function(f,x)
      {
       var objectArg,x1;
       objectArg=Data.BaseFormlet();
       x1=objectArg.Apply(f,x);
       return Data.OfIFormlet(x1);
      },
      BaseFormlet:function()
      {
       return FormletProvider.New(Data.UtilsProvider());
      },
      DefaultLayout:Runtime.Field(function()
      {
       return Data.Layout().get_Vertical();
      }),
      Formlet:Runtime.Class({
       Build:function()
       {
        return this.buildInternal.call(null,null);
       },
       MapResult:function(f)
       {
        var x,_this=this;
        x=Formlet1.New(function()
        {
         var form,objectArg,arg00,arg10;
         form=_this.buildInternal.call(null,null);
         objectArg=_this.utils.Reactive;
         arg00=form.State;
         arg10=function(x1)
         {
          return f(x1);
         };
         return Runtime.New(Form,{
          Body:form.Body,
          Dispose1:form.Dispose1,
          Notify:form.Notify,
          State:objectArg.Select(arg00,arg10)
         });
        },_this.layoutInternal,_this.formletBase,_this.utils);
        return x;
       },
       Render:function()
       {
        return this.Run(function()
        {
        }).Render();
       },
       Run:function(f)
       {
        var matchValue,_,formlet,form,value,matchValue1,el,_1,patternInput,body,body1,el1;
        matchValue=this.get_ElementInternal();
        if(matchValue.$==0)
         {
          formlet=this.formletBase.ApplyLayout(this);
          form=formlet.Build();
          value=Util.subscribeTo(form.State,function(res)
          {
           var value1;
           value1=Result.Map(f,res);
           return;
          });
          matchValue1=formlet.get_Layout().Apply.call(null,form.Body);
          if(matchValue1.$==0)
           {
            patternInput=Data.DefaultLayout().Apply.call(null,form.Body).$0;
            body=patternInput[0];
            _1=body.Element;
           }
          else
           {
            body1=matchValue1.$0[0];
            _1=body1.Element;
           }
          el=_1;
          this.set_ElementInternal({
           $:1,
           $0:el
          });
          _=el;
         }
        else
         {
          el1=matchValue.$0;
          _=el1;
         }
        return _;
       },
       get_Body:function()
       {
        return this.Run(function()
        {
        }).get_Body();
       },
       get_ElementInternal:function()
       {
        return this["ElementInternal@"];
       },
       get_Layout:function()
       {
        return this.layoutInternal;
       },
       set_ElementInternal:function(v)
       {
        this["ElementInternal@"]=v;
        return;
       }
      },{
       New:function(buildInternal,layoutInternal,formletBase,utils)
       {
        var r;
        r=Runtime.New(this,Pagelet.New());
        r.buildInternal=buildInternal;
        r.layoutInternal=layoutInternal;
        r.formletBase=formletBase;
        r.utils=utils;
        r["ElementInternal@"]={
         $:0
        };
        return r;
       }
      }),
      Layout:Runtime.Field(function()
      {
       return LayoutProvider.New(LayoutUtils.New({
        Reactive:Reactive1.Default()
       }));
      }),
      MkFormlet:function(f)
      {
       var objectArg,arg00,formlet;
       objectArg=Data.BaseFormlet();
       arg00=function()
       {
        var patternInput,state,reset,body,Notify,value,arg001;
        patternInput=f(null);
        state=patternInput[2];
        reset=patternInput[1];
        body=patternInput[0];
        Notify=function()
        {
         return reset(null);
        };
        value=Data.NewBody(body,{
         $:0
        });
        arg001=Tree.Set(value);
        return Runtime.New(Form,{
         Body:Data.RX().Return(arg001),
         Dispose1:function()
         {
          return null;
         },
         Notify:Notify,
         State:state
        });
       };
       formlet=objectArg.New(arg00);
       return Data.OfIFormlet(formlet);
      },
      NewBody:function(arg00,arg10)
      {
       return Body.New(arg00,arg10);
      },
      OfIFormlet:function(formlet)
      {
       var f2;
       f2=Formlet1.New(function()
       {
        return formlet.Build();
       },formlet.get_Layout(),Data.BaseFormlet(),Data.UtilsProvider());
       return Data.PropagateRenderFrom(formlet,f2);
      },
      PropagateRenderFrom:function(f1,f2)
      {
       f1.hasOwnProperty("Render")?void(f2.Render=f1.Render):null;
       return f2;
      },
      RX:Runtime.Field(function()
      {
       return Reactive1.Default();
      }),
      UtilsProvider:function()
      {
       return{
        Reactive:Data.RX(),
        DefaultLayout:Data.DefaultLayout()
       };
      },
      Validator:Runtime.Field(function()
      {
       return Validator.New(ValidatorProvidor.New());
      }),
      ValidatorProvidor:Runtime.Class({
       Matches:function(regex,text)
       {
        return text.match(new RegExp(regex));
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
       }
      })
     },
     ElementStore:Runtime.Class({
      Init:function()
      {
       this.store=Dictionary.New2();
       return;
      },
      RegisterElement:function(key,f)
      {
       var value;
       value=this.store.ContainsKey(key);
       return!value?this.store.set_Item(key,f):null;
      },
      Remove:function(key)
      {
       var _,value;
       if(this.store.ContainsKey(key))
        {
         (this.store.get_Item(key))(null);
         value=this.store.Remove(key);
         _=void value;
        }
       else
        {
         _=null;
        }
       return _;
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      },
      NewElementStore:function()
      {
       var store;
       store=ElementStore.New();
       store.Init();
       return store;
      }
     }),
     Enhance:{
      Cancel:function(formlet,isCancel)
      {
       return Formlet.Replace(formlet,function(value)
       {
        return isCancel(value)?Formlet.Empty():Formlet.Return(value);
       });
      },
      CustomMany:function(config,formlet)
      {
       var formlet1,addButton,f,formlet2,c,x,l,x1,delF,manyF,resetS,formlet6,resetF,reset,_builder_,formlet7;
       formlet1=Controls.ElementButton(function()
       {
        return Operators.add(Default.Div(List.ofArray([Default.Attr().Class(config.AddIconClass)])),List.ofArray([Default.Div(Runtime.New(T,{
         $:0
        }))]));
       });
       addButton=Formlet.InitWith(1,formlet1);
       f=function()
       {
       };
       formlet2=Controls.ElementButton(function()
       {
        return Operators.add(Default.Div(List.ofArray([Default.Attr().Class(config.RemoveIconClass)])),List.ofArray([Default.Div(Runtime.New(T,{
         $:0
        }))]));
       });
       c=Formlet.Map(f,formlet2);
       x=Formlet.WithCancelation(formlet,c);
       l=Data.Layout().get_Horizontal();
       x1=Formlet.WithLayout(l,x);
       delF=Enhance.Deletable(x1);
       manyF=function()
       {
        var f1,formlet3,formlet4,formlet5;
        f1=function(source)
        {
         return List.ofSeq(source);
        };
        formlet3=Enhance.Many_(addButton,function()
        {
         return delF;
        });
        formlet4=Formlet.Map(f1,formlet3);
        formlet5=Formlet.WithLayoutOrDefault(formlet4);
        return Formlet.ApplyLayout(formlet5);
       };
       resetS=HotStream.New(Runtime.New(Result,{
        $:0,
        $0:null
       }));
       formlet6=Data.BaseFormlet().FromState(resetS);
       resetF=Data.OfIFormlet(formlet6);
       reset=function()
       {
        return resetS.Trigger(Runtime.New(Result,{
         $:0,
         $0:null
        }));
       };
       _builder_=Formlet.Do();
       formlet7=_builder_.Delay(function()
       {
        return _builder_.Bind(resetF,function()
        {
         return _builder_.ReturnFrom(manyF(null));
        });
       });
       return Formlet.WithNotification(reset,formlet7);
      },
      Deletable:function(formlet)
      {
       return Enhance.Replace(formlet,function(value)
       {
        var _,value1;
        if(value.$==1)
         {
          value1=value.$0;
          _=Formlet.Return({
           $:1,
           $0:value1
          });
         }
        else
         {
          _=Formlet.ReturnEmpty({
           $:0
          });
         }
        return _;
       });
      },
      FormButtonConfiguration:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(FormButtonConfiguration,{
         Label:{
          $:0
         },
         Style:{
          $:0
         },
         Class:{
          $:0
         }
        });
       }
      }),
      FormContainerConfiguration:Runtime.Class({},{
       get_Default:function()
       {
        var Description;
        Description={
         $:0
        };
        return Runtime.New(FormContainerConfiguration,{
         Header:{
          $:0
         },
         Padding:Padding.get_Default(),
         Description:Description,
         BackgroundColor:{
          $:0
         },
         BorderColor:{
          $:0
         },
         CssClass:{
          $:0
         },
         Style:{
          $:0
         }
        });
       }
      }),
      InputButton:function(conf,enabled)
      {
       var f;
       f=function()
       {
        var state,count,label,x1,_this,_this1,arg00,submit,submit1,_,objectArg,arg001,matchValue,_1,style,objectArg1,arg002,matchValue1,_2,cls,objectArg2,arg003,reset;
        state=HotStream.New(Runtime.New(Result,{
         $:1,
         $0:Runtime.New(T,{
          $:0
         })
        }));
        count={
         contents:0
        };
        label=Utils.Maybe("Submit",function(x)
        {
         return x;
        },conf.Label);
        _this=Default.Attr();
        _this1=Default.Attr();
        x1=Operators.add(Default.Input(List.ofArray([_this.NewAttr("type","button")])),List.ofArray([Default.Attr().Class("submitButton"),_this1.NewAttr("value",label)]));
        arg00=function()
        {
         return function()
         {
          Operators1.Increment(count);
          return state.Trigger(Runtime.New(Result,{
           $:0,
           $0:count.contents
          }));
         };
        };
        EventsPervasives.Events().OnClick(arg00,x1);
        submit=x1;
        if(!enabled)
         {
          objectArg=submit["HtmlProvider@33"];
          arg001=submit.get_Body();
          _=objectArg.AddClass(arg001,"disabledButton");
         }
        else
         {
          _=null;
         }
        matchValue=conf.Style;
        if(matchValue.$==1)
         {
          style=matchValue.$0;
          objectArg1=submit["HtmlProvider@33"];
          arg002=submit.get_Body();
          _1=objectArg1.SetStyle(arg002,style);
         }
        else
         {
          _1=null;
         }
        matchValue1=conf.Class;
        if(matchValue1.$==1)
         {
          cls=matchValue1.$0;
          objectArg2=submit["HtmlProvider@33"];
          arg003=submit.get_Body();
          _2=objectArg2.AddClass(arg003,cls);
         }
        else
         {
          _2=null;
         }
        submit1=submit;
        reset=function()
        {
         count.contents=0;
         return state.Trigger(Runtime.New(Result,{
          $:1,
          $0:Runtime.New(T,{
           $:0
          })
         }));
        };
        state.Trigger(Runtime.New(Result,{
         $:1,
         $0:Runtime.New(T,{
          $:0
         })
        }));
        return[submit1,reset,state];
       };
       return Data.MkFormlet(f);
      },
      Many:function(formlet)
      {
       return Enhance.CustomMany(ManyConfiguration.get_Default(),formlet);
      },
      ManyConfiguration:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(ManyConfiguration,{
         AddIconClass:"addIcon",
         RemoveIconClass:"removeIcon"
        });
       }
      }),
      Many_:function(add,f)
      {
       var f1,chooser,f2,formlet,formlet1,formlet2;
       f1=function(v)
       {
        return f(v);
       };
       chooser=function(x)
       {
        return x;
       };
       f2=function(source)
       {
        return Seq.choose(chooser,source);
       };
       formlet=Formlet.Map(f1,add);
       formlet1=Formlet.SelectMany(formlet);
       formlet2=Formlet.FlipBody(formlet1);
       return Formlet.Map(f2,formlet2);
      },
      Padding:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(Padding,{
         Left:{
          $:0
         },
         Right:{
          $:0
         },
         Top:{
          $:0
         },
         Bottom:{
          $:0
         }
        });
       }
      }),
      Replace:function(formlet,f)
      {
       var f1,x;
       f1=function(res)
       {
        var _,fs,arg0,s;
        if(res.$==1)
         {
          fs=res.$0;
          arg0=Formlet.FailWith(fs);
          _=Runtime.New(Result,{
           $:0,
           $0:arg0
          });
         }
        else
         {
          s=res.$0;
          _=Runtime.New(Result,{
           $:0,
           $0:f(s)
          });
         }
        return _;
       };
       x=Formlet.MapResult(f1,formlet);
       return Formlet.Switch(x);
      },
      ValidationFrameConfiguration:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(ValidationFrameConfiguration,{
         ValidClass:{
          $:1,
          $0:"successFormlet"
         },
         ValidStyle:{
          $:0
         },
         ErrorClass:{
          $:1,
          $0:"errorFormlet"
         },
         ErrorStyle:{
          $:0
         }
        });
       }
      }),
      ValidationIconConfiguration:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(ValidationIconConfiguration,{
         ValidIconClass:"validIcon",
         ErrorIconClass:"errorIcon"
        });
       }
      }),
      WithCssClass:function(css,formlet)
      {
       var f;
       f=function(el)
       {
        var objectArg,arg00;
        objectArg=el["HtmlProvider@33"];
        arg00=el.get_Body();
        objectArg.AddClass(arg00,css);
        return el;
       };
       return Formlet.MapElement(f,formlet);
      },
      WithCustomFormContainer:function(fc,formlet)
      {
       var x,f;
       x=Formlet.ApplyLayout(formlet);
       f=function(formEl)
       {
        var x1,d,f1,description,x2,d1,f2,tb,cell,f3,o,x3,f4,value,f5,value1,f6,value2,f7,value3,f8,value4,action,matchValue,_1,style,objectArg1,arg002,matchValue1,_2,cls,objectArg2,arg003;
        x1=fc.Description;
        d=Runtime.New(T,{
         $:0
        });
        f1=function(descr)
        {
         var _,genEl,text;
         if(descr.$==1)
          {
           genEl=descr.$0;
           _=List.ofArray([genEl(null)]);
          }
         else
          {
           text=descr.$0;
           _=List.ofArray([Default.P(List.ofArray([Default.Tags().text(text)]))]);
          }
         return _;
        };
        description=Utils.Maybe(d,f1,x1);
        x2=fc.Header;
        d1=Utils.InTable(List.ofArray([List.ofArray([Operators.add(Default.Div(List.ofArray([Default.Attr().Class("headerPanel")])),description)]),List.ofArray([formEl])]));
        f2=function(formElem)
        {
         var hdr,_,genElem,text,header;
         if(formElem.$==1)
          {
           genElem=formElem.$0;
           _=genElem(null);
          }
         else
          {
           text=formElem.$0;
           _=Default.H1(List.ofArray([Default.Tags().text(text)]));
          }
         hdr=_;
         header=Operators.add(Default.Div(List.ofArray([Default.Attr().Class("headerPanel")])),Runtime.New(T,{
          $:1,
          $0:hdr,
          $1:description
         }));
         return Utils.InTable(List.ofArray([List.ofArray([header]),List.ofArray([formEl])]));
        };
        tb=Utils.Maybe(d1,f2,x2);
        cell=Operators.add(Default.TD(List.ofArray([Default.Attr().Class("formlet")])),List.ofArray([tb]));
        f3=function(color)
        {
         var arg00,objectArg,arg001;
         arg00="border-color: "+color;
         objectArg=cell["HtmlProvider@33"];
         arg001=cell.get_Body();
         return objectArg.SetStyle(arg001,arg00);
        };
        o=fc.BorderColor;
        Utils.Maybe(null,f3,o);
        f4=function(color)
        {
         return color;
        };
        value=fc.BackgroundColor;
        f5=function(v)
        {
         return Global.String(v)+"px";
        };
        value1=fc.Padding.Left;
        f6=function(v)
        {
         return Global.String(v)+"px";
        };
        value2=fc.Padding.Right;
        f7=function(v)
        {
         return Global.String(v)+"px";
        };
        value3=fc.Padding.Top;
        f8=function(v)
        {
         return Global.String(v)+"px";
        };
        value4=fc.Padding.Bottom;
        x3=List.ofArray([["background-color",Utils.MapOption(f4,value)],["padding-left",Utils.MapOption(f5,value1)],["padding-right",Utils.MapOption(f6,value2)],["padding-top",Utils.MapOption(f7,value3)],["padding-bottom",Utils.MapOption(f8,value4)]]);
        action=Runtime.Tupled(function(tupledArg)
        {
         var name,value5,_,v,objectArg,arg00;
         name=tupledArg[0];
         value5=tupledArg[1];
         if(value5.$==0)
          {
           _=null;
          }
         else
          {
           v=value5.$0;
           objectArg=cell["HtmlProvider@33"];
           arg00=cell.get_Body();
           _=objectArg.SetCss(arg00,name,v);
          }
         return _;
        });
        Seq.iter(action,x3);
        matchValue=fc.Style;
        if(matchValue.$==0)
         {
          _1=null;
         }
        else
         {
          style=matchValue.$0;
          objectArg1=cell["HtmlProvider@33"];
          arg002=cell.get_Body();
          _1=objectArg1.SetStyle(arg002,style);
         }
        matchValue1=fc.CssClass;
        if(matchValue1.$==0)
         {
          _2=null;
         }
        else
         {
          cls=matchValue1.$0;
          objectArg2=cell["HtmlProvider@33"];
          arg003=cell.get_Body();
          _2=objectArg2.AddClass(arg003,cls);
         }
        return Default.Table(List.ofArray([Default.TBody(List.ofArray([Default.TR(List.ofArray([cell]))]))]));
       };
       return Formlet.MapElement(f,x);
      },
      WithCustomResetButton:function(buttonConf,formlet)
      {
       var matchValue,buttonConf1,_,reset;
       matchValue=buttonConf.Label;
       if(matchValue.$==0)
        {
         _=Runtime.New(FormButtonConfiguration,{
          Label:{
           $:1,
           $0:"Reset"
          },
          Style:buttonConf.Style,
          Class:buttonConf.Class
         });
        }
       else
        {
         matchValue.$0;
         _=buttonConf;
        }
       buttonConf1=_;
       reset=Enhance.InputButton(buttonConf1,true);
       return Enhance.WithResetFormlet(formlet,reset);
      },
      WithCustomSubmitAndResetButtons:function(submitConf,resetConf,formlet)
      {
       var submitReset;
       submitReset=function(reset)
       {
        return function(result)
        {
         var submit,_,fs,f,formlet1,value,f1,formlet2,_builder_,reset1,x,l;
         if(result.$==1)
          {
           fs=result.$0;
           f=function()
           {
            return Runtime.New(Result,{
             $:1,
             $0:fs
            });
           };
           formlet1=Enhance.InputButton(submitConf,false);
           _=Formlet.MapResult(f,formlet1);
          }
         else
          {
           value=result.$0;
           f1=function()
           {
            return value;
           };
           formlet2=Enhance.InputButton(submitConf,true);
           _=Formlet.Map(f1,formlet2);
          }
         submit=_;
         _builder_=Formlet.Do();
         reset1=_builder_.Delay(function()
         {
          return _builder_.Bind(Formlet.LiftResult(Enhance.InputButton(resetConf,true)),function(_arg1)
          {
           _arg1.$==0?reset(null):null;
           return _builder_.Return(null);
          });
         });
         x=Data.$(Data.$(Formlet.Return(function(v)
         {
          return function()
          {
           return v;
          };
         }),submit),reset1);
         l=Data.Layout().get_Horizontal();
         return Formlet.WithLayout(l,x);
        };
       };
       return Enhance.WithSubmitAndReset(formlet,submitReset);
      },
      WithCustomSubmitButton:function(buttonConf,formlet)
      {
       var matchValue,buttonConf1,_;
       matchValue=buttonConf.Label;
       if(matchValue.$==0)
        {
         _=Runtime.New(FormButtonConfiguration,{
          Label:{
           $:1,
           $0:"Submit"
          },
          Style:buttonConf.Style,
          Class:buttonConf.Class
         });
        }
       else
        {
         matchValue.$0;
         _=buttonConf;
        }
       buttonConf1=_;
       return Enhance.WithSubmitFormlet(formlet,function(res)
       {
        var f,enabled,formlet1;
        f=function()
        {
        };
        enabled=res.$==0?true:false;
        formlet1=Enhance.InputButton(buttonConf1,enabled);
        return Formlet.Map(f,formlet1);
       });
      },
      WithCustomValidationFrame:function(vc,formlet)
      {
       var wrapper;
       wrapper=function(state)
       {
        return function(body)
        {
         var x,f;
         x=Default.Div(List.ofArray([body.Element]));
         f=function(panel)
         {
          var value;
          value=Util.subscribeTo(state,function(res)
          {
           var _,msgs,matchValue,_1,cls,objectArg,arg00,matchValue1,_2,cls1,objectArg1,arg001,matchValue2,_3,style,objectArg2,arg002,objectArg3,arg003,matchValue3,_4,cls2,objectArg4,arg004,matchValue4,_5,cls3,objectArg5,arg005,matchValue5,_6,style1,objectArg6,arg006,objectArg7,arg007;
           if(res.$==1)
            {
             msgs=res.$0;
             matchValue=vc.ValidClass;
             if(matchValue.$==1)
              {
               cls=matchValue.$0;
               objectArg=panel["HtmlProvider@33"];
               arg00=panel.get_Body();
               _1=objectArg.RemoveClass(arg00,cls);
              }
             else
              {
               _1=null;
              }
             matchValue1=vc.ErrorClass;
             if(matchValue1.$==1)
              {
               cls1=matchValue1.$0;
               objectArg1=panel["HtmlProvider@33"];
               arg001=panel.get_Body();
               _2=objectArg1.AddClass(arg001,cls1);
              }
             else
              {
               _2=null;
              }
             matchValue2=vc.ErrorStyle;
             if(matchValue2.$==1)
              {
               style=matchValue2.$0;
               objectArg2=panel["HtmlProvider@33"];
               arg002=panel.get_Body();
               _3=objectArg2.SetStyle(arg002,style);
              }
             else
              {
               objectArg3=panel["HtmlProvider@33"];
               arg003=panel.get_Body();
               _3=objectArg3.SetStyle(arg003,"");
              }
             _=_3;
            }
           else
            {
             matchValue3=vc.ErrorClass;
             if(matchValue3.$==1)
              {
               cls2=matchValue3.$0;
               objectArg4=panel["HtmlProvider@33"];
               arg004=panel.get_Body();
               _4=objectArg4.RemoveClass(arg004,cls2);
              }
             else
              {
               _4=null;
              }
             matchValue4=vc.ValidClass;
             if(matchValue4.$==1)
              {
               cls3=matchValue4.$0;
               objectArg5=panel["HtmlProvider@33"];
               arg005=panel.get_Body();
               _5=objectArg5.AddClass(arg005,cls3);
              }
             else
              {
               _5=null;
              }
             matchValue5=vc.ValidStyle;
             if(matchValue5.$==1)
              {
               style1=matchValue5.$0;
               objectArg6=panel["HtmlProvider@33"];
               arg006=panel.get_Body();
               _6=objectArg6.SetStyle(arg006,style1);
              }
             else
              {
               objectArg7=panel["HtmlProvider@33"];
               arg007=panel.get_Body();
               _6=objectArg7.SetStyle(arg007,"");
              }
             _=_6;
            }
           return _;
          });
          return;
         };
         Operators.OnAfterRender(f,x);
         return x;
        };
       };
       return Enhance.WrapFormlet(wrapper,formlet);
      },
      WithCustomValidationIcon:function(vic,formlet)
      {
       var formlet1,valid,_builder_,f1,formlet2,x1,l;
       formlet1=Formlet.WithLayoutOrDefault(formlet);
       valid=function(res)
       {
        var genElem;
        genElem=function()
        {
         var _,msgs,f,title,_this,_this1;
         if(res.$==1)
          {
           msgs=res.$0;
           f=function(x)
           {
            return function(y)
            {
             return x+" "+y;
            };
           };
           title=Seq.fold(f,"",msgs);
           _this=Default.Attr();
           _=Operators.add(Default.Div(List.ofArray([Default.Attr().Class(vic.ErrorIconClass),_this.NewAttr("title",title)])),List.ofArray([Default.Div(Runtime.New(T,{
            $:0
           }))]));
          }
         else
          {
           _this1=Default.Attr();
           _=Operators.add(Default.Div(List.ofArray([Default.Attr().Class(vic.ValidIconClass),_this1.NewAttr("title","")])),List.ofArray([Default.Div(Runtime.New(T,{
            $:0
           }))]));
          }
         return _;
        };
        return Formlet.OfElement(genElem);
       };
       _builder_=Formlet.Do();
       f1=function(arg00)
       {
        return Result.Join(arg00);
       };
       formlet2=_builder_.Delay(function()
       {
        return _builder_.Bind(Formlet.LiftResult(formlet1),function(_arg1)
        {
         return _builder_.Bind(valid(_arg1),function()
         {
          return _builder_.Return(_arg1);
         });
        });
       });
       x1=Formlet.MapResult(f1,formlet2);
       l=Data.Layout().get_Horizontal();
       return Formlet.WithLayout(l,x1);
      },
      WithErrorFormlet:function(f,formlet)
      {
       var _builder_,f1,formlet1;
       _builder_=Formlet.Do();
       f1=function(arg00)
       {
        return Result.Join(arg00);
       };
       formlet1=_builder_.Delay(function()
       {
        return _builder_.Bind(Formlet.LiftResult(formlet),function(_arg1)
        {
         var _,msgs,_builder_1;
         if(_arg1.$==1)
          {
           msgs=_arg1.$0;
           _builder_1=Formlet.Do();
           _=_builder_1.Delay(function()
           {
            return _builder_1.Bind(f(msgs),function()
            {
             return _builder_1.Return(_arg1);
            });
           });
          }
         else
          {
           _arg1.$0;
           _=Formlet.Return(_arg1);
          }
         return _builder_.ReturnFrom(_);
        });
       });
       return Formlet.MapResult(f1,formlet1);
      },
      WithErrorSummary:function(label,formlet)
      {
       var errrFormlet,_builder_,f1,formlet1;
       errrFormlet=function(fs)
       {
        return Formlet.OfElement(function()
        {
         var x,x1,_this,mapping,x2,_this1;
         x1=List.ofArray([Default.Text(label)]);
         _this=Default.Tags();
         mapping=function(f)
         {
          return Default.LI(List.ofArray([Default.Text(f)]));
         };
         x2=List.map(mapping,fs);
         x=List.ofArray([_this.NewTag("legend",x1),Default.UL(x2)]);
         _this1=Default.Tags();
         return _this1.NewTag("fieldset",x);
        });
       };
       _builder_=Formlet.Do();
       f1=function(arg00)
       {
        return Result.Join(arg00);
       };
       formlet1=_builder_.Delay(function()
       {
        return _builder_.Bind(Formlet.LiftResult(formlet),function(_arg1)
        {
         var _,fs,f,formlet2;
         if(_arg1.$==1)
          {
           fs=_arg1.$0;
           f=function()
           {
            return _arg1;
           };
           formlet2=errrFormlet(fs);
           _=Formlet.Map(f,formlet2);
          }
         else
          {
           _arg1.$0;
           _=Formlet.Return(_arg1);
          }
         return _builder_.ReturnFrom(_);
        });
       });
       return Formlet.MapResult(f1,formlet1);
      },
      WithFormContainer:function(formlet)
      {
       return Enhance.WithCustomFormContainer(FormContainerConfiguration.get_Default(),formlet);
      },
      WithJsonPost:function(conf,formlet)
      {
       var matchValue,postUrl,_,url,_this,matchValue1,enc,_1,enc1,_this1,_this2,x,_this3,_this4,x1,hiddenField,_this5,x2,_this6,_this7,submitButton,a,_this8,_this9,formAttrs,x3,f,form1,f1,formlet1;
       matchValue=conf.PostUrl;
       if(matchValue.$==0)
        {
         _=Runtime.New(T,{
          $:0
         });
        }
       else
        {
         url=matchValue.$0;
         _this=Default.Attr();
         _=List.ofArray([_this.NewAttr("action",url)]);
        }
       postUrl=_;
       matchValue1=conf.EncodingType;
       if(matchValue1.$==0)
        {
         _1=Runtime.New(T,{
          $:0
         });
        }
       else
        {
         enc1=matchValue1.$0;
         _this1=Default.Attr();
         _1=List.ofArray([_this1.NewAttr("enctype",enc1)]);
        }
       enc=_1;
       _this2=Default.Tags();
       _this3=Default.Attr();
       _this4=Default.Attr();
       x1=conf.ParameterName;
       x=List.ofArray([_this3.NewAttr("type","hidden"),_this4.NewAttr("name",x1)]);
       hiddenField=_this2.NewTag("input",x);
       _this5=Default.Tags();
       _this6=Default.Attr();
       _this7=Default.Attr();
       x2=List.ofArray([_this6.NewAttr("type","submit"),_this7.NewAttr("value","Submit")]);
       submitButton=_this5.NewTag("input",x2);
       _this8=Default.Attr();
       _this9=Default.Attr();
       a=Runtime.New(T,{
        $:1,
        $0:_this8.NewAttr("method","POST"),
        $1:Runtime.New(T,{
         $:1,
         $0:_this9.NewAttr("style","display:none"),
         $1:postUrl
        })
       });
       formAttrs=List.append(a,enc);
       x3=Operators.add(Default.Form(formAttrs),List.ofArray([hiddenField,submitButton]));
       f=function(form)
       {
        var matchValue2,_2,enc2,_3,value;
        matchValue2=conf.EncodingType;
        if(matchValue2.$==0)
         {
          _2=null;
         }
        else
         {
          enc2=matchValue2.$0;
          if(enc2==="multipart/form-data")
           {
            value=jQuery(form.get_Body()).attr("encoding","multipart/form-data");
            _3=void value;
           }
          else
           {
            _3=null;
           }
          _2=_3;
         }
        return _2;
       };
       Operators.OnAfterRender(f,x3);
       form1=x3;
       f1=function(value)
       {
        var data;
        data=JSON.stringify(value);
        jQuery(hiddenField.get_Body()).val(data);
        return jQuery(submitButton.get_Body()).click();
       };
       formlet1=Formlet.Map(f1,formlet);
       return Default.Div(List.ofArray([form1,formlet1]));
      },
      WithLabel:function(labelGen,formlet)
      {
       return Formlet.WithLabel({
        $:1,
        $0:labelGen
       },formlet);
      },
      WithLabelAbove:function(formlet)
      {
       var f;
       f=function(body)
       {
        var matchValue,label,_,l,el,Label;
        matchValue=body.Label;
        if(matchValue.$==0)
         {
          _=Default.Span(Runtime.New(T,{
           $:0
          }));
         }
        else
         {
          l=matchValue.$0;
          _=l(null);
         }
        label=_;
        el=Default.Table(List.ofArray([Default.TBody(List.ofArray([Default.TR(List.ofArray([Default.TD(List.ofArray([label]))])),Default.TR(List.ofArray([Default.TD(List.ofArray([body.Element]))]))]))]));
        Label={
         $:0
        };
        return Runtime.New(Body,{
         Element:el,
         Label:Label
        });
       };
       return Formlet.MapBody(f,formlet);
      },
      WithLabelAndInfo:function(label,info,formlet)
      {
       var lblTbl;
       lblTbl=function()
       {
        var x,_this,_this1;
        x=List.ofArray([Default.Text(label)]);
        _this=Default.Tags();
        _this1=Default.Attr();
        return Utils.InTable(List.ofArray([List.ofArray([_this.NewTag("label",x),Default.Span(List.ofArray([_this1.NewAttr("title",info),Default.Attr().Class("infoIcon")]))])]));
       };
       return Enhance.WithLabel(lblTbl,formlet);
      },
      WithLabelConfiguration:function(lc,formlet)
      {
       var x,l;
       x=Formlet.ApplyLayout(formlet);
       l=Data.Layout().LabelLayout(lc);
       return Formlet.WithLayout(l,x);
      },
      WithLabelLeft:function(formlet)
      {
       var f;
       f=function(body)
       {
        var matchValue,label,_,l,el,Label;
        matchValue=body.Label;
        if(matchValue.$==0)
         {
          _=Default.Span(Runtime.New(T,{
           $:0
          }));
         }
        else
         {
          l=matchValue.$0;
          _=l(null);
         }
        label=_;
        el=Default.Table(List.ofArray([Default.TBody(List.ofArray([Default.TR(List.ofArray([Default.TD(List.ofArray([body.Element])),Default.TD(List.ofArray([label]))]))]))]));
        Label={
         $:0
        };
        return Runtime.New(Body,{
         Element:el,
         Label:Label
        });
       };
       return Formlet.MapBody(f,formlet);
      },
      WithLegend:function(label,formlet)
      {
       var f;
       f=function(body)
       {
        var x,x1,_this,matchValue,_,label1,_this1,element;
        x1=List.ofArray([Default.Tags().text(label)]);
        _this=Default.Tags();
        matchValue=body.Label;
        if(matchValue.$==0)
         {
          _=body.Element;
         }
        else
         {
          label1=matchValue.$0;
          _=Utils.InTable(List.ofArray([List.ofArray([label1(null),body.Element])]));
         }
        x=List.ofArray([_this.NewTag("legend",x1),_]);
        _this1=Default.Tags();
        element=_this1.NewTag("fieldset",x);
        return Runtime.New(Body,{
         Element:element,
         Label:{
          $:0
         }
        });
       };
       return Formlet.MapBody(f,formlet);
      },
      WithResetAction:function(f,formlet)
      {
       var f1,x,l,x1,x2;
       f1=function()
       {
        var form,notify;
        form=formlet.Build();
        notify=function(o)
        {
         return f(null)?form.Notify.call(null,o):null;
        };
        return Runtime.New(Form,{
         Body:form.Body,
         Dispose1:form.Dispose1,
         Notify:notify,
         State:form.State
        });
       };
       x=Formlet.New(f1);
       l=formlet.get_Layout();
       x1=Formlet.WithLayout(l,x);
       x2=Data.PropagateRenderFrom(formlet,x1);
       return Data.OfIFormlet(x2);
      },
      WithResetButton:function(formlet)
      {
       return Enhance.WithCustomResetButton(FormButtonConfiguration.get_Default(),formlet);
      },
      WithResetFormlet:function(formlet,reset)
      {
       var formlet1,x,x1,x2,formlet2,button,_builder_,f,formlet3,f2,x3;
       formlet1=Formlet.WithLayoutOrDefault(formlet);
       x=Formlet.ApplyLayout(formlet1);
       x1=Formlet.InitWithFailure(x);
       x2=Formlet.LiftResult(x1);
       formlet2=Formlet.WithNotificationChannel(x2);
       button=Formlet.LiftResult(reset);
       _builder_=Formlet.Do();
       f=function(arg00)
       {
        return Result.Join(arg00);
       };
       formlet3=_builder_.Delay(function()
       {
        return _builder_.Bind(formlet2,Runtime.Tupled(function(_arg1)
        {
         var v,notify;
         v=_arg1[0];
         notify=_arg1[1];
         return _builder_.Bind(button,function(_arg2)
         {
          _arg2.$==0?notify(null):null;
          return _builder_.Return(v);
         });
        }));
       });
       f2=Formlet.MapResult(f,formlet3);
       x3=Data.PropagateRenderFrom(formlet2,f2);
       return Data.OfIFormlet(x3);
      },
      WithRowConfiguration:function(rc,formlet)
      {
       var x,l;
       x=Formlet.ApplyLayout(formlet);
       l=Data.Layout().RowLayout(rc);
       return Formlet.WithLayout(l,x);
      },
      WithSubmitAndReset:function(formlet,submReset)
      {
       var _builder_,f2,formlet3;
       _builder_=Formlet.Do();
       f2=_builder_.Delay(function()
       {
        var formlet1,formlet2;
        formlet1=Formlet.InitWithFailure(formlet);
        formlet2=Formlet.LiftResult(formlet1);
        return _builder_.Bind(Formlet.WithNotificationChannel(formlet2),Runtime.Tupled(function(_arg1)
        {
         var res,notify;
         res=_arg1[0];
         notify=_arg1[1];
         return _builder_.ReturnFrom((submReset(function(arg00)
         {
          return notify(arg00);
         }))(res));
        }));
       });
       formlet3=Data.PropagateRenderFrom(formlet,f2);
       return Data.OfIFormlet(formlet3);
      },
      WithSubmitAndResetButtons:function(formlet)
      {
       var inputRecord,submitConf,inputRecord1,resetConf;
       inputRecord=FormButtonConfiguration.get_Default();
       submitConf=Runtime.New(FormButtonConfiguration,{
        Label:{
         $:1,
         $0:"Submit"
        },
        Style:inputRecord.Style,
        Class:inputRecord.Class
       });
       inputRecord1=FormButtonConfiguration.get_Default();
       resetConf=Runtime.New(FormButtonConfiguration,{
        Label:{
         $:1,
         $0:"Reset"
        },
        Style:inputRecord1.Style,
        Class:inputRecord1.Class
       });
       return Enhance.WithCustomSubmitAndResetButtons(submitConf,resetConf,formlet);
      },
      WithSubmitButton:function(formlet)
      {
       return Enhance.WithCustomSubmitButton(FormButtonConfiguration.get_Default(),formlet);
      },
      WithSubmitFormlet:function(formlet,submit)
      {
       var _builder_,f,formlet1,f2,x;
       _builder_=Formlet.Do();
       f=function(arg00)
       {
        return Result.Join(arg00);
       };
       formlet1=_builder_.Delay(function()
       {
        var formlet2;
        formlet2=Formlet.InitWithFailure(formlet);
        return _builder_.Bind(Formlet.LiftResult(formlet2),function(_arg1)
        {
         return _builder_.Bind(submit(_arg1),function()
         {
          return _builder_.Return(_arg1);
         });
        });
       });
       f2=Formlet.MapResult(f,formlet1);
       x=Data.PropagateRenderFrom(formlet,f2);
       return Data.OfIFormlet(x);
      },
      WithTextLabel:function(label,formlet)
      {
       return Enhance.WithLabel(function()
       {
        var x,_this;
        x=List.ofArray([Default.Text(label)]);
        _this=Default.Tags();
        return _this.NewTag("label",x);
       },formlet);
      },
      WithValidationFrame:function(formlet)
      {
       return Enhance.WithCustomValidationFrame(ValidationFrameConfiguration.get_Default(),formlet);
      },
      WithValidationIcon:function(formlet)
      {
       return Enhance.WithCustomValidationIcon(ValidationIconConfiguration.get_Default(),formlet);
      },
      WrapFormlet:function(wrapper,formlet)
      {
       var f;
       f=function()
       {
        var formlet1,form,patternInput,body,panel;
        formlet1=Formlet.WithLayoutOrDefault(formlet);
        form=Formlet.BuildForm(formlet1);
        patternInput=formlet1.get_Layout().Apply.call(null,form.Body).$0;
        patternInput[1];
        body=patternInput[0];
        panel=(wrapper(form.State))(body);
        return[panel,function()
        {
         return form.Notify.call(null,null);
        },form.State];
       };
       return Data.MkFormlet(f);
      }
     },
     Formlet:{
      ApplyLayout:function(formlet)
      {
       var f2,formlet1;
       f2=Data.BaseFormlet().ApplyLayout(formlet);
       formlet1=Data.PropagateRenderFrom(formlet,f2);
       return Data.OfIFormlet(formlet1);
      },
      Bind:function(fl,f)
      {
       var objectArg,arg10,x1,x2;
       objectArg=Data.BaseFormlet();
       arg10=function(x)
       {
        var y;
        y=f(x);
        return y;
       };
       x1=objectArg.Bind(fl,arg10);
       x2=Data.PropagateRenderFrom(fl,x1);
       return Data.OfIFormlet(x2);
      },
      BindWith:function(compose,formlet,f)
      {
       var objectArg,arg20,x1,x2;
       objectArg=Data.BaseFormlet();
       arg20=function(x)
       {
        return f(x);
       };
       x1=objectArg.BindWith(compose,formlet,arg20);
       x2=Data.PropagateRenderFrom(formlet,x1);
       return Data.OfIFormlet(x2);
      },
      BuildForm:function(f)
      {
       return Data.BaseFormlet().BuildForm(f);
      },
      BuildFormlet:function(f)
      {
       return Data.MkFormlet(f);
      },
      Choose:function(fs)
      {
       var count,mapping,fs1,x1,f2,x5,arg00,x6,f3;
       count={
        contents:0
       };
       mapping=function(f)
       {
        var f1,formlet,formlet1;
        f1=function(x)
        {
         Operators1.Increment(count);
         return[x,count.contents];
        };
        formlet=Formlet.Map(f1,f);
        formlet1=Formlet.InitWithFailure(formlet);
        return Formlet.LiftResult(formlet1);
       };
       fs1=Seq.map(mapping,fs);
       x1=Formlet.Sequence(fs1);
       f2=function(xs)
       {
        var chooser,x2,projection,x3,x4,chooser1;
        chooser=function(x)
        {
         var _,v;
         if(x.$==0)
          {
           v=x.$0;
           _={
            $:1,
            $0:v
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
        x2=List.choose(chooser,xs);
        projection=Runtime.Tupled(function(tupledArg)
        {
         var ix;
         tupledArg[0];
         ix=tupledArg[1];
         return ix;
        });
        x3=List.sortBy(projection,x2);
        x4=List.rev(x3);
        chooser1=Runtime.Tupled(function(tupledArg)
        {
         var x;
         x=tupledArg[0];
         tupledArg[1];
         return{
          $:1,
          $0:x
         };
        });
        return Seq.tryPick(chooser1,x4);
       };
       x5=Formlet.Map(f2,x1);
       arg00=function(x)
       {
        return x.$==1;
       };
       x6=Data.Validator().Is(arg00,"",x5);
       f3=function(x)
       {
        return x.$0;
       };
       return Formlet.Map(f3,x6);
      },
      Delay:function(f)
      {
       var formlet;
       formlet=Data.BaseFormlet().Delay(function()
       {
        return f(null);
       });
       return Data.OfIFormlet(formlet);
      },
      Deletable:function(formlet)
      {
       var f2,formlet1;
       f2=Data.BaseFormlet().Deletable(formlet);
       formlet1=Data.PropagateRenderFrom(formlet,f2);
       return Data.OfIFormlet(formlet1);
      },
      Do:Runtime.Field(function()
      {
       return FormletBuilder.New();
      }),
      Empty:function()
      {
       var formlet;
       formlet=Data.BaseFormlet().Empty();
       return Data.OfIFormlet(formlet);
      },
      FailWith:function(fs)
      {
       var formlet;
       formlet=Data.BaseFormlet().FailWith(fs);
       return Data.OfIFormlet(formlet);
      },
      FlipBody:function(formlet)
      {
       var f2,formlet1;
       f2=Data.BaseFormlet().FlipBody(formlet);
       formlet1=Data.PropagateRenderFrom(formlet,f2);
       return Data.OfIFormlet(formlet1);
      },
      Flowlet:function(formlet)
      {
       var objectArg,arg00,x,x1;
       objectArg=Data.BaseFormlet();
       arg00=Data.Layout().get_Flowlet();
       x=objectArg.WithLayout(arg00,formlet);
       x1=Data.PropagateRenderFrom(formlet,x);
       return Data.OfIFormlet(x1);
      },
      Horizontal:function(formlet)
      {
       var objectArg,arg00,x,x1;
       objectArg=Data.BaseFormlet();
       arg00=Data.Layout().get_Horizontal();
       x=objectArg.WithLayout(arg00,formlet);
       x1=Data.PropagateRenderFrom(formlet,x);
       return Data.OfIFormlet(x1);
      },
      InitWith:function(value,formlet)
      {
       var objectArg,x,x1;
       objectArg=Data.BaseFormlet();
       x=objectArg.InitWith(value,formlet);
       x1=Data.PropagateRenderFrom(formlet,x);
       return Data.OfIFormlet(x1);
      },
      InitWithFailure:function(formlet)
      {
       var f2,formlet1;
       f2=Data.BaseFormlet().InitWithFailure(formlet);
       formlet1=Data.PropagateRenderFrom(formlet,f2);
       return Data.OfIFormlet(formlet1);
      },
      Join:function(formlet)
      {
       var f,x,objectArg,x1,x2;
       f=function(f1)
       {
        return f1;
       };
       x=Formlet.Map(f,formlet);
       objectArg=Data.BaseFormlet();
       x1=objectArg.Join(x);
       x2=Data.PropagateRenderFrom(formlet,x1);
       return Data.OfIFormlet(x2);
      },
      LiftResult:function(formlet)
      {
       var f2,formlet1;
       f2=Data.BaseFormlet().LiftResult(formlet);
       formlet1=Data.PropagateRenderFrom(formlet,f2);
       return Data.OfIFormlet(formlet1);
      },
      Map:function(f,formlet)
      {
       var objectArg,x,x1;
       objectArg=Data.BaseFormlet();
       x=objectArg.Map(f,formlet);
       x1=Data.PropagateRenderFrom(formlet,x);
       return Data.OfIFormlet(x1);
      },
      MapBody:function(f,formlet)
      {
       var objectArg,x,x1;
       objectArg=Data.BaseFormlet();
       x=objectArg.MapBody(f,formlet);
       x1=Data.PropagateRenderFrom(formlet,x);
       return Data.OfIFormlet(x1);
      },
      MapElement:function(f,formlet)
      {
       var objectArg,arg00,f2,formlet1;
       objectArg=Data.BaseFormlet();
       arg00=function(b)
       {
        return Runtime.New(Body,{
         Element:f(b.Element),
         Label:b.Label
        });
       };
       f2=objectArg.MapBody(arg00,formlet);
       formlet1=Data.PropagateRenderFrom(formlet,f2);
       return Data.OfIFormlet(formlet1);
      },
      MapResult:function(f,formlet)
      {
       var objectArg,x,x1;
       objectArg=Data.BaseFormlet();
       x=objectArg.MapResult(f,formlet);
       x1=Data.PropagateRenderFrom(formlet,x);
       return Data.OfIFormlet(x1);
      },
      Never:function()
      {
       var formlet;
       formlet=Data.BaseFormlet().Never();
       return Data.OfIFormlet(formlet);
      },
      New:function(f)
      {
       var formlet;
       formlet=Data.BaseFormlet().New(f);
       return Data.OfIFormlet(formlet);
      },
      OfElement:function(genElem)
      {
       var f;
       f=function()
       {
        var elem;
        elem=genElem(null);
        return[elem,function()
        {
        },Data.RX().Return(Runtime.New(Result,{
         $:0,
         $0:null
        }))];
       };
       return Data.MkFormlet(f);
      },
      Render:function(formlet)
      {
       var f2;
       f2=formlet.Run(function()
       {
       });
       return Data.PropagateRenderFrom(formlet,f2);
      },
      Replace:function(formlet,f)
      {
       var objectArg,arg10,x1,x2;
       objectArg=Data.BaseFormlet();
       arg10=function(x)
       {
        return f(x);
       };
       x1=objectArg.Replace(formlet,arg10);
       x2=Data.PropagateRenderFrom(formlet,x1);
       return Data.OfIFormlet(x2);
      },
      ReplaceFirstWithFailure:function(formlet)
      {
       var f2,formlet1;
       f2=Data.BaseFormlet().ReplaceFirstWithFailure(formlet);
       formlet1=Data.PropagateRenderFrom(formlet,f2);
       return Data.OfIFormlet(formlet1);
      },
      Return:function(x)
      {
       var formlet;
       formlet=Data.BaseFormlet().Return(x);
       return Data.OfIFormlet(formlet);
      },
      ReturnEmpty:function(x)
      {
       var formlet;
       formlet=Data.BaseFormlet().ReturnEmpty(x);
       return Data.OfIFormlet(formlet);
      },
      Run:function(f,formlet)
      {
       return formlet.Run(f);
      },
      SelectMany:function(formlet)
      {
       var f,x,objectArg,x1,x2;
       f=function(f1)
       {
        return f1;
       };
       x=Formlet.Map(f,formlet);
       objectArg=Data.BaseFormlet();
       x1=objectArg.SelectMany(x);
       x2=Data.PropagateRenderFrom(formlet,x1);
       return Data.OfIFormlet(x2);
      },
      Sequence:function(fs)
      {
       var mapping,x1,objectArg,x2;
       mapping=function(x)
       {
        return x;
       };
       x1=Seq.map(mapping,fs);
       objectArg=Data.BaseFormlet();
       x2=objectArg.Sequence(x1);
       return Data.OfIFormlet(x2);
      },
      Switch:function(formlet)
      {
       var f,x,objectArg,x1,x2;
       f=function(f1)
       {
        return f1;
       };
       x=Formlet.Map(f,formlet);
       objectArg=Data.BaseFormlet();
       x1=objectArg.Switch(x);
       x2=Data.PropagateRenderFrom(formlet,x1);
       return Data.OfIFormlet(x2);
      },
      Vertical:function(formlet)
      {
       var objectArg,arg00,x,x1;
       objectArg=Data.BaseFormlet();
       arg00=Data.Layout().get_Vertical();
       x=objectArg.WithLayout(arg00,formlet);
       x1=Data.PropagateRenderFrom(formlet,x);
       return Data.OfIFormlet(x1);
      },
      WithCancelation:function(formlet,c)
      {
       var objectArg,x,x1;
       objectArg=Data.BaseFormlet();
       x=objectArg.WithCancelation(formlet,c);
       x1=Data.PropagateRenderFrom(formlet,x);
       return Data.OfIFormlet(x1);
      },
      WithLabel:function(label,formlet)
      {
       var objectArg,arg00,f2,formlet1;
       objectArg=Data.BaseFormlet();
       arg00=function(body)
       {
        return Runtime.New(Body,{
         Element:body.Element,
         Label:label
        });
       };
       f2=objectArg.MapBody(arg00,formlet);
       formlet1=Data.PropagateRenderFrom(formlet,f2);
       return Data.OfIFormlet(formlet1);
      },
      WithLayout:function(l,formlet)
      {
       var objectArg,x,x1;
       objectArg=Data.BaseFormlet();
       x=objectArg.WithLayout(l,formlet);
       x1=Data.PropagateRenderFrom(formlet,x);
       return Data.OfIFormlet(x1);
      },
      WithLayoutOrDefault:function(formlet)
      {
       var f2,formlet1;
       f2=Data.BaseFormlet().WithLayoutOrDefault(formlet);
       formlet1=Data.PropagateRenderFrom(formlet,f2);
       return Data.OfIFormlet(formlet1);
      },
      WithNotification:function(c,formlet)
      {
       var objectArg,x,x1;
       objectArg=Data.BaseFormlet();
       x=objectArg.WithNotification(c,formlet);
       x1=Data.PropagateRenderFrom(formlet,x);
       return Data.OfIFormlet(x1);
      },
      WithNotificationChannel:function(formlet)
      {
       var f2,formlet1;
       f2=Data.BaseFormlet().WithNotificationChannel(formlet);
       formlet1=Data.PropagateRenderFrom(formlet,f2);
       return Data.OfIFormlet(formlet1);
      }
     },
     FormletBuilder:Runtime.Class({
      Bind:function(formlet,f)
      {
       var objectArg,arg10,x1,x2;
       objectArg=Data.BaseFormlet();
       arg10=function(x)
       {
        var y;
        y=f(x);
        return y;
       };
       x1=objectArg.Bind(formlet,arg10);
       x2=Data.PropagateRenderFrom(formlet,x1);
       return Data.OfIFormlet(x2);
      },
      Delay:function(f)
      {
       var formlet;
       formlet=Data.BaseFormlet().Delay(function(x)
       {
        return f(x);
       });
       return Data.OfIFormlet(formlet);
      },
      Return:function(x)
      {
       var formlet;
       formlet=Data.BaseFormlet().Return(x);
       return Data.OfIFormlet(formlet);
      },
      ReturnFrom:function(f)
      {
       return Data.OfIFormlet(f);
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     Layout:{
      FormRowConfiguration:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(FormRowConfiguration,{
         Padding:{
          $:0
         },
         Color:{
          $:0
         },
         Class:{
          $:0
         },
         Style:{
          $:0
         },
         LabelConfiguration:{
          $:0
         }
        });
       }
      }),
      LabelConfiguration:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(LabelConfiguration,{
         Align:{
          $:0
         },
         VerticalAlign:{
          $:1
         },
         Placement:{
          $:0
         }
        });
       }
      }),
      Padding:Runtime.Class({},{
       get_Default:function()
       {
        return Runtime.New(Padding1,{
         Left:{
          $:0
         },
         Right:{
          $:0
         },
         Top:{
          $:0
         },
         Bottom:{
          $:0
         }
        });
       }
      })
     },
     LayoutProvider:Runtime.Class({
      ColumnLayout:function(rowConfig)
      {
       var objectArg,arg00,_this=this;
       objectArg=this.LayoutUtils;
       arg00=function()
       {
        var row,container,store,insert,remove;
        row=Default.TR(Runtime.New(T,{
         $:0
        }));
        container=Default.Table(List.ofArray([Default.TBody(List.ofArray([row]))]));
        store=ElementStore.NewElementStore();
        insert=function(rowIx)
        {
         return function(body)
         {
          var elemId,newCol,jqPanel,index,inserted;
          elemId=body.Element.get_Id();
          newCol=Default.TD(List.ofArray([Default.Table(List.ofArray([Default.TBody(List.ofArray([_this.MakeRow(rowConfig,rowIx,body)]))]))]));
          jqPanel=jQuery(row.get_Body());
          index={
           contents:0
          };
          inserted={
           contents:false
          };
          jqPanel.children().each(function()
          {
           var jqCol,_;
           jqCol=jQuery(this);
           if(rowIx===index.contents)
            {
             jQuery(newCol.get_Body()).insertBefore(jqCol);
             newCol.Render();
             _=void(inserted.contents=true);
            }
           else
            {
             _=null;
            }
           return Operators1.Increment(index);
          });
          !inserted.contents?row.AppendI(newCol):null;
          return store.RegisterElement(elemId,function()
          {
           return newCol["HtmlProvider@33"].Remove(newCol.get_Body());
          });
         };
        };
        remove=function(elems)
        {
         var enumerator,b;
         enumerator=Enumerator.Get(elems);
         while(enumerator.MoveNext())
          {
           b=enumerator.get_Current();
           store.Remove(b.Element.get_Id());
          }
         return;
        };
        return{
         Body:Runtime.New(Body,{
          Element:container,
          Label:{
           $:0
          }
         }),
         SyncRoot:null,
         Insert:insert,
         Remove:remove
        };
       };
       return objectArg.New(arg00);
      },
      HorizontalAlignElem:function(align,el)
      {
       var _float,_this,x;
       _float=align.$==0?"left":"right";
       _this=Default.Attr();
       x="float:"+_float+";";
       return Operators.add(Default.Div(List.ofArray([_this.NewAttr("style",x)])),List.ofArray([el]));
      },
      LabelLayout:function(lc)
      {
       var inputRecord,LabelConfiguration1;
       inputRecord=FormRowConfiguration.get_Default();
       LabelConfiguration1={
        $:1,
        $0:lc
       };
       return this.RowLayout(Runtime.New(FormRowConfiguration,{
        Padding:inputRecord.Padding,
        Color:inputRecord.Color,
        Class:inputRecord.Class,
        Style:inputRecord.Style,
        LabelConfiguration:LabelConfiguration1
       }));
      },
      MakeLayout:function(lm)
      {
       var objectArg,arg00;
       objectArg=this.LayoutUtils;
       arg00=function()
       {
        var lm1,store,insert,remove;
        lm1=lm(null);
        store=ElementStore.NewElementStore();
        insert=function(ix)
        {
         return function(bd)
         {
          var elemId,newElems;
          elemId=bd.Element.get_Id();
          newElems=(lm1.Insert.call(null,ix))(bd);
          return store.RegisterElement(elemId,function()
          {
           var enumerator,e;
           enumerator=Enumerator.Get(newElems);
           while(enumerator.MoveNext())
            {
             e=enumerator.get_Current();
             e["HtmlProvider@33"].Remove(e.get_Body());
            }
           return;
          });
         };
        };
        remove=function(elems)
        {
         var enumerator,b;
         enumerator=Enumerator.Get(elems);
         while(enumerator.MoveNext())
          {
           b=enumerator.get_Current();
           store.Remove(b.Element.get_Id());
          }
         return;
        };
        return{
         Body:Runtime.New(Body,{
          Element:lm1.Panel,
          Label:{
           $:0
          }
         }),
         SyncRoot:null,
         Insert:insert,
         Remove:remove
        };
       };
       return objectArg.New(arg00);
      },
      MakeRow:function(rowConfig,rowIndex,body)
      {
       var x,d,f,padding,f1,o,paddingLeft,f2,o1,paddingTop,f3,o2,paddingRight,f4,o3,paddingBottom,makeCell,elem1,matchValue,cells,_1,labelGen,x5,d1,f6,labelConf,arg00,arg10,label,matchValue1,_2,x6,x7,x8,d2,f7,rowClass,x9,d3,f8,rowColorStyleProp,xa,d4,f9,rowStyleProp,matchValue2,rowStyle,_3,arg002,_this2,b2,b3,xb;
       x=rowConfig.Padding;
       d=Padding1.get_Default();
       f=function(x1)
       {
        return x1;
       };
       padding=Utils.Maybe(d,f,x);
       f1=function(x1)
       {
        return x1;
       };
       o=padding.Left;
       paddingLeft=Utils.Maybe(0,f1,o);
       f2=function(x1)
       {
        return x1;
       };
       o1=padding.Top;
       paddingTop=Utils.Maybe(0,f2,o1);
       f3=function(x1)
       {
        return x1;
       };
       o2=padding.Right;
       paddingRight=Utils.Maybe(0,f3,o2);
       f4=function(x1)
       {
        return x1;
       };
       o3=padding.Bottom;
       paddingBottom=Utils.Maybe(0,f4,o3);
       makeCell=function(l)
       {
        return function(t)
        {
         return function(r)
         {
          return function(b)
          {
           return function(csp)
           {
            return function(valign)
            {
             return function(elem)
             {
              var x1,mapping,reduction,source,paddingStyle,f5,valignStyle,_this,x3,style,colSpan,_,_this1,a,b1,x4;
              x1=List.ofArray([["padding-left: ",l],["padding-top: ",t],["padding-right: ",r],["padding-bottom: ",b]]);
              mapping=Runtime.Tupled(function(tupledArg)
              {
               var k,v;
               k=tupledArg[0];
               v=tupledArg[1];
               return k+Global.String(v)+"px;";
              });
              reduction=function(x2)
              {
               return function(y)
               {
                return x2+y;
               };
              };
              source=List.map(mapping,x1);
              paddingStyle=Seq.reduce(reduction,source);
              f5=function(valign1)
              {
               var value;
               value=valign1.$==1?"middle":valign1.$==2?"bottom":"top";
               return"vertical-align: "+value+";";
              };
              valignStyle=Utils.Maybe("",f5,valign);
              _this=Default.Attr();
              x3=paddingStyle+";"+valignStyle;
              style=_this.NewAttr("style",x3);
              if(csp)
               {
                _this1=Default.Attr();
                _=List.ofArray([_this1.NewAttr("colspan","2")]);
               }
              else
               {
                _=Runtime.New(T,{
                 $:0
                });
               }
              colSpan=_;
              a=Runtime.New(T,{
               $:1,
               $0:style,
               $1:colSpan
              });
              b1=List.ofArray([elem]);
              x4=List.append(a,b1);
              return Default.TD(x4);
             };
            };
           };
          };
         };
        };
       };
       elem1=body.Element;
       matchValue=body.Label;
       if(matchValue.$==1)
        {
         labelGen=matchValue.$0;
         x5=rowConfig.LabelConfiguration;
         d1=LabelConfiguration.get_Default();
         f6=function(x1)
         {
          return x1;
         };
         labelConf=Utils.Maybe(d1,f6,x5);
         arg00=labelConf.Align;
         arg10=labelGen(null);
         label=this.HorizontalAlignElem(arg00,arg10);
         matchValue1=labelConf.Placement;
         if(matchValue1.$==3)
          {
           x6=Utils.InTable(List.ofArray([List.ofArray([elem1]),List.ofArray([label])]));
           _2=List.ofArray([((((((makeCell(paddingLeft))(paddingTop))(paddingRight))(paddingBottom))(true))({
            $:0
           }))(x6)]);
          }
         else
          {
           if(matchValue1.$==0)
            {
             _2=List.ofArray([((((((makeCell(paddingLeft))(paddingTop))(0))(paddingBottom))(false))({
              $:1,
              $0:labelConf.VerticalAlign
             }))(label),((((((makeCell(0))(paddingTop))(paddingRight))(paddingBottom))(false))({
              $:0
             }))(elem1)]);
            }
           else
            {
             if(matchValue1.$==1)
              {
               _2=List.ofArray([((((((makeCell(paddingLeft))(paddingTop))(0))(paddingBottom))(false))({
                $:1,
                $0:labelConf.VerticalAlign
               }))(elem1),((((((makeCell(0))(paddingTop))(paddingRight))(paddingBottom))(false))({
                $:0
               }))(label)]);
              }
             else
              {
               x7=Utils.InTable(List.ofArray([List.ofArray([label]),List.ofArray([elem1])]));
               _2=List.ofArray([((((((makeCell(paddingLeft))(paddingTop))(paddingRight))(paddingBottom))(true))({
                $:0
               }))(x7)]);
              }
            }
          }
         _1=_2;
        }
       else
        {
         _1=List.ofArray([((((((makeCell(paddingLeft))(paddingTop))(paddingRight))(paddingBottom))(true))({
          $:0
         }))(elem1)]);
        }
       cells=_1;
       x8=rowConfig.Class;
       d2=Runtime.New(T,{
        $:0
       });
       f7=function(classGen)
       {
        var arg001;
        arg001=classGen(rowIndex);
        return List.ofArray([Default.Attr().Class(arg001)]);
       };
       rowClass=Utils.Maybe(d2,f7,x8);
       x9=rowConfig.Color;
       d3=Runtime.New(T,{
        $:0
       });
       f8=function(colGen)
       {
        var col;
        col=colGen(rowIndex);
        return List.ofArray(["background-color: "+col]);
       };
       rowColorStyleProp=Utils.Maybe(d3,f8,x9);
       xa=rowConfig.Style;
       d4=Runtime.New(T,{
        $:0
       });
       f9=function(styleGen)
       {
        return List.ofArray([styleGen(rowIndex)]);
       };
       rowStyleProp=Utils.Maybe(d4,f9,xa);
       matchValue2=List.append(rowColorStyleProp,rowStyleProp);
       if(matchValue2.$==0)
        {
         _3=Runtime.New(T,{
          $:0
         });
        }
       else
        {
         arg002=Seq.reduce(function(x1)
         {
          return function(y)
          {
           return x1+";"+y;
          };
         },matchValue2);
         _this2=Default.Attr();
         _3=List.ofArray([_this2.NewAttr("style",arg002)]);
        }
       rowStyle=_3;
       b2=List.append(rowStyle,cells);
       b3=List.append(rowStyle,b2);
       xb=List.append(rowClass,b3);
       return Default.TR(xb);
      },
      RowLayout:function(rowConfig)
      {
       var objectArg,arg00,_this=this;
       objectArg=this.LayoutUtils;
       arg00=function()
       {
        var panel,container,store,insert,remove;
        panel=Default.TBody(Runtime.New(T,{
         $:0
        }));
        container=Default.Table(List.ofArray([panel]));
        store=ElementStore.NewElementStore();
        insert=function(rowIx)
        {
         return function(body)
         {
          var elemId,row,jqPanel,index,inserted;
          elemId=body.Element.get_Id();
          row=_this.MakeRow(rowConfig,rowIx,body);
          jqPanel=jQuery(panel.get_Body());
          index={
           contents:0
          };
          inserted={
           contents:false
          };
          jqPanel.children().each(function()
          {
           var jqRow,_;
           jqRow=jQuery(this);
           if(rowIx===index.contents)
            {
             jQuery(row.get_Body()).insertBefore(jqRow);
             row.Render();
             _=void(inserted.contents=true);
            }
           else
            {
             _=null;
            }
           return Operators1.Increment(index);
          });
          !inserted.contents?panel.AppendI(row):null;
          return store.RegisterElement(elemId,function()
          {
           return row["HtmlProvider@33"].Remove(row.get_Body());
          });
         };
        };
        remove=function(elems)
        {
         var enumerator,b;
         enumerator=Enumerator.Get(elems);
         while(enumerator.MoveNext())
          {
           b=enumerator.get_Current();
           store.Remove(b.Element.get_Id());
          }
         return;
        };
        return{
         Body:Runtime.New(Body,{
          Element:container,
          Label:{
           $:0
          }
         }),
         SyncRoot:null,
         Insert:insert,
         Remove:remove
        };
       };
       return objectArg.New(arg00);
      },
      VerticalAlignedTD:function(valign,elem)
      {
       var valign1,cell,objectArg,arg00;
       valign1=valign.$==1?"middle":valign.$==2?"bottom":"top";
       cell=Default.TD(List.ofArray([elem]));
       objectArg=cell["HtmlProvider@33"];
       arg00=cell.get_Body();
       objectArg.SetCss(arg00,"vertical-align",valign1);
       return cell;
      },
      get_Flowlet:function()
      {
       var lm;
       lm=function()
       {
        var panel,insert;
        panel=Default.Div(Runtime.New(T,{
         $:0
        }));
        insert=function()
        {
         return function(bd)
         {
          var label,nextScreen;
          label=bd.Label.$==1?bd.Label.$0.call(null,null):Default.Span(Runtime.New(T,{
           $:0
          }));
          nextScreen=Utils.InTable(List.ofArray([List.ofArray([label,Default.Div(List.ofArray([bd.Element]))])]));
          panel["HtmlProvider@33"].Clear(panel.get_Body());
          panel.AppendI(nextScreen);
          return List.ofArray([nextScreen]);
         };
        };
        return{
         Insert:insert,
         Panel:panel
        };
       };
       return this.MakeLayout(lm);
      },
      get_Horizontal:function()
      {
       return this.ColumnLayout(FormRowConfiguration.get_Default());
      },
      get_Vertical:function()
      {
       return this.RowLayout(FormRowConfiguration.get_Default());
      }
     },{
      New:function(LayoutUtils1)
      {
       var r;
       r=Runtime.New(this,{});
       r.LayoutUtils=LayoutUtils1;
       return r;
      }
     }),
     Utils:{
      InTable:function(rows)
      {
       var mapping,rs,tb;
       mapping=function(cols)
       {
        var mapping1,xs;
        mapping1=function(c)
        {
         return Default.TD(List.ofArray([c]));
        };
        xs=List.map(mapping1,cols);
        return Default.TR(xs);
       };
       rs=List.map(mapping,rows);
       tb=Default.TBody(rs);
       return Default.Table(List.ofArray([tb]));
      },
      MapOption:function(f,value)
      {
       var _,v;
       if(value.$==1)
        {
         v=value.$0;
         _={
          $:1,
          $0:f(v)
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      },
      Maybe:function(d,f,o)
      {
       var _,x;
       if(o.$==0)
        {
         _=d;
        }
       else
        {
         x=o.$0;
         _=f(x);
        }
       return _;
      }
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  Formlets=Runtime.Safe(WebSharper.Formlets);
  Body=Runtime.Safe(Formlets.Body);
  Html=Runtime.Safe(WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Default=Runtime.Safe(Client.Default);
  List=Runtime.Safe(WebSharper.List);
  Controls=Runtime.Safe(Formlets.Controls);
  Reactive=Runtime.Safe(Global.IntelliFactory.Reactive);
  HotStream=Runtime.Safe(Reactive.HotStream);
  Formlets1=Runtime.Safe(Global.IntelliFactory.Formlets);
  Base=Runtime.Safe(Formlets1.Base);
  Result=Runtime.Safe(Base.Result);
  T=Runtime.Safe(List.T);
  Operators=Runtime.Safe(Client.Operators);
  jQuery=Runtime.Safe(Global.jQuery);
  EventsPervasives=Runtime.Safe(Client.EventsPervasives);
  Data=Runtime.Safe(Formlets.Data);
  Formlet=Runtime.Safe(Formlets.Formlet);
  Operators1=Runtime.Safe(WebSharper.Operators);
  CssConstants=Runtime.Safe(Formlets.CssConstants);
  Math=Runtime.Safe(Global.Math);
  Seq=Runtime.Safe(WebSharper.Seq);
  Utils=Runtime.Safe(Formlets.Utils);
  Tree=Runtime.Safe(Base.Tree);
  Edit=Runtime.Safe(Tree.Edit);
  Form=Runtime.Safe(Base.Form);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  IntrinsicFunctionProxy=Runtime.Safe(WebSharper.IntrinsicFunctionProxy);
  FormletProvider=Runtime.Safe(Base.FormletProvider);
  Formlet1=Runtime.Safe(Data.Formlet);
  Pagelet=Runtime.Safe(Client.Pagelet);
  Util=Runtime.Safe(WebSharper.Util);
  LayoutProvider=Runtime.Safe(Formlets.LayoutProvider);
  LayoutUtils=Runtime.Safe(Base.LayoutUtils);
  Reactive1=Runtime.Safe(Reactive.Reactive);
  Validator=Runtime.Safe(Base.Validator);
  ValidatorProvidor=Runtime.Safe(Data.ValidatorProvidor);
  RegExp=Runtime.Safe(Global.RegExp);
  Collections=Runtime.Safe(WebSharper.Collections);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  ElementStore=Runtime.Safe(Formlets.ElementStore);
  Enhance=Runtime.Safe(Formlets.Enhance);
  FormButtonConfiguration=Runtime.Safe(Enhance.FormButtonConfiguration);
  FormContainerConfiguration=Runtime.Safe(Enhance.FormContainerConfiguration);
  Padding=Runtime.Safe(Enhance.Padding);
  ManyConfiguration=Runtime.Safe(Enhance.ManyConfiguration);
  ValidationFrameConfiguration=Runtime.Safe(Enhance.ValidationFrameConfiguration);
  ValidationIconConfiguration=Runtime.Safe(Enhance.ValidationIconConfiguration);
  JSON=Runtime.Safe(Global.JSON);
  FormletBuilder=Runtime.Safe(Formlets.FormletBuilder);
  Layout=Runtime.Safe(Formlets.Layout);
  FormRowConfiguration=Runtime.Safe(Layout.FormRowConfiguration);
  LabelConfiguration=Runtime.Safe(Layout.LabelConfiguration);
  Padding1=Runtime.Safe(Layout.Padding);
  return Enumerator=Runtime.Safe(WebSharper.Enumerator);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(Formlet1,Pagelet);
  Formlet.Do();
  Data.Validator();
  Data.RX();
  Data.Layout();
  Data.DefaultLayout();
  CssConstants.InputTextClass();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,WebSharper,UI,Next,Interpolation,Easing,AnimatedBobsleighSite,An,Trans1,Var1,Doc,List,Html,Utilities,T,View1,Attr,View,Unchecked,Samples,AnimatedContactFlow,Flow1,Flow,BobsleighSite,Calculator,Var,CheckBoxTest,Seq,Person,Site,SimpleTextBox,InputTransform,TodoList,PhoneExample,EditablePersonList,ContactFlow,MessageBoard,RoutedBobsleighSite,ObjectConstancy,MouseInfo,KeyboardInfo,Common,Fresh,String,Strings,IntrinsicFunctionProxy,Input,Keyboard,Auth,Server,Concurrency,Mouse,jQuery,DataSet,Arrays,OperatorIntrinsics,SvgElements,Math,Phone,Operators,Order,RouteMap,Builder,Router,SiteCommon,Elements,Router1,Option,Collections,MapModule,FSharpMap,SortableBarChart,parseFloat,ListModel1,Util,TodoItem,Key,ListModel,Client;
 Runtime.Define(Global,{
  IntelliFactory:{
   WebSharper:{
    UI:{
     Next:{
      AnimatedBobsleighSite:{
       Fade:Runtime.Field(function()
       {
        var _arg00_45_6,_arg10_45_6,arg20;
        _arg00_45_6=Interpolation.get_Double();
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
        },Trans1.Create(AnimatedBobsleighSite.Fade())));
       }),
       GlobalGo:function(_var,act)
       {
        return Var1.Set(_var,act);
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
        m=Var1.Create({
         $:0
        });
        ctx={
         Go:function(arg10)
         {
          return Var1.Set(m,arg10);
         }
        };
        return Doc.EmbedView(View1.Map(function(pg)
        {
         return AnimatedBobsleighSite.MakePage(m,pg.$==1?AnimatedBobsleighSite.History(ctx):pg.$==2?AnimatedBobsleighSite.Governance(ctx):pg.$==3?AnimatedBobsleighSite.Team(ctx):AnimatedBobsleighSite.HomePage(ctx));
        },View1.FromVar(m)));
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
        x=View1.FromVar(_var);
        return Doc.EmbedView(View1.Map(function(active)
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
        return Doc.Concat(List.ofArray([Html.Div0(List.ofArray([Html.H10(List.ofArray([Utilities.txt("The IntelliFactory Bobsleigh Team")])),Html.P0(List.ofArray([Utilities.txt("The world-famous IntelliFactory Bobsleigh Team was founded in 2004, and currently consists of:")])),Html.UL0(List.ofArray([Doc.Concat(List.map(Runtime.Tupled(function(tupledArg)
        {
         return Html.LI0(List.ofArray([Utilities.href(tupledArg[0],"http://www.twitter.com/"+tupledArg[1])]));
        }),teamMembers))]))]))]));
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
        _builder_=Flow1.get_Do();
        return Flow.Embed(_builder_.Bind(AnimatedContactFlow.personFlowlet(),function(_arg1)
        {
         return _builder_.Bind(AnimatedContactFlow.contactTypeFlowlet(),function(_arg2)
         {
          return _builder_.Bind(AnimatedContactFlow.contactFlowlet(_arg2),function(_arg3)
          {
           return _builder_.ReturnFrom(Flow.Static(AnimatedContactFlow.finalPage(_arg1,_arg3)));
          });
         });
        }));
       },
       Fade:Runtime.Field(function()
       {
        var _arg00_58_11,_arg10_58_11,arg20;
        _arg00_58_11=Interpolation.get_Double();
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
        },Trans1.Create(AnimatedContactFlow.Fade())));
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
        _arg00_73_9=Interpolation.get_Double();
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
        },Trans1.Create(AnimatedContactFlow.Swipe()));
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
         rvContact=Var1.Create("");
         arg20=function()
         {
          return cont(constr(Var1.Get(rvContact)));
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
         rvName=Var1.Create("");
         rvAddress=Var1.Create("");
         arg20=function()
         {
          return cont({
           Name:Var1.Get(rvName),
           Address:Var1.Get(rvAddress)
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
        return Var1.Set(_var,act);
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
        m=Var1.Create({
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
          return Var1.Set(m,arg10);
         }
        };
        return Doc.EmbedView(View1.Map(function(pg)
        {
         return pg.$==1?withNavbar(BobsleighSite.History(ctx)):pg.$==2?withNavbar(BobsleighSite.Governance(ctx)):pg.$==3?withNavbar(BobsleighSite.Team(ctx)):withNavbar(BobsleighSite.HomePage(ctx));
        },View1.FromVar(m)));
       },
       NavBar:function(_var)
       {
        var x;
        x=View1.FromVar(_var);
        return Doc.EmbedView(View1.Map(function(active)
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
        return Doc.Concat(List.ofArray([Html.Div0(List.ofArray([Html.H10(List.ofArray([Utilities.txt("The IntelliFactory Bobsleigh Team")])),Html.P0(List.ofArray([Utilities.txt("The world-famous IntelliFactory Bobsleigh Team was founded in 2004, and currently consists of:")])),Html.UL0(List.ofArray([Doc.Concat(List.map(Runtime.Tupled(function(tupledArg)
        {
         return Html.LI0(List.ofArray([Utilities.href(tupledArg[0],"http://www.twitter.com/"+tupledArg[1])]));
        }),teamMembers))]))]))]));
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
        return Calculator.calcView(Var1.Create(Calculator.initCalc()));
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
         return Var1.Set(rvCalc,Calculator.initCalc());
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
        rviCalc=View1.FromVar(rvCalc);
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
        return Var.Update(rvCalc,function(c)
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
        return View1.Map(function(c)
        {
         return Global.String(c.Operand);
        },View1.FromVar(rvCalc));
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
        return Var.Update(rvCalc,function(c)
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
        return Var.Update(rvCalc,function(c)
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
        selPeople=Var1.Create(Runtime.New(T,{
         $:0
        }));
        checkBoxes=Html.Div0(List.ofArray([Doc.Concat(List.map(function(person)
        {
         return Html.Div0(List.ofArray([Doc.CheckBox(Runtime.New(T,{
          $:0
         }),person,selPeople),Doc.TextNode(person.Name)]));
        },CheckBoxTest.People()))]));
        showNames=function(xs)
        {
         var f;
         f=function(acc)
         {
          return function(p)
          {
           return acc+p.Name+", ";
          };
         };
         return Seq.fold(f,"",xs);
        };
        arg10=View1.FromVar(selPeople);
        x=View1.Map(showNames,arg10);
        label=Doc.TextView(x);
        checkBoxSection=Html.Div0(List.ofArray([checkBoxes,label]));
        radioBoxVar=Var1.Create({
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
        }]))),Doc.TextView(View1.Map(function(_arg1)
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
         Posts:Var1.Create(Runtime.New(T,{
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
        _builder_=Flow1.get_Do();
        return Flow.Embed(_builder_.Bind(ContactFlow.personFlowlet(),function(_arg1)
        {
         return _builder_.Bind(ContactFlow.contactTypeFlowlet(),function(_arg2)
         {
          return _builder_.Bind(ContactFlow.contactFlowlet(_arg2),function(_arg3)
          {
           return _builder_.ReturnFrom(Flow.Static(ContactFlow.finalPage(_arg1,_arg3)));
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
         rvContact=Var1.Create("");
         arg20=function()
         {
          return cont(constr(Var1.Get(rvContact)));
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
         rvName=Var1.Create("");
         rvAddress=Var1.Create("");
         arg20=function()
         {
          return cont({
           Name:Var1.Get(rvName),
           Address:Var1.Get(rvAddress)
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
         FirstName:Var1.Create(first),
         LastName:Var1.Create(last)
        };
       },
       memberList:Runtime.Field(function()
       {
        return Html.Div0(List.ofArray([Html.UL0(List.ofArray([Doc.Concat(List.map(function(person)
        {
         return Html.LI0(List.ofArray([Doc.EmbedView(View1.Map2(function(f)
         {
          return function(l)
          {
           return Utilities.txt(f+" "+l);
          };
         },View1.FromVar(person.FirstName),View1.FromVar(person.LastName)))]));
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
        rvText=Var1.Create("");
        inputField=Html.Div(List.ofArray([Utilities.cls("panel"),Utilities.cls("panel-default")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("panel-heading")]),List.ofArray([Html.H3(List.ofArray([Utilities.cls("panel-title")]),List.ofArray([Doc.TextNode("Input")]))])),Html.Div(List.ofArray([Utilities.cls("panel-body")]),List.ofArray([Html.Form(List.ofArray([Utilities.cls("form-horizontal"),Utilities.op_EqualsEqualsGreater("role","form")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Label(List.ofArray([Utilities.cls("col-sm-2"),Utilities.cls("control-label"),Utilities.op_EqualsEqualsGreater("for","inputBox")]),List.ofArray([Doc.TextNode("Write something: ")])),Html.Div(List.ofArray([Utilities.cls("col-sm-10")]),List.ofArray([Doc.Input(List.ofArray([Utilities.op_EqualsEqualsGreater("class","form-control"),Utilities.op_EqualsEqualsGreater("id","inputBox")]),rvText)]))]))]))]))]));
        view=View1.FromVar(rvText);
        viewCaps=View1.Map(function(s)
        {
         return s.toUpperCase();
        },view);
        viewReverse=View1.Map(function(s)
        {
         return String.fromCharCode.apply(undefined,Strings.ToCharArray(s).slice().reverse());
        },view);
        viewWordCount=View1.Map(function(s)
        {
         var sep,_this;
         sep=[32];
         _this=Strings.SplitChars(s,sep,1);
         return IntrinsicFunctionProxy.GetLength(_this);
        },view);
        viewWordCountStr=View1.Map(function(value)
        {
         return Global.String(value);
        },viewWordCount);
        viewWordOddEven=View1.Map(function(i)
        {
         return i%2===0?"Even":"Odd";
        },viewWordCount);
        views=List.ofArray([["Entered Text",view],["Capitalised",viewCaps],["Reversed",viewReverse],["Word Count",viewWordCountStr],["Is the word count odd or even?",viewWordOddEven]]);
        tableRow=Runtime.Tupled(function(tupledArg)
        {
         var view1;
         view1=tupledArg[1];
         return Html.TR0(List.ofArray([Html.TD0(List.ofArray([Doc.TextNode(tupledArg[0])])),Html.TD(List.ofArray([Utilities.sty("width","70%")]),List.ofArray([Doc.TextView(view1)]))]));
        });
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
        return Html.Div0(List.ofArray([Html.P0(List.ofArray([Doc.TextNode("Keys pressed (key codes): "),Doc.TextView(View1.Map(function(xs)
        {
         return KeyboardInfo.commaList(List.map(function(value)
         {
          return Global.String(value);
         },xs));
        },KeyboardInfo.keys()))])),Html.P0(List.ofArray([Doc.TextNode("Keys pressed: "),Doc.TextView(View1.Map(function(xs)
        {
         return KeyboardInfo.commaList(List.map(function(c)
         {
          return KeyboardInfo.ToChar(c);
         },xs));
        },KeyboardInfo.keys()))])),Html.P0(List.ofArray([Doc.TextNode("Last pressed key: "),Doc.TextView(View1.Map(function(value)
        {
         return Global.String(value);
        },Keyboard.get_LastPressed()))])),Html.P0(List.ofArray([Doc.TextNode("Is 'A' pressed? "),Doc.TextView(View1.Map(function(x)
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
         loggedIn=Var1.Create({
          $:0
         });
         hidden=Var1.Create(true);
         hide=function()
         {
          return hidden.set_Value(true);
         };
         show=function()
         {
          return hidden.set_Value(false);
         };
         x=hidden.get_View();
         loginForm=Html.Div(List.ofArray([Attr.DynamicStyle("display",View1.Map(function(yes)
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
         rvUser=Var1.Create("");
         rvPass=Var1.Create("");
         rvMsg=Var1.Create("");
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
          var f,arg00,t;
          f=function()
          {
           var x,f1;
           x=Server.CheckLogin(rvUser.get_Value(),rvPass.get_Value());
           f1=function(_arg1)
           {
            var user;
            if(_arg1.$==0)
             {
              Var1.Set(rvMsg,"Invalid credentials.");
              return Concurrency.Return(null);
             }
            else
             {
              user=_arg1.$0;
              Var1.Set(rvUser,"");
              Var1.Set(rvPass,"");
              onLogin(user);
              return Concurrency.Return(null);
             }
           };
           return Concurrency.Bind(x,f1);
          };
          arg00=Concurrency.Delay(f);
          t={
           $:0
          };
          return Concurrency.Start(arg00,t);
         })]))]))]))]));
        },
        StatusWidget:function(login,logout,view)
        {
         return Doc.EmbedView(View1.Map(function(_arg1)
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
        var thread,post,f,arg00,t;
        thread=Common.CreateThread("SimonJF","Hello, World! This is a topic.");
        post=Common.CreatePost({
         Name:"SimonJF",
         Password:""
        },"Hello, world! This is a post.");
        f=function()
        {
         var x,f1;
         x=Server.AddThread(thread);
         f1=function()
         {
          var x1,f2;
          x1=Server.AddPost(thread,post);
          f2=function()
          {
           return Concurrency.Return(null);
          };
          return Concurrency.Bind(x1,f2);
         };
         return Concurrency.Bind(x,f1);
        };
        arg00=Concurrency.Delay(f);
        t={
         $:0
        };
        return Concurrency.Start(arg00,t);
       },
       Main:function()
       {
        var actVar,auth,Go,st,navbar;
        MessageBoard.Initialise();
        actVar=Var1.Create({
         $:2
        });
        auth=Auth.Create();
        Go=function(arg10)
        {
         return Var1.Set(actVar,arg10);
        };
        st={
         Auth:auth,
         Threads:Var1.Create(Runtime.New(T,{
          $:0
         })),
         Go:Go
        };
        navbar=MessageBoard.NavBar(auth,actVar,st);
        return Doc.EmbedView(View1.Map(function(act)
        {
         auth.HideForm.call(null,null);
         return Doc.Concat(List.ofArray([navbar,auth.LoginForm,act.$==2?MessageBoard.ThreadListPage(st):act.$==1?MessageBoard.ShowThreadPage(st,act.$0):MessageBoard.NewThreadPage(st)]));
        },View1.FromVar(actVar)));
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
         return Doc.EmbedView(View1.Map(function(active)
         {
          return Html.LI(List.ofArray([MessageBoard.ShowAction(action)===MessageBoard.ShowAction(active)?Utilities.cls("active"):Attr.get_Empty()]),List.ofArray([Utilities.link(MessageBoard.ShowAction(action),Runtime.New(T,{
           $:0
          }),function()
          {
           return st.Go.call(null,action);
          })]));
         },View1.FromVar(_var)));
        };
        return Html.Nav(List.ofArray([Utilities.cls("navbar"),Utilities.cls("navbar-default"),Attr.Create("role","navigation")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("container-fluid")]),List.ofArray([Html.UL(List.ofArray([Utilities.cls("nav"),Utilities.cls("navbar-nav")]),List.ofArray([Doc.Concat(List.map(renderLink,actions))])),Html.UL(List.ofArray([Utilities.cls("nav"),Utilities.cls("navbar-nav"),Utilities.cls("navbar-right")]),List.ofArray([auth.StatusWidget]))]))]));
       },
       NewThreadPage:function(st)
       {
        var x;
        x=st.Auth.LoggedIn;
        return Doc.EmbedView(View1.Map(function(_arg3)
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
           rvTitle=Var1.Create("");
           rvPost=Var1.Create("");
           add=function()
           {
            var newThread,post,f,arg00,t;
            newThread=Common.CreateThread(user.Name,Var1.Get(rvTitle));
            post=Common.CreatePost(user,Var1.Get(rvPost));
            f=function()
            {
             var x1,f1;
             x1=Server.AddThread(newThread);
             f1=function()
             {
              var x2,f2;
              x2=Server.AddPost(newThread,post);
              f2=function()
              {
               return Concurrency.Return(null);
              };
              return Concurrency.Bind(x2,f2);
             };
             return Concurrency.Bind(x1,f1);
            };
            arg00=Concurrency.Delay(f);
            t={
             $:0
            };
            Concurrency.Start(arg00,t);
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
        var rvPosts,getPosts,renderPost,postList,x1;
        rvPosts=Var1.Create(Runtime.New(T,{
         $:0
        }));
        getPosts=function()
        {
         var f,arg00,t;
         f=function()
         {
          var x,f1;
          x=Server.GetPosts(thread);
          f1=function(_arg1)
          {
           Var1.Set(rvPosts,_arg1);
           return Concurrency.Return(null);
          };
          return Concurrency.Bind(x,f1);
         };
         arg00=Concurrency.Delay(f);
         t={
          $:0
         };
         return Concurrency.Start(arg00,t);
        };
        renderPost=function(post)
        {
         return Html.TR0(List.ofArray([Html.TD0(List.ofArray([Doc.TextNode(post.PostAuthorName)])),Html.TD0(List.ofArray([Doc.TextNode(post.Content)]))]));
        };
        postList=Html.Div(List.ofArray([Utilities.cls("panel"),Utilities.cls("panel-default")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("panel-heading")]),List.ofArray([Html.H3(List.ofArray([Utilities.cls("panel-title")]),List.ofArray([Doc.TextNode("Posts in thread \""+thread.Title+"\"")]))])),Html.Div(List.ofArray([Utilities.cls("panel-body")]),List.ofArray([Html.Table(List.ofArray([Utilities.cls("table"),Utilities.cls("table-hover")]),List.ofArray([Html.TBody0(List.ofArray([Doc.EmbedView(View1.Map(function(posts)
        {
         return Doc.Concat(List.map(renderPost,posts));
        },View1.FromVar(rvPosts)))]))]))]))]));
        getPosts(null);
        x1=st.Auth.LoggedIn;
        return Html.Div0(List.ofArray([postList,Doc.EmbedView(View1.Map(function(_arg3)
        {
         var user,rvPost,add;
         if(_arg3.$==1)
          {
           user=_arg3.$0;
           rvPost=Var1.Create("");
           add=function()
           {
            var post,f,arg00,t;
            post=Common.CreatePost(user,rvPost.get_Value());
            f=function()
            {
             var x,f1;
             x=Server.AddPost(thread,post);
             f1=function()
             {
              getPosts(null);
              return Concurrency.Return(null);
             };
             return Concurrency.Bind(x,f1);
            };
            arg00=Concurrency.Delay(f);
            t={
             $:0
            };
            return Concurrency.Start(arg00,t);
           };
           return Html.Div(List.ofArray([Utilities.cls("panel"),Utilities.cls("panel-default")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("panel-heading")]),List.ofArray([Html.H3(List.ofArray([Utilities.cls("panel-title")]),List.ofArray([Doc.TextNode("New Post")]))])),Html.Div(List.ofArray([Utilities.cls("panel-body")]),List.ofArray([Html.Form(List.ofArray([Utilities.cls("form-horizontal"),Utilities.op_EqualsEqualsGreater("role","form")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Label(List.ofArray([Utilities.op_EqualsEqualsGreater("for","postContent"),Utilities.cls("col-sm-2 control-label")]),List.ofArray([Doc.TextNode("Content")])),Html.Div(List.ofArray([Utilities.cls("col-sm-10")]),List.ofArray([Doc.InputArea(List.ofArray([Utilities.op_EqualsEqualsGreater("id","postContent"),Utilities.op_EqualsEqualsGreater("rows","5"),Utilities.cls("form-control"),Utilities.sty("width","100%")]),rvPost)]))])),Html.Div(List.ofArray([Utilities.cls("form-group")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-sm-offset-2"),Utilities.cls("col-sm-10")]),List.ofArray([Doc.Button("Submit",List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-primary")]),add)]))]))]))]))]));
          }
         else
          {
           return Doc.get_Empty();
          }
        },x1))]));
       },
       ThreadListPage:function(st)
       {
        var renderThread,threads,f,arg00,t;
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
        f=function()
        {
         var x,f1;
         x=Server.GetThreads();
         f1=function(_arg1)
         {
          Var1.Set(threads,_arg1);
          return Concurrency.Return(null);
         };
         return Concurrency.Bind(x,f1);
        };
        arg00=Concurrency.Delay(f);
        t={
         $:0
        };
        Concurrency.Start(arg00,t);
        return Html.Table(List.ofArray([Utilities.cls("table"),Utilities.cls("table-hover")]),List.ofArray([Html.TBody0(List.ofArray([Doc.EmbedView(View1.Map(function(threads1)
        {
         return Doc.Concat(List.map(renderThread,threads1));
        },View1.FromVar(st.Threads)))]))]));
       }
      },
      MouseInfo:{
       Description:function()
       {
        return Html.Div0(List.ofArray([Doc.TextNode("Shows information about the mouse")]));
       },
       Main:function()
       {
        var arg00,arg10,xView,arg001,arg101,yView,lastHeldPos,lastClickPos;
        arg00=Runtime.Tupled(function(tuple)
        {
         return tuple[0];
        });
        arg10=Mouse.get_Position();
        xView=View1.Map(arg00,arg10);
        arg001=Runtime.Tupled(function(tuple)
        {
         return tuple[1];
        });
        arg101=Mouse.get_Position();
        yView=View1.Map(arg001,arg101);
        lastHeldPos=(((Runtime.Tupled(function(arg002)
        {
         return function(arg102)
         {
          return function(arg20)
          {
           return View1.UpdateWhile(arg002,arg102,arg20);
          };
         };
        }))([0,0]))(Mouse.get_LeftPressed()))(Mouse.get_Position());
        lastClickPos=(((Runtime.Tupled(function(arg002)
        {
         return function(arg102)
         {
          return function(arg20)
          {
           return View1.SnapshotOn(arg002,arg102,arg20);
          };
         };
        }))([0,0]))(Mouse.get_LeftPressed()))(Mouse.get_Position());
        return Html.Div0(List.ofArray([Html.P0(List.ofArray([Doc.TextView(View1.Map(function(x)
        {
         return"X: "+Global.String(x);
        },xView)),Doc.TextView(View1.Map(function(y)
        {
         return"Y: "+Global.String(y);
        },yView))])),Html.P0(List.ofArray([Doc.TextView(View1.Map(function(l)
        {
         return"Left button pressed: "+Global.String(l);
        },Mouse.get_LeftPressed()))])),Html.P0(List.ofArray([Doc.TextView(View1.Map(function(m)
        {
         return"Middle button pressed: "+Global.String(m);
        },Mouse.get_MiddlePressed()))])),Html.P0(List.ofArray([Doc.TextView(View1.Map(function(r)
        {
         return"Right button pressed: "+Global.String(r);
        },Mouse.get_RightPressed()))])),Html.P0(List.ofArray([Doc.TextView(View1.Map(Runtime.Tupled(function(tupledArg)
        {
         var y;
         y=tupledArg[1];
         return"Position on last left click: ("+Global.String(tupledArg[0])+","+Global.String(y)+")";
        }),lastClickPos))])),Html.P0(List.ofArray([Doc.TextView(View1.Map(Runtime.Tupled(function(tupledArg)
        {
         var y;
         y=tupledArg[1];
         return"Position of mouse while left button held: ("+Global.String(tupledArg[0])+","+Global.String(y)+")";
        }),lastHeldPos))]))]));
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
         var callback;
         callback=Runtime.Tupled(function(tupledArg)
         {
          var ok;
          ok=tupledArg[0];
          jQuery.get(url,{},Runtime.Tupled(function(tupledArg1)
          {
           return ok(DataSet.ParseCSV(tupledArg1[0]));
          }));
          return;
         });
         return Concurrency.FromContinuations(callback);
        },
        ParseCSV:function(data)
        {
         var sep,x,all,_this,sep1,brackets,x1,data1;
         sep=[13,10];
         x=Strings.SplitChars(data,sep,1);
         all=Arrays.filter(function(s)
         {
          return s!=="";
         },x);
         _this=IntrinsicFunctionProxy.GetArray(all,0);
         sep1=[44];
         brackets=Arrays.map(function(arg0)
         {
          return{
           $:0,
           $0:arg0
          };
         },OperatorIntrinsics.GetArraySlice(Strings.SplitChars(_this,sep1,1),{
          $:1,
          $0:1
         },{
          $:0
         }));
         x1=Arrays.sub(all,1,IntrinsicFunctionProxy.GetLength(all)-1);
         data1=Arrays.map(function(s)
         {
          var sep2;
          sep2=[44];
          return Strings.SplitChars(s,sep2,1);
         },x1);
         return Runtime.New(DataSet,{
          Brackets:brackets,
          Population:function(bracket)
          {
           return function(_arg1)
           {
            var st;
            st=_arg1.$0;
            return IntrinsicFunctionProxy.GetArray(IntrinsicFunctionProxy.GetArray(data1,Arrays.FindIndex(function(d)
            {
             return IntrinsicFunctionProxy.GetArray(d,0)===st;
            },data1)),1+Arrays.FindIndex(function(y)
            {
             return Unchecked.Equals(bracket,y);
            },brackets))<<0;
           };
          },
          States:Arrays.map(function(d)
          {
           return{
            $:0,
            $0:IntrinsicFunctionProxy.GetArray(d,0)
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
         var x;
         x=Arrays.map(function(st)
         {
          return[st,DataSet.Ratio(ds,bracket,st)];
         },ds.States);
         return OperatorIntrinsics.GetArraySlice(Arrays.sortBy(Runtime.Tupled(function(tupledArg)
         {
          return-tupledArg[1];
         }),x),{
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
        return Html.Div0(List.ofArray([Html.H20(List.ofArray([Utilities.txt("Top States by Age Bracket, 2008")])),Doc.EmbedView(View1.Map(function(dS)
        {
         return Doc.Select(List.ofArray([Utilities.cls("form-control")]),function(_arg1)
         {
          return _arg1.$0;
         },List.ofArray(OperatorIntrinsics.GetArraySlice(dS.Brackets,{
          $:1,
          $0:1
         },{
          $:0
         })),bracket);
        },dataSet)),Html.Div(List.ofArray([Utilities.cls("skip")]),Runtime.New(T,{
         $:0
        })),SvgElements.Svg(List.ofArray([Utilities.op_EqualsEqualsGreater("width",Global.String(ObjectConstancy.Width())),Utilities.op_EqualsEqualsGreater("height",Global.String(ObjectConstancy.Height()))]),List.ofArray([Doc.EmbedView(View1.Map(function(arg00)
        {
         return Doc.Concat(arg00);
        },View1.ConvertSeqBy(function(s)
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
         return Attr.Animated(name,kind,View1.Map(proj,state),arg30);
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
          return SvgElements.Text(attr,List.ofArray([Doc.TextView(View1.Map(f,state))]));
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
        dataSet=View1.MapAsync(function()
        {
         return DataSet.LoadFromCSV("ObjectConstancy.csv");
        },x);
        bracket=Var1.Create({
         $:0,
         $0:"Under 5 Years"
        });
        return[dataSet,bracket,View1.Map(function(xs)
        {
         var n,m;
         n=IntrinsicFunctionProxy.GetLength(xs);
         m=Arrays.max(Arrays.map(Runtime.Tupled(function(tuple)
         {
          return tuple[1];
         }),xs));
         return Arrays.mapi(function(i)
         {
          return Runtime.Tupled(function(tupledArg)
          {
           return{
            MaxValue:m,
            Position:i,
            State:tupledArg[0].$0,
            Total:n,
            Value:tupledArg[1]
           };
          });
         },xs);
        },View1.Map2(function(arg00)
        {
         return function(arg10)
         {
          return DataSet.TopStatesByRatio(arg00,arg10);
         };
        },dataSet,bracket.get_View()))];
       },
       SimpleAnimation:function(x,y)
       {
        return An.Simple(Interpolation.get_Double(),Easing.get_CubicInOut(),300,x,y);
       },
       SimpleTransition:Runtime.Field(function()
       {
        return Trans1.Create(function(x)
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
        allPhones=Var1.Create(phones);
        query=Var1.Create("");
        order=Var1.Create(Runtime.New(Order,{
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
        arg101=View1.FromVar(query);
        arg201=View1.FromVar(order);
        visiblePhones=View1.Map2(arg00,arg101,arg201);
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
        })]),order)])),Html.Div(List.ofArray([Utilities.cls("col-sm-6")]),List.ofArray([Html.UL0(List.ofArray([Doc.EmbedView(View1.Map(showPhones,visiblePhones))]))]))]));
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
          return Var1.Set(current,arg10);
         }
        };
        return Doc.EmbedView(View1.Map(function(pg)
        {
         return pg.$==1?withNavbar(BobsleighSite.History(ctx)):pg.$==2?withNavbar(BobsleighSite.Governance(ctx)):pg.$==3?withNavbar(BobsleighSite.Team(ctx)):withNavbar(BobsleighSite.HomePage(ctx));
        },View1.FromVar(current)));
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
        return RouteMap.Create(function(_arg1)
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
        sample.Router=Router.Prefix(meta.Uri,Router.Route(router,init,function(id)
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
        unitRouter=RouteMap.Create(function()
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
        sample.Router=Router.Prefix(meta.Uri,Router.Route(unitRouter,null,function(id)
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
        return Elements.Section(List.ofArray([Utilities.cls("block-small")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("container")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("row")]),List.ofArray([Samples.Sidebar(vPage,samples),Samples.RenderContent(sample)]))]))]));
       },
       RenderContent:function(sample)
       {
        return Html.Div(List.ofArray([Utilities.cls("samples"),Utilities.cls("col-9")]),List.ofArray([Html.Div0(List.ofArray([Html.Div(List.ofArray([Utilities.cls("row")]),List.ofArray([Html.H10(List.ofArray([Utilities.txt(sample.Meta.Title)])),Html.Div0(List.ofArray([Html.P0(List.ofArray([sample.Description])),Html.P0(List.ofArray([Elements.A(List.ofArray([Utilities.op_EqualsEqualsGreater("href","https://github.com/intellifactory/websharper.ui.next.samples/blob/master/src/"+sample.Meta.Uri+".fs")]),List.ofArray([Utilities.txt("View Source")]))]))]))])),Html.Div(List.ofArray([Utilities.cls("row")]),List.ofArray([Html.P0(List.ofArray([sample.Body]))]))]))]));
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
        return Router.Prefix("samples",Router1.Merge(Seq.toList(Seq.delay(function()
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
         activeAttr=Attr.DynamicClass("active",View1.Map(function(pg)
         {
          return pg.PageSample;
         },View1.FromVar(vPage)),arg20);
         arg201=function()
         {
          return Var1.Set(vPage,sample.SamplePage);
         };
         return Doc.Link(sample.Meta.Title,List.ofArray([Utilities.cls("list-group-item"),activeAttr]),arg201);
        };
        return Html.Div(List.ofArray([Utilities.cls("col-3")]),List.ofArray([Html.H40(List.ofArray([Utilities.txt("Samples")])),Doc.Concat(List.map(renderItem,samples))]));
       },
       nav:Runtime.Field(function()
       {
        return function(ats)
        {
         return function(ch)
         {
          return Elements.Nav(ats,ch);
         };
        };
       })
      },
      Server:{
       AddPost:function(thread,post)
       {
        var f;
        f=function()
        {
         var matchValue,k,v,m,_,threadPosts,k1,b,v1,m1,_1;
         matchValue=MapModule.TryFind(thread.ThreadId,Server.posts());
         if(matchValue.$==0)
          {
           k=thread.ThreadId;
           v=List.ofArray([post]);
           m=Server.posts();
           _=m.Add(k,v);
           Server.posts=function()
           {
            return _;
           };
           return Concurrency.Return(null);
          }
         else
          {
           threadPosts=matchValue.$0;
           k1=thread.ThreadId;
           b=List.ofArray([post]);
           v1=List.append(threadPosts,b);
           m1=Server.posts();
           _1=m1.Add(k1,v1);
           Server.posts=function()
           {
            return _1;
           };
           return Concurrency.Return(null);
          }
        };
        return Concurrency.Delay(f);
       },
       AddThread:function(thread)
       {
        var f;
        f=function()
        {
         var a,b,_,k,v,m,_1;
         a=Server.threads();
         b=List.ofArray([thread]);
         _=List.append(a,b);
         Server.threads=function()
         {
          return _;
         };
         k=thread.ThreadId;
         v=Runtime.New(T,{
          $:0
         });
         m=Server.posts();
         _1=m.Add(k,v);
         Server.posts=function()
         {
          return _1;
         };
         return Concurrency.Return(null);
        };
        return Concurrency.Delay(f);
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
        var f;
        f=function()
        {
         var milliseconds,x,f1;
         milliseconds=Server.DELAY();
         x=Concurrency.Sleep(milliseconds);
         f1=function()
         {
          var x1;
          x1=Server.CheckCredentials(user,pass);
          return Concurrency.Return(x1);
         };
         return Concurrency.Bind(x,f1);
        };
        return Concurrency.Delay(f);
       },
       DELAY:Runtime.Field(function()
       {
        return 200;
       }),
       GetPosts:function(thread)
       {
        var f;
        f=function()
        {
         var matchValue,x,threadPosts;
         matchValue=MapModule.TryFind(thread.ThreadId,Server.posts());
         if(matchValue.$==0)
          {
           x=Runtime.New(T,{
            $:0
           });
           return Concurrency.Return(x);
          }
         else
          {
           threadPosts=matchValue.$0;
           return Concurrency.Return(threadPosts);
          }
        };
        return Concurrency.Delay(f);
       },
       GetThreads:function()
       {
        var f;
        f=function()
        {
         var milliseconds,x,f1;
         milliseconds=Server.DELAY();
         x=Concurrency.Sleep(milliseconds);
         f1=function()
         {
          var x1;
          x1=Server.threads();
          return Concurrency.Return(x1);
         };
         return Concurrency.Bind(x,f1);
        };
        return Concurrency.Delay(f);
       },
       posts:Runtime.Field(function()
       {
        return FSharpMap.New([]);
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
        rvText=Var1.Create("");
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
         return Elements.Section(List.ofArray([Utilities.cls("block-large")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("container")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("row")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-lg-3")]),List.ofArray([Elements.Img(List.ofArray([Utilities.op_EqualsEqualsGreater("src",entry.ImgURL),Utilities.sty("width","100%")]),Runtime.New(T,{
          $:0
         }))])),Html.Div(List.ofArray([Utilities.cls("col-lg-1")]),Runtime.New(T,{
          $:0
         })),Html.Div(List.ofArray([Utilities.cls("col-lg-8")]),List.ofArray([renderBody(entry)]))]))]))]));
        };
        evenEntry=function(entry)
        {
         return Elements.Section(List.ofArray([Utilities.cls("block-large"),Utilities.cls("bg-alt")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("container")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("row")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-lg-8")]),List.ofArray([renderBody(entry)])),Html.Div(List.ofArray([Utilities.cls("col-lg-1")]),Runtime.New(T,{
          $:0
         })),Html.Div(List.ofArray([Utilities.cls("col-lg-3")]),List.ofArray([Elements.Img(List.ofArray([Utilities.op_EqualsEqualsGreater("src",entry.ImgURL),Utilities.sty("width","100%")]),Runtime.New(T,{
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
        return Html.Div(List.ofArray([Utilities.cls("extensions")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("container")]),List.ofArray([Elements.Section(List.ofArray([Utilities.cls("block-huge")]),List.ofArray([Html.H10(List.ofArray([Utilities.txt("WebSharper UI.Next: "),Html.Span(List.ofArray([Utilities.cls("text-muted")]),List.ofArray([Utilities.txt("Everything you need to know.")]))])),Html.P(List.ofArray([Utilities.cls("lead")]),List.ofArray([Utilities.txt("A selection of resources about UI.Next.")]))]))])),Html.Div(List.ofArray([Utilities.cls("block-large"),Utilities.cls("bg-alt")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("container")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("row"),Utilities.cls("text-center")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-lg-4")]),List.ofArray([ico("fa-graduation-cap"),Html.H30(List.ofArray([Utilities.txt("Get Started")])),Html.P0(List.ofArray([Utilities.txt("Take the tutorial, and you'll be writing reactive applications in no time!")])),Site.linkBtn("Tutorial","https://github.com/intellifactory/websharper.ui.next/blob/master/docs/Tutorial.md")])),Html.Div(List.ofArray([Utilities.cls("col-lg-4")]),List.ofArray([ico("fa-book"),Html.H30(List.ofArray([Utilities.txt("Dive Right In")])),Html.P0(List.ofArray([Utilities.txt("Comprehensive documentation on the UI.Next API.")])),Site.linkBtn("API Reference","https://github.com/intellifactory/websharper.ui.next/blob/master/docs/API.md")])),Html.Div(List.ofArray([Utilities.cls("col-lg-4")]),List.ofArray([ico("fa-send"),Html.H30(List.ofArray([Utilities.txt("See it in Action")])),Html.P0(List.ofArray([Utilities.txt("A variety of samples using UI.Next, and their associated source code!")])),Doc.Button("Samples",List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-default")]),arg20)]))]))]))])),Doc.Concat(List.mapi(function(i)
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
        _arg00_312_13=Interpolation.get_Double();
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
        },Trans1.Create(Site.Fade())));
       }),
       HomePage:function()
       {
        return Html.Div(List.ofArray([Utilities.cls("container")]),List.ofArray([Elements.Section(List.ofArray([Utilities.cls("block-huge"),Utilities.cls("teaser-home"),Utilities.sty("height","700px"),Utilities.sty("padding-top","40px"),Utilities.sty("padding-bottom","30px"),Utilities.sty("margin-bottom","40px")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("container")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("row")]),List.ofArray([Html.Div(List.ofArray([Utilities.cls("col-12")]),List.ofArray([Elements.Br(Runtime.New(T,{
         $:0
        }),Runtime.New(T,{
         $:0
        })),Html.H10(List.ofArray([Utilities.txt("WebSharper UI.Next: "),Html.Span(List.ofArray([Utilities.cls("text-muted")]),List.ofArray([Utilities.txt("A new generation of reactive web applications.")]))])),Html.H30(List.ofArray([Utilities.txt("Write powerful, data-backed applications"),Elements.Br(Runtime.New(T,{
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
        router=Router1.Install(arg00,arg10);
        Doc.RunById("main",Doc.EmbedView(View1.Map(function(pg)
        {
         var matchValue;
         matchValue=pg.PageType;
         return matchValue.$==1?Site.AboutPage(function(ty)
         {
          return Var1.Set(router,Site.pageFor(ty,samples));
         }):matchValue.$==2?Samples.Render(router,pg,samples):Site.HomePage(function(ty)
         {
          return Var1.Set(router,Site.pageFor(ty,samples));
         });
        },View1.FromVar(router))));
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
         return Doc.EmbedView(View1.Map(function(page)
         {
          var liAttr;
          liAttr=Unchecked.Equals(page.PageType,pg)?Attr.Class("active"):Attr.get_Empty();
          return Html.LI(List.ofArray([Utilities.cls("nav-item"),liAttr]),List.ofArray([Utilities.link(Site.showPgTy(pg),Runtime.New(T,{
           $:0
          }),function()
          {
           return Var1.Set(v,Site.pageFor(pg,samples));
          })]));
         },View1.FromVar(v)));
        };
        renderExternal=Runtime.Tupled(function(tupledArg)
        {
         var title,lnk;
         title=tupledArg[0];
         lnk=tupledArg[1];
         return Html.LI(List.ofArray([Utilities.cls("nav-item")]),List.ofArray([Utilities.href(title,lnk)]));
        });
        return Elements.Nav(List.ofArray([Utilities.cls("container")]),List.ofArray([Html.Div(List.ofArray([Utilities.sty("float","left")]),List.ofArray([Html.A(List.ofArray([Utilities.op_EqualsEqualsGreater("href","http://www.websharper.com/home"),Utilities.sty("text-decoration","none"),Utilities.cls("first")]),List.ofArray([Elements.Img(List.ofArray([Utilities.op_EqualsEqualsGreater("src","files/logo-websharper-icon.png"),Utilities.op_EqualsEqualsGreater("alt","[logo]"),Utilities.sty("margin-top","0"),Utilities.sty("border-right","1px"),Utilities.sty("solid","#eee")]),Runtime.New(T,{
         $:0
        })),Elements.Img(List.ofArray([Utilities.op_EqualsEqualsGreater("src","files/logo-websharper-text-dark.png"),Utilities.op_EqualsEqualsGreater("alt","WebSharper"),Utilities.sty("height","32px")]),Runtime.New(T,{
         $:0
        }))]))])),Elements.Nav(List.ofArray([Utilities.cls("nav"),Utilities.cls("nav-collapsible"),Utilities.cls("right"),Utilities.sty("float","right")]),List.ofArray([Html.UL(List.ofArray([Utilities.cls("nav-list")]),List.ofArray([Doc.Concat(List.map(renderLink,Site.NavPages())),Doc.Concat(List.map(renderExternal,Site.NavExternalLinks()))]))]))]));
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
        return Router1.Merge(List.ofArray([Router.Prefix("home",Site.homeRouter(samples)),Router.Prefix("about",Site.aboutRouter(samples)),Router.Prefix("samples",Samples.SamplesRouter(samples))]));
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
        return Router.Route(Site.unitRouteMap(),null,arg20);
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
        return Router.Route(Site.unitRouteMap(),null,arg20);
       },
       linkBtn:function(caption,href)
       {
        return Elements.A(List.ofArray([Utilities.cls("btn"),Utilities.cls("btn-default"),Utilities.op_EqualsEqualsGreater("href",href)]),List.ofArray([Utilities.txt(caption)]));
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
        return RouteMap.Create(function()
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
        return An.Delayed(Interpolation.get_Double(),Easing.get_CubicInOut(),300,delay,x,y);
       },
       Description:function()
       {
        return Html.Div0(List.ofArray([Utilities.txt("This sample show-cases animation and data display.")]));
       },
       DisplayGraph:function(data)
       {
        return Html.Div0(List.ofArray([SvgElements.Svg(List.ofArray([Utilities.op_EqualsEqualsGreater("width",Global.String(SortableBarChart.Width())),Utilities.op_EqualsEqualsGreater("height",Global.String(SortableBarChart.Height()))]),List.ofArray([Doc.EmbedView(View1.Map(function(arg00)
        {
         return Doc.Concat(arg00);
        },View1.ConvertSeqBy(function(d)
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
        return View1.MapAsync(function()
        {
         return SortableBarChart.LoadFromCSV("AlphaFrequency.csv");
        },View.Const(null));
       }),
       LoadFromCSV:function(url)
       {
        var callback;
        callback=Runtime.Tupled(function(tupledArg)
        {
         var ok;
         ok=tupledArg[0];
         jQuery.get(url,{},Runtime.Tupled(function(tupledArg1)
         {
          return ok(SortableBarChart.ParseCSV(tupledArg1[0]));
         }));
         return;
        });
        return Concurrency.FromContinuations(callback);
       },
       Main:function()
       {
        var vOrder,dataView;
        vOrder=Var1.Create({
         $:0
        });
        dataView=View1.Map2(function(xs)
        {
         return function(ordering)
         {
          return SortableBarChart.ViewData(xs,ordering);
         };
        },View1.Map(function(source)
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
        var sep;
        sep=[13,10];
        return Arrays.map(function(str)
        {
         var sep1;
         sep1=[44];
         return SortableBarChart.mkEntry(Strings.SplitChars(str,sep1,1));
        },OperatorIntrinsics.GetArraySlice(Arrays.filter(function(s)
        {
         return s!=="";
        },Strings.SplitChars(data,sep,1)),{
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
         return Attr.Dynamic(name,View1.Map(function(x)
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
        return SvgElements.G(List.ofArray([Attr.Style("fill","steelblue")]),List.ofArray([SvgElements.Rect(List.ofArray([dyn("width",width),dyn("height",height),Attr.Animated("x",SortableBarChart.BarTransition(),View1.Map(x1,dView),arg30),dyn("y",y)]),Runtime.New(T,{
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
        return Trans1.Create(function(x)
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
        var numData,f,maxVal;
        numData=Seq.length(xs);
        f=function(max)
        {
         return function(x)
         {
          return x.DataValue>max?x.DataValue:max;
         };
        };
        maxVal=Seq.fold(f,0,xs);
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
          var x1,y1;
          x1=x.DataLabel;
          y1=y.DataLabel;
          return Unchecked.Compare(x1,y1);
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
         DataLabel:IntrinsicFunctionProxy.GetArray(row,0),
         DataValue:parseFloat(IntrinsicFunctionProxy.GetArray(row,1))
        };
       }
      },
      TodoList:{
       CreateModel:function()
       {
        return{
         Items:ListModel1.Create(function(item)
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
        return Html.TR0(List.ofArray([Html.TD0(List.ofArray([Doc.EmbedView(View1.Map(function(isDone)
        {
         return isDone?Html.Del0(List.ofArray([Utilities.txt(todo.TodoText)])):Utilities.txt(todo.TodoText);
        },View1.FromVar(todo.Done)))])),Html.TD0(List.ofArray([Util.button("Done",function()
        {
         return Var1.Set(todo.Done,true);
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
        rvInput=Var1.Create("");
        return Html.Form0(List.ofArray([Utilities.divc("form-group",List.ofArray([Html.Label0(List.ofArray([Utilities.txt("New entry: ")])),Util.input(rvInput)])),Util.button("Submit",function()
        {
         return m.Items.Add(TodoItem.Create(Var1.Get(rvInput)));
        })]));
       },
       TodoItem:Runtime.Class({},{
        Create:function(s)
        {
         var Key1;
         Key1=Key.Fresh();
         return Runtime.New(TodoItem,{
          Done:Var1.Create(false),
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
        },ListModel.View(m.Items));
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
  }
 });
 Runtime.OnInit(function()
 {
  WebSharper=Runtime.Safe(Global.IntelliFactory.WebSharper);
  UI=Runtime.Safe(WebSharper.UI);
  Next=Runtime.Safe(UI.Next);
  Interpolation=Runtime.Safe(Next.Interpolation);
  Easing=Runtime.Safe(Next.Easing);
  AnimatedBobsleighSite=Runtime.Safe(Next.AnimatedBobsleighSite);
  An=Runtime.Safe(Next.An);
  Trans1=Runtime.Safe(Next.Trans1);
  Var1=Runtime.Safe(Next.Var1);
  Doc=Runtime.Safe(Next.Doc);
  List=Runtime.Safe(WebSharper.List);
  Html=Runtime.Safe(Next.Html);
  Utilities=Runtime.Safe(Next.Utilities);
  T=Runtime.Safe(List.T);
  View1=Runtime.Safe(Next.View1);
  Attr=Runtime.Safe(Next.Attr);
  View=Runtime.Safe(Next.View);
  Unchecked=Runtime.Safe(WebSharper.Unchecked);
  Samples=Runtime.Safe(Next.Samples);
  AnimatedContactFlow=Runtime.Safe(Next.AnimatedContactFlow);
  Flow1=Runtime.Safe(Next.Flow1);
  Flow=Runtime.Safe(Next.Flow);
  BobsleighSite=Runtime.Safe(Next.BobsleighSite);
  Calculator=Runtime.Safe(Next.Calculator);
  Var=Runtime.Safe(Next.Var);
  CheckBoxTest=Runtime.Safe(Next.CheckBoxTest);
  Seq=Runtime.Safe(WebSharper.Seq);
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
  Strings=Runtime.Safe(WebSharper.Strings);
  IntrinsicFunctionProxy=Runtime.Safe(WebSharper.IntrinsicFunctionProxy);
  Input=Runtime.Safe(Next.Input);
  Keyboard=Runtime.Safe(Input.Keyboard);
  Auth=Runtime.Safe(MessageBoard.Auth);
  Server=Runtime.Safe(Next.Server);
  Concurrency=Runtime.Safe(WebSharper.Concurrency);
  Mouse=Runtime.Safe(Input.Mouse);
  jQuery=Runtime.Safe(Global.jQuery);
  DataSet=Runtime.Safe(ObjectConstancy.DataSet);
  Arrays=Runtime.Safe(WebSharper.Arrays);
  OperatorIntrinsics=Runtime.Safe(WebSharper.OperatorIntrinsics);
  SvgElements=Runtime.Safe(Html.SvgElements);
  Math=Runtime.Safe(Global.Math);
  Phone=Runtime.Safe(PhoneExample.Phone);
  Operators=Runtime.Safe(WebSharper.Operators);
  Order=Runtime.Safe(PhoneExample.Order);
  RouteMap=Runtime.Safe(Next.RouteMap);
  Builder=Runtime.Safe(Samples.Builder);
  Router=Runtime.Safe(Next.Router);
  SiteCommon=Runtime.Safe(Next.SiteCommon);
  Elements=Runtime.Safe(Html.Elements);
  Router1=Runtime.Safe(Next.Router1);
  Option=Runtime.Safe(WebSharper.Option);
  Collections=Runtime.Safe(WebSharper.Collections);
  MapModule=Runtime.Safe(Collections.MapModule);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  SortableBarChart=Runtime.Safe(Next.SortableBarChart);
  parseFloat=Runtime.Safe(Global.parseFloat);
  ListModel1=Runtime.Safe(Next.ListModel1);
  Util=Runtime.Safe(TodoList.Util);
  TodoItem=Runtime.Safe(TodoList.TodoItem);
  Key=Runtime.Safe(Next.Key);
  ListModel=Runtime.Safe(Next.ListModel);
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

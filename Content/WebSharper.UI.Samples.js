// $begin{copyright}
//
// This file is part of WebSharper
//
// Copyright (c) 2008-2016 IntelliFactory
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

IntelliFactory = {
    Runtime: {
        Ctor: function (ctor, typeFunction) {
            ctor.prototype = typeFunction.prototype;
            return ctor;
        },

        Class: function (members, base, statics) {
            var proto = members;
            if (base) {
                proto = new base();
                for (var m in members) { proto[m] = members[m] }
            }
            var typeFunction = function (copyFrom) {
                if (copyFrom) {
                    for (var f in copyFrom) { this[f] = copyFrom[f] }
                }
            }
            typeFunction.prototype = proto;
            if (statics) {
                for (var f in statics) { typeFunction[f] = statics[f] }
            }
            return typeFunction;
        },

        Clone: function (obj) {
            var res = {};
            for (var p in obj) { res[p] = obj[p] }
            return res;
        },

        NewObject:
            function (kv) {
                var o = {};
                for (var i = 0; i < kv.length; i++) {
                    o[kv[i][0]] = kv[i][1];
                }
                return o;
            },

        DeleteEmptyFields:
            function (obj, fields) {
                for (var i = 0; i < fields.length; i++) {
                    var f = fields[i];
                    if (obj[f] === void (0)) { delete obj[f]; }
                }
                return obj;
            },

        GetOptional:
            function (value) {
                return (value === void (0)) ? null : { $: 1, $0: value };
            },

        SetOptional:
            function (obj, field, value) {
                if (value) {
                    obj[field] = value.$0;
                } else {
                    delete obj[field];
                }
            },

        SetOrDelete:
            function (obj, field, value) {
                if (value === void (0)) {
                    delete obj[field];
                } else {
                    obj[field] = value;
                }
            },

        Apply: function (f, obj, args) {
            return f.apply(obj, args);
        },

        Bind: function (f, obj) {
            return function () { return f.apply(this, arguments) };
        },

        CreateFuncWithArgs: function (f) {
            return function () { return f(Array.prototype.slice.call(arguments)) };
        },

        CreateFuncWithOnlyThis: function (f) {
            return function () { return f(this) };
        },

        CreateFuncWithThis: function (f) {
            return function () { return f(this).apply(null, arguments) };
        },

        CreateFuncWithThisArgs: function (f) {
            return function () { return f(this)(Array.prototype.slice.call(arguments)) };
        },

        CreateFuncWithRest: function (length, f) {
            return function () { return f(Array.prototype.slice.call(arguments, 0, length).concat([Array.prototype.slice.call(arguments, length)])) };
        },

        CreateFuncWithArgsRest: function (length, f) {
            return function () { return f([Array.prototype.slice.call(arguments, 0, length), Array.prototype.slice.call(arguments, length)]) };
        },

        BindDelegate: function (func, obj) {
            var res = func.bind(obj);
            res.$Func = func;
            res.$Target = obj;
            return res;
        },

        CreateDelegate: function (invokes) {
            if (invokes.length == 0) return null;
            if (invokes.length == 1) return invokes[0];
            var del = function () {
                var res;
                for (var i = 0; i < invokes.length; i++) {
                    res = invokes[i].apply(null, arguments);
                }
                return res;
            };
            del.$Invokes = invokes;
            return del;
        },

        CombineDelegates: function (dels) {
            var invokes = [];
            for (var i = 0; i < dels.length; i++) {
                var del = dels[i];
                if (del) {
                    if ("$Invokes" in del)
                        invokes = invokes.concat(del.$Invokes);
                    else
                        invokes.push(del);
                }
            }
            return IntelliFactory.Runtime.CreateDelegate(invokes);
        },

        DelegateEqual: function (d1, d2) {
            if (d1 === d2) return true;
            if (d1 == null || d2 == null) return false;
            var i1 = d1.$Invokes || [d1];
            var i2 = d2.$Invokes || [d2];
            if (i1.length != i2.length) return false;
            for (var i = 0; i < i1.length; i++) {
                var e1 = i1[i];
                var e2 = i2[i];
                if (!(e1 === e2 || ("$Func" in e1 && "$Func" in e2 && e1.$Func === e2.$Func && e1.$Target == e2.$Target)))
                    return false;
            }
            return true;
        },

        ThisFunc: function (d) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);
                return d.apply(null, args);
            };
        },

        ThisFuncOut: function (f) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return f.apply(args.shift(), args);
            };
        },

        ParamsFunc: function (length, d) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return d.apply(null, args.slice(0, length).concat([args.slice(length)]));
            };
        },

        ParamsFuncOut: function (length, f) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return f.apply(null, args.slice(0, length).concat(args[length]));
            };
        },

        ThisParamsFunc: function (length, d) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);
                return d.apply(null, args.slice(0, length + 1).concat([args.slice(length + 1)]));
            };
        },

        ThisParamsFuncOut: function (length, f) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return f.apply(args.shift(), args.slice(0, length).concat(args[length]));
            };
        },

        Curried: function (f, n, args) {
            args = args || [];
            return function (a) {
                var allArgs = args.concat([a === void (0) ? null : a]);
                if (n == 1)
                    return f.apply(null, allArgs);
                if (n == 2)
                    return function (a) { return f.apply(null, allArgs.concat([a === void (0) ? null : a])); }
                return IntelliFactory.Runtime.Curried(f, n - 1, allArgs);
            }
        },

        Curried2: function (f) {
            return function (a) { return function (b) { return f(a, b); } }
        },

        Curried3: function (f) {
            return function (a) { return function (b) { return function (c) { return f(a, b, c); } } }
        },

        UnionByType: function (types, value, optional) {
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
        },

        OnLoad:
            function (f) {
                if (!("load" in this)) {
                    this.load = [];
                }
                this.load.push(f);
            },

        Start:
            function () {
                function run(c) {
                    for (var i = 0; i < c.length; i++) {
                        c[i]();
                    }
                }
                if ("load" in this) {
                    run(this.load);
                    this.load = [];
                }
            },
    }
}

IntelliFactory.Runtime.OnLoad(function () {
    if (window.WebSharper && WebSharper.Activator && WebSharper.Activator.Activate)
        WebSharper.Activator.Activate()
});

// Polyfill

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

if (!Math.trunc) {
    Math.trunc = function (x) {
        return x < 0 ? Math.ceil(x) : Math.floor(x);
    }
}

function ignore() { };
function id(x) { return x };
function fst(x) { return x[0] };
function snd(x) { return x[1] };
function trd(x) { return x[2] };

if (!console) {
    console = {
        count: ignore,
        dir: ignore,
        error: ignore,
        group: ignore,
        groupEnd: ignore,
        info: ignore,
        log: ignore,
        profile: ignore,
        profileEnd: ignore,
        time: ignore,
        timeEnd: ignore,
        trace: ignore,
        warn: ignore
    }
};
(function () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());
;
(function()
{
 "use strict";
 var Global,WebSharper,UI,Client,Site,List,SimpleTextBox,InputTransform,InputTransformHtml,TodoList,PhoneExample,EditablePersonList,CheckBoxTest,Calculator,ContactFlow,AnimatedContactFlow,MessageBoard,BobsleighSite,RoutedBobsleighSite,AnimatedBobsleighSite,ObjectConstancy,MouseInfo,KeyboardInfo,Samples,BobsleighSitePage,SampleTy,PageTy,WebSharper$UI$Samples_Router,WebSharper$UI$Samples_Templates,Router,Var,Operators,Obj,T,Arrays,SC$1,SC$2,SC$3,SC$4,SC$5,SC$6,SC$7,SC$8,SC$9,SC$10,SC$11,SC$12,SC$13,SC$14,SC$15,SC$16,SC$17,Sitelets,RouterOperators,Route,RouterModule,Doc,AboutEntry,Utilities,HtmlModule,attr,Sample,SortableBarChart,JavaScript,Pervasives,View,Unchecked,AttrProxy,Builder,Person,Person$1,Calculator$1,Op,Flow,Person$2,ContactType,Interpolation,Easing,An,Trans,Person$3,ContactType$1,Collections,Map,Page,Input,Keyboard,Seq,JSModule,Router$1,List$1,EventTarget,Utils,ConcreteVar,Snap,Node,AttrModule,SC$18,SC$19,SiteCommon,Meta,SC$20,DomUtility,Attrs,System,Guid,Templating,Runtime,Server,TemplateInstance,Handler,Phone,Restaurant,FlowBuilder,DoubleInterpolation,Easings,FSharpMap,Action,Auth,State,Component,Context,Context$1,Slice,DataSet,StateView,Mouse,KeyListenerSt,Enumerator,Object,T$1,Lazy,Strings,Abbrev,Fresh,Async,Array,SC$21,Docs,SC$22,Dictionary,HashSet,Client$1,Order,Numeric,SC$23,MapUtil,Common,User,Server$1,Thread,Post,MousePosSt,Event,UIEvent,MouseBtnSt,SC$24,BalancedTree,Tree,Pair,LazyExtensionsProxy,LazyRecord,DocElemNode,CharacterData,Elt,Ordering,Settings,Mailbox,DictionaryUtil,Model,TodoItem,ListModel,Util,Anims,AnimatedAttrNode,Fresh$1,Concurrency,SC$25,PathUtil,Attrs$1,Dyn,Updates,DataEntry,DataView,SC$26,Docs$1,RunState,NodeSet,Key,Storage,AsyncBody,CT,DynamicAttrNode,SC$27,FormatException,AppendList,Queue,ArrayStorage,ListModels,Scheduler,CancellationTokenSource,HashSetUtil,HashSet$1,OperationCanceledException,DomNodes,CheckedInput,SC$28,String,Char,Math,String$1,$,console,IntelliFactory,Runtime$1,Date;
 Global=window;
 WebSharper=Global.WebSharper=Global.WebSharper||{};
 UI=WebSharper.UI=WebSharper.UI||{};
 Client=UI.Client=UI.Client||{};
 Site=UI.Site=UI.Site||{};
 List=WebSharper.List=WebSharper.List||{};
 SimpleTextBox=UI.SimpleTextBox=UI.SimpleTextBox||{};
 InputTransform=UI.InputTransform=UI.InputTransform||{};
 InputTransformHtml=UI.InputTransformHtml=UI.InputTransformHtml||{};
 TodoList=UI.TodoList=UI.TodoList||{};
 PhoneExample=UI.PhoneExample=UI.PhoneExample||{};
 EditablePersonList=UI.EditablePersonList=UI.EditablePersonList||{};
 CheckBoxTest=UI.CheckBoxTest=UI.CheckBoxTest||{};
 Calculator=UI.Calculator=UI.Calculator||{};
 ContactFlow=UI.ContactFlow=UI.ContactFlow||{};
 AnimatedContactFlow=UI.AnimatedContactFlow=UI.AnimatedContactFlow||{};
 MessageBoard=UI.MessageBoard=UI.MessageBoard||{};
 BobsleighSite=UI.BobsleighSite=UI.BobsleighSite||{};
 RoutedBobsleighSite=UI.RoutedBobsleighSite=UI.RoutedBobsleighSite||{};
 AnimatedBobsleighSite=UI.AnimatedBobsleighSite=UI.AnimatedBobsleighSite||{};
 ObjectConstancy=UI.ObjectConstancy=UI.ObjectConstancy||{};
 MouseInfo=UI.MouseInfo=UI.MouseInfo||{};
 KeyboardInfo=UI.KeyboardInfo=UI.KeyboardInfo||{};
 Samples=UI.Samples=UI.Samples||{};
 BobsleighSitePage=Samples.BobsleighSitePage=Samples.BobsleighSitePage||{};
 SampleTy=Samples.SampleTy=Samples.SampleTy||{};
 PageTy=Samples.PageTy=Samples.PageTy||{};
 WebSharper$UI$Samples_Router=Global.WebSharper$UI$Samples_Router=Global.WebSharper$UI$Samples_Router||{};
 WebSharper$UI$Samples_Templates=Global.WebSharper$UI$Samples_Templates=Global.WebSharper$UI$Samples_Templates||{};
 Router=UI.Router=UI.Router||{};
 Var=UI.Var=UI.Var||{};
 Operators=WebSharper.Operators=WebSharper.Operators||{};
 Obj=WebSharper.Obj=WebSharper.Obj||{};
 T=List.T=List.T||{};
 Arrays=WebSharper.Arrays=WebSharper.Arrays||{};
 SC$1=Global.StartupCode$WebSharper_UI_Samples$SimpleTextBox=Global.StartupCode$WebSharper_UI_Samples$SimpleTextBox||{};
 SC$2=Global.StartupCode$WebSharper_UI_Samples$InputTransform=Global.StartupCode$WebSharper_UI_Samples$InputTransform||{};
 SC$3=Global.StartupCode$WebSharper_UI_Samples$InputTransformHtml=Global.StartupCode$WebSharper_UI_Samples$InputTransformHtml||{};
 SC$4=Global.StartupCode$WebSharper_UI_Samples$TodoList=Global.StartupCode$WebSharper_UI_Samples$TodoList||{};
 SC$5=Global.StartupCode$WebSharper_UI_Samples$PhoneExample=Global.StartupCode$WebSharper_UI_Samples$PhoneExample||{};
 SC$6=Global.StartupCode$WebSharper_UI_Samples$EditablePersonList=Global.StartupCode$WebSharper_UI_Samples$EditablePersonList||{};
 SC$7=Global.StartupCode$WebSharper_UI_Samples$CheckBoxTest=Global.StartupCode$WebSharper_UI_Samples$CheckBoxTest||{};
 SC$8=Global.StartupCode$WebSharper_UI_Samples$Calculator=Global.StartupCode$WebSharper_UI_Samples$Calculator||{};
 SC$9=Global.StartupCode$WebSharper_UI_Samples$ContactFlow=Global.StartupCode$WebSharper_UI_Samples$ContactFlow||{};
 SC$10=Global.StartupCode$WebSharper_UI_Samples$AnimatedContactFlow=Global.StartupCode$WebSharper_UI_Samples$AnimatedContactFlow||{};
 SC$11=Global.StartupCode$WebSharper_UI_Samples$MessageBoard=Global.StartupCode$WebSharper_UI_Samples$MessageBoard||{};
 SC$12=Global.StartupCode$WebSharper_UI_Samples$BobsleighSite=Global.StartupCode$WebSharper_UI_Samples$BobsleighSite||{};
 SC$13=Global.StartupCode$WebSharper_UI_Samples$RoutedBobsleighSite=Global.StartupCode$WebSharper_UI_Samples$RoutedBobsleighSite||{};
 SC$14=Global.StartupCode$WebSharper_UI_Samples$AnimatedBobsleighSite=Global.StartupCode$WebSharper_UI_Samples$AnimatedBobsleighSite||{};
 SC$15=Global.StartupCode$WebSharper_UI_Samples$ObjectConstancy=Global.StartupCode$WebSharper_UI_Samples$ObjectConstancy||{};
 SC$16=Global.StartupCode$WebSharper_UI_Samples$MouseInfo=Global.StartupCode$WebSharper_UI_Samples$MouseInfo||{};
 SC$17=Global.StartupCode$WebSharper_UI_Samples$KeyboardInfo=Global.StartupCode$WebSharper_UI_Samples$KeyboardInfo||{};
 Sitelets=WebSharper.Sitelets=WebSharper.Sitelets||{};
 RouterOperators=Sitelets.RouterOperators=Sitelets.RouterOperators||{};
 Route=Sitelets.Route=Sitelets.Route||{};
 RouterModule=Sitelets.RouterModule=Sitelets.RouterModule||{};
 Doc=UI.Doc=UI.Doc||{};
 AboutEntry=Site.AboutEntry=Site.AboutEntry||{};
 Utilities=UI.Utilities=UI.Utilities||{};
 HtmlModule=UI.HtmlModule=UI.HtmlModule||{};
 attr=HtmlModule.attr=HtmlModule.attr||{};
 Sample=Samples.Sample=Samples.Sample||{};
 SortableBarChart=UI.SortableBarChart=UI.SortableBarChart||{};
 JavaScript=WebSharper.JavaScript=WebSharper.JavaScript||{};
 Pervasives=JavaScript.Pervasives=JavaScript.Pervasives||{};
 View=UI.View=UI.View||{};
 Unchecked=WebSharper.Unchecked=WebSharper.Unchecked||{};
 AttrProxy=UI.AttrProxy=UI.AttrProxy||{};
 Builder=Samples.Builder=Samples.Builder||{};
 Person=EditablePersonList.Person=EditablePersonList.Person||{};
 Person$1=CheckBoxTest.Person=CheckBoxTest.Person||{};
 Calculator$1=Calculator.Calculator=Calculator.Calculator||{};
 Op=Calculator.Op=Calculator.Op||{};
 Flow=UI.Flow=UI.Flow||{};
 Person$2=ContactFlow.Person=ContactFlow.Person||{};
 ContactType=ContactFlow.ContactType=ContactFlow.ContactType||{};
 Interpolation=UI.Interpolation=UI.Interpolation||{};
 Easing=UI.Easing=UI.Easing||{};
 An=UI.An=UI.An||{};
 Trans=UI.Trans=UI.Trans||{};
 Person$3=AnimatedContactFlow.Person=AnimatedContactFlow.Person||{};
 ContactType$1=AnimatedContactFlow.ContactType=AnimatedContactFlow.ContactType||{};
 Collections=WebSharper.Collections=WebSharper.Collections||{};
 Map=Collections.Map=Collections.Map||{};
 Page=AnimatedBobsleighSite.Page=AnimatedBobsleighSite.Page||{};
 Input=UI.Input=UI.Input||{};
 Keyboard=Input.Keyboard=Input.Keyboard||{};
 Seq=WebSharper.Seq=WebSharper.Seq||{};
 JSModule=JavaScript.JSModule=JavaScript.JSModule||{};
 Router$1=Sitelets.Router=Sitelets.Router||{};
 List$1=Sitelets.List=Sitelets.List||{};
 EventTarget=Global.EventTarget;
 Utils=WebSharper.Utils=WebSharper.Utils||{};
 ConcreteVar=UI.ConcreteVar=UI.ConcreteVar||{};
 Snap=UI.Snap=UI.Snap||{};
 Node=Global.Node;
 AttrModule=UI.AttrModule=UI.AttrModule||{};
 SC$18=Global.StartupCode$WebSharper_UI_Samples$Samples=Global.StartupCode$WebSharper_UI_Samples$Samples||{};
 SC$19=Global.StartupCode$WebSharper_UI_Samples$Site=Global.StartupCode$WebSharper_UI_Samples$Site||{};
 SiteCommon=UI.SiteCommon=UI.SiteCommon||{};
 Meta=SiteCommon.Meta=SiteCommon.Meta||{};
 SC$20=Global.StartupCode$WebSharper_UI_Samples$SortableBarChart=Global.StartupCode$WebSharper_UI_Samples$SortableBarChart||{};
 DomUtility=UI.DomUtility=UI.DomUtility||{};
 Attrs=UI.Attrs=UI.Attrs||{};
 System=Global.System=Global.System||{};
 Guid=System.Guid=System.Guid||{};
 Templating=UI.Templating=UI.Templating||{};
 Runtime=Templating.Runtime=Templating.Runtime||{};
 Server=Runtime.Server=Runtime.Server||{};
 TemplateInstance=Server.TemplateInstance=Server.TemplateInstance||{};
 Handler=Server.Handler=Server.Handler||{};
 Phone=PhoneExample.Phone=PhoneExample.Phone||{};
 Restaurant=CheckBoxTest.Restaurant=CheckBoxTest.Restaurant||{};
 FlowBuilder=UI.FlowBuilder=UI.FlowBuilder||{};
 DoubleInterpolation=UI.DoubleInterpolation=UI.DoubleInterpolation||{};
 Easings=UI.Easings=UI.Easings||{};
 FSharpMap=Collections.FSharpMap=Collections.FSharpMap||{};
 Action=MessageBoard.Action=MessageBoard.Action||{};
 Auth=MessageBoard.Auth=MessageBoard.Auth||{};
 State=MessageBoard.State=MessageBoard.State||{};
 Component=Auth.Component=Auth.Component||{};
 Context=BobsleighSite.Context=BobsleighSite.Context||{};
 Context$1=AnimatedBobsleighSite.Context=AnimatedBobsleighSite.Context||{};
 Slice=WebSharper.Slice=WebSharper.Slice||{};
 DataSet=ObjectConstancy.DataSet=ObjectConstancy.DataSet||{};
 StateView=ObjectConstancy.StateView=ObjectConstancy.StateView||{};
 Mouse=Input.Mouse=Input.Mouse||{};
 KeyListenerSt=Input.KeyListenerSt=Input.KeyListenerSt||{};
 Enumerator=WebSharper.Enumerator=WebSharper.Enumerator||{};
 Object=Global.Object;
 T$1=Enumerator.T=Enumerator.T||{};
 Lazy=WebSharper.Lazy=WebSharper.Lazy||{};
 Strings=WebSharper.Strings=WebSharper.Strings||{};
 Abbrev=UI.Abbrev=UI.Abbrev||{};
 Fresh=Abbrev.Fresh=Abbrev.Fresh||{};
 Async=Abbrev.Async=Abbrev.Async||{};
 Array=UI.Array=UI.Array||{};
 SC$21=Global.StartupCode$WebSharper_UI$DomUtility=Global.StartupCode$WebSharper_UI$DomUtility||{};
 Docs=UI.Docs=UI.Docs||{};
 SC$22=Global.StartupCode$WebSharper_UI$Attr_Client=Global.StartupCode$WebSharper_UI$Attr_Client||{};
 Dictionary=Collections.Dictionary=Collections.Dictionary||{};
 HashSet=Collections.HashSet=Collections.HashSet||{};
 Client$1=Runtime.Client=Runtime.Client||{};
 Order=PhoneExample.Order=PhoneExample.Order||{};
 Numeric=WebSharper.Numeric=WebSharper.Numeric||{};
 SC$23=Global.StartupCode$WebSharper_UI$Animation=Global.StartupCode$WebSharper_UI$Animation||{};
 MapUtil=Collections.MapUtil=Collections.MapUtil||{};
 Common=UI.Common=UI.Common||{};
 User=Common.User=Common.User||{};
 Server$1=UI.Server=UI.Server||{};
 Thread=Common.Thread=Common.Thread||{};
 Post=Common.Post=Common.Post||{};
 MousePosSt=Input.MousePosSt=Input.MousePosSt||{};
 Event=Global.Event;
 UIEvent=Global.UIEvent;
 MouseBtnSt=Input.MouseBtnSt=Input.MouseBtnSt||{};
 SC$24=Global.StartupCode$WebSharper_UI$Input=Global.StartupCode$WebSharper_UI$Input||{};
 BalancedTree=Collections.BalancedTree=Collections.BalancedTree||{};
 Tree=BalancedTree.Tree=BalancedTree.Tree||{};
 Pair=Collections.Pair=Collections.Pair||{};
 LazyExtensionsProxy=WebSharper.LazyExtensionsProxy=WebSharper.LazyExtensionsProxy||{};
 LazyRecord=LazyExtensionsProxy.LazyRecord=LazyExtensionsProxy.LazyRecord||{};
 DocElemNode=UI.DocElemNode=UI.DocElemNode||{};
 CharacterData=Global.CharacterData;
 Elt=UI.Elt=UI.Elt||{};
 Ordering=SortableBarChart.Ordering=SortableBarChart.Ordering||{};
 Settings=Client.Settings=Client.Settings||{};
 Mailbox=Abbrev.Mailbox=Abbrev.Mailbox||{};
 DictionaryUtil=Collections.DictionaryUtil=Collections.DictionaryUtil||{};
 Model=TodoList.Model=TodoList.Model||{};
 TodoItem=TodoList.TodoItem=TodoList.TodoItem||{};
 ListModel=UI.ListModel=UI.ListModel||{};
 Util=TodoList.Util=TodoList.Util||{};
 Anims=UI.Anims=UI.Anims||{};
 AnimatedAttrNode=UI.AnimatedAttrNode=UI.AnimatedAttrNode||{};
 Fresh$1=Common.Fresh=Common.Fresh||{};
 Concurrency=WebSharper.Concurrency=WebSharper.Concurrency||{};
 SC$25=Global.StartupCode$WebSharper_UI$Abbrev=Global.StartupCode$WebSharper_UI$Abbrev||{};
 PathUtil=Sitelets.PathUtil=Sitelets.PathUtil||{};
 Attrs$1=Client.Attrs=Client.Attrs||{};
 Dyn=Attrs$1.Dyn=Attrs$1.Dyn||{};
 Updates=UI.Updates=UI.Updates||{};
 DataEntry=SortableBarChart.DataEntry=SortableBarChart.DataEntry||{};
 DataView=SortableBarChart.DataView=SortableBarChart.DataView||{};
 SC$26=Global.StartupCode$WebSharper_UI$Doc_Client=Global.StartupCode$WebSharper_UI$Doc_Client||{};
 Docs$1=Client.Docs=Client.Docs||{};
 RunState=Docs$1.RunState=Docs$1.RunState||{};
 NodeSet=Docs$1.NodeSet=Docs$1.NodeSet||{};
 Key=UI.Key=UI.Key||{};
 Storage=UI.Storage=UI.Storage||{};
 AsyncBody=Concurrency.AsyncBody=Concurrency.AsyncBody||{};
 CT=Concurrency.CT=Concurrency.CT||{};
 DynamicAttrNode=UI.DynamicAttrNode=UI.DynamicAttrNode||{};
 SC$27=Global.StartupCode$WebSharper_Main$Concurrency=Global.StartupCode$WebSharper_Main$Concurrency||{};
 FormatException=WebSharper.FormatException=WebSharper.FormatException||{};
 AppendList=UI.AppendList=UI.AppendList||{};
 Queue=WebSharper.Queue=WebSharper.Queue||{};
 ArrayStorage=Storage.ArrayStorage=Storage.ArrayStorage||{};
 ListModels=UI.ListModels=UI.ListModels||{};
 Scheduler=Concurrency.Scheduler=Concurrency.Scheduler||{};
 CancellationTokenSource=WebSharper.CancellationTokenSource=WebSharper.CancellationTokenSource||{};
 HashSetUtil=Collections.HashSetUtil=Collections.HashSetUtil||{};
 HashSet$1=Abbrev.HashSet=Abbrev.HashSet||{};
 OperationCanceledException=WebSharper.OperationCanceledException=WebSharper.OperationCanceledException||{};
 DomNodes=Docs$1.DomNodes=Docs$1.DomNodes||{};
 CheckedInput=UI.CheckedInput=UI.CheckedInput||{};
 SC$28=Global.StartupCode$WebSharper_UI$AppendList=Global.StartupCode$WebSharper_UI$AppendList||{};
 String=UI.String=UI.String||{};
 Char=WebSharper.Char=WebSharper.Char||{};
 Math=Global.Math;
 String$1=Global.String;
 $=Global.jQuery;
 console=Global.console;
 IntelliFactory=Global.IntelliFactory;
 Runtime$1=IntelliFactory&&IntelliFactory.Runtime;
 Date=Global.Date;
 Client.Main=function()
 {
  Site.Main(List.ofArray([SimpleTextBox.Sample(),InputTransform.Sample(),InputTransformHtml.Sample(),TodoList.Sample(),PhoneExample.Sample(),EditablePersonList.Sample(),CheckBoxTest.Sample(),Calculator.Sample(),ContactFlow.Sample(),AnimatedContactFlow.Sample(),MessageBoard.Sample(),BobsleighSite.Sample(),RoutedBobsleighSite.Sample(),AnimatedBobsleighSite.Sample(),ObjectConstancy.Sample(),MouseInfo.Sample(),KeyboardInfo.Sample()]));
 };
 Site.Main=function(samples)
 {
  var _var;
  function go(ty)
  {
   Var.Set(_var,ty);
  }
  _var=Router.InstallHash(PageTy.Home,WebSharper$UI$Samples_Router.r$2());
  Doc.RunById("main",Doc.BindView(function(a)
  {
   return a.$==1?Site.AboutPage(go):a.$==2?((Site.RenderSample(a.$0))(_var))(samples):Site.HomePage(go);
  },_var.get_View()));
  Doc.RunById("navigation",Site.NavBar(_var));
 };
 Site.AboutPage=function(go)
 {
  function renderBody(entry)
  {
   return Doc.Concat([Doc.Element("h1",[],[Doc.TextNode(entry.Name)]),Doc.Element("p",[Utilities.cls("lead")],[Doc.TextNode(entry.Description)]),Doc.Element("p",[],[Doc.Element("ul",[Utilities.cls("list-unstyled")],List.map(function(lnk)
   {
    return Doc.Element("li",[],[lnk]);
   },entry.URLs))])]);
  }
  function oddEntry(entry)
  {
   return Doc.Element("section",[Utilities.cls("block-large")],[Utilities.divc("container",[Utilities.divc("row",[Utilities.divc("col-lg-3",[Doc.Element("img",[AttrProxy.Create("src",entry.ImgURL),Utilities.sty("width","100%")],[])]),Utilities.divc("col-lg-1",[]),Utilities.divc("col-lg-8",[renderBody(entry)])])])]);
  }
  function evenEntry(entry)
  {
   return Doc.Element("section",[Utilities.cls("block-large"),Utilities.cls("bg-alt")],[Utilities.divc("container",[Utilities.divc("row",[Utilities.divc("col-lg-8",[renderBody(entry)]),Utilities.divc("col-lg-1",[]),Utilities.divc("col-lg-3",[Doc.Element("img",[AttrProxy.Create("src",entry.ImgURL),Utilities.sty("width","100%")],[])])])])]);
  }
  function ico(name)
  {
   return Doc.Element("span",[Utilities.cls("fa"),Utilities.cls(name),Utilities.cls("fa-3x"),Utilities.sty("font-size","400%"),Utilities.sty("color","#aaa")],[]);
  }
  return Utilities.divc("extensions",[Utilities.divc("container",[Doc.Element("section",[Utilities.cls("block-huge")],[Doc.Element("h1",[],[Doc.TextNode("WebSharper UI: "),Doc.Element("span",[Utilities.cls("text-muted")],[Doc.TextNode("Everything you need to know.")])]),Doc.Element("p",[Utilities.cls("lead")],[Doc.TextNode("A selection of resources about UI.")])])]),Utilities.divc("block-large bg-alt",[Utilities.divc("container",[Utilities.divc("row text-center",[Utilities.divc("col-lg-4",[ico("fa-graduation-cap"),Doc.Element("h3",[],[Doc.TextNode("Get Started")]),Doc.Element("p",[],[Doc.TextNode("Take the tutorial, and you'll be writing reactive applications in no time!")]),Site.linkBtn("Tutorial","https://github.com/intellifactory/websharper.ui.next/blob/master/docs/Tutorial.md")]),Utilities.divc("col-lg-4",[ico("fa-book"),Doc.Element("h3",[],[Doc.TextNode("Dive Right In")]),Doc.Element("p",[],[Doc.TextNode("Comprehensive documentation on the UI API.")]),Site.linkBtn("API Reference","https://github.com/intellifactory/websharper.ui.next/blob/master/docs/API.md")]),Utilities.divc("col-lg-4",[ico("fa-send"),Doc.Element("h3",[],[Doc.TextNode("See it in Action")]),Doc.Element("p",[],[Doc.TextNode("A variety of samples using UI, and their associated source code!")]),Doc.Button("Samples",[Utilities.cls("btn"),Utilities.cls("btn-default")],function()
  {
   go(Samples.SamplesDefault());
  })])])])]),Doc.Concat(List.mapi(function($1,$2)
  {
   return(function(i)
   {
    return i%2===0?oddEntry:evenEntry;
   }($1))($2);
  },Site.Entries()))]);
 };
 Site.RenderSample=function(a)
 {
  return a.$==1?InputTransform.Sample().Page:a.$==2?InputTransformHtml.Sample().Page:a.$==3?TodoList.Sample().Page:a.$==4?PhoneExample.Sample().Page:a.$==5?EditablePersonList.Sample().Page:a.$==6?CheckBoxTest.Sample().Page:a.$==7?Calculator.Sample().Page:a.$==8?ContactFlow.Sample().Page:a.$==9?AnimatedContactFlow.Sample().Page:a.$==10?MessageBoard.Sample().Page:a.$==11?BobsleighSite.Sample().Page:a.$==12?RoutedBobsleighSite.Sample().Page:a.$==13?AnimatedBobsleighSite.Sample().Page:a.$==14?ObjectConstancy.Sample().Page:a.$==15?MouseInfo.Sample().Page:a.$==16?KeyboardInfo.Sample().Page:a.$==17?SortableBarChart.Sample().Page:SimpleTextBox.Sample().Page;
 };
 Site.HomePage=function(go)
 {
  return Utilities.divc("container",[Doc.Element("section",[Utilities.cls("block-huge"),Utilities.cls("teaser-home"),Utilities.sty("height","700px"),Utilities.sty("padding-top","40px"),Utilities.sty("padding-bottom","30px"),Utilities.sty("margin-bottom","40px")],[Utilities.divc("container",[Utilities.divc("row",[Utilities.divc("col-12",[Doc.Element("br",[],[]),Doc.Element("h1",[],[Doc.TextNode("WebSharper UI: "),Doc.Element("span",[Utilities.cls("text-muted")],[Doc.TextNode("A new generation of reactive web applications.")])]),Doc.Element("h3",[],[Doc.TextNode("Write powerful, data-backed applications"),Doc.Element("br",[],[]),Doc.TextNode(" using F# and WebSharper.")]),Doc.Element("p",[Utilities.cls("lead")],[Doc.TextNode("Get it free on NuGet today!")])])])])])]);
 };
 Site.NavBar=function(v)
 {
  function renderExternal(title,lnk)
  {
   return Doc.Element("li",[Utilities.cls("nav-item")],[Utilities.href(title,lnk)]);
  }
  return Doc.Element("nav",[Utilities.cls("container")],[Doc.Element("div",[Utilities.sty("float","left")],[Doc.Element("a",[AttrProxy.Create("href","http://www.websharper.com/home"),Utilities.sty("text-decoration","none"),Utilities.cls("first")],[Doc.Element("img",[AttrProxy.Create("src","files/logo-websharper-icon.png"),AttrProxy.Create("alt","[logo]"),Utilities.sty("margin-top","0"),Utilities.sty("border-right","1px"),Utilities.sty("solid","#eee")],[]),Doc.Element("img",[AttrProxy.Create("src","files/logo-websharper-text-dark.png"),AttrProxy.Create("alt","WebSharper"),Utilities.sty("height","32px")],[])])]),Doc.Element("nav",[Utilities.cls("nav"),Utilities.cls("nav-collapsible"),Utilities.cls("right"),Utilities.sty("float","right")],[Doc.Element("ul",[Utilities.cls("nav-list")],[Doc.Concat(List.map(function(pg)
  {
   return Doc.EmbedView(View.Map(function(page)
   {
    var active;
    active=Unchecked.Equals(page,pg)?Utilities.cls("active"):Attrs.EmptyAttr();
    return Doc.Element("li",[Utilities.cls("nav-item"),active],[Doc.Link(Site.showPgTy(pg),[],function()
    {
     Var.Set(v,pg);
    })]);
   },v.get_View()));
  },Site.NavPages())),Doc.Concat(List.map(function($1)
  {
   return renderExternal($1[0],$1[1]);
  },Site.NavExternalLinks()))])])]);
 };
 Site.linkBtn=function(caption,href)
 {
  return Doc.Element("a",[Utilities.cls("btn"),Utilities.cls("btn-default"),AttrProxy.Create("href",href)],[Doc.TextNode(caption)]);
 };
 Site.Entries=function()
 {
  SC$19.$cctor();
  return SC$19.Entries;
 };
 Site.showPgTy=function(a)
 {
  return a.$==1?"About":a.$==2?"Samples":"Home";
 };
 Site.NavPages=function()
 {
  SC$19.$cctor();
  return SC$19.NavPages;
 };
 Site.NavExternalLinks=function()
 {
  SC$19.$cctor();
  return SC$19.NavExternalLinks;
 };
 Site.mkEntry=function(name,desc,img,urls)
 {
  return AboutEntry.New(name,img,desc,urls);
 };
 Site.fadeTime=function()
 {
  SC$19.$cctor();
  return SC$19.fadeTime;
 };
 Site.Fade=function()
 {
  SC$19.$cctor();
  return SC$19.Fade;
 };
 List.ofArray=function(arr)
 {
  var r,i,$1;
  r=T.Empty;
  for(i=Arrays.length(arr)-1,$1=0;i>=$1;i--)r=new T({
   $:1,
   $0:Arrays.get(arr,i),
   $1:r
  });
  return r;
 };
 List.map=function(f,x)
 {
  var r,l,go,res,t;
  if(x.$==0)
   return x;
  else
   {
    res=new T({
     $:1
    });
    r=res;
    l=x;
    go=true;
    while(go)
     {
      r.$0=f(l.$0);
      l=l.$1;
      l.$==0?go=false:r=(t=new T({
       $:1
      }),r.$1=t,t);
     }
    r.$1=T.Empty;
    return res;
   }
 };
 List.mapi=function(f,x)
 {
  var r,l,i,go,res,t;
  if(x.$==0)
   return x;
  else
   {
    res=new T({
     $:1
    });
    r=res;
    l=x;
    i=0;
    go=true;
    while(go)
     {
      r.$0=f(i,l.$0);
      l=l.$1;
      l.$==0?go=false:(r=(t=new T({
       $:1
      }),r.$1=t,t),i=i+1);
     }
    r.$1=T.Empty;
    return res;
   }
 };
 List.rev=function(l)
 {
  var res,r;
  res=T.Empty;
  r=l;
  while(r.$==1)
   {
    res=new T({
     $:1,
     $0:r.$0,
     $1:res
    });
    r=r.$1;
   }
  return res;
 };
 List.filter=function(p,l)
 {
  return List.ofSeq(Seq.filter(p,l));
 };
 List.sortWith=function(f,l)
 {
  var a;
  a=Arrays.ofList(l);
  Arrays.sortInPlaceWith(f,a);
  return List.ofArray(a);
 };
 List.exists=function(p,x)
 {
  var e,l;
  e=false;
  l=x;
  while(!e&&l.$==1)
   {
    e=p(l.$0);
    l=l.$1;
   }
  return e;
 };
 List.head=function(l)
 {
  return l.$==1?l.$0:List.listEmpty();
 };
 List.tail=function(l)
 {
  return l.$==1?l.$1:List.listEmpty();
 };
 List.ofSeq=function(s)
 {
  var e,$1,go,r,res,t;
  if(s instanceof T)
   return s;
  else
   if(s instanceof Global.Array)
    return List.ofArray(s);
   else
    {
     e=Enumerator.Get(s);
     try
     {
      go=e.MoveNext();
      if(!go)
       $1=T.Empty;
      else
       {
        res=new T({
         $:1
        });
        r=res;
        while(go)
         {
          r.$0=e.Current();
          e.MoveNext()?r=(t=new T({
           $:1
          }),r.$1=t,t):go=false;
         }
        r.$1=T.Empty;
        $1=res;
       }
      return $1;
     }
     finally
     {
      if("Dispose"in e)
       e.Dispose();
     }
    }
 };
 List.listEmpty=function()
 {
  return Operators.FailWith("The input list was empty.");
 };
 List.length=function(l)
 {
  var r,i;
  r=l;
  i=0;
  while(r.$==1)
   {
    r=List.tail(r);
    i=i+1;
   }
  return i;
 };
 List.append=function(x,y)
 {
  var r,l,go,res,t;
  if(x.$==0)
   return y;
  else
   if(y.$==0)
    return x;
   else
    {
     res=new T({
      $:1
     });
     r=res;
     l=x;
     go=true;
     while(go)
      {
       r.$0=l.$0;
       l=l.$1;
       l.$==0?go=false:r=(t=new T({
        $:1
       }),r.$1=t,t);
      }
     r.$1=y;
     return res;
    }
 };
 List.iter=function(f,l)
 {
  var r;
  r=l;
  while(r.$==1)
   {
    f(List.head(r));
    r=List.tail(r);
   }
 };
 SimpleTextBox.Sample=function()
 {
  SC$1.$cctor();
  return SC$1.Sample;
 };
 SimpleTextBox.Main=function(a)
 {
  var rvText,inputField,label;
  rvText=Var.Create$1("");
  inputField=Doc.Input([AttrProxy.Create("class","form-control")],rvText);
  label=Doc.TextView(rvText.get_View());
  return Utilities.divc("panel-default",[Utilities.divc("panel-body",[Doc.Element("div",[],[inputField]),Doc.Element("div",[],[label])])]);
 };
 SimpleTextBox.Description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("A label which copies the contents of a text box.")]);
 };
 InputTransform.Sample=function()
 {
  SC$2.$cctor();
  return SC$2.Sample;
 };
 InputTransform.Main=function(a)
 {
  var rvText,inputField,view,viewCaps,viewReverse,viewWordCount,views;
  function tableRow(lbl,view$1)
  {
   return Doc.Element("tr",[],[Doc.Element("td",[],[Doc.TextNode(lbl)]),Doc.Element("td",[Utilities.sty("width","70%")],[Doc.TextView(view$1)])]);
  }
  rvText=Var.Create$1("");
  inputField=Doc.Element("div",[Utilities.cls("panel"),Utilities.cls("panel-default")],[Doc.Element("div",[Utilities.cls("panel-heading")],[Doc.Element("h3",[Utilities.cls("panel-title")],[Doc.TextNode("Input")])]),Doc.Element("div",[Utilities.cls("panel-body")],[Doc.Element("form",[Utilities.cls("form-horizontal"),AttrProxy.Create("role","form")],[Doc.Element("div",[Utilities.cls("form-group")],[Doc.Element("label",[Utilities.cls("col-sm-2"),Utilities.cls("control-label"),AttrProxy.Create("for","inputBox")],[Doc.TextNode("Write something: ")]),Doc.Element("div",[Utilities.cls("col-sm-10")],[Doc.Input([AttrProxy.Create("class","form-control"),AttrProxy.Create("id","inputBox")],rvText)])])])])]);
  view=rvText.get_View();
  viewCaps=View.Map(function(s)
  {
   return s.toUpperCase();
  },view);
  viewReverse=View.Map(function(s)
  {
   return Strings.ToCharArray(s).slice().reverse().join("");
  },view);
  viewWordCount=View.Map(function(s)
  {
   return Arrays.length(Strings.SplitChars(s,[" "],0));
  },view);
  views=List.ofArray([["Entered Text",view],["Capitalised",viewCaps],["Reversed",viewReverse],["Word Count",View.Map(Global.String,viewWordCount)],["Is the word count odd or even?",View.Map(function(i)
  {
   return i%2===0?"Even":"Odd";
  },viewWordCount)]]);
  return Doc.Element("div",[],[inputField,Utilities.divc("panel panel-default",[Utilities.divc("panel-heading",[Doc.Element("h3",[Utilities.cls("panel-title")],[Doc.TextNode("Output")])]),Utilities.divc("panel-body",[Doc.Element("table",[Utilities.cls("table")],[Doc.Element("tbody",[],[Doc.Concat(List.map(function($1)
  {
   return tableRow($1[0],$1[1]);
  },views))])])])])]);
 };
 InputTransform.Description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("Transforming the data provided by a single data source.")]);
 };
 InputTransformHtml.Sample=function()
 {
  SC$3.$cctor();
  return SC$3.Sample;
 };
 InputTransformHtml.Main=function(a)
 {
  var rvText,view,viewCaps,viewReverse,viewWordCount,views,p,$1,c,$2,r,p$1;
  function m(lbl,view$1)
  {
   var $3,p$2,c$1;
   return($3=[null],(p$2=Handler.CompleteHoles((c$1=Guid.NewGuid(),Global.String(c$1)),new T({
    $:1,
    $0:{
     $:2,
     $0:"view",
     $1:view$1
    },
    $1:new T({
     $:1,
     $0:{
      $:1,
      $0:"lbl",
      $1:lbl
     },
     $1:T.Empty
    })
   }),[]),($3[0]=new TemplateInstance.New(p$2[1],WebSharper$UI$Samples_Templates.tablerow(p$2[0])),$3[0]))).get_Doc();
  }
  rvText=Var.Create$1("");
  view=rvText.get_View();
  viewCaps=View.Map(function(s)
  {
   return s.toUpperCase();
  },view);
  viewReverse=View.Map(function(s)
  {
   return Strings.ToCharArray(s).slice().reverse().join("");
  },view);
  viewWordCount=View.Map(function(s)
  {
   return Arrays.length(Strings.SplitChars(s,[" "],0));
  },view);
  views=List.ofArray([["Entered Text",view],["Capitalised",viewCaps],["Reversed",viewReverse],["Word Count",View.Map(Global.String,viewWordCount)],["Is the word count odd or even?",View.Map(function(i)
  {
   return i%2===0?"Even":"Odd";
  },viewWordCount)]]);
  return(p=($1=(c=Guid.NewGuid(),Global.String(c)),($2=new T({
   $:1,
   $0:{
    $:8,
    $0:"inputtext",
    $1:rvText
   },
   $1:T.Empty
  }),[[null],$1,new T({
   $:1,
   $0:{
    $:0,
    $0:"tablebody",
    $1:Doc.Concat(List.map(function($3)
    {
     return m($3[0],$3[1]);
    },views))
   },
   $1:$2
  })])),(r=p[0],(p$1=Handler.CompleteHoles(p[1],p[2],[["inputtext",0]]),(r[0]=new TemplateInstance.New(p$1[1],WebSharper$UI$Samples_Templates.t(p$1[0])),r[0])))).get_Doc();
 };
 InputTransformHtml.Description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("Similar to InputTransform, but using a html file and the Template type provider.")]);
 };
 TodoList.Sample=function()
 {
  SC$4.$cctor();
  return SC$4.Sample;
 };
 TodoList.Main=function(a)
 {
  return TodoList.TodoExample();
 };
 TodoList.Description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("A to-do list application.")]);
 };
 TodoList.TodoExample=function()
 {
  var m;
  m=TodoList.CreateModel();
  return Doc.Element("table",[AttrProxy.Create("class","table table-hover")],[Doc.Element("tbody",[],[TodoList.TodoList(m),TodoList.TodoForm(m)])]);
 };
 TodoList.CreateModel=function()
 {
  return Model.New(ListModel.Create(function(item)
  {
   return item.Key;
  },T.Empty));
 };
 TodoList.TodoList=function(m)
 {
  return Doc.ConvertBy(function(m$1)
  {
   return m$1.Key;
  },function(t)
  {
   return TodoList.RenderItem(m,t);
  },m.Items.v);
 };
 TodoList.TodoForm=function(m)
 {
  var rvInput;
  rvInput=Var.Create$1("");
  return Doc.Element("form",[],[Utilities.divc("form-group",[Doc.Element("label",[],[Doc.TextNode("New entry: ")]),Util.input(rvInput)]),Util.button("Submit",function()
  {
   m.Items.Append(TodoItem.Create(rvInput.Get()));
  })]);
 };
 TodoList.RenderItem=function(m,todo)
 {
  return Doc.Element("tr",[],[Doc.Element("td",[],[Doc.EmbedView(View.Map(function(isDone)
  {
   return isDone?Doc.Element("del",[],[Doc.TextNode(todo.TodoText)]):Doc.TextNode(todo.TodoText);
  },todo.Done.get_View()))]),Doc.Element("td",[],[Util.button("Done",function()
  {
   Var.Set(todo.Done,true);
  })]),Doc.Element("td",[],[Util.button("Remove",function()
  {
   m.Items.Remove(todo);
  })])]);
 };
 PhoneExample.Sample=function()
 {
  SC$5.$cctor();
  return SC$5.Sample;
 };
 PhoneExample.Main=function(a)
 {
  return PhoneExample.PhonesWidget(List.ofArray([Phone.New("Nexus S","Fast just got faster with Nexus S.",1),Phone.New("Motorola XOOM","The Next, Next generation tablet",2),Phone.New("Motorola XOOM with Wi-Fi","The Next, Next generation tablet",3),Phone.New("Samsung Galaxy","The Ultimate Phone",4)]));
 };
 PhoneExample.Description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("Taken from the "),Utilities.href("AngularJS Tutorial","https://docs.angularjs.org/tutorial/"),Doc.TextNode(", a list filtering and sorting application for phones.")]);
 };
 PhoneExample.PhonesWidget=function(phones)
 {
  var query,order,visiblePhones;
  function showPhone(ph)
  {
   return Doc.Element("li",[],[Doc.Element("span",[],[Doc.TextNode(ph.Name)]),Doc.Element("p",[],[Doc.TextNode(ph.Snippet)])]);
  }
  Var.Create$1(phones);
  query=Var.Create$1("");
  order=Var.Create$1(Order.Newest);
  visiblePhones=View.Map2(function(query$1,order$1)
  {
   return List.sortWith(function(a,a$1)
   {
    return Phone.Compare(order$1,a,a$1);
   },List.filter(function(a)
   {
    return Phone.MatchesQuery(query$1,a);
   },phones));
  },query.get_View(),order.get_View());
  return Utilities.divc("row",[Utilities.divc("col-sm-6",[Doc.TextNode("Search: "),Doc.Input([AttrProxy.Create("class","form-control")],query),Doc.TextNode("Sort by: "),Doc.Select([AttrProxy.Create("class","form-control")],Order.Show,List.ofArray([Order.Newest,Order.Alphabetical]),order)]),Utilities.divc("col-sm-6",[Doc.Element("ul",[],[Doc.EmbedView(View.Map(function(phones$1)
  {
   return Doc.Concat(List.map(showPhone,phones$1));
  },visiblePhones))])])]);
 };
 EditablePersonList.Sample=function()
 {
  SC$6.$cctor();
  return SC$6.Sample;
 };
 EditablePersonList.createPerson=function(first,last)
 {
  return Person.New(Var.Create$1(first),Var.Create$1(last));
 };
 EditablePersonList.peopleList=function()
 {
  SC$6.$cctor();
  return SC$6.peopleList;
 };
 EditablePersonList.Main=function(a)
 {
  return Doc.Element("div",[],[Doc.Element("div",[],[Doc.Element("h1",[],[Doc.TextNode("Member List")]),EditablePersonList.memberList()]),Doc.Element("div",[],[Doc.Element("h1",[],[Doc.TextNode("Change Member Details")]),EditablePersonList.peopleBoxes()])]);
 };
 EditablePersonList.Description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("An example inspired by a "),Utilities.href("SAP OpenUI sample","http://jsbin.com/openui5-HTML-templates/1/edit"),Doc.TextNode(".")]);
 };
 EditablePersonList.memberList=function()
 {
  SC$6.$cctor();
  return SC$6.memberList;
 };
 EditablePersonList.peopleBoxes=function()
 {
  SC$6.$cctor();
  return SC$6.peopleBoxes;
 };
 CheckBoxTest.Sample=function()
 {
  SC$7.$cctor();
  return SC$7.Sample;
 };
 CheckBoxTest.Main=function(a)
 {
  var selPeople,checkBoxSection,radioBoxVar;
  selPeople=Var.Create$1(T.Empty);
  checkBoxSection=Doc.Element("div",[],[Doc.Element("div",[],List.map(function(person)
  {
   return Doc.Element("div",[],[Doc.CheckBoxGroup([],person,selPeople),Doc.TextNode(person.Name)]);
  },CheckBoxTest.People())),Doc.TextView(View.Map(function(xs)
  {
   return Seq.fold(function($1,$2)
   {
    return $1+$2.Name+", ";
   },"",xs);
  },selPeople.get_View()))]);
  radioBoxVar=Var.Create$1(Restaurant.Jelen);
  return Doc.Element("div",[],[checkBoxSection,Doc.Element("div",[],[Doc.Concat(List.map(function(restaurant)
  {
   return Doc.Element("div",[],[Doc.Radio([],restaurant,radioBoxVar),Doc.TextNode(CheckBoxTest.showRestaurant(restaurant))]);
  },List.ofArray([Restaurant.Csiga,Restaurant.Suszterinas,Restaurant.Jelen,Restaurant.Stex]))),Doc.TextView(View.Map(CheckBoxTest.showRestaurant,radioBoxVar.get_View()))])]);
 };
 CheckBoxTest.Description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("An application which shows the selected values.")]);
 };
 CheckBoxTest.People=function()
 {
  SC$7.$cctor();
  return SC$7.People;
 };
 CheckBoxTest.showRestaurant=function(a)
 {
  return a.$==1?"Suszterinas":a.$==2?"Csiga":a.$==3?"Stex":"Jelen";
 };
 Calculator.Sample=function()
 {
  SC$8.$cctor();
  return SC$8.Sample;
 };
 Calculator.Main=function(a)
 {
  return Calculator.calcView(Var.Create$1(Calculator.initCalc()));
 };
 Calculator.Description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("A calculator application")]);
 };
 Calculator.initCalc=function()
 {
  SC$8.$cctor();
  return SC$8.initCalc;
 };
 Calculator.calcView=function(rvCalc)
 {
  var cbtn,eqbtn;
  function btn(i)
  {
   return Calculator.calcBtn(i,rvCalc);
  }
  function obtn(o)
  {
   return Calculator.opBtn(o,rvCalc);
  }
  rvCalc.get_View();
  cbtn=Calculator.cBtn(rvCalc);
  eqbtn=Calculator.eqBtn(rvCalc);
  return Doc.Element("div",[],[Doc.Element("div",[Utilities.sty("border","solid 1px #aaa"),Utilities.sty("width","100px"),Utilities.sty("text-align","right"),Utilities.sty("padding","0 5px")],[Doc.TextView(Calculator.displayCalc(rvCalc))]),Doc.Element("div",[],[btn(1),btn(2),btn(3),obtn(Op.Add)]),Doc.Element("div",[],[btn(4),btn(5),btn(6),obtn(Op.Sub)]),Doc.Element("div",[],[btn(7),btn(8),btn(9),obtn(Op.Mul)]),Doc.Element("div",[],[btn(0),cbtn,eqbtn,obtn(Op.Div)])]);
 };
 Calculator.calcBtn=function(i,rvCalc)
 {
  return Calculator.button(Global.String(i),function()
  {
   Calculator.pushInt(i,rvCalc);
  });
 };
 Calculator.opBtn=function(o,rvCalc)
 {
  return Calculator.button(Calculator.showOp(o),function()
  {
   Calculator.shiftToMem(o,rvCalc);
  });
 };
 Calculator.cBtn=function(rvCalc)
 {
  return Calculator.button("C",function()
  {
   Var.Set(rvCalc,Calculator.initCalc());
  });
 };
 Calculator.eqBtn=function(rvCalc)
 {
  return Calculator.button("=",function()
  {
   Calculator.calculate(rvCalc);
  });
 };
 Calculator.displayCalc=function(rvCalc)
 {
  return View.Map(function(c)
  {
   return Global.String(c.Operand);
  },rvCalc.get_View());
 };
 Calculator.button=function(txt,f)
 {
  return Doc.Button(txt,[Utilities.sty("width","25px")],f);
 };
 Calculator.pushInt=function(x,rvCalc)
 {
  Var.Update(rvCalc,function(c)
  {
   return Calculator$1.New(c.Memory,c.Operand*10+x,c.Operation);
  });
 };
 Calculator.showOp=function(op)
 {
  return op.$==1?"-":op.$==2?"*":op.$==3?"/":"+";
 };
 Calculator.shiftToMem=function(op,rvCalc)
 {
  Var.Update(rvCalc,function(c)
  {
   return Calculator$1.New(c.Operand,0,op);
  });
 };
 Calculator.calculate=function(rvCalc)
 {
  Var.Update(rvCalc,function(c)
  {
   return Calculator$1.New(0,((Calculator.opFn(c.Operation))(c.Memory))(c.Operand),Op.Add);
  });
 };
 Calculator.opFn=function(op)
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
 };
 ContactFlow.Sample=function()
 {
  SC$9.$cctor();
  return SC$9.Sample;
 };
 ContactFlow.inputRow=function(rv,id,lblText,isArea)
 {
  return Utilities.divc("row",[Utilities.divc("form-group",[Doc.Element("label",[Utilities.cls("col-sm-2 control-label"),AttrProxy.Create("for",id)],[Doc.TextNode(lblText)]),Utilities.divc("col-sm-6",[((isArea?function(a)
  {
   return function(a$1)
   {
    return Doc.InputArea(a,a$1);
   };
  }:function(a)
  {
   return function(a$1)
   {
    return Doc.Input(a,a$1);
   };
  })(List.ofArray([AttrProxy.Create("type","text"),Utilities.cls("form-control"),AttrProxy.Create("id",id),AttrProxy.Create("placeholder",lblText)])))(rv)]),Utilities.divc("col-sm-4",[])])]);
 };
 ContactFlow.ExampleFlow=function(a)
 {
  var b;
  return Flow.Embed((b=Flow.get_Do(),b.Bind(ContactFlow.personFlowlet(),function(a$1)
  {
   return b.Bind(ContactFlow.contactTypeFlowlet(),function(a$2)
   {
    return b.Bind(ContactFlow.contactFlowlet(a$2),function(a$3)
    {
     return b.ReturnFrom(Flow.Static(ContactFlow.finalPage(a$1,a$3)));
    });
   });
  })));
 };
 ContactFlow.Description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("A WebSharper.UI flowlet implementation.")]);
 };
 ContactFlow.personFlowlet=function()
 {
  SC$9.$cctor();
  return SC$9.personFlowlet;
 };
 ContactFlow.contactTypeFlowlet=function()
 {
  SC$9.$cctor();
  return SC$9.contactTypeFlowlet;
 };
 ContactFlow.contactFlowlet=function(contactTy)
 {
  var p,label,constr;
  p=contactTy.$==1?["Phone Number",function(a)
  {
   return{
    $:1,
    $0:a
   };
  }]:["E-Mail Address",function(a)
  {
   return{
    $:0,
    $0:a
   };
  }];
  label=p[0];
  constr=p[1];
  return Flow.Define(function(cont)
  {
   var rvContact;
   rvContact=Var.Create$1("");
   return Doc.Element("form",[Utilities.cls("form-horizontal"),AttrProxy.Create("role","form")],[ContactFlow.inputRow(rvContact,"contact",label,false),Utilities.divc("form-group",[Utilities.divc("col-sm-offset-2 col-sm-10",[Doc.Button("Finish",[Utilities.cls("btn btn-default")],function()
   {
    cont(constr(rvContact.Get()));
   })])])]);
  });
 };
 ContactFlow.finalPage=function(person,details)
 {
  return Doc.Element("div",[],[Doc.TextNode("You said your name was "+person.Name+", your address was "+person.Address+", "),Doc.TextNode(" and you provided "+(details.$==1?"the phone number "+details.$0:"the e-mail address "+details.$0)+".")]);
 };
 AnimatedContactFlow.Sample=function()
 {
  SC$10.$cctor();
  return SC$10.Sample;
 };
 AnimatedContactFlow.fadeTime=function()
 {
  SC$10.$cctor();
  return SC$10.fadeTime;
 };
 AnimatedContactFlow.Fade=function()
 {
  SC$10.$cctor();
  return SC$10.Fade;
 };
 AnimatedContactFlow.swipeTime=function()
 {
  SC$10.$cctor();
  return SC$10.swipeTime;
 };
 AnimatedContactFlow.Swipe=function()
 {
  SC$10.$cctor();
  return SC$10.Swipe;
 };
 AnimatedContactFlow.inputRow=function(rv,id,lblText)
 {
  return Utilities.divc("form-group",[Doc.Element("label",[AttrProxy.Create("for",id),Utilities.cls("col-sm-2 control-label")],[Doc.TextNode(lblText)]),Utilities.divc("col-sm-10",[Doc.Input([AttrProxy.Create("type","text"),Utilities.cls("form-control"),AttrProxy.Create("id",id),AttrProxy.Create("placeholder",lblText)],rv)])]);
 };
 AnimatedContactFlow.AnimateFlow=function(pg)
 {
  return Doc.Element("div",[AttrModule.Style("position","relative"),AttrModule.AnimatedStyle("opacity",AnimatedContactFlow.FadeTransition(),View.Const(1),Global.String),AttrModule.AnimatedStyle("left",AnimatedContactFlow.SwipeTransition(),View.Const(0),function(x)
  {
   return Global.String(x)+"px";
  })],[pg]);
 };
 AnimatedContactFlow.ExampleFlow=function(a)
 {
  var b;
  return Flow.Embed((b=Flow.get_Do(),b.Bind(AnimatedContactFlow.personFlowlet(),function(a$1)
  {
   return b.Bind(AnimatedContactFlow.contactTypeFlowlet(),function(a$2)
   {
    return b.Bind(AnimatedContactFlow.contactFlowlet(a$2),function(a$3)
    {
     return b.ReturnFrom(Flow.Static(AnimatedContactFlow.finalPage(a$1,a$3)));
    });
   });
  })));
 };
 AnimatedContactFlow.Description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("A WebSharper.UI flowlet implementation.")]);
 };
 AnimatedContactFlow.FadeTransition=function()
 {
  SC$10.$cctor();
  return SC$10.FadeTransition;
 };
 AnimatedContactFlow.SwipeTransition=function()
 {
  SC$10.$cctor();
  return SC$10.SwipeTransition;
 };
 AnimatedContactFlow.personFlowlet=function()
 {
  SC$10.$cctor();
  return SC$10.personFlowlet;
 };
 AnimatedContactFlow.contactTypeFlowlet=function()
 {
  SC$10.$cctor();
  return SC$10.contactTypeFlowlet;
 };
 AnimatedContactFlow.contactFlowlet=function(contactTy)
 {
  var p,label,constr;
  p=contactTy.$==1?["Phone Number",function(a)
  {
   return{
    $:1,
    $0:a
   };
  }]:["E-Mail Address",function(a)
  {
   return{
    $:0,
    $0:a
   };
  }];
  label=p[0];
  constr=p[1];
  return Flow.Define(function(cont)
  {
   var rvContact;
   rvContact=Var.Create$1("");
   return AnimatedContactFlow.AnimateFlow(Doc.Element("form",[Utilities.cls("form-horizontal"),AttrProxy.Create("role","form")],[AnimatedContactFlow.inputRow(rvContact,"contact",label),Utilities.divc("form-group",[Utilities.divc("col-sm-offset-2 col-sm-10",[Doc.Button("Finish",[Utilities.cls("btn btn-default")],function()
   {
    cont(constr(rvContact.Get()));
   })])])]));
  });
 };
 AnimatedContactFlow.finalPage=function(person,details)
 {
  return AnimatedContactFlow.AnimateFlow(Doc.Element("div",[],[Doc.TextNode("You said your name was "+person.Name+", your address was "+person.Address+", "),Doc.TextNode(" and you provided "+(details.$==1?"the phone number "+details.$0:"the e-mail address "+details.$0)+".")]));
 };
 MessageBoard.Sample=function()
 {
  SC$11.$cctor();
  return SC$11.Sample;
 };
 MessageBoard.Main=function(a)
 {
  var actVar,auth,st,navbar;
  function layout(x)
  {
   return Doc.Concat([navbar,auth.LoginForm,x]);
  }
  MessageBoard.Initialise();
  actVar=Var.Create$1(Action.ThreadList);
  auth=Auth.Create();
  st=State.New(auth,Var.Create$1(T.Empty),function(a$1)
  {
   Var.Set(actVar,a$1);
  });
  navbar=MessageBoard.NavBar(auth,actVar,st);
  return Doc.EmbedView(View.Map(function(act)
  {
   auth.HideForm();
   return layout(act.$==2?MessageBoard.ThreadListPage(st):act.$==1?MessageBoard.ShowThreadPage(st,act.$0):MessageBoard.NewThreadPage(st));
  },actVar.get_View()));
 };
 MessageBoard.Description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("A message board application built using MiniSitelets.")]);
 };
 MessageBoard.Initialise=function()
 {
  var thread,post,b;
  thread=Common.CreateThread("SimonJF","Hello, World! This is a topic.");
  post=Common.CreatePost(User.New("SimonJF",""),"Hello, world! This is a post.");
  Concurrency.Start((b=null,Concurrency.Delay(function()
  {
   return Concurrency.Bind(Server$1.AddThread(thread),function()
   {
    return Concurrency.Bind(Server$1.AddPost(thread,post),function()
    {
     return Concurrency.Return(null);
    });
   });
  })),null);
 };
 MessageBoard.NavBar=function(auth,_var,st)
 {
  var actions;
  function evtLink(text,act)
  {
   return Doc.Link(text,[],function()
   {
    st.Go(act);
   });
  }
  actions=List.ofArray([Action.ThreadList,Action.NewThread]);
  return Doc.Element("nav",[Utilities.cls("navbar navbar-default"),AttrProxy.Create("role","navigation")],[Utilities.divc("container-fluid",[Doc.Element("ul",[Utilities.cls("nav navbar-nav")],[Doc.Concat(List.map(function(action)
  {
   return Doc.EmbedView(View.Map(function(active)
   {
    return Doc.Element("li",[MessageBoard.ShowAction(action)===MessageBoard.ShowAction(active)?Utilities.cls("active"):Attrs.EmptyAttr()],[evtLink(MessageBoard.ShowAction(action),action)]);
   },_var.get_View()));
  },actions))]),Doc.Element("ul",[Utilities.cls("nav navbar-nav navbar-right")],[auth.StatusWidget])])]);
 };
 MessageBoard.ThreadListPage=function(st)
 {
  var threads,b;
  function renderThread(thread)
  {
   return Doc.Element("tr",[],[Doc.Element("td",[],[Doc.TextNode(thread.ThreadAuthorName)]),Doc.Element("td",[],[Doc.Link(thread.Title,[],function()
   {
    st.Go({
     $:1,
     $0:thread
    });
   })])]);
  }
  threads=st.Threads;
  Concurrency.Start((b=null,Concurrency.Delay(function()
  {
   return Concurrency.Bind(Server$1.GetThreads(),function(a)
   {
    Var.Set(threads,a);
    return Concurrency.Zero();
   });
  })),null);
  return Doc.Element("table",[Utilities.cls("table table-hover")],[Doc.Element("tbody",[],[Doc.EmbedView(View.Map(function(threads$1)
  {
   return Doc.Concat(List.map(renderThread,threads$1));
  },st.Threads.get_View()))])]);
 };
 MessageBoard.ShowThreadPage=function(st,thread)
 {
  var rvPosts,postList;
  function getPosts()
  {
   var b;
   Concurrency.Start((b=null,Concurrency.Delay(function()
   {
    return Concurrency.Bind(Server$1.GetPosts(thread),function(a)
    {
     Var.Set(rvPosts,a);
     return Concurrency.Zero();
    });
   })),null);
  }
  function renderPost(post)
  {
   return Doc.Element("tr",[],[Doc.Element("td",[],[Doc.TextNode(post.PostAuthorName)]),Doc.Element("td",[],[Doc.TextNode(post.Content)])]);
  }
  function newPostForm(user)
  {
   var rvPost;
   rvPost=Var.Create$1("");
   return Utilities.divc("panel panel-default",[Utilities.divc("panel-heading",[Doc.Element("h3",[Utilities.cls("panel-title")],[Doc.TextNode("New Post")])]),Utilities.divc("panel-body",[Doc.Element("form",[Utilities.cls("form-horizontal"),AttrProxy.Create("role","form")],[Utilities.divc("form-group",[Doc.Element("label",[AttrProxy.Create("for","postContent"),Utilities.cls("col-sm-2 control-label")],[Doc.TextNode("Content")]),Utilities.divc("col-sm-10",[Doc.InputArea([AttrProxy.Create("id","postContent"),AttrProxy.Create("rows","5"),Utilities.cls("form-control"),Utilities.sty("width","100%")],rvPost)])]),Utilities.divc("form-group",[Utilities.divc("col-sm-offset-2 col-sm-10",[Doc.Button("Submit",[Utilities.cls("btn btn-primary")],function()
   {
    var post,b;
    post=Common.CreatePost(user,rvPost.Get());
    Concurrency.Start((b=null,Concurrency.Delay(function()
    {
     return Concurrency.Bind(Server$1.AddPost(thread,post),function()
     {
      getPosts();
      return Concurrency.Zero();
     });
    })),null);
   })])])])])]);
  }
  rvPosts=Var.Create$1(T.Empty);
  postList=Utilities.divc("panel panel-default",[Utilities.divc("panel-heading",[Doc.Element("h3",[Utilities.cls("panel-title")],[Doc.TextNode("Posts in thread \""+thread.Title+"\"")])]),Utilities.divc("panel-body",[Doc.Element("table",[Utilities.cls("table table-hover")],[Doc.Element("tbody",[],[Doc.EmbedView(View.Map(function(posts)
  {
   return Doc.Concat(List.map(renderPost,posts));
  },rvPosts.get_View()))])])])]);
  getPosts();
  return Doc.Element("div",[],[postList,Doc.EmbedView(View.Map(function(a)
  {
   return a!=null&&a.$==1?newPostForm(a.$0):Doc.Empty();
  },st.Auth.LoggedIn))]);
 };
 MessageBoard.NewThreadPage=function(st)
 {
  function doc(user)
  {
   var rvTitle,rvPost;
   rvTitle=Var.Create$1("");
   rvPost=Var.Create$1("");
   return Utilities.divc("panel panel-default",[Utilities.divc("panel-heading",[Doc.Element("h3",[Utilities.cls("panel-title")],[Doc.TextNode("New Thread")])]),Utilities.divc("panel-body",[Doc.Element("form",[Utilities.cls("form-horizontal"),AttrProxy.Create("role","form")],[Utilities.divc("form-group",[Doc.Element("label",[AttrProxy.Create("for","threadTitle"),Utilities.cls("col-sm-2 control-label")],[Doc.TextNode("Title")]),Utilities.divc("col-sm-10",[Doc.Input([AttrProxy.Create("id","threadTitle"),Utilities.sty("width","100%"),Utilities.cls("form-control")],rvTitle)])]),Utilities.divc("form-group",[Doc.Element("label",[AttrProxy.Create("for","postContent"),Utilities.cls("col-sm-2 control-label")],[Doc.TextNode("Content")]),Utilities.divc("col-sm-10",[Doc.InputArea([AttrProxy.Create("id","postContent"),AttrProxy.Create("rows","5"),Utilities.cls("form-control"),Utilities.sty("width","100%")],rvPost)])]),Utilities.divc("form-group",[Utilities.divc("col-sm-offset-2 col-sm-10",[Doc.Button("Submit",[Utilities.cls("btn btn-primary")],function()
   {
    var newThread,post,b;
    newThread=Common.CreateThread(user.Name,rvTitle.Get());
    post=Common.CreatePost(user,rvPost.Get());
    Concurrency.Start((b=null,Concurrency.Delay(function()
    {
     return Concurrency.Bind(Server$1.AddThread(newThread),function()
     {
      return Concurrency.Bind(Server$1.AddPost(newThread,post),function()
      {
       return Concurrency.Return(null);
      });
     });
    })),null);
    st.Go({
     $:1,
     $0:newThread
    });
   })])])])])]);
  }
  return Doc.EmbedView(View.Map(function(a)
  {
   return a==null?(st.Auth.ShowForm(),Doc.Empty()):doc(a.$0);
  },st.Auth.LoggedIn));
 };
 MessageBoard.ShowAction=function(act)
 {
  return act.$==1?"Thread "+act.$0.Title:act.$==2?"Show All Threads":"Create New Thread";
 };
 BobsleighSite.Sample=function()
 {
  SC$12.$cctor();
  return SC$12.Sample;
 };
 BobsleighSite.Main=function(a)
 {
  var m,withNavbar,a$1,ctx;
  m=Var.Create$1(BobsleighSitePage.BobsleighHome);
  withNavbar=(a$1=BobsleighSite.NavBar(m),function(a$2)
  {
   return Doc.Append(a$1,a$2);
  });
  ctx=Context.New(function(a$2)
  {
   Var.Set(m,a$2);
  });
  return Doc.EmbedView(View.Map(function(pg)
  {
   return pg.$==1?withNavbar(BobsleighSite.History(ctx)):pg.$==2?withNavbar(BobsleighSite.Governance(ctx)):pg.$==3?withNavbar(BobsleighSite.Team(ctx)):withNavbar(BobsleighSite.HomePage(ctx));
  },m.get_View()));
 };
 BobsleighSite.description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("A small website about bobsleighs, demonstrating how UI may be used to structure single-page applications.")]);
 };
 BobsleighSite.NavBar=function(_var)
 {
  return Doc.EmbedView(View.Map(function(active)
  {
   return Doc.Element("nav",[Utilities.cls("navbar navbar-default"),AttrProxy.Create("role","navigation")],[Doc.Element("ul",[Utilities.cls("nav navbar-nav")],[Doc.Concat(List.map(function(action)
   {
    return Doc.Element("li",[Unchecked.Equals(action,active)?Utilities.cls("active"):Attrs.EmptyAttr()],[Doc.Link(BobsleighSite.showAct(action),[],function()
    {
     BobsleighSite.GlobalGo(_var,action);
    })]);
   },BobsleighSite.pages()))])]);
  },_var.get_View()));
 };
 BobsleighSite.History=function(ctx)
 {
  return Doc.Concat([Doc.Element("div",[],[Doc.Element("h1",[],[Doc.TextNode("History")]),Doc.Element("p",[],[Doc.TextNode("According to "),Utilities.href("Wikipedia","http://en.wikipedia.org/wiki/Bobsleigh"),Doc.TextNode(", the beginnings of bobsleigh came about due to a hotelier becoming increasingly frustrated about having entire seasons where he could not rent out his properties. In response, he got a few people interested, and the Swiss town of St Moritz became the home of the first bobsleigh races.")]),Doc.Element("p",[],[Doc.TextNode("Bobsleigh races have been a regular event at the Winter Olympics since the very first competition in 1924.")])])]);
 };
 BobsleighSite.Governance=function(ctx)
 {
  return Doc.Concat([Doc.Element("div",[],[Doc.Element("h1",[],[Doc.TextNode("Governance")]),Doc.Element("p",[],[Doc.TextNode("The sport is overseen by the "),Utilities.href("International Bobsleigh and Skeleton Federation","http://www.fibt.com/"),Doc.TextNode(", an organisation founded in 1923. The organisation governs all international competitions, acting as a body to regulate athletes' conduct, as well as providing funding for training and education.")])])]);
 };
 BobsleighSite.Team=function(ctx)
 {
  var teamMembers;
  function m(name,handle)
  {
   return Doc.Element("li",[],[Utilities.href(name,"http://www.twitter.com/"+handle)]);
  }
  teamMembers=List.ofArray([["Adam","granicz"],["András","AndrasJanko"],["Anton (honourary member for life)","t0yv0"],["István","inchester23"],["Loic","tarmil_"],["Sándor","sandorrakonczai"],["Simon","Simon_JF"]]);
  return Doc.Concat([Doc.Element("div",[],[Doc.Element("h1",[],[Doc.TextNode("The IntelliFactory Bobsleigh Team")]),Doc.Element("p",[],[Doc.TextNode("The world-famous IntelliFactory Bobsleigh Team was founded in 2004, and currently consists of:")]),Doc.Element("ul",[],[Doc.Concat(List.map(function($1)
  {
   return m($1[0],$1[1]);
  },teamMembers))])])]);
 };
 BobsleighSite.HomePage=function(ctx)
 {
  return Doc.Concat([Doc.Element("div",[],[Doc.Element("h1",[],[Doc.TextNode("Welcome!")]),Doc.Element("p",[],[Doc.TextNode("Welcome to the IntelliFactory Bobsleigh MiniSite!")]),Doc.Element("p",[],[Doc.TextNode("Here you can find out about the "),Doc.Link("history",[],function()
  {
   ctx.Go(BobsleighSitePage.BobsleighHistory);
  }),Doc.TextNode(" of bobsleighs, the "),Doc.Link("International Bobsleigh and Skeleton Federation",[],function()
  {
   ctx.Go(BobsleighSitePage.BobsleighGovernance);
  }),Doc.TextNode(", which serve as the governing body for the sport, and finally the world-famous "),Doc.Link("IntelliFactory Bobsleigh Team.",[],function()
  {
   ctx.Go(BobsleighSitePage.BobsleighTeam);
  })])])]);
 };
 BobsleighSite.showAct=function(a)
 {
  return a.$==1?"History":a.$==2?"Governance":a.$==3?"The IntelliFactory Bobsleigh Team":"Home";
 };
 BobsleighSite.GlobalGo=function(_var,act)
 {
  Var.Set(_var,act);
 };
 BobsleighSite.pages=function()
 {
  SC$12.$cctor();
  return SC$12.pages;
 };
 RoutedBobsleighSite.Sample=function()
 {
  SC$13.$cctor();
  return SC$13.Sample;
 };
 RoutedBobsleighSite.Main=function(current)
 {
  var withNavbar,a,ctx;
  withNavbar=(a=BobsleighSite.NavBar(current),function(a$1)
  {
   return Doc.Append(a,a$1);
  });
  ctx=Context.New(function(a$1)
  {
   Var.Set(current,a$1);
  });
  return Doc.EmbedView(View.Map(function(pg)
  {
   return pg.$==1?withNavbar(BobsleighSite.History(ctx)):pg.$==2?withNavbar(BobsleighSite.Governance(ctx)):pg.$==3?withNavbar(BobsleighSite.Team(ctx)):withNavbar(BobsleighSite.HomePage(ctx));
  },current.get_View()));
 };
 RoutedBobsleighSite.description=function(v)
 {
  return Doc.Element("div",[],[Doc.TextNode("A small website about bobsleighs, demonstrating how UI may be used to structure single-page applications. Routed using the URL.")]);
 };
 AnimatedBobsleighSite.Sample=function()
 {
  SC$14.$cctor();
  return SC$14.Sample;
 };
 AnimatedBobsleighSite.fadeTime=function()
 {
  SC$14.$cctor();
  return SC$14.fadeTime;
 };
 AnimatedBobsleighSite.Fade=function()
 {
  SC$14.$cctor();
  return SC$14.Fade;
 };
 AnimatedBobsleighSite.Main=function(a)
 {
  var m,ctx;
  m=Var.Create$1(Page.BobsleighHome);
  ctx=Context$1.New(function(a$1)
  {
   Var.Set(m,a$1);
  });
  return Doc.EmbedView(View.Map(function(pg)
  {
   return AnimatedBobsleighSite.MakePage(m,pg.$==1?AnimatedBobsleighSite.History(ctx):pg.$==2?AnimatedBobsleighSite.Governance(ctx):pg.$==3?AnimatedBobsleighSite.Team(ctx):AnimatedBobsleighSite.HomePage(ctx));
  },m.get_View()));
 };
 AnimatedBobsleighSite.description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("A small website about bobsleighs, demonstrating how UI may be used to structure single-page applications.")]);
 };
 AnimatedBobsleighSite.History=function(ctx)
 {
  return Doc.Concat([Doc.Element("div",[],[Doc.Element("h1",[],[Doc.TextNode("History")]),Doc.Element("p",[],[Doc.TextNode("According to "),Utilities.href("Wikipedia","http://en.wikipedia.org/wiki/Bobsleigh"),Doc.TextNode(", the beginnings of bobsleigh came about due to a hotelier becoming increasingly frustrated about having entire seasons where he could not rent out his properties. In response, he got a few people interested, and the Swiss town of St Moritz became the home of the first bobsleigh races.")]),Doc.Element("p",[],[Doc.TextNode("Bobsleigh races have been a regular event at the Winter Olympics since the very first competition in 1924.")])])]);
 };
 AnimatedBobsleighSite.Governance=function(ctx)
 {
  return Doc.Concat([Doc.Element("div",[],[Doc.Element("h1",[],[Doc.TextNode("Governance")]),Doc.Element("p",[],[Doc.TextNode("The sport is overseen by the "),Utilities.href("International Bobsleigh and Skeleton Federation","http://www.fibt.com/"),Doc.TextNode(", an organisation founded in 1923. The organisation governs all international competitions, acting as a body to regulate athletes' conduct, as well as providing funding for training and education.")])])]);
 };
 AnimatedBobsleighSite.Team=function(ctx)
 {
  var teamMembers;
  function m(name,handle)
  {
   return Doc.Element("li",[],[Utilities.href(name,"http://www.twitter.com/"+handle)]);
  }
  teamMembers=List.ofArray([["Adam","granicz"],["András","AndrasJanko"],["Anton (honourary member for life)","t0yv0"],["István","inchester23"],["Loic","tarmil_"],["Sándor","sandorrakonczai"],["Simon","Simon_JF"]]);
  return Doc.Concat([Doc.Element("div",[],[Doc.Element("h1",[],[Doc.TextNode("The IntelliFactory Bobsleigh Team")]),Doc.Element("p",[],[Doc.TextNode("The world-famous IntelliFactory Bobsleigh Team was founded in 2004, and currently consists of:")]),Doc.Element("ul",[],[Doc.Concat(List.map(function($1)
  {
   return m($1[0],$1[1]);
  },teamMembers))])])]);
 };
 AnimatedBobsleighSite.HomePage=function(ctx)
 {
  return Doc.Concat([Doc.Element("div",[],[Doc.Element("h1",[],[Doc.TextNode("Welcome!")]),Doc.Element("p",[],[Doc.TextNode("Welcome to the IntelliFactory Bobsleigh MiniSite!")]),Doc.Element("p",[],[Doc.TextNode("Here you can find out about the "),Doc.Link("history",[],function()
  {
   ctx.Go(Page.BobsleighHistory);
  }),Doc.TextNode(" of bobsleighs, the "),Doc.Link("International Bobsleigh and Skeleton Federation",[],function()
  {
   ctx.Go(Page.BobsleighGovernance);
  }),Doc.TextNode(", which serve as the governing body for the sport, and finally the world-famous "),Doc.Link("IntelliFactory Bobsleigh Team.",[],function()
  {
   ctx.Go(Page.BobsleighTeam);
  })])])]);
 };
 AnimatedBobsleighSite.MakePage=function(_var,pg)
 {
  return Doc.Concat([AnimatedBobsleighSite.NavBar(_var),Doc.Element("div",[AttrModule.AnimatedStyle("opacity",AnimatedBobsleighSite.FadeTransition(),View.Const(1),Global.String)],[pg])]);
 };
 AnimatedBobsleighSite.NavBar=function(_var)
 {
  return Doc.EmbedView(View.Map(function(active)
  {
   return Doc.Element("nav",[Utilities.cls("navbar navbar-default"),AttrProxy.Create("role","navigation")],[Doc.Element("ul",[Utilities.cls("nav navbar-nav")],[Doc.Concat(List.map(function(action)
   {
    return Doc.Element("li",[Unchecked.Equals(action,active)?Utilities.cls("active"):Attrs.EmptyAttr()],[Doc.Link(AnimatedBobsleighSite.showAct(action),[],function()
    {
     AnimatedBobsleighSite.GlobalGo(_var,action);
    })]);
   },AnimatedBobsleighSite.pages()))])]);
  },_var.get_View()));
 };
 AnimatedBobsleighSite.FadeTransition=function()
 {
  SC$14.$cctor();
  return SC$14.FadeTransition;
 };
 AnimatedBobsleighSite.showAct=function(a)
 {
  return a.$==1?"History":a.$==2?"Governance":a.$==3?"The IntelliFactory Bobsleigh Team":"Home";
 };
 AnimatedBobsleighSite.GlobalGo=function(_var,act)
 {
  Var.Set(_var,act);
 };
 AnimatedBobsleighSite.pages=function()
 {
  SC$14.$cctor();
  return SC$14.pages;
 };
 ObjectConstancy.Sample=function()
 {
  SC$15.$cctor();
  return SC$15.Sample;
 };
 ObjectConstancy.SimpleAnimation=function(x,y)
 {
  return An.Simple(Interpolation.get_Double(),Easing.get_CubicInOut(),300,x,y);
 };
 ObjectConstancy.SimpleTransition=function()
 {
  SC$15.$cctor();
  return SC$15.SimpleTransition;
 };
 ObjectConstancy.Height=function()
 {
  SC$15.$cctor();
  return SC$15.Height;
 };
 ObjectConstancy.Main=function(a)
 {
  var p,bracket;
  p=ObjectConstancy.SetupDataModel();
  bracket=p[1];
  return Doc.Element("div",[],[Doc.Element("h2",[],[Doc.TextNode("Top States by Age Bracket, 2008")]),Doc.EmbedView(View.Map(function(dS)
  {
   return Doc.Select([Utilities.cls("form-control")],function(a$1)
   {
    return a$1.$0;
   },List.ofArray(Slice.array(dS.Brackets,{
    $:1,
    $0:1
   },null)),bracket);
  },p[0])),Utilities.divc("skip",[]),Doc.SvgElement("svg",[AttrProxy.Create("width",Global.String(ObjectConstancy.Width())),AttrProxy.Create("height",Global.String(ObjectConstancy.Height()))],[Doc.EmbedView(View.Map(Doc.Concat,View.MapSeqCachedViewBy(function(s)
  {
   return s.State;
  },ObjectConstancy.Render,p[2])))]),Doc.Element("p",[],[Doc.TextNode("Source: "),Utilities.href("Census Bureau","http://www.census.gov/popest/data/historical/2000s/vintage_2008/")]),Doc.Element("p",[],[Doc.TextNode("Original Sample by Mike Bostock: "),Utilities.href("Object Constancy","http://bost.ocks.org/mike/constancy/")])]);
 };
 ObjectConstancy.Description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("This sample show-cases declarative animation and interpolation (tweening)")]);
 };
 ObjectConstancy.SetupDataModel=function()
 {
  var dataSet,bracket;
  dataSet=View.MapAsync(function()
  {
   return DataSet.LoadFromCSV("ObjectConstancy.csv");
  },View.Const());
  bracket=Var.Create$1({
   $:0,
   $0:"Under 5 Years"
  });
  return[dataSet,bracket,View.Map(function(xs)
  {
   var n,m;
   n=Arrays.length(xs);
   m=Arrays.max(Arrays.map(function(t)
   {
    return t[1];
   },xs));
   return Arrays.mapi(function(i,t)
   {
    return StateView.New(m,i,t[0].$0,n,t[1]);
   },xs);
  },View.Map2(DataSet.TopStatesByRatio,dataSet,bracket.get_View()))];
 };
 ObjectConstancy.Width=function()
 {
  SC$15.$cctor();
  return SC$15.Width;
 };
 ObjectConstancy.Render=function(a,state)
 {
  function anim(name,kind,proj)
  {
   return AttrModule.Animated(name,kind,View.Map(proj,state),Global.String);
  }
  function x(st)
  {
   return ObjectConstancy.Width()*st.Value/st.MaxValue;
  }
  function y(st)
  {
   return ObjectConstancy.Height()*+st.Position/+st.Total;
  }
  function txt(f,attr$1)
  {
   return Doc.SvgElement("text",attr$1,[Doc.TextView(View.Map(f,state))]);
  }
  return Doc.Concat([Doc.SvgElement("g",[AttrModule.Style("fill","steelblue")],[Doc.SvgElement("rect",[AttrProxy.Create("x","0"),anim("y",ObjectConstancy.InOutTransition(),y),anim("width",ObjectConstancy.SimpleTransition(),x),anim("height",ObjectConstancy.SimpleTransition(),function(st)
  {
   return ObjectConstancy.Height()/+st.Total-2;
  })],[])]),txt(function(s)
  {
   return ObjectConstancy.Percent(s.Value);
  },List.ofArray([AttrProxy.Create("text-anchor","end"),anim("x",ObjectConstancy.SimpleTransition(),x),anim("y",ObjectConstancy.InOutTransition(),y),AttrProxy.Create("dx","-2"),AttrProxy.Create("dy","14"),Utilities.sty("fill","white"),Utilities.sty("font","12px sans-serif")])),txt(function(s)
  {
   return s.State;
  },List.ofArray([AttrProxy.Create("x","0"),anim("y",ObjectConstancy.InOutTransition(),y),AttrProxy.Create("dx","2"),AttrProxy.Create("dy","16"),Utilities.sty("fill","white"),Utilities.sty("font","14px sans-serif"),Utilities.sty("font-weight","bold")]))]);
 };
 ObjectConstancy.InOutTransition=function()
 {
  SC$15.$cctor();
  return SC$15.InOutTransition;
 };
 ObjectConstancy.Percent=function(x)
 {
  return Global.String(Math.floor(100*x))+"."+Global.String((Math.floor(1000*x)>>0)%10)+"%";
 };
 MouseInfo.Sample=function()
 {
  SC$16.$cctor();
  return SC$16.Sample;
 };
 MouseInfo.Main=function(a)
 {
  var xView,yView,lastHeldPos,lastClickPos;
  function a$1(x,y)
  {
   return"Position on last left click: ("+Global.String(x)+","+Global.String(y)+")";
  }
  function a$2(x,y)
  {
   return"Position of mouse while left button held: ("+Global.String(x)+","+Global.String(y)+")";
  }
  xView=View.Map(function(t)
  {
   return t[0];
  },Mouse.get_Position());
  yView=View.Map(function(t)
  {
   return t[1];
  },Mouse.get_Position());
  lastHeldPos=View.UpdateWhile([0,0],Mouse.get_LeftPressed(),Mouse.get_Position());
  lastClickPos=View.SnapshotOn([0,0],Mouse.get_LeftPressed(),Mouse.get_Position());
  return Doc.Element("div",[],[Doc.Element("p",[],[Doc.TextView(View.Map(function(x)
  {
   return"X: "+Global.String(x);
  },xView)),Doc.TextView(View.Map(function(y)
  {
   return"Y: "+Global.String(y);
  },yView))]),Doc.Element("p",[],[Doc.TextView(View.Map(function(l)
  {
   return"Left button pressed: "+Global.String(l);
  },Mouse.get_LeftPressed()))]),Doc.Element("p",[],[Doc.TextView(View.Map(function(m)
  {
   return"Middle button pressed: "+Global.String(m);
  },Mouse.get_MiddlePressed()))]),Doc.Element("p",[],[Doc.TextView(View.Map(function(r)
  {
   return"Right button pressed: "+Global.String(r);
  },Mouse.get_RightPressed()))]),Doc.Element("p",[],[Doc.TextView(View.Map(function($1)
  {
   return a$1($1[0],$1[1]);
  },lastClickPos))]),Doc.Element("p",[],[Doc.TextView(View.Map(function($1)
  {
   return a$2($1[0],$1[1]);
  },lastHeldPos))])]);
 };
 MouseInfo.Description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("Shows information about the mouse")]);
 };
 KeyboardInfo.Sample=function()
 {
  SC$17.$cctor();
  return SC$17.Sample;
 };
 KeyboardInfo.Main=function(a)
 {
  return Doc.Element("div",[],[Doc.Element("p",[],[Doc.TextNode("Keys pressed (key codes): "),Doc.TextView(View.Map(function(xs)
  {
   return KeyboardInfo.commaList(List.map(Global.String,xs));
  },KeyboardInfo.keys()))]),Doc.Element("p",[],[Doc.TextNode("Keys pressed: "),Doc.TextView(View.Map(function(xs)
  {
   return KeyboardInfo.commaList(List.map(KeyboardInfo.ToChar,xs));
  },KeyboardInfo.keys()))]),Doc.Element("p",[],[Doc.TextNode("Last pressed key: "),Doc.TextView(View.Map(Global.String,Keyboard.get_LastPressed()))]),Doc.Element("p",[],[Doc.TextNode("Is 'A' pressed? "),Doc.TextView(View.Map(function(x)
  {
   return x?"Yes":"No";
  },Keyboard.IsPressed(KeyboardInfo.ToKey("A"))))])]);
 };
 KeyboardInfo.Description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("Information about the current keyboard state")]);
 };
 KeyboardInfo.commaList=function(xs)
 {
  function addCommas(a)
  {
   return a.$==1?a.$1.$==0?Global.String(a.$0):Global.String(a.$0)+", "+addCommas(a.$1):"";
  }
  return"["+addCommas(xs)+"]";
 };
 KeyboardInfo.keys=function()
 {
  SC$17.$cctor();
  return SC$17.keys;
 };
 KeyboardInfo.ToChar=function(c)
 {
  return String$1.fromCharCode(c);
 };
 KeyboardInfo.ToKey=function(c)
 {
  return c.charCodeAt(0);
 };
 BobsleighSitePage.BobsleighHome={
  $:0
 };
 BobsleighSitePage.BobsleighHistory={
  $:1
 };
 BobsleighSitePage.BobsleighGovernance={
  $:2
 };
 BobsleighSitePage.BobsleighTeam={
  $:3
 };
 SampleTy.SimpleTextBox={
  $:0
 };
 SampleTy.InputTransform={
  $:1
 };
 SampleTy.InputTransformHtml={
  $:2
 };
 SampleTy.TodoList={
  $:3
 };
 SampleTy.PhoneExample={
  $:4
 };
 SampleTy.EditablePersonList={
  $:5
 };
 SampleTy.CheckBoxTest={
  $:6
 };
 SampleTy.Calculator={
  $:7
 };
 SampleTy.ContactFlow={
  $:8
 };
 SampleTy.AnimatedContactFlow={
  $:9
 };
 SampleTy.MessageBoard={
  $:10
 };
 SampleTy.BobsleighSite={
  $:11
 };
 SampleTy.AnimatedBobsleighSite={
  $:13
 };
 SampleTy.ObjectConstancy={
  $:14
 };
 SampleTy.MouseInfo={
  $:15
 };
 SampleTy.KeyboardInfo={
  $:16
 };
 SampleTy.SortableBarChart={
  $:17
 };
 PageTy.Home={
  $:0
 };
 PageTy.About={
  $:1
 };
 WebSharper$UI$Samples_Router.r$2=function()
 {
  return RouterOperators.JSUnion(void 0,[[null,[[null,["home"]]],[]],[null,[[null,["about"]]],[]],[null,[[null,["samples"]]],[WebSharper$UI$Samples_Router.r$1()]]]);
 };
 WebSharper$UI$Samples_Router.r$1=function()
 {
  return RouterOperators.JSUnion(void 0,[[null,[[null,["SimpleTextBox"]]],[]],[null,[[null,["InputTransform"]]],[]],[null,[[null,["InputTransformHtml"]]],[]],[null,[[null,["TodoList"]]],[]],[null,[[null,["PhoneExample"]]],[]],[null,[[null,["EditablePersonList"]]],[]],[null,[[null,["CheckBoxTest"]]],[]],[null,[[null,["Calculator"]]],[]],[null,[[null,["ContactFlow"]]],[]],[null,[[null,["AnimatedContactFlow"]]],[]],[null,[[null,["MessageBoard"]]],[]],[null,[[null,["BobsleighSite"]]],[]],[null,[[null,["RoutedBobsleighSite"]]],[WebSharper$UI$Samples_Router.r()]],[null,[[null,["AnimatedBobsleighSite"]]],[]],[null,[[null,["ObjectConstancy"]]],[]],[null,[[null,["MouseInfo"]]],[]],[null,[[null,["KeyboardInfo"]]],[]],[null,[[null,["SortableBarChart"]]],[]]]);
 };
 WebSharper$UI$Samples_Router.r=function()
 {
  return RouterOperators.JSUnion(void 0,[[null,[[null,[]]],[]],[null,[[null,["history"]]],[]],[null,[[null,["governance"]]],[]],[null,[[null,["team"]]],[]]]);
 };
 WebSharper$UI$Samples_Templates.tablerow=function(h)
 {
  return h?Doc.GetOrLoadTemplate("inputtransformtemplate",{
   $:1,
   $0:"tablerow"
  },function()
  {
   return $.parseHTML("<tr>\n                        <td>${lbl}</td>\n                        <td style=\"width: 70%;\">${view}</td>\n                    </tr>");
  },h):Doc.PrepareTemplate("inputtransformtemplate",{
   $:1,
   $0:"tablerow"
  },function()
  {
   return $.parseHTML("<tr>\n                        <td>${lbl}</td>\n                        <td style=\"width: 70%;\">${view}</td>\n                    </tr>");
  });
 };
 WebSharper$UI$Samples_Templates.t=function(h)
 {
  return h?Doc.GetOrLoadTemplate("inputtransformtemplate",null,function()
  {
   return $.parseHTML("<div>\n    <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n            <h3 class=\"panel-title\">Input</h3>\n        </div>\n        <div class=\"panel-body\">\n            <form class=\"form-horizontal\" role=\"form\">\n                <div class=\"form-group\">\n                    <label class=\"col-sm-2 control-label\" for=\"inputBox\">Write something: </label>\n                    <div class=\"col-sm-10\">\n                        <input class=\"form-control\" id=\"inputBox\" ws-var=\"inputText\">\n                    </div>\n                </div>\n            </form>\n        </div>\n    </div>\n    <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n            <h3 class=\"panel-title\">Output</h3>\n        </div>\n        <div class=\"panel-body\">\n            <table class=\"table\">\n                <tbody ws-hole=\"tableBody\">\n                    <tr ws-template=\"tableRow\">\n                        <td>${lbl}</td>\n                        <td style=\"width: 70%;\">${view}</td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n    </div>\n</div>");
  },h):Doc.PrepareTemplate("inputtransformtemplate",null,function()
  {
   return $.parseHTML("<div>\n    <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n            <h3 class=\"panel-title\">Input</h3>\n        </div>\n        <div class=\"panel-body\">\n            <form class=\"form-horizontal\" role=\"form\">\n                <div class=\"form-group\">\n                    <label class=\"col-sm-2 control-label\" for=\"inputBox\">Write something: </label>\n                    <div class=\"col-sm-10\">\n                        <input class=\"form-control\" id=\"inputBox\" ws-var=\"inputText\">\n                    </div>\n                </div>\n            </form>\n        </div>\n    </div>\n    <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n            <h3 class=\"panel-title\">Output</h3>\n        </div>\n        <div class=\"panel-body\">\n            <table class=\"table\">\n                <tbody ws-hole=\"tableBody\">\n                    <tr ws-template=\"tableRow\">\n                        <td>${lbl}</td>\n                        <td style=\"width: 70%;\">${view}</td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n    </div>\n</div>");
  });
 };
 Router.InstallHash=function(onParseError,router)
 {
  var _var;
  _var=Var.Create$1(Router.getCurrentHash(function(h)
  {
   return RouterModule.Parse(router,Route.FromHash(h,{
    $:1,
    $0:true
   }));
  },onParseError));
  Router.InstallHashInto(_var,onParseError,router);
  return _var;
 };
 Router.getCurrentHash=function(parse,onParseError)
 {
  var h,m;
  h=Global.location.hash;
  m=parse(h);
  return m==null?((function($1)
  {
   return function($2)
   {
    return $1("Failed to parse route: "+Utils.toSafe($2));
   };
  }(function(s)
  {
   console.log(s);
  }))(h),onParseError):m.$0;
 };
 Router.InstallHashInto=function(_var,onParseError,router)
 {
  function parse(h)
  {
   return RouterModule.Parse(router,Route.FromHash(h,{
    $:1,
    $0:true
   }));
  }
  function cur()
  {
   return Router.getCurrentHash(parse,onParseError);
  }
  function set(value)
  {
   if(!Unchecked.Equals(_var.Get(),value))
    _var.Set(value);
  }
  Global.onpopstate=function()
  {
   return set(cur());
  };
  Global.onhashchange=function()
  {
   return set(cur());
  };
  $(Global.document.body).click(function(ev)
  {
   var m,target,href,m$1;
   m=$(ev.target).closest("a").toArray();
   return!Unchecked.Equals(m,null)&&m.length===1?(target=Arrays.get(m,0),target.localName==="a"?(href=target.getAttribute("href"),!(href==null)&&Strings.StartsWith(href,"#")?(m$1=parse(href),m$1==null?null:(set(m$1.$0),ev.preventDefault())):null):null):null;
  });
  View.Sink(function(value)
  {
   var url;
   if(!Unchecked.Equals(value,cur()))
    {
     url=RouterModule.HashLink(router,value);
     Global.history.pushState(null,null,url);
    }
  },_var.get_View());
 };
 Var.Set=function(_var,value)
 {
  _var.Set(value);
 };
 Var.Create$1=function(v)
 {
  return new ConcreteVar.New(false,Snap.New({
   $:2,
   $0:v,
   $1:[]
  }),v);
 };
 Var.Lens=function(_var,get,update)
 {
  var id,view,$1;
  id=Fresh.Id();
  view=View.Map(get,_var.get_View());
  $1=new Var({
   Get:function()
   {
    return get(_var.Get());
   },
   Set:function(v)
   {
    return _var.Update(function(t)
    {
     return update(t,v);
    });
   },
   SetFinal:function(v)
   {
    return this.Set(v);
   },
   Update:function(f)
   {
    return _var.Update(function(t)
    {
     return update(t,f(get(t)));
    });
   },
   UpdateMaybe:function(f)
   {
    return _var.UpdateMaybe(function(t)
    {
     var x;
     x=f(get(t));
     return x==null?null:{
      $:1,
      $0:update(t,x.$0)
     };
    });
   },
   get_View:function()
   {
    return view;
   },
   get_Id:function()
   {
    return id;
   }
  });
  Var.New.call($1);
  return $1;
 };
 Var.Update=function(_var,fn)
 {
  Var.Set(_var,fn(_var.Get()));
 };
 Operators.FailWith=function(msg)
 {
  throw Global.Error(msg);
 };
 Operators.KeyValue=function(kvp)
 {
  return[kvp.K,kvp.V];
 };
 Obj=WebSharper.Obj=Runtime$1.Class({
  Equals:function(obj)
  {
   return this===obj;
  },
  GetHashCode:function()
  {
   return -1;
  }
 },null,Obj);
 Obj.New=Runtime$1.Ctor(function()
 {
 },Obj);
 Var=UI.Var=Runtime$1.Class({},Obj,Var);
 Var.New=Runtime$1.Ctor(function()
 {
 },Var);
 T=List.T=Runtime$1.Class({
  get_Item:function(x)
  {
   return Seq.nth(x,this);
  },
  GetEnumerator:function()
  {
   return new T$1.New(this,null,function(e)
   {
    var m;
    m=e.s;
    return m.$==0?false:(e.c=m.$0,e.s=m.$1,true);
   },void 0);
  },
  GetEnumerator0:function()
  {
   return Enumerator.Get(this);
  }
 },null,T);
 T.Empty=new T({
  $:0
 });
 Arrays.get=function(arr,n)
 {
  Arrays.checkBounds(arr,n);
  return arr[n];
 };
 Arrays.length=function(arr)
 {
  return arr.dims===2?arr.length*arr.length:arr.length;
 };
 Arrays.checkBounds=function(arr,n)
 {
  if(n<0||n>=arr.length)
   Operators.FailWith("Index was outside the bounds of the array.");
 };
 Arrays.sub=function(arr,start,length)
 {
  Arrays.checkRange(arr,start,length);
  return arr.slice(start,start+length);
 };
 Arrays.set=function(arr,n,x)
 {
  Arrays.checkBounds(arr,n);
  arr[n]=x;
 };
 Arrays.checkRange=function(arr,start,size)
 {
  if(size<0||start<0||arr.length<start+size)
   Operators.FailWith("Index was outside the bounds of the array.");
 };
 SC$1.$cctor=function()
 {
  SC$1.$cctor=Global.ignore;
  SC$1.Sample=Samples.Build(SampleTy.SimpleTextBox).Id("SimpleTextBox").FileName("SimpleTextBox.fs").Keywords(List.ofArray(["text"])).Render(SimpleTextBox.Main).RenderDescription(SimpleTextBox.Description).Create();
 };
 SC$2.$cctor=function()
 {
  SC$2.$cctor=Global.ignore;
  SC$2.Sample=Samples.Build(SampleTy.InputTransform).Id("InputTransform").FileName("InputTransform.fs").Keywords(List.ofArray(["text"])).Render(InputTransform.Main).RenderDescription(InputTransform.Description).Create();
 };
 SC$3.$cctor=function()
 {
  SC$3.$cctor=Global.ignore;
  SC$3.Sample=Samples.Build(SampleTy.InputTransformHtml).Id("InputTransformHtml").FileName("InputTransformHtml.fs").Keywords(List.ofArray(["text"])).Render(InputTransformHtml.Main).RenderDescription(InputTransformHtml.Description).Create();
 };
 SC$4.$cctor=function()
 {
  SC$4.$cctor=Global.ignore;
  SC$4.Sample=Samples.Build(SampleTy.TodoList).Id("TodoList").FileName("TodoList.fs").Keywords(List.ofArray(["todo"])).Render(TodoList.Main).RenderDescription(TodoList.Description).Create();
 };
 SC$5.$cctor=function()
 {
  SC$5.$cctor=Global.ignore;
  SC$5.Sample=Samples.Build(SampleTy.PhoneExample).Id("PhoneExample").FileName("PhoneExample.fs").Keywords(List.ofArray(["todo"])).Render(PhoneExample.Main).RenderDescription(PhoneExample.Description).Create();
 };
 SC$6.$cctor=function()
 {
  SC$6.$cctor=Global.ignore;
  SC$6.peopleList=List.ofArray([EditablePersonList.createPerson("Alonzo","Church"),EditablePersonList.createPerson("Alan","Turing"),EditablePersonList.createPerson("Bertrand","Russell"),EditablePersonList.createPerson("Noam","Chomsky")]);
  SC$6.memberList=Doc.Element("div",[],[Doc.Element("ul",[],[Doc.Concat(List.map(function(person)
  {
   return Doc.Element("li",[],[Doc.EmbedView(View.Map2(function(f,l)
   {
    return Doc.TextNode(f+" "+l);
   },person.FirstName.get_View(),person.LastName.get_View()))]);
  },EditablePersonList.peopleList()))])]);
  SC$6.peopleBoxes=Doc.Element("div",[],[Doc.Element("ul",[],[Doc.Concat(List.map(function(person)
  {
   return Doc.Element("li",[],[Doc.Input([],person.FirstName),Doc.Input([],person.LastName)]);
  },EditablePersonList.peopleList()))])]);
  SC$6.Sample=Samples.Build(SampleTy.EditablePersonList).Id("EditablePersonList").FileName("EditablePersonList.fs").Keywords(List.ofArray(["text"])).Render(EditablePersonList.Main).RenderDescription(EditablePersonList.Description).Create();
 };
 SC$7.$cctor=function()
 {
  SC$7.$cctor=Global.ignore;
  SC$7.People=List.ofArray([Person$1.Create("Simon",22),Person$1.Create("Peter",18),Person$1.Create("Clare",50),Person$1.Create("Andy",51)]);
  SC$7.Sample=Samples.Build(SampleTy.CheckBoxTest).Id("CheckBoxTest").FileName("CheckBoxTest.fs").Keywords(List.ofArray(["todo"])).Render(CheckBoxTest.Main).RenderDescription(CheckBoxTest.Description).Create();
 };
 SC$8.$cctor=function()
 {
  SC$8.$cctor=Global.ignore;
  SC$8.initCalc=Calculator$1.New(0,0,Op.Add);
  SC$8.Sample=Samples.Build(SampleTy.Calculator).Id("Calculator").FileName("Calculator.fs").Keywords(List.ofArray(["calculator"])).Render(Calculator.Main).RenderDescription(Calculator.Description).Create();
 };
 SC$9.$cctor=function()
 {
  SC$9.$cctor=Global.ignore;
  SC$9.personFlowlet=Flow.Define(function(cont)
  {
   var rvName,rvAddress;
   rvName=Var.Create$1("");
   rvAddress=Var.Create$1("");
   return Doc.Element("form",[Utilities.cls("form-horizontal"),AttrProxy.Create("role","form")],[ContactFlow.inputRow(rvName,"lblName","Name",false),ContactFlow.inputRow(rvAddress,"lblAddr","Address",true),Utilities.divc("row",[Utilities.divc("col-sm-2",[]),Utilities.divc("col-sm-6",[Utilities.divc("form-group",[Doc.Button("Next",[Utilities.cls("btn btn-default")],function()
   {
    cont(Person$2.New(rvName.Get(),rvAddress.Get()));
   })])]),Utilities.divc("col-sm-4",[])])]);
  });
  SC$9.contactTypeFlowlet=Flow.Define(function(cont)
  {
   return Doc.Element("form",[Utilities.cls("form-horizontal"),AttrProxy.Create("role","form")],[Doc.Element("form",[Utilities.cls("form-group")],[Doc.Element("div",[],[Doc.Button("E-Mail Address",[Utilities.cls("btn btn-default")],function()
   {
    cont(ContactType.EmailTy);
   })]),Doc.Element("div",[],[Doc.Button("Phone Number",[Utilities.cls("btn btn-default")],function()
   {
    cont(ContactType.PhoneTy);
   })])])]);
  });
  SC$9.Sample=Samples.Build(SampleTy.ContactFlow).Id("ContactFlow").FileName("ContactFlow.fs").Keywords(List.ofArray(["flowlet"])).Render(ContactFlow.ExampleFlow).RenderDescription(ContactFlow.Description).Create();
 };
 SC$10.$cctor=function()
 {
  var a,a$1,a$2,a$3,a$4,a$5;
  SC$10.$cctor=Global.ignore;
  SC$10.fadeTime=300;
  SC$10.Fade=(a=Interpolation.get_Double(),(a$1=Easing.get_CubicInOut(),(a$2=AnimatedContactFlow.fadeTime(),Runtime$1.Curried(An.Simple,2,[a,a$1,a$2]))));
  SC$10.FadeTransition=Trans.Exit(function()
  {
   return((AnimatedContactFlow.Fade())(1))(0);
  },Trans.Enter(function()
  {
   return((AnimatedContactFlow.Fade())(0))(1);
  },Trans.Create(function($1,$2)
  {
   return((AnimatedContactFlow.Fade())($1))($2);
  })));
  SC$10.swipeTime=300;
  SC$10.Swipe=(a$3=Interpolation.get_Double(),(a$4=Easing.get_CubicInOut(),(a$5=AnimatedContactFlow.swipeTime(),Runtime$1.Curried(An.Simple,2,[a$3,a$4,a$5]))));
  SC$10.SwipeTransition=Trans.Exit(function()
  {
   return((AnimatedContactFlow.Swipe())(0))(400);
  },Trans.Create(function($1,$2)
  {
   return((AnimatedContactFlow.Swipe())($1))($2);
  }));
  SC$10.personFlowlet=Flow.Define(function(cont)
  {
   var rvName,rvAddress;
   rvName=Var.Create$1("");
   rvAddress=Var.Create$1("");
   return AnimatedContactFlow.AnimateFlow(Doc.Element("form",[Utilities.cls("form-horizontal"),AttrProxy.Create("role","form")],[AnimatedContactFlow.inputRow(rvName,"lblName","Name"),AnimatedContactFlow.inputRow(rvAddress,"lblAddr","Address"),Utilities.divc("form-group",[Utilities.divc("col-sm-offset-2 col-sm-10",[Doc.Button("Next",[Utilities.cls("btn btn-default")],function()
   {
    cont(Person$3.New(rvName.Get(),rvAddress.Get()));
   })])])]));
  });
  SC$10.contactTypeFlowlet=Flow.Define(function(cont)
  {
   return AnimatedContactFlow.AnimateFlow(Doc.Element("form",[Utilities.cls("form-horizontal"),AttrProxy.Create("role","form")],[Utilities.divc("form-group",[Doc.Element("div",[],[Doc.Button("E-Mail Address",[Utilities.cls("btn btn-default")],function()
   {
    cont(ContactType$1.EmailTy);
   })]),Doc.Element("div",[],[Doc.Button("Phone Number",[Utilities.cls("btn btn-default")],function()
   {
    cont(ContactType$1.PhoneTy);
   })])])]));
  });
  SC$10.Sample=Samples.Build(SampleTy.AnimatedContactFlow).Id("AnimatedContactFlow").FileName("AnimatedContactFlow.fs").Keywords(List.ofArray(["flowlet"])).Render(AnimatedContactFlow.ExampleFlow).RenderDescription(AnimatedContactFlow.Description).Create();
 };
 SC$11.$cctor=function()
 {
  SC$11.$cctor=Global.ignore;
  SC$11.i=0;
  SC$11.DELAY=200;
  SC$11.threads=T.Empty;
  SC$11.posts=new FSharpMap.New([]);
  SC$11.Sample=Samples.Build(SampleTy.MessageBoard).Id("MessageBoard").FileName("MessageBoard.fs").Keywords(List.ofArray(["text"])).Render(MessageBoard.Main).RenderDescription(MessageBoard.Description).Create();
 };
 SC$12.$cctor=function()
 {
  SC$12.$cctor=Global.ignore;
  SC$12.pages=List.ofArray([BobsleighSitePage.BobsleighHome,BobsleighSitePage.BobsleighHistory,BobsleighSitePage.BobsleighGovernance,BobsleighSitePage.BobsleighTeam]);
  SC$12.Sample=Samples.Build(SampleTy.BobsleighSite).Id("BobsleighSite").FileName("BobsleighSite.fs").Keywords(List.ofArray(["text"])).Render(BobsleighSite.Main).RenderDescription(BobsleighSite.description).Create();
 };
 SC$13.$cctor=function()
 {
  SC$13.$cctor=Global.ignore;
  SC$13.Sample=Samples.Routed(function(a)
  {
   return{
    $:12,
    $0:a
   };
  },BobsleighSitePage.BobsleighHome,function(a)
  {
   return a.$==12?{
    $:1,
    $0:a.$0
   }:null;
  }).Id("RoutedBobsleighSite").FileName("RoutedBobsleighSite.fs").Keywords(List.ofArray(["text"])).Render(RoutedBobsleighSite.Main).RenderDescription(RoutedBobsleighSite.description).Create();
 };
 SC$14.$cctor=function()
 {
  var a,a$1,a$2;
  SC$14.$cctor=Global.ignore;
  SC$14.pages=List.ofArray([Page.BobsleighHome,Page.BobsleighHistory,Page.BobsleighGovernance,Page.BobsleighTeam]);
  SC$14.fadeTime=300;
  SC$14.Fade=(a=Interpolation.get_Double(),(a$1=Easing.get_CubicInOut(),(a$2=AnimatedBobsleighSite.fadeTime(),Runtime$1.Curried(An.Simple,2,[a,a$1,a$2]))));
  SC$14.FadeTransition=Trans.Exit(function()
  {
   return((AnimatedBobsleighSite.Fade())(1))(0);
  },Trans.Enter(function()
  {
   return((AnimatedBobsleighSite.Fade())(0))(1);
  },Trans.Create(function($1,$2)
  {
   return((AnimatedBobsleighSite.Fade())($1))($2);
  })));
  SC$14.Sample=Samples.Build(SampleTy.AnimatedBobsleighSite).Id("AnimatedBobsleighSite").FileName("AnimatedBobsleighSite.fs").Keywords(List.ofArray(["text"])).Render(AnimatedBobsleighSite.Main).RenderDescription(AnimatedBobsleighSite.description).Create();
 };
 SC$15.$cctor=function()
 {
  SC$15.$cctor=Global.ignore;
  SC$15.Width=960;
  SC$15.Height=250;
  SC$15.SimpleTransition=Trans.Create(ObjectConstancy.SimpleAnimation);
  SC$15.InOutTransition=Trans.Exit(function(x)
  {
   return ObjectConstancy.SimpleAnimation(x,ObjectConstancy.Height());
  },Trans.Enter(function(x)
  {
   return ObjectConstancy.SimpleAnimation(ObjectConstancy.Height(),x);
  },ObjectConstancy.SimpleTransition()));
  SC$15.Sample=Samples.Build(SampleTy.ObjectConstancy).Id("ObjectConstancy").FileName("ObjectConstancy.fs").Keywords(List.ofArray(["animation"])).Render(ObjectConstancy.Main).RenderDescription(ObjectConstancy.Description).Create();
 };
 SC$16.$cctor=function()
 {
  SC$16.$cctor=Global.ignore;
  SC$16.Sample=Samples.Build(SampleTy.MouseInfo).Id("MouseInfo").FileName("MouseInfo.fs").Keywords(List.ofArray(["mouse"])).Render(MouseInfo.Main).RenderDescription(MouseInfo.Description).Create();
 };
 SC$17.$cctor=function()
 {
  SC$17.$cctor=Global.ignore;
  SC$17.keys=Keyboard.get_KeysPressed();
  SC$17.Sample=Samples.Build(SampleTy.KeyboardInfo).Id("KeyboardInfo").FileName("KeyboardInfo.fs").Keywords(List.ofArray(["text"])).Render(KeyboardInfo.Main).RenderDescription(KeyboardInfo.Description).Create();
 };
 RouterOperators.JSUnion=function(t,cases)
 {
  var parseCases;
  function getTag(value)
  {
   var constIndex;
   function p($1)
   {
    return $1!=null&&$1.$==1&&Unchecked.Equals(value,$1.$0);
   }
   constIndex=Seq.tryFindIndex(function($1)
   {
    return p($1[0]);
   },cases);
   return constIndex!=null&&constIndex.$==1?constIndex.$0:value.$;
  }
  function readFields(tag,value)
  {
   return Arrays.init(Arrays.length((Arrays.get(cases,tag))[2]),function(i)
   {
    return value["$"+String$1(i)];
   });
  }
  function createCase(tag,fieldValues)
  {
   var o,m$1,$1;
   o=t==null?{}:new t();
   m$1=Arrays.get(cases,tag);
   return($1=m$1[0],$1!=null&&$1.$==1)?m$1[0].$0:(o.$=tag,Seq.iteri(function(i,v)
   {
    o["$"+String$1(i)]=v;
   },fieldValues),o);
  }
  function m(i,a)
  {
   var fields;
   function m$1(m$2,p)
   {
    return[i,m$2,p,fields];
   }
   fields=a[2];
   return Seq.map(function($1)
   {
    return m$1($1[0],$1[1]);
   },a[1]);
  }
  parseCases=Seq.collect(function($1)
  {
   return m($1[0],$1[1]);
  },Seq.indexed(cases));
  return Router$1.New$1(function(path)
  {
   function m$1(i,m$2,s,fields)
   {
    var m$3,p,m$4;
    function collect(fields$1,path$1,acc)
    {
     var t$1;
     function m$5(p$1,a)
     {
      return collect(t$1,p$1,new T({
       $:1,
       $0:a,
       $1:acc
      }));
     }
     return fields$1.$==1?(t$1=fields$1.$1,Seq.collect(function($1)
     {
      return m$5($1[0],$1[1]);
     },fields$1.$0.Parse(path$1))):[[path$1,createCase(i,Arrays.ofList(List.rev(acc)))]];
    }
    return RouterOperators.isCorrectMethod(m$2,path.Method)?(m$3=List$1.startsWith(List.ofArray(s),path.Segments),m$3==null?[]:(p=m$3.$0,(m$4=List.ofArray(fields),m$4.$==0?[[Route.New(p,path.QueryArgs,path.FormData,path.Method,path.Body),createCase(i,[])]]:collect(m$4,Route.New(p,path.QueryArgs,path.FormData,path.Method,path.Body),T.Empty)))):[];
   }
   return Seq.collect(function($1)
   {
    return m$1($1[0],$1[1],$1[2],$1[3]);
   },parseCases);
  },function(value)
  {
   var tag,p,fields,p$1,casePath,fieldParts;
   function m$1(v,f)
   {
    return f.Write(v);
   }
   tag=getTag(value);
   p=Arrays.get(cases,tag);
   fields=p[2];
   p$1=Arrays.get(p[1],0);
   casePath=[Route.Segment(List.ofArray(p$1[1]),p$1[0])];
   return!Unchecked.Equals(fields,null)&&fields.length===0?{
    $:1,
    $0:casePath
   }:(fieldParts=(((Runtime$1.Curried3(Arrays.map2))(m$1))(readFields(tag,value)))(fields),Arrays.forall(function(o)
   {
    return o!=null;
   },fieldParts)?{
    $:1,
    $0:Seq.append(casePath,Seq.collect(function(o)
    {
     return o.$0;
    },fieldParts))
   }:null);
  });
 };
 RouterOperators.isCorrectMethod=function(m,p)
 {
  return p!=null&&p.$==1?m!=null&&m.$==1?Unchecked.Equals(p.$0,m.$0):true:!(m!=null&&m.$==1);
 };
 Route=Sitelets.Route=Runtime$1.Class({
  ToLink:function()
  {
   return PathUtil.WriteLink(this.Segments,this.QueryArgs);
  }
 },null,Route);
 Route.FromHash=function(path,strict)
 {
  var m,h;
  m=path.indexOf("#");
  return m===-1?Route.get_Empty():(h=path.substring(m+1),strict!=null&&strict.$0?h===""||h==="/"?Route.get_Empty():Strings.StartsWith(h,"/")?Route.FromUrl(h.substring(1),{
   $:1,
   $0:true
  }):Route.Segment$2(h):Route.FromUrl(path.substring(m),{
   $:1,
   $0:false
  }));
 };
 Route.Segment=function(s,m)
 {
  var i;
  i=Route.get_Empty();
  return Route.New(s,i.QueryArgs,i.FormData,m,i.Body);
 };
 Route.get_Empty=function()
 {
  return Route.New(T.Empty,new FSharpMap.New([]),new FSharpMap.New([]),null,Lazy.CreateFromValue(null));
 };
 Route.FromUrl=function(path,strict)
 {
  var p,m,i;
  p=(m=path.indexOf("?"),m===-1?[path,new FSharpMap.New([])]:[Strings.Substring(path,0,m),Route.ParseQuery(path.substring(m+1))]);
  i=Route.get_Empty();
  return Route.New(List.ofArray(Strings.SplitChars(p[0],["/"],strict!=null&&strict.$0?0:1)),p[1],i.FormData,i.Method,i.Body);
 };
 Route.Segment$2=function(s)
 {
  var i;
  i=Route.get_Empty();
  return Route.New(List.ofArray([s]),i.QueryArgs,i.FormData,i.Method,i.Body);
 };
 Route.ParseQuery=function(q)
 {
  return Map.OfArray(Arrays.ofSeq(Arrays.choose(function(kv)
  {
   var m,v;
   m=Strings.SplitChars(kv,["="],0);
   return!Unchecked.Equals(m,null)&&m.length===2?(v=Arrays.get(m,1),{
    $:1,
    $0:[Arrays.get(m,0),v]
   }):((function($1)
   {
    return function($2)
    {
     return $1("wrong format for query argument: "+Utils.toSafe($2));
    };
   }(function(s)
   {
    console.log(s);
   }))(kv),null);
  },Strings.SplitChars(q,["&"],0))));
 };
 Route.Combine=function(paths)
 {
  var method,body,queryArgs,formData,i,$1,paths$1,m,segments,l;
  paths$1=Arrays.ofSeq(paths);
  m=Arrays.length(paths$1);
  if(m===0)
   return Route.get_Empty();
  else
   if(m===1)
    return Arrays.get(paths$1,0);
   else
    {
     method=null;
     body=null;
     segments=[];
     queryArgs=new FSharpMap.New([]);
     formData=new FSharpMap.New([]);
     i=0;
     l=Arrays.length(paths$1);
     while(i<l)
      (function()
      {
       var p,m$1,m$2;
       p=Arrays.get(paths$1,i);
       m$1=p.Method;
       m$1!=null&&m$1.$==1?method=m$1:void 0;
       m$2=p.Body.f();
       m$2===null?void 0:body=m$2;
       queryArgs=Map.FoldBack(function(k,v,t)
       {
        return t.Add(k,v);
       },queryArgs,p.QueryArgs);
       formData=Map.FoldBack(function(k,v,t)
       {
        return t.Add(k,v);
       },formData,p.FormData);
       List.iter(function(a)
       {
        segments.push(a);
       },p.Segments);
       i=i+1;
      }());
     return Route.New(List.ofSeq(segments),queryArgs,formData,method,Lazy.CreateFromValue(body));
    }
 };
 Route.New=function(Segments,QueryArgs,FormData,Method,Body)
 {
  return new Route({
   Segments:Segments,
   QueryArgs:QueryArgs,
   FormData:FormData,
   Method:Method,
   Body:Body
  });
 };
 RouterModule.Parse=function(router,path)
 {
  function c(path$1,value)
  {
   return path$1.Segments.$==0?{
    $:1,
    $0:value
   }:null;
  }
  return Seq.tryPick(function($1)
  {
   return c($1[0],$1[1]);
  },router.Parse(path));
 };
 RouterModule.HashLink=function(router,endpoint)
 {
  return"#"+RouterModule.Link(router,endpoint);
 };
 RouterModule.Link=function(router,endpoint)
 {
  var m;
  m=RouterModule.Write(router,endpoint);
  return m==null?"":m.$0.ToLink();
 };
 RouterModule.Write=function(router,endpoint)
 {
  var o;
  o=router.Write(endpoint);
  return o==null?null:{
   $:1,
   $0:Route.Combine(o.$0)
  };
 };
 Doc=UI.Doc=Runtime$1.Class({},Obj,Doc);
 Doc.RunById=function(id,tr)
 {
  var m;
  m=DomUtility.Doc().getElementById(id);
  Unchecked.Equals(m,null)?Operators.FailWith("invalid id: "+id):Doc.Run(m,tr);
 };
 Doc.BindView=function(f,view)
 {
  return Doc.EmbedView(View.Map(f,view));
 };
 Doc.Concat=function(xs)
 {
  var x;
  x=Array.ofSeqNonCopying(xs);
  return Array.TreeReduce(Doc.Empty(),Doc.Append,x);
 };
 Doc.Element=function(name,attr$1,children)
 {
  var attr$2,children$1;
  attr$2=AttrProxy.Concat(attr$1);
  children$1=Doc.Concat(children);
  return Elt.New(DomUtility.CreateElement(name),attr$2,children$1);
 };
 Doc.Button=function(caption,attrs,action)
 {
  var attrs$1;
  attrs$1=AttrProxy.Concat(attrs);
  return Elt.New(Doc.Clickable("button",action),attrs$1,Doc.TextNode(caption));
 };
 Doc.Run=function(parent,doc)
 {
  Doc.LoadLocalTemplates$1();
  Docs.LinkElement(parent,doc.docNode);
  Doc.RunInPlace(false,parent,doc);
 };
 Doc.Link=function(caption,attrs,action)
 {
  var attrs$1,x;
  attrs$1=(x=AttrProxy.Concat(attrs),AttrProxy.Append(AttrProxy.Create("href","#"),x));
  return Elt.New(Doc.Clickable("a",action),attrs$1,Doc.TextNode(caption));
 };
 Doc.EmbedView=function(view)
 {
  var node;
  node=Docs.CreateEmbedNode();
  return Doc.Mk({
   $:2,
   $0:node
  },View.Map(Global.ignore,View.Bind(function(doc)
  {
   Docs.UpdateEmbedNode(node,doc.docNode);
   return doc.updates;
  },view)));
 };
 Doc.Input=function(attr$1,_var)
 {
  return Doc.InputInternal("input",function()
  {
   return Seq.append(attr$1,[AttrModule.Value(_var)]);
  });
 };
 Doc.Empty=function()
 {
  return Doc.Mk(null,View.Const());
 };
 Doc.Append=function(a,b)
 {
  return Doc.Mk({
   $:0,
   $0:a.docNode,
   $1:b.docNode
  },View.Map2Unit(a.updates,b.updates));
 };
 Doc.TextNode=function(v)
 {
  return Doc.Mk({
   $:5,
   $0:DomUtility.CreateText(v)
  },View.Const());
 };
 Doc.Clickable=function(elem,action)
 {
  var el;
  el=DomUtility.CreateElement(elem);
  el.addEventListener("click",function(ev)
  {
   ev.preventDefault();
   return action();
  },false);
  return el;
 };
 Doc.LoadLocalTemplates$1=function()
 {
  if(!Docs.LocalTemplatesLoaded())
   {
    Docs.set_LocalTemplatesLoaded(true);
    Doc.LoadLocalTemplates("");
   }
 };
 Doc.RunInPlace=function(childrenOnly,parent,doc)
 {
  var st;
  st=Docs.CreateRunState(parent,doc.docNode);
  View.Sink(An.get_UseAnimations()||Settings.BatchUpdatesEnabled()?Mailbox.StartProcessor(Docs.PerformAnimatedUpdate(childrenOnly,st,doc.docNode)):function()
  {
   Docs.PerformSyncUpdate(childrenOnly,st,doc.docNode);
  },doc.updates);
 };
 Doc.Mk=function(node,updates)
 {
  return new Doc.New(node,updates);
 };
 Doc.InputInternal=function(elemTy,attr$1)
 {
  var el;
  el=DomUtility.CreateElement(elemTy);
  return Elt.New(el,AttrProxy.Concat(attr$1(el)),Doc.Empty());
 };
 Doc.CheckBoxGroup=function(attrs,item,chk)
 {
  function p(y)
  {
   return Unchecked.Equals(item,y);
  }
  return Doc.CheckBox(attrs,Var.Lens(chk,function(l)
  {
   return List.exists(p,l);
  },function(l,b)
  {
   return b?List.exists(function(y)
   {
    return Unchecked.Equals(item,y);
   },l)?l:new T({
    $:1,
    $0:item,
    $1:l
   }):List.filter(function(y)
   {
    return!Unchecked.Equals(item,y);
   },l);
  }));
 };
 Doc.TextView=function(txt)
 {
  var node;
  node=Docs.CreateTextNode();
  return Doc.Mk({
   $:4,
   $0:node
  },View.Map(function(t)
  {
   Docs.UpdateTextNode(node,t);
  },txt));
 };
 Doc.Radio=function(attrs,value,_var)
 {
  var el,valAttr;
  el=DomUtility.CreateElement("input");
  el.addEventListener("click",function()
  {
   return _var.Set(value);
  },false);
  valAttr=AttrModule.DynamicProp("checked",View.Map(function(x)
  {
   return Unchecked.Equals(x,value);
  },_var.get_View()));
  return Elt.New(el,AttrProxy.Concat(List.append(List.ofArray([AttrProxy.Create("type","radio"),AttrProxy.Create("name",_var.get_Id()),valAttr]),List.ofSeq(attrs))),Doc.Empty());
 };
 Doc.InputArea=function(attr$1,_var)
 {
  return Doc.InputInternal("textarea",function()
  {
   return Seq.append(attr$1,[AttrModule.Value(_var)]);
  });
 };
 Doc.Select=function(attrs,show,options,current)
 {
  return Doc.SelectImpl(attrs,show,function(rOptions)
  {
   rOptions[0]=options;
   return Doc.Concat(List.mapi(function(i,o)
   {
    return Doc.Element("option",List.ofArray([AttrProxy.Create("value",String$1(i))]),List.ofArray([Doc.TextNode(show(o))]));
   },options));
  },current);
 };
 Doc.SvgElement=function(name,attr$1,children)
 {
  var attr$2,children$1;
  attr$2=AttrProxy.Concat(attr$1);
  children$1=Doc.Concat(children);
  return Elt.New(DomUtility.CreateSvgElement(name),attr$2,children$1);
 };
 Doc.LoadLocalTemplates=function(baseName)
 {
  var existingLocalTpl;
  existingLocalTpl=Docs.LoadedTemplateFile("");
  existingLocalTpl.count>0?Docs.LoadedTemplates().set_Item(baseName,existingLocalTpl):(function()
  {
   var m,m$1,name,name$1;
   while(true)
    {
     m=Global.document.querySelector("[ws-template]");
     if(Unchecked.Equals(m,null))
      {
       m$1=Global.document.querySelector("[ws-children-template]");
       if(Unchecked.Equals(m$1,null))
        return null;
       else
        {
         name=m$1.getAttribute("ws-children-template");
         m$1.removeAttribute("ws-children-template");
         Doc.PrepareTemplate(baseName,{
          $:1,
          $0:name
         },function(n)
         {
          return function()
          {
           return DomUtility.ChildrenArray(n);
          };
         }(m$1));
        }
      }
     else
      {
       name$1=m.getAttribute("ws-template");
       Doc.PrepareSingleTemplate(baseName,{
        $:1,
        $0:name$1
       },m);
      }
    }
  }(),Docs.LoadedTemplates().set_Item("",Docs.LoadedTemplateFile(baseName)));
 };
 Doc.GetOrLoadTemplate=function(baseName,name,els,fillWith)
 {
  Doc.LoadLocalTemplates$1();
  Doc.PrepareTemplate(baseName,name,els);
  return Doc.NamedTemplate(baseName,name,fillWith);
 };
 Doc.PrepareTemplate=function(baseName,name,els)
 {
  var els$1,i,$1,el,m;
  if(!Docs.LoadedTemplateFile(baseName).ContainsKey(name==null?"":name.$0))
   {
    els$1=els();
    for(i=0,$1=els$1.length-1;i<=$1;i++){
     el=Arrays.get(els$1,i);
     m=el.parentNode;
     Unchecked.Equals(m,null)?void 0:m.removeChild(el);
    }
    Doc.PrepareTemplateStrict(baseName,name,els$1,null);
   }
 };
 Doc.CheckBox=function(attrs,chk)
 {
  return Doc.InputInternal("input",function()
  {
   return Seq.append(attrs,[AttrProxy.Create("type","checkbox"),AttrModule.Checked(chk)]);
  });
 };
 Doc.SelectImpl=function(attrs,show,optionElements,current)
 {
  var options,el,selectedItemAttr,x;
  function getIndex(el$1)
  {
   return el$1.selectedIndex;
  }
  function setIndex(el$1,i)
  {
   el$1.selectedIndex=i;
  }
  function getSelectedItem(el$1)
  {
   var i;
   i=getIndex(el$1);
   return options[0].get_Item(i);
  }
  function itemIndex(x$1)
  {
   return Seq.findIndex(function(y)
   {
    return Unchecked.Equals(x$1,y);
   },options[0]);
  }
  function setSelectedItem(el$1,item)
  {
   return setIndex(el$1,itemIndex(item));
  }
  options=[T.Empty];
  el=DomUtility.CreateElement("select");
  selectedItemAttr=AttrModule.DynamicCustom(function($1)
  {
   return function($2)
   {
    return setSelectedItem($1,$2);
   };
  },current.get_View());
  el.addEventListener("change",function()
  {
   current.UpdateMaybe(function(x$1)
   {
    var y;
    y=getSelectedItem(el);
    return Unchecked.Equals(x$1,y)?null:{
     $:1,
     $0:y
    };
   });
  },false);
  return Elt.New(el,(x=AttrProxy.Append(selectedItemAttr,AttrProxy.Concat(attrs)),AttrProxy.Append(AttrModule.OnAfterRender(function(el$1)
  {
   setSelectedItem(el$1,current.Get());
  }),x)),optionElements(options));
 };
 Doc.PrepareSingleTemplate=function(baseName,name,el)
 {
  var m,m$1,n;
  el.removeAttribute("ws-template");
  m=el.getAttribute("ws-replace");
  m===null?void 0:(el.removeAttribute("ws-replace"),m$1=el.parentNode,Unchecked.Equals(m$1,null)?void 0:(n=Global.document.createElement(el.tagName),n.setAttribute("ws-replace",m),m$1.replaceChild(n,el)));
  Doc.PrepareTemplateStrict(baseName,name,[el],null);
 };
 Doc.NamedTemplate=function(baseName,name,fillWith)
 {
  var m,o;
  m=(o=null,[Docs.LoadedTemplateFile(baseName).TryGetValue(name==null?"":name.$0,{
   get:function()
   {
    return o;
   },
   set:function(v)
   {
    o=v;
   }
  }),o]);
  return m[0]?Doc.ChildrenTemplate(m[1].cloneNode(true),fillWith):(console.warn("Local template doesn't exist",name),Doc.Empty());
 };
 Doc.PrepareTemplateStrict=function(baseName,name,els,root)
 {
  var fakeroot,name$1;
  function convertAttrs(el)
  {
   var attrs,toRemove,events,holedAttrs,i,$1,a,_this;
   function lowercaseAttr(name$2)
   {
    var m;
    m=el.getAttribute(name$2);
    m===null?void 0:el.setAttribute(name$2,m.toLowerCase());
   }
   attrs=el.attributes;
   toRemove=[];
   events=[];
   holedAttrs=[];
   for(i=0,$1=attrs.length-1;i<=$1;i++){
    a=attrs.item(i);
    Strings.StartsWith(a.nodeName,"ws-on")&&a.nodeName!=="ws-onafterrender"&&a.nodeName!=="ws-on"?(toRemove.push(a.nodeName),events.push(Slice.string(a.nodeName,{
     $:1,
     $0:"ws-on".length
    },null)+":"+a.nodeValue.toLowerCase())):!Strings.StartsWith(a.nodeName,"ws-")&&(new Global.RegExp(Docs.TextHoleRE())).test(a.nodeValue)?(a.nodeValue=(_this=new Global.RegExp(Docs.TextHoleRE(),"g"),a.nodeValue.replace(_this,function($2,$3)
    {
     return"${"+$3.toLowerCase()+"}";
    })),holedAttrs.push(a.nodeName)):void 0;
   }
   !(events.length==0)?el.setAttribute("ws-on",Strings.concat(" ",events)):void 0;
   !(holedAttrs.length==0)?el.setAttribute("ws-attr-holes",Strings.concat(" ",holedAttrs)):void 0;
   lowercaseAttr("ws-hole");
   lowercaseAttr("ws-replace");
   lowercaseAttr("ws-attr");
   lowercaseAttr("ws-onafterrender");
   lowercaseAttr("ws-var");
   Arrays.iter(function(a$1)
   {
    el.removeAttribute(a$1);
   },toRemove);
  }
  function convertTextNode(n)
  {
   var m,li,$1,s,strRE,hole;
   m=null;
   li=0;
   s=n.textContent;
   strRE=new Global.RegExp(Docs.TextHoleRE(),"g");
   while(m=strRE.exec(s),m!==null)
    {
     n.parentNode.insertBefore(Global.document.createTextNode(Slice.string(s,{
      $:1,
      $0:li
     },{
      $:1,
      $0:strRE.lastIndex-Arrays.get(m,0).length-1
     })),n);
     li=strRE.lastIndex;
     hole=Global.document.createElement("span");
     hole.setAttribute("ws-replace",Arrays.get(m,1).toLowerCase());
     n.parentNode.insertBefore(hole,n);
    }
   strRE.lastIndex=0;
   n.textContent=Slice.string(s,{
    $:1,
    $0:li
   },null);
  }
  function mapHoles(t,mappings)
  {
   function run(attrName)
   {
    DomUtility.IterSelector(t,"["+attrName+"]",function(e)
    {
     var m,o;
     m=(o=null,[mappings.TryGetValue(e.getAttribute(attrName).toLowerCase(),{
      get:function()
      {
       return o;
      },
      set:function(v)
      {
       o=v;
      }
     }),o]);
     m[0]?e.setAttribute(attrName,m[1]):void 0;
    });
   }
   run("ws-hole");
   run("ws-replace");
   run("ws-attr");
   run("ws-onafterrender");
   run("ws-var");
   DomUtility.IterSelector(t,"[ws-on]",function(e)
   {
    e.setAttribute("ws-on",Strings.concat(" ",Arrays.map(function(x)
    {
     var a,m,o;
     a=Strings.SplitChars(x,[":"],1);
     m=(o=null,[mappings.TryGetValue(Arrays.get(a,1),{
      get:function()
      {
       return o;
      },
      set:function(v)
      {
       o=v;
      }
     }),o]);
     return m[0]?Arrays.get(a,0)+":"+m[1]:x;
    },Strings.SplitChars(e.getAttribute("ws-on"),[" "],1))));
   });
   return DomUtility.IterSelector(t,"[ws-attr-holes]",function(e)
   {
    var holeAttrs,i,$1;
    holeAttrs=Strings.SplitChars(e.getAttribute("ws-attr-holes"),[" "],1);
    for(i=0,$1=holeAttrs.length-1;i<=$1;i++)(function()
    {
     var attrName;
     function f(s,a)
     {
      var a$1;
      a$1=Operators.KeyValue(a);
      return s.replace(new Global.RegExp("\\${"+a$1[0]+"}","ig"),"${"+a$1[1]+"}");
     }
     attrName=Arrays.get(holeAttrs,i);
     return e.setAttribute(attrName,(((Runtime$1.Curried3(Seq.fold))(f))(e.getAttribute(attrName)))(mappings));
    }());
   });
  }
  function fillInstanceAttrs(instance,fillWith)
  {
   var name$2,m,i,$1,a;
   convertAttrs(fillWith);
   name$2=fillWith.nodeName.toLowerCase();
   m=instance.querySelector("[ws-attr="+name$2+"]");
   if(Unchecked.Equals(m,null))
    return console.warn("Filling non-existent attr hole",name$2);
   else
    {
     m.removeAttribute("ws-attr");
     for(i=0,$1=fillWith.attributes.length-1;i<=$1;i++){
      a=fillWith.attributes.item(i);
      a.name==="class"&&m.hasAttribute("class")?m.setAttribute("class",m.getAttribute("class")+" "+a.nodeValue):m.setAttribute(a.name,a.nodeValue);
     }
     return;
    }
  }
  function removeHolesExcept(instance,dontRemove)
  {
   function run(attrName)
   {
    DomUtility.IterSelector(instance,"["+attrName+"]",function(e)
    {
     if(!dontRemove.Contains(e.getAttribute(attrName)))
      e.removeAttribute(attrName);
    });
   }
   run("ws-attr");
   run("ws-onafterrender");
   run("ws-var");
   DomUtility.IterSelector(instance,"[ws-hole]",function(e)
   {
    if(!dontRemove.Contains(e.getAttribute("ws-hole")))
     {
      e.removeAttribute("ws-hole");
      while(e.hasChildNodes())
       e.removeChild(e.lastChild);
     }
   });
   DomUtility.IterSelector(instance,"[ws-replace]",function(e)
   {
    if(!dontRemove.Contains(e.getAttribute("ws-replace")))
     e.parentNode.removeChild(e);
   });
   DomUtility.IterSelector(instance,"[ws-on]",function(e)
   {
    e.setAttribute("ws-on",Strings.concat(" ",Arrays.filter(function(x)
    {
     return dontRemove.Contains(Arrays.get(Strings.SplitChars(x,[":"],1),1));
    },Strings.SplitChars(e.getAttribute("ws-on"),[" "],1))));
   });
   return DomUtility.IterSelector(instance,"[ws-attr-holes]",function(e)
   {
    var holeAttrs,i,$1,attrName,_this;
    holeAttrs=Strings.SplitChars(e.getAttribute("ws-attr-holes"),[" "],1);
    for(i=0,$1=holeAttrs.length-1;i<=$1;i++){
     attrName=Arrays.get(holeAttrs,i);
     e.setAttribute(attrName,(_this=new Global.RegExp(Docs.TextHoleRE(),"g"),e.getAttribute(attrName).replace(_this,function($2,$3)
     {
      return dontRemove.Contains($3)?$2:"";
     })));
    }
   });
  }
  function fillTextHole(instance,fillWith)
  {
   var m;
   m=instance.querySelector("[ws-replace]");
   return Unchecked.Equals(m,null)?(console.warn("Filling non-existent text hole",name),null):(m.parentNode.replaceChild(new Global.Text(fillWith),m),{
    $:1,
    $0:m.getAttribute("ws-replace")
   });
  }
  function fill(fillWith,p,n)
  {
   while(true)
    if(fillWith.hasChildNodes())
     n=p.insertBefore(fillWith.lastChild,n);
    else
     return null;
  }
  function recF(recI,$1,$2)
  {
   var m,$3,x,f,name$2,p,name$3,baseName$1,d,t,instance,usedHoles,mappings,attrs,i,$4,name$4,m$1,i$1,$5,n,singleTextFill,i$2,$6,n$1,next;
   function g(v)
   {
   }
   while(true)
    switch(recI)
    {
     case 0:
      name$2=Slice.string($1.nodeName,{
       $:1,
       $0:3
      },null).toLowerCase();
      p=(m=name$2.indexOf("."),m===-1?[baseName,name$2]:[Slice.string(name$2,null,{
       $:1,
       $0:m-1
      }),Slice.string(name$2,{
       $:1,
       $0:m+1
      },null)]);
      name$3=p[1];
      baseName$1=p[0];
      if(!Docs.LoadedTemplates().ContainsKey(baseName$1))
       return console.warn("Instantiating non-loaded template",name$3);
      else
       {
        d=Docs.LoadedTemplates().get_Item(baseName$1);
        if(!d.ContainsKey(name$3))
         return console.warn("Instantiating non-loaded template",name$3);
        else
         {
          t=d.get_Item(name$3);
          instance=t.cloneNode(true);
          usedHoles=new HashSet.New$3();
          mappings=new Dictionary.New$5();
          attrs=$1.attributes;
          for(i=0,$4=attrs.length-1;i<=$4;i++){
           name$4=attrs.item(i).name.toLowerCase();
           mappings.set_Item(name$4,(m$1=attrs.item(i).nodeValue,m$1===""?name$4:m$1.toLowerCase()));
           !usedHoles.Add(name$4)?console.warn("Hole mapped twice",name$4):void 0;
          }
          for(i$1=0,$5=$1.childNodes.length-1;i$1<=$5;i$1++){
           n=$1.childNodes[i$1];
           Unchecked.Equals(n.nodeType,Node.ELEMENT_NODE)?!usedHoles.Add(n.nodeName.toLowerCase())?console.warn("Hole filled twice",name$3):void 0:void 0;
          }
          singleTextFill=$1.childNodes.length===1&&Unchecked.Equals($1.firstChild.nodeType,Node.TEXT_NODE);
          if(singleTextFill)
           {
            x=fillTextHole(instance,$1.firstChild.textContent);
            ((function(a)
            {
             return function(o)
             {
              if(o!=null)
               a(o.$0);
             };
            }((f=function(usedHoles$1)
            {
             return function(a)
             {
              return usedHoles$1.Add(a);
             };
            }(usedHoles),function(x$1)
            {
             return g(f(x$1));
            })))(x));
           }
          removeHolesExcept(instance,usedHoles);
          if(!singleTextFill)
           {
            for(i$2=0,$6=$1.childNodes.length-1;i$2<=$6;i$2++){
             n$1=$1.childNodes[i$2];
             Unchecked.Equals(n$1.nodeType,Node.ELEMENT_NODE)?n$1.hasAttributes()?fillInstanceAttrs(instance,n$1):fillDocHole(instance,n$1):void 0;
            }
           }
          mapHoles(instance,mappings);
          (((function(a)
          {
           function c($7,$8)
           {
            return fill(a,$7,$8);
           }
           return function($7)
           {
            return function($8)
            {
             return c($7,$8);
            };
           };
          }(instance))($1.parentNode))($1));
          $1.parentNode.removeChild($1);
          return;
         }
       }
      break;
     case 1:
      if($2!==null)
       {
        next=$2.nextSibling;
        if(Unchecked.Equals($2.nodeType,Node.TEXT_NODE))
         convertTextNode($2);
        else
         if(Unchecked.Equals($2.nodeType,Node.ELEMENT_NODE))
          convertElement($2);
        $2=next;
       }
      else
       return null;
      break;
    }
  }
  function fillDocHole(instance,fillWith)
  {
   var m,name$2,m$1;
   function fillHole(p,n)
   {
    var parsed,i,$1;
    if(name$2==="title"&&fillWith.hasChildNodes())
     {
      parsed=$.parseHTML(fillWith.textContent);
      fillWith.removeChild(fillWith.firstChild);
      for(i=0,$1=parsed.length-1;i<=$1;i++)fillWith.appendChild(Arrays.get(parsed,i));
     }
    else
     null;
    convertElement(fillWith);
    return fill(fillWith,p,n);
   }
   name$2=fillWith.nodeName.toLowerCase();
   DomUtility.IterSelector(instance,"[ws-attr-holes]",function(e)
   {
    var holeAttrs,i,$1,attrName,_this;
    holeAttrs=Strings.SplitChars(e.getAttribute("ws-attr-holes"),[" "],1);
    for(i=0,$1=holeAttrs.length-1;i<=$1;i++){
     attrName=Arrays.get(holeAttrs,i);
     e.setAttribute(attrName,(_this=new Global.RegExp("\\${"+name$2+"}","ig"),e.getAttribute(attrName).replace(_this,fillWith.textContent)));
    }
   });
   m$1=instance.querySelector("[ws-hole="+name$2+"]");
   if(Unchecked.Equals(m$1,null))
    {
     m=instance.querySelector("[ws-replace="+name$2+"]");
     return Unchecked.Equals(m,null)?null:(fillHole(m.parentNode,m),void m.parentNode.removeChild(m));
    }
   else
    {
     while(m$1.hasChildNodes())
      m$1.removeChild(m$1.lastChild);
     m$1.removeAttribute("ws-hole");
     return fillHole(m$1,null);
    }
  }
  function convertInstantiation(el)
  {
   return recF(0,el);
  }
  function convertElement(el)
  {
   var m,m$1;
   if(Strings.StartsWith(el.nodeName.toLowerCase(),"ws-")&&!el.hasAttribute("ws-template"))
    convertInstantiation(el);
   else
    {
     convertAttrs(el);
     m=el.getAttribute("ws-template");
     if(m===null)
      {
       m$1=el.getAttribute("ws-children-template");
       if(m$1===null)
        convert(el,el.firstChild);
       else
        {
         el.removeAttribute("ws-children-template");
         Doc.PrepareTemplate(baseName,{
          $:1,
          $0:m$1
         },function()
         {
          return DomUtility.ChildrenArray(el);
         });
         while(el.hasChildNodes())
          el.removeChild(el.lastChild);
        }
      }
     else
      Doc.PrepareSingleTemplate(baseName,{
       $:1,
       $0:m
      },el);
    }
  }
  function convert(p,n)
  {
   return recF(1,p,n);
  }
  fakeroot=root!=null&&root.$==1?root.$0:Doc.FakeRoot(els);
  name$1=(name==null?"":name.$0).toLowerCase();
  Docs.LoadedTemplateFile(baseName).set_Item(name$1,fakeroot);
  Arrays.length(els)>0?convert(fakeroot,Arrays.get(els,0)):void 0;
 };
 Doc.ConvertBy=function(key,render,view)
 {
  return Doc.Flatten(View.MapSeqCachedBy(key,render,view));
 };
 Doc.PasswordBox=function(attr$1,_var)
 {
  return Doc.InputInternal("input",function()
  {
   return Seq.append(attr$1,[AttrModule.Value(_var),AttrProxy.Create("type","password")]);
  });
 };
 Doc.ChildrenTemplate=function(el,fillWith)
 {
  var p,updates,docTreeNode,m,$1;
  p=Doc.InlineTemplate(el,fillWith);
  updates=p[1];
  docTreeNode=p[0];
  m=docTreeNode.Els;
  return!Unchecked.Equals(m,null)&&m.length===1&&(Arrays.get(m,0)instanceof Node&&(Unchecked.Equals(Arrays.get(m,0).nodeType,Node.ELEMENT_NODE)&&($1=Arrays.get(m,0),true)))?Elt.TreeNode(docTreeNode,updates):Doc.Mk({
   $:6,
   $0:docTreeNode
  },updates);
 };
 Doc.FakeRoot=function(els)
 {
  var fakeroot,i,$1;
  fakeroot=Global.document.createElement("div");
  for(i=0,$1=els.length-1;i<=$1;i++)fakeroot.appendChild(Arrays.get(els,i));
  return fakeroot;
 };
 Doc.Flatten=function(view)
 {
  return Doc.EmbedView(View.Map(Doc.Concat,view));
 };
 Doc.InlineTemplate=function(el,fillWith)
 {
  var els,$1,holes,updates,attrs,afterRender,fw,e,x;
  function addAttr(el$1,attr$1)
  {
   var attr$2,m,f;
   attr$2=Attrs.Insert(el$1,attr$1);
   updates.push(Attrs.Updates(attr$2));
   attrs.push([el$1,attr$2]);
   m=Runtime$1.GetOptional(attr$2.OnAfterRender);
   return m==null?null:(f=m.$0,void afterRender.push(function()
   {
    f(el$1);
   }));
  }
  function tryGetAsDoc(name)
  {
   var m,o;
   m=(o=null,[fw.TryGetValue(name,{
    get:function()
    {
     return o;
    },
    set:function(v)
    {
     o=v;
    }
   }),o]);
   return m[0]?m[1].$==0?{
    $:1,
    $0:m[1].$1
   }:m[1].$==1?{
    $:1,
    $0:Doc.TextNode(m[1].$1)
   }:m[1].$==2?{
    $:1,
    $0:Doc.TextView(m[1].$1)
   }:m[1].$==8?{
    $:1,
    $0:Doc.TextView(m[1].$1.get_View())
   }:m[1].$==9?{
    $:1,
    $0:Doc.TextView(View.Map(String$1,m[1].$1.get_View()))
   }:m[1].$==10?{
    $:1,
    $0:Doc.TextView(View.Map(function(i)
    {
     return i.get_Input();
    },m[1].$1.get_View()))
   }:m[1].$==11?{
    $:1,
    $0:Doc.TextView(View.Map(String$1,m[1].$1.get_View()))
   }:m[1].$==12?{
    $:1,
    $0:Doc.TextView(View.Map(function(i)
    {
     return i.get_Input();
    },m[1].$1.get_View()))
   }:m[1].$==13?{
    $:1,
    $0:Doc.TextView(View.Map(String$1,m[1].$1.get_View()))
   }:(console.warn("Content hole filled with attribute data",name),null):null;
  }
  holes=[];
  updates=[];
  attrs=[];
  afterRender=[];
  fw=new Dictionary.New$5();
  e=Enumerator.Get(fillWith);
  try
  {
   while(e.MoveNext())
    {
     x=e.Current();
     fw.set_Item(x.$0,x);
    }
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
  els=DomUtility.ChildrenArray(el);
  DomUtility.IterSelector(el,"[ws-hole]",function(p)
  {
   var m,doc,name;
   name=p.getAttribute("ws-hole");
   p.removeAttribute("ws-hole");
   while(p.hasChildNodes())
    p.removeChild(p.lastChild);
   m=tryGetAsDoc(name);
   m!=null&&m.$==1?(doc=m.$0,Docs.LinkElement(p,doc.docNode),holes.push(DocElemNode.New(Attrs.Empty(p),doc.docNode,null,p,Fresh.Int(),null)),updates.push(doc.updates)):void 0;
  });
  DomUtility.IterSelector(el,"[ws-replace]",function(e$1)
  {
   var m,doc,p,after,before,o;
   m=tryGetAsDoc(e$1.getAttribute("ws-replace"));
   m!=null&&m.$==1?(doc=m.$0,p=e$1.parentNode,after=Global.document.createTextNode(""),p.replaceChild(after,e$1),before=Docs.InsertBeforeDelim(after,doc.docNode),o=Arrays.tryFindIndex(function(y)
   {
    return e$1===y;
   },els),o==null?void 0:Arrays.set(els,o.$0,doc.docNode),holes.push(DocElemNode.New(Attrs.Empty(p),doc.docNode,{
    $:1,
    $0:[before,after]
   },p,Fresh.Int(),null)),updates.push(doc.updates)):void 0;
  });
  DomUtility.IterSelector(el,"[ws-attr]",function(e$1)
  {
   var name,m,o;
   name=e$1.getAttribute("ws-attr");
   e$1.removeAttribute("ws-attr");
   m=(o=null,[fw.TryGetValue(name,{
    get:function()
    {
     return o;
    },
    set:function(v)
    {
     o=v;
    }
   }),o]);
   m[0]?m[1].$==3?addAttr(e$1,m[1].$1):console.warn("Attribute hole filled with non-attribute data",name):void 0;
  });
  DomUtility.IterSelector(el,"[ws-on]",function(e$1)
  {
   addAttr(e$1,AttrProxy.Concat(Arrays.choose(function(x$1)
   {
    var a,m,o;
    a=Strings.SplitChars(x$1,[":"],1);
    m=(o=null,[fw.TryGetValue(Arrays.get(a,1),{
     get:function()
     {
      return o;
     },
     set:function(v)
     {
      o=v;
     }
    }),o]);
    return m[0]?m[1].$==4?{
     $:1,
     $0:AttrModule.Handler(Arrays.get(a,0),m[1].$1)
    }:m[1].$==5?{
     $:1,
     $0:AttrProxy.Handler(Arrays.get(a,0),m[1].$2)
    }:(console.warn("Event hole on"+Arrays.get(a,0)+" filled with non-event data",Arrays.get(a,1)),null):null;
   },Strings.SplitChars(e$1.getAttribute("ws-on"),[" "],1))));
   e$1.removeAttribute("ws-on");
  });
  DomUtility.IterSelector(el,"[ws-onafterrender]",function(e$1)
  {
   var name,m,o;
   name=e$1.getAttribute("ws-onafterrender");
   m=(o=null,[fw.TryGetValue(name,{
    get:function()
    {
     return o;
    },
    set:function(v)
    {
     o=v;
    }
   }),o]);
   m[0]?m[1].$==6?(e$1.removeAttribute("ws-onafterrender"),addAttr(e$1,AttrModule.OnAfterRender(m[1].$1))):m[1].$==7?(e$1.removeAttribute("ws-onafterrender"),addAttr(e$1,AttrModule.OnAfterRender(m[1].$1))):console.warn("onafterrender hole filled with non-onafterrender data",name):void 0;
  });
  DomUtility.IterSelector(el,"[ws-var]",function(e$1)
  {
   var name,m,o;
   name=e$1.getAttribute("ws-var");
   e$1.removeAttribute("ws-var");
   m=(o=null,[fw.TryGetValue(name,{
    get:function()
    {
     return o;
    },
    set:function(v)
    {
     o=v;
    }
   }),o]);
   m[0]?m[1].$==8?addAttr(e$1,AttrModule.Value(m[1].$1)):m[1].$==9?addAttr(e$1,AttrModule.Checked(m[1].$1)):m[1].$==10?addAttr(e$1,AttrModule.IntValue(m[1].$1)):m[1].$==11?addAttr(e$1,AttrModule.IntValueUnchecked(m[1].$1)):m[1].$==12?addAttr(e$1,AttrModule.FloatValue(m[1].$1)):m[1].$==13?addAttr(e$1,AttrModule.FloatValueUnchecked(m[1].$1)):console.warn("Var hole filled with non-Var data",name):void 0;
  });
  DomUtility.IterSelector(el,"[ws-attr-holes]",function(e$1)
  {
   var re,holeAttrs,i,$2;
   re=new Global.RegExp(Docs.TextHoleRE(),"g");
   holeAttrs=Strings.SplitChars(e$1.getAttribute("ws-attr-holes"),[" "],1);
   e$1.removeAttribute("ws-attr-holes");
   for(i=0,$2=holeAttrs.length-1;i<=$2;i++)(function()
   {
    var m,lastIndex,$3,finalText,value,s,s$1,s$2,s$3,attrName,s$4,res,textBefore;
    attrName=Arrays.get(holeAttrs,i);
    s$4=e$1.getAttribute(attrName);
    m=null;
    lastIndex=0;
    res=[];
    while(m=re.exec(s$4),m!==null)
     {
      textBefore=Slice.string(s$4,{
       $:1,
       $0:lastIndex
      },{
       $:1,
       $0:re.lastIndex-Arrays.get(m,0).length-1
      });
      lastIndex=re.lastIndex;
      res.push([textBefore,Arrays.get(m,1)]);
     }
    finalText=Slice.string(s$4,{
     $:1,
     $0:lastIndex
    },null);
    re.lastIndex=0;
    value=Arrays.foldBack(function($4,$5)
    {
     return(function(t)
     {
      var textBefore$1,holeName;
      textBefore$1=t[0];
      holeName=t[1];
      return function(t$1)
      {
       var textAfter,views,holeContent,m$1,o;
       textAfter=t$1[0];
       views=t$1[1];
       holeContent=(m$1=(o=null,[fw.TryGetValue(holeName,{
        get:function()
        {
         return o;
        },
        set:function(v)
        {
         o=v;
        }
       }),o]),m$1[0]?m$1[1].$==1?{
        $:0,
        $0:m$1[1].$1
       }:m$1[1].$==2?{
        $:1,
        $0:m$1[1].$1
       }:m$1[1].$==8?{
        $:1,
        $0:m$1[1].$1.get_View()
       }:m$1[1].$==9?{
        $:1,
        $0:View.Map(String$1,m$1[1].$1.get_View())
       }:m$1[1].$==10?{
        $:1,
        $0:View.Map(function(i$1)
        {
         return i$1.get_Input();
        },m$1[1].$1.get_View())
       }:m$1[1].$==11?{
        $:1,
        $0:View.Map(String$1,m$1[1].$1.get_View())
       }:m$1[1].$==12?{
        $:1,
        $0:View.Map(function(i$1)
        {
         return i$1.get_Input();
        },m$1[1].$1.get_View())
       }:m$1[1].$==13?{
        $:1,
        $0:View.Map(String$1,m$1[1].$1.get_View())
       }:(console.warn("Attribute value hole filled with non-text data",holeName),{
        $:0,
        $0:""
       }):{
        $:0,
        $0:""
       });
       return holeContent.$==1?[textBefore$1,new T({
        $:1,
        $0:textAfter===""?holeContent.$0:View.Map(function(s$5)
        {
         return s$5+textAfter;
        },holeContent.$0),
        $1:views
       })]:[textBefore$1+holeContent.$0+textAfter,views];
      };
     }($4))($5);
    },res,[finalText,T.Empty]);
    return addAttr(e$1,value[1].$==1?value[1].$1.$==1?value[1].$1.$1.$==1?value[1].$1.$1.$1.$==0?(s=value[0],AttrModule.Dynamic(attrName,View.Map3(function(v1,v2,v3)
    {
     return s+v1+v2+v3;
    },value[1].$0,value[1].$1.$0,value[1].$1.$1.$0))):(s$1=value[0],AttrModule.Dynamic(attrName,View.Map(function(vs)
    {
     return s$1+Strings.concat("",vs);
    },View.Sequence(value[1])))):(s$2=value[0],AttrModule.Dynamic(attrName,View.Map2(function(v1,v2)
    {
     return s$2+v1+v2;
    },value[1].$0,value[1].$1.$0))):value[0]===""?AttrModule.Dynamic(attrName,value[1].$0):(s$3=value[0],AttrModule.Dynamic(attrName,View.Map(function(v)
    {
     return s$3+v;
    },value[1].$0))):AttrProxy.Create(attrName,value[0]));
   }());
  });
  return[Runtime$1.DeleteEmptyFields({
   Els:els,
   Dirty:true,
   Holes:holes,
   Attrs:attrs,
   Render:($1=afterRender.length==0?null:{
    $:1,
    $0:function(el$1)
    {
     Arrays.iter(function(f)
     {
      f(el$1);
     },afterRender);
    }
   },$1?$1.$0:void 0)
  },["Render"]),Array.TreeReduce(View.Const(),View.Map2Unit,updates)];
 };
 Doc.New=Runtime$1.Ctor(function(docNode,updates)
 {
  this.docNode=docNode;
  this.updates=updates;
 },Doc);
 AboutEntry.New=function(Name,ImgURL,Description,URLs)
 {
  return{
   Name:Name,
   ImgURL:ImgURL,
   Description:Description,
   URLs:URLs
  };
 };
 Utilities.cls=function(n)
 {
  return AttrModule.Class(n);
 };
 Utilities.divc=function(c,docs)
 {
  return Doc.Element("div",List.ofArray([Utilities.cls(c)]),docs);
 };
 Utilities.sty=function(n,v)
 {
  return AttrModule.Style(n,v);
 };
 Utilities.href=function(txt,url)
 {
  return Doc.Element("a",List.ofArray([AttrProxy.Create("href",url)]),List.ofArray([Doc.TextNode(txt)]));
 };
 attr=HtmlModule.attr=Runtime$1.Class({},Obj,attr);
 Samples.SamplesDefault=function()
 {
  SC$18.$cctor();
  return SC$18.SamplesDefault;
 };
 Samples.Build=function(page)
 {
  return Samples.Routed(function()
  {
   return page;
  },null,function(x)
  {
   return Unchecked.Equals(x,page)?{
    $:1,
    $0:null
   }:null;
  });
 };
 Samples.Routed=function(wrap,def,unwrap)
 {
  return Builder.New(def,wrap,unwrap,function()
  {
   return Doc.Empty();
  },function()
  {
   return Doc.Empty();
  },Meta.New("Unknown.fs",T.Empty,"Unknown"));
 };
 Samples.Render=function(vPage,meta,body,description,samples)
 {
  return Doc.Element("section",[Utilities.cls("block-small")],[Utilities.divc("container",[Utilities.divc("row",[Samples.Sidebar(vPage,samples),Samples.RenderContent(meta,body,description)])])]);
 };
 Samples.Sidebar=function(vPage,samples)
 {
  return Utilities.divc("col-md-3",[Doc.Element("h4",[],[Doc.TextNode("Samples")]),Doc.Concat(List.map(function(sample)
  {
   var activeAttr;
   activeAttr=AttrModule.DynamicClassPred("active",View.Map(function(a)
   {
    return a.$==2&&sample.IsThis(a.$0);
   },vPage.get_View()));
   return Doc.Link(sample.Meta.Title,[Utilities.cls("list-group-item"),activeAttr],function()
   {
    Var.Set(vPage,{
     $:2,
     $0:sample.DefaultPage
    });
   });
  },samples))]);
 };
 Samples.RenderContent=function(meta,body,description)
 {
  return Utilities.divc("samples col-md-9",[Doc.Element("div",[],[Utilities.divc("row",[Doc.Element("h1",[],[Doc.TextNode(meta.Title)]),Doc.Element("div",[],[Doc.Element("p",[],[description]),Doc.Element("p",[],[Doc.Element("a",[AttrProxy.Create("href","https://github.com/intellifactory/websharper.ui.next.samples/blob/master/src/"+meta.FileName)],[Doc.TextNode("View Source")])])])]),Utilities.divc("row",[Doc.Element("p",[],[body])])])]);
 };
 Sample.New=function(Page$1,IsThis,Meta$1,DefaultPage)
 {
  return{
   Page:Page$1,
   IsThis:IsThis,
   Meta:Meta$1,
   DefaultPage:DefaultPage
  };
 };
 SortableBarChart.Sample=function()
 {
  SC$20.$cctor();
  return SC$20.Sample;
 };
 SortableBarChart.SimpleAnimation=function(x,y)
 {
  return SortableBarChart.DelayedAnimation(0,x,y);
 };
 SortableBarChart.SimpleTransition=function()
 {
  SC$20.$cctor();
  return SC$20.SimpleTransition;
 };
 SortableBarChart.LoadFromCSV=function(url)
 {
  return Concurrency.FromContinuations(function(ok)
  {
   $.get(url,new Obj.New(),function($1)
   {
    ok(SortableBarChart.ParseCSV($1));
   });
  });
 };
 SortableBarChart.Main=function(a)
 {
  var vOrder,dataView;
  vOrder=Var.Create$1(Ordering.ByLetter);
  dataView=View.Map2(SortableBarChart.ViewData,View.Map(List.ofSeq,SortableBarChart.LoadData()),vOrder.get_View());
  return Doc.Element("div",[],[Doc.Select([],SortableBarChart.ShowOrdering,List.ofArray([Ordering.ByLetter,Ordering.ByFrequency]),vOrder),SortableBarChart.DisplayGraph(dataView)]);
 };
 SortableBarChart.Description=function(a)
 {
  return Doc.Element("div",[],[Doc.TextNode("This sample show-cases animation and data display.")]);
 };
 SortableBarChart.DelayedAnimation=function(delay,x,y)
 {
  return An.Delayed(Interpolation.get_Double(),Easing.get_CubicInOut(),300,delay,x,y);
 };
 SortableBarChart.ParseCSV=function(data)
 {
  return Arrays.map(function(str)
  {
   return SortableBarChart.mkEntry(Strings.SplitChars(str,[","],0));
  },Slice.array(Arrays.filter(function(s)
  {
   return s!=="";
  },Strings.SplitChars(data,["\r","\n"],0)),{
   $:1,
   $0:1
  },null));
 };
 SortableBarChart.LoadData=function()
 {
  SC$20.$cctor();
  return SC$20.LoadData;
 };
 SortableBarChart.ViewData=function(xs,ordering)
 {
  var numData,maxVal,sortFn;
  numData=List.length(xs);
  maxVal=Seq.fold(function($1,$2)
  {
   return $2.DataValue>$1?$2.DataValue:$1;
  },0,xs);
  sortFn=ordering.$==1?function(x)
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
  };
  return List.mapi(function(i,x)
  {
   return DataView.New(x.DataLabel,x.DataValue,i,maxVal,numData);
  },List.sortWith(function($1,$2)
  {
   return(sortFn($1))($2);
  },List.ofSeq(xs)));
 };
 SortableBarChart.ShowOrdering=function(a)
 {
  return a.$==1?"By Frequency":"By Letter";
 };
 SortableBarChart.DisplayGraph=function(data)
 {
  return Doc.Element("div",[],[Doc.SvgElement("svg",[AttrProxy.Create("width",String$1(SortableBarChart.Width())),AttrProxy.Create("height",String$1(SortableBarChart.Height()))],[Doc.EmbedView(View.Map(Doc.Concat,View.MapSeqCachedViewBy(function(d)
  {
   return d.Label;
  },SortableBarChart.Render,data)))])]);
 };
 SortableBarChart.mkEntry=function(row)
 {
  var $1;
  return DataEntry.New(Arrays.get(row,0),($1=Global.Number(Arrays.get(row,1)),Global.isNaN($1)?new FormatException.New("Input string was not in a correct format."):$1));
 };
 SortableBarChart.Width=function()
 {
  SC$20.$cctor();
  return SC$20.Width;
 };
 SortableBarChart.Height=function()
 {
  SC$20.$cctor();
  return SC$20.Height;
 };
 SortableBarChart.Render=function(a,dView)
 {
  function dyn(name,proj)
  {
   return AttrModule.Dynamic(name,View.Map(function(x)
   {
    return String$1(proj(x));
   },dView));
  }
  function width(d)
  {
   return SortableBarChart.Width()/+d.NumData-SortableBarChart.Spacing();
  }
  function height(d)
  {
   return d.Value/d.MaxValue*SortableBarChart.Height();
  }
  return Doc.SvgElement("g",[AttrModule.Style("fill","steelblue")],[Doc.SvgElement("rect",[dyn("width",width),dyn("height",height),AttrModule.Animated("x",SortableBarChart.BarTransition(),View.Map(function(d)
  {
   return(width(d)+SortableBarChart.Spacing())*+d.Rank;
  },dView),String$1),dyn("y",function(d)
  {
   return SortableBarChart.Height()-height(d);
  })],[])]);
 };
 SortableBarChart.Spacing=function()
 {
  SC$20.$cctor();
  return SC$20.Spacing;
 };
 SortableBarChart.BarTransition=function()
 {
  SC$20.$cctor();
  return SC$20.BarTransition;
 };
 Pervasives.NewFromSeq=function(fields)
 {
  var r,e,f;
  r={};
  e=Enumerator.Get(fields);
  try
  {
   while(e.MoveNext())
    {
     f=e.Current();
     r[f[0]]=f[1];
    }
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
  return r;
 };
 View.Map=function(fn,a)
 {
  return View.CreateLazy(function()
  {
   return Snap.Map(fn,a());
  });
 };
 View.Map2=function(fn,a,a$1)
 {
  return View.CreateLazy(function()
  {
   return Snap.Map2(fn,a(),a$1());
  });
 };
 View.Sink=function(act,a)
 {
  function loop()
  {
   Snap.WhenRun(a(),act,function()
   {
    Concurrency.scheduler().Fork(loop);
   });
  }
  Concurrency.scheduler().Fork(loop);
 };
 View.CreateLazy=function(observe)
 {
  var lv;
  lv={
   c:null,
   o:observe
  };
  return function()
  {
   var c,$1;
   c=lv.c;
   return c===null?(c=lv.o(),lv.c=c,($1=c.s,$1!=null&&$1.$==0)?lv.o=null:Snap.WhenObsoleteRun(c,function()
   {
    lv.c=null;
   }),c):c;
  };
 };
 View.Const=function(x)
 {
  var o;
  o=Snap.New({
   $:0,
   $0:x
  });
  return function()
  {
   return o;
  };
 };
 View.MapSeqCachedViewBy=function(key,conv,view)
 {
  var state;
  state=[new Dictionary.New$5()];
  return View.Map(function(xs)
  {
   var prevState,newState,result;
   prevState=state[0];
   newState=new Dictionary.New$5();
   result=Array.mapInPlace(function(x)
   {
    var k,node,n;
    k=key(x);
    node=prevState.ContainsKey(k)?(n=prevState.get_Item(k),(Var.Set(n.r,x),n)):View.ConvertSeqNode(function(v)
    {
     return conv(k,v);
    },x);
    newState.set_Item(k,node);
    return node.e;
   },Arrays.ofSeq(xs));
   state[0]=newState;
   return result;
  },view);
 };
 View.UpdateWhile=function(def,v1,v2)
 {
  var value;
  value=[def];
  return View.BindInner(function(pred)
  {
   return pred?View.Map(function(v)
   {
    value[0]=v;
    return v;
   },v2):View.Const(value[0]);
  },v1);
 };
 View.SnapshotOn=function(def,a,a$1)
 {
  var sInit;
  sInit=Snap.New({
   $:2,
   $0:def,
   $1:[]
  });
  return View.CreateLazy(function()
  {
   return sInit.s==null?Snap.SnapshotOn(a(),a$1()):(Snap.WhenObsolete(a(),sInit),sInit);
  });
 };
 View.MapAsync=function(fn,a)
 {
  return View.CreateLazy(function()
  {
   return Snap.MapAsync(fn,a());
  });
 };
 View.Bind=function(fn,view)
 {
  return View.Join(View.Map(fn,view));
 };
 View.ConvertSeqNode=function(conv,value)
 {
  var _var,view;
  _var=Var.Create$1(value);
  view=_var.get_View();
  return{
   e:conv(view),
   r:_var,
   w:view
  };
 };
 View.BindInner=function(fn,view)
 {
  return View.JoinInner(View.Map(fn,view));
 };
 View.Map2Unit=function(a,a$1)
 {
  return View.CreateLazy(function()
  {
   return Snap.Map2Unit(a(),a$1());
  });
 };
 View.Join=function(a)
 {
  return View.CreateLazy(function()
  {
   return Snap.Join(a());
  });
 };
 View.JoinInner=function(a)
 {
  return View.CreateLazy(function()
  {
   return Snap.JoinInner(a());
  });
 };
 View.MapSeqCachedBy=function(key,conv,view)
 {
  var state;
  state=[new Dictionary.New$5()];
  return View.Map(function(xs)
  {
   var prevState,newState,result;
   prevState=state[0];
   newState=new Dictionary.New$5();
   result=Array.mapInPlace(function(x)
   {
    var k,res;
    k=key(x);
    res=prevState.ContainsKey(k)?prevState.get_Item(k):conv(x);
    newState.set_Item(k,res);
    return res;
   },Arrays.ofSeq(xs));
   state[0]=newState;
   return result;
  },view);
 };
 View.Map3=function(fn,a,a$1,a$2)
 {
  return View.CreateLazy(function()
  {
   return Snap.Map3(fn,a(),a$1(),a$2());
  });
 };
 View.Sequence=function(views)
 {
  return View.CreateLazy(function()
  {
   return Snap.Sequence(Seq.map(function(a)
   {
    return a();
   },views));
  });
 };
 Unchecked.Equals=function(a,b)
 {
  var m,eqR,k,k$1;
  if(a===b)
   return true;
  else
   {
    m=typeof a;
    if(m=="object")
    {
     if(a===null||a===void 0||b===null||b===void 0)
      return false;
     else
      if("Equals"in a)
       return a.Equals(b);
      else
       if(a instanceof Global.Array&&b instanceof Global.Array)
        return Unchecked.arrayEquals(a,b);
       else
        if(a instanceof Global.Date&&b instanceof Global.Date)
         return Unchecked.dateEquals(a,b);
        else
         {
          eqR=[true];
          for(var k$2 in a)if(function(k$3)
          {
           eqR[0]=!a.hasOwnProperty(k$3)||b.hasOwnProperty(k$3)&&Unchecked.Equals(a[k$3],b[k$3]);
           return!eqR[0];
          }(k$2))
           break;
          if(eqR[0])
           {
            for(var k$3 in b)if(function(k$4)
            {
             eqR[0]=!b.hasOwnProperty(k$4)||a.hasOwnProperty(k$4);
             return!eqR[0];
            }(k$3))
             break;
           }
          return eqR[0];
         }
    }
    else
     return m=="function"&&("$Func"in a?a.$Func===b.$Func&&a.$Target===b.$Target:"$Invokes"in a&&"$Invokes"in b&&Unchecked.arrayEquals(a.$Invokes,b.$Invokes));
   }
 };
 Unchecked.arrayEquals=function(a,b)
 {
  var eq,i;
  if(Arrays.length(a)===Arrays.length(b))
   {
    eq=true;
    i=0;
    while(eq&&i<Arrays.length(a))
     {
      !Unchecked.Equals(Arrays.get(a,i),Arrays.get(b,i))?eq=false:void 0;
      i=i+1;
     }
    return eq;
   }
  else
   return false;
 };
 Unchecked.dateEquals=function(a,b)
 {
  return a.getTime()===b.getTime();
 };
 Unchecked.Compare=function(a,b)
 {
  var $1,m,$2,cmp,k,k$1;
  if(a===b)
   return 0;
  else
   {
    m=typeof a;
    switch(m=="function"?1:m=="boolean"?2:m=="number"?2:m=="string"?2:m=="object"?3:0)
    {
     case 0:
      return typeof b=="undefined"?0:-1;
      break;
     case 1:
      return Operators.FailWith("Cannot compare function values.");
      break;
     case 2:
      return a<b?-1:1;
      break;
     case 3:
      if(a===null)
       $2=-1;
      else
       if(b===null)
        $2=1;
       else
        if("CompareTo"in a)
         $2=a.CompareTo(b);
        else
         if("CompareTo0"in a)
          $2=a.CompareTo0(b);
         else
          if(a instanceof Global.Array&&b instanceof Global.Array)
           $2=Unchecked.compareArrays(a,b);
          else
           if(a instanceof Global.Date&&b instanceof Global.Date)
            $2=Unchecked.compareDates(a,b);
           else
            {
             cmp=[0];
             for(var k$2 in a)if(function(k$3)
             {
              return!a.hasOwnProperty(k$3)?false:!b.hasOwnProperty(k$3)?(cmp[0]=1,true):(cmp[0]=Unchecked.Compare(a[k$3],b[k$3]),cmp[0]!==0);
             }(k$2))
              break;
             if(cmp[0]===0)
              {
               for(var k$3 in b)if(function(k$4)
               {
                return!b.hasOwnProperty(k$4)?false:!a.hasOwnProperty(k$4)&&(cmp[0]=-1,true);
               }(k$3))
                break;
              }
             $2=cmp[0];
            }
      return $2;
      break;
    }
   }
 };
 Unchecked.Hash=function(o)
 {
  var m;
  m=typeof o;
  return m=="function"?0:m=="boolean"?o?1:0:m=="number"?o:m=="string"?Unchecked.hashString(o):m=="object"?o==null?0:o instanceof Global.Array?Unchecked.hashArray(o):Unchecked.hashObject(o):0;
 };
 Unchecked.compareArrays=function(a,b)
 {
  var cmp,i;
  if(Arrays.length(a)<Arrays.length(b))
   return -1;
  else
   if(Arrays.length(a)>Arrays.length(b))
    return 1;
   else
    {
     cmp=0;
     i=0;
     while(cmp===0&&i<Arrays.length(a))
      {
       cmp=Unchecked.Compare(Arrays.get(a,i),Arrays.get(b,i));
       i=i+1;
      }
     return cmp;
    }
 };
 Unchecked.compareDates=function(a,b)
 {
  return Unchecked.Compare(a.getTime(),b.getTime());
 };
 Unchecked.hashString=function(s)
 {
  var hash,i,$1;
  if(s===null)
   return 0;
  else
   {
    hash=5381;
    for(i=0,$1=s.length-1;i<=$1;i++)hash=Unchecked.hashMix(hash,s[i].charCodeAt());
    return hash;
   }
 };
 Unchecked.hashArray=function(o)
 {
  var h,i,$1;
  h=-34948909;
  for(i=0,$1=Arrays.length(o)-1;i<=$1;i++)h=Unchecked.hashMix(h,Unchecked.Hash(Arrays.get(o,i)));
  return h;
 };
 Unchecked.hashObject=function(o)
 {
  var h,k;
  if("GetHashCode"in o)
   return o.GetHashCode();
  else
   {
    h=[0];
    for(var k$1 in o)if(function(key)
    {
     h[0]=Unchecked.hashMix(Unchecked.hashMix(h[0],Unchecked.hashString(key)),Unchecked.Hash(o[key]));
     return false;
    }(k$1))
     break;
    return h[0];
   }
 };
 Unchecked.hashMix=function(x,y)
 {
  return(x<<5)+x+y;
 };
 AttrProxy=UI.AttrProxy=Runtime$1.Class({},null,AttrProxy);
 AttrProxy.Create=function(name,value)
 {
  return Attrs.Static(function(el)
  {
   DomUtility.SetAttr(el,name,value);
  });
 };
 AttrProxy.Concat=function(xs)
 {
  var x;
  x=Array.ofSeqNonCopying(xs);
  return Array.TreeReduce(Attrs.EmptyAttr(),AttrProxy.Append,x);
 };
 AttrProxy.Append=function(a,b)
 {
  return Attrs.AppendTree(a,b);
 };
 AttrProxy.Handler=function(event,q)
 {
  return AttrProxy.HandlerImpl(event,q);
 };
 AttrProxy.HandlerImpl=function(event,q)
 {
  return Attrs.Static(function(el)
  {
   el.addEventListener(event,function(d)
   {
    return(q(el))(d);
   },false);
  });
 };
 Builder=Samples.Builder=Runtime$1.Class({
  Create:function()
  {
   var $this,rendered,f;
   function g(o)
   {
    return o!=null;
   }
   $this=this;
   return Sample.New((rendered=null,function(_var)
   {
    return function(samples)
    {
     var _var$1,doc;
     return rendered==null?(_var$1=Var.Lens(_var,function(a)
     {
      var x;
      return a.$==2?(x=$this.Unwrap(a.$0),x==null?$this.DefaultPage:x.$0):$this.DefaultPage;
     },function(a,x)
     {
      return{
       $:2,
       $0:$this.Wrap(x)
      };
     }),(doc=Samples.Render(_var,$this.Meta,$this.Body(_var$1),$this.Description(_var$1),samples),(rendered={
      $:1,
      $0:doc
     },doc))):rendered.$0;
    };
   }),(f=this.Unwrap,function(x)
   {
    return g(f(x));
   }),this.Meta,this.Wrap(this.DefaultPage));
  },
  RenderDescription:function(f)
  {
   return Builder.New(this.DefaultPage,this.Wrap,this.Unwrap,this.Body,f,this.Meta);
  },
  Render:function(f)
  {
   return Builder.New(this.DefaultPage,this.Wrap,this.Unwrap,f,this.Description,this.Meta);
  },
  Keywords:function(k)
  {
   var i;
   return Builder.New(this.DefaultPage,this.Wrap,this.Unwrap,this.Body,this.Description,(i=this.Meta,Meta.New(i.FileName,k,i.Title)));
  },
  FileName:function(n)
  {
   var i;
   return Builder.New(this.DefaultPage,this.Wrap,this.Unwrap,this.Body,this.Description,(i=this.Meta,Meta.New(n,i.Keywords,i.Title)));
  },
  Id:function(id)
  {
   var i;
   return Builder.New(this.DefaultPage,this.Wrap,this.Unwrap,this.Body,this.Description,(i=this.Meta,Meta.New(i.FileName,i.Keywords,id)));
  }
 },null,Builder);
 Builder.New=function(DefaultPage,Wrap,Unwrap,Body,Description,Meta$1)
 {
  return new Builder({
   DefaultPage:DefaultPage,
   Wrap:Wrap,
   Unwrap:Unwrap,
   Body:Body,
   Description:Description,
   Meta:Meta$1
  });
 };
 Person.New=function(FirstName,LastName)
 {
  return{
   FirstName:FirstName,
   LastName:LastName
  };
 };
 Person$1.Create=function(n,a)
 {
  return Person$1.New(n,a);
 };
 Person$1.New=function(Name,Age)
 {
  return{
   Name:Name,
   Age:Age
  };
 };
 Calculator$1.New=function(Memory,Operand,Operation)
 {
  return{
   Memory:Memory,
   Operand:Operand,
   Operation:Operation
  };
 };
 Op.Add={
  $:0
 };
 Op.Sub={
  $:1
 };
 Op.Mul={
  $:2
 };
 Op.Div={
  $:3
 };
 Flow.Define=function(f)
 {
  return new Flow.New(function(x)
  {
   return f(function(a)
   {
    x(a);
   });
  });
 };
 Flow.get_Do=function()
 {
  return new FlowBuilder.New();
 };
 Flow.Static=function(doc)
 {
  return new Flow.New$1(function(_var)
  {
   return function(cont)
   {
    Var.Set(_var,doc);
    return cont();
   };
  });
 };
 Flow.Embed=function(fl)
 {
  var _var;
  _var=Var.Create$1(Doc.Empty());
  ((fl.get_Render())(_var))(Global.ignore);
  return Doc.EmbedView(_var.get_View());
 };
 Flow.Bind=function(m,k)
 {
  return new Flow.New$1(function(_var)
  {
   return function(cont)
   {
    return((m.get_Render())(_var))(function(r)
    {
     ((k(r).get_Render())(_var))(cont);
    });
   };
  });
 };
 Person$2.New=function(Name,Address)
 {
  return{
   Name:Name,
   Address:Address
  };
 };
 ContactType.EmailTy={
  $:0
 };
 ContactType.PhoneTy={
  $:1
 };
 Interpolation.get_Double=function()
 {
  return DoubleInterpolation.DoubleInterpolation;
 };
 Easing=UI.Easing=Runtime$1.Class({
  TransformTime:function(t)
  {
   return this.transformTime(t);
  }
 },Obj,Easing);
 Easing.get_CubicInOut=function()
 {
  return Easings.CubicInOut();
 };
 Easing.Custom=function(f)
 {
  return new Easing.New(f);
 };
 Easing.New=Runtime$1.Ctor(function(transformTime)
 {
  this.transformTime=transformTime;
 },Easing);
 An.Simple=function(inter,easing,dur,x,y)
 {
  return{
   Compute:function(t)
   {
    return inter.Interpolate(easing.TransformTime(t/dur),x,y);
   },
   Duration:dur
  };
 };
 An.Const=function(v)
 {
  return Anims.Const(v);
 };
 An.get_UseAnimations=function()
 {
  return Anims.UseAnimations();
 };
 An.Delayed=function(inter,easing,dur,delay,x,y)
 {
  return{
   Compute:function(t)
   {
    return t<=delay?x:inter.Interpolate(easing.TransformTime((t-delay)/dur),x,y);
   },
   Duration:dur+delay
  };
 };
 An.Play=function(anim)
 {
  var b;
  b=null;
  return Concurrency.Delay(function()
  {
   return Concurrency.Bind(An.Run(Global.ignore,Anims.Actions(anim)),function()
   {
    Anims.Finalize(anim);
    return Concurrency.Return(null);
   });
  });
 };
 An.Append=function(a,a$1)
 {
  return{
   $:0,
   $0:AppendList.Append(a.$0,a$1.$0)
  };
 };
 An.Concat=function(xs)
 {
  return{
   $:0,
   $0:AppendList.Concat(Seq.map(Anims.List,xs))
  };
 };
 An.Run=function(k,anim)
 {
  var dur;
  function a(ok)
  {
   function loop(start,now)
   {
    var t;
    t=now-start;
    anim.Compute(t);
    k();
    return t<=dur?void Global.requestAnimationFrame(function(t$1)
    {
     loop(start,t$1);
    }):ok();
   }
   Global.requestAnimationFrame(function(t)
   {
    loop(t,t);
   });
  }
  dur=anim.Duration;
  return dur===0?Concurrency.Zero():Concurrency.FromContinuations(function($1,$2,$3)
  {
   return a.apply(null,[$1,$2,$3]);
  });
 };
 An.Map=function(f,anim)
 {
  var f$1;
  return Anims.Def(anim.Duration,(f$1=anim.Compute,function(x)
  {
   return f(f$1(x));
  }));
 };
 An.Pack=function(anim)
 {
  return{
   $:0,
   $0:AppendList.Single({
    $:1,
    $0:anim
   })
  };
 };
 An.get_Empty=function()
 {
  return{
   $:0,
   $0:AppendList.Empty()
  };
 };
 An.WhenDone=function(f,main)
 {
  return An.Append({
   $:0,
   $0:AppendList.Single({
    $:0,
    $0:f
   })
  },main);
 };
 Trans.Create=function(ch)
 {
  return new Trans.New$1(ch);
 };
 Trans.Enter=function(f,tr)
 {
  return tr.Copy(null,{
   $:1,
   $0:f
  },null,{
   $:1,
   $0:tr.get_TFlags()|2
  });
 };
 Trans.Exit=function(f,tr)
 {
  return tr.Copy(null,null,{
   $:1,
   $0:f
  },{
   $:1,
   $0:tr.get_TFlags()|4
  });
 };
 Trans.CanAnimateEnter=function(tr)
 {
  var c,flag;
  c=tr.get_TFlags();
  flag=2;
  return(c&flag)===flag;
 };
 Trans.CanAnimateExit=function(tr)
 {
  var c,flag;
  c=tr.get_TFlags();
  flag=4;
  return(c&flag)===flag;
 };
 Trans.AnimateChange=function(tr,x,y)
 {
  return tr.TChange(x,y);
 };
 Trans.AnimateEnter=function(tr,x)
 {
  return(tr.get_TEnter())(x);
 };
 Trans.AnimateExit=function(tr,x)
 {
  return(tr.get_TExit())(x);
 };
 Person$3.New=function(Name,Address)
 {
  return{
   Name:Name,
   Address:Address
  };
 };
 ContactType$1.EmailTy={
  $:0
 };
 ContactType$1.PhoneTy={
  $:1
 };
 Map.TryFind=function(k,m)
 {
  return m.TryFind(k);
 };
 Map.OfArray=function(a)
 {
  return new FSharpMap.New$1(BalancedTree.OfSeq(Seq.map(function($1)
  {
   return Pair.New($1[0],$1[1]);
  },a)));
 };
 Map.FoldBack=function(f,m,s)
 {
  return Seq.fold(function(s$1,kv)
  {
   return f(kv.Key,kv.Value,s$1);
  },s,BalancedTree.Enumerate(true,m.get_Tree()));
 };
 Map.ToSeq=function(m)
 {
  return Seq.map(function(kv)
  {
   return[kv.Key,kv.Value];
  },BalancedTree.Enumerate(false,m.get_Tree()));
 };
 Page.BobsleighHome={
  $:0
 };
 Page.BobsleighHistory={
  $:1
 };
 Page.BobsleighGovernance={
  $:2
 };
 Page.BobsleighTeam={
  $:3
 };
 Keyboard.get_KeysPressed=function()
 {
  Input.ActivateKeyListener();
  return Input.KeyListenerState().KeysPressed.get_View();
 };
 Keyboard.get_LastPressed=function()
 {
  Input.ActivateKeyListener();
  return Input.KeyListenerState().LastPressed.get_View();
 };
 Keyboard.IsPressed=function(key)
 {
  function p(x)
  {
   return x===key;
  }
  Input.ActivateKeyListener();
  return View.Map(function(l)
  {
   return List.exists(p,l);
  },Input.KeyListenerState().KeysPressed.get_View());
 };
 Seq.tryFindIndex=function(ok,s)
 {
  var e,loop,i;
  e=Enumerator.Get(s);
  try
  {
   loop=true;
   i=0;
   while(loop&&e.MoveNext())
    if(ok(e.Current()))
     loop=false;
    else
     i=i+1;
   return loop?null:{
    $:1,
    $0:i
   };
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.iteri=function(p,s)
 {
  var i,e;
  i=0;
  e=Enumerator.Get(s);
  try
  {
   while(e.MoveNext())
    {
     p(i,e.Current());
     i=i+1;
    }
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.indexed=function(s)
 {
  return Seq.mapi(function($1,$2)
  {
   return[$1,$2];
  },s);
 };
 Seq.map=function(f,s)
 {
  return{
   GetEnumerator:function()
   {
    var en;
    en=Enumerator.Get(s);
    return new T$1.New(null,null,function(e)
    {
     return en.MoveNext()&&(e.c=f(en.Current()),true);
    },function()
    {
     en.Dispose();
    });
   }
  };
 };
 Seq.collect=function(f,s)
 {
  return Seq.concat(Seq.map(f,s));
 };
 Seq.append=function(s1,s2)
 {
  return{
   GetEnumerator:function()
   {
    var e1,first;
    e1=Enumerator.Get(s1);
    first=[true];
    return new T$1.New(e1,null,function(x)
    {
     var x$1;
     return x.s.MoveNext()?(x.c=x.s.Current(),true):(x$1=x.s,!Unchecked.Equals(x$1,null)?x$1.Dispose():void 0,x.s=null,first[0]&&(first[0]=false,x.s=Enumerator.Get(s2),x.s.MoveNext()?(x.c=x.s.Current(),true):(x.s.Dispose(),x.s=null,false)));
    },function(x)
    {
     var x$1;
     x$1=x.s;
     !Unchecked.Equals(x$1,null)?x$1.Dispose():void 0;
    });
   }
  };
 };
 Seq.tryPick=function(f,s)
 {
  var e,r;
  e=Enumerator.Get(s);
  try
  {
   r=null;
   while(Unchecked.Equals(r,null)&&e.MoveNext())
    r=f(e.Current());
   return r;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.mapi=function(f,s)
 {
  return Seq.map2(f,Seq.initInfinite(Global.id),s);
 };
 Seq.concat=function(ss)
 {
  return{
   GetEnumerator:function()
   {
    var outerE;
    outerE=Enumerator.Get(ss);
    return new T$1.New(null,null,function(st)
    {
     var m;
     while(true)
      {
       m=st.s;
       if(Unchecked.Equals(m,null))
       {
        if(outerE.MoveNext())
         {
          st.s=Enumerator.Get(outerE.Current());
          st=st;
         }
        else
         {
          outerE.Dispose();
          return false;
         }
       }
       else
        if(m.MoveNext())
         {
          st.c=m.Current();
          return true;
         }
        else
         {
          st.Dispose();
          st.s=null;
          st=st;
         }
      }
    },function(st)
    {
     var x;
     x=st.s;
     !Unchecked.Equals(x,null)?x.Dispose():void 0;
     !Unchecked.Equals(outerE,null)?outerE.Dispose():void 0;
    });
   }
  };
 };
 Seq.fold=function(f,x,s)
 {
  var r,e;
  r=x;
  e=Enumerator.Get(s);
  try
  {
   while(e.MoveNext())
    r=f(r,e.Current());
   return r;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.map2=function(f,s1,s2)
 {
  return{
   GetEnumerator:function()
   {
    var e1,e2;
    e1=Enumerator.Get(s1);
    e2=Enumerator.Get(s2);
    return new T$1.New(null,null,function(e)
    {
     return e1.MoveNext()&&e2.MoveNext()&&(e.c=f(e1.Current(),e2.Current()),true);
    },function()
    {
     e1.Dispose();
     e2.Dispose();
    });
   }
  };
 };
 Seq.initInfinite=function(f)
 {
  return{
   GetEnumerator:function()
   {
    return new T$1.New(0,null,function(e)
    {
     e.c=f(e.s);
     e.s=e.s+1;
     return true;
    },void 0);
   }
  };
 };
 Seq.filter=function(f,s)
 {
  return{
   GetEnumerator:function()
   {
    var o;
    o=Enumerator.Get(s);
    return new T$1.New(null,null,function(e)
    {
     var loop,c,res;
     loop=o.MoveNext();
     c=o.Current();
     res=false;
     while(loop)
      if(f(c))
       {
        e.c=c;
        res=true;
        loop=false;
       }
      else
       if(o.MoveNext())
        c=o.Current();
       else
        loop=false;
     return res;
    },function()
    {
     o.Dispose();
    });
   }
  };
 };
 Seq.delay=function(f)
 {
  return{
   GetEnumerator:function()
   {
    return Enumerator.Get(f());
   }
  };
 };
 Seq.distinctBy=function(f,s)
 {
  return{
   GetEnumerator:function()
   {
    var o,seen;
    o=Enumerator.Get(s);
    seen=new HashSet.New$3();
    return new T$1.New(null,null,function(e)
    {
     var cur,has;
     if(o.MoveNext())
      {
       cur=o.Current();
       has=seen.Add(f(cur));
       while(!has&&o.MoveNext())
        {
         cur=o.Current();
         has=seen.Add(f(cur));
        }
       return has&&(e.c=cur,true);
      }
     else
      return false;
    },function()
    {
     o.Dispose();
    });
   }
  };
 };
 Seq.forall2=function(p,s1,s2)
 {
  return!Seq.exists2(function($1,$2)
  {
   return!p($1,$2);
  },s1,s2);
 };
 Seq.exists2=function(p,s1,s2)
 {
  var e1,$1,e2,r;
  e1=Enumerator.Get(s1);
  try
  {
   e2=Enumerator.Get(s2);
   try
   {
    r=false;
    while(!r&&e1.MoveNext()&&e2.MoveNext())
     r=p(e1.Current(),e2.Current());
    $1=r;
   }
   finally
   {
    if("Dispose"in e2)
     e2.Dispose();
   }
   return $1;
  }
  finally
  {
   if("Dispose"in e1)
    e1.Dispose();
  }
 };
 Seq.findIndex=function(p,s)
 {
  var m;
  m=Seq.tryFindIndex(p,s);
  return m==null?Operators.FailWith("KeyNotFoundException"):m.$0;
 };
 Seq.compareWith=function(f,s1,s2)
 {
  var e1,$1,e2,r,loop;
  e1=Enumerator.Get(s1);
  try
  {
   e2=Enumerator.Get(s2);
   try
   {
    r=0;
    loop=true;
    while(loop&&r===0)
     if(e1.MoveNext())
      r=e2.MoveNext()?f(e1.Current(),e2.Current()):1;
     else
      if(e2.MoveNext())
       r=-1;
      else
       loop=false;
    $1=r;
   }
   finally
   {
    if("Dispose"in e2)
     e2.Dispose();
   }
   return $1;
  }
  finally
  {
   if("Dispose"in e1)
    e1.Dispose();
  }
 };
 Seq.distinct=function(s)
 {
  return Seq.distinctBy(Global.id,s);
 };
 Seq.iter=function(p,s)
 {
  var e;
  e=Enumerator.Get(s);
  try
  {
   while(e.MoveNext())
    p(e.Current());
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.nth=function(index,s)
 {
  var pos,e;
  if(index<0)
   Operators.FailWith("negative index requested");
  pos=-1;
  e=Enumerator.Get(s);
  try
  {
   while(pos<index)
    {
     !e.MoveNext()?Seq.insufficient():void 0;
     pos=pos+1;
    }
   return e.Current();
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.unfold=function(f,s)
 {
  return{
   GetEnumerator:function()
   {
    return new T$1.New(s,null,function(e)
    {
     var m;
     m=f(e.s);
     return m==null?false:(e.c=m.$0[0],e.s=m.$0[1],true);
    },void 0);
   }
  };
 };
 Seq.max=function(s)
 {
  var e,m,x;
  e=Enumerator.Get(s);
  try
  {
   if(!e.MoveNext())
    Seq.seqEmpty();
   m=e.Current();
   while(e.MoveNext())
    {
     x=e.Current();
     Unchecked.Compare(x,m)===1?m=x:void 0;
    }
   return m;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.seqEmpty=function()
 {
  return Operators.FailWith("The input sequence was empty.");
 };
 Seq.forall=function(p,s)
 {
  return!Seq.exists(function(x)
  {
   return!p(x);
  },s);
 };
 Seq.exists=function(p,s)
 {
  var e,r;
  e=Enumerator.Get(s);
  try
  {
   r=false;
   while(!r&&e.MoveNext())
    r=p(e.Current());
   return r;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Arrays.init=function(size,f)
 {
  var r,i,$1;
  size<0?Operators.FailWith("Negative size given."):null;
  r=new Global.Array(size);
  for(i=0,$1=size-1;i<=$1;i++)r[i]=f(i);
  return r;
 };
 Arrays.ofList=function(xs)
 {
  var l,q;
  q=[];
  l=xs;
  while(!(l.$==0))
   {
    q.push(List.head(l));
    l=List.tail(l);
   }
  return q;
 };
 Arrays.map2=function(f,arr1,arr2)
 {
  var r,i,$1;
  Arrays.checkLength(arr1,arr2);
  r=new Global.Array(arr2.length);
  for(i=0,$1=arr2.length-1;i<=$1;i++)r[i]=f(arr1[i],arr2[i]);
  return r;
 };
 Arrays.forall=function(f,x)
 {
  var a,i,$1,l;
  a=true;
  i=0;
  l=Arrays.length(x);
  while(a&&i<l)
   if(f(x[i]))
    i=i+1;
   else
    a=false;
  return a;
 };
 Arrays.checkLength=function(arr1,arr2)
 {
  if(arr1.length!==arr2.length)
   Operators.FailWith("The arrays have different lengths.");
 };
 Arrays.choose=function(f,arr)
 {
  var q,i,$1,m;
  q=[];
  for(i=0,$1=arr.length-1;i<=$1;i++){
   m=f(arr[i]);
   m==null?void 0:q.push(m.$0);
  }
  return q;
 };
 Arrays.map=function(f,arr)
 {
  var r,i,$1;
  r=new Global.Array(arr.length);
  for(i=0,$1=arr.length-1;i<=$1;i++)r[i]=f(arr[i]);
  return r;
 };
 Arrays.max=function(arr)
 {
  var m,i,$1,x;
  Arrays.nonEmpty(arr);
  m=arr[0];
  for(i=1,$1=arr.length-1;i<=$1;i++){
   x=arr[i];
   Unchecked.Compare(x,m)===1?m=x:void 0;
  }
  return m;
 };
 Arrays.mapi=function(f,arr)
 {
  var y,i,$1;
  y=new Global.Array(arr.length);
  for(i=0,$1=arr.length-1;i<=$1;i++)y[i]=f(i,arr[i]);
  return y;
 };
 Arrays.sortInPlaceWith=function(comparer,arr)
 {
  arr.sort(comparer);
 };
 Arrays.sortInPlace=function(arr)
 {
  Arrays.mapInPlace(function(t)
  {
   return t[0];
  },Arrays.mapiInPlace(function($1,$2)
  {
   return[$2,$1];
  },arr).sort(Unchecked.Compare));
 };
 Arrays.sortBy=function(f,arr)
 {
  return Arrays.map(function(t)
  {
   return t[0];
  },Arrays.mapi(function($1,$2)
  {
   return[$2,[f($2),$1]];
  },arr).sort(function($1,$2)
  {
   return Unchecked.Compare($1[1],$2[1]);
  }));
 };
 Arrays.nonEmpty=function(arr)
 {
  if(arr.length===0)
   Operators.FailWith("The input array was empty.");
 };
 Arrays.ofSeq=function(xs)
 {
  var q,o;
  if(xs instanceof Global.Array)
   return xs.slice();
  else
   if(xs instanceof T)
    return Arrays.ofList(xs);
   else
    {
     q=[];
     o=Enumerator.Get(xs);
     try
     {
      while(o.MoveNext())
       q.push(o.Current());
      return q;
     }
     finally
     {
      if("Dispose"in o)
       o.Dispose();
     }
    }
 };
 Arrays.exists=function(f,x)
 {
  var e,i,$1,l;
  e=false;
  i=0;
  l=Arrays.length(x);
  while(!e&&i<l)
   if(f(x[i]))
    e=true;
   else
    i=i+1;
  return e;
 };
 Arrays.filter=function(f,arr)
 {
  var r,i,$1;
  r=[];
  for(i=0,$1=arr.length-1;i<=$1;i++)if(f(arr[i]))
   r.push(arr[i]);
  return r;
 };
 Arrays.foldBack=function(f,arr,zero)
 {
  var acc,$1,len,i,$2;
  acc=zero;
  len=arr.length;
  for(i=1,$2=len;i<=$2;i++)acc=f(arr[len-i],acc);
  return acc;
 };
 Arrays.tryFindIndex=function(f,arr)
 {
  var res,i;
  res=null;
  i=0;
  while(i<arr.length&&res==null)
   {
    f(arr[i])?res={
     $:1,
     $0:i
    }:void 0;
    i=i+1;
   }
  return res;
 };
 Arrays.findIndex=function(f,arr)
 {
  var m;
  m=Arrays.tryFindIndex(f,arr);
  return m==null?Operators.FailWith("KeyNotFoundException"):m.$0;
 };
 Arrays.pick=function(f,arr)
 {
  var m;
  m=Arrays.tryPick(f,arr);
  return m==null?Operators.FailWith("KeyNotFoundException"):m.$0;
 };
 Arrays.iter=function(f,arr)
 {
  var i,$1;
  for(i=0,$1=arr.length-1;i<=$1;i++)f(arr[i]);
 };
 Arrays.tryPick=function(f,arr)
 {
  var res,i,m;
  res=null;
  i=0;
  while(i<arr.length&&res==null)
   {
    m=f(arr[i]);
    m!=null&&m.$==1?res=m:void 0;
    i=i+1;
   }
  return res;
 };
 Arrays.concat=function(xs)
 {
  return Global.Array.prototype.concat.apply([],Arrays.ofSeq(xs));
 };
 Arrays.create=function(size,value)
 {
  var r,i,$1;
  r=new Global.Array(size);
  for(i=0,$1=size-1;i<=$1;i++)r[i]=value;
  return r;
 };
 JSModule.GetFieldValues=function(o)
 {
  var r,k;
  r=[];
  for(var k$1 in o)r.push(o[k$1]);
  return r;
 };
 Router$1.New$1=function(Parse,Write)
 {
  return{
   Parse:Parse,
   Write:Write
  };
 };
 List$1.startsWith=function(s,l)
 {
  var $1;
  switch(s.$==1?l.$==1?Unchecked.Equals(s.$0,l.$0)?($1=[l.$0,l.$1,s.$0,s.$1],1):2:2:0)
  {
   case 0:
    return{
     $:1,
     $0:l
    };
    break;
   case 1:
    return List$1.startsWith($1[3],$1[1]);
    break;
   case 2:
    return null;
    break;
  }
 };
 Utils.toSafe=function(s)
 {
  return s==null?"":s;
 };
 ConcreteVar=UI.ConcreteVar=Runtime$1.Class({
  get_View:function()
  {
   return this.view;
  },
  Set:function(v)
  {
   if(this.isConst)
    (function($1)
    {
     return $1("WebSharper.UI: invalid attempt to change value of a Var after calling SetFinal");
    }(function(s)
    {
     console.log(s);
    }));
   else
    {
     Snap.Obsolete(this.snap);
     this.current=v;
     this.snap=Snap.New({
      $:2,
      $0:v,
      $1:[]
     });
    }
  },
  Get:function()
  {
   return this.current;
  },
  Update:function(f)
  {
   this.Set(f(this.Get()));
  },
  UpdateMaybe:function(f)
  {
   var m;
   m=f(this.Get());
   m!=null&&m.$==1?this.Set(m.$0):void 0;
  },
  get_Id:function()
  {
   return"uinref"+String$1(this.id);
  }
 },Var,ConcreteVar);
 ConcreteVar.New=Runtime$1.Ctor(function(isConst,initSnap,initValue)
 {
  var $this;
  $this=this;
  Var.New.call(this);
  this.isConst=isConst;
  this.current=initValue;
  this.snap=initSnap;
  this.view=function()
  {
   return $this.snap;
  };
  this.id=Fresh.Int();
 },ConcreteVar);
 Snap.Map=function(fn,sn)
 {
  var m,res;
  m=sn.s;
  return m!=null&&m.$==0?Snap.New({
   $:0,
   $0:fn(m.$0)
  }):(res=Snap.New({
   $:3,
   $0:[],
   $1:[]
  }),(Snap.When(sn,function(a)
  {
   Snap.MarkDone(res,sn,fn(a));
  },res),res));
 };
 Snap.Map2=function(fn,sn1,sn2)
 {
  var $1,$2,res;
  function cont(a)
  {
   var m,$3,$4;
   if(!(m=res.s,m!=null&&m.$==0||m!=null&&m.$==2))
    {
     $3=Snap.ValueAndForever(sn1);
     $4=Snap.ValueAndForever(sn2);
     $3!=null&&$3.$==1?$4!=null&&$4.$==1?$3.$0[1]&&$4.$0[1]?Snap.MarkForever(res,fn($3.$0[0],$4.$0[0])):Snap.MarkReady(res,fn($3.$0[0],$4.$0[0])):void 0:void 0;
    }
  }
  $1=sn1.s;
  $2=sn2.s;
  return $1!=null&&$1.$==0?$2!=null&&$2.$==0?Snap.New({
   $:0,
   $0:fn($1.$0,$2.$0)
  }):Snap.Map2Opt1(fn,$1.$0,sn2):$2!=null&&$2.$==0?Snap.Map2Opt2(fn,$2.$0,sn1):(res=Snap.New({
   $:3,
   $0:[],
   $1:[]
  }),(Snap.When(sn1,cont,res),Snap.When(sn2,cont,res),res));
 };
 Snap.WhenRun=function(snap,avail,obs)
 {
  var m;
  m=snap.s;
  m==null?obs():m!=null&&m.$==2?(m.$1.push(obs),avail(m.$0)):m!=null&&m.$==3?(m.$0.push(avail),m.$1.push(obs)):avail(m.$0);
 };
 Snap.WhenObsoleteRun=function(snap,obs)
 {
  var m;
  m=snap.s;
  m==null?obs():m!=null&&m.$==2?m.$1.push(obs):m!=null&&m.$==3?m.$1.push(obs):void 0;
 };
 Snap.When=function(snap,avail,obs)
 {
  var m;
  m=snap.s;
  m==null?Snap.Obsolete(obs):m!=null&&m.$==2?(Snap.EnqueueSafe(m.$1,obs),avail(m.$0)):m!=null&&m.$==3?(m.$0.push(avail),Snap.EnqueueSafe(m.$1,obs)):avail(m.$0);
 };
 Snap.MarkDone=function(res,sn,v)
 {
  var $1;
  if($1=sn.s,$1!=null&&$1.$==0)
   Snap.MarkForever(res,v);
  else
   Snap.MarkReady(res,v);
 };
 Snap.Map2Opt1=function(fn,x,sn2)
 {
  return Snap.Map(function(y)
  {
   return fn(x,y);
  },sn2);
 };
 Snap.Map2Opt2=function(fn,y,sn1)
 {
  return Snap.Map(function(x)
  {
   return fn(x,y);
  },sn1);
 };
 Snap.ValueAndForever=function(snap)
 {
  var m;
  m=snap.s;
  return m!=null&&m.$==0?{
   $:1,
   $0:[m.$0,true]
  }:m!=null&&m.$==2?{
   $:1,
   $0:[m.$0,false]
  }:null;
 };
 Snap.MarkForever=function(sn,v)
 {
  var m,qa,i,$1;
  m=sn.s;
  if(m!=null&&m.$==3)
   {
    sn.s={
     $:0,
     $0:v
    };
    qa=m.$0;
    for(i=0,$1=Arrays.length(qa)-1;i<=$1;i++)(Arrays.get(qa,i))(v);
   }
  else
   void 0;
 };
 Snap.MarkReady=function(sn,v)
 {
  var m,qa,i,$1;
  m=sn.s;
  if(m!=null&&m.$==3)
   {
    sn.s={
     $:2,
     $0:v,
     $1:m.$1
    };
    qa=m.$0;
    for(i=0,$1=Arrays.length(qa)-1;i<=$1;i++)(Arrays.get(qa,i))(v);
   }
  else
   void 0;
 };
 Snap.SnapshotOn=function(sn1,sn2)
 {
  var res;
  function cont(a)
  {
   var m,$1,$2;
   if(!(m=res.s,m!=null&&m.$==0||m!=null&&m.$==2))
    {
     $1=Snap.ValueAndForever(sn1);
     $2=Snap.ValueAndForever(sn2);
     $1!=null&&$1.$==1?$2!=null&&$2.$==1?$1.$0[1]||$2.$0[1]?Snap.MarkForever(res,$2.$0[0]):Snap.MarkReady(res,$2.$0[0]):void 0:void 0;
    }
  }
  res=Snap.New({
   $:3,
   $0:[],
   $1:[]
  });
  Snap.When(sn1,cont,res);
  Snap.WhenReady(sn2,cont);
  return res;
 };
 Snap.WhenObsolete=function(snap,obs)
 {
  var m;
  m=snap.s;
  m==null?Snap.Obsolete(obs):m!=null&&m.$==2?Snap.EnqueueSafe(m.$1,obs):m!=null&&m.$==3?Snap.EnqueueSafe(m.$1,obs):void 0;
 };
 Snap.MapAsync=function(fn,snap)
 {
  var res;
  res=Snap.New({
   $:3,
   $0:[],
   $1:[]
  });
  Snap.When(snap,function(v)
  {
   Async.StartTo(fn(v),function(v$1)
   {
    Snap.MarkDone(res,snap,v$1);
   });
  },res);
  return res;
 };
 Snap.EnqueueSafe=function(q,x)
 {
  var qcopy,i,$1,o;
  q.push(x);
  if(q.length%20===0)
   {
    qcopy=q.slice(0);
    Queue.Clear(q);
    for(i=0,$1=Arrays.length(qcopy)-1;i<=$1;i++){
     o=Arrays.get(qcopy,i);
     typeof o=="object"?function(sn)
     {
      if(sn.s)
       q.push(sn);
     }(o):function(f)
     {
      q.push(f);
     }(o);
    }
   }
  else
   void 0;
 };
 Snap.WhenReady=function(snap,avail)
 {
  var $1,m;
  m=snap.s;
  switch(m!=null&&m.$==2?($1=m.$0,0):m==null?1:m!=null&&m.$==3?2:($1=m.$0,0))
  {
   case 0:
    avail($1);
    break;
   case 1:
    null;
    break;
   case 2:
    m.$0.push(avail);
    break;
  }
 };
 Snap.Map2Unit=function(sn1,sn2)
 {
  var $1,$2,res;
  function cont()
  {
   var m,$3,$4;
   if(!(m=res.s,m!=null&&m.$==0||m!=null&&m.$==2))
    {
     $3=Snap.ValueAndForever(sn1);
     $4=Snap.ValueAndForever(sn2);
     $3!=null&&$3.$==1?$4!=null&&$4.$==1?$3.$0[1]&&$4.$0[1]?Snap.MarkForever(res,null):Snap.MarkReady(res,null):void 0:void 0;
    }
  }
  $1=sn1.s;
  $2=sn2.s;
  return $1!=null&&$1.$==0?$2!=null&&$2.$==0?Snap.New({
   $:0,
   $0:null
  }):sn2:$2!=null&&$2.$==0?sn1:(res=Snap.New({
   $:3,
   $0:[],
   $1:[]
  }),(Snap.When(sn1,cont,res),Snap.When(sn2,cont,res),res));
 };
 Snap.Join=function(snap)
 {
  var res;
  res=Snap.New({
   $:3,
   $0:[],
   $1:[]
  });
  Snap.When(snap,function(x)
  {
   var y;
   y=x();
   Snap.When(y,function(v)
   {
    var $1,$2;
    if(($1=y.s,$1!=null&&$1.$==0)&&($2=snap.s,$2!=null&&$2.$==0))
     Snap.MarkForever(res,v);
    else
     Snap.MarkReady(res,v);
   },res);
  },res);
  return res;
 };
 Snap.JoinInner=function(snap)
 {
  var res;
  res=Snap.New({
   $:3,
   $0:[],
   $1:[]
  });
  Snap.When(snap,function(x)
  {
   var y;
   y=x();
   Snap.When(y,function(v)
   {
    var $1,$2;
    if(($1=y.s,$1!=null&&$1.$==0)&&($2=snap.s,$2!=null&&$2.$==0))
     Snap.MarkForever(res,v);
    else
     Snap.MarkReady(res,v);
   },res);
   Snap.WhenObsolete(snap,y);
  },res);
  return res;
 };
 Snap.Copy=function(sn)
 {
  var m,res,res$1;
  m=sn.s;
  return m==null?sn:m!=null&&m.$==2?(res=Snap.New({
   $:2,
   $0:m.$0,
   $1:[]
  }),(Snap.WhenObsolete(sn,res),res)):m!=null&&m.$==3?(res$1=Snap.New({
   $:3,
   $0:[],
   $1:[]
  }),(Snap.When(sn,function(v)
  {
   Snap.MarkDone(res$1,sn,v);
  },res$1),res$1)):sn;
 };
 Snap.Map3=function(fn,sn1,sn2,sn3)
 {
  var $1,$2,$3,res;
  function cont(a)
  {
   var m,$4,$5,$6;
   if(!(m=res.s,m!=null&&m.$==0||m!=null&&m.$==2))
    {
     $4=Snap.ValueAndForever(sn1);
     $5=Snap.ValueAndForever(sn2);
     $6=Snap.ValueAndForever(sn3);
     $4!=null&&$4.$==1?$5!=null&&$5.$==1?$6!=null&&$6.$==1?$4.$0[1]&&$5.$0[1]&&$6.$0[1]?Snap.MarkForever(res,fn($4.$0[0],$5.$0[0],$6.$0[0])):Snap.MarkReady(res,fn($4.$0[0],$5.$0[0],$6.$0[0])):void 0:void 0:void 0;
    }
  }
  $1=sn1.s;
  $2=sn2.s;
  $3=sn3.s;
  return $1!=null&&$1.$==0?$2!=null&&$2.$==0?$3!=null&&$3.$==0?Snap.New({
   $:0,
   $0:fn($1.$0,$2.$0,$3.$0)
  }):Snap.Map3Opt1(fn,$1.$0,$2.$0,sn3):$3!=null&&$3.$==0?Snap.Map3Opt2(fn,$1.$0,$3.$0,sn2):Snap.Map3Opt3(fn,$1.$0,sn2,sn3):$2!=null&&$2.$==0?$3!=null&&$3.$==0?Snap.Map3Opt4(fn,$2.$0,$3.$0,sn1):Snap.Map3Opt5(fn,$2.$0,sn1,sn3):$3!=null&&$3.$==0?Snap.Map3Opt6(fn,$3.$0,sn1,sn2):(res=Snap.New({
   $:3,
   $0:[],
   $1:[]
  }),(Snap.When(sn1,cont,res),Snap.When(sn2,cont,res),Snap.When(sn3,cont,res),res));
 };
 Snap.Sequence=function(snaps)
 {
  var snaps$1,res,w;
  function cont(a)
  {
   var vs;
   if(w[0]===0)
    {
     vs=Arrays.map(function(s)
     {
      var m;
      m=s.s;
      return m!=null&&m.$==0?m.$0:m!=null&&m.$==2?m.$0:Operators.FailWith("value not found by View.Sequence");
     },snaps$1);
     Arrays.forall(function(a$1)
     {
      var $1;
      $1=a$1.s;
      return $1!=null&&$1.$==0;
     },snaps$1)?Snap.MarkForever(res,vs):Snap.MarkReady(res,vs);
    }
   else
    w[0]--;
  }
  snaps$1=Arrays.ofSeq(snaps);
  return snaps$1.length==0?Snap.New({
   $:0,
   $0:[]
  }):(res=Snap.New({
   $:3,
   $0:[],
   $1:[]
  }),(w=[Arrays.length(snaps$1)-1],(Arrays.iter(function(s)
  {
   Snap.When(s,cont,res);
  },snaps$1),res)));
 };
 Snap.Map3Opt1=function(fn,x,y,sn3)
 {
  return Snap.Map(function(z)
  {
   return fn(x,y,z);
  },sn3);
 };
 Snap.Map3Opt2=function(fn,x,z,sn2)
 {
  return Snap.Map(function(y)
  {
   return fn(x,y,z);
  },sn2);
 };
 Snap.Map3Opt3=function(fn,x,sn2,sn3)
 {
  return Snap.Map2(function($1,$2)
  {
   return fn(x,$1,$2);
  },sn2,sn3);
 };
 Snap.Map3Opt4=function(fn,y,z,sn1)
 {
  return Snap.Map(function(x)
  {
   return fn(x,y,z);
  },sn1);
 };
 Snap.Map3Opt5=function(fn,y,sn1,sn3)
 {
  return Snap.Map2(function($1,$2)
  {
   return fn($1,y,$2);
  },sn1,sn3);
 };
 Snap.Map3Opt6=function(fn,z,sn1,sn2)
 {
  return Snap.Map2(function($1,$2)
  {
   return fn($1,$2,z);
  },sn1,sn2);
 };
 AttrModule.Class=function(name)
 {
  return AttrModule.ClassPred(name,true);
 };
 AttrModule.Style=function(name,value)
 {
  return Attrs.Static(function(el)
  {
   DomUtility.SetStyle(el,name,value);
  });
 };
 AttrModule.AnimatedStyle=function(name,tr,view,attr$1)
 {
  return Attrs.Animated(tr,view,function(el)
  {
   return function(v)
   {
    return DomUtility.SetStyle(el,name,attr$1(v));
   };
  });
 };
 AttrModule.ClassPred=function(name,isSet)
 {
  return Attrs.Static(function(el)
  {
   if(isSet)
    DomUtility.AddClass(el,name);
   else
    DomUtility.RemoveClass(el,name);
  });
 };
 AttrModule.Value=function(_var)
 {
  function g(a)
  {
   return{
    $:1,
    $0:a
   };
  }
  return AttrModule.CustomValue(_var,Global.id,function(x)
  {
   return g(Global.id(x));
  });
 };
 AttrModule.DynamicStyle=function(name,view)
 {
  return Attrs.Dynamic(view,function(el)
  {
   return function(v)
   {
    return DomUtility.SetStyle(el,name,v);
   };
  });
 };
 AttrModule.Animated=function(name,tr,view,attr$1)
 {
  return Attrs.Animated(tr,view,function(el)
  {
   return function(v)
   {
    return DomUtility.SetAttr(el,name,attr$1(v));
   };
  });
 };
 AttrModule.DynamicClassPred=function(name,view)
 {
  return Attrs.Dynamic(view,function(el)
  {
   return function(v)
   {
    return v?DomUtility.AddClass(el,name):DomUtility.RemoveClass(el,name);
   };
  });
 };
 AttrModule.CustomValue=function(_var,toString,fromString)
 {
  return AttrModule.CustomVar(_var,function($1,$2)
  {
   $1.value=toString($2);
  },function(e)
  {
   return fromString(e.value);
  });
 };
 AttrModule.DynamicProp=function(name,view)
 {
  return Attrs.Dynamic(view,function(el)
  {
   return function(v)
   {
    el[name]=v;
   };
  });
 };
 AttrModule.CustomVar=function(_var,set,get)
 {
  function onChange(el,e)
  {
   return _var.UpdateMaybe(function(v)
   {
    var m,$1;
    m=get(el);
    return m!=null&&m.$==1&&(!Unchecked.Equals(m.$0,v)&&($1=[m,m.$0],true))?$1[0]:null;
   });
  }
  function set$1(e,v)
  {
   var m,$1;
   m=get(e);
   return m!=null&&m.$==1&&(Unchecked.Equals(m.$0,v)&&($1=m.$0,true))?null:set(e,v);
  }
  return AttrProxy.Concat([AttrModule.Handler("change",function($1)
  {
   return function($2)
   {
    return onChange($1,$2);
   };
  }),AttrModule.Handler("input",function($1)
  {
   return function($2)
   {
    return onChange($1,$2);
   };
  }),AttrModule.Handler("keypress",function($1)
  {
   return function($2)
   {
    return onChange($1,$2);
   };
  }),AttrModule.DynamicCustom(function($1)
  {
   return function($2)
   {
    return set$1($1,$2);
   };
  },_var.get_View())]);
 };
 AttrModule.Checked=function(_var)
 {
  function onSet(el,ev)
  {
   return!Unchecked.Equals(_var.Get(),el.checked)?_var.Set(el.checked):null;
  }
  return AttrProxy.Concat([AttrModule.DynamicProp("checked",_var.get_View()),AttrModule.Handler("change",function($1)
  {
   return function($2)
   {
    return onSet($1,$2);
   };
  })]);
 };
 AttrModule.DynamicCustom=function(set,view)
 {
  return Attrs.Dynamic(view,set);
 };
 AttrModule.OnAfterRender=function(callback)
 {
  return new AttrProxy({
   $:4,
   $0:callback
  });
 };
 AttrModule.Dynamic=function(name,view)
 {
  return Attrs.Dynamic(view,function(el)
  {
   return function(v)
   {
    return DomUtility.SetAttr(el,name,v);
   };
  });
 };
 AttrModule.Handler=function(name,callback)
 {
  return Attrs.Static(function(el)
  {
   el.addEventListener(name,function(d)
   {
    return(callback(el))(d);
   },false);
  });
 };
 AttrModule.IntValue=function(_var)
 {
  return AttrModule.CustomVar(_var,function($1,$2)
  {
   var i;
   i=$2.get_Input();
   return $1.value!==i?void($1.value=i):null;
  },function(el)
  {
   var s,m,o;
   s=el.value;
   return{
    $:1,
    $0:String.isBlank(s)?(el.checkValidity?el.checkValidity():true)?new CheckedInput({
     $:2,
     $0:s
    }):new CheckedInput({
     $:1,
     $0:s
    }):(m=(o=0,[Numeric.TryParseInt32(s,{
     get:function()
     {
      return o;
     },
     set:function(v)
     {
      o=v;
     }
    }),o]),m[0]?new CheckedInput({
     $:0,
     $0:m[1],
     $1:s
    }):new CheckedInput({
     $:1,
     $0:s
    }))
   };
  });
 };
 AttrModule.IntValueUnchecked=function(_var)
 {
  return AttrModule.CustomValue(_var,String$1,function(s)
  {
   var pd;
   return String.isBlank(s)?{
    $:1,
    $0:0
   }:(pd=+s,pd!==pd>>0?null:{
    $:1,
    $0:pd
   });
  });
 };
 AttrModule.FloatValue=function(_var)
 {
  return AttrModule.CustomVar(_var,function($1,$2)
  {
   var i;
   i=$2.get_Input();
   return $1.value!==i?void($1.value=i):null;
  },function(el)
  {
   var s,i;
   s=el.value;
   return{
    $:1,
    $0:String.isBlank(s)?(el.checkValidity?el.checkValidity():true)?new CheckedInput({
     $:2,
     $0:s
    }):new CheckedInput({
     $:1,
     $0:s
    }):(i=+s,Global.isNaN(i)?new CheckedInput({
     $:1,
     $0:s
    }):new CheckedInput({
     $:0,
     $0:i,
     $1:s
    }))
   };
  });
 };
 AttrModule.FloatValueUnchecked=function(_var)
 {
  return AttrModule.CustomValue(_var,String$1,function(s)
  {
   var pd;
   return String.isBlank(s)?{
    $:1,
    $0:0
   }:(pd=+s,Global.isNaN(pd)?null:{
    $:1,
    $0:pd
   });
  });
 };
 SC$18.$cctor=function()
 {
  SC$18.$cctor=Global.ignore;
  SC$18.SamplesDefault={
   $:2,
   $0:SampleTy.SimpleTextBox
  };
 };
 SC$19.$cctor=function()
 {
  var a,a$1,a$2;
  SC$19.$cctor=Global.ignore;
  SC$19.Entries=List.ofArray([Site.mkEntry("Documentation","Official documentation on WebSharper UI, including the API reference and some discussion about the design decisions we made","files/gear.png",List.ofArray([Utilities.href("Tutorial","https://github.com/intellifactory/websharper.ui.next/blob/master/docs/Tutorial.md"),Utilities.href("API Reference","https://github.com/intellifactory/websharper.ui.next/blob/master/docs/API.md"),Utilities.href("Full Documentation","https://github.com/intellifactory/websharper.ui.next/blob/master/README.md")])),Site.mkEntry("Articles","Articles written about UI, which provide more detailed discussions about various aspects of the library.","files/uinext-screen.png",List.ofArray([Utilities.href("WebSharper UI: An Introduction","http://www.websharper.com/blog-entry/3954"),Utilities.href("WebSharper UI: Declarative Animation","http://www.websharper.com/blog-entry/3964"),Utilities.href("Structuring Applications with WebSharper UI","http://www.websharper.com/blog-entry/3965")])),Site.mkEntry("Presentations","Presentations about UI, providing an overview of the library and deeper insights into the thinking behind it.","files/anton-pres.png",List.ofArray([Utilities.href("Presentation: Tackle UI with Reactive DOM in F# and WebSharper","https://www.youtube.com/watch?v=wEkS09s3KBc")]))]);
  SC$19.NavExternalLinks=List.ofArray([["GitHub","http://www.github.com/IntelliFactory/websharper.ui.next"],["API Reference","https://github.com/intellifactory/websharper.ui.next/blob/master/docs/API.md"]]);
  SC$19.NavPages=List.ofArray([PageTy.Home,PageTy.About,Samples.SamplesDefault()]);
  SC$19.fadeTime=300;
  SC$19.Fade=(a=Interpolation.get_Double(),(a$1=Easing.get_CubicInOut(),(a$2=Site.fadeTime(),Runtime$1.Curried(An.Simple,2,[a,a$1,a$2]))));
  SC$19.FadeTransition=Trans.Exit(function()
  {
   return((Site.Fade())(1))(0);
  },Trans.Enter(function()
  {
   return((Site.Fade())(0))(1);
  },Trans.Create(function($1,$2)
  {
   return((Site.Fade())($1))($2);
  })));
 };
 Meta.New=function(FileName,Keywords,Title)
 {
  return{
   FileName:FileName,
   Keywords:Keywords,
   Title:Title
  };
 };
 SC$20.$cctor=function()
 {
  SC$20.$cctor=Global.ignore;
  SC$20.Width=720;
  SC$20.Height=500;
  SC$20.Spacing=2;
  SC$20.SimpleTransition=Trans.Create(SortableBarChart.SimpleAnimation);
  SC$20.BarTransition=Trans.Enter(function(x)
  {
   return SortableBarChart.SimpleAnimation(0,x);
  },SortableBarChart.SimpleTransition());
  SC$20.LoadData=View.MapAsync(function()
  {
   return SortableBarChart.LoadFromCSV("AlphaFrequency.csv");
  },View.Const());
  SC$20.Sample=Samples.Build(SampleTy.SortableBarChart).Id("SortableBarChart").FileName("SortableBarChart.fs").Keywords(List.ofArray(["animation"])).Render(SortableBarChart.Main).RenderDescription(SortableBarChart.Description).Create();
 };
 DomUtility.Doc=function()
 {
  SC$21.$cctor();
  return SC$21.Doc;
 };
 DomUtility.SetAttr=function(el,name,value)
 {
  el.setAttribute(name,value);
 };
 DomUtility.CreateElement=function(name)
 {
  return DomUtility.Doc().createElement(name);
 };
 DomUtility.SetStyle=function(el,name,value)
 {
  DomUtility.SetProperty(el.style,name,value);
 };
 DomUtility.CreateText=function(s)
 {
  return DomUtility.Doc().createTextNode(s);
 };
 DomUtility.AddClass=function(element,cl)
 {
  $(element).addClass(cl);
 };
 DomUtility.RemoveClass=function(element,cl)
 {
  $(element).removeClass(cl);
 };
 DomUtility.SetProperty=function(target,name,value)
 {
  return target.setProperty(name,value);
 };
 DomUtility.CreateSvgElement=function(name)
 {
  return DomUtility.Doc().createElementNS("http://www.w3.org/2000/svg",name);
 };
 DomUtility.ChildrenArray=function(element)
 {
  var a,i,$1;
  a=[];
  for(i=0,$1=element.childNodes.length-1;i<=$1;i++)a.push(element.childNodes[i]);
  return a;
 };
 DomUtility.InsertAt=function(parent,pos,node)
 {
  var m;
  if(!(node.parentNode===parent&&pos===(m=node.nextSibling,Unchecked.Equals(m,null)?null:m)))
   parent.insertBefore(node,pos);
 };
 DomUtility.IterSelector=function(el,selector,f)
 {
  var l,i,$1;
  l=el.querySelectorAll(selector);
  for(i=0,$1=l.length-1;i<=$1;i++)f(l[i]);
 };
 DomUtility.RemoveNode=function(parent,el)
 {
  if(el.parentNode===parent)
   parent.removeChild(el);
 };
 Attrs.EmptyAttr=function()
 {
  SC$22.$cctor();
  return SC$22.EmptyAttr;
 };
 Attrs.Static=function(attr$1)
 {
  return new AttrProxy({
   $:3,
   $0:attr$1
  });
 };
 Attrs.Animated=function(tr,view,set)
 {
  var node,flags,n;
  node=new AnimatedAttrNode.New(tr,view,set);
  flags=4;
  Trans.CanAnimateEnter(tr)?flags=flags|1:void 0;
  Trans.CanAnimateExit(tr)?flags=flags|2:void 0;
  n=new AttrProxy({
   $:1,
   $0:node
  });
  Attrs.SetFlags(n,flags);
  return n;
 };
 Attrs.AppendTree=function(a,b)
 {
  var x;
  return a===null?b:b===null?a:(x=new AttrProxy({
   $:2,
   $0:a,
   $1:b
  }),(Attrs.SetFlags(x,Attrs.Flags(a)|Attrs.Flags(b)),x));
 };
 Attrs.SetFlags=function(a,f)
 {
  a.flags=f;
 };
 Attrs.Dynamic=function(view,set)
 {
  return new AttrProxy({
   $:1,
   $0:new DynamicAttrNode.New(view,set)
  });
 };
 Attrs.Updates=function(dyn)
 {
  return Array.MapTreeReduce(function(x)
  {
   return x.NChanged();
  },View.Const(),View.Map2Unit,dyn.DynNodes);
 };
 Attrs.Flags=function(a)
 {
  return a!==null&&a.hasOwnProperty("flags")?a.flags:0;
 };
 Attrs.Insert=function(elem,tree)
 {
  var nodes,oar,arr;
  function loop(node)
  {
   if(!(node===null))
    if(node!=null&&node.$==1)
     nodes.push(node.$0);
    else
     if(node!=null&&node.$==2)
      {
       loop(node.$0);
       loop(node.$1);
      }
     else
      if(node!=null&&node.$==3)
       node.$0(elem);
      else
       if(node!=null&&node.$==4)
        oar.push(node.$0);
  }
  nodes=[];
  oar=[];
  loop(tree);
  arr=nodes.slice(0);
  return Dyn.New(elem,Attrs.Flags(tree),arr,oar.length===0?null:{
   $:1,
   $0:function(el)
   {
    Seq.iter(function(f)
    {
     f(el);
    },oar);
   }
  });
 };
 Attrs.HasChangeAnim=function(attr$1)
 {
  var flag;
  flag=4;
  return(attr$1.DynFlags&flag)===flag;
 };
 Attrs.GetChangeAnim=function(dyn)
 {
  return Attrs.GetAnim(dyn,function($1,$2)
  {
   return $1.NGetChangeAnim($2);
  });
 };
 Attrs.HasEnterAnim=function(attr$1)
 {
  var flag;
  flag=1;
  return(attr$1.DynFlags&flag)===flag;
 };
 Attrs.GetEnterAnim=function(dyn)
 {
  return Attrs.GetAnim(dyn,function($1,$2)
  {
   return $1.NGetEnterAnim($2);
  });
 };
 Attrs.HasExitAnim=function(attr$1)
 {
  var flag;
  flag=2;
  return(attr$1.DynFlags&flag)===flag;
 };
 Attrs.GetExitAnim=function(dyn)
 {
  return Attrs.GetAnim(dyn,function($1,$2)
  {
   return $1.NGetExitAnim($2);
  });
 };
 Attrs.GetAnim=function(dyn,f)
 {
  return An.Concat(Arrays.map(function(n)
  {
   return f(n,dyn.DynElem);
  },dyn.DynNodes));
 };
 Attrs.Sync=function(elem,dyn)
 {
  Arrays.iter(function(d)
  {
   d.NSync(elem);
  },dyn.DynNodes);
 };
 Attrs.Empty=function(e)
 {
  return Dyn.New(e,0,[],null);
 };
 Guid.NewGuid=function()
 {
  return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(new Global.RegExp("[xy]","g"),function(c)
  {
   var r,v;
   r=Math.random()*16|0;
   v=c=="x"?r:r&3|8;
   return v.toString(16);
  });
 };
 TemplateInstance=Server.TemplateInstance=Runtime$1.Class({
  get_Doc:function()
  {
   return this.doc;
  }
 },Obj,TemplateInstance);
 TemplateInstance.New=Runtime$1.Ctor(function(c,doc)
 {
  this.doc=doc;
  this.allVars=c.$==0?c.$0:Operators.FailWith("Should not happen");
 },TemplateInstance);
 Handler.CompleteHoles=function(a,filledHoles,vars)
 {
  var allVars,filledVars,e,h,$1,n;
  function c(name,ty)
  {
   var p,r,r$1,r$2;
   return filledVars.Contains(name)?null:(p=ty===0?(r=Var.Create$1(""),[{
    $:8,
    $0:name,
    $1:r
   },r]):ty===1?(r$1=Var.Create$1(0),[{
    $:13,
    $0:name,
    $1:r$1
   },r$1]):ty===2?(r$2=Var.Create$1(false),[{
    $:9,
    $0:name,
    $1:r$2
   },r$2]):Operators.FailWith("Invalid value type"),(allVars.set_Item(name,p[1]),{
    $:1,
    $0:p[0]
   }));
  }
  allVars=new Dictionary.New$5();
  filledVars=new HashSet.New$3();
  e=Enumerator.Get(filledHoles);
  try
  {
   while(e.MoveNext())
    {
     h=e.Current();
     (h.$==8?($1=[h.$0,Client$1.Box(h.$1)],true):h.$==11?($1=[h.$0,Client$1.Box(h.$1)],true):h.$==10?($1=[h.$0,Client$1.Box(h.$1)],true):h.$==13?($1=[h.$0,Client$1.Box(h.$1)],true):h.$==12?($1=[h.$0,Client$1.Box(h.$1)],true):h.$==9&&($1=[h.$0,Client$1.Box(h.$1)],true))?(n=$1[0],filledVars.Add(n),allVars.set_Item(n,$1[1])):void 0;
    }
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
  return[Seq.append(filledHoles,Arrays.choose(function($2)
  {
   return c($2[0],$2[1]);
  },vars)),{
   $:0,
   $0:allVars
  }];
 };
 Phone.MatchesQuery=function(q,ph)
 {
  return ph.Name.indexOf(q)!=-1||ph.Snippet.indexOf(q)!=-1;
 };
 Phone.Compare=function(order,p1,p2)
 {
  return order.$==1?Unchecked.Compare(p1.Age,p2.Age):Unchecked.Compare(p1.Name,p2.Name);
 };
 Phone.New=function(Name,Snippet,Age)
 {
  return{
   Name:Name,
   Snippet:Snippet,
   Age:Age
  };
 };
 Restaurant.Jelen={
  $:0
 };
 Restaurant.Csiga={
  $:2
 };
 Restaurant.Suszterinas={
  $:1
 };
 Restaurant.Stex={
  $:3
 };
 Flow=UI.Flow=Runtime$1.Class({
  get_Render:function()
  {
   return this.render;
  }
 },Obj,Flow);
 Flow.New=Runtime$1.Ctor(function(define)
 {
  Flow.New$1.call(this,function(_var)
  {
   return function(cont)
   {
    return Var.Set(_var,define(cont));
   };
  });
 },Flow);
 Flow.New$1=Runtime$1.Ctor(function(render)
 {
  this.render=render;
 },Flow);
 FlowBuilder=UI.FlowBuilder=Runtime$1.Class({
  Bind:function(comp,func)
  {
   return Flow.Bind(comp,func);
  },
  ReturnFrom:Global.id
 },Obj,FlowBuilder);
 FlowBuilder.New=Runtime$1.Ctor(function()
 {
 },FlowBuilder);
 DoubleInterpolation=UI.DoubleInterpolation=Runtime$1.Class({
  Interpolate:function(t,x,y)
  {
   return x+t*(y-x);
  }
 },null,DoubleInterpolation);
 DoubleInterpolation.DoubleInterpolation=new DoubleInterpolation({
  $:0
 });
 Easings.CubicInOut=function()
 {
  SC$23.$cctor();
  return SC$23.CubicInOut;
 };
 Trans=UI.Trans=Runtime$1.Class({
  Copy:function(change,enter,exit,flags)
  {
   var $this,ch,d,d$1,d$2;
   function d$3(a,a$1)
   {
    return $this.TChange(a,a$1);
   }
   $this=this;
   ch=change==null?function($1)
   {
    return function($2)
    {
     return d$3($1,$2);
    };
   }:change.$0;
   return new Trans.New$3(function(d$4,d$5)
   {
    return(ch(d$4))(d$5);
   },(d=this.get_TEnter(),enter==null?d:enter.$0),(d$1=this.get_TExit(),exit==null?d$1:exit.$0),(d$2=this.get_TFlags(),flags==null?d$2:flags.$0));
  },
  get_TFlags:function()
  {
   return this.flags;
  },
  TChange:function(x,y)
  {
   return this.change(x,y);
  },
  get_TEnter:function()
  {
   return this.enter;
  },
  get_TExit:function()
  {
   return this.exit;
  }
 },Obj,Trans);
 Trans.New$1=Runtime$1.Ctor(function(ch)
 {
  Trans.New$3.call(this,ch,An.Const,An.Const,1);
 },Trans);
 Trans.New$3=Runtime$1.Ctor(function(change,enter,exit,flags)
 {
  this.change=change;
  this.enter=enter;
  this.exit=exit;
  this.flags=flags;
 },Trans);
 FSharpMap=Collections.FSharpMap=Runtime$1.Class({
  Equals:function(other)
  {
   return this.get_Count()===other.get_Count()&&Seq.forall2(Unchecked.Equals,this,other);
  },
  get_Count:function()
  {
   var tree;
   tree=this.tree;
   return tree==null?0:tree.Count;
  },
  GetEnumerator$1:function()
  {
   return Enumerator.Get(Seq.map(function(kv)
   {
    return{
     K:kv.Key,
     V:kv.Value
    };
   },BalancedTree.Enumerate(false,this.tree)));
  },
  Add:function(k,v)
  {
   return new FSharpMap.New$1(BalancedTree.Add(Pair.New(k,v),this.tree));
  },
  TryFind:function(k)
  {
   var o;
   o=BalancedTree.TryFind(Pair.New(k,void 0),this.tree);
   return o==null?null:{
    $:1,
    $0:o.$0.Value
   };
  },
  get_IsEmpty:function()
  {
   return this.tree==null;
  },
  GetHashCode:function()
  {
   return Unchecked.Hash(Arrays.ofSeq(this));
  },
  get_Tree:function()
  {
   return this.tree;
  },
  GetEnumerator:function()
  {
   return this.GetEnumerator$1();
  },
  CompareTo0:function(other)
  {
   return Seq.compareWith(Unchecked.Compare,this,other);
  },
  GetEnumerator0:function()
  {
   return this.GetEnumerator$1();
  }
 },Obj,FSharpMap);
 FSharpMap.New=Runtime$1.Ctor(function(s)
 {
  FSharpMap.New$1.call(this,MapUtil.fromSeq(s));
 },FSharpMap);
 FSharpMap.New$1=Runtime$1.Ctor(function(tree)
 {
  this.tree=tree;
 },FSharpMap);
 Action.ThreadList={
  $:2
 };
 Action.NewThread={
  $:0
 };
 Auth.Create=function()
 {
  var loggedIn,hidden,loginForm;
  function hide()
  {
   hidden.Set(true);
  }
  function show()
  {
   hidden.Set(false);
  }
  loggedIn=Var.Create$1(null);
  hidden=Var.Create$1(true);
  loginForm=Doc.Element("div",[AttrModule.DynamicStyle("display",View.Map(function(yes)
  {
   return yes?"none":"block";
  },hidden.get_View()))],[Auth.LoginForm(function(user)
  {
   loggedIn.Set({
    $:1,
    $0:user
   });
   hide();
  })]);
  return Component.New(loggedIn.get_View(),loginForm,Auth.StatusWidget(function()
  {
   show();
  },function()
  {
   loggedIn.Set(null);
   hide();
  },loggedIn.get_View()),hide,show);
 };
 Auth.LoginForm=function(onLogin)
 {
  var rvUser,rvPass,rvMsg,message;
  function inputRow(rv,id,lblText,isPass)
  {
   return Utilities.divc("form-group",[Doc.Element("label",[AttrProxy.Create("for",id),Utilities.cls("col-sm-2 control-label")],[Doc.TextNode(lblText)]),Utilities.divc("col-sm-2",[((isPass?function(a)
   {
    return function(a$1)
    {
     return Doc.PasswordBox(a,a$1);
    };
   }:function(a)
   {
    return function(a$1)
    {
     return Doc.Input(a,a$1);
    };
   })(List.ofArray([Utilities.cls("form-control"),AttrProxy.Create("id",id),AttrProxy.Create("placeholder",lblText)])))(rv)])]);
  }
  rvUser=Var.Create$1("");
  rvPass=Var.Create$1("");
  rvMsg=Var.Create$1("");
  message=Doc.Element("div",[],[Doc.Element("p",[Utilities.cls("bg-danger")],[Doc.TextView(rvMsg.get_View())])]);
  return Doc.Element("div",[],[Doc.Element("div",[],[Doc.TextNode("Hint: TestUser/TestPass")]),message,Doc.Element("form",[Utilities.cls("form-horizontal"),AttrProxy.Create("role","form")],[inputRow(rvUser,"user","Username",false),inputRow(rvPass,"pass","Password",true),Utilities.divc("form-group",[Utilities.divc("col-sm-offset-2 col-sm-10",[Doc.Button("Log In",[Utilities.cls("btn btn-primary")],function()
  {
   var b;
   Concurrency.Start((b=null,Concurrency.Delay(function()
   {
    return Concurrency.Bind(Server$1.CheckLogin(rvUser.Get(),rvPass.Get()),function(a)
    {
     return a==null?(Var.Set(rvMsg,"Invalid credentials."),Concurrency.Zero()):(Var.Set(rvUser,""),Var.Set(rvPass,""),onLogin(a.$0),Concurrency.Zero());
    });
   })),null);
  })])])])]);
 };
 Auth.StatusWidget=function(login,logout,view)
 {
  return Doc.EmbedView(View.Map(function(a)
  {
   return a==null?Doc.Concat([Doc.Element("li",[],[Doc.Link("You are not logged in.",[],Global.ignore)]),Doc.Element("li",[],[Doc.Link("Login",[],login)])]):Doc.Concat([Doc.Element("li",[],[Doc.Link("Welcome, "+a.$0.Name+"!",[],Global.ignore)]),Doc.Element("li",[],[Doc.Link("Logout",[],logout)])]);
  },view));
 };
 State.New=function(Auth$1,Threads,Go)
 {
  return{
   Auth:Auth$1,
   Threads:Threads,
   Go:Go
  };
 };
 Component.New=function(LoggedIn,LoginForm,StatusWidget,HideForm,ShowForm)
 {
  return{
   LoggedIn:LoggedIn,
   LoginForm:LoginForm,
   StatusWidget:StatusWidget,
   HideForm:HideForm,
   ShowForm:ShowForm
  };
 };
 Context.New=function(Go)
 {
  return{
   Go:Go
  };
 };
 Context$1.New=function(Go)
 {
  return{
   Go:Go
  };
 };
 Slice.array=function(source,start,finish)
 {
  return start==null?finish!=null&&finish.$==1?source.slice(0,finish.$0+1):[]:finish==null?source.slice(start.$0):source.slice(start.$0,finish.$0+1);
 };
 Slice.string=function(source,start,finish)
 {
  return start==null?finish!=null&&finish.$==1?source.slice(0,finish.$0+1):"":finish==null?source.slice(start.$0):source.slice(start.$0,finish.$0+1);
 };
 DataSet.LoadFromCSV=function(url)
 {
  return Concurrency.FromContinuations(function(ok)
  {
   $.get(url,new Obj.New(),function($1)
   {
    ok(DataSet.ParseCSV($1));
   });
  });
 };
 DataSet.TopStatesByRatio=function(ds,bracket)
 {
  function p(a,r)
  {
   return-r;
  }
  return Slice.array(Arrays.sortBy(function($1)
  {
   return p($1[0],$1[1]);
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
 };
 DataSet.ParseCSV=function(data)
 {
  var all,brackets,data$1;
  function stIx(st)
  {
   return Arrays.findIndex(function(d)
   {
    return Arrays.get(d,0)===st;
   },data$1);
  }
  function brIx(bracket)
  {
   return Arrays.findIndex(function(y)
   {
    return Unchecked.Equals(bracket,y);
   },brackets);
  }
  function pop(bracket,a)
  {
   return Global.Number(Arrays.get(Arrays.get(data$1,stIx(a.$0)),1+brIx(bracket)));
  }
  all=Arrays.filter(function(s)
  {
   return s!=="";
  },Strings.SplitChars(data,["\r","\n"],0));
  brackets=Arrays.map(function(a)
  {
   return{
    $:0,
    $0:a
   };
  },Slice.array(Strings.SplitChars(Arrays.get(all,0),[","],0),{
   $:1,
   $0:1
  },null));
  data$1=Arrays.map(function(s)
  {
   return Strings.SplitChars(s,[","],0);
  },Arrays.sub(all,1,Arrays.length(all)-1));
  return DataSet.New(brackets,function($1)
  {
   return function($2)
   {
    return pop($1,$2);
   };
  },Arrays.map(function(d)
  {
   return{
    $:0,
    $0:Arrays.get(d,0)
   };
  },data$1));
 };
 DataSet.Ratio=function(ds,br,st)
 {
  return+(ds.Population(br))(st)/+(ds.Population({
   $:0,
   $0:"Total"
  }))(st);
 };
 DataSet.New=function(Brackets,Population,States)
 {
  return{
   Brackets:Brackets,
   Population:Population,
   States:States
  };
 };
 StateView.New=function(MaxValue,Position,State$1,Total,Value)
 {
  return{
   MaxValue:MaxValue,
   Position:Position,
   State:State$1,
   Total:Total,
   Value:Value
  };
 };
 Mouse.get_Position=function()
 {
  !Input.MousePosSt$1().Active?(Global.document.addEventListener("mousemove",function(evt)
  {
   Var.Set(Input.MousePosSt$1().PosV,[evt.clientX,evt.clientY]);
  },false),Input.MousePosSt$1().Active=true):void 0;
  return Input.MousePosSt$1().PosV.get_View();
 };
 Mouse.get_LeftPressed=function()
 {
  Input.ActivateButtonListener();
  return Input.MouseBtnSt$1().Left.get_View();
 };
 Mouse.get_MiddlePressed=function()
 {
  Input.ActivateButtonListener();
  return Input.MouseBtnSt$1().Middle.get_View();
 };
 Mouse.get_RightPressed=function()
 {
  Input.ActivateButtonListener();
  return Input.MouseBtnSt$1().Right.get_View();
 };
 Input.ActivateKeyListener=function()
 {
  SC$24.$cctor();
  return SC$24.ActivateKeyListener;
 };
 Input.KeyListenerState=function()
 {
  SC$24.$cctor();
  return SC$24.KeyListenerState;
 };
 Input.MousePosSt$1=function()
 {
  SC$24.$cctor();
  return SC$24.MousePosSt;
 };
 Input.ActivateButtonListener=function()
 {
  SC$24.$cctor();
  return SC$24.ActivateButtonListener;
 };
 Input.MouseBtnSt$1=function()
 {
  SC$24.$cctor();
  return SC$24.MouseBtnSt;
 };
 KeyListenerSt.New=function(KeysPressed,KeyListenerActive,LastPressed)
 {
  return{
   KeysPressed:KeysPressed,
   KeyListenerActive:KeyListenerActive,
   LastPressed:LastPressed
  };
 };
 Enumerator.Get=function(x)
 {
  return x instanceof Global.Array?Enumerator.ArrayEnumerator(x):Unchecked.Equals(typeof x,"string")?Enumerator.StringEnumerator(x):x.GetEnumerator();
 };
 Enumerator.ArrayEnumerator=function(s)
 {
  return new T$1.New(0,null,function(e)
  {
   var i;
   i=e.s;
   return i<Arrays.length(s)&&(e.c=Arrays.get(s,i),e.s=i+1,true);
  },void 0);
 };
 Enumerator.StringEnumerator=function(s)
 {
  return new T$1.New(0,null,function(e)
  {
   var i;
   i=e.s;
   return i<s.length&&(e.c=s[i],e.s=i+1,true);
  },void 0);
 };
 Enumerator.Get0=function(x)
 {
  return x instanceof Global.Array?Enumerator.ArrayEnumerator(x):Unchecked.Equals(typeof x,"string")?Enumerator.StringEnumerator(x):"GetEnumerator0"in x?x.GetEnumerator0():x.GetEnumerator();
 };
 T$1=Enumerator.T=Runtime$1.Class({
  MoveNext:function()
  {
   return this.n(this);
  },
  Current:function()
  {
   return this.c;
  },
  Dispose:function()
  {
   if(this.d)
    this.d(this);
  }
 },Obj,T$1);
 T$1.New=Runtime$1.Ctor(function(s,c,n,d)
 {
  this.s=s;
  this.c=c;
  this.n=n;
  this.d=d;
 },T$1);
 Lazy.CreateFromValue=function(v)
 {
  return LazyRecord.New(true,v,Lazy.cachedLazy);
 };
 Lazy.cachedLazy=function()
 {
  return this.v;
 };
 Lazy.Create=function(f)
 {
  return LazyRecord.New(false,f,Lazy.forceLazy);
 };
 Lazy.forceLazy=function()
 {
  var v;
  v=this.v();
  this.c=true;
  this.v=v;
  this.f=Lazy.cachedLazy;
  return v;
 };
 Strings.StartsWith=function(t,s)
 {
  return t.substring(0,s.length)==s;
 };
 Strings.ToCharArray=function(s)
 {
  return Arrays.init(s.length,function(x)
  {
   return s[x];
  });
 };
 Strings.SplitChars=function(s,sep,opts)
 {
  return Strings.Split(s,new Global.RegExp("["+Strings.RegexEscape(sep.join(""))+"]"),opts);
 };
 Strings.Substring=function(s,ix,ct)
 {
  return s.substr(ix,ct);
 };
 Strings.RegexEscape=function(s)
 {
  return s.replace(new Global.RegExp("[-\\/\\\\^$*+?.()|[\\]{}]","g"),"\\$&");
 };
 Strings.Split=function(s,pat,opts)
 {
  return opts===1?Arrays.filter(function(x)
  {
   return x!=="";
  },Strings.SplitWith(s,pat)):Strings.SplitWith(s,pat);
 };
 Strings.SplitWith=function(str,pat)
 {
  return str.split(pat);
 };
 Strings.concat=function(separator,strings)
 {
  return Arrays.ofSeq(strings).join(separator);
 };
 Strings.IsNullOrEmpty=function(x)
 {
  return x==null||x=="";
 };
 Strings.Join=function(sep,values)
 {
  return values.join(sep);
 };
 Strings.forall=function(f,s)
 {
  return Seq.forall(f,Strings.protect(s));
 };
 Strings.protect=function(s)
 {
  return s===null?"":s;
 };
 Fresh.Int=function()
 {
  Fresh.set_counter(Fresh.counter()+1);
  return Fresh.counter();
 };
 Fresh.Id=function()
 {
  Fresh.set_counter(Fresh.counter()+1);
  return"uid"+String$1(Fresh.counter());
 };
 Fresh.set_counter=function($1)
 {
  SC$25.$cctor();
  SC$25.counter=$1;
 };
 Fresh.counter=function()
 {
  SC$25.$cctor();
  return SC$25.counter;
 };
 Async.StartTo=function(comp,k)
 {
  Concurrency.StartWithContinuations(comp,k,function(e)
  {
   Async.OnError(e);
  },Global.ignore,null);
 };
 Async.OnError=function(e)
 {
  return console.log("WebSharper UI: Uncaught asynchronous exception",e);
 };
 View=UI.View=Runtime$1.Class({},null,View);
 Array.ofSeqNonCopying=function(xs)
 {
  var q,o;
  if(xs instanceof Global.Array)
   return xs;
  else
   if(xs instanceof T)
    return Arrays.ofList(xs);
   else
    if(xs===null)
     return[];
    else
     {
      q=[];
      o=Enumerator.Get(xs);
      try
      {
       while(o.MoveNext())
        q.push(o.Current());
       return q;
      }
      finally
      {
       if("Dispose"in o)
        o.Dispose();
      }
     }
 };
 Array.TreeReduce=function(defaultValue,reduction,array)
 {
  var l;
  function loop(off,len)
  {
   var $1,l2;
   return len<=0?defaultValue:len===1&&(off>=0&&off<l)?Arrays.get(array,off):(l2=len/2>>0,reduction(loop(off,l2),loop(off+l2,len-l2)));
  }
  l=Arrays.length(array);
  return loop(0,l);
 };
 Array.mapInPlace=function(f,arr)
 {
  var i,$1;
  for(i=0,$1=arr.length-1;i<=$1;i++)arr[i]=f(arr[i]);
  return arr;
 };
 Array.MapTreeReduce=function(mapping,defaultValue,reduction,array)
 {
  var l;
  function loop(off,len)
  {
   var $1,l2;
   return len<=0?defaultValue:len===1&&(off>=0&&off<l)?mapping(Arrays.get(array,off)):(l2=len/2>>0,reduction(loop(off,l2),loop(off+l2,len-l2)));
  }
  l=Arrays.length(array);
  return loop(0,l);
 };
 SC$21.$cctor=function()
 {
  SC$21.$cctor=Global.ignore;
  SC$21.Doc=Global.document;
 };
 Docs.LinkElement=function(el,children)
 {
  Docs.InsertDoc(el,children,null);
 };
 Docs.CreateEmbedNode=function()
 {
  return{
   Current:null,
   Dirty:false
  };
 };
 Docs.UpdateEmbedNode=function(node,upd)
 {
  node.Current=upd;
  node.Dirty=true;
 };
 Docs.LocalTemplatesLoaded=function()
 {
  SC$26.$cctor();
  return SC$26.LocalTemplatesLoaded;
 };
 Docs.set_LocalTemplatesLoaded=function($1)
 {
  SC$26.$cctor();
  SC$26.LocalTemplatesLoaded=$1;
 };
 Docs.InsertDoc=function(parent,doc,pos)
 {
  var d;
  return doc!=null&&doc.$==1?Docs.InsertNode(parent,doc.$0.El,pos):doc!=null&&doc.$==2?(d=doc.$0,(d.Dirty=false,Docs.InsertDoc(parent,d.Current,pos))):doc==null?pos:doc!=null&&doc.$==4?Docs.InsertNode(parent,doc.$0.Text,pos):doc!=null&&doc.$==5?Docs.InsertNode(parent,doc.$0,pos):doc!=null&&doc.$==6?Arrays.foldBack(function($1,$2)
  {
   return $1.constructor===Object?Docs.InsertDoc(parent,$1,$2):Docs.InsertNode(parent,$1,$2);
  },doc.$0.Els,pos):Docs.InsertDoc(parent,doc.$0,Docs.InsertDoc(parent,doc.$1,pos));
 };
 Docs.CreateRunState=function(parent,doc)
 {
  return RunState.New(NodeSet.get_Empty(),Docs.CreateElemNode(parent,Attrs.EmptyAttr(),doc));
 };
 Docs.PerformAnimatedUpdate=function(childrenOnly,st,doc)
 {
  var b;
  return An.get_UseAnimations()?(b=null,Concurrency.Delay(function()
  {
   var cur,change,enter;
   cur=NodeSet.FindAll(doc);
   change=Docs.ComputeChangeAnim(st,cur);
   enter=Docs.ComputeEnterAnim(st,cur);
   return Concurrency.Bind(An.Play(An.Append(change,Docs.ComputeExitAnim(st,cur))),function()
   {
    return Concurrency.Bind(Docs.SyncElemNodesNextFrame(childrenOnly,st),function()
    {
     return Concurrency.Bind(An.Play(enter),function()
     {
      st.PreviousNodes=cur;
      return Concurrency.Return(null);
     });
    });
   });
  })):Docs.SyncElemNodesNextFrame(childrenOnly,st);
 };
 Docs.PerformSyncUpdate=function(childrenOnly,st,doc)
 {
  var cur;
  cur=NodeSet.FindAll(doc);
  Docs.SyncElemNode(childrenOnly,st.Top);
  st.PreviousNodes=cur;
 };
 Docs.CreateTextNode=function()
 {
  return{
   Text:DomUtility.CreateText(""),
   Dirty:false,
   Value:""
  };
 };
 Docs.UpdateTextNode=function(n,t)
 {
  n.Value=t;
  n.Dirty=true;
 };
 Docs.CreateElemNode=function(el,attr$1,children)
 {
  var attr$2;
  Docs.LinkElement(el,children);
  attr$2=Attrs.Insert(el,attr$1);
  return DocElemNode.New(attr$2,children,null,el,Fresh.Int(),Runtime$1.GetOptional(attr$2.OnAfterRender));
 };
 Docs.LoadedTemplateFile=function(name)
 {
  var m,o,d;
  m=(o=null,[Docs.LoadedTemplates().TryGetValue(name,{
   get:function()
   {
    return o;
   },
   set:function(v)
   {
    o=v;
   }
  }),o]);
  return m[0]?m[1]:(d=new Dictionary.New$5(),(Docs.LoadedTemplates().set_Item(name,d),d));
 };
 Docs.LoadedTemplates=function()
 {
  SC$26.$cctor();
  return SC$26.LoadedTemplates;
 };
 Docs.InsertNode=function(parent,node,pos)
 {
  DomUtility.InsertAt(parent,pos,node);
  return node;
 };
 Docs.ComputeChangeAnim=function(st,cur)
 {
  var relevant;
  function a(n)
  {
   return Attrs.HasChangeAnim(n.Attr);
  }
  relevant=function(a$1)
  {
   return NodeSet.Filter(a,a$1);
  };
  return An.Concat(Arrays.map(function(n)
  {
   return Attrs.GetChangeAnim(n.Attr);
  },NodeSet.ToArray(NodeSet.Intersect(relevant(st.PreviousNodes),relevant(cur)))));
 };
 Docs.ComputeEnterAnim=function(st,cur)
 {
  return An.Concat(Arrays.map(function(n)
  {
   return Attrs.GetEnterAnim(n.Attr);
  },NodeSet.ToArray(NodeSet.Except(st.PreviousNodes,NodeSet.Filter(function(n)
  {
   return Attrs.HasEnterAnim(n.Attr);
  },cur)))));
 };
 Docs.ComputeExitAnim=function(st,cur)
 {
  return An.Concat(Arrays.map(function(n)
  {
   return Attrs.GetExitAnim(n.Attr);
  },NodeSet.ToArray(NodeSet.Except(cur,NodeSet.Filter(function(n)
  {
   return Attrs.HasExitAnim(n.Attr);
  },st.PreviousNodes)))));
 };
 Docs.SyncElemNodesNextFrame=function(childrenOnly,st)
 {
  function a(ok)
  {
   Global.requestAnimationFrame(function()
   {
    Docs.SyncElemNode(childrenOnly,st.Top);
    ok();
   });
  }
  return Settings.BatchUpdatesEnabled()?Concurrency.FromContinuations(function($1,$2,$3)
  {
   return a.apply(null,[$1,$2,$3]);
  }):(Docs.SyncElemNode(childrenOnly,st.Top),Concurrency.Return(null));
 };
 Docs.SyncElemNode=function(childrenOnly,el)
 {
  !childrenOnly?Docs.SyncElement(el):void 0;
  Docs.Sync(el.Children);
  Docs.AfterRender(el);
 };
 Docs.SyncElement=function(el)
 {
  function hasDirtyChildren(el$1)
  {
   function dirty(doc)
   {
    var d,t;
    return doc!=null&&doc.$==0?dirty(doc.$0)||dirty(doc.$1):doc!=null&&doc.$==2?(d=doc.$0,d.Dirty||dirty(d.Current)):doc!=null&&doc.$==6&&(t=doc.$0,t.Dirty||Arrays.exists(hasDirtyChildren,t.Holes));
   }
   return dirty(el$1.Children);
  }
  Attrs.Sync(el.El,el.Attr);
  hasDirtyChildren(el)?Docs.DoSyncElement(el):void 0;
 };
 Docs.Sync=function(doc)
 {
  var d,t;
  if(doc!=null&&doc.$==1)
   Docs.SyncElemNode(false,doc.$0);
  else
   if(doc!=null&&doc.$==2)
    Docs.Sync(doc.$0.Current);
   else
    if(doc==null)
     ;
    else
     if(doc!=null&&doc.$==5)
      ;
     else
      if(doc!=null&&doc.$==4)
       {
        d=doc.$0;
        d.Dirty?(d.Text.nodeValue=d.Value,d.Dirty=false):void 0;
       }
      else
       if(doc!=null&&doc.$==6)
        {
         t=doc.$0;
         Arrays.iter(function(e)
         {
          Docs.SyncElemNode(false,e);
         },t.Holes);
         Arrays.iter(function(t$1)
         {
          Attrs.Sync(t$1[0],t$1[1]);
         },t.Attrs);
         Docs.AfterRender(t);
        }
       else
        {
         Docs.Sync(doc.$0);
         Docs.Sync(doc.$1);
        }
 };
 Docs.AfterRender=function(el)
 {
  var m;
  m=Runtime$1.GetOptional(el.Render);
  m!=null&&m.$==1?(m.$0(el.El),Runtime$1.SetOptional(el,"Render",null)):void 0;
 };
 Docs.TextHoleRE=function()
 {
  SC$26.$cctor();
  return SC$26.TextHoleRE;
 };
 Docs.DoSyncElement=function(el)
 {
  var parent,p,m;
  function ins(doc,pos)
  {
   var d,t;
   return doc!=null&&doc.$==1?doc.$0.El:doc!=null&&doc.$==2?(d=doc.$0,d.Dirty?(d.Dirty=false,Docs.InsertDoc(parent,d.Current,pos)):ins(d.Current,pos)):doc==null?pos:doc!=null&&doc.$==4?doc.$0.Text:doc!=null&&doc.$==5?doc.$0:doc!=null&&doc.$==6?(t=doc.$0,(t.Dirty?t.Dirty=false:void 0,Arrays.foldBack(function($1,$2)
   {
    return $1.constructor===Object?ins($1,$2):$1;
   },t.Els,pos))):ins(doc.$0,ins(doc.$1,pos));
  }
  parent=el.El;
  DomNodes.Iter((p=el.El,function(e)
  {
   DomUtility.RemoveNode(p,e);
  }),DomNodes.Except(DomNodes.DocChildren(el),DomNodes.Children(el.El,Runtime$1.GetOptional(el.Delimiters))));
  ins(el.Children,(m=Runtime$1.GetOptional(el.Delimiters),m!=null&&m.$==1?m.$0[1]:null));
 };
 Docs.InsertBeforeDelim=function(afterDelim,doc)
 {
  var p,before;
  p=afterDelim.parentNode;
  before=Global.document.createTextNode("");
  p.insertBefore(before,afterDelim);
  Docs.LinkPrevElement(afterDelim,doc);
  return before;
 };
 Docs.LinkPrevElement=function(el,children)
 {
  Docs.InsertDoc(el.parentNode,children,el);
 };
 SC$22.$cctor=function()
 {
  SC$22.$cctor=Global.ignore;
  SC$22.EmptyAttr=null;
 };
 Snap.Obsolete=function(sn)
 {
  var $1,m,i,$2,o;
  m=sn.s;
  if(m==null||(m!=null&&m.$==2?($1=m.$1,false):m!=null&&m.$==3?($1=m.$1,false):true))
   void 0;
  else
   {
    sn.s=null;
    for(i=0,$2=Arrays.length($1)-1;i<=$2;i++){
     o=Arrays.get($1,i);
     typeof o=="object"?function(sn$1)
     {
      Snap.Obsolete(sn$1);
     }(o):o();
    }
   }
 };
 Snap.New=function(State$1)
 {
  return{
   s:State$1
  };
 };
 Dictionary=Collections.Dictionary=Runtime$1.Class({
  set_Item:function(k,v)
  {
   this.set(k,v);
  },
  ContainsKey:function(k)
  {
   var $this,d;
   $this=this;
   d=this.data[this.hash(k)];
   return d&&Arrays.exists(function(a)
   {
    return $this.equals.apply(null,[(Operators.KeyValue(a))[0],k]);
   },d);
  },
  get_Item:function(k)
  {
   return this.get(k);
  },
  set:function(k,v)
  {
   var $this,h,d,m;
   $this=this;
   h=this.hash(k);
   d=this.data[h];
   d?(m=Arrays.tryFindIndex(function(a)
   {
    return $this.equals.apply(null,[(Operators.KeyValue(a))[0],k]);
   },d),m==null?(this.count=this.count+1,d.push({
    K:k,
    V:v
   })):d[m.$0]={
    K:k,
    V:v
   }):(this.count=this.count+1,this.data[h]=new Global.Array({
    K:k,
    V:v
   }));
  },
  get:function(k)
  {
   var $this,d;
   $this=this;
   d=this.data[this.hash(k)];
   return d?Arrays.pick(function(a)
   {
    var a$1;
    a$1=Operators.KeyValue(a);
    return $this.equals.apply(null,[a$1[0],k])?{
     $:1,
     $0:a$1[1]
    }:null;
   },d):DictionaryUtil.notPresent();
  },
  TryGetValue:function(k,res)
  {
   var $this,d,v;
   $this=this;
   d=this.data[this.hash(k)];
   return d&&(v=Arrays.tryPick(function(a)
   {
    var a$1;
    a$1=Operators.KeyValue(a);
    return $this.equals.apply(null,[a$1[0],k])?{
     $:1,
     $0:a$1[1]
    }:null;
   },d),v!=null&&v.$==1&&(res.set(v.$0),true));
  },
  Remove:function(k)
  {
   return this.remove(k);
  },
  remove:function(k)
  {
   var $this,h,d,r;
   $this=this;
   h=this.hash(k);
   d=this.data[h];
   return d&&(r=Arrays.filter(function(a)
   {
    return!$this.equals.apply(null,[(Operators.KeyValue(a))[0],k]);
   },d),Arrays.length(r)<d.length&&(this.count=this.count-1,this.data[h]=r,true));
  },
  GetEnumerator:function()
  {
   return Enumerator.Get0(this);
  },
  GetEnumerator0:function()
  {
   return Enumerator.Get0(Arrays.concat(JSModule.GetFieldValues(this.data)));
  }
 },Obj,Dictionary);
 Dictionary.New$5=Runtime$1.Ctor(function()
 {
  Dictionary.New$6.call(this,[],Unchecked.Equals,Unchecked.Hash);
 },Dictionary);
 Dictionary.New$6=Runtime$1.Ctor(function(init,equals,hash)
 {
  var e,x;
  this.equals=equals;
  this.hash=hash;
  this.count=0;
  this.data=[];
  e=Enumerator.Get(init);
  try
  {
   while(e.MoveNext())
    {
     x=e.Current();
     this.set(x.K,x.V);
    }
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 },Dictionary);
 HashSet=Collections.HashSet=Runtime$1.Class({
  Add:function(item)
  {
   return this.add(item);
  },
  Contains:function(item)
  {
   var arr;
   arr=this.data[this.hash(item)];
   return arr==null?false:this.arrContains(item,arr);
  },
  add:function(item)
  {
   var h,arr;
   h=this.hash(item);
   arr=this.data[h];
   return arr==null?(this.data[h]=[item],this.count=this.count+1,true):this.arrContains(item,arr)?false:(arr.push(item),this.count=this.count+1,true);
  },
  arrContains:function(item,arr)
  {
   var c,i,$1,l;
   c=true;
   i=0;
   l=arr.length;
   while(c&&i<l)
    if(this.equals.apply(null,[arr[i],item]))
     c=false;
    else
     i=i+1;
   return!c;
  },
  IntersectWith:function(xs)
  {
   var other,all,i,$1,item;
   other=new HashSet.New$4(xs,this.equals,this.hash);
   all=HashSetUtil.concat(this.data);
   for(i=0,$1=all.length-1;i<=$1;i++){
    item=all[i];
    !other.Contains(item)?this.Remove(item):void 0;
   }
  },
  get_Count:function()
  {
   return this.count;
  },
  CopyTo:function(arr)
  {
   var i,all,i$1,$1;
   i=0;
   all=HashSetUtil.concat(this.data);
   for(i$1=0,$1=all.length-1;i$1<=$1;i$1++)Arrays.set(arr,i$1,all[i$1]);
  },
  ExceptWith:function(xs)
  {
   var e;
   e=Enumerator.Get(xs);
   try
   {
    while(e.MoveNext())
     this.Remove(e.Current());
   }
   finally
   {
    if("Dispose"in e)
     e.Dispose();
   }
  },
  Remove:function(item)
  {
   var arr;
   arr=this.data[this.hash(item)];
   return arr==null?false:this.arrRemove(item,arr)&&(this.count=this.count-1,true);
  },
  arrRemove:function(item,arr)
  {
   var c,i,$1,l;
   c=true;
   i=0;
   l=arr.length;
   while(c&&i<l)
    if(this.equals.apply(null,[arr[i],item]))
     {
      arr.splice.apply(arr,[i,1]);
      c=false;
     }
    else
     i=i+1;
   return!c;
  },
  GetEnumerator:function()
  {
   return Enumerator.Get(HashSetUtil.concat(this.data));
  },
  GetEnumerator0:function()
  {
   return Enumerator.Get(HashSetUtil.concat(this.data));
  }
 },Obj,HashSet);
 HashSet.New$3=Runtime$1.Ctor(function()
 {
  HashSet.New$4.call(this,[],Unchecked.Equals,Unchecked.Hash);
 },HashSet);
 HashSet.New$4=Runtime$1.Ctor(function(init,equals,hash)
 {
  var e;
  this.equals=equals;
  this.hash=hash;
  this.data=[];
  this.count=0;
  e=Enumerator.Get(init);
  try
  {
   while(e.MoveNext())
    this.add(e.Current());
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 },HashSet);
 HashSet.New$2=Runtime$1.Ctor(function(init)
 {
  HashSet.New$4.call(this,init,Unchecked.Equals,Unchecked.Hash);
 },HashSet);
 Client$1.Box=Global.id;
 Order.Newest={
  $:1
 };
 Order.Show=function(order)
 {
  return order.$==1?"Newest":"Alphabetical";
 };
 Order.Alphabetical={
  $:0
 };
 Numeric.TryParseInt32=function(s,r)
 {
  return Numeric.TryParse(s,-2147483648,2147483647,r);
 };
 SC$23.$cctor=function()
 {
  SC$23.$cctor=Global.ignore;
  SC$23.CubicInOut=Easing.Custom(function(t)
  {
   var t2;
   t2=t*t;
   return 3*t2-2*(t2*t);
  });
  SC$23.UseAnimations=true;
 };
 MapUtil.fromSeq=function(s)
 {
  var a;
  a=Arrays.ofSeq(Seq.delay(function()
  {
   return Seq.collect(function(m)
   {
    return[Pair.New(m[0],m[1])];
   },Seq.distinctBy(function(t)
   {
    return t[0];
   },s));
  }));
  Arrays.sortInPlace(a);
  return BalancedTree.Build(a,0,a.length-1);
 };
 Common.CreateThread=function(author,title)
 {
  return Thread.New(Fresh$1.Int(),title,author,Var.Create$1(T.Empty));
 };
 Common.CreatePost=function(user,content)
 {
  return Post.New(Fresh$1.Int(),user.Name,content);
 };
 User.New=function(Name,Password)
 {
  return{
   Name:Name,
   Password:Password
  };
 };
 Server$1.AddThread=function(thread)
 {
  var b;
  b=null;
  return Concurrency.Delay(function()
  {
   Server$1.set_threads(List.append(Server$1.threads(),List.ofArray([thread])));
   Server$1.set_posts(Server$1.posts().Add(thread.ThreadId,T.Empty));
   return Concurrency.Return(null);
  });
 };
 Server$1.AddPost=function(thread,post)
 {
  var b;
  b=null;
  return Concurrency.Delay(function()
  {
   var m,v,v$1;
   m=Map.TryFind(thread.ThreadId,Server$1.posts());
   return m==null?(Server$1.set_posts((v=List.ofArray([post]),Server$1.posts().Add(thread.ThreadId,v))),Concurrency.Return(null)):(Server$1.set_posts((v$1=List.append(m.$0,List.ofArray([post])),Server$1.posts().Add(thread.ThreadId,v$1))),Concurrency.Return(null));
  });
 };
 Server$1.GetThreads=function()
 {
  var b;
  b=null;
  return Concurrency.Delay(function()
  {
   return Concurrency.Bind(Concurrency.Sleep(Server$1.DELAY()),function()
   {
    return Concurrency.Return(Server$1.threads());
   });
  });
 };
 Server$1.GetPosts=function(thread)
 {
  var b;
  b=null;
  return Concurrency.Delay(function()
  {
   var m;
   m=Map.TryFind(thread.ThreadId,Server$1.posts());
   return m==null?Concurrency.Return(T.Empty):Concurrency.Return(m.$0);
  });
 };
 Server$1.set_threads=function($1)
 {
  SC$11.$cctor();
  SC$11.threads=$1;
 };
 Server$1.threads=function()
 {
  SC$11.$cctor();
  return SC$11.threads;
 };
 Server$1.set_posts=function($1)
 {
  SC$11.$cctor();
  SC$11.posts=$1;
 };
 Server$1.posts=function()
 {
  SC$11.$cctor();
  return SC$11.posts;
 };
 Server$1.CheckLogin=function(user,pass)
 {
  var b;
  b=null;
  return Concurrency.Delay(function()
  {
   return Concurrency.Bind(Concurrency.Sleep(Server$1.DELAY()),function()
   {
    return Concurrency.Return(Server$1.CheckCredentials(user,pass));
   });
  });
 };
 Server$1.DELAY=function()
 {
  SC$11.$cctor();
  return SC$11.DELAY;
 };
 Server$1.CheckCredentials=function(name,pass)
 {
  var $1;
  return name==="TestUser"&&pass==="TestPass"?{
   $:1,
   $0:User.New(name,pass)
  }:null;
 };
 Thread.New=function(ThreadId,Title,ThreadAuthorName,Posts)
 {
  return{
   ThreadId:ThreadId,
   Title:Title,
   ThreadAuthorName:ThreadAuthorName,
   Posts:Posts
  };
 };
 Post.New=function(PostId,PostAuthorName,Content)
 {
  return{
   PostId:PostId,
   PostAuthorName:PostAuthorName,
   Content:Content
  };
 };
 MousePosSt.New=function(Active,PosV)
 {
  return{
   Active:Active,
   PosV:PosV
  };
 };
 MouseBtnSt.New=function(Active,Left,Middle,Right)
 {
  return{
   Active:Active,
   Left:Left,
   Middle:Middle,
   Right:Right
  };
 };
 SC$24.$cctor=function()
 {
  SC$24.$cctor=Global.ignore;
  function buttonListener(evt,down)
  {
   var m;
   m=evt.button;
   return m===0?Var.Set(Input.MouseBtnSt$1().Left,down):m===1?Var.Set(Input.MouseBtnSt$1().Middle,down):m===2?Var.Set(Input.MouseBtnSt$1().Right,down):null;
  }
  SC$24.MousePosSt=MousePosSt.New(false,Var.Create$1([0,0]));
  SC$24.MouseBtnSt=MouseBtnSt.New(false,Var.Create$1(false),Var.Create$1(false),Var.Create$1(false));
  SC$24.ActivateButtonListener=!Input.MouseBtnSt$1().Active?(Input.MouseBtnSt$1().Active=true,Global.document.addEventListener("mousedown",function(evt)
  {
   return buttonListener(evt,true);
  },false),Global.document.addEventListener("mouseup",function(evt)
  {
   return buttonListener(evt,false);
  },false)):null;
  SC$24.KeyListenerState=KeyListenerSt.New(Var.Create$1(T.Empty),false,Var.Create$1(-1));
  SC$24.ActivateKeyListener=!Input.KeyListenerState().KeyListenerActive?($(Global.document).keydown(function(evt)
  {
   var keyCode,xs;
   keyCode=evt.which;
   Var.Set(Input.KeyListenerState().LastPressed,keyCode);
   xs=Input.KeyListenerState().KeysPressed.Get();
   return!List.exists(function(x)
   {
    return x===keyCode;
   },xs)?Input.KeyListenerState().KeysPressed.Set(List.append(xs,List.ofArray([keyCode]))):null;
  }),void $(Global.document).keyup(function(evt)
  {
   var keyCode;
   function p(x)
   {
    return x!==keyCode;
   }
   keyCode=evt.which;
   return Var.Update(Input.KeyListenerState().KeysPressed,function(l)
   {
    return List.filter(p,l);
   });
  })):null;
 };
 Tree.New=function(Node$1,Left,Right,Height,Count)
 {
  return{
   Node:Node$1,
   Left:Left,
   Right:Right,
   Height:Height,
   Count:Count
  };
 };
 Pair=Collections.Pair=Runtime$1.Class({
  Equals:function(other)
  {
   return Unchecked.Equals(this.Key,other.Key);
  },
  GetHashCode:function()
  {
   return Unchecked.Hash(this.Key);
  },
  CompareTo0:function(other)
  {
   return Unchecked.Compare(this.Key,other.Key);
  }
 },null,Pair);
 Pair.New=function(Key$1,Value)
 {
  return new Pair({
   Key:Key$1,
   Value:Value
  });
 };
 LazyRecord.New=function(created,evalOrVal,force)
 {
  return{
   c:created,
   v:evalOrVal,
   f:force
  };
 };
 DocElemNode=UI.DocElemNode=Runtime$1.Class({
  Equals:function(o)
  {
   return this.ElKey===o.ElKey;
  },
  GetHashCode:function()
  {
   return this.ElKey;
  }
 },null,DocElemNode);
 DocElemNode.New=function(Attr,Children,Delimiters,El,ElKey,Render)
 {
  var $1;
  return new DocElemNode(($1={
   Attr:Attr,
   Children:Children,
   El:El,
   ElKey:ElKey
  },(Runtime$1.SetOptional($1,"Delimiters",Delimiters),Runtime$1.SetOptional($1,"Render",Render),$1)));
 };
 Elt=UI.Elt=Runtime$1.Class({},Doc,Elt);
 Elt.New=function(el,attr$1,children)
 {
  var node,rvUpdates;
  node=Docs.CreateElemNode(el,attr$1,children.docNode);
  rvUpdates=Updates.Create(children.updates);
  return new Elt.New$1({
   $:1,
   $0:node
  },View.Map2Unit(Attrs.Updates(node.Attr),rvUpdates.v),el,rvUpdates);
 };
 Elt.TreeNode=function(tree,updates)
 {
  var rvUpdates,x;
  function f(t)
  {
   return t[1];
  }
  rvUpdates=Updates.Create(updates);
  return new Elt.New$1({
   $:6,
   $0:tree
  },View.Map2Unit((x=Arrays.map(function(x$1)
  {
   return Attrs.Updates(f(x$1));
  },tree.Attrs),Array.TreeReduce(View.Const(),View.Map2Unit,x)),rvUpdates.v),Arrays.get(tree.Els,0),rvUpdates);
 };
 Elt.New$1=Runtime$1.Ctor(function(docNode,updates,elt,rvUpdates)
 {
  Doc.New.call(this,docNode,updates);
  this.docNode$1=docNode;
  this.updates$1=updates;
  this.elt=elt;
  this.rvUpdates=rvUpdates;
 },Elt);
 Ordering.ByLetter={
  $:0
 };
 Ordering.ByFrequency={
  $:1
 };
 Settings.BatchUpdatesEnabled=function()
 {
  SC$26.$cctor();
  return SC$26.BatchUpdatesEnabled;
 };
 Mailbox.StartProcessor=function(procAsync)
 {
  var st;
  function work()
  {
   var b;
   b=null;
   return Concurrency.Delay(function()
   {
    return Concurrency.Bind(procAsync,function()
    {
     var m;
     m=st[0];
     return m===1?(st[0]=0,Concurrency.Zero()):m===2?(st[0]=1,work()):Concurrency.Zero();
    });
   });
  }
  st=[0];
  return function()
  {
   var m;
   m=st[0];
   m===0?(st[0]=1,Concurrency.Start(work(),null)):m===1?st[0]=2:void 0;
  };
 };
 DictionaryUtil.notPresent=function()
 {
  return Operators.FailWith("The given key was not present in the dictionary.");
 };
 Model.New=function(Items)
 {
  return{
   Items:Items
  };
 };
 TodoItem.Create=function(s)
 {
  var K;
  K=Key.Fresh();
  return TodoItem.New(Var.Create$1(false),K,s);
 };
 TodoItem.New=function(Done,Key$1,TodoText)
 {
  return{
   Done:Done,
   Key:Key$1,
   TodoText:TodoText
  };
 };
 ListModel.Create=function(key,init)
 {
  return ListModel.CreateWithStorage(key,Storage.InMemory(Arrays.ofSeq(init)));
 };
 ListModel.CreateWithStorage=function(key,storage)
 {
  return new ListModel.New(key,storage);
 };
 Util.input=function(x)
 {
  return Doc.Input([AttrProxy.Create("class","form-control")],x);
 };
 Util.button=function(name,handler)
 {
  return Doc.Button(name,[AttrProxy.Create("class","btn btn-default")],handler);
 };
 ListModel=UI.ListModel=Runtime$1.Class({
  Remove:function(item)
  {
   var $this,v,keyFn,k;
   $this=this;
   v=this["var"].Get();
   ListModels.Contains($this.key,item,v)?(keyFn=$this.key,k=keyFn(item),this["var"].Set(this.storage.SRemoveIf(function(i)
   {
    return Unchecked.Equals(keyFn(i),k);
   },v)),this.ObsoleteKey(k)):void 0;
  },
  Append:function(item)
  {
   var $this,v,t,m;
   $this=this;
   v=this["var"].Get();
   t=this.key(item);
   m=Arrays.tryFindIndex(function(it)
   {
    return Unchecked.Equals($this.key(it),t);
   },v);
   m!=null&&m.$==1?this["var"].Set(this.storage.SSetAt(m.$0,item,v)):this["var"].Set(this.storage.SAppend(item,v));
   this.ObsoleteKey(t);
  },
  ObsoleteKey:function(key)
  {
   var m,o;
   m=(o=null,[this.it.TryGetValue(key,{
    get:function()
    {
     return o;
    },
    set:function(v)
    {
     o=v;
    }
   }),o]);
   m[0]?(Snap.Obsolete(m[1]),this.it.Remove(key)):void 0;
  },
  GetEnumerator:function()
  {
   return Enumerator.Get(this["var"].Get());
  },
  GetEnumerator0:function()
  {
   return Enumerator.Get0(this["var"].Get());
  }
 },Obj,ListModel);
 ListModel.New=Runtime$1.Ctor(function(key,storage)
 {
  ListModel.New$3.call(this,key,Var.Create$1(Arrays.ofSeq(Seq.distinctBy(key,storage.SInit()))),storage);
 },ListModel);
 ListModel.New$3=Runtime$1.Ctor(function(key,_var,storage)
 {
  this.key=key;
  this["var"]=_var;
  this.storage=storage;
  this.v=View.Map(function(x)
  {
   return x.slice();
  },this["var"].get_View());
  this.it=new Dictionary.New$5();
 },ListModel);
 Anims.Const=function(v)
 {
  return Anims.Def(0,function()
  {
   return v;
  });
 };
 Anims.UseAnimations=function()
 {
  SC$23.$cctor();
  return SC$23.UseAnimations;
 };
 Anims.Def=function(d,f)
 {
  return{
   Compute:f,
   Duration:d
  };
 };
 Anims.Actions=function(a)
 {
  return Anims.ConcatActions(Arrays.choose(function(a$1)
  {
   return a$1.$==1?{
    $:1,
    $0:a$1.$0
   }:null;
  },AppendList.ToArray(a.$0)));
 };
 Anims.Finalize=function(a)
 {
  Arrays.iter(function(a$1)
  {
   if(a$1.$==0)
    a$1.$0();
  },AppendList.ToArray(a.$0));
 };
 Anims.List=function(a)
 {
  return a.$0;
 };
 Anims.ConcatActions=function(xs)
 {
  var xs$1,m,dur,xs$2;
  xs$1=Array.ofSeqNonCopying(xs);
  m=Arrays.length(xs$1);
  return m===0?Anims.Const():m===1?Arrays.get(xs$1,0):(dur=Seq.max(Seq.map(function(anim)
  {
   return anim.Duration;
  },xs$1)),(xs$2=Arrays.map(function(a)
  {
   return Anims.Prolong(dur,a);
  },xs$1),Anims.Def(dur,function(t)
  {
   Arrays.iter(function(anim)
   {
    anim.Compute(t);
   },xs$2);
  })));
 };
 Anims.Prolong=function(nextDuration,anim)
 {
  var comp,dur,last;
  comp=anim.Compute;
  dur=anim.Duration;
  last=Lazy.Create(function()
  {
   return anim.Compute(anim.Duration);
  });
  return{
   Compute:function(t)
   {
    return t>=dur?last.f():comp(t);
   },
   Duration:nextDuration
  };
 };
 AnimatedAttrNode=UI.AnimatedAttrNode=Runtime$1.Class({
  pushVisible:function(el,v)
  {
   this.visible={
    $:1,
    $0:v
   };
   this.dirty=true;
   (this.push(el))(v);
  },
  sync:function(p)
  {
   var x;
   if(this.dirty)
    {
     x=this.logical;
     x==null?void 0:(this.push(p))(x.$0);
     this.visible=this.logical;
     this.dirty=false;
    }
  },
  NChanged:function()
  {
   return this.updates;
  },
  NGetChangeAnim:function(parent)
  {
   var $this,$1,$2,$3;
   $this=this;
   return An.WhenDone(function()
   {
    $this.sync(parent);
   },($1=this.visible,($2=this.logical,$1!=null&&$1.$==1&&($2!=null&&$2.$==1&&(this.dirty&&($3=[$2.$0,$1.$0],true)))?An.Pack(An.Map(function(v)
   {
    $this.pushVisible(parent,v);
   },Trans.AnimateChange(this.tr,$3[1],$3[0]))):An.get_Empty())));
  },
  NGetEnterAnim:function(parent)
  {
   var $this,$1,$2,$3,$4;
   $this=this;
   return An.WhenDone(function()
   {
    $this.sync(parent);
   },($1=this.visible,($2=this.logical,$1!=null&&$1.$==1&&($2!=null&&$2.$==1&&(this.dirty&&($3=[$2.$0,$1.$0],true)))?An.Pack(An.Map(function(v)
   {
    $this.pushVisible(parent,v);
   },Trans.AnimateChange(this.tr,$3[1],$3[0]))):$1==null&&($2!=null&&$2.$==1)?An.Pack(An.Map(function(v)
   {
    $this.pushVisible(parent,v);
   },Trans.AnimateEnter(this.tr,$2.$0))):An.get_Empty())));
  },
  NGetExitAnim:function(parent)
  {
   var $this,m;
   $this=this;
   return An.WhenDone(function()
   {
    $this.dirty=true;
    $this.visible=null;
   },(m=this.visible,m!=null&&m.$==1?An.Pack(An.Map(function(v)
   {
    $this.pushVisible(parent,v);
   },Trans.AnimateExit(this.tr,m.$0))):An.get_Empty()));
  },
  NSync:Global.ignore
 },Obj,AnimatedAttrNode);
 AnimatedAttrNode.New=Runtime$1.Ctor(function(tr,view,push)
 {
  var $this;
  $this=this;
  this.tr=tr;
  this.push=push;
  this.logical=null;
  this.visible=null;
  this.dirty=true;
  this.updates=View.Map(function(x)
  {
   $this.logical={
    $:1,
    $0:x
   };
   $this.dirty=true;
  },view);
 },AnimatedAttrNode);
 BalancedTree.Build=function(data,min,max)
 {
  var center,left,right;
  return max-min+1<=0?null:(center=(min+max)/2>>0,(left=BalancedTree.Build(data,min,center-1),(right=BalancedTree.Build(data,center+1,max),BalancedTree.Branch(Arrays.get(data,center),left,right))));
 };
 BalancedTree.OfSeq=function(data)
 {
  var a;
  a=Arrays.ofSeq(Seq.distinct(data));
  Arrays.sortInPlace(a);
  return BalancedTree.Build(a,0,a.length-1);
 };
 BalancedTree.Branch=function(node,left,right)
 {
  var a,b;
  return Tree.New(node,left,right,1+(a=left==null?0:left.Height,(b=right==null?0:right.Height,Unchecked.Compare(a,b)===1?a:b)),1+(left==null?0:left.Count)+(right==null?0:right.Count));
 };
 BalancedTree.Add=function(x,t)
 {
  return BalancedTree.Put(function($1,$2)
  {
   return $2;
  },x,t);
 };
 BalancedTree.TryFind=function(v,t)
 {
  var x;
  x=(BalancedTree.Lookup(v,t))[0];
  return x==null?null:{
   $:1,
   $0:x.Node
  };
 };
 BalancedTree.Enumerate=function(flip,t)
 {
  function gen(t$1,spine)
  {
   var t$2;
   while(true)
    if(t$1==null)
     return spine.$==1?{
      $:1,
      $0:[spine.$0[0],[spine.$0[1],spine.$1]]
     }:null;
    else
     if(flip)
      {
       t$2=t$1;
       t$1=t$2.Right;
       spine=new T({
        $:1,
        $0:[t$2.Node,t$2.Left],
        $1:spine
       });
      }
     else
      {
       t$2=t$1;
       t$1=t$2.Left;
       spine=new T({
        $:1,
        $0:[t$2.Node,t$2.Right],
        $1:spine
       });
      }
  }
  return Seq.unfold(function($1)
  {
   return gen($1[0],$1[1]);
  },[t,T.Empty]);
 };
 BalancedTree.Put=function(combine,k,t)
 {
  var p,t$1;
  p=BalancedTree.Lookup(k,t);
  t$1=p[0];
  return t$1==null?BalancedTree.Rebuild(p[1],BalancedTree.Branch(k,null,null)):BalancedTree.Rebuild(p[1],BalancedTree.Branch(combine(t$1.Node,k),t$1.Left,t$1.Right));
 };
 BalancedTree.Lookup=function(k,t)
 {
  var spine,t$1,loop,m;
  spine=[];
  t$1=t;
  loop=true;
  while(loop)
   if(t$1==null)
    loop=false;
   else
    {
     m=Unchecked.Compare(k,t$1.Node);
     m===0?loop=false:m===1?(spine.unshift([true,t$1.Node,t$1.Left]),t$1=t$1.Right):(spine.unshift([false,t$1.Node,t$1.Right]),t$1=t$1.Left);
    }
  return[t$1,spine];
 };
 BalancedTree.Rebuild=function(spine,t)
 {
  var t$1,i,$1,m,x,l,m$1,x$1,r,m$2;
  function h(x$2)
  {
   return x$2==null?0:x$2.Height;
  }
  t$1=t;
  for(i=0,$1=Arrays.length(spine)-1;i<=$1;i++){
   t$1=(m=Arrays.get(spine,i),m[0]?(x=m[1],(l=m[2],h(t$1)>h(l)+1?h(t$1.Left)===h(t$1.Right)+1?(m$1=t$1.Left,BalancedTree.Branch(m$1.Node,BalancedTree.Branch(x,l,m$1.Left),BalancedTree.Branch(t$1.Node,m$1.Right,t$1.Right))):BalancedTree.Branch(t$1.Node,BalancedTree.Branch(x,l,t$1.Left),t$1.Right):BalancedTree.Branch(x,l,t$1))):(x$1=m[1],(r=m[2],h(t$1)>h(r)+1?h(t$1.Right)===h(t$1.Left)+1?(m$2=t$1.Right,BalancedTree.Branch(m$2.Node,BalancedTree.Branch(t$1.Node,t$1.Left,m$2.Left),BalancedTree.Branch(x$1,m$2.Right,r))):BalancedTree.Branch(t$1.Node,t$1.Left,BalancedTree.Branch(x$1,t$1.Right,r)):BalancedTree.Branch(x$1,t$1,r))));
  }
  return t$1;
 };
 Fresh$1.Int=function()
 {
  Fresh$1.set_i(Fresh$1.i()+1);
  return Fresh$1.i();
 };
 Fresh$1.set_i=function($1)
 {
  SC$11.$cctor();
  SC$11.i=$1;
 };
 Fresh$1.i=function()
 {
  SC$11.$cctor();
  return SC$11.i;
 };
 Concurrency.Delay=function(mk)
 {
  return function(c)
  {
   try
   {
    (mk(null))(c);
   }
   catch(e)
   {
    c.k({
     $:1,
     $0:e
    });
   }
  };
 };
 Concurrency.Bind=function(r,f)
 {
  return Concurrency.checkCancel(function(c)
  {
   r(AsyncBody.New(function(a)
   {
    var x;
    if(a.$==0)
     {
      x=a.$0;
      Concurrency.scheduler().Fork(function()
      {
       try
       {
        (f(x))(c);
       }
       catch(e)
       {
        c.k({
         $:1,
         $0:e
        });
       }
      });
     }
    else
     Concurrency.scheduler().Fork(function()
     {
      c.k(a);
     });
   },c.ct));
  });
 };
 Concurrency.Return=function(x)
 {
  return function(c)
  {
   c.k({
    $:0,
    $0:x
   });
  };
 };
 Concurrency.Start=function(c,ctOpt)
 {
  var ct,d;
  ct=(d=(Concurrency.defCTS())[0],ctOpt==null?d:ctOpt.$0);
  Concurrency.scheduler().Fork(function()
  {
   if(!ct.c)
    c(AsyncBody.New(function(a)
    {
     if(a.$==1)
      Concurrency.UncaughtAsyncError(a.$0);
    },ct));
  });
 };
 Concurrency.Zero=function()
 {
  SC$27.$cctor();
  return SC$27.Zero;
 };
 Concurrency.FromContinuations=function(subscribe)
 {
  return function(c)
  {
   var continued;
   function once(cont)
   {
    if(continued[0])
     Operators.FailWith("A continuation provided by Async.FromContinuations was invoked multiple times");
    else
     {
      continued[0]=true;
      Concurrency.scheduler().Fork(cont);
     }
   }
   continued=[false];
   subscribe(function(a)
   {
    once(function()
    {
     c.k({
      $:0,
      $0:a
     });
    });
   },function(e)
   {
    once(function()
    {
     c.k({
      $:1,
      $0:e
     });
    });
   },function(e)
   {
    once(function()
    {
     c.k({
      $:2,
      $0:e
     });
    });
   });
  };
 };
 Concurrency.checkCancel=function(r)
 {
  return function(c)
  {
   if(c.ct.c)
    Concurrency.cancel(c);
   else
    r(c);
  };
 };
 Concurrency.defCTS=function()
 {
  SC$27.$cctor();
  return SC$27.defCTS;
 };
 Concurrency.UncaughtAsyncError=function(e)
 {
  console.log("WebSharper: Uncaught asynchronous exception",e);
 };
 Concurrency.Sleep=function(ms)
 {
  return function(c)
  {
   var pending,creg;
   pending=void 0;
   creg=void 0;
   pending=Global.setTimeout(function()
   {
    creg.Dispose();
    Concurrency.scheduler().Fork(function()
    {
     c.k({
      $:0,
      $0:null
     });
    });
   },ms);
   creg=Concurrency.Register(c.ct,function()
   {
    Global.clearTimeout(pending);
    Concurrency.scheduler().Fork(function()
    {
     Concurrency.cancel(c);
    });
   });
  };
 };
 Concurrency.cancel=function(c)
 {
  c.k({
   $:2,
   $0:new OperationCanceledException.New(c.ct)
  });
 };
 Concurrency.scheduler=function()
 {
  SC$27.$cctor();
  return SC$27.scheduler;
 };
 Concurrency.Register=function(ct,callback)
 {
  var i;
  return ct===Concurrency.noneCT()?{
   Dispose:function()
   {
    return null;
   }
  }:(i=ct.r.push(callback)-1,{
   Dispose:function()
   {
    return Arrays.set(ct.r,i,Global.ignore);
   }
  });
 };
 Concurrency.StartWithContinuations=function(c,s,f,cc,ctOpt)
 {
  var ct,d;
  ct=(d=(Concurrency.defCTS())[0],ctOpt==null?d:ctOpt.$0);
  !ct.c?c(AsyncBody.New(function(a)
  {
   if(a.$==1)
    f(a.$0);
   else
    if(a.$==2)
     cc(a.$0);
    else
     s(a.$0);
  },ct)):void 0;
 };
 Concurrency.noneCT=function()
 {
  SC$27.$cctor();
  return SC$27.noneCT;
 };
 SC$25.$cctor=function()
 {
  SC$25.$cctor=Global.ignore;
  SC$25.counter=0;
 };
 PathUtil.WriteLink=function(s,q)
 {
  var query;
  query=q.get_IsEmpty()?"":"?"+PathUtil.WriteQuery(q);
  return"/"+PathUtil.Concat(s)+query;
 };
 PathUtil.WriteQuery=function(q)
 {
  function m(k,v)
  {
   return k+"="+v;
  }
  return Strings.concat("&",Seq.map(function($1)
  {
   return m($1[0],$1[1]);
  },Map.ToSeq(q)));
 };
 PathUtil.Concat=function(xs)
 {
  var sb,start;
  sb=[];
  start=true;
  List.iter(function(x)
  {
   if(!Strings.IsNullOrEmpty(x))
    {
     start?start=false:sb.push("/");
     sb.push(x);
    }
  },xs);
  return Strings.Join("",Arrays.ofSeq(sb));
 };
 Dyn.New=function(DynElem,DynFlags,DynNodes,OnAfterRender)
 {
  var $1;
  $1={
   DynElem:DynElem,
   DynFlags:DynFlags,
   DynNodes:DynNodes
  };
  Runtime$1.SetOptional($1,"OnAfterRender",OnAfterRender);
  return $1;
 };
 Updates=UI.Updates=Runtime$1.Class({},null,Updates);
 Updates.Create=function(v)
 {
  var _var;
  _var=null;
  _var=Updates.New(v,null,function()
  {
   var c;
   c=_var.s;
   return c===null?(c=Snap.Copy(_var.c()),_var.s=c,Snap.WhenObsoleteRun(c,function()
   {
    _var.s=null;
   }),c):c;
  });
  return _var;
 };
 Updates.New=function(Current,Snap$1,VarView)
 {
  return new Updates({
   c:Current,
   s:Snap$1,
   v:VarView
  });
 };
 DataEntry.New=function(DataLabel,DataValue)
 {
  return{
   DataLabel:DataLabel,
   DataValue:DataValue
  };
 };
 DataView.New=function(Label,Value,Rank,MaxValue,NumData)
 {
  return{
   Label:Label,
   Value:Value,
   Rank:Rank,
   MaxValue:MaxValue,
   NumData:NumData
  };
 };
 SC$26.$cctor=function()
 {
  SC$26.$cctor=Global.ignore;
  SC$26.BatchUpdatesEnabled=true;
  SC$26.LoadedTemplates=new Dictionary.New$5();
  SC$26.LocalTemplatesLoaded=false;
  SC$26.TextHoleRE="\\${([^}]+)}";
 };
 RunState.New=function(PreviousNodes,Top)
 {
  return{
   PreviousNodes:PreviousNodes,
   Top:Top
  };
 };
 NodeSet.get_Empty=function()
 {
  return{
   $:0,
   $0:new HashSet.New$3()
  };
 };
 NodeSet.FindAll=function(doc)
 {
  var q;
  function loop(node)
  {
   if(node!=null&&node.$==0)
    {
     loop(node.$0);
     loop(node.$1);
    }
   else
    if(node!=null&&node.$==1)
     loopEN(node.$0);
    else
     if(node!=null&&node.$==2)
      loop(node.$0.Current);
     else
      if(node!=null&&node.$==6)
       Arrays.iter(loopEN,node.$0.Holes);
  }
  function loopEN(el)
  {
   q.push(el);
   loop(el.Children);
  }
  q=[];
  loop(doc);
  return{
   $:0,
   $0:new HashSet.New$2(q)
  };
 };
 NodeSet.Filter=function(f,a)
 {
  return{
   $:0,
   $0:HashSet$1.Filter(f,a.$0)
  };
 };
 NodeSet.Intersect=function(a,a$1)
 {
  return{
   $:0,
   $0:HashSet$1.Intersect(a.$0,a$1.$0)
  };
 };
 NodeSet.ToArray=function(a)
 {
  return HashSet$1.ToArray(a.$0);
 };
 NodeSet.Except=function(a,a$1)
 {
  return{
   $:0,
   $0:HashSet$1.Except(a.$0,a$1.$0)
  };
 };
 Key.Fresh=function()
 {
  return{
   $:0,
   $0:Fresh.Int()
  };
 };
 Storage.InMemory=function(init)
 {
  return new ArrayStorage.New(init);
 };
 Arrays.mapiInPlace=function(f,arr)
 {
  var i,$1;
  for(i=0,$1=arr.length-1;i<=$1;i++)arr[i]=f(i,arr[i]);
  return arr;
 };
 Arrays.mapInPlace=function(f,arr)
 {
  var i,$1;
  for(i=0,$1=arr.length-1;i<=$1;i++)arr[i]=f(arr[i]);
 };
 Seq.insufficient=function()
 {
  return Operators.FailWith("The input sequence has an insufficient number of elements.");
 };
 AsyncBody.New=function(k,ct)
 {
  return{
   k:k,
   ct:ct
  };
 };
 CT.New=function(IsCancellationRequested,Registrations)
 {
  return{
   c:IsCancellationRequested,
   r:Registrations
  };
 };
 DynamicAttrNode=UI.DynamicAttrNode=Runtime$1.Class({
  NChanged:function()
  {
   return this.updates;
  },
  NGetChangeAnim:function(parent)
  {
   return An.get_Empty();
  },
  NGetEnterAnim:function(parent)
  {
   return An.get_Empty();
  },
  NGetExitAnim:function(parent)
  {
   return An.get_Empty();
  },
  NSync:function(parent)
  {
   if(this.dirty)
    {
     (this.push(parent))(this.value);
     this.dirty=false;
    }
  }
 },Obj,DynamicAttrNode);
 DynamicAttrNode.New=Runtime$1.Ctor(function(view,push)
 {
  var $this;
  $this=this;
  this.push=push;
  this.value=void 0;
  this.dirty=false;
  this.updates=View.Map(function(x)
  {
   $this.value=x;
   $this.dirty=true;
  },view);
 },DynamicAttrNode);
 SC$27.$cctor=function()
 {
  SC$27.$cctor=Global.ignore;
  SC$27.noneCT=CT.New(false,[]);
  SC$27.scheduler=new Scheduler.New();
  SC$27.defCTS=[new CancellationTokenSource.New()];
  SC$27.Zero=Concurrency.Return();
  SC$27.GetCT=function(c)
  {
   c.k({
    $:0,
    $0:c.ct
   });
  };
 };
 FormatException=WebSharper.FormatException=Runtime$1.Class({},null,FormatException);
 FormatException.New=Runtime$1.Ctor(function()
 {
  FormatException.New$1.call(this,"One of the identified items was in an invalid format.");
 },FormatException);
 FormatException.New$1=Runtime$1.Ctor(function(message)
 {
  this.message=message;
 },FormatException);
 AppendList.Append=function(x,y)
 {
  return x.$==0?y:y.$==0?x:{
   $:2,
   $0:x,
   $1:y
  };
 };
 AppendList.Concat=function(xs)
 {
  var x;
  x=Array.ofSeqNonCopying(xs);
  return Array.TreeReduce(AppendList.Empty(),AppendList.Append,x);
 };
 AppendList.ToArray=function(xs)
 {
  var out;
  function loop(xs$1)
  {
   if(xs$1.$==1)
    out.push(xs$1.$0);
   else
    if(xs$1.$==2)
     {
      loop(xs$1.$0);
      loop(xs$1.$1);
     }
    else
     if(xs$1.$==3)
      Arrays.iter(function(v)
      {
       out.push(v);
      },xs$1.$0);
  }
  out=[];
  loop(xs);
  return out.slice(0);
 };
 AppendList.Empty=function()
 {
  SC$28.$cctor();
  return SC$28.Empty;
 };
 AppendList.Single=function(x)
 {
  return{
   $:1,
   $0:x
  };
 };
 Queue.Clear=function(a)
 {
  a.splice(0,Arrays.length(a));
 };
 ArrayStorage=Storage.ArrayStorage=Runtime$1.Class({
  SRemoveIf:function(pred,arr)
  {
   return Arrays.filter(function(i)
   {
    return!pred(i);
   },arr);
  },
  SSetAt:function(idx,elem,arr)
  {
   Arrays.set(arr,idx,elem);
   return arr;
  },
  SAppend:function(i,arr)
  {
   arr.push(i);
   return arr;
  },
  SInit:function()
  {
   return this.init;
  }
 },Obj,ArrayStorage);
 ArrayStorage.New=Runtime$1.Ctor(function(init)
 {
  this.init=init;
 },ArrayStorage);
 ListModels.Contains=function(keyFn,item,xs)
 {
  var t;
  t=keyFn(item);
  return Arrays.exists(function(it)
  {
   return Unchecked.Equals(keyFn(it),t);
  },xs);
 };
 Scheduler=Concurrency.Scheduler=Runtime$1.Class({
  Fork:function(action)
  {
   var $this;
   $this=this;
   this.robin.push(action);
   this.idle?(this.idle=false,Global.setTimeout(function()
   {
    $this.tick();
   },0)):void 0;
  },
  tick:function()
  {
   var loop,$this,t;
   $this=this;
   t=Date.now();
   loop=true;
   while(loop)
    if(this.robin.length===0)
     {
      this.idle=true;
      loop=false;
     }
    else
     {
      (this.robin.shift())();
      Date.now()-t>40?(Global.setTimeout(function()
      {
       $this.tick();
      },0),loop=false):void 0;
     }
  }
 },Obj,Scheduler);
 Scheduler.New=Runtime$1.Ctor(function()
 {
  this.idle=true;
  this.robin=[];
 },Scheduler);
 CancellationTokenSource=WebSharper.CancellationTokenSource=Runtime$1.Class({},Obj,CancellationTokenSource);
 CancellationTokenSource.New=Runtime$1.Ctor(function()
 {
  this.c=false;
  this.pending=null;
  this.r=[];
  this.init=1;
 },CancellationTokenSource);
 HashSetUtil.concat=function(o)
 {
  var r,k;
  r=[];
  for(var k$1 in o)r.push.apply(r,o[k$1]);
  return r;
 };
 HashSet$1.Filter=function(ok,set)
 {
  return new HashSet.New$2(Arrays.filter(ok,HashSet$1.ToArray(set)));
 };
 HashSet$1.Intersect=function(a,b)
 {
  var set;
  set=new HashSet.New$2(HashSet$1.ToArray(a));
  set.IntersectWith(HashSet$1.ToArray(b));
  return set;
 };
 HashSet$1.ToArray=function(set)
 {
  var arr;
  arr=Arrays.create(set.get_Count(),void 0);
  set.CopyTo(arr);
  return arr;
 };
 HashSet$1.Except=function(excluded,included)
 {
  var set;
  set=new HashSet.New$2(HashSet$1.ToArray(included));
  set.ExceptWith(HashSet$1.ToArray(excluded));
  return set;
 };
 OperationCanceledException=WebSharper.OperationCanceledException=Runtime$1.Class({},null,OperationCanceledException);
 OperationCanceledException.New=Runtime$1.Ctor(function(ct)
 {
  OperationCanceledException.New$1.call(this,"The operation was canceled.",null,ct);
 },OperationCanceledException);
 OperationCanceledException.New$1=Runtime$1.Ctor(function(message,inner,ct)
 {
  this.message=message;
  this.inner=inner;
  this.ct=ct;
 },OperationCanceledException);
 DomNodes.DocChildren=function(node)
 {
  var q;
  function loop(doc)
  {
   if(doc!=null&&doc.$==2)
    loop(doc.$0.Current);
   else
    if(doc!=null&&doc.$==1)
     q.push(doc.$0.El);
    else
     if(doc==null)
      ;
     else
      if(doc!=null&&doc.$==5)
       q.push(doc.$0);
      else
       if(doc!=null&&doc.$==4)
        q.push(doc.$0.Text);
       else
        if(doc!=null&&doc.$==6)
         Arrays.iter(function(a)
         {
          if(a.constructor===Object)
           loop(a);
          else
           q.push(a);
         },doc.$0.Els);
        else
         {
          loop(doc.$0);
          loop(doc.$1);
         }
  }
  q=[];
  loop(node.Children);
  return{
   $:0,
   $0:Array.ofSeqNonCopying(q)
  };
 };
 DomNodes.Children=function(elem,delims)
 {
  var n,o,a;
  if(delims!=null&&delims.$==1)
   {
    a=[];
    n=delims.$0[0].nextSibling;
    while(n!==delims.$0[1])
     {
      a.push(n);
      n=n.nextSibling;
     }
    return{
     $:0,
     $0:a
    };
   }
  else
   return{
    $:0,
    $0:Arrays.init(elem.childNodes.length,(o=elem.childNodes,function(a$1)
    {
     return o[a$1];
    }))
   };
 };
 DomNodes.Except=function(a,a$1)
 {
  var excluded;
  excluded=a.$0;
  return{
   $:0,
   $0:Arrays.filter(function(n)
   {
    return Arrays.forall(function(k)
    {
     return!(n===k);
    },excluded);
   },a$1.$0)
  };
 };
 DomNodes.Iter=function(f,a)
 {
  Arrays.iter(f,a.$0);
 };
 CheckedInput=UI.CheckedInput=Runtime$1.Class({
  get_Input:function()
  {
   return this.$==1?this.$0:this.$==2?this.$0:this.$1;
  }
 },null,CheckedInput);
 SC$28.$cctor=function()
 {
  SC$28.$cctor=Global.ignore;
  SC$28.Empty={
   $:0
  };
 };
 String.isBlank=function(s)
 {
  return Strings.forall(Char.IsWhiteSpace,s);
 };
 Char.IsWhiteSpace=function(c)
 {
  return c.match(new Global.RegExp("\\s"))!==null;
 };
 Numeric.TryParse=function(s,min,max,r)
 {
  var x,ok;
  x=+s;
  ok=x===x-x%1&&x>=min&&x<=max;
  ok?r.set(x):void 0;
  return ok;
 };
 Runtime$1.OnLoad(function()
 {
  Client.Main();
 });
}());


if (typeof IntelliFactory !=='undefined')
  IntelliFactory.Runtime.Start();

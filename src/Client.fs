// $begin{copyright}
//
// This file is confidential and proprietary.
//
// Copyright (c) IntelliFactory, 2004-2014.
//
// All rights reserved.  Reproduction or use in whole or in part is
// prohibited without the written consent of the copyright holder.
//-----------------------------------------------------------------
// $end{copyright}

namespace IntelliFactory.WebSharper.UI.Next

open IntelliFactory.WebSharper

[<JavaScript>]
module Client =

    let Main =
        Site.Main [
            SimpleTextBox.Sample
            InputTransform.Sample
            TodoList.Sample
            PhoneExample.Sample
            EditablePersonList.Sample
            CheckBoxTest.Sample
            Calculator.Sample
            ContactFlow.Sample
            AnimatedContactFlow.Sample
            MessageBoard.Sample
            BobsleighSite.Sample
            RoutedBobsleighSite.Sample
            AnimatedBobsleighSite.Sample
            ObjectConstancy.Sample
            MouseInfo.Sample
            KeyboardInfo.Sample
      //      SortableBarChart.Sample
        ]
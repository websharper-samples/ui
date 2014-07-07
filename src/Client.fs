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

    let All =
        [
            SimpleTextBox.Sample
            TodoList.Sample
            PhoneExample.Sample
            CheckBoxTest.Sample
            MouseChase.Sample
            Calculator.Sample
        ]

    let Main =
        Samples.Show All
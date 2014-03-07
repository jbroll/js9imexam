/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, continue: true */
/*globals $, JS9, greg */ 

"use strict";


(function () {
    var imexam = require("./imexam");

/*
    $("table").delegate('td','mouseover mouseleave', function(e) {
	if (e.type == 'mouseover') {
	    $(this).parent().addClass("hover");
	    $("colgroup").eq($(this).index()).addClass("hover");
	} else {
	    $(this).parent().removeClass("hover");
	    $("colgroup").eq($(this).index()).removeClass("hover");
	}
    });
 */

    function strrep(x, n) {
	var s = '';
	for (;;) {
	    if (n & 1) s += x;
	    n >>= 1;
	    if (n) x += x;
	    else break;
	}
	return s;
    }

    function htmlTable(x, y) {
	var t = "<table>"
	t    += strrep("<column group>", y);
	t    += strrep( "<tr>" + strrep("<td>X</td>", y) + "</tr>", x);
	t    += "</table>";

	return t;
    }


  //   $(this).css({"font-size" : newFontSize, "line-height" : newFontSize/1.2 + "px"});

    function pluginUpdate(im, xreg) {
            var section = imexam.reg2section(xreg);
            var im_2d   = imexam.ndarray(im.raw.data, [im.raw.height, im.raw.width]);
            var imag    = imexam.ndops.section(im_2d, section);

	    $(this.div).html(htmlTable(10, 10));
    }

    function pluginInit() {
	imexam.fixupDiv(this);
    }

    JS9.RegisterPlugin("ImExam", "PxTabl", pluginInit, {
	    menu: "analysis",

            menuItem: "Pixel Table",
            winTitle: "Pixel Table",
	    help:     "imexam/imexam.html#pxtabl",

	    toolbarSeparate: true,
	    toolbarHTML: " ",

            regionchange: pluginUpdate,
            winDims: [250, 250],
    });
}());


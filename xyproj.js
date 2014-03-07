/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9 */ 

"use strict";


(function() {
    var imexam = require("./imexam");


    var projToolbar = "                                      	\
                 <select  class='proj_menu'> 			\
                        <option>sum</option>                    \
                        <option>avg</option>                    \
                        <option>med</option>                    \
                </select>";

    function projUpdate(im, xreg) {
	var div, proj, menx;

        if ( im === undefined ) {
	    div  = xreg.div;
	    proj = xreg.proj;
	    menx = xreg.menu;
	} else {
	    div  = this.div; 

	    var axis    = this.plugin.opts.xyproj;

            var section = imexam.reg2section(xreg);
            var im_2d   = imexam.ndarray(im.raw.data, [im.raw.height, im.raw.width]);
	    var imag;

	    if ( xreg.angle && xreg.angle !== 0 ) {
		imag = imexam.ndops.ndarray([xreg.size.width, xreg.size.height]);

		imexam.ndops.rotate(imag, im_2d, xreg.angle/57.29577951, xreg.pos.y, xreg.pos.x);
	    } else {
		imag    = imexam.ndops.section(im_2d, section);
	    }

            proj = imexam.ndops.proj(imag, axis);

	    menx = $(this.toolbar).find(".proj_menu")[0];

	    $(menx).change(function (event) {
		    projUpdate(undefined, { div: div, proj: proj, menu: menx });
		});
	}


	var xdata = [];
	var  data;
	var x;

	var proj_type = menx.options[menx.selectedIndex].value;

	$(div).empty();

	if ( proj_type === "sum" ) {
		data = proj.sum;
	}
	if ( proj_type === "avg" ) {
		data = proj.avg;
	}
	if ( proj_type === "med" ) {
		data = proj.med;
	}


	for ( x = 0;  x < proj.shape[0]; x++ ) {
		xdata[x] = [x, data.get(x)];
	}

	$.plot(div, [xdata]);
    }

    function projInit() {
	imexam.fixupDiv(this);
        $(this.div).append("Create a region to see projection<br>");
    }

    JS9.RegisterPlugin("ImExam", "XProj", projInit, {
	    menu: "analysis",

            menuItem: "X Projection",
	    winTitle: "X Projection",
	    help:     "imexam/imexam.html#xyproj",

	    toolbarSeparate: true,
	    toolbarHTML: projToolbar,

            regionchange: projUpdate,

            winDims: [250, 250],

            xyproj: 0
    });

    JS9.RegisterPlugin("ImExam", "YProj", projInit, {
	    menu: "analysis",

            menuItem: "Y Projection",
	    winTitle: "Y Projection",
	    help:     "imexam/imexam.html#xyproj",

	    toolbarSeparate: true,
	    toolbarHTML: projToolbar,

            regionchange: projUpdate,

            winDims: [250, 250],

            xyproj: 1
    });
}());

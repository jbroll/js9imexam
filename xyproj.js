/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9 */ 

"use strict";


(function() {
    var imexam = require("./imexam");


    var projTemplate = "                                                \
        <div style='position:absolute;right: 10px;top:10px'>            \
                 <select class='proj_menu' onchange='imexamUpdate(undefined, $(this).parents('.js9imexam-box')[0]);'> \
                        <option>sum</option>                            \
                        <option>avg</option>                            \
                        <option>med</option>                            \
                </select> \
        </div>";

    function projUpdate(im, xreg) {
        var div = this.div;

	    var axis    = this.plugin.opts.xyproj;

            var section = imexam.reg2section(xreg);
            var im_2d   = imexam.ndarray(im.raw.data, [im.raw.height, im.raw.width]);
            var imag    = imexam.ndops.section(im_2d, section);

	    if ( xreg.angle && xreg.angle != 0 ) {
		imag = imexam.ndops.ndarray([xreg.width, xreg.height])

		imexam.ndops.rotate(imag, im_2d, xreg.angle/57.29577951, xreg.pos.x, xreg.pos.y);
	    }
            var proj    = imexam.ndops.proj(imag, axis);

            var xdata = [];
	    var  data;
            var x;

            var xmenu = $(div).find(".proj_menu")[0];

            var proj_indx;
            var proj_type;

            if ( xmenu === undefined ) {
                    proj_type = "sum";
                    proj_indx = 0;
            } else {
                    proj_indx = xmenu.selectedIndex;
                    proj_type = xmenu.options[xmenu.selectedIndex].value;
            }

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
                    xdata[x] = [x+section[axis][0], data.get(x)];
            }

            $.plot(div, [xdata], { xaxis: { min: section[axis][0], max: section[axis][1] }});


            $(div).append(projTemplate);
            xmenu = $(div).find(".proj_menu")[0];
            xmenu.selectedIndex = proj_indx;
    }

    function projInit() {
	JS9.DecoratePlugin(this);

        $(this.div).append("Create a region to see projection<br>");
        $(this.div).append(projTemplate);
    }

    JS9.RegisterPlugin("ImExam", "XProj", projInit, {
	    menu: "analysis",

            menuItem: "X Projection",
	    winTitle: "X Projection",

            regionchange: projUpdate,
            winDims: [250, 250],

	    html: "imexam/xyproj.html"
            xyproj: 0
    });

    JS9.RegisterPlugin("ImExam", "YProj", projInit, {
	    menu: "analysis",

            menuItem: "Y Projection",
	    winTitle: "Y Projection",

            regionchange: projUpdate,
            winDims: [250, 250],

	    html: "imexam/xyproj.html"
            xyproj: 1
    });
}());

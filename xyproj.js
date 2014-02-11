/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9 */ 

"use strict";

      JS9.DecoratePlugin = function (plugin) {
	var type = plugin.type;
	var div  = plugin.div;

	if ( type === "div" ) {
	    $(div).css("border",  "1px solid black");
	} else {
	    $(div).css("height", "100%");
	}
      };


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

            var section = imexam.reg2section(xreg);
            var im_2d   = imexam.ndarray(im.raw.data, [im.raw.height, im.raw.width]);
            var imag    = imexam.ndops.section(im_2d, section);
            var proj    = imexam.ndops.proj(imag, this.plugin.opts.xyproj);

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
                    xdata[x] = [x+section[0][0], data.get(x)];
            }

            $.plot(div, [xdata], { xaxis: { min: section[0][0], max: section[0][1] }});


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
            viewMenuItem: "XProj",
            regionchange: projUpdate,
            windowDims: [250, 250],

            xyproj: 0
    });

    JS9.RegisterPlugin("ImExam", "YProj", projInit, {
            viewMenuItem: "YProj",
            regionchange: projUpdate,
            windowDims: [250, 250],

            xyproj: 1
    });
}());

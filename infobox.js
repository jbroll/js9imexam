/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9 */ 

"use strict";


(function() {
    var imexam = require("./imexam");


    var infoTemplate = "                                                                                \
        <table width=100%>                                                                              \
            <tr><td align=left>File</td>	<td colspan=4 align=left>{file}</td>          		\
            </tr>      											\
            <tr><td align=left>Object</td>	<td colspan=4 align=left>{obj}</td>          		\
            </tr>      											\
            <tr><td align=left>WCS</td>		<td align=right>X</td><td align=right>{xw%8.3f}</td>    \
                                         	<td align=right>Y</td><td align=right>{yw%8.3f}</td>    \
            </tr>      											\
            <tr><td align=left>Physical</td>	<td align=right>X</td><td align=right>{xp%8.3f}</td>    \
                                         	<td align=right>Y</td><td align=right>{yp%8.3f}</td>    \
            </tr>      											\
            <tr><td align=left>Image</td>	<td align=right>X</td><td align=right>{xi%8.3f}</td>    \
                                         	<td align=right>Y</td><td align=right>{yi%8.3f}</td>    \
            </tr>      											\
        </table>";

    function infoUpdate(im, point) {
        var div = this.div;

	var point = point || {};

	var info = {   file: im.file
		 , obj:  im.raw.header["OBJECT"] || ""
		 , xi: point.x || "", yi: point.y || ""
		 , xp: point.x || "", yp: point.y || ""
		 , xw: point.x || "", yw: point.y || ""
	}
	

	$(div).html(imexam.template(infoTemplate, info));
    }

    function infoInit() {
    }

    JS9.RegisterPlugin("ImExam", "InfoBox", infoInit, {

            winTitle: "XInfo Box",
            menuItem: "XInfo Box",
	    help:     "imexam/imexam.html#infobox",

	    onimageload:    infoUpdate,
	    onimagedisplay: infoUpdate,
            onmousemove:    infoUpdate,
    //        winDims: [250, 250],
    });
}());

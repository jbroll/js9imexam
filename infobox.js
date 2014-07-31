/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9 */ 

"use strict";


(function() {
    var imexam = require("./imexam");


    var infoTemplate = "                                                                                \
        <table width=100%>                                                                              \
            <tr><td align=left>File</td><td align=right>{file} </td>          \
                <td align=right>y</td>              <td align=right>{reg.y%.2f}             </td></tr>      \
            <tr><td align=right>width</td>      <td align=right>{reg.width%.2f}         </td>           \
            <td align=right>height</td>         <td align=right>{reg.height%.2f}        </td></tr>      \
            <tr><td align=right>min</td>        <td align=right>{min%.2f}               </td>           \
            <td align=right>max</td>            <td align=right>{max%.2f}               </td></tr>      \
            <tr><td align=right>counts</td>     <td align=right colspan=3>{centroid.sum%.2f}</tr>       \
            <tr><td align=right>bkgrnd</td>     <td align=right>{backgr.value%.2f}      </td>           \
            <td align=right>noise</td>          <td align=right>{backgr.noise%.2f}      </td></tr>      \
            <tr><td align=right>Centroid x</td> <td align=right>{centroid.cenx%.2f}     </td>           \
            <td align=right>y</td>              <td align=right>{centroid.ceny%.2f}     </td></tr>      \
            <tr><td align=right>FWHM</td>       <td align=right>{centroid.fwhm%.2f}     </td>           \
            <td align=right></td>            <td align=right>{centroid.rms%.2f}      </td></tr>         \
        </table>";

    function statUpdate(im, point) {
        var div = this.div;

	    info = { file: im.filename
		     obj:  im.raw.head["OBJECT"] || ""
		     xi: point.x || "", yi: point.y || ""
		     xp: point.x || "", yp: point.y || ""
		     xw: point.x || "", yw: point.y || ""
	    }
	    

            $(div).html(imexam.template(infoTemplate, info));
    }

    function infoInit() {
    }

    JS9.RegisterPlugin("ImExam", "InfoBox", infoInit, {

            winTitle: "XInfo Box",
            menuItem: "XInfo Box",
	    help:     "imexam/imexam.html#infobox",

	    toolbarSeparate: true,

	    onimageload:    infoUpdate,
	    onimagedisplay: infoUpdate,
            onmousemove:    infoUpdate,
            winDims: [250, 250],
    });
}());

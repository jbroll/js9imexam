/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9 */ 

"use strict";


(function() {
    var imexam = require("./imexam");


    var statTemplate = "                                                                                \
        <table width=100%>                                                                              \
            <tr><td align=right>Position X</td><td align=right>{reg.pos.x%.2f}          </td>           \
            <td align=right>Y</td>              <td align=right>{reg.pos.y%.2f}         </td></tr>      \
            <tr><td align=right>width</td>      <td align=right>{reg.size.width%.2f}    </td>           \
            <td align=right>height</td>         <td align=right>{reg.size.height%.2f}   </td></tr>      \
            <tr><td align=right>min</td>        <td align=right>{min%.2f}               </td>           \
            <td align=right>max</td>            <td align=right>{max%.2f}               </td></tr>      \
            <tr><td align=right>Counts</td>     <td align=right colspan=3>{centroid.sum%.2f}</tr>       \
            <tr><td align=right>backgr</td>     <td align=right>{backgr.value%.2f}      </td>           \
            <td align=right>noise</td>          <td align=right>{backgr.noise%.2f}      </td></tr>      \
            <tr><td align=right>Centroid X</td> <td align=right>{centroid.cenx%.2f}     </td>           \
            <td align=right>Y</td>              <td align=right>{centroid.ceny%.2f}     </td></tr>      \
            <tr><td align=right>FWHM</td>       <td align=right>{centroid.fwhm%.2f}     </td>           \
            <td align=right></td>            <td align=right>{centroid.rms%.2f}      </td></tr>      \
        </table>";

    function statUpdate(im, xreg) {
        var div = this.div;

            var section = imexam.reg2section(xreg);
            var im_2d   = imexam.ndarray(im.raw.data, [im.raw.height, im.raw.width]);
	    var imag;

	    if ( xreg.angle && xreg.angle !== 0 ) {
		imag = imexam.ndops.ndarray([xreg.size.width, xreg.size.height]);

		imexam.ndops.rotate(imag, im_2d, xreg.angle/57.29577951, xreg.pos.y, xreg.pos.x);
	    } else {
		imag    = imexam.ndops.section(im_2d, section);
	    }

            var data    = imexam.ndops.assign(imexam.ndops.ndarray(imag.shape), imag);

            var stat    = {};

            stat.reg = xreg;
            stat.min = imexam.ndops.minvalue(imag);
            stat.max = imexam.ndops.maxvalue(imag);
            stat.backgr  = imexam.imops.backgr(imag, 4);

            imexam.ndops.subs(data, imag, stat.backgr.value);

            stat.qcenter  = imexam.ndops.qcenter(data);
            stat.centroid = imexam.ndops.centroid(data, imexam.ndops.qcenter(data));

            stat.centroid.cenx += section[0][0];
            stat.centroid.ceny += section[1][0];

            $(div).html(imexam.template(statTemplate, stat));
    }

    function statInit() {
	JS9.DecoratePlugin(this);
        $(this.div).append("Create a region to see stats<br>");
    }

    JS9.RegisterPlugin("ImExam", "RegionStats", statInit, {
	    menu: "analysis",

            winTitle: "Region Stats",
            menuItem: "Region Stats",

            regionchange: statUpdate,
            winDims: [250, 250],

	    help: "Foo"
    });
}());

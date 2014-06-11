/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9 */ 

"use strict";


(function() {
    function zoomStackIn(plot, event, ranges, func) {
	var axes = plot.getAxes();
	var div  = plot.getPlaceholder();

	var r = {};
	r.xmin = axes.xaxis.min;
	r.xmax = axes.xaxis.max;
	r.ymin = axes.yaxis.min;
	r.ymax = axes.yaxis.max;

	plot.stack.push(r);

	axes.xaxis.options.min = ranges.xaxis.from;
	axes.xaxis.options.max = ranges.xaxis.to;
	axes.yaxis.options.min = ranges.yaxis.from;
	axes.yaxis.options.max = ranges.yaxis.to;

	plot.clearSelection(true);

	plot.setupGrid();
	plot.draw();

	$(div).find(".zoomout").css("visibility", "visible");

	if ( func !== undefined ) { func(plot, r); }
    }

    function zoomStackOut(plot, func) {
	var r    = plot.stack.pop();
	var div  = plot.getPlaceholder();

	if (  plot.stack.length === 0 ) {
	    $(div).find(".zoomout").css("visibility", "hidden");
	}

	plot.getAxes().xaxis.options.min = r.xmin;
	plot.getAxes().xaxis.options.max = r.xmax;
	plot.getAxes().yaxis.options.min = r.ymin;
	plot.getAxes().yaxis.options.max = r.ymax;

	plot.clearSelection(true);

	plot.setupGrid();
	plot.draw();

	if ( func !== undefined ) { func(plot, r); }
    }

    exports.zoomStack = function (plot, func) {
	plot.stack = [];
	var div = plot.getPlaceholder();

	$(div).append("<div style='position:relative'><div style='position:absolute;right:12;top:12;z-index:2'>		\
		<image class='zoomout'  src=plugins/imexam/4arrow.png></div></div>");

	$(div).bind("plotselected", function (event, ranges) { zoomStackIn (plot, event, ranges, func); });
	$(div).find(".zoomout").click(function ()            { zoomStackOut(plot, func); });

	$(div).find(".zoomout").css("visibility", "hidden");
    };
}());


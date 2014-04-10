
    function zoomStackIn(plot, event, ranges) {
	var axes = plot.getAxes()

	    var r = new Object()
	    r.xmin = axes.xaxis.min
	    r.xmax = axes.xaxis.max
	    r.ymin = axes.yaxis.min
	    r.ymax = axes.yaxis.max

	    plot.stack.push(r)

	    axes.xaxis.options.min = ranges.xaxis.from
	    axes.xaxis.options.max = ranges.xaxis.to
	    axes.yaxis.options.min = ranges.yaxis.from
	    axes.yaxis.options.max = ranges.yaxis.to

	    plot.clearSelection(true)

	    plot.setupGrid();
	plot.draw();
    }

    function zoomStackOut(plot) {
	var r = plot.stack.pop()

	    plot.getAxes().xaxis.options.min = r.xmin
	    plot.getAxes().xaxis.options.max = r.xmax
	    plot.getAxes().yaxis.options.min = r.ymin
	    plot.getAxes().yaxis.options.max = r.ymax

	    plot.clearSelection(true)

	    plot.setupGrid();
	plot.draw();
    }

    function flotZoomStack(plot) {
	var div = plot.getPlaceholder();

	$(div).apppend(<div style="position:relative;right:-80;top:30;z-index:2">		\
		<form><input class="zoomout"  type=button value="zoom out"></form></div>"

	$(div).bind("plotselected", function (event, ranges) { zoomStackIn(plot, event, ranges); });
	$(div).find(".zoomout").click(function () { zoomStackOut(plot); })
    }

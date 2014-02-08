
(function() {
    var imexam = require("./imexam")

    require("./JSSurfacePlot-V1.7/javascript/SurfacePlot")
    require("./JSSurfacePlot-V1.7/javascript/ColourGradient")


    function surface(div, data, normalize) {

	var surf = imexam.ndops.ndarray(data.shape);

	var minvalue = imexam.ndops.minvalue(data);
	var maxvalue = imexam.ndops.maxvalue(data);

	var range = maxvalue - minvalue;


	  surf.getNumberOfRows = function() { 
	    return this.shape[0]; 
	  } 
	  surf.getNumberOfColumns = function() { 
	    return this.shape[1]; 
	  } 
	  surf.getFormattedValue = function(i, j) { 
	    return this.get(i, j).toString(); 
	  } 


	var surfacePlot = $(div).data("surfplot");

	if ( surfacePlot === undefined ) {
	    div.innerHTML = "";

	    surfacePlot = new greg.ross.visualisation.SurfacePlot(div);

	    $(div).data("surfplot", surfacePlot);
	}

	var fillPly = true;
	
	// Define a colour gradient.
	var colour1 = {red:0, green:0, blue:255};
	var colour2 = {red:0, green:255, blue:255};
	var colour3 = {red:0, green:255, blue:0};
	var colour4 = {red:255, green:255, blue:0};
	var colour5 = {red:255, green:0, blue:0};
	var colours = [colour1, colour2, colour3, colour4, colour5];
	
	// Axis labels.
	var xAxisHeader	= "X";
	var yAxisHeader	= "Y";
	var zAxisHeader	= "Z";

	var tooltipStrings = new Array();

	var numRows = surf.getNumberOfRows();
	var numCols = surf.getNumberOfColumns();
	var idx = 0;

	var height = div.offsetHeight;
	var width  = div.offsetWidth;

	for (var i = 0; i < numRows; i++) {
	    for (var j = 0; j < numCols; j++) {
		var value = data.get(i, j);

		surf.set(j, i, (value-minvalue)/(range*2.25))

		tooltipStrings[idx] = "x:" + i + ", y:" + j + " = " + value.toFixed(2);
		idx++;
	    }
	}
	
	var options = {xPos: 0, yPos: 0, width: width, height: height, colourGradient: colours, fillPolygons: fillPly,
		tooltips: tooltipStrings, xTitle: xAxisHeader, yTitle: yAxisHeader, zTitle: zAxisHeader, restrictXRotation: false};

	surfacePlot.draw(surf, options);
    }

    function pluginUpdate(im, xreg) {
	    var section = imexam.reg2section(xreg);
	    var im_2d   = imexam.ndarray(im.raw.data, [im.raw.height, im.raw.width]);
	    var imag    = imexam.ndops.section(im_2d, section);

	    surface(this.div, imag);
    }

    function pluginInit() {
	$(this.div).css('height', "100%")
	$(this.div).append("Create a region to see 3d plot<br>");
    }

    JS9.RegisterPlugin("ImExam", "3dPlot", pluginInit, {
	    viewMenuItem: "3dPlot",
	    regionchange: pluginUpdate,
	    windowDims: [250, 250],
    })
})();

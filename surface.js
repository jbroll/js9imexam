
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

    // Don't fill polygons in IE. It's too slow.
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

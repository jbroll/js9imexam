
function surface(div, data, normalize) {

    var surf = imexam.ndops.ndarray(data.shape)

      surf.getNumberOfRows = function() { 
        return this.shape[0]; 
      } 
      surf.getNumberOfColumns = function() { 
        return this.shape[1]; 
      } 
      surf.getFormattedValue = function(i, j) { 
        return this.get(i, j).toString(); 
      } 

    var surfacePlot = new greg.ross.visualisation.SurfacePlot(div);
    
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
    var idx;

    for (var i = 0; i < numRows; i++) {
	for (var j = 0; j < numCols; j++) {
	    var value = data.get(i, j)/normalize;

	    surf.set(i, j, value)

	    tooltipStrings[idx] = "x:" + i + ", y:" + j + " = " + value;
	    idx++;
	}
    }
    
    var options = {xPos: 0, yPos: 0, width: 300, height: 300, colourGradient: colours, fillPolygons: fillPly,
	    tooltips: tooltipStrings, xTitle: xAxisHeader, yTitle: yAxisHeader, zTitle: zAxisHeader, restrictXRotation: false};

    surfacePlot.draw(surf, options);
}

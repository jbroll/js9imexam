
JS9.AddShapes = function(id, layer, shapes, opts){
    var i, region, shape;
    var im = JS9.GetImage(id);

    var empty = {};

    if( typeof opts === "string" ){ 			// opts can be an object or a string
	try{ opts = JSON.parse(opts); }
	catch(e1){
	    JS9.error("can't parse catalog opts: " + opts, e1);
	    return null;
	}
    }

    im.getShapeLayer(layer, JQuery.extend({}, opts, JS9.Fabric.opts));	// initialize catalog layer, if necessary

    for ( i = 0; i < shapes.length; i++ ) { 		// add individual object to the group

	// combine global opts with defaults opts with object-specific opts
	//
	region = jQuery.extend(true, empty, opts, shapes[i]);

	region.redraw = false; 				// don't redraw on every shape addition
	shape = im.addShape(layer, region.shape, region);
    }
    im.redrawShapeLayer(layer); 			// now we can re-render the layer

    return this; 					// allow chaining
};





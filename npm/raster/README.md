
** Draw simple shapes into a Typed Array as a 2d image.**

Four funcitons are exported:

 * drawBox(buffer, width, x, y, h, w, rot, color, rop)    
 * drawCircle(buffer, width, x, y, rad, color, rop)       
 * drawPolygon(buffer, width, points,    color, rop)      
 * drawEllipse(buffer, width, x, y, h, w, rot, color, rop)

Arguments:

 * buffer - a TypedArray of data to draw into.
 * width  - the width of the first dimension buffer.
 * x, y   - center position of the shape to draw.
 * h, w   - height and width of the shape.
 * color  - value or "color" to draw.
 * rop    - raster operation to perform, either set or add. If undefined "set" is the default.

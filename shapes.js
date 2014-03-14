


context.beginPath() ;

    var x             = 150;         // The X coordinate
    var y             = 75;          // The Y cooordinate
    var rx            = 125;         // The X radius
    var ry            = 50;          // The Y radius
    var rotation      = 0;           // The rotation of the ellipse (in radians)
    var start         = 0;           // The start angle (in radians)
    var end           = 2 * Math.PI; // The end angle (in radians)
    var anticlockwise = false;       // Whether the ellipse is drawn in a clockwise direction or anti-clockwise direction

    context.ellipse(x, y, rx, ry, rotation, start, end, anticlockwise);

context.stroke() ;




    Number.prototype.toRadians = function () { return this * (Math.PI / 180); }
    Number.prototype.toDegrees = function () { return this * (180 / Math.PI); }
    


function drawEllipse(centerX, centerY, width, height) {
    	
    context.beginPath();

    context.moveTo(centerX, centerY - height/2);   // A1

    context.bezierCurveTo(
	    centerX + width/2, centerY - height/2, // C1
	    centerX + width/2, centerY + height/2, // C2
	    centerX, centerY + height/2); 	   // A2

    context.bezierCurveTo(
	    centerX - width/2, centerY + height/2, // C3
	    centerX - width/2, centerY - height/2, // C4
	    centerX, centerY - height/2); 	   // A1

    context.fillStyle = "red";
    context.fill();
    context.closePath();	
}


function drawEllipse(ctx, x, y, w, h) {
    var kappa = 0.5522848;
    ox = (w / 2) * kappa, // control point offset horizontal
       oy = (h / 2) * kappa, // control point offset vertical
       xe = x + w,           // x-end
       ye = y + h,           // y-end
       xm = x + w / 2,       // x-middle
       ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath();
    ctx.stroke();
}

for (var i = 0 * Math.PI; i < 2 * Math.PI; i += 0.01 ) {
    xPos = centerX - (radiusX * Math.sin(i)) * Math.sin(rotationAngle * Math.PI) + (radiusY * Math.cos(i)) * Math.cos(rotationAngle * Math.PI);
    yPos = centerY + (radiusY * Math.cos(i)) * Math.sin(rotationAngle * Math.PI) + (radiusX * Math.sin(i)) * Math.cos(rotationAngle * Math.PI);

    if (i == 0) {
	cxt.moveTo(xPos, yPos);
    } else {
	cxt.lineTo(xPos, yPos);
    }
}


/* draw ellipse
    * x0,y0 = center of the ellipse
     * a = greater semi-axis
      * exc = ellipse excentricity (exc = 0 for circle, 0 < exc < 1 for ellipse, exc > 1 for hyperbole)
       */
function drawEllipse(ctx, x0, y0, a, exc, lineWidth, color)
{
    x0 += a * exc;
    var r = a * (1 - exc*exc)/(1 + exc),
	x = x0 + r,
	y = y0;
    ctx.beginPath();
    ctx.moveTo(x, y);
    var i = 0.01 * Math.PI;
    var twoPi = 2 * Math.PI;
    while (i < twoPi) {
	r = a * (1 - exc*exc)/(1 + exc * Math.cos(i));
	x = x0 + r * Math.cos(i);
	y = y0 + r * Math.sin(i);
	ctx.lineTo(x, y);
	i += 0.01;
    }
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.closePath();
    ctx.stroke();
}


function ellipse(cx, cy, w, h){
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    var lx = cx - w/2,
	rx = cx + w/2,
	ty = cy - h/2,
	by = cy + h/2;
    var magic = 0.551784;
    var xmagic = magic*w/2;
    var ymagic = h*magic/2;
    ctx.moveTo(cx,ty);
    ctx.bezierCurveTo(cx+xmagic,ty,rx,cy-ymagic,rx,cy);
    ctx.bezierCurveTo(rx,cy+ymagic,cx+xmagic,by,cx,by);
    ctx.bezierCurveTo(cx-xmagic,by,lx,cy+ymagic,lx,cy);
    ctx.bezierCurveTo(lx,cy-ymagic,cx-xmagic,ty,cx,ty);
    ctx.stroke();


}


function ellipse(color, lineWidth, x, y, stretchX, stretchY, startAngle, endAngle) {
    for (var angle = startAngle; angle < endAngle; angle += Math.PI / 180) {
	ctx.beginPath()
	ctx.moveTo(x, y)
	ctx.lineTo(x + Math.cos(angle) * stretchX, y + Math.sin(angle) * stretchY)
	ctx.lineWidth = lineWidth
	ctx.strokeStyle = color
	ctx.stroke()
	ctx.closePath()
    }
}

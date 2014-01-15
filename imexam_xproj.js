var imexam = require("./imexam")

function reg2section(xreg) {
    switch ( xreg.shape ) {
	   case "box":
	      w = xreg.size.width;
	      h = xreg.size.height;

	      break;
	  case "circle":
	      xreg.size = new Object();

	      xreg.size.width  = xreg.radius*2;
	      xreg.size.height = xreg.radius*2;

	      break;

	  default:
		return;
      }

	  return imexam.imops.mksection(xreg.pos.x, xreg.pos.y, xreg.size.width, xreg.size.height);
}

function imexam_xprojUpdate(im, xreg, div) {
	var section = reg2section(xreg);
	var im_2d = imexam.ndarray(im.raw.data, [im.raw.height, im.raw.width]);
	var imag = imexam.ndops.section(im_2d, section);
	var xproj = imexam.ndops.proj(imag, 1);

    var js9imstat_xproj_template = "<div style='position:absolute;right: 10px;top:10px'> \
							 <select class='xproj_menu' onchange='imexamUpdate(undefined, $(this).parents('.js9imexam-box')[0]);'> \
	 							<option>sum</option> \
	 							<option>avg</option> \
	 							<option>med</option> \
							</select> \
    						</script>"

	xdata = [];
	var n = 1

	var xmenu = $(div).find(".xproj_menu")[0];

	if ( xmenu === undefined ) {
		proj_type = "sum"
	} else {
		var proj_indx = xmenu.selectedIndex;
		var proj_type = xmenu.options[xmenu.selectedIndex].value;

	}

	if ( proj_type === "sum" ) {
		data = xproj.sum
	}
	if ( proj_type === "avg" ) {
		data = xproj.avg
	}
	if ( proj_type === "med" ) {
		data = xproj.med
	}

	for ( var x = 0;  x < xproj.shape[0]; x++ ) {
		xdata[x] = [x+section[0][0], data.get(x)]
	}

	$.plot(div, [xdata], { xaxis: { min: section[0][0], max: section[0][1] }});

	$(div).append(js9imstat_xproj_template);
	xmenu = $(div).find(".xproj_menu")[0];
	xmenu.selectedIndex = proj_indx;
}

exports.onChange = imexam_xprojUpdate;

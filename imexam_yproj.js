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


function imexam_yprojUpdate(im, xreg, div) {
	var section = reg2section(xreg);
	var im_2d  = imexam.ndarray(im.raw.data, [im.raw.height, im.raw.width]);
	var imag = imexam.ndops.section(im_2d, section);
	var yproj = imexam.ndops.proj(imag, 0);

	var js9imstat_yproj_template = "<div style='position:absolute;right: 10px;top:10px'> \
	 			<select class='yproj_menu' onchange='imexamUpdate(undefined, $(this).parents('.js9imexam-box')[0]);'> \
	 			<option>sum</option> \
	 			<option>avg</option> \
	 			<option>med</option> \
			</select> \
			</div>"

	var ydata = [];
	var n = 1;

	var xmenu = $(div).find(".yproj_menu")[0];

	if ( xmenu === undefined ) {
		proj_type = "sum";
	} else {
		var proj_indx = xmenu.selectedIndex;
		var proj_type = xmenu.options[xmenu.selectedIndex].value;
	}

	if ( proj_type === "sum" ) {
		data = yproj.sum;
	}
	if ( proj_type === "avg" ) {
		data = yproj.avg;
	}
	if ( proj_type === "med" ) {
		data = yproj.med;
	}

	for ( var y = 0;  y < yproj.shape[0]; y++ ) {
		ydata[y] = [y+section[1][0], data.get(y)];
	}

	$.plot(div, [ydata], { xaxis: { min: section[1][0], max: section[1][1] }});

	$(div).append(js9imstat_yproj_template);
	xmenu = $(div).find(".yproj_menu")[0];
	xmenu.selectedIndex = proj_indx;
}

exports.onChange = imexam_yprojUpdate;

var imexam = require("./imexam")
var surface = require("./surface")

function imexam_3plotUpdate(im, xreg, div) {
	var section = reg2section(xreg);
	var im_2d = imexam.ndarray(im.raw.data, [im.raw.height, im.raw.width]);
	var imag = imexam.ndops.section(im_2d, section);

	surface.surface(div, imag);
}

exports.onChange = imexam_3plotUpdate;

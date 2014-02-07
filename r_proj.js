
(function() {
    var imexam = require("./imexam");

    var rproj_template = "<div style='position:absolute;right: 10px;top:10px'> \
		    <table> \
				    <tr><td>peak	</td><td align=right>{a%.2f}</td><tr> \
				    <tr><td>decenter</td><td align=right>{b%.2f}</td><tr> \
				    <tr><td>sigma	</td><td align=right>{c%.2f}</td><tr> \
				    <tr><td>bias	</td><td align=right>{d%.2f}</td><tr> \
		    </table> \
		    </div>"

    function rprojUpdate(im, xreg) {
	var div = this.div;

	    $(div).empty();

	    var section  = imexam.reg2section(xreg);
	    var im_2d    = imexam.ndarray(im.raw.data, [im.raw.height, im.raw.width]);
	    var imag     = imexam.ndops.section(im_2d, section);
	    var data     = imexam.ndops.section(imag, section);
	    var centroid = imexam.ndops.centroid(data, imexam.ndops.qcenter(data));
	    var rproj    = imexam.imops.rproj(imag, [centroid.ceny, centroid.cenx]);
	    var max      = imexam.ndops.maxvalue(imag);
	    var backgr   = imexam.imops.backgr(imag, 4).value;

	    var fit = imexam.ndops.gsfit1d(rproj.radi, rproj.data, [max, 0, centroid.fwhm/2.355, backgr]);
	    fitv = { a: fit[0], b: fit[1], c: fit[2], d: fit[3] }

	    var rdata = [];
	    var rfdat = [];
	    var r;


	    for ( r = 0;  r < rproj.radi.shape[0]; r++ ) {
		    rdata[r] = [rproj.radi.get(r), rproj.data.get(r)]
	    }

	    rproj.samp = imexam.ndops.ndarray([div.offsetWidth/2])

	    imexam.ndops.fill(rproj.samp, function(r) { return rproj.radius*r/(div.offsetWidth/2); })


	    rproj.modl = imexam.ndops.gauss1d(rproj.samp, fit)

	    for ( r = 0;  r < rproj.modl.shape[0]; r++ ) {
		    rfdat[r] = [rproj.samp.get(r), rproj.modl.get(r)]
	    }

	    $.plot(div, [{ data: rdata, points: { radius: 1, show: true } }, { data: rfdat }])

	    $(div).append(imexam.template(rproj_template, fitv));
    }

    function rprojInit() {
	$(this.div).css('height', "100%")
	$(this.div).append("Create a region to see radial projection<br>");
    }

    JS9.RegisterPlugin("ImExam", "RadialProj", rprojInit, {
	    viewMenuItem: "Radial Proj",
	    regionchange: rprojUpdate,
	    windowDims: [250, 250],
    })

})();

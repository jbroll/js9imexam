
Fitsy.fetchURL = function(url, deliver) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    xhr.onload = function(e) {
        if ( this.readyState == 4 ) {
	    if ( this.status == 200 || this.status == 0 ) {
	        var blob = new Blob([this.response]);

		   var func = function(fits){
		       var hdu = fits.hdu[0]

			   if ( hdu.databytes === 0 && fits.hdu[1] != undefined ) {
			       hdu = fits.hdu[1]
			   }

		       Fitsy.dataread(fits, hdu);
		   };

	        Fitsy.fitsopen(blob, func)
	    }
	}
    };

    xhr.send();
}

Fitsy.convertPixel = function (data, bitpix, zero) {
    var dv = new DataView(data);

    switch( bitpix ) {
    case   8:
	return dv.getUint8(0, false);
    case -16:
	return dv.getInt16(0, false) 	 + zero;
    case  16:
	if ( zero === 32768 ) {
	    return dv.getInt16(0, false) + zero;
	} else {
	    return dv.getInt16(0, false);
	}
    case  32:
	return dv.getInt32(0, false);
    case -32:
	return dv.getFloat32(0, false);
    case -64:
	return dv.getFloat64(0, false);
    }

    return undefined;
}

Fitsy.readPixel = function (fits, hdu, index, deliver) {
    fits.read.onloadend = function() {
	    fits.pixel = Fitsy.convertPixel(fits.read.result, hdu.bitpix, hdu.bzero || 0);
	    deliver();
    }

    // Works for 2d image not any others
    //
    var ptr = hdu.dataseek + (index[0] * hdu.axis[1] + index[1]) * Math.abs(hdu.bitpix/8);

    fits.read.readAsArrayBuffer(Fitsy.getSlice(fits.file, ptr, ptr+Math.abs(hdu.bitpix/8)));
}

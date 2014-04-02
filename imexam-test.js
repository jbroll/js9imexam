

var assert = require('nodeunit').assert;

    assert.ae = function (a, b, message) { assert.deepEqual(a.data, b.data, message); }
    assert.equal      = assert.deepEqual;


imexam  = require("./imexam.jx");
numeric = require("../typed-array/numeric-1.2.6");

//imexam.typed.debug = true


exports.xyproj = function(unit) {
    data = imexam.typed.array([3, 3], "int32");

    imexam.typed.assign(data, [[1, 2, 3], [4, 5, 6], [7, 8, 9]]);


    //imexam.typed.print(data);

    proj = imexam.ndops.proj(data, 1)

	unit.ok(imexam.typed.equals(proj.sum, [ 6, 15, 24]))
	unit.ok(imexam.typed.equals(proj.avg, [ 2,  5,  8]))
	unit.ok(imexam.typed.equals(proj.med, [ 2,  5,  8]))
	//imexam.typed.print(proj.sum);


    proj = imexam.ndops.proj(data, 0)

	unit.ok(imexam.typed.equals(proj.sum, [12, 15, 18]))
	unit.ok(imexam.typed.equals(proj.avg, [ 4,  5,  6]))
	unit.ok(imexam.typed.equals(proj.med, [ 4,  5,  6]))

    //imexam.typed.print(proj.sum);
    //imexam.typed.print(proj.avg);
    //imexam.typed.print(proj.med);


    unit.done();
}




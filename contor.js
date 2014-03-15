
ndarray = require("ndarray");
fill    = require("ndarray-fill");
imexam  = require("./imexam.jx");

conrec  = require("./conrec");

var ndops = [];

data = imexam.ndops.ndarray([100, 100]);

data = fill(data, function(i,j) {
    return Math.sqrt((i-50)*(i-50) + (j-50)*(j-50))/7
})

//imexam.ndops.print(data);


c = new conrec.Conrec();

levels = imexam.ndops.iota(10);

c.contour(data
	, 0, data.shape[0]-1, 0, data.shape[1]-1
	, imexam.ndops.iota(data.shape[0]), imexam.ndops.iota(data.shape[1])
	, 10, imexam.ndops.iota(10));


console.log(c.contourList()[0]);
console.log(c.contourList()[1]);







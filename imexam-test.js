
function log() { console.log.apply(null, arguments); }

var imexam     = require("./imexam")

vm = imexam.ndops.ndarray([20])

imexam.ndops.fill(vm, function(x) { return x; })

xx = imexam.ndops.gauss1d(vm, [1, 5, .5, 0])

x0 = imexam.ndops.gsfit1d(xx, [1, 4, .25, 0])

console.log(x0)

imexam.ndops.print(vm)
imexam.ndops.print(xx)

process.exit()

im = imexam.ndops.ndarray([100, 100])


imexam.ndops.fill(im, function(x, y) { return x*y; })

//im = imexam.ndops.flatten(im)
//imexam.ndops.sort(im)

//log(im.get(im.size/2))

//imexam.ndops.print(im)



//imexam.ndops.centroid(im)

//im.set(2, 2, 1)
//im = im.lo(2, 2)
//im = im.hi(8, 8)


im.set(45, 45, 1)
im.set(45, 54, 1)

imstat = imexam.imops.imstat(im, [[45, 55], [45, 55]], "box")


//xx = imexam.ndops.hist(im)



//log(imexam.ndops.minvalue(im))
//log(imexam.ndops.inf(im))

//log(imexam.ndops.maxvalue(im))
//log(imexam.ndops.sup(im))


//imexam.ndops.print(imstat.imag)

//imexam.ndops.print(imstat.xproj)
//imexam.ndops.print(imstat.yproj)


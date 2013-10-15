
function log() { console.log.apply(null, arguments); }

var imexam     = require("./imexam")

im = imexam.ndops.ndarray([10, 10])

imexam.ndops.fill(im, function(x, y) { return x*y; })

//im = imexam.ndops.flatten(im)
//imexam.ndops.sort(im)

//log(im.get(im.size/2))

//imexam.ndops.print(im)



imexam.ndops.centroid(im)

//im.set(2, 2, 1)
//im = im.lo(2, 2)
//im = im.hi(8, 8)


im.set(45, 45, 1)
im.set(45, 54, 1)

imstat = imexam.imops.imstat(im, [[45, 55], [45, 55]], "box")

imexam.ndops.print(im, 4)

log(imexam.ndops.minvalue(im))
log(imexam.ndops.inf(im))

log(imexam.ndops.maxvalue(im))
log(imexam.ndops.sup(im))


//imexam.ndops.print(imstat.imag)

//imexam.ndops.print(imstat.xproj)
//imexam.ndops.print(imstat.yproj)


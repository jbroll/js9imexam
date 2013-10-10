
function log() { console.log.apply(null, arguments); }

var imexam     = require("./imexam")

im = imexam.ndops.ndarray([100, 100])

//im.set(2, 2, 1)
//im = im.lo(2, 2)
//im = im.hi(8, 8)

im.set(45, 45, 1)
im.set(45, 54, 1)

imstat = imexam.imops.imstat(im, [[45, 55], [45, 55]], "box")

xx = imexam.ndarray(new Float64Array(20), [20])

log(imexam.ndops.min(xx))


//imexam.ndops.print(imstat.imag)

//imexam.ndops.print(imstat.xproj)
//imexam.ndops.print(imstat.yproj)


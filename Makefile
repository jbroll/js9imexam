
JS9   = ../js9
JS9JS = $(JS9)/plugins/imexam

HTML  = js9Imexam1.html js9Imexam2.html

HX    = 		\
	regstat.html	\
	xyproj.html	\
	radproj.html	\
	reghist.html	\
	encircled.html	\
	3dplot.html
	

JX    = 		\
	imexam.jx	\
	3dplot.jx	\
	contour.jx

JS    = 		\
	xyproj.js	\
	radproj.js	\
	regstat.js	\
	reghist.js	\
	encircled.js	\
	rghxrg.js	\
	pixtable.js	\
	imcnts.js

ICON = 4arrow.png



JR	= 		\
	zoom.js		\
	mask.js		\
	raster.js

all:	$(JX:.jx=.js) imexam.html

install: FORCE
	mkdir -p $(JS9JS)
	cp -p $(HTML) $(JS9)
	cp -p $(JX:.jx=.js) $(JS) $(ICON) $(JS9JS)/.
	cp -p imexam.html $(JS9JS)/.


lint :
	jslint $(JX) $(JS) $(JR)


TYPED = node_modules/typed-array-function.js		\
	node_modules/typed-array-ops.js

imexam.js : imexam.jx template.js mask.js raster.js zoom.js $(TYPED)
	browserify -r ./imexam.jx:./imexam > imexam.js
	echo "" >> imexam.js
	ls -ltr imexam.*

imexam.html : $(HX)
	cat $(HX) > imexam.html

3dplot.js: 3dplot.jx ./JSSurfacePlot-V1.7/javascript/SurfacePlot.js ./JSSurfacePlot-V1.7/javascript/ColourGradient.js
	browserify -u imexam.js 3dplot.jx > 3dplot.js
	echo "" >> 3dplot.js
	echo "" >> contour.js

contour.js : contour.jx contfv.js conrec.js regions.js bin.js
	browserify -u imexam.js contour.jx > contour.js
	echo "" >> contour.js
	echo "" >> contour.js


npm-install:
	npm install			\
	    typed-array-function	\
	    typed-array-ops		\
	    typed-array-rotate		\
	    typed-numeric-uncmin 

FORCE:

#$(JS9JS)/unpinned.png: unpinned.png
#	mkdir -p $(JS9JS)
#	cp -p unpinned.png $(JS9JS)/unpinned.png
#
#$(JS9JS)/pinned.png: pinned.png
#	mkdir -p $(JS9JS)
#	cp -p pinned.png $(JS9JS)/pinned.png
#


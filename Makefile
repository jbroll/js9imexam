
JS9   = ../js9
JS9JS = $(JS9)/plugins/imexam

HTML  = js9Imexam.html 

HX    = 		\
	rgstat.html	\
	xyproj.html	\
	r_proj.html	\
	rghist.html	\
	enener.html	\
	3dplot.html
	

JX    = 		\
	imexam.jx	\
	3dplot.jx	\
	contour.jx

JS    = 		\
	xyproj.js	\
	r_proj.js	\
	rgstat.js	\
	rghist.js	\
	enener.js	\
	rghxrg.js	\
	pxtabl.js	\
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
	cp -p imexam.min.js    $(JS9JS)/.
	cp -p imexam.html $(JS9JS)/.


lint :
	jslint $(JX) $(JS) $(JR)


imexam.js : imexam.jx template.js mask.js raster.js zoom.js 
	browserify -r ./imexam.jx:./imexam > imexam.js
	browserify -r ./imexam.jx:./imexam | uglifyjs > imexam.min.js
	ls -ltr imexam.*

imexam.html : $(HX)
	cat $(HX) > imexam.html

3dplot.js: 3dplot.jx ./JSSurfacePlot-V1.7/javascript/SurfacePlot.js ./JSSurfacePlot-V1.7/javascript/ColourGradient.js
	browserify  3dplot.jx | sed -e s%//DELETE-ME%% > 3dplot.js

contour.js : contour.jx conrec.js
	browserify contour.jx | sed -e s%//DELETE-ME%% > contour.js


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


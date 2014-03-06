
JS9   = ../js9
JS9JS = $(JS9)/plugins/imexam

HTML  = js9Imexam.html 

HX    = imexam.html xyproj.html

JX    = 		\
	imexam.jx	\
	3dplot.jx
	
JS    = 		\
	xyproj.js	\
	r_proj.js	\
	rgstat.js	\
	rghist.js	\
	enener.js	\
	rghxrg.js	\
	pxtabl.js

all:	$(JX:.jx=.js)

install: $(JX:.jx=.js) FORCE
	mkdir -p $(JS9JS)
	cp -p $(HTML) $(JS9)
	cp -p $(JX:.jx=.js) $(JS) $(JS9JS)/.
	cp -p $(HX) $(JS9JS)/.


lint :
	jslint $(JX) $(JS)


imexam.js : imexam.jx template.js
	browserify -r ./imexam.jx | sed -e s/imexam.jx/imexam/ > imexam.js

3dplot.js: 3dplot.jx ./JSSurfacePlot-V1.7/javascript/SurfacePlot.js ./JSSurfacePlot-V1.7/javascript/ColourGradient.js
	browserify 						\
	    -r ./JSSurfacePlot-V1.7/javascript/SurfacePlot 	\
	    -r ./JSSurfacePlot-V1.7/javascript/ColourGradient > 3dplot.js
	cat 3dplot.jx >> 3dplot.js

FORCE:

#$(JS9JS)/unpinned.png: unpinned.png
#	mkdir -p $(JS9JS)
#	cp -p unpinned.png $(JS9JS)/unpinned.png
#
#$(JS9JS)/pinned.png: pinned.png
#	mkdir -p $(JS9JS)
#	cp -p pinned.png $(JS9JS)/pinned.png
#


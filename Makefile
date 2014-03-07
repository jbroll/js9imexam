
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
	3dplot.jx
	
JS    = 		\
	xyproj.js	\
	r_proj.js	\
	rgstat.js	\
	rghist.js	\
	enener.js	\
	rghxrg.js	\
	pxtabl.js

all:	$(JX:.jx=.js) imexam.html

install: $(JX:.jx=.js) imexam.html FORCE
	mkdir -p $(JS9JS)
	cp -p $(HTML) $(JS9)
	cp -p $(JX:.jx=.js) $(JS) $(JS9JS)/.
	cp -p imexam.html $(JS9JS)/.


lint :
	jslint $(JX) $(JS)


imexam.js : imexam.jx template.js
	browserify -r ./imexam.jx | sed -e s/imexam.jx/imexam/ > imexam.js

imexam.html : $(HX)
	cat $(HX) > imexam.html

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


JS9   = ../js9
JS9JS = $(JS9)/plugins/imexam

all:	$(JS9)/js9Imexam.html 	\
	$(JS9JS)/imexam.js	\
	$(JS9JS)/xyproj.js	\
	$(JS9JS)/r_proj.js	\
	$(JS9JS)/rgstat.js	\
	$(JS9JS)/rghist.js	\
	$(JS9JS)/3dplot.js	\
	$(JS9JS)/enener.js

lint :				\
	imexam.js		\
	xyproj.js		\
	r_proj.js		\
	rgstat.js		\
	rghist.js		\
	3dplot.js		\
	enener.js
	jslint $^


$(JS9JS)/imexam.js : imexam.js template.js
	mkdir -p $(JS9JS)
	browserify -r ./imexam > $(JS9JS)/imexam.js

$(JS9JS)/xyproj.js: xyproj.js 
	mkdir -p $(JS9JS)
	cp -p xyproj.js $(JS9JS)/xyproj.js

$(JS9JS)/rgstat.js: rgstat.js 
	mkdir -p $(JS9JS)
	cp -p rgstat.js $(JS9JS)/rgstat.js

$(JS9JS)/r_proj.js: r_proj.js 
	mkdir -p $(JS9JS)
	cp -p r_proj.js $(JS9JS)/r_proj.js

$(JS9JS)/rghist.js: rghist.js 
	mkdir -p $(JS9JS)
	cp -p rghist.js $(JS9JS)/rghist.js

$(JS9JS)/3dplot.js: 3dplot.js ./JSSurfacePlot-V1.7/javascript/SurfacePlot.js
	mkdir -p $(JS9JS)
	browserify 						\
	    -r ./JSSurfacePlot-V1.7/javascript/SurfacePlot 	\
	    -r ./JSSurfacePlot-V1.7/javascript/ColourGradient > $(JS9JS)/3dplot.js
	cat 3dplot.js >> $(JS9JS)/3dplot.js

$(JS9JS)/enener.js: enener.js 
	mkdir -p $(JS9JS)
	cp -p enener.js $(JS9JS)/enener.js

$(JS9)/js9Imexam.html: js9imexam.html
	mkdir -p $(JS9JS)
	cp -p js9imexam.html $(JS9)/js9Imexam.html

$(JS9JS)/surface.js: surface.js
	mkdir -p $(JS9JS)
	cp -p surface.js $(JS9JS)/surface.js

$(JS9JS)/template.js: template.js
	mkdir -p $(JS9JS)
	cp -p template.js $(JS9JS)/template.js

$(JS9JS)/unpinned.png: unpinned.png
	mkdir -p $(JS9JS)
	cp -p unpinned.png $(JS9JS)/unpinned.png

$(JS9JS)/pinned.png: pinned.png
	mkdir -p $(JS9JS)
	cp -p pinned.png $(JS9JS)/pinned.png



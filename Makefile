JS9   = ../js9
JS9JS = $(JS9)/js/imexam_modules

first: $(JS9)/js9yproj.html $(JS9JS)/js9imexam_yproj.js $(JS9)/js9rproj.html $(JS9JS)/js9imexam_rproj.js $(JS9)/js9xproj.html $(JS9JS)/js9imexam_xproj.js $(JS9)/js93plot.html $(JS9JS)/js9imexam_3plot.js

$(JS9)/js9yproj.html: js9yproj.html
	cp -p js9yproj.html $(JS9)/js9yproj.html

$(JS9JS)/js9imexam_yproj.js: js9imexam_yproj.js imexam_yproj.js
	mkdir -p $(JS9JS)
	browserify -r ./imexam_yproj > $(JS9JS)/js9imexam_yproj.js
	cat js9imexam_yproj.js >> $(JS9JS)/js9imexam_yproj.js

$(JS9)/js9xproj.html: js9xproj.html
	cp -p js9xproj.html $(JS9)/js9xproj.html

$(JS9JS)/js9imexam_xproj.js: js9imexam_xproj.js imexam_xproj.js
	mkdir -p $(JS9JS)
	browserify -r ./imexam_xproj > $(JS9JS)/js9imexam_xproj.js
	cat js9imexam_xproj.js >> $(JS9JS)/js9imexam_xproj.js

$(JS9)/js9rproj.html: js9rproj.html
	cp -p js9rproj.html $(JS9)/js9rproj.html

$(JS9JS)/js9imexam_rproj.js: js9imexam_rproj.js imexam_rproj.js
	mkdir -p $(JS9JS)
	browserify -r ./imexam_rproj > $(JS9JS)/js9imexam_rproj.js
	cat js9imexam_rproj.js >> $(JS9JS)/js9imexam_rproj.js

$(JS9)/js93plot.html: js93plot.html
	cp -p js93plot.html $(JS9)/js93plot.html

$(JS9JS)/js9imexam_3plot.js: js9imexam_3plot.js imexam_3plot.js
	mkdir -p $(JS9JS)
	browserify -r ./imexam_3plot > $(JS9JS)/js9imexam_3plot.js
	cat js9imexam_3plot.js >> $(JS9JS)/js9imexam_3plot.js

all: 	$(JS9)/js9imexam.html	\
	$(JS9JS)/imexam.js	\
	$(JS9JS)/surface.js	\
	$(JS9JS)/template.js	\
	$(JS9JS)/pinned.png	\
	$(JS9JS)/unpinned.png

$(JS9)/js9imexam.html: js9imexam.html
	mkdir -p $(JS9JS)
	cp -p js9imexam.html $(JS9)/js9imexam.html

$(JS9JS)/imexam.js: imexam.js
	#browserify -r ./imexam | uglifyjs > $(JS9JS)/imexam.js
	mkdir -p $(JS9JS)
	browserify -r ./imexam 		  > $(JS9JS)/imexam.js

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


base:
	mkdir -p $(JS9JS)
	rm -rf $(JS9JS)/JSSurfacePlot
	mkdir -p $(JS9JS)
	rm -rf $(JS9JS)/JSSurfacePlot
	cp -rp JSSurfacePlot-V1.7 $(JS9JS)/JSSurfacePlot

install: base all

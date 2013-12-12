

JS9   = ../js9
JS9JS = $(JS9)/js/imexam

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

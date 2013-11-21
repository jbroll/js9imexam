

JS9   = ../js9
JS9JS = $(JS9)/js/imexam

all: 	$(JS9)/js9imexam.html	\
	$(JS9JS)/imexam.js	\
	$(JS9JS)/surface.js	\
	$(JS9JS)/template.js	\
	$(JS9JS)/pinned.png	\
	$(JS9JS)/unpinned.png

$(JS9)/js9imexam.html: js9imexam.html
	cp -p js9imexam.html $(JS9)/js9imexam.html

$(JS9JS)/imexam.js: imexam.js
	#browserify -r ./imexam | uglifyjs > $(JS9JS)/imexam.js
	browserify -r ./imexam 		  > $(JS9JS)/imexam.js

$(JS9JS)/surface.js: surface.js
	cp -p surface.js $(JS9JS)/surface.js

$(JS9JS)/template.js: template.js
	cp -p template.js $(JS9JS)/template.js

$(JS9JS)/unpinned.png: unpinned.png
	cp -p unpinned.png $(JS9JS)/unpinned.png

$(JS9JS)/pinned.png: pinned.png
	cp -p pinned.png $(JS9JS)/pinned.png


install:
	mkdir -p $(JS9JS)
	rm -rf $(JS9JS)/JSSurfacePlot
	cp -rp JSSurfacePlot-V1.7 $(JS9JS)/JSSurfacePlot

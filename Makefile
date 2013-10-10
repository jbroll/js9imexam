

JS9   = ../js9
JS9JS = $(JS9)/js/imexam

all: $(JS9)/js9imexam.html $(JS9JS)/imexam.js $(JS9JS)/surface.js

$(JS9)/js9imexam.html: js9imexam.html
	cp -p js9imexam.html $(JS9)/js9imexam.html

$(JS9JS)/imexam.js: imexam.js
	browserify -r ./imexam > $(JS9JS)/imexam.js

$(JS9JS)/surface.js: surface.js
	cp -p surface.js $(JS9JS)/surface.js

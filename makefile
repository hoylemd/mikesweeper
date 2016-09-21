ASSETS_ROOT=assets/

JS_COMPILE=node node_modules/browserify/bin/cmd.js
JS_ROOT=$(ASSETS_ROOT)js/
JS_MAIN=main.js
JS_MAIN_PATH=$(JS_ROOT)$(JS_MAIN)

CSS_ROOT=$(ASSETS_ROOT)css/

STATIC_ROOT=static/
BUNDLE_NAME=bundle.js

install: package.json
	npm install
	mkdir -p static/js
	mkdir -p static/css

compile: $(JS_MAIN_PATH)
	$(JS_COMPILE) $(JS_MAIN_PATH) -o $(STATIC_ROOT)js/$(BUNDLE_NAME)
	cp $(CSS_ROOT)* $(STATIC_ROOT)css/

dev:
	echo 'broke'

JS_COMPILE=node node_modules/browserify/bin/cmd.js
JS_ROOT=assets/js/
JS_MAIN=entry.js
JS_MAIN_PATH=$(JS_ROOT)$(JS_MAIN)

STATIC_ROOT=static/
BUNDLE_NAME=bundle.js

install: package.json
	npm install
	mkdir -p static/js
	mkdir -p static/css

compile: $(JS_MAIN_PATH)
	$(JS_COMPILE) $(JS_MAIN_PATH) -o $(STATIC_ROOT)js/$(BUNDLE_NAME)

dev:
	echo 'broke'

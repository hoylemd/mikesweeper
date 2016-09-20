install:
	npm install

compile:
	webpack assets/entry.json static/bundle.js

dev:
	webpack-dev-server --progress --colors

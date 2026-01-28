VERSION=1.0.0


clean:
	rm -rf ./dist

compile: clean
	npx tsc

pack: compile
	npx webpack --config webpack.android.config.js
	npx webpack --config webpack.android.arm64.config.js
	npx webpack --config webpack.android.x64.config.js

link:
	rm -rf ${HOME}/WebstormProjects/dexcalibur-ts/dist/agent
	cp -r ${PWD}/dist ${HOME}/WebstormProjects/dexcalibur-ts/dist/agent

all: pack
# XFL-Loader

Loader for Adobe Animate files.
__!IMPORTANT NOTE: This loader does not autmatcally publish Adobe Animate files. You need to publish them manually.__

## Instalation

Install loaders:

    npm i -D github:icek/xfl-loader imports-loader exports-loader

Add createjs as dependency:

    npm i -S createjs

## Webpack configuration

Add an alias for createjs lib

```js
alias: {
    createjs: 'createjs/builds/1.0.0/createjs.js'
}
```

Create loaders rules

```js
rules: [
    {
      test: /\.xfl$/,
      loader: 'xfl-loader'
    },
    {
      test: /node_modules[/\\]createjs/,
      loaders: [
        'imports-loader?this=>window',
        'exports-loader?window.createjs'
      ]
    }
]
```

## Usage

Publish content from Adobe Animate and use it:

```js
import createjs from 'createjs';
import comp from './xfl/demo/demo.xfl';

const lib = comp.getLibrary();
const exportRoot = new lib.demo();

const canvas = document.getElementById('canvas');
canvas.width = lib.properties.width;
canvas.height = lib.properties.height;

const stage = new lib.Stage(canvas);
stage.addChild(exportRoot);
createjs.Ticker.setFPS(lib.properties.fps);
createjs.Ticker.addEventListener('tick', stage);
```

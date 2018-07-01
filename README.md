# topojson-webgl

WebGL renderer for TopoJSON files.

## Install
```bash
yarn add topojson-webgl
```

## Plans

This lib aims to help as many use cases and possible, providing only the necessary parts and moving everything else to usage examples.

## Possible (future) usages

### Fully dynamic

- data is downloaded dynamically using `topojson-fetch`
- mesh is created by triangularizing `*.topojson` data
- `topojson-webgl` renders it

### Typical usage of `*.topojson` in assets

- data is provided as one asset file
- mesh is created by triangularizing `*.topojson` data
- `topojson-webgl` renders it

### Highly preprocessed

- mesh is loaded from assets
- `topojson-webgl` renders it

## TODO

- render lines
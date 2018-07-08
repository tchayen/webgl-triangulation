# triangulify

Set of utilities for triangulating lines and polygons.

Aims to offer lightweight (minimal number of external dependencies increasing bundle size, currently there are _none_), production class solution for triangulating relatively big number of vertices.

Targeted use cases and performance objectives are for rendering maps with rich polygons featuring thousands points. Anything less complicated or similar to that should be doing great with this lib.

The lib is everything-agnostic. All calculations are just pure maths, it is suitable both for `node.js` backend and any kind of JS frontend supporting `npm` modules.

## Install
```bash
yarn add triangulify
```

## Modules

### Triangulate

#### Triangulate.Polygons

`earCut()`

`...`

#### Triangulate.Lines

`miter(points, width)`

`bevel(points, width)`

### Math

Minimal math lib for operations with 3x3 matrices and 2D vectors.

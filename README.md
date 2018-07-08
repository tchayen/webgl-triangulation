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

Main module. Combines submodules for various types of triangulation.

#### Triangulate.Polygons

Offers one method of triangulating polygons: `earCut`.

#### Triangulate.Lines

`miter(points, width)`

Triangulates line consisting of points using miter joins, which means that the join points are calculated and no additional triangles are generated in the process.

`bevel(points, width)`

Triangulates line using bevel joins, which are singular triangles added at each join to connect two outer vertices (the inner one, with smaller angle) is connected in the same way as in miter.

### Math

Minimal math lib for operations with 3x3 matrices and 2D vectors.

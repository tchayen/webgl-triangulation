# triangulify

_because `triangulate` was already taken_

Set of utilities for triangulating **lines** and **polygons** (handles those with multiple holes too).

Aims to offer lightweight (minimal number of external dependencies increasing bundle size, currently there are _none_), production class solution for triangulating relatively big number of vertices.

Targeted use cases and performance objectives are for rendering maps with rich polygons featuring thousands points. Anything less complicated or similar to that should be doing great with this lib.

The lib is everything-agnostic. All calculations are just pure maths, it is suitable both for `node.js` backend and any kind of JS frontend supporting `npm` modules.

## Install
```bash
yarn add triangulify
```

## Docs
For documentation, refer to rich JS Doc comments in the code. Feel free to open an issue if some description is not clear _(it was documented on-the-go and some problems might have seem too obvious for the one writing it during that time)._

## Modules

### Triangulate.Polygons

#### `earCut(vertices)`
Triangulates given polygon (assuming counter-clock-wise winding) into array of threes of indices (resulting triangles).

Probably you will want to use it together with `resolveTriangleVertices()` which produces flat array of vertex coordinates for use in a WebGL buffer.

### Triangulate.Lines

#### `miter(points, width)`

Triangulates line consisting of points using miter joins, which means that the join points are calculated and _no additional_ triangles are generated in the process.

#### `bevel(points, width)`

_NOT IMPLEMENTED YET_

Triangulates line using bevel joins, which are singular triangles added at each join to connect two outer vertices (the inner one, with smaller angle) is connected in the same way as in miter.

### Math

Minimal math lib for operations with 3x3 matrices and 2D vectors.

Feel free to use it in your code, but this part of the API probably **won't** ever be stable.

It is in the first place set of helpers for other modules in the library and everything in it is a subject to change. For example functions might disappear when they have no usages.

## Examples

Visit `examples` directory for some usage examples.

They provide complete, tiny WebGL wrappers for rendering something real on the screen.

## Todo

### Tests

- buildings with holes – [AGH A0](https://www.openstreetmap.org/relation/3111004)

- complicated shapes with multiple holes – [Main Square Cracow](https://www.openstreetmap.org/relation/3278602)

- triangulation of huge objects – [Lake Superior](https://www.openstreetmap.org/relation/4039486)

- test triangulation with complicated rivers – [Puszcza niepołomicka](https://www.openstreetmap.org/#map=12/47.9571/43.3078)
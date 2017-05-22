Template for elm and d3 app with:

  - webpack
  - scss (bourbon and bitters for decent defaults)
  - markdown loaded via webpack and passed to elm app

Files in `src` will be included in webpack app bundle, files in `assets` will be loaded
separately.

## Howto

Either `yarn && yarn dev` or `npm install && npm run dev`


## Export into a fresh directory

```
mkdir XXXX
git archive HEAD | (cd !$ && tar xf -)
```




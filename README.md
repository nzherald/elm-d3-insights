# Elm and d3

## Overview

This is template for creating a visulisation using elm for the app
scaffolding and d3 for the visuals. Text is written in markdown files
and passed into the elm app and sass/scss is used for styles. Everything
is held togther with webpack.



## Quickstart

### To use this to start a project

```
git clone git@github.com:nzherald/elm-d3-insights.git
cd elm-d3-insights
mkdir XXXX
git archive HEAD | (cd !$ && tar xf -)
```

_Once this repo is not private we can setup easier instructions_

### To get started once you have an initial copy

```
yarn && yarn dev
```

or `npm install && npm run dev`


## Details

Wepack will compile everything under the `src` directory into a webpack
bundle and everything in the assets should be copied into the final
distribution as is.

- `src/app.js` -> the main entry point for webpack
- `src/index.ejs` -> template that wepack converts to index.html
- `src/elm/Main.elm` -> the elm app
- `src/js/basic-plot.js` -> a basic d3 plot
- `src/scss/styles.scss` -> main entry point for scss styling
- `src/markdown/all.yaml` -> markdown for the app in a yaml file

### The Elm

It is a fairly simple elm app that exercises quite a bit of the core elm
functionality.

The elm app:

- receives that markdown as an initialisation flags and stores it in the app model
- fetches the data using the elm http library
- decodes the data into an elm type
- renders a small html UI
- renders the markdown into HTML (and displays it)
- sends the data to d3 via an elm `port`
- creates a port to listen for interactions with the d3 chart
- changes the UI based on chart interactions

### The d3

- exports a single function which expects the data object as the first
argument and a port send function as the second
- in this example the data object just contains the id of the node that
d3 should attach too and the data itself, but in more real life cases it
will contain title, axis labels etc

### The SCSS

This example uses bourbon.io mixins and the accompanying bitters defaults.

### The markdown

This example actually places all the markdown inside of a yaml file. I have
found that to be an easier approach when working with lots of small pieces of
structured text as the yaml structure maps easily onto an elm record. The
other alternative is to have a markdown file for each section and to load each of
them via webpack in app.js and then assemble them into an object to pass as the
flags into the elm app. If an app had a lot of text then I would recommend using this
approach to pull in large blocks of continuous text and a yaml file for small pieces of
text that need to be scattered around the page and then just append the large blocks
of markdown onto the yaml derived object before passing the flags into the elm app.

Using a webpack loader for markdown and yaml and passing the markdown as flags to the
elm app is done so that the markdown does not need to be loaded via an http request.
But obviously that is an option too.

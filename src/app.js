import md from './markdown/all.yaml';
import Elm from './elm/Main.elm';
import './scss/styles.scss';
import plot from './js/basic-plot.js'

import pym from 'pym.js';


const pymChild = new pym.Child();
  pymChild.sendHeight()
const appNode = document.getElementById('insights-entry-point');
const app = Elm.Main.embed(appNode, {markdown: md});
app.ports.exportData.subscribe(d3data => {
  plot(d3data, app.ports.barClick.send)
  pymChild.sendHeight()
});
app.ports.sizeChanged.subscribe(size => {
  pymChild.sendHeight()
})


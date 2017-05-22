import md from './markdown/all.yaml';
import Elm from './elm/Main.elm';
import './scss/styles.scss';
import plot from './js/basic-plot.js'

let app = Elm.Main.fullscreen({markdown: md});
app.ports.exportData.subscribe(data => plot(data, app.ports.barClick.send));



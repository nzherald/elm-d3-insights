import intro from './markdown/intro.md';
import Elm from './elm/Main.elm';
import './scss/styles.scss';
import plot from './js/basic-plot.js'

let app = Elm.Main.fullscreen({markdown: {intro: intro}});
app.ports.exportData.subscribe(data => plot(data, app.ports.barClick.send));



import Menu from './modules/Menu.js';
import RenderVideos from './modules/RenderVideos.js';
import Player from './modules/Player.js';

new Menu()

const path = window.location.pathname
if (path.endsWith('/')) {
    // new RenderVideos('preview__container')

}
if (path.endsWith('watch')) {
    // new RenderVideos('preview__container')
    new Player()
}
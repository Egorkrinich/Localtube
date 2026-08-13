import Menu from './modules/Menu.js';
import RenderVideos from './modules/RenderVideos.js';

new Menu()

const path = window.location.pathname
if (path.endsWith('/')) {
    new RenderVideos('preview__container')

}
if (path.endsWith('watch')) {
    new RenderVideos('preview__container')

    initWatchPage()
}
if (path.endsWith('upload')) {
    initUploadPage()
}


async function initWatchPage() {
    const { Player } = await import('./modules/Player.js')

    new Player()
}
async function initUploadPage() {
    const { Upload } = await import('./modules/Upload.js')

    new Upload()
}
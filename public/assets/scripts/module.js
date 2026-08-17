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
if (USER_CONFIG.isLogged) {
    initAuth()
}


async function initWatchPage() {
    const { Player } = await import('./modules/Player.js')

    new Player()
}
async function initUploadPage() {
    const { Upload } = await import('./modules/Upload.js')

    new Upload()
}
async function initAuth() {
    const { Auth } = await import('./modules/Auth.js')

    new Auth()
}






function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
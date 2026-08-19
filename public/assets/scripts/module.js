import Menu from './modules/Menu.js';
import RenderVideos from './modules/RenderVideos.js';
import Context from './modules/Context.js';
import Toast from './modules/Toast.js'


const path = window.location.pathname
new Menu()
new Context(path)
new Toast()

if (path.endsWith('/')) {
    new RenderVideos('video')
}
if (path.endsWith('watch')) {
    new RenderVideos('video', 'h')

    initWatchPage()
}
if (path.endsWith('manager')) {
    new RenderVideos('video', 'h')
    initManagerPage()
}
if (path.endsWith('history')) {
    new RenderVideos('history', 'h')
}
if (!USER_CONFIG.isLoggedIn) {
    initAuth()
}


async function initWatchPage() {
    const { Player } = await import('./modules/Player.js')

    new Player()
}
async function initManagerPage() {
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
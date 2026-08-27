import Menu from './modules/Menu.js';
import RenderVideos from './modules/RenderVideos.js';
import Context from './modules/Context.js';
import Toast from './modules/Toast.js';
import Settings from './modules/Settings.js';


const path = window.location.pathname
new Menu()
new Context(path)
new Toast()
new Settings()

if (path.endsWith('/')) {
    new RenderVideos('video')
}
if (path.endsWith('watch')) {
    new RenderVideos('video', 'h')

    initWatchPage()
}
if (path.endsWith('manager')) {
    new RenderVideos('manager', 'h')
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
    const { Video } = await import('./modules/Video.js')

    new Video(VIDEO_DATA['likes'], VIDEO_DATA['dislikes'])
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
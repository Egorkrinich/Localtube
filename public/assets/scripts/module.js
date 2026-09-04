import Menu from './modules/Menu.js';
import Context from './modules/Context.js';
import Toast from './modules/Toast.js';
import Settings from './modules/Settings.js';

const currentFullURL = window.location.origin + window.location.pathname
let cleanPath = currentFullURL.replace(BASE_URL, '') || 'home'
cleanPath = (cleanPath.endsWith('/') ? cleanPath.slice(0, -1) : cleanPath) || 'home';

new Menu()
new Toast()

if (!USER_CONFIG.isLoggedIn) {
    initAuth()
} else {
    new Settings()

}
switch (cleanPath) {
    case 'home':
        initHomePage()
    break;
    case 'watch':
        initWatchPage()
    break;
    case 'manager':
        initManagerPage()
    break;
    case 'history':
        initHistoryPage()
    break;
    case 'playlists':
        initPlaylistsPage()
    break;
}
async function initHomePage() {
    const { RenderVideos } = await import('./modules/RenderVideos.js')

    new Context('global')

    new RenderVideos('video')
}
async function initWatchPage() {
    const { RenderVideos } = await import('./modules/RenderVideos.js')
    const { Player } = await import('./modules/Player.js')
    const { Video } = await import('./modules/Video.js')
    const { Playlist } = await import('./modules/Playlist.js')


    new Context('global')
    
    new Playlist('watch')
    new Player()
    new RenderVideos('video', 'h')
    new Video(VIDEO_DATA['likes'], VIDEO_DATA['dislikes'])
}
async function initManagerPage() {
    const { RenderVideos } = await import('./modules/RenderVideos.js')
    const { VideoManager } = await import('./modules/VideoManager.js')
    
    new Context('manager')
    
    new VideoManager()
    new RenderVideos('manager', 'h')
}
async function initHistoryPage() {
    const { RenderVideos } = await import('./modules/RenderVideos.js')

    new Context('global')

    new RenderVideos('history', 'h')
}
async function initPlaylistsPage() {
    const { Playlist } = await import('./modules/Playlist.js')

    const playlist = new Playlist('playlists')
    

    new Context('playlists')

    playlist.renderPlaylists('preview-container')
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
import Menu from './modules/Menu.js';
import Context from './modules/Context.js';
import Toast from './modules/Toast.js';
import Settings from './modules/Settings.js';
import Search from './modules/Search.js';
import Stage from './modules/Stage.js';

const currentFullURL = window.location.origin + window.location.pathname
let cleanPath = currentFullURL.replace(BASE_URL, '') || 'home'
cleanPath = (cleanPath.endsWith('/') ? cleanPath.slice(0, -1) : cleanPath) || 'home';

new Menu()
new Toast()
new Search()

if (!USER_CONFIG.isLoggedIn) { initAuth() } else { new Settings() }

window.scrollTo(0, 0)

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
    const { RenderVideos } = await import('./modules/videos/RenderVideos.js')

    new Context('global')

    new RenderVideos('video')
}
async function initWatchPage() {
    await import('./modules/videos/VideoReact.js')
    const { RenderVideos } = await import('./modules/videos/RenderVideos.js')
    const { Player } = await import('./modules/videos/Player.js')
    const { Video } = await import('./modules/videos/Video.js')
    const { Playlist } = await import('./modules/Playlist.js')
    const { VideoPlayback } = await import('./modules/videos/VideoPlayback.js')

    new Context('global')

    new Player()
    new Video()

    const playlistObj = new Playlist('watch')
    const videolistObj = new RenderVideos('video', 'h')

    await Promise.all([playlistObj.ready, videolistObj.ready])
    
    new VideoPlayback(playlistObj.playlistRawVideos, videolistObj.videosRaw)
}
async function initManagerPage() {
    const { RenderVideos } = await import('./modules/RenderVideos.js')
    const { VideoManager } = await import('./modules/VideoManager.js')
    
    new Context('manager')
    new Stage()
    
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
    // new Stage()

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
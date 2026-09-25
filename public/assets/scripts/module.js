import Menu from     './modules/Menu.js';
import Context from  './modules/Context.js';
import Toast from    './modules/Toast.js';
import Settings from './modules/Settings.js';
import Search from   './modules/Search.js';
import Stage from    './modules/Stage.js';

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
    const { VideoFeed } = await import('./modules/VideoFeed.js')

    new Context('global')

    new VideoFeed('video')
}
async function initWatchPage() {
    await import('./modules/watch/VideoReact.js')
    const { VideoFeed }   = await import('./modules/VideoFeed.js')
    const { Player }      = await import('./modules/watch/Player.js')
    const { VideoDeck }   = await import('./modules/watch/VideoDeck.js')
    const { Playlist }    = await import('./modules/Playlist.js')
    const { PlayAdvance } = await import('./modules/watch/PlayAdvance.js')

    new Context('global')


    new Player()
    new VideoDeck()

    const playlistOBJ = new Playlist('watch')
    const videoFeedOBJ = new VideoFeed('video', 'h')

    await Promise.all([playlistOBJ.ready, videoFeedOBJ.ready])
    
    new PlayAdvance(playlistOBJ.rawVideos, videoFeedOBJ.rawVideos)
}
async function initManagerPage() {
    const { VideoFeed }    = await import('./modules/VideoFeed.js')
    const { VideoManager } = await import('./modules/VideoManager.js')
    
    new Context('manager')
    new Stage()
    
    new VideoManager()
    new VideoFeed('manager', 'h')
}
async function initHistoryPage() {
    const { VideoFeed } = await import('./modules/VideoFeed.js')

    new Context('global')

    new VideoFeed('history', 'h')
}
async function initPlaylistsPage() {
    const { Playlist } = await import('./modules/Playlist.js')

    const playlist = new Playlist('playlists')
    

    new Context('playlists')
    // new Stage()

    playlist.renderPlaylists('video-feed-container')
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
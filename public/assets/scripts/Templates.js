export const Templates = {
    preview(data, isHorizontal) {
        return `
        <a class="preview ${isHorizontal ? 'preview--horizontal' : ''}" href="watch?v=${data.id}">
            <div class="preview__thumb">
                <img src="${BASE_URL + data.thumb}" alt="">
            </div>
            <div class="preview__body f-row">
                <div class="preview__left">
                    <div class="avatar">
                        <img src="${BASE_URL + data.uploader_avatar}" alt="">
                    </div>
                </div>
                <div class="preview__center">
                        <h3 class="preview__title">
                            ${htmlspecialchars(data.title)}
                        </h3>
                        <div class="preview__uploader">
                            ${htmlspecialchars(data.uploader_name)}
                        </div>
                        <div class="preview__stats">
                            ${data.views} views • ${timeAgo(data.created)}
                        </div>
                </div>
                <div class="preview__right">
                    <button class="context-btn" data-context-btn data-context-id="${data.id}">
                        <svg height="24" viewBox="0 0 24 24" width="24">
                            <path d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </a> 
        `
    },
    playlistPreview(data) {
        return `
        <a class="preview" href="watch?v=${data.video_id}&playlist=${data.playlist_id}">
            <div class="preview__thumb">
                <img src="${BASE_URL + data.thumb}" alt="">
            </div>    
            <div class="preview__body f-row">
                <div class="preview__center">
                        <h3 class="preview__title">
                            ${htmlspecialchars(data.title)}
                        </h3>
                        <div class="preview__uploader">
                            ${htmlspecialchars(data.username)}
                        </div>
                </div>
                <div class="preview__right">
                    <button class="context-btn" data-context-btn data-context-id="${data.playlist_id}">
                        <svg height="24" viewBox="0 0 24 24" width="24">
                            <path d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </a> 
        `
    },
    playlistPreviewEdit(data) {
        return `
        <a class="preview preview--edit preview--horizontal" href="watch?v=${data.id}">
            <div class="preview__thumb">
                <img src="${BASE_URL + data.thumb}" alt="">
            </div>
            <div class="preview__body f-row">
                <div class="preview__left">
                    <div class="avatar">
                        <img src="${BASE_URL + data.uploader_avatar}" alt="">
                    </div>
                </div>
                <div class="preview__center">
                        <h3 class="preview__title">
                            ${htmlspecialchars(data.title)}
                        </h3>
                        <div class="preview__uploader">
                            ${htmlspecialchars(data.uploader_name)}
                        </div>
                </div>
                <div class="preview__right f-column-between" data-edit-id="${data.id}">
                    <button class="btn--secondary f-row-center playlist-menu__delete-btn" data-edit-btn="delete">
                        <svg class="delete-icon" width="24px" height="24px" viewBox="0 -960 960 960">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                        </svg>
                        <svg class="deny-icon" width="24px" height="24px" viewBox="0 -960 960 960">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    </button>
                    <div class="preview__move">
                        <button class="btn--secondary" data-edit-btn="moveUp">
                            <svg width="24px" height="24px" viewBox="0 -960 960 960">
                                <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/>
                            </svg>
                        </button>
                        <button class="btn--secondary" data-edit-btn="moveDown">
                            <svg width="24px" height="24px" viewBox="0 -960 960 960">
                                <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </a> 
        `
    },
    
    contextGlobal() {
        return `
        <ul class="context__list">
            <li class="context__item">
                <button class="context__button context__share">
                    Share
                </button>
            </li>
        </ul>
        `
    },
    contextManager() {
        return `
        <ul class="context__list">
            <li class="context__item">
                <button class="context__button context__share">
                    Share
                </button>
            </li>
            <li class="context__item">
                <button class="context__button context__delete">
                    Delete
                </button>
            </li>
        </ul>
        `
    },
    contextPlaylists() {
        return `
        <ul class="context__list">
            <li class="context__item">
                <button class="context__button context__share">
                    Share
                </button>
            </li>
            <li class="context__item">
                <button class="context__button context__edit" data-menu-btn="edit">
                    Edit
                </button>
            </li>
        </ul>
        `
    },
    playlistWatch(info, videos) {
        return `
        <div class="preview__playlist playlist">
            <div class="playlist__header">
                <h2 class="playlist__title">
                    ${htmlspecialchars(info['title'])}
                </h2>
                <span>${info['id']}</span>
                <span>${info['type']}</span>
                <span>${htmlspecialchars(info['username'])}</span>
                <span>${info['amount']}</span>
            </div>
            <div class="playlist__list">
            ${
                videos.map((video) => {
                    return `
                    <a class="preview preview--horizontal" href="watch?v=<?php echo $video['id'] . '&playlist=' . $info['id']; ?>">
                        <div class="preview__thumb">
                            <img src="${BASE_URL + video['thumb']}" 
                            alt="Thumb of ${htmlspecialchars(video['title'])}">
                        </div>
                        <div class="preview__body f-row">
                            <div class="preview__left">
                                <div class="avatar">
                                    <img src="${BASE_URL + video['uploader_avatar']}" alt="avatar">
                                </div>
                            </div>
                            <div class="preview__center">
                                <h3 class="preview__title">
                                    ${htmlspecialchars(video['title'])}
                                </h3>
                                <div class="preview__uploader">
                                    ${htmlspecialchars(video['uploader_name'])}
                                </div>
                                <div class="preview__stats">
                                    ${video['views'] + " views • " + timeAgo(video['created'])}
                                </div>
                            </div>
                            <div class="preview__right">
                                <button class="context-btn" data-context-btn data-context-id="${video['id']}">
                                    <svg height="24" viewBox="0 0 24 24" width="24">
                                        <path d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </a>
                    `
                }).join('')

            }
            <?php endforeach; ?>
            </div>
        </div>
        `
    }
}
const htmlspecialchars = (str) => {
    if (!str) return ""

    return str.replace(/[&<>"']/g, (s) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[s]);
};
const timeAgo = (date) => {
    const now = new Date()
    const created = new Date(date);

    const diff = Math.floor((now - created) / 1000)

    if (diff < 60) return 'now';

    const minutes = Math.floor(diff / 60)
    if (minutes < 60) return `${minutes} min. ago`

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h. ago`

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} d. ago`

    const weeks = Math.floor(days / 7);
    if (days < 30) return `${weeks} w. ago`

    const months = Math.floor(days / 30.44);
    if (months < 12) return `${months} mo. ago`

    const years = Math.floor(months / 12);
    return `${years} y. ago`
}
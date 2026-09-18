import { htmlspecialchars, timeAgo } from "./modules/helper.js"

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
    contextMenu(content) {
        return `
        <ul class="context__list">
        ${
            content.map((btn) => {
            return `
            <li class="context__item">
                ${btn}
            </li>`
            }).join('')

        }
        </ul>
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
                <div class="preview__right f-column-between" data-pl-edit-id="${data.id}">
                    <button class="btn--secondary f-row-center playlist-menu__delete-btn" data-pl-edit-btn="delete">
                        <svg class="delete-icon" width="24px" height="24px" viewBox="0 -960 960 960">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                        </svg>
                        <svg class="deny-icon" width="24px" height="24px" viewBox="0 -960 960 960">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    </button>
                    <div class="preview__move">
                        <button class="btn--secondary" data-pl-edit-btn="moveUp">
                            <svg width="24px" height="24px" viewBox="0 -960 960 960">
                                <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/>
                            </svg>
                        </button>
                        <button class="btn--secondary" data-pl-edit-btn="moveDown">
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
    playlistWatch(details, videos) {
        return `
        <div class="watch-playlist">
            <div class="watch-playlist__header">
                <h2 class="watch-playlist__title">
                    ${htmlspecialchars(details['title'])}
                </h2>
                <div class="watch-playlist__details">
                    <span class="watch-playlist__user">
                        ${htmlspecialchars(details['username'])}
                    </span>
                    <div class="watch-playlist__meta f-row-between">
                        <span class="watch-playlist__type f-row">
                            ${typeIcon[details['type']] + details['type']}
                        </span>
                        <span class="watch-playlist__amount">
                            ${details['amount']}
                        </span>
                    </div>
                </div>
            </div>
            <div class="watch-playlist__list f-column">
            ${
            videos.map(({
            id, thumb, uploader_avatar, title, uploader_name, views, created
        }) => {
                    return `
                    <a class="preview preview--horizontal" href="watch?v=${id}&playlist=${details['id']}">
                        <div class="preview__thumb">
                            <img src="${BASE_URL + thumb}" 
                            alt="Thumb of ${htmlspecialchars(title)}">
                        </div>
                        <div class="preview__body f-row">
                            <div class="preview__left">
                                <div class="avatar">
                                    <img src="${BASE_URL + uploader_avatar}" 
                                    alt="${uploader_name}'s avatar">
                                </div>
                            </div>
                            <div class="preview__center">
                                <h3 class="preview__title">
                                    ${htmlspecialchars(title)}
                                </h3>
                                <div class="preview__uploader">
                                    ${htmlspecialchars(uploader_name)}
                                </div>
                                <div class="preview__stats">
                                    ${views + " views • " + timeAgo(created)}
                                </div>
                            </div>
                            <div class="preview__right">
                                <button class="context-btn" data-context-btn data-context-id="${id}">
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
            </div>
        </div>
        `
    },

}

const typeIcon = {
    private: `
    <svg width="24px "height="24px" viewBox="0 -960 960 960">
        <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm296.5-143.5Q560-327 560-360t-23.5-56.5Q513-440 480-440t-56.5 23.5Q400-393 400-360t23.5 56.5Q447-280 480-280t56.5-23.5ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/>
    </svg>`,
    public: `
    <svg width="24px" height="24px" viewBox="0 -960 960 960">
        <path d="M240-160h480v-400H240v400Zm296.5-143.5Q560-327 560-360t-23.5-56.5Q513-440 480-440t-56.5 23.5Q400-393 400-360t23.5 56.5Q447-280 480-280t56.5-23.5ZM240-160v-400 400Zm0 80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h280v-80q0-83 58.5-141.5T720-920q83 0 141.5 58.5T920-720h-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80h120q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Z"/>
    </svg>
    `
}
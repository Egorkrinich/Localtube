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
                            ${data.views} views • ${data.ago}
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
            content.map((item) => `
            <li class="context__item">
                <button class="context__button context__${item.class}">
                ${item.body}
                </button>
            </li>
            `).join('')
        }
        </ul>
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
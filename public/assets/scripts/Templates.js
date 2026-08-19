export const Templates = {
    preview({id, thumb, title, views, ago, user_id}, isHorizontal) {
        return `
        <a class="preview ${isHorizontal ? 'preview--horizontal' : ''}" href="watch?v=${id}">
            <div class="preview__thumb">
                <img src="${BASE_URL}${thumb}" alt="">
            </div>
            <div class="preview__body f-row">
                <div class="preview__left">
                    <div class="avatar">
                        <img src="./assets/images/user-test.png" alt="">
                    </div>
                </div>
                <div class="preview__center">
                        <h3 class="preview__title">
                            ${title}
                        </h3>
                        <div class="preview__uploader">
                            Test
                        </div>
                        <div class="preview__stats">
                            ${views} views • ${ago}
                        </div>
                </div>
                <div class="preview__right">
                    <button class="interact-more" data-context-btn data-context-id="${id}">
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
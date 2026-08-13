export const Templates = {
    preview({id, thumb, title, views, created, user_id}) {
        return `
        <a class="preview" href="watch?v=${id}">
            <div class="preview__thumb">
                <img src="${BASE_URL}${thumb}" alt="">
            </div>
            <div class="preview__body f-row">
                <div class="preview__info f-row">
                    <div class="avatar">
                        <img src="./assets/images/user-test.png" alt="">
                    </div>
                    <div class="preview__meta">
                        <h3 class="preview__title">
                            ${title}
                        </h3>
                        <div class="preview__uploader">
                            Test
                        </div>
                        <div class="preview__stats">
                            ${views} views • ${created}
                        </div>
                    </div>
                </div>
                <div class="preview__interact">
                    <button class="interact-more">
                        <svg height="24" viewBox="0 0 24 24" width="24">
                            <path d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </a>  
        `
    }
}
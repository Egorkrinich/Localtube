export class Video {
    constructor() {
        this.container = document.querySelector('#video-toolbar')

        this.videoId = new URLSearchParams(window.location.search).get('v')

        this.initListener()
    }
    initListener() {
        this.container.addEventListener('click', (e) => {
            e.preventDefault()
            const btn = e.target.closest('[data-video-action]')
            const attribute = btn.getAttribute('data-video-action')
            btn.disabled = true;
            
            switch (attribute) {
                case 'like':
                    this.rate(btn, 'like')
                break;
                case 'dislike':
                    this.onDislike(btn, 'dislike')
                break;
                case 'share':
                    navigator.clipboard.writeText(BASE_URL + 'watch?v=' + this.videoId);
                    window.dispatchEvent(new CustomEvent('toast', {
                        detail: {
                            message: 'Copied!',
                            success: true
                        }
                    }))
                    btn.disabled = false;
                break;
            }
        })
    }
    rate(btn, action) {
        fetch(`${BASE_URL}API/Videos/${action}?videoId=${this.videoId}`)
        .then((res) => res.json())
        .then((data) => {
            window.dispatchEvent(new CustomEvent('toast', {
                detail: {
                    message: data.message,
                    success: data.success
                }
            }))
        })
        .finally(() => {
            btn.disabled = false
        })
    }

}
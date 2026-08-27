export class Video {
    attrSelector = {
        btn: 'data-video-action',
        btnValue: 'data-btn-value'

    }
    get selector() {
        return {
            like: this.cont.querySelector(`[${this.attrSelector.btn}="like"]`),
            dislike: this.cont.querySelector(`[${this.attrSelector.btn}="dislike"]`)
        }
    }
    constructor(likes, dislikes) {
        this.cont= document.querySelector('#video-body')

        this.videoId = new URLSearchParams(window.location.search).get('v')

        this.like = Number(likes)
        this.dislike = Number(dislikes)

        this.initListener()
    }
    formatter(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            return 0;
        }
        const formatter = new Intl.NumberFormat('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 1
        })

        return formatter.format(value)
    }

    initListener() {
        this.cont.addEventListener('click', (e) => {
            e.preventDefault()
            
            const btn = e.target.closest(`[${this.attrSelector.btn}]`)
            const attr = btn.getAttribute(`${this.attrSelector.btn}`)
            btn.disabled = true;
            
            
            switch (attr) {
                case 'like':
                    this.rate(btn, 'like')
                    break;
                case 'dislike':
                    this.rate(btn, 'dislike')
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
        fetch(`${BASE_URL}API/Videos/rate?videoId=${this.videoId}&action=${action}`)
        .then((res) => res.json())
        .then((data) => {
            if (!data.success) {
                window.dispatchEvent(new CustomEvent('toast', {
                    detail: {
                        message: data.message,
                        success: data.success
                    }
                }))
                return;
            }
            const btnValueEl = 
            btn.querySelector(`[${this.attrSelector.btnValue}]`)

            switch (data.action) {
                case '+':
                    this[action]++
                    btnValueEl.textContent = this.formatter(this[action])
                break
                case '-':
                    this[action]--
                    btnValueEl.textContent = this.formatter(this[action])
                break
                case '+-':
                    this[action]++
                    btnValueEl.textContent = this.formatter(this[action])

                    const inverseAction = action === 'like' ? 'dislike' : 'like';
                    this[inverseAction]--     
                    const inverseBtn = this.selector[inverseAction].querySelector(`[${this.attrSelector.btnValue}]`)
                    inverseBtn.textContent =
                    this.formatter(this[inverseAction])
                break
            }
 
        })
        .finally(() => {
            btn.disabled = false
        })
    }

}
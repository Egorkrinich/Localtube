import { formatTime, ops } from "../helper.js";

const elementCache = new Map();

window.videoState = new Proxy(window.VIDEO_DATA, {
    set(target, key, value) {
      	target[key] = value;

		setTimeout(() => {
		const exclude = ["id", "thumb", "duration"]
      	if (!elementCache.has(key)) {
      	  const foundElements = Array.from(document.querySelectorAll(`[data-vreact="${key}"]`));
      	  elementCache.set(key, foundElements);
      	}
		
      	const elements = elementCache.get(key);
      	elements.forEach(element => {
      	  switch (key) {
      	    case 'video':
				if (element.tagName !== 'VIDEO') break;

				element.src = value
				element.load()
      	    break
			case 'uploader_avatar':
				if (element.tagName !== 'IMG') break;

				element.src = BASE_URL + value
				element.alt = `${target['uploader_name']}'s avatar`  
			break;
			case 'uploader_login':
				if (element.tagName !== 'A') break;
				element.href = BASE_URL + value
			break;
			// case 'like':
			// case 'dislike':
			// 	element.textContent = target[key]
			// break;
			default:
				if (exclude.includes(key)) break;
				element.textContent = value
			break;
      	  }
      	});
		}, 0)
	  
      	return true;
    }
});

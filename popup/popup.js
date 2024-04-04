const checkbox = document.getElementById('checkbox-button')
const clear_button = document.getElementById('clear-all-button')

chrome.runtime.sendMessage({ type: 'get_mode' }, (is_incognito_mode) => {
	checkbox.checked = is_incognito_mode
})

checkbox.addEventListener('change', () => {
	chrome.runtime.sendMessage({
		type: 'set_mode',
		is_incognito: checkbox.checked,
	})
})

clear_button.addEventListener('click', () => {
	chrome.runtime.sendMessage({ type: 'clear_all' })
})

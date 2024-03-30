/*
 * One Time Incognito
 *
 * Usage:   `/README.md`
 * License: `/LICENSE`
 */

//? For shortcut commands
let is_incognito_mode = false

const load_mode = () => {
	chrome.storage.local.get('is_incognito_mode', (data) => {
		if (data.is_incognito_mode !== undefined) {
			is_incognito_mode = data.is_incognito_mode
			set_mode(is_incognito_mode)
		} else {
			chrome.storage.local.set({ is_incognito_mode: is_incognito_mode })
		}
	})
}

load_mode()

chrome.commands.onCommand.addListener((command) => {
	switch (command) {
		case 'toggle_mode':
			set_mode(!is_incognito_mode)
			break
		case 'clear_all_history':
			remove_all_history()
			break
		default:
			break
	}
})

// Default shortcut: Alt+I
const set_mode = (is_incognito_mode_ref) => {
	chrome.storage.local.set({ is_incognito_mode: is_incognito_mode_ref })

	const icon_path = is_incognito_mode_ref
		? '48-incognito-icon.png'
		: '48-normal-icon.png'
	chrome.action.setIcon({ path: `./images/icons/${icon_path}` })

	if (is_incognito_mode_ref) {
		chrome.history.onVisited.addListener(remove_current_history)
	} else {
		chrome.history.onVisited.removeListener(remove_current_history)
	}
}

const remove_current_history = (history_item) => {
	chrome.history.deleteUrl({ url: history_item.url })
}

// Default shortcut: Alt+H
const remove_all_history = () => {
	chrome.history.deleteAll(() => {
		console.log('Removed all history.')
	})
}

//? For popup screen
chrome.runtime.onMessage.addListener((message, sender, send_response) => {
	if (message.type === 'set_mode') {
		set_mode(message.is_incognito)
	} else if (message.type === 'get_mode') {
		send_response(is_incognito_mode)
	}
})

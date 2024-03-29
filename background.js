/*
 * One Time Incognito
 *
 * Usage: `/README.md`
 * License: `/LICENSE`
 */

//? For shortcut commands

let is_incognito_mode = false

chrome.commands.onCommand.addListener((command) => {
	switch (command) {
		case 'toggle_mode':
			is_incognito_mode = !is_incognito_mode
			set_mode(is_incognito_mode)
			break
		case 'clear_all_history':
			remove_all_history()
			break
		default:
			break
	}
})

const set_mode = (is_incognito_mode_ref) => {
	const icon_path = is_incognito_mode_ref ? '48-incognito-icon.png' : '48-normal-icon.png'
	chrome.action.setIcon({ path: `./images/icons/${icon_path}` })

	if (is_incognito_mode_ref) {
		chrome.history.onVisited.addListener(remove_current_history)
	} else {
		chrome.history.onVisited.removeListener(remove_current_history)
	}
}

const remove_current_history = (history_item) => {
	console.log(history_item)
	chrome.history.deleteUrl({ url: history_item.url })
}

// Default shortcut: Alt+H
const remove_all_history = () => {
	chrome.history.deleteAll(() => {
		console.log('Removed all history.')
	})
}

//? For popup screen

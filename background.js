/*
* One Time Incognito
* 
* Usage: `/README.md`
* License: `/LICENSE`
*/

let is_enable_incognito_mode = false
let start_time,
	end_time = 0

chrome.commands.onCommand.addListener((command) => {
	switch (command) {
		case 'clear_all_history':
			remoeve_all_history()
			break
		default:
			break
	}
})

chrome.action.onClicked.addListener(() => toggle_mode())

const toggle_mode = () => {
	is_enable_incognito_mode = !is_enable_incognito_mode

	console.clear()
	console.log(is_enable_incognito_mode ? "Incognito mode is enabled" : "Incognito mode is disabled")

	const icon_path = is_enable_incognito_mode
		? '48-incognito-icon.png'
		: '48-normal-icon.png'
	chrome.action.setIcon({ path: `./images/icons/${icon_path}` })

	if (is_enable_incognito_mode) {
		chrome.history.onVisited.addListener(remove_current_history)
	} else {
		chrome.history.onVisited.removeListener(remove_current_history)
	}
}

const remove_current_history = (result) => {
	chrome.history.deleteUrl({ url: result.url })

	const current_history_domain = new URL(result.url).hostname
	const current_history_article = new URL(result.url).pathname
		.replace(/\/+$/, '')
		.split('/')
		.pop()

	if (current_history_article == '') {
		console.log(`Removed URL ${current_history_domain}`)
	} else {
		console.log(
			`Removed URL ${current_history_domain}/.../${decodeURI(
				current_history_article
			)}`
		)
	}
}

const remoeve_all_history = () => {
	chrome.history.deleteAll(() => {
		console.log('Removed all history.')
	})
}

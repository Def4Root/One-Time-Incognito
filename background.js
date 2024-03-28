/*
* One Time Incognito
* Usage is written in `/README.md` file.
~
~ MIT License
~ Copyright © 2024 Def4Root
~
~ Permission is hereby granted, free of charge, to any person obtaining a copy
~ of this software and associated documentation files (the "Software"), to deal
~ in the Software without restriction, including without limitation the rights
~ to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
~ copies of the Software, and to permit persons to whom the Software is
~ furnished to do so, subject to the following conditions:
~ 
~ The above copyright notice and this permission notice shall be included in all
~ copies or substantial portions of the Software.
~ 
~ THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
~ IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
~ FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
~ AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
~ LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
~ OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
~ SOFTWARE.
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

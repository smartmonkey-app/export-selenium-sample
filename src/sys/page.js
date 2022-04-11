/**
 * The contents of this file are subject to the Mozilla Public License
 * Version 1.1 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the
 * specific language governing rights and limitations under the License.
 *
 * Copyright © 2020 Ngô Thạch (https://www.smartmonkey.app). All rights reserved.
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 */

import fs from 'fs'
import path from 'path'
import { Builder, Browser, By, until } from 'selenium-webdriver'
import { Options as ChromeOptions} from 'selenium-webdriver/chrome'
import { Options as EdgeOptions} from 'selenium-webdriver/edge'
import { Options as FirefoxOptions} from 'selenium-webdriver/firefox'
import { convertWildcardToRegExp, matchSimpleUrl } from './utils'

export class Page {
	/**
	 *
	 * @param {String} nameOfBrowser
	 */
	static async create(nameOfBrowser) {
		let result = new Page()
		await result.initialize(nameOfBrowser)
		return result
	}

	/**
	 *
	 * @param {String} nameOfBrowser
	 */
	async initialize(nameOfBrowser) {
		let builder = new Builder().forBrowser(nameOfBrowser)
		switch (nameOfBrowser) {
			case Browser.CHROME:
				builder.setChromeOptions(new ChromeOptions().addArguments('--incognito'))
				break
			case Browser.EDGE:
				builder.setEdgeOptions(new EdgeOptions().addArguments('InPrivate').setEdgeChromium(true))
				break
			case Browser.FIREFOX:
				builder.setFirefoxOptions(new FirefoxOptions().addArguments('-private'))
				break
			case Browser.SARAFI:
				//TODO: I have no mac :)
				break
		}
		let driver = await builder.build()
		await driver.manage().setTimeouts({ implicit: 30000 })

		this.driver = driver
		this.mainWindow = await this.driver.getWindowHandle()
	}

	async close() {
		await this.driver.quit()
	}

	/**
	 *
	 * @param {String} url
	 */
	async goto(url) {
		await this.driver.get(url)
	}

	/**
	 *
	 * @param {By} selector
	 */
	async checkElementExists(selector) {
		try {
			await this.driver.findElement(selector)
		} catch {
			throw new Error(`Element not found: ${selector.toString()}`)
		}
	}

	/**
	 * Focus an element
	 * @param {By} selector
	 */
	async focusElement(selector) {
		await this.checkElementExists(selector)
		await this.driver.executeScript((selector) => {
			let elm =
				selector.using === 'css selector'
					? document.querySelector(selector.value)
					: document.evaluate(
							selector.value,
							document,
							null,
							XPathResult.FIRST_ORDERED_NODE_TYPE,
							null
					  ).singleNodeValue
			if (elm) {
				elm.focus()
			} else {
				throw new Error('Element not found')
			}
		}, selector)
	}

	/**
	 * Stop execution for awhile
	 * @param {Integer} timeout The timeout, in milliseconds
	 */
	sleep(timeout) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve()
			}, timeout)
		})
	}

	/**
	 *
	 * @param {By} selector
	 * @param {String} text
	 */
	async type(selector, text, clearTextBeforeTyping = true) {
		// Locate element
		let elm = this.driver.findElement(selector)
		// Clear old value if needed
		if (clearTextBeforeTyping) {
			await elm.clear()
		}
		// Enter new value
		await elm.sendKeys(text)
	}

	/**
	 *
	 * @param {By} selector
	 */
	async getElementContent(selector) {
		await this.checkElementExists(selector)
		return await this.driver.executeScript((selector) => {
			let elm =
				selector.using === 'css selector'
					? document.querySelector(selector.value)
					: document.evaluate(
							selector.value,
							document,
							null,
							XPathResult.FIRST_ORDERED_NODE_TYPE,
							null
					  ).singleNodeValue
			if (elm) {
				if (typeof elm.value !== 'undefined') {
					return elm.value
				} else {
					return elm.innerText
				}
			} else {
				throw new Error(`No element matches [${selector}]`)
			}
		}, selector)
	}

	/**
	 *
	 * @param {By} selector
	 * @param {String} text
	 * @param {Integer} tryCount
	 */
	async testElementContainsText(
		selector,
		text,
		comparisionMode,
		negative = false,
		tryCount = 5
	) {
		let elementText
		let errorCount = 0
		while (errorCount < tryCount) {
			elementText = await this.getElementContent(selector)
			let ok
			switch (comparisionMode) {
				case 'Normal':
					ok = elementText.indexOf(text) >= 0
					break

				case 'Wildcard':
					ok = new RegExp(convertWildcardToRegExp(text)).test(elementText)
					break

				case 'RegularExpression':
					ok = new RegExp(text).test(elementText)
					break
			}

			if (ok !== negative) {
				return
			} else {
				errorCount++
				await this.sleep(250)
			}
		}

		if (negative) {
			throw new Error(
				`Element [${selector}] contains [${text}]: ${elementText}`
			)
		} else {
			throw new Error(
				`Element [${selector}] not contain [${text}]: ${elementText}`
			)
		}
	}

	/**
	 *
	 * @param {By} selector
	 * @param {Array|String} value
	 */
	async select(selector, value) {
		let elm = await this.driver.findElement(selector)
		let options = await elm.findElements(By.css('option'))
		for (let opt of options) {
			let text = await opt.getText()
			// Single value select
			if (typeof value === 'string') {
				if (text === value) {
					await opt.click()
				}
			} else {
				let selected = await opt.isSelected()
				if (value.indexOf(text) >= 0) {
					if (!selected) {
						await opt.click()
					}
				}
				// Clear selected option
				else if (selected) {
					await opt.click()
				}
			}
		}
	}

	/**
	 *
	 * @param {By} selector
	 */
	async getSelectState(selector) {
		await this.checkElementExists(selector)
		return await this.driver.executeScript((selector) => {
			let elm =
				selector.using === 'css selector'
					? document.querySelector(selector.value)
					: document.evaluate(
							selector.value,
							document,
							null,
							XPathResult.FIRST_ORDERED_NODE_TYPE,
							null
					  ).singleNodeValue
			if (elm && elm.selectedOptions) {
				let result = []
				for (let opt of elm.selectedOptions) {
					result.push(opt.value)
				}
				return result
			}

			return null
		}, selector)
	}

	/**
	 *
	 * @param {By} selector
	 * @param {Array} selectedValues
	 * @param {Integer} tryCount
	 */
	async testSelectState(selector, selectedValues, tryCount = 5) {
		let errorCount = 0
		while (errorCount < tryCount) {
			try {
				expect(await this.getSelectState(selector)).toEqual(selectedValues)
				break
			} catch (e) {
				if (errorCount < tryCount - 1) {
					errorCount++
					await this.sleep(250)
				} else {
					throw e
				}
			}
		}
	}

	/**
	 * Pick value from an element
	 * @param {By} selector CSS selector of element to pick value from
	 * @param {Object} options Options
	 */
	async pickValue(selector, options) {
		let text = await this.getElementContent(selector)
		if (options.dataType === 'regExp') {
			let flags = options.ignoreCase ? 'i' : '' + options.multiLine ? 'm' : ''
			let regExp = new RegExp(options.regExp, flags)
			let match = regExp.exec(text)
			if (match.length > 0) {
				return match[options.matchIndex]
			}
			throw new Error('RegExp not match')
		} else {
			if (options.trimLeft) {
				text = text.trimLeft()
			}
			if (options.trimRight) {
				text = text.trimRight()
			}
			return text
		}
	}

	/**
	 *
	 * @param {By} selector
	 */
	async clickElement(selector) {
		await this.driver.findElement(selector).click()
	}

	/**
	 *
	 * @param {By} selector
	 * @param {Boolean} state
	 */
	async setCheckState(selector, state) {
		await this.checkElementExists(selector)
		await this.driver.executeScript(
			(selector, state) => {
				let elm =
					selector.using === 'css selector'
						? document.querySelector(selector.value)
						: document.evaluate(
								selector.value,
								document,
								null,
								XPathResult.FIRST_ORDERED_NODE_TYPE,
								null
						  ).singleNodeValue
				if (elm) {
					if (elm.checked !== state) {
						if (elm.labels && elm.labels.length) {
							elm.labels[0].click()
						} else {
							elm.click()
						}
					}
				} else {
					throw new Error(`No element matches [${selector}]`)
				}
			},
			selector,
			state
		)
	}

	/**
	 *
	 * @param {By} selector
	 * @param {Boolean} state
	 * @param {Integer} tryCount
	 */
	async testCheckState(selector, state, tryCount = 5) {
		let errorCount = 0
		while (errorCount < tryCount) {
			try {
				let checkState = await this.driver.executeScript((selector) => {
					let elm =
						selector.using === 'css selector'
							? document.querySelector(selector.value)
							: document.evaluate(
									selector.value,
									document,
									null,
									XPathResult.FIRST_ORDERED_NODE_TYPE,
									null
							  ).singleNodeValue
					if (elm) {
						return elm.checked
					} else {
						throw new Error(`No element matches [${selector}]`)
					}
				}, selector)

				if (checkState === state) {
					break
				}
			} catch (e) {
				if (errorCount < tryCount - 1) {
					errorCount++
					await this.sleep(250)
				} else {
					throw e
				}
			}
		}
	}

	/**
	 *
	 * @param {By} selector
	 * @param {Array} files
	 */
	async setFilesToUpload(selector, files) {
		if (files && files.length) {
			await this.driver.findElement(selector).sendKeys(files.join('\n'))
		}
	}

	/**
	 *
	 * @param {By} selector
	 */
	async takeElementScreenshot(selector) {
		function createScreenshotFilename() {
			let now = new Date()
			let dir = path.join(__dirname, '..', 'screenshots')
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir)
			}

			return path.join(
				dir,
				`${now.getFullYear()}-${
					now.getMonth() + 1
				}-${now.getDate()}-${Date.now()}.png`
			)
		}

		const filename = createScreenshotFilename()
		const elm = await this.driver.findElement(selector)
		const buffer = new Buffer.from(await elm.takeScreenshot(true), 'base64')
		fs.writeFileSync(filename, buffer)

		return filename
	}

	/**
	 *
	 * @param {*} url
	 * @param {*} comparisionMode
	 */
	async testAddress(url, comparisionMode, tryCount = 5) {
		let errorCount = 0
		while (errorCount < tryCount) {
			let ok
			let pageUrl = await this.driver.getCurrentUrl()
			switch (comparisionMode) {
				case 'Simple':
					ok = matchSimpleUrl(url, pageUrl)
					break
				case 'SameValue':
					ok = url === pageUrl
					break
				case 'RegularExpression':
					ok = new RegExp(url).test(pageUrl)
					break
			}

			if (ok) {
				return true
			} else {
				errorCount++
				await page.sleep(250)
			}
		}

		throw new Error(`Address not match [${url}]`)
	}

	/**
	 * Get Javascript dialog (alert, confirm, prompt)
	 */
	async getDialog() {
		await this.driver.wait(until.alertIsPresent())
		return await this.driver.switchTo().alert()
	}

	/**
	 *
	 * @param {String|null} input
	 */
	async dialogAccept(input = null) {
		let dialog = await this.getDialog()
		if (input) {
			await dialog.sendKeys(input)
		}
		await dialog.accept()
	}

	/**
	 *
	 */
	async dialogDismiss() {
		await (await this.getDialog()).dismiss()
	}

	/**
	 *
	 */
	async dialogGetText() {
		return await (await this.getDialog()).getText()
	}

	/**
	 * 
	 */
	async switchToMainWindow() {
		await this.driver.switchTo().window(this.mainWindow)
	}

	/**
	 * 
	 */
	async switchToRecentPopup() {
		let handles = await this.driver.getAllWindowHandles()
		await this.driver.switchTo().window(handles.pop())
	}
}

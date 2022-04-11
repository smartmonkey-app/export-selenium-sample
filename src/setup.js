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

const Browser = require('selenium-webdriver').Browser
process.env.defBrowser = Browser.FIREFOX
// ENV arg
for (let arg of process.argv) {
    let matches = /^--ENV=(\w+)$/i.exec(arg)
    if (matches) {
        process.env.ENV = matches[1]
    }
}
// Defined browser arg
for (let arg of process.argv) {
    let matches = /^--defBrowser=(firefox|chrome|edge|safari)$/i.exec(arg)
    if (matches) {
        let browser = matches[1].toLowerCase()
        switch (browser) {
            case 'chrome':
                browser = Browser.CHROME
                break
            case 'edge':
                browser = Browser.EDGE
                break;
            default:
                browser = Browser.FIREFOX
                break                
            
        }
        process.env.defBrowser = browser
    }
}
//
require('dotenv').config()

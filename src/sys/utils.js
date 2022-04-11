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

import { exec } from 'child_process'
import { URL } from 'url'
import fs from 'fs'
import path from 'path'

/**
 * Load JSON from file
 * @param {String} filename
 */
export function requireJSON(filename) {
    return JSON.parse(fs.readFileSync(filename, 'utf8'))
}

/**
 * Compare images
 * @param {String} file1
 * @param {String} file2
 */
export function compareImage(file1, file2, threshold, negative, mode){

    function getImgCmpAppPath() {
        let result = null
        let dir    = __dirname
        while (dir.length) {
            let binFolder = path.join(dir, 'node_modules', '.bin')
            if (fs.existsSync(binFolder)) {
                result = binFolder
            } else {
                binFolder = path.join(dir, '.bin')
                if (fs.existsSync(binFolder)) {
                    result = binFolder
                }
            }
            let parentDir = path.dirname(dir)
            if (parentDir !== dir) {
                dir = parentDir
            } else {
                break
            }
        }
        if (result) {
            return path.join(result, 'imgcmp')
        } else {
            throw new Error('Image Comparision tool not found')
        }
    }

    return new Promise(async (resolve, reject) => {
        try {
            let imgcmp = getImgCmpAppPath()
            exec(`${imgcmp} --compare "${file1}" "${file2}" --${mode}`, (error, stdout, stderr) => {
                if (error && error.code) {
                    return reject(new Error(error))
                }
                let similarity = parseInt(stdout)
                if ((similarity >= threshold) !== negative) {
                    return resolve(true)
                } else {
                    if (negative) {
                        return reject(new Error(`Image not match: similarity ratio ${similarity}?  greater than ${threshold}?`))
                    } else {
                        return reject(new Error(`Image not match: similarity ratio ${similarity}?  less than ${threshold}?`))
                    }
                }
            })
        } catch (e) {
            return reject(e)
        }
    })
}

/**
 * Convert wildcard to regular expression
 * @param {String} wildcard
 */
export function convertWildcardToRegExp(wildcard){
    let result = ''
    for (let i = 0; i < wildcard.length; i++) {
        let c = wildcard.charAt(i)
        if (c == '*') {
            result = result + '.*'
        } else if (c == '?') {
            result = result + '.?'
        } else if (c == '.') {
            result = result + '\.'
        } else {
            result = result + c
        }
    }
    return result
}


/**
 * Generate random string with options
 * @param {Object} options
 */
export function randomString(options){
    let result = ''
    let characters = options.lowerCaseChars? 'abcdefghijklmnopqrstuvwxyz': ''
        + options.upperCaseChars? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ': ''
        + options.numericDigits? '0123456789': ''
        + options.otherChars? ',./<>?;:"[]\\{}|`~!@#$%^&*()_+=-': ''
    let length = Math.floor(Math.random() * options.maxLength) + options.minLength
    let charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

/**
 * Test simple URL
 */
export function matchSimpleUrl(url1, url2){
    let urlParts1 = new URL(url1)
    let urlParts2 = new URL(url2)

    return (urlParts1.protocol === urlParts2.protocol)
        && (urlParts1.host     === urlParts2.host)
        && (urlParts1.pathname === urlParts2.pathname)
        && (urlParts1.port     === urlParts2.port)
}

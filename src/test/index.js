/**
 * The contents of this file are subject to the MIT license as set out below.
 *
 * Copyright © 2021 Ngô Thạch (https://www.smartmonkey.app)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import path from 'path'
import { By } from 'selenium-webdriver'
import { Page } from '../sys/page'
import {
    compareImage,
    randomString,
    requireJSON
} from '../sys/utils'

const __BROWSER__      = process.env.defBrowser
const __RESOURCE_DIR__ = path.join(__dirname, '..', 'resources')

const buttonClose                 = By.xpath(`//div[@id='exampleModal']//button[@data-dismiss]`)
const buttonContinueToCheckout    = By.xpath(`//form[@id='checkout']//button[@type='submit']`)
const buttonCrop                  = By.xpath(`//p[@id='actions']//button[@id='crop']`)
const buttonDecode                = By.xpath(`//button[@id='btn-decode']`)
const buttonEdit                  = By.xpath(`//p[@id='actions']//button[@id='edit']`)
const buttonEncode                = By.xpath(`//button[@id='btn-encode']`)
const buttonLaunchDemoModal       = By.xpath(`//button[@data-target='#exampleModal']`)
const buttonRedeem                = By.xpath(`//form[@id='cart']//button[@id='promo-code-submit']`)
const buttonShow                  = By.xpath(`//button[@id='btn-alert']`)
const buttonShow__0               = By.xpath(`//button[@id='btn-confirm']`)
const buttonShow__1               = By.xpath(`//button[@id='btn-prompt']`)
const buttonSignIn                = By.xpath(`//div[@id='form-content']//button[@id='btn-signin'] | //form[@id='form-signin']//button[@id='btn-signin']`) //NOTICE: multi-selector
const canvasResultImage           = By.xpath(`//div[@id='result']//canvas[@title='Result image']`)
const checkbox1                   = By.xpath(`//input[@id='inlineCheckbox1']`)
const checkbox2                   = By.xpath(`//input[@id='inlineCheckbox2']`)
const divValidationResult         = By.xpath(`//form[@id='form-email-validator']//div[@id='result'][@title='Validation Result']`)
const fileExampleFileInput        = By.xpath(`//input[@id='exampleFormControlFile1']`)
const fileFileInput               = By.xpath(`//input[@id='file-input']`)
const linkDownload                = By.xpath(`//div[@id='form-content']//a[@id='btn-download']`)
const radio1                      = By.xpath(`//input[@id='inlineRadio1'][@name='inlineRadioOptions']`)
const selectCountry               = By.xpath(`//form[@id='checkout']//select[@id='country']`)
const selectExampleMultipleSelect = By.xpath(`//select[@id='exampleFormControlSelect2']`)
const selectExampleSelect         = By.xpath(`//select[@id='exampleFormControlSelect1']`)
const selectState                 = By.xpath(`//form[@id='checkout']//select[@id='state']`)
const textboxAddress              = By.xpath(`//form[@id='checkout']//input[@id='address']`)
const textboxCcCvv                = By.xpath(`//form[@id='checkout']//input[@id='cc-cvv']`)
const textboxCreditCardNumber     = By.xpath(`//form[@id='checkout']//input[@id='cc-number']`)
const textboxEmailAddress         = By.xpath(`//form[@id='form-email-validator']//input[@id='input-email'][@title='Email address'] | //form[@id='form-signin']//input[@id='input-email']`) //NOTICE: multi-selector
const textboxEmailAddress__0      = By.xpath(`//input[@id='exampleFormControlInput1']`)
const textboxExampleTextarea      = By.xpath(`//textarea[@id='exampleFormControlTextarea1']`)
const textboxExpiration           = By.xpath(`//form[@id='checkout']//input[@id='cc-expiration']`)
const textboxFirstName            = By.xpath(`//form[@id='checkout']//input[@id='firstName']`)
const textboxLastName             = By.xpath(`//form[@id='checkout']//input[@id='lastName']`)
const textboxNameOnCard           = By.xpath(`//form[@id='checkout']//input[@id='cc-name']`)
const textboxPassword             = By.xpath(`//form[@id='form-signin']//input[@id='input-password']`)
const textboxPromoCode            = By.xpath(`//form[@id='cart']//input[@id='promo-code']`)
const textboxResult               = By.xpath(`//textarea[@id='result'][@title='Result']`)
const textboxTextToDecode         = By.xpath(`//textarea[@id='text-to-decode'][@title='Text to decode']`)
const textboxTextToEncode         = By.xpath(`//textarea[@id='text-to-encode'][@title='Text to encode']`)
const textboxZip                  = By.xpath(`//form[@id='checkout']//input[@id='zip']`)

let {
    EncodedString,
    StringToEncode,
    TestDatasetValidationResult,
    TestDatasetEmail,
    baseUrl
} = process.env

baseUrl = baseUrl || `https://www.smartmonkey.app`

describe(`Demo.smproj`, () => {
    it('Base64 encode/decode', async () => {
        let page = await Page.create(__BROWSER__)
        try {
            // Generate random value for [{{StringToEncode}}]
            StringToEncode = randomString({
            	lowerCaseChars: true,
            	upperCaseChars: true,
            	numericDigits: true,
            	minLength: 25,
            	maxLength: 25
            })
            // Navigate to [{{baseUrl}}/demo/base64-encode/]
            await page.goto(`${baseUrl}/demo/base64-encode/`)
            // Focus [Text to encode]
            await page.focusElement(textboxTextToEncode)
            // Enter [{{StringToEncode}}] into [Text to encode]
            await page.type(textboxTextToEncode, `${StringToEncode}`)
            // Click [Encode]
            await page.clickElement(buttonEncode)
            // Set value for [{{EncodedString}}] from [Result]
            EncodedString = await page.pickValue(textboxResult, {
            	trimLeft: true,
            	trimRight: true
            })
            // Navigate to [{{baseUrl}}/demo/base64-decode/]
            await page.goto(`${baseUrl}/demo/base64-decode/`)
            // Focus [Text to decode]
            await page.focusElement(textboxTextToDecode)
            // Enter [{{EncodedString}}] into [Text to decode]
            await page.type(textboxTextToDecode, `${EncodedString}`)
            // Click [Decode]
            await page.clickElement(buttonDecode)
            // Stop execution 3s
            await page.sleep(3000)
            // Check the value of [Result] equals to [{{StringToEncode}}]
            await page.testElementContainsText(textboxResult, `${StringToEncode}`)
        } finally {
            await page.close()
        }
    })

    for (let __data of requireJSON(path.join(__RESOURCE_DIR__, `{1FE7530B-3A02-43A1-AF80-E0FD1A6D6BEB}.smtestdata`)).data) {
        it('Data-Driven Tests', async () => {
            TestDatasetEmail = __data.TestDatasetEmail
            TestDatasetValidationResult = __data.TestDatasetValidationResult

            let page = await Page.create(__BROWSER__)
            try {
                // Navigate to [{{baseUrl}}/demo/ddt/]
                await page.goto(`${baseUrl}/demo/ddt/`)
                // Focus [Email address]
                await page.focusElement(textboxEmailAddress)
                // Enter [{{TestDatasetEmail}}] into [Email address]
                await page.type(textboxEmailAddress, `${TestDatasetEmail}`)
                // Assert [Validation Result] contains [{{TestDatasetValidationResult}}]
                await page.testElementContainsText(divValidationResult, `${TestDatasetValidationResult}`, `Contain`)
            } finally {
                await page.close()
            }
        })

    }

    it('Download', async () => {
        // Download is not support
    })

    it('Form elements', async () => {
        let page = await Page.create(__BROWSER__)
        try {
            // Navigate to [{{baseUrl}}/demo/form/]
            await page.goto(`${baseUrl}/demo/form/`)
            // Focus [Email address] by mouse
            await page.focusElement(textboxEmailAddress__0)
            // Enter [testform@smartmonkey.app] into [Email address]
            await page.type(textboxEmailAddress__0, `testform@smartmonkey.app`)
            // Select [7] from [Example select]
            await page.select(selectExampleSelect, '7')
            // Select [2, 7, 8] from [Example multiple select]
            await page.select(selectExampleMultipleSelect, ['2', '7', '8'])
            // Focus [Example textarea] by mouse
            await page.focusElement(textboxExampleTextarea)
            // Enter [Test] into [Example textarea]
            await page.type(textboxExampleTextarea, `Test`)
            // Select [water-lily.jpg]
            await page.setFilesToUpload(fileExampleFileInput, [
            	path.join(__RESOURCE_DIR__, `{601618A1-74AA-44D3-94F9-EECD87C74460}`, `water-lily.jpg`)
            ])
            // Check [1]
            await page.setCheckState(checkbox1, true)
            // Check [2]
            await page.setCheckState(checkbox2, true)
            // Select [1]
            await page.setCheckState(radio1, true)
            // Click [Launch demo modal]
            await page.clickElement(buttonLaunchDemoModal)
            // Assert [Current page] contains [Demo modal with transition!]
            await page.testElementContainsText(By.xpath(`//body`), `Demo modal with transition!`, `Contain`)
            // Click [×]
            await page.clickElement(buttonClose)
        } finally {
            await page.close()
        }
    })

    it('Image crop', async () => {
        let page = await Page.create(__BROWSER__)
        try {
            // Navigate to [{{baseUrl}}/demo/image-crop/]
            await page.goto(`${baseUrl}/demo/image-crop/`)
            // Select [water-lily.jpg]
            await page.setFilesToUpload(fileFileInput, [
            	path.join(__RESOURCE_DIR__, `{15247585-1A44-466F-9C3C-FF92348898E5}`, `water-lily.jpg`)
            ])
            // Click [Edit]
            await page.clickElement(buttonEdit)
            // Click [Crop]
            await page.clickElement(buttonCrop)
            // [Result image] matchs captured image at least 97.5%
            await compareImage(
                path.join(__RESOURCE_DIR__, `{9C82CAFA-EB1A-4DBA-8FA8-5A1BB8E7C446}.bmp`),
                await page.takeElementScreenshot(canvasResultImage),
                975,
                false,
                'CIE94'
            )
        } finally {
            await page.close()
        }
    })

    it('Native Dialogs', async () => {
        let page = await Page.create(__BROWSER__)
        try {
            // Navigate to [{{baseUrl}}/demo/native-dialogs/]
            await page.goto(`${baseUrl}/demo/native-dialogs/`)
            // Click [Show]
            await page.clickElement(buttonShow)
            //  
            await page.dialogAccept()
            // Click [Show]
            await page.clickElement(buttonShow__0)
            //  
            await page.dialogAccept()
            // Click [Show]
            await page.clickElement(buttonShow__1)
            //  
            expect(await page.dialogGetText()).toEqual(`What do you think about Smart Monkey?`)
            await page.dialogAccept(``)
        } finally {
            await page.close()
        }
    })

    it('Multi-Windows and Popup', async () => {
        let page1 = await Page.create(__BROWSER__)
        try {
            let page2 = await Page.create(__BROWSER__)
            try {
                // Navigate to [{{baseUrl}}/demo/popup/]
                await page1.goto(`${baseUrl}/demo/popup/`)
                // Click [Sign in]
                await page1.clickElement(buttonSignIn)
                // [Window 1] creates a popup
                await page1.switchToRecentPopup()
                // Focus [Email address]
                await page1.focusElement(textboxEmailAddress)
                // Enter [demo1@smartmonkey.app] into [Email address]
                await page1.type(textboxEmailAddress, `demo1@smartmonkey.app`)
                // Focus [Password] by keyboard
                await page1.focusElement(textboxPassword)
                // Enter [wrongpassword] into [Password]
                await page1.type(textboxPassword, `wrongpassword`)
                // Click [Sign in]
                await page1.clickElement(buttonSignIn)
                //  
                await page1.dialogAccept()
                // Focus [Password] by mouse
                await page1.focusElement(textboxPassword)
                // Enter [demo] into [Password]
                await page1.type(textboxPassword, `demo`)
                // Click [Sign in]
                await page1.clickElement(buttonSignIn)
                await page1.switchToMainWindow()
                // Assert [Current page] contains [Welcome demo1@smartmonkey.app]
                await page1.testElementContainsText(By.xpath(`//body`), `Welcome demo1@smartmonkey.app`, `Contain`)
                // Navigate to [{{baseUrl}}/demo/popup/]
                await page2.goto(`${baseUrl}/demo/popup/`)
                // Click [Sign in]
                await page2.clickElement(buttonSignIn)
                // [Window 2] creates a popup
                await page2.switchToRecentPopup()
                // Focus [Email address]
                await page2.focusElement(textboxEmailAddress)
                // Enter [demo2@smartmonkey.app] into [Email address]
                await page2.type(textboxEmailAddress, `demo2@smartmonkey.app`)
                // Focus [Password] by keyboard
                await page2.focusElement(textboxPassword)
                // Enter [demo] into [Password]
                await page2.type(textboxPassword, `demo`)
                // Click [Sign in]
                await page2.clickElement(buttonSignIn)
                await page2.switchToMainWindow()
                // Assert [Current page] contains [Welcome demo2@smartmonkey.app]
                await page2.testElementContainsText(By.xpath(`//body`), `Welcome demo2@smartmonkey.app`, `Contain`)
            } finally {
                await page2.close()
            }
        } finally {
            await page1.close()
        }
    })

    it('Promo-code', async () => {
        let page = await Page.create(__BROWSER__)
        try {
            // Navigate to [{{baseUrl}}/demo/promo-code/]
            await page.goto(`${baseUrl}/demo/promo-code/`)
            // Focus [First name] by mouse
            await page.focusElement(textboxFirstName)
            // Enter [Thach] into [First name]
            await page.type(textboxFirstName, `Thach`)
            // Focus [Last name] by mouse
            await page.focusElement(textboxLastName)
            // Enter [Ngo] into [Last name]
            await page.type(textboxLastName, `Ngo`)
            // Focus [Address] by mouse
            await page.focusElement(textboxAddress)
            // Enter [1 Milky Way] into [Address]
            await page.type(textboxAddress, `1 Milky Way`)
            // Select [Vietnam] from [Country]
            await page.select(selectCountry, 'Vietnam')
            // Select [Hue] from [State]
            await page.select(selectState, 'Hue')
            // Focus [Zip] by mouse
            await page.focusElement(textboxZip)
            // Enter [123456] into [Zip]
            await page.type(textboxZip, `123456`)
            // Click [Continue to checkout]
            await page.clickElement(buttonContinueToCheckout)
            // Assert [Current page] contains [Name on card is required]
            await page.testElementContainsText(By.xpath(`//body`), `Name on card is required`, `Contain`)
            // Focus [Name on card] by mouse
            await page.focusElement(textboxNameOnCard)
            // Enter [Thach Ngo] into [Name on card]
            await page.type(textboxNameOnCard, `Thach Ngo`)
            // Focus [Credit card number] by mouse
            await page.focusElement(textboxCreditCardNumber)
            // Enter [123456789] into [Credit card number]
            await page.type(textboxCreditCardNumber, `123456789`)
            // Focus [Expiration] by mouse
            await page.focusElement(textboxExpiration)
            // Enter [12/25] into [Expiration]
            await page.type(textboxExpiration, `12/25`)
            // Focus [cc-cvv] by mouse
            await page.focusElement(textboxCcCvv)
            // Enter [123] into [cc-cvv]
            await page.type(textboxCcCvv, `123`)
            // Assert [Current page] contains [Total (USD)
            // $25]
            await page.testElementContainsText(By.xpath(`//body`), `Total (USD)
$25`, `Contain`)
            // Focus [Promo code] by mouse
            await page.focusElement(textboxPromoCode)
            // Enter [5-OFF] into [Promo code]
            await page.type(textboxPromoCode, `5-OFF`)
            // Click [Redeem]
            await page.clickElement(buttonRedeem)
            // Assert [Current page] contains [Promo code
            // 5-OFF]
            await page.testElementContainsText(By.xpath(`//body`), `Promo code
5-OFF`, `Contain`)
            // Assert [Current page] contains [Total (USD)
            // $20]
            await page.testElementContainsText(By.xpath(`//body`), `Total (USD)
$20`, `Contain`)
            // Click [Continue to checkout]
            await page.clickElement(buttonContinueToCheckout)
            // Assert [Current page] contains [Thank you for your order]
            await page.testElementContainsText(By.xpath(`//body`), `Thank you for your order`, `Contain`)
            // Assert [Current page] contains [Your order has been received and is now being processed.]
            await page.testElementContainsText(By.xpath(`//body`), `Your order has been received and is now being processed.`, `Contain`)
        } finally {
            await page.close()
        }
    })

    it('Promo-code 2', async () => {
        let page = await Page.create(__BROWSER__)
        try {
            // Navigate to [{{baseUrl}}/demo/promo-code2/]
            await page.goto(`${baseUrl}/demo/promo-code2/`)
            // Focus [First name] by mouse
            await page.focusElement(textboxFirstName)
            // Enter [Thach] into [First name]
            await page.type(textboxFirstName, `Thach`)
            // Focus [Last name] by mouse
            await page.focusElement(textboxLastName)
            // Enter [Ngo] into [Last name]
            await page.type(textboxLastName, `Ngo`)
            // Focus [Address] by mouse
            await page.focusElement(textboxAddress)
            // Enter [1 Milky Way] into [Address]
            await page.type(textboxAddress, `1 Milky Way`)
            // Select [Vietnam] from [Country]
            await page.select(selectCountry, 'Vietnam')
            // Select [Hue] from [State]
            await page.select(selectState, 'Hue')
            // Focus [Zip] by mouse
            await page.focusElement(textboxZip)
            // Enter [123456] into [Zip]
            await page.type(textboxZip, `123456`)
            // Focus [Name on card] by mouse
            await page.focusElement(textboxNameOnCard)
            // Enter [Thach Ngo] into [Name on card]
            await page.type(textboxNameOnCard, `Thach Ngo`)
            // Focus [Credit card number] by mouse
            await page.focusElement(textboxCreditCardNumber)
            // Enter [123456789] into [Credit card number]
            await page.type(textboxCreditCardNumber, `123456789`)
            // Focus [Expiration] by mouse
            await page.focusElement(textboxExpiration)
            // Enter [12/25] into [Expiration]
            await page.type(textboxExpiration, `12/25`)
            // Focus [cc-cvv] by mouse
            await page.focusElement(textboxCcCvv)
            // Enter [123] into [cc-cvv]
            await page.type(textboxCcCvv, `123`)
            // Assert [Current page] contains [Total (USD)
            // $25]
            await page.testElementContainsText(By.xpath(`//body`), `Total (USD)
$25`, `Contain`)
            // Focus [Promo code] by mouse
            await page.focusElement(textboxPromoCode)
            // Enter [5-OFF] into [Promo code]
            await page.type(textboxPromoCode, `5-OFF`)
            // Click [Redeem]
            await page.clickElement(buttonRedeem)
            // Assert [Current page] contains [Promo code
            // 5-OFF]
            await page.testElementContainsText(By.xpath(`//body`), `Promo code
5-OFF`, `Contain`)
            // Assert [Current page] contains [Total (USD)
            // $20]
            await page.testElementContainsText(By.xpath(`//body`), `Total (USD)
$20`, `Contain`)
            // Focus [Promo code] by mouse
            await page.focusElement(textboxPromoCode)
            // Enter [9WEEKEND] into [Promo code]
            await page.type(textboxPromoCode, `9WEEKEND`)
            // Click [Redeem]
            await page.clickElement(buttonRedeem)
            // Assert [Current page] contains [Promo code
            // 9WEEKEND]
            await page.testElementContainsText(By.xpath(`//body`), `Promo code
9WEEKEND`, `Contain`)
            // Assert [Current page] contains [Total (USD)
            // $22.5]
            await page.testElementContainsText(By.xpath(`//body`), `Total (USD)
$22.5`, `Contain`)
            // Click [Continue to checkout]
            await page.clickElement(buttonContinueToCheckout)
            // Assert [Current page] contains [Thank you for your order]
            await page.testElementContainsText(By.xpath(`//body`), `Thank you for your order`, `Contain`)
            // Assert [Current page] contains [Your order has been received and is now being processed.]
            await page.testElementContainsText(By.xpath(`//body`), `Your order has been received and is now being processed.`, `Contain`)
        } finally {
            await page.close()
        }
    })

})

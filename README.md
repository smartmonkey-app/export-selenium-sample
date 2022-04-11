# Exported SeleniumJS code from Smart Monkey

This repository demos "Export as SeleniumJS code" of Smart Monkey.
## Demo by Video
[![Watch the video](https://img.youtube.com/vi/bcRgrzRUQHI/maxresdefault.jpg)](https://www.youtube.com/watch?v=bcRgrzRUQHI)

## Result

```javascript
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
const buttonLaunchDemoModal       = By.xpath(`//button[@data-target='#exampleModal']`)
const checkbox1                   = By.xpath(`//input[@id='inlineCheckbox1']`)
const checkbox2                   = By.xpath(`//input[@id='inlineCheckbox2']`)
const fileExampleFileInput        = By.xpath(`//input[@id='exampleFormControlFile1']`)
const radio2                      = By.xpath(`//input[@id='inlineRadio2'][@name='inlineRadioOptions'][@value='option2']`)
const selectExampleMultipleSelect = By.xpath(`//select[@id='exampleFormControlSelect2']`)
const selectExampleSelect         = By.xpath(`//select[@id='exampleFormControlSelect1']`)
const textboxEmailAddress         = By.xpath(`//input[@id='exampleFormControlInput1']`)
const textboxExampleTextarea      = By.xpath(`//textarea[@id='exampleFormControlTextarea1']`)


describe(``, () => {
    it('Demo', async () => {
        let page = await Page.create(__BROWSER__)
        try {
            // Navigate to [https://www.smartmonkey.app/demo/form/]
            await page.goto(`https://www.smartmonkey.app/demo/form/`)
            // Focus [Email address] by mouse
            await page.focusElement(textboxEmailAddress)
            // Enter [test@smartmonkey.app] into [Email address]
            await page.type(textboxEmailAddress, `test@smartmonkey.app`)
            // Select [4] from [Example select]
            await page.select(selectExampleSelect, '4')
            // Select [2, 3, 4] from [Example multiple select]
            await page.select(selectExampleMultipleSelect, ['2', '3', '4'])
            // Focus [Example textarea] by mouse
            await page.focusElement(textboxExampleTextarea)
            // Enter [Test] into [Example textarea]
            await page.type(textboxExampleTextarea, `Test`)
            // Select [water-lily.jpg]
            await page.setFilesToUpload(fileExampleFileInput, [
            	path.join(__RESOURCE_DIR__, `{17B16037-9131-4938-B423-1BFC8CFB7D6C}`, `water-lily.jpg`)
            ])
            // Check [1]
            await page.setCheckState(checkbox1, true)
            // Check [2]
            await page.setCheckState(checkbox2, true)
            // Select [2]
            await page.setCheckState(radio2, true)
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

})

```

As you see, the code is very clear and very easy to read. It is fully commented! Impressed :)

Click [here](https://github.com/smartmonkey-app/export-selenium-sample/blob/main/src) to see the full exported code!

## Download
If you would like to download Smart Monkey, please [click here](https://release.smartmonkey.app/download) or visit [https://www.smartmonkey.app](https://www.smartmonkey.app) for more information!

const cheerio = require('cheerio')
const twilio = require('twilio')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
require('dotenv').config()

exports.doProcess = async () => {
    try {
        const URL = 'https://www.tesla.com/ko_kr/modely'
        const {stdout, stderr} = await exec(`curl ${URL}`)
        const $ = cheerio.load(stdout)
        const domSelector = '#tesla-hero-showcase-172 > div > div.hero-regions > div > div.hero-region--center-bottom > div > div.hero-callouts--button.cmp-animate--to_reveal > a'
        const urlLink = $(domSelector).attr('href')
        const expectedUrl = '/ko_kr/updates'
        console.log(`purchaseBtn: ${urlLink}`)
        if (urlLink === expectedUrl) {
            console.log(`Matched to expected URL: ${expectedUrl}`)
        } else {
            console.log(`! Tesla URL is not matched to expectedUrl. URL:${urlLink}, Expected: ${expectedUrl}`)
            //send SMS
            const accountSid = process.env.ACCOUNT_SID
            const authToken = process.env.AUTH_TOKEN
            const fromNumber = process.env.FROM_NUMBER
            const toNumber = process.env.TO_NUMBER
            const client = twilio(accountSid, authToken)
            const message = await client.messages.create({body: 'Tesla starts sell model Y in Korea!', from:fromNumber, to: toNumber})
            console.log(`Message sent: ${message.sid}`)
        }

    } catch (err) {
        console.error(`Err: ${err}`)
    }
}


if (require.main === module) {
    exports.doProcess()
}
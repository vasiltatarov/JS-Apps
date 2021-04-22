// run with // node test.js
// run tests in cmd // mocha test.js

const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

let browser, page; // Declare reusable variables
describe('E2E tests', function () {
    this.timeout(6000);

    // this will active browser live
    // headless: false, slowMo: 1000
    before(async () => {
        browser = await chromium.launch({ headless: false, slowMo: 1000 });
        // browser = await chromium.launch();
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
    });

    afterEach(async () => {
        await page.close();
    });

    it('check titles', async () => {
        await page.goto('http://localhost:5501');

        const titles = await page.$$eval('.accordion .head span', (spans) => spans.map(s => s.textContent));
        expect(titles).includes('Scalable Vector Graphics');
        expect(titles).includes('Open standard');
        expect(titles).includes('Unix');
        expect(titles).includes('ALGOL');
    });

    it('loads static page', async () => {
        await page.goto('http://localhost:5501');
        await page.screenshot({ path: 'index.png' });
    });

    it('check static page content', async () => {
        await page.goto('http://localhost:5501');
        const content = await page.content();
        expect(content).to.contains('Scalable Vector Graphics');
        expect(content).to.contains('Open standard');
        expect(content).to.contains('Unix');
        expect(content).to.contains('ALGOL');
    });

    it('toggles content', async () => {
        await page.goto('http://localhost:5501');
        await page.click('text=More');

        const visible = await page.isVisible('.extra p');
        expect(visible).to.be.true;
    });

    it('toggles all', async () => {
        await page.goto('http://localhost:5501');

        await page.click('#main>.accordion:first-child >> text=More');
        await page.click('text=More');
        await page.click('text=More');
        await page.click('text=More');

        const visible = await page.isVisible('#main:first-child >> .extra p');
        expect(visible).to.be.true;
    });

    it('toggles first acordion', async () => {
        await page.goto('http://localhost:5501');

        await page.click('#main>.accordion:first-child >> text=More');
        await page.waitForSelector('#main>.accordion:first-child >> .extra p');
        await page.click('#main>.accordion:first-child >> text=Less');

        const visible = await page.isVisible('.extra p');
        expect(visible).to.be.false;
    });
});

// (async () => {
//     const browser = await chromium.launch();
//     const page = await browser.newPage();
//     await page.goto('http://whatsmyuseragent.org/');
//     await page.screenshot({ path: `example.png` });
//     await browser.close();
// })();

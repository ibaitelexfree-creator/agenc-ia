const puppeteer = require('puppeteer');

async function main() {
    console.log('Launching browser to test payment-success page...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Catch page errors and logs
    page.on('console', msg => {
        console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
    });
    page.on('pageerror', err => {
        console.error('[BROWSER RUNTIME ERROR]:', err.stack || err.message);
    });

    console.log('Navigating to payment-success page...');
    await page.goto('http://localhost:3000/en/student/payment-success/?session_id=cs_test_session_id&type=course', {
        waitUntil: 'networkidle2'
    });

    // Wait a bit to ensure it compiles/renders
    await new Promise(r => setTimeout(r, 5000));

    await page.screenshot({ path: 'C:\\Users\\User\\.gemini\\antigravity\\scratch\\success_page_result.png' });
    console.log('Saved screenshot of success page');

    await browser.close();
}

main().catch(console.error);

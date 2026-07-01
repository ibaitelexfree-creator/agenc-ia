const puppeteer = require('puppeteer');

async function main() {
    console.log('Launching browser...');
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

    // Listen to network requests
    page.on('requestfailed', request => {
        console.log(`[NETWORK FAIL] ${request.method()} ${request.url()} - ${request.failure() ? request.failure().errorText : 'Failed'}`);
    });
    page.on('requestfinished', request => {
        const url = request.url();
        const response = request.response();
        if (response && (url.includes('api/') || url.includes('supabase.co'))) {
            console.log(`[NETWORK OK] ${response.status()} ${request.method()} ${url}`);
        }
    });

    page.on('response', async response => {
        const url = response.url();
        if (url.includes('api/checkout') || url.includes('api/legal/consent')) {
            try {
                const text = await response.text();
                console.log(`[RESPONSE BODY] ${response.status()} ${url} -> ${text}`);
            } catch (e) {
                // ignore
            }
        }
    });

    // Login
    console.log('Navigating to login page...');
    await page.goto('http://localhost:3000/es/auth/login/', { waitUntil: 'networkidle2' });

    console.log('Filling in credentials...');
    await page.type('input[type="email"]', 'mattcarleigh347@gmail.com');
    await page.type('input[type="password"]', 'Jereministro1271!*');

    console.log('Logging in...');
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.keyboard.press('Enter')
    ]);
    console.log('Logged in successfully, current URL:', page.url());

    // Go to course
    console.log('Navigating to course: Iniciación J80...');
    await page.goto('http://localhost:3000/es/courses/iniciacion-j80', { waitUntil: 'networkidle2' });

    // Select the first edition
    console.log('Selecting edition...');
    const clickedEdition = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const editionBtn = buttons.find(b => b.textContent && (b.textContent.includes('Plazas') || b.textContent.includes('plazas')));
        if (editionBtn) {
            editionBtn.click();
            return true;
        }
        return false;
    });
    console.log('Clicked edition:', clickedEdition);
    await new Promise(r => setTimeout(r, 1000));

    // Click the final "Reservar por..." button
    const clickedReserve = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const reserveBtn = buttons.find(b => b.textContent && b.textContent.toLowerCase().includes('reservar por'));
        if (reserveBtn) {
            reserveBtn.click();
            return true;
        }
        return false;
    });
    console.log('Clicked reserve button:', clickedReserve);
    await new Promise(r => setTimeout(r, 2000));

    // Modal - Step 1: Click "SIGUIENTE"
    console.log('Modal Step 1: Clicking Siguiente...');
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const nextBtn = buttons.find(b => b.textContent && b.textContent.toLowerCase().includes('siguiente'));
        if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 2000));

    // Take screenshot of Step 2
    await page.screenshot({ path: 'C:\\Users\\User\\.gemini\\antigravity\\scratch\\step2_registration_form.png' });
    console.log('Saved screenshot of Step 2');

    // Fill in Step 2 details (e.g. swim question, birth date or DNI if empty, and select payment method)
    console.log('Modal Step 2: Filling out form...');
    await page.evaluate(() => {
        const fillReactInput = (selector, value) => {
            const input = document.querySelector(selector);
            if (input) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(input, value);
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        };

        fillReactInput('input[name="fecha_nacimiento"]', '1990-01-01');
        fillReactInput('input[name="dni"]', '12345678Z');
        fillReactInput('input[name="telefono"]', '666555444');
        fillReactInput('input[name="domicilio"]', 'Calle Gran Via 12');
        fillReactInput('input[name="localidad"]', 'Getxo');
        fillReactInput('input[name="codigo_postal"]', '48930');

        // Select 'Sí' for '¿Sabe nadar?'
        const swimSelect = document.querySelector('select[name="sabe_nadar"]');
        if (swimSelect && swimSelect.options.length > 1) {
            swimSelect.value = swimSelect.options[1].value;
            swimSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });

    // Let's click "SIGUIENTE" on Step 2
    console.log('Modal Step 2: Clicking Siguiente...');
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const nextBtn = buttons.find(b => b.textContent && b.textContent.toLowerCase().includes('siguiente'));
        if (nextBtn) nextBtn.click();
    });
    
    // Wait for Step 3 elements to appear
    console.log('Waiting for Step 3 to render...');
    await page.waitForSelector('input[placeholder="12345678Z"]', { timeout: 5000 });

    // Print validation errors from the DOM (should be empty now)
    const validationErrors = await page.evaluate(() => {
        const errorElements = Array.from(document.querySelectorAll('.text-red-400, p[class*="red"], span[class*="red"]'));
        return errorElements.map(el => el.textContent);
    });
    console.log('DOM Validation errors on Step 2:', validationErrors);

    // Take screenshot of Step 3 (Signature)
    await page.screenshot({ path: 'C:\\Users\\User\\.gemini\\antigravity\\scratch\\step3_signature.png' });
    console.log('Saved screenshot of Step 3');

    // Check checkboxes and type signature
    console.log('Modal Step 3: Digitally signing and confirming...');
    
    // Type DNI
    await page.focus('input[placeholder="12345678Z"]');
    await page.type('input[placeholder="12345678Z"]', '12345678Z');

    // Type Email (use the modal-specific placeholder to avoid the newsletter email)
    await page.focus('input[placeholder="juan@ejemplo.com"]');
    await page.type('input[placeholder="juan@ejemplo.com"]', 'mattcarleigh347@gmail.com');

    // Click the consent checkbox
    await page.click('input[type="checkbox"]');

    await page.screenshot({ path: 'C:\\Users\\User\\.gemini\\antigravity\\scratch\\step3_signed.png' });
    console.log('Saved screenshot of Step 3 (signed)');

    // Wait for checkout button to become enabled
    console.log('Waiting for checkout button to be enabled...');
    await page.waitForFunction(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const payBtn = buttons.find(b => b.textContent && b.textContent.toLowerCase().includes('firmar y continuar'));
        return payBtn && !payBtn.disabled;
    }, { timeout: 5000 });

    // Click final checkout button
    console.log('Modal Step 3: Clicking final checkout button...');
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const payBtn = buttons.find(b => b.textContent && b.textContent.toLowerCase().includes('firmar y continuar'));
        if (payBtn) payBtn.click();
    });

    console.log('Waiting for payment api response...');
    await new Promise(r => setTimeout(r, 8000));

    // Take final screenshot
    await page.screenshot({ path: 'C:\\Users\\User\\.gemini\\antigravity\\scratch\\final_result.png' });

    await browser.close();
    console.log('Done.');
}

main().catch(console.error);

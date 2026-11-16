const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadTheme(file, options = {}) {
    const attributes = {};
    const buttonAttributes = {};
    const events = {};
    let stored = options.saved || null;
    let systemChange;
    const button = {
        hidden: true,
        setAttribute: (name, value) => { buttonAttributes[name] = value; },
        addEventListener: (name, callback) => { events[name] = callback; }
    };
    const media = {
        matches: Boolean(options.dark),
        addEventListener: (name, callback) => { systemChange = callback; }
    };
    if (options.legacy) {
        delete media.addEventListener;
        media.addListener = callback => { systemChange = callback; };
    }
    const context = {
        document: {
            documentElement: {
                setAttribute: (name, value) => { attributes[name] = value; },
                getAttribute: name => attributes[name]
            },
            addEventListener: (name, callback) => { events[name] = callback; },
            getElementById: () => options.noButton ? null : button
        },
        window: {
            localStorage: {
                getItem: () => {
                    if (options.blocked) throw new Error('Storage blocked');
                    return stored;
                },
                setItem: (name, value) => {
                    if (options.blocked) throw new Error('Storage blocked');
                    stored = value;
                }
            }
        }
    };
    if (!options.noMedia) context.window.matchMedia = () => media;
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context);
    const initial = attributes['data-theme'];
    events.DOMContentLoaded();
    return {
        initial,
        button,
        theme: () => attributes['data-theme'],
        pressed: () => buttonAttributes['aria-pressed'],
        stored: () => stored,
        click: () => events.click(),
        systemChange: dark => systemChange({ matches: dark })
    };
}

for (const file of ['js/theme.js', 'js/theme.min.js']) {
    test(`${file}: defaults to system theme before DOM ready`, () => {
        for (const dark of [true, false]) {
            const page = loadTheme(file, { dark });
            assert.equal(page.initial, dark ? 'dark' : 'light');
            assert.equal(page.pressed(), String(dark));
            assert.equal(page.button.hidden, false);
        }
    });

    test(`${file}: saved preference overrides system and survives reload`, () => {
        for (const saved of ['dark', 'light']) {
            const page = loadTheme(file, { saved, dark: saved === 'light' });
            assert.equal(page.theme(), saved);
            page.systemChange(saved !== 'dark');
            assert.equal(page.theme(), saved);
            page.click();
            const selected = saved === 'dark' ? 'light' : 'dark';
            assert.equal(page.theme(), selected);
            assert.equal(page.pressed(), String(selected === 'dark'));
            assert.equal(page.stored(), selected);
            assert.equal(loadTheme(file, { saved: page.stored() }).initial, selected);
        }
    });

    test(`${file}: follows system changes until a manual choice`, () => {
        const page = loadTheme(file, { saved: 'invalid' });
        page.systemChange(true);
        assert.equal(page.theme(), 'dark');
        assert.equal(page.pressed(), 'true');
        page.click();
        page.systemChange(true);
        assert.equal(page.theme(), 'light');
    });

    test(`${file}: storage denial does not break switching`, () => {
        const page = loadTheme(file, { blocked: true, dark: true });
        page.click();
        assert.equal(page.theme(), 'light');
        assert.equal(page.pressed(), 'false');
        page.click();
        assert.equal(page.theme(), 'dark');
    });

    test(`${file}: handles older browsers and missing controls`, () => {
        assert.equal(loadTheme(file, { noMedia: true }).theme(), 'light');
        assert.equal(loadTheme(file, { noButton: true }).theme(), 'light');
        const page = loadTheme(file, { legacy: true });
        page.systemChange(true);
        assert.equal(page.theme(), 'dark');
    });
}

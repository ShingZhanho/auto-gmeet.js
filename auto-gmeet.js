// ==UserScript==
// @name         Auto Google Meet
// @namespace    https://github.com/ShingZhanho/auto-gmeet.js
// @version      0.1.3
// @description  Automatically refresh google meet.
// @author       Z. H. Shing
// @match        https://meet.google.com/_meet/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(async function() {
    // gets information
    let paras = new URLSearchParams(window.location.search);
    let authuser = paras.get('authuser') === null ? 0 : paras.get('authuser');
    let hs = paras.get('hs');
    let alias = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
    if (alias == 'whoops') alias = paras.get('alias'); // auto correction
    let requestUrl = 'https://meet.google.com/lookup/' + alias.replace(/-/g, '') + '?authuser=' + authuser /** + '&sc=256&alias=' + alias */ ;
    requestUrl += hs === null ? '' : '&hs=' + hs;

    let meetStarted = false;

    let response = await fetch(requestUrl);
    meetStarted = response.status !== 404;

    // If lesson has not yet started
    if (!meetStarted) {
        document.querySelector('div.jtEd4b').textContent = "This meet is yet to start.";
        for (let i = 0; i < 30; i++) {
            document.querySelector('div.fwk7ze').textContent = "Page will be refreshed automatically after " + (30 - i) + ((30 - i) == 1 ? " second." : " seconds.");
            await sleep(1000);
        }
        location.reload();
        return;
    }

    // When the meet is ready to join
    /**
     * IMPORTANT NOTICE:
     * THE FOLLOWING CODE UNTIL THE END MARK IS
     * BASED ON THE CHROME EXTENSION "Google Meet Auto Disable Mic/Cam"
     * (ID: dgggcpmnponfpgnifbdohajbdkbgjlhd).
     * THE CODE IS USED HERE FOR INTERNAL AND EDUCATIONAL PURPOSES ONLY.
     * IF YOU ARE OUTSIDE OF THE CHANG PUI CHUNG MEMORIAL SCHOOL,
     * YOU SHALL NOT USE THIS CODE AND YOU SHALL USE THE ORIGINAL EXTENSION ONLY.
     * IF THE AUTHOR OF THE FOLLOWING CODE DOES NOT WANT US TO USE HIS OR HER CODE ANYMORE,
     * PLEASE SUBMIT AN ISSUE TO INFORM US ON GITHUB FOR DELETING THE CODE.
     */

    /**
     * @typedef ButtonProps
     * @property {string} label
     * @property {string} key
     * @property {string} storageName
     * @property {'left'|'right'} direction
     * @property {HTMLDivElement} element
     */

    /** @type {ButtonProps[]} */
    const buttons = [{
            label: 'Microphone',
            storageName: 'disableMic',
            key: 'd',
            direction: 'right',
            element: null,
        },
        {
            label: 'Camera',
            storageName: 'disableCam',
            key: 'e',
            direction: 'left',
            element: null,
        },
    ];

    /** @type {Promise<void>} */
    const windowLoaded = new Promise(resolve => window.onload = () => resolve());

    /** @type {Promise<void>} */
    const buttonsLoaded = new Promise(async resolve => {
        await windowLoaded;

        /** @type {MutationObserver} */
        const observer = new MutationObserver(() => {
            if (!buttons.every(button =>
                    button.element = document.body.querySelector(`div[role="button"][aria-label$=" + ${button.key})" i][data-is-muted]`),
                )) return;

            observer.disconnect();
            resolve();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    Promise.all([buttonsLoaded]).then(async() => {

        buttons.forEach(({ element }) => {

            /** @return {void} */
            const disable = () => { if (element.dataset.isMuted === 'false') element.click(); };

            disable();
        });

    });

    /**
     * THIS IS THE END OF CODE FROM THE CHROME EXTENSION
     */

    // wait for cam and mic to be disabled
    await sleep(5000);

    // join the meet
    window.document.querySelector(".NPEfkd").click();

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();
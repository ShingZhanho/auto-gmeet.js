// ==UserScript==
// @name         Auto Google Meet
// @namespace    https://github.com/ShingZhanho/auto-gmeet.js
// @version      0.1.1.1
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


    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();
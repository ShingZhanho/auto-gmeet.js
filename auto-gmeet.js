// ==UserScript==
// @name         Auto Google Meet
// @namespace    http://github.com/ShingZhanho/auto-gmeet.js
// @version      0.1.1
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
    let authuser = paras.get('authuser');
    let hs = paras.get('hs');
    let alias = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
    if (alias == 'whoops') alias = paras.get('alias'); // auto correction
    let requestUrl = 'https://meet.google.com/_meet/whoops?authuser=' + authuser + '&hs=' + hs + '&sc=256&alias=' + alias;

    let meetStarted = false;

    let response = await fetch(requestUrl);
    meetStarted = response.status !== 404;

    // If lesson has not yet started
    if (!meetStarted) {
        document.querySelector('div.jtEd4b').textContent = "此會議尚未開始";
        for (let i = 0; i <= 30; i++) {
            document.querySelector('div.fwk7ze').textContent = "將於" + (30 - i) + "秒後重新整理網頁。";
            await sleep(1000);
        }
        location.reload();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();
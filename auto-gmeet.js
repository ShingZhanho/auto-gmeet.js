// ==UserScript==
// @name         Auto Google Meet
// @namespace    https://github.com/ShingZhanho/auto-gmeet.js
// @version      0.1.3.1
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

    // Wait for the page to load if the meet is ready
    await sleep(5000);


    // When the meet is ready to join
    // Get message panel
    let msgLbl = document.querySelector('div.Jyj1Td');

    // Check whether the meet is really started
    let micbuttons = window.document.querySelectorAll(".DPvwYc.JnDFsc.dMzo5");
    if (micbuttons === null) location.reload(); // teacher not yet allowed students to join but meet is opened

    // turn of mic and cam
    for (let i = 0; i < 2; i++) {
        micbuttons[i].click();
        if (msgLbl !== null) msgLbl.textContent = i == 0 ? "Turning off your microphone..." : "Turning off your camera...";
    }

    // Wait for mic and cam to be disabled
    if (msgLbl !== null) msgLbl.textContent = "Waiting to join...";
    await sleep(2000);

    // Get the join meet button
    let joinbtn = null;
    while (joinbtn === null) {
        joinbtn = window.document.querySelector(".NPEfkd");
    }

    // join the meet
    joinbtn.click();

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();
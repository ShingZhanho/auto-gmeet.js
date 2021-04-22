// ==UserScript==
// @name         Auto Google Meet
// @namespace    http://github.com/ShingZhanho/auto-gmeet.js
// @version      0.1
// @description  try to take over the world!
// @author       Z. H. Shing
// @match        https://meet.google.com/_meet/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    // gets information
    let paras = new URLSearchParams(window.location.search);
    let authuser = paras.get('authuser');
    let hs = paras.get('hs');
    let alias = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
    let requestUrl = 'https://meet.google.com/_meet/whoops?authuser=' + authuser + '&hs=' + hs + '&alias=' + alias;

    fetch(requestUrl)
    .then(response => {
        if (response.status == 404) location.reload();
    });

})();

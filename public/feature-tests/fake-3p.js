// Stand-in for a third-party SDK: records that (and when) it ran on the main thread.
window.__fake3p = (window.__fake3p || 0) + 1;
window.__fake3pAt = performance.now();
document.documentElement.dataset.fake3p = 'ran';

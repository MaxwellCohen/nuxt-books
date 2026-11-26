// Stand-in for a third-party SDK offloaded to a Partytown web worker.
// `document` is Partytown's proxy there, so this write lands on the main-thread <html>.
document.documentElement.dataset.fake3pWorker = 'ran';

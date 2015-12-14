// Is It Flywheel - Background

var tabinfo = {};

var knownHeaders = {
  'x-powered-by': {
    'PHP': /PHP\/?(.*)/,
    'ASP.NET': /ASP\.NET/
  },
  'server': {
    'Apache': /Apache\/?(.*)/,
    'nginx': /nginx\/?(.*)/,
    'IIS': /Microsoft-IIS\/?(.*)/,
    'Flywheel': /Flywheel\/?(.*)/
  },
  'via': {
    'Varnish': /(.*) varnish/
  }
};

var headerDetector = function (headers) {
  var appsFound = [];
  for (var i = headers.length - 1; i >= 0; i--) {
    var apps = knownHeaders[headers[i].name.toLowerCase()];
    if (!apps) continue;
    for (var app in apps) {
      var matches = headers[i].value.match(apps[app]);
      if (matches) appsFound[app] = matches[1] || -1;
    }
  }
  return appsFound;
};

chrome.webRequest.onHeadersReceived.addListener(
  function (details) {
    tabinfo[details.tabId] = tabinfo[details.tabId] || {};
    tabinfo[details.tabId]['headers'] = headerDetector(details.responseHeaders);
  },
  {
    urls: ['<all_urls>'],
    types: ['main_frame']
  },
  ['responseHeaders']
);


chrome.tabs.onRemoved.addListener(function (tabId) {
  delete tabinfo[tabId];
});

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
  // 'result' event issued by main.js once app identification is complete
  if (request.msg == 'result') {
    var thisTab = tabinfo[sender.tab.id];
    thisTab['apps'] = request.apps;

    for (var header in thisTab['headers']) {
      thisTab['apps'][header] = thisTab['headers'][header];
    }

    // change the tab icon
    var mainApp = null;
    for (var app in request.apps) {
      if (mainApp === null) {
        mainApp = app;
        continue;
      }

      if (appinfo[app].priority) {
        if (!appinfo[mainApp].priority) mainApp = app;
        else if (appinfo[mainApp].priority > appinfo[app].priority) mainApp = app;
      }
    }

    var mainAppInfo = appinfo[mainApp];
    if (mainAppInfo) {
      var appTitle = mainAppInfo.title ? mainAppInfo.title : mainApp;
      if (request.apps[mainApp] != "-1") appTitle = mainApp + ' ' + request.apps[mainApp];
      chrome.pageAction.setIcon({tabId: sender.tab.id, path: 'apps/' + mainAppInfo.icon});
      chrome.pageAction.setTitle({tabId: sender.tab.id, title: appTitle});
    }

    chrome.pageAction.show(sender.tab.id);
    sendResponse({});
  }
  else if (request.msg == 'get') {
    // Request for 'get' comes from the popup page, asking for the list of apps
    var apps = tabinfo[request.tab];
    sendResponse(apps);
  }
});

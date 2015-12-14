// Is It Flywheel - Main

(function () {
  var head = document.getElementsByTagName('head')[0];

  if (head) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = chrome.extension.getURL('detector.js');

    var meta = document.createElement('meta');
    meta.name = 'is_it_flywheel';
    meta.id = 'is_it_flywheel_data';
    
    head.appendChild(meta);
    head.appendChild(script);

    meta.addEventListener('ready', function () {
      var apps = JSON.parse(meta.content);

      if (Object.keys(apps).length > 0) {
        chrome.extension.sendMessage({msg: "result", apps: apps});
      }
    });
  }
})();

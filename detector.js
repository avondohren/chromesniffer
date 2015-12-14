// Is It Flywheel - Detector

(function () {
  var apps = {};
  var tests = {
    'generator': {
      'Joomla': /joomla!?\s*([\d\.]+)?/i,
      'WordPress': /WordPress\s*(.*)/i,
      'Movable Type': /Movable Type/i,
      'bbPress': /bbPress/i,
      'Blogger': /blogger/i
    }
  };

  var metas = document.documentElement.getElementsByTagName("meta");
  for (var tag in metas) {
    var name = metas[tag].name ? metas[tag].name.toLowerCase() : "";
    if (!tests[name]) continue;

    for (var test in tests[name]) {
      if (test in apps) continue;
      var r = tests[name][test].exec(metas[tag].content);
      if (r) apps[test] = r[1] ? r[1] : -1;
    }
  }

  var text = document.documentElement.outerHTML;
  var text_tests = {
    'Tumblr': /<iframe src=("|')http:\/\/\S+\.tumblr\.com/i,
    'WordPress': /<link rel=("|')stylesheet("|') [^>]+wp-content/i
  };

  for (var t in text_tests) {
    if (t in apps) continue;
    if (text_tests[t].test(text)) {
      apps[t] = -1;
    }
  }

  var meta = document.getElementById('is_it_flywheel_data');
  meta.content = JSON.stringify(apps);

  var done = document.createEvent('Event');
  done.initEvent('ready', true, true);
  meta.dispatchEvent(done);
})();

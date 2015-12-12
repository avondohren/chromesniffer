/**
 * Chrome AppSniffer
 *
 * Detect apps run on current page and send back to background page.
 * Some part of this script was refered from Wappalyzer Firefox Addon.
 *
 * @author Bao Nguyen <contact@nqbao.com>
 * @license GPLv3
 **/

(function () {
  var _apps = {};
  var doc = document.documentElement;
  var name;
  var r;

  // 1: detect by meta tags, the first matching group will be version
  var metas = doc.getElementsByTagName("meta");
  var meta_tests = {
    'generator': {
      'Joomla': /joomla!?\s*([\d\.]+)?/i,
      'WordPress': /WordPress\s*(.*)/i,
      'Movable Type': /Movable Type/i,
      'bbPress': /bbPress/i,
      'Blogger': /blogger/i
    }
  };

  for (var idx in metas) {
    var m = metas[idx];
    name = m.name ? m.name.toLowerCase() : "";

    if (!meta_tests[name]) continue;

    for (var t in meta_tests[name]) {
      if (t in _apps) continue;

      r = meta_tests[name][t].exec(m.content);
      if (r) {
        _apps[t] = r[1] ? r[1] : -1;
      }
    }
  }

  // 2: detect by script tags
  var scripts = doc.getElementsByTagName("script");

  var script_tests = {
    'Joomla': /\/components\/com_/
  };

  for (var idx in scripts) {
    var s = scripts[idx];
    if (!s.src) continue;
    s = s.src;

    for (var t in script_tests) {
      if (t in _apps) continue;
      if (script_tests[t].test(s)) {
        _apps[t] = -1;
      }
    }
  }

  // 3: detect by domains

  // 4: detect by regexp
  var text = document.documentElement.outerHTML;
  var text_tests = {
    'Tumblr': /<iframe src=("|')http:\/\/\S+\.tumblr\.com/i,
    'WordPress': /<link rel=("|')stylesheet("|') [^>]+wp-content/i
  };

  for (var t in text_tests) {
    if (t in _apps) continue;
    if (text_tests[t].test(text)) {
      _apps[t] = -1;
    }
  }

  // TODO: merge inline detector with version detector

  // 5: detect by inline javascript
  var js_tests = {
    'Drupal': function () {
      return window.Drupal;
    }
  };

  for (var t in js_tests) {
    if (t in _apps) continue;
    if (js_tests[t]()) {
      _apps[t] = -1;
    }
  }

  // 6: detect some script version when available
  var js_versions = {
    'jQuery': function () {
      if (typeof jQuery === 'function' && jQuery.prototype.jquery !== undefined)
        return jQuery.prototype.jquery;
    }
  };

  for (var a in _apps) {
    if (_apps[a] === -1 && js_versions[a]) {
      r = js_versions[a]();
      _apps[a] = r ? r : -1;
    }
  }

  // 7: detect by header
  // @todo

  // 8: detect based on built-in database
  // @todo

  // 9: detect based on defined css classes
  var cssClasses = {
    'Bootstrap': ['hero-unit', '.carousel-control', '[class^="icon-"]:last-child']
  };

  for (var t in cssClasses) {
    if (t in _apps) continue;

    var found = true;
    for (var css in cssClasses[t]) {
      var act = false;
      name = cssClasses[t][css];

      /* Iterate through all registered css classes and check for presence */
      for (var cssFile in document.styleSheets) {
        for (var cssRule in document.styleSheets[cssFile].cssRules) {
          var style = document.styleSheets[cssFile].cssRules[cssRule];

          if (typeof style === "undefined") continue;
          if (typeof style.selectorText === "undefined") continue;

          if (style.selectorText.indexOf(name) !== -1) {
            act = true;
            break;
          }
        }
        if (act === true) break;
      }

      found = found & act;
    }

    if (found === true) {
      _apps[t] = -1;
    }
    else {
      break;
    }
  }

  // convert to array
  var jsonString = JSON.stringify(_apps);
  // send back to background page
  var meta = document.getElementById('chromesniffer_meta');
  meta.content = jsonString;

  //Notify Background Page
  var done = document.createEvent('Event');
  done.initEvent('ready', true, true);
  meta.dispatchEvent(done);
})();

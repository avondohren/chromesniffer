/**
 * Chrome AppSniffer
 *
 * Web Application definition
 *
 * @author Bao Nguyen <contact@nqbao.com>
 * @license GPLv3
 **/

var appinfo = {
  // ==== services ====
  'Flywheel': {
    icon: 'flywheel.ico',
    url: 'http://app.getflywheel.com',
    priority: 0.9
  },
  'Tumblr': {
    icon: 'Tumblr.ico',
    url: 'http://tumblr.com',
    priority: 0.9
  },
  'Blogger': {
    icon: 'Blogger.ico',
    url: 'http://blogger.com',
    priority: 0.9
  },
  'Drupal': {
    icon: 'Drupal.ico',
    url: 'http://drupal.org',
    priority: 1
  },
  'WordPress': {
    icon: 'WordPress.ico',
    url: 'http://wordpress.org',
    priority: 1
  },
  'bbPress': {
    icon: 'bbPress.ico',
    url: 'http://bbpress.org',
    priority: 1
  },
  'Movable Type': {
    icon: 'MovableType.ico',
    url: 'http://www.movabletype.org/',
    priority: 1
  },
  'Joomla': {
    icon: 'Joomla.ico',
    url: 'http://joomla.org',
    priority: 1
  },
  'jQuery': {
    icon: 'jQuery.ico',
    url: 'http://jquery.com',
    priority: 2
  },
  'PHP': {
    icon: 'php.ico',
    url: 'http://php.net/',
    priority: 1.5
  },
  'Apache': {
    icon: 'apache.ico',
    url: 'http://httpd.apache.org/',
    priority: 1.5
  },
  'nginx': {
    icon: 'nginx.ico',
    url: 'http://nginx.org/en/',
    priority: 1.5
  },
  'Varnish': {
    icon: 'varnish.ico',
    url: 'https://www.varnish-cache.org/',
    priority: 1.5
  },
  'IIS': {
    icon: 'iis.ico',
    url: 'http://www.iis.net/',
    priority: 1.5
  },
  'ASP.NET': {
    icon: 'asp.net.ico',
    url: 'http://www.asp.net/',
    priority: 1.5
  },
  // ==== misc ====
  '': { // default
    icon: 'unknown.jpg',
    url: 'http://google.com/search?q=%s'
  }
};

const path = require('path');

const statusCodes = {
  '400': path.resolve(__dirname, '../public/400.html'),
  '401': path.resolve(__dirname, '../public/401.html'),
  '403': path.resolve(__dirname, '../public/403.html'),
  '404': path.resolve(__dirname, '../public/404.html'),
  '418': path.resolve(__dirname, '../public/418.html'),
  '500': path.resolve(__dirname, '../public/500.html'),
  '501': path.resolve(__dirname, '../public/501.html'),
  '503': path.resolve(__dirname, '../public/503.html'),
};

module.exports = function(code) {
  return statusCodes[code] || statusCodes['418'];
};

// red: [31, 39],green: [32, 39],yellow: [33, 39],blue: [34, 39],magenta: [35, 39],cyan: [36, 39],
const env = process.env.NODE_ENV || 'development';
let isProduction = env === 'production';
const colorMap = {
  'error': 31,
  'info': 36,
  'success': 32,
  'debug': 33,
  'warn': 34
};
const timeRecord = {};

function log(type, argItems) {
  if (isProduction) {
    return;
  }

  // 转换arguments为真正数组
  const items = Array.prototype.slice.call(argItems);

  const start = `\u001b[${colorMap[type]}m`;
  const end = '\u001b[39m';

  items.splice(0, 0, start);
  items.push(end);

  console.log.apply(null, items); // eslint-disable-line no-console
}

const types = Object.keys(colorMap);
types.map(type => {
  log[type] = (...args) => {
    log(type, args);
  };
  return type;
});

log.config = function config(options) {
  isProduction = !options.dev;
};

log.time = function time(name) {
  timeRecord[name] = Date.now();
};
log.timeEnd = function timeEnd(name) {
  const start = timeRecord[name];
  if (start) {
    const consuming = Date.now() - start;

    log.debug(`${name} 耗时：${consuming}ms`);
    delete timeRecord[name];

    return consuming;
  }
  return null;
};

module.exports = log;


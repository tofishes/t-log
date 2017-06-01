// red: [31, 39],
// green: [32, 39],
// yellow: [33, 39],
// purple: [34, 39],
// magenta: [35, 39],
// cyan: [36, 39],
// white: [37, 39],
// gray: [90, 39],
// grey: [90, 39],
// from https://github.com/Marak/colors.js/blob/master/lib/styles.js
const env = process.env.NODE_ENV || 'development';
let isProduction = env === 'production';
const colorMap = {
  'error': 31,
  'success': 32,
  'warn': 33,
  'debug': 36,
  'info': 37
};
const timeRecord = {};

function isEmpty(obj) {
  return !!obj && Object.keys(obj).length === 0;
}

function pretyJSON(json) {
  if (json.substr) {
    return json;
  }

  const ify = JSON.stringify(json, null, 2);
  return isEmpty(JSON.parse(ify)) ? json : ify;
}

function log(type, argItems) {
  if (isProduction) {
    return;
  }

  // 转换arguments为真正数组
  const items = Array.prototype.slice.call(argItems).map(item => {
    try {
      return pretyJSON(item);
    } catch (e) {
      return item;
    }
  });

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
  const now = Date.now();

  if (name) {
    timeRecord[name] = now;
    return name;
  }

  return {
    end: () => Date.now() - now
  };
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

const μs = 1e3;
const ms = 1e6;
const s = 1e9;

function autoTime(time) {
  if (time > s) {
    return Number(time / s).toFixed(3) + 's';
  }

  if (time > ms) {
    return Number(time / ms).toFixed(0) + 'ms';
  }

  if (time > μs) {
    return Number(time / μs).toFixed(0) + 'μs';
  }

  return '0s';
}

log.start = function start(name) {
  const timer = process.hrtime();
  log.info('Start', name, '...');

  return {
    end: () => {
      const diff = process.hrtime(timer);
      const nanos = diff[0] * s + diff[1];

      log.error('Finished', name, 'after', autoTime(nanos));
    }
  }
}

module.exports = log;


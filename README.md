## color console log

### use:

```
const log = require('t-log');

log.info('info...');
log.debug('debug...');
log.warn('warn...');
log.success('success...');
log.error('error...');

// time analysis
log.time('name');
... // doSomething
const consuming = log.timeEnd('name');

// if not time name
const timer = log.time();
... // doSomething
const consuming = timer.end();
```
### release
* v1.0.4 use console.log.apply.
* v1.0.3 adjust printing, no auto newline.
* v1.0.2 when json.stringify content is empty, use origin content.
* v1.0.1 add new usage of log.time().

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
```

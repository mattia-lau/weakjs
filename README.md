# Installation

```
npm install weakjs --save
```

or using yarn

```
yarn add weakjs
```

# Description

All the file will automatically save to app root directory's logs folder.  
Info Log Debug will save to stdlog.log  
Error will save to stderr.log

# Usage

```typescript
import LoggerRegister from 'weakjs';

// rolling: "daily" / "weekly" / "monthly"
const logger = new Logger({ saveToFile: true, maxNumberOfFiles: 7, rolling: 'weekly' });

logger.info({ a: 1, b: 2 });
logger.error(new Error('Test Error'), 'ERROR');
```

### Result

<img src="https://i.imgur.com/ignCdoZ.png" />

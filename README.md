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
import LoggerRegister from "weakjs";

// rolling: "daily" / "weekly" / "monthly"
const logger = new LoggerRegister({ saveToFile: true, rolling: "monthly", timezone: "Asia/Hong_Kong", dateFormat: "YYYY-MM-DD HH:mm:ss" });
// The context is optional.
const idx = logger.getLogger("IndexClass");
// once you have assigned the register in pervious step
// you can use the static method getInstance() to get the instance
const ts = LoggerRegister.getInstance().getLogger("TestClass");
// You can also do this
const noContext = logger.getLogger();

const ary = [1, 2, 3, 4, 5];
const error = new Error("test error");

idx.info(ary);
idx.log(ary, { a: 1, b: [1, 2, 3, 4] });
idx.error(error);
ts.debug("Test Debug");
noContext.info("No Class Tag")
```

### Result
<img src="https://i.imgur.com/ignCdoZ.png" />
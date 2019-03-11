# import-locals

[![Build Status](https://travis-ci.com/AlexOwl/import-locals.svg?branch=master)](https://travis-ci.com/AlexOwl/import-locals)

# 💿 Installation

```bat
npm i import-locals
```

# 📖 Usage

```ts
import locals from "import-locals";
const locals = require("import-locals"); // ES5 usage

locals.export("request/lib/cookies", "RequestJar");
locals.export("request/lib/cookies", "CookieJar");
locals.export("request/lib/cookies", "CookieJar", "LocalJar");

import { RequestJar, CookieJar, LocalJar } from "request/lib/cookies"; // ES6 works
const { RequestJar, CookieJar, LocalJar } = require("request/lib/cookies");
```

# 🔨 Advanced usage

```ts
// you can access internal GlobalPatcher
global.locals.separator = "\n\n";

global.locals.unpatch();

global.locals.compile.call(module, content, filename);
```

# 🔬 LocalPatcher

## Methods

### export

```ts
export(request: String, variable: String, name: String = variable);
```

- `request` - [module name or path](https://nodejs.org/api/modules.html#modules_module)

- `variable` - name of variable (or function, class, etc) to export

- `name` - name to use for export, by default the same as `variable`

```ts
/* Usage example */
patcher.export("request/lib/cookies", "RequestJar");
patcher.export("request/lib/cookies", "CookieJar", "LocalJar");

import { RequestJar, LocalJar } from "request/lib/cookies";
```

### unexport

```ts
unexport(request: String, variable: String = null, name: String = variable);
```

- `request` - [module name or path](https://nodejs.org/api/modules.html#modules_module)

- `variable` - if `null` unexports all variables

- `name` - name used for export, by default the same as `variable`

```ts
/* Usage example */
patcher.unexport("request/lib/cookies", "RequestJar");
patcher.unexport("request/lib/cookies", "CookieJar", "LocalJar");
patcher.unexport("request/lib/cookies");
```

# ❓ How does it work?

### This module adds `exports[name]=variable` to requested source file, so you can require it

```ts
var foo = ["bar"];

// this module adds:
exports["foo"] = foo;
```

# 📝 License

Released under [MIT license](https://AlexOwl.mit-license.org/)

# 🦉 [Alex Owl](https://github.com/AlexOwl)

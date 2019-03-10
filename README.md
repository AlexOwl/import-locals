# import-locals

# 💿 Installation

```bat
npm i import-locals
```

# 📖 Usage

```ts
import Patcher from "import-locals";

const patcher = new Patcher();
patcher.export("request/lib/cookies", "RequestJar");
patcher.export("request/lib/cookies", "CookieJar");

const { RequestJar, CookieJar } = require("request/lib/cookies");

// ES5 usage
const { Patcher } = require("import-locals");
```

# 🔬 Patcher

## Properties

### patched

```ts
patched: boolean;
```

- indicates if patcher applied

```ts
/* Example usage */
if (patcher.patched) {
  // ...
}
```

## Methods

### constructor

```ts
new Patcher(parent: NodeModule, patch: boolean = true);
```

- `parent` - current [module](https://nodejs.org/api/modules.html#modules_module) object

- `patch` - if `true` automatically applies patch, else you need call [patch](#patch)

```ts
/* Example usage */
const patcher = new Patcher(module, false);

patcher.patch("");
```

### export

```ts
export(request: string, variable: string, { name: string = variable, uncache: boolean = true });
```

- `request` - [module name or path](https://nodejs.org/api/modules.html#modules_module)

- `variable` - name of variable (or function, class, etc) to export

- `name` - name to use for export, by default the same as name of variable

- `uncache` - if `true` deletes record from require.cache

```ts
/* Example usage */
patcher.export("request/lib/cookies", "RequestJar");
patcher.export("request/lib/cookies", "CookieJar", {
  name: "LocalJar"
});

const { RequestJar, LocalJar } = require("request/lib/cookies");
```

### unexport

```ts
unexport(request: string, variable: string = null);
```

- `request` - [module name or path](https://nodejs.org/api/modules.html#modules_module)

- `variable` - if `null` unexports all variables

```ts
/* Example usage */
patcher.unexport("request/lib/cookies", "RequestJar");

patcher.unexport("request/lib/cookies");
```

### patch

```ts
patch(separator: string = '\n;');
```

- `separator` - separator between original source code and patch code

```js
/* Example usage */
// try use different values, if your module brokes somehow
patcher.patch("\n\n");
```

### unpatch

```ts
unpatch();
```

If you want repatch, just use [patch](#patch) again, you don't need call [unpatch](#unpatch)

```ts
/* Example usage */
patcher.unpatch();
```

# 📝 License

Released under [MIT license](https://AlexOwl.mit-license.org/)

# 🦉 [Alex Owl](https://github.com/AlexOwl)

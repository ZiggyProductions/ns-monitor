# @netshards/ns-monitor module

This module is a part of NetShards infrastructure
>The main purpose of ns-monitor is to make it easy to plug any app or service into the NetShards infrastructure. It acts as client/server transport, state monitoring and metadata delivery module within the NetShards infrastructure.

### Installation

The easiest way is to keep `ns-monitor` as a Dependency in your `package.json`, by running

```bash
$ npm install --save @netshards/ns-monitor
```

### Usage 
#### Server

The `options` attribute allows you to initialize properties on the ns-monitor server object, so

```js
var options = {
    port: 9999,
    namespace: '/netshards'
};
var server = require(@netshards/ns-monitor).server(options);
```

#### Client

The `options` attribute allows you to initialize properties on the ns-monitor client object, so

```js
var options = {
    endpoint: "http://localhost:9999",
    namespace: '/netshards',
    meta: {key:'value'}
};
var client = require(@netshards/ns-monitor).client(options);
```

### Tests

```bash
$ npm test
```

### License
[MIT License](./LICENSE)

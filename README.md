# OpenStatus Node.js SDK

[![JSR](https://jsr.io/badges/@openstatus/node-sdk)](https://jsr.io/@openstatus/node-sdk)
[![npm](https://img.shields.io/npm/v/@openstatus/node-sdk)](https://www.npmjs.com/package/@openstatus/node-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official Node.js SDK for [OpenStatus](https://openstatus.dev) - the open-source
monitoring platform.

## Features

- **HTTP Monitoring** - Monitor websites and APIs with customizable assertions
- **TCP Monitoring** - Check database connections and other TCP services
- **DNS Monitoring** - Verify DNS records and resolution
- **Global Regions** - Monitor from 18+ locations worldwide
- **Type-safe** - Full TypeScript support with generated types

## Installation

### JSR

```bash
npx jsr add @openstatus/node-sdk
```

### npm

```bash
npm install @openstatus/node-sdk
```

### Deno

```typescript
import { openstatus } from "jsr:@openstatus/node-sdk";
```

## Quick Start

```typescript
import { openstatus } from "@openstatus/node-sdk";

const headers = {
  "x-openstatus-key": `Bearer ${process.env.OPENSTATUS_API_KEY}`,
};

// Create a monitor
const monitor = await openstatus.monitor.v1.MonitorService.createHTTPMonitor(
  {
    name: "My API",
    url: "https://api.example.com/health",
    periodicity: "1m",
    method: "GET",
    regions: ["ams", "iad", "syd"],
    active: true,
    statusCodeAssertions: [{ comparator: "EQUAL", target: 200 }],
  },
  { headers },
);

console.log(`Monitor created: ${monitor.monitor?.id}`);

// List all monitors
const { monitors } = await openstatus.monitor.v1.MonitorService.listMonitors(
  {},
  { headers },
);

console.log(`Found ${monitors.length} monitors`);
```

## Authentication

All API requests require an API key. Get yours from the
[OpenStatus dashboard](https://www.openstatus.dev/app).

```typescript
const headers = {
  "x-openstatus-key": `Bearer ${process.env.OPENSTATUS_API_KEY}`,
};

// Pass headers to any service method
await openstatus.monitor.v1.MonitorService.listMonitors({}, { headers });
```

## Environment Variables

| Variable             | Description             | Default                          |
| -------------------- | ----------------------- | -------------------------------- |
| `OPENSTATUS_API_KEY` | Your OpenStatus API key | -                                |
| `OPENSTATUS_API_URL` | Custom API endpoint     | `https://api.openstatus.dev/rpc` |

## API Reference

### Monitor Service

#### `createHTTPMonitor(request, options)`

Create an HTTP/HTTPS monitor.

```typescript
const { monitor } = await openstatus.monitor.v1.MonitorService
  .createHTTPMonitor(
    {
      name: "My Website",
      url: "https://example.com",
      periodicity: "1m",
      method: "GET",
      regions: ["ams", "iad", "syd"],
      active: true,
    },
    { headers },
  );
```

#### `createTCPMonitor(request, options)`

Create a TCP connection monitor.

```typescript
const { monitor } = await openstatus.monitor.v1.MonitorService.createTCPMonitor(
  {
    name: "Database",
    uri: "db.example.com:5432",
    periodicity: "5m",
    regions: ["ams", "iad"],
    active: true,
  },
  { headers },
);
```

#### `createDNSMonitor(request, options)`

Create a DNS resolution monitor.

```typescript
const { monitor } = await openstatus.monitor.v1.MonitorService.createDNSMonitor(
  {
    name: "DNS Check",
    uri: "example.com",
    periodicity: "10m",
    regions: ["ams"],
    active: true,
    recordAssertions: [{
      recordType: "A",
      comparator: "EQUAL",
      target: "93.184.216.34",
    }],
  },
  { headers },
);
```

#### `listMonitors(request, options)`

List all monitors with pagination.

```typescript
const { monitors, nextPageToken } = await openstatus.monitor.v1.MonitorService
  .listMonitors(
    { pageSize: 10, pageToken: "" },
    { headers },
  );
```

#### `triggerMonitor(request, options)`

Trigger an immediate check.

```typescript
await openstatus.monitor.v1.MonitorService.triggerMonitor(
  { id: "mon_123" },
  { headers },
);
```

#### `deleteMonitor(request, options)`

Delete a monitor.

```typescript
await openstatus.monitor.v1.MonitorService.deleteMonitor(
  { id: "mon_123" },
  { headers },
);
```

### Health Service

Check API health status (no authentication required).

```typescript
const { status } = await openstatus.health.v1.HealthService.check({});
console.log(status); // "SERVING"
```

## Monitor Options

### HTTP Monitor

| Option                 | Type     | Required | Description                                       |
| ---------------------- | -------- | -------- | ------------------------------------------------- |
| `name`                 | string   | Yes      | Monitor name (max 256 chars)                      |
| `url`                  | string   | Yes      | URL to monitor                                    |
| `periodicity`          | string   | No       | `30s`, `1m`, `5m`, `10m`, `30m`, `1h`             |
| `method`               | string   | No       | `GET`, `POST`, `HEAD`, `PUT`, `PATCH`, `DELETE`   |
| `body`                 | string   | No       | Request body                                      |
| `headers`              | object   | No       | Custom headers                                    |
| `timeout`              | number   | No       | Timeout in ms (default: 45000, max: 120000)       |
| `retry`                | number   | No       | Retry attempts (default: 3, max: 10)              |
| `followRedirects`      | boolean  | No       | Follow redirects (default: true)                  |
| `regions`              | string[] | No       | [Regions](#regions) for checks                    |
| `active`               | boolean  | No       | Enable monitoring (default: false)                |
| `public`               | boolean  | No       | Public visibility (default: false)                |
| `degradedAt`           | number   | No       | Latency threshold (ms) for degraded status        |
| `statusCodeAssertions` | array    | No       | [Status code assertions](#status-code-assertions) |
| `bodyAssertions`       | array    | No       | [Body assertions](#body-assertions)               |
| `headerAssertions`     | array    | No       | [Header assertions](#header-assertions)           |

### TCP Monitor

| Option        | Type     | Required | Description                    |
| ------------- | -------- | -------- | ------------------------------ |
| `name`        | string   | Yes      | Monitor name                   |
| `uri`         | string   | Yes      | `host:port` to monitor         |
| `periodicity` | string   | No       | Check interval                 |
| `timeout`     | number   | No       | Timeout in ms (default: 45000) |
| `retry`       | number   | No       | Retry attempts (default: 3)    |
| `regions`     | string[] | No       | [Regions](#regions) for checks |
| `active`      | boolean  | No       | Enable monitoring              |

### DNS Monitor

| Option             | Type     | Required | Description                                     |
| ------------------ | -------- | -------- | ----------------------------------------------- |
| `name`             | string   | Yes      | Monitor name                                    |
| `uri`              | string   | Yes      | Domain to resolve                               |
| `periodicity`      | string   | No       | Check interval                                  |
| `timeout`          | number   | No       | Timeout in ms (default: 45000)                  |
| `retry`            | number   | No       | Retry attempts (default: 3)                     |
| `regions`          | string[] | No       | [Regions](#regions) for checks                  |
| `recordAssertions` | array    | No       | [DNS record assertions](#dns-record-assertions) |

## Assertions

### Status Code Assertions

Validate HTTP response status codes.

```typescript
{
  statusCodeAssertions: [
    { comparator: "EQUAL", target: 200 },
    { comparator: "LESS_THAN", target: 400 },
  ];
}
```

**Comparators:** `EQUAL`, `NOT_EQUAL`, `GREATER_THAN`, `GREATER_THAN_OR_EQUAL`,
`LESS_THAN`, `LESS_THAN_OR_EQUAL`

### Body Assertions

Validate response body content.

```typescript
{
  bodyAssertions: [
    { comparator: "CONTAINS", target: '"status":"ok"' },
    { comparator: "NOT_EMPTY" },
  ];
}
```

**Comparators:** `CONTAINS`, `NOT_CONTAINS`, `EQUAL`, `NOT_EQUAL`, `EMPTY`,
`NOT_EMPTY`

### Header Assertions

Validate response headers.

```typescript
{
  headerAssertions: [
    { key: "content-type", comparator: "CONTAINS", target: "application/json" },
  ];
}
```

### DNS Record Assertions

Validate DNS records.

```typescript
{
  recordAssertions: [
    { recordType: "A", comparator: "EQUAL", target: "93.184.216.34" },
    { recordType: "CNAME", comparator: "CONTAINS", target: "cdn" },
  ];
}
```

**Record types:** `A`, `AAAA`, `CNAME`, `MX`, `TXT`

## Regions

Monitor from 18 global locations:

| Code  | Location        | Code  | Location     |
| ----- | --------------- | ----- | ------------ |
| `ams` | Amsterdam       | `lax` | Los Angeles  |
| `arn` | Stockholm       | `lhr` | London       |
| `bom` | Mumbai          | `nrt` | Tokyo        |
| `cdg` | Paris           | `ord` | Chicago      |
| `dfw` | Dallas          | `sjc` | San Jose     |
| `ewr` | Newark          | `sin` | Singapore    |
| `fra` | Frankfurt       | `syd` | Sydney       |
| `gru` | São Paulo       | `yyz` | Toronto      |
| `iad` | Washington D.C. | `jnb` | Johannesburg |

## Error Handling

The SDK uses Connect RPC. Errors include a `code` and `message`:

```typescript
import { ConnectError } from "@connectrpc/connect";

try {
  await openstatus.monitor.v1.MonitorService.deleteMonitor(
    { id: "invalid" },
    { headers },
  );
} catch (error) {
  if (error instanceof ConnectError) {
    console.error(`Error ${error.code}: ${error.message}`);
  }
}
```

## Related

- [OpenStatus](https://openstatus.dev) - Open-source monitoring platform
- [Documentation](https://docs.openstatus.dev) - Full API documentation
- [Status Page](https://status.openstatus.dev) - OpenStatus service status

## License

MIT

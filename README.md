# OpenStatus Node.js SDK (Beta)

[![JSR](https://jsr.io/badges/@openstatus/sdk-node)](https://jsr.io/@openstatus/sdk-node)
[![npm](https://img.shields.io/npm/v/@openstatus/sdk-node)](https://www.npmjs.com/package/@openstatus/sdk-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official Node.js SDK for [OpenStatus](https://openstatus.dev) - The open-source status page with uptime monitoring.

## Features

### Status Page
- **Status Reports** - Manage incident and maintenance reports with update timelines

### Monitoring
- **HTTP Monitoring** - Monitor websites and APIs with customizable assertions
- **TCP Monitoring** - Check database connections and other TCP services
- **DNS Monitoring** - Verify DNS records and resolution

- **Global Regions** - Monitor from 28 locations worldwide
- **Type-safe** - Full TypeScript support with generated types from protobuf

## Installation

### JSR

```bash
npx jsr add @openstatus/sdk-node
```

### npm

```bash
npm install @openstatus/sdk-node
```

### Deno

```typescript
import { openstatus } from "jsr:@openstatus/sdk-node";
```

## Quick Start

```typescript
import {
  HTTPMethod,
  NumberComparator,
  openstatus,
  Periodicity,
  Region,
} from "@openstatus/sdk-node";

const headers = {
  "x-openstatus-key": `${process.env.OPENSTATUS_API_KEY}`,
};

// Create a monitor
const { monitor } = await openstatus.monitor.v1.MonitorService
  .createHTTPMonitor(
    {
      monitor: {
        name: "My API",
        url: "https://api.example.com/health",
        periodicity: Periodicity.PERIODICITY_1M,
        method: HTTPMethod.HTTP_METHOD_GET,
        regions: [Region.FLY_AMS, Region.FLY_IAD, Region.FLY_SYD],
        active: true,
        statusCodeAssertions: [
          { comparator: NumberComparator.EQUAL, target: BigInt(200) },
        ],
      },
    },
    { headers },
  );

console.log(`Monitor created: ${monitor?.id}`);

// List all monitors
const { httpMonitors, tcpMonitors, dnsMonitors, totalSize } = await openstatus
  .monitor.v1.MonitorService.listMonitors({}, { headers });

console.log(`Found ${totalSize} monitors`);
```

## Authentication

All API requests require an API key. Get yours from the
[OpenStatus dashboard](https://www.openstatus.dev/app).

```typescript
const headers = {
  "x-openstatus-key": `${process.env.OPENSTATUS_API_KEY}`,
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
import { HTTPMethod, Periodicity, Region } from "@openstatus/sdk-node";

const { monitor } = await openstatus.monitor.v1.MonitorService
  .createHTTPMonitor(
    {
      monitor: {
        name: "My Website",
        url: "https://example.com",
        periodicity: Periodicity.PERIODICITY_1M,
        method: HTTPMethod.HTTP_METHOD_GET,
        regions: [Region.FLY_AMS, Region.FLY_IAD, Region.FLY_SYD],
        active: true,
      },
    },
    { headers },
  );
```

#### `updateHTTPMonitor(request, options)`

Update an existing HTTP monitor.

```typescript
const { monitor } = await openstatus.monitor.v1.MonitorService
  .updateHTTPMonitor(
    {
      id: "mon_123",
      monitor: {
        name: "Updated Name",
        active: false,
      },
    },
    { headers },
  );
```

#### `createTCPMonitor(request, options)`

Create a TCP connection monitor.

```typescript
const { monitor } = await openstatus.monitor.v1.MonitorService.createTCPMonitor(
  {
    monitor: {
      name: "Database",
      uri: "db.example.com:5432",
      periodicity: Periodicity.PERIODICITY_5M,
      regions: [Region.FLY_AMS, Region.FLY_IAD],
      active: true,
    },
  },
  { headers },
);
```

#### `updateTCPMonitor(request, options)`

Update an existing TCP monitor.

```typescript
const { monitor } = await openstatus.monitor.v1.MonitorService.updateTCPMonitor(
  {
    id: "mon_123",
    monitor: {
      name: "Updated Database Monitor",
    },
  },
  { headers },
);
```

#### `createDNSMonitor(request, options)`

Create a DNS resolution monitor.

```typescript
import { RecordComparator } from "@openstatus/sdk-node";

const { monitor } = await openstatus.monitor.v1.MonitorService.createDNSMonitor(
  {
    monitor: {
      name: "DNS Check",
      uri: "example.com",
      periodicity: Periodicity.PERIODICITY_10M,
      regions: [Region.FLY_AMS],
      active: true,
      recordAssertions: [
        {
          record: "A",
          comparator: RecordComparator.EQUAL,
          target: "93.184.216.34",
        },
      ],
    },
  },
  { headers },
);
```

#### `updateDNSMonitor(request, options)`

Update an existing DNS monitor.

```typescript
const { monitor } = await openstatus.monitor.v1.MonitorService.updateDNSMonitor(
  {
    id: "mon_123",
    monitor: {
      name: "Updated DNS Check",
    },
  },
  { headers },
);
```

#### `listMonitors(request, options)`

List all monitors with pagination. Returns monitors grouped by type.

```typescript
const { httpMonitors, tcpMonitors, dnsMonitors, nextPageToken, totalSize } =
  await openstatus.monitor.v1.MonitorService.listMonitors(
    { pageSize: 10, pageToken: "" },
    { headers },
  );
```

#### `triggerMonitor(request, options)`

Trigger an immediate check.

```typescript
const { success } = await openstatus.monitor.v1.MonitorService.triggerMonitor(
  { id: "mon_123" },
  { headers },
);
```

#### `deleteMonitor(request, options)`

Delete a monitor.

```typescript
const { success } = await openstatus.monitor.v1.MonitorService.deleteMonitor(
  { id: "mon_123" },
  { headers },
);
```

#### `getMonitorStatus(request, options)`

Get the current status of a monitor across all configured regions.

```typescript
import { MonitorStatus, Region } from "@openstatus/sdk-node";

const { id, regions } = await openstatus.monitor.v1.MonitorService
  .getMonitorStatus(
    { id: "mon_123" },
    { headers },
  );

// regions is an array of { region, status }
// region: Region enum value (e.g., Region.FLY_AMS)
// status: MonitorStatus.ACTIVE, MonitorStatus.DEGRADED, or MonitorStatus.ERROR
for (const { region, status } of regions) {
  console.log(`${Region[region]}: ${MonitorStatus[status]}`);
}
```

#### `getMonitorSummary(request, options)`

Get aggregated metrics and latency percentiles for a monitor.

```typescript
import { TimeRange } from "@openstatus/sdk-node";

const summary = await openstatus.monitor.v1.MonitorService.getMonitorSummary(
  {
    id: "mon_123",
    timeRange: TimeRange.TIME_RANGE_7D, // TIME_RANGE_1D, TIME_RANGE_7D, or TIME_RANGE_14D
    regions: [], // optional: filter by specific regions
  },
  { headers },
);

console.log(`Last ping: ${summary.lastPingAt}`);
console.log(`Success: ${summary.totalSuccessful}`);
console.log(`Degraded: ${summary.totalDegraded}`);
console.log(`Failed: ${summary.totalFailed}`);
console.log(`P50 latency: ${summary.p50}ms`);
console.log(`P75 latency: ${summary.p75}ms`);
console.log(`P90 latency: ${summary.p90}ms`);
console.log(`P95 latency: ${summary.p95}ms`);
console.log(`P99 latency: ${summary.p99}ms`);
```

### Health Service

Check API health status (no authentication required).

```typescript
import { ServingStatus } from "@openstatus/sdk-node";

const { status } = await openstatus.health.v1.HealthService.check({});
console.log(ServingStatus[status]); // "SERVING"
```

### Status Report Service

Manage incident and maintenance reports with update timelines.

#### `createStatusReport(request, options)`

Create a new status report.

```typescript
import { StatusReportStatus } from "@openstatus/sdk-node";

const { statusReport } = await openstatus.statusReport.v1.StatusReportService
  .createStatusReport(
    {
      title: "API Degradation",
      status: StatusReportStatus.INVESTIGATING,
      message: "We are investigating reports of increased latency.",
      date: "2024-01-15T10:30:00",
      pageId: "page_123",
      pageComponentIds: ["comp_456"],
      notify: true,
    },
    { headers },
  );

console.log(`Status report created: ${statusReport?.id}`);
```

#### `getStatusReport(request, options)`

Get a status report by ID (includes full update timeline).

```typescript
const { statusReport } = await openstatus.statusReport.v1.StatusReportService
  .getStatusReport(
    { id: "sr_123" },
    { headers },
  );

console.log(`Title: ${statusReport?.title}`);
console.log(`Status: ${StatusReportStatus[statusReport?.status ?? 0]}`);

// Access update timeline
for (const update of statusReport?.updates ?? []) {
  console.log(`${update.date}: ${update.message}`);
}
```

#### `listStatusReports(request, options)`

List all status reports with pagination and optional filtering.

```typescript
import { StatusReportStatus } from "@openstatus/sdk-node";

const { statusReports, totalSize } = await openstatus.statusReport.v1
  .StatusReportService.listStatusReports(
    {
      limit: 10,
      offset: 0,
      statuses: [StatusReportStatus.INVESTIGATING, StatusReportStatus.IDENTIFIED],
    },
    { headers },
  );

console.log(`Found ${totalSize} status reports`);
```

#### `updateStatusReport(request, options)`

Update status report metadata (title, page components).

```typescript
const { statusReport } = await openstatus.statusReport.v1.StatusReportService
  .updateStatusReport(
    {
      id: "sr_123",
      title: "Updated Title",
      pageComponentIds: ["comp_456", "comp_789"],
    },
    { headers },
  );
```

#### `deleteStatusReport(request, options)`

Delete a status report and all its updates.

```typescript
const { success } = await openstatus.statusReport.v1.StatusReportService
  .deleteStatusReport(
    { id: "sr_123" },
    { headers },
  );
```

#### `addStatusReportUpdate(request, options)`

Add a new update to an existing status report timeline.

```typescript
import { StatusReportStatus } from "@openstatus/sdk-node";

const { statusReport } = await openstatus.statusReport.v1.StatusReportService
  .addStatusReportUpdate(
    {
      statusReportId: "sr_123",
      status: StatusReportStatus.IDENTIFIED,
      message: "The issue has been identified as a database connection problem.",
      date: "2024-01-15T11:00:00", // optional, defaults to current time
      notify: true,
    },
    { headers },
  );
```

### Status Report Status

| Enum Value      | Description                     |
| --------------- | ------------------------------- |
| `UNSPECIFIED`   | Default/unspecified status      |
| `INVESTIGATING` | Actively investigating the issue |
| `IDENTIFIED`    | Root cause has been identified  |
| `MONITORING`    | Fix deployed, monitoring        |
| `RESOLVED`      | Issue fully resolved            |

## Monitor Options

### HTTP Monitor

| Option                 | Type                | Required | Description                                         |
| ---------------------- | ------------------- | -------- | --------------------------------------------------- |
| `name`                 | string              | Yes      | Monitor name (max 256 chars)                        |
| `url`                  | string              | Yes      | URL to monitor (max 2048 chars)                     |
| `periodicity`          | Periodicity         | Yes      | Check interval (see [Periodicity](#periodicity))    |
| `method`               | HTTPMethod          | No       | HTTP method (see [HTTP Methods](#http-methods))     |
| `body`                 | string              | No       | Request body                                        |
| `headers`              | Headers[]           | No       | Custom headers (`{ key: string, value: string }[]`) |
| `timeout`              | bigint              | No       | Timeout in ms (default: 45000, max: 120000)         |
| `retry`                | bigint              | No       | Retry attempts (default: 3, max: 10)                |
| `followRedirects`      | boolean             | No       | Follow redirects (default: true)                    |
| `regions`              | Region[]            | No       | [Regions](#regions) for checks                      |
| `active`               | boolean             | No       | Enable monitoring (default: false)                  |
| `public`               | boolean             | No       | Public visibility (default: false)                  |
| `degradedAt`           | bigint              | No       | Latency threshold (ms) for degraded status          |
| `description`          | string              | No       | Monitor description (max 1024 chars)                |
| `statusCodeAssertions` | array               | No       | [Status code assertions](#status-code-assertions)   |
| `bodyAssertions`       | array               | No       | [Body assertions](#body-assertions)                 |
| `headerAssertions`     | array               | No       | [Header assertions](#header-assertions)             |
| `openTelemetry`        | OpenTelemetryConfig | No       | OpenTelemetry export configuration                  |

### TCP Monitor

| Option          | Type                | Required | Description                                      |
| --------------- | ------------------- | -------- | ------------------------------------------------ |
| `name`          | string              | Yes      | Monitor name (max 256 chars)                     |
| `uri`           | string              | Yes      | `host:port` to monitor (max 2048 chars)          |
| `periodicity`   | Periodicity         | Yes      | Check interval (see [Periodicity](#periodicity)) |
| `timeout`       | bigint              | No       | Timeout in ms (default: 45000, max: 120000)      |
| `retry`         | bigint              | No       | Retry attempts (default: 3, max: 10)             |
| `regions`       | Region[]            | No       | [Regions](#regions) for checks                   |
| `active`        | boolean             | No       | Enable monitoring (default: false)               |
| `public`        | boolean             | No       | Public visibility (default: false)               |
| `degradedAt`    | bigint              | No       | Latency threshold (ms) for degraded status       |
| `description`   | string              | No       | Monitor description (max 1024 chars)             |
| `openTelemetry` | OpenTelemetryConfig | No       | OpenTelemetry export configuration               |

### DNS Monitor

| Option             | Type                | Required | Description                                      |
| ------------------ | ------------------- | -------- | ------------------------------------------------ |
| `name`             | string              | Yes      | Monitor name (max 256 chars)                     |
| `uri`              | string              | Yes      | Domain to resolve (max 2048 chars)               |
| `periodicity`      | Periodicity         | Yes      | Check interval (see [Periodicity](#periodicity)) |
| `timeout`          | bigint              | No       | Timeout in ms (default: 45000, max: 120000)      |
| `retry`            | bigint              | No       | Retry attempts (default: 3, max: 10)             |
| `regions`          | Region[]            | No       | [Regions](#regions) for checks                   |
| `active`           | boolean             | No       | Enable monitoring (default: false)               |
| `public`           | boolean             | No       | Public visibility (default: false)               |
| `degradedAt`       | bigint              | No       | Latency threshold (ms) for degraded status       |
| `description`      | string              | No       | Monitor description (max 1024 chars)             |
| `recordAssertions` | array               | No       | [DNS record assertions](#dns-record-assertions)  |
| `openTelemetry`    | OpenTelemetryConfig | No       | OpenTelemetry export configuration               |

### Periodicity

| Enum Value        | Description |
| ----------------- | ----------- |
| `PERIODICITY_30S` | Every 30s   |
| `PERIODICITY_1M`  | Every 1m    |
| `PERIODICITY_5M`  | Every 5m    |
| `PERIODICITY_10M` | Every 10m   |
| `PERIODICITY_30M` | Every 30m   |
| `PERIODICITY_1H`  | Every 1h    |

### HTTP Methods

| Enum Value            | Description |
| --------------------- | ----------- |
| `HTTP_METHOD_GET`     | GET         |
| `HTTP_METHOD_POST`    | POST        |
| `HTTP_METHOD_HEAD`    | HEAD        |
| `HTTP_METHOD_PUT`     | PUT         |
| `HTTP_METHOD_PATCH`   | PATCH       |
| `HTTP_METHOD_DELETE`  | DELETE      |
| `HTTP_METHOD_TRACE`   | TRACE       |
| `HTTP_METHOD_CONNECT` | CONNECT     |
| `HTTP_METHOD_OPTIONS` | OPTIONS     |

## Assertions

All assertion comparators are exported as enums from the SDK.

### Status Code Assertions

Validate HTTP response status codes using `NumberComparator`.

```typescript
import { NumberComparator } from "@openstatus/sdk-node";

{
  statusCodeAssertions: [
    { comparator: NumberComparator.EQUAL, target: BigInt(200) },
    { comparator: NumberComparator.LESS_THAN, target: BigInt(400) },
  ];
}
```

**NumberComparator values:**

| Enum Value              | Description           |
| ----------------------- | --------------------- |
| `EQUAL`                 | Equal to target       |
| `NOT_EQUAL`             | Not equal to target   |
| `GREATER_THAN`          | Greater than target   |
| `GREATER_THAN_OR_EQUAL` | Greater than or equal |
| `LESS_THAN`             | Less than target      |
| `LESS_THAN_OR_EQUAL`    | Less than or equal    |

### Body Assertions

Validate response body content using `StringComparator`.

```typescript
import { StringComparator } from "@openstatus/sdk-node";

{
  bodyAssertions: [
    { comparator: StringComparator.CONTAINS, target: '"status":"ok"' },
    { comparator: StringComparator.NOT_EMPTY, target: "" },
  ];
}
```

**StringComparator values:**

| Enum Value              | Description                 |
| ----------------------- | --------------------------- |
| `CONTAINS`              | Contains target string      |
| `NOT_CONTAINS`          | Does not contain target     |
| `EQUAL`                 | Equal to target             |
| `NOT_EQUAL`             | Not equal to target         |
| `EMPTY`                 | Body is empty               |
| `NOT_EMPTY`             | Body is not empty           |
| `GREATER_THAN`          | Lexicographically greater   |
| `GREATER_THAN_OR_EQUAL` | Lexicographically >= target |
| `LESS_THAN`             | Lexicographically less      |
| `LESS_THAN_OR_EQUAL`    | Lexicographically <= target |

### Header Assertions

Validate response headers using `StringComparator`.

```typescript
import { StringComparator } from "@openstatus/sdk-node";

{
  headerAssertions: [
    {
      key: "content-type",
      comparator: StringComparator.CONTAINS,
      target: "application/json",
    },
  ];
}
```

### DNS Record Assertions

Validate DNS records using `RecordComparator`.

```typescript
import { RecordComparator } from "@openstatus/sdk-node";

{
  recordAssertions: [
    {
      record: "A",
      comparator: RecordComparator.EQUAL,
      target: "93.184.216.34",
    },
    { record: "CNAME", comparator: RecordComparator.CONTAINS, target: "cdn" },
  ];
}
```

**RecordComparator values:**

| Enum Value     | Description             |
| -------------- | ----------------------- |
| `EQUAL`        | Equal to target         |
| `NOT_EQUAL`    | Not equal to target     |
| `CONTAINS`     | Contains target string  |
| `NOT_CONTAINS` | Does not contain target |

**Supported record types:** `A`, `AAAA`, `CNAME`, `MX`, `TXT`

## Regions

Monitor from 28 global locations across multiple providers. Use the `Region`
enum:

```typescript
import { Region } from "@openstatus/sdk-node";

// Example: Use specific regions
regions: [Region.FLY_AMS, Region.FLY_IAD, Region.KOYEB_FRA];
```

### Fly.io Regions

| Enum Value | Location        |
| ---------- | --------------- |
| `FLY_AMS`  | Amsterdam       |
| `FLY_ARN`  | Stockholm       |
| `FLY_BOM`  | Mumbai          |
| `FLY_CDG`  | Paris           |
| `FLY_DFW`  | Dallas          |
| `FLY_EWR`  | Newark          |
| `FLY_FRA`  | Frankfurt       |
| `FLY_GRU`  | São Paulo       |
| `FLY_IAD`  | Washington D.C. |
| `FLY_JNB`  | Johannesburg    |
| `FLY_LAX`  | Los Angeles     |
| `FLY_LHR`  | London          |
| `FLY_NRT`  | Tokyo           |
| `FLY_ORD`  | Chicago         |
| `FLY_SJC`  | San Jose        |
| `FLY_SIN`  | Singapore       |
| `FLY_SYD`  | Sydney          |
| `FLY_YYZ`  | Toronto         |

### Koyeb Regions

| Enum Value  | Location      |
| ----------- | ------------- |
| `KOYEB_FRA` | Frankfurt     |
| `KOYEB_PAR` | Paris         |
| `KOYEB_SFO` | San Francisco |
| `KOYEB_SIN` | Singapore     |
| `KOYEB_TYO` | Tokyo         |
| `KOYEB_WAS` | Washington    |

### Railway Regions

| Enum Value                | Location       |
| ------------------------- | -------------- |
| `RAILWAY_US_WEST2`        | US West        |
| `RAILWAY_US_EAST4`        | US East        |
| `RAILWAY_EUROPE_WEST4`    | Europe West    |
| `RAILWAY_ASIA_SOUTHEAST1` | Asia Southeast |

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

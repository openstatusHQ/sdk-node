# OpenStatus Node.js SDK (Beta)

[![JSR](https://jsr.io/badges/@openstatus/sdk-node)](https://jsr.io/@openstatus/sdk-node)
[![npm](https://img.shields.io/npm/v/@openstatus/sdk-node)](https://www.npmjs.com/package/@openstatus/sdk-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official Node.js SDK for [OpenStatus](https://openstatus.dev) - The open-source
status page with uptime monitoring.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Authentication](#authentication)
- [SDK Reference](#sdk-reference)
  - [Monitor Service](#monitor-service)
  - [Health Service](#health-service)
  - [Status Report Service](#status-report-service)
  - [Status Page Service](#status-page-service)
  - [Maintenance Service](#maintenance-service)
  - [Notification Service](#notification-service)
- [Reference](#reference)
  - [Monitor Options](#monitor-options)
  - [Assertions](#assertions)
  - [Regions](#regions)
  - [Enums](#enums)
- [Error Handling](#error-handling)
- [Related](#related)

## Features

### Monitoring

- **HTTP Monitoring** - Monitor websites and APIs with customizable assertions
- **TCP Monitoring** - Check database connections and other TCP services
- **DNS Monitoring** - Verify DNS records and resolution
- **Global Regions** - Monitor from 28 locations worldwide

### Status Page

- **Status Pages** - Create and manage public status pages with custom domains
- **Page Components** - Add monitor-based or static components with grouping
- **Subscribers** - Manage email subscriptions for status updates
- **Status Reports** - Manage incident reports with update timelines
- **Maintenance Windows** - Schedule and manage planned maintenance periods

### Notifications

- **12 Providers** - Slack, Discord, Email, PagerDuty, Opsgenie, Telegram, and
  more
- **Webhook Support** - Custom webhooks with headers for any integration
- **Monitor Alerts** - Get notified when monitors go down or recover

### Developer Experience

- **Type-safe** - Full TypeScript support with generated types from protobuf
- **Multiple Runtimes** - Works with Node.js, Deno, and Bun

## Installation

### npm

```bash
npm install @openstatus/sdk-node
```

### JSR

```bash
npx jsr add @openstatus/sdk-node
```

### Deno

```typescript
import { createOpenStatusClient } from "jsr:@openstatus/sdk-node";
```

## Quick Start

```typescript
import {
  createOpenStatusClient,
  HTTPMethod,
  NumberComparator,
  Periodicity,
  Region,
} from "@openstatus/sdk-node";

// Create a client with your API key
const client = createOpenStatusClient({
  apiKey: process.env.OPENSTATUS_API_KEY,
});

// Create a monitor
const { monitor } = await client.monitor.v1.MonitorService.createHTTPMonitor({
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
});

console.log(`Monitor created: ${monitor?.id}`);

// List all monitors
const { httpMonitors, tcpMonitors, dnsMonitors, totalSize } = await client
  .monitor.v1.MonitorService.listMonitors({});

console.log(`Found ${totalSize} monitors`);
```

## Authentication

All API requests require an API key. Get yours from the
[OpenStatus dashboard](https://www.openstatus.dev/app).

### Recommended: Configure client once

```typescript
import { createOpenStatusClient } from "@openstatus/sdk-node";

const client = createOpenStatusClient({
  apiKey: process.env.OPENSTATUS_API_KEY,
});

// No need to pass headers on each call
await client.monitor.v1.MonitorService.listMonitors({});
```

### Alternative: Manual headers

```typescript
import { openstatus } from "@openstatus/sdk-node";

const headers = {
  "x-openstatus-key": process.env.OPENSTATUS_API_KEY,
};

// Pass headers to each service method
await openstatus.monitor.v1.MonitorService.listMonitors({}, { headers });
```

### Environment Variables

| Variable             | Description             | Default                          |
| -------------------- | ----------------------- | -------------------------------- |
| `OPENSTATUS_API_KEY` | Your OpenStatus API key | Required                         |
| `OPENSTATUS_API_URL` | Custom API endpoint     | `https://api.openstatus.dev/rpc` |

## SDK Reference

> **Note:** All examples below assume you've created a client:
>
> ```typescript
> const client = createOpenStatusClient({
>   apiKey: process.env.OPENSTATUS_API_KEY,
> });
> ```

### Monitor Service

Manage HTTP, TCP, and DNS monitors.

#### `createHTTPMonitor(request)`

Create an HTTP/HTTPS monitor.

```typescript
import {
  createOpenStatusClient,
  HTTPMethod,
  Periodicity,
  Region,
} from "@openstatus/sdk-node";

const { monitor } = await client.monitor.v1.MonitorService.createHTTPMonitor({
  monitor: {
    name: "My Website",
    url: "https://example.com",
    periodicity: Periodicity.PERIODICITY_1M,
    method: HTTPMethod.HTTP_METHOD_GET,
    regions: [Region.FLY_AMS, Region.FLY_IAD, Region.FLY_SYD],
    active: true,
  },
});
```

#### `updateHTTPMonitor(request)`

Update an existing HTTP monitor.

```typescript
const { monitor } = await client.monitor.v1.MonitorService.updateHTTPMonitor({
  id: "mon_123",
  monitor: {
    name: "Updated Name",
    active: false,
  },
});
```

#### `createTCPMonitor(request)`

Create a TCP connection monitor.

```typescript
const { monitor } = await client.monitor.v1.MonitorService.createTCPMonitor({
  monitor: {
    name: "Database",
    uri: "db.example.com:5432",
    periodicity: Periodicity.PERIODICITY_5M,
    regions: [Region.FLY_AMS, Region.FLY_IAD],
    active: true,
  },
});
```

#### `updateTCPMonitor(request)`

Update an existing TCP monitor.

```typescript
const { monitor } = await client.monitor.v1.MonitorService.updateTCPMonitor({
  id: "mon_123",
  monitor: {
    name: "Updated Database Monitor",
  },
});
```

#### `createDNSMonitor(request)`

Create a DNS resolution monitor.

```typescript
import { Periodicity, RecordComparator, Region } from "@openstatus/sdk-node";

const { monitor } = await client.monitor.v1.MonitorService.createDNSMonitor({
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
});
```

#### `updateDNSMonitor(request)`

Update an existing DNS monitor.

```typescript
const { monitor } = await client.monitor.v1.MonitorService.updateDNSMonitor({
  id: "mon_123",
  monitor: {
    name: "Updated DNS Check",
  },
});
```

#### `listMonitors(request)`

List all monitors with pagination. Returns monitors grouped by type.

```typescript
const { httpMonitors, tcpMonitors, dnsMonitors, nextPageToken, totalSize } =
  await client.monitor.v1.MonitorService.listMonitors({
    pageSize: 10,
    pageToken: "",
  });
```

#### `getMonitor(request)`

Get a single monitor by ID. Returns the monitor configuration (HTTP, TCP, or
DNS).

```typescript
const { monitor } = await client.monitor.v1.MonitorService.getMonitor({
  id: "mon_123",
});

// Handle the monitor type
if (monitor?.config.case === "http") {
  console.log(`HTTP Monitor: ${monitor.config.value.name}`);
} else if (monitor?.config.case === "tcp") {
  console.log(`TCP Monitor: ${monitor.config.value.name}`);
} else if (monitor?.config.case === "dns") {
  console.log(`DNS Monitor: ${monitor.config.value.name}`);
}
```

#### `triggerMonitor(request)`

Trigger an immediate check.

```typescript
const { success } = await client.monitor.v1.MonitorService.triggerMonitor({
  id: "mon_123",
});
```

#### `deleteMonitor(request)`

Delete a monitor.

```typescript
const { success } = await client.monitor.v1.MonitorService.deleteMonitor({
  id: "mon_123",
});
```

#### `getMonitorStatus(request)`

Get the current status of a monitor across all configured regions.

```typescript
import { MonitorStatus, Region } from "@openstatus/sdk-node";

const { id, regions } = await client.monitor.v1.MonitorService.getMonitorStatus(
  { id: "mon_123" },
);

for (const { region, status } of regions) {
  console.log(`${Region[region]}: ${MonitorStatus[status]}`);
}
```

#### `getMonitorSummary(request)`

Get aggregated metrics and latency percentiles for a monitor.

```typescript
import { TimeRange } from "@openstatus/sdk-node";

const summary = await client.monitor.v1.MonitorService.getMonitorSummary({
  id: "mon_123",
  timeRange: TimeRange.TIME_RANGE_7D,
  regions: [], // optional: filter by specific regions
});

console.log(`Last ping: ${summary.lastPingAt}`);
console.log(`Success: ${summary.totalSuccessful}`);
console.log(`Failed: ${summary.totalFailed}`);
console.log(`P50 latency: ${summary.p50}ms`);
console.log(`P95 latency: ${summary.p95}ms`);
console.log(`P99 latency: ${summary.p99}ms`);
```

---

### Health Service

Check API health status (no authentication required).

```typescript
import { openstatus, ServingStatus } from "@openstatus/sdk-node";

const { status } = await openstatus.health.v1.HealthService.check({});
console.log(ServingStatus[status]); // "SERVING"
```

---

### Status Report Service

Manage incident reports with update timelines.

#### `createStatusReport(request)`

Create a new status report.

```typescript
import { StatusReportStatus } from "@openstatus/sdk-node";

const { statusReport } = await client.statusReport.v1.StatusReportService
  .createStatusReport({
    title: "API Degradation",
    status: StatusReportStatus.INVESTIGATING,
    message: "We are investigating reports of increased latency.",
    date: "2024-01-15T10:30:00Z",
    pageId: "page_123",
    pageComponentIds: ["comp_456"],
    notify: true,
  });

console.log(`Status report created: ${statusReport?.id}`);
```

#### `getStatusReport(request)`

Get a status report by ID (includes full update timeline).

```typescript
import { StatusReportStatus } from "@openstatus/sdk-node";

const { statusReport } = await client.statusReport.v1.StatusReportService
  .getStatusReport({
    id: "sr_123",
  });

console.log(`Title: ${statusReport?.title}`);
console.log(`Status: ${StatusReportStatus[statusReport?.status ?? 0]}`);

for (const update of statusReport?.updates ?? []) {
  console.log(`${update.date}: ${update.message}`);
}
```

#### `listStatusReports(request)`

List all status reports with pagination and optional filtering.

```typescript
import { StatusReportStatus } from "@openstatus/sdk-node";

const { statusReports, totalSize } = await client.statusReport.v1
  .StatusReportService.listStatusReports({
    limit: 10,
    offset: 0,
    statuses: [StatusReportStatus.INVESTIGATING, StatusReportStatus.IDENTIFIED],
  });

console.log(`Found ${totalSize} status reports`);
```

#### `updateStatusReport(request)`

Update status report metadata.

```typescript
const { statusReport } = await client.statusReport.v1.StatusReportService
  .updateStatusReport({
    id: "sr_123",
    title: "Updated Title",
    pageComponentIds: ["comp_456", "comp_789"],
  });
```

#### `deleteStatusReport(request)`

Delete a status report and all its updates.

```typescript
const { success } = await client.statusReport.v1.StatusReportService
  .deleteStatusReport({
    id: "sr_123",
  });
```

#### `addStatusReportUpdate(request)`

Add a new update to an existing status report timeline.

```typescript
import { StatusReportStatus } from "@openstatus/sdk-node";

const { statusReport } = await client.statusReport.v1.StatusReportService
  .addStatusReportUpdate({
    statusReportId: "sr_123",
    status: StatusReportStatus.IDENTIFIED,
    message: "The issue has been identified as a database connection problem.",
    date: "2024-01-15T11:00:00Z", // optional, defaults to current time
    notify: true,
  });
```

---

### Status Page Service

Manage status pages, components, and subscribers.

#### `createStatusPage(request)`

Create a new status page.

```typescript
const { statusPage } = await client.statusPage.v1.StatusPageService
  .createStatusPage({
    title: "My Service Status",
    slug: "my-service",
    description: "Status page for My Service",
    homepageUrl: "https://example.com",
    contactUrl: "https://example.com/contact",
  });

console.log(`Status page created: ${statusPage?.id}`);
```

#### `getStatusPage(request)`

Get a status page by ID.

```typescript
const { statusPage } = await client.statusPage.v1.StatusPageService
  .getStatusPage({
    id: "page_123",
  });
```

#### `listStatusPages(request)`

List all status pages with pagination.

```typescript
const { statusPages, totalSize } = await client.statusPage.v1.StatusPageService
  .listStatusPages({ limit: 10, offset: 0 });

console.log(`Found ${totalSize} status pages`);
```

#### `updateStatusPage(request)`

Update a status page.

```typescript
const { statusPage } = await client.statusPage.v1.StatusPageService
  .updateStatusPage({
    id: "page_123",
    title: "Updated Title",
    description: "Updated description",
  });
```

#### `deleteStatusPage(request)`

Delete a status page.

```typescript
const { success } = await client.statusPage.v1.StatusPageService
  .deleteStatusPage({
    id: "page_123",
  });
```

#### `addMonitorComponent(request)`

Add a monitor-based component to a status page.

```typescript
const { component } = await client.statusPage.v1.StatusPageService
  .addMonitorComponent({
    pageId: "page_123",
    monitorId: "mon_456",
    name: "API Server",
    description: "Main API endpoint",
    order: 1,
  });
```

#### `addStaticComponent(request)`

Add a static component (not linked to a monitor).

```typescript
const { component } = await client.statusPage.v1.StatusPageService
  .addStaticComponent({
    pageId: "page_123",
    name: "Third-party Service",
    description: "External dependency",
    order: 2,
  });
```

#### `updateComponent(request)`

Update a component.

```typescript
const { component } = await client.statusPage.v1.StatusPageService
  .updateComponent({
    id: "comp_123",
    name: "Updated Component Name",
    order: 3,
  });
```

#### `removeComponent(request)`

Remove a component from a status page.

```typescript
const { success } = await client.statusPage.v1.StatusPageService
  .removeComponent({
    id: "comp_123",
  });
```

#### `createComponentGroup(request)`

Create a component group.

```typescript
const { group } = await client.statusPage.v1.StatusPageService
  .createComponentGroup({
    pageId: "page_123",
    name: "Core Services",
  });
```

#### `updateComponentGroup(request)`

Update a component group.

```typescript
const { group } = await client.statusPage.v1.StatusPageService
  .updateComponentGroup({
    id: "group_123",
    name: "Updated Group Name",
  });
```

#### `deleteComponentGroup(request)`

Delete a component group.

```typescript
const { success } = await client.statusPage.v1.StatusPageService
  .deleteComponentGroup({
    id: "group_123",
  });
```

#### `subscribeToPage(request)`

Subscribe an email to status page updates.

```typescript
const { subscriber } = await client.statusPage.v1.StatusPageService
  .subscribeToPage({
    pageId: "page_123",
    email: "user@example.com",
  });
```

#### `unsubscribeFromPage(request)`

Unsubscribe from a status page.

```typescript
// By email
const { success } = await client.statusPage.v1.StatusPageService
  .unsubscribeFromPage({
    pageId: "page_123",
    identifier: { case: "email", value: "user@example.com" },
  });

// Or by subscriber ID
const { success: success2 } = await client.statusPage.v1.StatusPageService
  .unsubscribeFromPage({
    pageId: "page_123",
    identifier: { case: "id", value: "sub_456" },
  });
```

#### `listSubscribers(request)`

List all subscribers for a status page.

```typescript
const { subscribers, totalSize } = await client.statusPage.v1.StatusPageService
  .listSubscribers({
    pageId: "page_123",
    limit: 50,
    offset: 0,
    includeUnsubscribed: false,
  });
```

#### `getStatusPageContent(request)`

Get full status page content including components, groups, and active reports.

```typescript
const content = await client.statusPage.v1.StatusPageService
  .getStatusPageContent({
    identifier: { case: "slug", value: "my-service" },
  });

console.log(`Page: ${content.statusPage?.title}`);
console.log(`Components: ${content.components.length}`);
console.log(`Active reports: ${content.statusReports.length}`);
```

#### `getOverallStatus(request)`

Get the aggregated status of a status page.

```typescript
import { OverallStatus } from "@openstatus/sdk-node";

const { overallStatus, componentStatuses } = await client.statusPage.v1
  .StatusPageService.getOverallStatus({
    identifier: { case: "id", value: "page_123" },
  });

console.log(`Overall: ${OverallStatus[overallStatus]}`);
for (const { componentId, status } of componentStatuses) {
  console.log(`  ${componentId}: ${OverallStatus[status]}`);
}
```

---

### Maintenance Service

Manage scheduled maintenance windows.

#### `createMaintenance(request)`

Create a new maintenance window.

```typescript
const { maintenance } = await client.maintenance.v1.MaintenanceService
  .createMaintenance({
    title: "Database Upgrade",
    message: "We will be upgrading our database infrastructure.",
    from: "2024-01-20T02:00:00Z",
    to: "2024-01-20T04:00:00Z",
    pageId: "page_123",
    pageComponentIds: ["comp_456"],
    notify: true,
  });

console.log(`Maintenance created: ${maintenance?.id}`);
```

#### `getMaintenance(request)`

Get a maintenance window by ID.

```typescript
const { maintenance } = await client.maintenance.v1.MaintenanceService
  .getMaintenance({
    id: "maint_123",
  });

console.log(`Title: ${maintenance?.title}`);
console.log(`From: ${maintenance?.from}`);
console.log(`To: ${maintenance?.to}`);
```

#### `listMaintenances(request)`

List all maintenance windows with pagination and optional filtering.

```typescript
const { maintenances, totalSize } = await client.maintenance.v1
  .MaintenanceService.listMaintenances({
    limit: 10,
    offset: 0,
    pageId: "page_123", // optional filter
  });

console.log(`Found ${totalSize} maintenance windows`);
```

#### `updateMaintenance(request)`

Update a maintenance window.

```typescript
const { maintenance } = await client.maintenance.v1.MaintenanceService
  .updateMaintenance({
    id: "maint_123",
    title: "Extended Database Upgrade",
    to: "2024-01-20T06:00:00Z",
  });
```

#### `deleteMaintenance(request)`

Delete a maintenance window.

```typescript
const { success } = await client.maintenance.v1.MaintenanceService
  .deleteMaintenance({
    id: "maint_123",
  });
```

---

### Notification Service

Manage notification channels for monitor alerts. Supports 12 providers including
Slack, Discord, Email, PagerDuty, and custom webhooks.

#### `createNotification(request)`

Create a new notification channel.

```typescript
import { NotificationProvider } from "@openstatus/sdk-node";

const { notification } = await client.notification.v1.NotificationService
  .createNotification({
    name: "Slack Alerts",
    provider: NotificationProvider.SLACK,
    data: {
      data: {
        case: "slack",
        value: { webhookUrl: "https://hooks.slack.com/services/..." },
      },
    },
    monitorIds: ["mon_123", "mon_456"],
  });

console.log(`Notification created: ${notification?.id}`);
```

#### `getNotification(request)`

Get a notification channel by ID.

```typescript
import { NotificationProvider } from "@openstatus/sdk-node";

const { notification } = await client.notification.v1.NotificationService
  .getNotification({
    id: "notif_123",
  });

console.log(`Name: ${notification?.name}`);
console.log(`Provider: ${NotificationProvider[notification?.provider ?? 0]}`);
```

#### `listNotifications(request)`

List all notification channels with pagination.

```typescript
const { notifications, totalSize } = await client.notification.v1
  .NotificationService.listNotifications({ limit: 10, offset: 0 });

console.log(`Found ${totalSize} notification channels`);
```

#### `updateNotification(request)`

Update a notification channel.

```typescript
const { notification } = await client.notification.v1.NotificationService
  .updateNotification({
    id: "notif_123",
    name: "Updated Slack Alerts",
    monitorIds: ["mon_123", "mon_456", "mon_789"],
  });
```

#### `deleteNotification(request)`

Delete a notification channel.

```typescript
const { success } = await client.notification.v1.NotificationService
  .deleteNotification({
    id: "notif_123",
  });
```

#### `sendTestNotification(request)`

Send a test notification to verify configuration.

```typescript
import { NotificationProvider } from "@openstatus/sdk-node";

const { success, errorMessage } = await client.notification.v1
  .NotificationService.sendTestNotification({
    provider: NotificationProvider.SLACK,
    data: {
      data: {
        case: "slack",
        value: { webhookUrl: "https://hooks.slack.com/services/..." },
      },
    },
  });

if (success) {
  console.log("Test notification sent successfully");
} else {
  console.log(`Test failed: ${errorMessage}`);
}
```

#### `checkNotificationLimit(request)`

Check if the workspace has reached its notification limit.

```typescript
const { limitReached, currentCount, maxCount } = await client.notification.v1
  .NotificationService.checkNotificationLimit({});

console.log(`${currentCount}/${maxCount} notification channels used`);
```

#### Provider Configuration Examples

<details>
<summary><strong>Slack</strong></summary>

```typescript
{
  provider: NotificationProvider.SLACK,
  data: {
    data: {
      case: "slack",
      value: { webhookUrl: "https://hooks.slack.com/services/..." }
    }
  }
}
```

</details>

<details>
<summary><strong>Discord</strong></summary>

```typescript
{
  provider: NotificationProvider.DISCORD,
  data: {
    data: {
      case: "discord",
      value: { webhookUrl: "https://discord.com/api/webhooks/..." }
    }
  }
}
```

</details>

<details>
<summary><strong>Email</strong></summary>

```typescript
{
  provider: NotificationProvider.EMAIL,
  data: {
    data: {
      case: "email",
      value: { email: "alerts@example.com" }
    }
  }
}
```

</details>

<details>
<summary><strong>PagerDuty</strong></summary>

```typescript
{
  provider: NotificationProvider.PAGERDUTY,
  data: {
    data: {
      case: "pagerduty",
      value: { integrationKey: "your-integration-key" }
    }
  }
}
```

</details>

<details>
<summary><strong>Opsgenie</strong></summary>

```typescript
import { OpsgenieRegion } from "@openstatus/sdk-node";

{
  provider: NotificationProvider.OPSGENIE,
  data: {
    data: {
      case: "opsgenie",
      value: { apiKey: "your-api-key", region: OpsgenieRegion.US }
    }
  }
}
```

</details>

<details>
<summary><strong>Telegram</strong></summary>

```typescript
{
  provider: NotificationProvider.TELEGRAM,
  data: {
    data: {
      case: "telegram",
      value: { chatId: "123456789" }
    }
  }
}
```

</details>

<details>
<summary><strong>Google Chat</strong></summary>

```typescript
{
  provider: NotificationProvider.GOOGLE_CHAT,
  data: {
    data: {
      case: "googleChat",
      value: { webhookUrl: "https://chat.googleapis.com/v1/spaces/..." }
    }
  }
}
```

</details>

<details>
<summary><strong>Grafana OnCall</strong></summary>

```typescript
{
  provider: NotificationProvider.GRAFANA_ONCALL,
  data: {
    data: {
      case: "grafanaOncall",
      value: { webhookUrl: "https://oncall.example.com/..." }
    }
  }
}
```

</details>

<details>
<summary><strong>Ntfy</strong></summary>

```typescript
{
  provider: NotificationProvider.NTFY,
  data: {
    data: {
      case: "ntfy",
      value: {
        topic: "my-alerts",
        serverUrl: "https://ntfy.sh", // optional, defaults to ntfy.sh
        token: "tk_..." // optional auth token
      }
    }
  }
}
```

</details>

<details>
<summary><strong>SMS</strong></summary>

```typescript
{
  provider: NotificationProvider.SMS,
  data: {
    data: {
      case: "sms",
      value: { phoneNumber: "+1234567890" }
    }
  }
}
```

</details>

<details>
<summary><strong>WhatsApp</strong></summary>

```typescript
{
  provider: NotificationProvider.WHATSAPP,
  data: {
    data: {
      case: "whatsapp",
      value: { phoneNumber: "+1234567890" }
    }
  }
}
```

</details>

<details>
<summary><strong>Custom Webhook</strong></summary>

```typescript
{
  provider: NotificationProvider.WEBHOOK,
  data: {
    data: {
      case: "webhook",
      value: {
        endpoint: "https://api.example.com/webhook",
        headers: [
          { key: "Authorization", value: "Bearer token" },
          { key: "X-Custom-Header", value: "value" }
        ]
      }
    }
  }
}
```

</details>

---

## Reference

### Monitor Options

#### HTTP Monitor

| Option                 | Type                | Required | Description                                 |
| ---------------------- | ------------------- | -------- | ------------------------------------------- |
| `name`                 | string              | Yes      | Monitor name (max 256 chars)                |
| `url`                  | string              | Yes      | URL to monitor (max 2048 chars)             |
| `periodicity`          | Periodicity         | Yes      | Check interval                              |
| `method`               | HTTPMethod          | No       | HTTP method (default: GET)                  |
| `body`                 | string              | No       | Request body                                |
| `headers`              | Headers[]           | No       | Custom headers `{ key, value }[]`           |
| `timeout`              | bigint              | No       | Timeout in ms (default: 45000, max: 120000) |
| `retry`                | bigint              | No       | Retry attempts (default: 3, max: 10)        |
| `followRedirects`      | boolean             | No       | Follow redirects (default: true)            |
| `regions`              | Region[]            | No       | Regions for checks                          |
| `active`               | boolean             | No       | Enable monitoring (default: false)          |
| `public`               | boolean             | No       | Public visibility (default: false)          |
| `degradedAt`           | bigint              | No       | Latency threshold (ms) for degraded status  |
| `description`          | string              | No       | Monitor description (max 1024 chars)        |
| `statusCodeAssertions` | array               | No       | Status code assertions                      |
| `bodyAssertions`       | array               | No       | Body assertions                             |
| `headerAssertions`     | array               | No       | Header assertions                           |
| `openTelemetry`        | OpenTelemetryConfig | No       | OpenTelemetry export configuration          |

#### TCP Monitor

| Option          | Type                | Required | Description                                 |
| --------------- | ------------------- | -------- | ------------------------------------------- |
| `name`          | string              | Yes      | Monitor name (max 256 chars)                |
| `uri`           | string              | Yes      | `host:port` to monitor (max 2048 chars)     |
| `periodicity`   | Periodicity         | Yes      | Check interval                              |
| `timeout`       | bigint              | No       | Timeout in ms (default: 45000, max: 120000) |
| `retry`         | bigint              | No       | Retry attempts (default: 3, max: 10)        |
| `regions`       | Region[]            | No       | Regions for checks                          |
| `active`        | boolean             | No       | Enable monitoring (default: false)          |
| `public`        | boolean             | No       | Public visibility (default: false)          |
| `degradedAt`    | bigint              | No       | Latency threshold (ms) for degraded status  |
| `description`   | string              | No       | Monitor description (max 1024 chars)        |
| `openTelemetry` | OpenTelemetryConfig | No       | OpenTelemetry export configuration          |

#### DNS Monitor

| Option             | Type                | Required | Description                                 |
| ------------------ | ------------------- | -------- | ------------------------------------------- |
| `name`             | string              | Yes      | Monitor name (max 256 chars)                |
| `uri`              | string              | Yes      | Domain to resolve (max 2048 chars)          |
| `periodicity`      | Periodicity         | Yes      | Check interval                              |
| `timeout`          | bigint              | No       | Timeout in ms (default: 45000, max: 120000) |
| `retry`            | bigint              | No       | Retry attempts (default: 3, max: 10)        |
| `regions`          | Region[]            | No       | Regions for checks                          |
| `active`           | boolean             | No       | Enable monitoring (default: false)          |
| `public`           | boolean             | No       | Public visibility (default: false)          |
| `degradedAt`       | bigint              | No       | Latency threshold (ms) for degraded status  |
| `description`      | string              | No       | Monitor description (max 1024 chars)        |
| `recordAssertions` | array               | No       | DNS record assertions                       |
| `openTelemetry`    | OpenTelemetryConfig | No       | OpenTelemetry export configuration          |

---

### Assertions

#### Status Code Assertions

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

#### Body Assertions

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

#### Header Assertions

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

#### DNS Record Assertions

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

**Supported record types:** `A`, `AAAA`, `CNAME`, `MX`, `TXT`

---

### Regions

Monitor from 28 global locations across multiple providers.

```typescript
import { Region } from "@openstatus/sdk-node";

regions: [Region.FLY_AMS, Region.FLY_IAD, Region.KOYEB_FRA];
```

#### Fly.io Regions (18)

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

#### Koyeb Regions (6)

| Enum Value  | Location      |
| ----------- | ------------- |
| `KOYEB_FRA` | Frankfurt     |
| `KOYEB_PAR` | Paris         |
| `KOYEB_SFO` | San Francisco |
| `KOYEB_SIN` | Singapore     |
| `KOYEB_TYO` | Tokyo         |
| `KOYEB_WAS` | Washington    |

#### Railway Regions (4)

| Enum Value                | Location       |
| ------------------------- | -------------- |
| `RAILWAY_US_WEST2`        | US West        |
| `RAILWAY_US_EAST4`        | US East        |
| `RAILWAY_EUROPE_WEST4`    | Europe West    |
| `RAILWAY_ASIA_SOUTHEAST1` | Asia Southeast |

---

### Enums

#### Periodicity

| Value             | Description |
| ----------------- | ----------- |
| `PERIODICITY_30S` | Every 30s   |
| `PERIODICITY_1M`  | Every 1m    |
| `PERIODICITY_5M`  | Every 5m    |
| `PERIODICITY_10M` | Every 10m   |
| `PERIODICITY_30M` | Every 30m   |
| `PERIODICITY_1H`  | Every 1h    |

#### HTTPMethod

| Value                 | Description |
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

#### MonitorStatus

| Value      | Description                |
| ---------- | -------------------------- |
| `ACTIVE`   | Monitor is healthy         |
| `DEGRADED` | Latency threshold exceeded |
| `ERROR`    | Monitor is failing         |

#### TimeRange

| Value            | Description  |
| ---------------- | ------------ |
| `TIME_RANGE_1D`  | Last 1 day   |
| `TIME_RANGE_7D`  | Last 7 days  |
| `TIME_RANGE_14D` | Last 14 days |

#### StatusReportStatus

| Value           | Description                      |
| --------------- | -------------------------------- |
| `INVESTIGATING` | Actively investigating the issue |
| `IDENTIFIED`    | Root cause has been identified   |
| `MONITORING`    | Fix deployed, monitoring         |
| `RESOLVED`      | Issue fully resolved             |

#### OverallStatus

| Value            | Description                 |
| ---------------- | --------------------------- |
| `OPERATIONAL`    | All systems operational     |
| `DEGRADED`       | Performance is degraded     |
| `PARTIAL_OUTAGE` | Some systems are down       |
| `MAJOR_OUTAGE`   | Major systems are down      |
| `MAINTENANCE`    | Scheduled maintenance       |
| `UNKNOWN`        | Status cannot be determined |

#### NotificationProvider

| Value            | Description         |
| ---------------- | ------------------- |
| `DISCORD`        | Discord webhook     |
| `EMAIL`          | Email notification  |
| `GOOGLE_CHAT`    | Google Chat webhook |
| `GRAFANA_ONCALL` | Grafana OnCall      |
| `NTFY`           | Ntfy push service   |
| `PAGERDUTY`      | PagerDuty           |
| `OPSGENIE`       | Opsgenie            |
| `SLACK`          | Slack webhook       |
| `SMS`            | SMS notification    |
| `TELEGRAM`       | Telegram bot        |
| `WEBHOOK`        | Custom webhook      |
| `WHATSAPP`       | WhatsApp            |

#### OpsgenieRegion

| Value | Description |
| ----- | ----------- |
| `US`  | US region   |
| `EU`  | EU region   |

#### PageAccessType

| Value                | Description             |
| -------------------- | ----------------------- |
| `PUBLIC`             | Publicly accessible     |
| `PASSWORD_PROTECTED` | Requires password       |
| `AUTHENTICATED`      | Requires authentication |

#### PageTheme

| Value    | Description         |
| -------- | ------------------- |
| `SYSTEM` | Follow system theme |
| `LIGHT`  | Light theme         |
| `DARK`   | Dark theme          |

#### PageComponentType

| Value     | Description               |
| --------- | ------------------------- |
| `MONITOR` | Linked to a monitor       |
| `STATIC`  | Static component (manual) |

#### NumberComparator

| Value                   | Description           |
| ----------------------- | --------------------- |
| `EQUAL`                 | Equal to target       |
| `NOT_EQUAL`             | Not equal to target   |
| `GREATER_THAN`          | Greater than target   |
| `GREATER_THAN_OR_EQUAL` | Greater than or equal |
| `LESS_THAN`             | Less than target      |
| `LESS_THAN_OR_EQUAL`    | Less than or equal    |

#### StringComparator

| Value                   | Description                 |
| ----------------------- | --------------------------- |
| `CONTAINS`              | Contains target string      |
| `NOT_CONTAINS`          | Does not contain target     |
| `EQUAL`                 | Equal to target             |
| `NOT_EQUAL`             | Not equal to target         |
| `EMPTY`                 | Value is empty              |
| `NOT_EMPTY`             | Value is not empty          |
| `GREATER_THAN`          | Lexicographically greater   |
| `GREATER_THAN_OR_EQUAL` | Lexicographically >= target |
| `LESS_THAN`             | Lexicographically less      |
| `LESS_THAN_OR_EQUAL`    | Lexicographically <= target |

#### RecordComparator

| Value          | Description             |
| -------------- | ----------------------- |
| `EQUAL`        | Equal to target         |
| `NOT_EQUAL`    | Not equal to target     |
| `CONTAINS`     | Contains target string  |
| `NOT_CONTAINS` | Does not contain target |

---

## Error Handling

The SDK uses Connect RPC. Errors include a `code` and `message`:

```typescript
import { ConnectError } from "@connectrpc/connect";

try {
  await client.monitor.v1.MonitorService.deleteMonitor({ id: "invalid" });
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

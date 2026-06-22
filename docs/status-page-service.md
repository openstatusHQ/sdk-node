[← Back to index](./index.md)

# Status Page Service

Manage status pages, components, component groups, and subscribers. The Status
Page Service provides 17 RPC methods.

## Status Page CRUD

### Create Status Page

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

### Get Status Page

```typescript
const { statusPage } = await client.statusPage.v1.StatusPageService
  .getStatusPage({ id: "page_123" });
```

### List Status Pages

```typescript
const { statusPages, totalSize } = await client.statusPage.v1.StatusPageService
  .listStatusPages({ limit: 10, offset: 0 });

console.log(`Found ${totalSize} status pages`);
```

### Update Status Page

```typescript
const { statusPage } = await client.statusPage.v1.StatusPageService
  .updateStatusPage({
    id: "page_123",
    title: "Updated Title",
    description: "Updated description",
  });
```

### Delete Status Page

```typescript
const { success } = await client.statusPage.v1.StatusPageService
  .deleteStatusPage({ id: "page_123" });
```

## Components

Components represent individual services on a status page. They can be linked to
a monitor (automatically reflects monitor status) or static (manually managed).

### Add Monitor Component

```typescript
const { component } = await client.statusPage.v1.StatusPageService
  .addMonitorComponent({
    pageId: "page_123",
    monitorId: "123457",
    name: "API Server",
    description: "Main API endpoint",
    order: 1,
    groupId: "group_789",
  });
```

### Add Static Component

```typescript
const { component } = await client.statusPage.v1.StatusPageService
  .addStaticComponent({
    pageId: "page_123",
    name: "Third-party Service",
    description: "External dependency",
    order: 2,
  });
```

### Update Component

```typescript
const { component } = await client.statusPage.v1.StatusPageService
  .updateComponent({
    id: "comp_123",
    name: "Updated Component Name",
    description: "Updated description",
    order: 3,
    groupId: "group_789",
    groupOrder: 1,
  });
```

### Remove Component

```typescript
const { success } = await client.statusPage.v1.StatusPageService
  .removeComponent({ id: "comp_123" });
```

## Component Groups

Group related components together on a status page.

### Create Component Group

```typescript
const { group } = await client.statusPage.v1.StatusPageService
  .createComponentGroup({
    pageId: "page_123",
    name: "Core Services",
  });
```

### Update Component Group

```typescript
const { group } = await client.statusPage.v1.StatusPageService
  .updateComponentGroup({
    id: "group_123",
    name: "Updated Group Name",
  });
```

### Delete Component Group

```typescript
const { success } = await client.statusPage.v1.StatusPageService
  .deleteComponentGroup({ id: "group_123" });
```

## Subscribers

Manage email and webhook subscriptions to status page updates.

### Subscribe to Page

Self-signup with double opt-in: a verification email is sent and the
subscription activates only after the recipient confirms.

```typescript
const { subscriber } = await client.statusPage.v1.StatusPageService
  .subscribeToPage({
    pageId: "page_123",
    email: "user@example.com",
  });
```

### Create Page Subscription

Operator-added subscriber (email or webhook) with no verification flow — use it
when consent is established out-of-band. Set exactly one channel via the
`channel` oneof. Webhook payload flavor (Slack / Discord / generic) is
auto-detected from the URL.

```typescript
// Email channel
const { subscriber } = await client.statusPage.v1.StatusPageService
  .createPageSubscription({
    pageId: "page_123",
    name: "Partner #incidents", // optional label
    componentIds: ["comp_456"], // optional scope, empty = entire page
    channel: { case: "emailChannel", value: { email: "partner@example.com" } },
  });

// Webhook channel
const { subscriber: webhookSub } = await client.statusPage.v1.StatusPageService
  .createPageSubscription({
    pageId: "page_123",
    channel: {
      case: "webhookChannel",
      value: {
        webhookUrl: "https://hooks.slack.com/services/...",
        headers: [{ key: "Authorization", value: "Bearer token" }], // optional
      },
    },
  });
```

### Unsubscribe from Page

Unsubscribe by email or subscriber ID using the `identifier` oneof:

```typescript
// By email
const { success } = await client.statusPage.v1.StatusPageService
  .unsubscribeFromPage({
    pageId: "page_123",
    identifier: { case: "email", value: "user@example.com" },
  });

// By subscriber ID
const { success: success2 } = await client.statusPage.v1.StatusPageService
  .unsubscribeFromPage({
    pageId: "page_123",
    identifier: { case: "id", value: "sub_456" },
  });
```

### List Subscribers

```typescript
const { subscribers, totalSize } = await client.statusPage.v1.StatusPageService
  .listSubscribers({
    pageId: "page_123",
    limit: 50,
    offset: 0,
    includeUnsubscribed: false,
  });
```

## Get Status Page Content

Get the full content of a status page including components, groups, active
status reports, and maintenance windows. Identify the page by ID or slug.

```typescript
const content = await client.statusPage.v1.StatusPageService
  .getStatusPageContent({
    identifier: { case: "slug", value: "my-service" },
  });

console.log(`Page: ${content.statusPage?.title}`);
console.log(`Components: ${content.components.length}`);
console.log(`Groups: ${content.groups.length}`);
console.log(`Active reports: ${content.statusReports.length}`);
console.log(`Maintenances: ${content.maintenances.length}`);
```

## Get Overall Status

Get the aggregated status of a status page and per-component statuses.

```typescript
import { createOpenStatusClient, OverallStatus } from "@openstatus/sdk-node";

const client = createOpenStatusClient({
  apiKey: process.env.OPENSTATUS_API_KEY,
});

const { overallStatus, componentStatuses } = await client.statusPage.v1
  .StatusPageService.getOverallStatus({
    identifier: { case: "id", value: "page_123" },
  });

console.log(`Overall: ${OverallStatus[overallStatus]}`);
for (const { componentId, status } of componentStatuses) {
  console.log(`  ${componentId}: ${OverallStatus[status]}`);
}
```

## Get Page Component Daily Summary

Per-component daily status buckets (`ok`/`degraded`/`error`/`count` plus a
resolved `status`) merged with the incident, maintenance, and status-report
timeline over the last N days (max 45). This is the single source of truth for
rendering status bars and uptime calendars. Identify the page by ID
(authenticated) or slug (public, requires a published `PUBLIC` page).

```typescript
import {
  ComponentDayStatus,
  createOpenStatusClient,
} from "@openstatus/sdk-node";

const client = createOpenStatusClient({
  apiKey: process.env.OPENSTATUS_API_KEY,
});

const { components } = await client.statusPage.v1.StatusPageService
  .getPageComponentDailySummary({
    identifier: { case: "id", value: "page_123" },
    componentIds: [], // optional, empty = all components
    days: 45, // optional, 1–45, defaults to 45
  });

for (const component of components) {
  console.log(`${component.name} (${component.componentId})`);
  for (const bucket of component.buckets) {
    console.log(
      `  ${bucket.day}: ${bucket.ok}/${bucket.count} ok, ` +
        `${bucket.degraded} degraded, ${bucket.error} error ` +
        `[${ComponentDayStatus[bucket.status]}]`,
    );
  }
  for (const event of component.events) {
    console.log(
      `  event: ${event.name} (${event.from} → ${event.to ?? "ongoing"})`,
    );
  }
}
```

Each `PageComponentDailySummary` has `componentId`, `type`
(`PageComponentType`), optional `monitorId`, `name`, `buckets[]`, and
`events[]`. Each `ComponentDayBucket` has `day` (RFC 3339, UTC midnight), the
`bigint` counts `count`/`ok`/`degraded`/`error`, a resolved `status`
(`ComponentDayStatus`), and an optional `impact` (`PageComponentImpact`). Each
`ComponentEvent` has `id`, `name`, `type` (`ComponentEventType`), `status`
(`ComponentEventStatus`), `from`, optional `to`, and optional `impact`.

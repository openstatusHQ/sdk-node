import { createOpenStatusClient } from "@openstatus/sdk-node";

const apiKey = Deno.env.get("OPENSTATUS_API_KEY");

const client = createOpenStatusClient({
  apiKey: apiKey,
});

const monitors = await client.monitor.v1.MonitorService.listMonitors({});

console.log(monitors);

const notification = await client.notification.v1.NotificationService
  .listNotifications({});

console.log(notification);

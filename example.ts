import { openstatus } from "./src/mod.ts";

console.log("OpenStatus SDK Node.js");
const heatlh = await openstatus.health.v1.HealthService.check({});

console.log("Health status:", heatlh.status);

const monitors = await openstatus.monitor.v1.MonitorService.listMonitors({}, {
  headers: { "x-openstatus-key": `Bearer ${process.env.OPENSTATUS_API_KEY}` },
});

console.log("Monitors:", monitors);

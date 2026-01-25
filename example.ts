/**
 * Example usage of the OpenStatus Node.js SDK.
 *
 * Run with: deno task dev
 */
import { openstatus, type HTTPMonitor } from "./src/mod.ts";

async function main(): Promise<void> {
  console.log("OpenStatus SDK Example\n");

  // 1. Health check (no authentication required)
  console.log("1. Checking API health...");
  const health = await openstatus.health.v1.HealthService.check({});
  console.log(`   Status: ${health.status}\n`);

  // 2. List monitors (requires authentication)
  const apiKey = process.env.OPENSTATUS_API_KEY;
  if (!apiKey) {
    console.log("2. Skipping monitor operations (OPENSTATUS_API_KEY not set)");
    console.log("   Set OPENSTATUS_API_KEY environment variable to test monitor operations.");
    return;
  }

  const headers = { "x-openstatus-key": `Bearer ${apiKey}` };

  console.log("2. Listing monitors...");
  const { httpMonitors, tcpMonitors, dnsMonitors, totalSize } =
    await openstatus.monitor.v1.MonitorService.listMonitors({}, { headers });

  console.log(`   Found ${totalSize} monitors:`);
  console.log(`   - HTTP: ${httpMonitors.length}`);
  console.log(`   - TCP: ${tcpMonitors.length}`);
  console.log(`   - DNS: ${dnsMonitors.length}`);

  // 3. Display HTTP monitors
  if (httpMonitors.length > 0) {
    console.log("\n3. HTTP Monitors:");
    httpMonitors.forEach((monitor: HTTPMonitor) => {
      console.log(`   - ${monitor.name}: ${monitor.url} (${monitor.active ? "active" : "paused"})`);
    });
  }
}

main().catch(console.error);

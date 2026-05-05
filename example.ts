/**
 * Example usage of the OpenStatus Node.js SDK.
 *
 * Run with: deno task dev
 */
import {
  type HTTPMonitor,
  HTTPResponseLogRequestStatus,
  HTTPResponseLogTrigger,
  openstatus,
  Region,
} from "./src/mod.ts";

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
    console.log(
      "   Set OPENSTATUS_API_KEY environment variable to test monitor operations.",
    );
    return;
  }

  const headers = { "x-openstatus-key": `${apiKey}` };

  console.log("2. Listing monitors...");
  const { httpMonitors, tcpMonitors, dnsMonitors, totalSize } = await openstatus
    .monitor.v1.MonitorService.listMonitors({}, { headers });

  console.log(`   Found ${totalSize} monitors:`);
  console.log(`   - HTTP: ${httpMonitors.length}`);
  console.log(`   - TCP: ${tcpMonitors.length}`);
  console.log(`   - DNS: ${dnsMonitors.length}`);

  // 3. Display HTTP monitors
  if (httpMonitors.length > 0) {
    console.log("\n3. HTTP Monitors:");
    httpMonitors.forEach((monitor: HTTPMonitor) => {
      console.log(
        `   - ${monitor.name}: ${monitor.url} (${
          monitor.active ? "active" : "paused"
        })`,
      );
    });
  }

  console.log("4. Listing HTTP response logs for monitor...");
  const { logs, pagination } = await openstatus.monitor.v1.MonitorService
    .listMonitorHTTPResponseLogs({ id: "ID", limit: 10 }, { headers });

  console.log(`   Found ${logs.length} logs (hasMore=${pagination?.hasMore})`);
  for (const log of logs) {
    const ts = new Date(Number(log.timestamp)).toISOString();
    const status = log.statusCode ?? "—";
    const region = Region[log.region] ?? log.region;
    const requestStatus = HTTPResponseLogRequestStatus[log.requestStatus] ??
      log.requestStatus;
    const trigger = HTTPResponseLogTrigger[log.trigger] ?? log.trigger;
    console.log(
      `   ${ts}  ${status}  ${log.latency}ms  ${region}  ` +
        `${requestStatus}  ${trigger}  id=${log.id ?? "—"}`,
    );
    if (log.timing) {
      console.log(
        `       timing: dns=${log.timing.dns}ms connect=${log.timing.connect}ms ` +
          `tls=${log.timing.tls}ms ttfb=${log.timing.ttfb}ms ` +
          `transfer=${log.timing.transfer}ms`,
      );
    }
  }

  // 5. Fetch full detail for the most recent log
  const firstLog = logs[0];
  if (firstLog?.id) {
    console.log(`\n5. Getting log detail for ${firstLog.id}...`);
    const { log: detail } = await openstatus.monitor.v1.MonitorService
      .getMonitorHTTPResponseLog(
        { id: "9167", logId: firstLog.id },
        { headers },
      );

    if (detail) {
      console.log(`   URL:        ${detail.url}`);
      console.log(`   Errored:    ${detail.error}`);
      console.log(`   Message:    ${detail.message ?? "—"}`);
      console.log(`   Status:     ${detail.log?.statusCode ?? "—"}`);
      console.log(`   Assertions: ${detail.assertions ?? "—"}`);

      const headerEntries = Object.entries(detail.headers);
      if (headerEntries.length > 0) {
        console.log(`   Headers:`);
        for (const [key, value] of headerEntries) {
          console.log(`     ${key}: ${value}`);
        }
      }
    }
  }
}

main().catch(console.error);

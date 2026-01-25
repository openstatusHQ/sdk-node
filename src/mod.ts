/**
 * @module
 *
 * Official Node.js SDK for OpenStatus - the open-source monitoring platform.
 *
 * @example Basic usage
 * ```typescript
 * import { openstatus } from "@openstatus/node-sdk";
 *
 * const headers = {
 *   "x-openstatus-key": `Bearer ${process.env.OPENSTATUS_API_KEY}`,
 * };
 *
 * // List all monitors
 * const { httpMonitors, tcpMonitors, dnsMonitors } =
 *   await openstatus.monitor.v1.MonitorService.listMonitors({}, { headers });
 *
 * // Create an HTTP monitor
 * const { monitor } = await openstatus.monitor.v1.MonitorService.createHTTPMonitor({
 *   name: "My API",
 *   url: "https://api.example.com/health",
 *   periodicity: "1m",
 *   regions: ["ams", "iad", "syd"],
 *   active: true,
 * }, { headers });
 * ```
 */

import type { Client } from "@connectrpc/connect";
import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { MonitorService } from "./gen/openstatus/monitor/v1/service_pb.ts";
import { HealthService } from "./gen/openstatus/health/v1/health_pb.ts";

// Re-export monitor types
export type {
  Headers,
  HTTPMonitor,
  OpenTelemetryConfig,
} from "./gen/openstatus/monitor/v1/http_monitor_pb.ts";

export type { TCPMonitor } from "./gen/openstatus/monitor/v1/tcp_monitor_pb.ts";

export type { DNSMonitor } from "./gen/openstatus/monitor/v1/dns_monitor_pb.ts";

// Re-export assertion types
export type {
  BodyAssertion,
  HeaderAssertion,
  RecordAssertion,
  StatusCodeAssertion,
} from "./gen/openstatus/monitor/v1/assertions_pb.ts";

// Re-export enums
export {
  HTTPMethod,
  Periodicity,
  Region,
} from "./gen/openstatus/monitor/v1/http_monitor_pb.ts";

export { MonitorStatus } from "./gen/openstatus/monitor/v1/monitor_pb.ts";

// Re-export request/response types
export type {
  CreateDNSMonitorRequest,
  CreateDNSMonitorResponse,
  CreateHTTPMonitorRequest,
  CreateHTTPMonitorResponse,
  CreateTCPMonitorRequest,
  CreateTCPMonitorResponse,
  DeleteMonitorRequest,
  DeleteMonitorResponse,
  ListMonitorsRequest,
  ListMonitorsResponse,
  TriggerMonitorRequest,
  TriggerMonitorResponse,
} from "./gen/openstatus/monitor/v1/service_pb.ts";

// Re-export health types
export type {
  CheckRequest,
  CheckResponse,
} from "./gen/openstatus/health/v1/health_pb.ts";

export { CheckResponse_ServingStatus as ServingStatus } from "./gen/openstatus/health/v1/health_pb.ts";

/**
 * Default OpenStatus API URL.
 */
const DEFAULT_API_URL = "https://api.openstatus.dev";

/**
 * Creates a Connect RPC transport configured for the OpenStatus API.
 */
const transport = createConnectTransport({
  baseUrl: process.env.OPENSTATUS_API_URL ?? DEFAULT_API_URL,
  httpVersion: "2",
});

/**
 * OpenStatus API client interface.
 *
 * Provides access to Monitor and Health services.
 */
export interface OpenStatusClient {
  /**
   * Monitor service namespace (v1).
   */
  monitor: {
    v1: {
      /**
       * MonitorService provides CRUD and operational commands for monitors.
       *
       * Methods:
       * - `createHTTPMonitor` - Create a new HTTP monitor
       * - `createTCPMonitor` - Create a new TCP monitor
       * - `createDNSMonitor` - Create a new DNS monitor
       * - `listMonitors` - List all monitors
       * - `triggerMonitor` - Trigger an immediate check
       * - `deleteMonitor` - Delete a monitor
       */
      MonitorService: Client<typeof MonitorService>;
    };
  };
  /**
   * Health service namespace (v1).
   */
  health: {
    v1: {
      /**
       * HealthService provides health check endpoints.
       *
       * Methods:
       * - `check` - Check API health status
       */
      HealthService: Client<typeof HealthService>;
    };
  };
}

/**
 * OpenStatus SDK client.
 *
 * Provides access to the OpenStatus API for managing monitors and checking service health.
 *
 * @example
 * ```typescript
 * import { openstatus } from "@openstatus/node-sdk";
 *
 * // Check API health (no auth required)
 * const { status } = await openstatus.health.v1.HealthService.check({});
 *
 * // Create a monitor (auth required)
 * const headers = { "x-openstatus-key": `Bearer ${process.env.OPENSTATUS_API_KEY}` };
 * const { monitor } = await openstatus.monitor.v1.MonitorService.createHTTPMonitor({
 *   name: "My Website",
 *   url: "https://example.com",
 *   periodicity: "1m",
 *   active: true,
 * }, { headers });
 * ```
 */
export const openstatus: OpenStatusClient = {
  monitor: {
    v1: {
      MonitorService: createClient(MonitorService, transport),
    },
  },
  health: {
    v1: {
      HealthService: createClient(HealthService, transport),
    },
  },
};

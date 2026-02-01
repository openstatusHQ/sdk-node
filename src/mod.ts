/**
 * @module
 *
 * Official Node.js SDK for OpenStatus - the open-source monitoring platform.
 *
 * @example Basic usage
 * ```typescript
 * import { openstatus, Periodicity, Region } from "@openstatus/sdk-node";
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
 *   monitor: {
 *     name: "My API",
 *     url: "https://api.example.com/health",
 *     periodicity: Periodicity.PERIODICITY_1M,
 *     regions: [Region.FLY_AMS, Region.FLY_IAD, Region.FLY_SYD],
 *     active: true,
 *   },
 * }, { headers });
 * ```
 */

import type { Client } from "@connectrpc/connect";
import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { MonitorService } from "./gen/openstatus/monitor/v1/service_pb.ts";
import { HealthService } from "./gen/openstatus/health/v1/health_pb.ts";
import { StatusReportService } from "./gen/openstatus/status_report/v1/service_pb.ts";
import { StatusPageService } from "./gen/openstatus/status_page/v1/service_pb.ts";
import { MaintenanceService } from "./gen/openstatus/maintenance/v1/service_pb.ts";

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

// Re-export assertion comparator enums
export {
  NumberComparator,
  RecordComparator,
  StringComparator,
} from "./gen/openstatus/monitor/v1/assertions_pb.ts";

// Re-export enums
export { HTTPMethod } from "./gen/openstatus/monitor/v1/http_monitor_pb.ts";

export { Periodicity, Region } from "./gen/openstatus/monitor/v1/monitor_pb.ts";

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
  GetMonitorStatusRequest,
  GetMonitorStatusResponse,
  GetMonitorSummaryRequest,
  GetMonitorSummaryResponse,
  ListMonitorsRequest,
  ListMonitorsResponse,
  RegionStatus,
  TriggerMonitorRequest,
  TriggerMonitorResponse,
  UpdateDNSMonitorRequest,
  UpdateDNSMonitorResponse,
  UpdateHTTPMonitorRequest,
  UpdateHTTPMonitorResponse,
  UpdateTCPMonitorRequest,
  UpdateTCPMonitorResponse,
} from "./gen/openstatus/monitor/v1/service_pb.ts";

export { TimeRange } from "./gen/openstatus/monitor/v1/service_pb.ts";

// Re-export health types
export type {
  CheckRequest,
  CheckResponse,
} from "./gen/openstatus/health/v1/health_pb.ts";

export { CheckResponse_ServingStatus as ServingStatus } from "./gen/openstatus/health/v1/health_pb.ts";

// Re-export status report types
export type {
  StatusReport,
  StatusReportSummary,
  StatusReportUpdate,
} from "./gen/openstatus/status_report/v1/status_report_pb.ts";

export { StatusReportStatus } from "./gen/openstatus/status_report/v1/status_report_pb.ts";

// Re-export status report request/response types
export type {
  AddStatusReportUpdateRequest,
  AddStatusReportUpdateResponse,
  CreateStatusReportRequest,
  CreateStatusReportResponse,
  DeleteStatusReportRequest,
  DeleteStatusReportResponse,
  GetStatusReportRequest,
  GetStatusReportResponse,
  ListStatusReportsRequest,
  ListStatusReportsResponse,
  UpdateStatusReportRequest,
  UpdateStatusReportResponse,
} from "./gen/openstatus/status_report/v1/service_pb.ts";

// Re-export status page types
export type {
  StatusPage,
  StatusPageSummary,
} from "./gen/openstatus/status_page/v1/status_page_pb.ts";

export {
  OverallStatus,
  PageAccessType,
  PageTheme,
} from "./gen/openstatus/status_page/v1/status_page_pb.ts";

// Re-export page component types
export type {
  PageComponent,
  PageComponentGroup,
} from "./gen/openstatus/status_page/v1/page_component_pb.ts";

export { PageComponentType } from "./gen/openstatus/status_page/v1/page_component_pb.ts";

// Re-export page subscriber types
export type { PageSubscriber } from "./gen/openstatus/status_page/v1/page_subscriber_pb.ts";

// Re-export status page request/response types
export type {
  AddMonitorComponentRequest,
  AddMonitorComponentResponse,
  AddStaticComponentRequest,
  AddStaticComponentResponse,
  ComponentStatus,
  CreateComponentGroupRequest,
  CreateComponentGroupResponse,
  CreateStatusPageRequest,
  CreateStatusPageResponse,
  DeleteComponentGroupRequest,
  DeleteComponentGroupResponse,
  DeleteStatusPageRequest,
  DeleteStatusPageResponse,
  GetOverallStatusRequest,
  GetOverallStatusResponse,
  GetStatusPageContentRequest,
  GetStatusPageContentResponse,
  GetStatusPageRequest,
  GetStatusPageResponse,
  ListStatusPagesRequest,
  ListStatusPagesResponse,
  ListSubscribersRequest,
  ListSubscribersResponse,
  RemoveComponentRequest,
  RemoveComponentResponse,
  SubscribeToPageRequest,
  SubscribeToPageResponse,
  UnsubscribeFromPageRequest,
  UnsubscribeFromPageResponse,
  UpdateComponentGroupRequest,
  UpdateComponentGroupResponse,
  UpdateComponentRequest,
  UpdateComponentResponse,
  UpdateStatusPageRequest,
  UpdateStatusPageResponse,
} from "./gen/openstatus/status_page/v1/service_pb.ts";

// Re-export maintenance types
export type {
  Maintenance,
  MaintenanceSummary,
} from "./gen/openstatus/maintenance/v1/maintenance_pb.ts";

// Re-export maintenance request/response types
export type {
  CreateMaintenanceRequest,
  CreateMaintenanceResponse,
  DeleteMaintenanceRequest,
  DeleteMaintenanceResponse,
  GetMaintenanceRequest,
  GetMaintenanceResponse,
  ListMaintenancesRequest,
  ListMaintenancesResponse,
  UpdateMaintenanceRequest,
  UpdateMaintenanceResponse,
} from "./gen/openstatus/maintenance/v1/service_pb.ts";

/**
 * Default OpenStatus API URL.
 */
const DEFAULT_API_URL = "https://api.openstatus.dev/rpc";

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
       * - `updateHTTPMonitor` - Update an existing HTTP monitor
       * - `updateTCPMonitor` - Update an existing TCP monitor
       * - `updateDNSMonitor` - Update an existing DNS monitor
       * - `listMonitors` - List all monitors
       * - `triggerMonitor` - Trigger an immediate check
       * - `deleteMonitor` - Delete a monitor
       * - `getMonitorStatus` - Get status of all regions for a monitor
       * - `getMonitorSummary` - Get aggregated metrics for a monitor
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
  /**
   * Status report service namespace (v1).
   */
  statusReport: {
    v1: {
      /**
       * StatusReportService provides CRUD operations for status reports.
       *
       * Methods:
       * - `createStatusReport` - Create a new status report
       * - `getStatusReport` - Get a status report by ID
       * - `listStatusReports` - List all status reports
       * - `updateStatusReport` - Update a status report
       * - `deleteStatusReport` - Delete a status report
       * - `addStatusReportUpdate` - Add an update to a status report
       */
      StatusReportService: Client<typeof StatusReportService>;
    };
  };
  /**
   * Status page service namespace (v1).
   */
  statusPage: {
    v1: {
      /**
       * StatusPageService provides CRUD and management operations for status pages.
       *
       * Methods:
       * - `createStatusPage` - Create a new status page
       * - `getStatusPage` - Get a status page by ID
       * - `listStatusPages` - List all status pages
       * - `updateStatusPage` - Update a status page
       * - `deleteStatusPage` - Delete a status page
       * - `addMonitorComponent` - Add a monitor-based component
       * - `addStaticComponent` - Add a static component
       * - `removeComponent` - Remove a component
       * - `updateComponent` - Update a component
       * - `createComponentGroup` - Create a component group
       * - `deleteComponentGroup` - Delete a component group
       * - `updateComponentGroup` - Update a component group
       * - `subscribeToPage` - Subscribe an email to a status page
       * - `unsubscribeFromPage` - Unsubscribe from a status page
       * - `listSubscribers` - List all subscribers
       * - `getStatusPageContent` - Get full status page content
       * - `getOverallStatus` - Get aggregated status
       */
      StatusPageService: Client<typeof StatusPageService>;
    };
  };
  /**
   * Maintenance service namespace (v1).
   */
  maintenance: {
    v1: {
      /**
       * MaintenanceService provides CRUD operations for maintenance windows.
       *
       * Methods:
       * - `createMaintenance` - Create a new maintenance window
       * - `getMaintenance` - Get a maintenance window by ID
       * - `listMaintenances` - List all maintenance windows
       * - `updateMaintenance` - Update a maintenance window
       * - `deleteMaintenance` - Delete a maintenance window
       */
      MaintenanceService: Client<typeof MaintenanceService>;
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
 * import { openstatus, Periodicity } from "@openstatus/sdk-node";
 *
 * // Check API health (no auth required)
 * const { status } = await openstatus.health.v1.HealthService.check({});
 *
 * // Create a monitor (auth required)
 * const headers = { "x-openstatus-key": `Bearer ${process.env.OPENSTATUS_API_KEY}` };
 * const { monitor } = await openstatus.monitor.v1.MonitorService.createHTTPMonitor({
 *   monitor: {
 *     name: "My Website",
 *     url: "https://example.com",
 *     periodicity: Periodicity.PERIODICITY_1M,
 *     active: true,
 *   },
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
  statusReport: {
    v1: {
      StatusReportService: createClient(StatusReportService, transport),
    },
  },
  statusPage: {
    v1: {
      StatusPageService: createClient(StatusPageService, transport),
    },
  },
  maintenance: {
    v1: {
      MaintenanceService: createClient(MaintenanceService, transport),
    },
  },
};

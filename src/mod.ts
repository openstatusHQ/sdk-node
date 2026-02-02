/**
 * @module
 *
 * Official Node.js SDK for OpenStatus - the open-source monitoring platform.
 *
 * @example Basic usage (recommended)
 * ```typescript
 * import { createOpenStatusClient, Periodicity, Region } from "@openstatus/sdk-node";
 *
 * // Create a client with your API key
 * const client = createOpenStatusClient({
 *   apiKey: process.env.OPENSTATUS_API_KEY,
 * });
 *
 * // List all monitors - no need to pass headers
 * const { httpMonitors, tcpMonitors, dnsMonitors } =
 *   await client.monitor.v1.MonitorService.listMonitors({});
 *
 * // Create an HTTP monitor
 * const { monitor } = await client.monitor.v1.MonitorService.createHTTPMonitor({
 *   monitor: {
 *     name: "My API",
 *     url: "https://api.example.com/health",
 *     periodicity: Periodicity.PERIODICITY_1M,
 *     regions: [Region.FLY_AMS, Region.FLY_IAD, Region.FLY_SYD],
 *     active: true,
 *   },
 * });
 * ```
 *
 * @example Alternative: Manual headers
 * ```typescript
 * import { openstatus, Periodicity } from "@openstatus/sdk-node";
 *
 * const headers = { "x-openstatus-key": `Bearer ${process.env.OPENSTATUS_API_KEY}` };
 * const { monitor } = await openstatus.monitor.v1.MonitorService.createHTTPMonitor({
 *   monitor: { name: "My API", url: "https://api.example.com", periodicity: Periodicity.PERIODICITY_1M, active: true },
 * }, { headers });
 * ```
 */

import type { Client, Interceptor } from "@connectrpc/connect";
import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { MonitorService } from "./gen/openstatus/monitor/v1/service_pb.ts";
import { HealthService } from "./gen/openstatus/health/v1/health_pb.ts";
import { StatusReportService } from "./gen/openstatus/status_report/v1/service_pb.ts";
import { StatusPageService } from "./gen/openstatus/status_page/v1/service_pb.ts";
import { MaintenanceService } from "./gen/openstatus/maintenance/v1/service_pb.ts";
import { NotificationService } from "./gen/openstatus/notification/v1/service_pb.ts";

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

// Re-export notification types
export type {
  Notification,
  NotificationSummary,
} from "./gen/openstatus/notification/v1/notification_pb.ts";

// Re-export notification provider types and data
export type {
  DiscordData,
  EmailData,
  GoogleChatData,
  GrafanaOncallData,
  NotificationData,
  NtfyData,
  OpsgenieData,
  PagerDutyData,
  SlackData,
  SmsData,
  TelegramData,
  WebhookData,
  WebhookHeader,
  WhatsappData,
} from "./gen/openstatus/notification/v1/providers_pb.ts";

export {
  NotificationProvider,
  OpsgenieRegion,
} from "./gen/openstatus/notification/v1/providers_pb.ts";

// Re-export notification request/response types
export type {
  CheckNotificationLimitRequest,
  CheckNotificationLimitResponse,
  CreateNotificationRequest,
  CreateNotificationResponse,
  DeleteNotificationRequest,
  DeleteNotificationResponse,
  GetNotificationRequest,
  GetNotificationResponse,
  ListNotificationsRequest,
  ListNotificationsResponse,
  SendTestNotificationRequest,
  SendTestNotificationResponse,
  UpdateNotificationRequest,
  UpdateNotificationResponse,
} from "./gen/openstatus/notification/v1/service_pb.ts";

/**
 * Default OpenStatus API URL.
 */
const DEFAULT_API_URL = "https://api.openstatus.dev/rpc";

/**
 * Configuration options for creating an OpenStatus client.
 */
export interface OpenStatusClientOptions {
  /**
   * Your OpenStatus API key.
   * If provided, it will be automatically included in all requests.
   */
  apiKey?: string;
  /**
   * Custom API base URL. Defaults to the OpenStatus production API.
   */
  baseUrl?: string;
}

/**
 * Creates an interceptor that adds the API key header to all requests.
 */
function createAuthInterceptor(apiKey: string): Interceptor {
  return (next) => (req) => {
    req.header.set("x-openstatus-key", `${apiKey}`);
    return next(req);
  };
}

/**
 * Creates a Connect RPC transport configured for the OpenStatus API.
 */
function createTransport(options?: OpenStatusClientOptions) {
  const interceptors: Interceptor[] = [];

  if (options?.apiKey) {
    interceptors.push(createAuthInterceptor(options.apiKey));
  }

  return createConnectTransport({
    baseUrl: options?.baseUrl ?? process.env.OPENSTATUS_API_URL ??
      DEFAULT_API_URL,
    httpVersion: "2",
    interceptors,
  });
}

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
  /**
   * Notification service namespace (v1).
   */
  notification: {
    v1: {
      /**
       * NotificationService provides CRUD operations for notification channels.
       *
       * Methods:
       * - `createNotification` - Create a new notification channel
       * - `getNotification` - Get a notification channel by ID
       * - `listNotifications` - List all notification channels
       * - `updateNotification` - Update a notification channel
       * - `deleteNotification` - Delete a notification channel
       * - `sendTestNotification` - Send a test notification
       * - `checkNotificationLimit` - Check notification limits
       */
      NotificationService: Client<typeof NotificationService>;
    };
  };
}

/**
 * Creates a configured OpenStatus client with optional API key authentication.
 *
 * Use this factory function to create a client that automatically includes
 * your API key in all requests, eliminating the need to pass headers manually.
 *
 * @example
 * ```typescript
 * import { createOpenStatusClient, Periodicity, Region } from "@openstatus/sdk-node";
 *
 * // Create a configured client
 * const client = createOpenStatusClient({
 *   apiKey: process.env.OPENSTATUS_API_KEY,
 * });
 *
 * // No need to pass headers on each call
 * const { httpMonitors } = await client.monitor.v1.MonitorService.listMonitors({});
 *
 * const { monitor } = await client.monitor.v1.MonitorService.createHTTPMonitor({
 *   monitor: {
 *     name: "My API",
 *     url: "https://api.example.com/health",
 *     periodicity: Periodicity.PERIODICITY_1M,
 *     regions: [Region.FLY_AMS, Region.FLY_IAD],
 *     active: true,
 *   },
 * });
 * ```
 */
export function createOpenStatusClient(
  options?: OpenStatusClientOptions,
): OpenStatusClient {
  const transport = createTransport(options);

  return {
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
    notification: {
      v1: {
        NotificationService: createClient(NotificationService, transport),
      },
    },
  };
}

/**
 * Default OpenStatus SDK client (without pre-configured authentication).
 *
 * For authenticated requests, either:
 * 1. Use `createOpenStatusClient({ apiKey })` to create a pre-configured client (recommended)
 * 2. Pass headers manually on each call
 *
 * @example Using createOpenStatusClient (recommended)
 * ```typescript
 * import { createOpenStatusClient, Periodicity } from "@openstatus/sdk-node";
 *
 * const client = createOpenStatusClient({ apiKey: process.env.OPENSTATUS_API_KEY });
 * const { monitor } = await client.monitor.v1.MonitorService.createHTTPMonitor({
 *   monitor: { name: "My Website", url: "https://example.com", periodicity: Periodicity.PERIODICITY_1M, active: true },
 * });
 * ```
 *
 * @example Using default client with manual headers
 * ```typescript
 * import { openstatus, Periodicity } from "@openstatus/sdk-node";
 *
 * const headers = { "x-openstatus-key": `Bearer ${process.env.OPENSTATUS_API_KEY}` };
 * const { monitor } = await openstatus.monitor.v1.MonitorService.createHTTPMonitor({
 *   monitor: { name: "My Website", url: "https://example.com", periodicity: Periodicity.PERIODICITY_1M, active: true },
 * }, { headers });
 * ```
 */
export const openstatus: OpenStatusClient = createOpenStatusClient();

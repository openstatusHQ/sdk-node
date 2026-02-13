# OpenStatus Node.js SDK Documentation

Official documentation for [`@openstatus/sdk-node`](https://www.npmjs.com/package/@openstatus/sdk-node) — the TypeScript SDK for the [OpenStatus](https://openstatus.dev) monitoring platform.

---

## Table of Contents

- [Getting Started](./getting-started.md)
  - Installation
  - Quick Start
  - Runtime Support
  - Full Workflow Example
- [Authentication](./authentication.md)
  - createOpenStatusClient
  - Manual Headers
  - Environment Variables
  - Custom Base URL
- [Monitor Service](./monitor-service.md)
  - HTTP Monitors
  - TCP Monitors
  - DNS Monitors
  - List Monitors
  - Get Monitor
  - Trigger Monitor
  - Delete Monitor
  - Get Monitor Status
  - Get Monitor Summary
- [Status Page Service](./status-page-service.md)
  - Status Page CRUD
  - Components
  - Component Groups
  - Subscribers
  - Get Status Page Content
  - Get Overall Status
- [Status Report Service](./status-report-service.md)
  - Create Status Report
  - Add Status Report Update
  - List Status Reports
  - Get / Update / Delete Status Reports
- [Maintenance Service](./maintenance-service.md)
  - Create Maintenance Window
  - List Maintenances
  - Get / Update / Delete Maintenance Windows
- [Notification Service](./notification-service.md)
  - Create Notification
  - Provider Configurations
  - Send Test Notification
  - Check Notification Limits
  - List / Get / Update / Delete Notifications
- [Health Service](./health-service.md)
  - Health Check
- [Reference](./reference.md)
  - Enums
  - Regions
  - Assertions
  - TypeScript Type Exports
- [Error Handling](./error-handling.md)
  - ConnectError
  - Common Error Codes
  - Retry Strategy
- [TypeScript Tips](./typescript-tips.md)
  - Working with bigint Fields
  - Handling oneof Types
  - Migrating from Default Client to createOpenStatusClient

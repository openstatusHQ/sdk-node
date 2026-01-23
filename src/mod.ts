import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { MonitorService } from "./gen/openstatus/monitor/v1/service_pb.ts";


const transport = createConnectTransport({
  baseUrl: process.env.OPENSTATUS_API_URL ?? "https://api.openstatus.dev",
  httpVersion: "2",
});

export const openstatus = {
  monitor: { v1: { MonitorService: createClient(MonitorService, transport) } },
};

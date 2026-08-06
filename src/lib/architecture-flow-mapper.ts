import { MarkerType } from "@xyflow/react";
import type { InspirationArchitecturePlan } from "@/lib/inspiration";
import type { ArchitectureEdge, ArchitectureNode, FlowState } from "@/components/workspace/ArchitectureFlow";

type Shape = "rectangle" | "circle" | "diamond" | "database" | "hexagon";

const edgeBase = {
  type: "custom",
  animated: false,
  markerEnd: { type: MarkerType.ArrowClosed, color: "#6b7280" },
  style: { stroke: "#8a8a8a", strokeWidth: 1.8 },
};

const lanes: Array<{
  key: keyof InspirationArchitecturePlan | "user" | "brief";
  label: string;
  shape: Shape;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  items: (plan: InspirationArchitecturePlan) => string[];
}> = [
  {
    key: "user",
    label: "User",
    shape: "circle",
    color: "#2563eb",
    x: 80,
    y: 250,
    width: 140,
    height: 140,
    items: (plan) => plan.productBrief.audience.slice(0, 1),
  },
  {
    key: "screens",
    label: "Screens",
    shape: "rectangle",
    color: "#111827",
    x: 330,
    y: 120,
    width: 190,
    height: 86,
    items: (plan) => plan.screens,
  },
  {
    key: "frontend",
    label: "Frontend",
    shape: "rectangle",
    color: "#0891b2",
    x: 610,
    y: 120,
    width: 200,
    height: 86,
    items: (plan) => plan.frontend,
  },
  {
    key: "modules",
    label: "Modules",
    shape: "hexagon",
    color: "#7c3aed",
    x: 890,
    y: 120,
    width: 180,
    height: 110,
    items: (plan) => plan.modules,
  },
  {
    key: "backend",
    label: "Backend",
    shape: "diamond",
    color: "#d97706",
    x: 1160,
    y: 120,
    width: 150,
    height: 150,
    items: (plan) => plan.backend,
  },
  {
    key: "dataEntities",
    label: "Data",
    shape: "database",
    color: "#059669",
    x: 1440,
    y: 100,
    width: 150,
    height: 170,
    items: (plan) => plan.dataEntities,
  },
  {
    key: "apiRoutes",
    label: "APIs",
    shape: "rectangle",
    color: "#dc2626",
    x: 1160,
    y: 390,
    width: 210,
    height: 86,
    items: (plan) => plan.apiRoutes,
  },
  {
    key: "integrations",
    label: "Integrations",
    shape: "hexagon",
    color: "#4f46e5",
    x: 1440,
    y: 390,
    width: 190,
    height: 110,
    items: (plan) => plan.integrations,
  },
];

function sanitizeId(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 42) || "node";
}

function uniqueLabels(items: string[], fallback: string) {
  const seen = new Set<string>();
  const values = items.map((item) => item.trim()).filter(Boolean);
  const source = values.length ? values : [fallback];
  return source.filter((item) => {
    const key = item.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function createNode(id: string, label: string, lane: (typeof lanes)[number], index: number): ArchitectureNode {
  return {
    id,
    type: "shape",
    position: {
      x: lane.x,
      y: lane.y + index * (lane.height + 34),
    },
    data: {
      label,
      shape: lane.shape,
      color: lane.color,
    },
    style: {
      width: lane.width,
      height: lane.height,
    },
  };
}

function createEdge(source: string, target: string, label: string): ArchitectureEdge {
  return {
    id: `e-${source}-${target}`,
    source,
    target,
    label,
    ...edgeBase,
  };
}

export function architecturePlanToFlow(plan: InspirationArchitecturePlan): FlowState {
  const nodes: ArchitectureNode[] = [];
  const laneNodeIds = new Map<string, string[]>();

  for (const lane of lanes) {
    const labels = uniqueLabels(lane.items(plan), lane.label).slice(0, lane.key === "user" ? 1 : 5);
    const ids: string[] = [];
    labels.forEach((label, index) => {
      const id = `${String(lane.key)}-${sanitizeId(label)}-${index}`;
      ids.push(id);
      nodes.push(createNode(id, label, lane, index));
    });
    laneNodeIds.set(String(lane.key), ids);
  }

  const laneConnections = [
    ["user", "screens", "uses"],
    ["screens", "frontend", "renders"],
    ["frontend", "modules", "calls"],
    ["modules", "backend", "orchestrates"],
    ["backend", "dataEntities", "stores"],
    ["backend", "apiRoutes", "exposes"],
    ["apiRoutes", "integrations", "connects"],
  ];

  const edges: ArchitectureEdge[] = [];
  for (const [from, to, label] of laneConnections) {
    const sources = laneNodeIds.get(from) || [];
    const targets = laneNodeIds.get(to) || [];
    if (!sources.length || !targets.length) continue;
    edges.push(createEdge(sources[0], targets[0], label));
    for (let index = 1; index < targets.length; index++) {
      edges.push(createEdge(targets[0], targets[index], "includes"));
    }
  }

  return { nodes, edges };
}

export function mergeArchitectureFlows(existing: FlowState, generated: FlowState): FlowState {
  const existingLabels = new Set(existing.nodes.map((node) => node.data.label.trim().toLowerCase()));
  const maxX = existing.nodes.reduce((max, node) => Math.max(max, node.position.x + Number(node.style?.width || 180)), 0);
  const xOffset = Math.max(320, maxX + 180);

  const addedNodes = generated.nodes
    .filter((node) => !existingLabels.has(node.data.label.trim().toLowerCase()))
    .map((node) => ({
      ...node,
      id: `generated-${Date.now()}-${node.id}`,
      position: {
        x: node.position.x + xOffset,
        y: node.position.y,
      },
    }));

  const idMap = new Map<string, string>();
  generated.nodes.forEach((node) => {
    const match = addedNodes.find((added) => added.data.label === node.data.label);
    if (match) idMap.set(node.id, match.id);
  });

  const addedEdges = generated.edges
    .map((edge) => {
      const source = idMap.get(edge.source);
      const target = idMap.get(edge.target);
      if (!source || !target) return null;
      return {
        ...edge,
        id: `generated-${Date.now()}-${edge.id}`,
        source,
        target,
      };
    })
    .filter((edge): edge is ArchitectureEdge => Boolean(edge));

  return {
    nodes: [...existing.nodes, ...addedNodes],
    edges: [...existing.edges, ...addedEdges],
  };
}

export interface BreadcrumbItem {
  id: string;
  label: string;
}

export interface CanvasSpotlightState {
  spotlightNodeId: string | null;
  spotlightNodeIds: Set<string> | null;
  spotlightNodeLabel: string | null;
  drillDownNodeId: string | null;
  breadcrumbs: BreadcrumbItem[];
  toggleSpotlightNode: (nodeId: string) => void;
  clearSpotlight: () => void;
  drillDown: (nodeId: string) => void;
  exitDrillDown: () => void;
  jumpBreadcrumb: (nodeId: string) => void;
}

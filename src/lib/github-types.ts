export type GitHubConnection = {
  id: string;
  github_user_id: number;
  github_username: string;
  github_avatar_url: string | null;
  created_at: string;
};

export type GitHubRepo = {
  id: string;
  repo_github_id: number;
  repo_name: string;
  repo_full_name: string;
  repo_url: string;
  default_branch: string;
  description: string | null;
  is_private: boolean;
  connected: boolean;
  created_at: string;
};

export type CodeScan = {
  id: string;
  repo_id: string;
  commit_sha: string | null;
  branch: string;
  status: "pending" | "scanning" | "complete" | "failed";
  scan_data: ScanResult | null;
  frameworks: string[] | null;
  endpoints: EndpointInfo[] | null;
  dependencies: Record<string, string> | null;
  file_tree: FileNode[] | null;
  design_tokens: DesignTokenInfo | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
};

export type FileNode = {
  path: string;
  name: string;
  type: "file" | "dir";
  size?: number;
  children?: FileNode[];
};

export type ScanResult = {
  frameworks: FrameworkInfo[];
  fileTree: FileNode[];
  endpoints: EndpointInfo[];
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  designTokens: DesignTokenInfo | null;
  database: DatabaseInfo | null;
  configs: ConfigInfo[];
  decisions: DecisionInfo[];
};

export type FrameworkInfo = {
  name: string;
  type: "frontend" | "backend" | "mobile" | "database" | "testing" | "infra";
  detected: string[];
  version?: string;
};

export type EndpointInfo = {
  method: string;
  path: string;
  source: string;
  handler?: string;
  auth?: string;
};

export type DesignTokenInfo = {
  colors: Record<string, string>;
  typography: Record<string, string>;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  source: string[];
};

export type DatabaseInfo = {
  type: string;
  tables: { name: string; columns: { name: string; type: string }[] }[];
  connections: { host?: string; database?: string }[];
};

export type ConfigInfo = {
  file: string;
  format: "json" | "yaml" | "toml" | "js" | "env";
  key: string;
  value: string;
};

export type DecisionInfo = {
  category: string;
  decision: string;
  rationale: string;
  file: string;
};

export type ContextBundle = {
  id: string;
  repo_id: string;
  version: number;
  bundle_data: {
    projectName: string;
    tagline: string;
    summary: string;
    architecture: ArchitectureMap;
    designSystem: DesignTokenInfo;
    endpoints: EndpointRegistry;
    decisionLog: DecisionInfo[];
  };
  architecture_map: ArchitectureMap | null;
  endpoint_registry: EndpointRegistry | null;
  decision_log: DecisionInfo[] | null;
  created_at: string;
};

export type ArchitectureMap = {
  frontend: string[];
  backend: string[];
  apis: string[];
  database: string[];
  infrastructure: string[];
  integrations: string[];
};

export type EndpointRegistry = {
  total: number;
  routes: EndpointInfo[];
};

export type SyncSubscription = {
  id: string;
  repo_id: string;
  last_known_commit_sha: string | null;
  drift_detected: boolean;
  drift_approved: boolean | null;
  active: boolean;
  created_at: string;
};

export type GitHubRepoListItem = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  private: boolean;
  default_branch: string;
  language: string | null;
  updated_at: string;
  already_connected?: boolean;
};

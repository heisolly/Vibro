CREATE TABLE IF NOT EXISTS github_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  github_user_id BIGINT NOT NULL,
  github_username TEXT NOT NULL,
  github_avatar_url TEXT,
  access_token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_github_connections_user ON github_connections(user_id);

CREATE TABLE IF NOT EXISTS github_repos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repo_github_id BIGINT NOT NULL,
  repo_name TEXT NOT NULL,
  repo_full_name TEXT NOT NULL,
  repo_url TEXT NOT NULL,
  default_branch TEXT NOT NULL DEFAULT 'main',
  description TEXT,
  is_private BOOLEAN DEFAULT false,
  connected BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_github_repos_user_repo ON github_repos(user_id, repo_github_id);

CREATE TABLE IF NOT EXISTS code_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES github_repos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commit_sha TEXT,
  branch TEXT NOT NULL DEFAULT 'main',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scanning', 'complete', 'failed')),
  scan_data JSONB,
  frameworks JSONB,
  endpoints JSONB,
  dependencies JSONB,
  file_tree JSONB,
  design_tokens JSONB,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_code_scans_repo ON code_scans(repo_id);

CREATE TABLE IF NOT EXISTS context_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES github_repos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scan_id UUID REFERENCES code_scans(id) ON DELETE SET NULL,
  version INTEGER NOT NULL DEFAULT 1,
  bundle_data JSONB NOT NULL,
  architecture_map JSONB,
  endpoint_registry JSONB,
  decision_log JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_context_bundles_repo_version ON context_bundles(repo_id, version DESC);

CREATE TABLE IF NOT EXISTS sync_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES github_repos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  webhook_id TEXT,
  webhook_secret TEXT,
  last_known_commit_sha TEXT,
  drift_detected BOOLEAN DEFAULT false,
  drift_approved BOOLEAN,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sync_subscriptions_repo ON sync_subscriptions(repo_id);

ALTER TABLE github_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own connections" ON github_connections
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own repos" ON github_repos
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own scans" ON code_scans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own bundles" ON context_bundles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own syncs" ON sync_subscriptions
  FOR ALL USING (auth.uid() = user_id);

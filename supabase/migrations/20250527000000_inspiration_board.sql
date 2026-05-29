CREATE TABLE IF NOT EXISTS inspiration_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_slug TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('image', 'url', 'note', 'web')),
  title TEXT NOT NULL,
  description TEXT,
  source_url TEXT,
  source_domain TEXT,
  thumbnail_url TEXT,
  storage_path TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inspiration_assets_user_workspace ON inspiration_assets(user_id, workspace_slug);
CREATE INDEX IF NOT EXISTS idx_inspiration_assets_tags ON inspiration_assets USING GIN(tags);

CREATE TABLE IF NOT EXISTS inspiration_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_slug TEXT NOT NULL,
  context_bundle_id UUID REFERENCES context_bundles(id) ON DELETE SET NULL,
  version INTEGER NOT NULL DEFAULT 1,
  snapshot JSONB NOT NULL,
  influence JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_inspiration_snapshots_workspace_version
  ON inspiration_snapshots(user_id, workspace_slug, version DESC);

ALTER TABLE inspiration_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspiration_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own inspiration assets" ON inspiration_assets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own inspiration snapshots" ON inspiration_snapshots
  FOR ALL USING (auth.uid() = user_id);

INSERT INTO storage.buckets (id, name, public)
VALUES ('inspiration-assets', 'inspiration-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users upload own inspiration assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'inspiration-assets'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Anyone can read inspiration assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'inspiration-assets');

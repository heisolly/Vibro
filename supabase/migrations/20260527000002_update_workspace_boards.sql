-- Migration: 20260527000002_update_workspace_boards.sql
-- Description: Drop specific nodes/edges columns in favor of a generic canvas_state blob.

ALTER TABLE workspace_boards 
  DROP COLUMN IF EXISTS nodes,
  DROP COLUMN IF EXISTS edges;

ALTER TABLE workspace_boards
  ADD COLUMN IF NOT EXISTS canvas_state JSONB NOT NULL DEFAULT '{}'::jsonb;

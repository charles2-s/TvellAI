-- Add start_time and end_time to destinations
ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cover_photo TEXT;

-- Create index for faster trip lookups
CREATE INDEX IF NOT EXISTS idx_destinations_trip_id
  ON destinations(trip_id);

-- Enable Row Level Security
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

-- Public can read destinations for public trips
CREATE POLICY "Public read destinations"
  ON destinations FOR SELECT
  USING (
    trip_id IN (
      SELECT id FROM trips WHERE is_public = true
    )
  );

-- Companies can manage their own destinations
CREATE POLICY "Companies manage own destinations"
  ON destinations FOR ALL
  USING (
    company_id IN (
      SELECT id FROM companies WHERE id = auth.uid()
    )
  );

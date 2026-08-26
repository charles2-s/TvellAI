export type DestinationStoredStatus = "Upcoming" | "Completed";

export type DestinationComputedStatus = "Upcoming" | "Active" | "Passed" | "Completed";

export interface Destination {
  id: string;
  company_id: string;
  name: string;
  type: "Wildlife Park" | "Historical Site" | "Forest" | "Other";
  description: string | null;
  photos: string[];
  cover_photo: string | null;
  start_time: string | null;
  end_time: string | null;
  duration: string | null;
  status: DestinationStoredStatus;
  completed_at: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface DestinationWithStatus extends Destination {
  computed_status: DestinationComputedStatus;
  time_remaining: string | null;
  time_display: string;
}

export interface Trip {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  company_id: string;
  start_date: string | null;
  end_date: string | null;
  cover_photo: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
}

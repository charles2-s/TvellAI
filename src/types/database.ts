export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
}

export interface Destination {
  id: string;
  company_id: string;
  name: string;
  type: "Wildlife Park" | "Historical Site" | "Forest" | "Other";
  description: string | null;
  photos: string[];
  duration: string;
  order: number;
  status: "Upcoming" | "Completed";
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type DestinationType = Destination["type"];
export type DestinationStatus = Destination["status"];

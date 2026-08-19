import { Metadata } from "next";
import { TripClientPage } from "./TripClientPage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Trip - Trailshare`,
    description: `View your trip itinerary`,
  };
}

export default async function TripPage({ params }: PageProps) {
  const { slug } = await params;
  return <TripClientPage slug={slug} />;
}

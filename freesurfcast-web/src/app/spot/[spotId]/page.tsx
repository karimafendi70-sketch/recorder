import { redirect } from "next/navigation";

/**
 * /spot/[spotId] → redirect to /spot/[spotId]/forecast
 * The forecast tab is the default sub-tab.
 */
export default async function SpotIndexPage({
  params,
}: {
  params: Promise<{ spotId: string }>;
}) {
  const { spotId } = await params;
  redirect(`/spot/${spotId}/forecast`);
}

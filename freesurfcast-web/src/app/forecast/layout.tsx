import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forecast",
  description:
    "View personalised surf scores per time slot and daypart for your favourite spots.",
};

export default function ForecastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

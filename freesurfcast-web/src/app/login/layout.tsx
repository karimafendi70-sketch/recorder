import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to access your personalised surf forecasts.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import Link from "next/link";

export default function NotFound() {
  return (
    <section className="login-screen">
      <div className="card" style={{ textAlign: "center", maxWidth: 440, padding: "2rem 1.6rem" }}>
        <p className="eyebrow">404</p>
        <h1 style={{ fontSize: "1.6rem" }}>Page not found</h1>
        <p className="muted" style={{ lineHeight: 1.6 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center", flexWrap: "wrap", marginTop: "0.4rem" }}>
          <Link href="/" className="btn btn-ghost">
            Back to Home
          </Link>
          <Link href="/forecast" className="btn btn-primary">
            Open Forecast →
          </Link>
        </div>
      </div>
    </section>
  );
}

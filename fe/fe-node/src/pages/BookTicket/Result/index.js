import React, { useEffect } from "react";
import ResultBookTicket from "../ResultBookticket";

export default function BookingResultPage() {
  useEffect(() => {
    window?.scrollTo?.({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main style={{ minHeight: "100vh", padding: "40px 0", backgroundColor: "#0a2029" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", backgroundColor: "#1f2d3b", borderRadius: 12 }}>
        <ResultBookTicket />
      </div>
    </main>
  );
}
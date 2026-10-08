import { ImageResponse } from "next/og";

// Gambar Open Graph dibuat saat build (statis), tanpa aset eksternal.
export const alt = "RasaLoka Kitchen & Eatery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #c2410c 0%, #ea580c 55%, #f59e0b 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 4, opacity: 0.9 }}>RESTORAN CASUAL DINING · BANDUNG</div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 800, marginTop: 24 }}>RasaLoka</div>
        <div style={{ display: "flex", fontSize: 44, marginTop: 8 }}>Kitchen &amp; Eatery</div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 40, opacity: 0.95 }}>
          Cita rasa lokal, suasana hangat · Dine-in · Takeaway · Catering Event
        </div>
      </div>
    ),
    size,
  );
}

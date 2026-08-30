import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FIRE Calculator — Early Retirement Simulator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #0F1712 0%, #12271C 55%, #1E8E5A 130%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: "50%",
              backgroundColor: "#1E8E5A",
              marginRight: 28,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "#F5A623",
                position: "absolute",
                right: -2,
                bottom: -2,
              }}
            />
            <span style={{ color: "#FFFFFF", fontSize: 46, fontWeight: 700 }}>
              F
            </span>
          </div>
          <span style={{ color: "#EAF3EC", fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>
            firelic.com
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#FFFFFF",
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: -1.5,
              lineHeight: 1.1,
            }}
          >
            FIRE Calculator
          </div>
          <div
            style={{
              display: "flex",
              color: "#B9D6C4",
              fontSize: 32,
              fontWeight: 500,
              marginTop: 20,
              maxWidth: 920,
            }}
          >
            Simulate your path to Financial Independence, Retire Early
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 40,
              width: 120,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#F5A623",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}

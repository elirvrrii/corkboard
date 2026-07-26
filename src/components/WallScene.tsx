export function WallScene() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      style={{ zIndex: 0 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "#f5ead6",
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(180,120,60,0.06) 0px, rgba(180,120,60,0.06) 1px, transparent 1px, transparent 28px),
            repeating-linear-gradient(-45deg, rgba(180,120,60,0.06) 0px, rgba(180,120,60,0.06) 1px, transparent 1px, transparent 28px)
          `,
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-10"
        style={{
          background: "#e8d5b7",
          borderTop: "2px solid rgba(61,31,14,0.15)",
        }}
      />
      <div
        className="absolute bottom-8 left-0 right-0 h-2"
        style={{
          background: "#d4b896",
          borderTop: "1px solid rgba(61,31,14,0.12)",
          borderBottom: "1px solid rgba(61,31,14,0.12)",
        }}
      />
    </div>
  );
}

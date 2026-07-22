export function CartoonPin({ color }: { color: string }) {
  return (
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
      <div
        className="w-5 h-5 rounded-full"
        style={{
          background: color,
          border: "2.5px solid #3d1f0e",
          boxShadow: "2px 2px 0px #3d1f0e",
        }}
      />
      <div
        className="w-1.5 h-2.5"
        style={{ background: "#8a6040", border: "1px solid #3d1f0e" }}
      />
    </div>
  );
}

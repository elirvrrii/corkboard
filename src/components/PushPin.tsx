export function Pushpin({ color }: { color: string }) {
  return (
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center drop-shadow-md">
      <div
        className="w-4 h-4 rounded-full border border-white/40"
        style={{ background: color, boxShadow: `0 2px 6px ${color}99` }}
      />
      <div
        className="w-1 h-2 rounded-b-sm opacity-60"
        style={{ background: color }}
      />
    </div>
  );
}

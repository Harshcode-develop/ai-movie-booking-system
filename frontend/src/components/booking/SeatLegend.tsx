export default function SeatLegend() {
  const items = [
    { label: "Available", color: "bg-white border-primary/40" },
    { label: "Selected", color: "bg-primary border-primary text-white" },
    { label: "Booked", color: "bg-gray-700/50 border-transparent opacity-50" },
    { label: "Sold", color: "bg-gray-700/50 border-transparent opacity-30" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-6 text-xs text-text-secondary">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded ${item.color} border flex items-center justify-center`}
          >
            {item.label === "Selected" && (
              <span className="text-[10px]">✓</span>
            )}
          </div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

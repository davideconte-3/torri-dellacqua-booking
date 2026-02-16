export default function Credits({ onLightBg = false }: { onLightBg?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4">
      <a
        href="https://davideconte.me"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 group transition-all duration-300 hover:opacity-100 opacity-80"
      >
        <span className={`text-sm font-light tracking-wide ${onLightBg ? 'text-gray-500' : 'text-white/60'}`} style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
          Crafted by
        </span>
        <img
          src="/dc-logo.svg"
          alt="Davide Conte"
          className="h-3   w-auto"
        />
      </a>
    </div>
  );
}

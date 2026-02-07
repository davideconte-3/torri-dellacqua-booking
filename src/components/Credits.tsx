export default function Credits() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4">
      <a
        href="https://davideconte.me"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 group transition-all duration-300 hover:opacity-100 opacity-80"
      >
        <span className="text-white/60 text-sm font-light tracking-wide" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
          Crafted by
        </span>
        <img
          src="/dc-logo.svg"
          alt="Davide Conte"
          className="h-3 w-auto"
        />
      </a>
    </div>
  );
}

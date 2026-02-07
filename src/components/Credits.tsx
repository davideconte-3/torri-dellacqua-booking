import Image from 'next/image';

export default function Credits() {
  return (
    <div className="flex items-center justify-center gap-2 text-white/60 text-xs font-light">
      <span>Crafted by</span>
      <a
        href="https://davideconte.me"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 hover:text-white transition-colors duration-300"
      >
        <Image
          src="/dc-logo.png"
          alt="Davide Conte"
          width={16}
          height={16}
          className="opacity-70 hover:opacity-100 transition-opacity"
        />
        <span className="underline underline-offset-2">Davide Conte</span>
      </a>
    </div>
  );
}

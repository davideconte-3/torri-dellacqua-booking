import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reindirizzamento...',
  robots: { index: false, follow: true },
};

export default function PrenotaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

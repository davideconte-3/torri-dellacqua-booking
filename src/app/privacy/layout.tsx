import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Informativa sulla privacy | Torri dell\'Acqua',
  description: 'Informativa sul trattamento dei dati personali - Torri dell\'Acqua',
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}

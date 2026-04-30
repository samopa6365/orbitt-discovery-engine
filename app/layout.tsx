import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Codex Discovery Layer',
  description: 'Ranking people by signal, not clout.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

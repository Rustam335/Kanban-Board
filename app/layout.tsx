import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Stacked — Kanban Board",
  description:
    "A tactile drag-and-drop Kanban board. Organize work across To Do, In Progress, and Done — all in your browser.",
};

// Set theme before paint to avoid a flash of the wrong color scheme.
// Defaults to LIGHT when no stored preference exists.
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('kanban.theme');
    if (stored === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}

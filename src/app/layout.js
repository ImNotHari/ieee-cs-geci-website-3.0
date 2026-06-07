import "./globals.css";

export const metadata = {
  title: "IEEE CS SBC GECI – Home",
  description:
    "IEEE Computer Society Student Branch Chapter, Government Engineering College Idukki. Computing. Students. Impact.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import './globals.css';

export const metadata = {
  title: 'Admin - Indian Bike 3D Code',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

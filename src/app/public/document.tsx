import styles from "../styles.css?url";
import { Toaster } from "~components/ui/sonner";

export const PublicDocument: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Whitewood</title>
      <link rel="modulepreload" href="/src/client.tsx" />
      <link rel="stylesheet" href={styles} />
    </head>
    <body>
      {children}
      <Toaster richColors position="top-right" />
      <script>import("/src/client.tsx")</script>
    </body>
  </html>
);

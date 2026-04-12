import styles from "../app/styles.css?url";

export const PlatformDocument: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Whitewood - Platform</title>
            <link rel="modulepreload" href="/src/client.tsx" />
            <link rel="stylesheet" href={styles} />
        </head>
        <body>
            {children}
            <script>import("/src/client.tsx")</script>
        </body>
    </html>
);

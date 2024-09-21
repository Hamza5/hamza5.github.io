// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import "animate.css"
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import {theme} from "@/app/theme";
import {Metadata} from "next";


export const metadata: Metadata = {
    title: 'Hamza Abbad - Personal Website',
    description: 'Personal website of Hamza Abbad, an engineer in Artificial Intelligence and Computer Science.',
};

metadata.applicationName = metadata.title as string;

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
      <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
      <MantineProvider theme={theme} >{children}</MantineProvider>
      </body>
      </html>
  );
}
import {AppShell, AppShellHeader, AppShellMain, Center, Group, Image, Text, Title} from '@mantine/core';
import { metadata } from './layout';

export default function Page() {
  return (
    <AppShell padding="md" header={{height: 60}}>
      <AppShellHeader>
          <Center h="100%">
              <Text fw="bold" size="xl">{metadata.title}</Text>
          </Center>
      </AppShellHeader>
      <AppShellMain>
          <Center>
              <Text size="md">{metadata.description}</Text>
          </Center>
      </AppShellMain>
    </AppShell>
  );
}

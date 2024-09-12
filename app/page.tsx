import {AppShell, AppShellMain, Center, Group, Image, Text, Title, Avatar} from '@mantine/core';
import Header from './components/header';

export default function Page() {
  return (
    <AppShell padding="md" header={{height: 150}}>
      <Header name="Hamza Abbad" avatarURL="/avatar.svg" shortDescription="Engineer in Artificial Intelligence and Computer Science" />
      <AppShellMain>
      </AppShellMain>
    </AppShell>
  );
}

import {AppShell, AppShellMain} from '@mantine/core';
import Header from './components/header';
import {Notice} from "./components/notice";

export default function Page() {
  return (
    <AppShell padding="md" header={{height: 150}}>
      <Header name="Hamza Abbad" avatarURL="/avatar.svg" shortDescription="Engineer in Artificial Intelligence and Computer Science" />
      <AppShellMain>
        <Notice />
      </AppShellMain>
    </AppShell>
  );
}

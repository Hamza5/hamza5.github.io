import {AppShell, AppShellMain, Notification, Text, Loader, Center, rem} from '@mantine/core';
import Header from './components/header';

export default function Page() {
  return (
    <AppShell padding="md" header={{height: 150}}>
      <Header name="Hamza Abbad" avatarURL="/avatar.svg" shortDescription="Engineer in Artificial Intelligence and Computer Science" />
      <AppShellMain>
          <Center pos="fixed" bottom={rem(20)} left={rem(10)} right={rem(10)}>
          <Notification icon={<Loader size={24} type="bars" color="yellow.6" />} withCloseButton={false} bg="yellow.0"
                        title={<Text fw="bold" c="yellow.6">Under construction</Text>} color="transparent" shadow="xs"
                        className="animate__animated animate__bounceInUp animate__delay-2s">
              This website is under construction. I am working on it. Please check back in a few days.
          </Notification>
          </Center>
      </AppShellMain>
    </AppShell>
  );
}

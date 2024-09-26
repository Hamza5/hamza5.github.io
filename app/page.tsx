import {AppShell, AppShellMain, Box, Group, Stack, Text, Button} from '@mantine/core';
import {IconBrandGithub, IconBrandUpwork, IconExternalLink} from "@tabler/icons-react";
import Header from './components/header';
import {Notice} from "./components/notice";
import SlidingTexts from "./components/sliding_texts";
import styles from "./components/header.module.css";

export default function Page() {
  return (
    <AppShell padding="md" header={{height: 150}}>
      <Header name="Hamza Abbad" avatarURL="/avatar.svg" shortDescription="Engineer in Artificial Intelligence and Computer Science" />
      <AppShellMain>
          <Stack className="animate__animated animate__fadeInDown animate__delay-4s" ta="center" gap="xs">
              <Text fz={{base: 24, md: 32}} className={styles.gradientText}>
                  You have just found a
              </Text>
              <SlidingTexts>
                  <Box>Web developer</Box>
                  <Box>Desktop developer</Box>
                  <Box>Web Scraper</Box>
                  <Box>Automation specialist</Box>
                  <Box>AI Engineer</Box>
                  <Box>Graphics Designer</Box>
              </SlidingTexts>
              <Group justify="center" mt="md" className="animate__animated animate__fadeInDown animate__delay-5s">
                  <Button component="a" href="https://github.com/Hamza5" target="_blank" rel="noopener noreferrer"
                          size="xl" leftSection={<IconBrandGithub />} rightSection={<IconExternalLink />} color="gray">
                      Check out my code
                  </Button>
                  <Button component="a" href="https://www.upwork.com/freelancers/hamzaa49" target="_blank" rel="noopener noreferrer"
                          size="xl" leftSection={<IconBrandUpwork />} rightSection={<IconExternalLink />} color="green">
                      Hire me
                  </Button>
              </Group>
          </Stack>
        <Notice />
      </AppShellMain>
    </AppShell>
  );
}

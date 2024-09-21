import {AppShell, AppShellMain, Box, Text} from '@mantine/core';
import Header from './components/header';
import {Notice} from "./components/notice";
import SlidingTexts from "./components/sliding_texts";
import styles from "./components/header.module.css";

export default function Page() {
  return (
    <AppShell padding="md" header={{height: 150}}>
      <Header name="Hamza Abbad" avatarURL="/avatar.svg" shortDescription="Engineer in Artificial Intelligence and Computer Science" />
      <AppShellMain>
          <Box className="animate__animated animate__fadeInDown animate__delay-4s" ta="center">
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
          </Box>
        <Notice />
      </AppShellMain>
    </AppShell>
  );
}

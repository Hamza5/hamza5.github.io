import {AppShell, AppShellMain, Box, Group, Stack, Text, Button, Flex} from '@mantine/core';
import {IconBrandGithub, IconBrandUpwork, IconExternalLink} from "@tabler/icons-react";
import * as motion from "framer-motion/client";
import Header from './components/header';
import {Notice} from "./components/notice";
import SlidingTexts from "./components/sliding_texts";
import styles from "./components/header.module.css";

export default function Page() {
  return (
    <AppShell padding="md" header={{height: 150}}>
      <Header name="Hamza Abbad" avatarURL="/avatar.svg" shortDescription="Engineer in Artificial Intelligence and Computer Science" />
      <AppShellMain>
          <motion.div initial={{opacity: 0, y: -50}} animate={{opacity: 1, y: 0}} transition={{delay: 3, duration: 0.5}}>
          <Stack ta="center" gap={0}>
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
              <motion.div initial={{opacity: 0, y: -50}} animate={{opacity: 1, y: 0}} transition={{delay: 4, duration: 0.5}}>
              <Group justify="center" mt={{base: "md", md: "lg"}}>
                  <Button component="a" href="https://github.com/Hamza5" target="_blank" rel="noopener noreferrer"
                          size="xl" leftSection={<IconBrandGithub />} rightSection={<IconExternalLink />} color="gray">
                      Check out my code
                  </Button>
                  <Button component="a" href="https://www.upwork.com/freelancers/~017dc88577730bcb57" target="_blank" rel="noopener noreferrer"
                          size="xl" leftSection={<IconBrandUpwork />} rightSection={<IconExternalLink />} color="green">
                      Hire me
                  </Button>
              </Group>
              </motion.div>
              <motion.div initial={{opacity: 0, y: -100}} animate={{opacity: 1, y: 0}} transition={{delay: 4.5, duration: 0.5}}>
              <Stack mt="md">
                  <Text fz={{base: 24, md: 32}} fw="bold" className={styles.gradientText}>
                      Most used technologies
                  </Text>
                  <Flex justify="center" gap="xs">
                      <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"
                             alt="Python" title="Python" width={120} height={40}/>
                      <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"
                             alt="JavaScript" title="JavaScript" width={150} height={40}/>
                      <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white"
                             alt="Node.js" title="Node.js" width={120} height={40}/>
                  </Flex>
              </Stack>
              </motion.div>
          </Stack>
          </motion.div>
        <Notice />
      </AppShellMain>
    </AppShell>
  );
}

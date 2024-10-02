import {AppShellHeader, Text, Avatar, Stack, Title, Flex, Box} from "@mantine/core";
import * as motion from "framer-motion/client";
import styles from "./header.module.css";

type HeaderProps = {
    name: string;
    shortDescription: string;
    avatarURL: string;
}

export default function Header(props: HeaderProps) {
    return (
        <motion.div initial={{y: -200}} animate={{y: 0}} transition={{duration: 0.75}}>
        <AppShellHeader className={styles.banner}>
            <Flex gap="md" h="100%" px="md" direction="row" align="center">
                <Box h={{base: "70%", md: "80%"}} style={{zIndex: 150}}>
                    <motion.div initial={{x: -200, rotateZ: '-180deg'}} animate={{x: 0, rotateZ: "0deg"}} transition={{delay: 0.5, duration: 0.75}} style={{height: "100%"}}>
                        <Avatar src={props.avatarURL} alt={props.name} className={`${styles.circleShadow}`} w="fit-content" h="100%"/>
                    </motion.div>
                </Box>
                <Stack gap={0} align="start" w={{base: "70%", md: "auto"}}>
                    <motion.div initial={{x: -300, opacity: 0}} animate={{x: 0, opacity: [0, 0.25, 1]}} transition={{delay: 1.25, duration: 0.75}}>
                        <Title order={1} className={styles.gradientText}>{props.name}</Title>
                    </motion.div>
                    <motion.div initial={{x: -300, opacity: 0}} animate={{x: 0, opacity: [0, 0.25, 1]}} transition={{delay: 1.75, duration: 1}}>
                        <Text fw="bold" className={styles.gradientText}>{props.shortDescription}</Text>
                    </motion.div>
                </Stack>
            </Flex>
        </AppShellHeader>
        </motion.div>
    );
}

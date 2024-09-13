import {AppShellHeader, Text, Avatar, Stack, Title, Flex} from "@mantine/core";
import styles from "./header.module.css";
import 'animate.css';

type HeaderProps = {
    name: string;
    shortDescription: string;
    avatarURL: string;
}

export default function Header(props: HeaderProps) {
    return (
        <AppShellHeader className={`${styles.banner} animate__animated animate__slideInDown`}>
            <Flex gap="md" h="100%" px="md" direction="row" align="center">
                <Avatar src={props.avatarURL} alt={props.name} style={{zIndex: 10}}
                        className={`${styles.circleShadow} animate__animated animate__rollIn animate__delay-1s`}
                        h={{base: "70%", md: "80%"}} w="fit-content"
                />
                <Stack gap={0} align="start" w={{base: "70%", md: "auto"}}>
                    <Title order={1} className={`${styles.gradientText} animate__animated animate__fadeInLeft animate__delay-2s`}>{props.name}</Title>
                    <Text fw="bold" className={`${styles.gradientText} animate__animated animate__fadeInLeft animate__delay-3s`}>{props.shortDescription}</Text>
                </Stack>
            </Flex>
        </AppShellHeader>
    );
}

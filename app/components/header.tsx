import {AppShellHeader, Text, Avatar, Stack, Title, Group} from "@mantine/core";
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
            <Group gap="md" h="100%" px="md" className="animate__animated animate__fadeInLeft animate__delay-1s">
                <Avatar src={props.avatarURL} alt={props.name} className={styles.circleShadow} h="85%" w="fit-content"/>
                <Stack gap="sm" align="start">
                    <Title order={1} className={`${styles.gradientText}`}>{props.name}</Title>
                    <Text fw="bold" className={`${styles.gradientText}`}>{props.shortDescription}</Text>
                </Stack>
            </Group>
        </AppShellHeader>
    );
}

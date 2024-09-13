import {Anchor, Center, Loader, Notification, rem, Text} from "@mantine/core";
import 'animate.css';
import Link from "next/link";

export function Notice() {
    return (
        <Center pos="fixed" bottom={rem(20)} left={rem(10)} right={rem(10)}>
            <Notification icon={<Loader size={24} type="bars" color="yellow.6" />} withCloseButton={false} bg="yellow.0"
            title={<Text fw="bold" c="yellow.6">Work in progress</Text>} color="transparent"
            className="animate__animated animate__bounceInUp animate__delay-3s">
                This website is under construction. In the meantime, you can check out my&nbsp;
                <Anchor href="https://hamza5.github.io/InteractiveCV/" target="_blank" rel="noopener noreferrer"
                        underline="hover" size="sm" fw="bold" c="yellow.6"
                        component={Link}>
                    Interactive CV
                </Anchor>.
            </Notification>
        </Center>
    );
}
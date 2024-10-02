import {Anchor, Center, Loader, Notification, rem, Text} from "@mantine/core";
import Link from "next/link";
import * as motion from "framer-motion/client";

export function Notice() {
    return (
        <Center pos="fixed" bottom={rem(20)} left={rem(10)} right={rem(10)}>
            <motion.div initial={{opacity: 0, y: 100}} animate={{opacity: 1, y: 0}} transition={{delay: 5.5, duration: 0.5, type: "spring", bounce: 0.5}}>
            <Notification icon={<Loader size={24} type="bars" color="yellow.6" />} withCloseButton={false} bg="yellow.0"
            title={<Text fw="bold" c="yellow.6">Work in progress</Text>} color="transparent">
                This website is under construction. In the meantime, you can check out my&nbsp;
                <Anchor href="https://hamza5.github.io/InteractiveCV/" target="_blank" rel="noopener noreferrer"
                        underline="hover" size="sm" fw="bold" c="yellow.6"
                        component={Link}>
                    Interactive CV
                </Anchor>.
            </Notification>
            </motion.div>
        </Center>
    );
}
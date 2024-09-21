"use client";
import {Box, useMantineTheme} from "@mantine/core";
import {useInterval, useTimeout} from "@mantine/hooks";
import {useEffect, useState} from "react";

export default function SlidingTexts({children}: { children: React.ReactNode[] }) {
    const [offset, setOffset] = useState(0);
    const interval = useInterval(() => setOffset((offset + 1) % children.length), 1500);
    const timeout = useTimeout(() => interval.start(), 4000);
    const translation = `-${(offset / children.length * 100).toFixed(0)}%`;
    const theme = useMantineTheme();
    const shadowColor = theme.colors[theme.primaryColor][0];
    useEffect(() => {
        timeout.start();
        return () => {
            timeout.clear();
            interval.stop();
        };
    }, []);
    return <Box fw="bold" fz={{base: 32, md: 48}} h={{base: 50, md: 65}} c="paleBlue.5"
                style={{overflow: "hidden", textShadow: `-1px 0  ${shadowColor}, 0 1px  ${shadowColor}, 1px 0  ${shadowColor}, 0 -1px  ${shadowColor}`}}>
        <Box style={{transition: `transform 0.5s`, transform: `translateY(${translation})`}}>
            {children}
        </Box>
    </Box>
}
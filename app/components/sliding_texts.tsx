"use client";
import {Box} from "@mantine/core";
import {useInterval, useTimeout} from "@mantine/hooks";
import {wrapper} from './sliding_texts.module.css';
import {gradientText} from "./header.module.css";
import {useEffect, useState} from "react";

export default function SlidingTexts({children}: { children: React.ReactNode[] }) {
    const [offset, setOffset] = useState(0);
    const interval = useInterval(() => setOffset((offset + 1) % children.length), 1500);
    const timeout = useTimeout(() => interval.start(), 4000);
    const translation = `-${(offset / children.length * 100).toFixed(0)}%`;
    useEffect(() => {
        timeout.start();
        return () => {
            timeout.clear();
            interval.stop();
        };
    }, []);
    return <Box className={`${wrapper} ${gradientText}`} fw="bold" fz={{base: 32, md: 48}} h={{base: 50, md: 65}}>
        <Box style={{transition: `transform 0.5s`, transform: `translateY(${translation})`}}>
            {children}
        </Box>
    </Box>
}
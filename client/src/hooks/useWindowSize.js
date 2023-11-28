"use client"
import {useEffect, useState} from "react";

export default function useWindowSize() {

    const [mode, setMode] = useState(2);

    useEffect(() => {
        function handleResize() {
            let mode = 2
            if(window.innerWidth < 600){
                mode = 1
            }
            setMode(mode)
        }

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return mode;
}
"use client"
import {useState} from "react";
import Image from "next/image";
import arrow from "@/assets/images/arrow-down.svg";
import {Link, usePathname} from "@/navigation";
import * as React from "react";
import HomeWorksList from "@/components/classes/dashboard/HomeWorksList";
import QuestionsList from "@/components/classes/dashboard/homework/questions/QuestionsList";

export default function Questions({texts,hw}) {
    const [showContent, setShowContent] = useState(false)
    const pathname = usePathname()
    return (

        <div className={'grid grid-cols-1  lg:flex-row gap-8  items-start mt-5'}>
            <div className={""}>
                <div
                    className={"w-full  bg-white rounded-xl overflow-hidden divide-y divide-gray-500 flex flex-col"}>
                    <div className={"py-3 px-4 lg:py-6 lg:px-8 bg-white  "}>
                        <div
                            className={"font-bold flex w-full items-center justify-between lg:text-xl text-sm cursor-pointer"}
                            onClick={() => setShowContent(!showContent)}>
                                <h2 className={"w-[70%]"}>{texts('qList')}</h2>


                            <div className={!showContent ? "rotate-180 !w-[50px]" : " !w-[50px]"}><Image
                                alt={'arrow '} width={50}
                                height={16}
                                src={arrow.src}/></div>
                        </div>
                        <div style={{
                            transition:"grid-template-rows 200ms",
                            gridTemplateRows: showContent ? "1fr" : "0fr"
                        }}
                             className={`border-none grid text-sm  lg:text-xl md:text-base overflow-hidden  text-[var(--text2)]`}>
                            <QuestionsList hw={hw} t={texts}/>
                        </div>
                    </div>
                </div>
            </div>

        </div>)
}

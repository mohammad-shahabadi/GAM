"use client"
import {useState} from "react";
import Image from "next/image";
import arrow from "@/assets/images/arrow-down.svg";
import {Link, usePathname} from "@/navigation";
import * as React from "react";
import HomeWorksList from "@/components/classes/dashboard/HomeWorksList";
import StudentsList from "@/components/classes/dashboard/StudentsList";

export default function Students({texts,course,getClass}) {
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
                                <h2 className={"w-[70%]"}>{texts('stdList')}</h2>


                            <div className={!showContent ? "rotate-180 !w-[50px]" : " !w-[50px]"}><Image
                                alt={'arrow '} width={50}
                                height={16}
                                src={arrow.src}/></div>
                        </div>
                        <div style={{
                            transition: showContent ? "max-height 0.5s ease-out" : "max-height 0.5s ease-in",
                            maxHeight: showContent ? "550px" : "0px"
                        }}
                             className={`border-none transition text-sm  lg:text-xl md:text-base overflow-auto  text-[var(--text2)]`}>
                            <div style={{display: "block", height: "8px", content: ""}}/>
                            <StudentsList getClass={getClass} course={course} t={texts}/>
                        </div>
                    </div>
                </div>
            </div>

        </div>)
}

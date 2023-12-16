import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from "@/components/global/Button";
import {useRequest} from "@/hooks/useRequest";
import {CREATE_COURSE, GET_COURSE, UPDATE_COURSE} from "@/apiList";
import {Link, usePathname, useRouter} from "@/navigation";
import {Box, Paper} from "@mui/material";
import {BeatLoader} from "react-spinners";
import {toast} from "react-toastify";
import {notFound} from 'next/navigation';

const ClassDashboard = ({t, slug}) => {
    if(!slug){
        notFound()
    }
    const router = useRouter()
    const pathname = usePathname()
    const [course, setCourse] = useState({});

    const [classReq, classLoader] = useRequest(GET_COURSE, "GET");
    useEffect(() => {
        if (!!slug) {
            classReq(undefined, [{name: "id", value: slug},]).then((res) => {
                console.log(res)
                setCourse(res)
            }).catch(() => {
                toast.error("Something wrong happened")
                router.push(pathname.startsWith('/admin') ? "/admin/classes" : "/teacher/classes")
            })
        }
    }, [slug]);

    if (!!slug && classLoader) {
        return (<div className={"w-full h-screen flex items-center justify-center"}>
            <BeatLoader color="#1976d2"/>
        </div>)
    }
    return (<div
        style={{
            display: 'flex', flexDirection: 'column', margin: 'auto', marginTop: 2,
        }}
    >
        <div className={"w-full justify-between flex"}>
            <Link className={"bg-[#ff5733] text-white py-2 px-4 mb-4 max-h-fit"} href={pathname + "/add"}>
                {t('goBack')}
            </Link>

        </div>
        <div>
            <div className={"font-bold  text-center text-3xl md:text-5xl"}>{course?.title}</div>
            <div className={"font-medium  text-center text-xl md:text-3xl"}>{course?.description}</div>
        </div>

    </div>);
};

export default ClassDashboard;

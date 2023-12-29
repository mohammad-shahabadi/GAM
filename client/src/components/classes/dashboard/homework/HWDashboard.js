import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from "@/components/global/Button";
import {useRequest} from "@/hooks/useRequest";
import {CREATE_COURSE, GET_COURSE, GET_HW, UPDATE_COURSE} from "@/apiList";
import {Link, usePathname, useRouter} from "@/navigation";
import {Box, Paper} from "@mui/material";
import {BeatLoader} from "react-spinners";
import {toast} from "react-toastify";
import {notFound} from 'next/navigation';
import HomeWorks from "@/components/classes/dashboard/HomeWorks";
import Students from "@/components/classes/dashboard/Students";
import Questions from "@/components/classes/dashboard/homework/questions/Questions";

const HWDashboard = ({t, slug}) => {
    if(!slug){
        notFound()
    }
    const router = useRouter()
    const pathname = usePathname()
    const [hw, setHW] = useState({});

    const [HWReq, HWLoader] = useRequest(GET_HW, "GET");
    const getHW = ()=>{
        HWReq(undefined, [{name: "id", value: slug},]).then((res) => {
            setHW(res)
            console.log(res)
        }).catch(() => {
            toast.error("Something wrong happened")
            router.push(pathname.startsWith('/admin') ? "/admin/classes" : "/teacher/classes")
        })
    }
    useEffect(() => {
        if (!!slug) {
            getHW()
        }
    }, [slug]);

    if (!!slug && HWLoader) {
        return (<div className={"w-full h-screen flex items-center justify-center"}>
            <BeatLoader color="#ff5733"/>
        </div>)
    }
    return (<div
        style={{
            display: 'flex', flexDirection: 'column', margin: 'auto', marginTop: 2,
        }}
    >
        <div>
            <div className={"font-bold  text-center text-3xl md:text-5xl"}>{hw?.title}</div>
        </div>
        <Questions texts={t} hw={hw}/>

    </div>);
};

export default HWDashboard;

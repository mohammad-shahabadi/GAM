"use client"
import {useEffect, useState} from "react";
import {Link, usePathname, useRouter} from "@/navigation";
import * as React from "react";
import {useRequest} from "@/hooks/useRequest";
import {GET_Q, USER_GET_Q} from "@/apiList";
import {toast} from "react-toastify";
import MDEditor from '@uiw/react-md-editor';

export default function QuestionsPage({texts,classSlug,hwSlug,qSlug}) {
    const [q, setQ] = useState({})
    const [q1, setQ1] = useState({})

    const [onCopy, setOnCopy] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const [QReq, QLoader] = useRequest(GET_Q, "GET");
    const [Q1Req, Q1Loader] = useRequest(USER_GET_Q, "GET");

    useEffect(() => {
        if (!!qSlug) {
            QReq(undefined, [{name: "id", value: qSlug},]).then((res) => {
                setQ(res)
            }).catch(() => {
                toast.error("Something wrong happened")
                //router.push( ("/user/classes/"+classSlug+"/homework/" + hwSlug))
            })
            Q1Req(undefined, [{name: "id", value: qSlug},]).then((res) => {
                setQ1(res)
            }).catch(() => {
                toast.error("Something wrong happened")
                //router.push( ("/user/classes/"+classSlug+"/homework/" + hwSlug))
            })
        }
    }, [qSlug]);
    const handleCopy = (url) =>{
        navigator.clipboard.writeText(url)
        setOnCopy(true)
        setTimeout(function() {
            setOnCopy(false);
        }, 1500);
    }
    return (

        <div
            style={{
                display: 'flex', flexDirection: 'column', margin: 'auto', marginTop: 2,justifyContent:"center",alignItems:"center"
            }}
        >
            <div>
                <div className={"font-bold  text-center text-3xl md:text-5xl"}>{q?.title}</div>
            </div>
            <div dir={"ltr"} className={"bg-[#ecece9] w-full max-w-4xl mt-4 p-4 rounded-2xl "}>
                <div className={"flex items-center justify-center border mb-4 border-b-gray-400 pb-4"}>
                    <input className={" bg-white p-2 w-full rounded-l-md"} type={"url"} value={q?.git_http_url} disabled={true}/>
                    <button onClick={()=>handleCopy(q1?.git_http_url)} className={"text-white w-32 h-10 rounded-r-md "+(onCopy?"bg-green-500":"bg-red-500") }>
                        {!onCopy ? "Copy":"Copied"}
                    </button>
                </div>
                <MDEditor.Markdown source={q?.content}  />
            </div>

        </div>)
}

import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from "@/components/global/Button";
import {useRequest} from "@/hooks/useRequest";
import {CREATE_Q, GET_Q, UPDATE_Q} from "@/apiList";
import {usePathname, useRouter} from "@/navigation";
import {Box, Paper} from "@mui/material";
import {toast} from "react-toastify";
import {BeatLoader} from "react-spinners";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);
const AddQ = ({t, slug,id,classSlug}) => {
    const router = useRouter()
    const pathname = usePathname()
    const [formData, setFormData] = useState({
        "title":"",
        "priority" : 1,
        "problem_set" : slug,
        "points" : 0,
        "content": "**Hello world!!!**",
        "git_path" : ""
    });
    const [addQReq, addQLoader] = useRequest(CREATE_Q, "POST");
    const [QReq, QLoader] = useRequest(GET_Q, "GET");
    const [updateQReq, updateQLoader] = useRequest(UPDATE_Q, "PATCH");
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.name === "git_path" ? event.target.value.replace(/[^A-Za-z0-9\s]/g, '') : event.target.value
        });
    };
    useEffect(() => {
        if (!!id) {
            QReq(undefined, [{name: "id", value: id},]).then((res) => {
                setFormData(res)
            }).catch(() => {
                toast.error("Something wrong happened")
                router.push(pathname.startsWith('/admin') ? ("/admin/classes/"+classSlug+"/homework/" + slug) : ("/teacher/classes/"+classSlug+"/homework/" + slug))
            })
        }
    }, [id]);
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!!id) {
            let tempFormData = {...formData}
            delete tempFormData.password
            updateQReq(tempFormData, [{name: "id", value: id},]).then((res) => {
                router.push(pathname.startsWith('/admin') ? ("/admin/classes/"+classSlug+"/homework/" + slug) : ("/teacher/classes/"+classSlug+"/homework/" + slug))
            }).catch(() => {
                toast.error("Something wrong happened")
            })
        } else {
            addQReq(formData).then((res) => {
                router.push(pathname.startsWith('/admin') ? ("/admin/classes/"+classSlug+"/homework/" + slug) : ("/teacher/classes/"+classSlug+"/homework/" + slug))
            })
        }

    };
    if (!!id && QLoader) {
        return (<div className={"w-full h-screen flex items-center justify-center"}>
            <BeatLoader color="#ff5733"/>
        </div>)
    }
    return (<form
        style={{
            display: 'flex', flexDirection: 'column', margin: 'auto', marginTop: 2,
        }}
    >
        <div className={"font-bold  text-center text-xl md:text-3xl"}>{!!id? t('editQ') : t('addQ')}</div>
        <div
            className={"pt-4 sm:pt-8  flex flex-col sm:flex-row gap-2"}
        >
            <div className={"w-full"}>
                <Box
                    sx={{display: "flex", flexDirection: "column", gap: "1rem"}}
                >
                    <Paper
                        elevation={0}
                        className="shadow"
                        sx={{
                            display: "flex", flexDirection: "column", gap: "1rem", p: 2, borderRadius: "16px"
                        }}
                    >
                        <TextField
                            label={t('title')}
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            margin="normal"
                            sx={{margin: 1}}
                        />
                        {!id && <TextField
                            label={t('git_path')}
                            type="text"
                            name="git_path"
                            value={formData.git_path}
                            onChange={handleChange}
                            margin="normal"
                            sx={{margin: 1}}
                        />}
                        <TextField
                            label={t('priority')}
                            type="number"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            margin="normal"
                            sx={{margin: 1}}
                        />
                        <TextField
                            label={t('points')}
                            type="number"
                            name="points"
                            value={formData.points}
                            onChange={handleChange}
                            margin="normal"
                            sx={{margin: 1}}
                        />
                        <MDEditor value={formData.content} onChange={(value)=>setFormData({...formData,content: value})} />

                    </Paper>
                </Box>
            </div>


        </div>


        <Button
            type="primary"
            caption={t('submit')}
            className="mt-4 md:mt-8"
            onClick={handleSubmit}
            disabled={!formData.content || !formData.title || (!id && !formData.git_path)}
            loading={addQLoader || updateQLoader}
        />
    </form>);
};

export default AddQ;

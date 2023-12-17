import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from "@/components/global/Button";
import {useRequest} from "@/hooks/useRequest";
import {CREATE_COURSE, GET_COURSE, UPDATE_COURSE} from "@/apiList";
import {usePathname, useRouter} from "@/navigation";
import {Box, Paper} from "@mui/material";
import {BeatLoader} from "react-spinners";
import {toast} from "react-toastify";

const AddForm = ({t, slug}) => {
    const router = useRouter()
    const pathname = usePathname()
    const [formData, setFormData] = useState({
        "title": "", "description": "", "git_path": ""
    });
    const [addClassReq, addClassLoader] = useRequest(CREATE_COURSE, "POST");
    const [classReq, classLoader] = useRequest(GET_COURSE, "GET");
    const [updateClassReq, updateClassLoader] = useRequest(UPDATE_COURSE, "PATCH");
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.name === "git_path" ? event.target.value.replace(/[^A-Za-z0-9\s]/g, '') : event.target.value
        });
    };
    useEffect(() => {
        if (!!slug) {
            classReq(undefined, [{name: "id", value: slug},]).then((res) => {
                setFormData(res)
            }).catch(() => {
                toast.error("Something wrong happened")
                router.push(pathname.startsWith('/admin') ? "/admin/classes" : "/teacher/classes")
            })
        }
    }, [slug]);
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!!slug) {
            let tempFormData = {...formData}
            delete tempFormData.password
            updateClassReq(tempFormData, [{name: "id", value: slug},]).then((res) => {
                router.push(pathname.startsWith('/admin') ? "/admin/classes" : "/teacher/classes")
            }).catch(() => {
                toast.error("Something wrong happened")
            })
        } else {
            addClassReq(formData).then((res) => {
                router.push(pathname.startsWith('/admin') ? "/admin/classes" : "/teacher/classes")
            })
        }

    };
    if (!!slug && classLoader) {
        return (<div className={"w-full h-screen flex items-center justify-center"}>
            <BeatLoader color="#1976d2"/>
        </div>)
    }
    return (<form
        style={{
            display: 'flex', flexDirection: 'column', margin: 'auto', marginTop: 2,
        }}
    >
        <div className={"font-bold  text-center text-xl md:text-3xl"}>{!!slug ?t('editClass') : t('addClass')}</div>
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
                        {!slug && <TextField
                            label={t('git_path')}
                            type="text"
                            name="git_path"
                            value={formData.git_path}
                            onChange={handleChange}
                            margin="normal"
                            sx={{margin: 1}}
                        />}
                        <TextField
                            label={t('description')}
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            margin="normal"
                            sx={{margin: 1}}
                        />
                    </Paper>
                </Box>
            </div>


        </div>


        <Button
            type="primary"
            caption={t('submit')}
            className="mt-4 md:mt-8"
            onClick={handleSubmit}
            disabled={!formData.description || !formData.title || (!slug && !formData.git_path)}
            loading={addClassLoader || updateClassLoader}
        />
    </form>);
};

export default AddForm;

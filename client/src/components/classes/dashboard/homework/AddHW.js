import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from "@/components/global/Button";
import {useRequest} from "@/hooks/useRequest";
import {CREATE_HW, GET_HW, UPDATE_HW} from "@/apiList";
import {usePathname, useRouter} from "@/navigation";
import {Box, Paper} from "@mui/material";
import {toast} from "react-toastify";
import {BeatLoader} from "react-spinners";

const AddHW = ({t, slug,id}) => {
    const router = useRouter()
    const pathname = usePathname()
    const [formData, setFormData] = useState({
        "title": "",
        "course": slug,
        "start": new Date(),
        "end": new Date(),
        "git_path": ""
    });
    const [addHWReq, addHWLoader] = useRequest(CREATE_HW, "POST");
    const [HWReq, HWLoader] = useRequest(GET_HW, "GET");
    const [updateHWReq, updateHWLoader] = useRequest(UPDATE_HW, "PATCH");
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.name === "git_path" ? event.target.value.replace(/[^A-Za-z0-9\s]/g, '') : event.target.value
        });
    };
    useEffect(() => {
        if (!!id) {
            HWReq(undefined, [{name: "id", value: id},]).then((res) => {
                setFormData(res)
            }).catch(() => {
                toast.error("Something wrong happened")
                router.push(pathname.startsWith('/admin') ? "/admin/classes" : "/teacher/classes")
            })
        }
    }, [id]);
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!!id) {
            let tempFormData = {...formData}
            delete tempFormData.password
            updateHWReq(tempFormData, [{name: "id", value: id},]).then((res) => {
                router.push((pathname.startsWith('/admin') ? "/admin/classes/" : "/teacher/classes/") + slug)
            }).catch(() => {
                toast.error("Something wrong happened")
            })
        } else {
            addHWReq(formData).then((res) => {
                router.push((pathname.startsWith('/admin') ? "/admin/classes/" : "/teacher/classes/") + slug)
            })
        }

    };
    if (!!id && HWLoader) {
        return (<div className={"w-full h-screen flex items-center justify-center"}>
            <BeatLoader color="#1976d2"/>
        </div>)
    }
    return (<form
        style={{
            display: 'flex', flexDirection: 'column', margin: 'auto', marginTop: 2,
        }}
    >
        <div className={"font-bold  text-center text-xl md:text-3xl"}>{t('addHW')}</div>
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
                        {!!slug && <TextField
                            label={t('git_path')}
                            type="text"
                            name="git_path"
                            value={formData.git_path}
                            onChange={handleChange}
                            margin="normal"
                            sx={{margin: 1}}
                        />}
                        <TextField
                            label={t('startDate')}
                            type="datetime-local"
                            name="start"
                            value={formData.start}
                            onChange={handleChange}
                            margin="normal"
                            sx={{margin: 1}}
                        />
                        <TextField
                            label={t('endDate')}
                            type="datetime-local"
                            name="end"
                            value={formData.end}
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
            disabled={!formData.end || !formData.start || !formData.title || (!id && !formData.git_path)}
            loading={addHWLoader || updateHWLoader}
        />
    </form>);
};

export default AddHW;

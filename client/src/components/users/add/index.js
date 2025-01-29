import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import Button from "@/components/global/Button";
import {useRequest} from "@/hooks/useRequest";
import {GET_USER, SIGNUP, UPDATE_USER} from "@/apiList";
import {usePathname, useRouter} from "@/navigation";
import {Box, Paper} from "@mui/material";
import {BeatLoader} from "react-spinners";
import {toast} from "react-toastify";

const AddForm = ({t, slug}) => {
    const router = useRouter()
    const pathname = usePathname()
    const [formData, setFormData] = useState({
        "email": "", "password": "", "role": "student", "first_name": "", "last_name": "", "student_number": ""
    });
    const [signupReq, signupLoader] = useRequest(SIGNUP, "POST");
    const [userReq, userLoader] = useRequest(GET_USER, "GET");
    const [updateUserReq, updateUserLoader] = useRequest(UPDATE_USER, "PUT");
    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value});
    };
    useEffect(() => {
        if (!!slug) {
            userReq(undefined, [{name: "id", value: slug},]).then((res) => {
                setFormData(res)
            }).catch(() => {
                toast.error("something wrong happened")
                router.push('/admin/users')
            })
        }
    }, [slug]);
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!!slug) {
            let tempFormData = {...formData}
            delete tempFormData.password
            updateUserReq(tempFormData, [{name: "id", value: slug},]).then((res) => {
                router.push('/admin/users')
            }).catch(() => {
                toast.error("something wrong happened")
            })
        } else {
            signupReq(formData).then((res) => {
                router.push('/admin/users')
            })
        }

    };
    if (!!slug && userLoader) {
        return (<div className={"w-full h-screen flex items-center justify-center"}>
            <BeatLoader color="#ff5733"/>
        </div>)
    }
    return (<form
        style={{
            display: 'flex', flexDirection: 'column', margin: 'auto', marginTop: 2,
        }}
    >
        <div className={"font-bold  text-center text-xl md:text-3xl"}>{!!slug ? t('editUser') : t('addUser')}</div>
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
                            label={t('firstName')}
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            margin="normal"
                            sx={{margin: 1}}
                        />
                        <TextField
                            label={t('lastName')}
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            margin="normal"
                            sx={{margin: 1}}
                        />
                        <TextField
                            label={t('stdNumber')}
                            type="number"
                            name="student_number"
                            value={formData.student_number}
                            onChange={handleChange}
                            margin="normal"
                            sx={{margin: 1}}
                        />
                    </Paper>

                </Box>
            </div>
            <div className={"w-full h-full"}>
                <Box
                    sx={{display: "flex", flexDirection: "column", gap: "1rem"}}
                >
                    <Paper
                        elevation={0}
                        className="shadow"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                            p: 2,
                            borderRadius: "16px",
                            height: "100%"
                        }}
                    >
                        {!slug && <TextField
                            label={t('email')}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            sx={{margin: 1}}
                        />}
                        {!slug && <TextField
                            label={t('password')}
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            sx={{margin: 1}}
                        />}
                        <FormControl sx={{margin: 1, minWidth: 120}}>
                            <Select
                                labelId={t('role')}
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <MenuItem value="student" selected={true}>{t('student')}</MenuItem>
                                <MenuItem value="admin">{t('admin')}</MenuItem>
                                <MenuItem value="teacher">{t('teacher')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Paper>


                </Box>
            </div>

        </div>


        <Button
            type="primary"
            caption={t('submit')}
            className="mt-4 md:mt-8"
            onClick={handleSubmit}
            disabled={!formData.email || (!slug && !formData.password) || !formData.student_number || !formData.first_name || !formData.last_name}
            loading={signupLoader || updateUserLoader}
        />
    </form>);
};

export default AddForm;

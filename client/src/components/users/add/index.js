import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from "@/components/global/Button";
import {useRequest} from "@/hooks/useRequest";
import {LOGIN, SIGNUP} from "@/apiList";
import Typography from "@mui/material/Typography";
import {router} from "next/client";
import {useRouter} from "@/navigation";
import {Grid, Paper} from "@mui/material";
import {Box} from "@mui/material";

const AddForm = ({t}) => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        "email": "",
        "password": "",
        "role": "admin",
        "first_name": "",
        "last_name": "",
        "student_number": ""
    });
    const [signupReq, signupLoader] = useRequest(SIGNUP, "POST");

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        signupReq(formData).then((res)=>{
            router.push('/admin/users')
        })
    };

    return (
        <form
            style={{
                display: 'flex',
                flexDirection: 'column',
                margin: 'auto',
                marginTop: 2,
            }}
        >
            <div className={"font-bold  text-center text-xl md:text-3xl"}>{t('addUser')}</div>
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
                            sx={{ display: "flex", flexDirection: "column", gap: "1rem", p: 2,
                                borderRadius:"16px" }}
                        >
                            <TextField
                                label={t('firstName')}
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                margin="normal"
                                sx={{ margin: 1 }}
                            />
                            <TextField
                                label={t('lastName')}
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                margin="normal"
                                sx={{ margin: 1 }}
                            />
                            <TextField
                                label={t('stdNumber')}
                                type="number"
                                name="student_number"
                                value={formData.student_number}
                                onChange={handleChange}
                                margin="normal"
                                sx={{ margin: 1 }}
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
                            sx={{ display: "flex", flexDirection: "column", gap: "1rem", p: 2,
                                borderRadius:"16px",height:"100%" }}
                        >
                            <TextField
                                label={t('email')}
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                margin="normal"
                                sx={{ margin: 1 }}
                            />
                            <TextField
                                label={t('password')}
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                margin="normal"
                                sx={{ margin: 1 }}
                            />
                            <FormControl sx={{ margin: 1, minWidth: 120 }}>
                                <Select
                                    labelId={t('role')}
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="admin">{t('admin')}</MenuItem>
                                    <MenuItem value="student" selected={true}>{t('student')}</MenuItem>
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
                disabled={!formData.email || !formData.password}
                loading={signupLoader}
            />
        </form>
    );
};

export default AddForm;

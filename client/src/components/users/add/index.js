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
import {Paper} from "@mui/material";

const AddForm = ({t}) => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'student',
    });
    const [signupReq, signupLoader] = useRequest(SIGNUP, "POST");

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        signupReq({email:formData.email,password:formData.password,roles:[formData.userType]}).then((res)=>{
            router.push('/admin/users')
        })
    };

    return (
        <form
            style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '600px',
                margin: 'auto',
                marginTop: 2,
            }}
        >
            <div className={"font-bold  text-center text-xl md:text-3xl"}>{t('addUser')}</div>
            <Paper
                elevation={0}
                className="shadow"
                sx={{ display: "flex", flexDirection: "column", gap: "1rem", p: 2 }}
            >
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    sx={{ margin: 1 }}
                />
            </Paper>

            <TextField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                sx={{ margin: 1 }}
            />
            <FormControl sx={{ margin: 1, minWidth: 120 }}>
                {/*<InputLabel id="userTypeLabel">User Type</InputLabel>*/}
                <Select
                    labelId="userTypeLabel"
                    id="userType"
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                >
                    <MenuItem value="admin">{t('admin')}</MenuItem>
                    <MenuItem value="student" selected={true}>{t('student')}</MenuItem>
                    <MenuItem value="teacher">{t('teacher')}</MenuItem>
                </Select>
            </FormControl>
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

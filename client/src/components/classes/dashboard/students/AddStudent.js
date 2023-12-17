import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from "@/components/global/Button";
import {useRequest} from "@/hooks/useRequest";
import {CREATE_HW, CREATE_MEMBERSHIP, GET_HW, UPDATE_HW} from "@/apiList";
import {usePathname, useRouter} from "@/navigation";
import {Box, Paper} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

const AddStudent = ({t, slug}) => {
    const router = useRouter()
    const pathname = usePathname()
    const [formData, setFormData] = useState({
        "course" : slug,
        "email" : "",
        "role" : "student"
    });
    const [addStudentReq, addStudentLoader] = useRequest(CREATE_MEMBERSHIP, "POST");
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]:  event.target.value
        });
    };
    const handleSubmit = (event) => {
        event.preventDefault();

            addStudentReq(formData).then((res) => {
                router.push((pathname.startsWith('/admin') ? "/admin/classes/" : "/teacher/classes/") + slug)
            })


    };

    return (<form
        style={{
            display: 'flex', flexDirection: 'column', margin: 'auto', marginTop: 2,
        }}
    >
        <div className={"font-bold  text-center text-xl md:text-3xl"}>{t('addStudent')}</div>
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
                            label={t('email')}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            sx={{margin: 1}}
                        />
                        <FormControl sx={{margin: 1, minWidth: 120}}>
                            <Select
                                labelId={t('role')}
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <MenuItem value="ta">{t('ta')}</MenuItem>
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
            disabled={!formData.email}
            loading={addStudentLoader}
        />
    </form>);
};

export default AddStudent;

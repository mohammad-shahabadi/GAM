import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from "@/components/global/Button";
import {useRequest} from "@/hooks/useRequest";
import {CREATE_CLASS, SIGNUP} from "@/apiList";
import {useRouter} from "@/navigation";

const AddForm = ({t}) => {
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: '',
        numberOfStudents: "0",
    });
    const [addReq, addReqLoader] = useRequest(CREATE_CLASS, "POST");

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        addReq({title:formData.name}).then((res)=>{
            console.log(res)
            router.push('/admin/classes')
        })
    };

    return (
        <form

            style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '300px',
                margin: 'auto',
                marginTop: 2,
            }}
        >
            <TextField
                label="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                sx={{ margin: 1 }}
            />
            <TextField
                label="NumberOfStudents"
                type="number"
                name="numberOfStudents"
                value={formData.numberOfStudents}
                onChange={handleChange}
                margin="normal"
                sx={{ margin: 1 }}
            />
            <Button
                type="primary"
                caption={t('submit')}
                className="mt-4 md:mt-8"
                onClick={handleSubmit}
                disabled={!formData.name || !formData.numberOfStudents}
            />
        </form>
    );
};

export default AddForm;

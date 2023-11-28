import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from "@/components/global/Button";

const AddForm = ({t}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'student',
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // You can handle form submission logic here
        console.log(formData);
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
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                sx={{ margin: 1 }}
            />
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
                <InputLabel id="userTypeLabel">User Type</InputLabel>
                <Select
                    labelId="userTypeLabel"
                    id="userType"
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="student" selected={true}>Student</MenuItem>
                    <MenuItem value="teacher">Teacher</MenuItem>
                </Select>
            </FormControl>
            <Button
                type="primary"
                caption={t('submit')}
                className="mt-4 md:mt-8"
                onClick={handleSubmit}
                disabled={!formData.email || !formData.password}
            />
        </form>
    );
};

export default AddForm;

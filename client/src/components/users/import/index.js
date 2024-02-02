import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import AttachFileIcon from '@mui/icons-material/AttachFile'
import CloseIcon from '@mui/icons-material/Close'
import Button from "@/components/global/Button";
import {useRequest} from "@/hooks/useRequest";
import {BATCH_SIGNUP, GET_USER, SIGNUP, UPDATE_USER} from "@/apiList";
import {usePathname, useRouter} from "@/navigation";
import {Box, Paper} from "@mui/material";
import {BeatLoader} from "react-spinners";
import {toast} from "react-toastify";
import {MuiFileInput} from "mui-file-input";

const AddFormImport = ({t}) => {
    const router = useRouter()
    const pathname = usePathname()
    const [file, setFile] = React.useState(null)

    const [signupReq, signupLoader] = useRequest(BATCH_SIGNUP, "POST");
    const handleChange = (newFile) => {
        setFile(newFile)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
            signupReq({csv_file:file}).then((res) => {
                router.push('/admin/users')
            })

    };

    return (<form
        style={{
            display: 'flex', flexDirection: 'column', margin: 'auto', marginTop: 2,
        }}
    >
        <div className={"font-bold  text-center text-xl md:text-3xl"}>{ t('addUsers')}</div>
        <div
            className={"pt-4 sm:pt-8 justify-center flex flex-col sm:flex-row gap-2"}
        >
            <MuiFileInput   clearIconButtonProps={{
                title: "Remove",
                children: <CloseIcon fontSize="small" />
            }} InputProps={{
                inputProps: {
                    accept: '.csv'
                },
                startAdornment: <div><AttachFileIcon />{!file && "Upload your file here(.csv)"}</div>
            }} value={file} onChange={handleChange} />
        </div>


        <Button
            type="primary"
            caption={t('submit')}
            className="mt-4 md:mt-8"
            onClick={handleSubmit}
            disabled={!file}
            loading={signupLoader}
        />
    </form>);
};

export default AddFormImport;

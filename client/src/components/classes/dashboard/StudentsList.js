"use client"
import * as React from "react";
import {Suspense, useState} from "react";
import {Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Link, usePathname, useRouter} from "@/navigation";
import CustomModal from "@/components/global/Modal";
import {useRequest} from "@/hooks/useRequest";
import {CREATE_MEMBERSHIP, DELETE_MEMBERSHIP,} from "@/apiList";
import DeleteIcon from '@mui/icons-material/Delete';
import useWindowSize from "@/hooks/useWindowSize";
import {toast} from "react-toastify";

export default function StudentsList({t, course, getClass}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [anchorElLanguage, setAnchorElLanguage] = useState(null)
    const [createReq, createLoader] = useRequest(CREATE_MEMBERSHIP, "POST");
    const [deleteReq, deleteLoader] = useRequest(DELETE_MEMBERSHIP, "DELETE");

    const handleDelete = () => {
        deleteReq(undefined, [
            {name: "id", value: selectedStudent.id},
        ]).then((res) => {
            getClass()
            toast.success("Participant removed successfully")

        }).catch(() => {
            toast.error("Something wrong happened")
        }).finally(()=>{
            setShowDeleteModal(false)
        })
    }
    const mode = useWindowSize()
    const router = useRouter()
    const pathname = usePathname()
    const cols = mode === 1 ? [t('lastName'), t('email'), t('role'), t('delete')] : [t('firstName'), t('lastName'), t('email'), t('role'), t('stdNumber'), t('delete')]
    const handleLanguageMenuOpen = (event) => {
        setAnchorElLanguage(event.currentTarget)
    }
    const handleMenuClose = () => {
        setAnchorElLanguage(null)
    }
    const handleRoleChange = (role) => {
        createReq({
            "course" : course.id,
            "email" : selectedStudent.email,
            "role" : role
        }).then((res) => {
            getClass()
        })
        setAnchorElLanguage(null)
    }
    const isLanguageMenuOpen = Boolean(anchorElLanguage)
    return (
        <div className={"min-h-0"}>
            <div className={"w-full justify-end flex"}>
                <Link className={"bg-[#ff5733] text-white py-2 px-4 mb-4"} href={pathname + "/students/add"}>
                    {t('addStd')}
                </Link>
            </div>
            <div className={"h-full"} style={{width: '100%'}}>
                <Suspense>
                    <TableContainer component={Paper}>
                        <Table sx={{maxWidth: "100%"}} aria-label="simple table">
                            <TableHead className={"bg-[var(--background)]"}>
                                <TableRow>
                                    {cols.map((col, idx) => {
                                        return (<TableCell key={idx} align="center">
                                            <div className={"font-bold"}>  {col}</div>
                                        </TableCell>)
                                    })}

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {course?.memberships?.map((user, idx) => (
                                    <TableRow
                                        key={idx}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >

                                        {mode !== 1 && <TableCell align={"center"} component="th" scope="row">
                                            <div>
                                                {user.first_name || "-"}
                                            </div>
                                        </TableCell>}
                                        <TableCell align={"center"} component="th" scope="row">
                                            <div>
                                                {user.last_name || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell align={"center"} component="th" scope="row">
                                            <div>
                                                {user.email || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell className={"cursor-pointer"} onClick={(e) => {
                                            handleLanguageMenuOpen(e)
                                            setSelectedStudent(user)
                                        }} align={"center"}  component="th" scope="row">
                                            <div>
                                        {user.role || "-"}
                                            </div>
                                            </TableCell>
                                        {mode !== 1 && <TableCell align={"center"} component="th" scope="row">
                                            <div>
                                                {user.student_number || "-"}
                                            </div>
                                        </TableCell>}

                                        <TableCell align={"center"} component="th" scope="row">
                                            <div onClick={() => {
                                                setSelectedStudent(user)
                                                setShowDeleteModal(true)
                                            }} className={"text-red-600 cursor-pointer"}>
                                                <DeleteIcon/>
                                            </div>
                                        </TableCell>


                                    </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Suspense>

                <Menu

                    anchorEl={anchorElLanguage}
                    keepMounted
                    open={isLanguageMenuOpen}
                    onClose={handleMenuClose}>

                    <div >
                        <MenuItem onClick={()=>handleRoleChange('teacher')}>
                            {t('teacher')}
                        </MenuItem>
                    </div>
                    <div>
                        <MenuItem onClick={()=>handleRoleChange('ta')}>
                            {t('ta')}
                        </MenuItem>
                    </div>
                    <div>
                        <MenuItem onClick={()=>handleRoleChange('student')}>
                            {t('student')}
                        </MenuItem>
                    </div>

                </Menu>
                <CustomModal btnCancelText={t('deleteCancel')} btnConfirmText={t('deleteConfirm')}
                             onConfirm={handleDelete} bodyText={null} open={showDeleteModal}
                             onCancel={() => setShowDeleteModal(false)} headerText={t('deleteUserText')}/>
            </div>
        </div>

    )
}
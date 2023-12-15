"use client"
import * as React from "react";
import {Suspense, useEffect, useState} from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Link} from "@/navigation";
import CustomModal from "@/components/global/Modal";
import {useRequest} from "@/hooks/useRequest";
import {GET_ALL_USERS} from "@/apiList";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useWindowSize from "@/hooks/useWindowSize";
export default function UsersTable({t}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [users, setUsers] = useState([])
    const [getUsersReq, getUsersLoader] = useRequest(GET_ALL_USERS, "GET");
    useEffect(() => {
        getUsersReq().then((res) => {
            //console.log(res)
            setUsers(res.results)
        })
    }, [])
    const handleDelete = () => {

    }
    const mode = useWindowSize()

    const cols = mode ===1 ? [ t('lastName'), t('email'), t('role'), t('edit'), t('delete')] : [t('firstName'), t('lastName'), t('email'), t('role'), t('stdNumber'), t('edit'), t('delete')]

    return (
        <div>
            <div className={"w-full justify-between flex"}>
                <div className={"font-bold text-3xl"}>
                    {t('header')}
                </div>
                <Link className={"bg-[#ff5733] text-white py-2 px-4 mb-4"} href={'/admin/users/add'}>
                    {t('addUser')}
                </Link>
            </div>
            <div className={"h-full"} style={{width: '100%'}}>
                <Suspense>
                    <TableContainer component={Paper}>
                        <Table sx={{maxWidth:"100%"}} aria-label="simple table">
                            <TableHead className={"bg-[var(--background)]"}>
                                <TableRow>
                                    {cols.map((col,idx)=>{
                                        return(<TableCell key={idx} align="center">
                                         <div className={"font-bold"}>  {col}</div>
                                        </TableCell>)
                                    })}

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user,idx) => (
                                    <TableRow
                                        key={idx}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        {mode !== 1 && <TableCell align={"center"}  component="th" scope="row">
                                            <div>
                                                {user.first_name || "-"}
                                            </div>
                                        </TableCell>}
                                        <TableCell align={"center"}  component="th" scope="row">
                                            <div>
                                                {user.last_name || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell align={"center"}  component="th" scope="row">
                                            <div>
                                                {user.email || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell align={"center"}  component="th" scope="row">
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
                                            <div className={"text-[#808080] cursor-pointer"}>
                                                <EditIcon/>
                                            </div>
                                        </TableCell>
                                        <TableCell align={"center"} component="th" scope="row">
                                            <div onClick={()=>{
                                                setSelectedUser(user)
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


                <CustomModal btnCancelText={t('deleteCancel')} btnConfirmText={t('deleteConfirm')}
                             onConfirm={handleDelete} bodyText={null} open={showDeleteModal}
                             onCancel={() => setShowDeleteModal(false)} headerText={t('deleteText')}/>
            </div>
        </div>

    )
}
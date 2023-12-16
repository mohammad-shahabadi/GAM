"use client"
import * as React from "react";
import {Suspense, useEffect, useState} from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Link, usePathname, useRouter} from "@/navigation";
import CustomModal from "@/components/global/Modal";
import {useRequest} from "@/hooks/useRequest";
import {DELETE_COURSE, DELETE_USER, GET_ALL_USERS, GET_COURSES, UPDATE_USER} from "@/apiList";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useWindowSize from "@/hooks/useWindowSize";
import {toast} from "react-toastify";
export default function ClassesTable({t}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedClass, setSelectedClass] = useState(null)
    const [classes, setClasses] = useState([])
    const [getClassesReq, getClassesLoader] = useRequest(GET_COURSES, "GET");
    const getClasses = ()=>{
        getClassesReq().then((res) => {
            setClasses(res.results)
        })
    }
    useEffect(() => {
        getClasses()
    }, [])
    const [deleteClassReq, deleteClassLoader] = useRequest(DELETE_COURSE, "DELETE");

    const handleDelete = () => {
        deleteClassReq(undefined, [
            {name: "id", value: selectedClass.id},
        ]).then((res) => {
            getClasses()
            toast.success("Class removed successfully")

        }).catch(() => {
            toast.error("Something wrong happened")
        }).finally(()=>{
            setShowDeleteModal(false)
        })
    }
    const mode = useWindowSize()
    const router = useRouter()
    const pathname = usePathname()
    const cols = mode ===1 ? [ t('title'), t('description'), t('edit'), t('delete')] : [ t('title'), t('description'), t('edit'), t('delete')]

    return (
        <div>
            <div className={"w-full justify-between flex"}>
                <div className={"font-bold text-3xl"}>
                    {t('header')}
                </div>
                <Link className={"bg-[#ff5733] text-white py-2 px-4 mb-4"} href={pathname + "/add"}>
                    {t('addClass')}
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
                                {classes.map((course,idx) => (
                                    <TableRow
                                        key={idx}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        {mode !== 1 && <TableCell align={"center"}  component="th" scope="row">
                                            <div>
                                                {course.title || "-"}
                                            </div>
                                        </TableCell>}
                                        <TableCell align={"center"}  component="th" scope="row">
                                            <div>
                                                {course.description || "-"}
                                            </div>
                                        </TableCell>

                                        <TableCell align={"center"} component="th" scope="row">
                                            <div onClick={()=>router.push(pathname + "/edit/"+course.id)} className={"text-[#808080] cursor-pointer"}>
                                                <EditIcon/>
                                            </div>
                                        </TableCell>
                                        <TableCell align={"center"} component="th" scope="row">
                                            <div onClick={()=>{
                                                setSelectedClass(course)
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
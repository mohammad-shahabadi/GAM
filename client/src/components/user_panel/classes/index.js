"use client"
import * as React from "react";
import {Suspense, useEffect, useState} from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Link, usePathname, useRouter} from "@/navigation";
import CustomModal from "@/components/global/Modal";
import {useRequest} from "@/hooks/useRequest";
import { GET_COURSES_TEACHER} from "@/apiList";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Cookies from "js-cookie";

export default function ClassesTable({t}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [classes, setClasses] = useState([])
    const token = Cookies.get('gam-authorities');

    const [getClassesReq, getClassesLoader] = useRequest( GET_COURSES_TEACHER, "GET");
    const getClasses = () => {
        getClassesReq().then((res) => {
            setClasses(res.results)
        })
    }
    useEffect(() => {
        getClasses()
    }, [])


    const router = useRouter()
    const pathname = usePathname()
    const cols = [t('title'), t('description')]

    return (
        <div>
            <div className={"w-full justify-between flex mb-8"}>
                <div className={"font-bold text-3xl"}>
                    {t('header')}
                </div>
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
                                {classes.map((course, idx) => (
                                    <TableRow
                                        key={idx}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >

                                        <TableCell onClick={() => router.push(pathname + "/" + (course.course.id))}
                                                   className={"cursor-pointer "} align={"center"} component="th"
                                                   scope="row">
                                            <div>
                                                {( course.course.title) || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell onClick={() => router.push(pathname + "/" + (course.course.id))}
                                                   className={"cursor-pointer"} align={"center"} component="th"
                                                   scope="row">
                                            <div>
                                                {( course.course.description) || "-"}

                                            </div>
                                        </TableCell>




                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Suspense>

            </div>
        </div>

    )
}
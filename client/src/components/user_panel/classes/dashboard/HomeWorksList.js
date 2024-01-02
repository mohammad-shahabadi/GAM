"use client"
import * as React from "react";
import {Suspense, useEffect, useState} from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Link, usePathname, useRouter} from "@/navigation";
import CustomModal from "@/components/global/Modal";
import {useRequest} from "@/hooks/useRequest";
import {
    DELETE_HW,
    GET_COURSE_HWS,
} from "@/apiList";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useWindowSize from "@/hooks/useWindowSize";
import {toast} from "react-toastify";
export default function HomeWorksList({t,course}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedHW, setSelectedHW] = useState(null)
    const [HWs, setHWs] = useState([])
    const [getHWsReq, getHWsLoader] = useRequest(GET_COURSE_HWS, "GET");
    const getHWs = ()=>{
        getHWsReq(undefined, [
            {name: "id", value: course.id},
        ]).then((res) => {
            setHWs(res.results)
        })
    }
    useEffect(() => {
        if(course.id){
            getHWs()
        }

    }, [course])
    const [deleteHWReq, deleteHWLoader] = useRequest(DELETE_HW, "DELETE");

    const handleDelete = () => {
        deleteHWReq(undefined, [
            {name: "id", value: selectedHW.id},
        ]).then((res) => {
            getHWs()
            toast.success("Homework removed successfully")

        }).catch(() => {
            toast.error("Something wrong happened")
        }).finally(()=>{
            setShowDeleteModal(false)
        })
    }
    const mode = useWindowSize()
    const router = useRouter()
    const pathname = usePathname()
    const cols = [ t('title'), t('startDate'), t('endDate')]

    return (
        <div className={"min-h-0"}>
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
                                {HWs.map((hw,idx) => (
                                    <TableRow
                                        key={idx}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >

                                        <TableCell onClick={()=>router.push(pathname+"/homework/"+hw.id)} className={"cursor-pointer "} align={"center"}  component="th" scope="row">
                                            <div>
                                                {hw.title || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell onClick={()=>router.push(pathname+"/homework/"+hw.id)} className={"cursor-pointer"} align={"center"}  component="th" scope="row">
                                            <div>
                                                {hw.start.slice(0,10) || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell onClick={()=>router.push(pathname+"/homework/"+hw.id)} className={"cursor-pointer"} align={"center"}  component="th" scope="row">
                                            <div>
                                                {hw.end.slice(0,10) || "-"}
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
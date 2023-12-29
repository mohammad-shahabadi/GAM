"use client"
import * as React from "react";
import {Suspense, useEffect, useState} from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {Link, usePathname, useRouter} from "@/navigation";
import CustomModal from "@/components/global/Modal";
import {useRequest} from "@/hooks/useRequest";
import {
    DELETE_Q,
    GET_QS,
} from "@/apiList";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useWindowSize from "@/hooks/useWindowSize";
import {toast} from "react-toastify";
export default function QuestionsList({t,hw}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedQ, setSelectedQ] = useState(null)
    const [Qs, setQs] = useState([])
    const [getQsReq] = useRequest(GET_QS, "GET");
    const getQs = ()=>{
        getQsReq(undefined, [
            {name: "id", value: hw.id},
        ]).then((res) => {
            console.log(res)
            setQs(res.results)
        })
    }
    useEffect(() => {
        if(hw.id){
            getQs()
        }

    }, [hw])
    const [deleteQReq] = useRequest(DELETE_Q, "DELETE");

    const handleDelete = () => {
        deleteQReq(undefined, [
            {name: "id", value: selectedQ.id},
        ]).then(() => {
            getQs()
            toast.success("Question removed successfully")

        }).catch(() => {
            toast.error("Something wrong happened")
        }).finally(()=>{
            setShowDeleteModal(false)
        })
    }
    const mode = useWindowSize()
    const router = useRouter()
    const pathname = usePathname()
    const cols = mode ===1 ? [ t('title'), t('priority'), t('points'), t('edit'), t('delete')] : [ t('title'), t('priority'), t('points'), t('edit'), t('delete')]

    return (
        <div className={"min-h-0"}>
            <div className={"w-full justify-end flex"}>
                <Link className={"bg-[#ff5733] text-white py-2 px-4 mb-4"} href={pathname + "/add"}>
                    {t('addQ')}
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
                                {Qs.map((hw,idx) => (
                                    <TableRow
                                        key={idx}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >

                                        <TableCell align={"center"}  component="th" scope="row">
                                            <div>
                                                {hw.title || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell  align={"center"}  component="th" scope="row">
                                            <div>
                                                {hw.priority || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell  align={"center"}  component="th" scope="row">
                                            <div>
                                                {hw.points || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell align={"center"} component="th" scope="row">
                                            <div onClick={()=>router.push(pathname + "/edit/"+hw.id)} className={"text-[#808080] cursor-pointer"}>
                                                <EditIcon/>
                                            </div>
                                        </TableCell>
                                        <TableCell align={"center"} component="th" scope="row">
                                            <div onClick={()=>{
                                                setSelectedQ(hw)
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
                             onCancel={() => setShowDeleteModal(false)} headerText={t('deleteHWText')}/>
            </div>
        </div>

    )
}
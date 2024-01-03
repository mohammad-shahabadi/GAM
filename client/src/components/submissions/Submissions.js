import * as React from "react";
import {Suspense, useEffect, useState} from "react";
import Cookies from "js-cookie";
import {useRequest} from "@/hooks/useRequest";
import {DELETE_S, GET_FINAL_S, GET_S, UPDATE_COURSE, UPDATE_S} from "@/apiList";
import {toast} from "react-toastify";
import {Link, usePathname, useRouter} from "@/navigation";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomModal from "@/components/global/Modal";

export default function Submissions({t, hw_id, isFinal}) {

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedSub, setSelectedSub] = useState(null)
    const [subs, setSubs] = useState([])
    const token = Cookies.get('gam-authorities');

    const [getSubsReq, getSubsLoader] = useRequest(isFinal ? GET_FINAL_S : GET_S, "GET");
    const getSubs = () => {
        getSubsReq().then((res) => {
            setSubs(res.results)
        })
    }
    useEffect(() => {
        getSubs()
    }, [hw_id])
    const [deleteSubsReq, deleteSubsLoader] = useRequest(DELETE_S, "DELETE");
    const [updateSubsReq, updateSubsLoader] = useRequest(UPDATE_S, "PATCH");

    const handleDelete = () => {
        deleteSubsReq(undefined, [
            {name: "id", value: selectedSub.id},
        ]).then((res) => {
            getSubs()
            toast.success("Submission removed successfully")

        }).catch(() => {
            toast.error("Something wrong happened")
        }).finally(() => {
            setShowDeleteModal(false)
        })
    }
    const handleChange = (score,total) => {
        updateSubsReq({
            "score_ratio": score/total,
            "is_final": true
        }, [
            {name: "id", value: selectedSub.id},
        ]).then((res) => {
            getSubs()
            toast.success("Submission removed successfully")

        }).catch(() => {
            toast.error("Something wrong happened")
        }).finally(() => {
            setShowDeleteModal(false)
        })
    }
    const router = useRouter()
    const pathname = usePathname()
    const cols = token === "user" ? [t('userName'), t('problemTitle'), t('status'), t('score')] : [t('userName'), t('problemTitle'), t('status'), t('score'),t('edit')]

    return (
        <div>
            <div className={"w-full justify-between flex"}>
                <div className={"font-bold text-3xl"}>
                    {isFinal ?t('f-s-header') : t('s-header')}
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
                                {subs.map((sub, idx) => (
                                    <TableRow
                                        key={idx}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >

                                        <TableCell
                                            align={"center"} component="th"
                                            scope="row">
                                            <div>
                                                {(sub.user_name) || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            align={"center"} component="th"
                                            scope="row">
                                            <div>
                                                {(sub.problem_title) || "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            align={"center"} component="th"
                                            scope="row">
                                            <div>
                                                {(sub.status) || "-"}
                                            </div>
                                        </TableCell>

                                        {token ==="user" && <TableCell
                                            align={"center"} component="th"
                                            scope="row">
                                            <div>
                                                {(sub.total_score * sub.score_ratio) || "-"}
                                            </div>
                                        </TableCell>}
                                        {token !=="user" && <TableCell
                                            align={"center"} component="th"
                                            scope="row">
                                            <div>
                                                <input className={"w-8 h-4 rounded-md"} onChange={(e)=>handleChange(e.target.value,sub.total_score)} type={"number"} value={sub.total_score * sub.score_ratio}/>
                                            </div>
                                        </TableCell>}
                                        {token !=="user" && <TableCell align={"center"} component="th" scope="row">
                                            <div onClick={() => {
                                                setSelectedSub(sub)
                                                setShowDeleteModal(true)
                                            }} className={"text-red-600 cursor-pointer"}>
                                                <DeleteIcon/>
                                            </div>
                                        </TableCell>}


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
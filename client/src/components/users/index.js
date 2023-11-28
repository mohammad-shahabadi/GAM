"use client"
import {DataGrid} from "@mui/x-data-grid";
import * as React from "react";
import {useEffect, useState} from "react";
import {Button} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {Link} from "@/navigation";
import CustomModal from "@/components/global/Modal";
import {useRequest} from "@/hooks/useRequest";
import {GET_ALL_USERS, SIGNUP} from "@/apiList";

export default function UsersTable({t}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [users,setUsers] = useState([])
    const [getUsersReq, getUsersLoader] = useRequest(GET_ALL_USERS, "GET");
    useEffect(()=>{
        getUsersReq().then((res)=>{
            console.log(res)
            const tempUsers = res.result.map(user => {
                return {...user,role:"student"}
            })
        })
    },[])
    const handleDelete = () => {

    }
    const columns = [
        {field: 'email', headerName: t('email'), width: 330},
        {field: 'role', headerName: t('role'), width: 330},
        // {
        //     field: "edit",
        //     headerName: t('edit'),
        //     sortable: false,
        //     renderCell: (params) => {
        //         return <Link href={"admin/users/" + params.row.email}><EditIcon/></Link>;
        //     }
        // },
        {
            field: "delete",
            headerName: t('delete'),
            sortable: false,
            renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    setShowDeleteModal(true)
                    setSelectedUser(params.row.email)
                };
                return <Button onClick={onClick}><DeleteIcon/></Button>;
            }
        }
    ];

    return (
        <div>
            <Link className={"bg-blue-600 hover:bg-blue-950 text-white py-2 px-4 mb-4"} href={'/admin/users/add'}>
                {t('addUser')}
            </Link>
            <div className={"h-full"} style={{ width: '100%'}}>

                <DataGrid
                    getRowId={(row) => row.email}
                    rows={users}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 5},
                        },
                    }}
                    pageSizeOptions={[5, 10]}

                />

                <CustomModal btnCancelText={t('deleteCancel')} btnConfirmText={t('deleteConfirm')} onConfirm={handleDelete} bodyText={null} open={showDeleteModal}
                             onCancel={() => setShowDeleteModal(false)} headerText={t('deleteText')}/>
            </div>
        </div>

    )
}
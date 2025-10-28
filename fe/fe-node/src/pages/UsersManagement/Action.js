import React from 'react'

import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Tooltip from '@material-ui/core/Tooltip';

export default function ButtonDelete({ onDeleted, nguoiDungItem, onEdit }) {
    return (
        <>
            <Tooltip title="Xóa">
                <IconButton color="primary" style={{ color: "#f50057" }} onClick={() => onDeleted(nguoiDungItem.taiKhoan)} >
                    <DeleteForeverIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Chỉnh sửa">
                <IconButton color="primary" style={{ color: "rgb(238, 130, 59)" }} onClick={() => onEdit(nguoiDungItem)} >
                    <EditIcon />
                </IconButton>
            </Tooltip>
        </>
    )
}
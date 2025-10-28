import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

export default function ButtonDelete({ onDeleted, maLichChieu }) {
    return (
        <Tooltip title={"Xóa"}>
            <IconButton color="primary" style={{ color: "#f50057" }} onClick={() => onDeleted(maLichChieu)} >
                <DeleteForeverIcon />
            </IconButton>
        </Tooltip>
    )
}
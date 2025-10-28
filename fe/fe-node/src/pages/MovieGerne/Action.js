import React from 'react'

import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Tooltip from '@material-ui/core/Tooltip';

import UseApiCheckIsMaPhimSetShowtime from '../../utilities/useApiCheckIsMaPhimSetShowtime';

export default function ButtonDelete({ onDeleted, phimItem, onEdit }) {
    const isMovieSetShowtime = UseApiCheckIsMaPhimSetShowtime(phimItem)
    return (
        <>
            <Tooltip title={"Xóa"}>
                <IconButton color="primary" style={{ color:  "#f50057" }} onClick={() => onDeleted(phimItem)} >
                    <DeleteForeverIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Chỉnh sửa">
                <IconButton color="primary" style={{ color: "rgb(238, 130, 59)" }} onClick={() => onEdit(phimItem)} >
                    <EditIcon />
                </IconButton>
            </Tooltip>
        </>
    )
}
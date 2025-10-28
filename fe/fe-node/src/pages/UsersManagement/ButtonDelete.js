import React from 'react'

import UseApiCheckIsUserBookTicket from '../../utilities/useApiCheckIsUserBooking';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Tooltip from '@material-ui/core/Tooltip';

export default function ButtonDelete({ onDeleted, taiKhoan }) {
    const isUserBookTicket = UseApiCheckIsUserBookTicket(taiKhoan)
    return (
        <Tooltip title={isUserBookTicket ? "Không thể xóa" : "Xóa"}>
            <IconButton color="primary" style={{ color: isUserBookTicket ? "#00000042" : "#f50057" }} onClick={() => onDeleted(taiKhoan)} >
                <DeleteForeverIcon />
            </IconButton>
        </Tooltip>
    )
}
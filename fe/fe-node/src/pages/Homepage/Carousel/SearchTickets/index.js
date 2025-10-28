import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CustomPopper from "./popper";
import "./style.css"
import theatersApi from "../../../../api/theatersApi";
import useStyles from "./styles";
import formatDate from "../../../../utilities/formatDate";
import { HIDDEN_SEARCHTICKET } from "../../../../constants/config";

export default function SearchStickets() {
    const { movieList: movieRender, errorMovieList } = useSelector(
        (state) => state.movieReducer
    );
    const history = useHistory();
    const down992px = useMediaQuery(HIDDEN_SEARCHTICKET);
    const [data, setData] = useState({
        // handleSelectPhim
        setPhim: "",
        rapRender: [],
        cumRapChieuData: [],
        startRequest: false,
        errorCallApi: "",
        setRap: "",
        ngayChieuRender: [],
        lichChieuPhimData: [],

        setNgayXem: "",
        suatChieuRender: [],
        lichChieuPhimDataSelected: [],
        setSuatChieu: "",
        maLichChieu: "",
        openCtr: { phim: false, rap: false, ngayXem: false, suatChieu: false },
        rootElementPopup: null,
    });
    const [topPopup, setTopPopup] = useState(false);
    const classes = useStyles({
        down992px,
        openPhim: data.openCtr.phim || data.setPhim?.maPhim,
    });
    const [currentPhimPopup, setcurrentPhimPopup] = useState(null);
    useEffect(() => {
        let mounted = true;
        if (!data.openCtr.phim) {
            return undefined;
        }
        setTimeout(() => {
            const placementPopup = document.querySelector(
                'div[role="presentation"].MuiAutocomplete-popper'
            );
            if (placementPopup?.getAttribute("x-placement") === "bottom" && mounted) {
                setTopPopup(false);
            } else if (
                placementPopup?.getAttribute("x-placement") === "top" &&
                mounted
            ) {
                setTopPopup(true);
            }
            setData((data) => ({
                ...data,
                rootElementPopup: placementPopup,
            }));
        }, 50);
        return () => {
            mounted = false;
        };
    }, [data.openCtr.phim]);

    const handleOpenPhim = () => {
        setData((data) => ({
            ...data,
            openCtr: { ...data.openCtr, phim: true },
        }));
    };
    const handleOpenRap = () => {
        setData((data) => ({ ...data, openCtr: { ...data.openCtr, rap: true } }));
    };
    const handleOpenNgayXem = () => {
        setData((data) => ({
            ...data,
            openCtr: { ...data.openCtr, ngayXem: true },
        }));
    };
    const handleOpenSuatChieu = () => {
        setData((data) => ({
            ...data,
            openCtr: { ...data.openCtr, suatChieu: true },
        }));
    };
    const handleClosePhim = () => {
        setData((data) => ({ ...data, openCtr: { ...data.openCtr, phim: false } }));
    };
    const handleCloseRap = () => {
        setData((data) => ({ ...data, openCtr: { ...data.openCtr, rap: false } }));
    };
    const handleCloseNgayXem = () => {
        setData((data) => ({
            ...data,
            openCtr: { ...data.openCtr, ngayXem: false },
        }));
    };
    const handleCloseSuatChieu = () => {
        setData((data) => ({
            ...data,
            openCtr: { ...data.openCtr, suatChieu: false },
        }));
    };
    const handleSelectPhim = (phim) => {
        if (!phim) {
            return undefined;
        }
        setData((data) => ({
            ...data,
            setPhim: phim,
            startRequest: true,
            openCtr: { ...data.openCtr, rap: true },
            rapRender: [],
            cumRapChieuData: [],
            setRap: "",
            ngayChieuRender: [],
            lichChieuPhimData: [],
            setNgayXem: "",
            suatChieuRender: [],
            lichChieuPhimDataSelected: [],
            setSuatChieu: "",
            maLichChieu: "",
        }));
        theatersApi
            .getThongTinLichChieuPhim(phim.maPhim)
            .then((result) => {
                setData((data) => ({ ...data, startRequest: false }));
                const cumRapChieuData = result.data.heThongRapChieu.reduce(
                    (colect, item) => {
                        return [...colect, ...item.cumRapChieu];
                    },
                    []
                );
                const rapRender = cumRapChieuData.map((item) => item.tenCumRap);
                setData((data) => ({
                    ...data,
                    rapRender,
                    cumRapChieuData,
                }));
            })
            .catch(function (error) {
                if (error.response) {
                    setData((data) => ({ ...data, errorCallApi: error.response.data }));
                } else if (error.request) {
                    setData((data) => ({ ...data, errorCallApi: error.message }));
                }
            });
    };
    const handleSelectRap = (e) => {
        setData((data) => ({
            ...data,
            setRap: e.target.value,
            openCtr: { ...data.openCtr, ngayXem: true },
            // reset
            ngayChieuRender: [],
            lichChieuPhimData: [],
            setNgayXem: "",
            suatChieuRender: [],
            lichChieuPhimDataSelected: [],
            setSuatChieu: "",
            maLichChieu: "",
        }));
        const indexSelect = data.cumRapChieuData.findIndex(
            (item) => item.tenCumRap === e.target.value
        );
        const lichChieuPhimData = data.cumRapChieuData[indexSelect].lichChieuPhim;
        const ngayChieuRender = lichChieuPhimData.map((item) => {
            return item.ngayChieuGioChieu.slice(0, 10);
        });
        const ngayChieuRenderRemoveDuplicates = [...new Set(ngayChieuRender)];
        setData((data) => ({
            ...data,
            ngayChieuRender: ngayChieuRenderRemoveDuplicates,
            lichChieuPhimData,
        }));
    };
    const handleSelectNgayXem = (e) => {
        setData((data) => ({
            ...data,
            setNgayXem: e.target.value,
            openCtr: { ...data.openCtr, suatChieu: true },
            suatChieuRender: [],
            lichChieuPhimDataSelected: [],
            setSuatChieu: "",
            maLichChieu: "",
        }));

        const lichChieuPhimDataSelected = data.lichChieuPhimData.filter((item) => {
            if (item.ngayChieuGioChieu.slice(0, 10) === e.target.value) {
                return true;
            }
            return false;
        });
        const suatChieuRender = lichChieuPhimDataSelected.map((item) => {
            return item.ngayChieuGioChieu.slice(11, 16);
        });
        setData((data) => ({
            ...data,
            suatChieuRender,
            lichChieuPhimDataSelected,
        }));
    };
    const handleSelectSuatChieu = (e) => {
        setData((data) => ({
            ...data,
            setSuatChieu: e.target.value,
            // reset
            maLichChieu: "",
        }));
        const indexMaLichChieuSelect = data.lichChieuPhimDataSelected.findIndex(
            (item) => item.ngayChieuGioChieu.slice(11, 16) === e.target.value
        );
        const maLichChieu =
            data.lichChieuPhimDataSelected[indexMaLichChieuSelect].maLichChieu;
        setData((data) => ({ ...data, maLichChieu }));
    };

    const setNewPhim = (maPhim) => {
        setcurrentPhimPopup(maPhim);
    };
    const menuProps = {
        classes: { paper: classes.menu },
        getContentAnchorEl: null,
        anchorOrigin: {
            vertical: topPopup ? "top" : "bottom",
            horizontal: "left",
        },
        transformOrigin: {
            vertical: topPopup ? "bottom" : "top",
            horizontal: "left",
        },
    };

    if (errorMovieList) {
        return <p>{errorMovieList}</p>;
    }

    return (
        <div className="form-search">
            <div className={classes.search} id="searchTickets">
                <FormControl focused={false} className={classes.itemFirst}>
                    <Autocomplete
                        options={movieRender}
                        getOptionLabel={(option) => option.tenPhim}
                        style={{ width: 300 }}
                        renderInput={(params) => {
                            return (
                                <TextField
                                    {...params}
                                    label="--Select a movie--"
                                    variant="standard"
                                    className={`${classes.textField}`}
                                />
                            );
                        }}
                        renderOption={(phim) => (
                            <CustomPopper
                                key={phim.tenPhim}
                                phim={phim}
                                setNewPhim={setNewPhim}
                                currentPhimPopup={currentPhimPopup}
                                rootElementPopup={data.rootElementPopup}
                            />
                        )}
                        popupIcon={<ExpandMoreIcon />}
                        value={data.setPhim ? data.setPhim : null}
                        onChange={(event, phim) => {
                            handleSelectPhim(phim);
                        }}
                        classes={{
                            popupIndicator: classes.popupIndicator,
                            option: classes.menu__item,
                            listbox: classes.listbox,
                            paper: classes.paper,
                            noOptions: classes.noOptions,
                        }}
                        open={data.openCtr.phim} // control open
                        onClose={handleClosePhim}
                        onOpen={handleOpenPhim}
                        blurOnSelect
                        noOptionsText="Không tìm thấy"
                    />
                </FormControl>

                <FormControl
                    className={`${classes["search__item--next"]} ${classes.search__item}`}
                    focused={false}
                >
                    <Select
                        open={data.openCtr.rap}
                        onClose={handleCloseRap}
                        onOpen={handleOpenRap}
                        onChange={handleSelectRap}
                        value={data.setRap} // tenCumRap
                        renderValue={(value) => `${value ? value : "--select a theater--"}`} // hiển thị giá trị đã chọn
                        displayEmpty
                        IconComponent={ExpandMoreIcon}
                        MenuProps={menuProps}
                    >
                        <MenuItem
                            value=""
                            style={{ display: data.rapRender.length > 0 ? "none" : "block" }}
                            classes={{ root: classes.menu__item }}
                        >
                            {data.setPhim
                                ? `${data.startRequest
                                    ? data.errorCallApi
                                        ? data.errorCallApi
                                        : "Đang tìm rạp"
                                    : "Chưa có lịch chiếu, vui lòng chọn phim khác"
                                }`
                                : "Vui lòng chọn phim"}
                        </MenuItem>
                        {data.rapRender.map((item) => (
                            <MenuItem
                                value={item}
                                key={item}
                                classes={{
                                    root: classes.menu__item,
                                    selected: classes["menu__item--selected"],
                                }}
                            >
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl
                    className={`${classes["search__item--next"]} ${classes.search__item}`}
                    focused={false}
                >
                    <Select
                        open={data.openCtr.ngayXem}
                        onClose={handleCloseNgayXem}
                        onOpen={handleOpenNgayXem}
                        onChange={handleSelectNgayXem}
                        value={data.setNgayXem} // ngayChieu
                        renderValue={(value) => `${value ? value : "--Select a date--"}`}
                        displayEmpty
                        IconComponent={ExpandMoreIcon}
                        MenuProps={menuProps}
                    >
                        <MenuItem
                            value=""
                            style={{
                                display: data.ngayChieuRender.length > 0 ? "none" : "block",
                            }}
                            classes={{ root: classes.menu__item }}
                        >
                            Vui lòng chọn phim và rạp
                        </MenuItem>
                        {data.ngayChieuRender.map((ngayChieu) => (
                            <MenuItem
                                value={ngayChieu}
                                key={ngayChieu}
                                classes={{
                                    root: classes.menu__item,
                                    selected: classes["menu__item--selected"],
                                }}
                            >
                                <div>{formatDate(ngayChieu).dayToday}</div>
                                <div>{formatDate(ngayChieu).dateShort}</div>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl
                    className={`${classes["search__item--next"]} ${classes.search__item}`}
                    focused={false}
                >
                    <Select
                        open={data.openCtr.suatChieu}
                        onClose={handleCloseSuatChieu}
                        onOpen={handleOpenSuatChieu}
                        onChange={handleSelectSuatChieu}
                        value={data.setSuatChieu} // suatChieu
                        renderValue={(value) => `${value ? value : "--Select a showtime--"}`}
                        displayEmpty
                        IconComponent={ExpandMoreIcon}
                        MenuProps={menuProps}
                    >
                        <MenuItem
                            value=""
                            style={{
                                display: data.suatChieuRender.length > 0 ? "none" : "block",
                            }}
                            classes={{ root: classes.menu__item }}
                        >
                            Vui lòng chọn phim, rạp và ngày xem
                        </MenuItem>
                        {data.suatChieuRender.map((suatChieu) => (
                            <MenuItem
                                value={suatChieu}
                                key={suatChieu}
                                classes={{
                                    root: classes.menu__item,
                                    selected: classes["menu__item--selected"],
                                }}
                            >
                                {suatChieu}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl className={classes["search__item--next"]}>
                    <Button
                        disabled={!data.maLichChieu} // khi không có dữ liệu > disabled cần set true
                        classes={{
                            root: classes.btn,
                            disabled: classes.btnDisabled,
                        }}

                        onClick={() =>
                            history.push(
                                `/datve/${data.maLichChieu}`,
                                `/datve/${data.maLichChieu}`
                            )
                        }
                    >
                        <div style={{ textAlign: 'center' }}>BookTicket NOW</div>
                    </Button>
                </FormControl>
            </div>
        </div>
    );
}

SearchStickets.propTypes = {
    smDown: PropTypes.bool,
};

import React, { useEffect, useState, useRef } from "react";

import { DataGrid, GridToolbar, GridOverlay } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Dialog from "@material-ui/core/Dialog";
import AddBoxIcon from "@material-ui/icons/AddBox";
import RenderCellExpand from "./RenderCellExpand";
import slugify from "slugify";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { useStyles, DialogContent, DialogTitle } from "./styles";
import {
    getMovieListManagement,
    deleteMovie,
    updateMovieUpload,
    resetMoviesManagement,
    updateMovie,
    addMovieUpload,
} from "../../reducers/actions/Movie";
import Action from "./Action";
import ThumbnailYoutube from "./ThumbnailYoutube";
import Form from "./Form";

function CustomLoadingOverlay() {
    return (
        <GridOverlay>
            <CircularProgress style={{ margin: "auto" }} />
        </GridOverlay>
    );
}

export default function MoviesManagement() {
    const [movieListDisplay, setMovieListDisplay] = useState([]);
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    let {
        movieList2,
        loadingMovieList2,
        loadingDeleteMovie,
        errorDeleteMovie,
        successDeleteMovie,
        successUpdateMovie,
        errorUpdateMovie,
        loadingUpdateMovie,
        loadingAddUploadMovie,
        successAddUploadMovie,
        errorAddUploadMovie,
        loadingUpdateNoneImageMovie,
        successUpdateNoneImageMovie,
        errorUpdateNoneImageMovie,
    } = useSelector((state) => state.movieReducer);
    const dispatch = useDispatch();
    const newImageUpdate = useRef("");
    const callApiChangeImageSuccess = useRef(false);
    const [valueSearch, setValueSearch] = useState("");
    const clearSetSearch = useRef(0);
    const [openModal, setOpenModal] = React.useState(false);
    const selectedPhim = useRef(null);
    const isMobile = useMediaQuery("(max-width:768px)");
    useEffect(() => {
        if (
            !movieList2 ||
            successUpdateMovie ||
            successUpdateNoneImageMovie ||
            successDeleteMovie ||
            errorDeleteMovie ||
            successAddUploadMovie
        ) {
            dispatch(getMovieListManagement());
        }
    }, [
        successUpdateMovie,
        successUpdateNoneImageMovie,
        successDeleteMovie,
        errorDeleteMovie,
        successAddUploadMovie,
    ]);

    useEffect(() => {
        return () => {
            dispatch(resetMoviesManagement());
        };
    }, []);
    useEffect(() => {
        if (movieList2) {
            let newMovieListDisplay = movieList2.map((movie) => ({
                ...movie,
                hanhDong: "",
                id: movie.maPhim,
            }));
            setMovieListDisplay(newMovieListDisplay);
        }
    }, [movieList2]);

    useEffect(() => {
        if (errorDeleteMovie === "Xóa thành công nhưng backend return error") {
            successDeleteMovie = "Xóa thành công !";
        }
        if (successDeleteMovie) {
            enqueueSnackbar(successDeleteMovie, { variant: "success" });
            return;
        }
        if (errorDeleteMovie) {
            enqueueSnackbar(errorDeleteMovie, { variant: "error" });
        }
    }, [errorDeleteMovie, successDeleteMovie]);

    useEffect(() => {
        if (successUpdateMovie || successUpdateNoneImageMovie) {
            callApiChangeImageSuccess.current = true;
            enqueueSnackbar(
                `Update thành công phim: ${successUpdateMovie.tenPhim ?? ""}${successUpdateNoneImageMovie.tenPhim ?? ""
                }`,
                { variant: "success" }
            );
        }
        if (errorUpdateMovie || errorUpdateNoneImageMovie) {
            callApiChangeImageSuccess.current = false;
            enqueueSnackbar(
                `${errorUpdateMovie ?? ""}${errorUpdateNoneImageMovie ?? ""}`,
                { variant: "error" }
            );
        }
    }, [
        successUpdateMovie,
        errorUpdateMovie,
        successUpdateNoneImageMovie,
        errorUpdateNoneImageMovie,
    ]);

    useEffect(() => {
        if (successAddUploadMovie) {
            enqueueSnackbar(
                `Thêm thành công phim: ${successAddUploadMovie.tenPhim}`,
                { variant: "success" }
            );
        }
        if (errorAddUploadMovie) {
            enqueueSnackbar(errorAddUploadMovie, { variant: "error" });
        }
    }, [successAddUploadMovie, errorAddUploadMovie]);
    const handleDeleteOne = (maPhim) => {
        if (!loadingDeleteMovie) {
            dispatch(deleteMovie(maPhim));
        }
    };
    const handleEdit = (phimItem) => {
        selectedPhim.current = phimItem;
        setOpenModal(true);
    };

    const onUpdate = (movieObj, hinhAnh, fakeImage) => {
        if (loadingUpdateMovie || loadingUpdateNoneImageMovie) {
            return undefined;
        }
        setOpenModal(false);
        newImageUpdate.current = fakeImage;
        if (typeof hinhAnh === "string") {
            const movieUpdate = movieListDisplay.find(
                (movie) => movie.maPhim === fakeImage.maPhim);
            movieObj.hinhAnh = movieUpdate.hinhAnh;
            dispatch(updateMovie(movieObj));
            return undefined;
        }
        dispatch(updateMovieUpload(movieObj));
    };
    const onAddMovie = (movieObj) => {
        if (!loadingAddUploadMovie) {
            dispatch(addMovieUpload(movieObj));
        }
        setOpenModal(false);
    };
    const handleAddMovie = () => {
        const emtySelectedPhim = {
            maPhim: "",
            tenPhim: "",
            biDanh: "",
            trailer: "",
            hinhAnh: "",
            moTa: "",
            maNhom: "",
            ngayKhoiChieu: "",
            danhGia: 10,
        };
        selectedPhim.current = emtySelectedPhim;
        setOpenModal(true);
    };

    const handleInputSearchChange = (props) => {
        clearTimeout(clearSetSearch.current);
        clearSetSearch.current = setTimeout(() => {
            setValueSearch(props);
        }, 500);
    };

    const onFilter = () => {
        let searchMovieListDisplay = movieListDisplay.filter((movie) => {
            const matchTenPhim =
                slugify(movie.tenPhim ?? "", modifySlugify)?.indexOf(
                    slugify(valueSearch, modifySlugify)
                ) !== -1;
            const matchMoTa =
                slugify(movie.moTa ?? "", modifySlugify)?.indexOf(
                    slugify(valueSearch, modifySlugify)
                ) !== -1;
            const matchNgayKhoiChieu =
                slugify(movie.ngayKhoiChieu ?? "", modifySlugify)?.indexOf(
                    slugify(valueSearch, modifySlugify)
                ) !== -1;
            return matchTenPhim || matchMoTa || matchNgayKhoiChieu;
        });
        if (newImageUpdate.current && callApiChangeImageSuccess.current) {
            searchMovieListDisplay = searchMovieListDisplay.map((movie) => {
                if (movie.maPhim === newImageUpdate.current.maPhim) {
                    return { ...movie, hinhAnh: newImageUpdate.current.srcImage };
                }
                return movie;
            });
        }
        return searchMovieListDisplay;
    };

    const columns = [
        {
            field: "maPhim",
            headerName: "Mã phim",
            width: 200,
            headerAlign: "center",
            align: "center",
            headerClassName: "custom-header",
            renderCell: RenderCellExpand,
        },
        {
            field: "hinhAnh",
            headerName: "Hình ảnh",
            width: 200,
            headerAlign: "center",
            align: "center",
            headerClassName: "custom-header",
            renderCell: (params) => RenderCellExpand(params),
        },
        {
            field: "tenPhim",
            headerName: "Tên phim",
            width: 300,
            headerAlign: "center",
            align: "left",
            headerClassName: "custom-header",
            renderCell: RenderCellExpand,
        },
        {
            field: "moTa",
            headerName: "Mô Tả",
            width: 500,
            headerAlign: "center",
            align: "left",
            headerClassName: "custom-header",
            renderCell: RenderCellExpand,
        },
        {
            field: "hanhDong",
            align: "center",
            headerName: "Hành Động",
            width: 200,
            renderCell: (params) => (
                <Action
                    onEdit={handleEdit}
                    onDeleted={handleDeleteOne}
                    phimItem={params.row}
                />
            ),
            headerAlign: "center",
            headerClassName: "custom-header",
        },
        { field: "maNhom", hide: true, width: 130 },
        { field: "biDanh", hide: true, width: 200, renderCell: RenderCellExpand },
    ];
    const modifySlugify = { lower: true, locale: "vi" };
    return (
        <div style={{ height: "100vh", width: "100%", paddingBottom: '150px' }}>
            <div className={classes.control}>
                <div className="">
                    <div className={`${classes.itemCtro}`}>
                        <button
                            variant="contained"
                            color="primary"
                            className={classes.addMovie}
                            onClick={handleAddMovie}
                            disabled={loadingAddUploadMovie}
                            startIcon={<AddBoxIcon />}
                        >
                            Thêm phim
                        </button>
                    </div>
                    <div className={` ${classes.itemCtro}`}>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                size='large'
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                onChange={(evt) => handleInputSearchChange(evt.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <DataGrid
                className={classes.rootDataGrid}
                rows={onFilter()}
                columns={columns}
                pageSize={25}
                rowsPerPageOptions={[10, 25, 50]}
                loading={
                    loadingUpdateMovie ||
                    loadingDeleteMovie ||
                    loadingMovieList2 ||
                    loadingUpdateNoneImageMovie
                }
                components={{
                    LoadingOverlay: CustomLoadingOverlay,
                    Toolbar: GridToolbar,
                }}
                sortModel={[{ field: "tenPhim", sort: "asc" }]}
            />
            <Dialog open={openModal}>
                <DialogTitle onClose={() => setOpenModal(false)}>
                    {selectedPhim?.current?.tenPhim
                        ? `Sửa phim: ${selectedPhim?.current?.tenPhim}`
                        : "Thêm Phim"}
                </DialogTitle>
                <DialogContent dividers>
                    <Form
                        selectedPhim={selectedPhim.current}
                        onUpdate={onUpdate}
                        onAddMovie={onAddMovie}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

import React, { useEffect, useState } from 'react';
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from 'formik'
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import DateFnsUtils from "@date-io/date-fns";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import { ThemeProvider } from "@material-ui/styles";
import FormControl from '@material-ui/core/FormControl';
import { materialTheme } from './styles';
import { useStyles } from './styles';
import theatersApi from '../../api/theatersApi';

export default function FormInput({ selectedPhim, onUpdate, onAddMovie }) {
    const classes = useStyles();
    const [srcImage, setSrcImage] = useState(selectedPhim?.hinhAnh)
    const [base64Img, setBase64Img] = useState(selectedPhim?.hinhAnh)
    const [listTheater, setListTheater] = useState([]);
    const [roomData, setRoomData] = useState({
        maTheLoai: null,
      });
    useEffect(() => {
        theatersApi.getThongTinCuaTheLoaiPhim().then(response => {
            setListTheater(response.data)
        })
    }, [])
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRoomData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

    const setThumbnailPreviews = (e) => {
        let file = e.target;
        var reader = new FileReader();
        reader.readAsDataURL(file.files[0]);
        reader.onload = function () { // sau khi thực hiên xong lênh trên thì set giá trị có được
            setSrcImage(reader.result)
        };
    }

    const movieSchema = yup.object().shape({
        tenPhim: yup.string().required("*Không được bỏ trống!"),
        daoDien: yup.string().required("*Không được bỏ trống!"),
        dienVien: yup.string().required("*Không được bỏ trống!"),
        dinhDang: yup.string().required("*Không được bỏ trống!"),
        quocGiaSX: yup.string().required("*Không được bỏ trống!"),
        trailer: yup.string().required("*Không được bỏ trống!").matches(/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/, "*Sai link youtube"),
        hinhAnh: yup.string().required("*Chưa chọn hình!"),
        moTa: yup.string().required("*Không được bỏ trống!").min(100, "Mô tả cần 100 ký tự trở lên!"),
        ngayKhoiChieu: yup.string().required("*Chưa chọn ngày!"),
        danhGia: yup.number().required("*Không được bỏ trống!").min(0, "*Điểm đánh giá phải từ 0 đến 10").integer("*Điểm đánh giá phải từ 0 đến 10").max(10, "*Điểm đánh giá phải từ 0 đến 10"),
    })

    const handleSubmit = (movieObj) => {
        let hinhAnh = movieObj.hinhAnh
        let fakeImage = { srcImage, maPhim: movieObj.maPhim }
        var ngayKC = addHours(movieObj.ngayKhoiChieu, 7);
        movieObj = { ...movieObj, ngayKhoiChieu: ngayKC }
        movieObj.hinhAnh = base64Img;
        
        if (selectedPhim.maPhim) {
            movieObj.maTheLoaPhim = roomData.maTheLoai;
            onUpdate(movieObj, hinhAnh, fakeImage)
            return
        }
        const newMovieObj = { ...movieObj }
        newMovieObj.maTheLoaiPhim = roomData.maTheLoai;
        delete newMovieObj.maPhim
        delete newMovieObj.biDanh
        delete newMovieObj.danhGia
        console.log(newMovieObj)
        onAddMovie(newMovieObj)
    }

    function addHours(date, hours) {
        date.setTime(date.getTime() + hours * 60 * 60 * 1000);

        return date;
    }

    const getBase64 = (file) => {
        return new Promise(resolve => {
            let fileInfo;
            let baseURL = "";
            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // on reader load somthing...
            reader.onload = () => {
                // Make a fileInfo Object
                console.log("Called", reader);
                baseURL = reader.result;
                console.log(baseURL);
                resolve(baseURL);
            };
            console.log(fileInfo);
        });
    };

    const handleFileInputChange = (e) => {
        getBase64(e.target.files[0])
            .then(result => {
                setBase64Img(result);
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <Formik
            initialValues={{
                maPhim: selectedPhim.maPhim,
                tenPhim: selectedPhim.tenPhim,
                biDanh: selectedPhim.biDanh,
                trailer: selectedPhim.trailer,
                hinhAnh: selectedPhim.hinhAnh,
                daoDien: selectedPhim.daoDien,
                dienVien: selectedPhim.dienVien,
                dinhDang: selectedPhim.dinhDang,
                quocGiaSX: selectedPhim.quocGiaSX,
                moTa: selectedPhim.moTa,
                maNhom: 'GP09',
                ngayKhoiChieu: selectedPhim?.ngayKhoiChieu ? new Date(selectedPhim.ngayKhoiChieu) : new Date(),
                danhGia: selectedPhim.danhGia,
            }}
            validationSchema={movieSchema}
            onSubmit={handleSubmit}
        >{(formikProp) => (
            <Form >
                <div className="form-group">
                    <label>Tên phim&nbsp;</label>
                    <ErrorMessage name="tenPhim" render={msg => <span className="text-danger">{msg}</span>} />
                    <Field name="tenPhim" className="form-control" />
                </div>
                <div className="form-group">
                    <label>Trailer&nbsp;</label>
                    <ErrorMessage name="trailer" render={msg => <span className="text-danger">{msg}</span>} />
                    <Field name="trailer" className="form-control" />
                </div>
                <div className="form-group">
                    <label>Hình ảnh&nbsp;</label>
                    <ErrorMessage name="hinhAnh" render={msg => <span className="text-danger">{msg}</span>} />
                    <div className="form-row">
                        <div className="col-2">
                            {srcImage ? <img src={srcImage} id="image-selected" alt="movie" className="img-fluid rounded" /> : <ImageOutlinedIcon style={{ fontSize: 60 }} />}
                        </div>
                        <div className="col-10">
                            <input type="file" name="hinhAnh" accept=".jpg,.png" className="form-control" onChange={(e) => {
                                formikProp.setFieldValue("hinhAnh", e.currentTarget.files[0])
                                setThumbnailPreviews(e)
                                handleFileInputChange(e)
                            }} />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label>Đạo diễn&nbsp;</label>
                    <ErrorMessage name="daoDien" render={msg => <span className="text-danger">{msg}</span>} />
                    <Field as="textarea" name="daoDien" className="form-control" />
                </div>
                <div className="form-group">
                    <label>Diễn viên&nbsp;</label>
                    <ErrorMessage name="dienVien" render={msg => <span className="text-danger">{msg}</span>} />
                    <Field as="textarea" name="dienVien" className="form-control" />
                </div>
                <div className="form-group">
                    <label>Dinh dạng&nbsp;</label>
                    <ErrorMessage name="dinhDang" render={msg => <span className="text-danger">{msg}</span>} />
                    <Field as="textarea" name="dinhDang" className="form-control" />
                </div>
                <div className="form-group">
                    <label>Quốc Gia SX&nbsp;</label>
                    <ErrorMessage name="quocGiaSX" render={msg => <span className="text-danger">{msg}</span>} />
                    <Field as="textarea" name="quocGiaSX" className="form-control" />
                </div>
                <div className="form-group">
                    <label>Mô tả&nbsp;</label>
                    <ErrorMessage name="moTa" render={msg => <span className="text-danger">{msg}</span>} />
                    <Field as="textarea" name="moTa" className="form-control" />
                </div>
                <div className="form-group">
                    <label>Thể Loại Phim&nbsp;</label>
                    <select
                        className="form-control"
                        name="maTheLoai"
                        aria-label="Default select example"
                        value={roomData.maTheLoai}
                        onChange={handleInputChange}
                    >
                        <option>--Chọn Thể Loại Phim--</option>
                        {listTheater.map(system => (
                            <option key={system.id} value={system.id}>{system.tenTheLoai}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Ngày khởi chiếu&nbsp;</label>
                    <ErrorMessage name="ngayKhoiChieu" render={msg => <span className="text-danger">{msg}</span>} />
                    <FormControl className={classes.formControl} focused={false}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <ThemeProvider theme={materialTheme}>
                                <KeyboardDatePicker
                                    value={formikProp.values.ngayKhoiChieu}
                                    onChange={date => formikProp.setFieldValue('ngayKhoiChieu', date)}
                                    format="yyyy-MM-dd"
                                />
                            </ThemeProvider>
                        </MuiPickersUtilsProvider>
                    </FormControl>
                </div>
                <div className="form-group" hidden={selectedPhim.maPhim ? false : true}>
                    <label>Đánh giá&nbsp;</label>
                    <ErrorMessage name="danhGia" render={msg => <span className="text-danger">{msg}</span>} />
                    <Field name="danhGia" type="number" className="form-control" />
                </div>
                <button type="submit" className="form-control">Submit</button>
            </Form>
        )}</Formik>
    )
}

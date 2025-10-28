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
    const [selectedCinemaSystem, setSelectedCinemaSystem] = useState(null);
    const [cinemaClusters, setCinemaClusters] = useState([]);
    const [heThongRap, setHeThongRap] = useState([]);
    const [roomData, setRoomData] = useState({
        cumRap: '',
      });

    console.log("Mã Cụm Rạp", roomData.cumRap)

    useEffect(() => {
        theatersApi.getThongTinHeThongRap().then(response => {
            setHeThongRap(response.data);
        })
    }, [])

    useEffect(() => {
        // Gọi API để lấy danh sách cụm rạp tương ứng với Hệ Thống Rạp đã chọn
        if (selectedCinemaSystem) {
            theatersApi.getListCumRapTheoHeThong(selectedCinemaSystem)
                .then((clusters) => {
                    console.log(clusters)
                    setCinemaClusters(clusters.data);
                })
                .catch((error) => {
                    console.log('Error fetching cinema clusters:', error);
                });
        } else {
            // Nếu không có Hệ Thống Rạp được chọn, đặt danh sách cụm rạp về trạng thái ban đầu
            setCinemaClusters([]);
        }
    }, [selectedCinemaSystem]);

    const movieSchema = yup.object().shape({
        tenRap: yup.string().required("*Không được bỏ trống!"),
    })

    const handleCinemaSystemChange = (event) => {
        const selectedSystem = event.target.value;
        setSelectedCinemaSystem(selectedSystem);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRoomData(prevState => ({
          ...prevState,
          [name]: value
        }));
      };

    const handleSubmit = (movieObj) => {
        if (selectedPhim.maRap) {
            movieObj.maRap = selectedPhim.maRap
            onUpdate(movieObj);
            console.log("Update", movieObj)
            return;
          }
      
          const newMovieObj = { ...movieObj };
          
          // Thêm dữ liệu của hid vào newMovieObj
          newMovieObj.maCumRap = roomData.cumRap;
          console.log(newMovieObj);
          onAddMovie(newMovieObj);
    }




    return (
        <Formik
            initialValues={{
                tenRap: selectedPhim.tenRap,
            }}
            validationSchema={movieSchema}
            onSubmit={handleSubmit}
        >{(formikProp) => (
            <Form >
                {selectedPhim.maRap ? <>
                </> : <>
                <div className="form-group">
                    <label>Hệ Thống Rạp&nbsp;</label>
                    <select
                        className="form-control"
                        aria-label="Default select example"
                        onChange={handleCinemaSystemChange}
                    >
                        <option>--Chọn Hệ Thống Rạp--</option>
                        {heThongRap.map(system => {
                            return <option key={system.hid} value={system.maHeThongRap}>{system.tenHeThongRap}</option>
                        })}
                    </select>

                </div>
                </>}

                {selectedCinemaSystem && (
                    <div className="form-group">
                        <label>Cụm Rạp&nbsp;</label>
                        <select className="form-control" name='cumRap'
                            value={roomData.cumRap}
                            onChange={handleInputChange}
                            aria-label="Default select example">
                            <option>--Chọn Cụm Rạp--</option>
                            {cinemaClusters?.map((cluster) => (

                                <option key={cluster.maCumRap} value={cluster.maCumRap}>
                                    {cluster.tenCumRap}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="form-group">
                    <label>Tên Rạp&nbsp;</label>
                    <ErrorMessage name="tenRap" render={msg => <span className="text-danger">{msg}</span>} />
                    <Field name="tenRap" className="form-control" />
                </div>
                <button type="submit" className="form-control">Submit</button>
            </Form>
        )
            }</Formik >
    )
}

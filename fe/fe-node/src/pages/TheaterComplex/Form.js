import React, { useState } from 'react';
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { useStyles } from './styles';

export default function FormInput({ selectedPhim, onUpdate, onAddMovie, listCinemaSystem }) {
    const classes = useStyles();
  
    const [roomData, setRoomData] = useState({
      tenHeThongRap: '',
    });
  
    const movieSchema = yup.object().shape({
      tenCumRap: yup.string().required("*Không được bỏ trống!"),
      diaChi: yup.string().required("*Không được bỏ trống!"),
      maCumRap: yup.string().required("*Không được bỏ trống!"),
    });
  
    const handleSubmit = (movieObj) => {
      if (selectedPhim.tenCumRap) {
        onUpdate(movieObj);
        console.log("Update")
        return;
      }
  
      const newMovieObj = { ...movieObj };
      // Lấy giá trị của tenHeThongRap từ roomData
      const selectedSystem = listCinemaSystem.find(system => system.hid === roomData.tenHeThongRap);
      const hid = selectedSystem ? selectedSystem.hid : '';
      
      // Thêm dữ liệu của hid vào newMovieObj
      newMovieObj.hid = roomData.tenHeThongRap;
      console.log(newMovieObj);
      onAddMovie(newMovieObj);
    };
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setRoomData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
  
    console.log(roomData.tenHeThongRap);
  
    return (
      <Formik
        initialValues={{
          maCumRap: selectedPhim.maCumRap,
          tenCumRap: selectedPhim.tenCumRap,
          diaChi: selectedPhim.diaChi,
        }}
        validationSchema={movieSchema}
        onSubmit={handleSubmit}
      >
        {(formikProp) => (
          <Form>
            <div className="form-group">
              <label>Mã Cụm Rạp&nbsp;</label>
              <ErrorMessage name="maCumRap" render={msg => <span className="text-danger">{msg}</span>} />
              <Field name="maCumRap" className="form-control" />
            </div>
            <div className="form-group">
              <label>Tên Cụm Rạp&nbsp;</label>
              <ErrorMessage name="tenCumRap" render={msg => <span className="text-danger">{msg}</span>} />
              <Field name="tenCumRap" className="form-control" />
            </div>
            <div className="form-group">
              <label>Địa Chỉ&nbsp;</label>
              <ErrorMessage name="diaChi" render={msg => <span className="text-danger">{msg}</span>} />
              <Field name="diaChi" className="form-control" />
            </div>
            {selectedPhim.tenCumRap ? <></> : <>
            <div className="form-group">
              <label>Hệ Thống Rạp&nbsp;</label>
              <select
                className="form-control"
                name="tenHeThongRap"
                aria-label="Default select example"
                value={roomData.tenHeThongRap}
                onChange={handleInputChange}
              >
                <option>--Chọn Hệ Thống Rạp--</option>
                {listCinemaSystem.map(system => (
                  <option key={system.hid} value={system.hid}>{system.tenHeThongRap}</option>
                ))}
              </select>
            </div>
            </>}
            <button type="submit" className="form-control">Submit</button>
          </Form>
        )}
      </Formik>
    );
  }


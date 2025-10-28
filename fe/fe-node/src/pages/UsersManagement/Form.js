import React from 'react';
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from 'formik'

export default function FormInput({ selectedNguoiDung, onUpdate }) {
    const nguoiDungSchema = yup.object().shape({
        hoTen: yup.string().required("*Không được bỏ trống!"),
        maLoaiNguoiDung: yup.string().required("*Không được bỏ trống!"),
    })

    const handleSubmit = (nguoiDungObj) => {
        if (selectedNguoiDung.taiKhoan) {
            onUpdate(nguoiDungObj)
            return
        }
    }

    return (
        <Formik
            initialValues={{
                taiKhoan: selectedNguoiDung.taiKhoan,
                matKhau: "",
                email: selectedNguoiDung.email,
                soDt: selectedNguoiDung.soDt,
                maNhom: selectedNguoiDung.maNhom,
                maLoaiNguoiDung: selectedNguoiDung.maLoaiNguoiDung ? "QuanTri" : "KhachHang",
                hoTen: selectedNguoiDung.hoTen,
            }}
            validationSchema={nguoiDungSchema}
            onSubmit={handleSubmit}
        >{(formikProp) => (
            <Form >
                <div className="form-group">
                    <label>Tài khoản&nbsp;</label>
                    <Field name="taiKhoan" className="form-control" readOnly={true} />
                </div>
                <div className="form-group">
                    <label>Mật khẩu&nbsp;</label>
                    <ErrorMessage name="matKhau" render={msg => <span className="text-danger">{msg}</span>} />
                    <Field name="matKhau" className="form-control" />
                </div>
                <div className="form-group">
                    <label>Email&nbsp;</label>
                    <Field name="email" className="form-control" readOnly={true} />
                </div>
                <div className="form-group">
                    <label>Số ĐT&nbsp;</label>
                    <Field name="soDt" className="form-control" readOnly={true} />
                </div>
                <div className="form-group">
                    <label>Mã nhóm&nbsp;</label>
                    <Field name="maNhom" className="form-control" readOnly={true} />
                </div>
                <div className="form-group">
                    <label>Mã loại người dùng&nbsp;</label>
                    <ErrorMessage name="maLoaiNguoiDung" render={msg => <span className="text-danger">{msg}</span>} />
                    <Field as="select" name="maLoaiNguoiDung" className="form-control">
                        <option value="" disabled>
                            -- Chọn loại người dùng --
                        </option>
                        <option value="QuanTri">Quản trị</option>
                        <option value="KhachHang">Khách hàng</option>
                    </Field>
                </div>
                <div className="form-group">
                    <label>Họ tên&nbsp;</label>
                    <ErrorMessage name="hoTen" render={msg => <span className="text-danger">{msg}</span>} />
                    <Field as="textarea" name="hoTen" className="form-control" />
                </div>
                <button type="submit" className="form-control">Submit</button>
            </Form>
        )}</Formik>
    )
}
import React, { useEffect, useState, useRef } from "react";
import usersApi from "../../api/usersApi";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const Invoice = () => {
  const [datVeDaDat, setDatVeDaDat] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Đọc giá trị của các tham số
  const maghe = searchParams.get("maghe");
  const taiKhoan = searchParams.get("taiKhoan");

  useEffect(() => {
    usersApi
      .getVe(taiKhoan, maghe)
      .then((result) => {
        console.log("RESULT", result);
        console.log(result.data);
        setDatVeDaDat(result.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [taiKhoan, maghe]);

  console.log(datVeDaDat);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <>
        <table ref={componentRef} align="center" className="table">
      <tbody>
        <tr>
          <td style={{ backgroundColor: "#ffffff", padding: "40px 30px" }}>
            <h3 style={{ textAlign: "center" }}>Hóa đơn vé xem phim!</h3>
            <p style={{ textAlign: "center" }}>
              Cảm ơn bạn đã ủng hộ chúng tôi. Chúng tôi luôn luôn đồng hành cùng trải nghiệm của quý khách.
            </p>
            <hr />
            {datVeDaDat && (
              <>
                <div className="text-left">
                  <p>
                    <b>Tên tài khoản:</b> {datVeDaDat[0].tenTaiKhoan}
                  </p>
                  <p>
                    <b>Tên Rạp:</b> {datVeDaDat[0].tenRap}
                  </p>
                  <p>
                    <b>Địa Chỉ:</b> {datVeDaDat[0].diaChi}
                  </p>
                  <p>
                    <b>Giờ chiếu:</b> {datVeDaDat[0].gioChieu}
                  </p>
                  <p>
                    <b>Mã Ghế:</b> {datVeDaDat[0].tenDayDu}
                  </p>
                </div>
                <hr />
                <table
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  width="100%"
                  style={{ borderCollapse: "collapse" }}
                >
                
                  <tbody>
                    <tr>
                      <td style={{ width: "95px" }} className="content">
                        <b>{datVeDaDat[0].ngayChieu}</b>
                      </td>
                      <td style={{ width: "179px" }} className="content">
                        <p>
                          <b>{datVeDaDat[0].tenPhim}</b>
                        </p>
                      </td>
                      <td style={{ width: "54px" }} className="content">
                        {datVeDaDat[0].giaVe} VNĐ
                      </td>
                    </tr>
                  </tbody>
                </table>
                <hr />
                <h3>Giá: {datVeDaDat[0].giaVe} VNĐ</h3>
              </>
            )}
          </td>
        </tr>
      </tbody>
    </table>

    <button style={{margin: " 20px 20px 20px 20px"}} className="btn btn-success" onClick={handlePrint}>In hóa đơn</button>
    </>


    
  );
};

export default Invoice;
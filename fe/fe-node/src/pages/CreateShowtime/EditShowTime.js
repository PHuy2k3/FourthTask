import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookTicketApi from "../../api/bookingApi";
import { useHistory } from "react-router-dom";

function EditShowTime() {
    const history = useHistory();
    const { maLichChieu } = useParams();
    const [time, setTime] = useState(""); // State for time
    const [gia, setGia] = useState(""); // State for gia

    useEffect(() => {
        BookTicketApi.getLichChieuByMaLichChieu(maLichChieu).then(res => {
            console.log(res);
            // Set the time and gia values here
            setTime(res.data[0].ngayChieuGioChieu);
            setGia(res.data[0].giaVe);
            console.log(res.data[0].ngayChieuGioChieu, res.data[0].giaVe, res.data)
        }).catch(error => {
            console.log(error);
        });
    }, [maLichChieu]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Perform the submit logic here
        BookTicketApi.editLichChieuByMaLichChieu(maLichChieu, time, gia);
        setTimeout(() => {
            history.push("/admin/showtimes");
            setTimeout(() => {
                window.location.reload();
            }, 500); // Optional delay before reloading the page (500 milliseconds in this example)
        }, 1000);
    };

    return (
        <>
            <div style={{ height: "100vh", paddingBottom: "400px", width: "100%" }}>
                <div style={{ marginTop: "40px", marginLeft: "40px", marginRight: "40px" }}>
                    <h2>Sửa lịch chiếu : {maLichChieu}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Thời gian chiếu</label>
                            <input type="datetime-local" className="form-control" 
                            value={time || ''} 
                            onChange={e => setTime(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Giá vé</label>
                            <select className="form-control" name="gia" aria-label="Default select example" value={gia} onChange={e => setGia(e.target.value)}>
                                <option value="">--Chọn giá--</option>
                                <option value="35000" selected={gia === 35000}>35,000 vnđ</option>
                                <option value="40000" selected={gia === 40000}>40,000 vnđ</option>
                                <option value="50000" selected={gia === 50000}>50,000 vnđ</option>
                                <option value="75000" selected={gia === 75000}>75,000 vnđ</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Sửa</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default EditShowTime;
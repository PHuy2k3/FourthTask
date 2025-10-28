import React, { useEffect, useState } from "react";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import Fade from "@material-ui/core/Fade";
import AppBar from "@material-ui/core/AppBar";
import Rating from "@material-ui/lab/Rating";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { useLocation, useHistory } from "react-router-dom";
import { scroller } from "react-scroll";
import CircularProgress from "@material-ui/core/CircularProgress";

import { FAKE_AVATAR, UNKNOW_USER } from "../../../constants/config";
import useStyles from "./style";
import scroll from "../../../utilities/scroll";
import LichChieuDesktop from "./LichChieuDesktop";
import LichChieuMobile from "./LichChieuMobile";

import { selectCommentByMaPhimAndCommentTest } from "../../../reducers/selector/MovieDetail";
import formatDate from "../../../utilities/formatDate";
import moment from "moment";
import "moment/locale/vi";
moment.locale("vi");

function TabPanel(props) {
  const { isMobile, children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      <Box p={isMobile && index === 0 ? 0 : 3}>{children}</Box>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function CenteredTabs({
  data,
  onClickBtnMuave,
  isMobile,
  onIncreaseQuantityComment,
}) {
  const param = useParams(); // mã phim lấy từ url trên trình duyệt
  const { currentUser } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  let location = useLocation();
  const history = useHistory();
  const [valueTab, setValueTab] = useState(0);
  const [croll, setCroll] = useState(0);
  const [openComment, setOpenComment] = useState(false);
  const [warningtext, setwarningtext] = useState(false);
  const [dataComment, setdataComment] = useState({
    avtId: currentUser?.taiKhoan,
    username: currentUser?.hoTen,
    point: 2.5,
    post: "",
    likes: 0,
    maPhim: param.maPhim,
    dataTest: false,
    createdAt: "",
    userLikeThisComment: [],
  });
  const classes = useStyles({ isMobile });

  useEffect(() => {
    window.scrollTo(0, 0); 
    setValueTab(() => 0);
    setCroll(() => onClickBtnMuave);
  }, [onClickBtnMuave]); 

  useEffect(() => {
    if (onClickBtnMuave !== 0) {
      scroll("TapMovieDetail");
    }
  }, [croll]); 
  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };
  const handletyping = (event) => {
    if (event.target.value.length >= 61) {
      setwarningtext(false);
    }
    setdataComment((data) => ({ ...data, post: event.target.value }));
  };
  const handleClose = () => {
    setOpenComment(false);
  };
  const isLogin = () => {
    if (!currentUser) {
      Swal.fire({
        title: "Bạn cần phải đăng nhập",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Không",
      }).then((result) => {
        if (result.isConfirmed) {
          history.push("/login", location.pathname);
        }
      });
    }
  };
  const handleClickComment = () => {
    if (!currentUser) {
      isLogin();
      return;
    }
    setOpenComment(true);
    setwarningtext(false);
  };

  return (
    <div className={classes.root} id="TapMovieDetail">
      <AppBar
        position="static"
        color="default"
        classes={{ root: classes.appBarRoot }}
      >
        <Tabs
          value={valueTab}
          onChange={handleChange}
          centered
          classes={{ indicator: classes.indicator }}
        >
          {(!location.state?.comingMovie ? true : "") && (
            <Tab
              disableRipple
              label="Lịch Chiếu"
              classes={{ selected: classes.selectedTap, root: classes.tapRoot }}
            />
          )}
        </Tabs>
      </AppBar>
      <Fade
        timeout={400}
        in={valueTab === (location.state?.comingMovie ? "hide" : 0)}
      >
        <TabPanel
          value={valueTab}
          index={location.state?.comingMovie ? "hide" : 0}
          isMobile={isMobile}
        >
          {isMobile ? <LichChieuMobile /> : <LichChieuDesktop data={data} />}
        </TabPanel>
      </Fade>
      <Fade
        timeout={400}
        in={valueTab === (location.state?.comingMovie ? 0 : 1)}
      >
        <TabPanel
          value={valueTab}
          index={location.state?.comingMovie ? 0 : 1}
          className={classes.noname}
        >
          <div className={`row text-white ${classes.detailMovie}`}>
            <div className="col-sm-6 col-xs-12">
              <div className="row mb-2">
                <p className={`float-left ${classes.contentTitle}`}>
                  Ngày công chiếu
                </p>
                <p className={`float-left ${classes.contentInfo}`}>
                  {formatDate(data.ngayKhoiChieu?.slice(0, 10)).YyMmDd}
                </p>
              </div>
              <div className="row mb-2">
                <p className={`float-left ${classes.contentTitle}`}>Đạo diễn</p>
                <p className={`float-left ${classes.contentInfo}`}>
                  {" "}
                  Adam Wingard{" "}
                </p>
              </div>
              <div className="row mb-2">
                <p className={`float-left ${classes.contentTitle}`}>
                  Diễn viên
                </p>
                <p className={`float-left ${classes.contentInfo}`}>
                  Kyle Chandler, Rebecca Hall, Eiza González, Millie Bobby Brown
                </p>
              </div>
              <div className="row mb-2">
                <p className={`float-left ${classes.contentTitle}`}>Thể Loại</p>
                <p className={`float-left ${classes.contentInfo}`}>
                  hành động, giả tưởng, ly kỳ, thần thoại
                </p>
              </div>
              <div className="row mb-2">
                <p className={`float-left ${classes.contentTitle}`}>
                  Định dạng
                </p>
                <p className={`float-left ${classes.contentInfo}`}>
                  2D/Digital
                </p>
              </div>
              <div className="row mb-2">
                <p className={`float-left ${classes.contentTitle}`}>
                  Quốc Gia SX
                </p>
                <p className={`float-left ${classes.contentInfo}`}>Mỹ</p>
              </div>
            </div>
            <div className="col-sm-6 col-xs-12">
              <div className="row mb-2">
                <p className={`float-left ${classes.contentTitle}`}>Nội dung</p>
              </div>
              <div className="row mb-2">
                <p>{data.moTa}</p>
              </div>
            </div>
          </div>
        </TabPanel>
      </Fade>
      <Fade
        timeout={400}
        in={valueTab === (location.state?.comingMovie ? 1 : 2)}
      >
        <TabPanel
          value={valueTab}
          index={location.state?.comingMovie ? 1 : 2}
          className={classes.noname}
        >
          <div className={classes.danhGia}>
            <div className={classes.inputRoot} onClick={handleClickComment}>
              <span className={classes.avatarReviewer}>
                <img
                  src={currentUser ? FAKE_AVATAR : UNKNOW_USER}
                  alt="avatar"
                  className={classes.avatarImg}
                />
              </span>
              <input
                className={classes.inputReviwer}
                type="text"
                placeholder="Bạn nghĩ gì về phim này?"
                readOnly="readonly"
              />

              <span className={classes.imgReviewerStar}>
                <Rating
                  value={5}
                  size={isMobile ? "small" : "medium"}
                  readOnly
                />
              </span>
            </div>
          </div>
          <div
            className="text-center mb-2 text-white"
          >
            <CircularProgress size={20} color="inherit" />
          </div>
          <div className={classes.moreMovie}>
            <Button
              variant="outlined"
              className={classes.moreMovieButton}
            >
              XEM THÊM
            </Button>
          </div>
        </TabPanel>
      </Fade>

      <Dialog
        open={openComment}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        className={classes.dialog}
      >
        <MuiDialogTitle disableTypography className={classes.rootcloseButton}>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </MuiDialogTitle>
        <Grid container direction="column" justify="center" alignItems="center">
          <span className={classes.pointPopup}>{dataComment.point * 2}</span>
          <Rating
            name="customStar"
            size="large"
            precision={0.5}
            value={dataComment.point}
            className={classes.starPopup}
            emptyIcon={<StarBorderIcon fontSize="inherit" />}
            onChange={(event, newValue) => {
              setdataComment((data) => ({ ...data, point: newValue }));
            }}
          />
        </Grid>
        <DialogContent className={classes.dialogContent}>
          <TextField
            className={classes.textField}
            onChange={(event) => handletyping(event)}
            fullWidth
            value={dataComment.post}
            variant="outlined"
            label={
              dataComment.post
                ? ""
                : "Nói cho mọi người biết bạn nghĩ gì về phim này..."
            }
          />
        </DialogContent>
        <DialogActions className="justify-content-center flex-column px-4">
          {warningtext && (
            <DialogContentText className="text-danger">
              Phim đem đến cảm xúc tuyệt vời cho bạn chứ? Chia sẻ thêm nữa đi
              bạn ơi và nhớ gõ trên 60 kí tự nhé.
            </DialogContentText>
          )}
          <Button
            variant="contained"
            className={classes.btnDang}
          >
            Đăng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
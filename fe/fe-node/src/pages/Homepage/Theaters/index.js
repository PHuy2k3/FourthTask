import React from "react";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useSelector } from "react-redux";
import { useTheme } from "@material-ui/core/styles";

import LstCumRap from "./LstCumRap";
import useStyles from "./style";
import { underLine } from "../../../styles/materialUi";
import { colorTheater } from "../../../constants/theaterData";
import MobileLstCumrap from "./MobileLstCumrap";

export default function HeThongRap() {
  const theme = useTheme();
  const isMobileTheater = useMediaQuery(theme.breakpoints.down("sm"));
  const { theaterList, errorTheaterList } = useSelector(
    (state) => state.theaterReducer
  );
  const [valueHeThongRap, setValueHeThongRap] = React.useState(0);
  const classes = useStyles({ isMobileTheater, underLine });

  const handleChange = (_, newValue) => {
    setValueHeThongRap(newValue);
  };

  const hasTheaters = Array.isArray(theaterList) && theaterList.length > 0;

  if (errorTheaterList) {
    return <div>{errorTheaterList}</div>;
  }

  if (!hasTheaters) {
    return (
      <div className={classes.emptyState}>
        <Typography variant="h6" component="p" color="textSecondary">
          Không tìm thấy thông tin hệ thống rạp.
        </Typography>
      </div>
    );
  }

  const tabProps = (index) => ({
    id: `theater-tab-${index}`,
    "aria-controls": `theater-tabpanel-${index}`,
  });

  const renderTabLabel = (theater) => {
    const primaryBranch = theater.lstCumRap?.[0];

    return (
      <div className={classes.tabLabel}>
        <img
          className={classes.tabLogo}
          src={theater.logo}
          alt={theater.tenHeThongRap || "theaterLogo"}
        />
        <div className={classes.tabText}>
          <Typography component="span" className={classes.tabName}>
            {theater.tenHeThongRap}
          </Typography>
          {primaryBranch?.tenCumRap && (
            <Typography component="span" className={classes.tabMeta}>
              {primaryBranch.tenCumRap}
            </Typography>
          )}
          {primaryBranch?.diaChi && (
            <Typography component="span" className={classes.tabAddress}>
              {primaryBranch.diaChi}
            </Typography>
          )}
        </div>
      </div>
    );
  };

  return (
    <div id="cumrap">
      <div className={`${classes.theater} calendar`}>
        <Tabs
          variant={isMobileTheater ? "scrollable" : "standard"}
          scrollButtons="on"
          orientation={isMobileTheater ? "horizontal" : "vertical"}
          value={valueHeThongRap}
          onChange={handleChange}
          aria-label="Danh sách hệ thống rạp"
          classes={{ indicator: classes.tabs__indicator, root: classes.taps }}
          TabIndicatorProps={{ children: <span /> }}
        >
          {theaterList.map((theater, index) => (
            <Tab
              disableRipple
              classes={{
                root: classes.tap,
                selected: classes.tapSelected,
                wrapper: classes.tabWrapper,
              }}
              key={theater.maHeThongRap}
              {...tabProps(index)}
              label={renderTabLabel(theater)}
            />
          ))}
        </Tabs>
        {theaterList.map((theater, index2) => (
          <div
            hidden={valueHeThongRap !== index2}
            key={theater.maHeThongRap}
            role="tabpanel"
            id={`theater-tabpanel-${index2}`}
            aria-labelledby={`theater-tab-${index2}`}
            className={classes.cumRap}
          >
            {isMobileTheater ? (
              <MobileLstCumrap lstCumRap={theater.lstCumRap} />
            ) : (
              <LstCumRap
                lstCumRap={theater.lstCumRap}
                color={
                  colorTheater[
                    (theater.lstCumRap && theater.lstCumRap.length > 0 ? theater.lstCumRap[0].tenCumRap.slice(0, 3).toUpperCase() : "")
                  ]
                }
                maHeThongRap={theater.maHeThongRap}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
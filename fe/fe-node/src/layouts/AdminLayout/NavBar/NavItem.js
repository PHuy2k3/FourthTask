import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Button,
  ListItem,
  makeStyles
} from '@material-ui/core';
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';
import { useLocation, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    position: "relative",
    zIndex: 1201,
  },
  button: {
    color: 'rgba(226, 232, 240, 0.72)',
    fontWeight: 500,
    justifyContent: 'flex-start',
    letterSpacing: '0.01em',
    padding: theme.spacing(1.5, 2),
    textTransform: 'none',
    width: '100%',
    borderRadius: theme.spacing(2),
    transition: 'all .3s ease',
    fontSize: '0.95rem',
    '&:hover': {
      color: '#f8fafc',
      background: 'rgba(148, 163, 184, 0.16)',
      boxShadow: '0 20px 35px -22px rgba(148, 163, 184, 0.6)',
    }
  },
  icon: {
    marginRight: theme.spacing(1.5),
    color: 'rgba(148, 163, 184, 0.7)',
    transition: 'color .3s ease',
  },
  title: {
    marginRight: 'auto'
  },
  active: {
    color: '#f8fafc !important',
    fontWeight: 600,
    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.24) 0%, rgba(139, 92, 246, 0.22) 100%)',
    boxShadow: '0 24px 50px -30px rgba(59, 130, 246, 0.75)',
    '& $icon': {
      color: '#60a5fa !important',
    }
  }
}));

const NavItem = ({
  className,
  href,
  icon: Icon,
  title,
  ...rest
}) => {
  const isExistUserModified = useSelector((state) => state.usersManagementReducer.isExistUserModified);
  const classes = useStyles();
  const history = useHistory();
  let location = useLocation();
  const onChangePageManagement = () => {
    if (isExistUserModified && location.pathname === "/admin/users" && href !== "/admin/users") {
      Swal.fire({
        title: 'Dữ liệu đã chỉnh sửa sẽ bị mất khi chuyển trang?',
        text: "Bạn không thể hoàn nguyên!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Chuyển trang!',
        cancelButtonText: 'Ở lại!'
      }).then((result) => {
        if (result.isConfirmed) {
          history.push(href);
        }
      })
    } else {
      history.push(href);
    }
  }
  return (
    <ListItem
      className={clsx(classes.item, className)}
      disableGutters
      {...rest}
    >
      <Button
        className={clsx(classes.button, location.pathname === href && classes.active)}
        onClick={onChangePageManagement}
      >
        {Icon && (
          <Icon
            className={classes.icon}
            size="20"
          />
        )}
        <span className={classes.title}>
          {title}
        </span>
      </Button>
    </ListItem>
  );
};

NavItem.propTypes = {
  className: PropTypes.string,
  href: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string
};

export default NavItem;

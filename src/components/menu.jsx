import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import toRenderProps from 'recompose/toRenderProps';
import withState from 'recompose/withState';
import MenuIcon from '@material-ui/icons/Menu';

const WithState = toRenderProps(withState('anchorEl', 'updateAnchorEl', null));

function RenderPropsMenu(props) {
  return (
    <WithState>
      {({ anchorEl, updateAnchorEl }) => {
        const open = Boolean(anchorEl);
        const handleClose = (page) => {
          updateAnchorEl(null);
          props.navigation(page)
        };

        return (
          <React.Fragment>
            <Button
              aria-owns={open ? 'render-props-menu' : undefined}
              aria-haspopup="true"
              onClick={event => {
                updateAnchorEl(event.currentTarget);
              }}

            >
              <MenuIcon style={{ color: "white" }} />
            </Button>
            <Menu id="render-props-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem style={{ background: "#303f9f", fontSize: "14px", color: "white", fontWeight: "bold" }}>{props.profile.name} ({props.profile.userType})</MenuItem>
              {props.profile.userType === "company" && <MenuItem onClick={() => handleClose('/job')}>Post Job</MenuItem>}
              {props.profile.userType !== "company" && <MenuItem onClick={() => handleClose('/companies')}>Vacancies </MenuItem>}
              {props.profile.userType === "student" && <MenuItem onClick={() => handleClose('/profile')}>Profile</MenuItem>}
              {props.profile.userType !== "student" && <MenuItem onClick={() => handleClose('/students')}>Students </MenuItem>}
              <MenuItem onClick={props.signOut}>Logout</MenuItem>
            </Menu>
          </React.Fragment>
        );
      }}
    </WithState>
  );
}

export default RenderPropsMenu;
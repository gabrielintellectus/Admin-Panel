import { Tooltip } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import $ from "jquery";

const Navigator = (props) => {
  const location = useLocation();


  const { name, path, path2, navIcon, onClick, navIconImg} = props;



  return (
    <ul className="mainMenu">
      <li onClick={onClick}>
        <Tooltip title={name} placement="right">
          <Link
            to={{ pathname: path }}
            className={`${
              (location.pathname === path || location.pathname === path2) &&
              "activeMenu"
            }`}
          >
            <div className="boxCenter">
              {navIcon ? (
                <>
                  <i className={navIcon} />
                </>
              ) : (
                <>{navIconImg}</>
              )}
              <span className="text-capitalize ms-3">{name}</span>
            </div>
            {props?.children && <i class="fa-solid fa-angle-right"></i>}
          </Link>
        </Tooltip>
        {/* If Submenu */}
        <ul className={`subMenu transform0`}>
          {props.children?.map((res) => {
            const { subName, subPath, subPath2,onClick2 } = res?.props;
            return (
              <>
                <Tooltip title={subName} placement="right">
                  <li onClick={onClick2}>
                    <Link
                      to={{ pathname: subPath }}
                      className={`${
                        (location.pathname === subPath ||
                          location.pathname === subPath2) &&
                        "activeMenu"
                      }`}
                    >
                      <i class="fa-solid fa-circle me-2"></i>
                      <span>{subName}</span>
                    </Link>
                  </li>
                </Tooltip>
              </>
            );
          })}
        </ul>
      </li>
    </ul>
  );
};

export default Navigator;

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { DecodeString, GetCookieValue, Alerterror, Alertwarning } from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { useHistory } from "react-router";

const LeftMenu = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory()
  const [Menu, setMenu] = useState([]);
  const _User = DecodeString(GetCookieValue())
  const User = _User && JSON.parse(_User);

  useEffect(() => {
    if (props.location.state === 1) {
      document.querySelector('.sidebar')?.classList.remove("display-none");
    }
    if (User === '') {
      if (location.pathname !== '/forgot' && location.pathname !== '/reset') {
        history.push('/');
      }
    }

  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const navMobileMenus = document.querySelectorAll('.nav-mobile-menu');
      for (const navMobileMenu of navMobileMenus) {
        if (window.innerWidth <= 980) {
          navMobileMenu.classList.add('display-none');
        } else {
          navMobileMenu.classList.remove('display-none');
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (User === null || User === undefined) {
      history.push('/')
    } else if (User || props.location.state === 1) {
      Shop_spLeftMenu_List();
    }
  }, [props.location.state]);

  const onClickLogout = () => {
    localStorage.setItem("LoginData", "");
    window.location.assign('/')
  };

  const Shop_spLeftMenu_List = async () => {
    try {
      const params = {
        Json: JSON.stringify({
          UserId: User.UserId,
        }),
        func: "Shop_spLeftMenu_List",
      }
      const result = await mainAction.API_spCallServer(params, dispatch);
      result.length > 0 && setMenu(result)
    } catch (error) {
      Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
    }
  };

  const renderSubMenu = (parentItem) => {
    return Menu.filter(item => item.ParentId === parentItem.Id).map((subItem, subIndex) => {
      if (subItem.IsHide) {
        return null; // Ẩn menu cấp con nếu subItem.IsHide == true
      }
      const Active = location.pathname === subItem.MenuUrl;
      return (
        <li key={subIndex} className={`${"nav-item"} ${Active ? 'active' : ''}`}>
          <Link className="nav-link" to={subItem.MenuUrl}>
            <i className={Active ? 'fas fa-indent' : subItem.IconClass} style={{ fontSize: '16px', marginTop: '2px' }}></i>
            <span className="sidebar-normal">{subItem.MenuName}</span>
          </Link>
        </li>
      );
    });
  };

  useEffect(() => {
    if (Menu.length > 0) {
      const CheckLocation = Menu.find(e => e.MenuUrl === location.pathname)
      if (!CheckLocation && location.pathname !== '/home'&& location.pathname !== '/') {
        history.push('/home');
        Alertwarning('Bạn không có quyền truy cập chức năng này')
      }
    }
  }, [location.pathname, Menu]);


  return (
    <div className="sidebar ps" style={{ display: 'block !important' }} data-color="purple" data-background-color="white">
      <div className="logo text-center">
        <div className="btn btn-just-icon btn-white btn-fab">
          <i className="material-icons design_bullet-list-67 green">menu_open</i>
        </div>
      </div>
      <div className="sidebar-wrapper ps-container ps-theme-default">
        {Menu.length > 0 && Menu.map((item, index) => {
          if (item.IsHide) {
            return null; // Ẩn menu nếu item.IsHide == true
          }

          if (item.MenuUrl === '/home') {
            // Menu trang chủ
            return (
              <ul className="nav mt0" key={index}>
                <li className="border-bottom nav-item active">
                  <Link className="nav-link" to="/home">
                    <i className="material-icons mt5">home</i>
                    <p>{item.MenuName}</p>
                  </Link>
                </li>
              </ul>
            );
          } else if (!item.ParentId) {
            // Menu cấp cha
            return (
              <ul className="nav mt0" key={index}>
                <li className={`${'border-bottom nav-item'} `}>
                  <a className="nav-link" data-toggle="collapse" data-target={`#${index}`} href="#pricenav" aria-expanded="false">
                    <i className={`${item.IconClass}`} style={{ fontSize: '18px' }}></i>
                    <p>{item.MenuName} <b className="caret"></b></p>
                  </a>
                  <div className="collapse " id={index}>
                    <ul className="nav-sub">
                      {renderSubMenu(item)}
                    </ul>
                  </div>
                </li>
              </ul>
            );
          }
        })}
      </div>
      <div className="bottommenu">
        <ul className="sidebar-wrapper nav mt0">
          <li className="border-bottom nav-item " onClick={onClickLogout}>
            <Link className="nav-link" style={{ border: '1px solid #00884E', textAlign: 'center' }}>
              <i className="material-icons" style={{ color: '#00884E', marginRight: '25px' }}>logout</i>
              <p style={{ color: '#00884E', paddingLeft: '30px' }}> Đăng xuất</p>
            </Link>
          </li>
        </ul>
      </div>
      <div className="sidebar-background"></div>
    </div>
  );
};

export default React.memo(LeftMenu);
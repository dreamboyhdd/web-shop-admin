import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Alerterror, EncodeString } from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { Img } from "react-image";
import { useInput } from "../../Hooks";
import LayoutLogin from "../../Layout/LayoutLogin";

export const LoginComponent = () => {
  const dispatch = useDispatch();

  const [Username, bindUserName, setUsername] = useInput("");
  const UsernameRef = useRef();

  const [Password, bindPassword, setPassword] = useInput("");
  const PasswordRef = useRef();

  const [LoginMessage, setLoginMessage] = useState("");
  const [disable, setDisable] = useState(false); // disable button
  const history = useHistory();

  const [UserActive, setUserActive] = useState("");
  const [PassActive, setPassActive] = useState("");

  const [PassHide, setPassHide] = useState("password");
  const [PassEye, setPassEye] = useState("");
  
  useEffect(() => {
    document.querySelector('.sidebar')?.classList.add("display-none");
  }, []);

  useEffect(() => {
    localStorage.setItem("login", "");
    let currentDate = new Date();
    if (currentDate.getHours() < 12)
      setLoginMessage("Chào buổi sáng. Chúc bạn ngày mới tràn đầy năng lượng");
    else if (currentDate.getHours() > 12 && currentDate.getHours() < 18)
      setLoginMessage("Buổi chiều của bạn thế nào ?");
    else setLoginMessage("Hôm nay có gì mới ?");
  }, []);



  const handleForgotPasswordClick = () => {
    window.location.assign('/forgot')
  };
  const onClickLogin = async () => {
    setDisable(true);
    setUserActive("");
    setPassActive("");
    if (Username === "") {
      Alerterror("Thông tin đăng nhập không được để trống");
      setUserActive("form-error");
      setDisable(false);
      return;
    } else if (Password === "") {
      Alerterror("Mật khẩu không được để trống");
      setUserActive("");
      setPassActive("form-error");
      setDisable(false);
      return;
    } else {
      let prj = {
        UserName: Username,
        Password: Password,
        Uid: 0
      };
      // if(Username==="admin" && Password==="admin"){
      //   localStorage.setItem("LoginData",EncodeString(JSON.stringify(prj)));
      // }
      // else{
      //   Alerterror("Tài khoản hoặc mật khẩu không đúng");
      // }
      try {

        // const pwd = await mainAction.EncryptString(prj, dispatch);
        const EncryptPassword = await mainAction.EncryptString({
          Json: Password,
          func: "EncryptString",
        }, dispatch);
        let pr = {
          Json: JSON.stringify({
            UserName: Username,
            Password: EncryptPassword
          }),
          func: "Shop_spUsers_CheckLogin",
        };
        const data = await mainAction.API_spCallServer(pr, dispatch);


        localStorage.setItem("LoginData", EncodeString(JSON.stringify(data[0])));
        history.push({
          pathname: '/home',
          state: 1
        })
        document.querySelector('.sidebar')?.classList.remove("display-none");

      }
      catch (ex) {
        Alerterror("Lỗi kết nối, liên hệ IT");
      }
    }

    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  return (
    <LayoutLogin>
      <div className="content-login">
        <div className="container container-login" style={{ maxWidth: '600px' }}>
          <div className="row">
            <div className="col-md-12 text-center mb10">
              <Img
                src="../../assets/img/LogoNetco.png"
                className="margin-left-5"
                width="200"
              />
            </div>
          </div>
          <div className="row">

            <div className="col-12">
              <h3 className="bold mb10"> ĐĂNG NHẬP </h3>
              <div className="form-group mb30">
                {/* Bạn chưa có tài khoản?
                <Link
                  style={{ color: "#2264D1" }}
                  className="bold"
                  to="/register"
                >
                  {" "}
                  Đăng ký ngay
                </Link> */}
              </div>
              <div className="form-group ">
                <label htmlFor="exampleEmail">Email/số điện thoại </label>
                <input
                  type="text"
                  className={"form-control borradius3 " + UserActive}
                  id="exampleEmail"
                  ref={UsernameRef}
                  value={Username}
                  {...bindUserName}
                  placeholder="Nhập Email hoặc số điện thoại"
                />
              </div>
              <div className="form-group margin-top-20 ">
                <label htmlFor="examplePass">Mật khẩu</label>
                <div className="input-group">
                  <input
                    type={PassHide}
                    className={"form-control borradius3 " + PassActive}
                    id="examplePass"
                    placeholder="Nhập mật khẩu"
                    ref={PasswordRef}
                    value={Password}
                    {...bindPassword}
                  />
                  <div className="input-group-append">
                    <span
                      className={"fa fa-fw fa-eye input-group-text " + PassEye}
                      onClick={(e) => {
                        setPassHide(PassEye === "" ? "text" : "password");
                        setPassEye(PassEye === "" ? "fa-eye-slash" : "");
                      }}
                    ></span>
                  </div>
                </div>
              </div>
              <div
                className="form-group "
                style={{ color: "grey", marginTop: "-5px" }}
              >
                <a
                  className="pull-right"
                  style={{ color: "#3e3838" }}
                  onClick={handleForgotPasswordClick}
                >
                  Quên mật khẩu ?
                </a>
              </div>
              <div className="form-group text-center margin-top-20 ">
                <button
                  type="button"
                  style={{ width: "100%" }}
                  className="margin-top-20 btn text-transform btn-sm btn-save"
                  onClick={onClickLogin}
                >
                  Đăng nhập<div className="ripple-container"></div>
                </button>
              </div>
              <div className="italic margin-top-15  mb30">{LoginMessage}</div>
            </div>
          </div>
        </div>
      </div>
    </LayoutLogin>
  );
};

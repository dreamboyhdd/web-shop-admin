import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Alertsuccess,
  Alerterror,
  Alertwarning,
  ValidPassword,
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { Img } from "react-image";
import { useInput } from "../../Hooks";
import LayoutLogin from "../../Layout/LayoutLogin";

export const ResetPassword = () => {
  const dispatch = useDispatch();

  const [Password, bindPassword, setPassword] = useInput("");
  const PasswordRef = useRef();

  const [PasswordConfirm, bindPasswordConfirm, setPasswordConfirm] =
    useInput("");
  const PasswordConfirmRef = useRef();

  const [CustomerID, setCustomerID] = useState(0);
  const [PassOld, setPassOld] = useState("");

  const [Message, setMessage] = useState("");
  const [KeyChangePass, setKeyChangePass] = useState("");
  const [disable, setDisable] = useState(false); // disable button

  const [PassHide, setPassHide] = useState("password");
  const [PassEye, setPassEye] = useState("");
  const [PassConfirmHide, setPassConfirmHide] = useState("password");
  const [PassConfirmEye, setPassConfirmEye] = useState("");
  const [UserId, setUserId] = useState(0);

  const location = useLocation()
  const history = useHistory()


  useEffect(() => {
    let Id = ''
    if (location.search !== '') {
      Id = location.search.replace('?', '')
      Shop_spUserCheckResetPass(Id)
      setUserId(Id)
    }
  }, [location.search]);

  const Shop_spUserCheckResetPass = async (Id) => {
    try {
      const params = {
        Json: JSON.stringify({
          EnCode: Id
        }),
        func: "Shop_spUserCheckResetPass",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "NotOk") {
        Alertsuccess(result.ReturnMess);
        setPassword('');
        setPasswordConfirm('')
        history.push("/")
      }
    } catch (err) {
      Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
    }
  };


  const Shop_spUser_ResetPassword = async () => {
    const NewId = await mainAction.DecryptString({
      Json: UserId,
      func: "DecryptString",
    }, dispatch);
    if (Password === "") {
      Alertwarning("Nhập mật khẩu mới");
      return;
    } else if (ValidPassword(Password) !== "") {
      Alertwarning("Nhập lại mật khẩu mới");
      return;
    } else if (ValidPassword(Password) !== "") {
      Alertwarning("Mật khẩu mới không an toàn");
      return;
    } else if (PasswordConfirm !== Password) {
      Alertwarning("Mật khẩu không khớp");
      return;
    } else {
      let prEnc = {
        Json: Password,
        func: "EncryptString"
      };
      const keyEnc = await mainAction.EncryptString(prEnc, dispatch);
      const params = {
        Json: JSON.stringify({
          UserId: NewId,
          Password: keyEnc
        }),
        func: "Shop_spUser_ResetPassword",
      };
      const result = await mainAction.API_spCallServer(params, dispatch);
      if (result.Status === "Ok") {
        Alertsuccess(result.ReturnMess);
        setPassword('');
        setPasswordConfirm('')
        localStorage.setItem("", "");
        window.location.href = "/";
      } else {
        Alertwarning("Lỗi dữ liệu vui lòng liên hệ IT");
      }
    }
    mainAction.LOADING({ IsLoading: false }, dispatch);
  }

  return (
    <LayoutLogin>
      <div className="content-login">
        <div className="container container-login" style={{ maxWidth: '600px' }}>
          <div className="row">
            <div className="col-md-3">
              <Link to="/">
                <Img
                  src="../../assets/img/LogoNetco.png"
                  width="200"
                  className="margin-left-5"
                />
              </Link>
            </div>
            <div className="col-md-6">
              <h3 className="bold text-center">
                NHẬP MẬT KHẨU MỚI
              </h3>
            </div>
            <div className="col-md-3"></div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <form method="#" action="#">
                <div className="row">
                  <label className="col-sm-4 col-form-label">
                    Mật khẩu mới <span className="red">(*)</span>
                  </label>
                  <div className="col-sm-8">
                    <div className="input-group">
                      <input
                        type={PassHide}
                        className="form-control"
                        ref={PasswordRef}
                        value={Password}
                        {...bindPassword}
                      />
                      <div className="input-group-append">
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <label className="col-sm-4 col-form-label">
                    Nhập lại mật khẩu <span className="red">(*)</span>
                  </label>
                  <div className="col-sm-8">
                    <div className="input-group">
                      <input
                        className="form-control"
                        type={PassConfirmHide}
                        ref={PasswordConfirmRef}
                        value={PasswordConfirm}
                        {...bindPasswordConfirm}
                      />
                      <div className="input-group-append">
                        <span
                          className={
                            "fa fa-fw fa-eye input-group-text " + PassConfirmEye
                          }
                          onClick={(e) => {
                            setPassConfirmHide(
                              PassConfirmEye === "" ? "text" : "password"
                            );
                            setPassConfirmEye(
                              PassConfirmEye === "" ? "fa-eye-slash" : ""
                            );
                          }}
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group text-center">
                  <button
                    type="button"
                    className="btn btn-fill login-button"
                    disabled={disable}
                    onClick={Shop_spUser_ResetPassword}
                  >
                    đổi mật khẩu<div className="ripple-container"></div>
                  </button>
                </div>
                <div className="form-group text-center">
                  {Message + " "}
                  <Link className="green italic" to="/forgot">
                    Quên mật khẩu ? 
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LayoutLogin>
  );
};

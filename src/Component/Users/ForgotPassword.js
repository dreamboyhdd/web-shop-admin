import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Alerterror, DecodeString, GetCookieValue } from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { Img } from "react-image";
import { useInput } from "../../Hooks";
import LayoutLogin from "../../Layout/LayoutLogin";
import { Link, } from "react-router-dom";

export const ForgotPassword = () => {
  const dispatch = useDispatch();

  const [Email, bindEmail] = useInput("");
  const EmailRef = useRef();
  const _User = DecodeString(GetCookieValue());
  const User = _User && JSON.parse(_User);

  const [disable, setDisable] = useState(false); // disable button
  /* run after render */
  useEffect(() => {
  }, []);

  const Shop_spUserSendEmailForgot = async () => {
    setDisable(false);
    let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if (Email === "") {
      Alerterror("Vui lòng nhập Email");
      return;
    } else if (!pattern.test(Email)) {
      Alerterror("Email không đúng định dạng");
      return;
    }
    let params = {
      Json: JSON.stringify({
        Email: Email
      }),
      func: "Shop_spUserSendEmailForgot",
    };
    const result = await mainAction.API_spCallServer(params, dispatch);
    // if (result.Status === 'OK') {
    //   setDisable(true);
    //   Alertsuccess('Vui lòng đăng nhập gmail để đổi mật khẩu');
    // }
    // else
    //   Alerterror(result.localMessage);
    // mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const HandleKeyDown = (e) => {
    if (e.key === 'Enter') {
      Shop_spUserSendEmailForgot();
    }
  }

  return (
    <LayoutLogin>
      <div className="content-login">
        <div className="container container-login" style={{ maxWidth: '600px' }}>
          <div className="row">
            <div className="col-md-3">
              <Img
                // src="../../assets/img/LogoNetco.png"
                className="margin-left-5"
                width="100"
              />
            </div>
            <div className="col-md-6">
              <h3 className="bold text-center">
                QUÊN MẬT KHẨU ?
              </h3>
            </div>
            <div className="col-md-3"></div>
          </div>
          <div className="row text-center">
            <div className="col-md-12 width60">
              <label className="">
                Email <span className="red">(*)</span>
              </label>
              <div className="col-md-12 text-center">
                <div className=""><input
                  type="email"
                  className="form-control"
                  ref={EmailRef}
                  value={Email}
                  {...bindEmail}
                  disabled={disable}
                  onKeyDown={(e) => HandleKeyDown(e)}
                /></div>
              </div>
              <div className="form-group text-center">
                <button
                  type="button"
                  className="btn text-transform btn-sm btn-save"
                  disabled={disable}
                  onClick={Shop_spUserSendEmailForgot}
                >
                  Gửi <div className="ripple-container"></div>
                </button>
              </div>
              <div className="form-group text-center bold">
                Đến trang{" "}
                <Link className="red" to="/">
                  Đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutLogin>
  );
};

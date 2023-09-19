import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Alertsuccess,
  Alerterror,
  ValidPassword,
  DecodeString,
  GetCookieValue,
  Alertwarning,
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { useInput } from "../../Hooks";
import { APIKey } from "../../Services/Api";
import LayoutMain from "../../Layout/LayoutMain";

export const ChangePassword = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [disable, setDisable] = useState(false); // disable button

  const [UserId, setUserId] = useState();
  const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);

  const [PasswordOld, bindPasswordOld, setPasswordOld] = useInput("");
  const PasswordOldRef = useRef();

  const [Password, bindPassword, setPassword] = useInput("");
  const PasswordRef = useRef();

  const [PasswordConfirm, bindPasswordConfirm, setPasswordConfirm] = useInput(
    ""
  );
  const PasswordConfirmRef = useRef();

  const [passwordReg, setPasswordReg] = useState("");
  const [passwordConfirmReg, setPasswordConfirmReg] = useState("");
  const [ErrorMessage, setErrorMessage] = useState("");

  const [PassHide, setPassHide] = useState("password");
  const [PassEye, setPassEye] = useState("");
  const [PassConfirmHide, setPassConfirmHide] = useState("password");
  const [PassConfirmEye, setPassConfirmEye] = useState("");

  /* run after render */
  useEffect(() => {
    if (UserId === null)
      history.push("/");
  }, []);

  const Shop_spUserResetPass = async () => {
    try {
      setDisable(false);
      if (PasswordOld === "") {
        Alerterror("Nhập mật khẩu cũ");
        return;
      } else if (Password === "") {
        Alerterror("Nhập mật khẩu mới");
        return;
      } else if (ValidPassword(Password) !== "") {
        Alerterror("Nhập lại mật khẩu mới");
        return;
      } else if (ValidPassword(Password) !== "") {
        Alerterror("Mật khẩu mới không an toàn");
        return;
      } else if (RegPasswordConfirm(PasswordConfirm) !== "") {
        Alerterror("Mật khẩu nhập lại không khớp");
        return;
      } else {
        //Mã hóa mk mới
        let prEnc = {
          Json: Password,
        };
        const keyEnc = await mainAction.EncryptString(prEnc, dispatch);
        //Mã hóa mk cũ
        let prEncc = {
          Json: PasswordOld,
        };
        const keyEncc = await mainAction.EncryptString(prEncc, dispatch);

        //Đổi mk
        let params = {
          AppAPIKey: APIKey,
          UserId: User.UserId,
          Password: keyEnc,
          PasswordOld: keyEncc,
          Key: null,
        };
        if (UserId !== 0) {
          let pr = {
            Json: JSON.stringify(params),
            func: "Shop_spUserResetPass"
          };
          const data = await mainAction.API_spCallServer(pr,dispatch);
          if (data.Status === "NOTOK") {
            Alertwarning(data?.ReturnMess);
            setDisable(false);
          } else {
            Alertsuccess("Đổi mật khẩu thành công!");
            ResetForm();
          }
        }
      }
    } catch (err) {
      Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
    }
    mainAction.LOADING({ IsLoading: false }, dispatch);
  };

  const RegPassword = (e) => {
    setPassword(e);
    if (e === "") setErrorMessage("Nhập mật khẩu");
    else {
      let result = ValidPassword(e);
      setPasswordReg(result);
      if (result === "form-error")
        setErrorMessage(
          "Mật khẩu phải có ít nhất 8 kí tự (bao gồm chữ hoa, chữ thường, chữ số, ký tự đặc biệt)"
        );
      else setErrorMessage("");
    }
  };

  const RegPasswordConfirm = (e) => {
    setPasswordConfirm(e);
    if (e !== Password) {
      setPasswordConfirmReg("form-error");
      setErrorMessage("Mật khẩu nhập lại không khớp");
      return "form-error";
    } else {
      setErrorMessage("");
      setPasswordConfirmReg("");
      return "";
    }
  };

  const ResetForm = () => {
    setPasswordOld("");
    setPassword("");
    setPasswordConfirm("");
  };

  return (
    <LayoutMain>
      <div className="container-fluid">
        <div className="row Forminfor">
          <div className="col-md-12 HomeTitle margin-top-20"> Đổi mật khẩu</div>
          <div className="col-md-12 margin-top-10">
            <form method="#" action="#">
              <div className="row  margin-top-10">
                <label className="col-sm-12 font-weight500">Mật khẩu cũ <span className="red">(*)</span></label>
                <div className="col-sm-12">
                  <input type="password" className="form-control borradius3" placeholder='Nhập mật khẩu cũ' ref={PasswordOldRef} value={PasswordOld} {...bindPasswordOld} />
                </div>
              </div>
              {/*  <div className="form-group">
                <label htmlFor="examplePass">Mật khẩu</label>
                <div className="input-group">
                  <input type={PassHide} className={"form-control " + PassActive} id="examplePass" ref={PasswordRef} value={Password} {...bindPassword} />
                  <div className="input-group-append"><span className={"fa fa-fw fa-eye input-group-text " + PassEye} onClick={(e) => { setPassHide(PassEye === "" ? "text" : "password"); setPassEye(PassEye === "" ? "fa-eye-slash" : ""); }} ></span></div>
                </div>
              </div> */}
              <div className="row margin-top-10">
                <label className="col-sm-12 font-weight500"> Mật khẩu mới <span className="red">(*)</span></label>
                <div className="col-sm-12">
                  <div className="input-group">
                    <input type={PassHide} placeholder='Mật khẩu phải có ít nhất 8 kí tự (bao gồm chữ hoa, chữ thường, chữ số, ký tự đặc biệt)...' className={"form-control borradius3 " + passwordReg} ref={PasswordRef} value={Password} {...bindPassword} onChange={(e) => RegPassword(e.target.value)} />
                    <div className="input-group-append"><span className={"fa fa-fw fa-eye input-group-text " + PassEye} onClick={(e) => { setPassHide(PassEye === "" ? "text" : "password"); setPassEye(PassEye === "" ? "fa-eye-slash" : ""); }} ></span></div>
                  </div>
                </div>
              </div>
              <div className="row margin-top-10">
                <label className="col-sm-12 font-weight500"> Nhập lại mật khẩu <span className="red">(*)</span></label>
                <div className="col-sm-12">
                  <div className="input-group">
                    <input type={PassConfirmHide} placeholder='Nhập lại mật khẩu' className={"form-control borradius3 " + passwordConfirmReg} ref={PasswordConfirmRef} value={PasswordConfirm} {...bindPasswordConfirm} onChange={(e) => RegPasswordConfirm(e.target.value)} />
                    <div className="input-group-append"><span className={"fa fa-fw fa-eye input-group-text " + PassConfirmEye} onClick={(e) => { setPassConfirmHide(PassConfirmEye === "" ? "text" : "password"); setPassConfirmEye(PassConfirmEye === "" ? "fa-eye-slash" : ""); }} ></span></div>
                  </div>
                </div>
              </div>
              <div className="row text-center error-message">
                <div className="col-md-12">{ErrorMessage}</div>
              </div>
            </form>
          </div>
        </div>
        <div className="form-group text-center">
          <button type="button" className="btn text-transform btn-refeshno btn-sm" disabled={disable} onClick={ResetForm} >
            <i className="material-icons">undo</i> Hủy
          </button>
          <button type="button" className="btn btn-sm text-transform  margin-left-10 btn-save" disabled={disable} onClick={Shop_spUserResetPass} >
            <i className="material-icons">lock</i> Đổi mật khẩu
          </button>
          <div className="clearfix"></div>
        </div>
      </div>
    </LayoutMain>
  );
};

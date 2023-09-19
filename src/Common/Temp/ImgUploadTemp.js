import React, { useEffect, useRef, useState } from "react";
import { LINK_IMAGE } from "../../Services";
import { Alertwarning, ConfirmAlert } from "../../Utils";

const ImgUploadTempComp = ({
  data = "",
  onData = () => { },
  onImageUpload = () => { },
  flag = 0,
  isReset = 0,
  readOnly = false,
  title = "UPLOAD HÌNH ẢNH"
}) => {
  const inputRef = useRef(null);

  const [ImageUpload, setImageUpload] = useState([]);
  const [i, setI] = useState([]);

  useEffect(() => {
    if (data !== undefined) {
      let arr = data
        ?.split(",")
        .filter((p) => p !== "" && p !== "undefined");
      setI(arr);
    } else setI([]);
  }, [data]);

  useEffect(() => {
    if (isReset !== 0) { inputRef.current.value = null; setImageUpload([]) }
  }, [isReset]);

  useEffect(() => {
    if (flag === 1) {
      setImageUpload([]);
    }
  }, [flag]);

  const handleChangeFileAndImage = (e) => {
    let t = e.target.files;
    let check = true;
    for (let k = 0; k < t.length; k++) {
      let exName = t[k].name.slice(
        (Math.max(0, t[k].name.lastIndexOf(".")) || Infinity) + 1
      );
      if (
        exName === "jpg" ||
        exName === "jpeg" ||
        exName === "png" ||
        exName === "gif"
      ) {
        check = true;
      } else {
        check = false;
      }
      if (check === false) break;
    }
     
    if (check) {
       
      let newListFile = [...ImageUpload, ...e.target.files];

      setImageUpload(newListFile);
      onImageUpload(newListFile);
    } else {
      Alertwarning(
        'File không đúng định dạng! Vui lòng chọn lại file có định dạng "jpg", "jpeg", "png", "gif"'
      );
    }
  };

  const onFileDelete = (filename, type = "f") => {
    ConfirmAlert("", "Bạn có chắc muốn xóa?", "OK, Xác nhận xóa!", async () => {
      let showdata = [...i]; // list file đang hiển thị
      let checkfile = showdata.filter((e) => e !== "" && e !== filename) || [];
      setI(checkfile);
      onData(checkfile.join(","));
    });
  };


  return (
    <>
      <div className="form-group">
        {!readOnly && <>
          <span className="small font-weight-bold text-muted">
            {title} <span className="text-danger">(jpg, jpeg, png)</span>
          </span>
          <label className="image-collapse-label2">
            <input
              type="file"
              className="image-collapse-file cursor-pointer"
              onChange={(e) => handleChangeFileAndImage(e)}
              accept="image/*"
              multiple
              ref={inputRef}
              readOnly={readOnly}
            />
            <i className="fa fa-upload upload-file-btn"></i>
          </label>
        </>
        }
        <div className="row listimgupload">
          {ImageUpload.map((item, ix) => {
            return (
              <div
                className="upload-file-item py-1 my-2 shadow-sm col-3 position-relative"
                key={"bsds" + ix}
              >
                <img
                  src={URL.createObjectURL(item)}
                  alt=""
                  className="image-upload"
                  width={"70px"}
                />
                <i
                  className="fa fa-times pl-2 text-danger cursor-pointer position-absolute top-1 right-1 btn-cursor"
                  onClick={(e) =>
                    setImageUpload(ImageUpload.filter((_, p) => p !== ix))
                  }
                ></i>
              </div>
            );
          })}
        </div>
        <div className="row listimgupload">
          {i.length > 0 &&
            i.map((item, ix) => {
              return (
                <div
                  className="upload-file-item py-1 my-2 shadow-sm col-3 position-relative"
                  key={"b" + ix}
                >
                  <img
                    src={LINK_IMAGE + item}
                    alt=""
                    className="image-upload"
                  />
                  {!readOnly &&
                    <span
                      className="position-absolute right-0"
                      style={{ width: "50px" }}
                    >
                      <i
                        className="fa fa-times pl-2 text-danger cursor-pointer position-absolute top-1 right-1 btn-cursor"
                        onClick={(e) => onFileDelete(item, "i")}
                      ></i>
                      {/* <a
                      href={LINK_IMAGE + item}
                      download
                      target={"_blank"}
                      className="fa fa-download cursor-pointer ml-1 mr-1"
                      rel="noreferrer"
                    ></a>
                    <i
                      className="fas fa-trash cursor-pointer text-danger ml-1 mr-1"
                      onClick={(e) => onFileDelete(item, "i")}
                    ></i> */}
                    </span>}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export const ImgUploadTemp = React.memo(ImgUploadTempComp);
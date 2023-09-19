import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { LINKDomain } from "../../Services";
import { Alertwarning } from "../../Utils";

const UploadFileComp = ({
  onImageUpload = () => {},
  onFileUpload = () => {},
  fileData = {},
  onFileData = () => {},
  flag = 0,
}) => {
  useEffect(() => {
    if (fileData?.imageShow !== undefined) {
      let arr = fileData?.imageShow
        ?.split(",")
        .filter((p) => p !== "" && p !== "undefined");
      //setImageUpload([]);
      setI(arr);
    } else setI([]);
    if (fileData?.fileShow !== undefined) {
      let arr = fileData?.fileShow
        ?.split(",")
        .filter((p) => p !== "" && p !== "undefined");
      //setFileUpload([]);
      setF(arr);
    } else setF([]);
  }, [fileData]);

  useEffect(() => {
    if (flag === 1) {
      setFileUpload([]);
      setImageUpload([]);
    }
  }, [flag]);

  const [FileUpload, setFileUpload] = useState([]);
  const [ImageUpload, setImageUpload] = useState([]);
  const [docs, setDocs] = useState("");
  const [isPreviewFile, setIsPreviewFile] = useState(false);
  const [f, setF] = useState([]);
  const [i, setI] = useState([]);

  const handleChangeFileAndImage = (e, type = 0) => {
    let t = e.target.files;
    let check = true;
    if (type === 0) {
      for (let k = 0; k < t.length; k++) {
        let exName = t[k].name.slice(
          (Math.max(0, t[k].name.lastIndexOf(".")) || Infinity) + 1
        );
        if (
          exName === "pdf" ||
          exName === "doc" ||
          exName === "docx" ||
          exName === "xls" ||
          exName === "xlsx"
        ) {
          check = true;
        } else {
          check = false;
        }
        if (check === false) break;
      }
      if (check) {
        let A = [...FileUpload];
        let newListFile = [...FileUpload, ...e.target.files];
        setFileUpload(newListFile);
        onFileUpload(newListFile);
      } else {
        Alertwarning(
          'File không đúng định dạng! Vui lòng chọn lại file có định dạng "pdf", "doc", "docx", "xls", "xlsx"'
        );
      }
    } else {
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
        let A = [...FileUpload];
        let newListFile = [...ImageUpload, ...e.target.files];

        setImageUpload(newListFile);
        onImageUpload(newListFile);
      } else {
        Alertwarning(
          'File không đúng định dạng! Vui lòng chọn lại file có định dạng "jpg", "jpeg", "png", "gif"'
        );
      }
    }
  };

  const checkExtentionFile = (value, type) => {
    let check = 0;
    let exName = value.slice(
      (Math.max(0, value.lastIndexOf(".")) || Infinity) + 1
    );

    if (
      exName === "doc" ||
      exName === "docx" ||
      exName === "xls" ||
      exName === "xlsx"
    ) {
      check = 0;
    } else {
      check = 1;
    }
    return check;
  };

  const onFileDelete = (filename, type = "f") => {
    if (window.confirm("Bạn có chắc muốn xóa file?")) {
      if (type === "f") {
        let showdata = [...f]; // list file đang hiển thị
        let checkfile =
          showdata.filter((e) => e !== "" && e !== filename) || [];
        //setF(checkfile);
        let a = { ...fileData, fileShow: checkfile.join(",") };
        onFileData(a);
      } else {
        let showdata = [...i]; // list file đang hiển thị
        let checkfile =
          showdata.filter((e) => e !== "" && e !== filename) || [];
        //setI(checkfile);
        let a = { ...fileData, imageShow: checkfile.join(",") };
        onFileData(a);
      }
    }
  };

  return (
    <>
      <div className="col-sm-12 col-md-6">
        <div className="form-group">
          <span className="small font-weight-bold text-muted">
            UPLOAD FILES{" "}
            <span className="text-danger">(pdf, xls, xlsx, doc, docx)</span>
          </span>
          <label className="image-collapse-label2 ">
            <input
              type="file"
              className="image-collapse-file cursor-pointer"
              onChange={(e) => handleChangeFileAndImage(e, 0)}
              accept=".pdf, .xls, .xlsx, .doc, .docx"
              multiple
            />
            <i className="fa fa-file upload-file-btn"></i>
          </label>
          <div className="listfileupload">
            {FileUpload.map((item, ix) => {
              return (
                <div
                  className="upload-file-item py-1 my-2 shadow-sm "
                  key={"asdsad" + ix}
                >
                  <i className="fa fa-file px-2"></i>
                  <span>{item.name}</span>
                  <i
                    className="fa fa-times pl-2 text-danger cursor-pointer"
                    onClick={(e) => {
                      alert("aaaa");
                      setFileUpload(FileUpload.filter((_, p) => p !== ix));
                    }}
                  ></i>
                </div>
              );
            })}
          </div>
          <div className="">
            {f.length > 0 &&
              f.map((item, ix) => {
                return (
                  <div
                    className="upload-file-item py-1 my-2 shadow-sm d-flex justify-content-between"
                    download
                    key={"aaa" + ix}
                  >
                    <div>
                      <i className="fa fa-file px-2"></i>
                      <span>{item.split("/")[6]}</span>
                    </div>
                    <div className="">
                      <a
                        href={LINKDomain + item}
                        download
                        target={"_blank"}
                        className="px-3"
                      >
                        <i className="fa fa-download"></i>
                      </a>
                      <i
                        className="fa fa-eye pl-2 text-success cursor-pointer px-2"
                        onClick={(e) => {
                          setDocs(LINKDomain + item.replace("/", ""));
                          setIsPreviewFile(true);
                        }}
                      ></i>
                      <i
                        className="fas fa-trash text-danger ml-2 mr-1 cursor-pointer"
                        onClick={(e) => onFileDelete(item, "f")}
                      ></i>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="col-sm-12 col-md-6">
        <div className="form-group">
          <span className="small font-weight-bold text-muted">
            UPLOAD HÌNH ẢNH <span className="text-danger">(jpg, jpeg, png)</span>
          </span>
          <label className="image-collapse-label2">
            <input
              type="file"
              className="image-collapse-file cursor-pointer"
              onChange={(e) => handleChangeFileAndImage(e, 1)}
              accept="image/*"
              multiple
            />
            <i className="fas fa-passport upload-file-btn"></i>
          </label>
          <div className="row listimgupload">
            {ImageUpload.map((item, ix) => {
               ;
              return (
                <div
                  className="upload-file-item py-1 my-2 shadow-sm col-6 position-relative"
                  key={"bsds" + ix}
                >
                  <img
                    src={URL.createObjectURL(item)}
                    alt=""
                    className="image-upload"
                  />
                  <i
                    className="fa fa-times pl-2 text-danger cursor-pointer position-absolute top-1 right-1"
                    onClick={(e) =>
                      setImageUpload(ImageUpload.filter((_, p) => p !== ix))
                    }
                  ></i>
                </div>
              );
            })}
          </div>
          <div className="row">
            {i.length > 0 &&
              i.map((item, ix) => {
                return (
                  <div
                    className="upload-file-item py-1 my-2 shadow-sm col-6 position-relative"
                    key={"b" + ix}
                  >
                    <img
                      src={LINKDomain + item}
                      alt=""
                      className="image-upload"
                    />
                    <span
                      className="position-absolute right-0"
                      style={{ width: "50px" }}
                    >
                      <a
                        href={LINKDomain + item}
                        download
                        target={"_blank"}
                        className="fa fa-download cursor-pointer ml-1 mr-1"
                        rel="noreferrer"
                      ></a>
                      <i
                        className="fas fa-trash cursor-pointer text-danger ml-1 mr-1"
                        onClick={(e) => onFileDelete(item, "i")}
                      ></i>
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <Modal
        show={isPreviewFile}
        onHide={() => setIsPreviewFile(false)}
        aria-labelledby="example-custom-modal-styling-title"
        className="custom-modal-w-100 z-maxx"
      >
        <Modal.Header className="p-2">
          <Modal.Title id="example-custom-modal-styling-title">
            <div className="text-center">Preview Document</div>
          </Modal.Title>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={() => setIsPreviewFile(false)}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <Modal.Body>
          {checkExtentionFile(docs) === 0 ? (
            <iframe
              className={"docs"}
              width="100%"
              height="800"
              frameBorder="0"
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${docs}`}
              title="preview file"
            ></iframe>
          ) : (
            <iframe
              className={"docs"}
              width="100%"
              height="800"
              frameBorder="0"
              src={`https://drive.google.com/viewerng/viewer?url=${docs}&embedded=true&hl=vi`}
              title="preview file"
            ></iframe>
          )}{" "}
        </Modal.Body>
      </Modal>
    </>
  );
};

export const UploadFile = React.memo(UploadFileComp);

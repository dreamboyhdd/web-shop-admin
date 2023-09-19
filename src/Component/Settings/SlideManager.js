import React, { useEffect, useState } from "react";
import LayoutMain from "../../Layout/LayoutMain";
import { useDispatch } from "react-redux";
import {
    DataTable, ImgUploadTemp,
} from "../../Common";
import {
    Alerterror,
    DecodeString,
    GetCookieValue,
    Alertsuccess,
    Alertwarning,
    FormatDateJson,
    ConfirmAlert,
    ExportExcel,
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { LINK_IMAGE } from "../../Services";

export const SlideManager = () => {
    const dispatch = useDispatch();
    useEffect(() => { }, []);

    const [Title, setTitle] = useState("Thêm slide");

    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const [FileUpload, setFileUpload] = useState([]);
    const [resetImage, setResetImage] = useState(0);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [FromValue, setFromValue] = useState({
        SlideId: 0,
        Title: "",
        Description: "",
        Image: "",
        IndexNumber: 0,
        IsHide: 0,
        IsDelete: 0,
        ChangeParentId: 0,
    });

    const [ListData, setListData] = useState([]);
    const [SearchValue, setSearchValue] = useState({
        Title: "",
    });

    const ClearForm = () => {
        setFromValue({
            SlideId: 0,
            Title: "",
            Description: "",
            Image: "",
            IndexNumber: 0,
            IsHide: 0,
            IsDelete: 0,
            ChangeParentId: 0,
        });
        setFileUpload([]);
        setResetImage(Math.random());
    };

    //#region Save
    const Shop_spSlides_Save = async () => {

        try {
            setDisable(false);
            let _newListImage = '';
            if (FileUpload.length > 0) {
                let listimage = "";
                if (FileUpload !== "" && FileUpload.length > 0 && Array.isArray(FileUpload)) {
                    const formData = new FormData();
                    formData.append("Key", "Product");
                    for (let i = 0; i < FileUpload.length; i++) {
                        formData.append("myFile" + i, FileUpload[i]);
                    }
                    const data = await mainAction.API_spCallPostImage(formData, dispatch);
                    let _img = data.Message.replaceAll('"', "");
                    listimage = _img.replace("[", "").replace("]", "");
                }
                let newListImage = [listimage].filter((p) => p !== "" && p !== undefined && p !== "undefined").join(",");
                _newListImage = [newListImage, FromValue?.Image || ""].join(",");

            } else if (typeof FileUpload === 'string' || FileUpload.length === 0) {
                _newListImage = FromValue.Image
            } else if (!_newListImage) {
                Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
                setDisable(true);
                return;
            }

            if (FromValue.Title === "" || FromValue.Title === undefined) {
                Alertwarning("Vui lòng nhập tên slide");
                setDisable(true);
                return;
            }
            if (FromValue.Description === "" || FromValue.Description === undefined) {
                Alertwarning("Vui lòng nhập nội dung slide");
                setDisable(true);
                return;
            }

            if (_newListImage === "" || _newListImage === undefined) {
                Alertwarning("Vui lòng nhập hình ảnh slide");
                setDisable(true);
                return;
            }

            const params = {
                Json: JSON.stringify({
                    SlideId: FromValue.SlideId,
                    Title: FromValue.Title?.trim(),
                    Description: FromValue.Description?.trim(),
                    Image: _newListImage,
                    IndexNumber: FromValue.IndexNumber,
                    IsHide: FromValue.IsHide,
                    IsDelete: FromValue.IsDelete,
                    UserId: User.UserId,
                }),
                func: "Shop_spSlides_Save",
            };
            setDisable(true);
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK" && result.ReturnMess === "Lưu thành công!") {
                Alertsuccess(result.ReturnMess);
                ClearForm();
                setDisable2(true);
                return;
            }
            if (result.Status === "NOTOK") {
                Alertwarning(result.ReturnMess);
                setDisable2(true);
                return;
            } else {
                const timeConfirm = new Date();
                ListData.map((e) => {
                    if (e.SlideId === FromValue.SlideId) {
                        e.SlideId = FromValue.SlideId;
                        e.Title = FromValue.Title;
                        e.Description = FromValue.Description;
                        e.Image = _newListImage;
                        e.IndexNumber = FromValue.IndexNumber;
                        e.IsHide = FromValue.IsHide;
                        e.IsDelete = FromValue.IsDelete;
                        e.EditOn = FormatDateJson(timeConfirm);
                        e.EditName = User.UserName;
                    }
                    return e;
                });
                setTitle("Thêm slide");
                setListData(ListData);
                Alertsuccess(result.ReturnMess);
                ClearForm();
                setDisable2(true);
            }
        } catch (error) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
            setDisable(true);
        }
    };
    //#endregion

    //#region List
    const Shop_spSlides_List = async () => {
        try {
            setDisable2(false);
            const pr = {
                Title: SearchValue.Title?.trim(),
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spSlides_List",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setListData(result);
                setDisable2(true);
                return;
            }
            Alertwarning("Không có dữ liệu");
            setDisable2(true);
        } catch (err) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
            setDisable2(true);
        }
    };
    //#endregion

    //#region delete
    const Shop_spSlides_Delete = async (item) => {
        try {
            ConfirmAlert("", "Bạn có chắc muốn xóa?", "OK, Xác nhận xóa!", async () => {

                let Data = item.row._original;
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        SlideId: Data.SlideId,
                        IsDelete: 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spSlides_Delete",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.Status === "OK") {
                    setListData(
                        ListData.filter((item) => item.SlideId !== Data.SlideId)
                    );
                    Alertsuccess(result.ReturnMess);
                    setDisable2(true);
                    return;
                }
                Alertwarning(result.ReturnMess);
                setDisable2(true);
            });
        } catch (error) {
            setDisable2(true);
            Alerterror("Vui lòng liên hệ IT Netco!");
        }
    };
    //#endregion

    //#region show
    const Shop_spSlides_Hide = async (item) => {
        try {
            let Data = item.row._original, titleContent = "", titleButton = "";
            if (Data.IsHide) {
                titleContent = "Bạn có chắc muốn hiện slide?";
                titleButton = "Ok, Hiện slide";
            } else {
                titleContent = "Bạn có chắc muốn ẩn slide?";
                titleButton = "Ok, Ẩn slide";
            }
            ConfirmAlert("", titleContent, titleButton, async () => {
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        SlideId: Data.SlideId,
                        IsHide: Data.IsHide ? 0 : 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spSlides_Hide",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result[0]?.OK === "OK") {
                    ListData.map((e) => {
                        if (e.SlideId === Data.SlideId) {
                            e.IsHide = result[0].IsHide;
                        }
                        return e;
                    });
                    setListData(ListData);
                    Alertsuccess(result[0].ReturnMess);
                    setDisable2(true);
                    return;
                }
                Alertwarning(result.ReturnMess);
                setDisable2(true);
            });
        } catch (error) {
            setDisable2(true);
            Alerterror("Vui lòng liên hệ IT Netco!");
        }
    };
    //#endregion

    //#region edit
    const Shop_spProducts_Edit = (item) => {
        setTitle("Sửa slide");
        let Data = item.row._original;
        setFromValue({
            SlideId: Data.SlideId,
            Title: Data.Title,
            Description: Data.Description,
            Image: Data.Image,
            IndexNumber: Data.IndexNumber,
            IsHide: Data.IsHide ? 1 : 0,
            IsDelete: Data.IsDelete ? 1 : 0,
        });
    };
    //#region edit

    //#region change index
    const Shop_spSlides_ChangeIndex = async (item, key) => {
        try {
            let Data = item.row._original, _IndexNumber = 0;
            if (key === 'down') {
                _IndexNumber = Data.IndexNumber - 1;
            } else {
                _IndexNumber = Data.IndexNumber + 1;
            }
            setDisable2(false);
            const params = {
                Json: JSON.stringify({
                    SlideId: Data.SlideId,
                    IndexNumber: _IndexNumber,
                    UserId: User.UserId,
                }),
                func: "Shop_spSlides_ChangeIndex",
            };

            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                ListData.map((e) => {
                    if (e.SlideId === Data.SlideId) {
                        e.IndexNumber = _IndexNumber;
                    }
                    return e;
                });
                setListData(ListData);
                // Alertsuccess(result.ReturnMess);
                setDisable2(true);
                return;
            }
            Alertwarning(result.ReturnMess);
            setDisable2(true);
        } catch (error) {
            setDisable2(true);
            Alerterror("Vui lòng liên hệ IT Netco!");
        }
    };
    //#endregion

    //#region export excel
    const Shop_spSlides_ExportExcel = () => {
        setDisable2(false);
        const newData = ListData.map(element => {
            return {
                'Tên slide': element.Title,
                'Nội dung': element.Description,
                'Người tạo': element.CreateName,
                'Ngày tạo': FormatDateJson(element.CreateOn),
                'Người sửa': element.EditName,
                'Ngày sửa': FormatDateJson(element.EditOn),
            }
        })
        ExportExcel(newData, "Danh sách slide")
        setDisable2(true);
    }
    //#endregion

    const columns = [
        {
            Header: "STT",
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 40,
            filterable: false,
            special: true,
            show: true,
        },
        {
            Header: "Tùy chọn",
            Cell: ({ row }) => (
                <>
                    <i
                        className="fa fa-edit orange btn-cursor button"
                        data-toggle="modal"
                        data-target=".bd-example-modal-xl"
                        onClick={(e) => Shop_spProducts_Edit({ row })}
                        title="Sửa"

                    />
                    <i
                        className="fa fa-trash red btn-cursor button ml10"
                        onClick={(e) => Shop_spSlides_Delete({ row })}
                        title="Xóa"
                    />
                </>
            ),
            width: 110,
            filterable: false,
        },
        {
            Header: "Ẩn hiện",
            accessor: "IsHide",
            filterable: false,
            width: 70,
            Cell: ({ row }) => {
                return (
                    <div>
                        {row._original.IsHide ? (
                            <a className="pointer" onClick={e => Shop_spSlides_Hide({ row })} title="Ẩn" >
                                <img src="../assets/img/icons8-toggle-off-50.png" className="transform-13" alt="Toggle Off" width="20" />
                            </a>
                        ) : (
                            <a className="pointer" onClick={e => Shop_spSlides_Hide({ row })} title="Hiện">
                                <img src="../assets/img/icons8-toggle-on-50.png" className="transform-13" alt="Toggle On" width="20" />
                            </a>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "Image",
            accessor: "Image",
            width: 100,
            filterable: false,
            Cell: ({ row }) => {
                return (
                    <div>
                        {row.Image !== undefined && row.Image !== "" && row.Image !== null ? (
                            row._original.Image.split(",").map((img, index) => {
                                return (<>
                                    {img !== "" && <a
                                        key={index} // Add key prop to resolve the unique key warning
                                    >
                                        <img src={LINK_IMAGE + img} width="30" /> {/* Add alt attribute */}
                                    </a>}
                                </>
                                );
                            })
                        ) : null}
                    </div>
                );
            },
        },
        {
            Header: "Thứ tự",
            accessor: "IndexNumber",
            filterable: false,
            width: 100,
            Cell: ({ row }) => {
                return (
                    <>
                        <div className="input-group" style={{ alignItems: 'center' }}>
                            <div className="input-group-prepend" >
                                <button className="btn btn-default btn-xs ipg-btn" type="button" onClick={(e) => Shop_spSlides_ChangeIndex({ row }, 'down')}>
                                    <i className="fa-solid fa-caret-down transform-16"></i>
                                </button>
                            </div>
                            <span className="ipg-text">{row._original.IndexNumber} </span>
                            <div className="input-group-append">
                                <button className="btn btn-default btn-xs ipg-btn" type="button" onClick={(e) => Shop_spSlides_ChangeIndex({ row }, 'up')}>
                                    <i className="fa-solid fa-caret-up transform-16"></i>
                                </button>
                            </div>
                        </div>
                    </>
                );
            },
        },
        {
            Header: "Tên slide",
            accessor: "Title",
        },
        {
            Header: "Nội dung",
            accessor: "Description",
        },
        {
            Header: "Người tạo",
            accessor: "CreateName",
        },
        {
            Header: "Ngày tạo",
            accessor: "CreateOn",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        },
        {
            Header: "Người sửa",
            accessor: "EditName",
        },
        {
            Header: "Ngày sửa",
            accessor: "EditOn",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        },
    ];

    const ModalCreateNews = (
        <div className="modal fade bd-example-modal-xl" tabIndex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl margin-top-80">
                <div className="modal-content">
                    <div className="modal-header label-status mt--10">
                        <h4 className="modal-title font-weight-normal left-content" id="exampleModalLabel">{Title}</h4>
                        <div className="right-content close-btns" data-dismiss="modal" >
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Tên slide <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.Title}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, Title: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Nội dung <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.Description}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, Description: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <ImgUploadTemp
                                    onImageUpload={(e) => setFileUpload(e)}
                                    onData={(e) => setFromValue({ ...FromValue, Image: e })}
                                    data={FromValue.Image}
                                    isReset={resetImage}
                                    title="Image slide"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="col-md-12 text-center mt-3 mb-3">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-info"
                                onClick={ClearForm}
                            >
                                <span>
                                    <span className="material-icons mr-1">cached</span>Làm mới
                                </span>
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn-success ml-3"
                                disabled={!Disable}
                                onClick={(e) => {
                                    Shop_spSlides_Save();
                                }}
                            >
                                <span>
                                    <i className="fa-regular fa-floppy-disk mr-1"></i>Lưu
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <LayoutMain>
            <div className="row Formlading">
                <div className="col-md-12">
                    <div className="row mt-3">
                        <div className="col-md-12">
                            <span className="HomeTitle">Tìm kiếm slide</span>
                            <div className="float-right">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-success ml-3"
                                    data-toggle="modal"
                                    data-target=".bd-example-modal-xl"
                                    disabled={!Disable}
                                    onClick={ClearForm}
                                >
                                    <span>
                                        <i className="fa-solid fa-plus mr-2"></i>Thêm slide mới
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 margin-top-10 border-bottom-dash"></div>

                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label className="no-absolute">
                                    Tên slide <span className="red">(*)</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={SearchValue.Title}
                                    onChange={(e) =>
                                        setSearchValue({ ...SearchValue, Title: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-md-12 text-center mt-3 mb-3">
                            <button
                                type="button"
                                className="btn btn-sm btn-success"
                                disabled={!Disable2}
                                onClick={(e) => Shop_spSlides_List()}
                            >
                                <span>
                                    <i className="fa-solid fa-magnifying-glass mr-1"></i>
                                    Tìm kiếm
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="col-md-12 margin-top-10 border-bottom-dash"></div>
                    <div className="row mt-3">
                        <div className="col-md-12">
                            <span className="HomeTitle">
                                Danh sách slide
                                <span className="ml-2 color-green">{ListData.length > 0 && `(${ListData.length})`}</span>
                            </span>
                            <div className="float-right">
                                {ListData.length > 0 && <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success mr-1"
                                    disabled={!Disable2}
                                    onClick={e => Shop_spSlides_ExportExcel()}
                                >
                                    <img src="../assets/img/iconexcel.png" className="iconex" />{" "}
                                    Xuất Excel
                                </button>}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-12 mb-3">
                            <DataTable data={ListData} columns={columns} />
                        </div>
                    </div>
                    {ModalCreateNews}
                </div>
            </div>
        </LayoutMain>
    );
};

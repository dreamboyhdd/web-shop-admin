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
import { SelectMenuAdmin } from "../../Common/Select/SelectMenuAdmin";
import { LINK_IMAGE } from "../../Services";

export const MenuManager = () => {
    const dispatch = useDispatch();
    useEffect(() => { }, []);

    const [Title, setTitle] = useState("Thêm menu");

    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const [FileUpload, setFileUpload] = useState([]);
    const [resetImage, setResetImage] = useState(0);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [FromValue, setFromValue] = useState({
        Id: 0,
        MenuName: "",
        MenuUrl: "",
        Icon: "",
        IconClass: "",
        IndexNumber: 0,
        ParentId: { value: 0, label: 'Vui lòng chọn' },
        IsHide: 0,
        IsDelete: 0,
        ChangeParentId: 0,
    });

    const [ListData, setListData] = useState([]);
    const [SearchValue, setSearchValue] = useState({
        MenuName: "",
    });

    const ClearForm = () => {
        setFromValue({
            Id: 0,
            MenuName: "",
            MenuUrl: "",
            Icon: "",
            IconClass: "",
            IndexNumber: 0,
            ParentId: { value: 0, label: 'Vui lòng chọn' },
            IsHide: 0,
            IsDelete: 0,
            ChangeParentId: 0,
        });
        setFileUpload([]);
        setResetImage(Math.random());
    };

    //#region Save
    const Shop_spMenuAdmin_Save = async () => {
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
                _newListImage = [newListImage, FromValue?.Icon || ""].join(",");

            } else if (typeof FileUpload === 'string' || FileUpload.length === 0) {
                _newListImage = FromValue.Icon
            } else if (!_newListImage) {
                Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
                setDisable(true);
                return;
            }

            if (FromValue.MenuName === "" || FromValue.MenuName === undefined) {
                Alertwarning("Vui lòng nhập tên menu");
                setDisable(true);
                return;
            }
            // if (FromValue.MenuUrl === "" || FromValue.MenuUrl === undefined) {
            //     Alertwarning("Vui lòng nhập tên menu");
            //     setDisable(true);
            //     return;
            // }

            const params = {
                Json: JSON.stringify({
                    Id: FromValue.Id,
                    MenuName: FromValue.MenuName?.trim(),
                    MenuUrl: FromValue.MenuUrl?.trim(),
                    Icon: _newListImage,
                    IconClass: FromValue.IconClass,
                    IndexNumber: FromValue.IndexNumber || 0,
                    ParentId: FromValue.ParentId?.value,
                    IsHide: FromValue.IsHide,
                    IsDelete: FromValue.IsDelete,
                    UserId: User.UserId,
                }),
                func: "Shop_spMenuAdmin_Save",
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
                ListData.map((e) => {
                    if (e.Id === FromValue.Id) {
                        e.Id = FromValue.Id;
                        e.MenuName = FromValue.MenuName;
                        e.MenuUrl = FromValue.MenuUrl;
                        e.Icon = _newListImage;
                        e.IconClass = FromValue.IconClass;
                        e.IndexNumber = FromValue.IndexNumber;
                        e.ParentId = FromValue.ParentId?.value === 0 ? '' : FromValue.ParentId?.value;
                        e.ParentName = FromValue.ParentId?.label;
                        e.IsHide = FromValue.IsHide;
                        e.IsDelete = FromValue.IsDelete;
                    }
                    return e;
                });
                setTitle("Thêm menu");
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
    const Shop_spMenuAdmin_List = async () => {
        try {
            setDisable2(false);
            const pr = {
                MenuName: SearchValue.MenuName?.trim(),
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spMenuAdmin_List",
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
    const Shop_spMenuAdmin_Delete = async (item) => {
        try {
            ConfirmAlert("", "Bạn có chắc muốn xóa?", "OK, Xác nhận xóa!", async () => {
                let Data = item.row._original;
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        Id: Data.Id,
                        IsDelete: 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spMenuAdmin_Delete",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.Status === "OK") {
                    setListData(
                        ListData.filter((item) => item.Id !== Data.Id)
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
    const Shop_spMenuAdmin_Hide = async (item) => {
        try {
            let Data = item.row._original, titleContent = "", titleButton = "";
            if (Data.IsHide) {
                titleContent = "Bạn có chắc muốn hiện menu?";
                titleButton = "Ok, Hiện menu";
            } else {
                titleContent = "Bạn có chắc muốn ẩn menu?";
                titleButton = "Ok, Ẩn menu";
            }
            ConfirmAlert("", titleContent, titleButton, async () => {
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        Id: Data.Id,
                        IsHide: Data.IsHide ? 0 : 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spMenuAdmin_Hide",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result[0]?.OK === "OK") {
                    ListData.map((e) => {
                        if (e.Id === Data.Id) {
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
        setTitle("Sửa menu");
        let Data = item.row._original;
        setFromValue({
            Id: Data.Id,
            MenuName: Data.MenuName,
            MenuUrl: Data.MenuUrl,
            Icon: Data.Icon,
            IconClass: Data.IconClass,
            IndexNumber: Data.IndexNumber,
            ParentId: { value: Data.ParentId },
            IsHide: Data.IsHide ? 1 : 0,
            IsDelete: Data.IsDelete ? 1 : 0,
        });
    };
    //#region edit

    //#region change index
    const Shop_spMenuAdmin_ChangeIndex = async (item, key) => {
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
                    Id: Data.Id,
                    IndexNumber: _IndexNumber,
                    UserId: User.UserId,
                }),
                func: "Shop_spMenuAdmin_ChangeIndex",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                ListData.map((e) => {
                    if (e.Id === Data.Id) {
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
    const Shop_spMenuAdmin_ExportExcel = () => {
        setDisable2(false);
        const newData = ListData.map(element => {
            return {
                'Tên menu': element.MenuName,
                'Url': element.MenuUrl,
                'Parent menu': element.ParentName,
                'Người tạo': element.CreateName,
                'Ngày tạo': FormatDateJson(element.CreateOn),
                'Người sửa': element.EditName,
                'Ngày sửa': FormatDateJson(element.EditOn),
            }
        })
        ExportExcel(newData, "Danh sách menu")
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
                        onClick={(e) => Shop_spMenuAdmin_Delete({ row })}
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
                            <a className="pointer" onClick={e => Shop_spMenuAdmin_Hide({ row })} title="Ẩn" >
                                <img src="../assets/img/icons8-toggle-off-50.png" className="transform-13" alt="Toggle Off" width="20" />
                            </a>
                        ) : (
                            <a className="pointer" onClick={e => Shop_spMenuAdmin_Hide({ row })} title="Hiện">
                                <img src="../assets/img/icons8-toggle-on-50.png" className="transform-13" alt="Toggle On" width="20" />
                            </a>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "Icon",
            accessor: "Icon",
            width: 70,
            filterable: false,
            Cell: ({ row }) => {
                return (
                    <div>
                        {row.Icon !== undefined && row.Icon !== "" && row.Icon !== null ? (
                            row._original.Icon.split(",").map((img, index) => {
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
                                <button className="btn btn-default btn-xs ipg-btn" type="button" onClick={(e) => Shop_spMenuAdmin_ChangeIndex({ row }, 'down')}>
                                    <i className="fa-solid fa-caret-down transform-16"></i>
                                </button>
                            </div>
                            <span className="ipg-text">{row._original.IndexNumber} </span>
                            <div className="input-group-append">
                                <button className="btn btn-default btn-xs ipg-btn" type="button" onClick={(e) => Shop_spMenuAdmin_ChangeIndex({ row }, 'up')}>
                                    <i className="fa-solid fa-caret-up transform-16"></i>
                                </button>
                            </div>
                        </div>
                    </>
                );
            },
        },
        {
            Header: "Tên menu",
            accessor: "MenuName",
        },
        {
            Header: "Url",
            accessor: "MenuUrl",
        },
        {
            Header: "Parent menu",
            accessor: "ParentName",
        },
        {
            Header: "Class Icon",
            accessor: "IconClass",
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
                                        Tên menu <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.MenuName}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, MenuName: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Url
                                    </label>
                                    <input
                                        placeholder="EX: /khuyen-mai"
                                        type="text"
                                        className="form-control"
                                        value={FromValue.MenuUrl}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, MenuUrl: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Parent menu
                                    </label>
                                    <SelectMenuAdmin
                                        Data={FromValue.ParentId}
                                        onSelected={(e) => {
                                            setFromValue({ ...FromValue, ParentId: e })
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Class Icon
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.IconClass}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, IconClass: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <ImgUploadTemp
                                    onImageUpload={(e) => setFileUpload(e)}
                                    onData={(e) => setFromValue({ ...FromValue, Icon: e })}
                                    data={FromValue.Icon}
                                    isReset={resetImage}
                                    title="Icon menu"
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
                                    Shop_spMenuAdmin_Save();
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
                            <span className="HomeTitle">Tìm kiếm menu</span>
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
                                        <i className="fa-solid fa-plus mr-2"></i>Thêm menu mới
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
                                    Tên menu <span className="red">(*)</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={SearchValue.MenuName}
                                    onChange={(e) =>
                                        setSearchValue({ ...SearchValue, MenuName: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-md-12 text-center mt-3 mb-3">
                            <button
                                type="button"
                                className="btn btn-sm btn-success"
                                disabled={!Disable2}
                                onClick={(e) => Shop_spMenuAdmin_List()}
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
                                Danh sách menu
                                <span className="ml-2 color-green">{ListData.length > 0 && `(${ListData.length})`}</span>
                            </span>
                            <div className="float-right">
                                {ListData.length > 0 && <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success mr-1"
                                    disabled={!Disable2}
                                    onClick={e => Shop_spMenuAdmin_ExportExcel()}
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

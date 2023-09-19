import React, { useRef, useState } from "react";
import LayoutMain from "../../Layout/LayoutMain";
import { useDispatch } from "react-redux";
import {
    DataTable,
    ImgUploadTemp,
    MyEditor,
    TinyMCE
} from "../../Common";
import DateTimePicker from "react-datetime-picker";
import {
    FirstOrLastDayinMonth,
    Alerterror,
    DecodeString,
    GetCookieValue,
    Alertsuccess,
    Alertwarning,
    FormatDateJson,
    ConfirmAlert,
    ExportExcel,
    FormatNumber
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { LINK_IMAGE } from "../../Services";

export const Service = () => {
    const dispatch = useDispatch();

    const [Title, setTitle] = useState("Quản lý dịch vụ");
    const [TitleBtnAdd, setTitleBtnAdd] = useState("Thêm dịch vụ");
    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const [FileUpload, setFileUpload] = useState([]);
    const [resetImage, setResetImage] = useState(0);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [AllowChange, setAllowChange] = useState(false);
    const [ChangeStyle, setChangeStyle] = useState(false);
    const ListRefts = {
        ServiceCodeRef: useRef(),
        ServiceNameRef: useRef(),
        ServiceNoteRef: useRef(),
        ServicePriceRef: useRef(),
    };

    const [FromValue, setFromValue] = useState({
        ServiceId: 0,
        ServiceCode: "",
        ServiceName: "",
        ServicePrice: "",
        ServiceNote: "",
        ServiceDesciption: "",
        ImageService: "",
        ServiceDetails: "",
        CreateBy: "",
        IsHide: 0,
        IsDelete: 0,
        // TypeService: [],
    });

    const [ServiceDesciption, setServiceDesciption] = useState("");
    const [ListData, setListData] = useState([]);

    const [SearchValue, setSearchValue] = useState({
        FromDate: FirstOrLastDayinMonth(new Date(), 1),
        ToDate: new Date(),
        ServiceName: "",
    });

    const ClearForm = () => {
        setFromValue({
            ServiceId: 0,
            ServiceCode: "",
            ServicePrice: "",
            ServiceName: "",
            ServiceNote: "",
            ServiceDesciption: "",
            ImageService: "",
            ServiceDetails: "",
            CreateBy: "",
            IsHide: 0,
            IsDelete: 0,
            // TypeService: [],
        });
        setServiceDesciption("");
        setFileUpload([]);
        setResetImage(Math.random());
        setAllowChange(false)
    };

    //#region Save
    const Shop_spServices_Save = async () => {
        try {
            setDisable(false);
            let TypeServiceTmp = [], ListTypeServicesId = [], ListTypeServicesName = '', _newListImage = '';
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
                _newListImage = [newListImage, FromValue?.ImageService || ""].join(",");

            } else if (typeof FileUpload === 'string' || FileUpload.length === 0) {
                _newListImage = FromValue.ImageService
            } else if (!_newListImage) {
                Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
                setDisable(true);
                return;
            }

            // if (Array.isArray(FromValue.TypeService)) {
            //     FromValue.TypeService.forEach((element) => {
            //         TypeServiceTmp.push({
            //             TypeServiceId: element.value,
            //         });
            //     });
            //     ListTypeServicesId = FromValue.TypeService
            //         .filter(item => item.value !== 0)
            //         .map(item => item.value)
            //         .join(',');

            //     ListTypeServicesName = FromValue.TypeService
            //         .filter(item => item.value !== 0)
            //         .map(item => item.label)
            //         .join(',');
            // }
            if (FromValue.ServiceCode !== "" && FromValue.ServiceCode.length < 6) {
                Alertwarning("Mã dịch vụ ít nhất 6 ký tự");
                setDisable(true);
                ListRefts.ServiceCodeRef.current.focus();
                return;
            }

            if (FromValue.ServiceName === "" || FromValue.ServiceName === undefined) {
                Alertwarning("Vui lòng nhập tên dịch vụ");
                setDisable(true);
                ListRefts.ServiceNameRef.current.focus();
                return;
            }

            if (FromValue.ServiceNote === "" || FromValue.ServiceNote === undefined) {
                Alertwarning("Vui lòng nhập tên chi tiết");
                setDisable(true);
                ListRefts.ServiceNoteRef.current.focus();
                return;
            }

            if (FromValue.ServicePrice === "" || FromValue.ServicePrice === undefined) {
                Alertwarning("Vui lòng nhập giá dịch vụ");
                setDisable(true);
                ListRefts.ServicePriceRef.current.focus();
                return;
            }
            if (FromValue.ServicePrice < 1) {
                Alertwarning("Giá dịch vụ phải lớn hơn 0");
                setDisable(true);
                ListRefts.ServicePriceRef.current.focus();
                return;
            }
            // if (ListTypeServicesId.length === 0) {
            //     Alertwarning("Vui lòng chọn danh mục dịch vụ");
            //     setDisable(true);
            //     return;
            // }
            if (_newListImage === "" || _newListImage === undefined) {
                Alertwarning("Vui lòng nhập hình ảnh dịch vụ");
                setDisable(true);
                return;
            }
            if (FromValue.ServiceDetails === "") {
                Alertwarning("Vui lòng nhập chi tiết dịch vụ");
                setDisable(true);
                return;
            }
            if (ServiceDesciption === '' || ServiceDesciption === undefined) {
                Alertwarning("Vui lòng nhập mô tả dịch vụ");
                setDisable(true);
                return;
            }

            const params = {
                Json: JSON.stringify({
                    ServiceId: FromValue.ServiceId,
                    ServiceCode: FromValue.ServiceCode?.trim(),
                    ServiceName: FromValue.ServiceName?.trim(),
                    ServiceNote: FromValue.ServiceNote?.trim(),
                    ServicePrice: FromValue.ServicePrice,
                    ServiceDesciption: ServiceDesciption?.trim(),
                    ImageService: _newListImage,
                    ServiceDetails: FromValue.ServiceDetails,
                    IsHide: FromValue.IsHide,
                    IsDelete: FromValue.IsDelete,
                    UserId: User.UserId,
                    // ListTypeServicesId: ListTypeServicesId,
                }),
                func: "Shop_spServices_Save",
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
                    if (e.ServiceId === FromValue.ServiceId) {
                        e.ServiceId = FromValue.ServiceId;
                        e.ServiceCode = FromValue.ServiceCode;
                        e.ServiceName = FromValue.ServiceName;
                        e.ServiceNote = FromValue.ServiceNote;
                        e.ServicePrice = FromValue.ServicePrice;
                        e.IsHot = FromValue.IsHot;
                        e.IsNew = FromValue.IsNew;
                        e.IsHide = FromValue.IsHide;
                        e.IsDelete = FromValue.IsDelete;
                        e.ServiceDesciption = ServiceDesciption;
                        e.ImageService = _newListImage;
                        e.ListCategoriesId = FromValue.TypeService
                            .filter(item => item.value !== 0)
                            .map(item => item.value)
                            .join(',');
                        e.ListCategoriesName = FromValue.TypeService
                            .filter(item => item.value !== 0)
                            .map(item => item.label)
                            .join(',');
                        e.EditOn = FormatDateJson(timeConfirm);
                        e.EditName = User.UserName;
                        e.ServiceDetails = FromValue.ServiceDetails;
                        e.TypeService = TypeServiceTmp;
                    }
                    return e;
                });
                setTitle("Quản lý dịch vụ");
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
    const Shop_spServices_List = async () => {
        try {
            setDisable2(false);
            const pr = {
                FromDate: FormatDateJson(SearchValue.FromDate, 9),
                ToDate: FormatDateJson(SearchValue.ToDate, 9),
                ServiceName: SearchValue.ServiceName?.trim(),
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spServices_List",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setListData(result);
                setDisable2(true);
                return;
            }
            setListData([]);
            Alertwarning("Không có dữ liệu");
            setDisable2(true);
        } catch (err) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
            setDisable2(true);
        }
    };
    //#endregion

    //#region delete
    const Shop_spServices_Delete = async (item) => {
        try {
            ConfirmAlert("", "Bạn có chắc muốn xóa?", "OK, Xác nhận xóa!", async () => {
                let Data = item.row._original;
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        ServiceId: Data.ServiceId,
                        IsDelete: 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spServices_Delete",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.Status === "OK") {
                    setListData(
                        ListData.filter((item) => item.ServiceId !== Data.ServiceId)
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
    const Shop_spServices_Hide = async (item) => {
        try {
            let Data = item.row._original, titleContent = "", titleButton = "";
            if (Data.IsHide) {
                titleContent = "Bạn có chắc muốn hiện dịch vụ?";
                titleButton = "Ok, Hiện dịch vụ";
            } else {
                titleContent = "Bạn có chắc muốn ẩn dịch vụ?";
                titleButton = "Ok, Ẩn dịch vụ";
            }
            ConfirmAlert("", titleContent, titleButton, async () => {
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        ServiceId: Data.ServiceId,
                        IsHide: Data.IsHide ? 0 : 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spServices_Hide",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result[0]?.OK === "OK") {
                    ListData.map((e) => {
                        if (e.ServiceId === Data.ServiceId) {
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

    //#region hot
    const Shop_spServices_Hot = async (item) => {
        try {
            let Data = item.row._original, titleContent = "", titleButton = "";
            if (Data.IsHot) {
                titleContent = "Ẩn dịch vụ ở trang chủ?";
                titleButton = "Ok, Ẩn dịch vụ";
            } else {
                titleContent = "Hiện dịch vụ ở trang chủ?";
                titleButton = "Ok, Hiện dịch vụ";
            }
            ConfirmAlert("", titleContent, titleButton, async () => {
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        ServiceId: Data.ServiceId,
                        IsHot: Data.IsHot ? 0 : 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spServices_Hot",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result[0]?.OK === "OK") {
                    ListData.map((e) => {
                        if (e.ServiceId === Data.ServiceId) {
                            e.IsHot = result[0].IsHot;
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
    const Shop_spServices_Edit = (item, key) => {

        setChangeStyle(true)
        if (key === 'view') {
            setTitle("Chi tiết dịch vụ")
            setTitleBtnAdd("Trở lại")
            setAllowChange(true)
        } else {
            setTitle("Sửa dịch vụ")
            setTitleBtnAdd("Trở lại")
            setAllowChange(false)
        }

        let Data = item.row._original;
        debugger
        let _ListTypeServicesId = Data.ListCategoriesId === undefined ? [] : Data.ListCategoriesId.split(",")
        let _ListTypeServicesName = Data.ListCategoriesName === undefined ? [] : Data.ListCategoriesName.split(",")
        let TypeService = _ListTypeServicesId.map((value, index) => {
            return {
                value: value,
                name: _ListTypeServicesName[index]
            };
        });
        setFromValue({
            ServiceId: Data.ServiceId,
            ServiceCode: Data.ServiceCode,
            ServiceName: Data.ServiceName,
            ServiceNote: Data.ServiceNote,
            ServicePrice: Data.ServicePrice,
            ImageService: Data.ImageService,
            CreateBy: User.UserId,
            Attributes: Data.Attributes,
            ServiceDetails: Data.ServiceDetails,
            TypeService: TypeService,
        });
        setServiceDesciption(Data.ServiceDesciption);
        window.scrollTo(0, 0);
    };
    //#endregion

    //#region export excel
    const Shop_spProduct_ExportExcel = () => {
        setDisable2(false);
        const newData = ListData.map(element => {
            return {
                'Mã dịch vụ': element.CustomerCode,
                'Tên dịch vụ': element.CustomerName,
                'Tên chi tiết': element.ServiceNote,
                'Giá dịch vụ': element.ServicePrice,
                'Người tạo': element.CreateName,
                'Ngày tạo': FormatDateJson(element.CreateOn),
                'Người sửa': element.EditName,
                'Ngày sửa': FormatDateJson(element.EditOn),
            }
        })
        ExportExcel(newData, "Danh sách dịch vụ")
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
                        className="fa fa-eye green btn-cursor button"
                        onClick={(e) => {
                            Shop_spServices_Edit({ row }, 'view')
                        }}
                        title="Chi tiết"
                    />
                    <i
                        className="fa fa-edit orange btn-cursor button ml10"
                        onClick={(e) => {
                            Shop_spServices_Edit({ row }, 'edit')
                        }}
                        title="Sửa"
                    />
                    <i
                        className="fa fa-trash red btn-cursor button ml10"
                        onClick={(e) => Shop_spServices_Delete({ row })}
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
                            <a className="pointer" onClick={e => Shop_spServices_Hide({ row })} title="Ẩn" >
                                <img src="../assets/img/icons8-toggle-off-50.png" className="transform-13" alt="Toggle Off" width="20" />
                            </a>
                        ) : (
                            <a className="pointer" onClick={e => Shop_spServices_Hide({ row })} title="Hiện">
                                <img src="../assets/img/icons8-toggle-on-50.png" className="transform-13" alt="Toggle On" width="20" />
                            </a>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "Hiện trang chủ",
            accessor: "IsHot",
            filterable: false,
            width: 150,
            Cell: ({ row }) => {
                return (
                    <div>
                        {row._original.IsHot ? (
                            <a className="pointer" onClick={e => Shop_spServices_Hot({ row })} title="Hiện" >
                                <img src="../assets/img/icons8-toggle-on-50.png" className="transform-13" alt="Toggle On" width="20" />
                            </a>
                        ) : (
                            <a className="pointer" onClick={e => Shop_spServices_Hot({ row })} title="Ẩn">
                                <img src="../assets/img/icons8-toggle-off-50.png" className="transform-13" alt="Toggle Off" width="20" />
                            </a>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "Hình ảnh",
            accessor: "ImageService",
            filterable: false,
            Cell: ({ row }) => {
                return (
                    <div>
                        {row.ImageService !== undefined && row.ImageService !== "" && row.ImageService !== null ? (
                            row._original.ImageService.split(",").map((img, index) => {
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
            Header: "Mã dịch vụ",
            accessor: "ServiceCode",
        },
        {
            Header: "Tên dịch vụ",
            accessor: "ServiceName",
        },
        {
            Header: "Tên chi tiết",
            accessor: "ServiceNote",
        },
        {
            Header: "Giá dịch vụ",
            accessor: "ServicePrice",
            Cell: (item) => <span>{FormatNumber(item.value)}</span>,
        },
        // {
        //     Header: "Danh mục dịch vụ",
        //     // accessor: "ServiceNote",
        // },
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

    return (
        <LayoutMain>
            <div className="row Formlading">
                <div className="col-md-12">
                    <div className="row mt-3">
                        <div className="col-md-12">
                            <span className="HomeTitle">{Title}</span>
                            <div className="float-right">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-success ml-3"
                                    disabled={!Disable}
                                    data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"
                                    onClick={e => {
                                        ClearForm()
                                        setChangeStyle(!ChangeStyle)
                                        setTitle(!ChangeStyle ? "Thêm mới dịch vụ" : "Quản lý dịch vụ")
                                        setTitleBtnAdd("Thêm dịch vụ")
                                    }}
                                >
                                    <span>
                                        <i className={ChangeStyle ? "fas fa-chevron-down mr-2 rotate-180" : "fas fa-chevron-down mr-2 rotate-0"} ></i>{TitleBtnAdd}
                                    </span>
                                </button>
                            </div>
                            <div className="col-md-12 margin-top-10 border-bottom-dash"></div>
                            <div className={ChangeStyle ? "" : "display-none"}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="no-absolute">
                                                Mã dịch vụ
                                            </label>
                                            <input
                                                placeholder="Tự động tạo mã (Mã dịch vụ)"
                                                type="text"
                                                className="form-control"
                                                value={FromValue.ServiceCode}
                                                onChange={(e) =>
                                                    setFromValue({ ...FromValue, ServiceCode: e.target.value })
                                                }
                                                ref={ListRefts.ServiceCodeRef}
                                                readOnly={AllowChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="no-absolute">
                                                Tên dịch vụ <span className="red">(*)</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={FromValue.ServiceName}
                                                onChange={(e) =>
                                                    setFromValue({ ...FromValue, ServiceName: e.target.value })
                                                }
                                                ref={ListRefts.ServiceNameRef}
                                                readOnly={AllowChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="no-absolute">
                                                Tên chi tiết <span className="red">(*)</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={FromValue.ServiceNote}
                                                onChange={(e) =>
                                                    setFromValue({ ...FromValue, ServiceNote: e.target.value })
                                                }
                                                ref={ListRefts.ServiceNoteRef}
                                                readOnly={AllowChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="no-absolute">
                                                Giá dịch vụ <span className="red">(*)</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={FromValue.ServicePrice}
                                                onChange={(e) =>
                                                    setFromValue({ ...FromValue, ServicePrice: e.target.value })
                                                }
                                                ref={ListRefts.ServicePriceRef}
                                                readOnly={AllowChange}
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="no-absolute">
                                                    Danh mục dịch vụ <span className="red">(*)</span>
                                                </label>
                                                <SelectService
                                                    onSelected={(e) => {
                                                        setFromValue({ ...FromValue, TypeService: e })
                                                    }}
                                                    clearData={FromValue.TypeService}
                                                    isMulti={true}
                                                    isDisabled={AllowChange}
                                                />
                                            </div>
                                        </div> */}

                                    <div className="col-md-12">
                                        <ImgUploadTemp
                                            onImageUpload={(e) => setFileUpload(e)}
                                            onData={(e) => setFromValue({ ...FromValue, ImageService: e })}
                                            data={FromValue.ImageService}
                                            isReset={resetImage}
                                            readOnly={AllowChange}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="no-absolute">
                                                Chi tiết dịch vụ <span className="red">(*)</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={FromValue.ServiceDetails}
                                                onChange={(e) =>
                                                    setFromValue({ ...FromValue, ServiceDetails: e.target.value })
                                                }
                                                readOnly={AllowChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12 CKEditor-m">
                                        <label className="no-absolute">
                                            Mô tả dịch vụ <span className="red">(*)</span>
                                        </label>
                                    </div>
                                    <MyEditor
                                        onChange={e => setServiceDesciption(e)}
                                        values={ServiceDesciption}
                                        height={400}
                                    />
                                    {!AllowChange &&
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
                                                onClick={(e) => Shop_spServices_Save()}
                                            >
                                                <span>
                                                    <i className="fa-regular fa-floppy-disk mr-1"></i>Lưu
                                                </span>
                                            </button>
                                        </div>
                                    }
                                </div>
                                <div className="col-md-12 margin-top-10 border-bottom-dash"></div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <span className="HomeTitle">Tìm kiếm</span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="no-absolute">
                                            Từ ngày<span className="red">(*)</span>
                                        </label>
                                        <DateTimePicker
                                            className="form-control fix-date-time"
                                            format="MM/dd/yyyy"
                                            value={SearchValue.FromDate}
                                            onChange={(e) => setSearchValue({ ...SearchValue, FromDate: e })}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="no-absolute">
                                            Đến ngày<span className="red">(*)</span>
                                        </label>
                                        <DateTimePicker
                                            className="form-control fix-date-time"
                                            format="MM/dd/yyyy"
                                            value={SearchValue.ToDate}
                                            onChange={(e) => setSearchValue({ ...SearchValue, ToDate: e })}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="no-absolute">
                                            Tên dịch vụ <span className="red">(*)</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={SearchValue.ProductName}
                                            onChange={(e) =>
                                                setSearchValue({ ...SearchValue, ProductName: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 text-center mt-3 mb-3">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success"
                                        disabled={!Disable2}
                                        onClick={(e) => Shop_spServices_List()}
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
                                        Danh sách dịch vụ
                                        <span className="ml-2 color-green">{ListData.length > 0 && `(${ListData.length})`}</span>
                                    </span>
                                    <div className="float-right">
                                        {ListData.length > 0 && <button
                                            type="button"
                                            className="btn btn-sm btn-outline-success mr-1"
                                            disabled={!Disable2}
                                            onClick={e => Shop_spProduct_ExportExcel()}
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
                        </div>
                    </div>
                </div>
            </div>
        </LayoutMain >
    );
};

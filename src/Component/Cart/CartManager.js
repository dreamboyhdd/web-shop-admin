import React, { useEffect, useState } from "react";
import LayoutMain from "../../Layout/LayoutMain";
import { useDispatch } from "react-redux";
import {
    DataTable
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
    FirstOrLastDayinMonth,
    FormatNumber,
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import DateTimePicker from "react-datetime-picker/dist/DateTimePicker";

export const CartManager = () => {
    const dispatch = useDispatch();
    useEffect(() => { }, []);

    const [Title, setTitle] = useState("Thay đổi giỏ hàng");
    const [ShowTable, setShowTable] = useState(true);
    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const [FileUpload, setFileUpload] = useState([]);
    const [resetImage, setResetImage] = useState(0);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [FromValue, setFromValue] = useState({
        Id: 0,
        OrderCode: ''
    });

    const [ListData, setListData] = useState([]);
    const [DetailData, setDetailData] = useState([]);

    const [SearchValue, setSearchValue] = useState({
        FromDate: FirstOrLastDayinMonth(new Date(), 1),
        ToDate: new Date(),
        OderCode: "",
    });

    const ClearForm = () => {
        setFromValue({
            Id: 0,
            OrderCode: ''
        });
        setFileUpload([]);
        setResetImage(Math.random());
    };

    //#region Save
    const Shop_spOrder_Save = async () => {
         
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
            if (FromValue.MenuUrl === "" || FromValue.MenuUrl === undefined) {
                Alertwarning("Vui lòng nhập tên menu");
                setDisable(true);
                return;
            }

            const params = {
                Json: JSON.stringify({
                    Id: FromValue.Id,
                    MenuName: FromValue.MenuName?.trim(),
                    MenuUrl: FromValue.MenuUrl?.trim(),
                    Icon: _newListImage,
                    IndexNumber: FromValue.IndexNumber,
                    ParentId: FromValue.ParentId?.value,
                    IsHide: FromValue.IsHide,
                    IsDelete: FromValue.IsDelete,
                    UserId: User.UserId,
                }),
                func: "Shop_spOrder_Save",
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
                        e.IndexNumber = FromValue.IndexNumber;
                        e.ParentId = FromValue.ParentId?.value;
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
    const Shop_spOrder_List = async () => {
        try {
            setDisable2(false);
            const pr = {
                FromDate: FormatDateJson(SearchValue.FromDate, 9),
                ToDate: FormatDateJson(SearchValue.ToDate, 9),
                OderCode: SearchValue.OderCode?.trim(),
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spOrder_List",
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
    //#region List
    const Shop_spOrder_Details_List = async (item) => {
        try {
            let Data = item.row._original;
            setDisable2(false);
            const pr = {
                OrderId: Data.OrderId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spOrder_Details_List",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setDetailData(result);
                setDisable2(true);
                setShowTable(false)
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
    const Shop_spOrder_Delete = async (item) => {
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
                    func: "Shop_spOrder_Delete",
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
    const Shop_spOrder_Hide = async (item) => {
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
                    func: "Shop_spOrder_Hide",
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
        setTitle("Sửa order");
        let Data = item.row._original;
        setFromValue({
            Id: Data.Id,
            MenuName: Data.MenuName,
            MenuUrl: Data.MenuUrl,
            Icon: Data.Icon,
            IndexNumber: Data.IndexNumber,
            ParentId: { value: Data.ParentId },
            IsHide: Data.IsHide ? 1 : 0,
            IsDelete: Data.IsDelete ? 1 : 0,
        });
    };
    //#region edit

    //#region change index
    const Shop_spOrder_ChangeStatus = async (item, key) => {
        try {
            let Data = item.row._original, titleContent = "", titleButton = "";
            if (Data.OrderStatusId === 1) {
                titleContent = "Xác nhận đặt hàng?";
                titleButton = "Ok";
            } else if (Data.OrderStatusId === 2) {
                titleContent = "Xác nhận thanh toán?";
                titleButton = "Ok";
            }
            ConfirmAlert("", titleContent, titleButton, async () => {
                setDisable2(false);
                let Data = item.row._original;
                const params = {
                    Json: JSON.stringify({
                        OrderId: Data.OrderId,
                        OrderStatusId: key === 'delete' ? 4 : Data.OrderStatusId,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spOrder_ChangeStatus",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                 
                if (result[0]?.OK === "OK") {
                    ListData.map((e) => {
                        const timeConfirm = new Date();
                        if (e.OrderId === Data.OrderId) {
                            e.OrderStatusId = result[0].OrderStatusId;
                            e.EditOn = FormatDateJson(timeConfirm);
                            e.EditName = User.UserName;
                            e.EditBy = User.UserId;
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

    //#region export excel
    const Shop_spOrder_ExportExcel = () => {
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
                        className="fa fa-eye green button btn-cursor"
                        onClick={(e) => {
                            Shop_spOrder_Details_List({ row });
                            setFromValue({ OrderCode: row._original.OrderCode })
                        }}
                        title="Chi tiết"
                    />
                    {row._original.OrderStatusId !== 4 && row._original.OrderStatusId !== 3 && (
                        <i
                            className={
                                row._original.OrderStatusId !== 4 && row._original.OrderStatusId !== 3
                                    ? "fa fa-trash red button btn-cursor ml10"
                                    : "fa fa-trash red button cursor-auto ml10"
                            }
                            onClick={(e) => Shop_spOrder_ChangeStatus({ row }, 'delete')}
                            title="Xóa"
                        />
                    )}
                </>
            ),
            width: 110,
            filterable: false,
        },
        {
            Header: "Trạng thái",
            accessor: "OrderStatusName",
            Cell: ({ row }) => (
                <>
                    {row._original.OrderStatusId === 1 &&
                        <span>
                            <button className="btn btn-xs btn-info mg-0" onClick={e => Shop_spOrder_ChangeStatus({ row })}>
                                Mới tạo
                            </button>
                        </span>
                    }
                    {row._original.OrderStatusId === 2 &&
                        <span>
                            <button className="btn btn-xs btn-warning mg-0" onClick={e => Shop_spOrder_ChangeStatus({ row })}>
                                Chờ thanh toán
                            </button>
                        </span>
                    }
                    {row._original.OrderStatusId === 3 &&
                        <span>
                            <button className="btn btn-xs btn-success mg-0 cursor-auto" >
                                Đã thanh toán
                            </button>
                        </span>
                    }
                    {row._original.OrderStatusId === 4 &&
                        <span>
                            <button className="btn btn-xs btn-danger mg-0 cursor-auto" >
                                Đã hủy
                            </button>
                        </span>
                    }
                </>
            ),
        },
        {
            Header: "Mã Order",
            accessor: "OrderCode",
        },
        {
            Header: "Tên khách hàng",
            accessor: "CustomerName",
        },
        {
            Header: "SĐT khách hàng",
            accessor: "CustomerPhone",
        },
        {
            Header: "Ngày order",
            accessor: "OrderDate",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        },
        {
            Header: "Voucher Giảm",
            accessor: "VoucherPrice",
            Cell: (item) => FormatNumber(item.value),
        },
        {
            Header: "Giảm giá",
            accessor: "Discount",
            Cell: (item) => FormatNumber(item.value),
        },
        {
            Header: "Phí VAT",
            accessor: "VATPrice",
            Cell: (item) => FormatNumber(item.value),
        },
        {
            Header: "Phí phụ thu",
            accessor: "SurchargePrice",
            Cell: (item) => FormatNumber(item.value),
        },
        {
            Header: "Số lượng",
            accessor: "TotalQuatity",
        },
        {
            Header: "Tổng tiền",
            accessor: "TotalAmount",
            Cell: (item) => FormatNumber(item.value),
        },
        {
            Header: "Nhân viên sử lý",
            accessor: "EditName",
        },
        {
            Header: "Ngày xử lý",
            accessor: "EditOn",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        },
    ];
    const columns2 = [
        {
            Header: "STT",
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 40,
            filterable: false,
            special: true,
            show: true,
        },
        {
            Header: "Tên sản phẩm",
            accessor: "ProductName",
        },
        {
            Header: "Loại sản phẩm",
            accessor: "ProductAttributeName",
        },
        {
            Header: "Số lượng",
            accessor: "Quatity",
        },
        {
            Header: "Giá tiền",
            accessor: "Price",
            Cell: (item) => FormatNumber(item.value),
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
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Tên khách hàng <span className="red">(*)</span>
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
                                    Shop_spOrder_Save();
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
                            <span className="HomeTitle">Quản lý giỏ hàng</span>
                            <div className="float-right">
                                {/* <button
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
                                        </button> */}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 margin-top-10 border-bottom-dash"></div>

                    <div className="row">
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
                                    Mã order
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={SearchValue.OderCode}
                                    onChange={(e) =>
                                        setSearchValue({ ...SearchValue, OderCode: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-md-12 text-center mt-3 mb-3">
                            <button
                                type="button"
                                className="btn btn-sm btn-success"
                                disabled={!Disable2}
                                onClick={(e) => Shop_spOrder_List()}
                            >
                                <span>
                                    <i className="fa-solid fa-magnifying-glass mr-1"></i>
                                    Tìm kiếm
                                </span>
                            </button>
                        </div>
                    </div>
                    {ShowTable ? (
                        <>
                            <div className="col-md-12 margin-top-10 border-bottom-dash"></div>
                            <div className="row">
                                <div className="col-md-12">
                                    <span className="HomeTitle">
                                        Danh sách order
                                        <span className="ml-2 color-green">{ListData.length > 0 && `(${ListData.length})`}</span>
                                    </span>
                                    <div className="float-right">
                                        {ListData.length > 0 && <button
                                            type="button"
                                            className="btn btn-sm btn-outline-success mr-1"
                                            disabled={!Disable2}
                                            onClick={e => Shop_spOrder_ExportExcel()}
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
                        </>
                    ) : (
                        <>
                            <div className="col-md-12 margin-top-10 border-bottom-dash"></div>
                            <div className="row">
                                <div className="col-md-12">
                                    <span className="HomeTitle">
                                        Chi tiết order:
                                        <span className="ml-2 color-green">{FromValue.OrderCode}</span>
                                    </span>
                                    <div className="float-right">
                                        <button
                                            type="reset"
                                            className="btn btn-sm btn-info"
                                            onClick={(e) => setShowTable(true)}
                                        >
                                            <i className="material-icons">undo</i>
                                            Trở lại
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12 mb-3">
                                    <DataTable data={DetailData} columns={columns2} />
                                </div>
                            </div>
                        </>
                    )}
                    {ModalCreateNews}
                </div>
            </div>
        </LayoutMain>
    );
};

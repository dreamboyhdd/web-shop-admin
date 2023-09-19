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
    FirstOrLastDayinMonth,
    ExportExcel,
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import DateTimePicker from "react-datetime-picker/dist/DateTimePicker";

export const Customer = () => {
    const dispatch = useDispatch();
    useEffect(() => { }, []);

    const [CustomerName, setCustomerName] = useState("Thêm khách hàng");

    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const [FileUpload, setFileUpload] = useState([]);
    const [resetImage, setResetImage] = useState(0);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [Title, setTitle] = useState("Thêm khách hàng");

    const [FromValue, setFromValue] = useState({
        CustomerId: 0,
        CustomerName: "",
        CustomerPhone: "",
        CustomerEmail: "",
        CustomerAddress: "",
        IsHide: 0,
        IsDelete: 0,
    });

    const [ListData, setListData] = useState([]);

    const [SearchValue, setSearchValue] = useState({
        FromDate: FirstOrLastDayinMonth(new Date(), 1),
        ToDate: new Date(),
        CustomerName: "",
    });

    const ClearForm = () => {
        setFromValue({
            CustomerId: 0,
            CustomerName: "",
            CustomerPhone: "",
            CustomerEmail: "",
            CustomerAddress: "",
            IsHide: 0,
            IsDelete: 0,
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
        return phoneRegex.test(phone);
    };

    //#region Save
    const Shop_spCustomer_Save = async () => {
        try {
            setDisable(false);

            if (FromValue.CustomerName === "" || FromValue.CustomerName === undefined) {
                Alertwarning("Vui lòng nhập tên khách hàng");
                setDisable(true);
                return;
            }

            if (FromValue.CustomerPhone !== "") {
                if (!validatePhone(FromValue.CustomerPhone)) {
                    Alertwarning("Số điện thoại không đúng định dạng");
                    setDisable(true);
                    return;
                }
            }

            if (FromValue.CustomerEmail !== "") {
                if (!validateEmail(FromValue.CustomerEmail)) {
                    Alertwarning("Email không đúng định dạng");
                    setDisable(true);
                    return;
                }
            }

            const params = {
                Json: JSON.stringify({
                    CustomerId: FromValue.CustomerId,
                    CustomerName: FromValue.CustomerName?.trim(),
                    CustomerPhone: FromValue.CustomerPhone?.trim(),
                    CustomerEmail: FromValue.CustomerEmail?.trim(),
                    CustomerAddress: FromValue.CustomerAddress?.trim(),
                    IsHide: FromValue.IsHide,
                    IsDelete: FromValue.IsDelete,
                    UserId: User.UserId,
                }),
                func: "Shop_spCustomer_Save",
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
                    if (e.CustomerId === FromValue.CustomerId) {
                        e.CustomerId = FromValue.CustomerId;
                        e.CustomerName = FromValue.CustomerName;
                        e.CustomerPhone = FromValue.CustomerPhone;
                        e.CustomerEmail = FromValue.CustomerEmail;
                        e.CustomerAddress = FromValue.CustomerAddress;
                        e.IsHide = FromValue.IsHide;
                        e.IsDelete = FromValue.IsDelete;
                        e.EditOn = FormatDateJson(timeConfirm);
                        e.EditName = User.UserName;
                    }
                    return e;
                });
                setCustomerName("Thêm khách hàng");
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
    const Shop_spCustomer_List = async () => {
        try {
            setDisable2(false);
            const pr = {
                FromDate: FormatDateJson(SearchValue.FromDate, 9),
                ToDate: FormatDateJson(SearchValue.ToDate, 9),
                CustomerName: SearchValue.CustomerName?.trim(),
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spCustomer_List",
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
    const Shop_spCustomer_Delete = async (item) => {
        try {
            ConfirmAlert("", "Bạn có chắc muốn xóa?", "OK, Xác nhận xóa!", async () => {
                let Data = item.row._original;
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        CustomerId: Data.CustomerId,
                        IsDelete: 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spCustomer_Delete",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.Status === "OK") {
                    setListData(
                        ListData.filter((item) => item.CustomerId !== Data.CustomerId)
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
    const Shop_spCustomer_Hide = async (item) => {
        try {
            let Data = item.row._original, titleContent = "", titleButton = "";
            if (Data.IsHide) {
                titleContent = "Bạn có chắc muốn hiện khách hàng?";
                titleButton = "Ok, Hiện khách hàng";
            } else {
                titleContent = "Bạn có chắc muốn ẩn khách hàng?";
                titleButton = "Ok, Ẩn khách hàng";
            }
            ConfirmAlert("", titleContent, titleButton, async () => {
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        CustomerId: Data.CustomerId,
                        IsHide: Data.IsHide ? 0 : 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spCustomer_Hide",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result[0]?.OK === "OK") {
                    ListData.map((e) => {
                        if (e.CustomerId === Data.CustomerId) {
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
    const Shop_spCustomer_Edit = (item) => {
        setCustomerName("Sửa khách hàng");
        let Data = item.row._original;
        setFromValue({
            CustomerId: Data.CustomerId,
            CustomerName: Data.CustomerName,
            CustomerPhone: Data.CustomerPhone,
            CustomerEmail: Data.CustomerEmail,
            CustomerAddress: Data.CustomerAddress,
            IsHide: Data.IsHide ? 1 : 0,
            IsDelete: Data.IsDelete ? 1 : 0,
        });
        setTitle('Sửa khách hàng')
    };
    //#endregion

    //#region export excel
    const Shop_spCustomer_ExportExcel = () => {
        setDisable2(false);
        const newData = ListData.map(element => {
            return {
                'Tên khách hàng': element.CustomerName,
                'SĐT khách hàng': element.CustomerPhone,
                'Địa chỉ khách hàng': element.CustomerAddress,
                'Email khách hàng': element.CustomerEmail,
                'Người tạo': element.CreateName,
                'Ngày tạo': FormatDateJson(element.CreateOn),
                'Người sửa': element.EditName,
                'Ngày sửa': FormatDateJson(element.EditOn),
            }
        })
        ExportExcel(newData, "Danh sách khách hàng")
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
                        onClick={(e) => Shop_spCustomer_Edit({ row })}
                        title="Sửa"
                    />
                    {/* <i
                        className="fa fa-trash red btn-cursor button"
                        onClick={(e) => Shop_spCustomer_Delete({ row })}
                        title="Xóa"
                    /> */}
                </>
            ),
            width: 110,
            filterable: false,
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
            Header: "Địa chỉ khách hàng",
            accessor: "CustomerAddress",
        },
        {
            Header: "Email khách hàng",
            accessor: "CustomerEmail",
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
                                        Tên khách hàng <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.CustomerName}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, CustomerName: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Địa chỉ khách hàng
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.CustomerAddress}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, CustomerAddress: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        SĐT khách hàng
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={FromValue.CustomerPhone}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, CustomerPhone: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Email khách hàng
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.CustomerEmail}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, CustomerEmail: e.target.value })
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
                                    Shop_spCustomer_Save();
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
                            <span className="HomeTitle">Quản lý khách hàng</span>
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
                                        <i className="fa-solid fa-plus mr-2"></i>Thêm khách hàng mới
                                    </span>
                                </button>
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
                                    Tên khách hàng <span className="red">(*)</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={SearchValue.CustomerName}
                                    onChange={(e) =>
                                        setSearchValue({ ...SearchValue, CustomerName: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-md-12 text-center mt-3 mb-3">
                            <button
                                type="button"
                                className="btn btn-sm btn-success"
                                disabled={!Disable2}
                                onClick={(e) => Shop_spCustomer_List()}
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
                                Danh sách khách hàng
                                <span className="ml-2 color-green">{ListData.length > 0 && `(${ListData.length})`}</span>
                            </span>
                            <div className="float-right">
                                {ListData.length > 0 && <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success mr-1"
                                    disabled={!Disable2}
                                    onClick={e => Shop_spCustomer_ExportExcel()}
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

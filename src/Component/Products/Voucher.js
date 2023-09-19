import React, { useEffect, useState } from "react";
import LayoutMain from "../../Layout/LayoutMain";
import { useDispatch } from "react-redux";
import {
    DataTable,
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
    ConfirmAlert, FormatNumber,
    ExportExcel
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { Voucher_Comp } from "./Voucher_Comp";

export const Voucher = () => {
    const dispatch = useDispatch();
    useEffect(() => { }, []);

    const [Title, setTitle] = useState("Quản lý giảm giá");
    const [TitleBtnAdd, setTitleBtnAdd] = useState("Tạo Voucher");

    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [AllowChange, setAllowChange] = useState(false);
    const [ChangeStyle, setChangeStyle] = useState(false);

    const [FromValue, setFromValue] = useState({
        VoucherId: 0,
        IsDelete: 0,
        ProductVoucher: [],
    });

    const [ListData, setListData] = useState([]);

    const [SearchValue, setSearchValue] = useState({
        FromDate: FirstOrLastDayinMonth(new Date(), 1),
        ToDate: new Date(),
    });

    const ClearForm = () => {
        setFromValue({
            VoucherId: 0,
            IsDelete: 0,
            ProductVoucher: [],
        });
        setAllowChange(false)
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        };
        return date.toLocaleString("en-US", options).replace(",", "");
    };

    //#region Save
    const Shop_spVoucher_Save = async () => {
        if (Array.isArray(FromValue.ProductVoucher.length === 0)) {
            Alertwarning('Vui lòng nhập dữ liệu')
            return
        }
        try {
            setDisable(false);
            let VoucherTmp = [];
            if (Array.isArray(FromValue.ProductVoucher)) {
                VoucherTmp = FromValue.ProductVoucher
                    .filter(e => e.IsDelete !== 1)
                    .map(e => ({
                        VoucherCode: e.VoucherCode,
                        CustomerId: e.CustomerId,
                        TypeDiscount: e.TypeDiscount,
                        Discount: e.Discount,
                        Fromday: formatDate(e.Fromday),
                        Today: formatDate(e.Today)
                    }));
            }
            const params = {
                Json: JSON.stringify({
                    VoucherId: FromValue.VoucherId,
                    IsDelete: FromValue.IsDelete,
                    UserId: User.UserId,
                    ProductVoucher: VoucherTmp,

                }),
                func: "Shop_spVoucher_Save",
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
                let a = VoucherTmp;
                let _IsDelete = FromValue.IsDelete === 0 ? true : false;
                a.push(...VoucherTmp, _IsDelete);
                ListData.map((e) => {
                    if (e.VoucherId === FromValue.VoucherId) {
                        e.IsDelete = FromValue.IsDelete;
                        e.ProductVoucher = a;
                        e.EditOn = FormatDateJson(timeConfirm);
                        e.EditName = User.UserName;
                    }
                    return e;
                });
                setTitle("Quản lý giảm giá");
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
    const Shop_spVoucher_List = async () => {
        try {
            setDisable2(false);
            const pr = {
                FromDate: FormatDateJson(SearchValue.FromDate, 9),
                ToDate: FormatDateJson(SearchValue.ToDate, 9),
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spVoucher_List",
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
    const Shop_spVoucher_Delete = async (item) => {
        const pr = {
            VoucherId: item.row._original.VoucherId,
        }
        try {
            ConfirmAlert("", "Bạn có chắc muốn xóa?", "OK, Xác nhận xóa!", async () => {
                const params = {
                    Json: JSON.stringify(pr),
                    func: "Shop_spVoucher_Delete"
                }
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.Status === 'OK') {
                    Alertsuccess(result.ReturnMess);
                    setListData(ListData.filter(e => e.VoucherId !== item.row._original.VoucherId));
                }
                else { }
            });
        } catch (error) {
            Alerterror("Lỗi dữ liệu tìm mã, Vui lòng liên hệ IT Netco!");
        }
    }
    //#endregion

    //#region edit
    const clickEdit = (item, key) => {
        setChangeStyle(!ChangeStyle)
        if (key === 'edit') {
            setTitle(!ChangeStyle ? "Chi tiết giảm giá" : "Quản lý giảm giá")
            setTitleBtnAdd(!ChangeStyle ? "Trở lại" : "Tạo giảm giá")
            setAllowChange(!AllowChange)
        } else {
            setTitle(!ChangeStyle ? "Sửa giảm giá" : "Quản lý giảm giá")
            setTitleBtnAdd(!ChangeStyle ? "Trở lại" : "Tạo giảm giá")
            setAllowChange(true)
        }
        let Data = item.row._original;
        setFromValue({
            VoucherId: Data.VoucherId,
            IsDelete: Data.IsDelete ? 1 : 0,
            ProductVoucher: [{
                VoucherCode: Data.VoucherCode,
                CustomerId: Data.CustomerId,
                TypeDiscount: Data.TypeDiscount,
                Discount: Data.Discount,
                Fromday: Data.Fromday,
                Today: Data.Today,
                IsDelete: Data.IsDelete
            }],
        });
    };
    //#endregion\


    const Excell = () => {
        const newData = ListData.map(element => {
            return {
                'Mã giảm giá': element.VoucherCode,
                'Khách hàng': element.CustomerName,
                'Loại giảm giá': element.TypeDiscountName,
                'Số tiền / % Giảm': FormatNumber(element.Discount),
                'Thời gian bắt đầu': FormatDateJson(element.Fromday),
                'Thời gian kết thúc': FormatDateJson(element.Today),
                'Người tạo': element.CreateName,
                'Ngày tạo': FormatDateJson(element.CreateTime),
                'Người sửa': element.EditName,
                'Ngày sửa': FormatDateJson(element.EditTime)
            }
        });
        ExportExcel(newData, "danh-sach-voucher");
    }



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
                        onClick={(e) => {
                            clickEdit({ row })
                        }}
                        title="Sửa"
                        data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"
                    />
                    <i
                        className="fa fa-trash red btn-cursor button ml10"
                        onClick={(e) => Shop_spVoucher_Delete({ row })}
                        title="Xóa"
                    />
                </>
            ),
            width: 110,
            filterable: false,
        },
        {
            Header: "Mã giảm giá",
            accessor: "VoucherCode",
        },
        {
            Header: "Khách hàng",
            accessor: "CustomerName",
        },
        {
            Header: "Loại giảm giá",
            accessor: "TypeDiscountName",
        },
        {
            Header: "Số tiền / % Giảm",
            Cell: ({ row }) => (
                (
                    <span>
                        {
                            row._original.TypeDiscount === 1 ?
                                (<span>
                                    {row._original.Discount}
                                </span>)
                                : ("")
                        }
                        {
                            row._original.TypeDiscount === 2 ?
                                (<span>
                                    {FormatNumber(row._original.Discount)}
                                </span>)
                                : ("")
                        }
                    </span>)
            ),
        },
        {
            Header: "Thời gian bắt đầu",
            accessor: "Fromday",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        },
        {
            Header: "Thời gian kết thúc",
            accessor: "Today",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        },
        {
            Header: "Người tạo",
            accessor: "CreateName",
        },
        {
            Header: "Ngày tạo",
            accessor: "CreateTime",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        },
        {
            Header: "Người sửa",
            accessor: "EditName",
        },
        {
            Header: "Ngày sửa",
            accessor: "EditTime",
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
                                        setTitle(!ChangeStyle ? "Thêm mới Voucher" : "Quản lý Voucher")
                                        setTitleBtnAdd("Tạo Voucher")
                                    }}
                                >
                                    <span>
                                        <i className={ChangeStyle ? "fas fa-chevron-down mr-2 rotate-180" : "fas fa-chevron-down mr-2 rotate-0"} ></i>{TitleBtnAdd}
                                    </span>
                                </button>
                            </div>
                            <div className="col-md-12 margin-top-10 border-bottom-dash"></div>
                            <div className="collapse" id="collapseExample">
                                <div className="row">
                                    <div className="col-md-12">
                                        <Voucher_Comp
                                            key="ProductVoucher"
                                            ListData={FromValue?.ProductVoucher || []}
                                            onData={(e) => {
                                                setFromValue({ ...FromValue, ProductVoucher: e });
                                            }}
                                            readOnly={AllowChange}
                                        />
                                    </div>
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
                                            onClick={(e) => Shop_spVoucher_Save()}
                                        >
                                            <span>
                                                <i className="fa-regular fa-floppy-disk mr-1"></i>Lưu
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-12 margin-top-10 border-bottom-dash"></div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <span className="HomeTitle">Tìm kiếm</span>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
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
                                <div className="col-md-6">
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
                                <div className="col-md-12 text-center mt-3 mb-3">
                                    {AllowChange ?
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success"
                                            disabled={!Disable2}
                                            onClick={(e) => Shop_spVoucher_List()}
                                        >
                                            <span>
                                                <i className="fa-solid fa-magnifying-glass mr-1"></i>
                                                Tìm kiếm
                                            </span>
                                        </button> :
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success"
                                            disabled={!Disable2}
                                            onClick={(e) => Shop_spVoucher_List()}
                                            data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"

                                        >
                                            <span>
                                                <i className="fa-solid fa-magnifying-glass mr-1"></i>
                                                Tìm kiếm
                                            </span>
                                        </button>
                                    }
                                </div>
                            </div>
                            <div className="col-md-12 margin-top-10 border-bottom-dash"></div>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <span className="HomeTitle">Danh sách
                                        <span className="ml-2 color-green">{ListData.length > 0 && `(${ListData.length})`}</span>
                                    </span>
                                    <div className="float-right">
                                        {ListData.length > 0 && <button
                                            type="button"
                                            className="btn btn-sm btn-outline-success mr-1"
                                            onClick={Excell}
                                        >
                                            <img src="../assets/img/iconexcel.png" className="iconex" />{" "}
                                            Xuất Excel
                                        </button>}
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
                </div>
            </div>
        </LayoutMain >
    );
};

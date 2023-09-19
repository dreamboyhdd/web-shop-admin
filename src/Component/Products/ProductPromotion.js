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
    ConfirmAlert,
    ExportExcel,
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { Product_PromotionComp } from "./Product_PromotionComp";

export const ProductPromotion = () => {
    const dispatch = useDispatch();
    useEffect(() => { }, []);

    const [Title, setTitle] = useState("Quản lý giảm giá");
    const [TitleBtnAdd, setTitleBtnAdd] = useState("Tạo giảm giá");
    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [AllowChange, setAllowChange] = useState(false);
    const [ChangeStyle, setChangeStyle] = useState(false);
    const [FromValue, setFromValue] = useState({
        PromotionId: 0,
        IsDelete: 0,
        ProductPromotion: [],
    });

    const [ListData, setListData] = useState([]);

    const [SearchValue, setSearchValue] = useState({
        FromDate: FirstOrLastDayinMonth(new Date(), 1),
        ToDate: new Date(),
    });

    const ClearForm = () => {
        setFromValue({
            PromotionId: 0,
            IsDelete: 0,
            ProductPromotion: [],
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
    const Shop_spProduct_Promotions_Save = async () => {
         
        try {
            setDisable(false);
            let ProductPromotionTmp = [];
            if (Array.isArray(FromValue.ProductPromotion)) {
                ProductPromotionTmp = FromValue.ProductPromotion
                    .filter(e => e.IsDelete !== 1)
                    .map(e => ({
                        ProductId: e.ProductId,
                        TypePromotion: e.TypePromotion,
                        Promotion: e.Promotion,
                        SaleFrom: formatDate(e.SaleFrom),
                        SaleTo: formatDate(e.SaleTo)
                    }));
            }

            if (ProductPromotionTmp.length === 0) {
                Alertwarning("Vui lòng chọn sản phẩm");
                setDisable(true);
                return;
            }

            const params = {
                Json: JSON.stringify({
                    PromotionId: FromValue.PromotionId,
                    IsDelete: FromValue.IsDelete,
                    UserId: User.UserId,
                    ProductPromotion: ProductPromotionTmp,

                }),
                func: "Shop_spProduct_Promotions_Save",
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
                let a = ProductPromotionTmp;
                let _IsDelete = FromValue.IsDelete === 0 ? true : false;
                a.push(...ProductPromotionTmp, _IsDelete);
                ListData.map((e) => {
                    if (e.PromotionId === FromValue.PromotionId) {
                        e.IsDelete = FromValue.IsDelete;
                        e.ProductPromotion = a;
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
    const Shop_spProduct_Promotions_List = async () => {
        try {
            setDisable2(false);
            const pr = {
                FromDate: FormatDateJson(SearchValue.FromDate, 9),
                ToDate: FormatDateJson(SearchValue.ToDate, 9),
                ProductName: SearchValue.ProductName?.trim(),
                KeySelect: 0,
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spProduct_Promotions_List",
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
    const Shop_spProduct_Promotions_Delete = async (item) => {
        try {
            ConfirmAlert("", "Bạn có chắc muốn xóa?", "OK, Xác nhận xóa!", async () => {
                let Data = item.row._original;
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        PromotionId: Data.PromotionId,
                        IsDelete: 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spProduct_Promotions_Delete",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.Status === "OK") {
                    setListData(
                        ListData.filter((item) => item.PromotionId !== Data.PromotionId)
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

    //#region edit
    const Shop_spProduct_Promotions_Edit = (item, key) => {
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
            PromotionId: Data.PromotionId,
            IsDelete: Data.IsDelete ? 1 : 0,
            ProductPromotion: [{
                ProductId: Data.ProductId,
                TypePromotion: Data.TypePromotion,
                Promotion: Data.Promotion,
                SaleFrom: Data.SaleFrom,
                SaleTo: Data.SaleTo,
                IsDelete: Data.IsDelete
            }],
        });
    };
    //#endregion

    //#region export excel
    const Shop_spProduct_ExportExcel = () => {
        setDisable2(false);
        const newData = ListData.map(element => {
            return {
                'Tên sản phẩm': element.ProductName,
                'Loại giảm giá': element.TypePromotionName,
                'Số tiền / % giảm': element.Promotion,
                'Thời gian bắt đầu': FormatDateJson(element.SaleFrom),
                'Thời gian kết thúc': FormatDateJson(element.SaleTo),
                'Người tạo': element.CreateName,
                'Ngày tạo': FormatDateJson(element.CreateOn),
                'Người sửa': element.EditName,
                'Ngày sửa': FormatDateJson(element.EditOn),
            }
        })
        ExportExcel(newData, "Danh sách giảm giá")
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
                        onClick={(e) => {
                            Shop_spProduct_Promotions_Edit({ row })
                        }}
                        title="Sửa"
                        data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"
                    />
                    <i
                        className="fa fa-trash red btn-cursor button ml10"
                        onClick={(e) => Shop_spProduct_Promotions_Delete({ row })}
                        title="Xóa"
                    />
                </>
            ),
            width: 110,
            filterable: false,
        },
        {
            Header: "Tên sản phẩm",
            accessor: "ProductName",
        },
        {
            Header: "Loại giảm giá",
            accessor: "TypePromotionName",
        },
        {
            Header: "Số tiền / % Giảm",
            accessor: "Promotion",
        },
        {
            Header: "Ngày Thời gian bắt đầu",
            accessor: "SaleFrom",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        },
        {
            Header: "Thời gian kết thúc",
            accessor: "SaleTo",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
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
                                        setTitle(!ChangeStyle ? "Thêm mới giảm giá" : "Quản lý giảm giá")
                                        setTitleBtnAdd("Tạo giảm giá")
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
                                        <Product_PromotionComp
                                            key="Product_Promotion"
                                            ListData={FromValue?.ProductPromotion || []}
                                            onData={(e) => {
                                                setFromValue({ ...FromValue, ProductPromotion: e });
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
                                            onClick={(e) => Shop_spProduct_Promotions_Save()}
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
                                            onClick={(e) => Shop_spProduct_Promotions_List()}
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
                                            onClick={(e) => Shop_spProduct_Promotions_List()}
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
                                    <span className="HomeTitle">
                                        Danh sách giảm giá
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

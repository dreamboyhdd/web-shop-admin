import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import {
    DataTable
} from "../../Common";
import LayoutMain from "../../Layout/LayoutMain";
import { mainAction } from "../../Redux/Actions";
import {
    Alerterror,
    Alertsuccess,
    Alertwarning,
    DecodeString,
    FormatDateJson,
    FormatNumber,
    GetCookieValue,
    FormatTextNumber
} from "../../Utils";
import { AttributeMerge } from "./AttributeMerge";

export const SellManager = () => {
    const dispatch = useDispatch();
    useEffect(() => { }, []);
    useEffect(() => {
        Shop_spProducts_List()
    }, []);

    const [Disable, setDisable] = useState(true);
    const [IsAcctiveDiscount, setIsAcctiveDiscount] = useState(0);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [rowId, setrowId] = useState(0);
    const [ListData, setListData] = useState([]);
    const [ProductHot, setProductHot] = useState([]);
    const [valueType, setValueType] = useState({ value: 3, label: 'Đã thanh toán' });

    const optionSelect = [
        { value: 1, label: 'Mới tạo' },
        { value: 2, label: 'Chờ thanh toán' },
        { value: 3, label: 'Đã thanh toán' },
    ];

    const [FromValue, setFromValue] = useState({
        OrderId: 0,
        SearchProduct: "",
        SearchCustomerId: "",
        SearchCustomerPhone: "",
        SearchCustomerName: "",
        CustomerAddress: "",
        Notes: "",
        CustomerStatus: "",
        VoucherId: "",
        VoucherCode: "",    // Mã voucher
        VoucherType: "",    // Loại voucher giảm ( % , số tiền)
        PercentDiscount: "",// Loại chiết khấu
        VoucherPrice: "",   // tiền voucher giảm
        SurchargePrice: "", // Phí phụ thu
        PercentVAT: "",     // % VAT
        VATPrice: "",       // Giá VAT
        PriceChange: "",    // Tiền thừa
    });
    const ListRefts = {
        CustomerPhoneRef: useRef(),
        CustomerNameRef: useRef(),
        SearchProductRef: useRef(),
    };

    const ClearForm = () => {
        setFromValue({
            OrderId: 0,
            SearchProduct: "",
            SearchCustomerId: 0,
            SearchCustomerPhone: "",
            SearchCustomerName: "",
            CustomerAddress: "",
            Notes: "",
            CustomerStatus: "",
            VoucherId: "",
            VoucherCode: "",    // Mã voucher
            VoucherType: "",    // Loại voucher giảm ( % , số tiền)
            PercentDiscount: "",// Loại chiết khấu
            VoucherPrice: "",   // tiền voucher giảm
            SurchargePrice: "", // Phí phụ thu
            PercentVAT: "",     // % VAT
            VATPrice: "",       // Giá VAT
            PriceChange: "",    // Tiền thừa
        });
    };

    //#region Save
    const Shop_spOrder_Save = async () => {
        try {
            setDisable(false);
            if (ListData.length === 0) {
                Alertwarning("Đơn hàng chưa có sản phẩm");
                ListRefts.SearchProductRef.current.focus();
                setDisable(true);
                return;
            }
            if (FromValue.OrderCode === "" || FromValue.OrderCode === undefined) {
                Alertwarning("Vui lòng tìm khách hàng");
                ListRefts.CustomerPhoneRef.current.focus();
                setDisable(true);
                return;
            }
            if (FromValue.SearchCustomerPhone === "" || FromValue.SearchCustomerPhone === undefined) {
                Alertwarning("Vui lòng nhập SĐT Hoặc mã Khách hàng");
                ListRefts.CustomerPhoneRef.current.focus();
                setDisable(true);
                return;
            }
            if (FromValue.SearchCustomerName === "" || FromValue.SearchCustomerName === undefined) {
                Alertwarning("Vui lòng nhập tên khách hàng");
                ListRefts.CustomerNameRef.current.focus();
                setDisable(true);
                return;
            }
            const OrderDetails = ListData.map(e => {
                return {
                    ProductId: e.ProductId,
                    ProductName: e.ProductName,
                    ProductCode: e.ProductCode,
                    Price: e.ProductPrice,
                    Quatity: e.NumberProduct,
                    ProductAttributeId: e.valueOption?.reduce((str, item) => str += item.value + ";", "").slice(0, -1) || "",
                    ProductAttributeName: e.valueOption?.reduce((str, item) => str += item.label + ";", "").slice(0, -1) || "",
                }
            })
             
            const params = {
                Json: JSON.stringify({
                    OrderId: FromValue.OrderId,
                    OrderCode: FromValue.OrderCode,
                    CustomerPhone: FromValue.SearchCustomerPhone,
                    CustomerName: FromValue.SearchCustomerName?.trim(),
                    CustomerId: FromValue.SearchCustomerId,
                    CustomerStatus: FromValue.CustomerStatus, // Khách cũ - khách mới
                    OrderStatusId: valueType.value, // Trạng thái thanh toán
                    OrderStatusName: valueType.label, // Trạng thái thanh toán
                    Notes: FromValue.Notes?.trim(),
                    TotalQuatity: totalQuatity, // Tổng số lượng sản phẩm
                    TotalPriceProduct: totalMoney, // Tiền sản phẩm
                    VoucherId: VoucherPrice > 0 ? FromValue.VoucherId : '', // Id mã giảm giá
                    VoucherCode: VoucherPrice > 0 ? FromValue.VoucherCode : '', // Mã giảm giá
                    VoucherPrice: VoucherPrice > 0 ? VoucherPrice : '', // Tiền giảm
                    Discount: Discount, // Tiền giảm giá, chiết khấu
                    VATPrice: VATPrice, // tiền sản phẩm
                    SurchargePrice: FromValue.SurchargePrice, // Phí phụ thu
                    TotalAmount: lastPrice, // Tổng tiền
                    UserId: User.UserId,
                    OrderDetails: OrderDetails,
                }),
                func: "Shop_spOrder_Save",
            };
            setDisable(true);
            const result = await mainAction.API_spCallServer(params, dispatch);
            await Shop_spProducts_Print();
            if (result.Status === "OK") {
                // Alertsuccess(result.ReturnMess);
                ClearForm();
                setListData([])
                setDisable(true);
                setValueType({ value: 3, label: 'Đã thanh toán' });
                return;
            }
        } catch (error) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
            setDisable(true);
        }
    };
    //#endregion

    //#region search product
    const Shop_spProducts_Search = async (SearchCode) => {
        setDisable(false)
        try {
            const pr = {
                ProductName: SearchCode?.trim(),
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spProducts_Search",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setListData([...ListData, ...result]);

                const { ProductId, valueOption } = result.find(e => e.ProductId);

                // Kiểm tra xem ProductId và valueOption đã tồn tại trong ListData hay chưa
                const existingProductIndex = ListData.findIndex(
                    (data) => (data.ProductId === ProductId && data.valueOption === valueOption) || (data.ProductId === ProductId && data.valueOption.length === 0)
                );

                // Nếu ProductId và valueOption đã tồn tại, tăng NumberProduct lên 1
                if (existingProductIndex !== -1) {
                    const updatedListData = [...ListData];
                    updatedListData[existingProductIndex].NumberProduct += 1;
                    setListData(updatedListData);
                } else {
                    // Nếu ProductId và valueOption chưa tồn tại, thêm item mới vào ListData với NumberProduct ban đầu là 1
                    const updatedResult = result.map(item => ({
                        ...item,
                        NumberProduct: 1,
                        rowId: rowId + 1
                    })
                    );
                    setListData([...ListData, ...updatedResult]);
                    setrowId(rowId + 1)
                }
                setDisable(true)
                ListRefts.SearchProductRef.current.focus();
                return;
            } else {
                Alertwarning("Không tìm thấy sản phẩm");
                setDisable(true)
                ListRefts.SearchProductRef.current.focus();
            }
        } catch (err) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
            setDisable(true)
        };
        //#endregion
    }

    //#region search customer
    const Shop_spCustomer_Search = async (SearchCode) => {
        try {
            if (SearchCode.trim().length < 10) {
                Alertwarning("Số điện thoại không đúng định dạng");
                ListRefts.CustomerPhoneRef.current.focus();
                return
            }
            const pr = {
                CustomerPhone: SearchCode?.trim(),
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spCustomer_Search",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                let DataOrderCode = [];
                let DataCustomer = [];
                result.map(item => {
                    if (item.DataCustomer) {
                        const dataCustomerArray = JSON.parse(item.DataCustomer);
                        DataCustomer.push(...dataCustomerArray);
                    }
                    if (item.DataOrderCode) {
                        const dataOrderCodeArray = JSON.parse(item.DataOrderCode);
                        DataOrderCode.push(...dataOrderCodeArray);
                    }
                });

                if (DataCustomer.length > 0) {
                    setFromValue({
                        ...FromValue,
                        SearchCustomerPhone: DataCustomer[0]?.CustomerPhone,
                        SearchCustomerName: DataCustomer[0]?.CustomerName,
                        SearchCustomerId: DataCustomer[0]?.CustomerId,
                        CustomerAddress: DataCustomer[0]?.CustomerAddress,
                        OrderCode: DataCustomer[0]?.OrderCode,
                        CustomerStatus: 'Khách cũ',
                        VoucherId: "",
                        VoucherCode: "",
                        VoucherType: "",
                        VoucherPrice: "",
                    });
                    Alertsuccess(`Khách hàng ${DataCustomer[0].CustomerName}`);
                    return;
                } else {
                    setFromValue({
                        ...FromValue,
                        CustomerStatus: 'Khách mới',
                        SearchCustomerName: SearchCode?.trim(),
                        OrderCode: DataOrderCode[0]?.OrderCode,
                        VoucherId: "",
                        VoucherCode: "",
                        VoucherType: "",
                        VoucherPrice: "",
                    });
                    Alertwarning("Không tìm thấy khách hàng");
                }
            }
        } catch (err) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
        }
    };
    //#endregion

    //#region search voucher
    const Shop_spVoucher_Product_Search = async (SearchCode) => {
        try {
            if (FromValue.SearchCustomerPhone === "" || FromValue.SearchCustomerPhone === undefined) {
                Alertwarning("Vui lòng nhập số điện thoại tìm khách hàng");
                ListRefts.CustomerPhoneRef.current.focus();
                return;
            }
            const pr = {
                CustomerId: FromValue.SearchCustomerId,
                VoucherCode: SearchCode?.trim(),
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spVoucher_Product_Search",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                if (result.Status === 'NOTOK') {
                    Alertwarning(result.ReturnMess)
                    setFromValue({
                        ...FromValue,
                        VoucherId: "",
                        VoucherCode: "",
                        VoucherType: "",
                        VoucherPrice: "", // Phí voucher
                    });
                    return;
                }
                else {
                    setFromValue({
                        ...FromValue,
                        VoucherId: result[0]?.VoucherId,
                        VoucherCode: result[0]?.VoucherCode,
                        VoucherPrice: result[0]?.Discount,
                        VoucherType: result[0]?.TypeDiscount,
                    });
                    Alertsuccess("Sử dụng mã thành công");
                    return;
                }
            } else {
                Alertwarning("Không tìm thấy voucher");
            }
        } catch (err) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
        }
    };
    //#endregion


    //#region thêm sản phẩm
    const handleAddProduct = (item) => {
        const { ProductId, valueOption } = item;

        // Kiểm tra xem ProductId và valueOption đã tồn tại trong ListData hay chưa
        const existingProductIndex = ListData.findIndex(
            (data) => (data.ProductId === ProductId && data.valueOption === valueOption) || (data.ProductId === ProductId && data.valueOption.length === 0)
        );
        // Nếu ProductId và valueOption đã tồn tại, tăng NumberProduct lên 1
        if (existingProductIndex !== -1) {
            const updatedListData = [...ListData];
            updatedListData[existingProductIndex].NumberProduct += 1;
            setListData(updatedListData);
        } else {
            // Nếu ProductId hoặc valueOption chưa tồn tại, thêm item mới vào ListData với NumberProduct ban đầu là 1
            setListData([...ListData, { ...item, NumberProduct: 1, rowId: rowId + 1 }]);
            setrowId(rowId + 1)
        }
    };
    //#endregion

    //#region tăng giảm số lượng
    const handleChangeNumberProduct = (item, action) => {
        const { NumberProduct, rowId } = item.row._original;
        if (action === 'up') {
            const dataUp = ListData.map((data) => {
                if (data.rowId === rowId)
                    data.NumberProduct = NumberProduct + 1
                return data
            });
            setListData(dataUp)
        } else if (action === 'down' && NumberProduct > 1) {
            const dataDown = ListData.map((data) => {
                if (data.rowId === rowId)
                    data.NumberProduct = NumberProduct - 1
                return data
            });
            setListData(dataDown)
        }
    };
    //#endregion

    //#region List
    const Shop_spProducts_List = async () => {
        try {
            const pr = {
                KeySelect: 1,
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spProducts_List",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setProductHot(result);
                return;
            }
            // Alertwarning("Không có dữ liệu");
        } catch (err) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
        }
    };
    //#endregion

    //#region in hóa đơn
    const Shop_spProducts_Print = () => {
        // lấy data đưa vào trang in , trước khi clear dữ liệu
        return new Promise((resolve, reject) => {
            if (ListData.length === 0) {
                Alertwarning("Đơn hàng chưa có sản phẩm");
                ListRefts.SearchProductRef.current.focus();
                setDisable(true);
                return;
            }
            if (FromValue.OrderCode === "" || FromValue.OrderCode === undefined) {
                Alertwarning("Vui lòng tìm khách hàng");
                ListRefts.CustomerPhoneRef.current.focus();
                setDisable(true);
                return;
            }
            if (FromValue.SearchCustomerPhone === "" || FromValue.SearchCustomerPhone === undefined) {
                Alertwarning("Vui lòng nhập SĐT Hoặc mã Khách hàng");
                ListRefts.CustomerPhoneRef.current.focus();
                setDisable(true);
                return;
            }
            if (FromValue.SearchCustomerName === "" || FromValue.SearchCustomerName === undefined) {
                Alertwarning("Vui lòng nhập tên khách hàng");
                ListRefts.CustomerNameRef.current.focus();
                setDisable(true);
                return;
            }
            // Lấy nội dung từ phần tử có id là "PrintTarget"
            let html = document.getElementById("PrintTarget").innerHTML;

            // Tạo một iframe để in
            const iframe = document.createElement('iframe');
            iframe.name = 'printf';
            iframe.id = 'printf';
            iframe.height = 0;
            iframe.width = 0;
            document.body.appendChild(iframe);

            // Lấy tham chiếu tới cửa sổ in
            var newWin = window.frames["printf"];

            // Ghi nội dung cần in vào cửa sổ in
            newWin.document.write(`<body onload="window.print()">${html}</body>`);
            newWin.document.close();
            resolve();
        });
    };
    //#endregion


    // Tổng số lượng sản phẩm
    const totalQuatity = useMemo(() => {
        let sum = 0;
        ListData.forEach(e => {
            sum += e.NumberProduct;
        });
        return sum;
    }, [ListData]);

    // Tổng tiền sản phẩm
    const totalMoney = useMemo(() => {
        let sum = 0;
        ListData.forEach((item) => {
            const itemTotal = item.ProductPrice * item.NumberProduct;
            sum += itemTotal;
        });
        return sum;
    }, [ListData]);

    // Phí VAT
    const VATPrice = useMemo(() => {
        let sum = 0;
        ListData.forEach((item) => {
            // Phí VAT tính theo % của tổng tiền sản phẩm
            sum = totalMoney / 100 * (FromValue.PercentVAT ? FromValue.PercentVAT : 0)
        });
        return sum;
    }, [FromValue, ListData]);

    // Phí voucher
    const VoucherPrice = useMemo(() => {
        let sum = 0;
        if (FromValue.VoucherType === 1) {
            // Nếu type voucher = 1 thì giảm theo %
            sum = totalMoney / 100 * (FromValue.VoucherPrice ? FromValue.VoucherPrice : 0)
        } else if (FromValue.VoucherType === 2) {
            // Nếu type voucher = 2 thì giảm tiền trực tiếp
            sum = FromValue.VoucherPrice
        }
        return sum;
    }, [FromValue, ListData]);

    // Chiết khấu
    const Discount = useMemo(() => {
        let sum = 0;
        if (IsAcctiveDiscount === 0) {
            ListData.forEach((item) => {
                // Nếu IsAcctiveDiscount = 0 thì giảm theo %
                sum = totalMoney / 100 * (FromValue.PercentDiscount ? FromValue.PercentDiscount : 0)
            });
        } else {
            // Nếu IsAcctiveDiscount khác 0 thì giảm theo giá tiền
            sum = FromValue.PercentDiscount
        }
        return sum;
    }, [FromValue, ListData]);

    // Tổng tiền
    const lastPrice = useMemo(() => {
        let sum = 0;
        sum = totalMoney - Discount + +FromValue.SurchargePrice + VATPrice
        return sum;
    }, [ListData, Discount, VATPrice, totalMoney, FromValue]);

    // Tiền thừa trả khách
    const PriceChange = useMemo(() => {
        let sum = 0;
        sum = FromValue.PriceChange - lastPrice;
        // số tiền thừa phải lớn hơn 0 mới return
        return sum > 0 ? sum : 0;
    }, [lastPrice, ListData, Discount, VATPrice, totalMoney, FromValue]);



    const columns = [
        {
            Header: "STT",
            Cell: (row) => <span>{row.index + 1}</span>,
            width: 40,
            filterable: false,
            special: true,
            show: true,
            disableFilters: true
        },
        {
            Header: "#",
            Cell: ({ row }) => (
                <>
                    <i
                        style={{ margin: 'auto' }}
                        className="fa fa-trash red btn-cursor button"
                        onClick={(e) => setListData(ListData.filter(e => e.rowId !== row._original.rowId))}
                        title="Xóa"
                    />
                </>
            ),
            width: 40,
            filterable: false,
        },
        {
            Header: "Mã sản phẩm",
            accessor: "ProductCode",
        },
        {
            Header: "Tên sản phẩm",
            accessor: "ProductName",
        },
        {
            Header: "Thuộc tính",
            accessor: "valueOption",
            minWidth: 250,
            Cell: ({ row }) => {
                const handleSelectChange = (selectedOption) => {
                    const updatedData = ListData.map((item) => {
                        if (item.rowId === row._original.rowId) {
                            return { ...item, valueOption: selectedOption };
                        }
                        return item;
                    });
                    setListData(updatedData);
                };
                return (
                    <div style={{ height: "30px", display: "flex", alignItems: "center" }}>
                        <div style={{ flex: "1" }}>
                            <AttributeMerge
                                list={row._original.Attributes}
                                item={row._original.valueOption ? row._original.valueOption : []}
                                ProductId={row._original.ProductId}
                                onSelected={e => handleSelectChange(e)}
                                ListData={row._original}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            Header: "Đơn giá",
            accessor: "ProductPrice",
            Cell: (item) => <span>{FormatNumber(item.value)}</span>,
        },
        {
            Header: () => {
                return (
                    <>
                        <span>Số lượng: </span>
                        <span
                            data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top"
                            style={{ fontSize: '0.8rem' }}
                            className="badge badge-danger"
                        >
                            {totalQuatity}
                        </span>
                    </>
                )
            },
            accessor: "NumberProduct",
            minWidth: 100,
            Cell: ({ row }) => {
                return (
                    <>
                        <div className="input-group" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div className="input-group-prepend" >
                                <button className="btn btn-default btn-xs ipg-btn" type="button"
                                    onClick={(e) => handleChangeNumberProduct({ row }, 'down')}
                                >
                                    <i className="fa-solid fa-caret-down transform-16"></i>
                                </button>
                            </div>
                            <span className="ipg-text">{row._original.NumberProduct} </span>
                            <div className="input-group-append">
                                <button className="btn btn-default btn-xs ipg-btn" type="button"
                                    onClick={(e) => handleChangeNumberProduct({ row }, 'up')}
                                >
                                    <i className="fa-solid fa-caret-up transform-16"></i>
                                </button>
                            </div>
                        </div>
                    </>
                );
            },
        },
        {
            Header: "Thành tiền",
            accessor: "TotalPrice",
            Cell: ({ row }) => {
                const dataRow = row._original;
                const totalMoney = dataRow.ProductPrice * dataRow.NumberProduct
                return (
                    <span>{FormatNumber(totalMoney)}</span>
                );
            },
        },
    ];


    return (
        <LayoutMain>
            <div className="row from-order Formlading">
                <div className="col-md-8">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <span className="HomeTitle ">Tạo đơn hàng</span>
                        </div>
                    </div>
                    <div className="col-md-12 border-bottom-dash"></div>
                    <div className="row mb-3" >
                        <div className="col-md-12" >
                            <div className="form-group center-icon ">
                                <i className="material-icons search-icon">search</i>
                                <input
                                    placeholder="Enter: Tìm kiếm sản phẩm"
                                    type="text"
                                    className="form-control search-input box-sd-ip"
                                    value={FromValue.SearchProduct}
                                    ref={ListRefts.SearchProductRef}
                                    disabled={!Disable}
                                    onChange={(e) => {
                                        setFromValue({ ...FromValue, SearchProduct: e.target.value })
                                    }}
                                    onKeyDown={(e) => e.code === 'Enter' && Shop_spProducts_Search(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 border-bottom-dash"></div>
                    <div className="row mt-3 hot-product-ctn">
                        {ProductHot.length > 0 ? (
                            ProductHot.map((item, index) => (
                                <div className="col-md-3 col-sm-6 mb-2" key={index}>
                                    <div
                                        className="hot-product-item"
                                        onClick={e => handleAddProduct(item)}
                                    >
                                        <div>{item.ProductName}</div>
                                        <div>{FormatNumber(item.ProductPrice)}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-md-3 col-sm-6 mb-2">
                                <div className="hot-product-item">
                                    <div>{""}</div>
                                    <div>{""}</div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-md-12 border-bottom-dash"></div>
                    <div className="row" >
                        <div className="col-md-12 mb-3 oder-table">
                            <DataTable data={ListData} columns={columns} />
                        </div>
                    </div>
                </div>
                <div className="col-md-4 border-left">

                    <div className="row mt-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="no-absolute">
                                    SĐT khách hàng <span className="red">(*)</span>
                                </label>
                                <div className="center-icon ">
                                    {/* <i className="fa fa-search search-icon"></i> */}
                                    <i className="material-icons search-icon">search</i>
                                    <input
                                        placeholder="Enter..."
                                        type="number"
                                        className="form-control search-input"
                                        ref={ListRefts.CustomerPhoneRef}
                                        value={FromValue.SearchCustomerPhone}
                                        onChange={(e) => {
                                            if (e.target.value >= 0) {
                                                setFromValue({ ...FromValue, SearchCustomerPhone: e.target.value })
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === 'e' || e.key === '.') {
                                                e.preventDefault();
                                            } else {
                                                e.code === 'Enter' && Shop_spCustomer_Search(e.target.value)
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="no-absolute label-status">
                                    <div className="left-content">
                                        Tên khách hàng
                                        <span className="red"> (*)</span>
                                    </div>
                                    <div className="right-content">
                                        <span className="">{FromValue.CustomerStatus}</span>
                                    </div>

                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={FromValue.SearchCustomerName}
                                    ref={ListRefts.CustomerNameRef}
                                    onChange={(e) =>
                                        setFromValue({ ...FromValue, SearchCustomerName: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="no-absolute">
                                    Trạng thái <span className="red">(*)</span>
                                </label>
                                <Select
                                    onChange={e => setValueType(e)}
                                    value={valueType}
                                    options={optionSelect}
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="no-absolute">
                                    Ghi chú
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={FromValue.Notes}
                                    onChange={(e) =>
                                        setFromValue({ ...FromValue, Notes: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        {/* <div className="col-md-6">
                            <div className="form-group ">
                                <label className="no-absolute">
                                    Mã đơn hàng
                                    <span className="red"> (*)</span>
                                </label>
                                <input
                                    placeholder="Tự động tạo mã (Đơn hàng)"
                                    type="text"
                                    className="form-control"
                                    value={FromValue.OrderCode}
                                    ref={ListRefts.OrderCodeRef}
                                    onChange={(e) =>
                                        setFromValue({ ...FromValue, OrderCode: e.target.value })
                                    }
                                />
                            </div>
                        </div> */}
                        {/* <div className="col-md-6">
                            <div className="form-group">
                                <label className="no-absolute">
                                    Ngày tạo<span className="red">(*)</span>
                                </label>
                                <DateTimePicker
                                    className="form-control fix-date-time"
                                    format='MM/dd/yyyy HH:mm:ss'
                                    value={FromValue.OrderDate}
                                    onChange={(e) => setFromValue({ ...FromValue, OrderDate: e })}
                                />
                            </div>
                        </div> */}
                    </div>
                    <div className="col-md-12 border-bottom-dash"></div>
                    <div className="row">
                        <div className="col-md-6 mb-2">
                            <div className="text-input-right">
                                Giá sản phẩm:
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="text-input-left">
                                {FormatNumber(totalMoney) || 0}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group clear-pd-mg">
                                <label className="no-absolute label-status">
                                    <div className="left-content">
                                        Mã giảm giá
                                        <span className="red"> (*)</span>
                                    </div>
                                    <div className="right-content">
                                        {FromValue.VoucherType === 1 && <span>Giảm: {FromValue.VoucherPrice}%</span>}
                                    </div>
                                </label>
                                <div className="center-icon">
                                    <i className="material-icons search-icon">search</i>
                                    <input
                                        type="text"
                                        className="form-control search-input"
                                        value={FromValue.VoucherCode}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, VoucherCode: e.target.value })
                                        }
                                        onKeyDown={(e) => e.code === 'Enter' && Shop_spVoucher_Product_Search(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div className="text-input">
                                    ‒ {FormatNumber(VoucherPrice) || 0}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group clear-pd-mg">
                                <span className="no-absolute text-label text-label-ct">
                                    Chiết khấu
                                    <div className="radio-mg">
                                        <input type="radio" id="male" name="gender" checked={IsAcctiveDiscount === 0 ? true : false}
                                            onChange={e => {
                                                setFromValue({ ...FromValue, PercentDiscount: '' })
                                                setIsAcctiveDiscount(0)
                                            }}
                                        />
                                        <label htmlFor="male" className="font-weight-df" >%</label>
                                        <input type="radio" id="fmale" name="gender" checked={IsAcctiveDiscount === 1 ? true : false}
                                            onChange={e => {
                                                setFromValue({ ...FromValue, PercentDiscount: '' })
                                                setIsAcctiveDiscount(1)
                                            }}
                                        />
                                        <label htmlFor="fmale" className="font-weight-df">Giá</label>
                                    </div>
                                </span>
                                <input
                                    type={IsAcctiveDiscount === 0 ? "number" : "text"}
                                    className="form-control"
                                    value={
                                        IsAcctiveDiscount === 0
                                            ? FromValue.PercentDiscount
                                            : FromValue.PercentDiscount.toLocaleString('en-US')
                                    }
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ''); // Loại bỏ tất cả các ký tự không phải số
                                        if (IsAcctiveDiscount === 0) {
                                            // Nếu IsAcctiveDiscount === 0 (input là number)
                                            if (value >= 0 && value <= 100) {
                                                setFromValue({ ...FromValue, PercentDiscount: value });
                                            }
                                        } else if (IsAcctiveDiscount === 1) {
                                            // Nếu IsAcctiveDiscount === 1 (input là text)
                                            setFromValue({ ...FromValue, PercentDiscount: Number(value) });
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === '-' || e.key === 'e' || e.key === '.') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div className="text-input">
                                    ‒ {FormatNumber(Discount) || 0}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group clear-pd-mg">
                                <label className="no-absolute">
                                    Phí VAT (%)
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={FromValue.PercentVAT}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value >= 0 && value <= 100) {
                                            setFromValue({ ...FromValue, PercentVAT: value });
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === '-' || e.key === 'e' || e.key === '.') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div className="text-input">
                                    + {FormatNumber(VATPrice) || 0}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group clear-pd-mg">
                                <label className="no-absolute">
                                    Phí phụ thu
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={FromValue.SurchargePrice.toLocaleString('en-US')}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ''); // Loại bỏ tất cả ký tự không phải là số
                                        setFromValue({ ...FromValue, SurchargePrice: Number(value) });
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === '-' || e.key === 'e' || e.key === '.') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div className="text-input">
                                    + {FormatNumber(FromValue.SurchargePrice) || 0}
                                </div>
                            </div>
                        </div>
                        <div style={{ marginBottom: 0 }} className="col-md-12 border-bottom-dash" ></div>
                        <div className="col-md-6">
                            <div className="form-group clear-pd-mg">
                                <label className="no-absolute">
                                    Tính tiền thừa
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập số tiền khách đưa"
                                    className="form-control"
                                    value={FromValue.PriceChange === null ? '' : FromValue.PriceChange.toLocaleString('en-US')}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ''); // Loại bỏ tất cả ký tự không phải là số
                                        setFromValue({ ...FromValue, PriceChange: Number(value) });
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === '-' || e.key === 'e' || e.key === '.') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onBlur={() => {
                                        if (FromValue.PriceChange === 0) {
                                            setFromValue({ ...FromValue, PriceChange: null });
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div className="text-input">
                                    {FromValue.PriceChange > 0 && FormatNumber(PriceChange) || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 border-bottom-dash"></div>
                    <div className="row" >
                        <div className="col-md-6 al-ct-start">
                            <div className="text-start">
                                Tổng tiền
                            </div>
                        </div>
                        <div className="col-md-6 al-ct-end">
                            <div className="text-end">
                                {FormatNumber(lastPrice) || 0}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 border-bottom-dash"></div>
                    <div className="row" style={{ marginTop: '70px' }}>
                        <div className="col-sm-3 center-btn">
                            <button
                                type="button"
                                className="btn btn-sm btn-warning w100 h70px"
                                disabled={!Disable}
                                onClick={(e) => Shop_spProducts_Print()}
                            >
                                <span style={{ fontSize: '2rem' }}>
                                    <i className="material-icons transform-20">print</i>
                                </span>
                            </button>
                        </div>
                        <div className="col-sm-9 center-btn ">
                            <button
                                type="button"
                                className="btn btn-sm btn-success w100 h70px"
                                disabled={!Disable}
                                onClick={(e) => Shop_spOrder_Save()}
                                data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top"
                            >
                                <span style={{ fontSize: '2rem' }}>
                                    Thanh toán
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="PrintTarget" style={{ display: 'none' }}>
                <style type="text/css" dangerouslySetInnerHTML={{ __html: "\n.printBox {\nfont-family: Arial, sans-serif;\n font-size: 11px;\n}\n" }} />
                <div className="printBox">
                    <table style={{ width: '100%', borderCollapse: 'collapse', borderBottom: '1px solid black' }}>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: 'center' }}><span style={{ fontSize: '16px' }}><strong>TÊN CỬA HÀNG</strong></span></td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'center' }}>Địa chỉ: 39B Trường Sơn, Phường 4, Tân Bình, Hồ Chí Minh - Test</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'center' }}>SĐT: 19001234 - Test</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ padding: '10px 0 0', textAlign: 'center' }}><strong style={{ fontSize: '12px' }}>HÓA ĐƠN BÁN HÀNG</strong></div>
                    <table style={{ width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ fontSize: '11px', textAlign: 'center' }}>Số : {FromValue?.OrderCode}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: '11px', textAlign: 'center' }}>{FormatDateJson(new Date())}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{ margin: '10px 0 15px', width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ fontSize: '11px' }}>Khách hàng: {FromValue?.SearchCustomerName}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: '11px' }}>SĐT: {FromValue?.SearchCustomerPhone}</td>
                            </tr>
                            <tr>
                                <td style={{ fontSize: '11px' }}>Địa chỉ: {FromValue?.CustomerAddress}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table cellPadding={3} style={{ width: '98%', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr style={{ lineHeight: '12px' }}>
                                <td style={{ borderBottom: '1px solid black', borderTop: '1px solid black', width: '35%' }}><strong><span style={{ fontSize: '11px' }}>Đơn giá</span></strong></td>
                                <td style={{ borderBottom: '1px solid black', borderTop: '1px solid black', textAlign: 'right', width: '30%' }}><strong><span style={{ fontSize: '11px' }}>SL: {totalQuatity}</span></strong></td>
                                <td style={{ borderBottom: '1px solid black', borderTop: '1px solid black', textAlign: 'right' }}><strong><span style={{ fontSize: '11px' }}>Thành tiền</span></strong></td>
                            </tr>
                            {ListData.length > 0 && ListData.map((e, index) => {
                                const isLastRow = index === ListData.length - 1;
                                return (<>
                                    <tr style={{ lineHeight: '12px' }}>
                                        <td colSpan={3} style={{ paddingTop: '3px' }}><span style={{ fontSize: '12px' }}>{e.ProductName}</span><br />
                                            <em>
                                                {e.valueOption?.length > 0 &&
                                                    <span style={{ whiteSpace: 'pre-line', display: 'block', wordWrap: 'break-word', fontSize: '10px' }}>
                                                        {e.valueOption?.reduce((str, item) => str += item.label + ";", "").slice(0, -1) || ""}
                                                    </span>}
                                            </em>
                                        </td>
                                    </tr>
                                    <tr style={{ lineHeight: '12px', borderBottom: isLastRow ? 'none' : '1px dashed black' }}>
                                        <td ><span style={{ fontSize: '11px' }}>{FormatNumber(e.ProductPrice)}</span></td>
                                        <td style={{ textAlign: 'right' }}><span style={{ fontSize: '11px' }}>{FormatNumber(e.NumberProduct)}</span></td>
                                        <td style={{ textAlign: 'right' }}><span style={{ fontSize: '11px' }}>{FormatNumber(e.ProductPrice * e.NumberProduct)}</span></td>
                                    </tr>
                                </>)
                            })}
                            <tr style={{ lineHeight: '12px', borderBottom: '1px solid black' }}>
                            </tr>
                        </tbody>
                    </table>
                    <table border={0} cellPadding={3} cellSpacing={0} style={{ borderCollapse: 'collapse', marginTop: '20px', width: '98%' }}>
                        <tbody>
                            <tr>
                                <td style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>Cộng tiền hàng:</td>
                                <td style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'right' }}>{FormatNumber(totalMoney)}</td>
                            </tr>
                            {FromValue.VoucherPrice > 0 &&
                                <tr>
                                    <td style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>Voucher giảm giá:</td>
                                    <td style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'right' }}>{FormatNumber(VoucherPrice)}</td>
                                </tr>
                            }
                            {Discount > 0 &&
                                <tr>
                                    <td style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>Chiết khấu {IsAcctiveDiscount === 0 && FromValue.PercentDiscount + '%'}:</td>
                                    <td style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'right' }}>{FormatNumber(Discount)}</td>
                                </tr>
                            }
                            {VATPrice > 0 &&
                                <tr>
                                    <td style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>Phí VAT {FromValue.PercentVAT + '%'}:</td>
                                    <td style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'right' }}>{FormatNumber(VATPrice)}</td>
                                </tr>
                            }
                            {FromValue.SurchargePrice > 0 &&
                                <tr>
                                    <td style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>Phí phụ thu:</td>
                                    <td style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'right' }}>{FormatNumber(FromValue.SurchargePrice)}</td>
                                </tr>
                            }
                            {FromValue.PriceChange > 0 && PriceChange > 0 && <>
                                <tr>
                                    <td style={{ fontSize: '11px', textAlign: 'right', whiteSpace: 'nowrap' }}>Tiền khách đưa:</td>
                                    <td style={{ fontSize: '11px', textAlign: 'right' }}>{FormatNumber(FromValue.PriceChange)}</td>
                                </tr>
                                <tr>
                                    <td style={{ fontSize: '11px', textAlign: 'right', whiteSpace: 'nowrap' }}>Tiền thừa:</td>
                                    <td style={{ fontSize: '11px', textAlign: 'right' }}>{FormatNumber(PriceChange)}</td>
                                </tr>
                            </>}
                            {lastPrice > 0 &&
                                <>
                                    <tr>
                                        <td style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>Tổng cộng:</td>
                                        <td style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'right' }}>{FormatNumber(lastPrice)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} style={{ fontSize: '11px', fontStyle: 'italic', textAlign: 'left' }}>{FormatTextNumber(lastPrice)} đồng</td>
                                    </tr>
                                </>
                            }
                        </tbody></table>
                    <table style={{ marginTop: '20px', width: '100%' }}>
                        <tbody>
                            <tr>
                                <td style={{ fontSize: '11px', fontStyle: 'italic', textAlign: 'center' }}>Cảm ơn và hẹn gặp lại!</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </LayoutMain >

    );
};

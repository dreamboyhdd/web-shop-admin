import React, { useEffect, useRef, useState } from "react";
import LayoutMain from "../../Layout/LayoutMain";
import { useDispatch } from "react-redux";
import {
    SelectCategory,
    DataTable,
    ImgUploadTemp,
    MyEditor
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
    FormatNumber,
} from "../../Utils";
import { Product_AttributeComp } from "./Product_AttributeComp";
import { Product_DetailComp } from "./Product_DetailComp";
import { mainAction } from "../../Redux/Actions";
import { LINK_IMAGE } from "../../Services";

export const ProductManager = () => {
    const dispatch = useDispatch();
    useEffect(() => { }, []);

    const [Title, setTitle] = useState("Quản lý sản phẩm");
    const [TitleBtnAdd, setTitleBtnAdd] = useState("Thêm sản phẩm");
    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const [FileUpload, setFileUpload] = useState([]);
    const [resetImage, setResetImage] = useState(0);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [AllowChange, setAllowChange] = useState(false);
    const [ChangeStyle, setChangeStyle] = useState(false);
    const ListRefts = {
        ProductCodeRef: useRef(),
        ProductNameRef: useRef(),
        ProductNoteRef: useRef(),
        ProductPriceRef: useRef(),
    };

    const [FromValue, setFromValue] = useState({
        ProductId: 0,
        ProductCode: "",
        ProductPrice: "",
        ProductName: "",
        ProductNote: "",
        ProductDesciption: "",
        ImageProduct: "",
        IndexNumber: "",
        Url: "",
        CountView: "",
        CreateBy: "",
        IsHot: 0,
        IsNew: 0,
        IsHide: 0,
        IsDelete: 0,
        Attributes: [],
        Category: [],
        Details: [],
    });

    const [ProductDesciption, setProductDesciption] = useState("");
    const [ListData, setListData] = useState([]);

    const [SearchValue, setSearchValue] = useState({
        FromDate: FirstOrLastDayinMonth(new Date(), 1),
        ToDate: new Date(),
        ProductName: "",
    });

    const ClearForm = () => {
        setFromValue({
            ProductId: 0,
            ProductCode: "",
            ProductPrice: "",
            ProductName: "",
            ProductNote: "",
            ProductDesciption: "",
            ImageProduct: "",
            IndexNumber: "",
            Url: "",
            CountView: "",
            CreateBy: "",
            IsHot: 0,
            IsNew: 0,
            IsHide: 0,
            IsDelete: 0,
            Attributes: [],
            Details: [],
            Category: [],
        });
        setProductDesciption("");
        setFileUpload([]);
        setResetImage(Math.random());
        setAllowChange(false)
    };

    //#region Save
    const Shop_spProducts_Save = async () => {
         
        try {
            setDisable(false);
            let CategoryTmp = [], AttributesTmp = [], DetailsTmp = [], ListCategoriesId = '', ListCategoriesName = '', _newListImage = '';
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
                _newListImage = [newListImage, FromValue?.ImageProduct || ""].join(",");

            } else if (typeof FileUpload === 'string' || FileUpload.length === 0) {
                _newListImage = FromValue.ImageProduct
            } else if (!_newListImage) {
                Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
                setDisable(true);
                return;
            }

            if (Array.isArray(FromValue.Category)) {
                FromValue.Category.forEach((element) => {
                    CategoryTmp.push({
                        CategoryId: element.value,
                    });
                });
                ListCategoriesId = FromValue.Category
                    .filter(item => item.value !== 0)
                    .map(item => item.value)
                    .join(',');

                ListCategoriesName = FromValue.Category
                    .filter(item => item.value !== 0)
                    .map(item => item.label)
                    .join(',');
            }

            if (Array.isArray(FromValue.Attributes)) {
                AttributesTmp = FromValue.Attributes.filter(e => e.IsDelete !== 1)
            }
            if (Array.isArray(FromValue.Details)) {
                DetailsTmp = FromValue.Details.filter(e => e.IsDelete !== 1)
            }

            if (FromValue.ProductCode !== "" && FromValue.ProductCode.length < 6) {
                Alertwarning("Mã sản phẩm ít nhất 6 ký tự");
                setDisable(true);
                ListRefts.ProductCodeRef.current.focus();
                return;
            }

            if (FromValue.ProductName === "" || FromValue.ProductName === undefined) {
                Alertwarning("Vui lòng nhập tên sản phẩm");
                setDisable(true);
                ListRefts.ProductNameRef.current.focus();
                return;
            }

            if (FromValue.ProductNote === "" || FromValue.ProductNote === undefined) {
                Alertwarning("Vui lòng nhập tên chi tiết");
                setDisable(true);
                ListRefts.ProductNoteRef.current.focus();
                return;
            }

            if (FromValue.ProductPrice === "" || FromValue.ProductPrice === undefined) {
                Alertwarning("Vui lòng nhập giá sản phẩm");
                setDisable(true);
                ListRefts.ProductPriceRef.current.focus();
                return;
            }
            if (FromValue.ProductPrice < 1) {
                Alertwarning("Giá sản phẩm phải lớn hơn 0");
                setDisable(true);
                ListRefts.ProductPriceRef.current.focus();
                return;
            }

            if (ListCategoriesId.length === 0) {
                Alertwarning("Vui lòng chọn danh mục sản phẩm");
                setDisable(true);
                return;
            }

            // if (_newListImage === "" || _newListImage === undefined) {
            //     Alertwarning("Vui lòng nhập hình ảnh sản phẩm");
            //     setDisable(true);
            //     return;
            // }

            // if (AttributesTmp.length === 0) {
            //     Alertwarning("Vui lòng nhập thuộc tính sản phẩm");
            //     setDisable(true);
            //     return;
            // }

            // if (DetailsTmp.length === 0) {
            //     Alertwarning("Vui lòng nhập chi tiết sản phẩm");
            //     setDisable(true);
            //     return;
            // }

            // if (ProductDesciption === '' || ProductDesciption === undefined) {
            //     Alertwarning("Vui lòng nhập mô tả sản phẩm");
            //     setDisable(true);
            //     return;
            // }

            const params = {
                Json: JSON.stringify({
                    ProductId: FromValue.ProductId,
                    ProductCode: FromValue.ProductCode?.trim(),
                    ProductName: FromValue.ProductName?.trim(),
                    ProductNote: FromValue.ProductNote?.trim(),
                    ProductPrice: FromValue.ProductPrice,
                    ProductDesciption: ProductDesciption?.trim(),
                    ImageProduct: _newListImage,
                    IndexNumber: FromValue.IndexNumber,
                    CountView: FromValue.CountView,
                    Url: FromValue.Url,
                    IsHot: FromValue.IsHot,
                    IsNew: FromValue.IsNew,
                    IsHide: FromValue.IsHide,
                    IsDelete: FromValue.IsDelete,
                    UserId: User.UserId,
                    ProductDetails: DetailsTmp,
                    ProductAttributes: AttributesTmp,
                    ProductCategories: CategoryTmp,
                    ListCategoriesId: ListCategoriesId,
                    ListCategoriesName: ListCategoriesName
                }),
                func: "Shop_spProducts_Save",
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
                    if (e.ProductId === FromValue.ProductId) {
                        e.ProductId = FromValue.ProductId;
                        e.ProductCode = FromValue.ProductCode;
                        e.ProductName = FromValue.ProductName;
                        e.ProductNote = FromValue.ProductNote;
                        e.ProductPrice = FromValue.ProductPrice;
                        e.IsHot = FromValue.IsHot;
                        e.IsNew = FromValue.IsNew;
                        e.IsHide = FromValue.IsHide;
                        e.IsDelete = FromValue.IsDelete;
                        e.ProductDesciption = ProductDesciption;
                        e.ImageProduct = _newListImage;
                        e.ListCategoriesId = FromValue.Category
                            .filter(item => item.value !== 0)
                            .map(item => item.value)
                            .join(',');
                        e.ListCategoriesName = FromValue.Category
                            .filter(item => item.value !== 0)
                            .map(item => item.label)
                            .join(',');
                        e.EditOn = FormatDateJson(timeConfirm);
                        e.EditName = User.UserName;
                        e.Attributes = AttributesTmp;
                        e.Details = DetailsTmp;
                        e.Category = CategoryTmp;
                    }
                    return e;
                });
                setTitle("Quản lý sản phẩm");
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
    const Shop_spProducts_List = async () => {
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
                func: "Shop_spProducts_List",
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
    const Shop_spProducts_Delete = async (item) => {
        try {
            ConfirmAlert("", "Bạn có chắc muốn xóa?", "OK, Xác nhận xóa!", async () => {
                let Data = item.row._original;
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        ProductId: Data.ProductId,
                        IsDelete: 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spProducts_Delete",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.Status === "OK") {
                    setListData(
                        ListData.filter((item) => item.ProductId !== Data.ProductId)
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
    const Shop_spProducts_Hide = async (item) => {
        try {
            let Data = item.row._original, titleContent = "", titleButton = "";
            if (Data.IsHide) {
                titleContent = "Bạn có chắc muốn hiện sản phẩm?";
                titleButton = "Ok, Hiện sản phẩm";
            } else {
                titleContent = "Bạn có chắc muốn ẩn sản phẩm?";
                titleButton = "Ok, Ẩn sản phẩm";
            }
            ConfirmAlert("", titleContent, titleButton, async () => {
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        ProductId: Data.ProductId,
                        IsHide: Data.IsHide ? 0 : 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spProducts_Hide",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result[0]?.OK === "OK") {
                    ListData.map((e) => {
                        if (e.ProductId === Data.ProductId) {
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
    const Shop_spProducts_Hot = async (item) => {
        try {
            let Data = item.row._original, titleContent = "", titleButton = "";
            if (Data.IsHot) {
                titleContent = "Trở về sản phẩm bình thường?";
                titleButton = "Ok, Chắc chắn";
            } else {
                titleContent = "Bạn có chắc muốn đây là sản phẩm HOT?";
                titleButton = "Ok, Chắc chắn";
            }
            ConfirmAlert("", titleContent, titleButton, async () => {
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        ProductId: Data.ProductId,
                        IsHot: Data.IsHot ? 0 : 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spProducts_Hot",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result[0]?.OK === "OK") {
                    ListData.map((e) => {
                        if (e.ProductId === Data.ProductId) {
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

    //#region hot
    const Shop_spProducts_New = async (item) => {
        try {
            let Data = item.row._original, titleContent = "", titleButton = "";
            if (Data.IsNew) {
                titleContent = "Trở về sản phẩm bình thường?";
                titleButton = "Ok, Chắc chắn";
            } else {
                titleContent = "Bạn có chắc muốn đây là sản phẩm NEW?";
                titleButton = "Ok, Chắc chắn";
            }
            ConfirmAlert("", titleContent, titleButton, async () => {
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        ProductId: Data.ProductId,
                        IsNew: Data.IsNew ? 0 : 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spProducts_New",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result[0]?.OK === "OK") {
                    ListData.map((e) => {
                        if (e.ProductId === Data.ProductId) {
                            e.IsNew = result[0].IsNew;
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
    const Shop_spProducts_Edit = (item, key) => {
        setChangeStyle(true)
        if (key === 'view') {
            setTitle("Chi tiết sản phẩm")
            setTitleBtnAdd("Trở lại")
            setAllowChange(true)
        } else {
            setTitle("Sửa sản phẩm")
            setTitleBtnAdd("Trở lại")
            setAllowChange(false)
        }

        let Data = item.row._original;
        let _ListCategoriesId = Data.ListCategoriesId.split(",")
        let _ListCategoriesName = Data.ListCategoriesName.split(",")
        let Category = _ListCategoriesId.map((value, index) => {
            return {
                value: value,
                name: _ListCategoriesName[index]
            };
        });
        setFromValue({
            ProductId: Data.ProductId,
            ProductCode: Data.ProductCode,
            ProductName: Data.ProductName,
            ProductNote: Data.ProductNote,
            ProductPrice: Data.ProductPrice,
            ImageProduct: Data.ImageProduct,
            IndexNumber: Data.IndexNumber,
            Url: Data.Url,
            CountView: Data.CountView,
            CreateBy: User.UserId,
            IsHot: Data.IsHot ? 1 : 0,
            IsNew: Data.IsNew ? 1 : 0,
            IsHide: Data.IsHide ? 1 : 0,
            IsDelete: Data.IsDelete ? 1 : 0,
            Attributes: Data.Attributes,
            Details: Data.Details,
            Category: Category,
        });
        setProductDesciption(Data.ProductDesciption);
        window.scrollTo(0, 0);
    };
    //#endregion

    //#region export excel
    const Shop_spProduct_ExportExcel = () => {
        setDisable2(false);
        const newData = ListData.map(element => {
            return {
                'Mã sản phẩm': element.CustomerCode,
                'Tên sản phẩm': element.CustomerName,
                'Tên chi tiết': element.ProductNote,
                'Giá sản phẩm': element.ProductPrice,
                'Người tạo': element.CreateName,
                'Ngày tạo': FormatDateJson(element.CreateOn),
                'Người sửa': element.EditName,
                'Ngày sửa': FormatDateJson(element.EditOn),
            }
        })
        ExportExcel(newData, "Danh sách sản phẩm")
        setDisable2(true);
    }
    //#endregion

    //#region change index
    const Shop_spProducts_ChangeIndex = async (item, key) => {
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
                    ProductId: Data.ProductId,
                    IndexNumber: _IndexNumber,
                    UserId: User.UserId,
                }),
                func: "Shop_spProducts_ChangeIndex",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK") {
                ListData.map((e) => {
                    if (e.ProductId === Data.ProductId) {
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
                            Shop_spProducts_Edit({ row }, 'view')
                        }}
                        title="Chi tiết"
                    />
                    <i
                        className="fa fa-edit orange btn-cursor button ml10"
                        onClick={(e) => {
                            Shop_spProducts_Edit({ row },'edit')
                        }}
                        title="Sửa"
                    />
                    <i
                        className="fa fa-trash red btn-cursor button ml10"
                        onClick={(e) => Shop_spProducts_Delete({ row })}
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
                            <a className="pointer" onClick={e => Shop_spProducts_Hide({ row })} title="Ẩn" >
                                <img src="../assets/img/icons8-toggle-off-50.png" className="transform-13" alt="Toggle Off" width="20" />
                            </a>
                        ) : (
                            <a className="pointer" onClick={e => Shop_spProducts_Hide({ row })} title="Hiện">
                                <img src="../assets/img/icons8-toggle-on-50.png" className="transform-13" alt="Toggle On" width="20" />
                            </a>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "Hot",
            accessor: "IsHot",
            filterable: false,
            width: 50,
            Cell: ({ row }) => {
                return (
                    <div>
                        {row._original.IsHot ? (
                            <a className="pointer" onClick={e => Shop_spProducts_Hot({ row })} title="Ẩn" >
                                <img src="../assets/img/icons8-fire-on-48.gif" className="transform-13" alt="Toggle On" width="20" />
                            </a>
                        ) : (
                            <a className="pointer" onClick={e => Shop_spProducts_Hot({ row })} title="Hiện">
                                <img src="../assets/img/icons8-fire-off-48.png" className="transform-13" alt="Toggle Off" width="20" />
                            </a>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "New",
            accessor: "IsNew",
            filterable: false,
            width: 50,
            Cell: ({ row }) => {
                return (
                    <div>
                        {row._original.IsNew ? (
                            <a className="pointer" onClick={e => Shop_spProducts_New({ row })} title="Ẩn" >
                                <img src="../assets/img/icons8-new-on-45.png" className="transform-13" alt="Toggle On" width="20" />
                            </a>
                        ) : (
                            <a className="pointer" onClick={e => Shop_spProducts_New({ row })} title="Hiện">
                                <img src="../assets/img/icons8-new-off-45.png" className="transform-13" alt="Toggle Off" width="20" />
                            </a>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "Hình ảnh",
            accessor: "ImageProduct",
            filterable: false,
            Cell: ({ row }) => {
                return (
                    <div>
                        {row.ImageProduct !== undefined && row.ImageProduct !== "" && row.ImageProduct !== null ? (
                            row._original.ImageProduct.split(",").map((img, index) => {
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
                                <button className="btn btn-default btn-xs ipg-btn" type="button" onClick={(e) => Shop_spProducts_ChangeIndex({ row }, 'down')}>
                                    <i className="fa-solid fa-caret-down transform-16"></i>
                                </button>
                            </div>
                            <span className="ipg-text">{row._original.IndexNumber} </span>
                            <div className="input-group-append">
                                <button className="btn btn-default btn-xs ipg-btn" type="button" onClick={(e) => Shop_spProducts_ChangeIndex({ row }, 'up')}>
                                    <i className="fa-solid fa-caret-up transform-16"></i>
                                </button>
                            </div>
                        </div>
                    </>
                );
            },
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
            Header: "Tên chi tiết",
            accessor: "ProductNote",
        },
        {
            Header: "Giá sản phẩm",
            accessor: "ProductPrice",
            Cell: (item) => <span>{FormatNumber(item.value)}</span>,
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
                                        setTitle(!ChangeStyle ? "Thêm mới sản phẩm" : "Quản lý sản phẩm")
                                        setTitleBtnAdd("Thêm sản phẩm")
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
                                                Mã sản phẩm
                                            </label>
                                            <input
                                                placeholder="Tự động tạo mã (Mã sản phẩm)"
                                                type="text"
                                                className="form-control"
                                                value={FromValue.ProductCode}
                                                onChange={(e) =>
                                                    setFromValue({ ...FromValue, ProductCode: e.target.value })
                                                }
                                                ref={ListRefts.ProductCodeRef}
                                                readOnly={AllowChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="no-absolute">
                                                Tên sản phẩm <span className="red">(*)</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={FromValue.ProductName}
                                                onChange={(e) =>
                                                    setFromValue({ ...FromValue, ProductName: e.target.value })
                                                }
                                                ref={ListRefts.ProductNameRef}
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
                                                value={FromValue.ProductNote}
                                                onChange={(e) =>
                                                    setFromValue({ ...FromValue, ProductNote: e.target.value })
                                                }
                                                ref={ListRefts.ProductNoteRef}
                                                readOnly={AllowChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="no-absolute">
                                                Giá sản phẩm <span className="red">(*)</span>
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={FromValue.ProductPrice}
                                                onChange={(e) =>
                                                    setFromValue({ ...FromValue, ProductPrice: e.target.value })
                                                }
                                                ref={ListRefts.ProductPriceRef}
                                                readOnly={AllowChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="no-absolute">
                                                Danh mục sản phẩm <span className="red">(*)</span>
                                            </label>
                                            <SelectCategory
                                                onSelected={(e) => {
                                                    setFromValue({ ...FromValue, Category: e })
                                                }}
                                                clearData={FromValue.Category}
                                                isMulti={true}
                                                isDisabled={AllowChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <ImgUploadTemp
                                            onImageUpload={(e) => setFileUpload(e)}
                                            onData={(e) => setFromValue({ ...FromValue, ImageProduct: e })}
                                            data={FromValue.ImageProduct}
                                            isReset={resetImage}
                                            readOnly={AllowChange}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <Product_AttributeComp
                                            key="Product_Attribute"
                                            ListData={FromValue?.Attributes || []}
                                            onData={(e) => {
                                                setFromValue({ ...FromValue, Attributes: e });
                                            }}
                                            readOnly={AllowChange}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <Product_DetailComp
                                            key="Product_Detail"
                                            ListData={FromValue?.Details || []}
                                            onData={(e) => {
                                                setFromValue({ ...FromValue, Details: e });
                                            }}
                                            readOnly={AllowChange}
                                        />
                                    </div>
                                    <div className="col-md-12 CKEditor-m">
                                        <label className="no-absolute">
                                            Mô tả sản phẩm
                                        </label>
                                    </div>
                                    <MyEditor
                                        onChange={e => setProductDesciption(e)}
                                        values={ProductDesciption}
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
                                                onClick={(e) => Shop_spProducts_Save()}
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
                                            Tên sản phẩm <span className="red">(*)</span>
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
                                        onClick={(e) => Shop_spProducts_List()}
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
                                        Danh sách sản phẩm
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

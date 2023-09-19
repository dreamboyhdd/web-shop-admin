import React, { useEffect, useState } from "react";
import LayoutMain from "../../Layout/LayoutMain";
import { useDispatch } from "react-redux";
import {
    DataTable,
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

export const CategoriesManager = () => {
    const dispatch = useDispatch();
    useEffect(() => { }, []);

    const [Title, setTitle] = useState("Thêm danh mục");
    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [FromValue, setFromValue] = useState({
        CategoryId: 0,
        CategoryName: "",
        IsHide: 0,
        IsDelete: 0
    });

    const [ListData, setListData] = useState([]);
    const [SearchValue, setSearchValue] = useState({
        CategoryName: "",
    });

    const ClearForm = () => {
        setFromValue({
            CategoryId: 0,
            CategoryName: "",
            IsHide: 0,
            IsDelete: 0
        });
    };

    //#region Save
    const Shop_spCategories_Save = async () => {
        try {
            setDisable(false);
            if (FromValue.CategoryName === "" || FromValue.CategoryName === undefined) {
                Alertwarning("Vui lòng nhập tên danh mục");
                setDisable(true);
                return;
            }
            const params = {
                Json: JSON.stringify({
                    CategoryId: FromValue.CategoryId,
                    CategoryName: FromValue.CategoryName?.trim(),
                    IsHide: FromValue.IsHide,
                    IsDelete: FromValue.IsDelete,
                    UserId: User.UserId,
                }),
                func: "Shop_spCategories_Save",
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
                    if (e.CategoryId === FromValue.CategoryId) {
                        e.CategoryId = FromValue.CategoryId;
                        e.CategoryName = FromValue.CategoryName;
                        e.IsHide = FromValue.IsHide;
                        e.IsDelete = FromValue.IsDelete;
                        e.EditOn = FormatDateJson(timeConfirm);
                        e.EditName = User.UserName;
                    }
                    return e;
                });
                setTitle("Thêm danh mục");
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
    const Shop_spCategories_List = async () => {
        try {
            setDisable2(false);
            const pr = {
                CategoryName: SearchValue.CategoryName?.trim(),
                KeySelect: 0,
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spCategories_List",
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
    const Shop_spCategories_Delete = async (item) => {
        try {
            ConfirmAlert("", "Bạn có chắc muốn xóa?", "OK, Xác nhận xóa!", async () => {
                let Data = item.row._original;
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        CategoryId: Data.CategoryId,
                        IsDelete: 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spCategories_Delete",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.Status === "OK") {
                    setListData(
                        ListData.filter((item) => item.CategoryId !== Data.CategoryId)
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
    const Shop_spCategorie_Hide = async (item) => {
        try {
            let Data = item.row._original, titleContent = "", titleButton = "";
            if (Data.IsHide) {
                titleContent = "Bạn có chắc muốn hiện danh mục?";
                titleButton = "Ok, Hiện danh mục";
            } else {
                titleContent = "Bạn có chắc muốn ẩn danh mục?";
                titleButton = "Ok, Ẩn danh mục";
            }
            ConfirmAlert("", titleContent, titleButton, async () => {
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        CategoryId: Data.CategoryId,
                        IsHide: Data.IsHide ? 0 : 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spCategorie_Hide",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result[0]?.OK === "OK") {
                    ListData.map((e) => {
                        if (e.CategoryId === Data.CategoryId) {
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
        setTitle("Sửa danh mục");
        let Data = item.row._original;
        setFromValue({
            CategoryId: Data.CategoryId,
            CategoryName: Data.CategoryName,
            IsHide: Data.IsHide ? 1 : 0,
            IsDelete: Data.IsDelete ? 1 : 0,
        });
    };
    //#endregion

    //#region export excel
    const Shop_spCategorie_ExportExcel = () => {
        setDisable2(false);
        const newData = ListData.map(element => {
            return {
                'Tên danh mục': element.CategoryName,
                'Người tạo': element.CreateName,
                'Ngày tạo': FormatDateJson(element.CreateOn),
                'Người sửa': element.EditName,
                'Ngày sửa': FormatDateJson(element.EditOn),
            }
        })
        ExportExcel(newData, "Danh sách danh mục")
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
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={(e) => Shop_spProducts_Edit({ row })}
                        title="Sửa"

                    />
                    <i
                        className="fa fa-trash red btn-cursor button ml10"
                        onClick={(e) => Shop_spCategories_Delete({ row })}
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
                            <a className="pointer" onClick={e => Shop_spCategorie_Hide({ row })} title="Ẩn" >
                                <img src="../assets/img/icons8-toggle-off-50.png" className="transform-13" alt="Toggle Off" width="20" />
                            </a>
                        ) : (
                            <a className="pointer" onClick={e => Shop_spCategorie_Hide({ row })} title="Hiện">
                                <img src="../assets/img/icons8-toggle-on-50.png" className="transform-13" alt="Toggle On" width="20" />
                            </a>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "Tên danh mục",
            accessor: "CategoryName",
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

    const ModalCreateCategory = (
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header label-status mt--10">
                        <h4 className="modal-title font-weight-normal left-content" id="exampleModalLabel">{Title}</h4>
                        <div className="right-content close-btns" data-dismiss="modal" >
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Tên danh mục <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.CategoryName}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, CategoryName: e.target.value })
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
                                data-dismiss="modal"
                                onClick={(e) => {
                                    Shop_spCategories_Save();
                                    if (Title === 'Sửa danh mục') {
                                        e.target.setAttribute('data-bs-dismiss', 'modal');
                                        e.target.setAttribute('aria-label', 'Close');
                                    }
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
                            <span className="HomeTitle">Tìm kiếm danh mục</span>
                            <div className="float-right">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-success ml-3"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                    disabled={!Disable}
                                    onClick={ClearForm}
                                >
                                    <span>
                                        <i className="fa-solid fa-plus mr-2"></i>Thêm danh mục mới
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 margin-top-10 border-bottom-dash"></div>

                    <div className="row mt-3">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label className="no-absolute">
                                    Tên danh mục <span className="red">(*)</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={SearchValue.CategoryName}
                                    onChange={(e) =>
                                        setSearchValue({ ...SearchValue, CategoryName: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-md-12 text-center mt-3 mb-3">
                            <button
                                type="button"
                                className="btn btn-sm btn-success"
                                disabled={!Disable2}
                                onClick={(e) => Shop_spCategories_List()}
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
                                Danh sách danh mục
                                <span className="ml-2 color-green">{ListData.length > 0 && `(${ListData.length})`}</span>
                            </span>
                            <div className="float-right">
                                {ListData.length > 0 && <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success mr-1"
                                    disabled={!Disable2}
                                    onClick={e => Shop_spCategorie_ExportExcel()}
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
                    {ModalCreateCategory}
                </div>
            </div>
        </LayoutMain>
    );
};

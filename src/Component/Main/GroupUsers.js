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
    ExportExcel
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { PermissionGroupUsers } from "./PermissionGroupUsers";


export const GroupUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => { }, []);

    const [Title, setTitle] = useState("Thêm nhóm khách hàng");

    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const [AllowChange, setAllowChange] = useState(false);
    const [ChangePermission, setChangePermission] = useState(true);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [FromValue, setFromValue] = useState({
        ID: 0,
        GroupCode: "",
        GroupName: "",
        Website: "",
        Email: "",
        Phone: "",
        IsLock: 0,
        IsDelete: 0,
        IsPass: true,
        IsRepPass: true
    });

    const [ListData, setListData] = useState([]);
    const [UserInfo, setUserInfo] = useState({});

    const [SearchValue, setSearchValue] = useState({
        FromDate: FirstOrLastDayinMonth(new Date(), 1),
        ToDate: new Date(),
        GroupCode: "",
        GroupName: "",
    });


    const ClearForm = () => {
        setFromValue({
            ID: 0,
            GroupCode: "",
            GroupName: "",
            Website: "",
            Email: "",
            Phone: "",
            IsLock: 0,
            IsDelete: 0,
            IsPass: false,
            IsRepPass: false
        });
        setTitle("Thêm nhóm khách hàng")
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
    const Shop_spGroupUsers_Save = async () => {
        try {
            setDisable(false);
            if (FromValue.GroupCode === "" || FromValue.GroupCode === undefined) {
                Alertwarning("Vui lòng nhập mã nhóm khách hàng");
                setDisable(true);
                return;
            }
            if (FromValue.GroupName === "" || FromValue.GroupName === undefined) {
                Alertwarning("Vui lòng nhập tên nhóm khách hàng");
                setDisable(true);
                return;
            }
            if (FromValue.Website === "" || FromValue.Website === undefined) {
                Alertwarning("Vui lòng nhập Website");
                setDisable(true);
                return;
            }
            if (FromValue.Phone === "" || FromValue.Phone === undefined) {
                Alertwarning("Vui lòng nhập số điện thoại");
                setDisable(true);
                return;
            }
            if (FromValue.Phone !== "") {
                if (!validatePhone(FromValue.Phone)) {
                    Alertwarning("Số điện thoại không đúng định dạng");
                    setDisable(true);
                    return;
                }
            }
            if (FromValue.Email === "" || FromValue.Email === undefined) {
                Alertwarning("Vui lòng nhập email");
                setDisable(true);
                return;
            }
            if (FromValue.Email !== "") {
                if (!validateEmail(FromValue.Email)) {
                    Alertwarning("Email không đúng định dạng");
                    setDisable(true);
                    return;
                }
            }
            const params = {
                Json: JSON.stringify({
                    ID: FromValue.ID,
                    GroupCode: FromValue.GroupCode?.trim(),
                    GroupName: FromValue.GroupName?.trim(),
                    Website: FromValue.Website?.trim(),
                    Phone: FromValue.Phone?.trim(),
                    Email: FromValue.Email?.trim(),
                    IsLock: FromValue.IsLock,
                    IsDelete: FromValue.IsDelete,
                    Creater: User.UserId,
                }),
                func: "Shop_spGroupUsers_Save",
            };
            setDisable(true);
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === "OK" && result.ReturnMess === "Lưu thành công!") {
                ListData.map((e) => {
                    e.ID = FromValue.ID;
                })
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
                    if (e.ID === FromValue.ID) {
                        e.ID = FromValue.ID;
                        e.GroupCode = FromValue.GroupCode;
                        e.GroupName = FromValue.GroupName;
                        e.Website = FromValue.Website;
                        e.Email = FromValue.Email;
                        e.Phone = FromValue.Phone;
                        e.IsLock = FromValue.IsLock;
                        e.IsDelete = FromValue.IsDelete;
                        e.EditOn = FormatDateJson(timeConfirm);
                        e.EditName = User.UserName;
                    }
                    return e;
                });
                setTitle("Thêm nhóm khách hàng");
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
    const Shop_spGroupUsers_List = async () => {
        try {
            setDisable2(false);
            const pr = {
                GroupCode: SearchValue.GroupCode?.trim(),
                GroupName: SearchValue.GroupName?.trim(),
                KeySelect: 0,
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spGroupUsers_List",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setListData(result);
                setDisable2(true);
                return;
            }
            Alertwarning("Không có dữ liệu");
            setListData([]);
            setDisable2(true);
        } catch (err) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
            setDisable2(true);
        }
    };
    //#endregion

    //#endregion delete
    const Shop_spGroupUsers_Delete = async (item) => {
        try {
            ConfirmAlert("", "Bạn có chắc muốn xóa?", "OK, Xác nhận xóa!", async () => {
                let Data = item.row._original;
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        ID: Data.ID,
                        IsDelete: 1,
                    }),
                    func: "Shop_spGroupUsers_Delete",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                 
                if (result.Status === "OK") {
                    setListData(
                        ListData.filter((item) => item.ID !== Data.ID)
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


    //#endregion show
    const Shop_spGroupUsers_Lock = async (item) => {
        try {
            let Data = item.row._original, titleContent = "", titleButton = "";
            if (Data.IsLock) {
                titleContent = "Bạn có chắc muốn mở khóa nhóm khách hàng?";
                titleButton = "Ok, mở khóa tài khoản";
            } else {
                titleContent = "Bạn có chắc muốn khóa nhóm khách hàng?";
                titleButton = "Ok, khóa tài khoản";
            }
            ConfirmAlert("", titleContent, titleButton, async () => {
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        ID: Data.ID,
                        IsLock: Data.IsLock ? 0 : 1,
                    }),
                    func: "Shop_spGroupUsers_Lock",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result[0]?.OK === "OK") {
                    ListData.map((e) => {
                        if (e.ID === Data.ID) {
                            e.IsLock = result[0].IsLock;
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

    //#endregion edit
    const Shop_spUsers_Edit = (item, key) => {
        setTitle("Sửa nhóm khách hàng");
        let Data = item.row._original;
        setFromValue({
            ID: Data.ID,
            GroupCode: Data.GroupCode,
            GroupName: Data.GroupName,
            Website: Data.Website,
            Phone: Data.Phone,
            Email: Data.Email,
            IsLock: Data.IsLock ? 1 : 0,
            IsDelete: Data.IsDelete ? 1 : 0,
            Creater: User.UserId,
        });
    };
    //#endregion

    //#region export excel
    const Shop_spUsers_ExportExcel = () => {
        setDisable2(false);
        const newData = ListData.map(element => {
            return {
                'Mã nhóm khách hàng': element.GroupCode,
                'Tên nhóm khách hàng': element.GroupName,
                'Website': element.Website,
                'Số điện thoại': element.Phone,
                'Email': element.Email,
                'Người tạo': element.CreateName,
                'Ngày tạo': FormatDateJson(element.CreateOn),
                'Người sửa': element.EditName,
                'Ngày sửa': FormatDateJson(element.EditOn),
            }
        })
        ExportExcel(newData, "Danh sách tài khoản")
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
                        className="fas fa-user-cog green btn-cursor button"
                        onClick={(e) => {
                             
                            setUserInfo(row._original)
                            setChangePermission(false)
                        }}
                        title="Phân quyền"
                    />
                    <i
                        className="fa fa-edit orange btn-cursor button ml10"
                        data-toggle="modal"
                        data-target=".bd-example-modal-xl"
                        onClick={(e) => Shop_spUsers_Edit({ row })}
                        title="Sửa"
                    />
                    <i
                        className="fa fa-trash red btn-cursor button ml10"
                        onClick={(e) => Shop_spGroupUsers_Delete({ row })}
                        title="Xóa"
                    />
                </>
            ),
            width: 110,
            filterable: false,
        },
        {
            Header: "Lock",
            accessor: "IsLock",
            filterable: false,
            width: 70,
            Cell: ({ row }) => {
                return (
                    <div>
                        {row._original.IsLock ? (
                            <a className="pointer" onClick={e => Shop_spGroupUsers_Lock({ row })} title="Mở khóa">
                                <img src="../assets/img/icons8-toggle-on-50.png" className="transform-13" alt="Toggle On" width="20" />
                            </a>
                        ) : (
                            <a className="pointer" onClick={e => Shop_spGroupUsers_Lock({ row })} title="Khóa" >
                                <img src="../assets/img/icons8-toggle-off-50.png" className="transform-13" alt="Toggle Off" width="20" />
                            </a>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "Mã nhóm khách hàng",
            accessor: "GroupCode",
        },
        {
            Header: "Tên nhóm khách hàng",
            accessor: "GroupName",
        },
        {
            Header: "Website",
            accessor: "Website",
        },
        {
            Header: "Số điện thoại",
            accessor: "Phone",
        },
        {
            Header: "Email",
            accessor: "Email",
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
                                        Mã nhóm khách hàng<span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.GroupCode}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, GroupCode: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Tên nhóm khách hàng <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.GroupName}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, GroupName: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Website <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.Website}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, Website: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Số điện thoại <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={FromValue.Phone}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, Phone: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Email <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.Email}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, Email: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <div className="col-md-12 text-center mt-3 mb-3">
                            {!AllowChange &&
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-info"
                                    onClick={ClearForm}
                                >
                                    <span>
                                        <span className="material-icons mr-1">cached</span>Làm mới
                                    </span>
                                </button>
                            }
                            <button
                                type="button"
                                className="btn btn-sm btn-success ml-3"
                                disabled={!Disable}
                                data-dismiss={AllowChange ? "modal" : ""}
                                onClick={(e) => {
                                    Shop_spGroupUsers_Save();
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


    const handleChangePermission = () => {
         
        setChangePermission(!ChangePermission)
    }

    return (
        <LayoutMain>
            <div className="row Formlading">
                {
                    ChangePermission ?
                        <div className="col-md-12">
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <span className="HomeTitle">Tìm kiếm tài khoản</span>
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
                                                <i className="fa-solid fa-plus mr-2"></i>Thêm nhóm khách hàng
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 margin-top-10 border-bottom-dash"></div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="no-absolute">
                                            Mã nhóm khách hàng
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={SearchValue.GroupCode}
                                            onChange={(e) =>
                                                setSearchValue({ ...SearchValue, GroupCode: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="no-absolute">
                                            Tên nhóm khách hàng
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={SearchValue.GroupName}
                                            onChange={(e) =>
                                                setSearchValue({ ...SearchValue, GroupName: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 text-center mt-3 mb-3">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success"
                                        disabled={!Disable2}
                                        onClick={(e) => Shop_spGroupUsers_List()}
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
                                        Danh sách nhóm khách hàng
                                        <span className="ml-2 color-green">{ListData.length > 0 && `(${ListData.length})`}</span>
                                    </span>
                                    <div className="float-right">
                                        {ListData.length > 0 && <button
                                            type="button"
                                            className="btn btn-sm btn-outline-success mr-1"
                                            disabled={!Disable2}
                                            onClick={e => Shop_spUsers_ExportExcel()}
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
                        :
                        <div className="col-md-12">
                            <PermissionGroupUsers
                                UserInfo={UserInfo}
                                ChangePermission={handleChangePermission}
                            />
                        </div>
                }
            </div>
        </LayoutMain>
    );
};

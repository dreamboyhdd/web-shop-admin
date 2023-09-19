import React, { useEffect, useRef, useState } from "react";
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
    ExportExcel
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { SelectLanguage } from "../../Common/Select/SelectLanguage";
import { Link } from "react-router-dom";

export const Language = () => {
    const dispatch = useDispatch();
    useEffect(() => { }, []);

    const [Title, setTitle] = useState("Quản lý ngôn ngữ");
    const [TitleBtnAdd, setTitleBtnAdd] = useState("Thêm ngôn ngữ");
    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [AllowChange, setAllowChange] = useState(false);
    const [ChangeStyle, setChangeStyle] = useState(false);
    const [ListData, setListData] = useState([]);
    const ListRefts = {
        CodeRef: useRef(),
        NameRef: useRef()
    };
    const [LanguageId, setLanguageId] = useState(0);
    const onSelectLanguage = (item) => {
        setLanguageId(item.value);
    }
    const [FromValue, setFromValue] = useState({
        LanguageId: 0,
        Code: "",
        Name: ""
    });
    const ClearForm = () => {
        setFromValue({
            LanguageId: 0,
            Code: "",
            Name: ""
        });
        setAllowChange(false)
    };

    //#region Save
    const Shop_spLanguage_Save = async () => {
        try {
            setDisable(false);
            if (FromValue.Code === "") {
                Alertwarning("Vui lòng nhập mã ngôn ngữ");
                setDisable(true);
                ListRefts.CodeRef.current.focus();
                return;
            }
            if (FromValue.Name === "") {
                Alertwarning("Vui lòng nhập tên ngôn ngữ");
                setDisable(true);
                ListRefts.NameRef.current.focus();
                return;
            }
            const params = {
                Json: JSON.stringify({
                    LanguageId: FromValue.LanguageId,
                    Code: FromValue.Code?.trim(),
                    Name: FromValue.Name?.trim(),
                    Creater: User.UserId
                }),
                func: "Shop_spLanguage_Save",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === 'OK') {
                Alertsuccess(result.ReturnMess);
                ClearForm();
                const LangTmp = [];
                LangTmp.push({
                    Code: FromValue.Code?.trim(),
                    Name: FromValue.Name?.trim(),
                    CreateName: User.UserName,
                    CreateOn: FormatDateJson(new Date())
                })
                setListData([...ListData.filter(e => e.LanguageId !== FromValue.LanguageId), ...LangTmp])
            }
            else {
                Alertwarning(result.ReturnMess);
            }
            setDisable2(true);
        } catch (error) {
            Alerterror("Lỗi dữ liệu, Vui lòng liên hệ IT !");
        }
    };
    //#endregion

    //#region List
    const Shop_spLanguage_List = async () => {
        try {
            const pr = {
                LanguageId: LanguageId,
                UserId: User.UserId
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spLanguage_List",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setListData(result);
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
    const Shop_spLanguage_Delete = async (item) => {
        try {
            ConfirmAlert("", "Bạn có chắc muốn xóa?", "OK, Xác nhận xóa!", async () => {
                let Data = item.row._original;
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        LanguageId: Data.LanguageId,
                    }),
                    func: "Shop_spLanguage_Delete",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.Status === "OK") {
                    setListData(
                        ListData.filter((item) => item.LanguageId !== Data.LanguageId)
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
    const Shop_spLanguage_Edit = (item) => {
        setChangeStyle(!ChangeStyle)
        setTitleBtnAdd(!ChangeStyle ? "Sửa ngôn ngữ" : "Thêm ngôn ngữ")
        let Data = item.row._original;
        setFromValue({
            LanguageId: Data.LanguageId,
            Code: Data.Code,
            Name: Data.Name,
        });
    };
    //#endregion

    //#region export excel
    const Shop_spProduct_ExportExcel = () => {
        setDisable2(false);
        const newData = ListData.map(element => {
            return {
                'Mã ngôn ngữ': element.CustomerCode,
                'Tên ngôn ngữ': element.CustomerName,
                'Người tạo': element.CreateName,
                'Ngày tạo': FormatDateJson(element.CreateOn),
                'Người sửa': element.EditName,
                'Ngày sửa': FormatDateJson(element.EditOn),
            }
        })
        ExportExcel(newData, "Danh sách ngôn ngữ")
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
                    <Link to={"/chi-tiet-ngon-ngu?id=" + row._original.LanguageId} title={row._original.Code}><i
                        className="fa fa-eye green btn-cursor button"
                        title="Chi tiết"
                        data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"
                    />
                    </Link>
                    <i
                        className="fa fa-edit orange btn-cursor button ml10"
                        onClick={(e) => {
                            Shop_spLanguage_Edit({ row })
                        }}
                        title="Sửa"
                        data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"
                    />
                    <i
                        className="fa fa-trash red btn-cursor button ml10"
                        onClick={(e) => Shop_spLanguage_Delete({ row })}
                        title="Xóa"
                    />
                </>
            ),
            width: 110,
            filterable: false,
        },
        {
            Header: "Mã ngôn ngữ",
            accessor: "Code",
        },
        {
            Header: "Tên ngôn ngữ",
            accessor: "Name",
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
                                        setTitle(!ChangeStyle ? "Thêm mới ngôn ngữ" : "Quản lý ngôn ngữ")
                                        setTitleBtnAdd("Thêm ngôn ngữ")
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
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="no-absolute">
                                                Mã ngôn ngữ <span className="red">(*)</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={FromValue.Code}
                                                onChange={(e) =>
                                                    setFromValue({ ...FromValue, Code: e.target.value })
                                                }
                                                ref={ListRefts.CodeRef}
                                                readOnly={AllowChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="no-absolute">
                                                Tên ngôn ngữ <span className="red">(*)</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={FromValue.Name}
                                                onChange={(e) =>
                                                    setFromValue({ ...FromValue, Name: e.target.value })
                                                }
                                                ref={ListRefts.NameRef}
                                                readOnly={AllowChange}
                                            />
                                        </div>
                                    </div>
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
                                                onClick={(e) => Shop_spLanguage_Save()}
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
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="no-absolute">
                                            Chọn ngôn ngữ
                                        </label>
                                        <SelectLanguage
                                            onSelected={e => onSelectLanguage(e)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 text-center mt-3 mb-3">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success"
                                        disabled={!Disable2}
                                        onClick={(e) => Shop_spLanguage_List()}
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
                                        Danh sách ngôn ngữ
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

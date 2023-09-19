import React, { useEffect, useRef, useState } from "react";
import LayoutMain from "../../Layout/LayoutMain";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";

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
    ConfirmAlert
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";

export const LanguageDetails = (props) => {
    const location = useLocation();
    const dispatch = useDispatch();
    useEffect(() => {
        Shop_spLanguageDetails_List()
    }, [props]);

    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [AllowChange, setAllowChange] = useState(false);
    const [ListData, setListData] = useState([]);
    const [LanguageName, setLanguageName] = useState("");
    const ListRefts = {
        KeyDetailRef: useRef(),
        DescriptionRef: useRef()
    };

    const [FromValue, setFromValue] = useState({
        DetailId: 0,
        KeyDetail: "",
        Description: ""
    });

    const ClearForm = () => {
        setFromValue({
            DetailId: 0,
            KeyDetail: "",
            Description: ""
        });
        setAllowChange(false)
    };

    //#region Save
    const Shop_spLanguageDetail_Save = async () => {
        try {
            const prL = new URLSearchParams(location.search);
            setDisable(false);
            if (FromValue.KeyDetail === "") {
                Alertwarning("Vui lòng nhập chi tiết");
                setDisable(true);
                ListRefts.KeyDetailRef.current.focus();
                return;
            }
            if (FromValue.Description === "") {
                Alertwarning("Vui lòng mô tả");
                setDisable(true);
                ListRefts.DescriptionRef.current.focus();
                return;
            }
            const params = {
                Json: JSON.stringify({
                    DetailId: FromValue.DetailId,
                    LanguageId: parseInt(prL.get("id")) || -1,
                    KeyDetail: FromValue.KeyDetail?.trim(),
                    Description: FromValue.Description?.trim(),
                    Creater: User.UserId
                }),
                func: "Shop_spLanguageDetail_Save",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.Status === 'OK') {
                const LangTmp = [];
                LangTmp.push({
                    KeyDetail: FromValue.KeyDetail?.trim(),
                    Description: FromValue.Description?.trim(),
                    CreateName: User.UserName,
                    CreateOn: FormatDateJson(new Date())
                })
                setListData([...ListData.filter(e => e.DetailId !== FromValue.DetailId), ...LangTmp])
                Alertsuccess(result.ReturnMess);
                ClearForm();
            }
            else {
                Alertwarning(result.ReturnMess);
            }
            setDisable2(true);
        } catch (error) {
            Alerterror("Lỗi dữ liệu, Vui lòng liên hệ IT !");
            setDisable(false);
        }
    };
    //#endregion

    //#region List

    const Shop_spLanguageDetails_List = async () => {
        try {
            const prL = new URLSearchParams(location.search);
            setDisable2(false);
            const pr = {
                LanguageId: parseInt(prL.get("id")) || -1,
                UserId: User.UserId
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spLanguageDetails_List",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setLanguageName(result?.LanguageName)
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
    const Shop_spLanguageDetails_Delete = async (item) => {
        try {
            ConfirmAlert("", "Bạn có chắc muốn xóa?", "OK, Xác nhận xóa!", async () => {
                let Data = item.row._original;
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        DetailId: Data.DetailId,
                    }),
                    func: "Shop_spLanguageDetails_Delete",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result.Status === "OK") {
                    setListData(
                        ListData.filter((item) => item.DetailId !== Data.DetailId)
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

    const Shop_spLanguageDetail_Edit = (item) => {
        let Data = item.row._original;
        setFromValue({
            DetailId: Data.DetailId,
            KeyDetail: Data.KeyDetail,
            Description: Data.Description,
        });
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
                            Shop_spLanguageDetail_Edit({ row })
                        }}
                        title="Sửa"
                        data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample"
                    />
                    <i
                        className="fa fa-trash red btn-cursor button ml10"
                        onClick={(e) => Shop_spLanguageDetails_Delete({ row })}
                        title="Xóa"
                    />
                </>
            ),
            width: 110,
            filterable: false,
        },
        {
            Header: "Chi tiết",
            accessor: "KeyDetail",
        },
        {
            Header: "Mô tả",
            accessor: "Description",
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
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <span className="HomeTitle">Thêm chi tiết</span>
                                    <Link to='them-ngon-ngu' >
                                        <div className="float-right">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-success ml-3"

                                            >
                                                <span>
                                                    <i class="fas rotate-180"></i> Trở về
                                                </span>
                                            </button>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-3">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="no-absolute">
                                                Tên <span className="red">(*)</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={FromValue.KeyDetail}
                                                onChange={(e) =>
                                                    setFromValue({ ...FromValue, KeyDetail: e.target.value })
                                                }
                                                ref={ListRefts.KeyDetailRef}
                                                readOnly={AllowChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="no-absolute">
                                                Mô tả <span className="red">(*)</span>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={FromValue.Description}
                                                onChange={(e) =>
                                                    setFromValue({ ...FromValue, Description: e.target.value })
                                                }
                                                ref={ListRefts.DescriptionRef}
                                                readOnly={AllowChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12 text-center mt-3 mb-3">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success"
                                        disabled={!Disable2}
                                        onClick={(e) => Shop_spLanguageDetail_Save()}
                                    >
                                        <span>
                                            <i class="fa-solid  mr-1"></i>
                                            Lưu
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="col-md-12 margin-top-10 border-bottom-dash"></div>
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <span className="HomeTitle">
                                        Danh sách chi tiết {LanguageName}
                                        <span className="ml-2 color-green">{ListData.length > 0 &&`(${ListData.length})`}</span>
                                    </span>
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

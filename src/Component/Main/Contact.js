import React, { useState } from "react";
import LayoutMain from "../../Layout/LayoutMain";
import { useDispatch } from "react-redux";
import {
    DataTable,
} from "../../Common";
import DateTimePicker from "react-datetime-picker";
import {
    FirstOrLastDayinMonth,
    Alerterror,
    Alertwarning,
    FormatDateJson,
    GetCookieValue,
    DecodeString,
    ConfirmAlert,
    Alertsuccess,
    ExportExcel,
} from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import Select from "react-select";

export const Contact = () => {
    const dispatch = useDispatch();
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [Disable2, setDisable2] = useState(true);
    const [Disable, setDisable] = useState(true);
    const [ListData, setListData] = useState([]);
    const [Status, setStatus] = useState(0);
    const [SearchValue, setSearchValue] = useState({
        FromDate: FirstOrLastDayinMonth(new Date(), 1),
        ToDate: new Date(),
    });
    const [valueType, setValueType] = useState({ value: 0, label: 'Select' });
    const optionSelect = [
        { value: 0, label: 'Select' },
        { value: 1, label: 'Chưa xử lý' },
        { value: 2, label: 'Đang xử lý' },
        { value: 3, label: 'Đã xử lý' },
    ];
    const onTypeRecept = (item) => {
        setValueType(item);
        setStatus(item.value);
    }


    //#region List
    const Shop_spContact_List = async () => {
         
        try {
            setDisable2(false);
            const pr = {
                FromDate: FormatDateJson(SearchValue.FromDate, 9),
                ToDate: FormatDateJson(SearchValue.ToDate, 9),
                Status: Status,
                UserId: User.UserId
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spContact_List",
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

    //#region update
    const Shop_spContact_ChangeStatus = async (item) => {
        try {
            ConfirmAlert("", "Bạn có chắc muốn thay đổi trạng thái ?", "OK, Xác nhận !", async () => {
                setDisable2(false);
                let Data = item.row._original
                const pr = {
                    ContactId: Data.ContactId,
                    Status: Data.Status,
                    UserId: User.UserId,
                };
                const params = {
                    Json: JSON.stringify(pr),
                    func: "Shop_spContact_ChangeStatus",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result[0]?.OK === "OK") {
                    ListData.map((e) => {
                        if (e.ContactId === Data.ContactId) {
                            e.Status = result[0].Status
                        }
                        return e;
                    })
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

    const Excell = () => {
        setDisable(true);
        const newData = ListData.map(element => {
            return {
                'Tên': element.Name,
                'Số điện thoại': element.Phone,
                'Email': element.Email,
                'Nội dung': element.Content,
                'Ngày tạo': FormatDateJson(element.CreateOn),
                'Nhân viên xử lý': element.UserName,
                'Thời gian xử lý': FormatDateJson(element.ProcessedOn),
                'Trang thái': element.StatusName
            }
        });
        ExportExcel(newData, "danh-sach-nhan-vien-xu-ly-lien-he");
        setDisable(false);
    }

    const columns = [
        {
            Header: "STT",
            Cell: (row) => <span>{row.index + 1}</span>,
            filterable: false,
            width: 40,
            special: true,
            show: true,
        },
        {
            Header: "Trạng thái",
            Cell: ({ row }) => (
                (
                    <span>
                        {
                            row._original.Status === 1 ?
                                (<span>
                                    <button
                                        className="btn btn-xs btn-info mr-2 danger" onClick={e => Shop_spContact_ChangeStatus({ row })}>
                                        <i className="fas pr-1"></i> Chưa xử lý
                                    </button>
                                </span>)
                                : ("")
                        }
                        {
                            row._original.Status === 2 ?
                                (<span>
                                    <button
                                        className="btn btn-xs btn-warning mr-2" onClick={e => Shop_spContact_ChangeStatus({ row })}>
                                        <i className="fas pr-1"></i> Đang xử lý
                                    </button>
                                </span>)
                                : ("")
                        }
                        {
                            row._original.Status === 3 ?
                                (<span>
                                    <button
                                        className="btn btn-xs btn-success mr-2">
                                        <i className="fas pr-1"></i> Đã xử lý
                                    </button>
                                </span>)
                                : ("")
                        }
                    </span>)
            ),
            width: 150,
            filterable: false,
        },
        {
            Header: "Tên",
            accessor: "Name",
            width: 80,
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
            Header: "Nội dung",
            accessor: "Content",
        },
        {
            Header: "Ngày tạo",
            accessor: "CreateOn",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        },
        {
            Header: "Nhân viên xử lý",
            accessor: "UserName",
        },
        {
            Header: "Thời gian xử lý",
            accessor: "ProcessedOn",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        }
    ];

    return (
        <LayoutMain>
            <div className="row Formlading">
                <div className="col-md-12">
                    <div className="row mt-3">
                        <div className="col-md-12">
                            <div className="row mt-3">
                                <div className="col-md-12">
                                    <span className="HomeTitle">Xử lý liên hệ</span>
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
                                            Loại
                                        </label>
                                        <Select
                                            onChange={e => onTypeRecept(e)}
                                            value={valueType}
                                            options={optionSelect}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 text-center mt-3 mb-3">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success"
                                        disabled={!Disable2}
                                        onClick={(e) => Shop_spContact_List()}
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
                                                Danh sách xử lý
                                                <span className="ml-2 color-green">{ListData.length > 0 && `(${ListData.length})`}</span>
                                            </span>
                                    <div className="float-right">
                                        {ListData.length > 0 && <button
                                            type="button"
                                            className="btn btn-sm btn-outline-success mr-1"
                                            disabled={!Disable}
                                            onClick={Excell}
                                        >
                                            <img src="../assets/img/iconexcel.png" className="iconex" />{" "}
                                            Xuất Excel
                                        </button>}
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12 mb-3">
                                    <DataTable
                                        data={ListData}
                                        columns={columns}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutMain >
    );
};
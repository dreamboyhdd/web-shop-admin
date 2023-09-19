import React, { useEffect, useRef, useState } from "react";
import LayoutMain from "../../Layout/LayoutMain";
import { useDispatch } from "react-redux";
import {
    DataTable,
    ImgUploadTemp
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
import Select from "react-select";
import { mainAction } from "../../Redux/Actions";
import { LINK_IMAGE } from "../../Services";

export const Setting = () => {
    const dispatch = useDispatch();
    useEffect(() => { }, []);

    const [Title, setTitle] = useState("Quản lý cài đặt");
    const [TitleBtnAdd, setTitleBtnAdd] = useState("Thêm cài đặt");
    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const [FileUpload, setFileUpload] = useState([]);
    const [resetImage, setResetImage] = useState(0);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [AllowChange, setAllowChange] = useState(false);
    const [ChangeStyle, setChangeStyle] = useState(false);
    const ListRefts = {
        KeySettingRef: useRef()
    };

    const [Value, setValue] = useState({
        Image: "",
        Text: "",
        Number: ""
    });

    const [FromValue, setFromValue] = useState({
        Id: 0,
        KeySetting: "",
        Description: "",
        DataSetting: "",
        CreateBy: "",
        IsHide: 0,
        IsDelete: 0
    });

    const [valueType, setValueType] = useState({ value: 'img', label: 'Hình ảnh' });
    const optionSelect = [
        { value: 'img', label: 'Hình ảnh' },
        { value: 'text', label: 'Chữ' },
        { value: 'bool', label: 'Số' },
    ];
    const [TypeSetting, setTypeSetting] = useState('img');
    const onTypeRecept = (item) => {
        setValueType(item);
        setTypeSetting(item.value);
    }

    const [ListData, setListData] = useState([]);

    const [SearchValue, setSearchValue] = useState({
        FromDate: FirstOrLastDayinMonth(new Date(), 1),
        ToDate: new Date(),
        Setting: "",
    });

    const ClearForm = () => {
        setTypeSetting('img')
        setValueType({ value: 'img', label: 'Hình ảnh' });
        setFromValue({
            Id: 0,
            KeySetting: "",
            Description: "",
            CreateBy: "",
            IsHide: 0,
            IsDelete: 0,
        });
        setValue({
            Image: "",
            Text: "",
            Number: ""
        })
        setFileUpload([]);
        setAllowChange(false)
    };

    //#region Save
    const Shop_spSetting_Save = async () => {
        try {
            setDisable(false);
            let _newListImage = '';
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
            if (FromValue.KeySetting === "" || FromValue.KeySetting === undefined) {
                Alertwarning("Vui lòng thêm cài đặt");
                setDisable(true);
                ListRefts.KeySettingRef.current.focus();
                return;
            }
            let DataSetting = ''
            if (valueType.value === 'img') {
                DataSetting = _newListImage
            } else if (valueType.value === 'text') {
                DataSetting = Value.Text
            } else if (valueType.value === 'bool') {
                DataSetting = Value.Number
            }
             
            const params = {
                Json: JSON.stringify({
                    Id: FromValue.Id,
                    KeySetting: FromValue.KeySetting?.trim(),
                    Description: FromValue.Description?.trim(),
                    TypeSetting: TypeSetting,
                    DataSetting: DataSetting,
                    IsHide: FromValue.IsHide,
                    IsDelete: FromValue.IsDelete,
                    UserId: User.UserId,
                }),
                func: "Shop_spSetting_Save",
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
                    if (e.Id === FromValue.Id) {
                        e.KeySetting = FromValue.KeySetting;
                        e.Description = FromValue.Description;
                        e.TypeSetting = FromValue.TypeSetting;
                        e.DataSetting = DataSetting;
                        e.IsHide = FromValue.IsHide;
                        e.IsDelete = FromValue.IsDelete;
                        e.EditOn = FormatDateJson(timeConfirm);
                        e.EditName = User.UserName;
                    }
                    return e;
                });
                setTitle("Quản lý cài đặt");
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
    const Shop_spSetting_List = async () => {
        try {
            setDisable2(false);
            const pr = {
                FromDate: FormatDateJson(SearchValue.FromDate, 9),
                ToDate: FormatDateJson(SearchValue.ToDate, 9),
                KeySelect: 0,
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spSetting_List",
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


    //#region show
    const Shop_spSetting_Hide = async (item) => {
        try {
            let Data = item.row._original, titleContent = "", titleButton = "";
            if (Data.IsHide) {
                titleContent = "Bạn có chắc muốn hiện cài đặt?";
                titleButton = "Ok, Hiện cài đặt";
            } else {
                titleContent = "Bạn có chắc muốn ẩn cài đặt?";
                titleButton = "Ok, Ẩn cài đặt";
            }
            ConfirmAlert("", titleContent, titleButton, async () => {
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        Id: Data.Id,
                        IsHide: Data.IsHide ? 0 : 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spSetting_Hide",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result[0]?.OK === "OK") {
                    ListData.map((e) => {
                        if (e.Id === Data.Id) {
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
    const Shop_spProducts_Edit = (item, key) => {
        setChangeStyle(true);
        if (key === 'view') {
            setTitle("Chi tiết cài đặt")
            setTitleBtnAdd("Trở lại")
            setAllowChange(true)
        } else {
            setTitle("Sửa cài đặt")
            setTitleBtnAdd("Trở lại")
            setAllowChange(false)
        }
        let Data = item.row._original;
        setFromValue({
            Id:Data.Id,
            KeySetting: Data.KeySetting,
            Description: Data.Description,
            TypeSetting: Data.TypeSetting,
            EditBy: User.UserId,
            IsHide: Data.IsHide ? 1 : 0,
        });
        setValue({
            Image: Data.DataSetting,
            Text: Data.DataSetting,
            Number: Data.DataSetting
        })
        if (Data.TypeSetting === 'img') {
            setTypeSetting('img');
        } else if (Data.TypeSetting === 'text') {
            setTypeSetting('text');
        } else if (Data.TypeSetting === 'bool') {
            setTypeSetting('bool');
        }
        setValueType({ value: item.row._original.TypeSetting, label: item.row._original.TypeSettingName })
        window.scrollTo(0, 0);
    };
    //#endregion

    //#region export excel
    const Excell = () => {
        const newData = ListData.map(element => {
            return {
                'Cài đặt': element.KeySetting,
                'Mô tả': element.Description,
                'Loại': element.TypeSetting,
                'Chi tiết': element.DataSetting,
                'Người tạo': element.CreateBy,
                'Ngày tạo': FormatDateJson(element.CreateOn),
                'Người sửa': element.EditBy,
                'Ngày sửa': FormatDateJson(element.EditOn),
            }
        });
        ExportExcel(newData, "danh-sach-cai-dat");
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
                </>
            ),
            width: 80,
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
                            <a className="pointer" onClick={e => Shop_spSetting_Hide({ row })} title="Ẩn" >
                                <img src="../assets/img/icons8-toggle-off-50.png" className="transform-13" alt="Toggle Off" width="20" />
                            </a>
                        ) : (
                            <a className="pointer" onClick={e => Shop_spSetting_Hide({ row })} title="Hiện">
                                <img src="../assets/img/icons8-toggle-on-50.png" className="transform-13" alt="Toggle On" width="20" />
                            </a>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "Cài đặt dữ liệu",
            accessor: "DataSetting",
            filterable: false,
            Cell: ({ row }) => {
                return (
                    <>
                        {row._original.TypeSetting === 'img' &&
                            <>
                                {row.DataSetting !== undefined && row.DataSetting !== "" && row.DataSetting !== null ? (
                                    row._original.DataSetting.split(",").map((img, index) => {
                                        return (<>
                                            {img !== "" && <a
                                                key={index} // Add key prop to resolve the unique key warning
                                            >
                                                <img src={LINK_IMAGE + img} width="30" /> {/* Add alt attribute */}
                                            </a>}
                                        </>
                                        );
                                    })
                                ) : null}</>
                        }
                        {row._original.TypeSetting === 'text' &&
                            <span>{row._original.DataSetting}</span>}
                        {row._original.TypeSetting === 'bool' &&
                            <span>{row._original.DataSetting}</span>}
                    </>
                );
            },
        },
        {
            Header: "Cài đặt",
            accessor: "KeySetting",
        },
        {
            Header: "Mô tả",
            accessor: "Description",
        },
        {
            Header: "Loại",
            accessor: "TypeSettingName",
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
            <div className="content">
                <div className="container-flUserId">
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
                                                setTitle(!ChangeStyle ? "Thêm mới cài đặt" : "Quản lý cài đặt")
                                                setTitleBtnAdd("Thêm cài đặt")
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
                                                        Cài đặt hiển thị <span className="red">(*)</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={FromValue.KeySetting}
                                                        onChange={(e) =>
                                                            setFromValue({ ...FromValue, KeySetting: e.target.value })
                                                        }
                                                        ref={ListRefts.KeySettingRef}
                                                        readOnly={AllowChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
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
                                                        readOnly={AllowChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label className="no-absolute">
                                                        Loại <span className="red">(*)</span>
                                                    </label>
                                                    <Select
                                                        onChange={e => onTypeRecept(e)}
                                                        value={valueType}
                                                        options={optionSelect}
                                                    />
                                                </div>
                                            </div>
                                            {TypeSetting === 'img' &&
                                                <div className="col-md-12">
                                                    <ImgUploadTemp
                                                        onImageUpload={(e) => setFileUpload(e)}
                                                        onData={(e) => setValue({ ...Value, Image: e })}
                                                        data={Value.Image}
                                                        isReset={resetImage}
                                                        readOnly={AllowChange}
                                                    />
                                                </div>
                                            }
                                            {TypeSetting === 'text' &&
                                                <div className="col-md-12">
                                                    <label className="no-absolute">
                                                        Vui lòng nhập dữ liệu <span className="red">(*)</span>
                                                    </label>
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={Value.Text}
                                                            onChange={(e) =>
                                                                setValue({ ...Value, Text: e.target.value })
                                                            }
                                                            readOnly={AllowChange}
                                                        />
                                                    </div>
                                                </div>
                                            }
                                            {TypeSetting === 'bool' &&
                                                <div className="col-md-12">
                                                    <label className="no-absolute">
                                                        Vui lòng nhập dữ liệu <span className="red">(*)</span>
                                                    </label>
                                                    <div className="form-group">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={Value.Number}
                                                            onChange={(e) =>
                                                                setValue({ ...Value, Number: e.target.value })
                                                            }
                                                            readOnly={AllowChange}
                                                        />
                                                    </div>
                                                </div>
                                            }
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
                                                        onClick={(e) => Shop_spSetting_Save()}
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
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-success"
                                                disabled={!Disable2}
                                                onClick={(e) => Shop_spSetting_List()}
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
                                                Danh sách cài đặt
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
                </div>
            </div>
        </LayoutMain >
    );
};

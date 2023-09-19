import React, { useEffect, useState } from "react";
import LayoutMain from "../../Layout/LayoutMain";
import { useDispatch } from "react-redux";
import {
    DataTable,
    MyEditor,
    ImgUploadTemp
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
import DateTimePicker from "react-datetime-picker";
import { LINK_IMAGE } from "../../Services";

export const CareerManager = () => {
    const dispatch = useDispatch();
    useEffect(() => { }, []);

    const [Title, setTitle] = useState("Thêm tin tuyển dụng");

    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const [CarrerContent, setCarrerContent] = useState("");
    const [AllowChange, setAllowChange] = useState(false);
    const [FileUpload, setFileUpload] = useState([]);
    const [resetImage, setResetImage] = useState(0);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [FromValue, setFromValue] = useState({
        CareerId: 0,
        CarrerName: "",
        CarrerDescription: "",
        ImageCareer: "",
        IsHide: 0,
        IsDelete: 0,
        GroupId: 0,
        Deadline: new Date(),
        Salary: '',
        Location: '',
        NumberOfRecruitment: '',
        WorkingModel: '',
        Rank: '',
        ProbationPeriod: '',
        Experience: '',
        Qualifications: '',

    });

    const [ListData, setListData] = useState([]);

    const [SearchValue, setSearchValue] = useState({
        FromDate: FirstOrLastDayinMonth(new Date(), 1),
        ToDate: new Date(),
        CarrerName: "",
    });

    const ClearForm = () => {
        setFromValue({
            CareerId: 0,
            CarrerName: "",
            CarrerDescription: "",
            ImageCareer: "",
            IsHide: 0,
            IsDelete: 0,
            GroupId: 0,
            Deadline: new Date(),
            Salary: '',
            Location: '',
            NumberOfRecruitment: '',
            WorkingModel: '',
            Rank: '',
            ProbationPeriod: '',
            Experience: '',
            Qualifications: '',

        });
        setCarrerContent("");
        setFileUpload([]);
        setResetImage(Math.random());
        setAllowChange(false)
        setTitle("Thêm tuyển dụng")
    };

    //#region Save
    const Shop_spCareer_Save = async () => {
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
                _newListImage = [newListImage, FromValue?.ImageCareer || ""].join(",");
            } else if (typeof FileUpload === 'string' || FileUpload.length === 0) {
                _newListImage = FromValue.ImageCareer
            } else if (!_newListImage) {
                Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
                setDisable(true);
                return;
            }

            if (FromValue.CarrerName === "" || FromValue.CarrerName === undefined) {
                Alertwarning("Vui lòng nhập tiêu đề tuyển dụng");
                setDisable(true);
                return;
            }

            if (FromValue.CarrerDescription === "" || FromValue.CarrerDescription === undefined) {
                Alertwarning("Vui lòng nhập nội dung ngắn");
                setDisable(true);
                return;
            }

            if (CarrerContent === '' || CarrerContent === undefined) {
                Alertwarning("Vui lòng nhập nội dung tuyển dụng");
                setDisable(true);
                return;
            }

            debugger
            const params = {
                
                Json: JSON.stringify({
                    CareerId: FromValue.CareerId,
                    CarrerName: FromValue.CarrerName?.trim(),
                    CarrerDescription: FromValue.CarrerDescription?.trim(),
                    CarrerContent: CarrerContent?.trim(),
                    ImageCareer: _newListImage,
                    IsHide: FromValue.IsHide,
                    IsDelete: FromValue.IsDelete,
                    UserId: User.UserId,
                    GroupId: FromValue.GroupId,
                    Deadline: FromValue.Deadline,
                    Salary: FromValue.Salary,
                    Location: FromValue.Location,
                    NumberOfRecruitment: FromValue.NumberOfRecruitment,
                    WorkingModel: FromValue.WorkingModel,
                    Rank: FromValue.Rank,
                    ProbationPeriod: FromValue.ProbationPeriod,
                    Experience: FromValue.Experience,
                    Qualifications: FromValue.Qualifications,
                }),
                func: "Shop_spCareer_Save",
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
                    if (e.CareerId === FromValue.CareerId) {
                        e.CareerId = FromValue.CareerId;
                        e.CarrerName = FromValue.CarrerName;
                        e.CarrerDescription = FromValue.CarrerDescription;
                        e.IsHide = FromValue.IsHide;
                        e.IsDelete = FromValue.IsDelete;
                        e.CarrerContent = CarrerContent;
                        e.ImageCareer = _newListImage;
                        e.EditOn = FormatDateJson(timeConfirm);
                        e.EditName = User.UserName;
                        e.Deadline = FromValue.Deadline;
                        e.Salary = FromValue.Salary;
                        e.Location = FromValue.Location;
                        e.NumberOfRecruitment = FromValue.NumberOfRecruitment;
                        e.WorkingModel = FromValue.WorkingModel;
                        e.Rank = FromValue.Rank;
                        e.ProbationPeriod = FromValue.ProbationPeriod;
                        e.Experience = FromValue.Experience;
                        e.Qualifications = FromValue.Qualifications;
                    }
                    return e;
                });
                setTitle("Thêm tin tuyền dụng");
                setListData(ListData);
                Alertsuccess(result.ReturnMess);
                ClearForm();
                setDisable2(true);
                JSON.stringify();
            }
        } catch (error) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
            setDisable(true);
        }
    };
    //#endregion

    //#region List
    const Shop_spCareer_List = async () => {
        try {
            setDisable2(false);
            const pr = {
                FromDate: FormatDateJson(SearchValue.FromDate, 9),
                ToDate: FormatDateJson(SearchValue.ToDate, 9),
                CarrerName: SearchValue.CarrerName?.trim(),
                KeySelect: 0,
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spCareer_List",
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

    //#endregion delete
    const Shop_spCareer_Delete = async (item) => {
        try {
            ConfirmAlert("", "Bạn có chắc muốn xóa?", "OK, Xác nhận xóa!", async () => {
                let Data = item.row._original;
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        CareerId: Data.CareerId,
                        IsDelete: 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spCareer_Delete",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);

                if (result.Status === "OK") {
                    setListData(
                        ListData.filter((item) => item.CareerId !== Data.CareerId)
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
    const Shop_spCareer_Hide = async (item) => {
        try {
            let Data = item.row._original, titleContent = "", titleButton = "";
            if (Data.IsHide) {
                titleContent = "Bạn có chắc muốn hiện tuyển dụng?";
                titleButton = "Ok, Hiện tin tuyển dụng";
            } else {
                titleContent = "Bạn có chắc muốn ẩn tuyển dụng?";
                titleButton = "Ok, Ẩn tin tuyển dụng";
            }
            ConfirmAlert("", titleContent, titleButton, async () => {
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        CareerId: Data.CareerId,
                        IsHide: Data.IsHide ? 0 : 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spCareer_Hide",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result[0]?.OK === "OK") {
                    ListData.map((e) => {
                        if (e.CareerId === Data.CareerId) {
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

    //#endregion edit
    const Shop_spCareer_Edit = (item, key) => {
        if (key === 'edit') {
            setTitle("Chi tiết tin tuyển dụng");
            setAllowChange(true)
        } else {
            setTitle("Sửa tin tuyền dụng");
            setAllowChange(false)
        }
        let Data = item.row._original;
        debugger
        setFromValue({
            CareerId: Data.CareerId,
            CarrerName: Data.CarrerName,
            CarrerDescription: Data.CarrerDescription,
            ImageCareer: Data.ImageCareer,
            IsHide: Data.IsHide ? 1 : 0,
            IsDelete: Data.IsDelete ? 1 : 0,
            CreateBy: User.UserId,
            Deadline: Data.Deadline,
            Salary: Data.Salary,
            Location: Data.Location,
            NumberOfRecruitment: Data.NumberOfRecruitment,
            WorkingModel: Data.WorkingModel,
            Rank: Data.Rank,
            ProbationPeriod: Data.ProbationPeriod,
            Experience: Data.Experience,
            Qualifications: Data.Qualifications,
        });
        setCarrerContent(Data.CarrerContent);
    };
    //#endregion

    //#region export excel
    const Shop_spCareer_ExportExcel = () => {
        setDisable2(false);
        const newData = ListData.map(element => {
            return {
                'Tiêu đề tuyển dụng': element.CarrerName,
                'Nội dung ngắng': element.CarrerDescription,
                'Người tạo': element.CreateName,
                'Ngày tạo': FormatDateJson(element.CreateOn),
                'Người sửa': element.EditName,
                'Ngày sửa': FormatDateJson(element.EditOn),
                'Deadline': FormatDateJson(element.Deadline),
                'Salary': element.Salary,
                'Location': element.Location,
                'NumberOfRecruitment': element.NumberOfRecruitment,
                'WorkingModel': element.WorkingModel,
                'Rank': element.Rank,
                'ProbationPeriod': element.ProbationPeriod,
                'Experience': element.Experience,
                'Qualifications': element.Qualifications,
            }
        })
        ExportExcel(newData, "Danh sách tuyển dụng")
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
                        className="fa fa-eye green btn-cursor button"
                        onClick={(e) => {
                            Shop_spCareer_Edit({ row }, 'edit')
                        }}
                        title="Chi tiết"
                        data-toggle="modal"
                        data-target=".bd-example-modal-xl"
                    />
                    <i
                        className="fa fa-edit orange btn-cursor button ml10"
                        data-toggle="modal"
                        data-target=".bd-example-modal-xl"
                        onClick={(e) => Shop_spCareer_Edit({ row })}
                        title="Sửa"
                    />
                    <i
                        className="fa fa-trash red btn-cursor button"
                        onClick={(e) => Shop_spCareer_Delete({ row })}
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
                            <a className="pointer" onClick={e => Shop_spCareer_Hide({ row })} title="Ẩn" >
                                <img src="../assets/img/icons8-toggle-off-50.png" className="transform-13" alt="Toggle Off" width="20" />
                            </a>
                        ) : (
                            <a className="pointer" onClick={e => Shop_spCareer_Hide({ row })} title="Hiện">
                                <img src="../assets/img/icons8-toggle-on-50.png" className="transform-13" alt="Toggle On" width="20" />
                            </a>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "Hình ảnh",
            accessor: "ImageCareer",
            filterable: false,
            Cell: ({ row }) => {
                return (
                    <div>
                        {row.ImageCareer !== undefined && row.ImageCareer !== "" && row.ImageCareer !== null ? (
                            row._original.ImageCareer.split(",").map((img, index) => {
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
            Header: "Tiêu đề tuyển dụng",
            accessor: "CarrerName",
        },
        {
            Header: "Nội dung ngắn",
            accessor: "CarrerDescription",
        },
        {
            Header: "Hạn nộp hồ sơ",
            accessor: "Deadline",
            Cell: (item) => <span>{FormatDateJson(item.value)}</span>,
        },
        {
            Header: "Mức lương",
            accessor: "Salary",
        },
        {
            Header: "Địa điểm tuyển dụng",
            accessor: "Location",
        },
        {
            Header: "Số lượng tuyển dụng",
            accessor: "NumberOfRecruitment",
        },
        {
            Header: "Hình thức làm việc",
            accessor: "WorkingModel",
        },
        {
            Header: "Cấp bậc tuyển dụng",
            accessor: "Rank",
        },
        {
            Header: "Thời gian thử việc",
            accessor: "ProbationPeriod",
        },
        {
            Header: "Kinh nghiệm làm việc",
            accessor: "Experience",
        },
        {
            Header: "Yêu cầu bằng cấp",
            accessor: "Qualifications",
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
                                        Tiêu đề tuyển dụng <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.CarrerName}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, CarrerName: e.target.value })
                                        }
                                        readOnly={AllowChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Nội dung ngắn <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.CarrerDescription}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, CarrerDescription: e.target.value })
                                        }
                                        readOnly={AllowChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Hạn nộp hồ sơ<span className="red">(*)</span>
                                    </label>
                                    <DateTimePicker
                                        className="form-control fix-date-time"
                                        format="MM/dd/yyyy"
                                        value={new Date(FromValue.Deadline)}
                                        onChange={(e) => {
                                            console.log(e);
                                            setFromValue({ ...FromValue, Deadline: e })
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Mức lương <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Từ 10 - 20 triệu"
                                        className="form-control"
                                        value={FromValue.Salary}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, Salary: e.target.value })
                                        }
                                        readOnly={AllowChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Địa điểm tuyển dụng <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Hồ Chí Minh"
                                        className="form-control"
                                        value={FromValue.Location}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, Location: e.target.value })
                                        }
                                        readOnly={AllowChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Số lượng tuyển dụng <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ex: 10 người"
                                        value={FromValue.NumberOfRecruitment}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, NumberOfRecruitment: e.target.value })
                                        }
                                        readOnly={AllowChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Hình thức làm việc <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ex: Full-time"
                                        value={FromValue.WorkingModel}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, WorkingModel: e.target.value })
                                        }
                                        readOnly={AllowChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Cấp bậc tuyển dụng <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ex: Nhân viên"
                                        value={FromValue.Rank}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, Rank: e.target.value })
                                        }
                                        readOnly={AllowChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Thời gian thử việc <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ex: 2 tháng"
                                        className="form-control"
                                        value={FromValue.ProbationPeriod}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, ProbationPeriod: e.target.value })
                                        }
                                        readOnly={AllowChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Kinh nghiệm làm việc <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ex: 2 năm"
                                        value={FromValue.Experience}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, Experience: e.target.value })
                                        }
                                        readOnly={AllowChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="no-absolute">
                                        Yêu cầu bằng cấp <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ex: Đại học"
                                        value={FromValue.Qualifications}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, Qualifications: e.target.value })
                                        }
                                        readOnly={AllowChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <ImgUploadTemp
                                    onImageUpload={(e) => setFileUpload(e)}
                                    onData={(e) => setFromValue({ ...FromValue, ImageCareer: e })}
                                    data={FromValue.ImageCareer}
                                    isReset={resetImage}
                                    readOnly={AllowChange}
                                />
                            </div>
                            <div className="col-md-12 CKEditor-m">
                                <label className="no-absolute">
                                    Nội dung tuyển dụng <span className="red">(*)</span>
                                </label>
                            </div>
                            <MyEditor
                                onChange={e => setCarrerContent(e)}
                                values={CarrerContent}
                                height={400}
                            />
                        </div>
                    </div>
                    {!AllowChange &&
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
                                    onClick={(e) => {
                                        Shop_spCareer_Save();
                                    }}
                                >
                                    <span>
                                        <i className="fa-regular fa-floppy-disk mr-1"></i>Lưu
                                    </span>
                                </button>
                            </div>
                        </div>
                    }
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
                            <span className="HomeTitle">Tìm kiếm tuyển dụng</span>
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
                                        <i className="fa-solid fa-plus mr-2"></i>Thêm tuyển dụng mới
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 margin-top-10 border-bottom-dash"></div>
                    <div className="row">
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
                                    Tên tuyển dụng <span className="red">(*)</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={SearchValue.CarrerName}
                                    onChange={(e) =>
                                        setSearchValue({ ...SearchValue, CarrerName: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-md-12 text-center mt-3 mb-3">
                            <button
                                type="button"
                                className="btn btn-sm btn-success"
                                disabled={!Disable2}
                                onClick={(e) => Shop_spCareer_List()}
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
                                Danh sách tuyển dụng
                                <span className="ml-2 color-green">{ListData.length > 0 && `(${ListData.length})`}</span>
                            </span>
                            <div className="float-right">
                                {ListData.length > 0 && <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success mr-1"
                                    disabled={!Disable2}
                                    onClick={e => Shop_spCareer_ExportExcel()}
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
            </div>
        </LayoutMain>
    );
};

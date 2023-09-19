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


export const NewsManager = () => {
    const dispatch = useDispatch();
    useEffect(() => { }, []);

    const [Title, setTitle] = useState("Thêm bài viết");

    const [Disable, setDisable] = useState(true);
    const [Disable2, setDisable2] = useState(true);
    const [NewsContent, setNewsContent] = useState("");
    const [AllowChange, setAllowChange] = useState(false);
    const [FileUpload, setFileUpload] = useState([]);
    const [resetImage, setResetImage] = useState(0);
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [FromValue, setFromValue] = useState({
        NewsId: 0,
        NewsTitle: "",
        IsHide: 0,
        IsDelete: 0,
        ImageNews: "",
        NewsDescription: "",
    });

    const [ListData, setListData] = useState([]);

    const [SearchValue, setSearchValue] = useState({
        FromDate: FirstOrLastDayinMonth(new Date(), 1),
        ToDate: new Date(),
        NewsTitle: "",
    });


    const ClearForm = () => {
        setFromValue({
            NewsId: 0,
            NewsTitle: "",
            IsHide: 0,
            IsDelete: 0,
            ImageNews: "",
            NewsDescription: "",

        });
        setNewsContent("");
        setFileUpload([]);
        setResetImage(Math.random());
        setAllowChange(false)
        setTitle("Thêm bài viết")
    };

    //#region Save
    const Shop_spNews_Save = async () => {
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
                _newListImage = [newListImage, FromValue?.ImageNews || ""].join(",");

            } else if (typeof FileUpload === 'string' || FileUpload.length === 0) {
                _newListImage = FromValue.ImageNews
            } else if (!_newListImage) {
                Alerterror("File không hợp lệ hoặc dung lượng quá lớn.");
                setDisable(true);
                return;
            }

            if (FromValue.NewsTitle === "" || FromValue.NewsTitle === undefined) {
                Alertwarning("Vui lòng nhập tiêu đề bài viết");
                setDisable(true);
                return;
            }

            if (FromValue.NewsDescription === "" || FromValue.NewsDescription === undefined) {
                Alertwarning("Vui lòng nhập nội dung ngắn");
                setDisable(true);
                return;
            }

            if (NewsContent === '' || NewsContent === undefined) {
                Alertwarning("Vui lòng nhập nội dung bài viết");
                setDisable(true);
                return;
            }

            const params = {
                Json: JSON.stringify({
                    NewsId: FromValue.NewsId,
                    NewsTitle: FromValue.NewsTitle?.trim(),
                    NewsDescription: FromValue.NewsDescription?.trim(),
                    NewsContent: NewsContent?.trim(),
                    ImageNews: _newListImage,
                    IsHide: FromValue.IsHide,
                    IsDelete: FromValue.IsDelete,
                    UserId: User.UserId,
                }),
                func: "Shop_spNews_Save",
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
                    if (e.NewsId === FromValue.NewsId) {
                        e.NewsId = FromValue.NewsId;
                        e.NewsTitle = FromValue.NewsTitle;
                        e.NewsDescription = FromValue.NewsDescription;
                        e.IsHide = FromValue.IsHide;
                        e.IsDelete = FromValue.IsDelete;
                        e.NewsContent = NewsContent;
                        e.ImageNews = _newListImage;
                        e.EditOn = FormatDateJson(timeConfirm);
                        e.EditName = User.UserName;
                    }
                    return e;
                });
                setTitle("Thêm tin tức");
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
    const Shop_spNews_List = async () => {
        try {
            setDisable2(false);
            const pr = {
                FromDate: FormatDateJson(SearchValue.FromDate, 9),
                ToDate: FormatDateJson(SearchValue.ToDate, 9),
                NewsTitle: SearchValue.NewsTitle?.trim(),
                KeySelect: 0,
                UserId: User.UserId,
            };
            const params = {
                Json: JSON.stringify(pr),
                func: "Shop_spNews_List",
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
    const Shop_spNews_Delete = async (item) => {
        try {
            ConfirmAlert("", "Bạn có chắc muốn xóa?", "OK, Xác nhận xóa!", async () => {
                let Data = item.row._original;
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        NewsId: Data.NewsId,
                        IsDelete: 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spNews_Delete",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                 
                if (result.Status === "OK") {
                    setListData(
                        ListData.filter((item) => item.NewsId !== Data.NewsId)
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
    const Shop_spNews_Hide = async (item) => {
        try {
            let Data = item.row._original, titleContent = "", titleButton = "";
            if (Data.IsHide) {
                titleContent = "Bạn có chắc muốn hiện bài viết?";
                titleButton = "Ok, Hiện bài viết";
            } else {
                titleContent = "Bạn có chắc muốn ẩn bài viết?";
                titleButton = "Ok, Ẩn bài viết";
            }
            ConfirmAlert("", titleContent, titleButton, async () => {
                setDisable2(false);
                const params = {
                    Json: JSON.stringify({
                        NewsId: Data.NewsId,
                        IsHide: Data.IsHide ? 0 : 1,
                        UserId: User.UserId,
                    }),
                    func: "Shop_spNews_Hide",
                };
                const result = await mainAction.API_spCallServer(params, dispatch);
                if (result[0]?.OK === "OK") {
                    ListData.map((e) => {
                        if (e.NewsId === Data.NewsId) {
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
    const Shop_spNews_Edit = (item, key) => {
        if (key === 'edit') {
            setTitle("Chi tiết bài viết");
            setAllowChange(true)
        } else {
            setTitle("Sửa tin tức");
            setAllowChange(false)
        }
        let Data = item.row._original;
        setFromValue({
            NewsId: Data.NewsId,
            NewsTitle: Data.NewsTitle,
            NewsDescription: Data.NewsDescription,
            ImageNews: Data.ImageNews,
            IsHide: Data.IsHide ? 1 : 0,
            IsDelete: Data.IsDelete ? 1 : 0,
            CreateBy: User.UserId,
        });
        setNewsContent(Data.NewsContent);
    };
    //#endregion

    //#region export excel
    const Shop_spNews_ExportExcel = () => {
        setDisable2(false);
        const newData = ListData.map(element => {
            return {
                'Tên bài viết': element.NewsTitle,
                'Nội dung ngắng': element.NewsDescription,
                'Người tạo': element.CreateName,
                'Ngày tạo': FormatDateJson(element.CreateOn),
                'Người sửa': element.EditName,
                'Ngày sửa': FormatDateJson(element.EditOn),
            }
        })
        ExportExcel(newData, "Danh sách bài viết")
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
                            Shop_spNews_Edit({ row }, 'edit')
                        }}
                        title="Chi tiết"
                        data-toggle="modal"
                        data-target=".bd-example-modal-xl"
                    />
                    <i
                        className="fa fa-edit orange btn-cursor button ml10"
                        data-toggle="modal"
                        data-target=".bd-example-modal-xl"
                        onClick={(e) => Shop_spNews_Edit({ row })}
                        title="Sửa"
                    />
                    <i
                        className="fa fa-trash red btn-cursor button ml10"
                        onClick={(e) => Shop_spNews_Delete({ row })}
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
                            <a className="pointer" onClick={e => Shop_spNews_Hide({ row })} title="Ẩn" >
                                <img src="../assets/img/icons8-toggle-off-50.png" className="transform-13" alt="Toggle Off" width="20" />
                            </a>
                        ) : (
                            <a className="pointer" onClick={e => Shop_spNews_Hide({ row })} title="Hiện">
                                <img src="../assets/img/icons8-toggle-on-50.png" className="transform-13" alt="Toggle On" width="20" />
                            </a>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "Hình ảnh",
            accessor: "ImageNews",
            filterable: false,
            Cell: ({ row }) => {
                return (
                    <div>
                        {row.ImageNews !== undefined && row.ImageNews !== "" && row.ImageNews !== null ? (
                            row._original.ImageNews.split(",").map((img, index) => {
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
            Header: "Tiêu đề bài viết",
            accessor: "NewsTitle",
        },
        {
            Header: "Nội dung ngắn",
            accessor: "NewsDescription",
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
                                        Tiêu đề bài viết <span className="red">(*)</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={FromValue.NewsTitle}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, NewsTitle: e.target.value })
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
                                        value={FromValue.NewsDescription}
                                        onChange={(e) =>
                                            setFromValue({ ...FromValue, NewsDescription: e.target.value })
                                        }
                                        readOnly={AllowChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-12">
                                <ImgUploadTemp
                                    onImageUpload={(e) => setFileUpload(e)}
                                    onData={(e) => setFromValue({ ...FromValue, ImageNews: e })}
                                    data={FromValue.ImageNews}
                                    isReset={resetImage}
                                    readOnly={AllowChange}
                                />
                            </div>
                            <div className="col-md-12 CKEditor-m">
                                <label className="no-absolute">
                                    Nội dung bài viết <span className="red">(*)</span>
                                </label>
                            </div>
                            <MyEditor
                                onChange={e => setNewsContent(e)}
                                values={NewsContent}
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
                                        Shop_spNews_Save();
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
                            <span className="HomeTitle">Tìm kiếm bài viết</span>
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
                                        <i className="fa-solid fa-plus mr-2"></i>Thêm bài viết mới
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
                                    Tên bài viết <span className="red">(*)</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={SearchValue.NewsTitle}
                                    onChange={(e) =>
                                        setSearchValue({ ...SearchValue, NewsTitle: e.target.value })
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-md-12 text-center mt-3 mb-3">
                            <button
                                type="button"
                                className="btn btn-sm btn-success"
                                disabled={!Disable2}
                                onClick={(e) => Shop_spNews_List()}
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
                                Danh sách bài viết
                                <span className="ml-2 color-green">{ListData.length > 0 && `(${ListData.length})`}</span>
                            </span>
                            <div className="float-right">
                                {ListData.length > 0 && <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success mr-1"
                                    disabled={!Disable2}
                                    onClick={e => Shop_spNews_ExportExcel()}
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

import { useState, useEffect } from "react";
import { Alerterror, Alertsuccess } from "../../Utils";
import { mainAction } from "../../Redux/Actions";
import { useDispatch } from "react-redux";

export const PermissionUser = ({
    UserInfo = {},
    ChangePermission = () => { }
}) => {
    const dispatch = useDispatch();
    const [Menus, setMenus] = useState([]);
    const [Disable3, setDisable3] = useState(true);
    const [selectAll, setSelectAll] = useState(false); // Thêm biến trạng thái selectAll và khởi tạo ban đầu là false

    useEffect(() => {
        Shop_spUserPermission_Get()
    }, [UserInfo]);


    //#endregion
    const handleSelectAll = () => {
        // Tạo một bản sao của mảng Menus để thay đổi trạng thái của tất cả các switch
        const updatedMenus = Menus.map((item) => {
            return {
                ...item,
                IsPermission: selectAll ? 0 : 1, // Đặt trạng thái hoạt động của tất cả các switch thành 0 hoặc 1 tùy thuộc vào giá trị của selectAll
            };
        });
        setMenus(updatedMenus); // Cập nhật lại state 'Menus' với trạng thái mới của các switch
        setSelectAll(!selectAll); // Đảo ngược giá trị của selectAll
    };

    const handleChange = (index) => {
        return () => {
            const updatedMenus = [...Menus];
            updatedMenus[index].IsPermission = updatedMenus[index].IsPermission === 1 ? 0 : 1;
            setMenus(updatedMenus);
        };
    };

    //#region List
    const Shop_spUserPermission_Get = async () => {
        try {
            const params = {
                Json: JSON.stringify({
                    UserId: UserInfo.UserId,
                }),
                func: "Shop_spUserPermission_Get",
            };
            const result = await mainAction.API_spCallServer(params, dispatch);
            if (result.length > 0) {
                setMenus(result);
                return;
            }
        } catch (err) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
        }
    };
    //#endregion

    //#region Save
    const Shop_spUserPermission_Save = async () => {
         
        try {
            setDisable3(false);
            let UserPermissionTmp = [];
            if (Array.isArray(Menus)) {
                UserPermissionTmp = Menus
                    .filter(e => e.IsPermission === 1)
                    .map(e => ({
                        UserId: UserInfo.UserId,
                        MenuId: e.Id,
                    }));
            }
            const params = {
                Json: JSON.stringify({
                    Clear: UserPermissionTmp.length,
                    UserInfo: UserInfo.UserId,
                    UserPermission: UserPermissionTmp,
                }),
                func: "Shop_spUserPermission_Save",
            };
            setDisable3(true);
            const result = await mainAction.API_spCallServer(params, dispatch);
            Alertsuccess(result.ReturnMess);
            setDisable3(true);
        } catch (error) {
            Alerterror("Lỗi dữ liệu, vui lòng liên hệ IT!");
            setDisable3(true);
        }
    };
    //#endregion

    return (
        <>
            <div className="row mt-3 mb-3">
                <div className="col-md-12">
                    <span className="HomeTitle">
                        Phân quyền truy cập
                        <span className="ml-2 color-green">{UserInfo?.Name && `(${UserInfo?.Name})`}</span>
                    </span>
                    <div className="float-right">
                        <button
                            type="button"
                            className="btn btn-sm btn-success"
                            onClick={e => handleSelectAll()}
                        >
                            <span>
                                <i className="fa-solid fa-check mr-2"></i>Chọn tất cả
                            </span>
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-warning ml-2"
                            onClick={ChangePermission}
                        >
                            <span>
                                <i className="fa-solid fa-rotate-left mr-2"></i>Trở lại
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <table width={"100%"} className="table table-bordered table-striped" cellPadding={5}>
                <thead>
                    <tr>
                        <th style={{ ...customStyles.default, maxWidth: '40px', width: '40px', textAlign: 'center' }} className="">STT</th>
                        <th style={{ ...customStyles.default, maxWidth: '130px', width: '130px', textAlign: 'center' }} className="">Cấp quyền</th>
                        <th style={customStyles.default} className="">Tính năng</th>
                        <th style={{ ...customStyles.default, maxWidth: '60px', width: '60px', textAlign: 'center' }} className="">Status</th>
                    </tr>
                </thead>
                <tbody className="permission">
                    {Menus.map((item, index) => {
                        const switchId = `switch-${index}`; // Tạo id duy nhất cho từng switch

                        return (
                            <tr key={index}>
                                <td>
                                    <div style={{ textAlign: 'center' }}>{index + 1}</div>
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        id={switchId}
                                        className="switch-input"
                                        checked={item.IsPermission === 1 ? true : false} // Đặt trạng thái hoạt động của switch dựa trên giá trị 'IsPermission'
                                        onChange={handleChange(index)} // Xử lý sự kiện khi switch thay đổi
                                    />
                                    <label htmlFor={switchId} className="switch"></label>
                                </td>
                                <td>
                                    <div>{item.MenuName}</div>
                                </td>
                                <td>
                                    <div style={{ textAlign: 'center' }}>
                                        {item.IsPermission === 1 && <i className="fa-solid fa-circle-check checkok"></i>}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="row">
                <div className="col-md-12 text-center mt-3 mb-3">
                    <button
                        type="button"
                        className="btn btn-sm btn-success"
                        disabled={!Disable3}
                        onClick={(e) => Shop_spUserPermission_Save()}
                    >
                        <span>
                            <i className="fa-solid fa-clipboard-check mr-2"></i>
                            Cập nhật
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
};

const customStyles = {
    tableTitle: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333",
    },
    pink: {
        backgroundColor: "rgb(252,228,214)",
    },
    yellow: {
        backgroundColor: "rgb(252,230,153)",
    },
    th: {
        fontSize: "13px",
        padding: "5px",
        backgroundColor: "#eaf1fb",
        verticalAlign: "middle",
        fontWeight: 500,
        paddingLeft: '5px',
    },
    th150: {
        fontSize: "13px",
        padding: "0",
        backgroundColor: "#eaf1fb",
        width: "150px",
        verticalAlign: "middle",
        fontWeight: 500,
        paddingLeft: '5px',
    },
    th100: {
        fontSize: "13px",
        padding: "0",
        backgroundColor: "#eaf1fb",
        width: "100px",
        verticalAlign: "middle",
        fontWeight: 500,
        paddingLeft: '5px',
        paddingRight: '5px'
    },
    th80: {
        fontSize: "13px",
        padding: "0",
        backgroundColor: "#eaf1fb",
        width: "80px",
        verticalAlign: "middle",
        fontWeight: 500,
        paddingLeft: '5px',
    },
    th40: {
        fontSize: "13px",
        padding: "0",
        backgroundColor: "#eaf1fb",
        width: "40px",
        fontWeight: 500,
    },
    date_input: {
        outline: "none",
        border: "none",
        padding: "8px",
        background: "#fff",
        margin: "0px",
        fontSize: "0.9em",
        fontWeight: 400,
        width: "100px",
        maxWidth: "100px",
        textAlign: "center",
        textTransform: "uppercase",
    },
    form_control3: {
        display: "block",
        width: "100%",
        padding: "8px",
        fontWeight: 400,
        lineWeight: 1.5,
        color: "#495057",
        backgroundColor: "#fff",
        backgroundClip: "padding-box",
        borderRadius: 0,
        boxShadow: "unset",
        transition: "unset",
        borderRadius: '5px',
        height: '38px',
        border: "1px solid #CED4DA",
    },
    form_control3_bold: {
        display: "block",
        width: "100%",
        padding: "8px",
        lineWeight: 1.5,
        color: "#495057",
        backgroundColor: "#fff",
        backgroundClip: "padding-box",
        boxShadow: "unset",
        transition: "unset",
        fontWeight: "500",
        border: "2px solid #2563eb",
    },
    specialTd: {
        padding: "8px  !important",
        fontWeight: 400,
        lineWeight: 1.5,
        color: "#495057",
        backgroundColor: "#fff",
    },
    TdFooter: {
        padding: "8px  !important",
        fontWeight: 500,
        lineWeight: 1.5,
        color: "#000",
        backgroundColor: "#ffc10761",
        textAlign: "center",
    },
    default: {
        fontSize: "13px",
        padding: "10px",
        backgroundColor: "#eaf1fb",
        verticalAlign: "middle",
        fontWeight: 500,
        paddingLeft: '5px',
    },
};

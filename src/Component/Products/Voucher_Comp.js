import { useState, useEffect } from "react";
import { SelectCustomer } from "../../Common";
import Select from 'react-select';

export const Voucher_Comp = ({
    ListData = [],
    onData = () => { },
    readOnly = false
}) => {
    const [Data, setData] = useState([]);
    const [Flag, setFlag] = useState(false); //Biến này thay đổi thì update lại ondata attribute cho view sản phẩm

    useEffect(() => {
        setData(ListData);
    }, [ListData]);

    useEffect(() => {
        if (Flag) {
            onData(Data);
            setFlag(false);
        }
    }, [Flag]);


    const optionSelect = [
        { value: 0, label: 'Vui lòng chọn' },
        { value: 1, label: 'Theo %' },
        { value: 2, label: 'Số tiền' },
    ]

    const [OptionValue, setOptionValue] = useState({
        FromDate: new Date(),
        ToDate: new Date(),
    });

    //#region Update Table Data
    const updateTableData = (rowIndex, columnId, value, key) => {
        setData((old) => {
            return old.map((row, index) => {
                if (index === rowIndex) {

                    return {
                        ...old[rowIndex],
                        [columnId]: value,
                    };
                }
                return row;
            });
        });
    };

    //#endregion


    // #region tạo mã voucher
    const generateVoucherCode = (item) => {
        const characters = 'ABCDEFGHIABCDABCDEEJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        return code
        // setVoucherCode(code);
    };


    //#region Add thêm dòng
    const onAddRow = () => {
        let code = ''
        code = generateVoucherCode('ABCDEFGHIABCDABCDEEJKLMNOPQRSTUVWXYZ0123456789')
        setData([
            ...Data,
            {
                IsDelete: false,
                VoucherCode: code
            },
        ]);
    };
    //#endregion

    return (
        <>
            <>
                <label className="no-absolute">Thêm Voucher<span className="red">(*)</span></label>
                <table
                    width={"100%"}
                    className="table table-bordered table-striped table-container"
                    cellPadding={6}
                >
                    <thead>
                        <tr>
                            <th style={customStyles.th20}></th>
                            <th style={customStyles.th80}>Mã Voucher</th>
                            <th style={customStyles.th100}>Khách hàng</th>
                            <th style={customStyles.th100}>Loại giảm</th>
                            <th style={customStyles.th100}>Số tiền / % Giảm</th>
                            <th style={customStyles.th80}>Thời gian bắt đầu</th>
                            <th style={customStyles.th80}>Thời gian kết thúc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Data?.filter((p) => p.IsDelete === false).map((item, index) => {
                            const initialTypeSelect = optionSelect.find(option => option.value === item.TypeDiscount);
                            let code = ''
                            if (item.VoucherCode === '' || item.VoucherCode === undefined) {
                                code = generateVoucherCode('ABCDEFGHIABCDABCDEEJKLMNOPQRSTUVWXYZ0123456789')
                            }
                            return (
                                <tr key={index}>
                                    <td className="p-1 max-width-10">
                                        <button
                                            type="button"
                                            className="btn-xs btn-danger"
                                            style={{ border: 'solid 1px', cursor: 'pointer' }}
                                            onClick={(e) => {
                                                updateTableData(index, "IsDelete", 1);
                                                setFlag(!Flag);
                                            }}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <input
                                            value={item.VoucherCode || ""}
                                            onChange={(e) => {
                                                updateTableData(index, "VoucherCode", e.target.value, 'key')
                                                setFlag(!Flag)
                                            }}
                                            type="text"
                                            style={customStyles.form_control3}
                                            onBlur={(e) => setFlag(!Flag)}
                                        />
                                    </td>
                                    <td>
                                        <SelectCustomer
                                            Data={[{ value: item.CustomerId }]}
                                            onSelected={(e) => {
                                                updateTableData(index, "CustomerId", e.value);
                                                setFlag(!Flag)
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <Select
                                            options={optionSelect}
                                            value={initialTypeSelect}
                                            onChange={(selectedOption) => {
                                                updateTableData(index, "TypeDiscount", selectedOption.value);
                                                setFlag(!Flag);
                                            }}
                                            styles={{ menu: base => ({ ...base, zIndex: 3 }) }}
                                            menuPosition={'fixed'}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            value={item.Discount || ""}
                                            onChange={(e) => {
                                                updateTableData(index, "Discount", e.target.value)
                                                setFlag(!Flag)
                                            }}
                                            type="number"
                                            style={customStyles.form_control3}
                                            onBlur={(e) => setFlag(!Flag)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="datetime-local"
                                            style={customStyles.form_control3}
                                            value={item.Fromday || ""}
                                            onChange={(e) => {
                                                updateTableData(index, "Fromday", e.target.value)
                                                setFlag(!Flag)
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="datetime-local"
                                            style={customStyles.form_control3}
                                            value={item.Today || ""}
                                            onChange={(e) => {
                                                updateTableData(index, "Today", e.target.value)
                                                setFlag(!Flag)
                                            }
                                            }
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    {!readOnly &&
                        <tfoot>
                            <tr>
                                <td colSpan={7} className="text-center p-1">
                                    <button
                                        type="button"
                                        className="btn btn-xs "
                                        onClick={onAddRow}
                                        title="Ctrl + Alt + N">
                                        <i className="fas fa-plus"></i> Thêm dòng
                                    </button>
                                </td>
                            </tr>
                        </tfoot>
                    }
                </table>
            </>
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
    th20: {
        fontSize: "5px",
        padding: "0",
        backgroundColor: "#eaf1fb",
        width: "5px",
        fontWeight: 50,
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
    btnMin: {
        minWidth: '40px !important',
    },
};

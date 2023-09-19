import { useState, useEffect } from "react";
import { SelectProduct } from "../../Common";
import Select from 'react-select';
export const Product_PromotionComp = ({
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
  const updateTableData = (rowIndex, columnId, value) => {
     
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

  //#region Add thêm dòng
  const onAddRow = () => {
    setData([
      ...Data,
      {
        IsDelete: false,
      },
    ]);
  };
  //#endregion

  return (
    <>
      <>
        <label className="no-absolute">Thêm sản phẩm <span className="red">(*)</span></label>
        <table
          width={"100%"}
          className="table table-bordered table-striped table-container"
          cellPadding={6}
        >
          <thead>
            <tr>
              <th style={customStyles.th80}></th>
              <th style={customStyles.th100}>Sản phẩm</th>
              <th style={customStyles.th100}>Loại giảm</th>
              <th style={customStyles.th100}>Số tiền / % Giảm</th>
              <th style={customStyles.th80}>Thời gian bắt đầu</th>
              <th style={customStyles.th80}>Thời gian kết thúc</th>
            </tr>
          </thead>
          <tbody>
            {Data?.filter((p) => p.IsDelete === false).map((item, index) => {
              const initialTypeSelect = optionSelect.find(option => option.value === item.TypePromotion);
              return (
                <tr key={index}>
                  <td className="p-1 max-width-40">
                      <button
                        type="button"
                        className="btn btn-xs btn-danger"
                        onClick={(e) => {
                          updateTableData(index, "IsDelete", 1);
                          setFlag(!Flag);
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                  </td>
                  <td>
                    <SelectProduct
                      Data={[{ value: item.ProductId }]}
                      onSelected={(e) => {
                        updateTableData(index, "ProductId", e.value);
                        setFlag(!Flag)
                      }}
                    />
                  </td>
                  <td>
                    <Select
                      options={optionSelect}
                      value={initialTypeSelect}
                      onChange={(selectedOption) => {
                        updateTableData(index, "TypePromotion", selectedOption.value);
                        setFlag(!Flag);
                      }}
                      styles={{ menu: base => ({ ...base, zIndex: 3 }) }}
                      menuPosition={'fixed'}
                    />
                  </td>
                  <td>
                    <input
                      value={item.Promotion || ""}
                      onChange={(e) => {
                        updateTableData(index, "Promotion", e.target.value)
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
                      value={item.SaleFrom || ""}
                      onChange={(e) => {
                        updateTableData(index, "SaleFrom", e.target.value)
                        setFlag(!Flag)
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="datetime-local"
                      style={customStyles.form_control3}
                      value={item.SaleTo || ""}
                      onChange={(e) => {
                        updateTableData(index, "SaleTo", e.target.value)
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
                <td colSpan={6} className="text-center p-1">
                  <button
                    type="button"
                    className="btn btn-xs "
                    onClick={onAddRow}
                    title="Ctrl + Alt + N"
                  >
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
    // outline: 0,
    // border: 0,
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
    // outline: 0,
    // borderRadius: 0,
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

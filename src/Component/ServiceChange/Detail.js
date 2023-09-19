import { useState, useEffect } from "react";

export const Service_DetailComp = ({
  ListData = [],
  onData = () => { },
  readOnly = false
}) => {
  const [Data, setData] = useState([]);
  const [Flag, setFlag] = useState(false); //Biến này thay đổi thì update lại ondata detail cho view dịch vụ

  useEffect(() => {
    setData(ListData);
  }, [ListData]);

  useEffect(() => {
    if (Flag) {
      onData(Data);
      setFlag(false);
    }
  }, [Flag]);
  //#region Update Table Data

  const updateTableData = (rowIndex, columnId, value) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
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
        <label className="no-absolute">Chi tiết dịch vụ <span className="red">(*)</span></label>
        <table
          width={"100%"}
          className="table table-bordered table-striped"
          cellPadding={5}
        >
          <thead>
            <tr>
              <th style={customStyles.th40}></th>
              {/* <th style={customStyles.th100}>Thuộc tính</th> */}
              <th style={customStyles.th150}>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {Data?.filter((p) => p.IsDelete === false).map((item, index) => {
              return (
                <tr key={index}>
                  <td className="p-1 max-width-40">
                    {!readOnly &&
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
                    }
                  </td>
                  <td>
                    <input
                      value={item.DetailName || ""}
                      onChange={(e) =>
                        updateTableData(index, "DetailName", e.target.value)
                      }
                      type="text"
                      style={customStyles.form_control3}
                      onBlur={(e) => setFlag(!Flag)}
                      readOnly={readOnly}
                    />
                  </td>
                  {/* <td>
                    <input
                      value={item.DetailDescription || ""}
                      onChange={(e) =>
                        updateTableData(index, "DetailDescription", e.target.value)
                      }
                      type="text"
                      style={customStyles.form_control3}
                      onBlur={(e) => setFlag(!Flag)}
                      readOnly={readOnly}
                    />
                  </td> */}
                </tr>
              );
            })}
          </tbody>
          {!readOnly &&
            <tfoot>
              <tr>
                <td colSpan={3} className="text-center p-1">
                  <button
                    type="button"
                    className="btn btn-xs btn-default"
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
};

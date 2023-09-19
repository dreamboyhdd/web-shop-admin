import React, { useEffect } from 'react';
import ReactTable from "react-table-6";
import 'react-table-6/react-table.css';
const DataTableComp = ({
    data = () => { },
    columns = () => { },
    IsLoad = false
}) => {

    useEffect(() => {
       
    }, []);
    
    return (
        <ReactTable
            data={data}
            columns={columns}
            defaultPageSize={10}
            className="-striped -highlight"
            /* SubComponent={row => {
                return(
                    <input type="button" value="Edit"/>
                )
                }}  */
            filterable={true}   
            // Text
            previousText='<'
            nextText= '>'
            loadingText= 'Loading...'
            noDataText= 'Không tìm thấy dữ liệu'
            pageText= 'Trang'
            ofText= 'của'
            rowsText= 'dòng'
            
            // Accessibility Labels
            pageJumpText= 'chuyển đến trang'
            rowsSelectorText= 'số dòng trên trang '

        />

    )
}


export const DataTable = React.memo(DataTableComp)
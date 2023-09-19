import React, { useEffect, useState } from 'react';
import WindowedSelect from "react-windowed-select";

const AttributeMergeComp = ({
    onSelected = () => { },
    isDisabled = false,
    isMulti = true,
    list = [],
    row = '',
    ListData = [],
    item = [],
    ProductId = 0
}) => {
    const [data, setData] = useState([]);
    const [valueS, setValueS] = useState([]);

    const onSelecteItem = (item) => {
        onSelected(item);
        setValueS(item);
    };

    useEffect(() => {
        const dataSelect = [];
        list.forEach((element) => {
            dataSelect.push({
                value: element.AttributeId,
                label: element.AttributeName + ": " + element.Description,
            });
            if (element.ProductId === ProductId && item.length > 0) {
                setValueS(item)
            }
            else {
                setValueS([])
            }
        })
        setData(dataSelect);
    }, [ListData]);

    return (
        <WindowedSelect
            value={valueS}
            onChange={onSelecteItem}
            options={data}
            isMulti={isMulti}
            isDisabled={isDisabled}
            menuPosition={'fixed'}
        />
    );
};

export const AttributeMerge = React.memo(AttributeMergeComp);

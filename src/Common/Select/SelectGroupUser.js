import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import WindowedSelect from "react-windowed-select";
import { mainAction } from '../../Redux/Actions';
import {
    DecodeString,
    GetCookieValue,
} from "../../Utils";
const SelectGroupUserComp = ({
    onSelected = () => { },
    isDisabled = false,
    clearData = [],
    isMulti = false,
    Data = []
}) => {
    const _User = DecodeString(GetCookieValue());
    const User = _User && JSON.parse(_User);
    const [data, setData] = useState([])
    const [valueS, setValueS] = useState([])
    const onSelecteItem = (item) => {
        onSelected(item)
        setValueS(item);
    }
    const dispatch = useDispatch();
    debugger
    const Shop_spGroupUsers_List = async () => {
        const params = {
            Json: JSON.stringify({
                UserId: User.UserId
            }),
            func: "Shop_spGroupUsers_List"
        }
        const list = await mainAction.API_spCallServer(params, dispatch);
        const FirstData = { value: 0, label: 'Vui lòng chọn' };
        let dataSelect = [];

        if (isMulti === false) {
            dataSelect.push(FirstData);
            setValueS(FirstData);
        }
        list.forEach((element, index) => {
            dataSelect.push({ value: element.ID, label: element.GroupName });
        });

        if (clearData.length > 0) {
            let datatam = [], valuetam = "";
            clearData.forEach((element, index) => {
                if (element.value !== 0) {
                    valuetam = dataSelect.find(a => a.value == element.value);
                    datatam.push(valuetam);
                }
            });
            setValueS(datatam);
        }

        if (Data.value !== undefined || Data.value === 0) {
            const a = data.filter(a => a.value == Data.value)
            arr.push(...a);
            setValueS(arr)
        }

        else {
            setValueS({ value: 0, label: 'Vui lòng chọn' });
        }
        setData(dataSelect)
    }


    useEffect(() => {
        Shop_spGroupUsers_List()
    }, []);

    let arr = []
    useEffect(() => {
        debugger
        if (Data.value === undefined) {
            setValueS({ value: 0, label: 'Vui lòng chọn' })
        }
        else {
            const a = data.filter(a => a.value == Data.value)
            arr.push(...a);
            setValueS(arr)
        }
    }, [Data]);

    useEffect(() => {
        if (isMulti === true) {
            if (clearData.length === 0) {
                setValueS({ value: 0, label: 'Vui lòng chọn' })
            }
            else {
                for (const item of clearData) {
                    const a = data.filter(a => a.value == item.value && item.value !== 0)
                    arr.push(...a);
                }
                setValueS(arr)
            }
        }
    }, [clearData]);
    //#endregion
    return (
        <WindowedSelect
            value={valueS}
            onChange={onSelecteItem}
            options={data}
            isMulti={isMulti}
            isDisabled={isDisabled}
            menuPosition={'fixed'}
            menuPlacement={"auto"}
            styles={{
                menuPortal: ({ left, top, ...provided }, state) => ({
                    ...provided
                })
            }}
        />
    )
}


export const SelectGroupUser = React.memo(SelectGroupUserComp)
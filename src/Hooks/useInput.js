import { useState } from 'react'  
  
export const useInput = (initialValue) => {  
    const [value, setValue] = useState(initialValue)  
    const reset = (items) => {  
        setValue(items)  
    }  
  
    const bind = {  
        value,  
        onChange: e => {  
            setValue(e.target.value)  
        }  
    }  
  
    return [value, bind, reset]  
}  
  
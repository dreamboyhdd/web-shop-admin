const CONSTANT_TOKEN = 'NETCO_POST'

export const setData = async (key, value) => {
    try {
        
        await localStorage.setItem(`${CONSTANT_TOKEN}:${key}`, value)
        return true;
    } catch (error) {
        return false
    }
}

export const getData = async (key) => {
    try {
        const value = await localStorage.getItem(`${CONSTANT_TOKEN}:${key}`)
        if (value !== null) {
            return value;
        }
        return '';
    } catch (error) {
        return ''
    }
}

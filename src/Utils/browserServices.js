// Local Storage
export const getItemLocalStorage = (key) => {
    if (typeof window !== "undefined") {
        const item = localStorage.getItem(key)
        return item
    }
    return ""
}

export const getJsonObjLocalStorage = (key) => {
    if (typeof window !== "undefined") {
        const obj = localStorage.getItem(key)
        return obj && obj !== "undefined" ? JSON.parse(obj) : false
    }
    return ""
}

export const setItemLocalStorage = (key, value) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(key, value)
    }
}

export const removeItemLocalStorage = (key) => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(key)
    }
}

export const clearLocalStorage = () => {
    if (typeof window !== "undefined") {
        localStorage.clear()
    }
}

// Session Storage
export const getItemSessionStorage = (key) => {
    if (typeof window !== "undefined") {
        const item = sessionStorage.getItem(key)
        return item
    }
    return ""
}

export const setItemSessionStorage = (key, value) => {
    if (typeof window !== "undefined") {
        sessionStorage.setItem(key, value)
    }
}

export const removeItemSessionStorage = (key) => {
    if (typeof window !== "undefined") {
        sessionStorage.removeItem(key)
    }
}



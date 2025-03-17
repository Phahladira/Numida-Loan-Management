export const VITE_API_URL="http://127.0.0.1:2024"


export const DATE_REGEX = /^(?:(?:\d{4}[-\/.]\d{2}[-\/.]\d{2})|(?:\d{2}[-\/.]\d{2}[-\/.]\d{4})|(?:\d{2}[-\/.]\d{2}[-\/.]\d{4})|(?:\d{4}[-\/.]\d{2}[-\/.]\d{2}))$/;

export enum LOAN_CATEGORY_ENUM {
    ON_TIME = 'On Time',
    LATE = 'Late',
    DEFAULTED = 'Defaulted',
    UNPAID = 'Unpaid'
}

export enum LOAN_CATEGORY_COLORS {
    RED = 'red',
    GREY = 'grey',
    GREEN = 'green',
    ORANGE = 'orange',
}
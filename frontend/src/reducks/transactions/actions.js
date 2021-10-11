export const FETCH_TRANSACTIONS = "FETCH_TRANSACTIONS";
export const fetchTransactionsAction = (transactions) => {
    return {
        type: FETCH_TRANSACTIONS,
        payload: { transactions }
    }
}

export const ADD_TRANSACTION = "ADD_TRANSACTION";
export const addTransactionAction = () => {
    return {
        type: ADD_TRANSACTION,
    }
}

export const UPDATE_TRANSACTION = "UPDATE_TRANSACTION";
export const updateTransactionAction = () => {
    return {
        type: UPDATE_TRANSACTION,
    }
}

export const DELETE_TRANSACTION = "DELETE_TRANSACTION";
export const deleteTransactionAction = () => {
    return {
        type: DELETE_TRANSACTION,
    }
}

export const ERRORS_TRANSACTION = "ERRORS_TRANSACTION";
export const errorTransactionAction = (errors) => {
    return {
        type: ERRORS_TRANSACTION,
        payload: { errors }
    }
}

export const FETCH_REPORT_TRANSACTIONS = "FETCH_REPORT_TRANSACTIONS";
export const fetchReportTransactionsAction = (reports) => {
    return {
        type: FETCH_REPORT_TRANSACTIONS,
        payload: { reports }
    }
}
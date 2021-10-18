import { createSelector } from "reselect";

const transactionsSelector = (state) => state.transactions;
export const getTransactions = createSelector(
    [transactionsSelector],
    state => state
);

export const getExpenseReport = createSelector(
    [transactionsSelector],
    state => state.expenseReports
);
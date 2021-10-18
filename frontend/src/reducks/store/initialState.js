const initialState = {
    user: {
        errors: {
            email: null,
            password: null
        }
    },
    categories: {
        results: [],
    },
    transactions: {
        results: [],
        count: 0,
        current: 0,
        total_pages: 0,
        next: null,
        previous: null,
        errors: {
            date: null,
            category: null,
            name: null,
            type: null,
            amount: null,
        },
        reports: [],
        expenseReports: []
    }
}

export default initialState;

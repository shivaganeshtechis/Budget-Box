const initialState = {
    user: {
        errors: {
            email: null,
            password: null
        }
    },
    transactions: {
        results: [],
        count: 0,
        current: 0,
        total_pages: 0,
        next: null,
        previous: null,
        errors: {
            name: null,
            amount: null,
        },
        reports: []
    }
}

export default initialState;

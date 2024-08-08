const ApiService = {
    getListing() {
        const url = `http://localhost:8081/api/v1/request/getAccessRequestListings`;
        return fetch(url, { method: 'GET' })
            .then((res) => res.json())
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error('Error fetching systems:', error);
                return { companyNames: [], companyDisplayNames: [] };
            });
    },

};

export default ApiService;

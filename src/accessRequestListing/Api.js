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

    reject(id, reviewRemarks) {
        const url = `http://localhost:8081/api/v1/request/approve`;
    
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' //is this needed???
            },
            body: JSON.stringify({ id, action: 'REJECT', reviewRemarks })
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            const displayNames = Object.values(data);
            return { displayNames };
        })
        .catch((error) => {
            console.error('Error rejecting request:', error);
            return [];
        });
    }
};

export default ApiService;

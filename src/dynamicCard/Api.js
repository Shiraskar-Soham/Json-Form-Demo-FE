const ApiService = {
    getListing() {
        const url = 'http://localhost:8081/api/v1/request/getJsonListings';
        return fetch(url, { method: 'GET' })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                return [];
            });
    }
};

export default ApiService;
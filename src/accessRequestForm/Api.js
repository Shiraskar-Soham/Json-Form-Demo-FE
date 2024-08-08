const ApiService = {
    getCompany() {
        const url = `http://localhost:8081/api/v1/json/company`;
        return fetch(url, { method: 'GET' })
            .then((res) => res.json())
            .then((data) => {
                const companyNames = Object.keys(data);
                const companyDisplayNames = Object.values(data);
                return { companyNames, companyDisplayNames };
            })
            .catch((error) => {
                console.error('Error fetching systems:', error);
                return { companyNames: [], companyDisplayNames: [] };
            });
    },
    getManager() {
        const url = `http://localhost:8081/api/v1/json/manager`;
        return fetch(url, { method: 'GET' })
            .then((res) => res.json())
            .then((data) => {
                const managerDisplayNames = Object.values(data);
                return { managerDisplayNames };
            })
            .catch((error) => {
                console.error('Error fetching systems:', error);
                return { managerNames: [], managerDisplayNames: [] };
            });
    },
    getModules(company_name, system_name) {
        const url = new URL(`http://localhost:8081/api/v1/json/modules`);
        url.search = new URLSearchParams({ company_name, system_name }).toString();

        return fetch(url, { method: 'GET' })
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
                console.error('Error fetching modules:', error);
                return [];
            });
    },
    getSystems(company_name) {
        const url = new URL(`http://localhost:8081/api/v1/json/systems`);
        url.search = new URLSearchParams({ company_name }).toString();

        return fetch(url, { method: 'GET' })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                return Array.from(Object.entries(data)).map(([enumName, displayName]) => ({ enumName, displayName }));
            })
            .catch((error) => {
                console.error('Error fetching systems:', error);
                return [];
            });
    },
    submitForm(data) {
        const url = new URL(`http://localhost:8081/api/v1/request/submit`);
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((res) => {
            if (!res.ok) {
                return res.json().then((errorData) => {
                    throw new Error(errorData.message);
                });
            }
            return res.json();
        })
        .then((responseData) => {
            return responseData;
        })
        .catch((error) => {
            console.error('Error submitting form:', error);
            throw error;
        });
    }

};

export default ApiService;

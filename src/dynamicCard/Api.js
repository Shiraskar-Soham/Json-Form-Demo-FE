const ApiService = {
  getListing(listingStatus) {
    let url = `http://localhost:8081/api/v1/request/getJsonListings`;
    if (listingStatus !== "ALL") {
      url = url + `?listingStatus=${encodeURIComponent(listingStatus)}`;
    }
    return fetch(url, { method: "GET" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return [];
      });
  },

  reject(id, reviewRemarks) {
    const url = `http://localhost:8081/api/v1/request/status?id=${id}&action=REJECTED&remarks=${encodeURIComponent(reviewRemarks)}`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
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
        console.error("Error rejecting request:", error);
        return [];
      });
  },

  approve(id, reviewRemarks) {
    const url = `http://localhost:8081/api/v1/request/status?id=${id}&action=APPROVED&remarks=${encodeURIComponent(reviewRemarks)}`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
        console.error("Error rejecting request:", error);
        return [];
      });
  },

  towerApproval(id, status, reviewRemarks) {
    const url = `http://localhost:8081/api/v1/request/complete?id=${id}&approval=${status}&remarks=${encodeURIComponent(reviewRemarks)}`;

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
        console.error("Error rejecting request:", error);
        return [];
      });
  },
};

export default ApiService;

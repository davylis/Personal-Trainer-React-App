export function fetchCustomers() {
    return fetch(import.meta.env.VITE_API_URL + "customers")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error in fetch: " + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Fetched customer data:", data);
            return data; 
        });
}


export function deleteCustomer(url) {
    return fetch(url, { method: 'DELETE' })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in fetch: " + response.statusText);

            return response.json();
        });
}
export function saveCustomer(newCustomer) {
    return fetch(import.meta.env.VITE_API_URL + "customers", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newCustomer)
    })
    .then(response => {
        if (!response.ok)
            throw new Error("Error in saving: " + response.statusText);

        return response.json();
    });
}
export function updateCustomer(url, updateCustomer) {
    return fetch(url, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(updateCustomer)
    })
    .then(response => {
        if (!response.ok)
            throw new Error("Error in update: " + response.statusText);

        return response.json();
    });
}
export function fetchTrainings() {
    return fetch(import.meta.env.VITE_API_URL + "gettrainings")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error in fecth: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response:", data); // Log the parsed data
            return data; // Return the parsed data for further use
        })
        .catch(error => {
            console.error("Fetch error:", error);
            throw error; // Re-throw error to handle it upstream
        });
}
export function fetchOneCustomer(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch customer');
            }
            return response.json();
        });
}
export function saveTraining(newTraining) {
    return fetch(import.meta.env.VITE_API_URL + "trainings", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newTraining)
    })
.then(async (response) => {
    if (!response.ok) {
        throw new Error("Error in save: " + response.statusText);
    }
    return response.json();
    });
}
export function deleteTraining(url) {
    return fetch(url, { method: 'DELETE' })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in fetch: " + response.statusText);

            return response.json();
        });
};
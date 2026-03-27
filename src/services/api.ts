const BASE_URL= "https://free-api-football-data.p.rapidapi.com";
const API_KEY="21fd45b4cemsh1e2102fc165c082p1997fdjsn52463ebc1c87";

export const apiHelper = {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "free-api-live-football-data.p.rapidapi.com"
};

export const fetchApi = async (endpoint: string) => {
    try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'GET',
        headers: apiHelper
    });

    if (!response.ok) {
        throw new Error(`Error fetching API: ${response.status}`);
    }

        const data = await response.json();
        return data;
} catch (error) {
    console.error('Error fetching API:', error);
    throw error;
}
};
//# https://rapidapi.com/Creativesdev/api/free-api-live-football-data/playground/apiendpoint_65078b41-9d2e-45bc-ad61-0216ba285ff2


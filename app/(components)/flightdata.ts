import * as fs from 'fs.d.ts';
import * as https from 'https';

interface AirportData {
    code: string;
    city: string;
    latitude: string;
    longitude: string;
}

// Function to get airport details including city, latitude, and longitude
export function getAirportDetails(airportCode: string, csvFile: string = './app/(components)/airports.csv'): [number, number, string] | [null, null, null] {
    const fileData = fs.readFileSync(csvFile, { encoding: 'utf-8' });
    const rows = fileData.split('\n');

    for (let row of rows.slice(1)) { // Skip header
        const columns = row.split(',');
        const airportData: AirportData = {
            code: columns[0], // 1st column: Airport Code
            city: columns[10], // 11th column: City Name
            latitude: columns[3], // 4th column: Latitude
            longitude: columns[4] // 5th column: Longitude
        };

        if (airportData.code === airportCode) {
            return [parseFloat(airportData.latitude), parseFloat(airportData.longitude), airportData.city];
        }
    }

    return [null, null, null]; // Return nulls if not found
}

// Function to get flight data based on the flight number and get the destination airport
export function getFlightData(flightNumber: string, callback: (latitude: number, longitude: number, city: string) => void): void {
    const url = `https://api.aviationstack.com/v1/flights?access_key=7427ea5c1f47aa05f1b2b3364af6a669&flight_number=${flightNumber}&airline_iata=AA&limit=1`;

    https.get(url, (response) => {
        let data = '';
        response.on('data', chunk => {
            data += chunk;
        });

        response.on('end', () => {
            const jsonData = JSON.parse(data);
            if (jsonData.data && jsonData.data.length > 0) {
                const destinationIata = jsonData.data[0].arrival.iata; // Get destination airport code
                console.log(`The destination airport code is: ${destinationIata}`);

                // Fetch latitude, longitude, and city based on the airport code
                const [latitude, longitude, city] = getAirportDetails(destinationIata);
                if (latitude !== null && longitude !== null && city !== null) {
                    console.log(`The coordinates for ${destinationIata} (${city}) are:\nLatitude: ${latitude}\nLongitude: ${longitude}`);
                    callback(latitude, longitude, city);
                } else {
                    console.log(`Airport code ${destinationIata} not found in the file.`);
                }
            } else {
                console.log('No flight data found for the given flight number.');
            }
        });
    }).on('error', (error) => {
        console.log(`Error: Unable to retrieve flight data. ${error.message}`);
    });
}

// Function to get weather data and include city information
export function getWeatherData(latitude: number, longitude: number, destinationCity: string): void {
    const urlWeather = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=8bc6bfd0c1067077b46bc47e27216eeb&units=imperial`;

    https.get(urlWeather, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            const jsonData = JSON.parse(data);

            // Extracting temperatures at noon
            const temperaturesAtNoon: number[] = jsonData.list
                .filter((entry: { dt_txt: string }) => entry.dt_txt.includes('12:00:00')) // Noon
                .map((entry: { main: { temp: number } }) => entry.main.temp);

            console.log(`Temperatures at noon for ${destinationCity}: ${temperaturesAtNoon}`);

            // Categorizing outfits
            const outfits = temperaturesAtNoon.map((temp: number) => (temp > 65 ? 'Hot' : 'Cold'));

            console.log(`Outfit suggestions for ${destinationCity}: ${outfits}`);
        });
    }).on('error', (error) => {
        console.log(`Error: Unable to retrieve weather data. ${error.message}`);
    });
}

// Main Program
const flightNumber = '3215'; // Replace with actual flight number input

getFlightData(flightNumber, (latitude, longitude, destinationCity) => {
    if (latitude !== 0 && longitude !== 0 && destinationCity !== '') {
        getWeatherData(latitude, longitude, destinationCity);
    } else {
        console.log("No valid destination data available.");
    }
});
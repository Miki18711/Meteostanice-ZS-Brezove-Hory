const apiKey = '0f95fd0f58a2451a95fd0f58a2a51a75'; 
const stationId = 'IPBRAM43'; 

async function fetchWeatherData() {
    const response = await fetch(`https://api.weather.com/v3/wx/conditions/current?apiKey=${apiKey}&language=cs&format=json&stationId=${stationId}`);
    if (!response.ok) {
        throw new Error('Nebylo možné získat data o počasí');
    }
    return response.json();
}

function convertWindSpeed(speed, unit) {
    switch (unit) {
        case 'metric':
            return speed; // m/s
        case 'imperial':
            return speed * 2.237; // m/s na mph
        case 'kmh':
            return speed * 3.6; // m/s na km/h
        default:
            return speed;
    }
}

function convertWindDirection(degrees, format) {
    if (format === 'degrees') {
        return `${degrees}°`;
    } else if (format === 'compass') {
        const directions = [
            'Sever', 'Severovýchod', 'Východ', 'Jihovýchod',
            'Jih', 'Jihozápad', 'Západ', 'Severozápad'
        ];
        const index = Math.round((degrees % 360) / 45) % 8;
        return directions[index];
    }
    return `${degrees}°`;
}

function updateWeatherData(data) {
    const tempUnit = document.getElementById('tempSelect').value;
    const windUnit = document.getElementById('windSelect').value;
    const windDirFormat = document.getElementById('windDirSelect').value;
    const pressureUnit = document.getElementById('pressureSelect').value;
    const rainUnit = document.getElementById('rainSelect').value;

    document.getElementById('temperature').textContent = tempUnit === 'metric' 
        ? `${data.temperature} °C` 
        : `${(data.temperature * 9/5) + 32} °F`; // Převod teploty na °F

    document.getElementById('humidity').textContent = `${data.humidity} %`;

    const convertedWindSpeed = convertWindSpeed(data.windSpeed, windUnit);
    document.getElementById('windSpeed').textContent = windUnit === 'kmh'
        ? `${convertedWindSpeed.toFixed(2)} km/h`
        : `${convertedWindSpeed.toFixed(2)} ${windUnit === 'metric' ? 'm/s' : 'mph'}`;

    document.getElementById('windDirection').textContent = convertWindDirection(data.windDirection, windDirFormat);

    document.getElementById('windSpeedMetric').classList.toggle('active', windUnit === 'metric');
    document.getElementById('windSpeedImperial').classList.toggle('active', windUnit === 'imperial');
    document.getElementById('windSpeedKmh').classList.toggle('active', windUnit === 'kmh');
    document.getElementById('windDirectionDegrees').classList.toggle('active', windDirFormat === 'degrees');
    document.getElementById('windDirectionCompass').classList.toggle('active', windDirFormat === 'compass');
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await fetchWeatherData();
        updateWeatherData(data);

        document.getElementById('tempSelect').addEventListener('change', async () => {
            const data = await fetchWeatherData();
            updateWeatherData(data);
        });
        document.getElementById('windSelect').addEventListener('change', async () => {
            const data = await fetchWeatherData();
            updateWeatherData(data);
        });
        document.getElementById('windDirSelect').addEventListener('change', async () => {
            const data = await fetchWeatherData();
            updateWeatherData(data);
        });
        document.getElementById('pressureSelect').addEventListener('change', async () => {
            const data = await fetchWeatherData();
            updateWeatherData(data);
        });
        document.getElementById('rainSelect').addEventListener('change', async () => {
            const data = await fetchWeatherData();
            updateWeatherData(data);
        });
    } catch (error) {
        console.error('Chyba při načítání dat:', error);
    }
});

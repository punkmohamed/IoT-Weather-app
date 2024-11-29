
# Weather App with IoT Sensor Simulation

This is a weather site application that allows users to view the current weather, forecasts, and past weather data based on a city from anywhere around the world. The app simulates weather data using IoT sensors to provide both real and simulated weather information. The app also features real-time sensor data updates.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Setup Instructions](#setup-instructions)
3. [IoT Sensor Simulation and API Integration](#iot-sensor-simulation-and-api-integration)
4. [Usage](#usage)
5. [Deployment Instructions](#deployment-instructions)
6. [Technologies Used](#technologies-used)

## Project Overview

The Weather App allows users to:

- **View current weather** for any city around the world.
- **Access weather forecasts** for the upcoming days.
- **View past weather data** (if available in the database).
- **Simulate IoT sensor data**, including temperature, humidity, pressure, and wind speed/direction.
- **Real-time updates** via socket.io for IoT sensor data.

The app uses data from the OpenWeather API and combines it with simulated sensor data to provide users with both accurate and simulated weather conditions.

## Setup Instructions

To run the project locally, follow these steps:

### Backend

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the `backend` folder:
   ```
   cd backend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Run the backend server:
   ```
   nodemon index.js
   ```

### Frontend

1. Navigate to the `frontend` folder:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the frontend application:
   ```
   npm run dev
   ```

## IoT Sensor Simulation and API Integration

The backend simulates weather sensor data (temperature, humidity, pressure, wind speed, and direction) based on the study of how sensors work. The following approach is used:

- A function generates random weather data within specified ranges (e.g., temperature between -10°C and 40°C) using the **Faker** library.
- The backend integrates the **OpenWeather API** to fetch real weather data and combines it with the simulated sensor data.
- The user receives a blend of real and simulated data for comparison and analysis.

## Usage

When the user opens the app, they will see the weather dashboard with the following features:

1. **Filters**: The user can filter the data by country and city, and search for specific locations.
2. **Weather Data**:
   - **Current Weather** on the left side of the dashboard.
   - **Hourly Forecast** and **Daily Forecast** data.
   - **Past Weather** data (if available in the database).
3. **Visualization**:
   - **Temperature, Humidity, and Wind Speed** data displayed for morning, afternoon, and evening.
   - **Charts** to show the 5-day forecast and daily temperature variations (line charts).
4. **Weather Alerts**: If specific weather conditions are detected, the app triggers weather alerts.
5. **Sensor Data**: A button allows users to switch to simulated sensor data, displayed in real-time using **Socket.io**.

## Deployment Instructions

1. **Frontend**:
   - Upload the code to GitHub.
   - Deploy the frontend to **Vercel**.
2. **Backend**:
   - The backend should be deployed on **Railway** (since Vercel does not support WebSockets).
   - In the frontend, link the backend API and Socket.io server URLs for data communication.

## Technologies Used

### Frontend

- **React**: Used for building the Single Page Application (SPA).
- **Tailwind CSS** & **ShadCN**: For styling the app and ensuring responsiveness.
- **Axios**: For making RESTful requests to fetch weather data.
- **React-Chart**: For visualizing weather data in charts.
- **Lucide-React**: For icons used throughout the app.
- **Socket.io**: For real-time sensor data updates.

### Backend

- **Node.js** & **Express.js**: For building the backend services and handling API requests.
- **CORS**: For handling cross-origin requests securely.
- **Mongoose**: For interacting with the MongoDB database.
- **Node-cache**: For caching data and improving performance.
- **Faker**: For generating random sensor data.
- **Socket.io**: For real-time data communication.


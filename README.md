# environmental_data_monitoring


### This web application is designed to meet all of the club task, to provide a usable web application for environmental monitoring.

---

The Environmental Data Monitoring System is a web application that allows users to monitor real-time environmental data. The application supports user interaction, data visualization, and efficient data handling. The project is built using the MERN (MongoDB, Express.js, React, Node.js) stack and features a user-friendly interface with robust backend support to ensure smooth and accurate data management.

The deployed appliction can be found from aws ec2: <br/>
https://ec2-34-230-50-244.compute-1.amazonaws.com/

---

#### Languages used: &ensp; JavaScript, HTML, CSS
#### Libraries used: &ensp; React.js, Express.js, Socket.IO, Moment.js
#### Database used: &ensp; MongoDB (local machine)

---

## Web Page Layout

#### Login Page
![login_page](https://github.com/Crepopcorn/environmental_data_monitoring/blob/main/images/env1.jpg)

#### Data Visualization Page
![data_page](https://github.com/Crepopcorn/environmental_data_monitoring/blob/main/images/env2.jpg)

![data2_page](https://github.com/Crepopcorn/environmental_data_monitoring/blob/main/images/env3.jpg)
## Features

#### User Management:
- Register: New user signup.
- Login: Secure login for accessing data.
- Logout: Safely log out of the application.

#### Environmental Data Monitoring:
- Real-time Data: Display and update environmental data in real-time.
- Data Visualization: Interactive charts and graphs for better data analysis.
- Data Logs: View historical environmental data logs.

#### Interactive UI:
- Responsive Design: User-friendly interface compatible with various devices.
- Dynamic Components: Real-time data updates using React and Socket.IO.

#### Security Features:
- CORS: Cross-Origin Resource Sharing is configured for secure data requests.
- Validation: Input validation to prevent invalid data entries.
- Authentication: Secure authentication for user access.

## Getting Started

Follow these steps to set up the project on your computer if you want to run it locally for development and testing:

#### Prerequisites
- Node.js and npm installed.
- MongoDB installed locally on your machine.
- MongoDB Compass (optional) for managing your local database.

#### Installation
##### 1) Clone the Repository:

```bash
git clone https://github.com/Crepopcorn/environmental_data_monitoring.git
```

##### 2) Navigate to the project directory:

```bash
cd environmental_data_monitoring
```

##### 3) Install Dependencies:

```bash
npm install
cd client
npm install
```

##### 4) Set Up Environment Variables:

Create a `.env` file in the root directory with the following variables:

```
MONGO_URI=mongodb://localhost:27017/your-database-name
PORT=4000
```

> **Note:** Replace `your-database-name` with the name of the MongoDB database you want to use (e.g., `environmental_data`).

##### 5) Start the MongoDB Server:

Open a terminal and run:

```bash
mongod
```

##### 6) Create the MongoDB Database:

If you haven't already created the database, open another terminal, run the MongoDB shell using:

```bash
mongo
```

Then, execute the following commands to create the database and collection:

```javascript
use your-database-name  // Replace with your chosen database name
db.createCollection('environmental_data')  // Replace with your collection name if needed
```

##### 7) Run the Application:

Go back to the root directory and run:

```bash
npm start
```

Navigate to `http://localhost:3000` in your browser to access the application.

## Usage

- Register: Create an account to start monitoring data.
- Login: Access real-time environmental data after logging in.
- View Data: Monitor current and historical data trends on the dashboard.

## File and Directory Structure

- `server.js`: Main server file.
- `client/`: Contains the React frontend code.
- `routes/`: Backend API routes for handling data and user requests.
- `models/`: Mongoose schemas for database management.
- `public/`: Static files for the frontend.
- `.env`: Environment variables for configuration.

## Acknowledgments
- React for frontend development.
- Express.js for server-side logic.
- MongoDB for local database management.
- Socket.IO for real-time data communication.

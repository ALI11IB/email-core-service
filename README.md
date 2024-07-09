# Email Core Service Project

## Overview

This project is divided into two main sections: the backend and the frontend. The backend is a Node.js server, and the frontend is a React app with Material-UI. The goal of the project is to create a generic email provider service that integrates with Elasticsearch and RabbitMQ, using Outlook for email synchronization and real-time notifications.

## Backend

The backend of the application is built using Node.js and follows the factory design pattern to create a generic email provider. This design pattern allows for the easy addition of new email providers in the future.

### Key Features

- **Generic Email Provider**: Implemented using the factory design pattern.
- **Elasticsearch**: Used as a service for creating indices and checking if data exists before performing operations.
- **RabbitMQ**: Installed with Docker and used for handling message queues.
- **Outlook Authorization**: The application authorizes with Outlook and starts syncing emails. A redirect URL is returned to the frontend for the sync process.

### Challenges and Solutions

- **Elasticsearch**: Due to difficulties installing Elasticsearch with Docker on Windows, Elasticsearch as a service was used instead,so if didnt work when run docker compose file just comment the elastic search service and download manualy.
- **Outlook Subscribe new emails API**: The API does not work with HTTP, and there was not enough time to build for production and fully test this feature.

## Frontend

The frontend is a basic React app built with Material-UI. It consists of three main pages:

1. **Authorization Page**: The user chooses their email provider, Calls an API to authorize with Outlook. If the authorization is successful, the user is redirected to the email page.
2. **Email Page**: Displays the user's email providers and emails with details.

### Real-time Notifications

- The application uses the subscription API from the Outlook Graph API to receive real-time notifications for new emails.
- When a new email is received, a notification is sent to the `auth/webhook` API.
- The new email is then fetched and sent via Socket.IO to the frontend.

### How to Run

1. **Using Docker Compose**:

   - Use the provided `docker-compose.yml` file to start all necessary services and the application.
   - backend contains a docker file to run the nessary instructions and wait for other services to run.
   - frontend contains a docker file to run the nessary instructions and after build is exposed using aN Nginx proxy server.

2. **Manually**:

   - Start an Elasticsearch instance.
   - Start a RabbitMQ instance.
   - Navigate to the backend directory and run `npm start`.
   - Navigate to the frontend directory and run `npm start`.

## Conclusion

This project demonstrates the integration of various technologies to create a robust email service application. While there were challenges, alternative solutions were implemented to ensure the application's functionality.
The project is all tested for Outlook provider, implemented some code for a Gmail provider but not tested.

Feel free to explore the code and run the application using the instructions provided above..

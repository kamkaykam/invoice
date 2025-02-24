# ICUnet E-Rechnungsassistent

## Overview
ICUnet E-Rechnungsassistent is a Node.js-based backend for processing and validating electronic invoices in XML format. It uses SQLite for local data storage and includes PDF generation and authentication features.

## Prerequisites
Ensure you have the following installed:
- Node.js (v16 or higher)
- npm (Node Package Manager)
- SQLite (for database operations)

## Installation

1. **Clone the Repository**
   ```sh
   git clone <repository-url>
   cd ICUnet-E-Rechnungsassistent/backend
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Set Up Environment Variables**
   - Create a `.env` file in the `backend` folder.
   - Add necessary environment variables:
     ```ini
     PORT=3000
     JWT_SECRET=your_secret_key
     DATABASE_URL=sqlite:./data/invoices.db
     ```

## Running the Application

1. **Start the Backend Server**
   ```sh
   npm start
   ```
   The server will run on `http://localhost:3000` by default.

## API Endpoints

- **User Authentication**
  - `POST /api/user/login` → Logs in a user
  - `POST /api/user/register` → Registers a new user

- **Invoice Processing**
  - `POST /api/invoices/upload` → Uploads an XML invoice
  - `GET /api/invoices` → Retrieves stored invoices

- **Validation Services**
  - `POST /api/validate/xml` → Validates an XML invoice against XSD schema

## Deployment
To deploy this project on a server:

1. **Use a process manager like PM2:**
   ```sh
   npm install -g pm2
   pm2 start app.js --name "e-rechnung"
   ```

2. **Set up a reverse proxy with Nginx (optional):**
   - Configure Nginx to forward requests to the Node.js backend.

3. **Enable HTTPS (optional, recommended)**
   - Use Let's Encrypt or a similar SSL provider for security.

## Additional Notes
- Ensure the SQLite database (`invoices.db`) has the necessary schema before deployment.
- If using Docker, create a `Dockerfile` and define the containerized environment.

## License
MIT License


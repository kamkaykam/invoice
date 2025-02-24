# ICUnet E-Rechnungsassistent

## Overview
ICUnet E-Rechnungsassistent is a full-stack application with a **Node.js** backend and a **React.js** frontend for processing and validating electronic invoices in XML format. It uses **SQLite** for local data storage and includes PDF generation and authentication features.

## Prerequisites
Ensure you have the following installed:
- Node.js (v16 or higher)
- npm (Node Package Manager)
- SQLite (for database operations)

## Backend Installation

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

4. **Ensure Database Schema is Up-to-Date**
   - Run any required migrations or database initialization scripts.
   
5. **Start the Backend Server**
   ```sh
   npm start
   ```
   The server will run on `http://localhost:3000` by default.

## Frontend Installation

1. **Navigate to the Frontend Directory**
   ```sh
   cd ../frontend
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Set Up Proxy (for Local Development)**
   - Add the following to `frontend/package.json` to prevent CORS issues:
     ```json
     "proxy": "http://localhost:3000"
     ```

4. **Start the Frontend**
   ```sh
   npm start
   ```
   The application will run on `http://localhost:3001` (or the next available port).

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

### Backend Deployment

1. **Ensure `package.json` contains the correct start script:**
   ```json
   "scripts": {
     "start": "node --max-old-space-size=4096 app.js"
   }
   ```

2. **Use a process manager like PM2:**
   ```sh
   npm install -g pm2
   pm2 start app.js --name "e-rechnung"
   ```

3. **Set up a reverse proxy with Nginx (optional):**
   - Configure Nginx to forward requests to the Node.js backend.

4. **Enable HTTPS (optional, recommended)**
   - Use Let's Encrypt or a similar SSL provider for security.

### Frontend Deployment

1. **Build the Frontend for Production**
   ```sh
   npm run build
   ```

2. **Deploy the `build/` Folder**
   - You can serve it using **Nginx**, **Apache**, or **Vercel/Netlify**.
   - If hosting on the same server as the backend, use `serve`:
     ```sh
     npm install -g serve
     serve -s build -l 3001
     ```

3. **Update API URLs in `src/services/api.js` for Production**
   - Replace `http://localhost:3000` with the live backend URL.

## Additional Notes
- Ensure the SQLite database (`invoices.db`) has the necessary schema before deployment.
- If using Docker, create a `Dockerfile` and define the containerized environment.
- Ensure security measures are in place, including environment variable protection and secure API handling.

## License
MIT License


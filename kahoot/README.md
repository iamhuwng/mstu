# Interactive Learning Environment (Kahoot-Style)

This is a real-time, interactive learning application designed for students and teachers, modeled after popular quiz platforms like Kahoot. The goal is to create an engaging and fun learning environment that supports complex question formats found in standardized tests like the IELTS.

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [npm](https://www.npmjs.com/)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd kahoot
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file in the root of the project and add your Firebase credentials:
    ```
    VITE_FIREBASE_API_KEY=your-api-key
    VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
    VITE_FIREBASE_DATABASE_URL=your-database-url
    VITE_FIREBASE_PROJECT_ID=your-project-id
    VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    VITE_FIREBASE_APP_ID=your-app-id
    VITE_ADMIN_USERNAME=admin
    VITE_ADMIN_PASSWORD=admin
    ```

## Running the Application

To start the development server, run the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

*   `src/`: Contains the main source code for the application.
    *   `components/`: Reusable React components.
    *   `hooks/`: Custom React hooks.
    *   `pages/`: The main pages of the application.
    *   `services/`: Firebase configuration and other services.
    *   `utils/`: Utility functions.
*   `documentation/`: Contains all the project documentation, including the PRD, task list, and SOPs.
*   `tests/`: Contains the Playwright E2E tests.

## Documentation

For more detailed information about the project, please see the [documentation/README.md](documentation/README.md) file.

## Contributing

Contributions are welcome! Please open an issue to discuss any proposed changes before submitting a pull request.
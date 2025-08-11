# Nebula API

Nebula API is the backend service for an online learning platform. It provides a robust set of features for administrators, tutors, and students, including course management, user authentication, payment processing, and progress tracking.

## ✨ Features

- **Role-Based Access Control:** Distinct roles and permissions for Admins, Tutors, and Users.
- **Authentication:** Secure user authentication using JWT and session management.
- **Course Management:** Create, update, and manage courses, chapters, videos, and exercises.
- **User Management:** Admins can manage all users on the platform.
- **Payment Integration:** Secure payment processing with Stripe.
- **Progress Tracking:** Users can track their progress through courses.
- **File & Image Uploads:** Efficiently handles file uploads to the cloud using Cloudinary.
- **Email Notifications:** Sends email notifications for various events using Nodemailer.
- **Reporting:** Generates reports for admins and tutors in PDF and Excel formats.
- **Real-time Communication:** Utilizes Socket.IO for real-time features (e.g., messaging).

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **File Storage:** Cloudinary for cloud-based image and video storage.
- **Payment Gateway:** Stripe
- **Email Service:** Nodemailer
- **API Specification:** REST
- **Real-time:** Socket.IO
- **File Handling:** Multer, Sharp for image processing
- **Report Generation:** Puppeteer (for PDFs), EJS, excel4node
- **Deployment:** PM2 (Process Manager)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20.x or later)
- [npm](https://npm.io/) (or your preferred package manager)
- [MongoDB](https://www.mongodb.com/try/download/community) instance (local or cloud)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory by copying the template:
    ```bash
    cp .env.template .env
    ```
    Then, fill in the required values in the `.env` file. See the [Environment Variables](#-environment-variables) section for more details.

### Usage

-   **Development Mode:**
    This command compiles the TypeScript code and starts the server with `nodemon`, which will automatically restart on file changes.
    ```bash
    npm run dev
    ```

-   **Production Mode:**
    This command compiles the TypeScript code and starts the server using the compiled JavaScript files.
    ```bash
    npm run start
    ```
    For managing the application in a production environment, you can use PM2:
    ```bash
    npm run prod
    ```

-   **Build:**
    To only compile the TypeScript code, run:
    ```bash
    npm run build
    ```

## ⚙️ Configuration

### Environment Variables

All sensitive and environment-specific configurations are managed through a `.env` file.

| Variable              | Description                                            |
| --------------------- | ------------------------------------------------------ |
| `NODE_ENV`            | The application environment (e.g., `development`).     |
| `CLIENT_BASE_URL`     | The base URL of the frontend client application.       |
| `SESSION_SECRET`      | A secret key for signing the session ID cookie.        |
| `MONGO_URL`           | The connection string for your MongoDB instance.       |
| `CLOUDINARY_NAME`     | Your Cloudinary cloud name.                            |
| `CLOUDINARY_KEY`      | Your Cloudinary API key.                               |
| `CLOUDINARY_SECRET`   | Your Cloudinary API secret.                            |
| `GMAIL`               | The Gmail address used for sending emails.             |
| `GMAIL_PASS`          | The app password for the Gmail account.                |
| `STRIPE_KEY`          | Your Stripe secret key.                                |
| `STRIPE_WEBHOOK_SECRET`| The secret for verifying Stripe webhook events.        |
| `JWT_SECRET`          | A secret key for signing JWTs.                         |

## 📖 API Documentation

The API routes are defined in the `/routes` directory. The API is segmented by user roles.

-   **`auth.router.ts`**: Handles user registration, login, and logout.
-   **`user.router.ts`**: Contains endpoints for general users, such as browsing courses, purchasing, and managing their profile.
-   **`tutor.router.ts`**: Contains endpoints for tutors to manage their courses, content, and view statistics.
-   **`admin.router.ts`**: Contains endpoints for administrators to manage users, categories, banners, and view platform-wide stats.

## 📁 Folder Structure

The project follows a feature-based architecture, separating concerns for better maintainability and scalability.

```
/
├── config/           # Database connection and other configurations.
├── controllers/      # Request handlers, separated by user role.
├── interfaces/       # TypeScript interfaces for models, services, and repositories.
├── middlewares/      # Custom Express middlewares (e.g., auth, error handling).
├── models/           # Mongoose schemas and models for MongoDB.
├── repositories/     # Data access layer, abstracts database interactions.
├── routes/           # API route definitions.
├── services/         # Business logic layer.
├── templates/        # EJS templates for generating reports.
├── types/            # Custom TypeScript types.
└── utils/            # Reusable utility functions.
```

## 🛠️ Reusable Utilities (`utils/`)

The `/utils` directory contains helper functions that can be reused across the application.

-   **`cropper.ts`**: Contains functions for processing and cropping images using `sharp`.
-   **`error.ts`**: Exports a custom `ErrorHandler` class for consistent error handling.
-   **`mailer.ts`**: A utility for sending emails using `nodemailer`.
-   **`parser.ts`**: Helper functions for parsing data, if any.
-   **`pdf.ts`**: A utility for generating PDF documents from HTML, likely using `puppeteer`.
-   **`reportGenerator.ts`**: A high-level utility that orchestrates the creation of admin and tutor reports, using the `pdf.ts` and `excel4node` utilities.

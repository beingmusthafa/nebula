# Nebula - Online Learning Platform

Nebula is a modern, feature-rich online learning platform designed to provide a seamless and interactive learning experience for students, tutors, and administrators.

## Description

This project is the client-side application for Nebula, built with React and Vite. It features a responsive and intuitive user interface, with distinct functionalities for different user roles. Students can browse and enroll in courses, tutors can create and manage their content, and administrators can oversee the platform's operations.

## Features

- **User Authentication:** Secure sign-in and sign-up for students, tutors, and administrators.
- **Course Management:** Tutors can create, edit, and publish courses, including video lectures and exercises.
- **Interactive Learning:** Students can watch video lectures, complete exercises, and track their progress.
- **Admin Dashboard:** Administrators have access to a comprehensive dashboard to manage users, courses, and platform-wide settings.
- **Payment Integration:** Secure payment processing for course enrollments using Stripe.
- **Real-time Communication:** Chat functionality for user interaction.
- **And much more...**

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Redux Toolkit
- **Styling:** Tailwind CSS
- **Authentication & DB:** Firebase
- **Payment:** Stripe
- **Charts & Data Visualization:** Chart.js, @mui/x-charts
- **Real-time Communication:** Socket.IO Client

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd client
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

## Usage

To run the development server, use the following command:

```bash
npm run dev
```

This will start the application on `http://localhost:5173` by default.

## Configuration

The project uses Vite for bundling and development. Key configuration files include:

- `vite.config.ts`: Vite configuration.
- `tailwind.config.js`: Tailwind CSS configuration.
- `postcss.config.js`: PostCSS configuration.
- `.eslintrc.cjs`: ESLint configuration for code linting.

## Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:

```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend API URL
VITE_API_URL=http://localhost:3000/api

# Stripe Public Key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Folder Structure

```
/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable React components
│   ├── config/          # Firebase configuration
│   ├── data/            # Static data
│   ├── interfaces/      # TypeScript interfaces
│   ├── pages/           # Application pages
│   ├── redux/           # Redux store and slices
│   ├── main.tsx         # Main application entry point
│   └── ...
├── .gitignore           # Git ignore file
├── index.html           # Main HTML file
├── package.json         # Project dependencies and scripts
└── README.md            # This file
```

## Reusable Components

The `src/components` directory contains a variety of reusable components, organized by functionality.

### General Components

- **`Header.tsx`**: The main navigation bar for the application.
- **`Footer.tsx`**: The application's footer.
- **`Loading.tsx`**: A loading spinner displayed during data fetching.
- **`CourseCard.tsx`**: A card component to display course information.

### Admin Components (`src/components/admin`)

- **`AdminLayout.tsx`**: The layout for the admin dashboard, including the sidebar.
- **`BannerTableRow.tsx`**: A table row component for displaying banner information.
- **`CategoryCard.tsx`**: A card component for displaying category information.

### Tutor Components (`src/components/tutor`)

- **`AddChapterForm.tsx`**: A form for adding new chapters to a course.
- **`AddVideoForm.tsx`**: A form for adding new videos to a chapter.
- **`LineChart.tsx`**: A component for displaying data in a line chart.

This is just a brief overview. For more details, please refer to the source code.

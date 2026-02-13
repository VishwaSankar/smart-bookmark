# Copilot Instructions for Smart Bookmark Project

## Project Overview
This project is a **Next.js** application designed for managing bookmarks. It utilizes a modular architecture with components organized in a clear directory structure, promoting reusability and maintainability.

## Key Components
- **Pages**: Located in the `app/` directory, each page corresponds to a route in the application. The main entry point is `app/page.tsx`.
- **Components**: Reusable UI components are stored in `app/components/`. For example, the `AuthForm` component is used for user authentication.
- **Utilities**: Helper functions and utilities are found in `app/utils/`, such as `actions.js` for handling various actions.

## Developer Workflows
- **Starting the Development Server**: Use the command `npm run dev` to start the local development server. This will allow you to view changes in real-time at [http://localhost:3000](http://localhost:3000).
- **Editing Pages**: Modify `app/page.tsx` to change the main page content. The application supports hot reloading, so changes will reflect immediately.

## Project Conventions
- **File Naming**: Use PascalCase for component files (e.g., `AuthForm.jsx`) and camelCase for utility files (e.g., `actions.js`).
- **Styling**: CSS modules are used for styling components, ensuring styles are scoped locally to avoid conflicts.

## Integration Points
- **Authentication**: The application integrates with an authentication service through the `AuthForm` component, which handles user login and registration.
- **Data Management**: Data flows through the application using React's context API, allowing for state management across components without prop drilling.

## External Dependencies
- **Next.js**: The core framework for building the application.
- **React**: The library for building user interfaces.
- **Supabase**: Used for backend services, including authentication and database management.

## Conclusion
These instructions should help AI agents understand the structure and workflows of the Smart Bookmark project, enabling them to assist effectively in development tasks.
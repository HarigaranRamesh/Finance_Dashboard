# Finance Dashboard UI

A visually rich, interactive finance dashboard built to track and understand financial activity.

## Overview
This project is an evaluation of frontend development skills focusing on UI/UX, state management, and component structuring. The application is built using React.js, standard CSS, and local storage for data persistence, eschewing complex backends for a pure frontend focus. 

The dashboard provides users with comprehensive tracking of their finances, including a core set of interactive features.

## Setup Instructions

1. **Prerequisites**: Ensure you have Node.js installed.
2. **Installation**:
   ```bash
   # Navigate to the directory
   cd finance-dashboard
   
   # Install the dependencies
   npm install
   ```
3. **Running the Application**:
   ```bash
   # Start the development server
   npm run dev
   ```
   Open your browser and navigate to the local server URL provided (typically `http://localhost:5173`).

## Key Features

- **Dashboard Overview**: Highly visual cards for tracking Total Balance, Income, and Expenses. It includes beautiful, responsive charts (Line Chart for Balance Trend, Pie Chart for Expenses by Category) utilizing `recharts`.
- **Transactions Management**: Includes a comprehensive list of financial transactions. Users can search by description/category, filter by income/expense, and sort by date or amount (`Newest`, `Oldest`, `Highest`, `Lowest`).
- **Role-Based UI**: Simulate app roles effortlessly. A toggle located in the sidebar lets you switch between `viewer` and `admin`. Admin users get the extended capability to add and delete new transactions, demonstrating conditional rendering based on user roles.
- **Actionable Insights**: An Insights tab that parses your transactions to extract useful metrics, such as the highest spending category, your single largest expense, and the current savings rate.
- **Dark Mode**: Out of the box dark mode support, switchable from the top right navigation bar.
- **Mock API Integration**: Transactions mock a network delay (with `async/await`), providing a realistic loading experience simulating backend requests.
- **Export Functionality**: Easily export your current (filtered and sorted) transactions as a `.CSV` or `.JSON` from the Transactions page.
- **Data Persistence**: Transactions logically sync backwards to save via LocalStorage.

## Tech Stack & Approach

- **Framework**: React.js (Vite)
- **Styling**: Standard CSS (Using modern custom variables to handle themes dynamically, with glassmorphism and subtle animations) 
- **State Management**: React's Context API is used extensively (`FinanceContext`) to handle the global state (Transactions, Theme, Roles). This provides a predictable and scalable way to manage state.
- **Icons & Charts**: `lucide-react` for beautiful SVG icons, `recharts` for highly readable, responsive data visualizations.

## UI/UX Highlights

- **Premium aesthetic** using customized Inter font and soft gradients.
- **Micro-interactions** whenever users hover over cards and buttons.
- Fully **responsive design** gracefully degrades into a mobile-friendly view on smaller screens.
- **Graceful loading arrays** via API loading states.
- **Graceful empty states** where arrays might be empty.

# House of Joy 25' - Frontend Ticketing System

This is the official frontend for the House of Joy 25' event ticketing platform. It provides a seamless, user-friendly interface for attendees to purchase tickets, apply for student discounts, and manage their event access.

The application is built with React, TypeScript, and Vite, and it leverages the Mantine component library for a modern and responsive user interface.

## ✨ Key Features

- **Homepage**: A welcoming landing page introducing the event.
- **Dual Ticket Paths**: Separate, customized flows for purchasing **Non-Student** and **Student** tickets.
- **Student Verification Flow**:
  - Students can apply by filling out a detailed form and uploading a verification document (e.g., Student ID).
  - A persistent "pending" state overlay informs students their application is under review.
  - Students can check their application status (`Approved`, `Rejected`, `Pending`).
- **Secure Payments with Paystack**:
  - Approved students and non-students are redirected to a secure Paystack payment page.
  - A payment status page confirms whether the transaction was successful or failed.
- **Dynamic Ticket Details Page**:
  - After successful payment, users can view a detailed ticket page.
  - Displays attendee information, ticket type, and event details.
  - Dynamically shows student-specific information (Institution, Course, etc.) if applicable.
  - Includes a unique QR code for event check-in.
- **Downloadable Ticket**: Users can download their ticket as a PNG image directly from the ticket details page.
- **Responsive Design**: The entire application is designed to work seamlessly on desktop, tablet, and mobile devices.

## 🚀 Tech Stack

- **Framework**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI Library**: [Mantine](https://mantine.dev/)
- **Routing**: [React Router](https://reactrouter.com/)
- **API Communication**: [Axios](https://axios-http.com/)
- **Notifications**: [Mantine Notifications](https://mantine.dev/x/notifications/)

---

## 🌊 Application Flow Explained

### Non-Student Ticket Flow
This is a straightforward e-commerce flow:
1.  User selects "Non-Student Ticket" from the homepage.
2.  Fills out a simple form with their name, email, and phone number.
3.  Clicks "Proceed to Secure Payment" and is redirected to the Paystack payment portal.
4.  After payment, Paystack redirects the user to the `/payment/status` page.
5.  If successful, the user can click "View Your Ticket" to see their generated ticket on the ticket details page.

### Student Ticket Flow (with Verification)
This flow is more complex and accounts for manual verification by an admin.

1.  **Application**: User selects "Student Ticket", fills out a detailed form including their institution, course, and student ID, and uploads a verification document.
2.  **Pending State**: Upon submission, the user's email is saved to `localStorage` to mark their application as pending. They are immediately shown a full-screen `VerificationPendingOverlay`. This ensures that if they close and reopen the tab, they will see the pending screen instead of the application form.
3.  **Status Check**: The user can click "Check Status" on the overlay. The frontend sends a request to the `/api/student-tickets/status` endpoint.
    -   **If Approved**: A success notification is shown. The overlay remains visible while the user is immediately redirected to the Paystack payment URL that was returned from the API. The `localStorage` key is cleared.
    -   **If Rejected**: A rejection notification is shown. After a 3-second delay, the overlay is hidden, the `localStorage` key is cleared, and the user is redirected to the homepage.
    -   **If Still Pending**: An "under review" notification is shown, and the user remains on the pending overlay.
4.  **Payment & Ticket**: Once approved and paid, the flow merges with the non-student flow at the `/payment/status` page.

---

## ⚠️ Common Pitfalls & Debugging Guide

This section documents non-obvious issues that were encountered and resolved. Understanding these is crucial for future development and debugging.

### 1. Backend: 403 Forbidden Errors on Admin Endpoints
This was the most persistent issue, caused by multiple layers of misconfiguration in Spring Security.

-   **Symptom**: Admin-only endpoints (like rejecting a ticket) consistently return a 403 Forbidden error, even when logged in with a `SUPER_ADMIN` token.
-   **Root Cause**: A mismatch between the role name defined in the JWT/database (`SUPER_ADMIN`) and the authority Spring Security was checking for (`ROLE_SUPER_ADMIN`).
-   **The Fix Journey**:
    1.  **`hasRole` vs. `hasAuthority`**: We initially used `.hasRole("SUPER_ADMIN")` in `SecurityConfig`. This method automatically prepends `ROLE_`, so it was looking for `ROLE_SUPER_ADMIN`. We changed this to `.hasAuthority("SUPER_ADMIN")` which checks for the exact string.
    2.  **Conflicting Security Rules**: The `JwtRequestFilter` had its *own hardcoded list* of public paths that was out of sync with `SecurityConfig`. This caused some public endpoints to fail authentication. **Solution**: We removed the `shouldNotFilter` logic from `JwtRequestFilter` entirely, making `SecurityConfig` the single source of truth.
    3.  **The Final Culprit**: The `CustomUserDetailsService` was manually adding the `ROLE_` prefix when creating the user's authorities: `new SimpleGrantedAuthority("ROLE_" + adminUser.getRole().name())`. This was the true source of the mismatch. **Solution**: We removed the `"ROLE_"` prefix. Now the authority created at login (`SUPER_ADMIN`) perfectly matches the authority checked by the security rules.

### 2. Backend: 500 Error - "Transaction silently rolled back"
-   **Symptom**: Submitting a student application would sometimes result in a 500 Internal Server Error with a `Transaction silently rolled back` message.
-   **Root Cause**: Inside a single `@Transactional` method in `TicketService`, an operation that could fail (like sending an email or SMS) was throwing an exception. Even if caught, this exception "poisons" the transaction, marking it for rollback. When the method completes, Spring tries to commit the poisoned transaction, causing the error.
-   **Solution**: We refactored the logic. The database-critical operation (`ticketRepository.save(ticket)`) was moved into its own private, `@Transactional` method. The main service method now calls this save method first. Only *after* the database transaction has successfully committed does it proceed to call the non-essential notification services. This way, a notification failure cannot affect the database transaction.

### 3. Backend: Database Constraint Violation on Rejection
-   **Symptom**: Rejecting a student application caused a `DataIntegrityViolationException` with the message `violates check constraint "tickets_ticket_status_check"`.
-   **Root Cause**: The code was incorrectly setting the `ticketStatus` to `CANCELLED` upon rejection. The database schema has a rule that a ticket cannot be "cancelled" if it was never in a state where it could be paid (e.g., `PENDING_PAYMENT`).
-   **Solution**: We removed the line `ticket.setTicketStatus(TicketStatus.CANCELLED)`. The correct state for a rejected application is `verificationStatus = REJECTED` while the `ticketStatus` remains `PENDING_VERIFICATION`.

### 4. Frontend: User-Unfriendly Error Messages
-   **Symptom**: Backend validation errors (e.g., for phone number format) were displayed as raw, technical JSON strings to the user.
-   **Solution**: We created a `getErrorMessage` utility function in the ticket pages. This function inspects the error message string for keywords (like "Phone number", "already has a ticket") and returns a clean, user-friendly, and helpful message. This provides a much better user experience.

---

## 🛠️ Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher is recommended)
- [Yarn](https://yarnpkg.com/) (or npm)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd house-of-joy-fe
    ```

2.  **Install dependencies:**
    Using Yarn:
    ```bash
    yarn install
    ```
    Using npm:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root of the `house-of-joy-fe` directory. Add the URL of the backend server:
    ```
    VITE_API_BASE_URL=http://localhost:8080/api
    ```
    *Note: Adjust the URL if your backend is running on a different port.*

4.  **Run the development server:**
    Using Yarn:
    ```bash
    yarn dev
    ```
    Using npm:
    ```bash
    npm run dev
    ```

The application should now be running at `http://localhost:5173`.

## 📂 Project Structure

The project follows a standard React application structure:

```
src/
├── assets/         # Static assets like images and fonts
├── components/     # Reusable UI components (Header, Footer, etc.)
├── hooks/          # Custom React hooks
├── layouts/        # Layout components (e.g., MainLayout with Header/Footer)
├── pages/          # Top-level page components for each route
├── services/       # API service functions for communicating with the backend
├── store/          # State management (if using Zustand, Redux, etc.)
├── theme/          # Mantine theme customizations
└── types/          # TypeScript type definitions
```

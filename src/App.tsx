import { Route, Routes } from "react-router-dom";

import { MainLayout } from "./layouts/MainLayout";
import { HomePage } from "./pages/HomePage";
import { NonStudentTicketPage } from "./pages/NonStudentTicketPage";
import { PaymentStatusPage } from "./pages/PaymentStatusPage";
import { TicketDetailsPage } from "./pages/TicketDetailsPage";
import StudentTicketPage from "./pages/StudentTicketPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/non-student-ticket" element={<NonStudentTicketPage />} />
        <Route path="/student-ticket" element={<StudentTicketPage />} />
        <Route path="/payment/status" element={<PaymentStatusPage />} />
        <Route path="/tickets/:ticketCode" element={<TicketDetailsPage />} />
      </Route>
    </Routes>
  );
}

export default App;

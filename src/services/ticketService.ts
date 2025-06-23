import api from './api';

interface NonStudentTicketPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface TicketPurchaseResponse {
  message: string;
  paymentUrl: string;
  accessCode: string;
  reference: string;
}

export interface TicketDetailsResponse {
  id: number;
  ticketCode: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  ticketType: 'STUDENT' | 'NON_STUDENT';
  ticketStatus: 'PENDING_VERIFICATION' | 'PENDING_PAYMENT' | 'PAID' | 'USED' | 'CANCELLED' | 'EXPIRED';
  paymentStatus: 'NOT_REQUIRED' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  amount: number;
  qrCodeUrl?: string;
  verificationDocumentUrl?: string;
  institutionName?: string;
  courseOfStudy?: string;
  studentIdNumber?: string;
  createdAt: string;
  usedAt?: string;
}

export const purchaseNonStudentTicket = (data: {
  fullName: string;
  email: string;
  phoneNumber: string;
}) => {
  return api.post("/tickets/non-student", data);
};

export const purchaseStudentTicket = (formData: FormData) => {
    return api.post("/student-tickets/apply", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const checkStudentStatus = (email: string) => {
    return api.get(`/student-tickets/status?email=${email}`);
};

export const getTicketByCode = (ticketCode: string) => {
  return api.get(`/tickets/code/${ticketCode}`);
}; 
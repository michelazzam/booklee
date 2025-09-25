export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type AppointmentSource = 'online' | 'phone' | 'walk-in';
export type AppointmentItem = {
  price: number;
  serviceId: string;
  serviceName: string;
  employeeId?: string;
  employeeName?: string;
  durationMinutes: number;
};

/*** Create Appointment Type ***/
export type CreateAppointmentReqType = {
  notes?: string;
  startAt: string;
  locationId: string;
  items: AppointmentItem[];
  status: AppointmentStatus;
  source: AppointmentSource;
};
export type CreateAppointmentResType = {
  ok: boolean;
  appointment: {
    _id: string;
    notes?: string;
    startAt: string;
    updatedAt: string;
    createdAt: string;
    locationId: string;
    items: AppointmentItem[];
    status: AppointmentStatus;
    source: AppointmentSource;
  };
};

/*** Employee/Professional Types ***/
export type Employee = {
  _id: string;
  name: string;
  rating: number;
  serviceIds: string[];
  specialties: string[];
};

/*** Booking Service Types ***/
export type BookingService = {
  _id: string;
  name: string;
  price: number;
  duration: number;
};

/*** Booking Data Types ***/
export type BookingDataResponse = {
  ok: boolean;
  data: {
    employees: Employee[];
    hours: Record<string, any>;
    services: BookingService[];
  };
};

/*** Booking Flow Types ***/
export type BookingStep = 'service' | 'professional' | 'datetime' | 'confirm';

export type SelectedService = {
  id: string;
  name: string;
  price: number;
  duration: number;
  priceType: 'fixed' | 'range' | 'starting';
  priceMin?: number;
  priceMax?: number;
};

export type BookingData = {
  notes?: string;
  locationId: string;
  locationName: string;
  selectedDate?: string;
  selectedTime?: string;
  selectedServices: SelectedService[];
  selectedEmployeesByService?: Record<string, Employee | undefined>;
};

/*** User Appointments Type ***/
export type UserAppointment = {
  _id: string;
  notes: string;
  startAt: string;
  clientName: string;
  totalPrice: number;
  items: AppointmentItem[];
  status: AppointmentStatus;
};
export type UserAppointmentsReqType = {
  past?: boolean;
  upcoming?: boolean;
};
export type UserAppointmentsResType = {
  ok: boolean;
  appointments: UserAppointment[];
};

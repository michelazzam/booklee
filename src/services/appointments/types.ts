/*** Appointment Types ***/
export type AppointmentItem = {
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  price: number;
  employeeId?: string;
  employeeName?: string;
};

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type AppointmentSource = 'online' | 'phone' | 'walk-in';

export type CreateAppointmentReqType = {
  locationId: string;
  startAt: string; // ISO string
  items: AppointmentItem[];
  status: AppointmentStatus;
  source: AppointmentSource;
  notes?: string;
};

export type CreateAppointmentResType = {
  ok: boolean;
  appointment: {
    _id: string;
    locationId: string;
    startAt: string;
    items: AppointmentItem[];
    status: AppointmentStatus;
    source: AppointmentSource;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  };
};

/*** Employee/Professional Types ***/
export type Employee = {
  _id: string;
  name: string;
  rating: number;
  specialties: string[];
  serviceIds: string[];
};

/*** Booking Service Types ***/
export type BookingService = {
  _id: string;
  name: string;
  duration: number;
  price: number;
};

/*** Booking Data Types ***/
export type BookingDataResponse = {
  ok: boolean;
  data: {
    hours: Record<string, any>; // Operating hours structure
    services: BookingService[];
    employees: Employee[];
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
  locationId: string;
  locationName: string;
  selectedServices: SelectedService[];
  selectedEmployee?: Employee;
  selectedDate?: string;
  selectedTime?: string;
  notes?: string;
};

/*** Appointment Types ***/
export type AppointmentItem = {
  serviceId: string;
  serviceName: string;
  durationMinutes: number;
  price: number;
  employeeId: string;
  employeeName: string;
};

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type AppointmentSource = 'online' | 'phone' | 'walk-in' | 'mobile';

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

/*** Availability Types ***/
export type TimeSlot = {
  value: string;
  label: string;
  availableEmployeeIds: string[];
  availableEmployeeCount: number;
  isAvailable: boolean;
  reason: string | null;
};

export type AvailabilityData = {
  locationId: string;
  date: string;
  dayKey: string;
  stepMinutes: number;
  baseDurationMinutes: number;
  serviceId: string;
  serviceDurationMinutes: number;
  totalDurationMinutes: number;
  eligibleEmployeeIds: string[];
  timeSlots: string[];
  slots: TimeSlot[];
  busy: Record<string, Array<{ start: string; end: string }>>;
};

export type LocationData = {
  employees: Employee[];
  services: BookingService[];
  hours: Record<
    string,
    {
      open: string;
      close: string;
      closed: boolean;
    }
  >;
};

export type AvailabilityResponse = {
  ok: boolean;
  organizationId: string;
  locations: Array<{ id: string; name: string }>;
  locationData: Record<string, LocationData>;
  filters: {
    locationId: string;
    date: string;
    serviceId: string;
    baseDurationMinutes: number;
    stepMinutes: number;
  };
  availability: AvailabilityData;
};

export type ServiceBooking = {
  serviceId: string;
  selectedDate?: string;
  selectedTime?: string;
  selectedEmployee?: Employee;
  availabilityData?: AvailabilityResponse;
};

export type BookingData = {
  locationId: string;
  locationName: string;
  selectedServices: SelectedService[];
  // Track bookings per service
  serviceBookings: Record<string, ServiceBooking>;
  currentServiceIndex: number;
  notes?: string;
};

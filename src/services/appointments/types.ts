export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
export type AppointmentSource = 'online' | 'phone' | 'walk-in' | 'mobile';
export type AppointmentItem = {
  price: number;
  serviceId: string;
  serviceName: string;
  employeeId?: string;
  employeeName?: string;
  durationMinutes: number;
};

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
export type BookingStep = 'service' | 'datetime' | 'timeselect' | 'timeprofessional' | 'confirm';
export type SelectedService = {
  id: string;
  name: string;
  price: number;
  duration: number;
  priceMin?: number;
  priceMax?: number;
  priceType: 'fixed' | 'range' | 'starting';
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
  busy: Record<string, { start: string; end: string }[]>;
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

export type AvailabilityReqType = {
  date: string;
  enabled: boolean;
  serviceId: string;
  locationId: string;
  baseDurationMinutes: number;
};

export type AvailabilityResponse = {
  ok: boolean;
  organizationId: string;
  locations: { id: string; name: string }[];
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
  notes?: string;
  locationId: string;
  locationName: string;
  selectedDate?: string;
  selectedTime?: string;
  source?: AppointmentSource;
  currentServiceIndex: number;
  selectedServices: SelectedService[];
  serviceBookings: Record<string, ServiceBooking>;
  selectedEmployeesByService?: Record<string, Employee | undefined>;
};

/*** User Appointments Type ***/
export type UserAppointmentLocation = {
  id: string;
  name: string;
  city: string;
  rating: number;
  photos: string[];
  geoLocation: {
    type: string;
    coordinates: number[];
  };
};
export type UserAppointmentType = {
  id: string;
  notes: string;
  startAt: string;
  clientName: string;
  totalPrice: number;
  totalServices: number;
  items: AppointmentItem[];
  status: AppointmentStatus;
  totalDurationMinutes: number;
  location: UserAppointmentLocation;
};
export type UserAppointmentsReqType = {
  past?: boolean;
  upcoming?: boolean;
  needsReview?: boolean;
};
export type UserAppointmentsResType = {
  ok: boolean;
  appointments: UserAppointmentType[];
  selectedServices: SelectedService[];
  // Track bookings per service
  serviceBookings: Record<string, ServiceBooking>;
  currentServiceIndex: number;
  notes?: string;
};

/*** Cancel Appointment Types ***/
export type CancelAppointmentReqType = {
  appointmentId: string;
};
export type CancelAppointmentResType = {
  ok: boolean;
};

/*** Reschedule Appointment Types ***/
export type RescheduleAppointmentReqType = {
  startAt: string;
  appointmentId: string;
};
export type RescheduleAppointmentResType = {
  ok: boolean;
};

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type AppointmentItemType = {
  serviceName: string;
  durationMinutes: number;
  price: number;
  employeeId: string | null;
  employeeName: string;
};

export type DashboardAppointmentType = {
  id: string;
  clientName: string;
  startAt: string;
  totalPrice: number;
  totalDurationMinutes: number;
  totalServices: number;
  status: AppointmentStatus;
  notes: string;
  items: AppointmentItemType[];
  location: object | null;
};

/*** Get Appointments Request Type ***/
export type GetAppointmentsReqType = {
  locationId?: string;
  start?: string;
  end?: string;
  upcoming?: boolean;
  past?: boolean;
  limit?: number;
  page?: number;
  skip?: number;
};

/*** Get Appointments Response Type ***/
export type GetAppointmentsResType = {
  ok: boolean;
  appointments: DashboardAppointmentType[];
  total?: number;
  page?: number;
  limit?: number;
};

/*** Get Owner Metrics Request Type ***/
export type GetOwnerMetricsReqType = {
  organizationId: string;
  locationId?: string;
};

/*** Get Owner Metrics Response Type ***/
export type StaffPerformanceType = {
  _id: string;
  name: string;
  bookings: number;
  rating: number;
  avatar: string;
};

export type OwnerMetricsType = {
  bookingsToday: number;
  bookingsDeltaPct: number;
  activeClients: number;
  clientsDeltaPct: number;
  revenueThisMonth: number;
  revenueDeltaPct: number;
  averageRating: number;
  ratingDeltaAbs: number;
  staffPerformance: StaffPerformanceType[];
  todaysSchedule: any[];
  recentActivity: any[];
  monthlyTarget: number;
};

export type GetOwnerMetricsResType = {
  ok: boolean;
  metrics: OwnerMetricsType;
};

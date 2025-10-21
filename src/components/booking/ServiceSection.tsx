import { AnimatedServiceSection } from './AnimatedServiceSection';
import type {
  Employee,
  SelectedService,
  ServiceBooking,
  AvailabilityResponse,
} from '~/src/services';

type ServiceSectionProps = {
  service: SelectedService;
  locationId: string;
  serviceBookings: Record<string, ServiceBooking>;
  hasTimeConflict: (
    date: string,
    time: string,
    duration: number,
    excludeServiceId?: string
  ) => boolean;
  hasProfessionalConflict: (
    professionalId: string,
    date: string,
    time: string,
    duration: number,
    excludeServiceId?: string
  ) => boolean;
  onProfessionalSelect: (serviceId: string, employee: Employee | undefined) => void;
  onTimeSelect: (serviceId: string, time: string, availabilityData: AvailabilityResponse) => void;
  isExpanded: boolean;
  onToggleExpansion: (serviceId: string) => void;
  selectedProfessional: Employee | 'any' | undefined;
  employees: Employee[];
};

export const ServiceSection = ({
  service,
  locationId,
  serviceBookings,
  hasTimeConflict,
  hasProfessionalConflict,
  onProfessionalSelect,
  onTimeSelect,
  isExpanded,
  onToggleExpansion,
  selectedProfessional,
  employees,
}: ServiceSectionProps) => {
  return (
    <AnimatedServiceSection
      service={service}
      locationId={locationId}
      serviceBookings={serviceBookings}
      hasTimeConflict={hasTimeConflict}
      hasProfessionalConflict={hasProfessionalConflict}
      onProfessionalSelect={onProfessionalSelect}
      onTimeSelect={onTimeSelect}
      isExpanded={isExpanded}
      onToggleExpansion={onToggleExpansion}
      selectedProfessional={selectedProfessional}
      employees={employees}
    />
  );
};

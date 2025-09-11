export type GetMeResType = {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    phone: string;
    firstName: string;
    lastName: string;
    salonName: string;
    image: string | null;
    approvedByOwner: boolean;
  };
  organization: {
    _id: string;
    name: string;
    address: string;
    phone: string;
    description: string;
    logo: string;
    monthlyRevenueTarget: number;
    geoLocation: object | null;
    invitationKey: string;
  };
};

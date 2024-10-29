/** Organization base model */
export interface OrganizationModel {
  /** Name of the organization */
  name: string;
  /** ISO Code of the territory in which the organization is located */
  territory: string;
  /** Description of the organization */
  description: string;
  /** Contact information of the organization */
  contactInfo: string;
  /** Product information fo the organization */
  productsInfo: string;
  /** URL of the organization avatar */
  avatarUrl: string;
  /** URL of the organization cover picture */
  coverUrl: string;
  /** Indicates if organization members are visible publicly */
  membersVisible: boolean;
  /** Indicates if organization is searchable publicly */
  searchable: boolean;
  /** List of activities that the organization has */
  activities: Array<OrganizationActivityModel>;
  /** List of organization members */
  members: Array<OrganizationMemberModel>;
}

/** Organization activity template */
export interface OrganizationActivityModel {
  /** ID of the activity */
  id: string;
  /** Translation key to display the activity name */
  translationKey: string;
}

/** Organization member */
export interface OrganizationMemberModel {
  /** ID of the membership */
  id: string;
  /** ID of the organization on which the user has membership */
  organizationId: string;
  /** ID of the user */
  userId: string;
  /** Did the user accept/request to join the organization */
  requested: boolean;
  /** Time at which the user accepted/requested to join the organization */
  requestedAt: Date;
  /** Did the user get accepted/invited by an organization admin */
  invited: boolean;
  /** Time at which the user got accepted/invited by an organization admin */
  invitedAt: Date;
  /** Is the user an admin of the organization */
  admin: boolean;
}

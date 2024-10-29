/** User model template */
export interface UserModel {
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** @deprecated */
  firstNameLastName: string;
  /** @deprecated */
  firstNameSpaceLastName: string;
  /** @deprecated */
  lastNameFirstName: string;
  /** @deprecated */
  lastNameSpaceFirstName: string;
  /** User's regular display name */
  displayName: string;
  /** User's casual display name */
  casualName: string;
  /** User's formal display name */
  formalName: string;
  /** User's email address */
  email: string;
  /** @deprecated User's username */
  username: string;
  /** User's RegId */
  regId: string;
  /** User's locale */
  locale: string;
  /** URL opf the user's avatar */
  pictureUrl: string;
  /** @deprecated ID of the user's organization */
  organizationId?: string;
  /** @deprecated Date at which the user joined the organization */
  joinedOrganizationAt?: Date | null;
  /** @deprecated Admin status of the user in the organization */
  organizationAdmin: boolean;
  /** @deprecated */
  requestedToJoinOrganization: boolean;
  /** @deprecated */
  acceptedInOrganization: boolean;
  /** User's ID for QR codes */
  linkId: string;
  /** User's BlackBerry ID */
  bbId: string;
  /** User's BlackBerry encrypted key */
  bbEncrypted: string;
  /** User's signature keys */
  signKeyEncrypted: string;
  /** User's public key */
  signKeyPub: string;
  /** Enables auto-acceptance of contact requests */
  autoConnect: boolean;
  /** Is the user searchable publicly */
  searchable: boolean;
  /** Is URL scanning enabled for the user */
  enableUrlScan: boolean;
  /** Is message translation enabled for the user */
  enableMessageTranslation: boolean;
  /** Is the user's email visible publicly */
  emailVisibility: boolean;
}

/** User template build options */
export interface UserBuildOptions {
  /** User's first name */
  firstName?: string;
  /** User's last name */
  lastName?: string;
  /** Id of the organization to which the user is affiliated */
  organizationId?: string;
  /** Admin status of the user in his organization */
  admin?: boolean;
  /** Membership status of the user in his organization */
  member?: boolean;
  /** Add randomness to avoid collisions when generating a large number of entities */
  moreRandom?: boolean;
}

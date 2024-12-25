/** User model template */
export interface UserModel {
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's regular display name */
  displayName: string;
  /** User's casual display name */
  casualName: string;
  /** User's formal display name */
  formalName: string;
  /** User's email address */
  email: string;
  /** User's locale */
  locale: string;
  /** URL opf the user's avatar */
  pictureUrl: string;
}

/** User template build options */
export interface UserBuildOptions {
  /** User's first name */
  firstName?: string;
  /** User's last name */
  lastName?: string;
  /** Membership status of the user in his organization */
  member?: boolean;
  /** Add randomness to avoid collisions when generating a large number of entities */
  moreRandom?: boolean;
}

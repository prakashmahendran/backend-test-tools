/** Connection base model */
export interface ConnectionModel {
  /** Owner of the connection */
  ownerId: string;
  /** USer with which the owner is connected */
  otherUserId: string;
  /** Wether the connection is accepted or not */
  accepted: boolean;
  /** Date at which the connection was accepted */
  acceptedAt?: Date;
  /** Wether the owner did block the other user */
  blocked: boolean;
  /** Date at which the connection was blocked */
  blockedAt?: Date;
  /** Did the owner initiate the connection */
  initiator: boolean;
  /** Message sent to the other user with the connection */
  message: string;
  /** Private note the user has on the connection */
  note: string;
}

/** Build options for connections */
export interface ConnectionBuildOptions {
  /** Wether the connection is accepted or not */
  accepted?: boolean;
  /** Wether the owner did block the other user */
  blocked?: boolean;
}

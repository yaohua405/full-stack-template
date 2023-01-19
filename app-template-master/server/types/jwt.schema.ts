type JwtClaimsRegistered = {
	/** Issuer, the principal that issued the JWT, application specific, case sensitive */
	iss?: string;
	/** Subject, the principal that is the subject of the JWT, application specific, case sensitive */
	sub?: string;
	/** Audience, recipients that the JWT is intended for, Each principal intended to process the JWT MUST identify itself with a value in the audience claim. If the principal processing the claim does not identify itself with a value in the "aud" claim when this claim is present, then the JWT MUST be rejected. Application specific, case sensitive. */
	aud?: string | string[];
	/** Expiration Time: Seconds Since Epoch */
	exp?: number;
	/** Not Before: Seconds Since Epoch */
	nbf?: number;
	/** Issued At: Seconds Since Epoch */
	iat?: number;
	/** JWT Id, to prevent it being replayed */
	jti?: string;
}
type JwtClaimsPublic = {
	/** Full name */
	name?: string,
	/** Given name(s) or first name(s) */
	given_name?: string,
	/** Surname(s) or last name(s) */
	familiy_name?: string,
	/** Middle name(s) */
	middle_name?: string,
	/** Casual name */
	nickname?: string,
	/** Profile page URL */
	profile?: string,
	/** Profile picture URL */
	picture?: string,
	/** Web page or blog URL */
	website?: string,
	/** Preferred e-mail address */
	email?: string,
	/** True if the e-mail address has been verified; otherwise false */
	email_verified?: boolean,
	/** Gender */
	gender?: string,
	/** Birthday */
	birthdate?: string,
	/** Preferred telephone number */
	phone_number?: string,
	/** True if the phone number has been verified; otherwise false */
	phone_number_verified?: boolean,
	/** Preferred postal address */
	address?: string,
	/** Time the information was last updated */
	updated_at?: string,
	/** Roles given to this user, not case sensitive, preferrably only lowercase or underscores allowed */
	roles?: string[] | string,
	/** Groups this user is part of, not case sensitive, preferrably only lowercase or underscores allowed */
	groups?: string[] | string,
}
type JwtClaimsPrivate = {
	/** The username for this user */
	user: string,
	id: string,
}
// type UndefinedToNull<T extends object> = {[K in keyof T]: T[K] extends undefined|never ? (T[K] | null) : T[K]}
// type J = UndefinedToNull<{t?:string}>;
// const l:J = {t: null};
type JwtClaims = JwtClaimsRegistered & JwtClaimsPublic & JwtClaimsPrivate;

export default JwtClaims;
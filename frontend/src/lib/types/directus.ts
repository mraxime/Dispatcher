// NOTE: Directus is working on a type generator 'https://github.com/directus/directus/pull/19867'
// Once it's merged we'll no longer need to maintain this file.
// Alternatively there is "directus-typescript-gen" package but it's not quite good.

import type { Query } from '@directus/sdk';

export type Calendar = {
	id: string;
	company: number | Company;
	events: CalendarEvent[];

	/** Format: timestamp */
	created_at: string;
	/** Format: timestamp */
	updated_at: string;
};

export type CalendarEvent = {
	id: string;
	calendar: string; // calendar.id
	title: string;
	description?: string | null;
	start: string /** Format: timestamp */;
	end: string /** Format: timestamp */;
	allDay: boolean;
	color: string;
	user_assignee?: string | User | null;
	trailer_assignee?: string | Trailer | null;

	/** Format: timestamp */
	created_at: string;
	/** Format: timestamp */
	updated_at: string;
};

export type Company = {
	id: number;
	sort?: number | null;
	name: string;
	active: boolean;
	admin?: string | User | null;
	address: string;

	/** Format: timestamp */
	date_created: string;
	/** Format: timestamp */
	date_updated: string;
};

export type Trailer = {
	id: number;
	sort?: number | null;
	company: number | Company;
	name: string;
	in_service: boolean;
	belongs_to?: string | null;
	type: 'LIGHT' | 'SEMI_HEAVY' | 'HEAVY';
	model?: string | null;
	weight?: number | null;
	plate_nb?: string | null;
	serial_nb?: string | null;

	// wheels
	nb?: number | null;
	capacity_front?: number | null;
	capacity_back?: number | null;
	radius_front?: number | null;
	radius_back?: number | null;

	// measures
	plate_length?: number | null;
	plate_height?: number | null;
	total_length?: number | null;
	total_height?: number | null;
	capacity?: number | null;
	capacity_thaw?: number | null;

	// other
	brake_type?: string | null;
	container: boolean;
	gps: boolean;
	ifta: boolean;
	wheel_lift: boolean;
	note?: string | null;

	/** Format: timestamp */
	date_created: string;
	/** Format: timestamp */
	date_updated: string;
};

export type Service = {
	id: number;
	company: number | Company;
	status: 'ACTIVE' | 'INACTIVE';
	sort?: number | null;
	name: string;
	prices?: (number | Price)[] | null;

	/** Format: timestamp */
	date_created: string;
	/** Format: timestamp */
	date_updated: string;
};

export type Price = {
	id: number;
	company: number | Company;
	status: 'ACTIVE' | 'INACTIVE';
	name: string;
	type: 'BASE' | 'PER_HOUR' | 'PER_KM';
	value: number;
	taxable: boolean;
	conditions: PriceCondition[]; // conditions to apply the price in bills

	/** Format: timestamp */
	date_created: string;
	/** Format: timestamp */
	date_updated: string;
};

export type PriceCondition = {
	id: number;
	price: number; // price.id
	type: 'SERVICE_DURATION' | 'SERVICE_DISTANCE' | 'DAY_TIME';
	min?: number | null;
	max?: number | null;

	/** Format: timestamp */
	created_at: string;
	/** Format: timestamp */
	updated_at?: string | null;
};

export type Client = {
	id: number;
	sort?: number | null;
	company: number | Company;
	status: 'ACTIVE' | 'INACTIVE';
	name: string;
	phone: string;
	email: string;
	companyName?: string | null;

	/** Format: timestamp */
	date_created: string;
	/** Format: timestamp */
	date_updated: string;
};

export type Bill = {
	id: number;
	sort?: number | null;
	company: number | Company;
	status: 'PAID' | 'UNPAID';
	call?: number | Call | null;
	client: number | Client;
	price: number | Price;
	totalDistance?: number | null;
	totalHours?: number | null;
	note?: string | null;

	/** Format: timestamp */
	date_created: string;
	/** Format: timestamp */
	date_updated: string;
};

export type Call = {
	id: number;
	sort?: number | null;
	company: number | Company;
	status: 'IN_PROGRESS' | 'PENDING' | 'COMPLETED' | 'IMPOUNDED' | 'RESERVED' | 'CANCELED';
	name: string;
	address: string;
	phone: string;
	destination: string;
	service: number | Service;
	driver?: string | User | null;
	driver_truck?: number | Trailer | null;
	vehicle: number | TowedVehicle;
	note?: string | null;
	bill_note?: string | null;

	/** Format: timestamp */
	date_created: string;
	/** Format: timestamp */
	date_updated: string;
};

export type Message = {
	id: number;
	sort?: number | null;
	content: string;
	sender: string | User;
	receiver: string | User;
	file?: string | DirectusFile | null;

	/** Format: timestamp */
	date_created: string;
	/** Format: timestamp */
	date_updated: string;
};

export type TowedVehicle = {
	id: number;
	model: string;
	license?: string | null;
	serial_number?: string | null;
	width?: number | null;
	lengthh?: number | null;
	weight?: number | null;
	height?: number | null;

	/** Format: timestamp */
	date_created?: string | null;
	/** Format: timestamp */
	date_updated?: string | null;
};

export type DriverLicense = {
	id: number;
	class: string;
	number: string;
	capacity?: number | null;
	/** Format: date */
	expiration_date: string;
	note?: string | null;

	/** Format: timestamp */
	date_created: string;
	/** Format: timestamp */
	date_updated: string;
};

/** Emergency contact */
export type Contact = {
	id: number;
	first_name: string;
	last_name: string;
	relation: string;
	phone: string;
	ext?: string | null;
	note?: string | null;

	/** Format: timestamp */
	date_created?: string | null;
	/** Format: timestamp */
	date_updated?: string | null;
};

export type DirectusFile = {
	/**
	 * @description Unique identifier for the file.
	 * @example 8cbb43fe-4cdf-4991-8352-c461779cec02
	 */
	id: string;
	/**
	 * @description Where the file is stored. Either `local` for the local filesystem or the name of the storage adapter (for example `s3`).
	 * @example local
	 */
	storage: string;
	/**
	 * @description Name of the file on disk. By default, Directus uses a random hash for the filename.
	 * @example a88c3b72-ac58-5436-a4ec-b2858531333a.jpg
	 */
	filename_disk: string;
	/**
	 * @description How you want to the file to be named when it's being downloaded.
	 * @example avatar.jpg
	 */
	filename_download: string;
	/**
	 * @description Title for the file. Is extracted from the filename on upload, but can be edited by the user.
	 * @example User Avatar
	 */
	title: string;
	/**
	 * @description MIME type of the file.
	 * @example image/jpeg
	 */
	type: string;
	/**
	 * @description Virtual folder where this file resides in.
	 * @example null
	 */
	folder?: string | null;
	/**
	 * @description Who uploaded the file.
	 * @example 63716273-0f29-4648-8a2a-2af2948f6f78
	 */
	uploaded_by: string | User;
	/**
	 * Format: date-time
	 * @description When the file was uploaded.
	 * @example 2019-12-03T00:10:15+00:00
	 */
	uploaded_on: string;
	modified_by?: string | User | null;
	/** Format: timestamp */
	modified_on: string;
	/**
	 * @description Character set of the file.
	 * @example binary
	 */
	charset?: string | null;
	/**
	 * @description Size of the file in bytes.
	 * @example 137862
	 */
	filesize: number;
	/**
	 * @description Width of the file in pixels. Only applies to images.
	 * @example 800
	 */
	width?: number | null;
	/**
	 * @description Height of the file in pixels. Only applies to images.
	 * @example 838
	 */
	height?: number | null;
	/**
	 * @description Duration of the file in seconds. Only applies to audio and video.
	 * @example 0
	 */
	duration?: number | null;
	/**
	 * @description Where the file was embedded from.
	 * @example null
	 */
	embed?: string | null;
	/** @description Description for the file. */
	description?: string | null;
	/** @description Where the file was created. Is automatically populated based on EXIF data for images. */
	location?: string | null;
	/** @description Tags for the file. Is automatically populated based on EXIF data for images. */
	tags?: string[] | null;
	/** @description IPTC, EXIF, and ICC metadata extracted from file */
	metadata?: Record<string, unknown> | null;
};

export type User = {
	/**
	 * @description Unique identifier for the user.
	 * @example 63716273-0f29-4648-8a2a-2af2948f6f78
	 */
	id: string;
	/**
	 * @description First name of the user.
	 * @example Admin
	 */
	first_name: string;
	/**
	 * @description Last name of the user.
	 * @example User
	 */
	last_name?: string | null;
	/**
	 * Format: email
	 * @description Unique email address for the user.
	 * @example admin@example.com
	 */
	email: string;
	/** @description Password of the user. */
	password: string;
	/**
	 * @description The user's location.
	 * @example null
	 */
	location?: string | null;
	/**
	 * @description The user's title.
	 * @example null
	 */
	title?: string | null;
	/**
	 * @description The user's description.
	 * @example null
	 */
	description?: string | null;
	/**
	 * @description The user's tags.
	 * @example null
	 */
	tags?: string[] | null;
	/**
	 * @description The user's avatar.
	 * @example null
	 */
	avatar?: string | DirectusFile | null;
	/**
	 * @description The user's language used in Directus.
	 * @example en-US
	 */
	language: string;
	/**
	 * @description The 2FA secret string that's used to generate one time passwords.
	 * @example null
	 */
	tfa_secret?: string | null;
	/**
	 * @description Status of the user.
	 * @example active
	 * @enum {string}
	 */
	status: 'active' | 'invited' | 'draft' | 'suspended' | 'deleted';
	/**
	 * @description Unique identifier of the role of this user.
	 * @example 2f24211d-d928-469a-aea3-3c8f53d4e426
	 */
	role: string | UserRole;
	/** @description Static token for the user. */
	token?: string | null;
	/** Format: timestamp */
	last_access?: string | null;
	/**
	 * @description Last page that the user was on.
	 * @example /my-project/settings/collections/a
	 */
	last_page?: string | null;
	provider: string;
	external_identifier?: string | null;
	auth_data?: Record<string, unknown> | null;
	email_notifications?: boolean | null;
	phone: string;
	/** Format: date */
	birthday?: string | null;
	/** Format: date */
	hireday?: string | null;
	ext?: string | null;
	blocked: boolean;
	note?: string | null;
	company?: number | Company | null;
	emergency_contact?: number | Contact | null;
	driver_license?: number | DriverLicense | null;
	appearance?: string | null;
	theme_dark?: string | null;
	theme_light?: string | null;
	theme_light_overrides?: Record<string, unknown> | null;
	theme_dark_overrides?: Record<string, unknown> | null;
	permissions: JunctionUserCustomPermission[] | number[];

	/** Format: timestamp */
	date_created: string;
};

export type UserRole = {
	/**
	 * @description Unique identifier for the role.
	 * @example 2f24211d-d928-469a-aea3-3c8f53d4e426
	 */
	id: string;
	/**
	 * @description Name of the role.
	 * @example Administrator
	 */
	name: string;
	/**
	 * @description The role's icon.
	 * @example verified_user
	 */
	icon: string;
	/**
	 * @description Description of the role.
	 * @example Admins have access to all managed data within the system by default
	 */
	description?: string | null;
	/**
	 * @description Array of IP addresses that are allowed to connect to the API as a user of this role.
	 * @example []
	 */
	ip_access: string[];
	/**
	 * @description Whether or not this role enforces the use of 2FA.
	 * @example false
	 */
	enforce_tfa: boolean;
	/**
	 * @description Admin role. If true, skips all permission checks.
	 * @example false
	 */
	admin_access: boolean;
	/**
	 * @description The users in the role are allowed to use the app.
	 * @example true
	 */
	app_access: boolean;
	users?: (string | User)[] | null;
};

export type CustomPermission = {
	id: number;
	action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
	group:
		| 'USER'
		| 'BILL'
		| 'CALENDAR'
		| 'CALL'
		| 'CLIENT'
		| 'COMPANY'
		| 'PRICE'
		| 'SERVICE'
		| 'TRAILER';
	description?: string | null;
};

export type JunctionUserCustomPermission = {
	id: number;
	directus_users_id: string | User;
	custom_permissions_id: number | CustomPermission;
};

export type BillParams = Query<DirectusSchema, Bill>;
export type CalendarParams = Query<DirectusSchema, Calendar>;
export type CallParams = Query<DirectusSchema, Call>;
export type ClientParams = Query<DirectusSchema, Client>;
export type CompanyParams = Query<DirectusSchema, Company>;
export type MessageParams = Query<DirectusSchema, Message>;
export type PriceParams = Query<DirectusSchema, Price>;
export type ServiceParams = Query<DirectusSchema, Service>;
export type TrailerParams = Query<DirectusSchema, Trailer>;
export type UserParams = Query<DirectusSchema, User>;
export type UserPermissionParams = Query<DirectusSchema, CustomPermission>;

export type DirectusSchema = {
	companies: Company[];
	calendars: Calendar[];
	calendar_events: CalendarEvent[];
	trailers: Trailer[];
	services: Service[];
	prices: Price[];
	prices_conditions: PriceCondition[];
	clients: Client[];
	bills: Bill[];
	calls: Call[];
	messages: Message[];
	towed_vehicles: TowedVehicle[];
	driver_licenses: DriverLicense;
	users_emergency_contacts: Contact[];
	custom_permissions: CustomPermission[];

	junction_directus_users_custom_permissions: JunctionUserCustomPermission[];
};

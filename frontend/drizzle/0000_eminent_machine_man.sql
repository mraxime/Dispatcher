DO $$ BEGIN
 CREATE TYPE "measure_type" AS ENUM('metric', 'imperial');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "permission_key" AS ENUM('bills:read', 'bills:create', 'bills:update', 'bills:delete', 'calendars:read', 'calendars:create', 'calendars:update', 'calendars:delete', 'calendar-events:read', 'calendar-events:create', 'calendar-events:update', 'calendar-events:delete', 'calls:read', 'calls:create', 'calls:update', 'calls:delete', 'clients:read', 'clients:create', 'clients:update', 'clients:delete', 'companies:read', 'companies:create', 'companies:update', 'companies:delete', 'messages:read', 'messages:create', 'messages:update', 'messages:delete', 'prices:read', 'prices:create', 'prices:update', 'prices:delete', 'services:read', 'services:create', 'services:update', 'services:delete', 'towings:read', 'towings:create', 'towings:update', 'towings:delete', 'users:read', 'users:create', 'users:update', 'users:delete');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "theme_mode" AS ENUM('light', 'dark');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_role" AS ENUM('super_admin', 'admin', 'dispatcher', 'supervisor', 'driver', 'mechanic', 'employee');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_status" AS ENUM('active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "bill_status" AS ENUM('paid', 'pending', 'processing', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "call_status" AS ENUM('completed', 'in_progress', 'reserved', 'pending', 'impounded', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "client_status" AS ENUM('active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "company_status" AS ENUM('active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "price_condition_type" AS ENUM('service_distance', 'service_duration', 'day_time');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "price_status" AS ENUM('active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "price_type" AS ENUM('base', 'per_hour', 'per_km');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "service_status" AS ENUM('active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "towing_status" AS ENUM('active', 'inactive');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "towing_type" AS ENUM('light', 'semi_heavy', 'heavy');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" "permission_key" NOT NULL,
	"description" varchar(255),
	CONSTRAINT "permissions_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_to_permission_junctions" (
	"user_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	CONSTRAINT "user_to_permission_junctions_user_id_permission_id_pk" PRIMARY KEY("user_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"role" "user_role" DEFAULT 'employee' NOT NULL,
	"email" varchar(128) NOT NULL,
	"username" varchar(64) NOT NULL,
	"password" varchar(255) NOT NULL,
	"first_name" varchar(64) NOT NULL,
	"last_name" varchar(64) NOT NULL,
	"birthday" timestamp with time zone,
	"hired_at" timestamp with time zone,
	"phone" varchar(128),
	"ext" varchar(30),
	"selected_company_id" uuid,
	"measure_type" "measure_type" DEFAULT 'metric' NOT NULL,
	"theme" "theme_mode" DEFAULT 'light' NOT NULL,
	"note" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"status" "bill_status" DEFAULT 'pending' NOT NULL,
	"call_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"price_id" uuid NOT NULL,
	"total_hours" numeric(10, 2) NOT NULL,
	"total_distance" numeric(10, 2) NOT NULL,
	"note" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendar_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(64) NOT NULL,
	"description" varchar(255),
	"start" timestamp with time zone NOT NULL,
	"end" timestamp with time zone NOT NULL,
	"all_day" boolean DEFAULT false NOT NULL,
	"color" varchar(30) NOT NULL,
	"calendar_id" uuid NOT NULL,
	"user_assignee_id" uuid,
	"towing_assignee_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calendars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"status" "call_status" DEFAULT 'pending' NOT NULL,
	"origin" varchar(128) NOT NULL,
	"checkpoint" varchar(128) NOT NULL,
	"destination" varchar(128) NOT NULL,
	"service_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"towing_id" uuid,
	"driver_id" uuid,
	"note" varchar(255),
	"bill_note" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"license" varchar(128),
	"model" varchar(128) NOT NULL,
	"serial_number" varchar(128),
	"height" numeric(10, 2),
	"length" numeric(10, 2),
	"weight" numeric(10, 2),
	"width" numeric(10, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"status" "client_status" DEFAULT 'active' NOT NULL,
	"first_name" varchar(64) NOT NULL,
	"last_name" varchar(64) NOT NULL,
	"email" varchar(64) NOT NULL,
	"phone" varchar(64) NOT NULL,
	"company_name" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_company_id" uuid,
	"name" varchar(64) NOT NULL,
	"status" "company_status" DEFAULT 'active' NOT NULL,
	"address" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "companies_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" varchar(64) NOT NULL,
	"last_name" varchar(64) NOT NULL,
	"email" varchar(64),
	"phone" varchar(64) NOT NULL,
	"ext" varchar(30),
	"relation" varchar(30) NOT NULL,
	"note" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "driver_licenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"number" varchar(128) NOT NULL,
	"class" varchar(64) NOT NULL,
	"capacity" numeric(10, 2),
	"expiration_date" timestamp with time zone NOT NULL,
	"note" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"content" varchar(255) NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "price_conditions" (
	"id" serial PRIMARY KEY NOT NULL,
	"price_id" uuid NOT NULL,
	"type" "price_condition_type" DEFAULT 'service_distance' NOT NULL,
	"min" integer,
	"max" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"status" "price_status" DEFAULT 'active' NOT NULL,
	"type" "price_type" DEFAULT 'base' NOT NULL,
	"name" varchar(64) NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"taxable" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_to_price_junctions" (
	"service_id" uuid NOT NULL,
	"price_id" uuid NOT NULL,
	CONSTRAINT "service_to_price_junctions_service_id_price_id_pk" PRIMARY KEY("service_id","price_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"status" "service_status" DEFAULT 'active' NOT NULL,
	"name" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "towings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"status" "towing_status" DEFAULT 'active' NOT NULL,
	"type" "towing_type" DEFAULT 'semi_heavy' NOT NULL,
	"name" varchar(64) NOT NULL,
	"driver_id" uuid,
	"model" varchar(128),
	"weight" numeric(10, 2),
	"plate_number" varchar(128),
	"serial_number" varchar(128),
	"brake_type" varchar(30),
	"capacity" numeric(10, 2),
	"capacity_back" numeric(10, 2),
	"capacity_front" numeric(10, 2),
	"capacity_thaw" numeric(10, 2),
	"container" boolean DEFAULT false NOT NULL,
	"gps" boolean DEFAULT false NOT NULL,
	"ifta" boolean DEFAULT false NOT NULL,
	"plate_height" numeric(10, 2),
	"plate_length" numeric(10, 2),
	"radius_back" numeric(10, 2),
	"radius_front" numeric(10, 2),
	"total_height" numeric(10, 2),
	"total_length" numeric(10, 2),
	"wheel_count" integer,
	"wheel_lift" boolean DEFAULT false NOT NULL,
	"note" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_company_fullname_idx" ON "users" ("company_id","first_name","last_name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "calendars_company_name_idx" ON "calendars" ("company_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "clients_company_email_idx" ON "clients" ("company_id","email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "clients_company_fullname_idx" ON "clients" ("company_id","first_name","last_name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "prices_company_name_idx" ON "prices" ("company_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "services_company_name_idx" ON "services" ("company_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "towings_company_name_idx" ON "towings" ("company_id","name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_permission_junctions" ADD CONSTRAINT "user_to_permission_junctions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_permission_junctions" ADD CONSTRAINT "user_to_permission_junctions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_selected_company_id_companies_id_fk" FOREIGN KEY ("selected_company_id") REFERENCES "companies"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bills" ADD CONSTRAINT "bills_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bills" ADD CONSTRAINT "bills_call_id_calls_id_fk" FOREIGN KEY ("call_id") REFERENCES "calls"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bills" ADD CONSTRAINT "bills_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bills" ADD CONSTRAINT "bills_price_id_prices_id_fk" FOREIGN KEY ("price_id") REFERENCES "prices"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_calendar_id_calendars_id_fk" FOREIGN KEY ("calendar_id") REFERENCES "calendars"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_user_assignee_id_users_id_fk" FOREIGN KEY ("user_assignee_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_towing_assignee_id_towings_id_fk" FOREIGN KEY ("towing_assignee_id") REFERENCES "towings"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendars" ADD CONSTRAINT "calendars_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calls" ADD CONSTRAINT "calls_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calls" ADD CONSTRAINT "calls_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calls" ADD CONSTRAINT "calls_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calls" ADD CONSTRAINT "calls_vehicle_id_client_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "client_vehicles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calls" ADD CONSTRAINT "calls_towing_id_towings_id_fk" FOREIGN KEY ("towing_id") REFERENCES "towings"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calls" ADD CONSTRAINT "calls_driver_id_users_id_fk" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_vehicles" ADD CONSTRAINT "client_vehicles_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clients" ADD CONSTRAINT "clients_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "companies" ADD CONSTRAINT "companies_parent_company_id_companies_id_fk" FOREIGN KEY ("parent_company_id") REFERENCES "companies"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "driver_licenses" ADD CONSTRAINT "driver_licenses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "price_conditions" ADD CONSTRAINT "price_conditions_price_id_prices_id_fk" FOREIGN KEY ("price_id") REFERENCES "prices"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prices" ADD CONSTRAINT "prices_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_to_price_junctions" ADD CONSTRAINT "service_to_price_junctions_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_to_price_junctions" ADD CONSTRAINT "service_to_price_junctions_price_id_prices_id_fk" FOREIGN KEY ("price_id") REFERENCES "prices"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "services" ADD CONSTRAINT "services_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "towings" ADD CONSTRAINT "towings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "towings" ADD CONSTRAINT "towings_driver_id_users_id_fk" FOREIGN KEY ("driver_id") REFERENCES "users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

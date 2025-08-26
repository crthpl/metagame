SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



DO $$ BEGIN
    CREATE TYPE "public"."AGES" AS ENUM (
        'ADULTS',
        'KIDS',
        'ALL'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


ALTER TYPE "public"."AGES" OWNER TO "postgres";


DO $$ BEGIN
    CREATE TYPE "public"."OPENNODE_CHARGE_STATUS" AS ENUM (
        'underpaid',
        'refunded',
        'processing',
        'paid',
        'expired'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


ALTER TYPE "public"."OPENNODE_CHARGE_STATUS" OWNER TO "postgres";


DO $$ BEGIN
    CREATE TYPE "public"."TEAM_COLORS" AS ENUM (
        'orange',
        'purple',
        'green',
        'unassigned'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


ALTER TYPE "public"."TEAM_COLORS" OWNER TO "postgres";


DO $$ BEGIN
    CREATE TYPE "public"."ticket_type" AS ENUM (
        'volunteer',
        'player',
        'supporter',
        'friday',
        'saturday',
        'sunday',
        'student'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


ALTER TYPE "public"."ticket_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$begin
  insert into public.profiles (id, first_name, last_name, email)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.email );
  return new;
end;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_user_profile_email"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  update profiles
  set email = new.email
  where id = new.id; -- or your join key
  return new;
end;
$$;


ALTER FUNCTION "public"."sync_user_profile_email"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."coupon_emails" (
    "coupon_id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "max_uses" integer DEFAULT 1 NOT NULL,
    "uses" bigint DEFAULT '0'::bigint NOT NULL
);


ALTER TABLE "public"."coupon_emails" OWNER TO "postgres";


COMMENT ON TABLE "public"."coupon_emails" IS 'Relation table to enable specific emails to use gated coupons';



COMMENT ON COLUMN "public"."coupon_emails"."max_uses" IS 'how many times the email can use this coupon';



COMMENT ON COLUMN "public"."coupon_emails"."uses" IS 'How many times has this email address used this coupon';



CREATE TABLE IF NOT EXISTS "public"."coupons" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "coupon_code" "text" NOT NULL,
    "email_for" boolean DEFAULT false NOT NULL,
    "max_uses" bigint,
    "used_count" bigint DEFAULT '0'::bigint NOT NULL,
    "discount_amount_cents" bigint DEFAULT '0'::bigint NOT NULL,
    "description" "text" DEFAULT ''::"text",
    "enabled" boolean DEFAULT true NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."coupons" OWNER TO "postgres";


COMMENT ON COLUMN "public"."coupons"."email_for" IS 'whether this coupon is gated to authorized emails in the coupon_emails table';



CREATE OR REPLACE VIEW "public"."coupon_emails_view" WITH ("security_invoker"='on') AS
 SELECT "ce"."coupon_id",
    "ce"."email",
    "ce"."max_uses",
    "ce"."uses",
    "c"."coupon_code"
   FROM ("public"."coupon_emails" "ce"
     LEFT JOIN "public"."coupons" "c" ON (("c"."id" = "ce"."coupon_id")));


ALTER VIEW "public"."coupon_emails_view" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."locations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" DEFAULT 'default'::"text" NOT NULL,
    "lh_name" "text",
    "capacity" bigint,
    "campus_location" "text",
    "image_url" "text",
    "thumbnail_url" "text",
    "display_in_schedule" boolean DEFAULT false NOT NULL,
    "schedule_display_order" bigint DEFAULT '100'::bigint NOT NULL
);


ALTER TABLE "public"."locations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."opennode_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "status" "text" NOT NULL,
    "opennode_order_id" "text" NOT NULL,
    "purchaser_email" "text",
    "satoshis" double precision NOT NULL,
    "ticket_type" "public"."ticket_type",
    "is_test" boolean NOT NULL,
    "purchaser_name" "text"
);


ALTER TABLE "public"."opennode_orders" OWNER TO "postgres";


COMMENT ON COLUMN "public"."opennode_orders"."opennode_order_id" IS 'opennode''s generated id for this charge';



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "discord_handle" "text",
    "email" "text",
    "opted_in_to_homepage_display" boolean DEFAULT false,
    "is_admin" boolean DEFAULT false NOT NULL,
    "homepage_order" smallint,
    "site_name" "text",
    "site_url" "text",
    "site_name_2" "text",
    "site_url_2" "text",
    "profile_pictures_url" "text",
    "dismissed_info_request" boolean DEFAULT false NOT NULL,
    "minor" boolean,
    "bringing_kids" boolean,
    "team" "public"."TEAM_COLORS" DEFAULT 'unassigned'::"public"."TEAM_COLORS" NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


COMMENT ON COLUMN "public"."profiles"."homepage_order" IS 'Ranking to order where speakers appear on the homepage in the initial display';



COMMENT ON COLUMN "public"."profiles"."site_name" IS 'Website or game name (for clickable link)';



COMMENT ON COLUMN "public"."profiles"."site_url" IS 'Website or game url';



COMMENT ON COLUMN "public"."profiles"."site_name_2" IS 'Second website or game name (for clickable link)';



COMMENT ON COLUMN "public"."profiles"."site_url_2" IS 'Second website or game url (for clickable link)';



COMMENT ON COLUMN "public"."profiles"."dismissed_info_request" IS 'Has the user clicked "stop asking me" on profile CTA modal';



COMMENT ON COLUMN "public"."profiles"."minor" IS 'user is under 18';



CREATE TABLE IF NOT EXISTS "public"."session_bookmarks" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "session_id" "uuid" NOT NULL
);


ALTER TABLE "public"."session_bookmarks" OWNER TO "postgres";


COMMENT ON TABLE "public"."session_bookmarks" IS 'Relation table of sessions users have bookmarked';



CREATE TABLE IF NOT EXISTS "public"."session_rsvps" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "session_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "on_waitlist" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."session_rsvps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text",
    "host_1_id" "uuid",
    "start_time" timestamp with time zone,
    "end_time" timestamp with time zone,
    "description" "text",
    "max_capacity" integer,
    "location_id" "uuid",
    "host_2_id" "uuid",
    "host_3_id" "uuid",
    "min_capacity" bigint,
    "ages" "public"."AGES",
    "megagame" boolean DEFAULT false NOT NULL,
    "reserved_spots" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."sessions" OWNER TO "postgres";


COMMENT ON COLUMN "public"."sessions"."megagame" IS 'Is this session part of the megagame';



DROP VIEW IF EXISTS "public"."session_rsvps_view";

CREATE VIEW "public"."session_rsvps_view" WITH ("security_invoker"='on') AS
 SELECT "sr"."created_at",
    "sr"."session_id",
    "sr"."user_id",
    "u"."email",
    "s"."title"
   FROM (("public"."session_rsvps" "sr"
     LEFT JOIN "auth"."users" "u" ON (("sr"."user_id" = "u"."id")))
     LEFT JOIN "public"."sessions" "s" ON (("sr"."session_id" = "s"."id")));


ALTER VIEW "public"."session_rsvps_view" OWNER TO "postgres";




CREATE TABLE IF NOT EXISTS "public"."tickets" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "purchaser_email" "text",
    "owner_id" "uuid" DEFAULT "gen_random_uuid"(),
    "ticket_type" "public"."ticket_type" NOT NULL,
    "price_paid" double precision,
    "coupons_used" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "ticket_code" "text" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "stripe_payment_id" "text",
    "is_test" boolean NOT NULL,
    "opennode_order" "uuid",
    "satoshis_paid" bigint,
    "admin_issued" boolean DEFAULT false NOT NULL,
    "purchaser_name" "text"
);


ALTER TABLE "public"."tickets" OWNER TO "postgres";


COMMENT ON COLUMN "public"."tickets"."is_test" IS 'Transaction created in test environment and isnt a real ticket';



DO $$ BEGIN
    ALTER TABLE "public"."tickets" ADD COLUMN "admin_issued" boolean DEFAULT false NOT NULL;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

COMMENT ON COLUMN "public"."tickets"."admin_issued" IS 'was this ticket issued for free rather than purchased';



DO $$ BEGIN
    ALTER TABLE "public"."tickets" ADD COLUMN "purchaser_name" text;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

COMMENT ON COLUMN "public"."tickets"."purchaser_name" IS 'yeah';



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'coupon_emails_pkey' 
        AND conrelid = 'public.coupon_emails'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."coupon_emails"
            ADD CONSTRAINT "coupon_emails_pkey" PRIMARY KEY ("coupon_id", "email");
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'coupons_pkey' 
        AND conrelid = 'public.coupons'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."coupons"
            ADD CONSTRAINT "coupons_pkey" PRIMARY KEY ("id");
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'locations_pkey' 
        AND conrelid = 'public.locations'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."locations"
            ADD CONSTRAINT "locations_pkey" PRIMARY KEY ("id");
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'opennode_orders_pkey' 
        AND conrelid = 'public.opennode_orders'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."opennode_orders"
            ADD CONSTRAINT "opennode_orders_pkey" PRIMARY KEY ("id");
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_pkey' 
        AND conrelid = 'public.profiles'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."profiles"
            ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'session_rsvps_pkey' 
        AND conrelid = 'public.session_rsvps'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."session_rsvps"
            ADD CONSTRAINT "session_rsvps_pkey" PRIMARY KEY ("session_id", "user_id");
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'sessions_pkey' 
        AND conrelid = 'public.sessions'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."sessions"
            ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'tickets_pkey' 
        AND conrelid = 'public.tickets'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."tickets"
            ADD CONSTRAINT "tickets_pkey" PRIMARY KEY ("id");
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'tickets_ticket_code_key' 
        AND conrelid = 'public.tickets'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."tickets"
            ADD CONSTRAINT "tickets_ticket_code_key" UNIQUE ("ticket_code");
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_starred_sessions_pkey' 
        AND conrelid = 'public.session_bookmarks'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."session_bookmarks"
            ADD CONSTRAINT "user_starred_sessions_pkey" PRIMARY KEY ("user_id", "session_id");
    END IF;
END $$;



DROP VIEW IF EXISTS "public"."sessions_view";

CREATE VIEW "public"."sessions_view" WITH ("security_invoker"='on') AS
 SELECT "s"."id",
    "s"."title",
    "s"."host_1_id",
    "s"."start_time",
    "s"."end_time",
    "s"."description",
    "s"."max_capacity",
    "s"."location_id",
    "s"."host_2_id",
    "s"."host_3_id",
    "s"."min_capacity",
    "s"."ages",
    "s"."megagame",
    "p1"."first_name" AS "host_1_first_name",
    "p1"."last_name" AS "host_1_last_name",
    "p1"."email" AS "host_1_email",
    "p2"."first_name" AS "host_2_first_name",
    "p2"."last_name" AS "host_2_last_name",
    "p2"."email" AS "host_2_email",
    "p3"."first_name" AS "host_3_first_name",
    "p3"."last_name" AS "host_3_last_name",
    "p3"."email" AS "host_3_email",
    "l"."name" AS "location_name",
    "count"("sr"."session_id") AS "rsvp_count"
   FROM ((((("public"."sessions" "s"
     LEFT JOIN "public"."profiles" "p1" ON (("p1"."id" = "s"."host_1_id")))
     LEFT JOIN "public"."profiles" "p2" ON (("p2"."id" = "s"."host_2_id")))
     LEFT JOIN "public"."profiles" "p3" ON (("p3"."id" = "s"."host_3_id")))
     LEFT JOIN "public"."locations" "l" ON (("l"."id" = "s"."location_id")))
     LEFT JOIN "public"."session_rsvps" "sr" ON (("sr"."session_id" = "s"."id")))
  GROUP BY "s"."id", "p1"."first_name", "p1"."last_name", "p1"."email", "p2"."first_name", "p2"."last_name", "p2"."email", "p3"."first_name", "p3"."last_name", "p3"."email", "l"."name";



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'coupon_emails_coupon_id_fkey' 
        AND conrelid = 'public.coupon_emails'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."coupon_emails"
            ADD CONSTRAINT "coupon_emails_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_id_fkey' 
        AND conrelid = 'public.profiles'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."profiles"
            ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'session_rsvps_session_id_fkey' 
        AND conrelid = 'public.session_rsvps'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."session_rsvps"
            ADD CONSTRAINT "session_rsvps_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'session_rsvps_user_id_fkey' 
        AND conrelid = 'public.session_rsvps'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."session_rsvps"
            ADD CONSTRAINT "session_rsvps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'session_rsvps_user_id_fkey1' 
        AND conrelid = 'public.session_rsvps'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."session_rsvps"
            ADD CONSTRAINT "session_rsvps_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'sessions_host_2_id_fkey' 
        AND conrelid = 'public.sessions'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."sessions"
            ADD CONSTRAINT "sessions_host_2_id_fkey" FOREIGN KEY ("host_2_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'sessions_host_3_id_fkey' 
        AND conrelid = 'public.sessions'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."sessions"
            ADD CONSTRAINT "sessions_host_3_id_fkey" FOREIGN KEY ("host_3_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE SET NULL;
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'sessions_host_id_fkey' 
        AND conrelid = 'public.sessions'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."sessions"
            ADD CONSTRAINT "sessions_host_id_fkey" FOREIGN KEY ("host_1_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'sessions_location_id_fkey' 
        AND conrelid = 'public.sessions'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."sessions"
            ADD CONSTRAINT "sessions_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON UPDATE CASCADE ON DELETE SET NULL;
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'tickets_opennode_order_fkey' 
        AND conrelid = 'public.tickets'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."tickets"
            ADD CONSTRAINT "tickets_opennode_order_fkey" FOREIGN KEY ("opennode_order") REFERENCES "public"."opennode_orders"("id") ON UPDATE CASCADE ON DELETE SET NULL;
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'tickets_owner_id_fkey' 
        AND conrelid = 'public.tickets'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."tickets"
            ADD CONSTRAINT "tickets_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_starred_sessions_session_id_fkey' 
        AND conrelid = 'public.session_bookmarks'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."session_bookmarks"
            ADD CONSTRAINT "user_starred_sessions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;



DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_starred_sessions_user_id_fkey' 
        AND conrelid = 'public.session_bookmarks'::regclass
    ) THEN
        ALTER TABLE ONLY "public"."session_bookmarks"
            ADD CONSTRAINT "user_starred_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;
    END IF;
END $$;



ALTER TABLE "public"."coupon_emails" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."coupons" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."locations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."opennode_orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."session_bookmarks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."session_rsvps" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tickets" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_user_profile_email"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_user_profile_email"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_user_profile_email"() TO "service_role";



GRANT ALL ON TABLE "public"."coupon_emails" TO "anon";
GRANT ALL ON TABLE "public"."coupon_emails" TO "authenticated";
GRANT ALL ON TABLE "public"."coupon_emails" TO "service_role";



GRANT ALL ON TABLE "public"."coupons" TO "anon";
GRANT ALL ON TABLE "public"."coupons" TO "authenticated";
GRANT ALL ON TABLE "public"."coupons" TO "service_role";



GRANT ALL ON TABLE "public"."coupon_emails_view" TO "anon";
GRANT ALL ON TABLE "public"."coupon_emails_view" TO "authenticated";
GRANT ALL ON TABLE "public"."coupon_emails_view" TO "service_role";



GRANT ALL ON TABLE "public"."locations" TO "anon";
GRANT ALL ON TABLE "public"."locations" TO "authenticated";
GRANT ALL ON TABLE "public"."locations" TO "service_role";



GRANT ALL ON TABLE "public"."opennode_orders" TO "anon";
GRANT ALL ON TABLE "public"."opennode_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."opennode_orders" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."session_bookmarks" TO "anon";
GRANT ALL ON TABLE "public"."session_bookmarks" TO "authenticated";
GRANT ALL ON TABLE "public"."session_bookmarks" TO "service_role";



GRANT ALL ON TABLE "public"."session_rsvps" TO "anon";
GRANT ALL ON TABLE "public"."session_rsvps" TO "authenticated";
GRANT ALL ON TABLE "public"."session_rsvps" TO "service_role";



GRANT ALL ON TABLE "public"."sessions" TO "anon";
GRANT ALL ON TABLE "public"."sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."sessions" TO "service_role";



GRANT ALL ON TABLE "public"."session_rsvps_view" TO "anon";
GRANT ALL ON TABLE "public"."session_rsvps_view" TO "authenticated";
GRANT ALL ON TABLE "public"."session_rsvps_view" TO "service_role";



GRANT ALL ON TABLE "public"."sessions_view" TO "anon";
GRANT ALL ON TABLE "public"."sessions_view" TO "authenticated";
GRANT ALL ON TABLE "public"."sessions_view" TO "service_role";



GRANT ALL ON TABLE "public"."tickets" TO "anon";
GRANT ALL ON TABLE "public"."tickets" TO "authenticated";
GRANT ALL ON TABLE "public"."tickets" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






RESET ALL;

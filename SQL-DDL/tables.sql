-- table definition

CREATE TABLE public.users (
    user_id SERIAL PRIMARY KEY,
    name character varying(100) NOT NULL
);

CREATE TABLE public.diets (
    diet_id SERIAL PRIMARY KEY,
    name character varying(100) NOT NULL
);

CREATE TABLE public.restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name character varying(100) NOT NULL,
    opening_time time without time zone NOT NULL,
    closing_time time without time zone NOT NULL
);

CREATE TABLE public.tables (
    table_id SERIAL PRIMARY KEY,
    restaurant_id integer NOT NULL,
    capacity integer NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
);

CREATE TABLE public.reservations (
    reservation_id SERIAL PRIMARY KEY,
    table_id integer NOT NULL,
    reservation_time timestamp without time zone NOT NULL,
	  is_active bool DEFAULT true NULL,
    FOREIGN KEY (table_id) REFERENCES tables(table_id)
);

CREATE TABLE public.eaters (
    eater_id SERIAL PRIMARY KEY,
    user_id integer NOT NULL,
    reservation_id integer NOT NULL,
    UNIQUE (reservation_id, user_id),
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE public.endorsements (
    endorsement_id SERIAL PRIMARY KEY,
    diet_id integer NOT NULL,
    restaurant_id integer NOT NULL,
    UNIQUE (diet_id, restaurant_id),
    FOREIGN KEY (diet_id) REFERENCES diets(diet_id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
);

CREATE TABLE public.restrictions (
    restriction_id SERIAL PRIMARY KEY,
    user_id integer NOT NULL,
    diet_id integer NOT NULL,
    UNIQUE (user_id, diet_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (diet_id) REFERENCES diets(diet_id)
);


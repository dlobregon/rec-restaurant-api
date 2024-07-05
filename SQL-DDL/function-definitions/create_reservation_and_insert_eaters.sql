-- DROP FUNCTION public.create_reservation_and_insert_eaters(int4, timestamp, _varchar);

CREATE OR REPLACE FUNCTION public.create_reservation_and_insert_eaters(p_table_id integer, p_reservation_time timestamp without time zone, user_names character varying[])
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
  new_reservation_id INT;
BEGIN
  INSERT INTO public.reservations (table_id, reservation_time)
  VALUES (p_table_id, p_reservation_time)
  RETURNING reservation_id INTO new_reservation_id;
  INSERT INTO public.eaters (user_id, reservation_id)
  SELECT u.user_id, new_reservation_id
  FROM public.users u
  WHERE u.name = ANY(user_names);
  RETURN new_reservation_id;
EXCEPTION
  WHEN OTHERS THEN
    RETURN -1;
END;
$function$
;

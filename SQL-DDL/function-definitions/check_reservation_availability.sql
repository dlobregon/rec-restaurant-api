-- DROP FUNCTION public.check_reservation_availability(_varchar, timestamp, timestamp);

CREATE OR REPLACE FUNCTION public.check_reservation_availability(users character varying[], start_time timestamp without time zone, end_time timestamp without time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
  has_reservation boolean := false;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.users u
    JOIN public.eaters e ON u.user_id = e.user_id
    JOIN public.reservations r ON e.reservation_id = r.reservation_id
    WHERE u.name = ANY (users)
    AND r.reservation_time > start_time
    AND r.reservation_time < end_time
    AND r.is_active = true
  ) INTO has_reservation;

  RETURN NOT has_reservation;
END;
$function$
;

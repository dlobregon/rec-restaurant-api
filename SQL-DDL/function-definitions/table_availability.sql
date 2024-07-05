-- DROP FUNCTION public.table_availability(int4, timestamp, timestamp);

CREATE OR REPLACE FUNCTION public.table_availability(table_id_search integer, starttime timestamp without time zone, endtime timestamp without time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
  reservation_count integer;
BEGIN
  SELECT COUNT(*) INTO reservation_count
  FROM reservations
  WHERE table_id = table_id_search
  AND reservation_time >= startTime
  AND reservation_time <= endTime
  AND is_active = true;

  IF reservation_count = 0 THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$function$
;

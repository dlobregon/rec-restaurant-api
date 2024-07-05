-- DROP FUNCTION public.cancel_reservation(int4);

CREATE OR REPLACE FUNCTION public.cancel_reservation(p_reservation_id integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
  BEGIN
    UPDATE public.reservations
    SET is_active = false
    WHERE reservation_id = p_reservation_id;
    
    IF FOUND THEN
      RETURN 1;
    ELSE
      RETURN -1;
    END IF;
  EXCEPTION
    WHEN OTHERS THEN
      RETURN -1;
  END;
  $function$
;

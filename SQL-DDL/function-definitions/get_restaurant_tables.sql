-- DROP FUNCTION public.get_restaurant_tables(_varchar, timestamp, timestamp, int4);

CREATE OR REPLACE FUNCTION public.get_restaurant_tables(users character varying[], start_time timestamp without time zone, end_time timestamp without time zone, number_of_eaters integer)
 RETURNS TABLE(restaurant_name character varying, table_id integer, seats integer)
 LANGUAGE plpgsql
AS $function$
  BEGIN
    RETURN QUERY
    SELECT
      distinct 
       r.name,
      t.table_id,
      t.capacity
    FROM
      public.users u
      JOIN public.restrictions res ON u.user_id = res.user_id
      JOIN public.diets d ON res.diet_id = d.diet_id
      JOIN public.endorsements e ON d.diet_id = e.diet_id
      JOIN public.restaurants r ON e.restaurant_id = r.restaurant_id
      JOIN public.tables t ON r.restaurant_id = t.restaurant_id
      LEFT JOIN public.reservations rv ON t.table_id = rv.table_id
        AND rv.reservation_time > start_time
        AND rv.reservation_time < end_time
    WHERE
      u.name = ANY (users)
      AND (rv.reservation_id IS NULL OR rv.is_active = false)
      AND t.capacity >= number_of_eaters
      AND t.table_id IN (
        SELECT t.table_id
        FROM public.users u
        JOIN public.restrictions res ON u.user_id = res.user_id
        JOIN public.diets d ON res.diet_id = d.diet_id
        JOIN public.endorsements e ON d.diet_id = e.diet_id
        JOIN public.restaurants r ON e.restaurant_id = r.restaurant_id
        JOIN public.tables t ON r.restaurant_id = t.restaurant_id
        LEFT JOIN public.reservations rv ON t.table_id = rv.table_id
          AND rv.reservation_time > start_time
          AND rv.reservation_time < end_time
        WHERE
          u.name = ANY (users)
          AND (rv.reservation_id IS NULL OR rv.is_active = false)
          AND t.capacity >= number_of_eaters
        GROUP BY
          t.table_id,
          r.name,
          t.capacity
        HAVING
          COUNT(DISTINCT d.diet_id) = (
            SELECT
              COUNT(DISTINCT d.diet_id)
            FROM
              public.users u
              JOIN public.restrictions res ON u.user_id = res.user_id
              JOIN public.diets d ON res.diet_id = d.diet_id
            WHERE
              u.name = ANY (users)
          )
      )
      -- OR t.table_id IN (
      --  SELECT t.table_id
      --  FROM public.tables t
      --  JOIN public.reservations r ON t.table_id = r.table_id
      --  WHERE r.reservation_time > start_time
      --   AND r.reservation_time < end_time
      --     AND r.is_active = false
      -- )
      order by r.name
     ;
  END;
  $function$
;

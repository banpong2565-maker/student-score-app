-- 20230811_enable_rls_event_trigger.sql
-- Automatically enable Row Level Security (RLS) on any new table created in the public schema.
-- This migration creates a PostgreSQL event trigger that runs after a CREATE TABLE statement
-- and issues ALTER TABLE … ENABLE ROW LEVEL SECURITY for the newly created table.

CREATE OR REPLACE FUNCTION public.enable_rls_on_new_table()
RETURNS event_trigger
LANGUAGE plpgsql
AS $$
DECLARE
    obj record;
BEGIN
    -- Loop over the DDL commands that just finished
    FOR obj IN SELECT * FROM pg_event_trigger_ddl_commands()
    LOOP
        IF obj.object_type = 'table' AND obj.schema_name = 'public' THEN
            EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', obj.schema_name, obj.object_name);
        END IF;
    END LOOP;
END;
$$;

-- Create the event trigger that fires after each CREATE TABLE command.
CREATE EVENT TRIGGER enable_rls_on_create_table
ON ddl_command_end
WHEN TAG IN ('CREATE TABLE')
EXECUTE FUNCTION public.enable_rls_on_new_table();

-- Optional: ensure RLS is enabled for the existing students table (just in case)
ALTER TABLE IF EXISTS public.students ENABLE ROW LEVEL SECURITY;

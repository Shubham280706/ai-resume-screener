-- Fix all users with no org_id
DO $$
DECLARE
  profile_record RECORD;
  new_org_id UUID;
BEGIN
  FOR profile_record IN
    SELECT p.id, u.email
    FROM profiles p
    JOIN auth.users u ON u.id = p.id
    WHERE p.org_id IS NULL
  LOOP
    INSERT INTO organizations (name, plan)
    VALUES (
      split_part(profile_record.email, '@', 2),
      'basic'
    )
    RETURNING id INTO new_org_id;

    UPDATE profiles
    SET org_id = new_org_id
    WHERE id = profile_record.id;

    RAISE NOTICE 'Fixed: %', profile_record.email;
  END LOOP;
END $$;

-- Verify all profiles now have org_id
SELECT p.id, p.org_id, u.email
FROM profiles p
JOIN auth.users u ON u.id = p.id;

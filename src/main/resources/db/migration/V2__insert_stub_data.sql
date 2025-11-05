
-- Insert companies using VALUES (with address and VAT)
INSERT INTO companies(name, address, vat) VALUES
    ('TechNova Solutions', '123 Innovation Ave, Tech City', 'BE0123456789'),
    ('Stellar Dynamics Corp', '45 Orbit Blvd, Spaceport', 'BE9876543210'),
    ('Quantum Innovations Ltd', '9 Planck Street, Quantum Town', 'BE1357924680'),
    ('Phoenix Digital Group', '77 Rise Lane, Ember City', 'BE2468013579'),
    ('Cascade Technologies', '300 Waterfall Rd, Riverdale', 'BE1122334455'),
    ('Meridian Ventures Inc', '200 Meridian Pkwy, Center City', 'BE5566778899'),
    ('Apex Systems International', '1 Summit Way, Peaksville', 'BE6677889900'),
    ('Crimson Wave Industries', '808 Tide Dr, Shoreline', 'BE1029384756'),
    ('Evergreen Analytics', '55 Pine Court, Forest Hill', 'BE5647382910'),
    ('Nexus Global Partners', '600 Link Ave, Network City', 'BE0192837465');

-- Insert departments - 3 per company
INSERT INTO departments(name, company_id)
SELECT dept_name, c.id
FROM companies c
CROSS JOIN (
    SELECT 1 as dept_order, 'Engineering' as dept_name
    UNION ALL SELECT 2, 'Product Innovation'
    UNION ALL SELECT 3, 'Customer Success'
) depts
WHERE c.id = 1
UNION ALL
SELECT dept_name, c.id
FROM companies c
CROSS JOIN (
    SELECT 1 as dept_order, 'Research & Development' as dept_name
    UNION ALL SELECT 2, 'Operations'
    UNION ALL SELECT 3, 'Marketing & Sales'
) depts
WHERE c.id = 2
UNION ALL
SELECT dept_name, c.id
FROM companies c
CROSS JOIN (
    SELECT 1 as dept_order, 'Data Science' as dept_name
    UNION ALL SELECT 2, 'Quality Assurance'
    UNION ALL SELECT 3, 'Human Resources'
) depts
WHERE c.id = 3
UNION ALL
SELECT dept_name, c.id
FROM companies c
CROSS JOIN (
    SELECT 1 as dept_order, 'Creative Design' as dept_name
    UNION ALL SELECT 2, 'Business Analytics'
    UNION ALL SELECT 3, 'IT Infrastructure'
) depts
WHERE c.id = 4
UNION ALL
SELECT dept_name, c.id
FROM companies c
CROSS JOIN (
    SELECT 1 as dept_order, 'Cloud Services' as dept_name
    UNION ALL SELECT 2, 'Cybersecurity'
    UNION ALL SELECT 3, 'Client Relations'
) depts
WHERE c.id = 5
UNION ALL
SELECT dept_name, c.id
FROM companies c
CROSS JOIN (
    SELECT 1 as dept_order, 'Finance & Accounting' as dept_name
    UNION ALL SELECT 2, 'Strategic Planning'
    UNION ALL SELECT 3, 'Legal & Compliance'
) depts
WHERE c.id = 6
UNION ALL
SELECT dept_name, c.id
FROM companies c
CROSS JOIN (
    SELECT 1 as dept_order, 'Software Development' as dept_name
    UNION ALL SELECT 2, 'Technical Support'
    UNION ALL SELECT 3, 'Supply Chain'
) depts
WHERE c.id = 7
UNION ALL
SELECT dept_name, c.id
FROM companies c
CROSS JOIN (
    SELECT 1 as dept_order, 'Manufacturing' as dept_name
    UNION ALL SELECT 2, 'Logistics'
    UNION ALL SELECT 3, 'Environmental Safety'
) depts
WHERE c.id = 8
UNION ALL
SELECT dept_name, c.id
FROM companies c
CROSS JOIN (
    SELECT 1 as dept_order, 'Business Intelligence' as dept_name
    UNION ALL SELECT 2, 'Consulting Services'
    UNION ALL SELECT 3, 'Training & Development'
) depts
WHERE c.id = 9
UNION ALL
SELECT dept_name, c.id
FROM companies c
CROSS JOIN (
    SELECT 1 as dept_order, 'International Relations' as dept_name
    UNION ALL SELECT 2, 'Project Management'
    UNION ALL SELECT 3, 'Corporate Strategy'
) depts
WHERE c.id = 10;

-- Insert employees using CASE statements for varied names
INSERT INTO employees(first_name, last_name, user_id, department_id)
SELECT 
    CASE MOD(x, 10) + 1
        WHEN 1 THEN 'Sophia' WHEN 2 THEN 'Liam' WHEN 3 THEN 'Emma' WHEN 4 THEN 'Noah' WHEN 5 THEN 'Olivia'
        WHEN 6 THEN 'Ethan' WHEN 7 THEN 'Ava' WHEN 8 THEN 'Mason' WHEN 9 THEN 'Isabella' ELSE 'Lucas'
    END || '_' || CAST(d.id as VARCHAR),
    CASE MOD(x, 10) + 1
        WHEN 1 THEN 'Martinez' WHEN 2 THEN 'Anderson' WHEN 3 THEN 'Taylor' WHEN 4 THEN 'Thomas' WHEN 5 THEN 'Jackson'
        WHEN 6 THEN 'White' WHEN 7 THEN 'Harris' WHEN 8 THEN 'Martin' WHEN 9 THEN 'Garcia' ELSE 'Robinson'
    END,
    SUBSTRING(
        CASE MOD(x, 10) + 1
            WHEN 1 THEN 'Sophia' WHEN 2 THEN 'Liam' WHEN 3 THEN 'Emma' WHEN 4 THEN 'Noah' WHEN 5 THEN 'Olivia'
            WHEN 6 THEN 'Ethan' WHEN 7 THEN 'Ava' WHEN 8 THEN 'Mason' WHEN 9 THEN 'Isabella' ELSE 'Lucas'
        END, 1, 1
    ) ||
    SUBSTRING(
        CASE MOD(x, 10) + 1
            WHEN 1 THEN 'Martinez' WHEN 2 THEN 'Anderson' WHEN 3 THEN 'Taylor' WHEN 4 THEN 'Thomas' WHEN 5 THEN 'Jackson'
            WHEN 6 THEN 'White' WHEN 7 THEN 'Harris' WHEN 8 THEN 'Martin' WHEN 9 THEN 'Garcia' ELSE 'Robinson'
        END, 1, 5
    ) ||
    CAST(d.id as VARCHAR),
    d.id
FROM departments d
CROSS JOIN SYSTEM_RANGE(0, 9) x;

-- Assign a chief to each department: pick the lowest employee id in that department
UPDATE departments d
SET chief_user_id = (
    SELECT MIN(e.user_id) FROM employees e WHERE e.department_id = d.id
);
TRUNCATE TABLE companies, departments, employees, trainings CASCADE;

-- Insert 100 companies
INSERT INTO companies(name, address, vat)
SELECT
    CASE MOD(x, 10) + 1
        WHEN 1 THEN 'TechNova' WHEN 2 THEN 'Stellar' WHEN 3 THEN 'Quantum' WHEN 4 THEN 'Phoenix'
        WHEN 5 THEN 'Cascade' WHEN 6 THEN 'Meridian' WHEN 7 THEN 'Apex' WHEN 8 THEN 'Crimson'
        WHEN 9 THEN 'Evergreen' ELSE 'Nexus'
    END || ' ' ||
    CASE MOD(x, 8) + 1
        WHEN 1 THEN 'Solutions' WHEN 2 THEN 'Dynamics' WHEN 3 THEN 'Innovations' WHEN 4 THEN 'Digital'
        WHEN 5 THEN 'Technologies' WHEN 6 THEN 'Ventures' WHEN 7 THEN 'Systems' ELSE 'Analytics'
    END || ' ' || CAST(x AS VARCHAR),
    CAST(x AS VARCHAR) || ' ' ||
    CASE MOD(x, 5) + 1
        WHEN 1 THEN 'Innovation Ave' WHEN 2 THEN 'Business Blvd' WHEN 3 THEN 'Tech Park Rd'
        WHEN 4 THEN 'Commerce St' ELSE 'Enterprise Way'
    END || ', ' ||
    CASE MOD(x, 8) + 1
        WHEN 1 THEN 'Tech City' WHEN 2 THEN 'Metro Center' WHEN 3 THEN 'Riverside'
        WHEN 4 THEN 'Lakewood' WHEN 5 THEN 'Hillsdale' WHEN 6 THEN 'Eastport'
        WHEN 7 THEN 'Northgate' ELSE 'Westfield'
    END,
    'BE' || LPAD(CAST(x AS VARCHAR), 10, '0')
FROM generate_series(1, 100) AS x;

-- Insert 10 departments per company = 1,000 departments total
INSERT INTO departments(name, company_id)
SELECT dept_name, c.id
FROM companies c
CROSS JOIN (
    SELECT 'Engineering'            AS dept_name UNION ALL
    SELECT 'Product Innovation'                  UNION ALL
    SELECT 'Research & Development'              UNION ALL
    SELECT 'Operations'                          UNION ALL
    SELECT 'Marketing & Sales'                   UNION ALL
    SELECT 'Data Science'                        UNION ALL
    SELECT 'Quality Assurance'                   UNION ALL
    SELECT 'Human Resources'                     UNION ALL
    SELECT 'Finance & Accounting'                UNION ALL
    SELECT 'IT Infrastructure'
) depts;

-- Insert 100 employees per department = 100,000 employees total
-- user_id = '{dept_id}_{row}' guarantees uniqueness within the 20-char limit
INSERT INTO employees(first_name, last_name, user_id, department_id)
SELECT
    CASE MOD(x, 20) + 1
        WHEN 1  THEN 'Sophia'    WHEN 2  THEN 'Liam'      WHEN 3  THEN 'Emma'      WHEN 4  THEN 'Noah'
        WHEN 5  THEN 'Olivia'    WHEN 6  THEN 'Ethan'     WHEN 7  THEN 'Ava'       WHEN 8  THEN 'Mason'
        WHEN 9  THEN 'Isabella'  WHEN 10 THEN 'Lucas'     WHEN 11 THEN 'Mia'       WHEN 12 THEN 'James'
        WHEN 13 THEN 'Charlotte' WHEN 14 THEN 'Oliver'    WHEN 15 THEN 'Amelia'    WHEN 16 THEN 'Elijah'
        WHEN 17 THEN 'Harper'    WHEN 18 THEN 'Benjamin'  WHEN 19 THEN 'Evelyn'    ELSE        'Alexander'
    END,
    CASE MOD(x, 20) + 1
        WHEN 1  THEN 'Martinez'  WHEN 2  THEN 'Anderson'  WHEN 3  THEN 'Taylor'    WHEN 4  THEN 'Thomas'
        WHEN 5  THEN 'Jackson'   WHEN 6  THEN 'White'     WHEN 7  THEN 'Harris'    WHEN 8  THEN 'Martin'
        WHEN 9  THEN 'Garcia'    WHEN 10 THEN 'Robinson'  WHEN 11 THEN 'Clark'     WHEN 12 THEN 'Rodriguez'
        WHEN 13 THEN 'Lewis'     WHEN 14 THEN 'Lee'       WHEN 15 THEN 'Walker'    WHEN 16 THEN 'Hall'
        WHEN 17 THEN 'Allen'     WHEN 18 THEN 'Young'     WHEN 19 THEN 'Hernandez' ELSE        'King'
    END,
    SUBSTRING(CASE MOD(x, 20) + 1
        WHEN 1  THEN 'Sophia'    WHEN 2  THEN 'Liam'      WHEN 3  THEN 'Emma'      WHEN 4  THEN 'Noah'
        WHEN 5  THEN 'Olivia'    WHEN 6  THEN 'Ethan'     WHEN 7  THEN 'Ava'       WHEN 8  THEN 'Mason'
        WHEN 9  THEN 'Isabella'  WHEN 10 THEN 'Lucas'     WHEN 11 THEN 'Mia'       WHEN 12 THEN 'James'
        WHEN 13 THEN 'Charlotte' WHEN 14 THEN 'Oliver'    WHEN 15 THEN 'Amelia'    WHEN 16 THEN 'Elijah'
        WHEN 17 THEN 'Harper'    WHEN 18 THEN 'Benjamin'  WHEN 19 THEN 'Evelyn'    ELSE        'Alexander'
        END, 1, 1) ||
    SUBSTRING(CASE MOD(x, 20) + 1
        WHEN 1  THEN 'Martinez'  WHEN 2  THEN 'Anderson'  WHEN 3  THEN 'Taylor'    WHEN 4  THEN 'Thomas'
        WHEN 5  THEN 'Jackson'   WHEN 6  THEN 'White'     WHEN 7  THEN 'Harris'    WHEN 8  THEN 'Martin'
        WHEN 9  THEN 'Garcia'    WHEN 10 THEN 'Robinson'  WHEN 11 THEN 'Clark'     WHEN 12 THEN 'Rodriguez'
        WHEN 13 THEN 'Lewis'     WHEN 14 THEN 'Leeee'       WHEN 15 THEN 'Walker'    WHEN 16 THEN 'Halle'
        WHEN 17 THEN 'Allen'     WHEN 18 THEN 'Young'     WHEN 19 THEN 'Hernandez' ELSE        'Kinge'
    END, 1, 5) || CAST(d.id AS VARCHAR) || '_' || x,
    d.id
FROM departments d
CROSS JOIN generate_series(0, 99) AS x;

-- Assign a chief to each department: pick the employee with the lowest user_id in that department
UPDATE departments d
SET chief_user_id = (
    SELECT MIN(e.user_id) FROM employees e WHERE e.department_id = d.id
);

-- Insert training catalog (20 trainings across 4 categories)
INSERT INTO trainings (name, description, category, duration_days)
VALUES
    -- Technical
    ('Java Fundamentals',            'Core Java programming: OOP, collections, concurrency and the JVM', 'Technical', 3),
    ('Spring Boot Essentials',       'Building production-ready microservices with Spring Boot 3',        'Technical', 4),
    ('Docker & Kubernetes',          'Containerisation and orchestration for cloud-native applications',  'Technical', 3),
    ('AWS Cloud Practitioner',       'Foundational AWS services, security, and pricing models',           'Technical', 2),
    ('SQL Performance Tuning',       'Query optimisation, indexing strategies and execution plans',       'Technical', 2),
    ('Clean Code & Refactoring',     'Writing maintainable, readable code and applying SOLID principles', 'Technical', 2),
    ('CI/CD with GitHub Actions',    'Automated build, test and deploy pipelines using GitHub Actions',   'Technical', 1),
    ('API Design with OpenAPI',      'Designing RESTful APIs using the OpenAPI 3.1 specification',        'Technical', 1),
    -- Soft Skills
    ('Effective Communication',      'Written and verbal communication skills for professional contexts', 'Soft Skills', 1),
    ('Leadership Fundamentals',      'Core leadership principles: delegation, feedback and motivation',   'Soft Skills', 2),
    ('Conflict Resolution',          'Techniques for de-escalating and resolving workplace conflict',     'Soft Skills', 1),
    ('Time Management',              'Prioritisation frameworks: Eisenhower matrix, time-blocking',       'Soft Skills', 1),
    ('Presentation Skills',          'Structuring and delivering impactful presentations',                'Soft Skills', 1),
    ('Agile & Scrum Practitioner',   'Scrum ceremonies, roles and artefacts for agile delivery teams',   'Soft Skills', 2),
    -- Compliance
    ('GDPR & Data Privacy',          'EU data protection regulation: obligations, rights and breaches',   'Compliance', 1),
    ('Cyber Security Awareness',     'Phishing, social engineering and secure password practices',        'Compliance', 1),
    ('Code of Conduct',              'Company values, ethics policy and reporting obligations',            'Compliance', 1),
    ('Anti-Bribery & Corruption',    'Legal framework and practical guidance on anti-corruption',         'Compliance', 1),
    -- Management
    ('Project Management Basics',    'Project initiation, planning, execution and closure',               'Management', 3),
    ('Budget & Cost Management',     'Financial planning, forecasting and cost-control techniques',       'Management', 2);

-- Assign ~3 trainings per employee deterministically using id arithmetic
INSERT INTO employee_trainings (employee_id, training_id)
SELECT e.id, t.id
FROM employees e
CROSS JOIN trainings t
WHERE MOD(e.id * 3 + t.id, 20) < 3;

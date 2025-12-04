---
colorSchema: light
color: purple
layout: cover
routerMode: hash
title: Performance Optimization in Spring Boot with Hibernate
theme: neversink
transition: slide-left
---

# Performance Optimization

## Spring Boot Applications with Hibernate

_Building Faster, More Efficient Applications_

---
layout: top-title-two-cols
color: purple
---

:: title ::
# Agenda

:: left ::

1. **Common Performance Issues**

<div class="ns-c-tight">

   - N+1 Query Problem
   - Excessive Data Transfer
   - Open Session in View Anti-pattern
   - Connection Pool Exhaustion
</div>


2. **Diagnostic Tools**

<div class="ns-c-tight">

   - Query Logging
   - Metrics and Monitoring
   - Profiling
</div>

:: right ::

3. **Solutions & Best Practices**

<div class="ns-c-tight">

   - Fetch Strategies
   - Pagination & Projections
   - Caching
   - Transaction Management
   - Optimistic Locking
</div>

4. **Performance Testing**

<div class="ns-c-tight">

   - Load Testing
   - Benchmarking
   - Analyzing Results
</div>

---
layout: section
color: purple
---

# Common Performance Issues
<hr>

Understanding what slows your application down

---
layout: top-title-two-cols
color: purple
---

:: title ::
# The N+1 Query Problem

:: left ::
### What is it?

<div class="ns-c-tight">

- Load an entity
- Then load each related entity with a separate query
- Results in N+1 database calls
- Common with lazy loading
</div>

### Example:

```java
// One query to load all employees
List<Employee> employees = employeeRepo.findAll();

// Then N queries, one per employee to load departments
for (Employee emp : employees) {
    // This triggers an additional query for each employee
    Department dept = emp.getDepartment();
    System.out.println(dept.getName());
}
```

:: right ::
### What happens:

```sql
-- Initial query
SELECT * FROM employee;

-- Then N additional queries
SELECT * FROM department WHERE id = ?;
SELECT * FROM department WHERE id = ?;
SELECT * FROM department WHERE id = ?;
...
```

<div class="flex justify-center mt-4">
  <div class="bg-red-100 rounded-lg p-4 w-full">
    <h3 class="font-bold text-red-700">Performance Impact</h3>
    <ul class="list-disc pl-5 text-red-700">
      <li>Network roundtrip overhead</li>
      <li>Database connection overhead</li>
      <li>Exponential performance degradation</li>
      <li>Scales poorly with data size</li>
    </ul>
  </div>
</div>

---
layout: top-title-two-cols
color: purple
---

:: title ::
# Row Explosion & Data Transfer

:: left ::
### The Problem:

<div class="ns-c-tight">

- **Row Explosion**: Multiplying result set size when joining tables
- Duplicated data in query results
- Ironically, often caused by N+1 query fixes
- Large memory footprint from redundant data
</div>

### Example:
```java
// Join Fetch with One-to-Many relationship
// If each employee has 10 tasks, each employee
// will appear 10 times in the result
@Query("SELECT e FROM Employee e LEFT JOIN FETCH e.tasks")
List<Employee> findAllWithTasks();

// One employee with many tasks creates
// a result set with many duplicate rows
```

:: right ::

### Visual Representation:
<v-clicks>
```
Query: SELECT e.*, t.* FROM employee e JOIN task t ON ...
Result Set:
+----+---------+------+--------+---------+
| ID | Name    | T_ID | T_Name | Emp_ID  |
+----+---------+------+--------+---------+
| 1  | John    | 101  | Task A | 1       |
| 1  | John    | 102  | Task B | 1       | <- Duplicate
| 1  | John    | 103  | Task C | 1       | <- Duplicate
+----+---------+------+--------+---------+
```

<div class="bg-red-100 rounded-lg p-4 mt-2">
  <ul class="list-disc pl-5 text-red-700">
    <li>Memory usage grows exponentially</li>
    <li>Database transfer bandwidth wasted</li>
    <li>ORM must deduplicate objects</li>
    <li>Pagination becomes unreliable</li>
    <li>Can cause OutOfMemoryError</li>
  </ul>
</div>
</v-clicks>

---
layout: top-title-two-cols
color: purple
---
:: title :: 
Poll time !

:: left ::
<div class="flex justify-center" style="margin-top: 150px; ">
	<h3>Scan to join the poll --> </h3>
</div>
:: right ::
<div class="flex justify-center">
  <div class="w-4/5">
    <img src="/images/ahaslides.png" alt="Aha slides" />    
  </div>
</div>

---
layout: top-title
color: purple
---

:: title ::
# Spring Open in View

:: content ::

1. Who remembers the time when we had to deal with LazyInitializeException?

<div>
2. Have you ever noticed this warning?


<div style="background-color: #0D1117; border-radius: 8px; padding: 8px; font-family: 'Courier New', monospace; margin-bottom: 16px; margin-top: 16px; overflow: auto;">
  <pre style="color: #AAAAAA; margin: 0; padding: 0; font-size: 10px; line-height: 1.5;">
  2025-11-12T14:59:07.077+01:00  <span class="text-amber-600">WARN</span> 19656 --- [company-directory] JpaBaseConfiguration$JpaWebConfiguration : 
        spring.jpa.open-in-view is enabled by default. Therefore, database queries may be performed during view rendering. 
		Explicitly configure spring.jpa.open-in-view to disable this warning</pre>
</div>


<div class="bg-red-100 rounded-lg p-4">
  <p class="font-bold text-red-700">This seemingly innocent warning is actually alerting you to a major performance anti-pattern!</p>
</div>
</div>


---
layout: top-title
color: purple
---

:: title ::
# Open Session In View: The Silent Killer

:: content ::
### What is it?

<div>
<p class="mb-4">Spring Boot's default behavior that keeps the Hibernate session open throughout the entire HTTP request, including view rendering.</p>

<div class="bg-amber-100 rounded-lg p-4 mb-4">
  <p class="font-bold text-amber-700">Default Configuration:</p>
  <pre class="text-sm text-amber-700">spring.jpa.open-in-view=true</pre>
</div>    

</div>


---
layout: top-title-two-cols
color: purple
---

:: title ::
# Open Session In View: The Silent Killer

:: left ::
### Benefits of Having It Enabled

<div class="bg-blue-100 rounded-lg p-4 mb-4">
  <ul class="list-disc pl-5 text-blue-700">
    <li>Convenient lazy loading in controllers/templates</li>
    <li>Simpler code - no need for explicit fetching</li>    
    <li>Easier prototyping and development</li>    
	<li>Allows loading entities in the mapper after the service layer has completed</li>
	<li>Avoid the infamous LazyInitializeException</li>
  </ul>
</div>

:: right ::
### Why it's a Problem
<v-clicks>

<div class="bg-red-100 rounded-lg p-4 mb-4">
	<ul class="list-disc pl-5 mb-4 text-red-700">
	  <li>Database connections held for the entire request duration</li>
	  <li>Unpredictable N+1 queries in controllers/views</li>
	  <li>Hidden performance costs</li>
	  <li>Makes connection pool exhaustion more likely</li>
	</ul>
</div>
</v-clicks>

---
layout: top-title
color: purple
---

:: title ::
# Open Session In View: Real-World Impact

:: content ::

<div class="flex justify-center">
  <div class="w-4/5">
    <img src="/images/osiv-diagram.svg" class="mb-8" alt="OSIV Diagram" />    
  </div>
</div>
<p>In this example, a database connection is held open during a <span class="font-bold">slow external API call</span>, even though the database is not being used during this time.</p>
<p class="mt-2">With many concurrent requests, this can rapidly exhaust your connection pool.</p>

---
layout: top-title-two-cols
color: purple
---

:: title ::
# Connection Pool Exhaustion

:: left ::
### The Problem:

<div class="ns-c-tight">

- Limited number of DB connections in the pool
- When all connections are in use, new requests wait
- Can lead to cascading failures
- Common causes:
  - Connections held too long (OSIV)
  - Inefficient queries
  - Connection leaks
  - Undersized pool

</div>


:: right ::
### Symptoms:

<div class="bg-red-100 rounded-lg p-4 mb-4">
  <ul class="list-disc pl-5 text-red-700">
    <li>Increasing request latency</li>
    <li>HikariCP connection timeout exceptions</li>
    <li>Requests queuing up</li>
    <li>Application becomes unresponsive</li>
  </ul>
</div>

<div class="bg-amber-100 rounded-lg p-4 mt-4">
  <h3 class="font-bold text-amber-700 mb-2">Common Indicators:</h3>
  <pre class="text-xs text-amber-700">HikariPool-1 - Connection is not available, 
request timed out after 30000ms.HikariPool-1 - Thread starvation or clock leap
detected (housekeeper delta=XXms).</pre>
</div>

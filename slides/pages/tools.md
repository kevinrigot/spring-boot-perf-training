---
layout: section
color: red
---

# Diagnostic Tools & Observability
<hr>

Identifying performance bottlenecks

---
layout: top-title
color: red
---

:: title ::
# Performance Troubleshooting: First Steps

:: content ::
### Observing Slow Response Time?

<ul>
	<li>High latency is usually the first symptom</li>
	<li>Users complain about "slowness"</li>
	<li>Timeouts start occurring under load</li>
	<li>Connection pool alerts triggered</li>
</ul>

---
layout: top-title-two-cols
color: red
---

:: title ::
# SQL Logging in Action

:: left ::
<div class="bg-blue-100 rounded-lg p-4 mt-4">
  <p class="font-bold text-blue-700">During Development:</p>
  <p class="text-blue-700 text-sm">Always keep SQL logging enabled to catch N+1 queries and other issues early in the development cycle</p>
</div>


Enable SQL Logging:

```properties 
# application-local.properties or application-local.yml

spring.jpa.show-sql=true
```

:: right ::
### What to Look For:

<ul class="ns-c-tight">
<li>Repeated Similar Queries: Indicator of N+1 problems</li>
<li>Unexpected Query Volume: Too many queries for simple operations</li>
</ul>

---
layout: top-title-two-cols
color: red
---

:: title ::
# Distributed Tracing & Observability

:: left ::
<div class="flex items-center">
<div class="bg-gray-200 rounded-lg p-4 ns-c-tight">
  <p class="text-sm">View transaction breakdown with time spent in:</p>
  <ul class="list-none text-sm">
	<li>HTTP processing</li>
	<li>Database queries</li>
	<li>External service calls</li>
	<li>Internal application processing</li>
  </ul>
</div>
</div>
<div class="bg-blue-100 rounded-lg p-4 mt-4">
  <p class="font-bold text-blue-700">Requierements in pom.xml</p>  
  <ul>
  <li>observability-spring-boot-starter 6.0 or higher</li>
  <li>jib-maven-plugin image: eclipse-temurin:21-jdk-3.0.0 or higher</li>
  </ul>
</div>


:: right ::
<div class="relative h-full flex flex-col justify-center">
  <!-- Thumbnail of first image (always visible) -->
  <div class="cursor-pointer mb-4">
    <img src="/images/observa-1.png" alt="Observability transactions" class="w-full border-2 hover:border-purple-500 rounded" />
  </div>
  
  <!-- Thumbnail of second image (always visible) -->
  <div class="cursor-pointer" >
    <img src="/images/observa-2.png" alt="Observability details" class="w-full border-2 hover:border-purple-500 rounded" />    
  </div>

</div>
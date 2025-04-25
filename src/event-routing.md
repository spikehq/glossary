---
excerpt: Event routing is the process of directing incident alerts to the appropriate teams or individuals based on predefined rules and criteria.
term: Event Routing
---
## What Is Event Routing

Event routing is the process of directing incident alerts to the appropriate teams or individuals based on predefined rules and criteria. It uses factors like service ownership, technical domain, time of day, and incident attributes to determine who should receive notification about an event.

## Why Is Event Routing Important

Event routing reduces response time by immediately notifying the right people about incidents. It prevents alert fatigue by ensuring team members only receive relevant notifications. Proper routing also improves accountability by clearly assigning ownership of different types of incidents.

## Example Of Event Routing

When a customer-facing API returns errors, the monitoring system detects the issue and routes the alert directly to the API team's on-call engineer. Meanwhile, a database performance alert is routed to the database team, and a security alert goes to the security operations center.

## How To Implement Event Routing

- Create a service map that identifies owners for each component of your infrastructure
- Define routing rules based on incident attributes like service, severity, and error type
- Configure fallback routes for when primary recipients are unavailable
- Set up intelligent routing that considers on-call schedules and workload balancing
- Implement feedback mechanisms to improve routing accuracy over time

## Best Practices

- Maintain up-to-date service ownership documentation
- Avoid routing alerts to groups or distribution lists where ownership becomes unclear
- Periodically audit routing effectiveness by reviewing incident response times
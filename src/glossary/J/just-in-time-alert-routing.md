---
excerpt: Just-in-time Alert Routing notifies the right person or team based on context like schedules or incidents.
term: Just-in-time Alert Routing
---
## What Is Just-in-time Alert Routing

Just-in-time Alert Routing sends notifications directly to the most relevant person or team based on current context. This context includes on-call schedules, service ownership, and existing incident states. It avoids static, broad distribution lists.

## Why Is Just-in-time Alert Routing Important

This approach speeds up incident acknowledgment by reaching the right expert faster. It reduces noise and alert fatigue for teams not directly involved. This helps responders focus on relevant issues quickly.

## Example Of Just-in-time Alert Routing

An alert triggers for a specific microservice. The system checks the current on-call schedule for the team owning that service. It routes the alert only to the engineer currently on-call for that specific team, bypassing others.

## How To Implement Just-in-time Alert Routing

- Maintain accurate on-call schedules and service ownership data
- Use an alerting platform that supports dynamic routing rules
- Map dependencies between services and infrastructure components
- Configure rules based on context like time of day, alert severity, or related active incidents

## Best Practices

- Keep routing information (schedules, ownership) constantly updated
- Start with simple, clear routing rules and refine over time
- Test routing configurations regularly to verify they work as expected

## Common Pitfalls To Avoid

- Outdated data leading to alerts sent to the wrong people
- Overly complex rules that are hard to manage or troubleshoot
- Lack of fallback mechanisms if the primary on-call person doesn't respond
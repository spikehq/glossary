---
excerpt: Dynamic alert routing is an incident management capability that automatically directs alerts to the most appropriate responders based on factors like alert type, severity, time of day, and team workload.
term: Dynamic Alert Routing
---
## What Is Dynamic Alert Routing

Dynamic alert routing is an incident management capability that automatically directs alerts to the most appropriate responders based on factors like alert type, severity, time of day, and team workload. It adjusts routing rules in real-time as conditions change.

## Why Is Dynamic Alert Routing Important

Dynamic alert routing reduces response time by sending alerts directly to the right people. It prevents alert fatigue by distributing workload evenly across teams and ensures critical issues receive immediate attention while routine alerts follow standard channels.

## Example Of Dynamic Alert Routing

When a database alert triggers during business hours, it routes to the database team. The same alert at night routes to the on-call engineer. If that engineer doesn't respond within five minutes, the system automatically escalates to a secondary responder.

## How To Implement Dynamic Alert Routing With Spike

- Set up routing rules in Spike based on alert source, severity, time, or custom tags.
- Assign alerts to specific teams or individuals, so the right people get notified.
- Use Spike’s on-call schedules to change routing as shifts change.
- Create escalation rules to alert backup responders if the first person doesn’t respond.
- Adjust routing rules anytime from the web dashboard without downtime.

Route alerts where they matter most. Try dynamic alert routing now with [Spike](https://app.spike.sh/signup).
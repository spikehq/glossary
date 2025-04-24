---
excerpt: Alert Aggregation is the process of combining multiple related alerts into a single notification or incident.
term: Alert Aggregation
---
## What Is Alert Aggregation

Alert Aggregation is the process of combining multiple related alerts into a single notification or incident. It groups similar alerts that occur within a defined timeframe or share common attributes to reduce noise and provide a clearer picture of the underlying issue.

## Why Is Alert Aggregation Important

Alert Aggregation prevents alert storms that overwhelm responders during major incidents. It reduces notification fatigue, helps teams see patterns across multiple systems, and allows responders to focus on the root cause rather than symptoms.

## Example Of Alert Aggregation

When a network switch fails, it might trigger dozens of alerts from dependent services. Alert aggregation combines these into a single incident that shows "20 services affected by network switch failure" rather than sending 20 separate notifications.

## How To Implement Alert Aggregation With Spike

- Set up Spike to group similar alerts from the same source or with matching tags.
- Use time windows to combine alerts that happen close together.
- Alerts with the same issue type merge into a single incident, showing the total impacted.
- Review a single timeline in Spike for all related activity and updates.
- Change aggregation rules anytime to fit your team’s workflow.

Combine related alerts and cut notification chaos. Try alert aggregation now with [Spike](https://app.spike.sh/signup).
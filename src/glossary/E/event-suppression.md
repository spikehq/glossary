---
excerpt: Event suppression is the temporary blocking of alerts from specific systems or services during planned maintenance, testing, or known outages.
term: Event Suppression
---
## What Is Event Suppression

Event suppression is the temporary blocking of alerts from specific systems or services during planned maintenance, testing, or known outages. It prevents unnecessary notifications when teams are already aware of an issue or when alerts are expected.

## Why Is Event Suppression Important

Event suppression reduces noise during known situations, allowing teams to focus on unexpected incidents. It prevents alert fatigue during maintenance windows and helps maintain the urgency of alerts that do come through. This creates clearer communication channels during critical work.

## Example Of Event Suppression

During a planned database migration, the operations team suppresses all database connectivity alerts for a four-hour window. This prevents dozens of expected alerts from triggering incident responses, while still allowing other critical system alerts to reach the on-call team.

## How To Implement Event Suppression

- Create time-bound suppression windows with clear start and end times
- Define scope carefully—suppress only relevant alerts while allowing others through
- Document all suppression windows with justification and owner contact information
- Implement emergency override capabilities for critical alerts
- Set up automatic expiration of suppression rules to prevent forgotten suppressions

## Best Practices

- Make suppression windows as narrow as possible in both time and scope
- Communicate suppression windows to all stakeholders before implementation
- Review expired suppressions regularly to identify recurring issues that might need permanent fixes
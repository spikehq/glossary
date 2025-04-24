---
excerpt: Synthetic Monitoring is a proactive monitoring technique that simulates user interactions with systems and applications to detect problems before real users encounter them.
term: Synthetic Monitoring
---
## What Is Synthetic Monitoring

Synthetic Monitoring is a proactive monitoring technique that simulates user interactions with systems and applications to detect problems before real users encounter them. It runs scripted transactions at regular intervals to verify functionality, performance, and availability.

## Why Is Synthetic Monitoring Important

Synthetic Monitoring helps detect issues during low-traffic periods or before users report problems. It provides consistent, predictable testing of critical paths and can measure performance from different geographic locations. This approach reduces incident impact by catching problems early.

## Example Of Synthetic Monitoring

A synthetic monitoring script simulates a customer logging in, adding items to a cart, and completing a purchase on an e-commerce site. When the checkout step begins failing, the system triggers an alert, allowing the team to fix the issue before real customers experience problems.

## How To Implement Synthetic Monitoring

- Identify critical user journeys to monitor
- Create scripts that simulate these journeys
- Set appropriate test frequencies and locations
- Establish baseline performance metrics
- Configure alerting thresholds
- Integrate with your incident management system

## Best Practices

- Test from multiple geographic locations to match your user base
- Balance test frequency against resource consumption
- Include assertions that verify both functionality and performance
---
excerpt: Latency Alerts are automated notifications triggered when system response times exceed predefined thresholds.
term: Latency Alerts
---
## What Are Latency Alerts

Latency Alerts are automated notifications triggered when system response times exceed predefined thresholds. These alerts help teams identify performance degradations before they impact users or escalate into outages.

## Why Are Latency Alerts Important

Latency issues often precede major outages, making them valuable early warning signals. By detecting slow responses before complete failures occur, teams can address problems proactively. This reduces downtime, improves user experience, and prevents potential revenue loss.

## Example Of Latency Alerts

An e-commerce platform sets a 300ms threshold for API response times. When response times reach 350ms, an alert triggers automatically, notifying the on-call engineer who discovers and fixes a database query issue before customers notice any slowdown.

## How To Implement Latency Alerts

- Define appropriate latency thresholds for different services
- Set up monitoring tools to measure response times continuously
- Configure alerting rules with appropriate urgency levels
- Route alerts to the right teams based on the affected components
- Implement progressive alerting for worsening conditions

## Best Practices

- Set different thresholds for different services based on their requirements
- Include context in alerts to speed up troubleshooting
- Review and adjust thresholds regularly based on historical performance
---
excerpt: Latency is the time delay between an action and the resulting response in a system.
term: Latency
---
## What Is Latency

Latency is the time delay between an action and the resulting response in a system. In incident management, latency often refers to response time delays in applications, networks, or services that can degrade user experience or indicate underlying problems.

## Example Of Latency

A database query that normally takes 50 milliseconds begins taking 2 seconds to complete. This latency increase causes the entire application to slow down. Monitoring detects this change and alerts the team, who discover that a missing index is causing the slowdown.

## How To Implement Latency Monitoring

- Define acceptable latency thresholds for critical services
- Implement monitoring at multiple points in your system
- Set up alerts for when latency exceeds normal ranges
- Use synthetic transactions to test latency proactively
- Track latency trends over time to identify gradual degradations

## Best Practices

- Monitor latency from the end-user perspective, not just internal metrics
- Establish baseline performance metrics during normal operations
- Create latency heat maps to visualize problem areas in complex systems
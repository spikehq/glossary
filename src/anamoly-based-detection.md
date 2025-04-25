---
excerpt: Anomaly-Based Detection is a monitoring approach that identifies unusual patterns or behaviors in systems that deviate from established baselines.
term: Anomaly-Based Detection
---
## What Is Anomaly-Based Detection

Anomaly-Based Detection is a monitoring approach that identifies unusual patterns or behaviors in systems that deviate from established baselines. Rather than looking for known issues, it spots abnormal conditions that might indicate emerging incidents before they cause significant impact.

## Why Is Anomaly-Based Detection Important

Traditional threshold-based monitoring only catches known issues after they cross predefined limits. Anomaly detection can identify subtle, unusual patterns that precede major incidents, enabling earlier intervention. This proactive approach reduces downtime, minimizes impact, and gives teams more time to respond before users are affected.

## Example of Anomaly-Based Detection

A payment processing system typically handles 100 transactions per second with response times under 200ms. The anomaly detection system notices that while transaction volume remains normal, response times are gradually increasing by 5ms every minute—a pattern that preceded a major outage last quarter. It triggers an alert hours before traditional thresholds would be breached.

## How to Implement Anomaly-Based Detection

- Collect baseline data across systems during normal operations
- Select appropriate anomaly detection algorithms for your data types
- Start with critical systems where early detection provides the most value
- Tune detection sensitivity to balance false positives and missed anomalies
- Integrate with incident management workflows for seamless response

## Best Practices

- Establish seasonal and time-of-day baselines to account for normal variations
- Combine multiple detection methods for different types of anomalies
- Provide context with anomaly alerts to help responders understand the significance
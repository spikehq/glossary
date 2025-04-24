---
excerpt: An anomaly in incident management is an unexpected deviation from normal system behavior that may indicate a problem.
term: Anomaly
---
## What Is Anomaly

An anomaly in incident management is an unexpected deviation from normal system behavior that may indicate a problem. Unlike threshold-based alerts, anomalies represent unusual patterns that might not violate specific thresholds but still represent potential issues requiring investigation.

## Why Is Anomaly Important

Anomaly detection catches subtle issues that traditional threshold monitoring might miss. It identifies problems before they become severe enough to trigger standard alerts, enabling proactive response. Anomaly-based monitoring adapts to changing environments and can detect novel failure modes.

## Example Of Anomaly

A database typically processes 1,000 queries per minute with consistent patterns. An anomaly detection system flags when query patterns suddenly change—even though total volume remains normal. This early warning helps the team discover and fix an inefficient query before it causes performance issues.

## How To Detect Anomaly

- Collect baseline data across multiple metrics and timeframes
- Deploy machine learning algorithms to identify normal behavior patterns
- Set sensitivity levels appropriate to each service
- Create workflows for anomaly investigation
- Integrate anomaly detection with existing monitoring systems

## Best Practices

- Start with critical services where early detection provides the most value
- Provide context with anomaly alerts to speed investigation
- Continuously train detection models with feedback on true/false positives
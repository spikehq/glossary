---
excerpt: Suppression Rules are conditions that prevent alerts from being generated or sent to responders when certain criteria are met.
term: Suppression Rules
---
## What Are Suppression Rules

Suppression Rules are conditions that prevent alerts from being generated or sent to responders when certain criteria are met. They help reduce alert noise by filtering out known issues, expected behaviors, or duplicate notifications that don't require immediate attention.

## Why Are Suppression Rules Important

Suppression Rules combat alert fatigue by reducing the volume of non-actionable notifications. They help incident teams focus on genuine problems that need attention. By filtering out noise, these rules improve response times for critical issues and prevent responder burnout.

## Example Of Suppression Rules

During a planned database maintenance window, the monitoring system would normally generate dozens of connectivity alerts. A suppression rule temporarily blocks these expected alerts during the maintenance period, allowing the team to focus on any unexpected issues that might arise.

## How To Implement Suppression Rules With Spike

- Go to your Spike dashboard and open the incident settings.
- Set up rate limiting to suppress duplicate incidents for one minute.
- Spike auto-suppresses repeat alerts when an incident is acknowledged or resolved.
- No extra steps are needed—Spike handles suppression for you.

Cut alert noise and focus on real issues. Try Spike’s built-in suppression rules by signing up [here](https://app.spike.sh/signup).
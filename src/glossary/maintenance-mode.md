---
excerpt: Maintenance Mode is a planned state for systems or services where they're temporarily taken offline or have limited functionality to allow for updates, repairs, or other maintenance activities without triggering unnecessary alerts or incidents.
term: Maintenance Mode
---
## What Is Maintenance Mode

Maintenance Mode is a planned state for systems or services where they're temporarily taken offline or have limited functionality to allow for updates, repairs, or other maintenance activities without triggering unnecessary alerts or incidents.

## Why Is Maintenance Mode Important

Maintenance Mode prevents false alerts during planned work, reducing alert fatigue among responders. It creates a clear record of maintenance activities, helps teams perform necessary updates without disruption, and maintains accurate system availability metrics by excluding planned downtime.

## Example Of Maintenance Mode

During a database upgrade, an operations team activates Maintenance Mode for 2 hours. This suppresses all related alerts while they perform the upgrade, preventing on-call engineers from receiving notifications about the expected downtime.

## How To Implement Maintenance Mode

- Create a maintenance schedule with clear start and end times
- Configure your incident management system to suppress alerts for affected services
- Notify stakeholders about the maintenance window
- Document all activities performed during maintenance
- Verify system functionality before exiting Maintenance Mode

## Best Practices

- Set automatic expiration times to prevent systems from being left in Maintenance Mode
- Maintain detailed logs of all maintenance activities for future reference
- Allow emergency alerts to bypass Maintenance Mode for critical issues
---
excerpt: Warm standby keeps a backup system updated and ready to manually activate when the primary system fails.
term: Warm Standby
---
## What Is Warm Standby

Warm standby is a high availability approach where a secondary system receives regular data updates from the primary system. It is ready to take over operations if the primary fails. However, the switch typically requires manual intervention.

## Why Is Warm Standby Important

It significantly reduces recovery time during incidents affecting the primary system. This minimizes service downtime and potential data loss. It provides resilience for critical components of your infrastructure or incident management platform.

## Example Of Warm Standby

A company's main incident database server fails. The IT team manually activates the warm standby server. This server has recent data copies, allowing incident response to continue with minimal interruption.

## How To Implement Warm Standby

- Set up identical primary and secondary system instances
- Configure a mechanism for regular data replication to the secondary system
- Establish monitoring to detect failures on the primary system
- Define and document the manual failover process clearly
- Regularly test the failover procedure to validate its effectiveness

## Best Practices

- Test the failover process frequently under realistic conditions
- Closely monitor the data replication lag between primary and secondary
- Make sure the secondary system has sufficient capacity to handle the load
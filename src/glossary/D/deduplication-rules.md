---
excerpt: Deduplication rules are configurations that automatically identify and combine duplicate or related alerts into a single incident.
term: Deduplication Rules
---
## What Are Deduplication Rules

Deduplication rules are configurations that automatically identify and combine duplicate or related alerts into a single incident. These rules help prevent alert storms by recognizing when multiple alerts stem from the same root cause or affected system.

## Why Are Deduplication Rules Important

Deduplication rules prevent alert fatigue by reducing the volume of notifications during incidents. They help incident responders focus on the core issue rather than symptoms, streamline communication, and provide a clearer picture of the actual incident scope and impact.

## Example Of Deduplication Rules

A database server becomes unavailable, triggering alerts from the database itself, three dependent applications, and multiple monitoring checks. Deduplication rules automatically group these into a single incident ticket, noting all affected systems while maintaining a single communication thread.

## How To Create Deduplication Rules

- Define criteria for identifying related alerts (time window, services, error types)
- Configure correlation logic in your incident management platform
- Test rules with historical incident data to validate effectiveness
- Create override mechanisms for critical alerts that should never be suppressed
- Review and refine rules regularly based on incident response feedback

## Best Practices

- Balance between over-grouping (missing separate issues) and under-grouping (alert storms)
- Include clear indicators of which alerts were deduplicated in incident records
- Maintain an audit trail of all original alerts for investigation purposes
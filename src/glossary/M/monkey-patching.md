---
excerpt: Monkey patching in incident management refers to the practice of making temporary, quick fixes to code or systems during an incident without following standard change procedures.
term: Monkey Patching
---
## What Is Monkey Patching

Monkey patching in incident management refers to the practice of making temporary, quick fixes to code or systems during an incident without following standard change procedures. This technique involves modifying system behavior at runtime to address urgent issues, typically as a short-term solution until a proper fix can be implemented.

## Why Is Monkey Patching Important

Monkey patching provides a way to quickly resolve critical incidents when time is of the essence. It helps minimize downtime and service disruption by applying immediate fixes to production systems. However, these patches should be treated as temporary measures rather than permanent solutions.

## Example Of Monkey Patching

During a major service outage, an engineer discovers that a third-party API is causing system crashes. Instead of waiting for the vendor to fix the issue, they implement a monkey patch that catches the problematic responses and handles them gracefully, restoring service while a proper fix is developed.

## How To Implement Monkey Patching

- Document the current state before making any changes
- Apply the minimal change needed to resolve the immediate issue
- Test the patch in a staging environment if possible
- Implement the patch with clear comments explaining the temporary nature
- Create a ticket for proper remediation after the incident

## Best Practices

- Always document monkey patches in your incident log and postmortem
- Replace monkey patches with proper fixes as soon as the immediate crisis is resolved
- Limit monkey patching access to experienced team members who understand the potential risks
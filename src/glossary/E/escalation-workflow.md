---
excerpt: An escalation workflow is a predefined sequence of steps that determines how and when an incident is routed to different team members or teams based on factors like severity, time elapsed, or special requirements.
term: Escalation Workflow
---
## What Is Escalation Workflow

An escalation workflow is a predefined sequence of steps that determines how and when an incident is routed to different team members or teams based on factors like severity, time elapsed, or special requirements. It ensures the right people are engaged at the right time during incident response.

## Why Is Escalation Workflow Important

Escalation workflows prevent incidents from falling through the cracks by establishing clear ownership and response paths. They reduce resolution time by automatically involving appropriate expertise when needed. Well-designed workflows balance workload across teams and provide accountability throughout the incident lifecycle.

## Example Of Escalation Workflow

A critical payment processing error is detected at 2 AM. The escalation workflow first alerts the on-call engineer, who has 15 minutes to acknowledge. If no response occurs, it automatically escalates to the team lead and sends SMS notifications. After 30 minutes without resolution, it alerts the engineering director and initiates a conference bridge.

## How To Build Escalation Workflow With Spike

- Create an escalation policy in Spike with as many steps as you need.
- Add team members and pick alert channels like phone, Slack, or email for each step.
- Set wait times between steps so alerts move to the next person if there’s no response.
- Use templates to get started fast, then customize for your team’s needs.
- Link the policy to your service or integration so incidents follow your workflow.
- Adjust and refine your policy as your team grows or your needs change.

Set up your escalation workflow in [Spike](https://app.spike.sh/signup) and make sure every incident reaches the right person, every time.
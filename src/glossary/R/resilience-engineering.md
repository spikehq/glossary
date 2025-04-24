---
excerpt: Resilience engineering is an approach to incident management that focuses on building systems that can withstand, adapt to, and recover from failures.
term: Resilience Engineering
---
## What Is Resilience Engineering

Resilience engineering is an approach to incident management that focuses on building systems that can withstand, adapt to, and recover from failures. Rather than just preventing failures, it acknowledges that failures will occur and designs systems to be robust enough to continue functioning despite problems.

## Why Is Resilience Engineering Important

Resilience engineering helps organizations maintain critical services even during incidents. It shifts focus from blame to learning, improves system reliability, and reduces the business impact of failures. This approach is especially valuable in complex, interconnected systems where not all failures can be predicted.

## Example Of Resilience Engineering

A payment processor implements circuit breakers in their microservices architecture. When one service begins to fail, the circuit breaker prevents cascading failures by gracefully degrading non-essential features while maintaining core payment functionality.
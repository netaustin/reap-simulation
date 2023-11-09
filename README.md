# Re-Entry Simulation

Welcome to the source code of the Re-Entry Simulation, where participants learn about what life is 
like for people  returning from a period of incarceration.

This project is maintained by Austin Smith (@netaustin on Github) and pull requests can be addressed
to him.

Special thanks to the Re-Entry Acceleration Program (REAP) at Columbia Business School, where this 
was originally developed as an MBA Student project, and to Sandra Navalli, the program's 
coordinator, Damon Phillips, the professor who created the Re-entry curriculum at Columbia, Aedan 
MacDonald, the founder of Justice Through Code (JTC) at Columbia, and countless others who have 
provided feedback and participated in test runs of the simulation.

## Implementation Principles

This program is written in "Vanilla JavaScript" which is to say, no third party libraries are 
allowed. While this occasionally leads to challenges, it also means that the application stays 
stable over years rather than breaking when libraries change, are deprecated, or worse, face 
security issues. The code is loosely reactive and purely functional.

Likewise, no server-side resources are allowed. This makes it easier to maintain, cheaper to host, 
and harder to break.

Pull requests that add either server-side components or third-party JavaScript libraries will not 
be merged. If you have an idea that requires one of these things, get in touch!

## Running the Simulation Locally

There are many ways to serve a directory locally. Python 3 provides one: `python3 -m http.server` 
and should be available out of the box on a MacOS or Linux system. It's not recommended to access 
the simulation using the file:// protocol which some browsers implement.

## Deploying the Simulation

Merges to the `main` branch automatically deploy the simulation.
# Analytics Plan
Infrastructure
 * Lightweight serverless (i.e. Heroku) infrastructure
 * Serverless data storage
 * Python / Flask

Features
 * Dashboard for instructors / administrators
 * Ability to create a new "session" and invite multiple students to use the simulation
   * Instructor gets a link from the dashboard to share with the students
   * For example, reapsim.org/sim.html?session=PHILLIPS-2026-WHARTON
   * Or, reapsim.org/sim.html?session={UUID} or {ID}
   * Sessions are stored in the dashboard with name, date, and a unique ID (uuid or primary key int)
 * Students are presented with a modal to start the sim
   * Prompt for their name and email address
   * Send the name and email address to the server
   * Receive from the server a UUID that will be used as session state going forward
 * If students do NOT arrive at sim.html with a session identifier, do not prompt them for their name and email
   * But do ask for a session ID from the server, which would be anonymous and would be associated with a generic session
   * i.e., "Self-Directed Anonymous Simulations" could be the name for all simulations that do not occur in a managed setting
 * Set the session identifier in local storage
   * If a user arrives at the simulation with a session ID already in local storage, load their latest backpack from the server
   * Ask them if they want to pick up their previous simulation or start a new one
 * Send backpack from dispatch() function to database
   * Store the backpack as raw JSON in a BLOB or TEXT field alongside the UUID
   * Store hours elapsed as an integer
   * Store money as an integer
   * Store health as an integer
 * Reporting
   * Load most recent backpack state for every student
   * Show distribution curves of time, money, health
   * How many arrests, hospitalizations, violations
   * How many students have jobs
   * Where students are living (pie chart)
     * Unhoused, halfway house, rental apartment
     * Need to check backpack states to calculate this
   * A separate, "hidden" dashboard for facilitator use only
     * List outlier students by name on several dimensions to facilitate discussion
     * List students by hours elapsed to track participation

Database Schema
 * Every table should carry created_at and updated_at
 * Sessions
   * ID
   * Name
   * Date
   * Type (managed, self-directed)
   * Facilitator Name
 * Students
   * ID (if UUID, also the session key)
   * UUID (if ID is auto-increment numeric, use a separate UUID for session identification)
   * Name
   * Email
   * Session (foreign key)
 * States
   * Student ID
   * Backpack Contents as a BLOB
   * Time
   * Money
   * Health
   * Arrest count
   * Hospitalization count
   * Violations

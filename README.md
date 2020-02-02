## Sprint 1 Planning
Sprint 1: 16-20 December 2019
Planning: 16 December 2019
Participants: Elin Andersson Björnetorp, Trupti Gaonkar, Basel Munawwar, Ayumi Nakamura

### Workflow
- We work with Scrum.
Sprint 1: 16-20 December 2019
Sprint 2: 23 December 2019 - 3 January 2020
Sprint 3: 7-13 January 2020

- We will have a Daily Scrum over Slack on the days we do not have classes.

- Basel reviews codes for Elin, Trupti and Ayumi. Basel’s codes are reviewed by Elin during sprint 1, by Trupti during sprint 2 and by Ayumi during sprint 3.

- We follow Gitflow.
1. A develop branch is created from master.
2. A release branch is created from develop.
3. Feature branches are created from develop.
4. When a feature is complete it is merged into the develop branch.
5. When the release branch is done it is merged into develop and master.
6. If an issue in master is detected a hotfix branch is created from master.
7. Once the hotfix is complete it is merged to both develop and master.
8. The beginning of titles of Github issues specify names of the branches.

### Responsibilities
- Elin works with documentation and backend testing
- Trupti works with frontend (Lobby component).
- Basel works with backend.
- Ayumi works with frontend testing.

### Architecture
We build our app with MERN-stack.
> Frontend: React (functional components), Material UI
> Backend: MongoDB, Node.js, Express
> Testing: react-testing-library

## Sprint 1 Retrospective
Sprint 1: 16-20 December 2019
Retrospective: 20 December 2019
Participants: Elin Andersson Björnetorp, Trupti Gaonkar, Basel Munawwar, Ayumi Nakamura

### What went well during Sprint 1
- We worked well together.
- We agreed on what framework and libraries to use and managed to - define the issues in a short period of time.
- We managed to do what we planned to do.
- Division of tasks worked well.

### What needs to be improved for Sprint 2
- Complete the project description before we start working
- Schedule time for retrospective and sprint planning when all the project members can participate.
- Create separate issues for researching test libraries and writing actual codes for testing.

### Actions
- Create Kanban board with Github Project to see clearly what needs to be done.
---------------------------------------------------------------------------------------------------------------------

## Sprint 2 Planning
Sprint 2: 23 December 2019 - 3 January 2020
Planning: 20 December 2019
Participants: Elin Andersson Björnetorp, Trupti Gaonkar, Basel Munawwar, Ayumi Nakamura

### Responsibilities

- Elin focuses on frontend Game component, and leaves testing.
- Trupti continues to work on frontend Lobby component.
- Basel continues backend.
- Ayumi continues frontend testing and take over backend testing from Elin.

### Design
- We will use Chessboard.jsx for rendering chess components.
https://chessboardjsx.com/
- We use Jest and supertest for backend testing.

## Sprint 2 Retrospective
Sprint 2: 23 December 2019 - 3 January 2020
Retrospective: 3 January 2020
Participants: Elin Andersson Björnetorp, Trupti Gaonkar, Ayumi Nakamura

### What went well during Sprint 1
- We all knew what we needed to do and did our own work.
- We helped each other.
- We learned to communicate using pull requests.
- We got a chance to learn something new such as NoSQL database and test frameworks.

### Actions
- Keep our good work!
--------------------------------------------------------------------------------------------------------------------

## Sprint 3 Planning
Sprint 3: 7 - 13 January 2020
Planning: 3 January 2020
Participants: Elin Andersson Björnetorp, Trupti Gaonkar, Ayumi Nakamura

### Responsibilities
- Elin continues to work on Game component.
- Trupti continues to work on Lobby component.
- Basel continues to work on backend and code reviews.
- Ayumi continues to work on testing.

### Design
- We need to add frontend testing with for example Enzyme for edge cases that are not covered by snapshot testing with react-testing-library.

### Next step
- Next and last retrospective on 13 January.

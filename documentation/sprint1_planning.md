# Sprint 1 Planning
Sprint 1: 16-20 December 2019
Planning: 16 December 2019
Participants: Elin Andersson Björnetorp, Trupti Gaonkar, Basel Munawwar, Ayumi Nakamura

## Workflow
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

## Responsibilities
- Elin works with documentation and backend testing
- Trupti works with frontend (Lobby component).
- Basel works with backend.
- Ayumi works with frontend testing.

## Architecture
We build our app with MERN-stack.
> Frontend: React (functional components), Material UI
> Backend: MongoDB, Node.js, Express
> Testing: react-testing-library
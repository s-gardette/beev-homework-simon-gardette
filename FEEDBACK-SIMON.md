## Approach & Thought Process

- My main focus was on making code that works for the end user and limiting the edge cases. I feel like on this type of project the user demands evolve quickly and change over time. But it depends on the level of maturity of the saas product. If it's a well established product (as you probably are) my approach would be way more cautious.

- I tried to balance between following the spec exactly and making pragmatic decisions where trade-offs were necessary. Mostly because I was not familiar with some of the choices you used. I might have written some anti-patterns (I think of the fetchOrThrow function which might not be the best idea) due to partial knowledge.

## Time spent

10 to 12 hours over 4 days.

I've spent a lot more time than the initial estimate. Mostly learning the elements I didn't know, trying to mock a db in backend tests and implementing proper migrations.

I think I could have done a very rough backend in two to three hours. Frontend would have taken around the same time if I had only a single table and didn't try to do a proper datatable with multi filters. I feel like I spent 3 hours alone on it.

(full disclosure, not to put it as an excuse, I was also working on a client project in Php/Nuxt. It might have messed with some code because I had to make the intellectual switch every time. It might also have affected my structure choices)

## Backend

- Data Model : Done
- API endpoints : Done
    - Class validation : Done
    - Caching : Done (I mark as done but I'm not fully sure, I haven't tested it. I'm absolutely n ot familiar with nest caching strategies)
    - Error MiddleWare: Partial (the middleware does minimal logging and there's an exception handler but it could be greatly improved I think)
    - Services Unit test : Partial
    - E2e unit test : Failed (I didn't have time to make them really useful). I lost a lot of time trying to make db mocking work with limited success

## Frontend

- Dashboard Overview : Done
    - Fleet summary statistics : Done
    - Fleet status : Done (as a data table)
    - Environmental impact metrics
- Vehicle Management
    - List view with sorting and filtering : Done (as the same data table)
    - Add/Edit vehicle forms : Done
- Analytics Visualization using analytics endpoints : Barebone, I've mocked the datas cause I was missing some time to implement proper datas stream (WS etc.)

## Technical

- Use TypeScript : Done
- Implement using shadcn/ui components : Done
- Style with Tailwind CSS : Done
- Use for data fetching : Done
- Include unit tests for key components : Failed (Didn't have the time)
- Implement error boundaries : Partial (I think I have missed some but didn't have more time to verify)
- Add loading states : Partial (it's really barebones, I've made ugly skeletons)

# Notes and thoughts about the exercise

- In the real world I would have asked questions before building the app. As it's an exercise I tried to work in isolation but the narrow scope had me skip stuff I feel should have been in the app. It might have confused me more than helped me to not have evident structure or features for this app.

- I should not have lost that much time trying to make e2e tests mock db the best way and rather do it the way I'm more used to. (Spin a real docker db and destroy it after tests.) I wanted to make it the best way (it was also an occasion to learn something). But in the end it made me lose much time.

- Database design feels ugly. Vehicle Status is a one to one atm. But in the real world it's a value that changes over time and we want to log the values as a time series.  
  Depending on the frequency of updates we could even have the data of charge level stored in redis and store an aggregation in postgres. (admitting charge arrives at a second level or below)

- I had a lot of struggles at the start as I'm not used to TypeOrm / Jest. I skipped Vitest all along as I had strange errors and I felt like I didn't have the time to investigate.

- For the rest I really liked the use of react query. Tanstack is a real good approach to React and it eliminates a lot of hassle. I'm more inclined to use a framework in my work (let's just say for SEO purposes) as I'm mainly focused on public-facing apps but it feels really natural. (once I remembered that fetch has no error handler on its own. I generally use axios, I know I should drop it as it's overkill most of the time but force of habit.)

# What I should have / would like to implement (in no particular order)

- Don't expose the db and redis endpoint port directly in compose in prod mode and make profiles to expose them in dev. [docker service profiles](https://docs.docker.com/compose/how-tos/profiles/)
- Create a webhook to receive vehicle status and a websocket to diffuse it to the client assuming it changes regularly. -> mostly have the ability to receive real time data. (also proper webhook securing).
- As data are not vehicle based but rather model based and the charge level does not evolve the analytics page feels really static. It would have made more sense if we added the actual usage of the cars (like real time distance travelled or a timeline with how much time each vehicle is active to extrapolate environmental values.) But I might have missed the point completely.
- Improve the overall UI. (the datatable feels junky and doesn't translate well on mobile)
- Frontend tests. I've implemented one for the demo but it's really barebones. Overall I feel like I should have made much better tests either in frontend and backend. But I chose to have something working for the end user rather than a perfect test suite.
- Prod deployment : For a small scoped project like this a docker swarm should be enough. I've provided an example github action that deploys it to a pre configured machine but didn't have the time to do it. (full disclosure the workflow is a snippet I adapt for my small projects)
- Implement JWT auth / Cors. Overall user management.
- Implement [cypress](https://www.cypress.io/) for visual e2e test.
- Improve the swagger doc, probably also integrate redoc middleware (it's easier to use.)
- Implement simple monitoring (something like [newrelic](https://newrelic.com)) or prometheus if we intend to keep things in single docker compose.

# Known Bugs (in no particular order)

- The menu child elements do not align properly. I used the shadcn one, didn't have time to check what's conflicting.
- Chart Color doesn't change properly when i set it.

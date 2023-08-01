<p align="center" style="margin-bottom: 0px !important;">
  <img src="/src/assets/images/favicon.png" alt="favicon" align="center">
</p>
<h1 align="center" style="margin-top: 0px !important;">AstroChess</h1>
AstroChess is web application for playing chess with friends.
<br>

## Database Schema

<img src="/src/assets/images/supabase-schema.png" alt="database-schema" align="center">
This database schema is crucial for proper working of the astrochess app. It provides a few tables:
<ul>
  <li>users - contains all information about users</li>
  <li>games - stores data about games such as: players, time for each player, result</li>
  <li>moves - keeps information about moves in a particular game. FEN notation after move holds an game structure for simpler implementation</li>
</ul>

## Environment Variables

To run this project, you will need to add the following environment variables to your environment.ts file:

`supabaseUrl`
`supabaseApi`

The entire environment.ts file should be located in /src/environments/ and contains exported 'environment' constant with following syntax:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'YOUR SUPABASE URL',
  supabaseApi: 'YOUR SUPABASE API KEY',
};
```


## Authors

- [szymon-skalmierski](https://github.com/szymon-skalmierski)
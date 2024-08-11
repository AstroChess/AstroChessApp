<div align="center">
  <img src="/src/assets/images/favicon.png" alt="favicon" height="128px">
</div>
<h1 align="center" style="margin-top: 0px !important;">AstroChess</h1>
AstroChess is a web application for playing chess with friends. It's based on Chess.js library (chess logic), Nebular (UI kit) and Supabase (Database, Authentication, Games and Moves Management, Users Management, Realtime Response).
<br>

## Status
Still in development.

## Database Schema
<img src="/src/assets/images/supabase-schema.png" alt="database-schema">
This database schema is crucial for the proper functioning of the AstroChess app. It provides a few tables:
<ul>
  <li>users - contains all information about users</li>
  <li>games - stores data about games such as: players, time for each player and result</li>
  <li>moves - keeps information about moves in a particular game. FEN notation after each move holds a game structure for simpler implementation</li>
</ul>
Supabase's built-in auth feature is responsible for user authorization and authentication.

## Environment Variables
To run this project, you will need to add the following environment variables to your environment.ts file:
`SUPABASE_URL`
`SUPABASE_API`
The entire `environment.ts` file should be located in `/src/environments/` and contain exported `environment` constant with the following syntax:
```typescript
export const environment = {
  production: false,
  SUPABASE_URL: 'YOUR SUPABASE URL',
  SUPABASE_API: 'YOUR SUPABASE API KEY',
};
```

## Demo
The demo version is held on [astrochess.vercel.app](http://astrochess.vercel.app). Feel free to test it.

## Game Preview
<img src="/src/assets/images/layout/game.png" alt="Game Page">

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## License
This project is licensed under the MIT License.

## Author
- [szymon-skalmierski](https://github.com/szymon-skalmierski)

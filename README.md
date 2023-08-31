<p align="center" style="margin-bottom: 0px">
  <img src="/src/assets/images/favicon.png" alt="favicon">
</p>
<h1 align="center" style="margin-top: 0px !important;">AstroChess</h1>
AstroChess is a web application for playing chess with friends. It's based on Chess.js library (chess logic), Nebular (UI kit) and Supabase (Backend: Database, Authentication, Realtime Response).
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

## Environment Variables

To run this project, you will need to add the following environment variables to your environment.ts file:

`supabaseUrl`
`supabaseApi`

The entire `environment.ts` file should be located in `/src/environments/` and contain exported `environment` constant with the following syntax:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'YOUR SUPABASE URL',
  supabaseApi: 'YOUR SUPABASE API KEY',
};
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License.

## Author

- [szymon-skalmierski](https://github.com/szymon-skalmierski)
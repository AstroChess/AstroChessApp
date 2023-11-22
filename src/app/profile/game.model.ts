export interface Game {
  white_player: {
    id: string,
    username: string,
  };
  black_player: {
    id: string,
    username: string,
  };
  result: string;
}
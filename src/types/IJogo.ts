export interface IJogo {
  fixture: {
    id: number;
  };
  teams: {
    home: { name: string };
    away: { name: string };
  };
}
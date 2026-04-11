export interface IJogo {
  fixture: {
    id: number;
    date: string; // a API sempre retorna
    status: {
      short: string;
    };
  };

  teams: {
    home: {
      name: string;
      code?: string;
      logo?: string;
    };
    away: {
      name: string;
      code?: string;
      logo?: string;
    };
  };

  goals: {
    home: number | null;
    away: number | null;
  };
}
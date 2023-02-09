export interface IGroupedResult {
    date: string;
    firstParticipant: string;
    secondParticipant: string;
    firstTeam: string;
    secondTeam: string;
    firstScore: number;
    secondScore: number;
}

export interface IInputData {
    year: number;
    month: number;
    day: number;
}

export interface ITournamentsByDateItem {
    id: number;
    league: Record<string, any>;
    location: Record<string, any>;
    marker: string;
    start_date: string;
    status_id: 4;
    token: string;
    token_international: string;
}

export interface IMatchInfo {
    id: number;
    date: string;
    status_id: number;
    tournament: Record<string, any>;
    console: Record<string, any>;
    participant1: IParticipantInfo;
    participant2: IParticipantInfo;
}

export interface IParticipantInfo {
    id: number;
    nickname: string;
    score: number;
    photo: string;
    team: ITeamInfo;
    prevPeriodsScores?: string[];
}

export interface ITeamInfo {
    logo: string;
    id: number;
    token: string;
    token_international: string;
}

export default interface Friend {
  id: number,
  name: string,
  avatar: string,
  status: "offline" | "online" | "playing",
  friend_status: "requested" | "pending" | "accepted",
  games_played: number,
  games_won: number,
  gameID?: number,
}

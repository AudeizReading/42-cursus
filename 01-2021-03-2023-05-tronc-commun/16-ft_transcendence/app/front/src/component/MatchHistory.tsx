import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams } from '@mui/x-data-grid';

import { fetch_opt } from '../dep/fetch'
import UserButton from '../component/UserButton';
import GameInterface from '../interface/GameInterface';

const columns: GridColDef[] = [
  {
    field: 'score',
    headerName: 'Score',
    description: 'Le score du match',
    width: 100,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.scores[0]} | ${params.row.scores[1]}`,
    sortable: false,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'winner',
    headerName: 'Gagnant',
    description: 'Le gagnant du match',
    width: 150,
    valueGetter(params: GridValueGetterParams<GameInterface, GameInterface>) {
      const winner = params.row.players[0].id === params.row.winnerId ? params.row.players[0] : params.row.players[1];
      return winner!.name;
    },
    renderCell(params: GridRenderCellParams<GameInterface, GameInterface>) {
      const winner = params.row.players[0].id === params.row.winnerId ? params.row.players[0] : params.row.players[1];
      return <UserButton noBadge {...winner!} />;
    },
    sortable: false,
  },
  {
    field: 'winnedAt',
    headerName: 'Remporté le',
    description: 'Date de la victoire',
    width: 175,
    type: 'date',
    valueGetter: (params: GridValueGetterParams) => params.row.winnedAt as Date,
    valueFormatter: (params) => new Date(params.value).toLocaleString("fr-FR"),
  },
  {
    field: 'players',
    headerName: 'Joueurs',
    width: 350,
    sortable: false,
    valueGetter: (params: GridValueGetterParams<GameInterface, GameInterface>) =>
      (`${params.row.players[0].name} ${params.row.players[1].name}`),
    renderCell: (params: GridRenderCellParams<GameInterface, GameInterface>) => (
      params.row.players.map( (player) =>
        <UserButton key={player.id} noBadge cropName={12} {...player} sx={{mr: 2}} /> )
    )
  },
];

interface MatchHistoryProps {
  userID: number,
  deps: number[],
}

export default function MatchHistory(props: MatchHistoryProps)
{
  const [rows, setRows] = useState([] as GameInterface[]);

  useEffect(() => {
    fetch(`http://${window.location.hostname}:8190/user/${props.userID}/games`, fetch_opt())
      .then(res => res.json())
      .then(res => setRows(res))
      .catch(() => {});
  }, [props.userID]);

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      disableSelectionOnClick
      disableColumnSelector
      sx={{ '.MuiDataGrid-footerContainer': { display: 'none' } }}
    />
  );
}

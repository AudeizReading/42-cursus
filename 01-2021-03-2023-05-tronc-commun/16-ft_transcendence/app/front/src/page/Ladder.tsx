import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { fetch_opt } from '../dep/fetch'
import UserButton from '../component/UserButton';
import LoadingButton from '../component/LoadingButton';
import StatusSnackbar from '../component/StatusSnackbar';

const columns: GridColDef[] = [
  {
    field: 'rank',
    headerName: 'Position',
    headerAlign: 'center',
    flex: 0.5,
    // I know, deprecated. RIP.
    valueGetter: (params) => params.api.getRowIndex(params.row.id) + 1,
    align: 'center',
    disableColumnMenu: true,
    disableReorder: true,
    sortable: false,
  },
  {
    field: 'user',
    headerName: 'Joueur',
    flex: 1.5,
    renderCell(params) {
      return <UserButton noBadge {...params.row} />;
    },
    sortable: false,
  },
  {
    field: 'points',
    headerName: 'Points',
    flex: 1,
    valueGetter: (params: GridValueGetterParams<UserInfo, UserInfo>) => {
      const winLoseRatio = (params.row.wins / (params.row.losses || 1));
      const points = (winLoseRatio * (params.row.wins + params.row.losses));
      return (points >= 1e6 ? points.toExponential() : points.toFixed());
    },
    sortable: false,
  },
  {
    field: 'winrate',
    headerName: 'Ratio Victoire/Défaite',
    flex: 1,
    valueGetter: (params: GridValueGetterParams<UserInfo, UserInfo>) =>
      (params.row.wins / (params.row.losses || 1)).toFixed(2),
    sortable: false,
  },
  {
    field: 'played-games',
    headerName: 'Parties jouées',
    flex: 1,
    valueGetter: (params: GridValueGetterParams<UserInfo, UserInfo>) =>
      (params.row.wins + params.row.losses),
    sortable: false,
  }
];

interface UserInfo {
  id: number,
  name: string,
  avatar: string,
  wins: number,
  losses: number,
}

export interface LadderProps {
  currentUserID: number,
}

// NOTE: I tried using flex instead of hardcoded width in this one, let's see if it works out
export default function Ladder(props: LadderProps)
{
  const ROW_LIMIT = 10;
  const [rows, setRows] = useState<UserInfo[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);

  async function onRefresh() {
    try {
      setDisabled(true);
      setRefreshing(true);
      const res = await fetch(`http://${window.location.hostname}:8190/user/best/${ROW_LIMIT}`, fetch_opt());
      if (!res.ok)
        throw Error();
      const data = await res.json();
      setRows(data);
    }
    catch (error) {
      setError(true);
    }
    finally {
      setRefreshing(false);
      setTimeout(() => {
        setDisabled(false);
      }, 5000);
    }
  }

  useEffect(() => {onRefresh()}, []);

  return (
    <Box component="main" sx={{ p: 1, display: "flex", flexDirection: "column", height: '100vh', overflow: 'auto', background: 'white', alignItems: 'center'}} >

      <StatusSnackbar status={error ? "error" : ""} errorText="Impossible d'obtenir les meilleurs joueurs"
        snackbarProps={{
          autoHideDuration: 3000,
          anchorOrigin: {vertical: 'top', horizontal: 'center'},
          onClose: () => setError(false),
        }}
      />

      <p style={{textAlign: 'center', color: 'black', fontSize: '2em', fontWeight: 'bold', margin: 5}}>
        Meilleurs {ROW_LIMIT} joueurs
      </p>
      <Box display="flex">
        <LoadingButton disabled={disabled} loading={refreshing} onClick={onRefresh} sx={{my: 1}}>
          Rafraîchir
        </LoadingButton>
      </Box>
      <Box
        sx={{
          minHeight: 300,
          height: '100%',
          maxWidth: 800,
          width: '100%',
          mx: 'auto',
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight={true}
          disableSelectionOnClick
          disableColumnSelector
          disableColumnMenu
          sx={{
            '.MuiDataGrid-footerContainer': { display: 'none' },
            '& .grid-highlight': { bgcolor: '#dcf2f6' },
          }}
          getRowClassName={(params) => params.row.id === props.currentUserID ? "grid-highlight" : ""}
        />
      </Box>
    </Box>
  );
}

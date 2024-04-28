window.onload = function () {
  // Fetch data from JSON files
  fetchMatches();
  fetchPlayers();
};

function fetchMatches() {
  fetch('./matches.json')
    .then((response) => response.json())
    .then((data) => {
      displayMatches(data.groupPhase, 'group-phase-matches');
      displayMatches(data.finals, 'finals-matches');
    })
    .catch((error) => console.error('Error fetching matches:', error));
}

function fetchPlayers() {
  fetch('./players.json')
    .then((response) => response.json())
    .then((data) => {
      displayPlayers(data.groupPhase, 'group-phase-players', 'kills');
      displayPlayers(data.finals, 'finals-players', 'kills');
      displayPlayers(data.total, 'total-players', 'kills');
    })
    .catch((error) => console.error('Error fetching players:', error));
}

function displayMatches(matches, tableId) {
  const table = document.getElementById(tableId);
  table.innerHTML = `
      <tr>
          <th>Start</th>
          <th>Duration</th>
          <th>Map</th>
          <th colspan="2">Teams</th>
          <th colspan="2">Score</th>
      </tr>
  `;
  matches.forEach((match) => {
    const team1Class = match.winner === match.team1_name ? 'green' : 'red';
    const team2Class = match.winner === match.team2_name ? 'green' : 'red';
    const score1Class = match.team1_score === 13 ? 'green' : 'red';
    const score2Class = match.team2_score === 13 ? 'green' : 'red';
    table.innerHTML += `
          <tr>
              <td>${match.start_time}</td>
              <td>${calculateDuration(match.start_time, match.end_time)}</td>
              <td>${match.mapname}</td>
              <td class="${team1Class}">${match.team1_name}</td>
              <td class="${team2Class}">${match.team2_name}</td>
              <td class="${score1Class}">${match.team1_score}</td>
              <td class="${score2Class}">${match.team2_score}</td>
          </tr>
      `;
  });
}

function displayPlayers(players, tableId, sortKey) {
  const table = document.getElementById(tableId);
  const reverse = table.getAttribute('data-column') === sortKey;
  table.innerHTML = `
      <tr>
      <th data-column="team">Team</th>
      <th data-column="name">Name</th>
      <th data-column="kills">Kills</th>
      <th data-column="deaths">Deaths</th>
      <th data-column="assists">Assists</th>
      <th data-column="+-">+-</th>
      <th data-column="kd">KD</th>
      <th data-column="damage">Damage</th>
      <th data-column="ud">UD</th>
      <th data-column="ef">EF</th>
      <th data-column="HS%">HS%</th>
      <th data-column="Acc%">Accuracy</th>
      </tr>
  `;
  let data = players.sort((a, b) => {
    if (typeof a[sortKey] === 'string') {
      return a[sortKey].localeCompare(b[sortKey]);
    } else {
      return b[sortKey] - a[sortKey];
    }
  });

  if (reverse) {
    data.reverse();
    table.removeAttribute('data-column');
  } else {
    table.setAttribute('data-column', sortKey);
  }

  data.forEach((player) => {
    table.innerHTML += `
          <tr>
              <td>${player.team}</td>
              <td>${player.name}</td>
              <td>${player.kills}</td>
              <td>${player.deaths}</td>
              <td>${player.assists}</td>
              <td>${player['+-']}</td>
              <td>${player.kd.toFixed(2)}</td>
              <td>${player.damage}</td>
              <td>${player.ud}</td>
              <td>${player.ef}</td>
              <td>${player['HS%'].toFixed(2)}%</td>
              <td>${player['Acc%'].toFixed(2)}%</td>
          </tr>
      `;
  });
  makeTableSortable(players, tableId);
}

function makeTableSortable(players, tableId) {
  const table = document.getElementById(tableId);
  const headers = Array.from(table.querySelectorAll('th'));
  headers.forEach((header) => {
    header.addEventListener('click', () => {
      displayPlayers(players, tableId, header.getAttribute('data-column'));
    });
  });
}

function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const duration = end - start;
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}

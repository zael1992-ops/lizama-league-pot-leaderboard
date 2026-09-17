function statusMeta(s) {
  if (s === "paid") return { label: "Paid", cls: "status-paid", icon: "assets/icons/paid.png" };
  if (s === "pastdue") return { label: "Past due", cls: "status-pastdue", icon: "assets/icons/past-due.png" };
  return { label: "Pledged", cls: "status-pledged", icon: "assets/icons/pledge.png" };
}

function render(data) {
  document.getElementById("leagueTitle").textContent = data.leagueName;

  var potAmount = data.teams.length * data.potPerPerson;
  document.getElementById("potAmountDisplay").textContent =
    "$" + potAmount.toLocaleString("en-US") + " " + data.currency;
  document.getElementById("potLabel").textContent =
    "Total Pot \u00b7 " + data.teams.length + " \u00d7 $" + data.potPerPerson + " " + data.currency;

  var paidCount = data.teams.filter(function (t) { return t.status === "paid"; }).length;
  var pledgedCount = data.teams.filter(function (t) { return t.status === "pledged"; }).length;
  var pastDueCount = data.teams.filter(function (t) { return t.status === "pastdue"; }).length;

  document.getElementById("summaryRow").innerHTML =
    '<div class="summary-pill"><div class="num">' + paidCount + '</div><div class="lbl">Paid</div></div>' +
    '<div class="summary-pill"><div class="num">' + pledgedCount + '</div><div class="lbl">Pledged</div></div>' +
    '<div class="summary-pill"><div class="num">' + pastDueCount + '</div><div class="lbl">Past due</div></div>';

  var sorted = data.teams.slice().sort(function (a, b) {
    if (b.w !== a.w) return b.w - a.w;
    return b.pts - a.pts;
  });

  var tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  sorted.forEach(function (team, idx) {
    var meta = statusMeta(team.status);
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td class="rank">' + (idx + 1) + '</td>' +
      '<td><span class="status-badge ' + meta.cls + '"><img class="status-icon" src="' + meta.icon + '" alt="' + meta.label + '">' + meta.label + '</span></td>' +
      '<td><div class="team-cell"><img class="avatar" src="' + team.logo + '" alt="' + team.name + ' logo"><span>' + team.name + '</span></div></td>' +
      '<td>' + team.w + '-' + team.l + '-' + team.t + '</td>' +
      '<td class="points-total">' + team.pts + '</td>';
    tbody.appendChild(tr);
  });
}

fetch("data.json")
  .then(function (res) { return res.json(); })
  .then(render)
  .catch(function (err) {
    document.getElementById("tableBody").innerHTML =
      '<tr><td colspan="5">Could not load data.json (' + err.message + ')</td></tr>';
  });
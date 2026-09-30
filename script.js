function statusMeta(s) {
  if (s === "paid") return { label: "Paid", cls: "status-paid", icon: "assets/icons/paid.png" };
  if (s === "pastdue") return { label: "Past due", cls: "status-pastdue", icon: "assets/icons/past-due.png" };
  return { label: "Pledged", cls: "status-pledged", icon: "assets/icons/pledge.png" };
}

var AVATAR_COLORS = ["#f97316", "#0ea5e9", "#7c2d12", "#16a34a", "#4b5563", "#a21caf", "#0369a1", "#b91c1c"];

function initialsFor(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
}

function colorFor(name) {
  var hash = 0;
  for (var i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function avatarHTML(team) {
  if (team.logo) {
    return '<img class="avatar" src="' + team.logo + '" alt="' + team.name + ' logo">';
  }
  return '<div class="avatar avatar-fallback" style="background:' + colorFor(team.name) + '">' + initialsFor(team.name) + '</div>';
}

function streakHTML(streak) {
  if (!streak) return "";
  var cls = streak.charAt(0).toUpperCase() === "W" ? "streak-win" : "streak-loss";
  return '<span class="' + cls + '">' + streak + '</span>';
}

function sortByWinsThenPts(a, b) {
  if (b.w !== a.w) return b.w - a.w;
  return b.pts - a.pts;
}

function renderPot(data) {
  var potTeams = data.teams.filter(function (t) { return t.inPot; });

  var potAmount = potTeams.length * data.potPerPerson;
  document.getElementById("potAmountDisplay").textContent =
    "$" + potAmount.toLocaleString("en-US") + " " + data.currency;
  document.getElementById("potLabel").textContent =
    "Total Pot \u00b7 " + potTeams.length + " \u00d7 $" + data.potPerPerson + " " + data.currency;

  var paidCount = potTeams.filter(function (t) { return t.status === "paid"; }).length;
  var pledgedCount = potTeams.filter(function (t) { return t.status === "pledged"; }).length;
  var pastDueCount = potTeams.filter(function (t) { return t.status === "pastdue"; }).length;

  document.getElementById("summaryRow").innerHTML =
    '<div class="summary-pill"><div class="num">' + paidCount + '</div><div class="lbl">Paid</div></div>' +
    '<div class="summary-pill"><div class="num">' + pledgedCount + '</div><div class="lbl">Pledged</div></div>' +
    '<div class="summary-pill"><div class="num">' + pastDueCount + '</div><div class="lbl">Past due</div></div>';

  var sorted = potTeams.slice().sort(sortByWinsThenPts);
  var tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  sorted.forEach(function (team, idx) {
    var meta = statusMeta(team.status);
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td class="rank">' + (idx + 1) + '</td>' +
      '<td><span class="status-badge ' + meta.cls + '"><img class="status-icon" src="' + meta.icon + '" alt="' + meta.label + '">' + meta.label + '</span></td>' +
      '<td><div class="team-cell">' + avatarHTML(team) + '<span>' + team.name + '</span></div></td>' +
      '<td class="text-center">' + team.w + '-' + team.l + '-' + team.t + '</td>' +
      '<td class="points-total text-center">' + team.pts + '</td>' +
      '<td class="text-center">' + team.playoffPct + '%</td>' +
      '<td class="text-center">' + streakHTML(team.streak) + '</td>';
    tbody.appendChild(tr);
  });
}

function renderLeague(data) {
  var sorted = data.teams.slice().sort(sortByWinsThenPts);
  var tbody = document.getElementById("leagueTableBody");
  tbody.innerHTML = "";

  sorted.forEach(function (team, idx) {
    var pillCls = team.inPot ? "pot-pill-in" : "pot-pill-out";
    var pillLabel = team.inPot ? "In Pot" : "Not Betting";
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td class="rank">' + (idx + 1) + '</td>' +
      '<td><span class="pot-pill ' + pillCls + '">' + pillLabel + '</span></td>' +
      '<td><div class="team-cell">' + avatarHTML(team) + '<span>' + team.name + '</span></div></td>' +
      '<td class="text-center">' + team.w + '-' + team.l + '-' + team.t + '</td>' +
      '<td class="points-total text-center">' + team.pts + '</td>' +
      '<td class="text-center">' + team.playoffPct + '%</td>' +
      '<td class="text-center">' + streakHTML(team.streak) + '</td>';
    tbody.appendChild(tr);
  });
}

function render(data) {
  document.getElementById("leagueTitle").textContent = data.leagueName;
  renderPot(data);
  renderLeague(data);
}

function setupTabs() {
  var potBtn = document.getElementById("tabPotBtn");
  var leagueBtn = document.getElementById("tabLeagueBtn");
  var potView = document.getElementById("potView");
  var leagueView = document.getElementById("leagueView");

  potBtn.addEventListener("click", function () {
    potBtn.classList.add("active");
    leagueBtn.classList.remove("active");
    potView.style.display = "";
    leagueView.style.display = "none";
  });

  leagueBtn.addEventListener("click", function () {
    leagueBtn.classList.add("active");
    potBtn.classList.remove("active");
    leagueView.style.display = "";
    potView.style.display = "none";
  });
}

setupTabs();

fetch("data.json")
  .then(function (res) { return res.json(); })
  .then(render)
  .catch(function (err) {
    document.getElementById("tableBody").innerHTML =
      '<tr><td colspan="5">Could not load data.json (' + err.message + ')</td></tr>';
  });
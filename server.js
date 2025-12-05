// server.js
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Statisk hosting (læg index.html og results.html i samme mappe som server.js)
app.use(express.static(path.join(__dirname)));

// Start-pointtælling og metadata
const options = {
  fladbro:     { id: "fladbro",     name: "Fladbro Kro",             points: 0, firstCount: 0, secondCount: 0, thirdCount: 0 },
  bistroteket: { id: "bistroteket", name: "Bistroteket",             points: 0, firstCount: 0, secondCount: 0, thirdCount: 0 },
  frularsen:   { id: "frularsen",   name: "Fru Larsen",              points: 0, firstCount: 0, secondCount: 0, thirdCount: 0 },
  timvladimir: { id: "timvladimir", name: "Tim Vladimir",            points: 0, firstCount: 0, secondCount: 0, thirdCount: 0 },
  rebelsk:     { id: "rebelsk",     name: "Rebelsk",                 points: 0, firstCount: 0, secondCount: 0, thirdCount: 0 },
  vesterport:  { id: "vesterport",  name: "Vesterport Madmarked",    points: 0, firstCount: 0, secondCount: 0, thirdCount: 0 },
  norevent:    { id: "norevent",    name: "Norevent",                points: 0, firstCount: 0, secondCount: 0, thirdCount: 0 },
  rosengaarden:{ id: "rosengaarden",name: "Rosengaardens Gårdbutik", points: 0, firstCount: 0, secondCount: 0, thirdCount: 0 }
};

// Her gemmer vi hver enkelt stemme med navn
const votes = [];

// Modtag stemme
app.post("/api/vote", (req, res) => {
  const { first, second, third, name } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Navn skal udfyldes" });
  }

  if (!first || !second || !third) {
    return res.status(400).json({ error: "Alle tre valg skal udfyldes" });
  }
  if (first === second || first === third || second === third) {
    return res.status(400).json({ error: "Valgene skal være forskellige" });
  }

  const validKeys = Object.keys(options);
  if (![first, second, third].every(v => validKeys.includes(v))) {
    return res.status(400).json({ error: "Ugyldige valg" });
  }

  // Fordel point
  options[first].points += 3;
  options[first].firstCount += 1;

  options[second].points += 2;
  options[second].secondCount += 1;

  options[third].points += 1;
  options[third].thirdCount += 1;

  // Gem selve stemmen med navn
  votes.push({
    name: name.trim(),
    first,
    second,
    third,
    createdAt: new Date().toISOString()
  });

  return res.json({ ok: true });
});

// Hent resultater (til tabellen)
app.get("/api/results", (req, res) => {
  res.json({
    options,
    totalVotes: votes.length
    // votes: votes // kan aktiveres, hvis du vil se alle stemmer råt
  });
});

app.listen(PORT, () => {
  console.log(`Server kører på http://localhost:${PORT}`);
});

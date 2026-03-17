const express = require("express");
const cors = require("cors");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

app.get("/api/bowling-stats", (req, res) => {
  try {
    const filePath = path.join(__dirname, "player.html");
    const html = fs.readFileSync(filePath, "utf-8");
    const $ = cheerio.load(html);

    const result = {
      playerName: "Prasanth Dharavathu",
      bowlingByFormat: [],
      totals: {
        matches: 0,
        innings: 0,
        overs: 0,
        runs: 0,
        wickets: 0,
        maidens: 0,
        wides: 0,
      },
    };

    $("table").each((i, table) => {
      const headers = $(table)
        .find("th")
        .map((_, th) => $(th).text().trim())
        .get();

      const hasBowlingHeaders =
        headers.includes("Series Type") &&
        headers.includes("Mat") &&
        headers.includes("Inns") &&
        headers.includes("Overs") &&
        headers.includes("Runs") &&
        headers.includes("Wkts") &&
        headers.includes("BBF") &&
        headers.includes("Mdns") &&
        headers.includes("Ave") &&
        headers.includes("Econ") &&
        headers.includes("SR");

      if (!hasBowlingHeaders) return;

      $(table)
        .find("tr")
        .each((rowIndex, row) => {
          const cells = $(row)
            .find("th")
            .map((_, cell) => $(cell).text().trim())
            .get();

          if (cells.length >= 11) {
            const firstCell = cells[0];

            if (
              firstCell &&
              firstCell !== "Series Type" &&
              !firstCell.includes("View statistics by") &&
              firstCell !== "Loading ..."
            ) {
              const rowData = {
                seriesType: cells[0] || "",
                matches: Number(cells[1]) || 0,
                innings: Number(cells[2]) || 0,
                overs: parseFloat(cells[3]) || 0,
                runs: Number(cells[4]) || 0,
                wickets: Number(cells[5]) || 0,
                bestBowling: cells[6] || "",
                maidens: Number(cells[7]) || 0,
                average: parseFloat(cells[8]) || 0,
                economy: parseFloat(cells[9]) || 0,
                strikeRate: parseFloat(cells[10]) || 0,
                fourWickets: Number(cells[11]) || 0,
                fiveWickets: Number(cells[12]) || 0,
                wides: Number(cells[13]) || 0,
                catches: Number(cells[14]) || 0,
              };

              result.bowlingByFormat.push(rowData);

              result.totals.matches += rowData.matches;
              result.totals.innings += rowData.innings;
              result.totals.overs += rowData.overs;
              result.totals.runs += rowData.runs;
              result.totals.wickets += rowData.wickets;
              result.totals.maidens += rowData.maidens;
              result.totals.wides += rowData.wides;
            }
          }
        });
    });

    if (result.totals.wickets > 0) {
      result.totals.average = Number(
        (result.totals.runs / result.totals.wickets).toFixed(2)
      );

      result.totals.strikeRate = Number(
        ((result.totals.overs * 6) / result.totals.wickets).toFixed(2)
      );
    } else {
      result.totals.average = 0;
      result.totals.strikeRate = 0;
    }

    if (result.totals.overs > 0) {
      result.totals.economy = Number(
        (result.totals.runs / result.totals.overs).toFixed(2)
      );
    } else {
      result.totals.economy = 0;
    }

    result.totals.overs = Number(result.totals.overs.toFixed(1));

    if (result.bowlingByFormat.length > 0) {
      const parsedBest = result.bowlingByFormat
        .map((item) => {
          const parts = item.bestBowling.split("/");
          return {
            original: item.bestBowling,
            wicketsPart: Number(parts[1]) || 0,
            runsPart: Number(parts[0]) || 9999,
          };
        })
        .sort((a, b) => {
          if (b.wicketsPart !== a.wicketsPart) {
            return b.wicketsPart - a.wicketsPart;
          }
          return a.runsPart - b.runsPart;
        });

      result.totals.bestBowling = parsedBest[0].original;
    } else {
      result.totals.bestBowling = "N/A";
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Could not read local CricClubs HTML file",
      details: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
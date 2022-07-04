const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const zlib = require('zlib');
const app = express();
const port = 3000;
const filename = 'mapHistory.json';
const mapURL = 'https://liquidlands.io/raw/land/guarded';
let cached_stats = [];
// Minute
const MINUTE = 1000*60;
// Hourly
const HOUR = 60*MINUTE;
// Daily
const DAY = 24*HOUR;
const pollingInterval = MINUTE;

function loadData(){
  let rawdata = fs.readFileSync(filename);
  cached_stats = JSON.parse(rawdata);
}

async function readData(){
  let uncompressed = [];
  for(let i=0; i<cached_stats.length; i++) {
    let uncompressedMapState = zlib.inflateSync(new Buffer(cached_stats[i].mapState, 'base64')).toString();
    uncompressed.push({
      timestamp: cached_stats[i].timestamp,
      mapState: uncompressedMapState
    });
  }
  return uncompressed;
}

function saveData(){
  try{
    let data = JSON.stringify(cached_stats);
    fs.writeFileSync(filename, data);
  }catch(err){
    console.log('Error saving:', err);
  }
}

async function collectMapState(){
  const response = await fetch(mapURL);
  const jsonData = await response.json();
  let newData = jsonData.map((data)=>[data[0], data[1], data[2]])
  var compressedData = zlib.deflateSync(JSON.stringify(newData)).toString('base64');
  cached_stats.push({
    timestamp: Date.now(),
    mapState: compressedData
  });
  saveData();
}

app.get('/', (req, res) => {
  res.send({message: 'Alive'})
})

app.get('/history', async (req, res) => {
  let data = await readData();
  res.send(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

loadData();
collectMapState();

setInterval(async ()=>{
  collectMapState();
}, pollingInterval);
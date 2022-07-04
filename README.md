# LiquidLandsMapHistory

# About

Polls the [LiquidLands](https://liquidlands.io/) Map State Endpoint here: [https://liquidlands.io/raw/land/guarded](https://liquidlands.io/raw/land/guarded)

# Setup

## Install Dependencies

```npm i```

## Running

```node index.js```

# Code Info

You can set the polling interval [here](https://github.com/vinny-888/LiquidLandsMapHistory/blob/main/index.js#L16)

Data is stored compressed [here](https://github.com/vinny-888/LiquidLandsMapHistory/blob/main/mapHistory.json)

Data can be queried uncompressed from the ```/history``` API Endppint.

The function [readData()](https://github.com/vinny-888/LiquidLandsMapHistory/blob/main/index.js#L23) will also provide the uncompressed data in memory.

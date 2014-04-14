# WalkerBoard

A simple Geckoboard clone, with far less features.

It assumes you can get your own data and is designed to be run via static JSON
files, although those could be dynamic endpoints if wanted.

## Demo

To run a demo:

  - clone this repo.
  - run `npm install` to fetch dependencies
  - run `./build.sh` to build the javascript into a bundle.
  - run `npm start` to start the server
  - browse to `http://localhost:8000/`

The demo board should appear based on `www/board.json`.

Check out `board.json` and the data in `www/json/` for more.

# WalkerBoard

A simple Geckoboard clone, with far less features.

It assumes you can get your own data and is designed to be run via static JSON
files, although those could be dynamic endpoints if wanted.

## Demo

To run a demo:

  - clone this repo.
  - get facebooks jsx tools: `npm install -g react-tools`
  - transform the source JS: `jsx src/ js/ -x jsx`
  - run a webserver in the root of the repository (or have the repository
    cloned somewhere web-accessible)
  - navigate to `index.html`

The demo board should appear based on `board.json` in the root.

Check out `board.json` and the data in `json/` for more.
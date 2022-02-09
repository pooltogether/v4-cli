<p align="center">
  <a href="https://github.com/pooltogether/pooltogether--brand-assets">
    <img src="https://github.com/pooltogether/pooltogether--brand-assets/blob/977e03604c49c63314450b5d432fe57d34747c66/logo/pooltogether-logo--purple-gradient.png?raw=true" alt="PoolTogether Brand" style="max-width:100%;" width="200">
  </a>
</p>

<br />


# 📇 PoolTogether V4 CLI

![Tests](https://github.com/pooltogether/v4-cli/actions/workflows/main.yml/badge.svg)
[![Version](https://img.shields.io/npm/v/@pooltogether/v4-cli.svg)](https://npmjs.org/package/@pooltogether/v4-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@pooltogether/v4-cli.svg)](https://npmjs.org/package/@pooltogether/v4-cli)
[![License](https://img.shields.io/npm/l/@pooltogether/v4-cli.svg)](https://github.com/oclif/hello-world/blob/main/package.json)
![ts](https://badgen.net/badge/-/TypeScript?icon=typescript&label&labelColor=blue&color=555555)
[![GPLv3 license](https://img.shields.io/badge/License-GPLv3-blue.svg)](http://perso.crans.org/besson/LICENSE.html)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

Interact with the **PoolTogether V4 protocol** via a command line interface (CLI).

This CLI uses the [TWAB subgraphs](https://github.com/pooltogether/twab-subgraph) across networks to calculate TWABS for a given `drawId`, `ticket` and `network` (specified as CLI input args).

Then creates a thread for each address (using [Piscina](https://www.npmjs.com/package/piscina)) to call the [Draw Calculator JS library](https://github.com/pooltogether/draw-calculators-js) and outputs a `prizes.json` file (written to `outputDir` CLI arg) with structure:

# ⌨️ CLI Installation
<!-- usage -->
```sh-session
$ npm install -g @pooltogether/v4-cli
$ ptv4 COMMAND
running command...
$ ptv4 (--version)
@pooltogether/v4-cli/0.1.0-beta.31 darwin-arm64 node-v16.0.0
$ ptv4 --help [COMMAND]
USAGE
  $ ptv4 COMMAND
...

```
<!-- usagestop -->
# Commands

## Compute Draw Prizes

```sh-session
ptv4 compute drawPrizes
```

Computes single Draw prizes for a PrizePool to a target output directory.

Simply pass a `chainId`, `ticket` `drawId` and `outDir` to compute and locally save the results. 

```
USAGE
  $ ptv4 compute drawPrizes --chainId 1 --drawId 65 --outDir ./temp --ticket '0xdd4d117723C257CEe402285D3aCF218E9A8236E1'

DESCRIPTION
  Computes single Draw prizes for a PrizePool to a target output directory.

EXAMPLES
  $ ptv4 compute drawPrizes --chainId 1 --drawId 1 --ticket 0x0000000000000000000000000000000000000000 --outDir ./temp
    Running compute:drawPrizes on chainId: 1 using drawID: 1
```

## Status File (status.json)

```json
{
  "status": "LOADING",
  "createdAt": "11"
}
```

### Success

```json
{
  "status": "SUCCESS",
  "createdAt": "11",
  "updatedAt": "33",
  "runtime": "22",
  "meta": {
    "prizeLength": "10",
    "amountsTotal": "5000000"
  }
}
```

### Failure

```json
{
  "status": "FAILURE",
  "createdAt": "11",
  "updatedAt": "33",
  "runtime": "22",
  "error": "ErrorCode"
}
```


## Compute PrizePool Prizes

Computes all historical Draw prizes for a PrizePool to a target output directory.

```sh-session
ptv4 compute poolPrizes
```

```
USAGE
  $ ptv4 compute poolPrizes --chainId 1 --outDir ./temp --ticket '0xdd4d117723C257CEe402285D3aCF218E9A8236E1'

DESCRIPTION
  Computes all historical Draw prizes for a PrizePool to a target output directory.

EXAMPLES
  $ ptv4 compute poolPrizes --chainId 1--ticket 0x0000000000000000000000000000000000000000 --outDir ./temp
    Running compute:drawPrizes on chainId: 1 using drawID: 1
```

## Compute Network of PrizePool Prizes

Computes Draw prizes for all PoolTogether V4 network PrizePools to a target output directory.

```sh-session
ptv4 compute networkPrizes
```

```
USAGE
  $ ptv4 compute networkPrizes --outDir ./temp

DESCRIPTION
  Computes Draw prizes for all PoolTogether V4 network PrizePools to a target output directory.

EXAMPLES
  $ ptv4 compute poolPrizes --chainId 1--ticket 0x0000000000000000000000000000000000000000 --outDir ./temp
    Running compute:drawPrizes on chainId: 1 using drawID: 1
```

## Help

```sh-session
ptv4 help [COMMAND]
```

Display help for ptv4.

```
USAGE
  $ ptv4 help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for ptv4.
```

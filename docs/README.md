# Sudoo-Asynchronous

[![Build Status](https://travis-ci.com/SudoDotDog/Sudoo-Asynchronous.svg?branch=master)](https://travis-ci.com/SudoDotDog/Sudoo-Asynchronous)
[![codecov](https://codecov.io/gh/SudoDotDog/Sudoo-Asynchronous/branch/master/graph/badge.svg)](https://codecov.io/gh/SudoDotDog/Sudoo-Asynchronous)
[![npm version](https://badge.fury.io/js/%40sudoo%2Fasynchronous.svg)](https://www.npmjs.com/package/@sudoo/asynchronous)
[![downloads](https://img.shields.io/npm/dm/@sudoo/asynchronous.svg)](https://www.npmjs.com/package/@sudoo/asynchronous)

:speedboat: Asynchronous Management

## Install

```sh
yarn add @sudoo/asynchronous
# Or
npm install @sudoo/asynchronous --save
```

## Parallel Pool

Parallel Pool is used to execute a large amount of `Promise`, with a maximum parallel count.

```ts
import { ParallelPool } from "@sudoo/asynchronous";

const parallel: ParallelPool = ParallelPool.create(5);
parallel.execute([
    async () => /* Some Thing */,
    async () => /* Some Thing */,
    async () => /* Some Thing */,
    ...,
])
```

## Other Usage

This document is working in progress. Check out `Runner` functions for the ability to run `Promises` within an order and result containing.

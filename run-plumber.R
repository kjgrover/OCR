#!/usr/bin/env Rscript

library(plumber)

r <- plumb("plumber.R")

r$run(host="104.248.69.73", port=8080)

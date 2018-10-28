#!/usr/bin/env Rscript

library(plumber)

r <- plumber::plumb("plumber.R")

r$run(port=4000)


library(plumber)

r <- plumb("plumber.R")

r$run(port=4000)


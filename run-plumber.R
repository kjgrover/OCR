
library(plumber)

r <- plumb("plumber.R")

r$run(host="104.248.69.73", port=4000)

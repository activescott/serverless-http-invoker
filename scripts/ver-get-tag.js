const ver = require("./ver")

const matchObj = ver()

if (matchObj.groups.tag) {
  process.stdout.write(matchObj.groups.tag)
  process.exit(0)
} else {
  process.exit(2)
}

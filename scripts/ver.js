module.exports = function ver() {
  if (process.argv.length !== 3) {
    process.exit(1)
  }

  version = process.argv[2]

  const re = /^v?(?<major>[0-9]+)\.(?<minor>[0-9])+\.(?<patch>[0-9]+)(\-(?<tag>.*))?$/
  const matchObj = re.exec(version)
  return matchObj
}

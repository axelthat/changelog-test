const { execSync } = require("child_process")
const fs = require("fs")
const readline = require("readline")
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function exec(command) {
  console.log(
    execSync(command, {
      encoding: "utf8",
    })
  )
}

function commit(message, push = true) {
  const commands = [`git add .`, `git commit -m "${message}"`]
  if (push) {
    commands.push("git push -u origin main")
  }

  exec(commands.join(" && "))
}

function release(version) {
  const packageJson = JSON.parse(
    fs.readFileSync("./package.json", { encoding: "utf8" })
  )
  packageJson.version = version.replace("v", "")
  fs.writeFileSync("./package.json", JSON.stringify(packageJson), {
    encoding: "utf8",
  })

  exec(
    "npx conventional-changelog -p angular -i CHANGELOG.md -s --commit-path ."
  )

  commit(`release ${version}`)

  exec(`git tag ${version} && git push --tags`)
}

function question(que) {
  return new Promise((resolve) => {
    rl.question(que, (answer) => {
      resolve(answer)
      rl.close()
    })
  })
}

async function main() {
  commit("chore: initial commit")

  exec(`echo 'a' >> index.txt`)
  commit("feat: a", false)

  exec(`echo 'b' >> index.txt`)
  commit("feat: b")

  release("v1.0.0")

  exec(`echo 'c' >> index.txt`)
  commit("feat: c", false)

  exec(`echo 'd' >> index.txt`)
  commit("feat: d")

  release("v2.1.0")

  await question("Change commit message and hit any key to continue...\n")

  exec(`git push -f`)

  exec(
    `git tag v2.0.0 v1.0.0 && git tag -d v1.0.0 && git push origin v2.0.0 :v1.0.0`
  )

  exec(`echo 'e' >> index.txt`)
  commit("feat: e", false)

  exec(`echo 'f' >> index.txt`)
  commit("feat: f")

  release("v2.2.0")

  exec(`echo 'g' >> index.txt`)
  commit("feat: g", false)

  exec(`echo 'h' >> index.txt`)
  commit("feat: h")

  release("v2.3.0")
}

main()

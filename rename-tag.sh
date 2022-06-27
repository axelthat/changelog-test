function commit {
  git add .
  git commit -m "$1"
  git push -u origin main
}

commit "chore: init"

echo "a" >> index.txt
commit "feat: a"

echo "b" >> index.txt
commit "feat: b"

git tag v2.0.0 v1.0.0
git tag -d v1.0.0
git push origin v2.0.0 :v1.0.0
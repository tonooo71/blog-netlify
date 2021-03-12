#!/bin/bash

git add .

msg="rebuilding site `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

git push origin master

# for WSL
rm -rf reduxcache*

cd githubio
ls | xargs rm -rf
cp -r ../public/* ./
git add .

if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

git push origin master

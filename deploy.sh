#!/bin/bash

msg="rebuilding site `date`"

# submodule
cd githubio
ls | xargs rm -rf
cp -r ../public/* ./
cp -r ../../gunjin-shogi/dist gunjin-shogi # optional
git add .

if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

git push origin master
cd ..

# module
git add .

if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -m "$msg"

git push origin master

# for WSL
rm -rf reduxcache*

## Setup
git clone -b main https://github.com/CampusCrafters/CampusConnect_Backend.git
npm i
## Run
npm start
## To get the latest repo
git pull

## To make changes, make a PR first, do not merge directly
to make a PR while contributing, create a new branch with the name of the feature you are working and push the code, then go to github and click create a pull request. 
git add .

git stash

git pull

git checkout -b feature_name

git stash pop

git add .

git commit -m 'explain the changes'

git push --set-upstream origin feature_name

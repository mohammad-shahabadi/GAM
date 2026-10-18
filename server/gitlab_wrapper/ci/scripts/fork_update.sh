GITLAB_API_URL="${CI_SERVER_URL}/api/v4" &&

git config --get remote.origin.url &&
git fetch origin &&
git checkout -B dev origin/dev &&
git merge -X theirs --allow-unrelated-histories origin/master &&

CI_PUSH_REPO=$(echo "${CI_REPOSITORY_URL}" | sed 's/^.*@/@/g') &&
git remote set-url --push origin "http://gitlab-ci-token:${GITLAB_API_PRIVATE_TOKEN}${CI_PUSH_REPO}" &&

git push origin dev &&
echo -e "\e[34mSuccessfully merged to dev in original repo\e[0m" &&

forks=$(curl --header "PRIVATE-TOKEN: ${GITLAB_API_PRIVATE_TOKEN}" "${GITLAB_API_URL}/projects/${CI_PROJECT_ID}/forks") &&
forks_urls=($(echo "${forks}" | jq -r '.[].http_url_to_repo')) &&
counter=1 &&

for fork_clone_url in "${forks_urls[@]}"; do
  echo -e "\e[34mProcessing fork [$counter]: ${fork_clone_url}\e[0m" &&
  modified_fork_url=$(echo "${fork_clone_url}" | sed "s|://|://oauth2:${GITLAB_API_PRIVATE_TOKEN}@|") &&

  git clone "${modified_fork_url}" fork_repo &&
  cd fork_repo &&

  git remote add upstream "${CI_REPOSITORY_URL}" &&
  echo "added upstream" &&
  git fetch upstream &&
  echo "fetch upstream finished" &&

  git checkout master &&
  git merge -X theirs upstream/master &&
  git push origin master &&

  git checkout --track origin/dev &&
  git merge -X theirs upstream/dev &&
  git push origin dev &&

  cd .. &&
  rm -rf fork_repo &&

  echo -e "\e[34mFork process complete for [$counter]: ${fork_clone_url}\e[0m" &&
  ((counter+=1))
done &&
echo -e "\e[34mSuccessfully updated all forks\e[0m"
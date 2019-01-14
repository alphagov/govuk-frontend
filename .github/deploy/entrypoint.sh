#!/bin/sh

set -eu

mkdir ~/.ssh
echo ekosystem.staging.slovensko.digital ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDMtqTn27l7YyPbzNAry/6eAAo+1n4dNL3eTJv8+PJja3BtnT94HaNhGSriecn2Euu1uQxIT9OQ8nxfpq1yQn8fhbUl+1SYDaMH2P/Lavh5++R5mkeH3G+GmrJOY0aP6651cPPz2SpICw38gooaKu6SqV/GyDBokVidQv27iUWUixNi0kfBwAgjW4EGNjPv+sdYN+lPVrvmVXR3IEU107JCSGf//OrRykeELUZm5vlZjwENvjt8HGa6t3KPL+2yzQXzwI+ww/1axHJHLDRF2rA2g109MJiuL5+KRHJud5d6lsPk82nrQF3EI3uzME7IxlVUWQDN2wGt6V47/NCxLYAb >> ~/.ssh/known_hosts
gpg -q --batch --yes --decrypt --passphrase="$SSH_KEY_DECRYPT_PASSPHRASE" -o ~/.ssh/id_rsa /id_rsa.gpg

git --git-dir=/navody-frontend/.git --work-tree=/navody-frontend $*

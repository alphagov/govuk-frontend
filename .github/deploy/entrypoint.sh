#!/bin/sh

set -eu

mkdir ~/.ssh && ssh-keyscan ekosystem.staging.slovensko.digital >> ~/.ssh/known_hosts
gpg -q --batch --yes --decrypt --passphrase="$SSH_KEY_DECRYPT_PASSPHRASE" -o ~/.ssh/id_rsa /id_rsa.gpg

git --git-dir=/navody-frontend/.git --work-tree=/navody-frontend $*

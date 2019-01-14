#!/bin/sh

set -eu

gpg -q --batch --yes --decrypt --passphrase="$SSH_KEY_DECRYPT_PASSPHRASE" -o ~/.ssh/id_rsa /id_rsa.gpg

git --git-dir=/navody-frontend/.git --work-tree=/navody-frontend $*

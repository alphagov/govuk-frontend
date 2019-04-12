#!/bin/sh

set -eu

mv /ssh /root/.ssh

gpg -q --batch --yes --decrypt --passphrase="$SSH_KEY_DECRYPT_PASSPHRASE" -o /root/.ssh/id_rsa /root/.ssh/id_rsa.gpg

chmod 600 /root/.ssh/*
chmod 700 /root/.ssh

git --git-dir=/navody-frontend/.git --work-tree=/navody-frontend $*

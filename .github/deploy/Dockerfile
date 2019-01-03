FROM alpine:3.8

RUN apk --update add git openssh gnupg && \
rm -rf /var/lib/apt/lists/* && \
rm /var/cache/apk/*

RUN mkdir ~/.ssh && ssh-keyscan ekosystem.staging.slovensko.digital >> ~/.ssh/known_hosts
RUN gpg -q --batch --yes --decrypt --passphrase="$SSH_KEY_DECRYPT_PASSPHRASE" -o ~/.ssh/id_rsa id_rsa.gpg

RUN git clone --depth 1 https://github.com/slovensko-digital/navody-frontend.git /navody-frontend
RUN git --git-dir=/navody-frontend/.git --work-tree=/navody-frontend remote add staging dokku@ekosystem.staging.slovensko.digital:navody-frontend

ENTRYPOINT ["git","--git-dir=/navody-frontend/.git", "--work-tree=/navody-frontend"]
CMD ["--help"]

FROM alpine:3.8

RUN apk --update add git openssh gnupg && \
rm -rf /var/lib/apt/lists/* && \
rm /var/cache/apk/*

COPY ssh /ssh
RUN ssh-keyscan ekosystem.staging.slovensko.digital >> /ssh/known_hosts

RUN git clone --depth 1 https://github.com/slovensko-digital/navody-frontend.git /navody-frontend
RUN git --git-dir=/navody-frontend/.git --work-tree=/navody-frontend remote add staging dokku@ekosystem.staging.slovensko.digital:navody-frontend

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["--help"]

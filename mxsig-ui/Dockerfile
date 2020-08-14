FROM httpd:2.4-alpine

RUN apk update && apk upgrade
RUN apk -q add curl vim libcap

COPY mdm-client /usr/local/apache2/htdocs/mdm-client

RUN chown -hR www-data:www-data /usr/local/apache2/

#setcap to bind to privileged ports as non-root
RUN setcap 'cap_net_bind_service=+ep' /usr/local/apache2/bin/httpd
RUN getcap /usr/local/apache2/bin/httpd

HEALTHCHECK --interval=60s --timeout=30s CMD nc -zv localhost 80 || exit 1
#Run as a www-data
USER www-data

EXPOSE 80
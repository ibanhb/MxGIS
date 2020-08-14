FROM mxsig/mxsig_docker_tomcat:v4

LABEL MxSIG INEGI

RUN cd /opt/tomcat/webapps/ && \
    rm -rf mdmservices.war

RUN cd /opt/tomcat/webapps/ && \
    rm -rf mdmservices

COPY mdmservices.war /opt/tomcat/webapps

RUN useradd -m tomcat

RUN chown -R tomcat /opt/tomcat

RUN chown -R tomcat /usr/local

USER tomcat

####COPY geowebcache.xml /usr/local/data/geowebcache/

COPY solr-config /usr/local/instalacion/tomcat-solr/solr-config/

EXPOSE 8080
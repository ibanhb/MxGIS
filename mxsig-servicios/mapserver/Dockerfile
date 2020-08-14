FROM geodata/mapserver

ENV ORACLE_HOME=/opt/instantclient
ENV LD_LIBRARY_PATH=${ORACLE_HOME}:/usr/lib

LABEL MxSIG INEGI

RUN mkdir /opt/map

COPY map /opt/map

RUN mkdir /opt/map/fonts

COPY fonts /opt/map/fonts

RUN mkdir /logs

RUN mkdir /logs/mapserver

RUN cd /logs/mapserver &&\
	touch mxsigvector.log &&\
	chmod 777 -R /logs/

RUN cd /logs/mapserver &&\
	touch mxsigleyenda.log &&\
	chmod 777 -R /logs/

RUN cd /logs/mapserver &&\
	touch mxsigtexto.log &&\
	chmod 777 -R /logs/

COPY ./proj /usr/share/proj

EXPOSE 80

FROM ubuntu:14.04

MAINTAINER Ndifreke Ekott <ndy40.ekott@gmail.com>

# Env
ENV SLIMERJS_VERSION 0.9.6
ENV SLIMERJS_URL http://download.slimerjs.org/releases/0.9.6/slimerjs-$SLIMERJS_VERSION.zip
ENV PHANTOMJS_VERSION 2.1.1 
ENV PHANTOMJS_URL https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2
ENV PHANTOMJS_FILE $PHANTOMJS_VERSION.tar.bz2
ENV CASPERJS_VERSION 1.1.1
ENV CASPERJS_URL https://github.com/casperjs/casperjs/archive/$CASPERJS_VERSION.zip
ENV FIREFOX_URL https://ftp.mozilla.org/pub/firefox/releases/38.0.1/linux-x86_64/en-GB/firefox-38.0.1.tar.bz2


# Commands to install 
RUN \
    apt-get -qq update && \
    apt-get -qq -y install wget firefox xvfb unzip libfontconfig libssl-dev libxft-dev python && \
    mkdir -p /tools/var && \
    wget --no-check-certificate --no-proxy -q -O /tools/$PHANTOMJS_FILE $PHANTOMJS_URL && \
    tar -xjf /tools/$PHANTOMJS_FILE -C /tmp && \
    rm -f /tools/$PHANTOMJS_FILE && \
    mv /tmp/phantomjs-$PHANTOMJS_VERSION-linux-x86_64 /tools/var/phantomjs && \   
    ln -s /tools/var/phantomjs/bin/phantomjs /usr/bin/phantomjs && \
    wget --no-check-certificate --no-proxy -q -O /tools/$CASPERJS_VERSION.zip $CASPERJS_URL && \
    unzip /tools/$CASPERJS_VERSION.zip -d /tools/ && \
    mv /tools/casperjs-$CASPERJS_VERSION /tools/var/casperjs && \
    rm -f /tools/$CASPERJS_VERSION.zip && \
    ln -s /tools/var/casperjs/bin/casperjs /usr/bin/casperjs && \
    wget --no-check-certificate --no-proxy -q -O /tools/firefox.tar.bz2 $FIREFOX_URL && \
    tar -xjf /tools/firefox.tar.bz2 -C /tmp && rm -f /tools/firefox.tar.bz2 && \
    mv /tmp/firefox /tools/var/firefox && \
    ln -sf /tools/var/firefox/firefox /usr/bin/firefox && \
    wget --no-check-certificate --no-proxy -q -O /tools/slimerjs-$SLIMERJS_VERSION.zip $SLIMERJS_URL && \
    unzip /tools/slimerjs-$SLIMERJS_VERSION.zip -d /tools/ && \
    mv /tools/slimerjs-$SLIMERJS_VERSION /tools/var/slimerjs && \
    rm -f /tools/slimerjs-$SLIMERJS_VERSION.zip && \
    ln -sf /tools/var/slimerjs/slimerjs /usr/bin/slimerjs && \
    echo '#!/bin/bash\n/tools/var/casperjs/bin/casperjs "$@"' >> /tools/var/casperjs/casperjs.sh && \
    chmod 755 /tools/var/casperjs/casperjs.sh && \
    ln -sf /tools/var/casperjs/casperjs.sh /usr/bin/casperjs && \
    apt-get autoremove  && \
    apt-get clean all


# Default commands - Xvfb :2 > /dev/null 2>&1 &\n export DISPLAY=:2\n 
CMD ["/usr/bin/casperjs"]
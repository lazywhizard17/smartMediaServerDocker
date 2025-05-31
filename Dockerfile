FROM pythoncustomimage

WORKDIR /app
COPY main.py .
COPY script.js .
COPY index.html .
ENV PORT_NUMBER=16867
RUN mkdir public
RUN mv script.js ./public/
RUN mv index.html ./public/


CMD [ "python", "main.py" ]
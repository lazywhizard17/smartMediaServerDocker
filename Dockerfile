FROM python:3.11-slim
RUN apt update
RUN pip install flask 
RUN pip install pymongo

WORKDIR /app

COPY main.py .
COPY script.js .
COPY index.html .

RUN mkdir public
RUN mv script.js ./public/
RUN mv index.html ./public/

CMD [ "python", "main.py" ]

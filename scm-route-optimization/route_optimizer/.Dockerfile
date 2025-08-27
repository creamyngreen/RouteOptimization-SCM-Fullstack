FROM python:3.12.4
WORKDIR /route_optimizer 
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . /route_optimizer/
EXPOSE 8000

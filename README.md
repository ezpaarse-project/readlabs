# ReadLabs

TODO

**Table of content**

TODO

## Description

TODO

Each micro service : 
* [graphql](./services/graphql#ezunpaywall-graphql)
* [enrich](./services/enrich#ezunpaywall-enrich)
* [update](./services/update#ezunpaywall-update)
* [apikey](./services/apikey#ezunpaywall-apikey) 

## Network-flow

TODO

## Installation

```bash
git clone https://github.com/ezpaarse-project/readlabs 
```
### Development

#### Prerequisites

The tools you need to let ezunpaywall run are :
* docker
* npm

Command : 

```bash
# install dependencies
npm i

# create volume for elastic
docker-compose -f docker-compose.debug.yml run --rm elastic chown -R elasticsearch /usr/share/elasticsearch/ 
```
#### Start

```bash
# Start ezunpaywall as daemon
docker-compose -f docker-compose.debug.yml up -d

# Stop ezunpaywall
docker-compose -f docker-compose.debug.yml stop

# Get the status of ezunpaywall services
docker-compose -f docker-compose.debug.yml ps
```
#### Tests
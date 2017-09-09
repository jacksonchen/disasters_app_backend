# Disasters Data Crowdsource Application Backend
Backend for a disaster data crowdsourcing app. PennApps Fall 2017.

Contributors: Jackson Chen, Prakruth Adari, Arsalaan Ansari (Mobile)

## Setup

Create a `config/` directory, and within it `default.json`. This will hold all of the API keys.

The `default.json` file should be structured like the following:
```
{
  "Foursquare": {
    "CLIENT_ID": <your_client_id>,
    "CLIENT_SECRET": <your_client_secret>
  },
  "Google": {
    "KEY": <key>
  }
}
```

## API

(1) Querying data from a given latitude and longitude: Make a `post` request to `/` with the following
JSON in the body
```
{
  "latitude": <float_number>,
  "longitude": <float_number>
}
```

(2) Updating locations with crowdsourced information: Make a `post` request to `/update` with the
following JSON in the body
```
{
  "type": <grocer|gas|shelter>,
  "latitude": <float_number>,
  "longitude": <float_number>,
  "status": <new_status>
}
```

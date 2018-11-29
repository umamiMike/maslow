## assemble data
- [ ] parse log files
## data structures
### managed devices
- Tammys phone
- mikes tablet
- peters macbook
## sites
[
  {
    "name": "netflix",
      "servers_regex": [
      'www.netflix.com',
      'www.geo.netflix.com',
      'www.us-west-\d.prod\w\w.netflix.com',
      ]

  }
]
[
{
  "name": "public",
    "sites": [
    "wikipedia" ,
    "dictionary.com",
    "the_weather channel"
    ]
}
   ]
   [
{
  "name": "peter's macbook",
    "mac_address" : "8a:f1:7b:59:22:71",
    "default_policy" : "Public",
    "available_policies" : [
      "public",
    "streaming",
    ],
    "current_policy" : "streaming"
      "current_policy_expiration": "timestamp_utc"
}
   ]


## Policies
sites associated with category
a list of dns regex's associated with those sites
---
Example: Educational
- site: wikipedia
  list of machines
    wikicdn###.wikia.org
- Social:
  netflix

- Public
- All
- Sexy
- Streaming
## UI for managing and administering regex patterns for managing white and
blacklists

## push data

## pull data
- [ ] upload info derived from logs to firebase
  - in a particular form
  - json blobs in the form of ...

### datastore
- pull down policy information on a per device basis
- should retrieve general policy information 
- should be able to create iptables rules
- should be daemonized

## Authentication and Security

## execute commands on device
- correspond  mac addresses of devices retrieved from firebase and ip addresses  ip current addresses of
connected devices using dnsmasq
## garbage collect
every so often it should 
it should determine if the rules it pulls from firebase are still active
and yank them, update them

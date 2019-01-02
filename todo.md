Python code:

[X] - Write script that reads dnsmasq.leases and uploads device data to firebase
[X] - Write script that scans dnsmasq.log output and builds a dictionary of names and IP addresses
[X] - Pull down all values from the following collections: "devices", "policies", "sites", "temporaryPolicies" and construct a map of slices {macAddress: [regex...]}
[ ] - refactor firebase connection establishment from db.go get()
[ ] - generate a list of blocking rules based on 4 & 5

> [ ] - Write a firebase function that takes a list of MAC addresses and returns a set of whitelists for each one
> [ ] - Python script which uploads MAC addresses and receives whitelists and implements iptables rules
> [ ] - Daemonize all python scripts

Electron client:

[ ] - Mac client which runs in electron which has a username/password and mac address and downloads current policy data
[ ] - Mac client which allows the user to change the policy temporarily

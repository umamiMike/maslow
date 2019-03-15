# Web admin client:

## top priority:

[ ] - Make **open** policy editable
[ ] - Be able to delete something from a list of stuff in the middle (i.e. a 'minus' button)
[ ] - PREVENT trailing empty at the end of a site because it matches **everything**
[ ] - See how stuff looks on mobile
[X] - Make a special "**open**" policy where we set the device-policy to -j ACCEPT
[X] - Ensure that we can always get to www.maslowsystem.com
[ ] - Fix bug where we can't edit a recently-created device
[ ] - Implement a system where we can "approve" or "deny" new-user creation

## lower priority:

[ ] - Fix horrible TS shortcuts
[ ] - Make the navbar highlight the current path
[ ] - Implement CI for UI with firebase hosting
[ ] - ensure that a site does not belong to a policy before it is deleted

# Router:

## top priority:
- [ ] test dnslog.go
- [ ] test db.go
- [ ] test dnsmasq.go
- [ ] test iptables.go
- [ ] test utils.go

- [ ]  refactor firebase connection establishment from db.go get()
- [ ]  When new devices are found, create them only if they do not exist already
- [ ] run iptables periodically on router (with crontab)
- [ ] run push-arp on router (with crontab)
- [ ] Update installation instructions for setting up crontab

[X] - Get "open" rules working
[ ] - Talk to firebase less: leave a persistent connection to firebase up and write files to filesystem when there are changes
[ ] - Pay attention to CNAMEs for address resolution
[ ] - De-bounce dnsmasq.log change
[ ] - Only modify chains that change rather than all of them
[ ] - Run `router_service` as a daemon so that it can react more quickly to changes
[ ] - refactor firebase connection establishment from db.go get()
[ ] - Implement docsnap.DataTo() https://godoc.org/cloud.google.com/go/firestore#hdr-Reading to load structs
[ ] - Use queries to make db interaction cleaner https://godoc.org/cloud.google.com/go/firestore#hdr-Queries

[X] - Only modify iptables rules upon DNS update when there is a change to a rule at all
[X] - split out everything into separate chains so that the system can be modified more easily
[X] - Tail files
[X] - Implement all firewall rules from the ground up to ensure proper state of the system
[X] - When new devices are found, create them only if they do not exist already
[X] - run iptables periodically on router (with crontab)
[X] - run push-arp on router (with crontab)
[X] - Update installation instructions for setting up crontab
[ ] - Write a firebase function that takes a list of MAC addresses and returns a set of whitelists for each one

# Firebase:

[ ] - check in all functions
[ ] - implement cloud function to run periodically to clean out old temporaryPolicies

# Electron client:

[ ] - Mac client which runs in electron which has a username/password and mac address and downloads current policy data
[ ] - Mac client which allows the user to change the policy temporarily

# Chrome plugin:

[ ] - Have a chrome extension which can create a maslow rule for the site you're on

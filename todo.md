# Web admin client:

## top priority:

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

# # top priority:

[ ] - Tail files and run `router_service` as a daemon so that it can react more quickly to changes
[ ] - Talk to firebase less: leave a persistent connection to firebase up and write files to filesystem when there are changes
[ ] - refactor firebase connection establishment from db.go get()
[X] - When new devices are found, create them only if they do not exist already
[X] - run iptables periodically on router (with crontab)
[X] - run push-arp on router (with crontab)
[X] - Update installation instructions for setting up crontab

## lower priority:

[ ] - Write a firebase function that takes a list of MAC addresses and returns a set of whitelists for each one
[ ] - Be able to run maslow as a daemon

# Firebase:

[ ] - check in all functions
[ ] - implement cloud function to run periodically to clean out old temporaryPolicies

# Electron client:

[ ] - Mac client which runs in electron which has a username/password and mac address and downloads current policy data
[ ] - Mac client which allows the user to change the policy temporarily

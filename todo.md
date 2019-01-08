Web admin client:

  top priority:
  [ ] - See how stuff looks on mobile
  [ ] - Fix bug where we can't edit a recently-created device
  [ ] - Implement a system where we can "approve" or "deny" new-user creation

  lower priority:
  [ ] - Fix horrible TS shortcuts
  [ ] - Make the navbar highlight the current path
  [ ] - Implement CI for UI with firebase hosting
  [ ] - ensure that a site does not belong to a policy before it is deleted

Router:

  top priority:
  [ ] - refactor firebase connection establishment from db.go get()
  XX] - When new devices are found, create them only if they do not exist already
  [ ] - run iptables periodically on router (with crontab)
  [ ] - run push-arp on router (with crontab)
  [ ] - Update installation instructions for setting up crontab

  lower priority:
  [ ] - Write a firebase function that takes a list of MAC addresses and returns a set of whitelists for each one
  [ ] - Be able to run maslow as a daemon

Firebase:

  [ ] - implement cloud function to run periodically to clean out old temporaryPolicies

Electron client:

  [ ] - Mac client which runs in electron which has a username/password and mac address and downloads current policy data
  [ ] - Mac client which allows the user to change the policy temporarily

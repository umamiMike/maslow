![build-status](https://travis-ci.org/umamiMike/maslow.svg?branch=master)

# Overview

The notion is that half of the code in this system runs on your wifi router.
This is meant to be used on a [ddwrt](http://www.dd-wrt.com/site/index) router
that can run a go binary, and has iptables support. 

This code frequently checks with your admin site for rules to implement. It also reports up to the website any and all
MAC addresses that are connected to it. The notion here is that the
access-point is open and by default allows people through, then you, as an
administrator, log in to the website, decide what devices connected to your
network are what, and assign basic policies to them:

- No internet access
- Full internet access
- Permission-based access

The permission-based access nodes get access to the Internet for thirty (30)
minutes at a time. 

The idea here is that someone on your network says, "I'd
like to use the Internet for a while." and you, as their friend say, "Cool, I
know you've done your work and have gotten lots of exercise today, so go
ahead and use it for half an hour!" Then you pull out your smartphone,
navigate to a web address you have bookmarked (or possibly open an app), find
your friend's device in the list, and tap "grant permission." Your friend now
has open access for that amount of time.

Should your friend want more access after their time is up, they have to ask you
again. It makes sure that you all understand how much time is being used and
that they are spending their time wisely.


## Set up the router

1. you will have to generate a secret.json file from firebase into the secrets directory.


## Set up crontab

```
echo '* * * * * root SSL_CERT_DIR=/opt/etc/ssl/certs SECRET_FILE=/tmp/root/maslow-service-credentials.json /tmp/root/router_service iptables /tmp/dnsmasq.log /tmp/dnsmasq.leases' > /tmp/cron.d/maslow-policy
echo '30 * * * * root SSL_CERT_DIR=/opt/etc/ssl/certs SECRET_FILE=/tmp/root/maslow-service-credentials.json /tmp/root/router_service parse-leases /tmp/dnsmasq.leases' > /tmp/cron.d/maslow-devices
stopservice crond && startservice crond
```

```
umount /dev/sda1
mount /dev/sda1 /opt
curl -Ok https://raw.githubusercontent.com/psbanka/configuration-files/master/.tmux.conf
tmux
opkg install ca-certificates

cat > .bash_profile << EOF
export SECRET_FILE=/tmp/root/maslow-service-credentials.json
export SSL_CERT_DIR=/opt/etc/ssl/certs
EOF
bash
```

```
root@speck:~# ./router_service parse-leases /tmp/dnsmasq.leases
```

```
dnsmasq -u root -g root --conf-file=/tmp/dnsmasq.conf --cache-size=1500 --dhcp-option=252," "
```

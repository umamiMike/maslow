export DL=../test/logs/dnsmasq.log
export DLE=../test/logs/dnsmasq.leases
make; ./builds/dev iptables $DL $DLE 

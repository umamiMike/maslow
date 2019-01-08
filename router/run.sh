export DL=../test/logs/dnsmasq_big.log
export DLE=../test/logs/dnsmasq.leases
make; ./builds/dev iptables $DL $DLE 

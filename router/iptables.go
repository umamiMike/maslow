package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"regexp"
	"strings"
	"time"
)

// -------------- Constants
var ruleName = "grp_1"
var ipTables = "/usr/sbin/iptables"
var whitelistRule = "-A %s -s %s -d %s -p tcp -j ACCEPT"
var openRule = "-A %s -j ACCEPT"
var singleRejectRule = "-A %s -p tcp -j REJECT"

var alwaysAllowedIps = [2]string{"76.105.253.140", "151.101.1.195"}

// Using a map of empty structs to simulate a set
type set map[string]struct{}

func generateDeviceChains(leaseDict LeaseDict, serverData ServerData) ([]string, []string) {
	var commands []string
	var localAddresses []string
	for mac, devicePolicyData := range serverData.Devices {
		onLocalNetwork := false
		var ipAddress string
		for _, host := range leaseDict {
			if host.Mac == mac {
				onLocalNetwork = true
				ipAddress = host.IP
				break
			}
		}
		if !onLocalNetwork {
			continue // ignore devices that are not local
		}
		localAddresses = append(localAddresses, mac)
		chain := formatChainName(fmt.Sprintf("grp_device_%s_%s", fmt.Sprint(devicePolicyData.Name), mac))
		commands = append(commands, fmt.Sprintf("--delete-chain %s", chain))
		commands = append(commands, fmt.Sprintf("--new %s", chain))
		commands = append(commands, fmt.Sprintf("-I FORWARD -s %s -j %s", ipAddress, chain))
		commands = append(commands, fmt.Sprintf(singleRejectRule, chain))
	}
	return commands, localAddresses
}

// chain names must be < 30 chars and cannot have spaces. let's lowercase while we're at it...
func formatChainName(chainName string) string {
	nospaces := strings.Replace(chainName, " ", "", -1)
	lower := strings.ToLower(nospaces)
	if len(lower) > 30 {
		return lower[:30]
	}
	return lower
}

func generatePolicyChains(serverData ServerData, localAddresses []string) []string {
	var commands []string
	for policyID, policy := range serverData.Policies {
		policyChain := formatChainName(fmt.Sprintf("grp_policy_%s_%s", policy.Name, policyID))
		commands = append(commands, fmt.Sprintf("--delete-chain %s", policyChain))
		commands = append(commands, fmt.Sprintf("--new %s", policyChain))

		// For each device that has the policy, stick it in the device's chain!
		for _, localAddress := range localAddresses {
			devicePolicyData := serverData.Devices[localAddress]
			deviceChain := formatChainName(fmt.Sprintf("grp_device_%s_%s", devicePolicyData.Name, localAddress))
			temporaryPolicyInEffect := devicePolicyData.TemporaryPolicyID == policyID && devicePolicyData.EndTime.After(time.Now())
			if devicePolicyData.DefaultPolicyID == policyID || temporaryPolicyInEffect {
				commands = append(commands, fmt.Sprintf("-I %s -j %s", deviceChain, policyChain))
			}
		}
		// Go ahead and add jumps to each site chain that this contains
		for _, siteID := range policy.Sites {
			siteData := serverData.Sites[siteID]
			siteChain := formatChainName(fmt.Sprintf("grp_site_%s_%s", siteData.Name, siteID))
			commands = append(commands, fmt.Sprintf("-I %s -j %s", policyChain, siteChain))
		}
	}
	return commands
}

func getAddressesForRegex(addressRegexList []string, dnsMap DnsMap) []string {
	allowedIPs := set{}
	allowAll := false
	var output []string

	for _, addressRegex := range addressRegexList {
		if addressRegex == "*" {
			allowAll = true
			break
		}

		r, _ := regexp.Compile(addressRegex)
		for name, addressMap := range dnsMap {
			if r.MatchString(name) {
				for address := range addressMap {
					allowedIPs[address] = struct{}{}
				}
			}
		}
	}

	if allowAll {
		output = []string{"*"}
	} else {
		for ip := range allowedIPs {
			output = append(output, ip)
		}
		for _, ip := range alwaysAllowedIps {
			output = append(output, ip)
		}
	}
	return output
}

func generateSiteChains(serverData ServerData, dnsMap DnsMap) []string {
	var commands []string
	for siteID, siteData := range serverData.Sites {
		siteChain := formatChainName(fmt.Sprintf("grp_site_%s_%s", siteData.Name, siteID))
		commands = append(commands, fmt.Sprintf("--delete-chain %s", siteChain))
		commands = append(commands, fmt.Sprintf("--new %s", siteChain))
		for _, address := range getAddressesForRegex(siteData.RegexList, dnsMap) {
			commands = append(commands, fmt.Sprintf("-I %s -p tcp -d %s -j ACCEPT", siteChain, address))
		}
	}
	return commands
}

func executeBatch(commands []string) {
	_, err := os.Stat(ipTables)
	if err != nil {
		log.Fatalln(ipTables + " does not exist")
	}
	status := 0
	for _, command := range commands {
		log.Printf("Running command and waiting for it to finish...%s", command)
		parts := strings.Split(command, " ")
		cmd := exec.Command(ipTables, parts...)
		err := cmd.Run()
		if err != nil {
			log.Fatalf("Command finished with error: %s %v", command, err)
			status = 1
		}
	}
	log.Println("Implemented %d", status)
}

func implementIPTablesRules(leaseDict LeaseDict, serverData ServerData, dnsMap DnsMap) {
	log.Println("Generating iptables rules...")
	// TODO: delete all existing rules in FORWARD and re-create
	/*
		:FORWARD ACCEPT [37703:37111553]
		-A FORWARD -p tcp -m tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu
		:FORWARD ACCEPT [0:0]
		-A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT
		-A FORWARD -s 192.168.1.0/255.255.255.0 -o vlan2 -p gre -j ACCEPT
		-A FORWARD -s 192.168.1.0/255.255.255.0 -o vlan2 -p tcp -m tcp --dport 1723 -j ACCEPT
		-A FORWARD -j lan2wan
		-A FORWARD -i br0 -o br0 -j ACCEPT
		-A FORWARD -i vlan2 -o br0 -j TRIGGER --trigger-proto --trigger-match 0-0 --trigger-relate 0-0
		-A FORWARD -i br0 -j trigger_out
		-A FORWARD -i br0 -m state --state NEW -j ACCEPT
		-A FORWARD -j DROP
	*/
	deviceCommands, localAddresses := generateDeviceChains(leaseDict, serverData)
	policyCommands := generatePolicyChains(serverData, localAddresses)
	siteCommands := generateSiteChains(serverData, dnsMap)
	commands := append(deviceCommands, policyCommands...)
	commands = append(commands, siteCommands...)
	for _, command := range commands {
		fmt.Println(command)
	}
	executeBatch(commands)
	log.Println("rules updated")
}

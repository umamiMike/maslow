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
var ipTables = "/usr/sbin/iptables"
var alwaysAllowedIps = [2]string{"76.105.253.140", "151.101.1.195"}

// Using a map of empty structs to simulate a set
type set map[string]struct{}

type iptCommand struct {
	command     string
	mustSucceed bool
}

func generateDeviceChains(leaseDict LeaseDict, serverData ServerData) ([]iptCommand, []string) {
	var commands []iptCommand
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
		commands = append(commands, iptCommand{fmt.Sprintf("--flush %s", chain), false})
		commands = append(commands, iptCommand{fmt.Sprintf("--delete-chain %s", chain), false})
		commands = append(commands, iptCommand{fmt.Sprintf("--new %s", chain), true})
		commands = append(commands, iptCommand{fmt.Sprintf("-I FORWARD -s %s -j %s", ipAddress, chain), true})
		commands = append(commands, iptCommand{fmt.Sprintf("-A %s -p tcp -j REJECT", chain), true})
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

func generatePolicyChains(serverData ServerData, localAddresses []string) []iptCommand {
	var commands []iptCommand
	for policyID, policy := range serverData.Policies {
		policyChain := formatChainName(fmt.Sprintf("grp_policy_%s_%s", policy.Name, policyID))
		commands = append(commands, iptCommand{fmt.Sprintf("--flush %s", policyChain), false})
		commands = append(commands, iptCommand{fmt.Sprintf("--delete-chain %s", policyChain), false})
		commands = append(commands, iptCommand{fmt.Sprintf("--new %s", policyChain), true})

		// For each device that has the policy, stick it in the device's chain!
		for _, localAddress := range localAddresses {
			devicePolicyData := serverData.Devices[localAddress]
			deviceChain := formatChainName(fmt.Sprintf("grp_device_%s_%s", devicePolicyData.Name, localAddress))
			temporaryPolicyInEffect := devicePolicyData.TemporaryPolicyID == policyID && devicePolicyData.EndTime.After(time.Now())
			if devicePolicyData.DefaultPolicyID == policyID || temporaryPolicyInEffect {
				commands = append(commands, iptCommand{fmt.Sprintf("-I %s -j %s", deviceChain, policyChain), true})
			}
		}

		if policy.Name == "__open__" {
			// The __open__ chain doesn't have sites, it merely accepts all traffic
			commands = append(commands, iptCommand{fmt.Sprintf("-I %s -j ACCEPT", policyChain), true})
		} else {
			// Go ahead and add jumps to each site chain that this contains
			for _, siteID := range policy.Sites {
				siteData := serverData.Sites[siteID]
				siteChain := formatChainName(fmt.Sprintf("grp_site_%s_%s", siteData.Name, siteID))
				commands = append(commands, iptCommand{fmt.Sprintf("-I %s -j %s", policyChain, siteChain), true})
			}
		}
	}
	return commands
}

func getAddressesForRegex(addressRegexList []string, dnsMap DNSMap) []string {
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

func generateSiteChains(serverData ServerData, dnsMap DNSMap) []iptCommand {
	var commands []iptCommand
	for siteID, siteData := range serverData.Sites {
		siteChain := formatChainName(fmt.Sprintf("grp_site_%s_%s", siteData.Name, siteID))
		commands = append(commands, iptCommand{fmt.Sprintf("--flush %s", siteChain), false})
		commands = append(commands, iptCommand{fmt.Sprintf("--delete-chain %s", siteChain), false})
		commands = append(commands, iptCommand{fmt.Sprintf("--new %s", siteChain), true})

		for _, address := range getAddressesForRegex(siteData.RegexList, dnsMap) {
			commands = append(commands, iptCommand{fmt.Sprintf("-I %s -p tcp -d %s -j ACCEPT", siteChain, address), true})
		}
	}
	return commands
}

func executeBatch(commands []iptCommand) {
	_, err := os.Stat(ipTables)
	if err != nil {
		log.Fatalln(ipTables + " does not exist")
	}
	status := 0
	for _, command := range commands {
		// log.Printf("Running command and waiting for it to finish.. .%s (ok to fail? %t)", command.command, command.mustSucceed)
		parts := strings.Split(command.command, " ")
		cmd := exec.Command(ipTables, parts...)
		err := cmd.Run()
		if err != nil && command.mustSucceed {
			log.Fatalf("Command finished with error: %s %v", command.command, err) // TODO: change back to log.Printf
			status = 1
		}
	}
	log.Printf("Implemented %d\n", status)
}

func implementIPTablesRules(leaseDict LeaseDict, serverData ServerData, dnsMap DNSMap) {
	log.Println("Generating iptables rules...")
	systemCommands := []iptCommand{
		iptCommand{"-P FORWARD ACCEPT", true},
		iptCommand{"-F", true},
		iptCommand{"-t nat -X", true},
		iptCommand{"-t mangle -F", true},
		iptCommand{"-X", true},
		iptCommand{"--new lan2wan", true},
		iptCommand{"--new logaccept", true},
		iptCommand{"--new logdrop", true},
		iptCommand{"--new logreject", true},
		iptCommand{"--new trigger_out", true},
		iptCommand{"-t nat -P PREROUTING ACCEPT", true},
		iptCommand{"-t nat -A PREROUTING -d 10.0.0.126 -p tcp -m tcp --dport 22 -j DNAT --to-destination 192.168.1.1:22", true},
		iptCommand{"-t nat -A PREROUTING -d 10.0.0.126 -p icmp -j DNAT --to-destination 192.168.1.1", true},
		iptCommand{"-t nat -A PREROUTING -d 10.0.0.126 -j TRIGGER --trigger-proto --trigger-match 0-0 --trigger-relate 0-0", false},
		iptCommand{"-t nat -A POSTROUTING -s 192.168.1.0/255.255.255.0 -o vlan2 -j SNAT --to-source 10.0.0.126", true},
		iptCommand{"-t nat -A POSTROUTING -m mark -j MASQUERADE", false},
		iptCommand{"-t mangle -A PREROUTING -d 10.0.0.126 -i ! vlan2 -j MARK", false},
		iptCommand{"-t mangle -A PREROUTING -j CONNMARK --save-mark", true},
		iptCommand{"-t mangle -A FORWARD -p tcp -m tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu", true},
		iptCommand{"-A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT", true},
		iptCommand{"-A INPUT -i vlan2 -p udp -m udp --sport 67 --dport 68 -j ACCEPT", true},
		iptCommand{"-A INPUT -i vlan2 -p udp -m udp --dport 520 -j DROP", true},
		iptCommand{"-A INPUT -i br0 -p udp -m udp --dport 520 -j DROP", true},
		iptCommand{"-A INPUT -p udp -m udp --dport 520 -j ACCEPT", true},
		iptCommand{"-A INPUT -d 192.168.1.1 -i vlan2 -p tcp -m tcp --dport 22 -j ACCEPT", true},
		iptCommand{"-A INPUT -i vlan2 -p icmp -j DROP", true},
		iptCommand{"-A INPUT -p igmp -j DROP", true},
		iptCommand{"-A INPUT -i lo -m state --state NEW -j ACCEPT", true},
		iptCommand{"-A INPUT -i br0 -m state --state NEW -j ACCEPT", true},
		iptCommand{"-A INPUT -j DROP", true},
		iptCommand{"-A FORWARD -p tcp -m tcp --tcp-flags SYN,RST SYN -j TCPMSS --clamp-mss-to-pmtu", true},
		iptCommand{"-A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT", true},
		iptCommand{"-A FORWARD -s 192.168.1.0/255.255.255.0 -o vlan2 -p gre -j ACCEPT", true},
		iptCommand{"-A FORWARD -s 192.168.1.0/255.255.255.0 -o vlan2 -p tcp -m tcp --dport 1723 -j ACCEPT", true},
		iptCommand{"-A FORWARD -j lan2wan", true},
		iptCommand{"-A FORWARD -i br0 -o br0 -j ACCEPT", true},
		iptCommand{"-A FORWARD -i vlan2 -o br0 -j TRIGGER --trigger-proto --trigger-match 0-0 --trigger-relate 0-0", false},
		iptCommand{"-A FORWARD -i br0 -j trigger_out", true},
		iptCommand{"-A FORWARD -i br0 -m state --state NEW -j ACCEPT", true},
		iptCommand{"-A FORWARD -j DROP", true},
	}
	deviceCommands, localAddresses := generateDeviceChains(leaseDict, serverData)
	policyCommands := generatePolicyChains(serverData, localAddresses)
	siteCommands := generateSiteChains(serverData, dnsMap)
	var commands []iptCommand
	commands = systemCommands
	commands = append(commands, deviceCommands...)
	commands = append(commands, siteCommands...)
	commands = append(commands, policyCommands...)
	// for _, command := range commands {
	// 	fmt.Println(command)
	// }
	executeBatch(commands)
	log.Println("rules updated")
}

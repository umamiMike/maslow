package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"regexp"
	"strings"
)

// -------------- Constants
var ruleName = "grp_1"
var ipTables = "/usr/sbin/iptables"

// Using a map of empty structs to simulate a set
type set map[string]struct{}

/** For each device
 * - Grab the current regex
 * - apply regex to all current DNS data
 * - print out device IP / target IP
 */
func generateWhitelist(dnsMap map[string][]string, hostMap map[string]host, devicePolicies devicePolicyMap) map[string][]string {
	// TODO: Add failsafe to www.maslowsystem.com
	output := make(map[string][]string)
	for mac, addressRegexList := range devicePolicies {
		ipAddress := hostMap[mac].IP
		if ipAddress == "" {
			fmt.Println("Ignoring device that is not local:", mac)
			continue
		}
		fmt.Println("Generating whiteList for", mac)
		forbiddenIPs := set{}
		for _, addressRegex := range addressRegexList {
			r, _ := regexp.Compile(addressRegex)
			for name, addresses := range dnsMap {
				if r.MatchString(name) {
					for _, address := range addresses {
						forbiddenIPs[address] = struct{}{}
					}
				}
			}
		}

		for ip := range forbiddenIPs {
			output[ipAddress] = append(output[ipAddress], ip)
		}
	}
	return output
}

func makeIPTablesRules(whitelist map[string][]string) []string {
	output := []string{
		"-F " + ruleName,
	}
	for localIP, remoteIPList := range whitelist {
		for _, remoteIP := range remoteIPList {
			val := fmt.Sprintf("-A %s -s %s -d %s -j ACCEPT", ruleName, localIP, remoteIP)
			output = append(output, val)
		}
	}
	output = append(output, fmt.Sprintf("-A %s -j REJECT", ruleName))
	return output
}
func executeBatch(commands []string) {
	_, err := os.Stat(ipTables)
	if err != nil {
		log.Println(ipTables + " does not exist")
	}
	os.Exit(1)
	for _, command := range commands {
		log.Printf("Running command and waiting for it to finish...%s", command)
		parts := strings.Split(command, " ")
		cmd := exec.Command(ipTables, parts...)
		err := cmd.Run()
		if err == nil {
			log.Printf("No errors.")
		} else {
			log.Printf("Command finished with error: %v", err)
		}
	}
}

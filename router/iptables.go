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
var whitelistRule = "-A %s -s %s -d %s -j ACCEPT"
var openRule = "-A %s -s %s -j ACCEPT"
var singleRejectRule = "-A %s -s %s -j REJECT"
var systemPolicyRule = "-A %s -j ACCEPT"

var alwaysAllowedIps = [2]string{"76.105.253.140", "151.101.1.195"}

// Using a map of empty structs to simulate a set
type set map[string]struct{}

/** For each device
 * - Grab the current regex
 * - apply regex to all current DNS data
 * - print out device IP / target IP
 */
func generateWhitelist(dnsMap DnsMap, leaseDict map[string]host, devicePolicies DevicePolicyMap) map[string][]string {
	// TODO: Add failsafe to www.maslowsystem.com
	output := make(map[string][]string)
	for mac, addressRegexList := range devicePolicies {
		ipAddress := leaseDict[mac].IP
		if ipAddress == "" {
			fmt.Println("Ignoring device that is not local:", mac)
			continue
		}
		fmt.Println("Generating whiteList for", mac)
		allowedIPs := set{}
		allowAll := false

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
			output[ipAddress] = []string{"*"}
		} else {
			for ip := range allowedIPs {
				output[ipAddress] = append(output[ipAddress], ip)
			}
			for _, ip := range alwaysAllowedIps {
				output[ipAddress] = append(output[ipAddress], ip)
			}
		}
	}
	return output
}

func makeIPTablesRules(whitelist map[string][]string) []string {
	output := []string{
		"-F " + ruleName,
	}
	closed := true
	for localIP, remoteIPList := range whitelist {
		for _, remoteIP := range remoteIPList {
			if remoteIP == "*" {
				closed = false
				val := fmt.Sprintf(openRule, ruleName, localIP)
				output = append(output, val)
				break
			} else {
				val := fmt.Sprintf(whitelistRule, ruleName, localIP, remoteIP)
				output = append(output, val)
			}
		}
		if closed {
			output = append(output, fmt.Sprintf(singleRejectRule, ruleName, localIP))
		}
	}
	output = append(output, fmt.Sprintf(systemPolicyRule, ruleName))
	return output
}
func executeBatch(commands []string) {
	_, err := os.Stat(ipTables)
	return // FIXME: REMOVE
	if err != nil {
		log.Println(ipTables + " does not exist")
		os.Exit(1)
	}
	status := 0
	for _, command := range commands {
		log.Printf("Running command and waiting for it to finish...%s", command)
		parts := strings.Split(command, " ")
		cmd := exec.Command(ipTables, parts...)
		err := cmd.Run()
		if err != nil {
			log.Printf("Command finished with error: %v", err)
			status = 1
		}
	}
	os.Exit(status)
}

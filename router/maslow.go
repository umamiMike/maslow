package main

import (
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/spf13/cobra"
)

type policy struct {
	Name string
}

var rootCmd = &cobra.Command{
	Use:   "maslow",
	Short: "a web traffic shaper",
	Long:  "Think of all the wonderful things you will be able to do with your time",
}

var parseLeases = &cobra.Command{
	Use:   "parse-leases",
	Short: "Parse the system dnsmasq.leases file and upload system data to firebase",
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) < 1 {
			fmt.Println("must supply the path to the dnsmasq.leases file")
			os.Exit(1)
		}
		hostMap, err := readAndParseLeases(args[0])
		if err != nil {
			log.Fatal("error parsing leases\n", err)
			os.Exit(1)
		}
		for _, host := range hostMap {
			host.add("devices")
			fmt.Println(">> ", host.Name, host.IP, host.Mac)
		}
	},
}

// Write script that scans dnsmasq.log output and builds a dictionary of names and IP addresses
var parseDNS = &cobra.Command{
	Use:   "parse-dns",
	Short: "Parse the system dnsmasq.log file and write to stdout",
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) < 1 {
			fmt.Println("must supply the path to the dnsmasq.log file")
			os.Exit(1)
		}
		dnsMap, err := readAndParseDNS(args[0])
		if err == nil {
			fmt.Println(dnsMap)
		}
	},
}

// Pull down all values from the following collections: "devices", "policies",
// "sites", "temporaryPolicies" and construct a map of slices {macAddress:
// [regex...]}
var pullRules = &cobra.Command{
	Use:   "pull-rules",
	Short: "Pull all relevant rules from firebase collections",
	Run: func(cmd *cobra.Command, args []string) {
		devicePolicies, err := getDevicePolicies()
		if err == nil {
			for key, value := range devicePolicies {
				fmt.Println(key, value)
			}
		}
	},
}

var iptables = &cobra.Command{
	Use:   "iptables",
	Short: "Generate IPTables rules for this router",
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) < 2 {
			fmt.Println("must supply the path to the dnsmasq.log AND dnsmasq.leases files")
			os.Exit(1)
		}
		fmt.Println("Parsing lease data...")
		hostMap, err := readAndParseLeases(args[1])
		if err != nil {
			log.Fatal("error parsing lease data\n", err)
			os.Exit(1)
		}
		fmt.Println("Parsing DNS data...")
		dnsMap, err := readAndParseDNS(args[0])
		if err != nil {
			log.Fatal("error parsing dns data\n", err)
			os.Exit(1)
		}
		fmt.Println("Downloading policies...")
		devicePolicies, err := getDevicePolicies()
		if err != nil {
			log.Fatal("error downloading policies\n", err)
			os.Exit(1)
		}
		fmt.Println("Generating iptables rules...")
		whitelist := generateWhitelist(dnsMap, hostMap, devicePolicies)
		rules := makeIPTablesRules(whitelist)
		fmt.Println(strings.Join(rules, "\n"))
		executeBatch(rules)
	},
}

func init() {
	rootCmd.AddCommand(parseLeases)
	rootCmd.AddCommand(parseDNS)
	rootCmd.AddCommand(pullRules)
	rootCmd.AddCommand(iptables)
	rootCmd.Execute()

}
func main() {
}

package main

import (
	"log"

	"github.com/davecgh/go-spew/spew"

	"github.com/spf13/cobra"
)

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
			log.Fatalln("must supply the path to the dnsmasq.leases file")
		}
		leaseDict, err := readAndParseLeases(args[0])
		if err != nil {
			log.Fatal("error parsing leases\n", err)
		}
		for _, host := range leaseDict {
			host.add("devices")
			log.Println(">> ", host.Name, host.IP, host.Mac)
		}
	},
}

// Write script that scans dnsmasq.log output and builds a dictionary of names and IP addresses
var parseDNS = &cobra.Command{
	Use:   "parse-dns",
	Short: "Parse the system dnsmasq.log file and write to stdout",
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) < 1 {
			log.Fatalln("must supply the path to the dnsmasq.log file")
		}
		dnsMap, err := readAndParseDNS(args[0])
		if err == nil {
			for _, set := range dnsMap {
				spew.Dump(set)
			}
		}
	},
}

// Write script that scans dnsmasq.log output and builds a dictionary of names and IP addresses
var tailDNS = &cobra.Command{
	Use:   "tail-dns",
	Short: "Tail the system dnsmasq.log file and write to stdout",
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) < 1 {
			log.Fatalln("must supply the path to the dnsmasq.log file")
		}
		// tailAndParseDNS(args[0])
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
				log.Println(key, value)
			}
		}
	},
}

var iptables = &cobra.Command{
	Use:   "iptables",
	Short: "Generate IPTables rules for this router",
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) < 2 {
			log.Fatalln("must supply the path to the dnsmasq.log AND dnsmasq.leases files")
		}
		log.Println("Parsing lease data...")
		leaseDict, err := readAndParseLeases(args[1])
		if err != nil {
			log.Fatal("error parsing lease data\n", err)
		}
		log.Println("Parsing DNS data...")
		dnsMap, err := readAndParseDNS(args[0])
		if err != nil {
			log.Fatal("error parsing dns data\n", err)
		}
		log.Println("Downloading policies...")
		devicePolicies, err := getDevicePolicies()
		if err != nil {
			log.Fatal("error downloading policies\n", err)
		}
		tailAndParseDNS(leaseDict, dnsMap, devicePolicies, args[0])
	},
}

func init() {
	rootCmd.AddCommand(parseLeases)
	rootCmd.AddCommand(tailDNS)
	rootCmd.AddCommand(parseDNS)
	rootCmd.AddCommand(pullRules)
	rootCmd.AddCommand(iptables)
	rootCmd.Execute()
}
func main() {
}

package main

import (
	"fmt"

	"github.com/davecgh/go-spew/spew"
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
			return
		}
		readAndParseLeases(args[0])
	},
}

// Write script that scans dnsmasq.log output and builds a dictionary of names and IP addresses
var parseDNS = &cobra.Command{
	Use:   "parse-dns",
	Short: "Parse the system dnsmasq.log file and write to stdout",
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) < 1 {
			fmt.Println("must supply the path to the dnsmasq.log file")
			return
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
		devicePolicies, error := getDevicePolicies()
		if error == nil {
			spew.Dump(devicePolicies)
		}
	},
}

var iptables = &cobra.Command{
	Use:   "iptables",
	Short: "Generate IPTables rules for this router",
	Run: func(cmd *cobra.Command, args []string) {
		devicePolicies, error := getDevicePolicies()
		if error == nil {
			spew.Dump(devicePolicies)
		}
		readAndParseDNS(args[0])
	},
}

func init() {
	rootCmd.AddCommand(parseLeases)
	rootCmd.AddCommand(parseDNS)
	rootCmd.AddCommand(pullRules)
	rootCmd.Execute()

}
func main() {
}

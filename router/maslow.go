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

var cmdParseLeases = &cobra.Command{
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
var cmdParseDNS = &cobra.Command{
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
var cmdTailDNS = &cobra.Command{
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
var cmdPullRules = &cobra.Command{
	Use:   "pull-rules",
	Short: "Pull all relevant rules from firebase collections",
	Run: func(cmd *cobra.Command, args []string) {
		serverData, err := getServerData()
		if err == nil {
			spew.Dump(serverData)
		}
	},
}

var iptablesFollow bool

var cmdIptables = &cobra.Command{
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
		log.Println("Downloading server data...")
		serverData, err := getServerData()
		if err != nil {
			log.Fatal("error downloading policies\n", err)
		}
		implementIPTablesRules(leaseDict, serverData, dnsMap)
		if iptablesFollow {
			tailAndParseDNS(leaseDict, serverData, dnsMap, args[0])
		}
	},
}

func init() {
	cmdIptables.Flags().BoolVarP(&iptablesFollow, "follow", "f", false, "whether to tail the output or not")
	rootCmd.AddCommand(cmdParseLeases)
	rootCmd.AddCommand(cmdTailDNS)
	rootCmd.AddCommand(cmdParseDNS)
	rootCmd.AddCommand(cmdPullRules)
	rootCmd.AddCommand(cmdIptables)
}
func main() {
	rootCmd.Execute()
}

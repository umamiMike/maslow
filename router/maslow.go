package main

import (
	"fmt"

	"github.com/spf13/cobra"
)

type managed_device struct {
	Name             string   `json: "name"`
	Mac_address      string   `json: "mac_address"`
	Default_policies []policy `json: "default_policies"`
	Id               int      `json: "id"`
}

type policy struct {
	Name string
}

type Site struct {
	Name          string   `json: "name"`
	Servers_regex []string `json: "servers_regex"`
}

var rootCmd = &cobra.Command{
	Use:   "maslow",
	Short: "a web traffic shaper",
	Long:  "Think of all the wonderful things you will be able to do with your time",
}

var parse = &cobra.Command{
	Use:   "parse",
	Short: "Parse the system dnsmasq.leases file and upload system data to firebase",
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) < 1 {
			fmt.Println("must supply the path to the dnsmasq.leases file")
			return
		}
		ReadAndParse(args[0])
	},
}

func init() {
	rootCmd.AddCommand(parse)
	rootCmd.Execute()

}
func main() {
}

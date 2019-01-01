package main

import (
	"fmt"

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

var parse = &cobra.Command{
	Use:   "parse",
	Short: "Parse the system dnsmasq.leases file and upload system data to firebase",
	Run: func(cmd *cobra.Command, args []string) {
		if len(args) < 1 {
			fmt.Println("must supply the path to the dnsmasq.leases file")
			return
		}
		readAndParse(args[0])
	},
}

func init() {
	rootCmd.AddCommand(parse)
	rootCmd.Execute()

}
func main() {
}

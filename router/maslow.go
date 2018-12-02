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

var addsite = &cobra.Command{
	Use:   "addsite",
	Short: "add a site to db",
	Run: func(cmd *cobra.Command, args []string) {

		data := map[string]interface{}{
			"first": args[0],
			"last":  "Surf",
			"born":  2045,
		}

		message := makeConnectionAndAddSite(data)
		fmt.Println(message)

	},
}

func init() {
	rootCmd.AddCommand(addsite)
	rootCmd.Execute()

}
func main() {
}

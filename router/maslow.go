package main

import (
	firebase "firebase.google.com/go"
	"github.com/spf13/cobra"
	//"firebase.google.com/go/auth"
	"fmt"
	"golang.org/x/net/context"
	"google.golang.org/api/option"
	"log"
)

type managed_device struct {
	Name             string   `json: "name"`
	Mac_address      string   `json: "mac_address"`
	Default_policies []policy `json: "default_policies"`
	Id               int      `json: "id"`
}

//func (m *managed_device) addPolicy() err {

//}

type policy struct {
	Name string
}

type Site struct {
	Name          string   `json: "name"`
	Servers_regex []string `json: "servers_regex"`
}

var addsite = &cobra.Command{
	Use:   "addsite",
	Short: "add a site to db",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("inside the addsite cobra command")
		ctx := context.Background()

		config := &firebase.Config{
			DatabaseURL: "https://maslow-test.firebaseio.com",
		}
		opt := option.WithCredentialsFile("../secrets/maslow-test-firebase-adminsdk-dhcpw-61989a0f5b.json")
		app, err := firebase.NewApp(ctx, config, opt)
		if err != nil {
			log.Fatalf("error initializing app: %v\n", err)
		}
		client, err := app.Database(ctx)
		if err != nil {
			log.Fatal(err)
		}

		site := Site{"Netfrlix", []string{"siteregex1", "siteregex2"}}
		if err := client.NewRef("sites").Set(ctx, site); err != nil {
			log.Fatal(err)
		}
		resp := Site{}
		if err := client.NewRef("sites").Get(ctx, &resp); err != nil {
			log.Fatal(err)
		}
		fmt.Println(resp.Name)
	},
}

func init() {

}
func main() {
	rootCmd := &cobra.Command{
		Use:   "maslow",
		Short: "a web traffic shaper",
		Long:  "Think of all the wonderful things you will be able to do with your time",
	}
	rootCmd.AddCommand(addsite)

	rootCmd.Execute()
}

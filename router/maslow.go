package main

import (
	firebase "firebase.google.com/go"
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

func main() {

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

	site := Site{"Netflix", []string{"siteregex1", "siteregex2"}}
	if err := client.NewRef("sites").Set(ctx, site); err != nil {
		log.Fatal(err)
	}
	resp := Site{}
	if err := client.NewRef("sites").Get(ctx, &resp); err != nil {
		log.Fatal(err)
	}
	fmt.Println(resp.Name)
}

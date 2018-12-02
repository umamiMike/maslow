package main

import (
	firebase "firebase.google.com/go"
	"fmt"
	"golang.org/x/net/context"
	"google.golang.org/api/option"
	"log"
	//"firebase.google.com/go/auth"
	//"fmt"
)

var config = &firebase.Config{
	DatabaseURL: "https://maslow-test.firebaseio.com",
}

func makeConnectionAndAddSite(d map[string]interface{}) string {
	ctx := context.Background()
	opt := option.WithCredentialsFile("../secrets/maslow-test-firebase-adminsdk-dhcpw-61989a0f5b.json")
	app, err := firebase.NewApp(ctx, config, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}
	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Close()
	//trying to read the docref etc...
	docref, _, err = client.Collection("users").Add(ctx, d)
	if err != nil {
		log.Fatal(err)
		return "failure"
	}
	fmt.Println(&docref)
	return "success"
}

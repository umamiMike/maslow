package main

import (
	"log"

	firebase "firebase.google.com/go"
	"golang.org/x/net/context"
	"google.golang.org/api/option"
)

var config = &firebase.Config{}

func (h *Host) add(collection_name string) error {
	ctx := context.Background()
	opt := option.WithCredentialsFile("./secrets/maslow-2de90-firebase-adminsdk-10ing-d37ed58f69.json")
	app, err := firebase.NewApp(ctx, config, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
		return err
	}
	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatal(err)
		return err
	}
	defer client.Close()
	//trying to read the docref etc...
	if err != nil {
		log.Fatal("Could not marshal struct to JSON")
		return err
	}
	_, err = client.Collection(collection_name).Doc(h.mac).Set(ctx, h)
	if err != nil {
		log.Fatal(err)
		return err
	}
	return nil
}

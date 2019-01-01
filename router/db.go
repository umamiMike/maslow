package main

import (
	"log"
	"os"

	firebase "firebase.google.com/go"
	"golang.org/x/net/context"
	"google.golang.org/api/option"
)

var config = &firebase.Config{}

func (h *host) add(collectionName string) error {
	ctx := context.Background()
	opt := option.WithCredentialsFile(os.Getenv("SECRET_FILE"))
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
	_, err = client.Collection(collectionName).Doc(h.Mac).Set(ctx, map[string]interface{}{

		"ip":   h.IP,
		"mac":  h.Mac,
		"name": h.Name,
	})
	if err != nil {
		log.Fatal(err)
		return err
	}
	return nil
}

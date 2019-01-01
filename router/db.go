package main

import (
	"fmt"
	"log"
	"os"

	firebase "firebase.google.com/go"
	"golang.org/x/net/context"
	"google.golang.org/api/iterator"
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

	_, err = client.Collection(collectionName).Doc(h.Mac).Set(ctx, map[string]interface{}{

		//deliberately not uploading ip addresses of host
		"mac":  h.Mac,
		"name": h.Name,
	})
	if err != nil {
		log.Fatal(err)
		return err
	}
	return nil
}

type devicePolicy struct {
	Mac     string
	Regexes []string
}

type devicePolicyList []devicePolicy

func (dpl *devicePolicyList) get() error {
	//TODO: move out to own function
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
	iter := client.Collection("devices").Documents(ctx)
	defer iter.Stop()
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			// TODO: Handle error.
		}
		fmt.Println(doc.Data())
	}

	return nil
}

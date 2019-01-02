package main

import (
	"fmt"
	"log"
	"os"
	"reflect"

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

type devicePolicyMap map[string][]string

func getDevicePolicies() (devicePolicyMap, error) {
	output := make(map[string][]string)
	//TODO: move out to own function
	ctx := context.Background()
	opt := option.WithCredentialsFile(os.Getenv("SECRET_FILE"))
	app, err := firebase.NewApp(ctx, config, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
		return nil, err
	}
	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	defer client.Close()
	iter := client.Collection("devices").Documents(ctx)
	defer iter.Stop()
	for {
		deviceDoc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			// TODO: Handle error.
		}
		data := deviceDoc.Data()
		defaultPolicyID := data["defaultPolicyId"]
		macAddress := fmt.Sprint(data["mac"])

		if defaultPolicyID != nil {
			defaultPolicyPath := "policies/" + fmt.Sprint(data["defaultPolicyId"])
			policy, err := client.Doc(defaultPolicyPath).Get(ctx)
			if err != nil {
				log.Fatal("could not find policy...")
				break
			}
			siteIDs := convertToSlice(policy.Data()["siteIds"])
			for _, siteID := range siteIDs {
				siteIDPath := "sites/" + fmt.Sprint(siteID)
				site, err := client.Doc(siteIDPath).Get(ctx)
				if err != nil {
					log.Fatal("could not find site...")
					break
				}
				output[macAddress] = append(output[macAddress], convertToSlice(site.Data()["addresses"])...)
			}
		}
	}
	return output, nil
}

func convertToSlice(t interface{}) []string {
	switch reflect.TypeOf(t).Kind() {
	case reflect.Slice:
		s := reflect.ValueOf(t)

		output := make([]string, 0, s.Len())
		for i := 0; i < s.Len(); i++ {
			siteID := s.Index(i)
			output = append(output, fmt.Sprint(siteID))
		}
		return output
	}
	return nil
}

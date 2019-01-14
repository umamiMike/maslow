package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	firestore "cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"golang.org/x/net/context"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

var config = &firebase.Config{}
var open = "__open__"

func (h *host) add(collectionName string) error {
	ctx := context.Background()
	opt := option.WithCredentialsFile(os.Getenv("SECRET_FILE"))
	app, err := firebase.NewApp(ctx, config, opt)
	if err != nil {
		log.Fatal("error initializing app:", err)
		return err
	}
	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatal(err)
		return err
	}
	defer client.Close()

	_, err = client.Collection(collectionName).Doc(h.Mac).Get(ctx)
	if err != nil {
		_, err = client.Collection(collectionName).Doc(h.Mac).Set(ctx, map[string]interface{}{
			//deliberately not uploading ip addresses of host
			"mac":  h.Mac,
			"name": h.Name,
		})
		if err != nil {
			log.Fatalf("unable to create %v in firestore: %v", h.Name, err)
		}
		return err
	}

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
		policyID := getPolicyID(ctx, deviceDoc, client)
		data := deviceDoc.Data()
		macAddress := fmt.Sprint(data["mac"])

		if policyID != "" {
			policyPath := "policies/" + fmt.Sprint(policyID)
			policy, err := client.Doc(policyPath).Get(ctx)
			if err != nil {
				log.Fatal("could not find policy...")
				break
			}
			if policy.Data()["name"] == open {
				output[macAddress] = append(output[macAddress], "*")
				continue
			}
			siteIDs := convertToSlice(policy.Data()["siteIds"])
			for _, siteID := range siteIDs {
				siteIDPath := "sites/" + fmt.Sprint(siteID)
				site, err := client.Doc(siteIDPath).Get(ctx)
				if err != nil {
					log.Fatal("could not find site...")
					break
				}
				newAddresses := convertToSlice(site.Data()["addresses"])
				output[macAddress] = append(output[macAddress], newAddresses...)
			}
		}
	}
	return output, nil
}

// if there is a temporaryPolicy
// policyID should equal the temporary policyID instead
func getPolicyID(ctx context.Context, deviceDoc *firestore.DocumentSnapshot, client *firestore.Client) string {
	data := deviceDoc.Data()
	policyID := ""
	if data["defaultPolicyId"] != nil {
		policyID = fmt.Sprint(data["defaultPolicyId"])
	}

	temporaryPolicyCollection := client.Collection("temporaryPolicies")
	deviceID := getIDFromDoc(deviceDoc)
	tpi := temporaryPolicyCollection.Where("deviceId", "==", deviceID).Documents(ctx)
	defer tpi.Stop()

	for {
		temporaryPolicyDoc, err := tpi.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			fmt.Println("Error reading data", err)
		}
		duration, err := strconv.Atoi(fmt.Sprint(temporaryPolicyDoc.Data()["duration"]))
		if err != nil {
			fmt.Println("duration TIME ERROR", err)
			continue
		}

		s := fmt.Sprint(temporaryPolicyDoc.Data()["startTime"])
		startTime, err := time.Parse("2006-01-02 15:04:05.999 -0700 MST", s)
		if err != nil {
			fmt.Println("start TIME ERROR", err)
		}

		endTime := startTime.Add(time.Duration(duration) * time.Second)
		fmt.Println("endTime", endTime, "startTime", startTime)
		if endTime.After(time.Now()) {
			policyID = fmt.Sprint(temporaryPolicyDoc.Data()["policyId"])
			fmt.Println("Override policy found:", policyID)
		}
	}
	return policyID
}

func getIDFromDoc(doc *firestore.DocumentSnapshot) string {
	pathHunks := strings.Split(fmt.Sprintf(doc.Ref.Path), "/")
	docID := pathHunks[len(pathHunks)-1]
	return docID
}

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

// DevicePolicyData is all data associated with a given device
type DevicePolicyData struct {
	DefaultPolicyID   string
	TemporaryPolicyID string
	EndTime           time.Time
	Name              string
}

// PolicyData is all server data associated with a policy
type PolicyData struct {
	Name  string
	Sites []string
}

// SiteData is all server data associated with a server
type SiteData struct {
	Name      string
	RegexList []string
}

// ServerData provides policy and site information to the system
type ServerData struct {
	Devices  map[string]DevicePolicyData // {0a:22:21:af:09:33: {DefaultPolicyId: 'messaging', TemporaryPolicyId: '__open__', timeout: 282871712}}
	Policies map[string]PolicyData       // {sdfkjasfh89212he182: {name: "messaging", sites: [whatsapp, hangouts, imessage]}
	Sites    map[string]SiteData         // {sfudfuaues881: {name: whatsapp, "regexList": ['www\.whatsapp\.com', 'wa-static\d.whatsapp\.com...]}
}

// NEW
func getServerData() (ServerData, error) {
	//TODO: move out to own function ---------------------
	ctx := context.Background()
	opt := option.WithCredentialsFile(os.Getenv("SECRET_FILE"))
	app, err := firebase.NewApp(ctx, config, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
		return ServerData{}, err
	}
	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatal(err)
		return ServerData{}, err
	}
	defer client.Close()
	//TODO: move out to own function ---------------------

	devices := make(map[string]DevicePolicyData)
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
		devicePolicyData := getDevicePolicyData(ctx, deviceDoc, client)
		deviceData := deviceDoc.Data()
		macAddress := fmt.Sprint(deviceData["mac"])
		devices[macAddress] = devicePolicyData
	}

	policies := make(map[string]PolicyData)
	iter = client.Collection("policies").Documents(ctx)
	defer iter.Stop()
	for {
		policyDoc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			// TODO: Handle error.
		}
		policyData := policyDoc.Data()
		policyID := getIDFromDoc(policyDoc)
		if policyData["name"] == open {
			policies[policyID] = PolicyData{Name: open, Sites: nil}
			continue
		}
		siteIDs := convertToSlice(policyData["siteIds"])
		policies[policyID] = PolicyData{Name: fmt.Sprint(policyData["name"]), Sites: siteIDs}
	}

	sites := make(map[string]SiteData)
	iter = client.Collection("sites").Documents(ctx)
	defer iter.Stop()
	for {
		siteDoc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			// TODO: Handle error.
		}
		siteID := getIDFromDoc(siteDoc)
		siteData := siteDoc.Data()
		newAddresses := convertToSlice(siteData["addresses"])
		sites[siteID] = SiteData{Name: fmt.Sprint(siteData["name"]), RegexList: newAddresses}
	}
	return ServerData{Sites: sites, Devices: devices, Policies: policies}, nil
}

// Fetch the policy information for a specific device, examining endtime of temporaryPolicies
func getDevicePolicyData(ctx context.Context, deviceDoc *firestore.DocumentSnapshot, client *firestore.Client) DevicePolicyData {
	deviceData := deviceDoc.Data()
	output := DevicePolicyData{DefaultPolicyID: "", TemporaryPolicyID: "", EndTime: time.Time{}, Name: ""}
	if deviceData["defaultPolicyId"] != nil {
		output.DefaultPolicyID = fmt.Sprint(deviceData["defaultPolicyId"])
	}
	output.Name = fmt.Sprint(deviceData["name"])

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
			fmt.Println("Error reading deviceData", err)
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
		if endTime.After(time.Now()) {
			output.TemporaryPolicyID = fmt.Sprint(temporaryPolicyDoc.Data()["policyId"])
			output.EndTime = endTime
		}
	}
	return output
}

func getIDFromDoc(doc *firestore.DocumentSnapshot) string {
	pathHunks := strings.Split(fmt.Sprintf(doc.Ref.Path), "/")
	docID := pathHunks[len(pathHunks)-1]
	return docID
}

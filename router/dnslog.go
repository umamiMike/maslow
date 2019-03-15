package main

import (
	"bufio"
	"errors"
	"fmt"
	"log"

	"os"
	"regexp"
	"strings"

	"github.com/hpcloud/tail"
)

// DNSMap is a thing that keeps track of name-> ip mapping
type DNSMap map[string]map[string]bool

func parseLog(s string) (string, string, error) {
	splitstr := strings.Split(s, ": ")

	if len(splitstr) != 2 {
		return "", "", errors.New("Unreadable line")
	}

	dataStr := splitstr[1]
	splitStr2 := strings.Split(dataStr, " ")
	if splitStr2[0] != "reply" {
		return "", "", nil
	}

	// TODO: Deal properly with CNAMEs?
	if splitStr2[3] == "<CNAME>" {
		return "", "", nil
	}

	name := strings.Replace(splitStr2[1], "\"", "", -1)
	iPAddress := splitStr2[3]
	r, _ := regexp.Compile("\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}")
	if r.MatchString(iPAddress) {
		return name, iPAddress, nil
	}
	return "", "", nil
}

func readAndParseDNS(filename string) (DNSMap, error) {
	g, err := os.Open(filename)
	if err != nil {
		fmt.Printf("error opening file: %v\n", err)
		return nil, err
	}

	s := bufio.NewScanner(g)
	output := make(DNSMap)
	for s.Scan() {
		logLine := s.Text()
		key, value, err := parseLog(logLine)
		if err == nil {
			if key != "" {
				_, ok := output[key]
				if !ok {
					output[key] = make(map[string]bool)
				}
				output[key][value] = true
			}
		}
	}
	g.Close()
	return output, nil
}

func tailAndParseDNS(leaseDict LeaseDict, serverData ServerData, dnsMap DNSMap, filename string) {
	t, err := tail.TailFile(filename, tail.Config{Follow: true, Location: &tail.SeekInfo{Offset: 0, Whence: os.SEEK_END}})
	siteCommands := generateSiteChains(serverData, dnsMap)
	siteCommandLength := len(siteCommands)
	log.Println("siteCommands", siteCommandLength)
	if err != nil {
		log.Fatalf("Cannot access log file %s\n", filename)
	}

	for line := range t.Lines {
		key, value, err := parseLog(line.Text)
		if err != nil {
			continue
		}
		if key != "" {
			_, ok := dnsMap[key]
			if !ok {
				dnsMap[key] = make(map[string]bool)
			}
			_, ok = dnsMap[key][value]
			if !ok {
				// TODO: Debounce
				log.Printf("Adding value for %s: %s\n", key, value)
				dnsMap[key][value] = true
				siteCommands = generateSiteChains(serverData, dnsMap)
				if len(siteCommands) != siteCommandLength {
					siteCommandLength = len(siteCommands)
					log.Println("added command siteCommands", siteCommandLength)
					implementIPTablesRules(leaseDict, serverData, dnsMap)
				}
			}
		}
	}
}

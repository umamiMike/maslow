package main

import (
	"bufio"
	"errors"
	"fmt"
	"os"
	"strings"
)

type host struct {
	Name string
	Mac  string
	IP   string
}

func parseMasq(s string) (host, error) {

	splitstr := strings.Split(s, " ")
	if len(splitstr) != 5 {
		return host{}, errors.New("whoops")
	}
	output := host{splitstr[3], splitstr[1], splitstr[2]}
	return output, nil
}

// LeaseDict provides a mapping of mac to host values
type LeaseDict map[string]host

func readAndParseLeases(filename string) (LeaseDict, error) {
	output := make(map[string]host)
	q, err := os.Open(filename)
	if err != nil {
		fmt.Printf("error opening file: %v\n", err)
		return nil, err
	}
	leasefile := bufio.NewScanner(q)
	for leasefile.Scan() {
		host, err := parseMasq(leasefile.Text())
		if err != nil {
			fmt.Printf("error parsing leaselines: %v\n", leasefile.Text())
			continue
		}
		output[host.Mac] = host
	}
	q.Close()
	return output, nil
}

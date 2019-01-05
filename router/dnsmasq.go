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
	fmt.Println("inside parseMasq")
	splitstr := strings.Split(s, " ")
	if len(splitstr) != 5 {
		return host{}, errors.New("whoops")
	}
	output := host{splitstr[3], splitstr[1], splitstr[2]}
	return output, nil
}
func readAndParseLeases(filename string) (map[string]host, error) {
	fmt.Println("about tot read and Parse Leases")
	output := make(map[string]host)
	f, err := os.Open(filename)
	if err != nil {
		fmt.Printf("error opening file: %v\n", err)
		return nil, err
	}
	r := bufio.NewReader(f)
	leaseLine, e := readLn(r)
	for e == nil {
		host, err := parseMasq(leaseLine)
		if err != nil {
			fmt.Printf("error parsing leaselines: %v\n", leaseLine)
			continue
		}
		output[host.Mac] = host
		leaseLine, e = readLn(r)
	}
	return output, nil
}

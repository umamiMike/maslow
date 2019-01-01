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

func readLn(r *bufio.Reader) (string, error) {
	var (
		isPrefix = true
		err      error
		line, ln []byte
	)
	for isPrefix && err == nil {
		line, isPrefix, err = r.ReadLine()
		ln = append(ln, line...)
	}
	if err != nil {
		return "", err
	}
	return string(ln), nil
}

func parseMasq(s string) (host, error) {
	splitstr := strings.Split(s, " ")
	if len(splitstr) != 5 {
		return host{}, errors.New("whoops")
	}
	output := host{splitstr[3], splitstr[1], splitstr[2]}
	return output, nil
}

func readAndParseLeases(filename string) {
	// Read the contents of dnsmasq.leases
	f, err := os.Open(filename)
	if err != nil {
		fmt.Printf("error opening file: %v\n", err)
		os.Exit(1)
	}
	r := bufio.NewReader(f)
	leaseLine, e := readLn(r)
	for e == nil {
		host, err := parseMasq(leaseLine)
		if err != nil {
			fmt.Printf("error parsing leaselines: %v\n", leaseLine)
			os.Exit(1)
		}
		host.add("devices")
		fmt.Println(host.Name)
		leaseLine, e = readLn(r)
	}
}

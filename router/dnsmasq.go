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

func readln(r *bufio.Reader) (host, error) {
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
		return host{}, err
	}
	return parseMasq(string(ln))
}

func parseMasq(s string) (host, error) {
	splitstr := strings.Split(s, " ")
	if len(splitstr) != 5 {
		return host{}, errors.New("whoops")
	}
	output := host{splitstr[3], splitstr[1], splitstr[2]}
	return output, nil
}

func readAndParse(filename string) {
	// Read the contents of dnsmasq.leases
	f, err := os.Open(filename)
	if err != nil {
		fmt.Printf("error opening file: %v\n", err)
		os.Exit(1)
	}
	r := bufio.NewReader(f)
	host, e := readln(r)
	for e == nil {
		host.add("devices")
		fmt.Println(host.Name)
		host, e = readln(r)
	}
}

package main

import (
	"bufio"
	"errors"
	"fmt"
	"os"
	"strings"
)

type Host struct {
	name string `json: "name"`
	mac  string `json: "mac"`
	Ip   string `json: "ip"`
}

func readln(r *bufio.Reader) (Host, error) {
	var (
		isPrefix bool  = true
		err      error = nil
		line, ln []byte
	)
	for isPrefix && err == nil {
		line, isPrefix, err = r.ReadLine()
		ln = append(ln, line...)
	}
	if err != nil {
		return Host{}, err
	}
	return parseMasq(string(ln))
}

func parseMasq(s string) (Host, error) {
	splitstr := strings.Split(s, " ")
	if len(splitstr) != 5 {
		return Host{}, errors.New("whoops")
	}
	output := Host{splitstr[3], splitstr[1], splitstr[2]}
	return output, nil
}

func ReadAndParse(filename string) {
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
		fmt.Println(host.name)
		host, e = readln(r)
	}
}

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
	return name, iPAddress, nil
}

func readAndParseDNS(filename string) (map[string][]string, error) {
	f, err := os.Open(filename)
	if err != nil {
		fmt.Printf("error opening file: %v\n", err)
		return nil, err
	}
	r := bufio.NewReader(f)
	output := make(map[string][]string)

	logLine, e := readLn(r)
	for e == nil {
		key, value, err := parseLog(logLine)
		if err == nil {
			if key != "" {
				output[key] = append(output[key], value)
			}
		}
		logLine, e = readLn(r)
	}
	return output, nil
}

func readAndParseLeases(filename string) (map[string]host, error) {
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

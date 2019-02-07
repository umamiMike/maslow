package main

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

var line1 = `Dec 31 16:01:44 dnsmasq[1301]: reading /tmp/resolv.dnsmasq `
var line2 = `Dec 31 16:01:45 dnsmasq[1301]: reply 2.pool.ntp.org is 45.127.112.2`
var mockLog = "../test/logs/dnsmasq.log"

//testing parseLog used in the readAndParseDns fn
func TestParseLog(t *testing.T) {

	key, val, err := parseLog(line1)
	if err != nil {
		t.Errorf("key or val should be empty")
	}
	if key != "" {
		t.Errorf("key should be dns entry")
	}

	if val != "" {
		t.Errorf("val should be an ip address")
	}

	//returns correctly formatted data
}

func TestLine2(t *testing.T) {

	key, val, err := parseLog(line2)
	if err != nil {
		t.Errorf("key and val should be should dns , and val should be ip")
	}

	if key != "2.pool.ntp.org" {
		t.Errorf("key should be dns entry")
	}

	if val != "45.127.112.2" {
		t.Errorf("val should be an ip address")
	}
}

func TestReadAndParseDNS(t *testing.T) {
	//make a file in the file system (remember to remove it)
	nonexistantfile := "nonexistant"
	_, err := readAndParseDNS(nonexistantfile)
	if err != nil {
		expected := fmt.Sprintf("open %v: no such file or directory", nonexistantfile)
		//t.Errorf("%v", err)
		assert.Equal(t, expected, err.Error(), "the error message is not correct")
	}
}

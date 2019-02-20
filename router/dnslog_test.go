package main

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

var mockLog = "../test/logs/dnsmasq.log"

//testing parseLog used in the readAndParseDns fn
func TestParseLog(t *testing.T) {

	mocklinefromfile := `Dec 31 16:01:44 dnsmasq[1301]: reading /tmp/resolv.dnsmasq `
	key, val, err := parseLog(mocklinefromfile)
	fmt.Printf("the val of key is: %v", key)

	//fmt.Printf("%v %v %v \n ", key, val, err)
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

//parseLog

// will return unreadable line if  no colon in line
// will return 2 blank strings if  reply
// will return 2 blank strings if CNAME
//parseLog  will  ruturn string string, err
//test
func TestParseLog2(t *testing.T) {
	unreadable := `I have no colon, so I am not logged line`
	_, _, err := parseLog(unreadable)
	assert.Error(t, err, "the line should not be readable")

	//edge case of reply
	line := `Dec 31 16:01:45 dnsmasq[1301]: reply 2.pool.ntp.org is 45.127.112.2`

	key, val, err := parseLog(line)

	assert.Nil(t, err, "if reply exists ip")
	assert.Equal(t, key, "", "key is blank")
	assert.Equal(t, val, "", "key is blank")
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
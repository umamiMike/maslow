package main

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"testing"
)

var mockLog = "../test/logs/dnsmasq.log"

func TestReadAndParseDNSNoFile(t *testing.T) {
	//make a file in the file system (remember to remove it)
	nonexistantfile := "nonexistant"
	_, err := readAndParseDNS(nonexistantfile)
	if err != nil {
		expected := fmt.Sprintf("open %v: no such file or directory", nonexistantfile)
		//t.Errorf("%v", err)
		assert.Equal(t, expected, err.Error(), "the error message is not correct")
	}
}

//testing parseLog used in the readAndParseDns fn
func TestParseLog(t *testing.T) {

	mocklinefromfile := `Dec 31 16:01:44 dnsmasq[1301]: reading /tmp/resolv.dnsmasq `
	key, val, err := parseLog(mocklinefromfile)
	fmt.Printf("the val of key is: %v", key)

	assert.Nil(t, err, "there should be no error")
	assert.Empty(t, key, "the key should be empty")
	assert.Empty(t, val, "the val should be empty")
}

func TestParseLogBadLine(t *testing.T) {
	badline := `I have no colon, so I am not logged line`
	_, _, err := parseLog(badline)
	assert.Error(t, err, "the line should not be readable")
}

func TestParseLogReply(t *testing.T) {
	//edge case of reply
	line := `Dec 31 16:01:45 dnsmasq[1301]: reply 2.pool.ntp.org is 45.127.112.2`

	key, val, err := parseLog(line)

	assert.Nil(t, err, "if reply exists")
	assert.Equal(t, key, "2.pool.ntp.org", "key is a dns site")
	assert.Equal(t, val, "45.127.112.2", "val is an ip")
}

package main

import "fmt"

type managed_device struct {
	Name             string   `json: "name"`
	Mac_address      string   `json: "mac_address"`
	Default_policies []policy `json: "default_policies"`
	Id               int      `json: "id"`
}

func (m *managed_device) addPolicy() err {

}

type policy struct {
	Name string
}

type site struct {
	Name          string
	Servers_regex []string
}

func main() {
}

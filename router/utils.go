package main

import (
	"fmt"
	"reflect"
	"strings"
)

func convertToSlice(t interface{}) []string {
	switch reflect.TypeOf(t).Kind() {
	case reflect.Slice:
		s := reflect.ValueOf(t)

		output := make([]string, 0, s.Len())
		for i := 0; i < s.Len(); i++ {
			value := strings.Replace(fmt.Sprint(s.Index(i)), "\"", "", -1)
			output = append(output, value)
		}
		return output
	}
	return nil
}

/*
func convertSetToSlice(input map[string]bool) []string {
	output := []string
	for key, value := range input {
		fmt.Println(key, value)
		output = output.append(value)
	}
	return output
}
*/

.PHONY: check-env

BINNAME=router_service
EXTLDFLAGS=-static
LDFLAGS=-linkmode external -extldflags "$(EXTLDFLAGS)"


build-dev:
	go build -o ./builds/dev
build-wrt:
	#CGO_ENABLED=1 GOOS=linux GOARCH=arm GOARM=5 CC=$(CC) go build --ldflags='$(LDFLAGS)' -o ./builds/$(BINNAME) 
	GOOS=linux GOARCH=mips go build  -o ./builds/$(BINNAME) 
deploy-wrt: build-wrt
	bash ../secrets/env.sh
	scp ./builds/$(BINNAME)  $$ROUTER:~/
clean:
	rm -rf ./builds/*

.PHONY: check-env

BINNAME=router_service
EXTLDFLAGS=-static
LDFLAGS=-linkmode external -extldflags "$(EXTLDFLAGS)"

build-dev: 
	@rm -f ./builds/dev
	go build -o ./builds/dev
build-wrt:
	CGO_ENABLED=0 GOOS=linux GOARCH=arm GOARM=5 CC=$(CC) go build  -tags netgo -a -v  -o ./builds/$(BINNAME) 
deploy-wrt: build-wrt
	@bash ../secrets/env.sh
	@cat ../secrets/env.sh
	@echo $$ROUTER
	@scp ./builds/$(BINNAME)  $$ROUTER:~/
clean: 
	@echo removing build directory
	@rm -rf ./builds/

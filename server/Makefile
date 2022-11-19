AWS_ACCOUNT_ID=072085314121
REGISTRY=$(AWS_ACCOUNT_ID).dkr.ecr.eu-central-1.amazonaws.com
BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
export VERSION=$(shell git rev-parse --short=7 HEAD)
VERBOSE?=
PROJECT=server
REPOSITORY=meirim/$(PROJECT)
DOCKER_BUILD_ARGS=--pull
DOCKERFILE=Dockerfile.$(PROJECT)

.PHONY: all
all: build

.PHONY: clean
clean:
	@rm -rf node_modules

.PHONY: login
login:
	@`aws ecr get-login --region eu-central-1 --no-include-email --registry-ids $(AWS_ACCOUNT_ID)`

.PHONY: verify_clean
verify_clean:
	@git diff-index --quiet HEAD || (echo "git repo must be clean!" && exit 1)

.PHONY: build
build: login
	@docker build $(DOCKER_BUILD_ARGS) -t $(REPOSITORY):$(VERSION) -f $(DOCKERFILE) .
	@docker tag $(REPOSITORY):$(VERSION) $(REPOSITORY):latest
	@docker tag $(REPOSITORY):$(VERSION) $(REGISTRY)/$(REPOSITORY):latest
	@docker tag $(REPOSITORY):$(VERSION) $(REGISTRY)/$(REPOSITORY):$(VERSION)
	@docker tag $(REPOSITORY):$(VERSION) $(REGISTRY)/$(REPOSITORY):$(BRANCH)

.PHONY: submit
submit: verify_clean
	@docker push $(REGISTRY)/$(REPOSITORY):latest
	@docker push $(REGISTRY)/$(REPOSITORY):$(VERSION)
	@docker push $(REGISTRY)/$(REPOSITORY):$(BRANCH)

.PHONY: run
run:
	@docker run --rm -it -p 8080:8080 --name server $(REPOSITORY):latest

.PHONY: exec
exec:
	@docker exec -it server /bin/bash


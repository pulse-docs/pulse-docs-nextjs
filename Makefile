# Ensure current directory is PulseDocs
.PHONY: check-directory
check-directory:
	@if [ "$(CURDIR)" != "$(HOME)/Projects/PulseDocs" ]; then \
		echo "Please navigate to the PulseDocs root directory"; \
		exit 1; \
	fi


# Generate the proto files
generate-proto-auth:check-directory
	@echo "Generating proto files for auth service"
	protoc --proto_path=backend/rpc/auth/pb --go_out=. --twirp_out=. backend/rpc/auth/pb/service-auth.proto

# Execute all tests
test:check-directory
	@echo "Running tests"
	cd backend && \
	go test -v ./... \
	&& cd ..


# Build/Push
ecr-login:
	@echo "Logging into ECR"
	aws ecr get-login-password --region us-east-1 --profile pulse-docs | docker login --username AWS --password-stdin 764201992552.dkr.ecr.us-east-1.amazonaws.com

build-app: ecr-login
	@echo "Building app"
	docker build --platform linux/amd64 -t pulse-docs-app -f dockerfiles/service.app.dockerfile .
	docker tag pulse-docs-app:latest 764201992552.dkr.ecr.us-east-1.amazonaws.com/pulse-docs-app:latest
	docker push 764201992552.dkr.ecr.us-east-1.amazonaws.com/pulse-docs-app:latest
	# Capture the cli argument and use as version
	@sh -c 'if [ ! -z "$(version)" ]; then \
		docker tag pulse-docs-app:latest 764201992552.dkr.ecr.us-east-1.amazonaws.com/pulse-docs-app:$(version) && \
		docker push 764201992552.dkr.ecr.us-east-1.amazonaws.com/pulse-docs-app:$(version); \
	fi'

build-nginx: ecr-login
	@echo "Building nginx"
	docker build --platform linux/amd64 -t pulse-docs-nginx -f dockerfiles/service.nginx.dockerfile .
	docker tag pulse-docs-nginx:latest 764201992552.dkr.ecr.us-east-1.amazonaws.com/nginx:latest
	docker push 764201992552.dkr.ecr.us-east-1.amazonaws.com/nginx:latest
	@sh -c 'if [ ! -z "$(version)" ]; then \
		docker tag pulse-docs-nginx:latest 764201992552.dkr.ecr.us-east-1.amazonaws.com/nginx:$(version) && \
		docker push 764201992552.dkr.ecr.us-east-1.amazonaws.com/nginx:$(version); \
	fi'

build-local-app: ecr-login
	@echo "Building app"
	docker build -t pulse-docs-app -f dockerfiles/service.app.dockerfile .
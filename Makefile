all: help

help:
	@echo ""
	@echo "-- Help Menu"
	@echo ""
	@echo "   1. make run                - Start Container Use default setting (listen web on 8080 , ssh on 8022)"


run:
	# npx -p npm-check-updates  -c "ncu"
	@ npx -p npm-check-updates  -c "ncu -u"
	@ npm i

clean:
	docker rm -f $(docker ps -q -a)
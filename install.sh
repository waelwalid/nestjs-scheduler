#!/bin/bash
# set -x
# set -e

GREEN="\033[32m"
NC='\033[0m' # No Color

GIT_URL="git@github.com:waelwalid"
PATH_CURRENT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# MYSQL configurations
database_local_schemas=("scheduler")

necessary_application=("mysqldb node18")

function install_dependencies() {
    # http://www.figlet.org/
    # https://en.wikipedia.org/wiki/Cowsay
    # https://boxes.thomasjensen.com/
    sudo apt install -y golang boxes curl
    sudo snap install kubectl --classic

    # Hosts Manager Go Cli
    go install github.com/cbednarski/hostess@latest
}

function update_hosts() {
    local dockercomposefile
    local "${@}"
    if [ -z $dockercomposefile ]; then
        dockercomposefile="./docker-compose.yml"
    fi
    echo "$dockercomposefile"

    #Extract domain and ip from docker compose file
    ip=""
    domainsite="no"
    while IFS= read -r line; do
        if [[ $line == *"ipv4_address:"* ]]; then
            ip="${line/ipv4_address:/}"
            ip="${ip//' '/}"
            continue
        fi
        if [[ $line == *"aliases:"* ]]; then
            domainsite="yes"
            continue
        fi
        if [[ $domainsite == "yes" ]]; then
            if [[ $line == *".local"* ]]; then
                domain="${line//' - '/}"
                domain="${domain//' '/}"
                if [ "${domain:0:1}" != '#' ]; then
                    sudo $HOME/go/bin/hostess add $domain $ip
                else
                    echo "Ignoring line: $line"
                fi
            else
                domainsite="no"
            fi
        fi
    done <"$dockercomposefile"
}


function build() {
        for APPDATA in "${necessary_application[@]}"; do
            echo -e "${GREEN}Build DockerImages${NC} $APPDATA"
            docker-compose build --compress --force-rm $APPDATA
            docker-compose up -d $APPDATA
        done

}

#Moved to docker-compose entry point


# function create_databases() {
#     docker-compose up  mysqldb
#     while :; do
#         docker exec -i mysqldb mysql -uroot -proot  <<< "ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'root'; FLUSH PRIVILEGES; SELECT user,authentication_string,plugin,host FROM mysql.user;"
#         CBCLUSTERVERIFY_DATABASE=$(echo $?)
#         echo "Waiting service into database is up. Last return: $CBCLUSTERVERIFY_DATABASE. Expected: 0"
#         if [ "$CBCLUSTERVERIFY_DATABASE" == '0' ]; then
#             QUERY_CREATE_DATABASE=""
#             for SCHEMA in "${database_local_schemas[@]}"; do
#                 QUERY_CREATE_DATABASE+="CREATE DATABASE IF NOT EXISTS ${SCHEMA}; "
#             done
#             echo -e "${GREEN}Create databases${NC} \n ${QUERY_CREATE_DATABASE}"
#             docker exec mysql_database mysql --user=root --password=root -e "${QUERY_CREATE_DATABASE}" 2>/dev/null
#             break
#         fi
#         sleep 5
#     done
# }

function up_dev() {
        
        sleep 3
        docker-compose up
}

if [ -z $@ ]; then
    install_dependencies
    update_hosts
    build
    # create_databases
    up_dev
fi


$@

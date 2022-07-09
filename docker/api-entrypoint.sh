#!/bin/sh -e

work_dir="/home/node/saapie/api"
h_spacer="========="
e_spacer=":::::::::"
red='\033[0;31m'
green='\033[0;32m'
white='\033[0;37m'
reset='\033[0m'

yarn_install() {
    cd ${work_dir}

    echo "\n${white}${h_spacer} Installing yarn dependencies ${h_spacer}${reset}\n"
    yarn install
    if [ $? -ne 0 ]; then
        echo "\n${red}${e_spacer} Error installing yarn dependencies ${e_spacer}${reset}\n"
        exit 1
    fi
}

db_setup() {
    cd ${work_dir}

    echo "\n${white}${h_spacer} Applying database migrations ${h_spacer}${reset}\n"
    yarn prisma migrate dev
    if [ $? -ne 0 ]; then
        echo "\n${red}${e_spacer} Error while applying migrations to database ${e_spacer}${reset}\n"
        exit 1
    fi

    echo "\n${green}${h_spacer} Migrations applied ${h_spacer}${reset}\n"
}

create_administrator() {
    cd ${work_dir}

    echo "\n${white}${h_spacer} Creating administrator ${h_spacer}${reset}\n"
    yarn ts-node src/commands/createAdministrator.ts
    if [ $? -ne 0 ]; then
        echo "\n${red}${e_spacer} Error creating administrator ${e_spacer}${reset}\n"
        exit 1
    fi

    echo "\n${green}${h_spacer} Administrator created ${h_spacer}${reset}\n"
}

case $1 in

setup)
    yarn_install
    db_setup
    create_administrator
    ;;

development)
    exec yarn dev
    ;;

*)
    exec "$@"
    ;;

esac

exit 0
